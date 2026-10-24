export type LegalPolicyId =
  | 'privacy-policy'
  | 'terms-and-conditions'
  | 'medical-disclaimer'
  | 'family-access-consent'
  | 'health-data-sharing'
  | 'account-deletion'
  | 'data-security'
  | 'grievance-contact'
  // Backward compatibility & alias identifiers
  | 'terms-of-service'
  | 'health-data-abha-notice'
  | 'family-authorisation-policy'
  | 'cookie-policy'
  | 'emergency-clinical-disclaimer'
  | 'security-principles';

export interface PolicySubSection {
  title: string;
  content: string;
  bulletPoints?: string[];
}

export interface PolicySection {
  number: string;
  title: string;
  summary?: string;
  content: string;
  bulletPoints?: string[];
  subsections?: PolicySubSection[];
  highlight?: 'warning' | 'info' | 'important';
}

export interface LegalPolicy {
  id: LegalPolicyId;
  slug: string;
  title: string;
  titleHi: string;
  badge: string;
  shortDescription: string;
  summary: string;
  lastUpdated: string;
  effectiveDate: string;
  version: string;
  governingLaw: string;
  jurisdiction: string;
  operatingEntity: string;
  statutoryCitations: string[];
  sections: PolicySection[];
}
