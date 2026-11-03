import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { PermaplateInvoice, PermaplateInvoiceTermFlow } from '../../flows/PermaplateInvoiceTermFlow';

/**
 * Permaplate invoice names the term sold in its description — automated from AP-2501 manual test cases.
 * Source: qa-artifacts/3-test-cases/AP2501_TestCases_001-005.md
 * Execution: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md (Dev, v2dev)
 *
 * Only the case that PASSED manually (AP2501_001). AP2501_003 FAILED (invoice PDF HTTP 500, AP-2529);
 * AP2501_002/004/005/006 are BLOCKED (one term on dealer 1380; Q-001).
 * Read-only: checks the fixed invoice 941 created by the manual run (quote 6555, contract PNA-0000000020,
 * term "10 ans") instead of generating a new contract and unpaid invoice on every run.
 * That data exists on Dev only, so the suite skips itself unless the base URL is v2dev.
 */
const INVOICE_941: PermaplateInvoice = {
    invoiceId: '941',
    quoteId: '6555',
    contractNumber: 'PNA-0000000020',
    termName: '10 ans',
    lineTotal: '$80.00',
};

test.describe('Permaplate Invoice Term @dealer @AP-2501', () => {
    test.skip(!/v2dev\./.test(config.baseUrl), 'AP-2501 automation runs on Dev (v2dev) only — invoice 941 exists there');

    test('AP2501_001_PermaplateInvoiceDetailsNamesTheTermSoldBesideTheContractNumber', async ({ dealerUser, page }) => {
        const flow = new PermaplateInvoiceTermFlow(page);

        await dealerUser.loginToDealerPortal();
        await flow.verifyTermSoldOnQuote(INVOICE_941);
        await flow.openDealerInvoice(INVOICE_941);
        await flow.verifyDescriptionNamesTerm(INVOICE_941);
    });
});
