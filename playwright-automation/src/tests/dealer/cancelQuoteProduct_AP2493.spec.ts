import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { QuoteClient } from '../../data/dealer-portal';
import { QuoteCancelProductFlow } from '../../flows/QuoteCancelProductFlow';

/**
 * Cancelling a product from a quote — automated from AP-2493 manual test cases.
 * Source: qa-artifacts/3-test-cases/AP2493_TestCases_*.md
 * Execution: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md (Dev, v2dev)
 *
 * Only cases that PASSED manually: AP2493_001–010, _013, _014. AP2493_011 and _012 FAILED (bug AP-2516:
 * the Subtotal never includes the Permaplate cost), so they have no confirmed behaviour to assert.
 *
 * Read-only on the Dev quotes the manual run left behind (nothing is confirmed or saved on them):
 *  - 6461 warranty 1,500 (AP2493_001, _007, _008 — the modal is only declined or dismissed)
 *  - 6462 Roadside 20,000 · 6463 Permaplate 80$ · 6464 creditor 18.58/m · 6465 GAP 3,094 (AP2493_002–005)
 *  - 6466 creditor contract AVP000169 (AP2493_006) · archived quote 6245 (AP2493_013)
 * Writes to Dev — each run creates three new quotes for vehicle 915, each with its own new yopmail client:
 *  - AP2493_009: warranty 1,500 added, then cancelled
 *  - AP2493_010: warranty 1,500 added, cancelled, then a warranty 1,800 added
 *  - AP2493_014: financing, GAP and a creditor insurance quote (no contract), then the GAP cancelled
 * No contract is generated. Runs on Dev (v2dev) only, where the cases passed; the suite skips itself elsewhere.
 */
const VEHICLE_ID = '915';
const DELIVERED_AT = '2026-11-01';
const VEHICLE_PRICE = '20000';
const TERM = '20m/20000km';

const LEFT_ON_DEV = {
    warranty: { id: '6461', amount: 'CA$1,500.00', subtotal: 'CA$21,500.00' },
    roadside: { id: '6462', amount: 'CA$20,000.00' },
    permaplate: { id: '6463', amount: '-' },
    creditors: { id: '6464', amount: 'CA$18.58' },
    gap: { id: '6465', amount: 'CA$3,094.00' },
    finalizedCreditor: { id: '6466', contract: 'AVP000169' },
    archived: { id: '6245' },
};

/** A new client per quote, so re-runs never collide. */
const newClient = (tc: string): QuoteClient => {
    const stamp = Date.now();
    return {
        email: `qa.ap2493.${tc}.${stamp}@yopmail.com`,
        firstName: 'Annul',
        lastName: `Auto2493-${tc}-${stamp}`,
        secondaryOwnerOrCompany: '',
        distributorName: '',
        address: '123 rue Principale',
        address2: '',
        city: 'Montréal',
        province: 'Québec',
        postalCode: 'H2X 1Y4',
        telHome: '5145550100',
        telWork: '5145550101',
        indianStatusCertificate: '',
        driversLicense: '',
    };
};

