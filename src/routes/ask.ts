import { Router, Request, Response } from 'express';
import { askCareMap } from '../gemini';
import { getCareState } from '../db';

export const askRouter = Router();

// POST /api/ask - Ask MyCareMap questions about stored care context
askRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { question, userQuery } = req.body;
    const query = question || userQuery || '';

    if (!query || typeof query !== 'string') {
      res.status(400).json({ success: false, error: 'A valid question string is required' });
      return;
    }

    const state = getCareState();
    const result = await askCareMap(query, state);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error handling Ask CareMap query:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process inquiry with CareMap assistant'
    });
  }
});
