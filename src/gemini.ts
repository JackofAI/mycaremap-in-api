import { GoogleGenAI } from '@google/genai';
import { UserCareState } from './types/careMap';

export interface AskCareMapResponse {
  answer: string;
  sourceCitations?: string[];
  suggestedFollowups?: string[];
  isAiGenerated: boolean;
  modelUsed?: string;
  clinicalDisclaimer: string;
}

const CLINICAL_DISCLAIMER =
  'Notice: MyCareMap is a personal care coordinator and administrative memory tool. It organizes your recorded health information and commitments, but does not provide medical diagnoses, treatment advice, or emergency triage.';

export async function askCareMap(
  query: string,
  state: UserCareState
): Promise<AskCareMapResponse> {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return {
      answer: 'Please enter a question about your care timeline, doctors, or commitments.',
      isAiGenerated: false,
      clinicalDisclaimer: CLINICAL_DISCLAIMER
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const activeMember = state.familyMembers?.find(m => m.id === state.activeFamilyMemberId);
      const personName = activeMember?.name || state.profile.name;
      const personAge = activeMember?.age || state.profile.age;
      const personCity = activeMember?.city || state.profile.city;

      const systemPrompt = `You are "Ask MyCareMap", an intelligent personal care coordinator assistant for ${personName} (${personAge} yrs old, ${personCity}).
Your role is to help the person and their family stay on top of their care by answering questions based strictly on the provided stored Care Map data.

STRICT CLINICAL & SAFETY GUARDRAILS:
1. You are a personal care coordinator, NOT a medical doctor.
2. NEVER diagnose illnesses, interpret laboratory values as positive/negative/pathological without explicit doctor notes, or suggest changing medication dosages.
3. If the user asks about an emergency or severe symptoms (e.g. chest pain, stroke symptoms, high fever, unconsciousness), direct them immediately to emergency services (112 / 108 in India).
4. GROUNDING: Answer ONLY based on the facts provided in the user's Care Map below. Do not invent clinics, doctor names, or dates.
5. PROVENANCE: Mention the source of information when possible (e.g., "According to your recorded consultation or prescription notes...").
6. MISSING INFORMATION: If information is absent from the records, explicitly say so (e.g., "I don't have a record of your last eye examination").
7. Tone: Calm, organized, clear, proactive, respectful, and reassuring. Keep answers concise and readable.

USER CARE MAP CONTEXT:
- Profile: ${personName}, Age: ${personAge}, City: ${personCity}
- Active Conditions / Summary: ${activeMember?.conditionsSummary || 'None recorded'}
- Active Medications: ${JSON.stringify(activeMember?.activeMedications || state.emergencyCard?.currentMedicines || [])}
- Emergency Card: Blood Group: ${state.emergencyCard?.bloodGroup}, Allergies: ${JSON.stringify(state.emergencyCard?.allergies)}, Emergency Contact: ${state.emergencyCard?.emergencyContactName} (${state.emergencyCard?.emergencyContactPhone})
- Upcoming Appointments: ${JSON.stringify(
        state.appointments?.filter(a => a.status === 'upcoming').map(a => ({
          doctor: a.providerName,
          specialty: a.specialty,
          date: a.date,
          time: a.time,
          location: a.location,
          preparation: a.preparation
        })) || []
      )}
- Open Care Commitments: ${JSON.stringify(
        state.commitments?.filter(c => c.status === 'open' || c.status === 'needs_clarification').map(c => ({
          title: c.title,
          category: c.category,
          dueDate: c.dueDate,
          suggestedBy: c.suggestedBy,
          whyItMatters: c.whyItMatters
        })) || []
      )}
- Care Providers (Care Team): ${JSON.stringify(
        state.providers?.map(p => ({
          name: p.name,
          role: p.role,
          specialty: p.specialty,
          clinic: p.clinic,
          contact: p.contact
        })) || []
      )}
- Recent History Events: ${JSON.stringify(
        state.history?.slice(0, 5).map(h => ({
          date: h.date,
          title: h.title,
          provider: h.providerName,
          description: h.description
        })) || []
      )}
- Doctor Instructions: ${JSON.stringify(
        state.doctorInstructions?.slice(0, 3).map(i => ({
          date: i.date,
          doctor: i.doctorName,
          purpose: i.visitPurpose,
          routines: i.recommendedRoutines,
          tests: i.recommendedTestsOrFollowup,
          nextReview: i.nextReviewDate
        })) || []
      )}
- Records on file: ${JSON.stringify(
        state.records?.map(r => ({
          title: r.title,
          date: r.date,
          provider: r.providerName,
          summary: r.summary
        })) || []
      )}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUSER QUESTION: ${cleanQuery}` }] }
        ]
      });

      const text = response.text || '';
      return {
        answer: text,
        isAiGenerated: true,
        modelUsed: 'gemini-2.5-flash',
        clinicalDisclaimer: CLINICAL_DISCLAIMER
      };
    } catch (err) {
      console.warn('[Gemini] Cloud API call failed or timed out, falling back to local contextual coordinator:', err);
    }
  }

  // Local Rule-Based Contextual Coordinator (Offline-ready & deterministic)
  return fallbackContextualCoordinator(cleanQuery, state);
}

