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

        // Click on navigator to open year selection
        const navigator = this.locator.locator("div[role='period']");

        // Click twice to get to year selection
        await navigator.click();
        await navigator.click();

        // Select year
        const yearSelector = this.locator.locator(`div:text("${year}")`);
        await yearSelector.click();

        // Select month
        const monthSelector = this.locator.locator(`div:text("${monthShort}")`);
        await monthSelector.click();

        // Select day
        const daySelector = this.locator.locator(`div:text-is("${parseInt(day)}")`);
        await daySelector.click();

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
