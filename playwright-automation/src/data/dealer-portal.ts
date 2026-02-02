/**
 * Dealer Portal Data Models
 * Converted from JAXB-generated Java classes
 */

// Quote Client Information
export interface QuoteClient {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  driverLicense?: string;
}

// Vehicle Information
export interface VehicleInfo {
  id?: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  bodyType?: string;
  color?: string;
  mileage?: number;
  transmission?: string;
  engine?: string;
  price?: number;
  purchaseDate?: Date;
  registrationNumber?: string;
}

// Quote Vehicle
export interface QuoteVehicle {
  id?: string;
  vehicleInfo: VehicleInfo;
  tradeInValue?: number;
  downPayment?: number;
  loanAmount?: number;
}

export interface QuoteExchangeVehicle extends QuoteVehicle {
  exchangeValue?: number;
  exchangeCondition?: string;
}

// Warranty Information
export interface QuoteWarranty {
  id?: string;
  programName: string;
  selectedTerm?: string;
  selectedOptions?: string[];
  totalPrice: number;
  startDate?: Date;
  endDate?: Date;
  coverageDetails?: string;
}

// Financing Information
export interface QuoteFinancing {
  id?: string;
  financingType: string; // CASH, LOAN, LEASE
  loanAmount?: number;
  downPayment?: number;
  interestRate?: number;
  termMonths?: number;
  monthlyPayment?: number;
  financingCompany?: string;
  loanNumber?: string;
}

// Quote Sale Information
export interface QuoteSale {
  id?: string;
  salePrice: number;
  saleDate: Date;
  salesman?: string;
  dealershipName?: string;
  notes?: string;
}

export interface QuoteSaleContract {
  id?: string;
  contractNumber: string;
  contractDate: Date;
  documentPath?: string;
  signedDate?: Date;
  signedBy?: string;
}

// Invoice Information
export interface InvoiceInfo {
  id?: string;
  invoiceNumber: string;
  invoiceDate: Date;
  amount: number;
  status?: string; // DRAFT, FINALIZED, PAID, CANCELLED
  paidDate?: Date;
  paymentMethod?: string;
  notes?: string;
}

// Extra Components
export interface ExtraComponents {
  id?: string;
  componentName: string;
  price: number;
  description?: string;
  quantity?: number;
}

// Main Quote Information
export interface QuoteInfo {
  id?: string;
  quoteNumber?: string;
  quoteDate: Date;
  expiryDate?: Date;
  quoteClient: QuoteClient;
  quoteVehicle: QuoteVehicle;
  quoteWarranty: QuoteWarranty;
  quoteFinancing: QuoteFinancing;
  quoteSale: QuoteSale;
  quoteSaleContract?: QuoteSaleContract;
  invoiceInfo?: InvoiceInfo;
  extraComponents?: ExtraComponents[];
  totalAmount?: number;
  status?: string; // DRAFT, PENDING, APPROVED, COMPLETED, CANCELLED
  notes?: string;
}

// Dealer Portal Root
export interface DealerPortal {
  quotes?: QuoteInfo[];
  inventory?: VehicleInfo[];
  url?: string;
  username?: string;
  password?: string;
}
