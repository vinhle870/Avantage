import { test } from '../../core/fixtures/test-fixtures';
import { config, getEnvConfig } from '../../data/config';
import { WarrantySearchApiFlow } from '../../flows/WarrantySearchApiFlow';

/**
 * Admin API warranty search (`GET /api/admin/search-warranty`) — automated from AP-2435 manual test cases.
 * Source: qa-artifacts/3-test-cases/AP2435_TestCases_001-005.md, _006-010.md, _011-012.md
 * Execution: qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2435_2026-11-05.md (Dev, v2dev — 12 of 12 PASS)
 *
 * Read-only on Dev warranty record 836 = contract APOP01-836 (client Ken Nguyen, Honda CR-V 2024), the reference
 * contract of the manual run (qa-artifacts/base-test/test-centralized.md). Every call is a search; nothing is created.
 * Runs on Dev (v2dev) only, and only when the Dev admin API key is exported as AVP_ADMIN_API_KEY.
 *
 * The key is never printed: it is sent per request by AdminWarrantySearchApi, and tracing, screenshots and video are
 * off for this suite so no request header is ever written to test-results/ or the HTML report.
 */
const REF = {
    contract: 'APOP01-836',
    vin: 'BKVG64C7AKB4145G5',
    vinFragment: 'C7AKB4',      // VIN characters 7–12
    vinPair: 'KB',              // VIN characters 10–11
    postalCode: 'H7L0C4',       // stored as "H7L 0C4"
    telephone: '5146906330',    // client tel home, stored as plain digits
};
const API_KEY = getEnvConfig('AVP_ADMIN_API_KEY');

// No trace, screenshot or video: a trace would store the request headers, the API key among them.
test.use({ trace: 'off', screenshot: 'off', video: 'off' });

test.describe('Admin API Warranty Search @admin @AP-2435', () => {
    test.skip(!/v2dev\./.test(config.baseUrl), 'AP-2435 automation runs on Dev (v2dev) only — warranty 836 and the API key are Dev data');
    test.skip(!API_KEY, 'AVP_ADMIN_API_KEY is not set — export the Dev admin API key (QA-automation) for this run (BLOCKED by Q-012)');

    let search: WarrantySearchApiFlow;

    test.beforeEach(async ({ playwright }) => {
        search = await WarrantySearchApiFlow.open(playwright, new URL(config.baseUrl).origin, API_KEY);
    });

    test.afterEach(async () => {
        await search?.dispose();
    });

    test('AP2435_001_SearchingPartOfAContractVehiclesVinReturnsThatContractsNumberInTheResults', async () => {
        await search.probeKeyHeaderForms(REF.vinFragment, REF.contract);
    });

    test('AP2435_002_SearchingAContractVehiclesWholeVinReturnsThatContractALowerCaseFragmentsResultIsRecorded', async () => {
        await search.searchListsContract(REF.vin, REF.contract);
        await search.recordSearch(REF.vinFragment.toLowerCase(), REF.contract, 'xApiKey', 'Q-004 lower-case VIN fragment');
    });

    test('AP2435_003_SearchingAClientsPostalCodeWithAndWithoutItsSpaceReturnsTheSameContractBothTimes', async () => {
        await search.searchListsContract(REF.postalCode, REF.contract);
        await search.searchListsContract('H7L 0C4', REF.contract);
    });

    test('AP2435_004_SearchingAClientsTelephoneWithHyphensOrAsPlainDigitsReturnsThatContract', async () => {
        await search.searchListsContract('514-690-6330', REF.contract);
        await search.searchListsContract(REF.telephone, REF.contract);
    });

    test('AP2435_005_SearchingAClientsTelephoneWithDotsOrWithParenthesesReturnsThatContract', async () => {
        await search.searchListsContract('514.690.6330', REF.contract);
        await search.searchListsContract('(514) 690-6330', REF.contract);
    });

    test('AP2435_006_PartialLowerCaseAndCountryCodeFormsOfThePostalCodeAndTelephoneResultsAreRecorded', async () => {
        await search.recordSearch(REF.postalCode.toLowerCase(), REF.contract, 'xApiKey', 'A — Q-004 lower-case postal code');
        await search.recordSearch('H7L', REF.contract, 'xApiKey', 'B — Q-005 partial postal code');
        await search.recordSearch('514690', REF.contract, 'xApiKey', 'C — Q-005 partial telephone');
        await search.recordSearch('+1 514-690-6330', REF.contract, 'xApiKey', 'D — Q-007 +1 country code');
    });

    test('AP2435_007_ATelephoneSearchWithTheKeyInTheAuthorizationBearerHeaderWhetherItIsAcceptedIsRecorded', async () => {
        // Record-only (Q-001): a 401/403 is recorded, not failed — the verdict on the header form belongs to AP2435_001.
        await search.recordSearch(REF.telephone, REF.contract, 'bearer', 'Q-001 Authorization Bearer');
    });

    test('AP2435_008_ASearchWithNoApiKeyReturnsNoContractData', async () => {
        await search.searchReturnsNoContractData(REF.telephone, REF.contract, 'none');
    });

    test('AP2435_009_ASearchWithAWrongApiKeyReturnsNoContractData', async () => {
        await search.searchReturnsNoContractData(REF.telephone, REF.contract, 'wrongXApiKey');
        await search.searchReturnsNoContractData(REF.telephone, REF.contract, 'wrongBearer');
    });

    test('AP2435_010_ASearchThatMatchesNoVinPostalCodeOrTelephoneListsNoContracts', async () => {
        await search.searchListsNoContracts('ZZQA2435NOMATCH');
    });

    test('AP2435_011_ASearchWithAnEmptyOrMissingQueryAnswersWithoutAServerErrorTheResponseIsRecorded', async () => {
        await search.recordSearch('', REF.contract, 'xApiKey', 'A — Q-010 empty query');
        await search.recordSearch(undefined, REF.contract, 'xApiKey', 'B — Q-010 no query parameter');
    });

    test('AP2435_012_AShortVinFragmentThatMatchesManyContractsResultCountPagingAndContractTypesAreRecorded', async () => {
        await search.recordSearch(REF.vinPair, REF.contract, 'xApiKey', 'Q-003 / Q-008 / Q-011 two-character VIN fragment');
    });
});
