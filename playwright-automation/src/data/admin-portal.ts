/**
 * Admin Portal Data Models
 * Converted from JAXB-generated Java classes
 */

// Basic Admin Dealer Information
export interface Dealer {
  email: string;
  name?: string;
  phone?: string;
  fax?: string;
  companyName?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  internalId?: string;
  contactTitle?: string;
  licenseNo?: string;
  registrationGst?: string;
  registrationPst?: string;
  group?: string;
  notes?: string;
}

export interface DealerInfo {
  id?: string;
  email: string;
  name?: string;
  phone?: string;
  fax?: string;
  companyName?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  internalId?: string;
  contactTitle?: string;
  licenseNo?: string;
  registrationGst?: string;
  registrationPst?: string;
  group?: string;
  notes?: string;
  status?: string;
}

// Price Rule Models
export interface Condition {
  id?: string;
  name: string;
  value?: string;
  operator?: string;
}

export interface Conditions {
  condition: Condition[];
}

export interface PriceRule {
  id?: string;
  name: string;
  description?: string;
  conditions: Conditions;
  priceAdjustment: number;
  adjustmentType?: string; // PERCENTAGE or FIXED
  startDate?: Date;
  endDate?: Date;
  active?: boolean;
}

export interface PriceRuleInfo extends PriceRule {
  createdDate?: Date;
  lastModified?: Date;
  createdBy?: string;
}

// Program Models
export interface ProgOption {
  id?: string;
  name: string;
  description?: string;
  price: number;
  coverage?: number; // in months or km
}

export interface ProgramOptions {
  progOption: ProgOption[];
}

export interface ProgTerm {
  id?: string;
  termLength: number;
  unit: string; // MONTHS or KM
  maxPrice?: number;
}

export interface ProgramTerms {
  progTerm: ProgTerm[];
}

export interface WarrantyCondition {
  id?: string;
  name: string;
  description?: string;
  covered: boolean;
}

export interface Program {
  id?: string;
  name: string;
  description?: string;
  category?: string;
  options: ProgramOptions;
  terms: ProgramTerms;
  warrantyConditions?: WarrantyCondition[];
  active?: boolean;
}

export interface ProgramInfo extends Program {
  createdDate?: Date;
  lastModified?: Date;
  createdBy?: string;
}

// Wholesaler Model
export interface Wholesaler {
  id?: string;
  email: string;
  name: string;
  phone?: string;
  companyName?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  notes?: string;
  status?: string;
}

// Admin Portal Root
export interface AdminPortal {
  dealers?: Dealer[];
  programs?: Program[];
  priceRules?: PriceRule[];
  wholesalers?: Wholesaler[];
  url?: string;
  username?: string;
  password?: string;
}
