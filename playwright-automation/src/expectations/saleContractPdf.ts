import fs from 'fs';
import path from 'path';
import { Dealer } from '../data/admin-portal';
import { QuoteInfo } from '../data/dealer-portal';
import { TEST_DATA_ROOT } from '../data/testDataLoader';
import { formatAccounting, formatGrouped, replaceAllLiteral as rep, toNumber } from '../core/utils/javaFormat';

/**
 * Expected text of the vehicle sale contract PDF.
 * Port of quoteSaleContractPage_Func.generateExpectedSaleContractPDFContent,
 * pdfFactory/SaleContractPdf (the amounts) and the clean-up
 * DealerSteps.verifySaleContractContentIsCorrect applied before comparing.
 */

const TEMPLATE_FILE = path.join(TEST_DATA_ROOT, 'Template', 'template_SaleContractPdf.txt');

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

/** The lettered amounts printed on the contract (SaleContractPdf.java) */
export interface SaleContractAmounts {
    A_vehiclePrice: number;
    C_netSubTotal: number;
    E_subTotalWithExchange: number;
    F_gst: number;
    G_subTotalBeforeQst: number;
    I_qst: number;
    J_subTotal: number;
    L_total: number;
    soldeTotal: number;
    M_extendedWarranty: number;
    N_accessories: number;
    O_newTiresSpecificDuty: number;
    P_maintenanceProgram: number;
    Q_gst2: number;
    R_qst2: number;
    S_total2: number;
    T_replacementInsurance: number;
    U_lifeDisabilityInsurance: number;
    V_insuranceTax: number;
    W_insuranceTotal: number;
    financedQstOrPaidToSaaq: number;
    advancePayment: number;
    financedBalanceIncludingQst: number;
    payableBalanceExcludingQst: number;
}

/** Port of pdfFactory.createSaleContractPdf */
export function calculateSaleContractAmounts(quoteInfo: QuoteInfo): SaleContractAmounts {
    const contract = quoteInfo.quoteSale.quoteSaleContract;
    const exchange = quoteInfo.quoteSale.quoteExchangeVehicle;
    const taxExempt = quoteInfo.quoteClient.indianStatusCertificate !== '';

    const A = toNumber(quoteInfo.quoteVehicle.price);
    const B = -toNumber(contract.discountAmount);
    const C = A + B;
    const D = -toNumber(exchange.valueAmount);
    const E = C + D;
    const rawGst = taxExempt ? 0 : E * 0.05;
    // SaleContractPdf.getF_GST()/getI_QST() report 0 whenever the GST is not positive
    const F = rawGst <= 0 ? 0 : rawGst;
    const G = E + F;
    const rawQst = taxExempt ? 0 : E * 0.09975;
    const I = rawGst <= 0 ? 0 : rawQst;
    const J = G + I;
    const K = toNumber(exchange.balanceAmount);
    const L = J + K;
    const Z1 = toNumber(contract.transitAmount);
    const Z2 = toNumber(contract.rdprmAmount);
    const soldeTotal = L + Z1 + Z2;

    const M = toNumber(quoteInfo.quoteWarranty.salePrice);
    const N = toNumber(contract.accessoriesAmount);
    const O = toNumber(contract.newTiresDutyAmount);
    const P = toNumber(contract.maintenanceScheduleAmount);
    const Q = taxExempt ? 0 : (M + N + O + P) * 0.05;
    const R = taxExempt ? 0 : (M + N + O + P) * 0.09975;
    const S = M + N + O + P + Q + R;

    const T = toNumber(contract.replacementInsuranceAmount);
    const U = toNumber(contract.loanInsuranceAmount);
    const V = taxExempt ? 0 : T * 0.09 + U * 0.09;
    const W = T + U + V;

    const advancePayment = toNumber(contract.depositAmount);
    const financedBalanceIncludingQst = soldeTotal + S + W - advancePayment;

    return {
        A_vehiclePrice: A,
        C_netSubTotal: C,
        E_subTotalWithExchange: E,
        F_gst: F,
        G_subTotalBeforeQst: G,
        I_qst: I,
        J_subTotal: J,
        L_total: L,
        soldeTotal,
        M_extendedWarranty: M,
        N_accessories: N,
        O_newTiresSpecificDuty: O,
        P_maintenanceProgram: P,
        Q_gst2: Q,
        R_qst2: R,
        S_total2: S,
        T_replacementInsurance: T,
        U_lifeDisabilityInsurance: U,
        V_insuranceTax: V,
        W_insuranceTotal: W,
        financedQstOrPaidToSaaq: I,
        advancePayment,
        financedBalanceIncludingQst,
        payableBalanceExcludingQst: financedBalanceIncludingQst - I,
    };
}

