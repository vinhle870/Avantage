
package ProjectContext.pageObject.adminPortal.programManage.newProgramPage;


import ProjectContext.BusinessObject.Admin.Program;

public class Admin_NewProgramPageFunc {


    public static void fillNewProgramForm(Program program, boolean submit) {
        Admin_NewProgramsPage.txt_Name().fillValue(program.getName());

        Admin_NewProgramsPage.txt_Code().fillValue(program.getCode());

        Admin_NewProgramsPage.txt_Description().fillValue(program.getDescription());

        Admin_NewProgramsPage.dpd_WarrantyCondt().selectOption(program.getWarrantyCondition().getName());

        if (submit) Admin_NewProgramsPage.btn_Save().click();
    }
}
