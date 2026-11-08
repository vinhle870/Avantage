import { expect, Page, test } from '@playwright/test';
import { config } from '../data/config';
import { InvoiceViewPage } from '../pages/common/InvoiceViewPage';
import { AdminNewDealerPage } from '../pages/adminPortal/AdminNewDealerPage';

const origin = (url: string): string => new URL(url).origin;

/** How many times `needle` occurs in `text` (case-sensitive, non-overlapping). */
export function occurrences(text: string, needle: string): number {
    if (needle === '') return 0;
    return text.split(needle).length - 1;
}

/** The ticket's fix (release 1.25.0) shipped on this date; invoices created after it must carry the fix. */
const FIX_RELEASED = Date.parse('2022-09-19');

export interface DealerNames { name: string; company: string }
export interface InvoiceRow { id: string; href: string; source: string; createdAt: string }

/**
 * Dealer invoice "To:" block shows the dealer's *Name once (AP-1381).
 * Added in its own file so the QA's uncommitted AdminFlow.ts / DealerFlow.ts are left untouched.
 * Logins stay in AdminFlow.loginToAdminPortal() / DealerFlow.loginToDealerPortal(). Read-only: opens
 * existing invoices and the dealer edit form, never saves anything.
 */
export class InvoiceToBlockFlow {
    private readonly invoices: InvoiceViewPage;
    private readonly dealerForm: AdminNewDealerPage;

    constructor(private readonly page: Page) {
        this.invoices = new InvoiceViewPage(page);
        this.dealerForm = new AdminNewDealerPage(page);
    }

    private dealerUrl(path: string): string {
        return `${origin(config.dealerPortalUrl)}${path}`;
    }

    private adminUrl(path: string): string {
        return `${origin(config.adminPortalUrl)}${path}`;
    }

    /** Step 1 (admin session): read the dealer's Name and Company name from its edit form, without saving. */
    async readDealerNames(dealerId: string): Promise<DealerNames> {
        return test.step(`Admin reads the Name and Company name of dealer ${dealerId}`, async () => {
            await this.invoices.open(this.adminUrl(`/admin/dealer/${dealerId}/edit`));
            await expect(this.invoices.lblHeading, 'Dealer edit form').toHaveText(`Dealer #${dealerId}`);
            const names = {
                name: (await this.dealerForm.txtName.inputValue()).trim(),
                company: (await this.dealerForm.txtCompanyName.inputValue()).trim(),
            };
            expect(names.name, 'Dealer Name is set').not.toBe('');
            expect(names.company, 'Company name is set').not.toBe('');
            expect(names.name, 'Name and Company differ, so the To block shows which one it uses').not.toBe(names.company);
            return names;
        });
    }

    /** Step 2 (dealer session): the newest invoice on /invoice whose source reads "Warranty #…", created after the fix. */
    async pickNewestWarrantyInvoice(): Promise<InvoiceRow> {
        return test.step('Dealer picks the newest warranty invoice on /invoice', async () => {
            await this.invoices.open(this.dealerUrl('/invoice'));
            await expect(this.invoices.lblHeading, 'Invoices list').toHaveText('Invoices');
            await expect(this.invoices.warrantyRows.first(), 'A warranty invoice is listed on page 1').toBeVisible();
            const row = await this.invoices.readRow(this.invoices.warrantyRows.first());
            const created = Date.parse(row.createdAt);
            expect(Number.isNaN(created), `"Created at" is a date: ${row.createdAt}`).toBe(false);
            expect(created, `Invoice ${row.href} was created after the fix (2022-09-19)`).toBeGreaterThan(FIX_RELEASED);
            return { ...row, id: row.href.split('/').pop() || '' };
        });
    }

    /** Step 2 (AP1381_004): the last row of the last page of /invoice — the oldest invoice. */
    async pickOldestInvoice(): Promise<InvoiceRow> {
        return test.step('Dealer picks the oldest invoice on the last page of /invoice', async () => {
            await this.invoices.open(this.dealerUrl('/invoice'));
            await expect(this.invoices.lblHeading, 'Invoices list').toHaveText('Invoices');
            await this.invoices.goToLastPage();
            await expect(this.page, 'Last page of the list').toHaveURL(/\/invoice\?page=\d+$/);
            await expect(this.invoices.rows.last(), 'The last page lists an invoice').toBeVisible();
            const row = await this.invoices.readRow(this.invoices.rows.last());
            return { ...row, id: row.href.split('/').pop() || '' };
        });
    }

    /** Step 3 (dealer session): open /invoice/{id}. */
    async openDealerInvoice(invoice: InvoiceRow): Promise<void> {
        await test.step(`Dealer opens invoice ${invoice.id}`, async () => {
            const response = await this.page.goto(this.dealerUrl(invoice.href));
            expect(response?.status() ?? 0, `HTTP status of ${invoice.href}`).toBeLessThan(400);
            await expect(this.invoices.lblHeading, 'Invoice detail heading').toHaveText(`Invoice #${invoice.id}`);
            await expect(this.invoices.blkTo, 'The To block is shown').toBeVisible();
        });
    }

    /** Step 3 (admin session): Admin → Invoices, then the invoice's row. */
    async openAdminInvoiceFromList(invoice: InvoiceRow): Promise<void> {
        await test.step(`Admin opens invoice ${invoice.id} from Admin → Invoices`, async () => {
            await this.invoices.open(this.adminUrl('/admin/invoices'));
            await expect(this.invoices.lblHeading, 'Admin invoices list').toHaveText('Invoices');
            const href = `/admin/invoice/${invoice.id}`;
            await expect(this.invoices.row(href), `Invoice ${invoice.id} is on page 1 of Admin → Invoices`).toHaveCount(1);
            await this.invoices.openRow(href);
            await expect(this.page, 'Admin invoice detail route').toHaveURL(new RegExp(`/admin/invoice/${invoice.id}$`));
            await expect(this.invoices.lblHeading, 'Invoice detail heading').toHaveText(`Invoice #${invoice.id}`);
            await expect(this.invoices.blkTo, 'The To block is shown').toBeVisible();
        });
    }

    /** Steps 4–5: the To block names the dealer's *Name exactly once and never shows the company as a name. */
    async verifyToBlockNamesDealerOnce(names: DealerNames): Promise<void> {
        await test.step(`The To block shows "${names.name}" once and not "${names.company}"`, async () => {
            const lines = await this.invoices.readToLines();
            const text = lines.join('\n');
            test.info().annotations.push({ type: 'To block', description: lines.join(' | ') });
            expect(await this.invoices.readToName(), 'Bold name line of the To block').toBe(names.name);
            expect(occurrences(text, names.name), `"${names.name}" occurrences in the To block`).toBe(1);
            expect(occurrences(text, names.company), `"${names.company}" occurrences in the To block`).toBe(0);
        });
    }

    /** AP1381_004 step 4: objective faults only — the name count is recorded for Q-002, not judged. */
    async verifyToBlockNotEmptyAndRecordName(): Promise<void> {
        await test.step('The To block is not empty; the dealer name count is recorded (Q-002)', async () => {
            const lines = await this.invoices.readToLines();
            expect(lines.length, 'To block has lines').toBeGreaterThan(0);
            const name = await this.invoices.readToName();
            expect(name, 'To block names a dealer').not.toBe('');
            test.info().annotations.push({
                type: 'Q-002 (record only)',
                description: `"${name}" appears ${occurrences(lines.join('\n'), name)} time(s): ${lines.join(' | ')}`,
            });
        });
    }
}