export function buildExpectedSaleContractPdfContent(quoteInfo: QuoteInfo, dealer: Dealer): string {
    const client = quoteInfo.quoteClient;
    const contract = quoteInfo.quoteSale.quoteSaleContract;
    const vehicle = quoteInfo.quoteVehicle.vehicleInfo;
    const exchange = quoteInfo.quoteSale.quoteExchangeVehicle;
    const amounts = calculateSaleContractAmounts(quoteInfo);

    let result = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

    // ---- General info ----
    let dealerLocation = dealer.address + (dealer.city ? ' ' + dealer.city : '');
    const provinceCode = DEALER_PROVINCE_CODES[dealer.province];
    if (provinceCode) dealerLocation += ', ' + provinceCode;

    result = rep(result, '${Contract_Number}', contract.contractNumber);
    result = rep(result, '${Contract_SalesRepName}', contract.salesRepName);
    result = rep(result, '${Contract_Signedon}', contract.signedOn);
    result = rep(result, '${Contract_Signedlocation}', contract.signedLocation ? ' ' + contract.signedLocation : '');
    result = rep(result, '${Dealer_Name}', dealer.companyName);
    result = rep(result, '${Dealer_Location}', dealerLocation);
    result = rep(result, '${Dealer_PostalCode}', dealer.postalCode);
    result = rep(result, '${Dealer_Phone}', dealer.phone);
    result = rep(result, '${Dealer_RegistrationPST}', dealer.registrationPST);
    result = rep(result, '${Dealer_RegistrationGST}', dealer.registrationGST ? ' ' + dealer.registrationGST : '');
    result = rep(result, '${Dealer_LicenseNumber}', dealer.licenseNo);
    result = rep(result, '${ClientFirstName}', client.firstName);
    result = rep(result, '${ClientLastName}', client.indianStatusCertificate
        ? `${client.lastName} (${client.indianStatusCertificate}) - Hereafter, to be known as CSSI / SCIS`
        : client.lastName);
    result = rep(result, '${ClientEmail}', client.email);
    result = rep(result, '${ClientAddress}', client.address);
    result = rep(result, '${ClientAddress2}', client.address2 ? ' ' + client.address2 : '');
    result = rep(result, '${ClientDriverLicense}', client.driversLicense);
    result = rep(result, '${ClientCity}', client.city);
    result = rep(result, '${ClientPhone}', client.telWork);
    result = rep(result, '${ClientPROVINCE}', client.province);
    result = rep(result, '${ClientSecOwnerOrComp}', client.secondaryOwnerOrCompany);
    result = rep(result, '${ClientPostal}', client.postalCode);
    result = rep(result, '${ClientCELL}', client.telHome);
    result = rep(result, '${WarrantID}', quoteInfo.quoteWarranty.warrantyId);

    // ---- Vehicle ----
    result = rep(result, '${Vehicle_MAKE}', vehicle.branch);
    result = rep(result, '${Vehicle_MODEL}', vehicle.model);
    result = rep(result, '${Vehicle_YEAR}', vehicle.year);
    result = rep(result, '${Vehicle_VIN}', vehicle.vin);
    result = rep(result, '${Vehicle_CYLINDERS}', vehicle.cylinders);
    result = rep(result, '${Vehicle_ EngineSize}', vehicle.engineSize);
    result = rep(result, '${Vehicle_ EngineSizeUnit}', vehicle.engineSizeUnit);
    let ticks = 'x';
    if (vehicle.fuelType === 'DIESEL') ticks += ' x';
    if (vehicle.isTurboEngine === 'Yes') ticks += ' x';
    if (vehicle.is4x4 === 'Yes') ticks += ' x';
    if (vehicle.isAllWheelDrive === 'Yes') ticks += ' x';
    result = rep(result, '${Vehicle_Automatic}', ticks);
    result = rep(result, '${Vehicle_CONDITION}', vehicle.condition);
    result = rep(result, '${Vehicle_km}', vehicle.km);
    result = rep(result, '${Vehicle_ID}', vehicle.vehicleId);
    result = rep(result, '${Vehicle_Price}', formatGrouped(toNumber(quoteInfo.quoteVehicle.price)));

    // ---- Contract amounts ----
    result = rep(result, '${Contract_DeliveredOn}', contract.deliveredOn);
    result = rep(result, '${Contract_DISCOUNT}', formatGrouped(toNumber(contract.discountAmount)));
    result = rep(result, '${Contract_NETSUBTOTAL}', formatGrouped(amounts.C_netSubTotal));
    result = rep(result, '${Contract_EXCHANGE}', formatGrouped(toNumber(exchange.valueAmount)));
    result = rep(result, '${Contract_SUBTOTALWITHEXCHANGE}', formatAccounting(amounts.E_subTotalWithExchange));
    result = rep(result, '${Contract_F_GST}', formatGrouped(amounts.F_gst));
    result = rep(result, '${Contract_G_SUBTOTALBeforeQST}', formatAccounting(amounts.G_subTotalBeforeQst));
    result = rep(result, '${Contract_H_MARKETVALUE}', formatGrouped(toNumber(contract.vehicleMarketValue)));
    result = rep(result, '${Contract_I_QST}', formatGrouped(amounts.I_qst));
    result = rep(result, '${Contract_J_SUBTOTAL}', formatAccounting(amounts.J_subTotal));
    result = rep(result, '${Contract_K_BALANCEDUEONEXCHANGEVEHICLE}', formatGrouped(toNumber(exchange.balanceAmount)));
    result = rep(result, '${Contract_L_TOTAL}', formatAccounting(amounts.L_total));
    result = rep(result, '${Contract_Z1_TRANSIT}', formatGrouped(toNumber(contract.transitAmount)));
    result = rep(result, '${Contract_Z2_RDPRM}', formatGrouped(toNumber(contract.rdprmAmount)));
    result = rep(result, '${Contract_SOLDETOTAL}', formatAccounting(amounts.soldeTotal));
    result = rep(result, '${Contract_M_EXTENDEDWARRANTY}', formatGrouped(amounts.M_extendedWarranty));
    result = rep(result, '${WarrantID}', '');
    result = rep(result, '${Contract_N_ACC}', contract.accessories ? contract.accessories + ' ' : '');
    result = rep(result, '${Contract_AccessoriesAmount}', formatGrouped(amounts.N_accessories));
    result = rep(result, '${Contract_O_NEWTIRESSPECIFICDUTY}', formatGrouped(amounts.O_newTiresSpecificDuty));
    result = rep(result, '${Contract_P_MAINTENANCEPROGRAM}', formatGrouped(amounts.P_maintenanceProgram));
    result = rep(result, '${Contract_Q_GST}', formatGrouped(amounts.Q_gst2));
    result = rep(result, '${Contract_R_QST}', formatGrouped(amounts.R_qst2));
    result = rep(result, '${Contract_S_TOTAL}', formatGrouped(amounts.S_total2));
    result = rep(result, '${Contract_T_REPLACEMENTINSURANCE}', formatGrouped(amounts.T_replacementInsurance));
    result = rep(result, '${Contract_ReplacementInsuranceContractNumber}', contract.replacementInsuranceContractNumber);
    result = rep(result, '${Contract_U_LIFEDISABILITYINSURANCE}', formatGrouped(amounts.U_lifeDisabilityInsurance));
    result = rep(result, '${Contract_LoanInsuranceContractNumber}', contract.loanInsuranceContractNumber);
    result = rep(result, '${Contract_V_9PERCENTINSURANCETAX}', formatGrouped(amounts.V_insuranceTax));
    result = rep(result, '${Contract_W_INSURANCESTOTAL}', formatGrouped(amounts.W_insuranceTotal));
    result = rep(result, '${Contract_FinancedQSTOrPaidToSAAQ}', formatGrouped(amounts.financedQstOrPaidToSaaq));
    result = rep(result, '${Contract_AdvancePayment}', formatGrouped(amounts.advancePayment));
    result = rep(result, '${Contract_FINANCEDBALANCEIncludingQST}', formatAccounting(amounts.financedBalanceIncludingQst));
    result = rep(result, '${Contract_PAYABLEBALANCEExcludingQST}', formatAccounting(amounts.payableBalanceExcludingQst));
    result = rep(result, '${Contract_OTHERCLAUSE}', contract.otherClause);

    // ---- Exchange vehicle ----
    result = rep(result, '${ExchangeVehicle_Make_Model}', `${exchange.branch} ${exchange.model}`);
    result = rep(result, '${ExchangeVehicle_Vin_CYLINDERS}', `${exchange.vin} ${exchange.cylinders}`);
    result = rep(result, '${ExchangeVehicle_LicensePlateNumber_KM}', `${exchange.licensePlateNumber} ${exchange.km}`);
    result = rep(result, '${ExchangeVehicle_RealKM}', exchange.isAccommodationSale === 'Yes'
        ? `${exchange.realKilometers}x\n${exchange.accommodationSaleContractNumber}`
        : `${exchange.realKilometers}x`);
    result = rep(result, '${ExchangeVehicle_Year}', exchange.year);
    result = rep(result, '${ExchangeVehicle_TaxRegistration}', exchange.taxRegistration ? ' ' + exchange.taxRegistration : '');
    result = rep(result, '${ExchangeVehicle_BalanceAmount}', exchange.balanceAmount);
    result = rep(result, '${ExchangeVehicle_Bank}', exchange.bank);

    // Clean-up from DealerSteps.verifySaleContractContentIsCorrect
    result = result.replace(/\r/g, '');
    result = result.replace(/^ \n/gm, '\n');
    result = result.replace(/\n{2,}/g, '\n');
    return result;
}
