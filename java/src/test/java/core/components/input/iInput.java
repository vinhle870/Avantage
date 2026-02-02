package core.components.input;

import core.components.baseComponent.iBaseComponent;

public interface iInput extends iBaseComponent {

    public void fillValue(Object value);

    public String getShownValue();
}
