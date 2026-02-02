package ProjectContext.BusinessObject.Pdf;

import ProjectContext.BusinessObject.Dealer.QuoteClient;
import ProjectContext.BusinessObject.Dealer.QuoteExchangeVehicle;
import ProjectContext.BusinessObject.Dealer.QuoteSaleContract;
import ProjectContext.BusinessObject.Dealer.QuoteVehicle;
import ProjectContext.BusinessObject.Dealer.QuoteWarranty;

public class pdfFactory {


    public SaleContractPdf createSaleContractPdf(QuoteSaleContract input_SaleContract,
                                                 QuoteVehicle input_QuoteVehicle,
                                                 QuoteExchangeVehicle input_QuoteExchangeVehicle,
                                                 QuoteWarranty input_QuoteWarranty,
                                                 QuoteClient quoteClient) {
        SaleContractPdf saleContractPdf = new SaleContractPdf();

        saleContractPdf.setA_vehiclePrice(Double.parseDouble(input_QuoteVehicle.getPrice()));
        saleContractPdf.setB_DiscountIfApplicable(
            Double.parseDouble(input_SaleContract.getDiscountAmount()));

        saleContractPdf.setC_NetSubTotal(saleContractPdf.getA_vehiclePrice() + saleContractPdf.getB_DiscountIfApplicable());

        saleContractPdf.setD_Exchange(Double.parseDouble(input_QuoteExchangeVehicle.getValueAmount()));
        saleContractPdf.setE_SubTotalWithExchange(saleContractPdf.getC_NetSubTotal() + saleContractPdf.getD_Exchange());
        if(!quoteClient.getIndianStatusCertificate().isEmpty()) {
            saleContractPdf.setF_GST(0.00);
        } else {
            saleContractPdf.setF_GST(saleContractPdf.getE_SubTotalWithExchange() * 0.05);
        }
        saleContractPdf.setG_SubTotalBeforeQST(saleContractPdf.getE_SubTotalWithExchange() + saleContractPdf.getF_GST());

        saleContractPdf.setH_MarketValue(Double.parseDouble(input_SaleContract.getVehicleMarketValue()));

        if(!quoteClient.getIndianStatusCertificate().isEmpty()) {
            saleContractPdf.setI_QST(0.00);
        } else {
            saleContractPdf.setI_QST(saleContractPdf.getE_SubTotalWithExchange() * 0.09975);
        }

        saleContractPdf.setJ_SubTotal(saleContractPdf.getG_SubTotalBeforeQST() + saleContractPdf.getI_QST());
//        saleContractPdf.setJ_SubTotal(saleContractPdf.getG_SubTotalBeforeQST() + saleContractPdf.getH_MarketValue() + saleContractPdf.getI_QST());

        saleContractPdf.setK_BalanceDueOnExchangeVehicle(Double.parseDouble(input_QuoteExchangeVehicle.getBalanceAmount()));

        saleContractPdf.setL_Total(saleContractPdf.getJ_SubTotal() + saleContractPdf.getK_BalanceDueOnExchangeVehicle());

        saleContractPdf.setZ1_Transit(Double.parseDouble(input_SaleContract.getTransitAmount()));
        saleContractPdf.setZ2_RDPRM(Double.parseDouble(input_SaleContract.getRDPRMAmount()));

        saleContractPdf.setSOLDE_TOTAL(saleContractPdf.getL_Total() + saleContractPdf.getZ1_Transit() + saleContractPdf.getZ2_RDPRM());
        saleContractPdf.setM_ExtendedWarranty(Double.parseDouble(input_QuoteWarranty.getSalePrice()));
        saleContractPdf.setM_ExtendedWarrantyID(input_QuoteWarranty.getWarrantyID());

        saleContractPdf.setN_ACC(Double.parseDouble(input_SaleContract.getAccessoriesAmount()));
        saleContractPdf.setN_ACCNumber(input_SaleContract.getAccessories());

        saleContractPdf.setO_NewTiresSpecificDuty(Double.parseDouble(input_SaleContract.getNewTiresDutyAmount()));
        saleContractPdf.setP_MaintenanceProgram(Double.parseDouble(input_SaleContract.getMaintenanceScheduleAmount()));

        if(!quoteClient.getIndianStatusCertificate().isEmpty()) {
            saleContractPdf.setQ_GST_2(0.00);
            saleContractPdf.setR_QST_2(0.00);
        } else {
            saleContractPdf.setQ_GST_2((saleContractPdf.getM_ExtendedWarranty() + saleContractPdf.getN_ACC() + saleContractPdf.getO_NewTiresSpecificDuty()+saleContractPdf.getP_MaintenanceProgram()) * 0.05);
            saleContractPdf.setR_QST_2((saleContractPdf.getM_ExtendedWarranty() + saleContractPdf.getN_ACC() + saleContractPdf.getO_NewTiresSpecificDuty()+saleContractPdf.getP_MaintenanceProgram()) * 0.09975);
        }

        saleContractPdf.setS_Total_2(saleContractPdf.getM_ExtendedWarranty() + saleContractPdf.getN_ACC() +  saleContractPdf.getO_NewTiresSpecificDuty() + saleContractPdf.getP_MaintenanceProgram() + saleContractPdf.getQ_GST_2() + saleContractPdf.getR_QST_2());

        saleContractPdf.setT_ReplaceInsurance(Double.parseDouble(input_SaleContract.getReplacementInsuranceAmount()));
        saleContractPdf.setT_ReplaceInsuranceNumber(input_SaleContract.getReplacementInsuranceContractNumber());

        saleContractPdf.setU_Life_DisabilityInsurance(Double.parseDouble(input_SaleContract.getLoanInsuranceAmount()));
        saleContractPdf.setU_Life_DisabilityInsuranceNumber(input_SaleContract.getLoanInsuranceContractNumber());

        if(!quoteClient.getIndianStatusCertificate().isEmpty()) {
            saleContractPdf.setV_NinePercentInsuranceTax(0.00);
        } else {
            saleContractPdf.setV_NinePercentInsuranceTax((saleContractPdf.getT_ReplaceInsurance() * 0.09) + (saleContractPdf.getU_Life_DisabilityInsurance() * 0.09));
        }

        saleContractPdf.setW_InsuranceTotal(saleContractPdf.getT_ReplaceInsurance()+saleContractPdf.getU_Life_DisabilityInsurance() + saleContractPdf.getV_NinePercentInsuranceTax());

        saleContractPdf.setFinancedQSTOrPaidToSAAQ(saleContractPdf.getI_QST());
        saleContractPdf.setAdvancePayment(Double.parseDouble(input_SaleContract.getDepositAmount()));
        saleContractPdf.setFinancedBalanceIncludeQST(saleContractPdf.getSOLDE_TOTAL() + saleContractPdf.getS_Total_2() + saleContractPdf.getW_InsuranceTotal() - saleContractPdf.getAdvancePayment());
        saleContractPdf.setPayableBalanceExcludeQST(saleContractPdf.getFinancedBalanceIncludeQST() - saleContractPdf.getFinancedQSTOrPaidToSAAQ());

        saleContractPdf.setOtherClause(input_SaleContract.getOtherClause());

        return saleContractPdf;
    }
}