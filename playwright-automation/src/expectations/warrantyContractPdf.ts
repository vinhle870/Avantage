import fs from 'fs';
import path from 'path';
import { Dealer } from '../data/admin-portal';
import { QuoteInfo, VehicleInfo } from '../data/dealer-portal';
import { TEST_DATA_ROOT } from '../data/testDataLoader';
import { addMonthsIso, formatGrouped, formatPlain, replaceAllLiteral as rep, toNumber } from '../core/utils/javaFormat';

/**
 * Expected text of the warranty contract PDF.
 * Port of WarrantyDetailsPage_Func.generateExpectedWarrantyPDFContent plus the
 * clean-up DealerSteps.verifyWarrantyContentIsCorrect applied before comparing.
 */

const TEMPLATE_FILE = path.join(TEST_DATA_ROOT, 'Template', 'template_WarrantyContractPdf.txt');

const DEALER_PROVINCE_CODES: Record<string, string> = {
    'Quebec': 'QC',
    'New Brunswick': 'NB',
    'Ontario': 'ON',
    'Nova Scotia': 'NS',
    'Alberta': 'AB',
    'British Columbia': 'BC',
    'Manitoba': 'MB',
    'Saskatchewan': 'SK',
    'Prince Edward Island': 'PE',
    'Newfoundland and Labrador': 'NL',
    'Nunavut': 'NU',
    'Yukon': 'YT',
    'Northwest territories': 'NT',
};

interface TaxRule { gst: number; pst: number; gstText: string; pstText: string }

/** Taxes on the warranty by client province (spellings as in the client dropdown) */
const CLIENT_PROVINCE_TAXES: Record<string, TaxRule> = {
    'Québec': { gst: 0.05, pst: 0.09975, gstText: 'GST : $', pstText: 'PST : $' },
    'New Brunswick': { gst: 0.15, pst: 0, gstText: 'HST : $', pstText: 'RemoveTax' },
    'Ontario': { gst: 0.13, pst: 0, gstText: 'HST : $', pstText: 'RemoveTax' },
    // Nova Scotia HST is 14 % since 2025-04-01 (was 15 %)
    'Nova Scotia': { gst: 0.14, pst: 0, gstText: 'HST : $', pstText: 'RemoveTax' },
    'Alberta': { gst: 0.05, pst: 0, gstText: 'GST : $', pstText: 'RemoveTax' },
    'British Columbia': { gst: 0.05, pst: 0.07, gstText: 'GST : $', pstText: 'PST : $' },
    'Manitoba': { gst: 0.05, pst: 0.07, gstText: 'GST : $', pstText: 'PST : $' },
    'Saskatchewan': { gst: 0.05, pst: 0.06, gstText: 'GST : $', pstText: 'PST : $' },
    'Prince Edward Island': { gst: 0.15, pst: 0, gstText: 'HST : $', pstText: 'RemoveTax' },
    'Newfoundland and Labrador': { gst: 0.15, pst: 0, gstText: 'HST : $', pstText: 'RemoveTax' },
    'Nunavut': { gst: 0.05, pst: 0, gstText: 'GST : $', pstText: 'RemoveTax' },
    'Yukon': { gst: 0.05, pst: 0, gstText: 'GST : $', pstText: 'RemoveTax' },
    'Northwest Territories': { gst: 0.05, pst: 0, gstText: 'GST : $', pstText: 'RemoveTax' },
};

/** " value" when value is set, '' otherwise */
const prefixed = (value: string, prefix = ' ') => (value ? prefix + value : '');
/** "value " when value is set, '' otherwise */
const suffixed = (value: string, suffix = ' ') => (value ? value + suffix : '');
const orDash = (value: string) => value || '-';

