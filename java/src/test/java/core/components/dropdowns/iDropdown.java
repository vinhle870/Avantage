package core.components.dropdowns;

import core.components.baseComponent.iBaseComponent;
import org.openqa.selenium.WebElement;

import java.util.List;

public interface iDropdown extends iBaseComponent {

    public void selectOption(String optionText);

    public void removeSelectedOption(String optionText);

    public List<WebElement> getOptionsList();

    public String getSelectedOption() ;



}
