/**
 * Admin Portal data models.
 * Mirrors the JAXB business objects in ProjectContext/BusinessObject/Admin and the
 * XML files under test-data/TestCaseData/AdminPortal. Every leaf is a string because
 * the XML is the source of truth; empty elements load as ''.
 */

export interface Dealer {
    email: string;
    name: string;
    phone: string;
    fax: string;
    companyName: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    internalId: string;
    contactTitle: string;
    licenseNo: string;
    registrationGST: string;
    registrationPST: string;
    isShowTaxInfo: string;
    group: string;
    notes: string;
    humaniaCommissionRate: string;
}

export interface WarrantyCondition {
    name: string;
    description: string;
    englishPdf: string;
    frenchPdf: string;
}

export interface ProgTerm {
    eligibilityYears: string;
    eligibilityKmPerHr: string;
    termMonths: string;
    termKm: string;
    franchiseAmount: string;
    repairAmountPerVisit: string;
    repairAmountTotal: string;
    repairAmountText: string;
    eligibilityCategory: string;
    fuelTypeEligibility: string;
    vehicleType: string;
}

export interface ProgOption {
    name: string;
    code: string;
    programTerms: ProgTerm[];
}

export interface Program {
    name: string;
    description: string;
    code: string;
    /** "Warranty start date delay in days" — required by the current program form */
    warrantyStartDateDelay: string;
    warrantyCondition: WarrantyCondition;
    wholesaler: string;
    programOptions: ProgOption[];
}

export interface Condition {
    attribute: string;
    operator: string;
    value: string;
}

export interface PriceRule {
    name: string;
    position: string;
    applyRuleIf: string;
    conditions: Condition[];
    apply: string;
    amount: string;
    stopFurtherProcessing: string;
}

/** Root of an AdminPortal XML file */
export interface AdminPortalData {
    dealers: Dealer[];
    programs: Program[];
    priceRules: PriceRule[];
}
