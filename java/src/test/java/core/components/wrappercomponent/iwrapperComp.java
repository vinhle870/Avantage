package core.components.wrappercomponent;


import core.components.baseComponent.iBaseComponent;

import org.openqa.selenium.By;

import java.util.List;

public interface iwrapperComp extends iBaseComponent{

    public iBaseComponent getChildButton(By selector);

    public List<iBaseComponent> getChildButtons(By selector);

    public iBaseComponent getChildCheckBox(By selector);

    public List<iBaseComponent> getChildCheckBoxes(By selector);

    public iBaseComponent getChildDropdown(By selector);

    public List<iBaseComponent>  getChildDropdowns(By selector);

    public iBaseComponent getChildHeading(By selector);

    public List<iBaseComponent>  getChildHeadings(By selector);

    public iBaseComponent getChildInput(By selector);

    public List<iBaseComponent>  getChildInputs(By selector);

    public iBaseComponent getChildLink(By selector);

    public List<iBaseComponent>  getChildLinks(By selector);

    public iBaseComponent getChildLabel(By selector);

    public List<iBaseComponent>  getChildLabels(By selector);

    public iBaseComponent getChildTable(By selector);

    public List<iBaseComponent>  getChildTables(By selector);

    public iBaseComponent getChildWrapperCompo(By selector);

    /**
     * The Parent must be unique. If parent having mutliple same selector, this method will not work
     * @param selector
     * @return
     */
    public List<iwrapperComp> getChildWrapperCompos(By selector);






















}
