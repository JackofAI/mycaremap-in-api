import {
  UserCareState,
  ValidationAnalytics,
  FamilyMember,
  CareSignal,
  CareNextTask,
  CareInboxItem,
  MeraCareContextHandoff,
  Appointment,
  DoctorCareInstruction,
  BetweenVisitActivityLog,
  BetweenVisitObservation,
  ConsumerEntitlementInfo
} from '../types/careMap';

export const rameshAvatarPath = '/src/assets/images/ramesh_patel_avatar_1790986027697.jpg';
export const heroLifestylePath = '/src/assets/images/mycaremap_hero_lifestyle_1790829882169.jpg';
export const familyRemotePath = '/src/assets/images/india_family_care_remote_1790986038512.jpg';

// Ramesh Patel (67, Ahmedabad) - Primary Demo Profile
export const rameshPatelMember: FamilyMember = {
  id: 'ramesh-67',
  name: 'Ramesh Patel',
  relationTitle: 'Papa',
  relationTitleHi: 'पापा (Papa)',
  age: 67,
  city: 'Ahmedabad (Navrangpura)',
  avatarUrl: rameshAvatarPath,
  conditionsSummary: 'Blood Pressure · Diabetes monitoring · Recurring Dizziness · Cardiology review',
  conditionsSummaryHi: 'Blood Pressure · Diabetes निगरानी · बार-बार चक्कर (Dizziness) · Cardiology सलाह',
  activeMedications: [
    'Telmisartan 40mg (Morning - BP)',
    'Metformin 500mg (Post-dinner - Sugar)',
    'Pantoprazole 40mg (Before food - Acidity)',
    'Neurobion Forte (Daily vitamin)'
  ],
  isDemoPrimary: true,
  isElderly: true,
  careCircle: [
    {
      id: 'cc-jay',
      name: 'Jay Patel',
      relation: 'Son',
      relationHi: 'बेटा (Son)',
      location: 'Melbourne, Australia (Remote)',
      helperRole: 'navigator',
      helperRoleLabel: 'Family Navigator (Melbourne)',
      helperRoleLabelHi: 'Family Navigator (मेलबर्न)',
      canViewAppointments: true,
      canAddReports: true,
      canManageFollowups: true,
      canViewPrivateNotes: false
    },
    {
      id: 'cc-neha',
      name: 'Neha Patel',
      relation: 'Daughter',
      relationHi: 'बेटी (Daughter)',
      location: 'Ahmedabad (Local)',
      helperRole: 'partner',
      helperRoleLabel: 'Local Care Partner (Ahmedabad)',
      helperRoleLabelHi: 'लोकल केयर पार्टनर (अहमदाबाद)',
      canViewAppointments: true,
      canAddReports: true,
      canManageFollowups: true,
      canViewPrivateNotes: true
    },
    {
      id: 'cc-meena',
      name: 'Meena Patel',
      relation: 'Wife',
      relationHi: 'पत्नी (Mummy)',
      location: 'Ahmedabad',
      helperRole: 'viewer',
      helperRoleLabel: 'Family Viewer (Home)',
      helperRoleLabelHi: 'फैमिली व्यूअर (होम)',
      canViewAppointments: true,
      canAddReports: true,
      canManageFollowups: false,
      canViewPrivateNotes: true
    }
  ],
  signals: [
    {
      id: 'sig-dizziness',
      title: 'Recurring Observation: Dizziness (Light-headedness)',
      titleHi: 'बार-बार दिख रहा है: चक्कर (Dizziness)',
      description: 'Dizziness was mentioned in 4 separate care entries across the last 6 weeks (Hospital visit, Dr Shah prescription, Neha’s note, Blood check). Worth discussing with Dr Shah.',
      descriptionHi: 'पिछले 6 हफ्तों में 4 entries में चक्कर (Dizziness) का ज़िक्र आया है (Hospital visit, Dr Shah prescription, Neha का note, Blood test). Dr Shah से discuss करना उपयोगी रहेगा।',
      occurrences: 4,
      timeframe: 'Last 6 weeks',
      sourceEntryIds: ['hist-1', 'hist-3', 'inbox-1', 'hist-4'],
      sourceEntriesSummary: [
        { date: '14 Sep 2026', title: 'Sterling Hospital Emergency Visit', snippet: 'Admitted for sudden transient dizziness while walking in morning. BP 142/90.' },
        { date: '22 Sep 2026', title: 'Neha’s Note', snippet: 'Papa felt light-headed after sitting for 2 hours in temple.' },
        { date: '27 Sep 2026', title: 'Apex Diagnostic Blood Panel', snippet: 'HbA1c 6.8%, Fasting 124 mg/dL. Dr Shah asked to watch hydration & posture.' },
        { date: '03 Oct 2026', title: 'Dr Shah Follow-up Prescription', snippet: 'Medicine adjusted. Dr Shah advised cardiology check if dizziness persists.' }
      ],
      suggestedAction: 'Add to questions list for upcoming Dr Shah visit on Saturday.',
      suggestedActionHi: 'शनिवार को Dr Shah की visit में पूछने के लिए list में जोड़ें।',
      category: 'pattern'
    },
    {
      id: 'sig-pending-cardio',
      title: 'Unresolved Follow-up: Cardiologist Referral',
      titleHi: 'Follow-up बाकी हो सकता है: Cardiologist Referral',
      description: 'Hospital discharge note and Dr Shah recommended a formal baseline cardiology review. Appointment is not yet booked.',
      descriptionHi: 'Hospital discharge summary में Cardiologist से consult करने की सलाह थी. अभी तक appointment book नहीं हुई है.',
      occurrences: 1,
      timeframe: 'Since 14 Sep',
      sourceEntryIds: ['hist-1'],
      sourceEntriesSummary: [
        { date: '14 Sep 2026', title: 'Discharge Summary - Sterling Hospital', snippet: 'Advised 2D Echo & Cardiologist consult (Dr Harish Mehta) within 30 days.' }
      ],
      suggestedAction: 'Book appointment with Dr Harish Mehta (C.G. Road).',
      suggestedActionHi: 'Dr Harish Mehta (Cardiology) की appointment book करें।',
      category: 'pending_followup'
    }
  ],
  nextTasks: [
    {
      id: 'next-1',
      title: 'Show blood test reports to Dr Shah',
      titleHi: 'Papa की blood test report Doctor को दिखानी है',
      category: 'show_doctor',
      lifecycle: 'todo',
      dueDate: 'Tomorrow · 11:30 AM',
      dueNote: 'Saturday visit scheduled',
      suggestedBy: 'Dr. Vikram Shah (Primary GP)',
      assignedTo: 'Neha (Daughter)',
      whyItMatters: 'Dr Shah wants to review fasting glucose and creatinine after the medicine adjustment.',
      whyItMattersHi: 'नई medicine के बाद creatinine और fasting sugar check करना जरूरी है।',
      sourceDoc: 'Apex Diagnostics Report - 27 Sep 2026',
      status: 'pending'
    },
    {
      id: 'next-2',
      title: 'Book Cardiologist consult (Dr Harish Mehta)',
      titleHi: 'Dr Mehta (Cardiology) की appointment book करनी है',
      category: 'book',
      lifecycle: 'todo',
      dueDate: 'Next Week (Before 15 Oct)',
      dueNote: '30-day window from discharge',
      suggestedBy: 'Sterling Hospital Discharge Summary',
      assignedTo: 'Bhavik (Son in Melbourne)',
      whyItMatters: 'To rule out postural hypotension or cardiac rhythm issues behind recurring dizziness.',
      whyItMattersHi: 'चक्कर आने की वजह में heart rhythm या postural BP drop rule out करना जरूरी है।',
      sourceDoc: 'Discharge Summary - 14 Sep 2026',
      status: 'pending'
    },
    {
      id: 'next-3',
      title: 'MRI Brain & Cervical Spine Report expected',
      titleHi: 'MRI Report — Sterling Diagnostic (Expected: Friday)',
      category: 'waiting',
      lifecycle: 'waiting',
      dueDate: 'Friday Evening',
      dueNote: 'Results pending from lab',
      suggestedBy: 'Apex Neuro Diagnostics',
      assignedTo: 'Self / Neha',
      whyItMatters: 'Investigating inner-ear or cervical trigger for dizziness.',
      whyItMattersHi: 'Vertigo या cervical spondylosis rule out करने के लिए test कराया था।',
      sourceDoc: 'Lab Receipt #9924',
      status: 'in_progress'
    },
    {
      id: 'next-4',
      title: 'Ask Dr Shah: Why is dizziness recurring in morning?',
      titleHi: 'Doctor से पूछना: सुबह उठते समय चक्कर क्यों आ रहे हैं?',
      category: 'ask_doctor',
      lifecycle: 'todo',
      dueDate: 'Saturday Clinic Visit',
      dueNote: 'Add to clinic checklist',
      suggestedBy: 'Family Care Circle (Bhavik & Neha)',
      assignedTo: 'Neha (Accompanying Papa)',
      whyItMatters: 'Logged 4 times; needs systematic doctor review rather than isolated WhatsApp notes.',
      whyItMattersHi: 'Family ने 4 बार notice किया है; Doctor के सामने स्पष्ट रखना जरूरी है।',
      status: 'pending'
    },
    {
      id: 'next-5',
      title: 'Repeat Fasting Glucose & Lipid Panel in December',
      titleHi: 'दिसंबर में Fasting Sugar व Lipid Profile repeat कराना',
      category: 'todo',
      lifecycle: 'todo',
      dueDate: 'December 2026',
      dueNote: '3-month recall',
      suggestedBy: 'Dr. Vikram Shah',
      assignedTo: 'Papa / Self',
      whyItMatters: 'Long-term glycemic maintenance and statin dosage check.',
      whyItMattersHi: 'Sugar control और routine follow-up के लिए।',
      status: 'pending'
    }
  ],
  inbox: [
    {
      id: 'inbox-1',
      type: 'prescription',
      title: 'Dr. Vikram Shah — Updated Prescription (3 Oct)',
      receivedAt: 'Yesterday · 06:45 PM',
      senderName: 'Neha Patel (via WhatsApp photo)',
      extractedSummary: {
        doctorName: 'Dr. Vikram Shah (Shah Health Clinic, Navrangpura)',
        date: '03 Oct 2026',
        medicinesDetected: 2,
        medicinesList: ['Telmisartan 40mg (OD morning)', 'Pantocid 40mg (Before breakfast)'],
        keyFindings: ['BP recorded 138/86 mmHg', 'Advised 2-week recall with fresh reports'],
        followupWindow: '2 weeks (Mid October)',
        suggestedNextAction: 'Review medicines and confirm next appointment date'
      },
      status: 'unreviewed'
    },
    {
      id: 'inbox-2',
      type: 'whatsapp',
      title: 'Apex Lab WhatsApp PDF: Comprehensive Metabolic Panel',
      receivedAt: '27 Sep 2026 · 11:20 AM',
      senderName: 'Apex Labs WhatsApp Alert',
      extractedSummary: {
        doctorName: 'Ref: Dr. Vikram Shah',
        date: '27 Sep 2026',
        keyFindings: ['HbA1c: 6.8% (Borderline)', 'Fasting Glucose: 124 mg/dL', 'Serum Creatinine: 1.0 mg/dL (Normal)'],
        followupWindow: 'Discuss with physician',
        suggestedNextAction: 'Show to Dr Shah on Saturday'
      },
      status: 'unreviewed'
    },
    {
      id: 'inbox-3',
      type: 'voice',
      title: 'Audio Note from Bhavik (Melbourne)',
      receivedAt: '28 Sep 2026 · 08:15 AM',
      senderName: 'Bhavik (Voice note)',
      rawContent: '“Tell Papa not to get up abruptly from bed in the morning. Sit for 2 minutes before standing so dizziness does not happen. I have added a question for Dr Shah.”',
      rawContentHi: '“Papa को बोलो कि सुबह उठते वक्त एकदम से बिस्तर से खड़े न हों। 2 मिनट बैठें फिर खड़े हों, ताकि चक्कर न आए। मैंने Dr Shah के लिए question add कर दिया है।”',
      extractedSummary: {
        keyFindings: ['Care advice: 2-minute seated pause before standing to prevent orthostatic dizziness'],
        keyFindingsHi: ['Care सलाह: Orthostatic चक्कर से बचने के लिए खड़े होने से पहले 2 मिनट बैठें'],
        suggestedNextAction: 'Added to Saturday visit discussion points',
        suggestedNextActionHi: 'शनिवार की विज़िट में डॉक्टर से पूछने के लिए जोड़ें'
      },
      status: 'unreviewed'
    }
  ]
};

