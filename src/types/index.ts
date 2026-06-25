export type Role = "Admin" | "Warehouse" | "Logistics";

export interface Product {
  Item_Code: string;
  Item_Name: string;
  Brand: string;
  Packaging_Type: string;
  Volume_ml: number;
  Case_Pack: number;
  MRP: number;
  GST_Percent: number;
  HSN_Code: string;
  Supplier_Code: string;
  Sale_Rate_Wholesale?: number;
  Sale_Rate_Retail?: number;
  Purchase_Rate?: number;
  Offer_Buy_Qty?: number;
  Offer_Free_Qty?: number;
  Offer_Active?: boolean;
}

export interface Customer {
  Customer_Code: string;
  Customer_Name: string;
  Beat: string;
  Contact?: string;
  Geolocated_Code?: string;
  Credit_Limit?: number;
  Secondary_Phone?: string;
  Postal_Address?: string;
  Outlet_Photo?: string;
  GST_Number?: string;
  FSSAI_Number?: string;
  Shopact_Uddyam?: string;
}

export interface Expense {
  Id: string;
  Date: string;
  Category:
    | "Fixed Warehouse Rent"
    | "Employee Wages"
    | "Cost of Electricity"
    | "Vehicle Maintenance"
    | "Vehicle Fuel"
    | "Advance Taken"
    | "Other Expenses"
    | "Warehouse Rent"
    | "Vehicle Fuel & Maintenance"
    | "Extra Expense";
  Amount: number;
  Description: string;
  VehicleOrLocation?: "Counter/Warehouse" | "Sinhgad Vehicle" | "Purandar Vehicle" | "Rajgad Vehicle" | "None";
  EmployeeName?: string;
}

export interface Supplier {
  Supplier_Code: string;
  Supplier_Name: string;
  Lead_Times: string;
  Contact?: string;
  Email?: string;
  Address?: string;
}

export interface PurchaseOrderItem {
  Item_Code: string;
  Item_Name: string;
  Brand: string;
  Case_Pack: number;
  Quantity_Cases: number;
  Purchase_Rate: number;
  Total_Before_Tax: number;
  GST_Percent: number;
  GST_Amount: number;
  Total_Amount: number;
}

export interface PurchaseOrder {
  PO_Number: string;
  Date: string;
  Supplier_Code: string;
  Supplier_Name: string;
  Items: PurchaseOrderItem[];
  Total_Before_Tax: number;
  Total_GST: number;
  Grand_Total: number;
  Status: "Draft" | "Sent" | "Received" | "Cancelled";
  Expected_Delivery: string;
  Notes?: string;
  Sync_To_DSR?: boolean;
  Synced_Sheet_Date?: string;
}

export interface DailyServiceRow {
  Brand: string;
  Net_Qty: string;
  Case_Pack: number;
  Item_Code: string;
  System: number;
  Open: number;
  Vehicle_Open: number;
  Primary: number;
  Total_Open: number;
  Total_Load_Out: number;
  Total_Load_In: number;
  Total_Closing: number;
  Total_Sale: number;
  Counter_Sale: number;
  Sinhgad_Open: number;
  Sinhgad_Load1: number;
  Sinhgad_Load2: number;
  Sinhgad_Sale: number;
  Sinhgad_Load_In: number;
  Purandar_Open: number;
  Purandar_Load1: number;
  Purandar_Load2: number;
  Purandar_Sale: number;
  Purandar_Load_In: number;
  Rajgad_Open: number;
  Rajgad_Load1: number;
  Rajgad_Load2: number;
  Rajgad_Sale: number;
  Rajgad_Load_In: number;
}

export interface DailyServiceSheet {
  date: string;
  sheetName: string;
  rows: DailyServiceRow[];
}

export interface SalesInvoice {
  BillId: number;
  Date: string;
  CustomerCode: string;
  CustomerName: string;
  Route: "Sinhgad" | "Purandar" | "Rajgad" | "Counter";
  Items: Record<string, number>;
  UnitPrices: Record<string, number>;
  TotalAmount: number;
  CashReceived: number;
  UPIReceived: number;
  ChequeReceived: number;
  CreditAmount: number;
  PaymentStatus: "Paid" | "Partial" | "Pending" | "Void";
  AuditStatus: "OK" | "⚠️ BALANCE ERROR";
  Time?: string;
  Status?: "Cancelled" | "Outlet Closed" | "Order Revised" | "Delivered";
}

