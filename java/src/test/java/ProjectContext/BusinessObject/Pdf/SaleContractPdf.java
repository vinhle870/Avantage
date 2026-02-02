package ProjectContext.BusinessObject.Pdf;

public class SaleContractPdf {

    protected Double A_vehiclePrice;
    protected Double B_DiscountIfApplicable;
    protected Double C_NetSubTotal;
    protected Double D_Exchange;
    protected Double E_SubTotalWithExchange;
    protected Double F_GST;
    protected Double G_SubTotalBeforeQST;
    protected Double H_MarketValue;
    protected Double I_QST;
    protected Double J_SubTotal;
    protected Double K_BalanceDueOnExchangeVehicle;
    protected Double L_Total;
    protected Double Z1_Transit;
    protected Double Z2_RDPRM;
    protected Double SOLDE_TOTAL;
    protected Double M_ExtendedWarranty;

    public String getM_ExtendedWarrantyID() {
        return M_ExtendedWarrantyID;
    }

    public void setM_ExtendedWarrantyID(String m_ExtendedWarrantyID) {
        M_ExtendedWarrantyID = m_ExtendedWarrantyID;
    }

    protected String M_ExtendedWarrantyID;
    protected Double N_ACC;
    protected String N_ACCNumber;
    protected Double O_NewTiresSpecificDuty;
    protected Double P_MaintenanceProgram;
    protected Double Q_GST_2;
    protected Double R_QST_2;
    protected Double S_Total_2;
    protected Double T_ReplaceInsurance;
    protected String T_ReplaceInsuranceNumber;
    protected Double U_Life_DisabilityInsurance;
    protected String U_Life_DisabilityInsuranceNumber;
    protected Double V_NinePercentInsuranceTax;
    protected Double W_InsuranceTotal;
    protected Double FinancedQSTOrPaidToSAAQ;
    protected Double AdvancePayment;
    protected Double FinancedBalanceIncludeQST;

    public String getOtherClause() {
        return OtherClause;
    }

    public void setOtherClause(String otherClause) {
        OtherClause = otherClause;
    }

    protected String OtherClause;

    public String getN_ACCNumber() {
        return N_ACCNumber;
    }

    public void setN_ACCNumber(String n_ACCNumber) {
        N_ACCNumber = n_ACCNumber;
    }

    public String getT_ReplaceInsuranceNumber() {
        return T_ReplaceInsuranceNumber;
    }

    public void setT_ReplaceInsuranceNumber(String t_ReplaceInsuranceNumber) {
        T_ReplaceInsuranceNumber = t_ReplaceInsuranceNumber;
    }

    public String getU_Life_DisabilityInsuranceNumber() {
        return U_Life_DisabilityInsuranceNumber;
    }

    public void setU_Life_DisabilityInsuranceNumber(String u_Life_DisabilityInsuranceNumber) {
        U_Life_DisabilityInsuranceNumber = u_Life_DisabilityInsuranceNumber;
    }

    protected Double PayableBalanceExcludeQST;

    public Double getA_vehiclePrice() {
        return A_vehiclePrice;
    }

    public void setA_vehiclePrice(Double a_vehiclePrice) {
        A_vehiclePrice = a_vehiclePrice;
    }

    public Double getB_DiscountIfApplicable() {
        return B_DiscountIfApplicable;
    }

    public void setB_DiscountIfApplicable(Double b_DiscountIfApplicable) {
        B_DiscountIfApplicable = b_DiscountIfApplicable * -1;
    }

    public Double getC_NetSubTotal() {
        return C_NetSubTotal;
    }

    public void setC_NetSubTotal(Double c_NetSubTotal) {
        C_NetSubTotal = c_NetSubTotal;
    }

    public Double getD_Exchange() {
        return D_Exchange;
    }

    public void setD_Exchange(Double d_Exchange) {
        D_Exchange = d_Exchange * -1;
    }

    public Double getE_SubTotalWithExchange() {
        return E_SubTotalWithExchange;
    }

    public void setE_SubTotalWithExchange(Double e_SubTotalWithExchange) {
        E_SubTotalWithExchange = e_SubTotalWithExchange;
    }

    public Double getF_GST() {
        if( F_GST <= 0) return 0.0;
        return F_GST;
    }

    public void setF_GST(Double f_GST) {
        F_GST = f_GST;
    }

    public Double getG_SubTotalBeforeQST() {
        return G_SubTotalBeforeQST;
    }

    public void setG_SubTotalBeforeQST(Double g_SubTotalBeforeQST) {
        G_SubTotalBeforeQST = g_SubTotalBeforeQST;
    }

    public Double getH_MarketValue() {
        return H_MarketValue;
    }

    public void setH_MarketValue(Double h_MarketValue) {
        H_MarketValue = h_MarketValue;
    }

    public Double getI_QST() {
        if( F_GST <= 0) return 0.0;
        return I_QST;
    }

    public void setI_QST(Double i_QST) {
        I_QST = i_QST;
    }

