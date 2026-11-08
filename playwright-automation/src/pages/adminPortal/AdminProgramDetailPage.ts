import { Page, Locator } from '@playwright/test';
import { TableComponent } from '../../core/components/TableComponent';

/**
 * Admin Program Detail Page - Full program info with its options and terms.
 * Converted from fullProgInfoPage.java + fullProgInfoPage_Func.java
 */
export class AdminProgramDetailPage {
    private page: Page;

    // Locators
    readonly topHeading: Locator;
    readonly lblProgName: Locator;
    readonly lblProgDescription: Locator;
    readonly lblProgCode: Locator;
    readonly lblProgType: Locator;
    readonly lblWarrantyConditions: Locator;
    readonly btnEditProgram: Locator;
    readonly btnAddOption: Locator;
    readonly btnAddTerm: Locator;

    constructor(page: Page) {
        this.page = page;
        this.topHeading = page.locator('h1').first();
        this.lblProgName = page.locator('//div[strong[.="Name: "]]');
        this.lblProgDescription = page.locator('//div[strong[.="Description: "]]');
        this.lblProgCode = page.locator('//div[strong[.="Code: "]]');
        this.lblProgType = page.locator('//div[strong[.="Type: "]]');
        this.lblWarrantyConditions = page.locator('//div[strong[.="Warranty Conditions: "]]');
        this.btnEditProgram = page.locator('//ul//*[contains(text(),"Edit")]').first();
        this.btnAddOption = page.locator('//*[contains(text(),"Add Option")]').first();
        this.btnAddTerm = page.locator('//*[contains(text(),"Add Term")]').first();
    }

    /**
     * Section of a program option (the element holding the option name paragraph)
     */
    optionSection(optionName: string): Locator {
        return this.page.locator(`//*[p[contains(text(),"${optionName}")]]`).first();
    }

    /**
     * Terms table of a program option
     */
    termTable(optionName: string): TableComponent {
        return new TableComponent(this.page, this.optionSection(optionName).locator('table').first());
    }

    async openNewOptionModal(): Promise<void> {
        await this.btnAddOption.click();
    }

    async openEditOptionModal(optionName: string): Promise<void> {
        await this.optionSection(optionName).locator('xpath=.//*[contains(text(),"Edit Option")]').first().click();
    }

    async openNewTermModal(): Promise<void> {
        await this.btnAddTerm.click();
    }

    /**
     * Row text ("a|b|c") of a term in an option's terms table
     */
    async getTermRowText(optionName: string, termId: string): Promise<string> {
        return await this.termTable(optionName).getRowTextContent(termId, '|');
    }
}
