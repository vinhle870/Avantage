package core.components.link;

import core.assertion.TestAssertions;
import core.enums.Failure_Handler;
import core.components.baseComponent.baseComponent;
import core.configuration.ApplicationDriver.ApplicationDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.ElementNotInteractableException;

public class linkImpl extends baseComponent implements iLink {

    public linkImpl(ApplicationDriver appDriver, By locator) {
        super(appDriver, locator);
    }


    public linkImpl(By locator) {
        super( locator);
    }

    @Override
    public void click() {
        try {
            Thread.sleep(1000);

            this.getElement().click();

        } catch (NullPointerException e) {
            //TODO handler exception
            TestAssertions.markStepFailed("Unfounded the element " + this.getLocator(), Failure_Handler.STOP_RUN);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } catch (ElementNotInteractableException e) {
            executeJsAction("arguments[0].click();");
        }
    }
}