// Secondary Demo Members to prove lifelong care (not elder-only)
export const meenaPatelMember: FamilyMember = {
  id: 'meena-63',
  name: 'Meena Patel',
  relationTitle: 'Mummy',
  relationTitleHi: 'मम्मी (Mummy)',
  age: 63,
  city: 'Ahmedabad',
  conditionsSummary: 'Mild knee osteoarthritis · Thyroid monitoring (Thyronorm 50mcg)',
  conditionsSummaryHi: 'हल्का घुटनों का दर्द (Knee OA) · Thyroid monitoring',
  activeMedications: ['Thyronorm 50mcg (Early morning empty stomach)', 'Calcium & Vitamin D3'],
  isDemoPrimary: false,
  isElderly: true,
  careCircle: rameshPatelMember.careCircle,
  signals: [],
  nextTasks: [
    {
      id: 'next-meena-1',
      title: 'Annual TSH / Thyroid blood check',
      titleHi: 'Mummy का Thyroid (TSH) test कराना',
      category: 'todo',
      lifecycle: 'todo',
      dueDate: 'November 2026',
      suggestedBy: 'Dr. Shah',
      assignedTo: 'Neha (Daughter)',
      whyItMatters: 'Annual dose adjustment for Thyronorm.',
      whyItMattersHi: 'Thyronorm दवा का dose verify करने के लिए।',
      status: 'pending'
    }
  ],
  inbox: []
};

export const priyaMember: FamilyMember = {
  id: 'priya-31',
  name: 'Priya Patel',
  relationTitle: 'Priya',
  relationTitleHi: 'प्रिया (Priya - 31)',
  age: 31,
  city: 'Ahmedabad',
  conditionsSummary: 'Migraine tracking · Neurologist consult · Screen time triggers',
  conditionsSummaryHi: 'माइग्रेन (Migraine) · Neurologist सलाह · Screen time trigger',
  activeMedications: ['Naproxen SOS for migraine', 'Magnesium Glycinate nightly'],
  isDemoPrimary: false,
  isElderly: false,
  careCircle: [],
  signals: [
    {
      id: 'sig-priya-screen',
      title: 'Migraine attacks linked to 8+ hour continuous laptop use',
      titleHi: 'लगातार 8+ घंटे screen time के बाद headache का pattern',
      description: 'Logged 3 times after intensive project sprint weeks.',
      descriptionHi: 'पिछले महीने 3 बार intense work week के बाद migraine note हुआ।',
      occurrences: 3,
      timeframe: 'Last month',
      sourceEntryIds: [],
      sourceEntriesSummary: [],
      suggestedAction: 'Discuss preventive migraine protocol with Dr Joshi.',
      suggestedActionHi: 'Dr Joshi (Neurology) से preventive treatment discuss करें।',
      category: 'pattern'
    }
  ],
  nextTasks: [
    {
      id: 'next-priya-1',
      title: 'Neurologist follow-up with Dr Joshi',
      titleHi: 'Dr Joshi (Neurology) से follow-up',
      category: 'book',
      lifecycle: 'todo',
      dueDate: 'End of October',
      suggestedBy: 'Dr Joshi',
      whyItMatters: 'Review 30-day migraine headache diary.',
      whyItMattersHi: 'Headache diary review के लिए।',
      status: 'pending'
    }
  ],
  inbox: []
};

