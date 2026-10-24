import { Router, Request, Response } from 'express';
import { getAuditLogs } from '../db';

export const auditRouter = Router();

// GET /api/audit - Get immutable audit trail for DPDP Act compliance
auditRouter.get('/', (req: Request, res: Response) => {
  try {
    const logs = getAuditLogs();
    res.json({
      success: true,
      count: logs.length,
      complianceStandard: 'Digital Personal Data Protection Act, 2023 (Section 10)',
      data: logs
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch audit trail' });
  }
});
