import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { QuoteListFlow } from '../../flows/QuoteListFlow';

/**
 * Quote list "Contracts" column and quote search — automated from AP-2494 manual test cases.
 * Source: qa-artifacts/3-test-cases/AP2494_TestCases_*.md
 * Execution: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md (Dev, v2dev)
 *
 * Only cases that PASSED manually: AP2494_001–004, _006, _009, _011, _013–019.
 * Not automated: AP2494_010 FAILED (bug AP-2517 — a saved sale number is missing from the cell);
 * AP2494_005, _008, _012 BLOCKED (bug AP-2518 — roadside Generate Contract HTTP 500); AP2494_007 BLOCKED
 * (no GAP contract on Dev).
 *
 * Read-only. The manual run's [Pre-Condition] steps that create quotes or contracts are NOT repeated: each
 * test reads the Dev quotes that run left behind (and older Dev data it recorded). Nothing is saved, no
 * contract is generated. AP2494_003 switches the shared account to French through ?_locale=fr and always
 * switches it back to English.
 * Runs on Dev (v2dev) only, where the cases passed; the suite skips itself elsewhere.
 */
const VIN_915 = '1FAHP35NX8W239204';

const LEFT_ON_DEV = {
    warranty: { id: '6454', contract: '26df1-844' },          // AP-2374 run — Marie Tremblay
    creditor: { id: '6480', contract: 'AVP000170' },          // AP2494_006 — Credito Chubbline-957
    permaplate: { id: '6460', contract: 'PNA-0000000019' },   // AP-2428 run — Adresse Modifiee2428
    noContract: { id: '6481' },                               // AP2494_011 — Vide Contrat-958
    named: { id: '6482', name: 'ZEPHYRINE AP2494 959' },      // AP2494_013 — quote name "Zephyrine AP2494 959"
    client: { id: '6483', first: 'Ysolde', last: 'Brakwater-960', email: 'client.stage.960@yopmail.com' },
    archived: { id: '6245', lastName: 'LeAVtage' },           // first archived row on 2026-11-02
    otherDealer: { contract: 'PNA-0000000016', client: 'Nguyen', vin: '3KPFL4A76HE021135' }, // Test Dealer 2
};

const EN_HEADERS = ['Vehicle', 'Client', 'Contracts', 'Date Created'];
const FR_HEADERS = ['Véhicule', 'Client', 'Contrats', 'Date de création'];

