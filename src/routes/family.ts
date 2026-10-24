import { Router, Request, Response } from 'express';
import {
  getFamilyMembers,
  switchFamilyMember,
  addFamilyMember,
  getCareState,
  saveCareState
} from '../db';
import { CareCircleMember } from '../types/careMap';

export const familyRouter = Router();

// GET /api/family - Get all family members and care circles
familyRouter.get('/', (req: Request, res: Response) => {
  try {
    const state = getCareState();
    res.json({
      success: true,
      data: {
        activeMemberId: state.activeFamilyMemberId,
        members: state.familyMembers || [],
        emergencyCard: state.emergencyCard,
        trustedContacts: state.trustedContacts || []
      }
    });
  } catch (error) {
    console.error('Error fetching family:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch family members' });
  }
});

// POST /api/family/switch - Switch active family member profile
familyRouter.post('/switch', (req: Request, res: Response) => {
  try {
    const { memberId } = req.body;
    if (!memberId) {
      res.status(400).json({ success: false, error: 'Member ID is required' });
      return;
    }

    const state = switchFamilyMember(memberId);
    res.json({
      success: true,
      message: 'Active profile switched successfully',
      data: {
        activeMemberId: state.activeFamilyMemberId
      }
    });
  } catch (error) {
    console.error('Error switching family member:', error);
    res.status(500).json({ success: false, error: 'Failed to switch member' });
  }
});

// POST /api/family/member - Add new family member
familyRouter.post('/member', (req: Request, res: Response) => {
  try {
    const { name, relationTitle, age, city, conditionsSummary, activeMedications } = req.body;
    if (!name || !relationTitle) {
      res.status(400).json({ success: false, error: 'Name and relation title are required' });
      return;
    }

    const newMember = addFamilyMember({
      name,
      relationTitle,
      relationTitleHi: relationTitle,
      age: Number(age) || 40,
      city: city || 'Ahmedabad',
      conditionsSummary: conditionsSummary || 'Routine healthcare management',
      conditionsSummaryHi: conditionsSummary || 'Routine स्वास्थ्य प्रबंधन',
      activeMedications: activeMedications || [],
      careCircle: [],
      signals: [],
      nextTasks: [],
      inbox: []
    });

    res.status(201).json({
      success: true,
      message: 'Family member profile created successfully',
      data: newMember
    });
  } catch (error) {
    console.error('Error adding family member:', error);
    res.status(500).json({ success: false, error: 'Failed to add family member' });
  }
});

// POST /api/family/circle - Add trusted care circle contact / permissions
familyRouter.post('/circle', (req: Request, res: Response) => {
  try {
    const { memberId, helper } = req.body;
    if (!memberId || !helper || !helper.name) {
      res.status(400).json({ success: false, error: 'Member ID and helper info are required' });
      return;
    }

    const state = getCareState();
    const fam = state.familyMembers?.find(m => m.id === memberId);
    if (!fam) {
      res.status(404).json({ success: false, error: 'Family member not found' });
      return;
    }

    const newCircleMember: CareCircleMember = {
      id: `cc-${Date.now()}`,
      name: helper.name,
      relation: helper.relation || 'Family Helper',
      relationHi: helper.relationHi || helper.relation || 'पारिवारिक सहयोगी',
      location: helper.location || 'Local',
      helperRole: helper.helperRole || 'partner',
      helperRoleLabel: helper.helperRoleLabel || 'Care Partner',
      helperRoleLabelHi: helper.helperRoleLabelHi || 'केयर पार्टनर',
      canViewAppointments: helper.canViewAppointments !== false,
      canAddReports: helper.canAddReports !== false,
      canManageFollowups: helper.canManageFollowups !== false,
      canViewPrivateNotes: Boolean(helper.canViewPrivateNotes)
    };

    fam.careCircle = [...(fam.careCircle || []), newCircleMember];
    saveCareState(state);

    res.status(201).json({
      success: true,
      message: 'Care Circle helper added successfully',
      data: newCircleMember
    });
  } catch (error) {
    console.error('Error adding care circle member:', error);
    res.status(500).json({ success: false, error: 'Failed to add care circle member' });
  }
});
