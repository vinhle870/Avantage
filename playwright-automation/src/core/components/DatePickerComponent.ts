import { Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * DatePicker component for date selection.
 * Converted from Java DatePickerImpl.java
 */
export class DatePickerComponent extends BaseComponent {
    constructor(page: Page, selector: string) {
        super(page, selector);
    }

    /**
     * Pick a date from the date picker.
     * @param date - Date in format "YYYY-MM-DD"
     */
    async pickDate(date: string): Promise<void> {
        const [year, monthNumber, day] = date.split('-');

        // Month short name mapping
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthShort = monthNames[parseInt(monthNumber) - 1];

        const cell = (pattern: RegExp) =>
            this.locator.locator('table div').filter({ hasText: pattern }).first();

        // Click the period header twice: day view -> month view -> year view
        const navigator = this.locator.locator("div[role='period']").first();
        await navigator.click();
        await navigator.click();

        // Year, then month, then day (the calendar may print the day with or without a leading zero)
        await cell(new RegExp(`^\\s*${year}\\s*$`)).click();
        await cell(new RegExp(`^\\s*${monthShort}\\s*$`)).click();
        await cell(new RegExp(`^\\s*0?${parseInt(day, 10)}\\s*$`)).click();

        console.log(`Date selected: ${date}`);
    }

    /**
     * Pick a date using native input (for date inputs)
     */
    async fillDate(date: string): Promise<void> {
        await this.locator.fill(date);
    }

    /**
     * Get the currently selected date value
     */
    async getSelectedDate(): Promise<string> {
        return (await this.locator.inputValue()) || '';
    }
}
