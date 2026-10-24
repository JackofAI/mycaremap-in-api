import { Router, Request, Response } from 'express';
import { getSignals, dismissSignal } from '../db';

export const signalsRouter = Router();

// GET /api/signals - List all care signals and patterns
signalsRouter.get('/', (req: Request, res: Response) => {
  try {
    const signals = getSignals();
    res.json({ success: true, count: signals.length, data: signals });
  } catch (error) {
    console.error('Error fetching signals:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch signals' });
  }
});

// POST /api/signals/:id/dismiss - Dismiss a pattern signal
signalsRouter.post('/:id/dismiss', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ok = dismissSignal(id);
    if (!ok) {
      res.status(404).json({ success: false, error: 'Signal not found' });
      return;
    }

    res.json({ success: true, message: 'Care signal dismissed' });
  } catch (error) {
    console.error('Error dismissing signal:', error);
    res.status(500).json({ success: false, error: 'Failed to dismiss signal' });
  }
});
