import { useCallback } from "react";
import { useERPStore } from "@/store/erpStore";
import { formatCurrency } from "@/utils/math";

export function useWhatsApp() {
  const sendInvoice = useCallback((phone: string, customerName: string, billId: number, amount: number) => {
    const message = `*Swadraj Agencies*\nInvoice #${billId}\nCustomer: ${customerName}\nAmount: ${formatCurrency(amount)}\nThank you for your business!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
  }, []);

  const sendCollectionReminder = useCallback((phone: string, customerName: string, amount: number) => {
    const message = `*Swadraj Agencies*\nDear ${customerName},\nPlease clear your outstanding amount of ${formatCurrency(amount)} at the earliest.\nThank you.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
  }, []);

  return { sendInvoice, sendCollectionReminder };
}

export function useTally() {
  const exportToTally = useCallback((data: any) => {
    const xml = `<?xml version="1.0"?>
<ENVELOPE>
  <HEADER><VERSION>1</VERSION><TALLYREQUEST>Import</TALLYREQUEST></HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC><REPORTNAME>Vouchers</REPORTNAME></REQUESTDESC>
      <REQUESTDATA>
        <TALLYMESSAGE>
          <VOUCHER VCHTYPE="Sales">
            <DATE>${data.date?.replace(/-/g, "") || "20260614"}</DATE>
            <PARTYNAME>${data.customerName || "Customer"}</PARTYNAME>
            <VOUCHERNUMBER>${data.billId || "001"}</VOUCHERNUMBER>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Sales</LEDGERNAME>
              <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
              <AMOUNT>${data.amount || 0}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
          </VOUCHER>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;

    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tally_export_${data.billId || Date.now()}.xml`;
    a.click();
    URL.revokeObjectURL(url);
    return true;
  }, []);

  return { exportToTally };
}

export function useMobileSync() {
  const { invoices, sheets } = useERPStore();

  const generateMobilePayload = useCallback(() => {
    return {
      timestamp: new Date().toISOString(),
      version: "1.0",
      invoices: invoices.slice(-50),
      stock: sheets[sheets.length - 1]?.rows.map(r => ({
        code: r.Item_Code, name: r.Net_Qty, closing: r.Total_Closing,
      })) || [],
    };
  }, [invoices, sheets]);

  const exportForMobile = useCallback(() => {
    const payload = generateMobilePayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `swadraj_mobile_sync_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [generateMobilePayload]);

  return { generateMobilePayload, exportForMobile };
}