test.describe('Cancel Quote Product @dealer @AP-2493', () => {
    test.skip(!/v2dev\./.test(config.baseUrl), 'AP-2493 automation runs on Dev (v2dev) only — the environment the cases passed on');

    test('AP2493_001_ExtendedWarrantyWithNoContractShowsACancelAction', async ({ dealerUser, page }) => {
        const flow = new QuoteCancelProductFlow(page);
        const q = LEFT_ON_DEV.warranty;

        await dealerUser.loginToDealerPortal();
        await flow.openQuoteDetails(q.id);
        await flow.verifyProductActive(q.id, 'warranty', q.amount);
        await flow.verifyDeleteOffered(q.id, 'warranty');
    });

    test('AP2493_002_RoadsideProtectionWithNoContractShowsACancelAction', async ({ dealerUser, page }) => {
        const flow = new QuoteCancelProductFlow(page);
        const q = LEFT_ON_DEV.roadside;

        await dealerUser.loginToDealerPortal();
        await flow.openQuoteDetails(q.id);
        await flow.verifyProductActive(q.id, 'roadside', q.amount);
        await flow.verifyDeleteOffered(q.id, 'roadside');
    });

    test('AP2493_003_EstheticProtectionWithNoContractShowsACancelAction', async ({ dealerUser, page }) => {
        const flow = new QuoteCancelProductFlow(page);
        const q = LEFT_ON_DEV.permaplate;

        await dealerUser.loginToDealerPortal();
        await flow.openQuoteDetails(q.id);
        await flow.verifyProductActive(q.id, 'permaplate', q.amount);
        await flow.verifyDeleteOffered(q.id, 'permaplate');
    });

    test('AP2493_004_CreditorInsuranceQuotedWithoutContractShowsACancelAction', async ({ dealerUser, page }) => {
        const flow = new QuoteCancelProductFlow(page);
        const q = LEFT_ON_DEV.creditors;

        await dealerUser.loginToDealerPortal();
        await flow.openQuoteDetails(q.id);
        await flow.verifyProductActive(q.id, 'creditors', q.amount);
        await flow.verifyDeleteOffered(q.id, 'creditors');
    });

    test('AP2493_005_GapInsuranceQuotedWithoutContractShowsACancelAction', async ({ dealerUser, page }) => {
        const flow = new QuoteCancelProductFlow(page);
        const q = LEFT_ON_DEV.gap;

        await dealerUser.loginToDealerPortal();
        await flow.openQuoteDetails(q.id);
        await flow.verifyProductActive(q.id, 'gap', q.amount);
        await flow.verifyDeleteOffered(q.id, 'gap');
    });

    test('AP2493_006_CreditorInsuranceWithGeneratedContractShowsNoCancelActionAndKeepsDownload', async ({ dealerUser, page }) => {
        const flow = new QuoteCancelProductFlow(page);
        const q = LEFT_ON_DEV.finalizedCreditor;

        await dealerUser.loginToDealerPortal();
        await flow.openQuoteDetails(q.id);
        await flow.verifyFinalizedHasNoDelete('creditors', q.contract);
    });

    test('AP2493_007_DecliningTheConfirmationModalLeavesTheWarrantyUnchanged', async ({ dealerUser, page }) => {
        const flow = new QuoteCancelProductFlow(page);
        const q = LEFT_ON_DEV.warranty;

        await dealerUser.loginToDealerPortal();
        await flow.openQuoteDetails(q.id);
        await flow.verifyProductUnchanged('warranty', q.amount, q.subtotal);
        await flow.openCancelModal(q.id, 'warranty');
        await flow.verifyCancelModalShownAndRowUnchanged(q.id, 'warranty', q.amount, q.subtotal);
        await flow.declineCancel();
        await flow.reloadQuoteDetails(q.id);
        await flow.verifyProductUnchanged('warranty', q.amount, q.subtotal);
    });

    test('AP2493_008_ClosingTheConfirmationModalWithoutAnsweringLeavesTheWarrantyUnchanged', async ({ dealerUser, page }) => {
        const flow = new QuoteCancelProductFlow(page);
        const q = LEFT_ON_DEV.warranty;

        await dealerUser.loginToDealerPortal();
        await flow.openQuoteDetails(q.id);
        await flow.verifyProductUnchanged('warranty', q.amount, q.subtotal);
        await flow.dismissCancelModalWithoutAnswering(q.id, 'warranty');
        await flow.reloadQuoteDetails(q.id);
        await flow.verifyProductUnchanged('warranty', q.amount, q.subtotal);
    });

    test('AP2493_009_ConfirmingTheCancellationRemovesTheWarrantyBringsBackAddAndLowersTheSubtotal', async ({ dealerUser, page }) => {
        const flow = new QuoteCancelProductFlow(page);

        await dealerUser.loginToDealerPortal();
        const quoteId = await flow.createQuoteFromVehicle(VEHICLE_ID, newClient('009'), DELIVERED_AT, VEHICLE_PRICE);
        await flow.addWarranty(quoteId, { term: TERM, salePrice: '1500' });
        const warranty = await flow.readAmount('warranty');
        const before = await flow.readSubtotal();

        await flow.confirmCancel(quoteId, 'warranty');
        await flow.reloadQuoteDetails(quoteId);
        await flow.verifyProductRemovedAndAddBack(quoteId, 'warranty');
        await flow.verifySubtotal(before - warranty, `before ${before} − warranty ${warranty}`);
    });

    test('AP2493_010_AfterCancellingAWarrantyAddingANewOneCreatesANewRowWithTheNewAmount', async ({ dealerUser, page }) => {
        const flow = new QuoteCancelProductFlow(page);

        await dealerUser.loginToDealerPortal();
        const quoteId = await flow.createQuoteFromVehicle(VEHICLE_ID, newClient('010'), DELIVERED_AT, VEHICLE_PRICE);
        await flow.addWarranty(quoteId, { term: TERM, salePrice: '1500' });
        await flow.confirmCancel(quoteId, 'warranty');
        await flow.reloadQuoteDetails(quoteId);
        await flow.verifyProductRemovedAndAddBack(quoteId, 'warranty');
        const empty = await flow.readSubtotal();

        await flow.addWarranty(quoteId, { term: TERM, salePrice: '1800' });
        await flow.verifySingleRowWithAmount('warranty', 'CA$1,800.00', 'CA$1,500.00');
        await flow.verifySubtotal(empty + 1800, `${empty} + new warranty 1,800`);
    });

    test('AP2493_013_ArchivedQuoteWithAProductOpensWithoutAnError', async ({ dealerUser, page }) => {
        const flow = new QuoteCancelProductFlow(page);
        const q = LEFT_ON_DEV.archived;

        await dealerUser.loginToDealerPortal();
        await flow.verifyQuoteIsArchived(q.id);
        await flow.openQuoteDetails(q.id);
        await flow.verifyArchivedQuoteRenders(q.id, 'roadside');
    });

    test('AP2493_014_CancellingGapRemovesItAndLeavesTheCreditorInsuranceInPlace', async ({ dealerUser, page }) => {
        test.setTimeout(240000);
        const flow = new QuoteCancelProductFlow(page);

        await dealerUser.loginToDealerPortal();
        const quoteId = await flow.createQuoteFromVehicle(VEHICLE_ID, newClient('014'), DELIVERED_AT, VEHICLE_PRICE);
        await flow.addFinancing(quoteId);
        await flow.addGap(quoteId, '60');
        await flow.addCreditorInsurance(quoteId);
        const gap = await flow.readAmount('gap');
        const creditorBefore = await flow.readAmount('creditors');
        const before = await flow.readSubtotal();
        await flow.verifySubtotal(Number(VEHICLE_PRICE) + gap + creditorBefore, 'vehicle + GAP + creditor premium');

        await flow.confirmCancel(quoteId, 'gap');
        await flow.reloadQuoteDetails(quoteId);
        const creditorAfter = await flow.readAmount('creditors');
        test.info().annotations.push({ type: 'Q-007 (record only)', description: `creditor premium ${creditorBefore} → ${creditorAfter}` });
        await flow.verifyProductRemovedAndAddBack(quoteId, 'gap');
        await flow.verifyProductStillThere(quoteId, 'creditors');
        await flow.verifySubtotal(before - gap - (creditorBefore - creditorAfter), 'before − GAP − creditor premium change');
    });
});