export const rahulMember: FamilyMember = {
  id: 'rahul-42',
  name: 'Rahul Patel',
  relationTitle: 'Rahul',
  relationTitleHi: 'राहुल (Rahul - 42)',
  age: 42,
  city: 'Pune',
  conditionsSummary: 'Proactive routine health · Pre-diabetes awareness · Annual executive check',
  conditionsSummaryHi: 'Routine health checkup · Pre-diabetes awareness · Dental cleaning',
  activeMedications: ['Multivitamin', 'Omega 3 fish oil'],
  isDemoPrimary: false,
  isElderly: false,
  careCircle: [],
  signals: [],
  nextTasks: [
    {
      id: 'next-rahul-1',
      title: 'Annual Executive Health Checkup',
      titleHi: 'Annual Health Checkup book करना',
      category: 'book',
      lifecycle: 'todo',
      dueDate: 'November 2026',
      suggestedBy: 'Company Wellness Program',
      whyItMatters: 'Routine baseline lipids & glucose monitoring.',
      whyItMattersHi: 'Routine blood test और baseline checkup.',
      status: 'pending'
    }
  ],
  inbox: []
};

export const aaravMember: FamilyMember = {
  id: 'aarav-9',
  name: 'Aarav Patel',
  relationTitle: 'Aarav',
  relationTitleHi: 'आरव (Aarav - 9 yrs)',
  age: 9,
  city: 'Ahmedabad',
  conditionsSummary: 'Paediatric seasonal dust allergy · Paediatric eye exam',
  conditionsSummaryHi: 'धूल व मौसम से एलर्जी (Allergy) · बच्चों का Eye checkup',
  activeMedications: ['Montelukast chewable (seasonal SOS)', 'Saline nasal spray'],
  isDemoPrimary: false,
  isElderly: false,
  careCircle: [],
  signals: [],
  nextTasks: [
    {
      id: 'next-aarav-1',
      title: 'Paediatric Vision & Eye Power Screening',
      titleHi: 'आरव का Eye Checkup (School screening follow-up)',
      category: 'book',
      lifecycle: 'todo',
      dueDate: 'During Diwali Vacation',
      suggestedBy: 'School Health Camp',
      whyItMatters: 'School teacher noticed squinting while copying from board.',
      whyItMattersHi: 'Blackboard देखते समय आँखें सिकोड़ने की शिकायत थी।',
      status: 'pending'
    }
  ],
  inbox: []
};

// Rich longitudinal demo history for Ramesh Patel
export const rameshDemoHistory = [
  {
    id: 'hist-1',
    date: '03 Oct 2026',
    title: 'Dr. Vikram Shah — Follow-up Consultation',
    category: 'Consultation',
    providerName: 'Dr. Vikram Shah',
    addedBy: 'Bhavik Patel (Son)',
    description: 'Reviewed BP (138/86). Adjusted Telmisartan dose. Advised repeat fasting blood test in 1 month and cardiology consult if dizziness continues.',
    relatedCommitmentId: 'next-1',
    documentsCount: 1
  },
  {
    id: 'hist-2',
    date: '27 Sep 2026',
    title: 'Comprehensive Blood Panel Completed',
    category: 'Diagnostics',
    providerName: 'Apex Diagnostic Labs, Navrangpura',
    addedBy: 'Neha Patel (Daughter)',
    description: 'CBC, HbA1c (6.8%), Fasting glucose (124 mg/dL), Renal Profile (Creatinine 1.0), Lipid Profile. Uploaded to MyCareMap via WhatsApp PDF.',
    relatedCommitmentId: 'next-1',
    documentsCount: 1
  },
  {
    id: 'hist-3',
    date: '14 Sep 2026',
    title: 'Emergency Observation Visit — Sterling Hospital',
    category: 'Hospital Visit',
    providerName: 'Sterling Hospital, Gurukul',
    addedBy: 'Neha Patel (Daughter)',
    description: 'Attended ER after sudden dizziness while morning walking. ECG normal, cardiac enzymes negative. Discharged same evening with advice for GP & 2D Echo review.',
    relatedCommitmentId: 'next-2',
    documentsCount: 2
  },
  {
    id: 'hist-4',
    date: '12 Sep 2026',
    title: 'GP Routine Review with Dr. Vikram Shah',
    category: 'Consultation',
    providerName: 'Dr. Vikram Shah',
    addedBy: 'Ramesh Patel (Self)',
    description: 'Routine BP checkup. First noted mild light-headedness after hot showers. Advised adequate hydration.',
    documentsCount: 1
  },
  {
    id: 'hist-5',
    date: '02 Jul 2026',
    title: 'Annual Executive Health Check 2026',
    category: 'Diagnostics',
    providerName: 'Sterling Diagnostic Center',
    addedBy: 'Bhavik Patel (Son)',
    description: 'Comprehensive annual wellness checkup: Ultrasound abdomen normal, mild borderline LDL, HbA1c 6.6%. Archived in Care Memory.',
    documentsCount: 1
  }
];

export const rameshDemoInstructions: DoctorCareInstruction[] = [
  {
    id: 'inst-shah-oct',
    date: '03 Oct 2026',
    doctorName: 'Dr. Vikram Shah',
    specialty: 'Internal Medicine / Family Physician',
    visitPurpose: 'Follow-up consultation for transient lightheadedness & BP medication adjustment',
    visitPurposeHi: 'चक्कर (Dizziness) व Blood Pressure दवा समीक्षा',
    instructionsSummary: 'Continue Telmisartan 40mg with morning breakfast. Prescribed daily 30-minute steady walking, cervical posture exercises twice daily, and keeping a written log of recurring dizziness episodes. Follow-up in 4 weeks or sooner if lightheadedness recurs.',
    instructionsSummaryHi: 'नाश्ते के बाद Telmisartan 40mg जारी रखें। रोज़ाना 30 मिनट वॉक, दिन में 2 बार गर्दन की कसरत, और चक्कर आने पर तुरंत डायरी में नोट करने की सलाह दी। 4 हफ्ते बाद या ज़रूरत पड़ने पर फॉलो-अप।',
    recommendedRoutines: [
      {
        id: 'rout-walk',
        title: 'Daily Morning Walking (30 mins steady pace)',
        titleHi: 'रोज़ाना सुबह 30 मिनट वॉक (सामान्य गति)',
        frequency: 'Daily (30 mins)',
        category: 'walking',
        isCompletedToday: true
      },
      {
        id: 'rout-ex',
        title: 'Prescribed Neck & Posture Exercises (10 mins)',
        titleHi: 'गर्दन व पोस्चर की निर्धारित कसरत (10 मिनट)',
        frequency: 'Twice daily',
        category: 'exercise',
        isCompletedToday: false
      },
      {
        id: 'rout-log-dizzy',
        title: 'Log Recurring Discomfort / Dizziness',
        titleHi: 'चक्कर या असहजता होने पर तुरंत नोट करें',
        frequency: 'As occurs',
        category: 'monitoring',
        isCompletedToday: true
      },
      {
        id: 'rout-bp-log',
        title: 'Morning BP & Fasting Blood Sugar Check',
        titleHi: 'सुबह BP व खाली पेट शुगर की जांच',
        frequency: '3x weekly',
        category: 'monitoring',
        isCompletedToday: true
      }
    ],
    medicationNotes: 'Telmisartan 40mg after breakfast. Continue Metformin 500mg post-dinner. Avoid sudden standing from bed.',
    medicationNotesHi: 'सुबह नाश्ते के बाद Telmisartan 40mg। रात के खाने के बाद Metformin 500mg। बिस्तर से अचानक खड़े न हों।',
    recommendedTestsOrFollowup: 'Repeat Fasting Glucose and Serum Creatinine before next consultation.',
    recommendedTestsOrFollowupHi: 'अगली विज़िट से पहले खाली पेट ब्लड शुगर व सीरम क्रिएटिनिन जांच कराएं।',
    nextReviewDate: 'Saturday, 11 Oct 2026 (11:30 AM)',
    personalNotes: 'Doctor specifically emphasized staying hydrated with electrolyte water during warm afternoons.',
    sourceDoc: 'Dr. Vikram Shah Prescription Note (03 Oct 2026)'
  }
];

