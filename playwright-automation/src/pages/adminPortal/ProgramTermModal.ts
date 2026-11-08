import { Page, Locator } from '@playwright/test';
import { ProgTerm } from '../../data/admin-portal';

/**
 * Program Term Modal - Add/Edit a term of a program option.
 * Converted from ProgTerm_Modal.java + ProgTerm_Modal_Func.java
 */
export class ProgramTermModal {
    private page: Page;

    // Locators
    readonly txtEligibilityYears: Locator;
    readonly txtEligibilityKm: Locator;
    readonly txtTermMonths: Locator;
    readonly txtTermKm: Locator;
    readonly txtFranchiseAmount: Locator;
    readonly txtRepairAmountPerVisit: Locator;
    readonly txtRepairAmountTotal: Locator;
    readonly txtRepairAmountText: Locator;
    readonly btnSave: Locator;

    constructor(page: Page) {
        this.page = page;
        this.txtEligibilityYears = page.locator('[id="program_term_eligibilityYears"]');
        this.txtEligibilityKm = page.locator('[id="program_term_eligibilityKm"]');
        this.txtTermMonths = page.locator('[id="program_term_termMonths"]');
        this.txtTermKm = page.locator('[id="program_term_termKm"]');
        this.txtFranchiseAmount = page.locator('[id="program_term_franchiseAmount"]');
        this.txtRepairAmountPerVisit = page.locator('[id="program_term_repairAmountPerVisit"]');
        this.txtRepairAmountTotal = page.locator('[id="program_term_repairAmountTotal"]');
        this.txtRepairAmountText = page.locator('[id="program_term_repairAmountText"]');
        this.btnSave = page.locator('[type="submit"]').first();
    }

    async fillProgramTerm(term: ProgTerm, submit: boolean = true): Promise<void> {
        await this.txtEligibilityYears.fill(term.eligibilityYears);
        await this.txtEligibilityKm.fill(term.eligibilityKmPerHr);
        await this.txtTermMonths.fill(term.termMonths);
        await this.txtTermKm.fill(term.termKm);
        await this.txtFranchiseAmount.fill(term.franchiseAmount);
        await this.txtRepairAmountPerVisit.fill(term.repairAmountPerVisit);
        await this.txtRepairAmountTotal.fill(term.repairAmountTotal);
        await this.txtRepairAmountText.fill(term.repairAmountText);
        if (submit) {
            await this.btnSave.click();
        }
    }
}
