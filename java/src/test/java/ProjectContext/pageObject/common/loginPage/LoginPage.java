package ProjectContext.pageObject.common.loginPage;

import core.components.buttons.buttonImpl;
import core.components.buttons.iButton;
import core.components.input.iInput;
import core.components.input.inputImpl;
import core.components.label.iLabel;
import core.components.label.labelImpl;
import core.components.link.iLink;
import core.components.link.linkImpl;
import org.openqa.selenium.By;


public class LoginPage {
  
  public LoginPage() {

  }
  
  public iInput txt_Username() {
    //return webComponent.generateInput(By.xpath("//input[@name='_username']"));
    return new inputImpl(By.xpath("//input[@name='_username']"));
  }
  
  public iInput txt_Password() {
    return new inputImpl(By.xpath("//input[@name='_password']"));
    //return webComponent.generateInput(By.xpath("//input[@name='_password']"));
  }
  
  public iButton btn_SignIn() {
    return new buttonImpl(By.xpath("//button[@type='submit']"));
  }
  
  public iLink lnk_ForgetPassword() {
    return new linkImpl(By.linkText("Mot de passe oublié?"));
  }

  public iLabel lab_WelcomeTo() {
    return new labelImpl(By.xpath("//small[@class='text-muted']"));
  }
}