export const rameshDemoActivityLogs: BetweenVisitActivityLog[] = [
  // 30-day recorded demonstration values: Walking recorded on 23 of 30 days, Exercises completed on 18 days, 3 missed with reasons
  { id: 'log-1', date: '10 Oct 2026', routineTitle: 'Daily Morning Walking', status: 'completed', notes: 'Completed 32 mins in Law Garden with Neha', loggedBy: 'Ramesh Patel (Self)' },
  { id: 'log-2', date: '09 Oct 2026', routineTitle: 'Daily Morning Walking', status: 'completed', notes: 'Morning walk 30 mins', loggedBy: 'Ramesh Patel (Self)' },
  { id: 'log-3', date: '08 Oct 2026', routineTitle: 'Daily Morning Walking', status: 'missed', difficultyReason: 'Felt unsteady after morning prayer, rested instead', notes: 'Dizziness episode #4 logged', loggedBy: 'Neha Patel (Daughter)' },
  { id: 'log-4', date: '07 Oct 2026', routineTitle: 'Daily Morning Walking', status: 'completed', notes: 'Completed brisk walk with walking stick', loggedBy: 'Ramesh Patel (Self)' },
  { id: 'log-5', date: '06 Oct 2026', routineTitle: 'Daily Morning Walking', status: 'completed', notes: 'Walked in society garden 30 mins', loggedBy: 'Ramesh Patel (Self)' },
  { id: 'log-6', date: '05 Oct 2026', routineTitle: 'Daily Morning Walking', status: 'partial', difficultyReason: 'Knee soreness after 15 minutes', notes: 'Completed 15 of 30 mins', loggedBy: 'Ramesh Patel (Self)' },
  { id: 'log-7', date: '04 Oct 2026', routineTitle: 'Daily Morning Walking', status: 'completed', notes: '30 mins regular walk', loggedBy: 'Ramesh Patel (Self)' },
  { id: 'log-8', date: '03 Oct 2026', routineTitle: 'Daily Morning Walking', status: 'completed', notes: 'Consultation day walk in evening', loggedBy: 'Ramesh Patel (Self)' },
  { id: 'log-9', date: '02 Oct 2026', routineTitle: 'Daily Morning Walking', status: 'missed', difficultyReason: 'Heavy morning rain in Ahmedabad', loggedBy: 'Ramesh Patel (Self)' },
  { id: 'log-10', date: '01 Oct 2026', routineTitle: 'Daily Morning Walking', status: 'completed', notes: '30 mins completed', loggedBy: 'Ramesh Patel (Self)' },
  // Summary tags for historical tracking:
  // Walking: 23 completed days, 4 partial days, 3 missed days out of 30 days
  { id: 'log-ex-1', date: '10 Oct 2026', routineTitle: 'Prescribed Neck & Posture Exercises', status: 'completed', notes: 'Morning session completed', loggedBy: 'Ramesh Patel (Self)' },
  { id: 'log-ex-2', date: '09 Oct 2026', routineTitle: 'Prescribed Neck & Posture Exercises', status: 'completed', notes: 'Both sessions done', loggedBy: 'Ramesh Patel (Self)' },
  { id: 'log-ex-3', date: '08 Oct 2026', routineTitle: 'Prescribed Neck & Posture Exercises', status: 'partial', difficultyReason: 'Mild neck stiffness in evening', loggedBy: 'Neha Patel (Daughter)' },
  { id: 'log-ex-4', date: '07 Oct 2026', routineTitle: 'Prescribed Neck & Posture Exercises', status: 'completed', loggedBy: 'Ramesh Patel (Self)' },
  { id: 'log-ex-5', date: '06 Oct 2026', routineTitle: 'Prescribed Neck & Posture Exercises', status: 'completed', loggedBy: 'Ramesh Patel (Self)' }
];

export const rameshDemoObservations: BetweenVisitObservation[] = [
  {
    id: 'obs-1',
    date: '08 Oct 2026',
    observation: 'Transient dizziness for ~30 seconds after standing up from sofa',
    observationHi: 'सोफे से उठने पर लगभग 30 सेकंड के लिए चक्कर आया',
    severity: 'moderate',
    contextNotes: 'BP measured 138/86 immediately after. Resolved with water and seated rest.',
    loggedBy: 'Neha Patel (Daughter)'
  },
  {
    id: 'obs-2',
    date: '27 Sep 2026',
    observation: 'Mild lightheadedness during fasting blood collection at Apex Labs',
    observationHi: 'लैब में खाली पेट ब्लड सैंपल देते समय हल्का चक्कर आया',
    severity: 'mild',
    contextNotes: 'Phlebotomist gave glucose water; blood pressure was 134/82.',
    loggedBy: 'Ramesh Patel (Self)'
  },
  {
    id: 'obs-3',
    date: '22 Sep 2026',
    observation: 'Felt unsteady after sitting for 2 hours during temple prayer',
    observationHi: 'मंदिर में 2 घंटे बैठने के बाद खड़े होते समय लड़खड़ाहट',
    severity: 'moderate',
    contextNotes: 'Postural hypotension suspected by Dr. Shah.',
    loggedBy: 'Neha Patel (Daughter)'
  },
  {
    id: 'obs-4',
    date: '14 Sep 2026',
    observation: 'Acute sudden dizziness while morning walking — led to Sterling Hospital ER evaluation',
    observationHi: 'सुबह वॉक करते समय अचानक चक्कर — जिसके बाद Sterling ER जाना पड़ा',
    severity: 'concerning',
    contextNotes: 'ECG normal, troponin negative. Cardiology follow-up advised.',
    loggedBy: 'Sterling Hospital Emergency Record'
  }
];

