import { Page, Locator } from '@playwright/test';
import { BaseComponent } from './BaseComponent';
import { ButtonComponent } from './ButtonComponent';
import { CheckboxComponent } from './CheckboxComponent';
import { DropdownComponent } from './DropdownComponent';
import { HeadingComponent } from './HeadingComponent';
import { InputComponent } from './InputComponent';
import { LabelComponent } from './LabelComponent';
import { LinkComponent } from './LinkComponent';
import { TableComponent } from './TableComponent';

/**
 * Wrapper component for container elements that hold multiple child components.
 * Provides methods to get typed child components.
 * Converted from Java wrapperCompImpl.java
 */
export class WrapperComponent extends BaseComponent {
    constructor(page: Page, selector: string) {
        super(page, selector);
    }

    /**
     * Get a child button component
     */
    getChildButton(selector: string): ButtonComponent {
        const fullSelector = `${this.selector} ${selector}`;
        return new ButtonComponent(this.page, fullSelector);
    }

    /**
     * Get all child button components
     */
    async getChildButtons(selector: string): Promise<ButtonComponent[]> {
        const locators = this.locator.locator(selector);
        const count = await locators.count();
        const buttons: ButtonComponent[] = [];

        for (let i = 0; i < count; i++) {
            const fullSelector = `${this.selector} ${selector} >> nth=${i}`;
            buttons.push(new ButtonComponent(this.page, fullSelector));
        }

        return buttons;
    }

    /**
     * Get a child checkbox component
     */
    getChildCheckbox(selector: string): CheckboxComponent {
        const fullSelector = `${this.selector} ${selector}`;
        return new CheckboxComponent(this.page, fullSelector);
    }

    /**
     * Get all child checkbox components
     */
    async getChildCheckboxes(selector: string): Promise<CheckboxComponent[]> {
        const locators = this.locator.locator(selector);
        const count = await locators.count();
        const checkboxes: CheckboxComponent[] = [];

        for (let i = 0; i < count; i++) {
            const fullSelector = `${this.selector} ${selector} >> nth=${i}`;
            checkboxes.push(new CheckboxComponent(this.page, fullSelector));
        }

        return checkboxes;
    }

    /**
     * Get a child dropdown component
     */
    getChildDropdown(selector: string): DropdownComponent {
        const fullSelector = `${this.selector} ${selector}`;
        return new DropdownComponent(this.page, fullSelector);
    }

    /**
     * Get all child dropdown components
     */
    async getChildDropdowns(selector: string): Promise<DropdownComponent[]> {
        const locators = this.locator.locator(selector);
        const count = await locators.count();
        const dropdowns: DropdownComponent[] = [];

        for (let i = 0; i < count; i++) {
            const fullSelector = `${this.selector} ${selector} >> nth=${i}`;
            dropdowns.push(new DropdownComponent(this.page, fullSelector));
        }

        return dropdowns;
    }

    /**
     * Get a child heading component
     */
    getChildHeading(selector: string): HeadingComponent {
        const fullSelector = `${this.selector} ${selector}`;
        return new HeadingComponent(this.page, fullSelector);
    }

    /**
     * Get all child heading components
     */
    async getChildHeadings(selector: string): Promise<HeadingComponent[]> {
        const locators = this.locator.locator(selector);
        const count = await locators.count();
        const headings: HeadingComponent[] = [];

        for (let i = 0; i < count; i++) {
            const fullSelector = `${this.selector} ${selector} >> nth=${i}`;
            headings.push(new HeadingComponent(this.page, fullSelector));
        }

        return headings;
    }

    /**
     * Get a child input component
     */
    getChildInput(selector: string): InputComponent {
        const fullSelector = `${this.selector} ${selector}`;
        return new InputComponent(this.page, fullSelector);
    }

    /**
     * Get all child input components
     */
    async getChildInputs(selector: string): Promise<InputComponent[]> {
        const locators = this.locator.locator(selector);
        const count = await locators.count();
        const inputs: InputComponent[] = [];

        for (let i = 0; i < count; i++) {
            const fullSelector = `${this.selector} ${selector} >> nth=${i}`;
            inputs.push(new InputComponent(this.page, fullSelector));
        }

        return inputs;
    }

    /**
     * Get a child link component
     */
    getChildLink(selector: string): LinkComponent {
        const fullSelector = `${this.selector} ${selector}`;
        return new LinkComponent(this.page, fullSelector);
    }

    /**
     * Get all child link components
     */
    async getChildLinks(selector: string): Promise<LinkComponent[]> {
        const locators = this.locator.locator(selector);
        const count = await locators.count();
        const links: LinkComponent[] = [];

        for (let i = 0; i < count; i++) {
            const fullSelector = `${this.selector} ${selector} >> nth=${i}`;
            links.push(new LinkComponent(this.page, fullSelector));
        }

        return links;
    }

    /**
     * Get a child label component
     */
    getChildLabel(selector: string): LabelComponent {
        const fullSelector = `${this.selector} ${selector}`;
        return new LabelComponent(this.page, fullSelector);
    }

    /**
     * Get all child label components
     */
    async getChildLabels(selector: string): Promise<LabelComponent[]> {
        const locators = this.locator.locator(selector);
        const count = await locators.count();
        const labels: LabelComponent[] = [];

        for (let i = 0; i < count; i++) {
            const fullSelector = `${this.selector} ${selector} >> nth=${i}`;
            labels.push(new LabelComponent(this.page, fullSelector));
        }

        return labels;
    }

    /**
     * Get a child table component
     */
    getChildTable(selector: string): TableComponent {
        const fullSelector = `${this.selector} ${selector}`;
        return new TableComponent(this.page, fullSelector);
    }

    /**
     * Get all child table components
     */
    async getChildTables(selector: string): Promise<TableComponent[]> {
        const locators = this.locator.locator(selector);
        const count = await locators.count();
        const tables: TableComponent[] = [];

        for (let i = 0; i < count; i++) {
            const fullSelector = `${this.selector} ${selector} >> nth=${i}`;
            tables.push(new TableComponent(this.page, fullSelector));
        }

        return tables;
    }

    /**
     * Get a child wrapper component
     */
    getChildWrapper(selector: string): WrapperComponent {
        const fullSelector = `${this.selector} ${selector}`;
        return new WrapperComponent(this.page, fullSelector);
    }

    /**
     * Get all child wrapper components
     */
    async getChildWrappers(selector: string): Promise<WrapperComponent[]> {
        const locators = this.locator.locator(selector);
        const count = await locators.count();
        const wrappers: WrapperComponent[] = [];

        for (let i = 0; i < count; i++) {
            const fullSelector = `${this.selector} ${selector} >> nth=${i}`;
            wrappers.push(new WrapperComponent(this.page, fullSelector));
        }

        return wrappers;
    }
}
