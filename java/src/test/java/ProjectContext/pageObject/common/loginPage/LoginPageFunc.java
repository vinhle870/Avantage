package ProjectContext.pageObject.common.loginPage;


public class LoginPageFunc {

    public LoginPage page;

    public LoginPageFunc() {
        page = new LoginPage();
    }

    public void loginToPortal(String userName, String password) {
        page.txt_Username().fillValue(userName);
        page.txt_Password().fillValue(password);
        page.btn_SignIn().click();
    }

    public void forgetPassword() {
        page.lnk_ForgetPassword().click();
    }
}
