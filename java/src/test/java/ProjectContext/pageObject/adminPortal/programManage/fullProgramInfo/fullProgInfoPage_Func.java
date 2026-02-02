package ProjectContext.pageObject.adminPortal.programManage.fullProgramInfo;

public class fullProgInfoPage_Func  {


    public static void getTermName(String optionName,String termID)
    {
        String result = fullProgInfoPage.tbl_TermList(optionName).getRowTextContent(termID, "|");

        System.out.println(result);
    }

    public static void openNewTermModal(String progOptionName)
    {
        fullProgInfoPage.btn_AddTerm(progOptionName).click();
    }

    public static void openEditOptionModal(String optionName)
    {
        fullProgInfoPage.btn_EditOption(optionName).click();
    }

    public static void openNewOptionModal()
    {
        fullProgInfoPage.btn_AddOption().click();
    }


}
