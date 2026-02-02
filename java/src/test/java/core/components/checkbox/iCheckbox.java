package core.components.checkbox;

import core.components.baseComponent.iBaseComponent;

public interface iCheckbox extends iBaseComponent {

    public void select();

    public void unSelect();

    public Boolean getStatus();
}
