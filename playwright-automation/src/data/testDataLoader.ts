import fs from 'fs';
import path from 'path';
import { parseString } from 'xml2js';
import { AdminPortalData, Condition, Dealer, PriceRule, ProgOption, ProgTerm, Program } from './admin-portal';
import {
    DealerPortalData, InvoiceInfo, QuoteClient, QuoteExchangeVehicle, QuoteInfo,
    QuoteSaleContract, QuoteVehicle, QuoteWarranty, VehicleInfo,
} from './dealer-portal';

/**
 * Loads the legacy XML test data into typed models.
 * Replaces DataFileReader.java (JAXB). Paths are relative to test-data/TestCaseData,
 * e.g. loadDealerPortalData('DealerPortal/TC1576_DealerCanFinishQuoteForClient_DealerPortal.xml').
 */

export const TEST_DATA_ROOT = path.resolve(__dirname, '../../test-data');

type XmlNode = Record<string, any> | string | undefined;

function readXml(relativePath: string): Record<string, any> {
    const file = path.join(TEST_DATA_ROOT, 'TestCaseData', relativePath);
    const xml = fs.readFileSync(file, 'utf-8');
    let result: Record<string, any> = {};
    // xml2js invokes the callback synchronously unless `async: true` is set
    parseString(xml, { explicitArray: false, trim: true, emptyTag: '' }, (err, parsed) => {
        if (err) throw new Error(`Unable to parse test data file ${file}: ${err.message}`);
        result = parsed;
    });
    return result;
}

/** Text of a child element; '' when missing or empty */
function text(node: XmlNode, key: string): string {
    if (!node || typeof node === 'string') return '';
    const value = node[key];
    if (value === undefined || value === null) return '';
    if (typeof value === 'string') return value;
    // Element with attributes only, or an unexpected structure
    return typeof value._ === 'string' ? value._ : '';
}

/** A repeated element as an array (xml2js collapses single children to an object) */
function list<T = any>(node: XmlNode, key: string): T[] {
    if (!node || typeof node === 'string') return [];
    const value = node[key];
    if (value === undefined || value === null || value === '') return [];
    return Array.isArray(value) ? value : [value];
}

// ---------- Admin Portal ----------

function toDealer(n: XmlNode): Dealer {
    return {
        email: text(n, 'Email'),
        name: text(n, 'Name'),
        phone: text(n, 'Phone'),
        fax: text(n, 'Fax'),
        companyName: text(n, 'Company_name'),
        address: text(n, 'Address'),
        city: text(n, 'City'),
        province: text(n, 'Province'),
        postalCode: text(n, 'Postal_code'),
        internalId: text(n, 'Internal_id'),
        contactTitle: text(n, 'Contact_title'),
        licenseNo: text(n, 'License_no'),
        registrationGST: text(n, 'Registration_GST'),
        registrationPST: text(n, 'Registration_PST'),
        isShowTaxInfo: text(n, 'IsShowTaxInfo'),
        group: text(n, 'Group'),
        notes: text(n, 'Notes'),
        humaniaCommissionRate: text(n, 'Humania_Commission_Rate'),
    };
}

function toProgTerm(n: XmlNode): ProgTerm {
    return {
        eligibilityYears: text(n, 'Eligibility_Years'),
        eligibilityKmPerHr: text(n, 'Eligibility_KmPerHr'),
        termMonths: text(n, 'Term_Months'),
        termKm: text(n, 'Term_Km'),
        franchiseAmount: text(n, 'Franchise_Amount'),
        repairAmountPerVisit: text(n, 'Repair_Amount_Per_Visit'),
        repairAmountTotal: text(n, 'Repair_Amount_Total'),
        repairAmountText: text(n, 'Repair_Amount_Text'),
        eligibilityCategory: text(n, 'Eligibility_Category'),
        fuelTypeEligibility: text(n, 'FuelType_Eligibility'),
        vehicleType: text(n, 'Vehicle_type'),
    };
}

function toProgOption(n: XmlNode): ProgOption {
    const terms = typeof n === 'object' ? n.ProgramTerms : undefined;
    return {
        name: text(n, 'Name'),
        code: text(n, 'Code'),
        programTerms: list(terms, 'ProgTerm').map(toProgTerm),
    };
}

function toProgram(n: XmlNode): Program {
    const obj = typeof n === 'object' ? n : {};
    return {
        name: text(n, 'Name'),
        description: text(n, 'Description'),
        code: text(n, 'Code'),
        warrantyStartDateDelay: text(n, 'Warranty_Start_Date_Delay'),
        warrantyCondition: {
            name: text(obj.WarrantyCondition, 'Name'),
            description: text(obj.WarrantyCondition, 'Description'),
            englishPdf: text(obj.WarrantyCondition, 'English_Pdf'),
            frenchPdf: text(obj.WarrantyCondition, 'French_Pdf'),
        },
        wholesaler: text(obj.Wholesaler, 'Name'),
        programOptions: list(obj.ProgramOptions, 'ProgOption').map(toProgOption),
    };
}

