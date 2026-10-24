import { Router, Request, Response } from 'express';
import {
  getInboxItems,
  updateInboxItemStatus,
  getCareState,
  saveCareState
} from '../db';
import { CareInboxItem } from '../types/careMap';

export const inboxRouter = Router();

// GET /api/inbox - List all care inbox items
inboxRouter.get('/', (req: Request, res: Response) => {
  try {
    const items = getInboxItems();
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error('Error fetching inbox:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch inbox items' });
  }
});

// POST /api/inbox - Add an unstructured entry (WhatsApp, audio note, document scan)
inboxRouter.post('/', (req: Request, res: Response) => {
  try {
    const { type, title, senderName, rawContent, extractedSummary } = req.body;
    if (!title || !type) {
      res.status(400).json({ success: false, error: 'Title and type are required' });
      return;
    }

    const newItem: CareInboxItem = {
      id: `inbox-${Date.now()}`,
      type,
      title,
      receivedAt: new Date().toISOString().split('T')[0],
      senderName: senderName || 'Self',
      rawContent,
      extractedSummary: extractedSummary || {},
      status: 'unreviewed'
    };

    const state = getCareState();
    const activeMember = state.familyMembers?.find(m => m.id === state.activeFamilyMemberId);
    if (activeMember) {
      activeMember.inbox = [newItem, ...(activeMember.inbox || [])];
    } else {
      state.globalInbox = [newItem, ...(state.globalInbox || [])];
    }

    saveCareState(state);
    res.status(201).json({
      success: true,
      message: 'Item added to Care Inbox for review',
      data: newItem
    });
  } catch (error) {
    console.error('Error adding inbox item:', error);
    res.status(500).json({ success: false, error: 'Failed to add inbox item' });
  }
});

// POST /api/inbox/:id/confirm - Confirm extracted care instructions into commitments
inboxRouter.post('/:id/confirm', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ok = updateInboxItemStatus(id, 'confirmed');
    if (!ok) {
      res.status(404).json({ success: false, error: 'Inbox item not found' });
      return;
    }

    res.json({ success: true, message: 'Inbox item confirmed and integrated into Care Map' });
  } catch (error) {
    console.error('Error confirming inbox item:', error);
    res.status(500).json({ success: false, error: 'Failed to confirm item' });
  }
});

// POST /api/inbox/:id/dismiss - Dismiss inbox item
inboxRouter.post('/:id/dismiss', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ok = updateInboxItemStatus(id, 'dismissed');
    if (!ok) {
      res.status(404).json({ success: false, error: 'Inbox item not found' });
      return;
    }

    res.json({ success: true, message: 'Inbox item dismissed' });
  } catch (error) {
    console.error('Error dismissing inbox item:', error);
    res.status(500).json({ success: false, error: 'Failed to dismiss item' });
  }
});
