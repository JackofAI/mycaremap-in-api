import { Router, Request, Response } from 'express';
import {
  getCareState,
  saveCareState,
  resetToDemo,
  createFreshUser,
  calculateCompleteness,
  getUserByToken,
  saveUserCareState
} from '../db';

export const caremapRouter = Router();

function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

// GET /api/caremap - Retrieve current user care state and completeness
caremapRouter.get('/', (req: Request, res: Response) => {
  try {
    const token = getBearerToken(req);
    const user = token ? getUserByToken(token) : null;
    const state = user ? user.careState : getCareState();
    const completeness = calculateCompleteness(state);
    res.json({
      success: true,
      data: {
        state,
        completeness,
        userId: user ? user.id : null
      }
    });
  } catch (error) {
    console.error('Error fetching care state:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve care state' });
  }
});

// PUT /api/caremap - Update current user care state
caremapRouter.put('/', (req: Request, res: Response) => {
  try {
    const newState = req.body;
    if (!newState || !newState.profile) {
      res.status(400).json({ success: false, error: 'Invalid care state payload' });
      return;
    }

    const token = getBearerToken(req);
    const user = token ? getUserByToken(token) : null;
    const saved = user ? saveUserCareState(user.id, newState) : saveCareState(newState);
    const completeness = calculateCompleteness(saved);
    res.json({
      success: true,
      data: {
        state: saved,
        completeness,
        userId: user ? user.id : null
      }
    });
  } catch (error) {
    console.error('Error saving care state:', error);
    res.status(500).json({ success: false, error: 'Failed to save care state' });
  }
});

// POST /api/caremap/reset - Reset to clean production fresh state
caremapRouter.post('/reset', (req: Request, res: Response) => {
  try {
    const resetState = resetToDemo();
    const completeness = calculateCompleteness(resetState);
    res.json({
      success: true,
      message: 'Care map reset to clean production state successfully',
      data: {
        state: resetState,
        completeness
      }
    });
  } catch (error) {
    console.error('Error resetting to clean state:', error);
    res.status(500).json({ success: false, error: 'Failed to reset care state' });
  }
});

// POST /api/caremap/fresh - Initialize fresh user onboarding state
caremapRouter.post('/fresh', (req: Request, res: Response) => {
  try {
    const { name, age, city, motivations } = req.body;
    const freshState = createFreshUser(name, Number(age), city, motivations || []);
    const completeness = calculateCompleteness(freshState);
    res.json({
      success: true,
      message: 'Fresh user care map created successfully',
      data: {
        state: freshState,
        completeness
      }
    });
  } catch (error) {
    console.error('Error creating fresh user state:', error);
    res.status(500).json({ success: false, error: 'Failed to create fresh state' });
  }
});

// POST /api/caremap/import - Import provider, appointment, and care instructions from MeraCare
caremapRouter.post('/import', (req: Request, res: Response) => {
  try {
    const token = getBearerToken(req);
    const user = token ? getUserByToken(token) : null;
    const currentState = user ? user.careState : getCareState();

    const {
      source = 'meracare',
      provider,
      appointment,
      instruction,
      commitment
    } = req.body;

    const updatedState = JSON.parse(JSON.stringify(currentState));
    const importedSummary: Record<string, any> = {};

    // 1. Process Provider
    if (provider && provider.name && provider.name.trim()) {
      const pName = provider.name.trim();
      const existingIdx = updatedState.providers.findIndex(
        (p: any) => p.name.trim().toLowerCase() === pName.toLowerCase()
      );

      if (existingIdx >= 0) {
        const existing = updatedState.providers[existingIdx];
        if (!existing.clinic && provider.clinic) existing.clinic = provider.clinic;
        if (!existing.contact && provider.contact) existing.contact = provider.contact;
        if (!existing.specialty && provider.specialty) existing.specialty = provider.specialty;
        importedSummary.provider = existing;
      } else {
        const newProvider = {
          id: `prov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: pName,
          role: provider.role || provider.specialty || 'Consultant Specialist',
          specialty: provider.specialty || 'General Medicine',
          city: provider.city || updatedState.profile?.city || 'Ahmedabad',
          clinic: provider.clinic || '',
          contact: provider.contact || '',
          relationshipStatus: 'regular',
          category: 'doctor',
          isPrivateRecord: true,
          notes: provider.notes || `Referred / booked via ${source}`
        };
        updatedState.providers.push(newProvider);
        importedSummary.provider = newProvider;
      }
    }

    // 2. Process Appointment
    if (appointment && (appointment.date || appointment.doctorName || provider?.name)) {
      const apptDoctor = appointment.doctorName || provider?.name || 'Specialist Consultation';
      const apptSpecialty = appointment.specialty || provider?.specialty || 'Consultation';
      const newAppointment = {
        id: `appt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        providerName: apptDoctor,
        specialty: apptSpecialty,
        date: appointment.date || new Date().toISOString().split('T')[0],
        time: appointment.time || '10:00 AM',
        location: appointment.location || appointment.clinic || provider?.clinic || 'Clinic',
        city: appointment.city || provider?.city || updatedState.profile?.city || 'Ahmedabad',
        status: 'upcoming',
        notes: appointment.notes || appointment.visitPurpose || `Booked through ${source}`,
        isCompleted: false
      };
      updatedState.appointments = updatedState.appointments || [];
      updatedState.appointments.push(newAppointment);
      importedSummary.appointment = newAppointment;
    }

    // 3. Process Doctor Instruction
    if (instruction && instruction.instructionsSummary) {
      const newInstruction = {
        id: `ins-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        date: instruction.date || new Date().toISOString().split('T')[0],
        doctorName: instruction.doctorName || provider?.name || 'Consultant',
        specialty: instruction.specialty || provider?.specialty || '',
        visitPurpose: instruction.visitPurpose || 'Consultation Review',
        instructionsSummary: instruction.instructionsSummary,
        medicationNotes: instruction.medicationNotes || '',
        recommendedTestsOrFollowup: instruction.recommendedTestsOrFollowup || '',
        nextReviewDate: instruction.nextReviewDate || '',
        recommendedRoutines: instruction.recommendedRoutines || []
      };
      updatedState.doctorInstructions = updatedState.doctorInstructions || [];
      updatedState.doctorInstructions.push(newInstruction);
      importedSummary.instruction = newInstruction;
    }

    // 4. Process Commitment
    if (commitment && commitment.title) {
      const newCommitment = {
        id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: commitment.title,
        category: commitment.category || 'Follow-up',
        createdAt: new Date().toISOString().split('T')[0],
        dueDate: commitment.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        suggestedBy: commitment.suggestedBy || provider?.name || 'MeraCare Doctor',
        source: source,
        whyItMatters: commitment.whyItMatters || 'Care continuity and follow-up',
        status: 'open',
        notes: commitment.notes || ''
      };
      updatedState.commitments = updatedState.commitments || [];
      updatedState.commitments.push(newCommitment);
      importedSummary.commitment = newCommitment;
    }

    // Save state
    const saved = user ? saveUserCareState(user.id, updatedState) : saveCareState(updatedState);
    const completeness = calculateCompleteness(saved);

    res.json({
      success: true,
      message: 'Care data successfully imported from MeraCare to MyCareMap',
      data: {
        state: saved,
        completeness,
        imported: importedSummary
      }
    });
  } catch (error) {
    console.error('Error importing care data:', error);
    res.status(500).json({ success: false, error: 'Failed to import care data' });
  }
});