function toCondition(n: XmlNode): Condition {
    return {
        attribute: text(n, 'Attribute'),
        operator: text(n, 'Operator'),
        value: text(n, 'Value'),
    };
}

function toPriceRule(n: XmlNode): PriceRule {
    const obj = typeof n === 'object' ? n : {};
    return {
        name: text(n, 'Name'),
        position: text(n, 'Position'),
        applyRuleIf: text(n, 'Apply_rule_if'),
        conditions: list(obj.Conditions, 'Condition').map(toCondition),
        apply: text(n, 'Apply'),
        amount: text(n, 'Amount'),
        stopFurtherProcessing: text(n, 'Stop_further_processing'),
    };
}

export function loadAdminPortalData(relativePath: string): AdminPortalData {
    const root = readXml(relativePath).AdminPortal ?? {};
    return {
        dealers: list(root.DealerInfo, 'Dealer').map(toDealer),
        programs: list(root.ProgramInfo, 'Program').map(toProgram),
        priceRules: list(root.PriceRuleInfo, 'PriceRule').map(toPriceRule),
    };
}

// ---------- Dealer Portal ----------

function toQuoteClient(n: XmlNode): QuoteClient {
    return {
        email: text(n, 'Email'),
        firstName: text(n, 'First_name'),
        lastName: text(n, 'Last_name'),
        secondaryOwnerOrCompany: text(n, 'Secondary_owner_or_company'),
        distributorName: text(n, 'Distributor_name'),
        address: text(n, 'Address'),
        address2: text(n, 'Address2'),
        city: text(n, 'City'),
        province: text(n, 'Province'),
        postalCode: text(n, 'Postal_code'),
        telHome: text(n, 'Tel_home'),
        telWork: text(n, 'Tel_work'),
        indianStatusCertificate: text(n, 'Indian_status_certificate'),
        driversLicense: text(n, 'Drivers_license'),
    };
}

function toVehicleInfo(n: XmlNode): VehicleInfo {
    return {
        vehicleType: text(n, 'VehicleType'),
        vehicleId: text(n, 'VehicleID'),
        vin: text(n, 'VIN'),
        branch: text(n, 'Branch'),
        model: text(n, 'Model'),
        year: text(n, 'Year'),
        price: text(n, 'Price'),
        km: text(n, 'Km'),
        condition: text(n, 'Condition'),
        fuelType: text(n, 'FuelType'),
        transmission: text(n, 'Transmission'),
        cylinders: text(n, 'Cylinders'),
        engineSize: text(n, 'EngineSize'),
        engineSizeUnit: text(n, 'EngineSizeUnit'),
        designation: text(n, 'Designation'),
        isTurboEngine: text(n, 'IsTurboEngine'),
        is4x4: text(n, 'Is4X4'),
        isAllWheelDrive: text(n, 'IsAllWheelDrive'),
        fullCoverageEndDate: text(n, 'FullCoverageEndDate'),
        fullCoverageMaxMile: text(n, 'FullCoverageMaxMile'),
        powertrainCoverageEndDate: text(n, 'PowertrainCoverageEndDate'),
        powertrainCoverageMaxMile: text(n, 'PowertrainCoverageMaxMile'),
    };
}

function toQuoteVehicle(n: XmlNode): QuoteVehicle {
    return {
        vehicleInfo: toVehicleInfo(typeof n === 'object' ? n.VehicleInfo : undefined),
        deliveryDate: text(n, 'DeliveryDate'),
        price: text(n, 'Price'),
    };
}

function toQuoteWarranty(n: XmlNode): QuoteWarranty {
    const obj = typeof n === 'object' ? n : {};
    return {
        warrantyId: text(n, 'WarrantyID'),
        programName: text(n, 'ProgramName'),
        programOption: text(n, 'ProgramOption'),
        programDescription: text(n, 'ProgramDescription'),
        optionTerm: text(n, 'OptionTerm'),
        optionTermMonth: text(n, 'OptionTermMonth'),
        optionTermKm: text(n, 'OptionTermKm'),
        optionTermPrice: text(n, 'OptionTermPrice'),
        optionTermAmountPerVisit: text(n, 'OptionTermAmountPerVisit'),
        optionTermAmountTotal: text(n, 'OptionTermAmountTotal'),
        optionTermAmountText: text(n, 'OptionTermAmountText'),
        // Empty <ComponnentName/> entries are kept: the expected warranty PDF content counts them
        extraComponents: list<string>(obj.ExtraComponents, 'ComponnentName')
            .map(c => (typeof c === 'string' ? c : '')),
        salePrice: text(n, 'SalePrice'),
        financingCompany: text(n, 'FinancingCompany'),
        vehicleDeliveryDate: text(n, 'VehicleDeliveryDate'),
        sameAsDeliveryDate: text(n, 'SameAsDeliveryDate'),
        warrantyStartDate: text(n, 'WarrantyStartDate'),
    };
}

