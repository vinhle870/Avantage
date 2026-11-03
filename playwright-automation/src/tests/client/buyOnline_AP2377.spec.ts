import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { BUY_TEXT, BuyOnlineFlow } from '../../flows/BuyOnlineFlow';
import type { BuyOnlineClient, BuyOnlineVehicle } from '../../pages/common/BuyOnlinePage';

/**
 * Customer portal "buy a warranty online" changes — automated from AP-2377 manual test cases.
 * Source: qa-artifacts/3-test-cases/AP2377_TestCases_001-005.md, AP2377_TestCases_006-010.md
 * Execution: qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2377_2026-11-02.md (Dev, v2dev)
 *
 * Only the cases that PASSED manually (001, 002, 003, 005, 006, 007, 009). 004, 008 and 011 FAILED
 * (bugs AP-2510, AP-2511) and 010 is BLOCKED (no payment test data), so they are not automated.
 * Test data is Dev's: VIN 5YJ3E1EA0LF734293 decodes to a 2020 TESLA Model 3 offering program CVE / BEV,
 * term 126 (60m/Unlimited mileage, shown as "CVE 60m/0km") and surcharge 50 (air suspension) — so the
 * suite skips itself unless the configured base URL is v2dev.
 * Every run leaves new purchase sessions on Dev, one per test, with a unique
 * client.stage.<timestamp>@yopmail.com email. Nothing is paid: no spec ticks the terms box or presses
 * "Continue with payment" / "Continuer au paiement".
 */
const VIN = '5YJ3E1EA0LF734293';
const TERM_CVE_60M = '126';
const SURCHARGE_AIR_SUSPENSION = '50';
const AIR_SUSPENSION_FR = "Ce véhicule est-il équipé d'un système de suspension pneumatique ?";

const email = (): string => `client.stage.${Date.now()}@yopmail.com`;

const vehicle = (mail: string, withWarranty = false): BuyOnlineVehicle => ({
    vin: VIN,
    mileage: '10000',
    email: mail,
    postalCode: 'H7L0C4',
    marketValue: '45000.00',
    ...(withWarranty ? { warrantyNumber: '2131331', warrantyEndDate: '2027-12-18', warrantyMileageLimit: '100000' } : {}),
});

const client = (mail: string): BuyOnlineClient => ({
    firstName: 'Client',
    lastName: `QA-AP2377-${Date.now()}`,
    address1: '2280 de la Rousserolle',
    city: 'Laval',
    provinceValue: '1',           // Québec
    postalCode: 'H7L0C4',
    phone1: '5146906330',
    email: mail,
});

test.describe('Customer Portal Buy Online Changes @client @AP-2377', () => {
    test.skip(!/v2dev\./.test(config.baseUrl), 'AP-2377 test data (VIN 5YJ3E1EA0LF734293, term 126, surcharge 50) is verified on Dev (v2dev) only');

    test('AP2377_001_VehicleFormEndsWithCurrentWarrantySectionAndContinueButton', async ({ page }) => {
        const buy = new BuyOnlineFlow(page);

        await buy.openVehicleStep('en');
        await buy.enterVehicle(vehicle(email()));
        await buy.verifyWarrantySectionAtEndOfForm();
        await buy.verifySubmitLabel(BUY_TEXT.en.vehicleButton, 'vehicle step');
    });

    test('AP2377_002_FrenchButtonsReadContinuerAndDemanderUnDevis', async ({ page }) => {
        const buy = new BuyOnlineFlow(page);
        const mail = email();

        await buy.openVehicleStep('fr');
        await buy.enterVehicle(vehicle(mail));
        await buy.verifySubmitLabel(BUY_TEXT.fr.vehicleButton, 'vehicle step');
        await buy.submitVehicleStep();
        await buy.enterClient(client(mail), false);
        await buy.verifySubmitLabel(BUY_TEXT.fr.clientButton, 'Client Info');
    });

    test('AP2377_003_SubmittingVehicleFormOpensClientInfoBeforeCoverage', async ({ page }) => {
        const buy = new BuyOnlineFlow(page);

        await buy.openVehicleStep('fr');
        await buy.verifyStepBar('fr', 0);
        await buy.enterVehicle(vehicle(email(), true));
        await buy.submitVehicleStep();
        await buy.verifyStepBar('fr', 1);
    });

    test('AP2377_005_ClientInfoShowsUntickedFormL25CheckboxAndGetRatesNowButton', async ({ page }) => {
        const buy = new BuyOnlineFlow(page);

        await buy.openVehicleStep('en');
        await buy.enterVehicle(vehicle(email()));
        await buy.submitVehicleStep();
        await buy.verifyStepBar('en', 1);
        await buy.verifyAgreePolicyCheckbox();
        await buy.verifySubmitLabel(BUY_TEXT.en.clientButton, 'Client Info');
    });

    test('AP2377_006_GetRatesNowWithFormL25TickedOpensCoverageStep', async ({ page }) => {
        const buy = new BuyOnlineFlow(page);
        const mail = email();

        await buy.openVehicleStep('en');
        await buy.enterVehicle(vehicle(mail, true));
        await buy.submitVehicleStep();
        await buy.enterClient(client(mail), true);
        await buy.submitClientAndVerifyCoverageStep();
        await buy.verifyStepBar('en', 2);
    });

    test('AP2377_007_GetRatesNowWithFormL25UntickedShowsNoErrorPageAndKeepsClientDetails', async ({ page }) => {
        const buy = new BuyOnlineFlow(page);
        const mail = email();
        const details = client(mail);

        await buy.openVehicleStep('en');
        await buy.enterVehicle(vehicle(mail, true));
        await buy.submitVehicleStep();
        await buy.enterClient(details, false);
        await buy.submitClientAndVerifyRefusedWithValuesKept(details);
    });

    test('AP2377_009_SurchargeAnsweredNoShowsNoOuiLineOnTheSummary', async ({ page }) => {
        const buy = new BuyOnlineFlow(page);
        const mail = email();

        await buy.openVehicleStep('fr');
        await buy.enterVehicle(vehicle(mail, true));
        await buy.submitVehicleStep();
        await buy.enterClient(client(mail), true);
        await buy.submitClientAndVerifyCoverageStep('fr');
        await buy.chooseTermAnswerSurchargeAndReachSummary(TERM_CVE_60M, SURCHARGE_AIR_SUSPENSION, 'no');
        await buy.verifySummaryHasNoYesLine(/CVE\s+CVE 60m\/0km\s+BEV/, AIR_SUSPENSION_FR);
    });
});
