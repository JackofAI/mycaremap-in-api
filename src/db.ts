import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import {
  UserCareState,
  ValidationAnalytics,
  CareCommitment,
  CareProvider,
  Appointment,
  CareRecord,
  CareEvent,
  DoctorCareInstruction,
  BetweenVisitActivityLog,
  BetweenVisitObservation,
  FamilyMember,
  CareCircleMember,
  CareInboxItem,
  CareSignal
} from './types/careMap';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = process.env.DATA_DIR || path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'caremap_store.json');
const USERS_FILE = path.resolve(DATA_DIR, 'users.json');
const AUDIT_FILE = path.resolve(DATA_DIR, 'audit_logs.json');

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details?: Record<string, any>;
  ip?: string;
}

interface DatabaseSchema {
  version: string;
  lastUpdated: string;
  careState: UserCareState;
  analytics: ValidationAnalytics;
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function createCleanCareState(name = '', age = 0, city = '', motivations: string[] = []): UserCareState {
  return {
    profile: {
      id: 'usr-' + Date.now(),
      name: name,
      age: age,
      city: city,
      createdAt: new Date().toISOString().split('T')[0],
      isDemo: false,
      motivations: motivations.length ? motivations : ['Keep routine care organised', 'Remember follow-ups', 'Know what is coming next']
    },
    activeFamilyMemberId: 'self-1',
    familyMembers: [
      {
        id: 'self-1',
        name: name,
        relationTitle: 'Self',
        relationTitleHi: 'खुद (Self)',
        age: age,
        city: city,
        conditionsSummary: '',
        conditionsSummaryHi: '',
        activeMedications: [],
        isDemoPrimary: false,
        isElderly: Boolean(age && age >= 60),
        careCircle: [],
        signals: [],
        nextTasks: [],
        inbox: []
      }
    ],
    globalInbox: [],
    territories: {
      routine: {
        title: 'Routine Care',
        description: 'Primary care, dental, vision, and regular health checkups.',
        items: [
          {
            id: 'fresh-gp',
            territoryId: 'routine',
            title: 'Primary Care Doctor',
            subtitle: 'Not yet recorded',
            status: 'needs_organising',
            actionPrompt: 'Add your regular doctor or clinic'
          },
          {
            id: 'fresh-dental',
            territoryId: 'routine',
            title: 'Dental Care',
            subtitle: 'Not yet recorded',
            status: 'needs_organising',
            actionPrompt: 'Add your last dental visit or dentist'
          },
          {
            id: 'fresh-vision',
            territoryId: 'routine',
            title: 'Vision Care',
            subtitle: 'Not yet recorded',
            status: 'needs_organising',
            actionPrompt: 'Add the date of your last eye check'
          }
        ]
      },
      preventive: {
        title: 'Preventive Care',
        description: 'Screenings, annual wellness discussions, and routine panels.',
        items: [
          {
            id: 'fresh-preventive-1',
            territoryId: 'preventive',
            title: 'Annual Health Check',
            subtitle: 'Routine checkup discussion',
            status: 'needs_organising',
            actionPrompt: 'Record your most recent health checkup'
          }
        ]
      },
      ongoing: {
        title: 'Ongoing Care',
        description: 'Regular medicines, health factors, and current therapies.',
        items: [
          {
            id: 'fresh-meds',
            territoryId: 'ongoing',
            title: 'Current Medicines Reviewed',
            subtitle: 'No chronic medicines recorded',
            status: 'needs_organising',
            actionPrompt: 'Review current vitamins or regular medicines'
          }
        ]
      },
      specialists: {
        title: 'Specialists',
        description: 'Consultations, specialist doctors, and ongoing specialist notes.',
        items: []
      },
      commitments: {
        title: 'Care Commitments',
        description: 'Important follow-ups, pending tests, and promised reviews.',
        items: []
      },
      team: {
        title: 'Care Team',
        description: 'Your doctors, dentists, and health professionals.',
        items: []
      },
      records: {
        title: 'Records & History',
        description: 'Prescriptions, lab PDFs, and milestone care moments.',
        items: []
      },
      emergency: {
        title: 'Emergency Readiness',
        description: 'Key health details and emergency contact.',
        items: [
          {
            id: 'fresh-emg',
            territoryId: 'emergency',
            title: 'Emergency Contact & Health Card',
            subtitle: 'Needs primary contact and blood group',
            status: 'needs_organising',
            actionPrompt: 'Add emergency contact details'
          }
        ]
      }
    },
    commitments: [],
    providers: [],
    appointments: [],
    history: [],
    records: [],
    doctorInstructions: [],
    activityLogs: [],
    betweenVisitObservations: [],
    emergencyCard: {
      name: name,
      age: age,
      bloodGroup: 'Not recorded',
      allergies: [],
      currentMedicines: [],
      importantConditions: [],
      primaryDoctor: 'Not assigned',
      primaryDoctorContact: '',
      emergencyContactName: 'Not set',
      emergencyContactRelation: '',
      emergencyContactPhone: '',
      lastUpdated: new Date().toISOString().split('T')[0]
    },
    trustedContacts: [],
    lastReviewDate: undefined
  };
}

export function createCleanAnalytics(): ValidationAnalytics {
  return {
    visitors: 0,
    checksStarted: 0,
    checksCompleted: 0,
    mapsSaved: 0,
    commitmentsCreated: 0,
    providersAdded: 0,
    recordsAdded: 0,
    prepUsed: 0,
    afterUpdateCompleted: 0,
    reviewsCompleted: 0,
    commitmentsCompleted: 0,
    signalsInspected: 0,
    familySwitches: 0,
    voiceNotesAdded: 0,
    whatsappSimulated: 0,
    doctorSummaryGenerated: 0,
    motivations: {},
    meraCareImpressions: 0,
    meraCareClicks: 0,
    meraCareReturns: 0,
    meraCareCategoriesClicked: {
      physiotherapy: 0,
      specialist: 0,
      diagnostics: 0,
      homecare: 0
    },
    meraCareSourcesClicked: {},
    care_map_created: 0,
    existing_provider_added: 0,
    consultation_recorded: 0,
    care_instruction_saved: 0,
    followup_updated: 0,
    visit_summary_prepared: 0
  };
}

function initializeDatabase(): DatabaseSchema {
  const initialData: DatabaseSchema = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    careState: createCleanCareState(),
    analytics: createCleanAnalytics()
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    logAudit('SYSTEM_INIT', 'system', { message: 'Initialized database with clean production state' });
  } catch (err) {
    console.error('[DB] Failed to initialize database file:', err);
  }

