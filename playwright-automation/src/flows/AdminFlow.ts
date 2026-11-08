import { expect, Page, test } from '@playwright/test';
import { config, getCredentials } from '../data/config';
import { Dealer, PriceRule, ProgOption, Program } from '../data/admin-portal';
import { LoginPage } from '../pages/common/LoginPage';
import {
    AdminDealersPage, AdminLeftMenu, AdminNewDealerPage, AdminNewPriceRulePage, AdminNewProgramPage,
    AdminPriceRulesPage, AdminProgramDetailPage, AdminProgramsPage, ProgramOptionModal,
} from '../pages/adminPortal';
import { formatPlain } from '../core/utils/javaFormat';

/**
 * Admin Portal business flows.
 * Converted from AdminSteps.java — one method per Serenity @Step, same names.
 */
export class AdminFlow {
    private readonly loginPage: LoginPage;
    private readonly leftMenu: AdminLeftMenu;
    private readonly dealersPage: AdminDealersPage;
    private readonly newDealerPage: AdminNewDealerPage;
    private readonly priceRulesPage: AdminPriceRulesPage;
    private readonly newPriceRulePage: AdminNewPriceRulePage;
    private readonly programsPage: AdminProgramsPage;
    private readonly newProgramPage: AdminNewProgramPage;
    private readonly programDetailPage: AdminProgramDetailPage;
    private readonly programOptionModal: ProgramOptionModal;

    constructor(private readonly page: Page) {
        this.loginPage = new LoginPage(page);
        this.leftMenu = new AdminLeftMenu(page);
        this.dealersPage = new AdminDealersPage(page);
        this.newDealerPage = new AdminNewDealerPage(page);
        this.priceRulesPage = new AdminPriceRulesPage(page);
        this.newPriceRulePage = new AdminNewPriceRulePage(page);
        this.programsPage = new AdminProgramsPage(page);
        this.newProgramPage = new AdminNewProgramPage(page);
        this.programDetailPage = new AdminProgramDetailPage(page);
        this.programOptionModal = new ProgramOptionModal(page);
    }

    async loginToAdminPortal(): Promise<void> {
        await test.step('Admin goes to Admin Portal page', async () => {
            const { username, password } = getCredentials('admin');
            await this.page.goto(config.adminPortalUrl);
            await this.loginPage.loginToPortal(username, password);
            await expect(this.loginPage.lblWelcome.first(), `Unable to login ${username} user to admin portal`)
                .toBeVisible();
        });
    }

    async logoutFromAdminPortal(): Promise<void> {
        await test.step('Admin LogOut From Portal', async () => {
            await this.leftMenu.logout();
        });
    }

    async createNewDealer(dealer: Dealer, submit: boolean): Promise<void> {
        await test.step('Admin Create New Dealer on Admin Portal', async () => {
            await this.leftMenu.goToUsersPage();
            await this.dealersPage.openNewDealerPage();
            await this.newDealerPage.fillNewDealerForm(dealer, submit);
            if (submit) {
                await expect(this.newDealerPage.lblDealerSaved, 'Dealer not saved successfully').toBeVisible();
            }
        });
    }

    async deleteDealer(dealerName: string, submit: boolean): Promise<void> {
        await test.step('Admin Delete Dealer on Admin Portal', async () => {
            await this.leftMenu.goToUsersPage();
            await this.dealersPage.waitForTableVisible();
            await this.dealersPage.deleteDealer(dealerName, submit);
            if (submit) {
                await expect.poll(() => this.dealersPage.isDealerAvailableOnList(dealerName),
                    { message: 'Dealer not deleted successfully' }).toBe(false);
            }
        });
    }

    async createNewProgram(program: Program, submit: boolean): Promise<void> {
        await test.step('Admin Create New Program on Admin Portal', async () => {
            await this.leftMenu.goToProgramsPage();
            await this.programsPage.openNewProgramPage();
            await this.newProgramPage.fillNewProgramForm(program, submit);
            if (submit) {
                // A rejected form stays on /program/new/edit with field errors
                await expect.poll(async () => this.page.url().includes('/program/new/edit')
                    ? (await this.newProgramPage.formErrors.allInnerTexts()).join('; ') || 'still on the form'
                    : 'saved', { message: `Program "${program.name}" was not saved` }).toBe('saved');
            }
        });
    }

    async createNewPriceRule(priceRule: PriceRule, submit: boolean): Promise<void> {
        await test.step('Admin Create Custom Price Rule on Admin Portal', async () => {
            await this.leftMenu.goToPriceRulesPage();
            await this.priceRulesPage.openNewPriceRulePage();
            await this.newPriceRulePage.fillPriceRuleForm(priceRule, submit);
            await expect(this.priceRulesPage.lblPriceRuleSaved, 'Unable to create new price rule').toBeVisible();
        });
    }

    async deletePriceRule(priceRule: PriceRule, submit: boolean): Promise<void> {
        await test.step('Admin Delete Custom Price Rule on Admin Portal', async () => {
            await this.leftMenu.goToPriceRulesPage();
            await this.priceRulesPage.waitForTableVisible();
            await this.priceRulesPage.deletePriceRule(priceRule.name, submit);
            if (submit) {
                await expect.poll(() => this.priceRulesPage.isPriceRuleAvailableOnList(priceRule.name),
                    { message: 'PriceRule not deleted successfully' }).toBe(false);
            }
        });
    }

    async addProgramOption(program: Program, submit: boolean): Promise<void> {
        await test.step('Admin Adds New Option in the Full Program Details screen', async () => {
            await this.programsPage.openExistingProgramPage(program.name);
            await this.programDetailPage.openNewOptionModal();
            await this.programOptionModal.fillProgramOption(program.programOptions[0], submit);
        });
    }

    async editProgramOptionInfo(programName: string, oldOptionName: string, newOption: ProgOption,
                                submit: boolean): Promise<void> {
        await test.step('Admin Edit Existing Option Info in the Full Program Details screen', async () => {
            await this.programsPage.openExistingProgramPage(programName);
            await this.programDetailPage.openEditOptionModal(oldOptionName);
            await this.programOptionModal.fillProgramOption(newOption, submit);
        });
    }

    /**
     * The program row must read "name|description|code". The list shows a numeric code
     * with 3 decimals (Java "%.3f"); a non-numeric code is expected as entered.
     */
    async verifyProgramIsAvailableOnProgramList(program: Program): Promise<void> {
        await test.step('VERIFICATION POINT: Verify Program Is Available on the Program List', async () => {
            const numericCode = Number(program.code);
            const code = program.code.trim() !== '' && !Number.isNaN(numericCode)
                ? formatPlain(numericCode, 3)
                : program.code;
            const expected = `${program.name}|${program.description}|${code}`;

            await this.leftMenu.goToProgramsPage();
            await this.programsPage.waitForTableVisible();
            expect(await this.programsPage.isProgramAvailableOnList(program.name),
                `The Program[${program.name}] Is Not Available On List.`).toBe(true);
            expect(await this.programsPage.findProgramInfoOnList(program),
                `MissMatched Program Info for [${program.name}]`).toContain(expected);
        });
    }
}
