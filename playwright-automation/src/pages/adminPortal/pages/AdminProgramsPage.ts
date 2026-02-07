import { Page, Locator } from "@playwright/test";
import { TableComponent } from "@core/components";
import { AdminProgramLocator } from "../locators/AdminProgramLocator";

/**
 * Program data interface
 */
export interface ProgramData {
  name: string;
}

/**
 * Admin Programs Page - Manage programs.
 * Converted from Admin_ProgramsPage.java + Admin_ProgramPageFunc.java
 */
export class AdminProgramsPage {
  private page: Page;

  // Locators
  readonly lnkAddNew: Locator;
  readonly tblProgramList: TableComponent;

  constructor(page: Page) {
    this.page = page;
    this.lnkAddNew = this.page.locator(AdminProgramLocator.lnkAddNewLocator);
    this.tblProgramList = new TableComponent(
      this.page,
      AdminProgramLocator.tblProgramListLocator,
    );
  }

  /**
   * Open new program page
   */
  async openNewProgramPage(): Promise<void> {
    await this.lnkAddNew.click();
  }

  /**
   * Open an existing program by name
   */
  async openExistingProgramPage(programName: string): Promise<void> {
    await this.tblProgramList.clickOnChildInRow(programName, "td");
  }

  /**
   * Find program info on the list and return row text
   */
  async findProgramInfoOnList(program: ProgramData): Promise<string> {
    return await this.tblProgramList.getRowTextContent(program.name, "|");
  }

  /**
   * Check if program exists in the list
   */
  async isProgramAvailableOnList(programName: string): Promise<boolean> {
    const row = await this.tblProgramList.findRow(programName);
    return row !== null;
  }

  /**
   * Wait for table to be visible
   */
  async waitForTableVisible(): Promise<void> {
    await this.tblProgramList.waitForVisible();
  }
}