  return initialData;
}

function readDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return initializeDatabase();
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.careState) {
      return initializeDatabase();
    }
    return parsed;
  } catch (err) {
    console.error('[DB] Error reading database file, returning default fallback:', err);
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      careState: createCleanCareState(),
      analytics: createCleanAnalytics()
    };
  }
}

function writeDatabase(data: DatabaseSchema): void {
  try {
    data.lastUpdated = new Date().toISOString();
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('[DB] Atomic write failed:', err);
  }
}

export function logAudit(action: string, actor: string = 'user', details?: Record<string, any>, ip?: string): void {
  try {
    const entry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      details,
      ip
    };

    let logs: AuditEntry[] = [];
    if (fs.existsSync(AUDIT_FILE)) {
      try {
        logs = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf-8'));
      } catch {
        logs = [];
      }
    }
    logs.push(entry);
    // Keep last 1000 audit logs
    if (logs.length > 1000) {
      logs = logs.slice(-1000);
    }
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (e) {
    console.error('[DB] Failed to write audit log:', e);
  }
}

export function getAuditLogs(): AuditEntry[] {
  try {
    if (fs.existsSync(AUDIT_FILE)) {
      return JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('[DB] Failed to read audit logs:', e);
  }
  return [];
}

export function getCareState(): UserCareState {
  const db = readDatabase();
  return db.careState;
}

export function saveCareState(newState: UserCareState, actor = 'user'): UserCareState {
  const db = readDatabase();
  db.careState = newState;
  writeDatabase(db);
  logAudit('UPDATE_CARE_STATE', actor, { profileId: newState.profile.id, name: newState.profile.name });
  return db.careState;
}

export function resetToDemo(actor = 'user'): UserCareState {
  const db = readDatabase();
  db.careState = createCleanCareState();
  writeDatabase(db);
  logAudit('RESET_TO_FRESH', actor, { message: 'Reset care map to clean production state' });
  return db.careState;
}

export function createFreshUser(userName: string, age: number, city: string, motivations: string[], actor = 'user'): UserCareState {
  const fresh = createCleanCareState(userName, age, city, motivations);
  saveCareState(fresh, actor);
  logAudit('CREATE_FRESH_USER', actor, { name: userName, city });
  return fresh;
}

export function calculateCompleteness(state: UserCareState): {
  percentage: number;
  coveredPoints: string[];
  missingPoints: string[];
} {
  const covered: string[] = [];
  const missing: string[] = [];

  if (state.profile.name && state.profile.city) {
    covered.push('Basic profile and city set');
  } else {
    missing.push('Basic profile incomplete');
  }

  if (state.emergencyCard?.emergencyContactName && state.emergencyCard.emergencyContactName !== 'Not set') {
    covered.push('Emergency contact recorded');
  } else {
    missing.push('Emergency contact not added');
  }

  const hasGp = state.providers?.some(p =>
    p.role.toLowerCase().includes('primary') ||
    p.role.toLowerCase().includes('gp') ||
    p.specialty.toLowerCase().includes('family') ||
    p.specialty.toLowerCase().includes('general')
  );
  if (hasGp || state.territories?.routine?.items.some(i => i.title.includes('Primary') && i.status === 'covered')) {
    covered.push('Primary doctor / GP connected');
  } else {
    missing.push('Primary doctor not added');
  }

  const dentalItem = state.territories?.routine?.items.find(i => i.title.toLowerCase().includes('dental'));
  if (dentalItem && dentalItem.status === 'covered') {
    covered.push('Dental care organized');
  } else {
    missing.push('Last dental check unknown');
  }

  const visionItem = state.territories?.routine?.items.find(i => i.title.toLowerCase().includes('vision'));
  if (visionItem && visionItem.status === 'covered') {
    covered.push('Vision check recorded');
  } else {
    missing.push('Last vision check unknown');
  }

  const medsItem = state.territories?.ongoing?.items.find(i => i.title.toLowerCase().includes('medicine'));
  if (medsItem && medsItem.status === 'covered') {
    covered.push('Current medicines reviewed');
  } else {
    missing.push('Medicine list not reviewed');
  }

  if (state.commitments && state.commitments.length > 0) {
    covered.push('Care commitments actively tracked');
  } else {
    missing.push('No care commitments tracked');
  }

  if (state.history && state.history.length > 0) {
    covered.push('Care history recorded');
  } else {
    missing.push('No past care interactions recorded');
  }

  if (state.records && state.records.length > 0) {
    covered.push('Important records / reports preserved');
  } else {
    missing.push('No health records attached');
  }

  if (state.lastReviewDate) {
    covered.push('Care Map periodically reviewed');
  } else {
    missing.push('Care review pending');
  }

  const percentage = Math.round((covered.length / 10) * 100);
  return { percentage, coveredPoints: covered, missingPoints: missing };
}

// ------------------------------------
// COMMITMENTS CRUD
// ------------------------------------
export function getCommitments(): CareCommitment[] {
  return getCareState().commitments || [];
}

export function addCommitment(commitmentData: Omit<CareCommitment, 'id' | 'createdAt'>): CareCommitment {
  const state = getCareState();
  const newCommitment: CareCommitment = {
    ...commitmentData,
    id: `commit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString().split('T')[0]
  };

  const updatedCommitments = [newCommitment, ...(state.commitments || [])];
  state.commitments = updatedCommitments;
  saveCareState(state);
  logAudit('ADD_COMMITMENT', 'user', { title: newCommitment.title, category: newCommitment.category });
  return newCommitment;
}

export function updateCommitment(id: string, updates: Partial<CareCommitment>): CareCommitment | null {
  const state = getCareState();
  const index = (state.commitments || []).findIndex(c => c.id === id);
  if (index === -1) return null;

  const current = state.commitments[index];
  const updated: CareCommitment = {
    ...current,
    ...updates,
    ...(updates.status === 'completed' && !current.completedAt ? { completedAt: new Date().toISOString().split('T')[0] } : {})
  };

  state.commitments[index] = updated;
  saveCareState(state);
  logAudit('UPDATE_COMMITMENT', 'user', { id, status: updated.status, title: updated.title });
  return updated;
}

export function deleteCommitment(id: string): boolean {
  const state = getCareState();
  const initialLength = (state.commitments || []).length;
  state.commitments = (state.commitments || []).filter(c => c.id !== id);
  if (state.commitments.length < initialLength) {
    saveCareState(state);
    logAudit('DELETE_COMMITMENT', 'user', { id });
    return true;
  }
  return false;
}

// ------------------------------------
// APPOINTMENTS CRUD & LOOPS
// ------------------------------------
export function getAppointments(): Appointment[] {
  return getCareState().appointments || [];
}

export function addAppointment(appointmentData: Omit<Appointment, 'id'>): Appointment {
  const state = getCareState();
  const newApt: Appointment = {
    ...appointmentData,
    id: `apt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
  };

  state.appointments = [newApt, ...(state.appointments || [])];
  saveCareState(state);
  logAudit('ADD_APPOINTMENT', 'user', { provider: newApt.providerName, date: newApt.date });
  return newApt;
}

export function updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
  const state = getCareState();
  const index = (state.appointments || []).findIndex(a => a.id === id);
  if (index === -1) return null;

  const updated: Appointment = {
    ...state.appointments[index],
    ...updates
  };

  state.appointments[index] = updated;
  saveCareState(state);
  logAudit('UPDATE_APPOINTMENT', 'user', { id, provider: updated.providerName });
  return updated;
}

