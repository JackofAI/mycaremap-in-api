import { Router, Request, Response } from 'express';
import {
  getCommitments,
  addCommitment,
  updateCommitment,
  deleteCommitment
} from '../db';

export const commitmentsRouter = Router();

// GET /api/commitments - List all commitments
commitmentsRouter.get('/', (req: Request, res: Response) => {
  try {
    const commitments = getCommitments();
    const statusFilter = req.query.status as string;
    const categoryFilter = req.query.category as string;

    let filtered = commitments;
    if (statusFilter) {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    if (categoryFilter) {
      filtered = filtered.filter(c => c.category === categoryFilter);
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    console.error('Error fetching commitments:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch commitments' });
  }
});

// POST /api/commitments - Create a new commitment
commitmentsRouter.post('/', (req: Request, res: Response) => {
  try {
    const { title, category, dueDate, suggestedBy, whyItMatters, source, notes, status } = req.body;
    if (!title || !category || !dueDate) {
      res.status(400).json({ success: false, error: 'Title, category, and due date are required' });
      return;
    }

    const commitment = addCommitment({
      title,
      category,
      dueDate,
      suggestedBy: suggestedBy || 'Self',
      whyItMatters: whyItMatters || 'Routine follow-up',
      source: source || 'User entry',
      notes,
      status: status || 'open'
    });

    res.status(201).json({
      success: true,
      message: 'Care commitment created successfully',
      data: commitment
    });
  } catch (error) {
    console.error('Error creating commitment:', error);
    res.status(500).json({ success: false, error: 'Failed to create commitment' });
  }
});

// PATCH /api/commitments/:id - Update a commitment
commitmentsRouter.patch('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = updateCommitment(id, updates);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Commitment not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Care commitment updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating commitment:', error);
    res.status(500).json({ success: false, error: 'Failed to update commitment' });
  }
});

// DELETE /api/commitments/:id - Delete a commitment
commitmentsRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = deleteCommitment(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Commitment not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Care commitment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting commitment:', error);
    res.status(500).json({ success: false, error: 'Failed to delete commitment' });
  }
});