function fallbackContextualCoordinator(query: string, state: UserCareState): AskCareMapResponse {
  const q = query.toLowerCase();
  let answer = '';
  const citations: string[] = [];
  const followups: string[] = [];

  const activeMember = state.familyMembers?.find(m => m.id === state.activeFamilyMemberId);
  const personName = activeMember?.name || state.profile.name;

  if (q.includes('coming up') || q.includes('upcoming') || q.includes('next appointment') || q.includes('schedule')) {
    const upcomingApts = state.appointments?.filter(a => a.status === 'upcoming') || [];
    if (upcomingApts.length > 0) {
      answer = `You have ${upcomingApts.length} upcoming scheduled appointment(s) for ${personName}:\n` +
        upcomingApts.map(a => `• **${a.providerName}** (${a.specialty}) on **${a.date}** at **${a.time}** (${a.location})`).join('\n') +
        `\n\nRoutine reminder: Next clinical checkup review is planned around November 2026.`;
      citations.push('Upcoming Appointments Calendar');
      followups.push('What should I take to my next appointment?', 'What questions should I ask Dr. Shah?');
    } else {
      answer = `There are currently no scheduled appointments on ${personName}'s calendar.`;
      followups.push('What follow-ups are still open?');
    }
  } else if (q.includes('open') || q.includes('commitment') || q.includes('follow-up') || q.includes('pending') || q.includes('due')) {
    const openCommits = state.commitments?.filter(c => c.status === 'open' || c.status === 'needs_clarification') || [];
    if (openCommits.length > 0) {
      answer = `Here are the **${openCommits.length} open Care Commitment(s)** currently tracked:\n` +
        openCommits.map(c => `• **${c.title}**\n  - Category: ${c.category}\n  - Due: ${c.dueDate}\n  - Recommended by: ${c.suggestedBy}\n  - Purpose: ${c.whyItMatters}`).join('\n\n');
      citations.push('Care Commitments Tracker');
      followups.push('When was my last blood test?', 'What changed after my last GP visit?');
    } else {
      answer = `All recorded care commitments are currently resolved and up to date for ${personName}.`;
    }
  } else if (q.includes('medicine') || q.includes('tablet') || q.includes('dose') || q.includes('drug') || q.includes('medication')) {
    const meds = activeMember?.activeMedications || state.emergencyCard?.currentMedicines || [];
    if (meds.length > 0) {
      answer = `Here are the active medications recorded on file for ${personName}:\n` +
        meds.map(m => `• ${m}`).join('\n') +
        `\n\n*Note: Any prescription changes should be confirmed with your treating physician.*`;
      citations.push('Active Medications list');
      followups.push('What follow-ups are still open?', 'When is my next appointment?');
    } else {
      answer = `No active daily medications are currently recorded for ${personName}.`;
    }
  } else if (q.includes('take') || q.includes('bring') || q.includes('prepare') || q.includes('prep') || q.includes('checklist')) {
    const nextApt = state.appointments?.find(a => a.status === 'upcoming');
    if (nextApt) {
      answer = `For your upcoming visit with **${nextApt.providerName}** on **${nextApt.date}**, here is your preparation summary:\n` +
        `• **Items to bring**: ${nextApt.preparation?.materialsToBring?.join(', ') || 'Prescriptions and recent reports'}\n` +
        `• **Key discussion topics**: ${nextApt.preparation?.discussionTopics?.join('; ') || 'Routine review'}\n` +
        `• **Questions prepared**: ${nextApt.preparation?.userQuestions?.join('; ') || 'None yet'}\n` +
        `• **Recent observations**: ${nextApt.preparation?.recentChanges?.join('; ') || 'None logged'}`;
      citations.push(`Appointment Prep Pack for ${nextApt.providerName}`);
      followups.push('What are my current medications on file?');
    } else {
      answer = `You don't have an upcoming appointment scheduled right now, but your records and medication list are ready whenever you schedule one.`;
    }
  } else if (q.includes('gp') || q.includes('doctor') || q.includes('last visit') || q.includes('last appointment') || q.includes('changed')) {
    const gpEvent = state.history?.find(h => h.title.toLowerCase().includes('gp') || h.title.toLowerCase().includes('doctor') || h.title.toLowerCase().includes('clinic'));
    const gpProvider = state.providers?.find(p => p.role.toLowerCase().includes('gp') || p.specialty.toLowerCase().includes('physician') || p.specialty.toLowerCase().includes('general'));
    if (gpEvent || gpProvider) {
      answer = `During your consultation with **${gpProvider?.name || gpEvent?.providerName || 'your doctor'}**${gpEvent?.date ? ` on **${gpEvent.date}**` : ''}:\n` +
        `• Summary: ${gpEvent?.description || 'Routine health review recorded.'}\n` +
        `• Notes: ${gpProvider?.notes || gpEvent?.description || 'Follow recommendations provided during consultation.'}`;
      citations.push('Care History & Doctor Consultations');
      followups.push('What do I have coming up?', 'What follow-ups are still open?');
    } else {
      answer = `You don't have a doctor visit recorded yet in your Care Map. You can record a visit in the 'My Care Network' or 'Care History' tab.`;
      citations.push('Care History');
    }
  } else if (q.includes('dentist') || q.includes('dental') || q.includes('teeth')) {
    const dental = state.history?.find(h => h.title.toLowerCase().includes('dental'));
    if (dental) {
      answer = `Your last recorded dental visit was on **${dental.date}** (${dental.description || 'Dental checkup completed'}).`;
      citations.push('Dental Care History');
    } else {
      answer = `I do not have a recent dental visit recorded in your Care Map. You may want to record your last dental check date.`;
    }
  } else if (q.includes('eye') || q.includes('vision') || q.includes('spectacle') || q.includes('optom')) {
    const vision = state.history?.find(h => h.title.toLowerCase().includes('vision') || h.title.toLowerCase().includes('eye'));
    if (vision) {
      answer = `Your last recorded eye check was on **${vision.date}** (${vision.description || 'Vision check recorded'}).`;
      citations.push('Routine Care Territory');
    } else {
      answer = `I don't have a recent vision check recorded in your Care Map. You can record your last checkup under Routine Care.`;
    }
  } else if (q.includes('emergency') || q.includes('blood group') || q.includes('allergy') || q.includes('contact')) {
    answer = `**Emergency Health Card for ${state.emergencyCard.name}**:\n` +
      `• Blood Group: **${state.emergencyCard.bloodGroup}**\n` +
      `• Allergies: **${state.emergencyCard.allergies.join(', ') || 'None recorded'}**\n` +
      `• Emergency Contacts: **${state.emergencyCard.emergencyContactName}** (${state.emergencyCard.emergencyContactPhone})\n` +
      `• Primary Doctor: **${state.emergencyCard.primaryDoctor}** (${state.emergencyCard.primaryDoctorContact})\n` +
      `• In an immediate medical crisis in India, call **112** or **108** for ambulance support.`;
    citations.push('Emergency Health Card');
  } else {
    const openCount = state.commitments?.filter(c => c.status === 'open').length || 0;
    const upcomingCount = state.appointments?.filter(a => a.status === 'upcoming').length || 0;
    answer = `According to ${personName}'s stored Care Map:\n` +
      `• You have **${openCount} open care commitment(s)**.\n` +
      `• You have **${upcomingCount} scheduled upcoming appointment(s)**.\n` +
      `• Primary Doctor on file: **${state.emergencyCard?.primaryDoctor}**.\n` +
      `• Emergency Contact: **${state.emergencyCard?.emergencyContactName}**.\n\n` +
      `Feel free to ask about specific visits, doctor instructions, medication lists, or appointment preparation.`;
    followups.push('What do I have coming up?', 'What follow-ups are still open?', 'What should I take to my next appointment?');
  }

  return {
    answer,
    sourceCitations: citations.length ? citations : undefined,
    suggestedFollowups: followups.length ? followups : undefined,
    isAiGenerated: false,
    clinicalDisclaimer: CLINICAL_DISCLAIMER
  };
}