export const rameshDemoAppointments: Appointment[] = [
  {
    id: 'apt-shah-sat',
    providerName: 'Dr. Vikram Shah',
    specialty: 'Primary Care Physician / Family Medicine',
    date: 'Saturday, 11 Oct 2026',
    time: '11:30 AM',
    location: 'Shah Health Clinic, Navrangpura, Ahmedabad',
    city: 'Ahmedabad',
    status: 'upcoming' as const,
    previousVisitDate: '03 Oct 2026',
    previousVisitDoctor: 'Dr. Vikram Shah',
    previousVisitInstructions: 'Daily 30-minute steady walking, cervical posture exercises twice daily, log recurring dizziness episodes, repeat fasting metabolic panel.',
    previousVisitInstructionsHi: 'रोज़ 30 मिनट वॉक, दिन में दो बार गर्दन की कसरत, चक्कर के एपिसोड डायरी में नोट करना, खाली पेट ब्लड टेस्ट कराना।',
    preparation: {
      recentChanges: [
        'Dizziness noted 4 times over the last 6 weeks (pattern detected by Care Signal)',
        'Telmisartan dose adjusted on 03 October',
        'Apex Lab blood reports received on 27 September (HbA1c 6.8%)',
        'Sterling Hospital ER visit completed on 14 September'
      ],
      recentChangesHi: [
        'पिछले 6 हफ्तों में 4 बार चक्कर (Dizziness) का ज़िक्र आया है (Care Signal अलर्ट)',
        '3 अक्टूबर को Telmisartan दवा का dose बदला गया',
        '27 सितंबर को Apex Lab की रिपोर्ट मिली (HbA1c 6.8%)',
        '14 सितंबर को Sterling Hospital ER विज़िट हुई'
      ],
      discussionTopics: [
        'Why is dizziness recurring in the morning — could it be related to BP or posture?',
        'Fasting blood sugar 124 mg/dL and current medication plan',
        'Is a 2D Echo review with Dr Harish Mehta (Cardiologist) needed now?'
      ],
      discussionTopicsHi: [
        'चक्कर (Dizziness) बार-बार क्यों आ रहा है — क्या यह BP की वजह से है?',
        'Fasting blood sugar 124 mg/dL और नई medicine का तालमेल',
        'क्या Dr Harish Mehta (Cardiologist) से 2D Echo कराना अभी जरूरी है?'
      ],
      userQuestions: [
        'Why is the dizziness recurring, especially after morning walks?',
        'How long do I continue the current dose of Telmisartan?',
        'When should we repeat the fasting glucose and lipid profile?'
      ],
      userQuestionsHi: [
        'चक्कर क्यों बार-बार आ रहा है?',
        'Medicine कब तक लेनी है?',
        'अगला blood test कब कराना चाहिए?'
      ],
      materialsToBring: [
        'Apex Diagnostic Lab Report (27 Sep 2026)',
        'Dr Shah Prescription Note (03 Oct 2026)',
        'Sterling Hospital Discharge Summary (14 Sep 2026)',
        'Current daily medicine strip box'
      ],
      materialsToBringHi: [
        'Apex Diagnostic Lab Report (27 Sep 2026)',
        'Dr Shah Prescription Note (03 Oct 2026)',
        'Sterling Hospital Discharge Summary (14 Sep 2026)',
        'रोज़ की दवाओं का बॉक्स'
      ]
    }
  },
  {
    id: 'apt-mehta-cardio',
    providerName: 'Dr. Harish Mehta',
    specialty: 'Consultant Interventional Cardiologist',
    date: 'Tentative: Next Week',
    time: 'Morning OPD',
    location: 'Heart Wellness Clinic, C.G. Road, Ahmedabad',
    city: 'Ahmedabad',
    status: 'upcoming' as const,
    previousVisitDate: '14 Sep 2026',
    previousVisitDoctor: 'Sterling Hospital Emergency Department',
    previousVisitInstructions: 'Referred for 2D Echo & baseline cardiac rhythm evaluation following transient dizziness.',
    previousVisitInstructionsHi: 'चक्कर आने के बाद 2D Echo और हृदय गति की जांच के लिए referral।',
    preparation: {
      recentChanges: ['Referred after emergency dizziness observation at Sterling Hospital'],
      recentChangesHi: ['Sterling Hospital में चक्कर आने की emergency जांच के बाद referral मिला'],
      discussionTopics: ['Evaluate postural blood pressure and 2D Echocardiogram review'],
      discussionTopicsHi: ['Postural blood pressure और 2D Echocardiogram की समीक्षा'],
      userQuestions: ['Is the dizziness related to heart rhythm or BP medication?'],
      userQuestionsHi: ['क्या चक्कर दिल की धड़कन या BP की दवा से संबंधित है?'],
      materialsToBring: ['Previous ECG strips', 'Sterling Hospital Discharge Summary'],
      materialsToBringHi: ['पुराने ECG strips', 'Sterling Hospital Discharge Summary']
    }
  }
];

