import { useState, useCallback } from "react";
import { useERPStore } from "@/store/erpStore";

export function useSheetsSync() {
  const { spreadsheetId, sheets, invoices, collections } = useERPStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const sync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const dsrHeaders = ["Date", "Sheet_Name", "Brand", "Net_Qty", "Case_Pack", "Item_Code", "Open_Godown", "Open_Vehicle", "Primary_Dispatch", "Total_Open", "Total_Load_Out", "Total_Load_In", "Closing_Stock", "Counter_Sale", "Total_Sale", "Sinhgad_Load1", "Sinhgad_Load2", "Sinhgad_Sale", "Purandar_Load1", "Purandar_Load2", "Purandar_Sale", "Rajgad_Load1", "Rajgad_Load2", "Rajgad_Sale"];
      const dsrData: any[][] = [dsrHeaders];
      sheets.forEach(sheet => {
        sheet.rows.forEach(row => {
          dsrData.push([sheet.date, sheet.sheetName, row.Brand, row.Net_Qty, row.Case_Pack, row.Item_Code, row.Open, row.Vehicle_Open, row.Primary, row.Total_Open, row.Total_Load_Out, row.Total_Load_In, row.Total_Closing, row.Counter_Sale, row.Total_Sale, row.Sinhgad_Load1, row.Sinhgad_Load2, row.Sinhgad_Sale, row.Purandar_Load1, row.Purandar_Load2, row.Purandar_Sale, row.Rajgad_Load1, row.Rajgad_Load2, row.Rajgad_Sale]);
        });
      });

      const salesHeaders = ["Bill_Id", "Date", "Customer_Code", "Customer_Name", "Route", "Total_Amount", "Cash_Received", "UPI_Received", "Cheque_Received", "Credit_Amount", "Payment_Status", "Items"];
      const salesData: any[][] = [salesHeaders];
      invoices.forEach(inv => {
        salesData.push([inv.BillId, inv.Date, inv.CustomerCode, inv.CustomerName, inv.Route, inv.TotalAmount, inv.CashReceived, inv.UPIReceived, inv.ChequeReceived, inv.CreditAmount, inv.PaymentStatus, JSON.stringify(inv.Items)]);
      });

      const data: Record<string, any[][]> = { DSR: dsrData, SALES: salesData };

      const response = await fetch("/api/sheets/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spreadsheetId, data }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Sync failed");
      }

      setLastSync(new Date().toISOString());
      return true;
    } catch (err: any) {
      console.error("Sync error:", err);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [spreadsheetId, sheets, invoices, collections]);

  return { sync, isSyncing, lastSync };
}