    public Double getJ_SubTotal() {
        return J_SubTotal;
    }

    public void setJ_SubTotal(Double j_SubTotal) {
        J_SubTotal = j_SubTotal;
    }

    public Double getK_BalanceDueOnExchangeVehicle() {
        return K_BalanceDueOnExchangeVehicle;
    }

    public void setK_BalanceDueOnExchangeVehicle(Double k_BalanceDueOnExchangeVehicle) {
        K_BalanceDueOnExchangeVehicle = k_BalanceDueOnExchangeVehicle;
    }

    public Double getL_Total() {
        return L_Total;
    }

    public void setL_Total(Double l_Total) {
        L_Total = l_Total;
    }

    public Double getZ1_Transit() {
        return Z1_Transit;
    }

    public void setZ1_Transit(Double z1_Transit) {
        Z1_Transit = z1_Transit;
    }

    public Double getZ2_RDPRM() {
        return Z2_RDPRM;
    }

    public void setZ2_RDPRM(Double z2_RDPRM) {
        Z2_RDPRM = z2_RDPRM;
    }

    public Double getSOLDE_TOTAL() {
        return SOLDE_TOTAL;
    }

    public void setSOLDE_TOTAL(Double SOLDE_TOTAL) {
        this.SOLDE_TOTAL = SOLDE_TOTAL;
    }

    public Double getM_ExtendedWarranty() {
        return M_ExtendedWarranty;
    }

    public void setM_ExtendedWarranty(Double m_ExtendedWarranty) {
        M_ExtendedWarranty = m_ExtendedWarranty;
    }

    public Double getN_ACC() {
        return N_ACC;
    }

    public void setN_ACC(Double n_ACC) {
        N_ACC = n_ACC;
    }

    public Double getO_NewTiresSpecificDuty() {
        return O_NewTiresSpecificDuty;
    }

    public void setO_NewTiresSpecificDuty(Double o_NewTiresSpecificDuty) {
        O_NewTiresSpecificDuty = o_NewTiresSpecificDuty;
    }

    public Double getP_MaintenanceProgram() {
        return P_MaintenanceProgram;
    }

    public void setP_MaintenanceProgram(Double p_MaintenanceProgram) {
        P_MaintenanceProgram = p_MaintenanceProgram;
    }

    public Double getQ_GST_2() {
        return Q_GST_2;
    }

    public void setQ_GST_2(Double q_GST_2) {
        Q_GST_2 = q_GST_2;
    }

    public Double getR_QST_2() {
        return R_QST_2;
    }

    public void setR_QST_2(Double r_QST_2) {
        R_QST_2 = r_QST_2;
    }

    public Double getS_Total_2() {
        return S_Total_2;
    }

    public void setS_Total_2(Double s_Total_2) {
        S_Total_2 = s_Total_2;
    }

    public Double getT_ReplaceInsurance() {
        return T_ReplaceInsurance;
    }

    public void setT_ReplaceInsurance(Double t_ReplaceInsurance) {
        T_ReplaceInsurance = t_ReplaceInsurance;
    }

    public Double getU_Life_DisabilityInsurance() {
        return U_Life_DisabilityInsurance;
    }

    public void setU_Life_DisabilityInsurance(Double u_Life_DisabilityInsurance) {
        U_Life_DisabilityInsurance = u_Life_DisabilityInsurance;
    }

    public Double getV_NinePercentInsuranceTax() {
        return V_NinePercentInsuranceTax;
    }

    public void setV_NinePercentInsuranceTax(Double v_NinePercentInsuranceTax) {
        V_NinePercentInsuranceTax = v_NinePercentInsuranceTax;
    }

    public Double getW_InsuranceTotal() {
        return W_InsuranceTotal;
    }

    public void setW_InsuranceTotal(Double w_InsuranceTotal) {
        W_InsuranceTotal = w_InsuranceTotal;
    }

    public Double getFinancedQSTOrPaidToSAAQ() {
        return FinancedQSTOrPaidToSAAQ;
    }

    public void setFinancedQSTOrPaidToSAAQ(Double financedQSTOrPaidToSAAQ) {
        FinancedQSTOrPaidToSAAQ = financedQSTOrPaidToSAAQ;
    }

    public Double getAdvancePayment() {
        return AdvancePayment;
    }

    public void setAdvancePayment(Double advancePayment) {
        AdvancePayment = advancePayment;
    }

    public Double getFinancedBalanceIncludeQST() {
        return FinancedBalanceIncludeQST;
    }

    public void setFinancedBalanceIncludeQST(Double financedBalanceIncludeQST) {
        FinancedBalanceIncludeQST = financedBalanceIncludeQST;
    }

    public Double getPayableBalanceExcludeQST() {
        return PayableBalanceExcludeQST;
    }

    public void setPayableBalanceExcludeQST(Double payableBalanceExcludeQST) {
        PayableBalanceExcludeQST = payableBalanceExcludeQST;
    }


}