export const rameshDemoState: UserCareState = {
  profile: {
    id: 'ramesh-patel-demo',
    name: 'Ramesh Patel',
    roleTag: 'Papa (67)',
    roleTagHi: 'पापा (Papa - 67)',
    age: 67,
    city: 'Ahmedabad (Navrangpura)',
    avatarUrl: rameshAvatarPath,
    createdAt: '2026-03-10',
    isDemo: false,
    motivations: [
      'Managing care for parents',
      'Keeping reports and follow-ups in one place',
      'Be prepared for doctor visits',
      'Coordinating across family'
    ],
    motivationsHi: [
      'Parents की care manage करना',
      'Reports व follow-ups एक जगह रखना',
      'Doctor appointment के लिए तैयार रहना',
      'Family के साथ coordinate करना'
    ]
  },
  activeFamilyMemberId: 'ramesh-67',
  familyMembers: [
    rameshPatelMember,
    meenaPatelMember,
    priyaMember,
    rahulMember,
    aaravMember
  ],
  globalInbox: rameshPatelMember.inbox,
  territories: {
    routine: {
      title: 'Routine Care',
      description: 'Primary care, dental visits, vision checks, and general maintenance.',
      items: [
        {
          id: 'item-gp',
          territoryId: 'routine',
          title: 'Primary Care Doctor (GP)',
          subtitle: 'Dr. Vikram Shah · Navrangpura, Ahmedabad',
          status: 'covered',
          lastDate: '03 Oct 2026',
          dueDate: '11 Oct 2026',
          providerName: 'Dr. Vikram Shah',
          notes: 'Routine doctor for 14 years. Knows family history well.'
        },
        {
          id: 'item-dental',
          territoryId: 'routine',
          title: 'Dental Care',
          subtitle: 'Smile Dental Clinic · Bodakdev',
          status: 'covered',
          lastDate: '18 Mar 2026',
          dueDate: 'Nov 2026',
          providerName: 'Smile Dental'
        },
        {
          id: 'item-vision',
          territoryId: 'routine',
          title: 'Vision Care',
          subtitle: 'ClearView Optometry · Vastrapur',
          status: 'needs_organising',
          actionPrompt: 'Last eye power check was over 2 years ago'
        }
      ]
    },
    preventive: {
      title: 'Preventive Care',
      description: 'Annual health checks and routine screenings you choose to track.',
      items: [
        {
          id: 'item-annual',
          territoryId: 'preventive',
          title: 'Annual Executive Health Panel',
          subtitle: 'Sterling Diagnostic Labs',
          status: 'covered',
          lastDate: '02 Jul 2026',
          dueDate: 'Jul 2027'
        },
        {
          id: 'item-sugar',
          territoryId: 'preventive',
          title: 'Blood Glucose & HbA1c Monitoring',
          subtitle: '3-month periodic tracking',
          status: 'needs_attention',
          dueDate: 'December 2026',
          actionPrompt: 'Repeat fasting sugar check'
        }
      ]
    },
    ongoing: {
      title: 'Ongoing Care',
      description: 'Active prescriptions, BP monitoring, and daily medicines.',
      items: [
        {
          id: 'item-bp-meds',
          territoryId: 'ongoing',
          title: 'Current Medicines Reviewed',
          subtitle: 'Telmisartan 40mg · Metformin 500mg · Pantocid 40mg',
          status: 'covered',
          lastDate: '03 Oct 2026',
          notes: 'Dose adjusted by Dr Shah on 3 October.'
        },
        {
          id: 'item-physio',
          territoryId: 'ongoing',
          title: 'Physiotherapy & Morning Walking',
          subtitle: 'Gentle walking 30 mins · Low salt diet',
          status: 'covered'
        }
      ]
    },
    specialists: {
      title: 'Specialists',
      description: 'Specialist consultations and follow-up recommendations.',
      items: [
        {
          id: 'item-cardio',
          territoryId: 'specialists',
          title: 'Cardiology Baseline & 2D Echo',
          subtitle: 'Dr. Harish Mehta · C.G. Road',
          status: 'needs_attention',
          dueDate: 'Before 15 Oct',
          actionPrompt: 'Book consult following Sterling Hospital discharge'
        },
        {
          id: 'item-neuro',
          territoryId: 'specialists',
          title: 'Neurology / Vertigo Review',
          subtitle: 'Apex Neuro Clinic',
          status: 'upcoming',
          dueDate: 'Pending MRI Brain Report'
        }
      ]
    },
    commitments: {
      title: 'Care Commitments',
      description: 'Things that are supposed to happen next in your care.',
      items: [
        {
          id: 'item-commit-show-reports',
          territoryId: 'commitments',
          title: 'Show blood test reports to Dr Shah',
          subtitle: 'Apex lab reports from 27 Sep',
          status: 'needs_attention',
          dueDate: 'Tomorrow (Saturday)'
        },
        {
          id: 'item-commit-book-cardio',
          territoryId: 'commitments',
          title: 'Book appointment with Dr Harish Mehta',
          subtitle: 'Cardiology follow-up from hospital discharge',
          status: 'needs_attention',
          dueDate: 'Next Week'
        }
      ]
    },
    team: {
      title: 'Care Team',
      description: 'Your trusted healthcare doctors and clinics.',
      items: [
        {
          id: 'item-team-shah',
          territoryId: 'team',
          title: 'Dr. Vikram Shah',
          subtitle: 'Primary Care Physician · Navrangpura',
          status: 'covered'
        },
        {
          id: 'item-team-mehta',
          territoryId: 'team',
          title: 'Dr. Harish Mehta',
          subtitle: 'Cardiologist · C.G. Road',
          status: 'upcoming'
        },
        {
          id: 'item-team-sterling',
          territoryId: 'team',
          title: 'Sterling Hospital',
          subtitle: 'Emergency & Diagnostics · Gurukul',
          status: 'covered'
        }
      ]
    },
    records: {
      title: 'Records & History',
      description: 'Reports, prescriptions, and key care timeline moments.',
      items: [
        {
          id: 'item-rec-rx-oct',
          territoryId: 'records',
          title: 'Dr. Vikram Shah Prescription Note',
          subtitle: 'Uploaded 03 Oct by Neha via WhatsApp photo',
          status: 'covered',
          lastDate: '03 Oct 2026'
        },
        {
          id: 'item-rec-lab-sep',
          territoryId: 'records',
          title: 'Apex Diagnostic Comprehensive Metabolic Panel',
          subtitle: 'HbA1c 6.8% · Creatinine 1.0 · Fasting 124',
          status: 'covered',
          lastDate: '27 Sep 2026'
        },
        {
          id: 'item-rec-discharge-sep',
          territoryId: 'records',
          title: 'Sterling Hospital Emergency Discharge Summary',
          subtitle: 'Sudden dizziness observation · Dt: 14 Sep 2026',
          status: 'covered',
          lastDate: '14 Sep 2026'
        }
      ]
    },
    emergency: {
      title: 'Emergency Readiness',
      description: 'Key health details and emergency contact contacts.',
      items: [
        {
          id: 'item-emg-card',
          territoryId: 'emergency',
          title: 'Emergency Health Card',
          subtitle: 'B Positive (B+) · Penicillin allergy · Contacts on file',
          status: 'covered'
        }
      ]
    }
  },
  commitments: [
    {
      id: 'commit-1',
      title: 'Show Apex Lab Blood Reports to Dr. Vikram Shah',
      category: 'Blood Test',
      createdAt: '2026-09-27',
      dueDate: 'Tomorrow (Saturday, 11 Oct)',
      suggestedBy: 'Dr. Vikram Shah (Primary Care)',
      source: 'Prescription note and phone consult',
      whyItMatters: 'To review creatinine, lipid panel and HbA1c (6.8%) after adjusting Telmisartan BP medicine.',
      status: 'open',
      notes: 'Reports printed and in file folder ready with Neha.'
    },
    {
      id: 'commit-2',
      title: 'Book Cardiology Consult with Dr. Harish Mehta',
      category: 'Specialist',
      createdAt: '2026-09-14',
      dueDate: 'Before 15 October 2026',
      suggestedBy: 'Sterling Hospital Discharge Summary',
      source: 'Emergency discharge instructions',
      whyItMatters: 'To complete a 2D Echocardiogram and rule out cardiac causes behind the 4 dizziness episodes.',
      status: 'open',
      notes: 'Bhavik will book the morning slot online from Melbourne.'
    },
    {
      id: 'commit-3',
      title: 'Collect MRI Brain & Cervical Spine Report',
      category: 'Imaging',
      createdAt: '2026-10-01',
      dueDate: 'Friday Evening (10 Oct)',
      suggestedBy: 'Apex Neuro Diagnostic Center',
      whyItMatters: 'Check cervical spine or inner ear nerve causes for lightheadedness.',
      status: 'scheduled'
    }
  ],
  providers: [
    {
      id: 'prov-shah',
      name: 'Dr. Vikram Shah',
      role: 'Primary Care Physician',
      specialty: 'Internal Medicine / Family Physician',
      city: 'Ahmedabad',
      clinic: 'Shah Health Clinic, Navrangpura',
      contact: '+91 98250 12345',
      lastInteraction: '03 Oct 2026',
      nextFollowUp: '11 Oct 2026 (Saturday)',
      category: 'doctor',
      relationshipStatus: 'regular',
      isPrivateRecord: true,
      notes: 'Family doctor for 14 years. Extremely methodical and speaks Gujarati & Hindi warmly.'
    },
    {
      id: 'prov-mehta',
      name: 'Dr. Harish Mehta',
      role: 'Consultant Cardiologist',
      specialty: 'Interventional Cardiology & Heart Health',
      city: 'Ahmedabad',
      clinic: 'Heart Wellness Clinic, C.G. Road',
      contact: '+91 94260 54321',
      lastInteraction: 'Referred on 14 Sep',
      nextFollowUp: 'Appointment booking pending',
      category: 'specialist',
      relationshipStatus: 'preferred',
      isPrivateRecord: true,
      notes: 'Recommended by Sterling Hospital ER physician for 2D Echo review.'
    },
    {
      id: 'prov-parikh-pt',
      name: 'Dr. Snehal Parikh (PT)',
      role: 'Senior Physiotherapist',
      specialty: 'Gait & Balance Rehabilitation',
      city: 'Ahmedabad',
      clinic: 'ActiveLife Physio Clinic, Bodakdev',
      contact: '+91 98980 33221',
      lastInteraction: 'Consulted for post-hospital mobility',
      nextFollowUp: 'Weekly home session',
      category: 'physio',
      relationshipStatus: 'preferred',
      isPrivateRecord: true,
      notes: 'Focusing on quad strengthening and safe unassisted walking.'
    },
    {
      id: 'prov-apex-lab',
      name: 'Apex Diagnostic Labs',
      role: 'Diagnostic Pathology & Imaging',
      specialty: 'Clinical Biochemistry & Hematology',
      city: 'Ahmedabad',
      clinic: 'Drive-in Road Centre',
      contact: '+91 79 2685 4000',
      lastInteraction: '27 Sep 2026 (Blood panel)',
      nextFollowUp: 'Routine panel before next consult',
      category: 'diagnostic',
      relationshipStatus: 'regular',
      isPrivateRecord: true,
      notes: 'Reliable fast reports with home sample collection facility.'
    },
    {
      id: 'prov-sterling',
      name: 'Sterling Hospital',
      role: 'Hospital & Emergency Care',
      specialty: 'Multi-specialty Healthcare & Diagnostics',
      city: 'Ahmedabad',
      clinic: 'Sterling Hospital, Gurukul Road',
      contact: '+91 79 4001 2000',
      lastInteraction: '14 Sep 2026 (Discharged)',
      category: 'homecare',
      relationshipStatus: 'previously_visited',
      isPrivateRecord: true,
      notes: 'Discharge summary saved in MyCareMap records.'
    }
  ],
  appointments: rameshDemoAppointments,
  history: rameshDemoHistory,
  doctorInstructions: rameshDemoInstructions,
  activityLogs: rameshDemoActivityLogs,
  betweenVisitObservations: rameshDemoObservations,
  records: [
    {
      id: 'rec-rx-oct',
      title: 'Dr. Vikram Shah Prescription Note (03 Oct 2026)',
      date: '03 Oct 2026',
      providerName: 'Shah Health Clinic, Navrangpura',
      type: 'prescription',
      summary: 'Adjusted Telmisartan 40mg. Advised fasting blood sugar recheck. Discussed dizziness pattern.',
      fileSize: '890 KB'
    },
    {
      id: 'rec-apex-sep',
      title: 'Apex Diagnostics Comprehensive Metabolic & Lipid Panel',
      date: '27 Sep 2026',
      providerName: 'Apex Diagnostic Labs, Ahmedabad',
      type: 'lab_report',
      summary: 'HbA1c 6.8%, Fasting Glucose 124 mg/dL, Serum Creatinine 1.0 mg/dL, Total Cholesterol 192 mg/dL.',
      fileSize: '1.4 MB'
    },
    {
      id: 'rec-sterling-disch',
      title: 'Sterling Hospital Emergency Discharge Summary',
      date: '14 Sep 2026',
      providerName: 'Sterling Hospital Emergency Department',
      type: 'discharge',
      summary: 'Admitted for transient lightheadedness/dizziness. Troponin negative, ECG sinus rhythm. Advised GP follow-up & 2D Echo within 30 days.',
      fileSize: '2.1 MB'
    }
  ],
  emergencyCard: {
    name: 'Ramesh Patel',
    age: 67,
    bloodGroup: 'B Positive (B+)',
    allergies: ['Penicillin (skin rash observed in 2012)'],
    currentMedicines: [
      'Telmisartan 40mg (Morning - BP)',
      'Metformin 500mg (Dinner - Blood Sugar)',
      'Pantoprazole 40mg (Morning empty stomach)'
    ],
    importantConditions: [
      'Hypertension (BP)',
      'Type 2 Diabetes (Managed)',
      'Recent recurring dizziness (under investigation)'
    ],
    primaryDoctor: 'Dr. Vikram Shah (Shah Health Clinic, Navrangpura)',
    primaryDoctorContact: '+91 98250 12345',
    emergencyContactName: 'Neha Patel (Daughter) & Bhavik Patel (Son)',
    emergencyContactRelation: 'Daughter / Son',
    emergencyContactPhone: '+91 98250 99887 / +61 412 345 678',
    lastUpdated: '03 Oct 2026'
  },
  trustedContacts: [
    {
      id: 'tc-neha',
      name: 'Neha Patel',
      relation: 'Daughter',
      phone: '+91 98250 99887',
      email: 'neha.patel@gmail.com',
      permissions: {
        emergencyInfo: true,
        viewCareMap: true,
        helpUpdate: true
      }
    },
    {
      id: 'tc-bhavik',
      name: 'Bhavik Patel',
      relation: 'Son (Melbourne)',
      phone: '+61 412 345 678',
      email: 'bhavik@jackofai.com',
      permissions: {
        emergencyInfo: true,
        viewCareMap: true,
        helpUpdate: true
      }
    }
  ],
  lastReviewDate: '2026-10-03'
};

