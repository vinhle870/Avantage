/**
 * Dealer Portal data models.
 * Mirrors the JAXB business objects in ProjectContext/BusinessObject/Dealer and the
 * XML files under test-data/TestCaseData/DealerPortal. Every leaf is a string because
 * the XML is the source of truth; empty or missing elements load as ''.
 */

export interface QuoteClient {
    email: string;
    firstName: string;
    lastName: string;
    secondaryOwnerOrCompany: string;
    distributorName: string;
    address: string;
    address2: string;
    city: string;
    province: string;
    postalCode: string;
    telHome: string;
    telWork: string;
    indianStatusCertificate: string;
    driversLicense: string;
}

export interface VehicleInfo {
    vehicleType: string;
    /** Filled at runtime with the inventory ID of the vehicle the test created */
    vehicleId: string;
    vin: string;
    /** Vehicle make — named "Branch" in the legacy XML */
    branch: string;
    model: string;
    year: string;
    price: string;
    km: string;
    condition: string;
    fuelType: string;
    transmission: string;
    cylinders: string;
    engineSize: string;
    engineSizeUnit: string;
    designation: string;
    isTurboEngine: string;
    is4x4: string;
    isAllWheelDrive: string;
    fullCoverageEndDate: string;
    fullCoverageMaxMile: string;
    powertrainCoverageEndDate: string;
    powertrainCoverageMaxMile: string;
}

export interface QuoteVehicle {
    vehicleInfo: VehicleInfo;
    deliveryDate: string;
    price: string;
}

export interface QuoteWarranty {
    warrantyId: string;
    programName: string;
    programOption: string;
    programDescription: string;
    optionTerm: string;
    optionTermMonth: string;
    optionTermKm: string;
    optionTermPrice: string;
    optionTermAmountPerVisit: string;
    optionTermAmountTotal: string;
    optionTermAmountText: string;
    extraComponents: string[];
    salePrice: string;
    financingCompany: string;
    vehicleDeliveryDate: string;
    sameAsDeliveryDate: string;
    warrantyStartDate: string;
}

export interface QuoteSaleContract {
    contractNumber: string;
    salesRepName: string;
    deliveredOn: string;
    signedOn: string;
    signedLocation: string;
    discountAmount: string;
    vehicleMarketValue: string;
    transitAmount: string;
    rdprmAmount: string;
    warrantyAmount: string;
    accessories: string;
    accessoriesAmount: string;
    newTiresDutyAmount: string;
    maintenanceScheduleAmount: string;
    replacementInsuranceAmount: string;
    replacementInsuranceContractNumber: string;
    loanInsuranceAmount: string;
    loanInsuranceContractNumber: string;
    depositAmount: string;
    otherClause: string;
}

export interface QuoteExchangeVehicle {
    vin: string;
    branch: string;
    model: string;
    year: string;
    cylinders: string;
    licensePlateNumber: string;
    km: string;
    realKilometers: string;
    isAccommodationSale: string;
    accommodationSaleContractNumber: string;
    taxRegistration: string;
    valueAmount: string;
    balanceAmount: string;
    bank: string;
}

export interface QuoteSale {
    quoteSaleContract: QuoteSaleContract;
    quoteExchangeVehicle: QuoteExchangeVehicle;
}

export interface QuoteInfo {
    quoteClient: QuoteClient;
    quoteVehicle: QuoteVehicle;
    quoteWarranty: QuoteWarranty;
    quoteSale: QuoteSale;
}

export interface InvoiceInfo {
    taxInfo1: string;
    taxInfo2: string;
    apt1: string;
    apt2: string;
}

/** Values read from the invoice detail page */
export interface InvoiceOnPage {
    dealerName: string;
    dealerAddress: string;
    dealerLocation: string;
    dealerEmail: string;
    dealerPhone: string;
    invoiceDescription: string;
    invoiceTotal: string;
    invoiceGrandTotal: string;
    avAddress: string;
}

/** Root of a DealerPortal XML file — each file carries only the sections its test needs */
export interface DealerPortalData {
    quoteInfo?: QuoteInfo;
    vehicleInfo?: VehicleInfo;
    invoiceInfo?: InvoiceInfo;
}