export function buildExpectedWarrantyPdfContent(quoteInfo: QuoteInfo, dealer: Dealer, vehicle: VehicleInfo): string {
    const client = quoteInfo.quoteClient;
    const warranty = quoteInfo.quoteWarranty;
    const salePrice = toNumber(warranty.salePrice);

    let result = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

    const dealerProvince = DEALER_PROVINCE_CODES[dealer.province];
    if (dealerProvince) result = rep(result, '${DealerProvince}', dealerProvince);

    // Taxes — none for clients with an Indian status certificate
    const tax = CLIENT_PROVINCE_TAXES[client.province];
    let gst = tax ? salePrice * tax.gst : 0;
    let pst = tax ? salePrice * tax.pst : 0;
    if (client.indianStatusCertificate === '') {
        result = rep(result, '${WarrantyGST}', (tax?.gstText ?? '') + formatGrouped(gst));
        result = rep(result, '${WarrantyPST}', (tax?.pstText ?? '') + formatGrouped(pst));
    } else {
        gst = 0;
        pst = 0;
        result = rep(result, '${WarrantyGST}', '');
        result = rep(result, '${WarrantyPST}', '');
    }

    // Vehicle
    result = rep(result, '${Vehicle_MAKE}', vehicle.branch);
    result = rep(result, '${Vehicle_MODEL}', vehicle.model);
    result = rep(result, '${Vehicle_YEAR}', vehicle.year);
    // One tick for "Automatic", then one per ticked feature
    let ticks = '✓';
    if (vehicle.fuelType === 'DIESEL') ticks += ' ✓';
    if (vehicle.isTurboEngine === 'Yes') ticks += ' ✓';
    if (vehicle.is4x4 === 'Yes') ticks += ' ✓';
    if (vehicle.isAllWheelDrive === 'Yes') ticks += ' ✓';
    result = rep(result, '${Vehicle_Automatic}', ticks);
    result = rep(result, '${Vehicle_VIN}', vehicle.vin);
    result = rep(result, '${Vehicle_CYLINDERS}', vehicle.cylinders);
    result = rep(result, '${Vehicle_ EngineSize}', vehicle.engineSize);
    result = rep(result, '${Vehicle_ EngineSizeUnit}', vehicle.engineSizeUnit);
    result = rep(result, '${Vehicle_DeliveredDate}', quoteInfo.quoteVehicle.deliveryDate);
    result = rep(result, '${Vehicle_km}', vehicle.km);
    result = rep(result, '${Vehicle_Price}', formatPlain(toNumber(vehicle.price)));
    result = rep(result, '${Vehicle_CONDITION}', vehicle.condition);

    // Client
    result = rep(result, '${ClientLastName}', client.lastName);
    result = rep(result, '${ClientFirstName}', client.firstName);
    result = rep(result, '${ClientCompany}', client.secondaryOwnerOrCompany);
    result = rep(result, '${ClientAddress}', client.address);
    result = rep(result, '${ClientAddress2}', prefixed(client.address2));
    result = rep(result, '${ClientCity}', suffixed(client.city));
    result = rep(result, '${ClientPROVINCE}', client.province);
    result = rep(result, '${ClientPostal}', prefixed(client.postalCode));
    result = rep(result, '${ClientTelHome}', suffixed(client.telHome));
    result = rep(result, '${ClientTelWork}', suffixed(client.telWork));
    result = rep(result, '${ClientEmail}', client.email);

    // Program
    result = rep(result, '${ProgramOptionTermMonth}', warranty.optionTermMonth);
    result = rep(result, '${ProgramOptionKm}', warranty.optionTermKm);
    result = rep(result, '${ProgramOption}', warranty.programOption);
    result = rep(result, '${ProgramDescription}', warranty.programDescription);
    result = rep(result, '${ProgramOptionTermPrice}', warranty.optionTermPrice);
    result = rep(result, '${ProgramOptionTermAmountPerVisit}', warranty.optionTermAmountPerVisit);
    result = rep(result, '${ProgramOptionTermAmountTotal}', warranty.optionTermAmountTotal ? ' ' + warranty.optionTermAmountTotal : ' ');
    result = rep(result, '${ProgramOptionTermAmountText}', warranty.optionTermAmountText ? ' ' + warranty.optionTermAmountText : ' ');
    result = rep(result, '${WarrantyStartDate}', warranty.warrantyStartDate);
    result = rep(result, '${WarrantyEndDate}', addMonthsIso(warranty.warrantyStartDate, toNumber(warranty.optionTermMonth)));

    // Manufacturer coverage
    result = rep(result, '${VehicleFullDate}', orDash(vehicle.fullCoverageEndDate));
    result = rep(result, '${VehicleFullKm}', orDash(vehicle.fullCoverageMaxMile));
    result = rep(result, '${VehiclePowertrainDate}', orDash(vehicle.powertrainCoverageEndDate));
    result = rep(result, '${VehiclePowertrainKm}', orDash(vehicle.powertrainCoverageMaxMile));

    // Price
    result = rep(result, '${WarrantyPrice}', formatGrouped(salePrice));
    result = rep(result, '${WarrantyTotalPrice}', formatGrouped(salePrice + gst + pst));

    // Extra components, sorted like Collections.sort
    const components = [...warranty.extraComponents].sort();
    result = rep(result, '${ProgramComponent}', components.map(c => c + '\n').join(''));

    // Dealer
    result = rep(result, '${DealerCompany}', dealer.companyName ? `\n${dealer.companyName}\n` : '');
    result = rep(result, '${DealerAddress}', dealer.address ? `\n${dealer.address}\n` : '');
    result = rep(result, '${DealerCity}', dealer.city);
    result = rep(result, '${DealerPostalCode}', dealer.postalCode);
    result = rep(result, '${DealerPhone}', dealer.phone);
    if (dealer.isShowTaxInfo === 'True') {
        result = rep(result, '${DealerRegistrationGST}', '\nRegistration GST: ' + dealer.registrationGST);
        result = rep(result, '${DealerRegistrationPST}', '\nRegistration PST: ' + dealer.registrationPST);
    } else {
        result = rep(result, '${DealerRegistrationGST}', '');
        result = rep(result, '${DealerRegistrationPST}', '');
    }

    // Clean-up from DealerSteps.verifyWarrantyContentIsCorrect
    result = result.replace(/\r/g, '');
    result = rep(result, 'RemoveTax0.00', '');
    result = result.replace(/\n{2,}/g, '\n');
    return result;
}
