import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { QuoteDocumentsDownloadFlow } from '../../flows/QuoteDocumentsDownloadFlow';

/**
 * "Download all documents" on a quote — automated from AP-2496 manual test cases.
 * Source: qa-artifacts/3-test-cases/AP2496_TestCases_001-005.md
 * Execution: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2496_2026-11-02.md (Dev, v2dev)
 *
 * Only cases that PASSED manually: AP2496_002 and AP2496_003. AP2496_008 FAILED (bug AP-2519: the merged
 * download returns HTTP 500) and AP2496_001, 004–007, 009 were BLOCKED by AP-2518, so they have no confirmed
 * behaviour to assert.
 *
 * Read-only on the Dev quotes the manual run left behind — nothing is saved, created or cancelled:
 *  - 6485 "Docs Download2496-002": Esthetic protection product saved (no contract), then deleted (AP2496_002)
 *  - 6486 "Docs Download2496-003": never had a product (AP2496_003)
 *  - 6040: holds a warranty and a sale contract — locator control only (manual run S-1)
 * Runs on Dev (v2dev) only, where the cases passed; the suite skips itself elsewhere.
 */
const QUOTES = {
    productRemoved: { id: '6485', heading: 'Docs Download2496-002', removedProduct: 'Rust+Sound' },
    noProduct: { id: '6486', heading: 'Docs Download2496-003' },
    withContracts: { id: '6040' },
};

test.describe('Download All Quote Documents @dealer @AP-2496', () => {
    test.skip(!/v2dev\./.test(config.baseUrl), 'AP-2496 automation runs on Dev (v2dev) only — the environment the cases passed on');

    test('AP2496_002_QuoteWhoseOnlyProductWasRemovedBeforeItsContractShowsNoDownloadAction', async ({ dealerUser, page }) => {
        const flow = new QuoteDocumentsDownloadFlow(page);
        const q = QUOTES.productRemoved;

        await dealerUser.loginToDealerPortal();
        await flow.verifyLocatorControlOnQuoteWithContracts(QUOTES.withContracts.id);
        await flow.openQuoteDetails(q.id, q.heading);
        await flow.verifyRemovedProductNoLongerActive('Esthetic protection', q.removedProduct);
        await flow.verifyNoProductAndNoContractDocument();
        await flow.verifyDownloadAllHidden(q.id);
    });

    test('AP2496_003_NewQuoteWithNoProductLoadsWithoutErrorAndRecordsTheDownloadAction', async ({ dealerUser, page }) => {
        const flow = new QuoteDocumentsDownloadFlow(page);
        const q = QUOTES.noProduct;

        await dealerUser.loginToDealerPortal();
        await flow.openQuoteDetails(q.id, q.heading);
        await flow.verifyNoProductAndNoContractDocument();
        await flow.verifyNoFaultAndRecordAction(q.id);
    });
});
