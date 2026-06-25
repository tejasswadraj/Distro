import { create } from "zustand";
import type {
  DailyServiceSheet, SalesInvoice, CollectionHistory, Customer,
  Expense, Supplier, PurchaseOrder, Employee, AdvanceRecord,
  PayrollRecord, Vehicle, Warehouse, SupplierCreditNote, AttendanceRecord,
  Role, NavTab,
} from "@/types";
import { getSeedSheets, getSeedInvoices, getSeedCollections } from "@/data/mockState";
import { RATES_OVERRIDES, CUSTOMERS, SUPPLIERS } from "@/data/masterData";
import { calculateDailyRow, getSheetNameForDate } from "@/utils/math";

interface ERPState {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;

  sheets: DailyServiceSheet[];
  setSheets: (s: DailyServiceSheet[]) => void;
  invoices: SalesInvoice[];
  setInvoices: (i: SalesInvoice[]) => void;
  collections: CollectionHistory[];
  setCollections: (c: CollectionHistory[]) => void;
  rateExceptions: Record<string, Record<string, number>>;
  setRateExceptions: (r: Record<string, Record<string, number>>) => void;
  customers: Customer[];
  setCustomers: (c: Customer[]) => void;
  expenses: Expense[];
  setExpenses: (e: Expense[]) => void;
  suppliers: Supplier[];
  setSuppliers: (s: Supplier[]) => void;
  purchaseOrders: PurchaseOrder[];
  setPurchaseOrders: (p: PurchaseOrder[]) => void;
  employees: Employee[];
  setEmployees: (e: Employee[]) => void;
  advances: AdvanceRecord[];
  setAdvances: (a: AdvanceRecord[]) => void;
  payrollRecords: PayrollRecord[];
  setPayrollRecords: (p: PayrollRecord[]) => void;
  vehicles: Vehicle[];
  setVehicles: (v: Vehicle[]) => void;
  warehouses: Warehouse[];
  setWarehouses: (w: Warehouse[]) => void;
  supplierCreditNotes: SupplierCreditNote[];
  setSupplierCreditNotes: (s: SupplierCreditNote[]) => void;
  attendanceLog: AttendanceRecord[];
  setAttendanceLog: (a: AttendanceRecord[]) => void;
  activeSheetName: string;
  setActiveSheetName: (n: string) => void;
  currentPhase: number;
  setCurrentPhase: (p: number) => void;
  spreadsheetId: string;
  setSpreadsheetId: (id: string) => void;
  isSyncing: boolean;
  setIsSyncing: (v: boolean) => void;

  activeSheetObj: () => DailyServiceSheet | undefined;
  reconciledSheets: () => DailyServiceSheet[];
  activeDateString: () => string;

  addInvoice: (inv: SalesInvoice) => void;
  updateInvoice: (inv: SalesInvoice) => void;
  addCollection: (billId: number, amount: number, method: "Cash" | "UPI" | "Cheque", notes?: string) => void;
  addExpense: (exp: Expense) => void;
  removeExpense: (id: string) => void;
  addPurchaseOrder: (po: PurchaseOrder) => void;
  updatePurchaseOrder: (po: PurchaseOrder) => void;
  addCustomer: (c: Customer) => void;
  updateCustomer: (c: Customer) => void;
  addSupplier: (s: Supplier) => void;
  updateSheet: (sheet: DailyServiceSheet) => void;
  postPOToDSR: (po: PurchaseOrder, targetDate: string) => void;
  rollover: () => boolean;

  init: () => void;
}

