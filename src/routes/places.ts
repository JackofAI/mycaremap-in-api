import { Router, Request, Response } from 'express';
import { searchNearbyPlaces } from '../places';

export const placesRouter = Router();

// GET /api/places/nearby - Search nearby healthcare facilities via Google Places API
placesRouter.get('/nearby', async (req: Request, res: Response) => {
  try {
    const { query, category, locality } = req.query as Record<string, string | undefined>;
    const result = await searchNearbyPlaces({ query, category, locality });
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error('[Places Route] Error searching nearby places:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to search nearby places' });
  }
});
