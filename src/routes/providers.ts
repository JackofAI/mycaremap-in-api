import { Router, Request, Response } from 'express';
import {
  getProviders,
  addProvider,
  updateProvider,
  deleteProvider
} from '../db';

export const providersRouter = Router();

// GET /api/providers - List all care team providers
providersRouter.get('/', (req: Request, res: Response) => {
  try {
    const providers = getProviders();
    const category = req.query.category as string;
    let filtered = providers;
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch providers' });
  }
});

// POST /api/providers - Add a new provider to care team
providersRouter.post('/', (req: Request, res: Response) => {
  try {
    const { name, role, specialty, city, clinic, contact, lastInteraction, nextFollowUp, notes, category, relationshipStatus } = req.body;
    if (!name || !specialty) {
      res.status(400).json({ success: false, error: 'Provider name and specialty are required' });
      return;
    }

    const newProvider = addProvider({
      name,
      role: role || specialty,
      specialty,
      city: city || 'Ahmedabad',
      clinic,
      contact,
      lastInteraction,
      nextFollowUp,
      notes,
      category: category || 'doctor',
      relationshipStatus: relationshipStatus || 'regular',
      isPrivateRecord: true
    });

    res.status(201).json({
      success: true,
      message: 'Care provider added to Care Team successfully',
      data: newProvider
    });
  } catch (error) {
    console.error('Error adding provider:', error);
    res.status(500).json({ success: false, error: 'Failed to add provider' });
  }
});

// PATCH /api/providers/:id - Update provider details
providersRouter.patch('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = updateProvider(id, updates);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Provider not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Care provider updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating provider:', error);
    res.status(500).json({ success: false, error: 'Failed to update provider' });
  }
});

// DELETE /api/providers/:id - Remove provider from care team
providersRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = deleteProvider(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Provider not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Care provider removed from Care Team successfully'
    });
  } catch (error) {
    console.error('Error deleting provider:', error);
    res.status(500).json({ success: false, error: 'Failed to delete provider' });
  }
});
