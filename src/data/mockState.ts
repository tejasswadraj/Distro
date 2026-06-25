import type { DailyServiceSheet, DailyServiceRow, SalesInvoice, CollectionHistory } from "@/types";
import { calculateDailyRow } from "@/utils/math";

function buildRow(partial: Omit<DailyServiceRow, "Total_Open" | "Total_Load_Out" | "Total_Load_In" | "Total_Closing" | "Total_Sale">): DailyServiceRow {
  return calculateDailyRow(partial);
}

const PRODUCT_ROWS: Omit<DailyServiceRow, "Total_Open" | "Total_Load_Out" | "Total_Load_In" | "Total_Closing" | "Total_Sale">[] = [
  { Brand: "Frooti", Net_Qty: "65ml x 72", Case_Pack: 72, Item_Code: "PTFR-0065-72-05", System: 120, Open: 120, Vehicle_Open: 45, Primary: 0, Counter_Sale: 8, Sinhgad_Open: 15, Sinhgad_Load1: 20, Sinhgad_Load2: 5, Sinhgad_Sale: 18, Sinhgad_Load_In: 0, Purandar_Open: 18, Purandar_Load1: 15, Purandar_Load2: 0, Purandar_Sale: 12, Purandar_Load_In: 0, Rajgad_Open: 12, Rajgad_Load1: 10, Rajgad_Load2: 0, Rajgad_Sale: 8, Rajgad_Load_In: 0 },
  { Brand: "Frooti", Net_Qty: "125ml x 48", Case_Pack: 48, Item_Code: "PTFR-0125-48-10", System: 85, Open: 85, Vehicle_Open: 32, Primary: 0, Counter_Sale: 5, Sinhgad_Open: 10, Sinhgad_Load1: 14, Sinhgad_Load2: 4, Sinhgad_Sale: 12, Sinhgad_Load_In: 0, Purandar_Open: 12, Purandar_Load1: 10, Purandar_Load2: 0, Purandar_Sale: 8, Purandar_Load_In: 0, Rajgad_Open: 10, Rajgad_Load1: 8, Rajgad_Load2: 0, Rajgad_Sale: 6, Rajgad_Load_In: 0 },
  { Brand: "Frooti", Net_Qty: "200ml x 24", Case_Pack: 24, Item_Code: "PTFR-0200-24-20", System: 60, Open: 60, Vehicle_Open: 22, Primary: 0, Counter_Sale: 3, Sinhgad_Open: 8, Sinhgad_Load1: 10, Sinhgad_Load2: 3, Sinhgad_Sale: 8, Sinhgad_Load_In: 0, Purandar_Open: 8, Purandar_Load1: 6, Purandar_Load2: 0, Purandar_Sale: 5, Purandar_Load_In: 0, Rajgad_Open: 6, Rajgad_Load1: 6, Rajgad_Load2: 0, Rajgad_Sale: 4, Rajgad_Load_In: 0 },
  { Brand: "Frooti", Net_Qty: "330ml x 24", Case_Pack: 24, Item_Code: "PTFR-0330-24-40", System: 95, Open: 95, Vehicle_Open: 38, Primary: 0, Counter_Sale: 6, Sinhgad_Open: 14, Sinhgad_Load1: 16, Sinhgad_Load2: 5, Sinhgad_Sale: 14, Sinhgad_Load_In: 0, Purandar_Open: 14, Purandar_Load1: 12, Purandar_Load2: 0, Purandar_Sale: 10, Purandar_Load_In: 0, Rajgad_Open: 10, Rajgad_Load1: 10, Rajgad_Load2: 0, Rajgad_Sale: 7, Rajgad_Load_In: 0 },
  { Brand: "Frooti", Net_Qty: "600ml x 12", Case_Pack: 12, Item_Code: "PTFR-0600-12-70", System: 42, Open: 42, Vehicle_Open: 18, Primary: 0, Counter_Sale: 2, Sinhgad_Open: 6, Sinhgad_Load1: 8, Sinhgad_Load2: 3, Sinhgad_Sale: 7, Sinhgad_Load_In: 0, Purandar_Open: 6, Purandar_Load1: 5, Purandar_Load2: 0, Purandar_Sale: 4, Purandar_Load_In: 0, Rajgad_Open: 6, Rajgad_Load1: 5, Rajgad_Load2: 0, Rajgad_Sale: 3, Rajgad_Load_In: 0 },
  { Brand: "Frooti", Net_Qty: "1.25L x 6", Case_Pack: 6, Item_Code: "PTFR-1250-6-130", System: 30, Open: 30, Vehicle_Open: 12, Primary: 0, Counter_Sale: 1, Sinhgad_Open: 4, Sinhgad_Load1: 6, Sinhgad_Load2: 2, Sinhgad_Sale: 5, Sinhgad_Load_In: 0, Purandar_Open: 4, Purandar_Load1: 3, Purandar_Load2: 0, Purandar_Sale: 2, Purandar_Load_In: 0, Rajgad_Open: 4, Rajgad_Load1: 3, Rajgad_Load2: 0, Rajgad_Sale: 3, Rajgad_Load_In: 0 },
  { Brand: "Frooti", Net_Qty: "2L x 6", Case_Pack: 6, Item_Code: "PTFR-2000-6-180", System: 22, Open: 22, Vehicle_Open: 8, Primary: 0, Counter_Sale: 1, Sinhgad_Open: 3, Sinhgad_Load1: 4, Sinhgad_Load2: 1, Sinhgad_Sale: 3, Sinhgad_Load_In: 0, Purandar_Open: 3, Purandar_Load1: 2, Purandar_Load2: 0, Purandar_Sale: 2, Purandar_Load_In: 0, Rajgad_Open: 2, Rajgad_Load1: 2, Rajgad_Load2: 0, Rajgad_Sale: 1, Rajgad_Load_In: 0 },
  { Brand: "Appy Fizz", Net_Qty: "125ml x 48", Case_Pack: 48, Item_Code: "PTAP-0125-48-10", System: 78, Open: 78, Vehicle_Open: 30, Primary: 0, Counter_Sale: 4, Sinhgad_Open: 10, Sinhgad_Load1: 12, Sinhgad_Load2: 4, Sinhgad_Sale: 10, Sinhgad_Load_In: 0, Purandar_Open: 10, Purandar_Load1: 8, Purandar_Load2: 0, Purandar_Sale: 7, Purandar_Load_In: 0, Rajgad_Open: 10, Rajgad_Load1: 8, Rajgad_Load2: 0, Rajgad_Sale: 6, Rajgad_Load_In: 0 },
  { Brand: "Appy Fizz", Net_Qty: "250ml x 24", Case_Pack: 24, Item_Code: "PTAP-0250-24-20", System: 55, Open: 55, Vehicle_Open: 20, Primary: 0, Counter_Sale: 3, Sinhgad_Open: 7, Sinhgad_Load1: 9, Sinhgad_Load2: 3, Sinhgad_Sale: 7, Sinhgad_Load_In: 0, Purandar_Open: 7, Purandar_Load1: 6, Purandar_Load2: 0, Purandar_Sale: 5, Purandar_Load_In: 0, Rajgad_Open: 6, Rajgad_Load1: 5, Rajgad_Load2: 0, Rajgad_Sale: 4, Rajgad_Load_In: 0 },
  { Brand: "Appy Fizz", Net_Qty: "600ml x 12", Case_Pack: 12, Item_Code: "PTAP-0600-12-55", System: 35, Open: 35, Vehicle_Open: 14, Primary: 0, Counter_Sale: 2, Sinhgad_Open: 5, Sinhgad_Load1: 6, Sinhgad_Load2: 2, Sinhgad_Sale: 5, Sinhgad_Load_In: 0, Purandar_Open: 5, Purandar_Load1: 4, Purandar_Load2: 0, Purandar_Sale: 3, Purandar_Load_In: 0, Rajgad_Open: 4, Rajgad_Load1: 4, Rajgad_Load2: 0, Rajgad_Sale: 3, Rajgad_Load_In: 0 },
  { Brand: "Appy Fizz", Net_Qty: "1.25L x 6", Case_Pack: 6, Item_Code: "PTAP-1250-6-100", System: 25, Open: 25, Vehicle_Open: 10, Primary: 0, Counter_Sale: 1, Sinhgad_Open: 4, Sinhgad_Load1: 4, Sinhgad_Load2: 2, Sinhgad_Sale: 4, Sinhgad_Load_In: 0, Purandar_Open: 3, Purandar_Load1: 3, Purandar_Load2: 0, Purandar_Sale: 2, Purandar_Load_In: 0, Rajgad_Open: 3, Rajgad_Load1: 3, Rajgad_Load2: 0, Rajgad_Sale: 2, Rajgad_Load_In: 0 },
  { Brand: "Smoodh", Net_Qty: "Choco 250ml x 24", Case_Pack: 24, Item_Code: "PTSM-0250-24-15", System: 48, Open: 48, Vehicle_Open: 18, Primary: 0, Counter_Sale: 3, Sinhgad_Open: 6, Sinhgad_Load1: 8, Sinhgad_Load2: 3, Sinhgad_Sale: 7, Sinhgad_Load_In: 0, Purandar_Open: 6, Purandar_Load1: 5, Purandar_Load2: 0, Purandar_Sale: 4, Purandar_Load_In: 0, Rajgad_Open: 6, Rajgad_Load1: 5, Rajgad_Load2: 0, Rajgad_Sale: 4, Rajgad_Load_In: 0 },
  { Brand: "Smoodh", Net_Qty: "Coffee 200ml x 24", Case_Pack: 24, Item_Code: "PTSM-0200-24-15", System: 40, Open: 40, Vehicle_Open: 15, Primary: 0, Counter_Sale: 2, Sinhgad_Open: 5, Sinhgad_Load1: 7, Sinhgad_Load2: 2, Sinhgad_Sale: 5, Sinhgad_Load_In: 0, Purandar_Open: 5, Purandar_Load1: 4, Purandar_Load2: 0, Purandar_Sale: 3, Purandar_Load_In: 0, Rajgad_Open: 5, Rajgad_Load1: 4, Rajgad_Load2: 0, Rajgad_Sale: 3, Rajgad_Load_In: 0 },
  { Brand: "Bailey", Net_Qty: "500ml x 12", Case_Pack: 12, Item_Code: "PTBA-0500-12-15", System: 100, Open: 100, Vehicle_Open: 40, Primary: 0, Counter_Sale: 10, Sinhgad_Open: 15, Sinhgad_Load1: 18, Sinhgad_Load2: 6, Sinhgad_Sale: 16, Sinhgad_Load_In: 0, Purandar_Open: 15, Purandar_Load1: 12, Purandar_Load2: 0, Purandar_Sale: 10, Purandar_Load_In: 0, Rajgad_Open: 10, Rajgad_Load1: 10, Rajgad_Load2: 0, Rajgad_Sale: 8, Rajgad_Load_In: 0 },
  { Brand: "Bailey", Net_Qty: "1L x 12", Case_Pack: 12, Item_Code: "PTBA-1000-12-20", System: 80, Open: 80, Vehicle_Open: 32, Primary: 0, Counter_Sale: 8, Sinhgad_Open: 12, Sinhgad_Load1: 14, Sinhgad_Load2: 5, Sinhgad_Sale: 12, Sinhgad_Load_In: 0, Purandar_Open: 12, Purandar_Load1: 10, Purandar_Load2: 0, Purandar_Sale: 8, Purandar_Load_In: 0, Rajgad_Open: 8, Rajgad_Load1: 8, Rajgad_Load2: 0, Rajgad_Sale: 6, Rajgad_Load_In: 0 },
  { Brand: "Dhariwal", Net_Qty: "200ml x 24", Case_Pack: 24, Item_Code: "PTDH-0200-24-12", System: 65, Open: 65, Vehicle_Open: 24, Primary: 0, Counter_Sale: 5, Sinhgad_Open: 8, Sinhgad_Load1: 10, Sinhgad_Load2: 4, Sinhgad_Sale: 9, Sinhgad_Load_In: 0, Purandar_Open: 8, Purandar_Load1: 7, Purandar_Load2: 0, Purandar_Sale: 6, Purandar_Load_In: 0, Rajgad_Open: 8, Rajgad_Load1: 7, Rajgad_Load2: 0, Rajgad_Sale: 5, Rajgad_Load_In: 0 },
  { Brand: "Dhariwal", Net_Qty: "500ml x 12", Case_Pack: 12, Item_Code: "PTDH-0500-12-18", System: 50, Open: 50, Vehicle_Open: 20, Primary: 0, Counter_Sale: 4, Sinhgad_Open: 7, Sinhgad_Load1: 8, Sinhgad_Load2: 3, Sinhgad_Sale: 7, Sinhgad_Load_In: 0, Purandar_Open: 7, Purandar_Load1: 6, Purandar_Load2: 0, Purandar_Sale: 5, Purandar_Load_In: 0, Rajgad_Open: 6, Rajgad_Load1: 6, Rajgad_Load2: 0, Rajgad_Sale: 4, Rajgad_Load_In: 0 },
  { Brand: "Dhariwal", Net_Qty: "1L x 6", Case_Pack: 6, Item_Code: "PTDH-1000-6-25", System: 35, Open: 35, Vehicle_Open: 14, Primary: 0, Counter_Sale: 3, Sinhgad_Open: 5, Sinhgad_Load1: 6, Sinhgad_Load2: 2, Sinhgad_Sale: 5, Sinhgad_Load_In: 0, Purandar_Open: 5, Purandar_Load1: 4, Purandar_Load2: 0, Purandar_Sale: 3, Purandar_Load_In: 0, Rajgad_Open: 4, Rajgad_Load1: 4, Rajgad_Load2: 0, Rajgad_Sale: 3, Rajgad_Load_In: 0 },
];

