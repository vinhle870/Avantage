package ProjectContext.pageObject.adminPortal.programManage.progTermMdal;

import ProjectContext.BusinessObject.Admin.ProgramTerms;

public class ProgTerm_Modal_Func {


    public static void fillProgramTermInfoToModal(ProgramTerms progTerms, Boolean submit)
    {

        ProgTerm_Modal.txt_EligYears().fillValue(progTerms.getProgTerm().get(0).getEligibilityYears());

        ProgTerm_Modal.txt_EligKm().fillValue(progTerms.getProgTerm().get(0).getEligibilityKmPerHr());

        ProgTerm_Modal.txt_TermMonths().fillValue(progTerms.getProgTerm().get(0).getTermMonths());

        ProgTerm_Modal.txt_TermKm().fillValue(progTerms.getProgTerm().get(0).getTermKm());

        ProgTerm_Modal.txt_FranchiseAmount().fillValue(progTerms.getProgTerm().get(0).getFranchiseAmount());

        ProgTerm_Modal.txt_RepairAmountPerVisit().fillValue(progTerms.getProgTerm().get(0).getRepairAmountPerVisit());

        ProgTerm_Modal.txt_RepairAmountPerVisit().fillValue(progTerms.getProgTerm().get(0).getRepairAmountPerVisit());


        if(submit)
            ProgTerm_Modal.btn_Save().click();

    }



}
