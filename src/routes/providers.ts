import { Router, Request, Response } from 'express';
import {
  getProviders,
  findProviderByPlaceId,
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

// GET /api/providers/by-place/:placeId - Look up provider by Google Place ID
providersRouter.get('/by-place/:placeId', (req: Request, res: Response) => {
  try {
    const { placeId } = req.params;
    const provider = findProviderByPlaceId(placeId);
    if (!provider) {
      res.status(404).json({ success: false, error: 'Provider not found with given Place ID' });
      return;
    }
    res.json({ success: true, data: provider });
  } catch (error) {
    console.error('Error looking up provider by Place ID:', error);
    res.status(500).json({ success: false, error: 'Failed to look up provider by Place ID' });
  }
});

// POST /api/providers - Add a new provider to care team (idempotent on placeId)
providersRouter.post('/', (req: Request, res: Response) => {
  try {
    const {
      name,
      role,
      specialty,
      city,
      clinic,
      contact,
      address,
      placeId,
      place_id,
      ratingScore,
      reviewCount,
      lastInteraction,
      nextFollowUp,
      notes,
      category,
      relationshipStatus
    } = req.body;

    if (!name || !specialty) {
      res.status(400).json({ success: false, error: 'Provider name and specialty are required' });
      return;
    }

    const targetPlaceId = placeId || place_id;

    const newProvider = addProvider({
      name,
      role: role || specialty,
      specialty,
      city: city || 'Ahmedabad',
      clinic,
      contact,
      address,
      placeId: targetPlaceId,
      place_id: targetPlaceId,
      ratingScore,
      reviewCount,
      lastInteraction: lastInteraction || new Date().toISOString().split('T')[0],
      nextFollowUp,
      notes,
      category: category || 'doctor',
      relationshipStatus: relationshipStatus || 'regular',
      isPrivateRecord: true
    });

    res.status(201).json({
      success: true,
      message: 'Care provider saved to Care Team successfully',
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