export function getSeedSheets(): DailyServiceSheet[] {
  const dates = ["2026-06-12", "2026-06-13", "2026-06-14"];
  return dates.map(date => {
    const sheetName = `${String(new Date(date).getDate()).padStart(2, "0")}${String(new Date(date).getMonth() + 1).padStart(2, "0")}`;
    return {
      date,
      sheetName,
      rows: PRODUCT_ROWS.map(r => buildRow({ ...r })),
    };
  });
}

export function getSeedInvoices(): SalesInvoice[] {
  const invoices: SalesInvoice[] = [
    {
      BillId: 1001, Date: "2026-06-14", CustomerCode: "101", CustomerName: "Shree Krishna General Store",
      Route: "Sinhgad", Items: { "PTFR-0065-72-05": 3, "PTFR-0330-24-40": 2, "PTAP-0125-48-10": 2 },
      UnitPrices: { "PTFR-0065-72-05": 310, "PTFR-0330-24-40": 620, "PTAP-0125-48-10": 410 },
      TotalAmount: 2790, CashReceived: 2790, UPIReceived: 0, ChequeReceived: 0, CreditAmount: 0,
      PaymentStatus: "Paid", AuditStatus: "OK", Time: "10:30 AM", Status: "Delivered",
    },
    {
      BillId: 1002, Date: "2026-06-14", CustomerCode: "102", CustomerName: "Balaji Provisions",
      Route: "Sinhgad", Items: { "PTFR-0125-48-10": 4, "PTFR-0200-24-20": 3, "PTSM-0250-24-15": 2 },
      UnitPrices: { "PTFR-0125-48-10": 400, "PTFR-0200-24-20": 380, "PTSM-0250-24-15": 260 },
      TotalAmount: 3320, CashReceived: 1500, UPIReceived: 0, ChequeReceived: 0, CreditAmount: 1820,
      PaymentStatus: "Partial", AuditStatus: "OK", Time: "11:00 AM", Status: "Delivered",
    },
    {
      BillId: 1003, Date: "2026-06-14", CustomerCode: "103", CustomerName: "Jai Maharashtra Kirana",
      Route: "Purandar", Items: { "PTFR-0065-72-05": 2, "PTBA-0500-12-15": 5, "PTDH-0200-24-12": 3 },
      UnitPrices: { "PTFR-0065-72-05": 310, "PTBA-0500-12-15": 120, "PTDH-0200-24-12": 195 },
      TotalAmount: 1655, CashReceived: 1655, UPIReceived: 0, ChequeReceived: 0, CreditAmount: 0,
      PaymentStatus: "Paid", AuditStatus: "OK", Time: "09:45 AM", Status: "Delivered",
    },
    {
      BillId: 1004, Date: "2026-06-14", CustomerCode: "104", CustomerName: "Om Sai Dairy & Cold Drink",
      Route: "Purandar", Items: { "PTFR-0330-24-40": 3, "PTAP-0250-24-20": 2, "PTAP-0600-12-55": 2 },
      UnitPrices: { "PTFR-0330-24-40": 620, "PTAP-0250-24-20": 390, "PTAP-0600-12-55": 450 },
      TotalAmount: 3540, CashReceived: 1000, UPIReceived: 500, ChequeReceived: 0, CreditAmount: 2040,
      PaymentStatus: "Partial", AuditStatus: "OK", Time: "10:15 AM", Status: "Delivered",
    },
    {
      BillId: 1005, Date: "2026-06-14", CustomerCode: "105", CustomerName: "Khandoba Mart",
      Route: "Rajgad", Items: { "PTFR-0125-48-10": 2, "PTFR-0600-12-70": 2, "PTAP-1250-6-100": 3 },
      UnitPrices: { "PTFR-0125-48-10": 400, "PTFR-0600-12-70": 560, "PTAP-1250-6-100": 420 },
      TotalAmount: 3260, CashReceived: 0, UPIReceived: 0, ChequeReceived: 0, CreditAmount: 3260,
      PaymentStatus: "Pending", AuditStatus: "OK", Time: "12:00 PM", Status: "Delivered",
    },
    {
      BillId: 1006, Date: "2026-06-14", CustomerCode: "106", CustomerName: "Swami Samarth Wholesale",
      Route: "Rajgad", Items: { "PTFR-1250-6-130": 5, "PTFR-2000-6-180": 3, "PTBA-1000-12-20": 4 },
      UnitPrices: { "PTFR-1250-6-130": 500, "PTFR-2000-6-180": 720, "PTBA-1000-12-20": 150 },
      TotalAmount: 5860, CashReceived: 3000, UPIReceived: 0, ChequeReceived: 0, CreditAmount: 2860,
      PaymentStatus: "Partial", AuditStatus: "OK", Time: "11:30 AM", Status: "Delivered",
    },
    {
      BillId: 1007, Date: "2026-06-14", CustomerCode: "107", CustomerName: "Ganesh Cold Storage",
      Route: "Counter", Items: { "PTFR-0065-72-05": 5, "PTBA-0500-12-15": 10, "PTBA-1000-12-20": 8 },
      UnitPrices: { "PTFR-0065-72-05": 310, "PTBA-0500-12-15": 115, "PTBA-1000-12-20": 150 },
      TotalAmount: 3850, CashReceived: 3850, UPIReceived: 0, ChequeReceived: 0, CreditAmount: 0,
      PaymentStatus: "Paid", AuditStatus: "OK", Time: "08:00 AM", Status: "Delivered",
    },
    {
      BillId: 1008, Date: "2026-06-13", CustomerCode: "101", CustomerName: "Shree Krishna General Store",
      Route: "Sinhgad", Items: { "PTFR-0065-72-05": 2, "PTFR-0330-24-40": 1 },
      UnitPrices: { "PTFR-0065-72-05": 310, "PTFR-0330-24-40": 620 },
      TotalAmount: 1240, CashReceived: 1240, UPIReceived: 0, ChequeReceived: 0, CreditAmount: 0,
      PaymentStatus: "Paid", AuditStatus: "OK", Status: "Delivered",
    },
    {
      BillId: 1009, Date: "2026-06-13", CustomerCode: "103", CustomerName: "Jai Maharashtra Kirana",
      Route: "Purandar", Items: { "PTFR-0200-24-20": 2, "PTBA-0500-12-15": 3 },
      UnitPrices: { "PTFR-0200-24-20": 380, "PTBA-0500-12-15": 120 },
      TotalAmount: 1120, CashReceived: 500, UPIReceived: 0, ChequeReceived: 0, CreditAmount: 620,
      PaymentStatus: "Partial", AuditStatus: "OK", Status: "Delivered",
    },
    {
      BillId: 1010, Date: "2026-06-12", CustomerCode: "105", CustomerName: "Khandoba Mart",
      Route: "Rajgad", Items: { "PTFR-0125-48-10": 3, "PTSM-0250-24-15": 2 },
      UnitPrices: { "PTFR-0125-48-10": 400, "PTSM-0250-24-15": 260 },
      TotalAmount: 1720, CashReceived: 0, UPIReceived: 0, ChequeReceived: 0, CreditAmount: 1720,
      PaymentStatus: "Pending", AuditStatus: "OK", Status: "Delivered",
    },
  ];
  return invoices;
}

export function getSeedCollections(): CollectionHistory[] {
  return [
    { Id: "col_1", Date: "2026-06-14", BillId: 1002, CustomerCode: "102", CustomerName: "Balaji Provisions", AmountCollected: 1500, Method: "Cash", Notes: "Partial collection" },
    { Id: "col_2", Date: "2026-06-14", BillId: 1004, CustomerCode: "104", CustomerName: "Om Sai Dairy & Cold Drink", AmountCollected: 1500, Method: "Cash", Notes: "Partial collection" },
    { Id: "col_3", Date: "2026-06-14", BillId: 1006, CustomerCode: "106", CustomerName: "Swami Samarth Wholesale", AmountCollected: 3000, Method: "Cash", Notes: "Partial collection" },
    { Id: "col_4", Date: "2026-06-13", BillId: 1009, CustomerCode: "103", CustomerName: "Jai Maharashtra Kirana", AmountCollected: 500, Method: "Cash", Notes: "Partial collection" },
  ];
}