function toQuoteSaleContract(n: XmlNode): QuoteSaleContract {
    return {
        contractNumber: text(n, 'ContractNumber'),
        salesRepName: text(n, 'SalesRepName'),
        deliveredOn: text(n, 'DeliveredOn'),
        signedOn: text(n, 'SignedOn'),
        signedLocation: text(n, 'SignedLocation'),
        discountAmount: text(n, 'DiscountAmount'),
        vehicleMarketValue: text(n, 'VehicleMarketValue'),
        transitAmount: text(n, 'TransitAmount'),
        rdprmAmount: text(n, 'RDPRM_Amount'),
        warrantyAmount: text(n, 'WarrantyAmount'),
        accessories: text(n, 'Accessories'),
        accessoriesAmount: text(n, 'AccessoriesAmount'),
        newTiresDutyAmount: text(n, 'NewTiresDutyAmount'),
        maintenanceScheduleAmount: text(n, 'MaintenanceScheduleAmount'),
        replacementInsuranceAmount: text(n, 'ReplacementInsuranceAmount'),
        replacementInsuranceContractNumber: text(n, 'ReplacementInsuranceContractNumber'),
        loanInsuranceAmount: text(n, 'LoanInsuranceAmount'),
        loanInsuranceContractNumber: text(n, 'LoanInsuranceContractNumber'),
        depositAmount: text(n, 'DepositAmount'),
        otherClause: text(n, 'OtherClause'),
    };
}

function toQuoteExchangeVehicle(n: XmlNode): QuoteExchangeVehicle {
    return {
        vin: text(n, 'VIN'),
        branch: text(n, 'Branch'),
        model: text(n, 'Model'),
        year: text(n, 'Year'),
        cylinders: text(n, 'Cylinders'),
        licensePlateNumber: text(n, 'LicensePlateNumber'),
        km: text(n, 'Km'),
        realKilometers: text(n, 'RealKilometers'),
        isAccommodationSale: text(n, 'IsAccommodationSale'),
        accommodationSaleContractNumber: text(n, 'AccommodationSaleContractNumber'),
        taxRegistration: text(n, 'TaxRegistration'),
        valueAmount: text(n, 'ValueAmount'),
        balanceAmount: text(n, 'BalanceAmount'),
        bank: text(n, 'Bank'),
    };
}

function toQuoteInfo(n: XmlNode): QuoteInfo {
    const obj = typeof n === 'object' ? n : {};
    const sale = obj.QuoteSale ?? {};
    return {
        quoteClient: toQuoteClient(obj.QuoteClient),
        quoteVehicle: toQuoteVehicle(obj.QuoteVehicle),
        quoteWarranty: toQuoteWarranty(obj.QuoteWarranty),
        quoteSale: {
            quoteSaleContract: toQuoteSaleContract(sale.QuoteSaleContract),
            quoteExchangeVehicle: toQuoteExchangeVehicle(sale.QuoteExchangeVehicle),
        },
    };
}

function toInvoiceInfo(n: XmlNode): InvoiceInfo {
    return {
        taxInfo1: text(n, 'TaxInfo1'),
        taxInfo2: text(n, 'TaxInfo2'),
        apt1: text(n, 'Apt1'),
        apt2: text(n, 'Apt2'),
    };
}

export function loadDealerPortalData(relativePath: string): DealerPortalData {
    const root = readXml(relativePath).DealerPortal ?? {};
    return {
        quoteInfo: root.QuoteInfo ? toQuoteInfo(root.QuoteInfo) : undefined,
        vehicleInfo: root.VehicleInfo ? toVehicleInfo(root.VehicleInfo) : undefined,
        invoiceInfo: root.InvoiceInfo ? toInvoiceInfo(root.InvoiceInfo) : undefined,
    };
}

/** Quote data of a dealer test file; throws when the file has no <QuoteInfo> */
export function loadQuoteInfo(relativePath: string): QuoteInfo {
    const data = loadDealerPortalData(relativePath);
    if (!data.quoteInfo) throw new Error(`No <QuoteInfo> in test data file ${relativePath}`);
    return data.quoteInfo;
}

/** Dealer account details the PDFs and invoice are verified against */
export function loadDealerAccount(): Dealer {
    return loadAdminPortalData('AdminPortal/TC_145_AdminPortal_Request.xml').dealers[0];
}
