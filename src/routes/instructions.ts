import { Router, Request, Response } from 'express';
import {
  getDoctorInstructions,
  addDoctorInstruction,
  addActivityLog,
  addObservation,
  getCareState
} from '../db';

export const instructionsRouter = Router();

// GET /api/instructions - Get doctor instructions and between-visit tracking
instructionsRouter.get('/', (req: Request, res: Response) => {
  try {
    const instructions = getDoctorInstructions();
    const state = getCareState();
    res.json({
      success: true,
      data: {
        instructions,
        activityLogs: state.activityLogs || [],
        observations: state.betweenVisitObservations || []
      }
    });
  } catch (error) {
    console.error('Error fetching instructions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch doctor instructions' });
  }
});

// POST /api/instructions - Save new doctor care instruction
instructionsRouter.post('/', (req: Request, res: Response) => {
  try {
    const {
      date,
      doctorName,
      doctorId,
      specialty,
      visitPurpose,
      instructionsSummary,
      instructionsText,
      recommendedActivities,
      recommendedRoutines,
      medicationNotes,
      recommendedTestsOrFollowup,
      nextReviewDate,
      personalQuestionsNotes,
      sourceDocument
    } = req.body;

    if (!doctorName) {
      res.status(400).json({ success: false, error: 'Doctor name is required' });
      return;
    }

    const newInst = addDoctorInstruction({
      date: date || new Date().toISOString().split('T')[0],
      doctorName,
      doctorId,
      specialty,
      visitPurpose: visitPurpose || 'Follow-up consultation',
      instructionsSummary: instructionsSummary || instructionsText?.substring(0, 100) || 'Doctor instructions saved',
      instructionsText,
      recommendedActivities: recommendedActivities || [],
      recommendedRoutines: recommendedRoutines || [],
      medicationNotes,
      recommendedTestsOrFollowup,
      nextReviewDate,
      personalQuestionsNotes,
      sourceDocument
    });

    res.status(201).json({
      success: true,
      message: 'Doctor care instruction saved successfully',
      data: newInst
    });
  } catch (error) {
    console.error('Error saving instruction:', error);
    res.status(500).json({ success: false, error: 'Failed to save instruction' });
  }
});

// POST /api/instructions/activity-log - Log daily between-visit activity (walking, BP check)
instructionsRouter.post('/activity-log', (req: Request, res: Response) => {
  try {
    const { routineTitle, date, status, notes, loggedBy } = req.body;
    if (!routineTitle) {
      res.status(400).json({ success: false, error: 'Routine title is required' });
      return;
    }

    const log = addActivityLog({
      routineTitle,
      date: date || new Date().toISOString().split('T')[0],
      status: status || 'completed',
      notes,
      loggedBy: loggedBy || 'Self'
    });

    res.status(201).json({
      success: true,
      message: 'Between-visit activity logged successfully',
      data: log
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ success: false, error: 'Failed to log activity' });
  }
});

// POST /api/instructions/observation - Log between-visit symptom or observation for next doctor visit
instructionsRouter.post('/observation', (req: Request, res: Response) => {
  try {
    const { observation, date, questionForDoctor, severity, contextNotes, loggedBy } = req.body;
    if (!observation) {
      res.status(400).json({ success: false, error: 'Observation text is required' });
      return;
    }

    const obs = addObservation({
      observation,
      date: date || new Date().toISOString().split('T')[0],
      questionForDoctor,
      severity: severity || 'mild',
      contextNotes,
      loggedBy: loggedBy || 'Self'
    });

    res.status(201).json({
      success: true,
      message: 'Observation saved for next doctor review',
      data: obs
    });
  } catch (error) {
    console.error('Error saving observation:', error);
    res.status(500).json({ success: false, error: 'Failed to save observation' });
  }
});
