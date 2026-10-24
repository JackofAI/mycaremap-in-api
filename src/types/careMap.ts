export type Language = 'hi' | 'en';

export type CareMapStatus =
  | 'covered'
  | 'upcoming'
  | 'needs_attention'
  | 'needs_organising'
  | 'discuss'
  | 'not_relevant'
  | 'completed';

export type CareTerritoryId =
  | 'routine'
  | 'preventive'
  | 'ongoing'
  | 'specialists'
  | 'commitments'
  | 'team'
  | 'records'
  | 'emergency';

export interface CareItem {
  id: string;
  territoryId: CareTerritoryId;
  title: string;
  subtitle: string;
  status: CareMapStatus;
  lastDate?: string;
  dueDate?: string;
  providerName?: string;
  notes?: string;
  actionPrompt?: string;
}

export type CommitmentStatus =
  | 'open'
  | 'scheduled'
  | 'completed'
  | 'not_needed'
  | 'needs_clarification';

export interface CareCommitment {
  id: string;
  title: string;
  category: 'Blood Test' | 'Dental' | 'Specialist' | 'Medicine Review' | 'Routine' | 'Follow-up' | 'Imaging';
  createdAt: string;
  dueDate: string;
  suggestedBy: string;
  source?: string;
  whyItMatters: string;
  status: CommitmentStatus;
  notes?: string;
  completedAt?: string;
}

export type ProviderCategory =
  | 'doctor'
  | 'specialist'
  | 'physio'
  | 'diagnostic'
  | 'homecare'
  | 'caregiver'
  | 'supporter';

export type RelationshipStatus = 'regular' | 'preferred' | 'previously_visited';

export interface CareProvider {
  id: string;
  name: string;
  role: string;
  specialty: string;
  city: string;
  clinic?: string;
  contact?: string;
  address?: string;
  lastInteraction?: string;
  nextFollowUp?: string;
  notes?: string;
  category?: ProviderCategory;
  relationshipStatus?: RelationshipStatus;
  isPrivateRecord?: boolean;
  isPrivateEntry?: boolean;
  placeId?: string;
  place_id?: string;
  ratingScore?: number;
  reviewCount?: number;
}

export interface CaregiverRelationship {
  id: string;
  name: string;
  relation: string;
  relationHi?: string;
  role?: string;
  roleHi?: string;
  roleType?: string;
  location?: string;
  city?: string;
  contact?: string;
  phone?: string;
  accessLevel?: string;
  isPrimaryCaregiver?: boolean;
  notes?: string;
}

export interface CareEvent {
  id: string;
  date: string;
  title: string;
  category: string;
  providerName?: string;
  description: string;
  addedBy?: string; // e.g. "Bhavik", "Neha", "Self"
  relatedCommitmentId?: string;
  documentsCount?: number;
}

export interface DoctorCareInstruction {
  id: string;
  date: string;
  doctorName: string;
  doctorId?: string;
  specialty?: string;
  visitPurpose: string;
  visitPurposeHi?: string;
  instructionsSummary: string;
  instructionsSummaryHi?: string;
  instructionsText?: string;
  recommendedActivities?: string[];
  recommendedRoutines: Array<{
    id: string;
    title: string;
    titleHi?: string;
    frequency: string; // e.g. "Daily (30 mins)", "Twice daily"
    category: 'walking' | 'exercise' | 'monitoring' | 'medication' | 'lifestyle';
    isCompletedToday?: boolean;
  }>;
  medicationNotes?: string;
  medicationNotesHi?: string;
  recommendedTestsOrFollowup?: string;
  recommendedTestsOrFollowupHi?: string;
  nextReviewDate?: string;
  personalNotes?: string;
  personalQuestionsNotes?: string;
  sourceDoc?: string;
  sourceDocument?: string;
}

export interface BetweenVisitActivityLog {
  id: string;
  date: string;
  routineTitle: string;
  activityName?: string;
  status: 'completed' | 'partial' | 'missed';
  completed?: boolean;
  difficultyReason?: string;
  notes?: string;
  loggedBy?: string; // e.g. "Ramesh (Self)", "Neha (Daughter)"
}

export interface BetweenVisitObservation {
  id: string;
  date: string;
  observation: string;
  observationHi?: string;
  description?: string;
  type?: 'symptom' | 'observation' | 'concern' | 'improvement';
  questionForDoctor?: string;
  severity?: 'mild' | 'moderate' | 'concerning';
  contextNotes?: string;
  loggedBy?: string;
}

export interface Appointment {
  id: string;
  providerName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  city: string;
  status: 'upcoming' | 'completed';
  placeId?: string;
  place_id?: string;
  providerId?: string;
  previousVisitDate?: string;
  previousVisitDoctor?: string;
  previousVisitInstructions?: string;
  previousVisitInstructionsHi?: string;
  notes?: string;
  isCompleted?: boolean;
  preparation?: {
    recentChanges: string[];
    recentChangesHi?: string[];
    discussionTopics: string[];
    discussionTopicsHi?: string[];
    userQuestions: string[];
    userQuestionsHi?: string[];
    materialsToBring: string[];
    materialsToBringHi?: string[];
  };
}

