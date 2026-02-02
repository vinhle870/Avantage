package ProjectContext.stepsDefiniton;


import ProjectContext.BusinessObject.Admin.Dealer;
import ProjectContext.BusinessObject.Admin.PriceRule;
import ProjectContext.BusinessObject.Admin.ProgOption;
import ProjectContext.BusinessObject.Admin.Program;
import ProjectContext.pageObject.adminPortal.adminDealersPage.Admin_DealerPageFunc;
import ProjectContext.pageObject.adminPortal.adminLeftMenu.Admin_LeftMenuPanelFunc;
import ProjectContext.pageObject.adminPortal.adminNewDealerPage.Admin_NewDealerPageFunc;
import ProjectContext.pageObject.adminPortal.adminNewDealerPage.Admin_NewDealersPage;
import ProjectContext.pageObject.adminPortal.adminNewPriceRulePage.Admin_NewPriceRulePageFunc;
import ProjectContext.pageObject.adminPortal.adminPriceRulesPage.Admin_PriceRulePageFunc;
import ProjectContext.pageObject.adminPortal.adminPriceRulesPage.Admin_PriceRulesPage;
import ProjectContext.pageObject.adminPortal.programManage.fullProgramInfo.fullProgInfoPage_Func;
import ProjectContext.pageObject.adminPortal.programManage.landingProgramPage.Admin_ProgramPageFunc;
import ProjectContext.pageObject.adminPortal.programManage.newProgramPage.Admin_NewProgramPageFunc;
import ProjectContext.pageObject.adminPortal.programManage.progOptionDetail_Mdal.ProgOptionDetail_Mdal_Func;
import ProjectContext.pageObject.common.loginPage.LoginPageFunc;
import core.assertion.TestAssertions;
import core.browser.Browser;
import core.enums.Failure_Handler;
import net.serenitybdd.annotations.Step;

public class AdminSteps extends StepsBase {

    @Step("Admin goes to Admin Portal page")
    public void loginToAdminPortal() {
        Browser.openUrl(envInfoReader.admin.url);

        LoginPageFunc pageFunc = new LoginPageFunc();

        pageFunc.loginToPortal(envInfoReader.admin.username, envInfoReader.admin.password);

        if (pageFunc.page.lab_WelcomeTo().getElement() == null) {
            TestAssertions.markStepFailed("Unable to login " + envInfoReader.admin.username + " user to admin portal",
                    Failure_Handler.STOP_RUN);
        }
    }

    @Step("Admin LogOut From Portal")
    public void logoutFromAdminPortal() {
        Admin_LeftMenuPanelFunc.logout();
    }

    @Step("Admin Forget Password")
    public void forgetPassword() {
        new LoginPageFunc().forgetPassword();
    }

    @Step("Admin Create New Dealer on Admin Portal")
    public void createNewDealer(Dealer dealer, Boolean submit) {
        Admin_LeftMenuPanelFunc.goToUserPage();

        Admin_DealerPageFunc.openNewDealerPage();

        Admin_NewDealerPageFunc.fillNewDealerForm(dealer, submit);

        if (submit && Admin_NewDealersPage.lab_Dealer_Saved().getElement() == null) {
            TestAssertions.markStepFailed("Dealer not saved successfully", Failure_Handler.STOP_RUN);
        }
    }

    @Step("Admin Delete Dealer on Admin Portal")
    public void deleteDealer(String dealerName, Boolean submit) {
        Admin_LeftMenuPanelFunc.goToUserPage();

        Admin_DealerPageFunc.deleteDealer(dealerName, submit);

        if (submit && Admin_DealerPageFunc.IsDealerAvailableOnList(dealerName)) {
            TestAssertions.markStepFailed("Dealer not deleted successfully", Failure_Handler.STOP_RUN);
        }
    }

    /**
     * Admin Create New Program on Admin Portal
     *
     * @param program
     * @param submit
     */
    @Step("Admin Create New Program on Admin Portal")
    public void createNewProgram(Program program, Boolean submit) {
        Admin_LeftMenuPanelFunc.goToProgramPage();

        Admin_ProgramPageFunc.openNewProgramPage();

        Admin_NewProgramPageFunc.fillNewProgramForm(program, submit);
    }

    @Step("Get Program Info")
    public void getProgramInfoData(String filename) {

    }

    @Step("Admin Create Custom Price Rule on Admin Portal")
    public void createNewPriceRule(PriceRule priceRule, Boolean submit) {
        Admin_LeftMenuPanelFunc.goToPriceRulesPage();

        Admin_PriceRulePageFunc.openNewPriceRulePage();

        Admin_NewPriceRulePageFunc.fillPriceRuleForm(priceRule, submit);

        if (Admin_PriceRulesPage.btn_PriceRuleSaved().getElement() == null) {
            TestAssertions.markStepFailed("Unable to create new price rule", Failure_Handler.STOP_RUN);
        }
    }

    @Step("Admin Delete Custom Price Rule on Admin Portal")
    public void deletePriceRule(PriceRule priceRule, Boolean submit) {
        Admin_LeftMenuPanelFunc.goToPriceRulesPage();

        Admin_PriceRulePageFunc.deletePriceRule(priceRule, submit);

        if (submit && Admin_PriceRulePageFunc.IsPriceRuleAvailableOnList(priceRule.getName())) {
            TestAssertions.markStepFailed("PriceRule not deleted successfully", Failure_Handler.STOP_RUN);
        }
    }

    @Step("Admin Adds New Option in the Full Program Details screen")
    public void addProgramOption(Program program, Boolean submit) {
        Admin_ProgramPageFunc.openExistingProgramPage(program.getName());

        fullProgInfoPage_Func.openNewOptionModal();

        ProgOptionDetail_Mdal_Func.fillProgrOptionInfoInModal(program.getProgramOptions().getProgOption().get(0), submit);
    }

    @Step("Admin Edit Exiting Option Info in the Full Program Details screen")
    public void editProgramOptionInfo(String programName, String oldOptionName, ProgOption newOption, Boolean submit) {
        Admin_ProgramPageFunc.openExistingProgramPage(programName);

        fullProgInfoPage_Func.openEditOptionModal(oldOptionName);

        ProgOptionDetail_Mdal_Func.fillProgrOptionInfoInModal(newOption, submit);
    }

    @Step("VERIFICATION POINT: Verify Program Is Available on the Program List")
    public void verifyProgramIsAvailableOnProgramList(Program program, Failure_Handler failureHandler) {
        String expected_String = program.getName() + "|" + program.getDescription() + "|" + String.format("%.3f",Double.parseDouble(program.getCode()));

        String actual_programText = Admin_ProgramPageFunc.findProgramInfoOnList(program);

        if (actual_programText.equals("")) {
            TestAssertions.markStepFailed("The Program[" + program.getName() + "] Is Not Available On List.\\n", failureHandler);
        } else {
            if (!actual_programText.contains(expected_String))
                TestAssertions.markStepFailed("MissMatched Program Info: Expected[" + program.getName() + "] - Actual[" + actual_programText + "] .\\n", failureHandler);

        }
    }
}