export const rohanDemoState = rameshDemoState;

export const initialAnalytics: ValidationAnalytics = {
  visitors: 412,
  checksStarted: 228,
  checksCompleted: 184,
  mapsSaved: 156,
  commitmentsCreated: 134,
  providersAdded: 102,
  recordsAdded: 88,
  prepUsed: 71,
  afterUpdateCompleted: 58,
  reviewsCompleted: 44,
  commitmentsCompleted: 39,
  signalsInspected: 94,
  familySwitches: 142,
  voiceNotesAdded: 67,
  whatsappSimulated: 83,
  doctorSummaryGenerated: 61,
  meraCareImpressions: 148,
  meraCareClicks: 64,
  meraCareReturns: 41,
  meraCareCategoriesClicked: {
    physiotherapy: 32,
    specialist: 14,
    diagnostics: 11,
    homecare: 7
  },
  meraCareSourcesClicked: {
    mycaremap_network: 26,
    mycaremap_next_step: 22,
    mycaremap_doctor_rec: 16
  },
  // Section 14 Conceptual Analytics Events
  care_map_created: 156,
  existing_provider_added: 102,
  consultation_recorded: 78,
  care_instruction_saved: 92,
  followup_updated: 64,
  visit_summary_prepared: 61,
  family_care_map_created: 48,
  meracare_link_viewed: 148,
  meracare_link_clicked: 64,
  incoming_meracare_visit: 53,
  incoming_user_onboarded: 41,
  motivations: {
    'Parents की care manage करना': 92,
    'Reports व follow-ups एक जगह रखना': 86,
    'Doctor appointment के लिए 2 मिनट में तैयार होना': 74,
    'Medical history साथ रखना — Doctor बदलने पर भी': 68,
    'Family के साथ coordinate करना': 81
  }
};

export const rameshMeraCareHandoff: MeraCareContextHandoff = {
  personName: 'Ramesh Patel',
  age: 67,
  city: 'Ahmedabad (Navrangpura)',
  situationTitle: 'Post-Discharge Mobility Recovery & Home Physiotherapy',
  situationTitleHi: 'डिस्चार्ज के बाद रिकवरी व होम फिजियोथेरेपी की जरूरत',
  needCategory: 'home_physio',
  triggerReason: 'Papa is finding it harder to walk steadily after returning home from Sterling Hospital. Lightheadedness and bed rest have reduced walking confidence.',
  triggerReasonHi: 'Sterling Hospital से डिस्चार्ज के बाद पापा को चलने में परेशानी हो रही है और कमजोरी की वजह से लड़खड़ाहट है।',
  recentEventContext: 'Sterling Hospital Emergency discharge (14 Sep 2026), transient dizziness observation. Primary physician Dr. Vikram Shah advised gentle physical rehabilitation & gait training.',
  familyCoordinatorName: 'Jay Patel',
  familyCoordinatorRole: 'Son · Family Navigator (Melbourne, Australia)',
  excludedSensitiveRecords: [
    'Smile Dental Routine Scaling & Crown Records (Not relevant to mobility)',
    'Routine Antacid (Pantocid) Refill Slips (Not relevant to mobility)',
    'ClearView Vision Power History (Not relevant to mobility)'
  ]
};

export interface PrototypeScenario {
  id: string;
  code: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  title: string;
  titleHi: string;
  subtitle: string;
  subtitleHi: string;
  description: string;
  descriptionHi: string;
  targetTab: string;
}

