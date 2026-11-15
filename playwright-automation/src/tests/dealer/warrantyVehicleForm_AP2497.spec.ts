import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { QuoteClient } from '../../data/dealer-portal';
import { WarrantyTestVehicle, WarrantyVehicleFormFlow } from '../../flows/WarrantyVehicleFormFlow';

/**
 * Add-extended-warranty modal — vehicle form — automated from the AP-2497 manual test cases that PASSED
 * on Dev (v2dev) on 2026-11-02.
 * Source: qa-artifacts/3-test-cases/AP2497_TestCases_011-015.md
 *
 * Not automated: AP2497_001–011 (FAIL — AP-2520 Vehicle type missing, AP-2521 form collapsed,
 * AP-2522 field error hidden). Nothing here asserts the collapsed layout or the five-field form.
 * AP2497_012–014 are record-only cases: each asserts the value range the case allows plus the value
 * recorded on Dev, so a behaviour change shows up as a failure to re-judge.
 *
 * Test data: every test leaves one inventory vehicle (Toyota Corolla 2022, VIN AP2497A + 10 digits), one
 * client (qa.ap2497.<tc>.<stamp>@yopmail.com) and one quote per run — dealers cannot delete quotes.
 * AP2497_012 leaves its vehicle at 0 km, AP2497_015 at 25000 km.
 *
 * AP-2497 is tested on Dev only, so the suite runs only when the dealer portal URL points at v2dev.
 */
const newVehicle = (): WarrantyTestVehicle => ({
    vin: `AP2497A${Date.now().toString().slice(-10)}`,
    make: 'Toyota', model: 'Corolla', year: '2022', kilometers: '15000', price: '20000',
});

const newClient = (tc: string): QuoteClient => {
    const stamp = Date.now();
    return {
        email: `qa.ap2497.${tc}.${stamp}@yopmail.com`,
        firstName: 'Warranty',
        lastName: `Auto2497-${tc}-${stamp}`,
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

const INVALID_YEAR = 'Please enter a valid year.';
const INVALID_KM = 'Please enter a valid number of kilometers (0 or more).';
const TOO_LONG = 'This value is too long. It should have 15 characters or less.';
const NOT_BLANK = 'This value should not be blank.';

test.describe('Extended Warranty Vehicle Form @dealer @AP-2497', () => {
    test.skip(!config.dealerPortalUrl.includes('v2dev'),
        'AP-2497 was tested on Dev (v2dev) only — set DEALER_PORTAL_URL to v2dev to run it');

    test('AP2497_012_AFutureYearAndZeroKilometersAreHandledWithoutAServerErrorAndStoredExactlyAsEnteredIfAccepted',
        async ({ dealerUser, page }) => {
            const warranty = new WarrantyVehicleFormFlow(page);

            await dealerUser.loginToDealerPortal();
            const vehicleId = await warranty.createVehicle(newVehicle());
            const quoteId = await warranty.createQuote(vehicleId, newClient('012'));
            await warranty.openWarrantyModal(quoteId);

            await warranty.submitVehicle(quoteId, { year: '2030' });
            await warranty.verifyFieldError('year', INVALID_YEAR);
            await warranty.reloadAndReopen(quoteId);
            await warranty.verifyStoredOneOf('year', ['2030', '2022'], '2022');

            await warranty.submitVehicle(quoteId, { kilometers: '0' });
            await warranty.verifyNoFieldError('kilometers');
            await warranty.verifySummaryShowsKm('0');
            await warranty.reloadAndReopen(quoteId);
            await warranty.verifyStoredOneOf('kilometers', ['0', '15000'], '0');
        });

    test('AP2497_013_ASixteenDigitOrDecimalKilometersValueIsHandledWithoutAServerErrorAndNeverStoredAltered',
        async ({ dealerUser, page }) => {
            const warranty = new WarrantyVehicleFormFlow(page);

            await dealerUser.loginToDealerPortal();
            const vehicleId = await warranty.createVehicle(newVehicle());
            const quoteId = await warranty.createQuote(vehicleId, newClient('013'));
            await warranty.openWarrantyModal(quoteId);

            await warranty.submitVehicle(quoteId, { kilometers: '1234567890123456' });
            await warranty.verifyFieldError('kilometers', TOO_LONG);
            await warranty.reloadAndReopen(quoteId);
            await warranty.verifyStoredOneOf('kilometers', ['1234567890123456', '15000'], '15000');

            await warranty.submitVehicle(quoteId, { kilometers: '1500.5' });
            await warranty.verifyFieldError('kilometers', INVALID_KM);
            await warranty.reloadAndReopen(quoteId);
            await warranty.verifyStoredOneOf('kilometers', ['1500.5', '1500', '1501', '15000'], '15000');
        });

    test('AP2497_014_SubmittingWithMakeOrModelEmptiedIsHandledWithoutAServerErrorAndNeverStoresAValueNobodyEntered',
        async ({ dealerUser, page }) => {
            const warranty = new WarrantyVehicleFormFlow(page);
            const vehicle = newVehicle();

            await dealerUser.loginToDealerPortal();
            const vehicleId = await warranty.createVehicle(vehicle);
            const quoteId = await warranty.createQuote(vehicleId, newClient('014'));
            await warranty.openWarrantyModal(quoteId);

            await warranty.submitVehicle(quoteId, { make: 'Choose' });
            await warranty.verifyMakeAndModelBlankErrors();
            await warranty.reloadAndReopen(quoteId);
            await warranty.verifyValues({ make: 'Toyota', model: 'Corolla', year: '2022', kilometers: '15000' });

            await warranty.submitVehicle(quoteId, { model: 'Choose' });
            await warranty.verifyFieldError('model', NOT_BLANK);
            await warranty.reloadAndReopen(quoteId);
            await warranty.verifyValues({ make: 'Toyota', model: 'Corolla', year: '2022', kilometers: '15000' });
        });

    test('AP2497_015_AfterFixingTheMileageTheResultsBelowTheFormComeFromANewEligibilityCheck',
        async ({ dealerUser, page }) => {
            const warranty = new WarrantyVehicleFormFlow(page);

            await dealerUser.loginToDealerPortal();
            const vehicleId = await warranty.createVehicle(newVehicle());
            const quoteId = await warranty.createQuote(vehicleId, newClient('015'));
            await warranty.openWarrantyModal(quoteId);
            const before = await warranty.readProgramIds();

            const response = await warranty.submitVehicle(quoteId, { kilometers: '25000' });
            await warranty.verifyResultsFromNewCheck(response, before);
        });
});
