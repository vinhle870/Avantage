export class NewQuotePageLocators {

        readonly txtEmail:string ='#quote_client_email';
        readonly txtFirstName = '#quote_client_firstName';
        readonly txtLastName = '#quote_client_lastName';
        readonly txtSecondaryOwnerOrCompany = page.locator('#quote_client_company');
        readonly txtDistributorName = page.locator('#quote_client_distributorName');
        readonly txtAddress = page.locator('#quote_client_address');
        readonly txtAddress2 = page.locator('#quote_client_address2');
        readonly txtCity = page.locator('#quote_client_city');
        readonly dpdProvince = page.locator("//div[*[@for='quote_client_province']]/div");
        readonly txtPostalCode = page.locator('#quote_client_postalCode');
        readonly txtTelHome = page.locator('#quote_client_telHome');
        readonly txtTelWork = page.locator('#quote_client_telWork');
        readonly txtIndianStatusCertificate = page.locator('#quote_client_indianStatusCertificate');
        readonly txtDriversLicense = page.locator('#quote_client_driversLicense');
        readonly chkAgreePolicy = page.locator('#quote_client_isAgreePolicy');
        readonly btnSave = page.locator('[type="submit"]');
}