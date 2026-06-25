// Integrations Panel - no local state needed
import { Smartphone, FileSpreadsheet, Calculator, MapPin, MessageCircle, RefreshCw, Download, CheckCircle } from "lucide-react";
import { useERPStore } from "@/store/erpStore";
import { useSheetsSync } from "@/hooks/useSheetsSync";
import { useWhatsApp, useTally, useMobileSync } from "@/hooks/useIntegrations";

export default function IntegrationsPanel() {
  const { spreadsheetId, setSpreadsheetId, invoices, customers } = useERPStore();
  const { sync, isSyncing, lastSync } = useSheetsSync();
  const { sendInvoice } = useWhatsApp();
  const { exportToTally } = useTally();
  const { exportForMobile } = useMobileSync();
  

  const integrations = [
    { id: "sheets", name: "Google Sheets", icon: FileSpreadsheet, color: "#10b981", desc: "Sync ERP data to Google Sheets in real-time", action: "Sync Now", handler: sync, loading: isSyncing },
    { id: "mobile", name: "Mobile App", icon: Smartphone, color: "#3b82f6", desc: "Export data package for mobile application", action: "Export JSON", handler: exportForMobile },
    { id: "tally", name: "Tally ERP", icon: Calculator, color: "#8b5cf6", desc: "Export invoices in Tally XML format", action: "Export XML", handler: () => { if (invoices[0]) exportToTally({ date: invoices[0].Date, customerName: invoices[0].CustomerName, billId: invoices[0].BillId, amount: invoices[0].TotalAmount }); } },
    { id: "maps", name: "Google Maps", icon: MapPin, color: "#ef4444", desc: "View outlet locations on map", action: "Open Map", handler: () => window.open("https://maps.google.com?q=Pune+India", "_blank") },
    { id: "whatsapp", name: "WhatsApp", icon: MessageCircle, color: "#22c55e", desc: "Send invoices & reminders via WhatsApp", action: "Send Test", handler: () => { if (customers[0]) sendInvoice(customers[0].Contact || "919876543210", customers[0].Customer_Name, 1001, 2500); } },
  ];

  return (
    <div className="page-transition space-y-6">
      <h2 className="text-lg font-bold text-white tracking-tight">Integrations Hub</h2>

      <div className="glass-card p-5">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8b95a5] mb-3">Google Sheets Configuration</h3>
        <div className="flex gap-3">
          <input value={spreadsheetId} onChange={e => setSpreadsheetId(e.target.value)} className="glass-input flex-1 px-3 py-2.5 text-xs font-mono-data" placeholder="Spreadsheet ID..." />
          <button onClick={sync} disabled={isSyncing} className="btn-amber text-xs py-2.5 px-4 disabled:opacity-50">
            <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? "Syncing..." : "Sync Now"}
          </button>
        </div>
        {lastSync && <p className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1"><CheckCircle size={10} /> Last synced: {new Date(lastSync).toLocaleString()}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map(int => {
          const Icon = int.icon;
          return (
            <div key={int.id} className="glass-card glow-card-hover p-5 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl" style={{ background: `${int.color}15`, border: `1px solid ${int.color}30` }}>
                  <Icon size={18} style={{ color: int.color }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{int.name}</h3>
                  <p className="text-[10px] text-[#8b95a5]">{int.desc}</p>
                </div>
              </div>
              <button onClick={() => int.handler()} disabled={int.loading}
                className="btn-secondary text-xs py-2 mt-auto self-start disabled:opacity-50">
                {int.loading ? <RefreshCw size={12} className="animate-spin" /> : <Download size={12} />}
                {int.action}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
