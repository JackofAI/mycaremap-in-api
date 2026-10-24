import { Router, Request, Response } from 'express';
import {
  getRecords,
  addRecord,
  deleteRecord,
  getHistory,
  addHistoryEvent
} from '../db';

export const recordsRouter = Router();

// GET /api/records - List all health records
recordsRouter.get('/', (req: Request, res: Response) => {
  try {
    const records = getRecords();
    const typeFilter = req.query.type as string;
    let filtered = records;
    if (typeFilter) {
      filtered = filtered.filter(r => r.type === typeFilter);
    }
    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch records' });
  }
});

// POST /api/records - Add a new record
recordsRouter.post('/', (req: Request, res: Response) => {
  try {
    const { title, date, providerName, type, summary, fileSize, linkedCommitmentId } = req.body;
    if (!title || !type) {
      res.status(400).json({ success: false, error: 'Title and type are required' });
      return;
    }

    const newRecord = addRecord({
      title,
      date: date || new Date().toISOString().split('T')[0],
      providerName: providerName || 'Self uploaded',
      type,
      summary: summary || 'Document saved to records',
      fileSize: fileSize || '1.2 MB',
      linkedCommitmentId
    });

    res.status(201).json({
      success: true,
      message: 'Health record preserved successfully',
      data: newRecord
    });
  } catch (error) {
    console.error('Error adding record:', error);
    res.status(500).json({ success: false, error: 'Failed to add record' });
  }
});

// DELETE /api/records/:id - Delete a record
recordsRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = deleteRecord(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Record not found' });
      return;
    }

    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ success: false, error: 'Failed to delete record' });
  }
});

// GET /api/history - List longitudinal care history events
recordsRouter.get('/history', (req: Request, res: Response) => {
  try {
    const history = getHistory();
    res.json({ success: true, count: history.length, data: history });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch history' });
  }
});

// POST /api/history - Add a milestone event to care history
recordsRouter.post('/history', (req: Request, res: Response) => {
  try {
    const { date, title, category, providerName, description, addedBy, relatedCommitmentId } = req.body;
    if (!title) {
      res.status(400).json({ success: false, error: 'Event title is required' });
      return;
    }

    const newEvent = addHistoryEvent({
      date: date || new Date().toISOString().split('T')[0],
      title,
      category: category || 'Consultation',
      providerName,
      description: description || '',
      addedBy: addedBy || 'Self',
      relatedCommitmentId
    });

    res.status(201).json({
      success: true,
      message: 'Event added to longitudinal care history',
      data: newEvent
    });
  } catch (error) {
    console.error('Error adding history event:', error);
    res.status(500).json({ success: false, error: 'Failed to add history event' });
  }
});
