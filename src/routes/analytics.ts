import { Router, Request, Response } from 'express';
import { getAnalytics, trackAnalytics, resetAnalytics } from '../db';

export const analyticsRouter = Router();

// GET /api/analytics - Get 14 PMF validation metrics
analyticsRouter.get('/', (req: Request, res: Response) => {
  try {
    const data = getAnalytics();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve analytics' });
  }
});

// POST /api/analytics/track - Track PMF metric event
analyticsRouter.post('/track', (req: Request, res: Response) => {
  try {
    const { eventType, extra } = req.body;
    if (!eventType) {
      res.status(400).json({ success: false, error: 'eventType is required' });
      return;
    }

    const updated = trackAnalytics(eventType, extra);
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    res.status(500).json({ success: false, error: 'Failed to track event' });
  }
});

// POST /api/analytics/reset - Reset analytics metrics
analyticsRouter.post('/reset', (req: Request, res: Response) => {
  try {
    const reset = resetAnalytics();
    res.json({ success: true, message: 'Analytics counters reset', data: reset });
  } catch (error) {
    console.error('Error resetting analytics:', error);
    res.status(500).json({ success: false, error: 'Failed to reset analytics' });
  }
});
