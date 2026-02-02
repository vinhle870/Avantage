import { Page, Locator } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * Table component for HTML tables.
 * Converted from Java tableImpl.java
 */
export class TableComponent extends BaseComponent {
    constructor(page: Page, selector: string) {
        super(page, selector);
    }

    /**
     * Find a row containing the search value and click on a child element
     */
    async clickOnChildInRow(searchValue: string, childSelector: string): Promise<void> {
        const row = await this.findRow(searchValue);
        if (row) {
            await row.locator(childSelector).click();
        } else {
            throw new Error(`Row containing "${searchValue}" not found`);
        }
    }

    /**
     * Click on a child element in a row that contains specific text
     */
    async clickOnChildContainingText(searchValue: string, childSelector: string): Promise<void> {
        const row = await this.findRowContainingText(searchValue);
        if (row) {
            await row.locator(childSelector).click();
        } else {
            throw new Error(`Row containing "${searchValue}" not found`);
        }
    }

    /**
     * Get the text content of a row, separated by the given separator
     */
    async getRowTextContent(rowMatchedText: string, separator: string = ' | '): Promise<string> {
        const row = await this.findRow(rowMatchedText);
        if (!row) {
            throw new Error(`Row containing "${rowMatchedText}" not found`);
        }

        const columns = row.locator('td');
        const count = await columns.count();
        const texts: string[] = [];

        for (let i = 0; i < count; i++) {
            const text = await columns.nth(i).textContent();
            if (text) texts.push(text);
        }

        return texts.join(separator);
    }

    /**
     * Find a row by exact cell text match
     */
    async findRow(searchValue: string): Promise<Locator | null> {
        const rows = this.locator.locator('tr');
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const columns = row.locator('td');
            const colCount = await columns.count();

            for (let j = 0; j < colCount; j++) {
                const text = await columns.nth(j).textContent();
                if (text?.toLowerCase() === searchValue.toLowerCase()) {
                    return row;
                }
            }
        }

        return null;
    }

    /**
     * Find a row containing the search text (partial match)
     */
    async findRowContainingText(searchValue: string): Promise<Locator | null> {
        const rows = this.locator.locator('tr');
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const rowText = await row.textContent();
            if (rowText?.includes(searchValue)) {
                return row;
            }
        }

        return null;
    }

    /**
     * Get the first data row (skipping header)
     */
    async getFirstRow(separator: string = ' | '): Promise<string> {
        const firstRow = this.locator.locator('tr').nth(1); // Skip header row
        const columns = firstRow.locator('td');
        const count = await columns.count();
        const texts: string[] = [];

        for (let i = 0; i < count; i++) {
            const text = await columns.nth(i).textContent();
            if (text) texts.push(text);
        }

        return texts.join(separator);
    }

    /**
     * Get the total number of rows (including header)
     */
    async getRowCount(): Promise<number> {
        return await this.locator.locator('tr').count();
    }

    /**
     * Get all rows as an array of text arrays
     */
    async getAllRows(): Promise<string[][]> {
        const rows = this.locator.locator('tr');
        const rowCount = await rows.count();
        const result: string[][] = [];

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const cells = row.locator('td, th');
            const cellCount = await cells.count();
            const rowData: string[] = [];

            for (let j = 0; j < cellCount; j++) {
                const text = await cells.nth(j).textContent();
                rowData.push(text || '');
            }

            result.push(rowData);
        }

        return result;
    }
}
