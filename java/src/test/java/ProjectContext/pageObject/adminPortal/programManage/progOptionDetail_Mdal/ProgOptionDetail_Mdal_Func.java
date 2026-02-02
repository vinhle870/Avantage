package ProjectContext.pageObject.adminPortal.programManage.progOptionDetail_Mdal;

import ProjectContext.BusinessObject.Admin.ProgOption;

public class ProgOptionDetail_Mdal_Func {

    public static void fillProgrOptionInfoInModal(ProgOption programOption, Boolean submit) {
        ProgOptionDetail_Mdal.txt_Name().fillValue(programOption.getName());

        ProgOptionDetail_Mdal.txt_Code().fillValue(programOption.getCode());

        if (submit)
            ProgOptionDetail_Mdal.btn_Save().click();
    }
}
