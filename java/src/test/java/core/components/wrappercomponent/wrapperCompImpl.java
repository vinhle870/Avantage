package core.components.wrappercomponent;

import core.components.baseComponent.baseComponent;
import core.components.baseComponent.iBaseComponent;
import core.components.buttons.buttonImpl;
import core.components.buttons.iButton;
import core.components.checkbox.checkboxImpl;
import core.components.checkbox.iCheckbox;
import core.components.dropdowns.dropdownImpl;
import core.components.dropdowns.iDropdown;
import core.components.heading.headingImpl;
import core.components.heading.iHeading;
import core.components.input.iInput;
import core.components.input.inputImpl;
import core.components.label.iLabel;
import core.components.label.labelImpl;
import core.components.link.iLink;
import core.components.link.linkImpl;
import core.components.table.iTable;
import core.components.table.tableImpl;
import core.configuration.ApplicationDriver.ApplicationDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.ArrayList;
import java.util.List;

public class wrapperCompImpl extends baseComponent implements iwrapperComp {

    public wrapperCompImpl(ApplicationDriver appDriver, By headingSelector) {
        super(appDriver, headingSelector);
    }

    public wrapperCompImpl( By headingSelector) {
        super( headingSelector);
    }

    @Override
    public iBaseComponent getChildButton(By selector) {

        iButton comp =  new buttonImpl(this.appDriver,selector);

        comp.setElement(this.getElement().findElement(selector));

        return comp;

    }

    @Override
    public List<iBaseComponent> getChildButtons(By selector) {

        List<iBaseComponent> comps = new ArrayList<>();
        List<WebElement> child_webElement = this.getElement().findElements(selector);
        for(WebElement e: child_webElement)
        {
            iButton comp =  new buttonImpl(this.appDriver,selector);

            comp.setElement(e);

            comps.add(comp);
        }

        return comps;

    }

    @Override
    public iBaseComponent getChildCheckBox(By selector) {
        iCheckbox comp =  new checkboxImpl(this.appDriver,selector);

        comp.setElement(this.getElement().findElement(selector));

        return comp;
    }

    @Override
    public List<iBaseComponent> getChildCheckBoxes(By selector) {
        List<iBaseComponent> comps = new ArrayList<>();

        List<WebElement> child_webElement = this.getElement().findElements(selector);

        for(WebElement e: child_webElement)
        {
            iCheckbox comp =  new checkboxImpl(this.appDriver,selector);

            comp.setElement(e);

            comps.add(comp);
        }

        return comps;
    }

    @Override
    public iBaseComponent getChildDropdown(By selector) {
        iDropdown comp =  new dropdownImpl(this.appDriver,selector);

        comp.setElement(this.getElement().findElement(selector));

        return comp;
    }

    @Override
    public List<iBaseComponent> getChildDropdowns(By selector) {
        List<iBaseComponent> comps = new ArrayList<>();

        List<WebElement> child_webElement = this.getElement().findElements(selector);

        for(WebElement e: child_webElement)
        {
            iDropdown comp =  new dropdownImpl(this.appDriver,selector);

            comp.setElement(e);

            comps.add(comp);
        }

        return comps;
    }

    @Override
    public iBaseComponent getChildHeading(By selector) {

        iHeading comp =  new headingImpl(this.appDriver,selector);

        comp.setElement(this.getElement().findElement(selector));

        return comp;
    }

    @Override
    public List<iBaseComponent> getChildHeadings(By selector) {

        List<iBaseComponent> comps = new ArrayList<>();

        List<WebElement> child_webElement = this.getElement().findElements(selector);

        for(WebElement e: child_webElement)
        {
            iHeading comp =  new headingImpl(this.appDriver,selector);

            comp.setElement(e);

            comps.add(comp);
        }

        return comps;
    }

    @Override
    public iBaseComponent getChildInput(By selector) {

        iInput comp =  new inputImpl(this.appDriver,selector);

        comp.setElement(this.getElement().findElement(selector));

        return comp;
    }

    @Override
    public List<iBaseComponent> getChildInputs(By selector) {

        List<iBaseComponent> comps = new ArrayList<>();

        List<WebElement> child_webElement = this.getElement().findElements(selector);

        for(WebElement e: child_webElement)
        {
            iInput comp =  new inputImpl(this.appDriver,selector);

            comp.setElement(e);

            comps.add(comp);
        }

        return comps;
    }

    @Override
    public iBaseComponent getChildLink(By selector) {
        iLink comp =  new linkImpl(this.appDriver,selector);

        comp.setElement(this.getElement().findElement(selector));

        return comp;
    }

    @Override
    public List<iBaseComponent> getChildLinks(By selector) {
        List<iBaseComponent> comps = new ArrayList<>();

        List<WebElement> child_webElement = this.getElement().findElements(selector);

        for(WebElement e: child_webElement)
        {
            iLink comp =  new linkImpl(this.appDriver,selector);

            comp.setElement(e);

            comps.add(comp);
        }

        return comps;
    }

    @Override
    public iBaseComponent getChildLabel(By selector) {
        iLabel comp =  new labelImpl(this.appDriver,selector);

        comp.setElement(this.getElement().findElement(selector));

        return comp;
    }

    @Override
    public List<iBaseComponent> getChildLabels(By selector) {
        List<iBaseComponent> comps = new ArrayList<>();

        List<WebElement> child_webElement = this.getElement().findElements(selector);

        for(WebElement e: child_webElement)
        {
            iLabel comp =  new labelImpl(this.appDriver,selector);

            comp.setElement(e);

            comps.add(comp);
        }

        return comps;
    }

    @Override
    public iBaseComponent getChildTable(By selector) {
        iTable comp =  new tableImpl(this.appDriver,selector);

        comp.setElement(this.getElement().findElement(selector));

        return comp;
    }

    @Override
    public List<iBaseComponent> getChildTables(By selector) {
        List<iBaseComponent> comps = new ArrayList<>();

        List<WebElement> child_webElement = this.getElement().findElements(selector);

        for(WebElement e: child_webElement)
        {
            iTable comp =  new tableImpl(this.appDriver,selector);

            comp.setElement(e);

            comps.add(comp);
        }

        return comps;
    }

    public iwrapperComp getChildWrapperCompo(By selector)
    {
        iwrapperComp comp =  new wrapperCompImpl(this.appDriver,selector);

        comp.setElement(this.getElement().findElement(selector));

        return comp;
    }

    public List<iwrapperComp> getChildWrapperCompos(By selector)
    {
        List<iwrapperComp> comps = new ArrayList<>();

        List<WebElement> child_webElement = this.getElement().findElements(selector);

        for(WebElement e: child_webElement)
        {
            iwrapperComp comp =  new wrapperCompImpl(this.appDriver,selector);

            comp.setElement(e);

            comps.add(comp);
        }

        return comps;
    }


}