export type RecordDocType =
  | 'prescription'
  | 'lab_report'
  | 'imaging'
  | 'health_check'
  | 'doctor_letter'
  | 'discharge'
  | 'other';

export interface CareRecord {
  id: string;
  title: string;
  date: string;
  providerName: string;
  type: RecordDocType;
  summary: string;
  fileSize?: string;
  linkedCommitmentId?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email?: string;
  permissions: {
    emergencyInfo: boolean;
    viewCareMap: boolean;
    helpUpdate: boolean;
  };
}

export interface EmergencyCard {
  name: string;
  age: number;
  bloodGroup: string;
  allergies: string[];
  currentMedicines: string[];
  importantConditions: string[];
  primaryDoctor: string;
  primaryDoctorContact: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  lastUpdated: string;
}

export interface CareProfile {
  id: string;
  name: string;
  roleTag?: string; // e.g. "Papa (67)", "Mummy (63)", "Self (38)"
  roleTagHi?: string; // e.g. "पापा (Papa - 67)"
  age: number;
  city: string;
  avatarUrl?: string;
  createdAt: string;
  isDemo?: boolean;
  motivations: string[];
  motivationsHi?: string[];
}

// ----------------------------------------------------
// INDIA V2 SPECIALIZED TYPES
// ----------------------------------------------------

export type CareNextCategory =
  | 'todo'          // करना है
  | 'book'          // Book करना है
  | 'waiting'       // इंतज़ार में
  | 'show_doctor'   // दिखाना है
  | 'upcoming'      // आने वाला
  | 'ask_doctor'    // पूछना है
  | 'completed';    // पूरा हुआ

export type CareNextLifecycle = 'todo' | 'scheduled' | 'waiting' | 'done' | 'followup';

export interface CareNextTask {
  id: string;
  title: string;
  titleHi: string;
  category: CareNextCategory;
  lifecycle: CareNextLifecycle;
  dueDate: string;
  dueDateHi?: string;
  dueNote?: string;
  dueNoteHi?: string;
  suggestedBy: string;
  assignedTo?: string; // e.g. "Bhavik (Melbourne)", "Neha (Mumbai)", "Papa"
  whyItMatters: string;
  whyItMattersHi: string;
  sourceDoc?: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: string;
}

export interface CareSignal {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  occurrences: number;
  timeframe: string;
  sourceEntryIds: string[];
  sourceEntriesSummary: Array<{
    date: string;
    title: string;
    snippet: string;
  }>;
  suggestedAction: string;
  suggestedActionHi: string;
  category: 'pattern' | 'pending_followup' | 'staleness';
  dismissed?: boolean;
}

export interface CareInboxItem {
  id: string;
  type: 'prescription' | 'report' | 'voice' | 'whatsapp' | 'note' | 'hospital_paper' | 'lab_result' | 'referral';
  title: string;
  receivedAt: string;
  senderName: string; // e.g. "Neha (WhatsApp)", "Apex Lab SMS", "Bhavik (Audio)"
  rawContent?: string;
  rawContentHi?: string;
  extractedSummary: {
    doctorName?: string;
    date?: string;
    medicinesDetected?: number;
    medicinesList?: string[];
    keyFindings?: string[];
    keyFindingsHi?: string[];
    followupWindow?: string;
    followupWindowHi?: string;
    suggestedNextAction?: string;
    suggestedNextActionHi?: string;
  };
  status: 'unreviewed' | 'confirmed' | 'dismissed';
}

export type FamilyHelperRole = 'owner' | 'navigator' | 'partner' | 'viewer';

export interface CareCircleMember {
  id: string;
  name: string;
  relation: string;
  relationHi: string;
  location: string;
  helperRole?: FamilyHelperRole;
  helperRoleLabel?: string;
  helperRoleLabelHi?: string;
  phone?: string;
  canViewAppointments: boolean;
  canAddReports: boolean;
  canManageFollowups: boolean;
  canViewPrivateNotes: boolean;
}

export interface MeraCareContextHandoff {
  personName: string;
  age: number;
  city: string;
  situationTitle: string;
  situationTitleHi: string;
  needCategory: 'home_physio' | 'caregiver' | 'mobility_equipment' | 'nursing_support' | 'post_discharge_home_care';
  triggerReason: string;
  triggerReasonHi: string;
  recentEventContext: string;
  familyCoordinatorName: string;
  familyCoordinatorRole: string;
  excludedSensitiveRecords: string[];
}