export const useERPStore = create<ERPState>((set, get) => ({
  activeTab: "dashboard",
  setActiveTab: (tab) => set({ activeTab: tab, isMobileMenuOpen: false }),
  activeRole: "Admin",
  setActiveRole: (role) => {
    const tabs = role === "Admin" ? ["dashboard","billing","ar","register-outlet","finance","payroll","procurement","registries","inventory","reconcile","service-report","daily-reports","log-report"] :
                 role === "Warehouse" ? ["inventory","reconcile"] :
                 ["service-report"];
    set({ activeRole: role, activeTab: tabs[0] as NavTab });
  },
  isSidebarCollapsed: false,
  setSidebarCollapsed: (v) => set({ isSidebarCollapsed: v }),
  isMobileMenuOpen: false,
  setMobileMenuOpen: (v) => set({ isMobileMenuOpen: v }),

  sheets: [],
  setSheets: (s) => set({ sheets: s }),
  invoices: [],
  setInvoices: (i) => set({ invoices: i }),
  collections: [],
  setCollections: (c) => set({ collections: c }),
  rateExceptions: {},
  setRateExceptions: (r) => set({ rateExceptions: r }),
  customers: [],
  setCustomers: (c) => set({ customers: c }),
  expenses: [],
  setExpenses: (e) => set({ expenses: e }),
  suppliers: [],
  setSuppliers: (s) => set({ suppliers: s }),
  purchaseOrders: [],
  setPurchaseOrders: (p) => set({ purchaseOrders: p }),
  employees: [],
  setEmployees: (e) => set({ employees: e }),
  advances: [],
  setAdvances: (a) => set({ advances: a }),
  payrollRecords: [],
  setPayrollRecords: (p) => set({ payrollRecords: p }),
  vehicles: [],
  setVehicles: (v) => set({ vehicles: v }),
  warehouses: [],
  setWarehouses: (w) => set({ warehouses: w }),
  supplierCreditNotes: [],
  setSupplierCreditNotes: (s) => set({ supplierCreditNotes: s }),
  attendanceLog: [],
  setAttendanceLog: (a) => set({ attendanceLog: a }),
  activeSheetName: "1406",
  setActiveSheetName: (n) => set({ activeSheetName: n }),
  currentPhase: 2,
  setCurrentPhase: (p) => set({ currentPhase: p }),
  spreadsheetId: "1Bxd_YsnshmYgU9K9V0G_m3g-XG5gq7r_8pWp5Yx3I",
  setSpreadsheetId: (id) => set({ spreadsheetId: id }),
  isSyncing: false,
  setIsSyncing: (v) => set({ isSyncing: v }),

  activeSheetObj: () => {
    const rs = get().reconciledSheets();
    return rs.find(s => s.sheetName === get().activeSheetName) || rs[rs.length - 1];
  },

  reconciledSheets: () => {
    const { sheets, invoices } = get();
    return sheets.map(sheet => ({
      ...sheet,
      rows: sheet.rows.map(row => {
        let sSale = 0, pSale = 0, rSale = 0;
        invoices.forEach(inv => {
          if (inv.Date === sheet.date && inv.Status !== "Cancelled") {
            const count = inv.Items[row.Item_Code] || 0;
            if (inv.Route === "Sinhgad") sSale += count;
            else if (inv.Route === "Purandar") pSale += count;
            else if (inv.Route === "Rajgad") rSale += count;
          }
        });
        return calculateDailyRow({ ...row, Sinhgad_Sale: sSale, Purandar_Sale: pSale, Rajgad_Sale: rSale });
      }),
    }));
  },

  activeDateString: () => {
    const obj = get().activeSheetObj();
    return obj?.date || "2026-06-14";
  },

  addInvoice: (inv) => set(s => ({ invoices: [...s.invoices, inv] })),
  updateInvoice: (inv) => set(s => ({ invoices: s.invoices.map(i => i.BillId === inv.BillId ? inv : i) })),

  addCollection: (billId, amount, method, notes) => {
    const state = get();
    const matchedBill = state.invoices.find(i => i.BillId === billId);
    if (!matchedBill) return;

    const newCol: CollectionHistory = {
      Id: `col_${Date.now()}`,
      Date: state.activeDateString(),
      BillId: billId, CustomerCode: matchedBill.CustomerCode,
      CustomerName: matchedBill.CustomerName,
      AmountCollected: amount, Method: method, Notes: notes || "Reconciliation sweep",
    };

    set(s => ({
      collections: [...s.collections, newCol],
      invoices: s.invoices.map(inv => {
        if (inv.BillId === billId) {
          const remainingCredit = Math.max(0, inv.CreditAmount - amount);
          void(inv.CashReceived + inv.UPIReceived + inv.ChequeReceived + amount);
          let status: "Paid" | "Partial" | "Pending" | "Void" = "Partial";
          if (remainingCredit <= 0) status = "Paid";
          return {
            ...inv,
            CreditAmount: remainingCredit,
            CashReceived: method === "Cash" ? inv.CashReceived + amount : inv.CashReceived,
            UPIReceived: method === "UPI" ? inv.UPIReceived + amount : inv.UPIReceived,
            ChequeReceived: method === "Cheque" ? inv.ChequeReceived + amount : inv.ChequeReceived,
            PaymentStatus: status,
          };
        }
        return inv;
      }),
    }));
  },

  addExpense: (exp) => set(s => ({ expenses: [...s.expenses, exp] })),
  removeExpense: (id) => set(s => ({ expenses: s.expenses.filter(e => e.Id !== id) })),

  addPurchaseOrder: (po) => set(s => ({ purchaseOrders: [...s.purchaseOrders, po] })),
  updatePurchaseOrder: (po) => set(s => ({ purchaseOrders: s.purchaseOrders.map(p => p.PO_Number === po.PO_Number ? po : p) })),

  addCustomer: (c) => set(s => ({ customers: [...s.customers, c] })),
  updateCustomer: (c) => set(s => ({ customers: s.customers.map(x => x.Customer_Code === c.Customer_Code ? c : x) })),
  addSupplier: (s) => set(st => ({ suppliers: [...st.suppliers, s] })),

  updateSheet: (sheet) => set(s => ({
    sheets: s.sheets.map(sh => sh.sheetName === sheet.sheetName ? sheet : sh),
  })),

  postPOToDSR: (po, targetDate) => set(s => ({
    sheets: s.sheets.map(sheet => {
      if (sheet.date !== targetDate) return sheet;
      return {
        ...sheet,
        rows: sheet.rows.map(row => {
          const poMatch = po.Items.find(item => item.Item_Code === row.Item_Code);
          if (!poMatch) return row;
          return calculateDailyRow({ ...row, Primary: (row.Primary || 0) + poMatch.Quantity_Cases });
        }),
      };
    }),
  })),

  rollover: () => {
    const state = get();
    const activeSheet = state.activeSheetObj();
    if (!activeSheet) return false;

    const currentD = new Date(activeSheet.date);
    const nextD = new Date(currentD);
    nextD.setDate(currentD.getDate() + 1);
    const nextDateStr = `${nextD.getFullYear()}-${String(nextD.getMonth() + 1).padStart(2, "0")}-${String(nextD.getDate()).padStart(2, "0")}`;
    const nextSheetName = getSheetNameForDate(nextDateStr);

    if (state.sheets.some(s => s.sheetName === nextSheetName)) return false;

    const nextRows = activeSheet.rows.map(lastRow => calculateDailyRow({
      Brand: lastRow.Brand, Net_Qty: lastRow.Net_Qty, Case_Pack: lastRow.Case_Pack, Item_Code: lastRow.Item_Code,
      System: lastRow.Total_Closing, Open: lastRow.Total_Closing, Vehicle_Open: lastRow.Total_Load_In, Primary: 0, Counter_Sale: 0,
      Sinhgad_Open: lastRow.Sinhgad_Load_In, Sinhgad_Load1: 0, Sinhgad_Load2: 0, Sinhgad_Sale: 0, Sinhgad_Load_In: 0,
      Purandar_Open: lastRow.Purandar_Load_In, Purandar_Load1: 0, Purandar_Load2: 0, Purandar_Sale: 0, Purandar_Load_In: 0,
      Rajgad_Open: lastRow.Rajgad_Load_In, Rajgad_Load1: 0, Rajgad_Load2: 0, Rajgad_Sale: 0, Rajgad_Load_In: 0,
    }));

    set(s => ({
      sheets: [...s.sheets, { date: nextDateStr, sheetName: nextSheetName, rows: nextRows }],
      activeSheetName: nextSheetName,
    }));
    return true;
  },

  init: () => {
    const rateMap: Record<string, Record<string, number>> = {};
    RATES_OVERRIDES.forEach(r => { rateMap[r.CustomerCode] = r.PricingOverrides; });

    set({
      sheets: getSeedSheets(),
      invoices: getSeedInvoices(),
      collections: getSeedCollections(),
      rateExceptions: rateMap,
      customers: [...CUSTOMERS],
      suppliers: [...SUPPLIERS],
      expenses: [
        { Id: "exp_1", Date: "2026-06-12", Category: "Fixed Warehouse Rent", Amount: 18000, Description: "Monthly warehouse lease", VehicleOrLocation: "Counter/Warehouse" },
        { Id: "exp_2", Date: "2026-06-13", Category: "Employee Wages", Amount: 2400, Description: "Daily wage distribution", EmployeeName: "Ramesh Shinde" },
        { Id: "exp_3", Date: "2026-06-14", Category: "Vehicle Fuel", Amount: 1650, Description: "Sinhgad vehicle diesel refill", VehicleOrLocation: "Sinhgad Vehicle" },
        { Id: "exp_4", Date: "2026-06-14", Category: "Cost of Electricity", Amount: 4200, Description: "Warehouse electricity bill", VehicleOrLocation: "Counter/Warehouse" },
        { Id: "exp_5", Date: "2026-06-14", Category: "Advance Taken", Amount: 3500, Description: "Salary advance - family emergency", EmployeeName: "Amit K." },
      ],
      purchaseOrders: [
        {
          PO_Number: "PO-2026-0001", Date: "2026-06-13", Supplier_Code: "SUP001", Supplier_Name: "Parle Agro Pvt Ltd",
          Items: [
            { Item_Code: "PTFR-0330-24-40", Item_Name: "FROOTI PET 330ML", Brand: "Frooti", Case_Pack: 24, Quantity_Cases: 40, Purchase_Rate: 310, Total_Before_Tax: 12400, GST_Percent: 12, GST_Amount: 1488, Total_Amount: 13888 },
            { Item_Code: "PTSM-0250-24-15", Item_Name: "SMOODH CHOCO 250ML", Brand: "Smoodh", Case_Pack: 24, Quantity_Cases: 30, Purchase_Rate: 235, Total_Before_Tax: 7050, GST_Percent: 12, GST_Amount: 846, Total_Amount: 7896 },
          ],
          Total_Before_Tax: 19450, Total_GST: 2334, Grand_Total: 21784, Status: "Draft", Expected_Delivery: "2026-06-15", Notes: "Initial warehouse stock replenish",
        },
      ],
      employees: [
        { Id: "emp_1", Name: "Ramesh Shinde", Role: "Driver (Sinhgad)", Department: "Logistics", JoiningDate: "2024-01-10", StandardDailyWage: 800, Status: "Active" },
        { Id: "emp_2", Name: "Sunil Patil", Role: "Driver (Rajgad)", Department: "Logistics", JoiningDate: "2024-02-15", StandardDailyWage: 800, Status: "Active" },
        { Id: "emp_3", Name: "Sachin Yadav", Role: "Driver (Purandar)", Department: "Logistics", JoiningDate: "2024-03-20", StandardDailyWage: 800, Status: "Active" },
        { Id: "emp_4", Name: "Ramesh Patil", Role: "Warehouse Handler", Department: "Warehouse", JoiningDate: "2024-01-05", StandardDailyWage: 600, Status: "Active" },
        { Id: "emp_5", Name: "Amit K.", Role: "Admin Clerk", Department: "Admin", JoiningDate: "2024-05-12", StandardDailyWage: 700, Status: "Active" },
      ],
      advances: [{ Id: "adv_1", EmployeeId: "emp_5", Date: "2026-06-14", Amount: 3500, Reason: "Family emergency", Status: "Pending" }],
      payrollRecords: [],
      vehicles: [
        { Id: "veh_1", Name: "Sinhgad", RegistrationNumber: "MH-14-GX-1102", PrimaryDriverId: "emp_1", PrimarySalespersonId: "emp_1", LoadCapacityCases: 150, Status: "At-warehouse" },
        { Id: "veh_2", Name: "Rajgad", RegistrationNumber: "MH-14-GX-8840", PrimaryDriverId: "emp_2", PrimarySalespersonId: "emp_2", LoadCapacityCases: 180, Status: "At-warehouse" },
        { Id: "veh_3", Name: "Purandar", RegistrationNumber: "MH-14-GX-5519", PrimaryDriverId: "emp_3", PrimarySalespersonId: "emp_3", LoadCapacityCases: 150, Status: "At-warehouse" },
      ],
      warehouses: [
        { Id: "wh_1", Name: "Main Godown", Location: "Gate No. 4, PCNTDA, Pune", AssignedStaffIds: ["emp_4"], CapacityCases: 5000, Status: "Active" },
        { Id: "wh_2", Name: "Depot 2", Location: "Moshi Toll Plaza, Pune", AssignedStaffIds: [], CapacityCases: 2500, Status: "Active" },
      ],
      supplierCreditNotes: [
        { Id: "SCN-0001", SupplierCode: "SUP001", SupplierName: "Parle Agro Pvt Ltd", Date: "2026-06-12", ProductsReturned: [{ ItemCode: "PTFR-0065-72-05", ItemName: "FROOTI PET 65ML", QuantityCases: 10, Reason: "Expired" }], CreditAmount: 3100, Notes: "Expired bottles return", Status: "Applied" },
      ],
      attendanceLog: [
        { name: "Ramesh Shinde", role: "Driver (Sinhgad)", date: "2026-06-14", status: "Present", hours: 12, notes: "Standard routes completed" },
        { name: "Sunil Patil", role: "Driver (Rajgad)", date: "2026-06-14", status: "Present", hours: 12, notes: "Morning loading shift" },
        { name: "Sachin Yadav", role: "Driver (Purandar)", date: "2026-06-14", status: "Present", hours: 12, notes: "Cleared water crates" },
        { name: "Ramesh Patil", role: "Warehouse Handler", date: "2026-06-14", status: "Present", hours: 8, notes: "Organized fresh stock" },
        { name: "Amit K.", role: "Admin Clerk", date: "2026-06-14", status: "Present", hours: 8, notes: "Updated ledger" },
        { name: "Ramesh Shinde", role: "Driver (Sinhgad)", date: "2026-06-13", status: "Present", hours: 11, notes: "Standard routes" },
        { name: "Sunil Patil", role: "Driver (Rajgad)", date: "2026-06-13", status: "Present", hours: 12, notes: "Loading shift" },
        { name: "Sachin Yadav", role: "Driver (Purandar)", date: "2026-06-13", status: "Present", hours: 12, notes: "Water crates" },
        { name: "Ramesh Patil", role: "Warehouse Handler", date: "2026-06-13", status: "Half-Day", hours: 4, notes: "Dentist leave" },
        { name: "Amit K.", role: "Admin Clerk", date: "2026-06-13", status: "Present", hours: 8, notes: "Ledger update" },
      ],
    });
  },
}));