export function updateAppointmentPrep(id: string, prepData: Appointment['preparation']): Appointment | null {
  return updateAppointment(id, { preparation: prepData });
}

export function processAfterAppointment(
  id: string,
  data: {
    outcomeNotes: string;
    newCommitments?: Array<Omit<CareCommitment, 'id' | 'createdAt'>>;
    nextVisitDate?: string;
    doctorInstruction?: Omit<DoctorCareInstruction, 'id'>;
  }
): { appointment: Appointment; addedCommitments: CareCommitment[] } | null {
  const state = getCareState();
  const aptIndex = (state.appointments || []).findIndex(a => a.id === id);
  if (aptIndex === -1) return null;

  const apt = state.appointments[aptIndex];
  apt.status = 'completed';

  const addedCommitments: CareCommitment[] = [];
  if (data.newCommitments && data.newCommitments.length > 0) {
    for (const c of data.newCommitments) {
      const newC: CareCommitment = {
        ...c,
        id: `commit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      state.commitments = [newC, ...(state.commitments || [])];
      addedCommitments.push(newC);
    }
  }

  // Add history event
  const historyEvent: CareEvent = {
    id: `hist-${Date.now()}`,
    date: apt.date || new Date().toISOString().split('T')[0],
    title: `Consultation with ${apt.providerName} (${apt.specialty})`,
    category: 'Consultation',
    providerName: apt.providerName,
    description: data.outcomeNotes || 'Follow-up consultation completed and care notes recorded.'
  };
  state.history = [historyEvent, ...(state.history || [])];

  // If doctor instruction was captured
  if (data.doctorInstruction) {
    const instruction: DoctorCareInstruction = {
      ...data.doctorInstruction,
      id: `inst-${Date.now()}`
    };
    state.doctorInstructions = [instruction, ...(state.doctorInstructions || [])];
  }

  state.appointments[aptIndex] = apt;
  saveCareState(state);
  logAudit('AFTER_APPOINTMENT_CAPTURE', 'user', {
    appointmentId: id,
    commitmentsCount: addedCommitments.length,
    provider: apt.providerName
  });

  return { appointment: apt, addedCommitments };
}

// ------------------------------------
// PROVIDERS CRUD
// ------------------------------------
export function getProviders(): CareProvider[] {
  return getCareState().providers || [];
}

export function addProvider(providerData: Omit<CareProvider, 'id'>): CareProvider {
  const state = getCareState();
  const newProvider: CareProvider = {
    ...providerData,
    id: `prov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
  };

  state.providers = [newProvider, ...(state.providers || [])];
  saveCareState(state);
  logAudit('ADD_PROVIDER', 'user', { name: newProvider.name, specialty: newProvider.specialty });
  return newProvider;
}

export function updateProvider(id: string, updates: Partial<CareProvider>): CareProvider | null {
  const state = getCareState();
  const index = (state.providers || []).findIndex(p => p.id === id);
  if (index === -1) return null;

  const updated: CareProvider = {
    ...state.providers[index],
    ...updates
  };

  state.providers[index] = updated;
  saveCareState(state);
  logAudit('UPDATE_PROVIDER', 'user', { id, name: updated.name });
  return updated;
}

export function deleteProvider(id: string): boolean {
  const state = getCareState();
  const initialLength = (state.providers || []).length;
  state.providers = (state.providers || []).filter(p => p.id !== id);
  if (state.providers.length < initialLength) {
    saveCareState(state);
    logAudit('DELETE_PROVIDER', 'user', { id });
    return true;
  }
  return false;
}

// ------------------------------------
// RECORDS & HISTORY CRUD
// ------------------------------------
export function getRecords(): CareRecord[] {
  return getCareState().records || [];
}

export function addRecord(recordData: Omit<CareRecord, 'id'>): CareRecord {
  const state = getCareState();
  const newRecord: CareRecord = {
    ...recordData,
    id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
  };

  state.records = [newRecord, ...(state.records || [])];
  saveCareState(state);
  logAudit('ADD_RECORD', 'user', { title: newRecord.title, type: newRecord.type });
  return newRecord;
}

export function deleteRecord(id: string): boolean {
  const state = getCareState();
  const initialLength = (state.records || []).length;
  state.records = (state.records || []).filter(r => r.id !== id);
  if (state.records.length < initialLength) {
    saveCareState(state);
    logAudit('DELETE_RECORD', 'user', { id });
    return true;
  }
  return false;
}

export function getHistory(): CareEvent[] {
  return getCareState().history || [];
}

export function addHistoryEvent(eventData: Omit<CareEvent, 'id'>): CareEvent {
  const state = getCareState();
  const newEvent: CareEvent = {
    ...eventData,
    id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
  };

  state.history = [newEvent, ...(state.history || [])];
  saveCareState(state);
  logAudit('ADD_HISTORY_EVENT', 'user', { title: newEvent.title, date: newEvent.date });
  return newEvent;
}

// ------------------------------------
// DOCTOR INSTRUCTIONS & BETWEEN-VISIT LOGS
// ------------------------------------
export function getDoctorInstructions(): DoctorCareInstruction[] {
  return getCareState().doctorInstructions || [];
}

export function addDoctorInstruction(instructionData: Omit<DoctorCareInstruction, 'id'>): DoctorCareInstruction {
  const state = getCareState();
  const newInst: DoctorCareInstruction = {
    ...instructionData,
    id: `inst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
  };

  state.doctorInstructions = [newInst, ...(state.doctorInstructions || [])];
  saveCareState(state);
  logAudit('ADD_DOCTOR_INSTRUCTION', 'user', { doctor: newInst.doctorName, date: newInst.date });
  return newInst;
}

export function addActivityLog(logData: Omit<BetweenVisitActivityLog, 'id'>): BetweenVisitActivityLog {
  const state = getCareState();
  const newLog: BetweenVisitActivityLog = {
    ...logData,
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
  };

  state.activityLogs = [newLog, ...(state.activityLogs || [])];
  saveCareState(state);
  logAudit('LOG_ACTIVITY', 'user', { routine: newLog.routineTitle, status: newLog.status });
  return newLog;
}

export function addObservation(obsData: Omit<BetweenVisitObservation, 'id'>): BetweenVisitObservation {
  const state = getCareState();
  const newObs: BetweenVisitObservation = {
    ...obsData,
    id: `obs-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
  };

  state.betweenVisitObservations = [newObs, ...(state.betweenVisitObservations || [])];
  saveCareState(state);
  logAudit('LOG_OBSERVATION', 'user', { observation: newObs.observation, severity: newObs.severity });
  return newObs;
}

// ------------------------------------
// FAMILY & CARE CIRCLE
// ------------------------------------
export function getFamilyMembers(): FamilyMember[] {
  return getCareState().familyMembers || [];
}

export function switchFamilyMember(memberId: string): UserCareState {
  const state = getCareState();
  state.activeFamilyMemberId = memberId;
  saveCareState(state);
  logAudit('SWITCH_FAMILY_MEMBER', 'user', { activeMemberId: memberId });
  return state;
}

export function addFamilyMember(memberData: Omit<FamilyMember, 'id'>): FamilyMember {
  const state = getCareState();
  const newMember: FamilyMember = {
    ...memberData,
    id: `fam-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
  };

  state.familyMembers = [...(state.familyMembers || []), newMember];
  saveCareState(state);
  logAudit('ADD_FAMILY_MEMBER', 'user', { name: newMember.name, relation: newMember.relationTitle });
  return newMember;
}

// ------------------------------------
// INBOX & SIGNALS
// ------------------------------------
export function getInboxItems(): CareInboxItem[] {
  const state = getCareState();
  const activeMember = state.familyMembers?.find(m => m.id === state.activeFamilyMemberId);
  return activeMember?.inbox || state.globalInbox || [];
}

export function updateInboxItemStatus(id: string, status: 'confirmed' | 'dismissed'): boolean {
  const state = getCareState();
  let updated = false;

  // Search active member inbox
  const activeMember = state.familyMembers?.find(m => m.id === state.activeFamilyMemberId);
  if (activeMember && activeMember.inbox) {
    const item = activeMember.inbox.find(i => i.id === id);
    if (item) {
      item.status = status;
      updated = true;
    }
  }

  // Also check globalInbox
  if (state.globalInbox) {
    const item = state.globalInbox.find(i => i.id === id);
    if (item) {
      item.status = status;
      updated = true;
    }
  }

  if (updated) {
    saveCareState(state);
    logAudit('UPDATE_INBOX_STATUS', 'user', { id, status });
  }
  return updated;
}

export function getSignals(): CareSignal[] {
  const state = getCareState();
  const activeMember = state.familyMembers?.find(m => m.id === state.activeFamilyMemberId);
  return activeMember?.signals || [];
}

export function dismissSignal(signalId: string): boolean {
  const state = getCareState();
  const activeMember = state.familyMembers?.find(m => m.id === state.activeFamilyMemberId);
  if (activeMember && activeMember.signals) {
    const sig = activeMember.signals.find(s => s.id === signalId);
    if (sig) {
      sig.dismissed = true;
      saveCareState(state);
      logAudit('DISMISS_SIGNAL', 'user', { signalId });
      return true;
    }
  }
  return false;
}

// ------------------------------------
// ANALYTICS STORAGE
// ------------------------------------
export function getAnalytics(): ValidationAnalytics {
  const db = readDatabase();
  return db.analytics;
}

export function trackAnalytics(eventType: string, extra?: string): ValidationAnalytics {
  const db = readDatabase();
  const current = db.analytics;

  if (eventType === 'motivationSelected' && extra) {
    current.motivations[extra] = (current.motivations[extra] || 0) + 1;
  } else if (typeof (current as any)[eventType] === 'number') {
    (current as any)[eventType] = ((current as any)[eventType] as number) + 1;
  }

  writeDatabase(db);
  return current;
}

export function resetAnalytics(): ValidationAnalytics {
  const db = readDatabase();
  db.analytics = createCleanAnalytics();
  writeDatabase(db);
  logAudit('RESET_ANALYTICS', 'admin');
  return db.analytics;
}

// ------------------------------------
// USER ACCOUNTS & AUTHENTICATION
// ------------------------------------
export interface StoredUser {
  id: string;
  name: string;
  emailOrPhone: string;
  passwordHash: string;
  token: string;
  careState: UserCareState;
  createdAt: string;
  lastLoginAt: string;
}

function readUsers(): StoredUser[] {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw) || [];
  } catch (err) {
    console.error('[DB] Error reading users file:', err);
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  try {
    const tempFile = `${USERS_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(users, null, 2), 'utf-8');
    fs.renameSync(tempFile, USERS_FILE);
  } catch (err) {
    console.error('[DB] Atomic write users failed:', err);
  }
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_mycaremap_salt_2026').digest('hex');
}

function generateToken(userId: string): string {
  return `mcm_tk_${userId}_${crypto.randomBytes(16).toString('hex')}`;
}

export function registerUser(name: string, emailOrPhone: string, password: string, careState?: UserCareState) {
  const cleanIdentifier = emailOrPhone.trim().toLowerCase();
  if (!cleanIdentifier || !password || password.length < 6) {
    throw new Error('Valid email or mobile number and password (minimum 6 characters) required');
  }

  const users = readUsers();
  const existing = users.find(u => u.emailOrPhone.toLowerCase() === cleanIdentifier);
  if (existing) {
    throw new Error('An account already exists with this mobile number or email address');
  }

  const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const token = generateToken(userId);

  // Prepare initial careState safely (clean fresh user template, not demo data)
  const initialAge = typeof (careState as any)?.profile?.age === 'number'
    ? (careState as any).profile.age
    : (parseInt((careState as any)?.profile?.age, 10) || 0);
  const initialCity = (careState as any)?.profile?.city || 'Ahmedabad';
  const baseState = JSON.parse(JSON.stringify(createFreshUser(name.trim() || 'User', initialAge, initialCity, [])));
  let userCareState: UserCareState;

  if (careState && typeof careState === 'object') {
    userCareState = {
      ...baseState,
      ...careState,
      profile: {
        ...(baseState.profile || {}),
        ...((careState as any).profile || {}),
        id: userId,
        name: name.trim() || (careState as any).profile?.name || baseState.profile?.name || 'User',
        isDemo: false
      }
    };
  } else {
    userCareState = baseState;
    if (!userCareState.profile) {
      userCareState.profile = {
        id: userId,
        name: name.trim() || 'User',
        age: initialAge,
        city: initialCity,
        createdAt: new Date().toISOString().split('T')[0],
        isDemo: false,
        motivations: ['Organised family care']
      };
    } else {
      userCareState.profile.id = userId;
      userCareState.profile.name = name.trim() || userCareState.profile.name || 'User';
      userCareState.profile.isDemo = false;
    }
  }

  const newUser: StoredUser = {
    id: userId,
    name: name.trim() || userCareState.profile.name,
    emailOrPhone: cleanIdentifier,
    passwordHash: hashPassword(password),
    token,
    careState: userCareState,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };

  users.push(newUser);
  writeUsers(users);
  logAudit('USER_REGISTERED', cleanIdentifier, { userId, name: newUser.name });

  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      emailOrPhone: newUser.emailOrPhone,
      createdAt: newUser.createdAt
    },
    token: newUser.token,
    careState: newUser.careState
  };
}