export interface MeraCareArrangedOutcome {
  serviceTitle: string;
  providerName: string;
  providerSpecialty: string;
  city: string;
  clinicOrOrg: string;
  startDate: string;
  scheduleDetails: string;
  relatedReason: string;
  nextFollowUpCommitment: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationTitle: string; // "Papa", "Mummy", "Son", "Daughter"
  relationTitleHi: string;
  age: number;
  city: string;
  avatarUrl?: string;
  conditionsSummary: string;
  conditionsSummaryHi: string;
  activeMedications: string[];
  isDemoPrimary?: boolean;
  isElderly?: boolean;
  careCircle: CareCircleMember[];
  signals: CareSignal[];
  nextTasks: CareNextTask[];
  inbox: CareInboxItem[];
}

export interface UserCareState {
  profile: CareProfile;
  territories: Record<CareTerritoryId, {
    title: string;
    description: string;
    items: CareItem[];
  }>;
  commitments: CareCommitment[];
  providers: CareProvider[];
  appointments: Appointment[];
  history: CareEvent[];
  records: CareRecord[];
  emergencyCard: EmergencyCard;
  trustedContacts: TrustedContact[];
  lastReviewDate?: string;
  // India V2 additions
  activeFamilyMemberId: string;
  familyMembers: FamilyMember[];
  globalInbox: CareInboxItem[];
  // Between-visit continuity & doctor instructions
  doctorInstructions?: DoctorCareInstruction[];
  activityLogs?: BetweenVisitActivityLog[];
  betweenVisitObservations?: BetweenVisitObservation[];
  activeScenarioId?: string;
}

export interface ValidationAnalytics {
  visitors: number;
  checksStarted: number;
  checksCompleted: number;
  mapsSaved: number;
  commitmentsCreated: number;
  providersAdded: number;
  recordsAdded: number;
  prepUsed: number;
  afterUpdateCompleted: number;
  reviewsCompleted: number;
  commitmentsCompleted: number;
  signalsInspected: number;
  familySwitches: number;
  voiceNotesAdded: number;
  whatsappSimulated: number;
  doctorSummaryGenerated: number;
  motivations: Record<string, number>;
  // MeraCare Connection Bridge analytics (Non-sensitive)
  meraCareImpressions?: number;
  meraCareClicks?: number;
  meraCareReturns?: number;
  meraCareCategoriesClicked?: Record<string, number>;
  meraCareSourcesClicked?: Record<string, number>;
  // Section 14 Conceptual Analytics Events
  care_map_created?: number;
  existing_provider_added?: number;
  consultation_recorded?: number;
  care_instruction_saved?: number;
  followup_updated?: number;
  visit_summary_prepared?: number;
  family_care_map_created?: number;
  meracare_link_viewed?: number;
  meracare_link_clicked?: number;
  incoming_meracare_visit?: number;
  incoming_user_onboarded?: number;
}

export type MeraCareBridgeSource =
  | 'mycaremap_network'
  | 'mycaremap_next_step'
  | 'mycaremap_doctor_rec'
  | 'mycaremap_hub'
  | 'mycaremap_appointment_after'
  | 'meracare_incoming_referral';

export interface MeraCareBridgeParams {
  category?: string; // e.g. 'physiotherapy', 'geriatric_care', 'cardiology', 'diagnostics', 'homecare'
  city?: string; // e.g. 'ahmedabad'
  locality?: string; // e.g. 'navrangpura'
  source: MeraCareBridgeSource;
  intent?: 'find_provider' | 'explore_alternatives' | 'keep_organized';
  searchQuery?: string; // Clean category query, e.g. 'physiotherapist'
  specialtyLabel?: string;
  recommendedServiceName?: string;
  doctorName?: string; // Referring doctor's public name if relevant
  placeId?: string; // Google Place ID / Provider Place ID
  place_id?: string;
  providerId?: string;
}

// ----------------------------------------------------
// SECTION 10: UNIFIED CONSUMER ENTITLEMENT ARCHITECTURE
// ----------------------------------------------------

export type ConsumerEntitlementTier = 'CARE_FREE' | 'CARE_CONSUMER_PLUS';

export interface ConsumerEntitlementInfo {
  tier: ConsumerEntitlementTier;
  isComplimentaryCore: boolean; // Always true for free core features
  entitlementId: string;
  description: string;
  descriptionHi?: string;
  coreBenefits: string[];
  futurePlusBenefits: string[];
  billingNotice: string;
}

export interface GooglePlaceItem {
  id: string;
  placeId?: string;
  place_id?: string;
  name: string;
  category: string;
  address: string;
  locality: string;
  ratingScore: number;
  reviewCount: number;
  openNow?: boolean;
  phone?: string;
  mapsUrl: string;
  isGooglePlace: boolean;
}

export interface SearchNearbyParams {
  query?: string;
  category?: string;
  locality?: string;
}