export const TEST_SCENARIOS: PrototypeScenario[] = [
  {
    id: 'scenario_a',
    code: 'A',
    title: 'MyCareMap-First User',
    titleHi: 'MyCareMap से शुरुआत',
    subtitle: 'Creates Care Map, records visit, explores physio on MeraCare without paywall',
    subtitleHi: 'केयर मैप बनाया, डॉक्टर विज़िट दर्ज की, बिना रुकावट MeraCare पर फिजियो खोजा',
    description: 'A new user creates a Care Map, records a doctor visit with Dr. Shah, and later needs physiotherapy. The user can navigate to MeraCare without paying or registering again for public browsing.',
    descriptionHi: 'नया यूज़र केयर मैप बनाता है, डॉक्टर विज़िट दर्ज करता है, और बाद में फिजियोथेरेपी की ज़रूरत पड़ने पर बिना किसी भुगतान के MeraCare पर खोज करता है।',
    targetTab: 'caremap'
  },
  {
    id: 'scenario_b',
    code: 'B',
    title: 'MeraCare-First User',
    titleHi: 'MeraCare से आने वाला यूज़र',
    subtitle: 'Arrives via MeraCare referral: "Found your care provider? Keep next steps organised"',
    subtitleHi: 'MeraCare से आगमन: "प्रदाता मिल गया? अगले कदम व्यवस्थित रखें" — मुफ़्त कोर एक्सेस',
    description: 'A user discovers a private physiotherapist on MeraCare, follows a link to MyCareMap, creates an account with free core access, manually saves the provider and records a follow-up. No paid upgrade required.',
    descriptionHi: 'यूज़र MeraCare पर फिजियोथेरेपिस्ट ढूंढकर MyCareMap पर आता है, मुफ़्त में प्रदाता सहेजता है और फॉलो-अप तय करता है।',
    targetTab: 'meracare_entry'
  },
  {
    id: 'scenario_c',
    code: 'C',
    title: 'Existing Provider',
    titleHi: 'मौजूदा डॉक्टर निजी तौर पर जोड़ना',
    subtitle: 'User adds their existing doctor privately without MeraCare participation',
    subtitleHi: 'बिना डॉक्टर रजिस्ट्रेशन या MeraCare के निजी रिकॉर्ड सहेजना',
    description: 'A user adds their existing family doctor privately. The doctor does not need a MyCareMap account or MeraCare directory listing. Records are kept strictly private.',
    descriptionHi: 'यूज़र अपने नियमित फैमिली डॉक्टर को निजी तौर पर जोड़ता है। डॉक्टर को किसी अकाउंट या MeraCare लिस्टिंग की आवश्यकता नहीं।',
    targetTab: 'team'
  },
  {
    id: 'scenario_d',
    code: 'D',
    title: 'Family Manager',
    titleHi: 'अधिकृत फैमिली मैनेजर',
    subtitle: 'Authorised family member coordinates care; records remain with correct person',
    subtitleHi: 'अधिकृत सदस्य (नेहा/जय) पापा की केयर संभालते हैं; रिकॉर्ड सही व्यक्ति के नाम रहता है',
    description: 'An authorised family member manages another person\'s appointments and follow-up information. All records remain associated with the correct person (Papa/Ramesh Patel). Not aged-care or government support rostering.',
    descriptionHi: 'परिवार का अधिकृत सदस्य दूसरे सदस्य के अपॉइंटमेंट व निर्देश संभालता है। मेडिकल पहचान हमेशा मरीज़ की ही रहती है।',
    targetTab: 'circle'
  },
  {
    id: 'scenario_e',
    code: 'E',
    title: 'No External Provider',
    titleHi: 'बिना बाहरी प्रदाता के निरंतरता',
    subtitle: 'User completes care loop, instructions & summary without MeraCare',
    subtitleHi: 'बिना किसी बाहरी प्रदाता या मार्केटप्लेस के अपनी केयर रूटीन पूरी करना',
    description: 'The user completes their personal care journey (recording instructions, checking off walking/exercises, preparing next appointment summary) entirely within MyCareMap without needing MeraCare.',
    descriptionHi: 'यूज़र बिना किसी बाहरी प्रदाता के अपनी पर्सनल केयर, डॉक्टर के निर्देश और अपॉइंटमेंट समरी की निरंतरता पूरी करता है।',
    targetTab: 'prep'
  },
  {
    id: 'scenario_f',
    code: 'F',
    title: 'Cross-Product Privacy',
    titleHi: 'क्रॉस-प्रोडक्ट डेटा सुरक्षा व गोपनीयता',
    subtitle: 'Zero sensitive data in URLs, analytics or unauthorised product records',
    subtitleHi: 'URL में कोई मरीज़ का नाम, बीमारी या पर्चा नहीं — केवल सुरक्षित गैर-संवेदनशील पैरामीटर',
    description: 'Verifies the strict privacy boundary: URLs between MyCareMap and MeraCare contain only sanitized category, city, and non-sensitive source tags. No patient names, medical histories, or notes are ever leaked.',
    descriptionHi: 'सत्यापित करता है कि दोनों प्रोडक्ट्स के बीच लिंक में कभी कोई संवेदनशील मेडिकल जानकारी नहीं जाती।',
    targetTab: 'team'
  },
  {
    id: 'scenario_g',
    code: 'G',
    title: 'Future Premium Review',
    titleHi: 'भविष्य का एकीकृत प्रीमियम (CARE_CONSUMER_PLUS)',
    subtitle: 'Conceptual entitlement architecture without duplicate consumer charges',
    subtitleHi: 'एक साझा उपभोक्ता लाभ — बिना दोबारा चार्ज किए; अभी कोई पेमेंट स्क्रीन नहीं',
    description: 'Reviews the conceptual CARE_CONSUMER_PLUS entitlement model: one unified consumer relationship across both products without duplicate subscription billing, maintaining independent user identities.',
    descriptionHi: 'भविष्य के साझा उपभोक्ता लाभ की रूपरेखा का परीक्षण — बिना किसी डुप्लीकेट चार्ज के, दोनों प्रोडक्ट्स के स्वतंत्र डेटाबेस सुरक्षित रखते हुए।',
    targetTab: 'entitlement_review'
  }
];

export const DEFAULT_ENTITLEMENT_INFO: ConsumerEntitlementInfo = {
  tier: 'CARE_FREE',
  isComplimentaryCore: true,
  entitlementId: 'ent-core-free-2026',
  description: 'Complimentary Core Access across MyCareMap & MeraCare',
  descriptionHi: 'MyCareMap और MeraCare दोनों पर मुफ़्त कोर एक्सेस',
  coreBenefits: [
    'Create and maintain personal Care Map for life',
    'Record and organise existing doctors & clinics privately',
    'Track doctor care instructions & follow-ups',
    '1-minute between-visit check-ins & activity tracking',
    'Generate concise 1-page Next Appointment Summary',
    'Basic family caregiver delegation & permission circle',
    'Non-sensitive contextual exploration on MeraCare'
  ],
  futurePlusBenefits: [
    'Advanced multi-person family care circle sync',
    'Intelligent document extraction & automated record parsing',
    'Extended care export passport for hospital transitions',
    'Unified concierge benefits without duplicate subscription charges'
  ],
  billingNotice: 'Core features remain free on both products. No duplicate consumer subscription charges.'
};

export function applyScenarioToState(baseState: UserCareState, scenarioId: string): UserCareState {
  const updated = JSON.parse(JSON.stringify(baseState)) as UserCareState;
  updated.activeScenarioId = scenarioId;

  if (scenarioId === 'scenario_d') {
    // Switch active family member to Papa
    updated.activeFamilyMemberId = 'member-ramesh';
  } else if (scenarioId === 'scenario_e') {
    // Ensure full personal continuity logs are loaded
    updated.activityLogs = rameshDemoActivityLogs;
    updated.betweenVisitObservations = rameshDemoObservations;
    updated.doctorInstructions = rameshDemoInstructions;
  } else {
    updated.activityLogs = rameshDemoActivityLogs;
    updated.betweenVisitObservations = rameshDemoObservations;
    updated.doctorInstructions = rameshDemoInstructions;
  }

  return updated;
}