export interface RatesOverride {
  CustomerCode: string;
  PricingOverrides: Record<string, number>;
}

export interface ArRecord {
  InvoiceDate: string;
  BillId: number;
  CustomerCode: string;
  CustomerName: string;
  OriginalValue: number;
  CreditBalance: number;
  PaymentCollected: number;
  AgingDays: number;
  Status: "Fully Reconciled" | "High Credit Risk" | "Over Credit Limit" | "Active Credit";
}

export interface CollectionHistory {
  Id: string;
  Date: string;
  BillId: number;
  CustomerCode: string;
  CustomerName: string;
  AmountCollected: number;
  Method: "Cash" | "UPI" | "Cheque";
  Notes?: string;
}

export interface Employee {
  Id: string;
  Name: string;
  Role: string;
  Phone?: string;
  Department: "Logistics" | "Sales" | "Warehouse" | "Admin";
  JoiningDate: string;
  StandardDailyWage: number;
  BankName?: string;
  AccountNumber?: string;
  IFSC?: string;
  AadharNumber?: string;
  PFNumber?: string;
  Status: "Active" | "Inactive" | "Resigned";
}

export interface AdvanceRecord {
  Id: string;
  EmployeeId: string;
  Date: string;
  Amount: number;
  Reason: string;
  Status: "Pending" | "Deducted" | "Waived";
  DeductedInPayrollId?: string;
}

export interface PayrollRecord {
  Id: string;
  EmployeeId: string;
  Month: string;
  Year: number;
  TotalPresentDays: number;
  TotalHalfDays: number;
  GrossWages: number;
  TotalAdvancesDeducted: number;
  NetPayout: number;
  PaymentStatus: "Draft" | "Processed" | "Paid" | "Hold";
  PaymentDate?: string;
  PaymentMethod?: "Cash" | "Bank Transfer" | "UPI";
}

export interface Vehicle {
  Id: string;
  Name: string;
  RegistrationNumber: string;
  PrimaryDriverId: string;
  PrimarySalespersonId: string;
  LoadCapacityCases: number;
  Status: "Active" | "In-field" | "At-warehouse" | "Breakdown";
}

export interface Warehouse {
  Id: string;
  Name: string;
  Location: string;
  AssignedStaffIds: string[];
  CapacityCases: number;
  Status: "Active" | "Maintenance" | "Inactive";
}

export interface SupplierCreditNote {
  Id: string;
  SupplierCode: string;
  SupplierName: string;
  Date: string;
  ProductsReturned: {
    ItemCode: string;
    ItemName: string;
    QuantityCases: number;
    Reason: "Expired" | "Damaged" | "Excess Supply";
  }[];
  CreditAmount: number;
  Notes?: string;
  Status: "Pending" | "Applied" | "Settled";
}

export interface AttendanceRecord {
  name: string;
  role: string;
  date: string;
  status: "Present" | "Absent" | "Half-Day";
  hours: number;
  notes: string;
}

export type NavTab =
  | "dashboard"
  | "billing"
  | "ar"
  | "register-outlet"
  | "finance"
  | "payroll"
  | "procurement"
  | "registries"
  | "inventory"
  | "reconcile"
  | "service-report"
  | "daily-reports"
  | "log-report";

export const ADMIN_TABS: NavTab[] = [
  "dashboard",
  "billing",
  "ar",
  "register-outlet",
  "finance",
  "payroll",
  "procurement",
  "registries",
  "inventory",
  "reconcile",
  "service-report",
  "daily-reports",
  "log-report",
];

export const WAREHOUSE_TABS: NavTab[] = ["inventory", "reconcile"];
export const LOGISTICS_TABS: NavTab[] = ["service-report"];

export const TAB_LABELS: Record<NavTab, string> = {
  dashboard: "Dashboard",
  billing: "Sales Billing",
  ar: "Ledger & Outstanding",
  "register-outlet": "Outlet Master",
  finance: "Cash & Finance",
  payroll: "Staff & Payroll",
  procurement: "Supplier Purchase",
  registries: "Master Registries",
  inventory: "Stock Holding",
  reconcile: "Stock Reconciliation",
  "service-report": "Vehicle Dispatch",
  "daily-reports": "Daily Sales Sheets",
  "log-report": "Operational Log",
};