export function loginUser(emailOrPhone: string, password: string) {
  const cleanIdentifier = emailOrPhone.trim().toLowerCase();
  const users = readUsers();
  const user = users.find(u => u.emailOrPhone.toLowerCase() === cleanIdentifier);

  if (!user || user.passwordHash !== hashPassword(password)) {
    throw new Error('Invalid mobile number/email or password');
  }

  user.token = generateToken(user.id);
  user.lastLoginAt = new Date().toISOString();
  writeUsers(users);
  logAudit('USER_LOGGED_IN', cleanIdentifier, { userId: user.id });

  return {
    user: {
      id: user.id,
      name: user.name,
      emailOrPhone: user.emailOrPhone,
      createdAt: user.createdAt
    },
    token: user.token,
    careState: user.careState
  };
}

export function getUserByToken(token: string): StoredUser | null {
  if (!token) return null;
  const users = readUsers();
  return users.find(u => u.token === token) || null;
}

export function saveUserCareState(userId: string, newState: UserCareState): UserCareState {
  const users = readUsers();
  const user = users.find(u => u.id === userId);
  if (!user) {
    throw new Error('User not found');
  }
  user.careState = newState;
  if (newState.profile?.name && newState.profile.name.trim()) {
    user.name = newState.profile.name.trim();
  }
  writeUsers(users);
  logAudit('SAVE_USER_CARE_STATE', user.emailOrPhone, { userId });
  return user.careState;
}

export function getUserCareState(userId: string): UserCareState | null {
  const users = readUsers();
  const user = users.find(u => u.id === userId);
  return user ? user.careState : null;
}

