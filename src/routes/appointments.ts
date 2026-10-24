import { Router, Request, Response } from 'express';
import {
  getAppointments,
  addAppointment,
  updateAppointment,
  updateAppointmentPrep,
  processAfterAppointment
} from '../db';

export const appointmentsRouter = Router();

// GET /api/appointments - List all appointments
appointmentsRouter.get('/', (req: Request, res: Response) => {
  try {
    const appointments = getAppointments();
    const statusFilter = req.query.status as string;

    let filtered = appointments;
    if (statusFilter) {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch appointments' });
  }
});

// POST /api/appointments - Create an appointment
appointmentsRouter.post('/', (req: Request, res: Response) => {
  try {
    const { providerName, specialty, date, time, location, city, preparation } = req.body;
    if (!providerName || !specialty || !date) {
      res.status(400).json({ success: false, error: 'Provider name, specialty, and date are required' });
      return;
    }

    const newApt = addAppointment({
      providerName,
      specialty,
      date,
      time: time || '10:00 AM',
      location: location || 'Clinic Consultation',
      city: city || 'Ahmedabad',
      status: 'upcoming',
      preparation: preparation || {
        recentChanges: [],
        discussionTopics: [],
        userQuestions: [],
        materialsToBring: ['Prescriptions', 'Recent test reports']
      }
    });

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: newApt
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ success: false, error: 'Failed to create appointment' });
  }
});

// PATCH /api/appointments/:id - Update an appointment
appointmentsRouter.patch('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = updateAppointment(id, updates);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Appointment not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ success: false, error: 'Failed to update appointment' });
  }
});

// POST /api/appointments/:id/prep - Update before-visit preparation pack
appointmentsRouter.post('/:id/prep', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const prepData = req.body;

    const updated = updateAppointmentPrep(id, prepData);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Appointment not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Appointment preparation pack updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating appointment prep:', error);
    res.status(500).json({ success: false, error: 'Failed to update appointment prep' });
  }
});

// POST /api/appointments/:id/after - Process after-appointment loop (outcomes, commitments, instructions)
appointmentsRouter.post('/:id/after', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { outcomeNotes, newCommitments, nextVisitDate, doctorInstruction } = req.body;

    const result = processAfterAppointment(id, {
      outcomeNotes,
      newCommitments,
      nextVisitDate,
      doctorInstruction
    });

    if (!result) {
      res.status(404).json({ success: false, error: 'Appointment not found' });
      return;
    }

    res.json({
      success: true,
      message: 'After-appointment notes and follow-up commitments saved successfully',
      data: result
    });
  } catch (error) {
    console.error('Error processing after-appointment loop:', error);
    res.status(500).json({ success: false, error: 'Failed to process after-appointment' });
  }
});
