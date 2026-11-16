import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { QuoteClient } from '../../data/dealer-portal';
import { PermaplateContractFlow } from '../../flows/PermaplateContractFlow';
import { FinancingCompany, PermaplateFinancingFlow } from '../../flows/PermaplateFinancingFlow';
import { QuoteCancelProductFlow } from '../../flows/QuoteCancelProductFlow';

/**
 * Permaplate ("Esthetic protection") contract and its Financing company — automated from AP-2459 manual test cases.
 * Source: qa-artifacts/3-test-cases/AP2459_TestCases_001-003.md
 * Execution: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2459_2026-11-08.md (Dev, v2dev)
 *
 * Only cases that PASSED manually: AP2459_001 and AP2459_002. AP2459_003 was SKIPPED by its own rule
 * (a contract without a financing company can no longer be created), so it is not automated.
 *
 * AP2459_001 is read-only: it submits the contract form of quote 6689 ("Perma Retest2459", left by the manual
 * run with a Permaplate selection and no contract) with Financing company on "Choose". The server refuses it
 * (branch (b) of the ticket's Expected Result, the branch the build chose on 2026-11-08), so nothing is created.
 * AP2459_002 writes to Dev — it exists to test that a contract IS generated. Every run leaves behind:
 * one new quote on vehicle 915 with a new yopmail client "Perma Finance2459-<stamp>", one Esthetic protection
 * contract (PNA-…) with financing company AutoCapital Canada and one unpaid invoice ($91.98, Payment pending).
 * None of these can be deleted. The annotation "Left on Dev" of each run names them.
 * Vehicle 915 is only selected on the quote's vehicle step, never edited. The contract PDF is not opened
 * (open bug AP-2512 returns HTTP 500). Runs on Dev (v2dev) only; the suite skips itself elsewhere.
 */
const VEHICLE_ID = '915';
const DELIVERED_AT = '2026-11-01';
const VEHICLE_PRICE = '25000';
const PERMAPLATE = { term: '10 ans', option: 'Antirouille – Rust+Sound (combo)', cost: 'CA$80.00' };
const AUTOCAPITAL: FinancingCompany = { id: '39', name: 'AutoCapital Canada' };
const QUOTE_A = { id: '6689', client: 'Perma Retest2459' };

/** A new client per run, so re-runs never collide. */
const newClient = (): QuoteClient => {
    const stamp = Date.now();
    return {
        email: `qa.ap2459.002.${stamp}@yopmail.com`,
        firstName: 'Perma',
        lastName: `Finance2459-${stamp}`,
        secondaryOwnerOrCompany: '',
        distributorName: '',
        address: '220 Boulevard Saint-Laurent',
        address2: '',
        city: 'Montreal',
        province: 'Québec',
        postalCode: 'H2Y 1Z4',
        telHome: '5145550200',
        telWork: '5145550201',
        indianStatusCertificate: '',
        driversLicense: '',
    };
};

test.describe('Permaplate Contract Financing Company @dealer @AP-2459', () => {
    test.skip(!/v2dev\./.test(config.baseUrl), 'AP-2459 automation runs on Dev (v2dev) only — the environment the cases passed on');

    test('AP2459_001_BlankFinancingCompanyIsRefusedBesideTheFieldWithoutAServerError', async ({ dealerUser, page }) => {
        const permaplate = new PermaplateContractFlow(page);
        const financing = new PermaplateFinancingFlow(page);

        await dealerUser.loginToDealerPortal();
        await permaplate.openQuoteDetails(QUOTE_A.id);
        await permaplate.verifyQuoteHasSelectionWithoutContract(QUOTE_A.id);
        await financing.openContractFormFromRowMenu(QUOTE_A.id);
        await financing.submitBlankFinancingCompany(QUOTE_A.id);
        await financing.verifyBlankFinancingCompanyRefused(QUOTE_A.id, QUOTE_A.client);
    });

    test('AP2459_002_ChosenFinancingCompanyGeneratesTheContractAndItsInvoice', async ({ dealerUser, page }) => {
        const quotes = new QuoteCancelProductFlow(page);
        const financing = new PermaplateFinancingFlow(page);
        const client = newClient();
        const clientName = `${client.firstName} ${client.lastName}`;

        await dealerUser.loginToDealerPortal();
        const quoteId = await quotes.createQuoteFromVehicle(VEHICLE_ID, client, DELIVERED_AT, VEHICLE_PRICE);
        await financing.selectPermaplate(quoteId, PERMAPLATE.term, PERMAPLATE.option, PERMAPLATE.cost);
        await financing.openContractFormFromRowMenu(quoteId);
        const generated = await financing.generateContractWithFinancingCompany(quoteId, AUTOCAPITAL);
        await financing.verifyContractAndInvoiceListed(generated, clientName);
    });
});
