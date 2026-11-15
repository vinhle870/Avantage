import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { QuoteClient } from '../../data/dealer-portal';
import { RoadSideProtectionFlow } from '../../flows/RoadSideProtectionFlow';
import { WarrantyTestVehicle, WarrantyVehicleFormFlow } from '../../flows/WarrantyVehicleFormFlow';

/**
 * Add-roadside-protection modal — vehicle form (VIN, Year, Make, Model) — automated from the AP-2498 manual
 * test cases that PASSED on Dev (v2dev) on 2026-11-02.
 * Source: qa-artifacts/3-test-cases/AP2498_TestCases_006-010.md
 *
 * Not automated: AP2498_001–003, 005, 006, 009–013 (FAIL — AP-2523 notice text, AP-2524 form folded behind
 * "Edit", AP-2525 VIN not required) and AP2498_004 / 014 (BLOCKED). Nothing here asserts the notice text,
 * the folded form or the VIN's required state.
 *
 * Test data: every test leaves one inventory vehicle (Toyota Corolla 2022, VIN AP2498A + 10 digits), one client
 * (qa.ap2498.<tc>.<stamp>@yopmail.com) and one quote per run — dealers cannot delete quotes. The modal is only
 * opened and read: "Continue", "Save" and "Generate Contract" are never pressed, so no roadside row is created.
 *
 * AP-2498 is tested on Dev only, so the suite runs only when the dealer portal URL points at v2dev.
 */
const newVehicle = (): WarrantyTestVehicle => ({
    vin: `AP2498A${Date.now().toString().slice(-10)}`,
    make: 'Toyota', model: 'Corolla', year: '2022', kilometers: '15000', price: '20000',
});

const newClient = (tc: string): QuoteClient => {
    const stamp = Date.now();
    return {
        email: `qa.ap2498.${tc}.${stamp}@yopmail.com`,
        firstName: 'Roadside',
        lastName: `Auto2498-${tc}-${stamp}`,
        secondaryOwnerOrCompany: '',
        distributorName: '',
        address: '100 Rue Test',
        address2: '',
        city: 'Montréal',
        province: 'Québec',
        postalCode: 'H2X 1Y4',
        telHome: '5145550101',
        telWork: '5145550102',
        indianStatusCertificate: '',
        driversLicense: '',
    };
};

test.describe('Road Side Protection Vehicle Form @dealer @AP-2498', () => {
    test.skip(!config.dealerPortalUrl.includes('v2dev'),
        'AP-2498 was tested on Dev (v2dev) only — set DEALER_PORTAL_URL to v2dev to run it');

    test('AP2498_007_TheMakeListIsFilledAndTheModelListChangesToTheModelsOfTheMakeSelected',
        async ({ dealerUser, page }) => {
            const setup = new WarrantyVehicleFormFlow(page);
            const roadSide = new RoadSideProtectionFlow(page);

            await dealerUser.loginToDealerPortal();
            const vehicleId = await setup.createVehicle(newVehicle());
            const quoteId = await setup.createQuote(vehicleId, newClient('007'));
            await roadSide.openRoadSideModal(quoteId);

            await roadSide.verifyMakeListFilled();
            const toyotaModels = await roadSide.chooseMakeAndReadModels(quoteId, 'Toyota');
            await roadSide.chooseModel('Corolla');
            const hondaModels = await roadSide.chooseMakeAndReadModels(quoteId, 'Honda');
            await roadSide.recordModelAfterMakeChange();
            await roadSide.verifyModelListFollowsMake(toyotaModels, hondaModels, 'Corolla');
        });

    test('AP2498_008_OnANewQuoteTheFormShowsTheVehiclesVinAndYearWhenNothingIsStoredForRoadsideProtectionYet',
        async ({ dealerUser, page }) => {
            const setup = new WarrantyVehicleFormFlow(page);
            const roadSide = new RoadSideProtectionFlow(page);
            const vehicle = newVehicle();

            await dealerUser.loginToDealerPortal();
            const vehicleId = await setup.createVehicle(vehicle);
            const quoteId = await setup.createQuote(vehicleId, newClient('008'));
            await roadSide.openRoadSideModal(quoteId);

            await roadSide.verifyPrefillFromVehicle(vehicle.vin, vehicle.year, vehicle.make, vehicle.model);
        });
});
