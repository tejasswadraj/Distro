import type { DailyServiceRow, SalesInvoice } from "@/types";
import { PRODUCTS, RATES_OVERRIDES } from "@/data/masterData";

export function getCalculatedPrice(customerCode: string, itemCode: string): number {
  const product = PRODUCTS.find(p => p.Item_Code === itemCode);
  const defaultWholesale = product?.Sale_Rate_Wholesale || 0;
  if (!customerCode) return 0;
  const exception = RATES_OVERRIDES.find(o => o.CustomerCode === customerCode);
  if (exception && exception.PricingOverrides[itemCode] !== undefined) {
    return exception.PricingOverrides[itemCode];
  }
  return defaultWholesale;
}

export function calculateDailyRow(
  row: Omit<DailyServiceRow, "Total_Open" | "Total_Load_Out" | "Total_Load_In" | "Total_Closing" | "Total_Sale">
): DailyServiceRow {
  const Total_Open = row.Open + row.Vehicle_Open + row.Primary;
  const Total_Load_Out =
    row.Sinhgad_Load1 + row.Sinhgad_Load2 +
    row.Purandar_Load1 + row.Purandar_Load2 +
    row.Rajgad_Load1 + row.Rajgad_Load2;
  const Total_Load_In = row.Sinhgad_Load_In + row.Purandar_Load_In + row.Rajgad_Load_In;
  const Total_Closing = row.Open + row.Primary - Total_Load_Out + Total_Load_In - row.Counter_Sale;
  const Total_Sale = row.Counter_Sale + row.Sinhgad_Sale + row.Purandar_Sale + row.Rajgad_Sale;

  return { ...row, Total_Open, Total_Load_Out, Total_Load_In, Total_Closing, Total_Sale };
}

export function verifyInvoiceBalance(invoice: Omit<SalesInvoice, "AuditStatus">): "OK" | "⚠️ BALANCE ERROR" {
  const sumReceivedAndOwed = invoice.CashReceived + invoice.UPIReceived + invoice.ChequeReceived + invoice.CreditAmount;
  return Math.abs(sumReceivedAndOwed - invoice.TotalAmount) < 0.01 ? "OK" : "⚠️ BALANCE ERROR";
}

export function calculateCreditRisk(
  stillDue: number,
  agingDays: number
): "Fully Reconciled" | "High Credit Risk" | "Over Credit Limit" | "Active Credit" {
  if (stillDue <= 0) return "Fully Reconciled";
  if (agingDays > 45) return "High Credit Risk";
  if (stillDue > 5000) return "Over Credit Limit";
  return "Active Credit";
}

export function getPreviousDaySheetName(dateStr: string): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}${month}`;
}

export function getSheetNameForDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}${month}`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function getTodayStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getNextBillId(existingInvoices: SalesInvoice[]): number {
  if (existingInvoices.length === 0) return 1001;
  return Math.max(...existingInvoices.map(i => i.BillId)) + 1;
}

export function generatePONumber(existingCount: number): string {
  const next = existingCount + 1;
  return `PO-2026-${String(next).padStart(4, "0")}`;
}

export function generateUUID(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