test.describe('Quote List Contracts and Search @dealer @AP-2494', () => {
    test.skip(!/v2dev\./.test(config.baseUrl), 'AP-2494 automation runs on Dev (v2dev) only — the environment the cases passed on');

    test.beforeEach(async ({ dealerUser }) => {
        await dealerUser.loginToDealerPortal();
    });

    // ── Contracts column (REQ-001, REQ-002) ─────────────────────────────────

    test('AP2494_001_ActiveTabShowsContractsColumnAndNoProduits', async ({ page }) => {
        const flow = new QuoteListFlow(page);
        await flow.openQuoteList('active');
        await flow.verifyTabSelected('Active');
        await flow.verifyHeaders(EN_HEADERS);
    });

    test('AP2494_002_ArchivedTabShowsContractsColumnAndNoProduits', async ({ page }) => {
        const flow = new QuoteListFlow(page);
        await flow.openQuoteList('active');
        await flow.clickTab('Archived', '/quotes/archived');
        await flow.verifyTabSelected('Archived');
        await flow.verifyHeaders(EN_HEADERS);
    });

    test('AP2494_003_FrenchQuoteListShowsContratsAndNoProduits', async ({ page }) => {
        const flow = new QuoteListFlow(page);
        try {
            await flow.switchLanguage('fr', 'active');
            await flow.verifyTabSelected('Créé');
            await flow.verifyHeaders(FR_HEADERS);
            await flow.clickTab('Archivée', '/quotes/archived');
            await flow.verifyHeaders(FR_HEADERS);
        } finally {
            await flow.switchLanguage('en', 'active');
        }
        await flow.verifyTabSelected('Active');
        await flow.verifyHeaders(EN_HEADERS);
    });

    test('AP2494_004_WarrantyContractListedInContractsCell', async ({ page }) => {
        const flow = new QuoteListFlow(page);
        const q = LEFT_ON_DEV.warranty;
        await flow.findQuoteRow(q.id);
        await flow.verifyContractsCell(q.id, [q.contract]);
    });

    test('AP2494_006_CreditorInsuranceContractListedInContractsCell', async ({ page }) => {
        const flow = new QuoteListFlow(page);
        const q = LEFT_ON_DEV.creditor;
        await flow.findQuoteRow(q.id);
        // "Contains", not "exactly": the quote also carries sale AP2494-S-957, which AP-2517 says should show too.
        await flow.verifyContractsCellContains(q.id, q.contract);
    });

    test('AP2494_009_PermaplateContractNumberShownInContractsCell', async ({ page }) => {
        const flow = new QuoteListFlow(page);
        const q = LEFT_ON_DEV.permaplate;
        await flow.findQuoteRow(q.id);
        // PNA-0000000019 is the number the admin page /admin/permaplate-contract/19 shows (manual step 2).
        await flow.verifyContractsCell(q.id, [q.contract]);
    });

    test('AP2494_011_QuoteWithoutContractShowsBlankContractsCell', async ({ page }) => {
        const flow = new QuoteListFlow(page);
        const q = LEFT_ON_DEV.noContract;
        await flow.findQuoteRow(q.id);
        await flow.verifyContractsCellBlank(q.id);
    });

    // ── Search (REQ-003 – REQ-005) ─────────────────────────────────────────

    test('AP2494_013_PartialQuoteNameInOtherCaseFindsQuote', async ({ page }) => {
        const flow = new QuoteListFlow(page);
        const q = LEFT_ON_DEV.named;
        await flow.openQuoteList('active');
        await flow.search('PHYRINE');
        await flow.verifyQuoteListed(q.id);
        await flow.verifyEveryRowContains('phyrine');
    });

    test('AP2494_014_ClientFirstLastEmailAndFullNameFindQuote', async ({ page }) => {
        const flow = new QuoteListFlow(page);
        const c = LEFT_ON_DEV.client;
        await flow.openQuoteList('active');
        for (const term of [c.first, c.last, c.email, `${c.first} ${c.last}`]) {
            await flow.search(term);
            await flow.verifyQuoteListed(c.id);
            await flow.verifyEveryRowContains(term === c.email ? c.email : `${c.first} ${c.last}`);
        }
    });

    test('AP2494_015_PartialLowerCaseAndReversedClientSearchFindQuote', async ({ page }) => {
        const flow = new QuoteListFlow(page);
        const c = LEFT_ON_DEV.client;
        await flow.openQuoteList('active');
        for (const term of ['ysolde', 'brakw', 'stage.960@yopmail', `${c.last} ${c.first}`]) {
            await flow.search(term);
            await flow.verifyQuoteListed(c.id);
        }
    });

    test('AP2494_016_PartialAndLowerCaseVinFindQuotesOnThatVehicle', async ({ page }) => {
        const flow = new QuoteListFlow(page);
        const c = LEFT_ON_DEV.client;
        await flow.openQuoteList('active');
        const unfilteredPages = await flow.readLastPageNumber();

        for (const term of ['8W239204', VIN_915, VIN_915.toLowerCase()]) {
            await flow.search(term);
            await flow.verifyQuoteListed(c.id);
            await flow.verifyQuoteFirst(c.id);
            const pages = await flow.verifyEveryRowOnEveryPageContains(`VIN: ${VIN_915}`);
            await flow.verifyFewerPagesThan(pages, unfilteredPages, term);
            await flow.openQuoteList('active');
        }
    });

    test('AP2494_017_NoMatchShowsNoQuoteAndNoError', async ({ page }) => {
        const flow = new QuoteListFlow(page);
        await flow.openQuoteList('active');
        const unfilteredPages = await flow.readLastPageNumber();

        await flow.search('qzxwv-AP2494-nomatch');
        await flow.verifyNoEntities();
        const boldOnEmptyPage = await flow.countBoldElements();

        const special = `%_'"<b>`;
        await flow.search(special);
        await flow.verifyNoEntities();
        await flow.verifyKeywordBoxHolds(special);
        await flow.verifyTermNotRenderedAsHtml(boldOnEmptyPage);

        await flow.search('');
        await flow.verifyFullListBack(unfilteredPages);
        await flow.verifyKeywordBoxHolds('');
    });

    test('AP2494_018_ArchivedSearchStaysOnTabAndClearRestoresPaging', async ({ page }) => {
        const flow = new QuoteListFlow(page);
        const a = LEFT_ON_DEV.archived;
        await flow.openQuoteList('archived');

        await flow.search(a.lastName, 'archived');
        await flow.verifyQuoteListed(a.id);
        await flow.verifyTabSelected('Archived');

        await flow.search(LEFT_ON_DEV.client.last, 'archived');
        await flow.verifyNoEntities();

        await flow.search('', 'archived');
        await flow.verifyFullListBack();
        await flow.clickTab('Active', '/quotes');
        await flow.verifyTabSelected('Active');
        await flow.verifyPage2DiffersFromPage1();
    });

    test('AP2494_019_OtherDealershipClientAndVinNotListed', async ({ page }) => {
        const flow = new QuoteListFlow(page);
        const o = LEFT_ON_DEV.otherDealer;
        await flow.openQuoteList('active');
        for (const term of [o.client, o.vin]) {
            await flow.search(term);
            await flow.verifyNoRowMentions(o.contract);
        }
        // The VIN belongs only to Test Dealer 2's Permaplate contract on Dev: dealer 1380 sees nothing.
        await flow.verifyNoEntities();
    });
});
