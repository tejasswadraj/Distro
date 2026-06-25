import { useState, useMemo } from "react";
import { FileText, Calendar, TrendingUp, Users, Package } from "lucide-react";
import { useERPStore } from "@/store/erpStore";
import { formatCurrency, formatNumber } from "@/utils/math";
import DataTable from "@/components/shared/DataTable";
import type { SalesInvoice } from "@/types";

export default function DailyReports() {
  const { reconciledSheets, invoices, expenses, employees, attendanceLog, activeSheetName } = useERPStore();
  const sheets = reconciledSheets();
  const [selectedSheet, setSelectedSheet] = useState(activeSheetName);
  const activeSheet = sheets.find(s => s.sheetName === selectedSheet) || sheets[sheets.length - 1];

  const dateInvoices = useMemo(() =>
    invoices.filter(i => i.Date === (activeSheet?.date || "2026-06-14") && i.Status !== "Cancelled"),
  [invoices, activeSheet]);

  const summary = useMemo(() => ({
    revenue: dateInvoices.reduce((s, i) => s + i.TotalAmount, 0),
    cash: dateInvoices.reduce((s, i) => s + i.CashReceived + i.UPIReceived + i.ChequeReceived, 0),
    credit: dateInvoices.reduce((s, i) => s + i.CreditAmount, 0),
    bills: dateInvoices.length,
    expense: expenses.filter(e => e.Date === (activeSheet?.date || "2026-06-14")).reduce((s, e) => s + e.Amount, 0),
    present: attendanceLog.filter(a => a.date === (activeSheet?.date || "2026-06-14") && a.status === "Present").length,
  }), [dateInvoices, expenses, attendanceLog, activeSheet]);

  const routeBreakdown = useMemo(() => {
    const routes = ["Sinhgad", "Purandar", "Rajgad", "Counter"] as const;
    return routes.map(route => {
      const routeInvs = dateInvoices.filter(i => i.Route === route);
      return { route, bills: routeInvs.length, revenue: routeInvs.reduce((s, i) => s + i.TotalAmount, 0), cases: routeInvs.reduce((s, i) => s + Object.values(i.Items).reduce((a, b) => a + b, 0), 0) };
    });
  }, [dateInvoices]);

  return (
    <div className="page-transition space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white tracking-tight">Daily Sales Sheets</h2>
        <select value={selectedSheet} onChange={e => setSelectedSheet(e.target.value)} className="glass-select px-3 py-2 text-xs">
          {sheets.map(s => <option key={s.sheetName} value={s.sheetName}>{s.sheetName} ({s.date})</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="stat-card"><FileText size={14} className="text-[#ffb300] mb-1" /><div className="font-mono-data text-lg font-bold text-white">{summary.bills}</div><div className="text-[9px] text-[#8b95a5] uppercase">Bills</div></div>
        <div className="stat-card"><TrendingUp size={14} className="text-emerald-400 mb-1" /><div className="font-mono-data text-lg font-bold text-emerald-400">{formatCurrency(summary.revenue)}</div><div className="text-[9px] text-[#8b95a5] uppercase">Revenue</div></div>
        <div className="stat-card"><Package size={14} className="text-[#3b82f6] mb-1" /><div className="font-mono-data text-lg font-bold text-blue-400">{formatCurrency(summary.cash)}</div><div className="text-[9px] text-[#8b95a5] uppercase">Cash</div></div>
        <div className="stat-card"><Calendar size={14} className="text-rose-400 mb-1" /><div className="font-mono-data text-lg font-bold text-rose-400">{formatCurrency(summary.credit)}</div><div className="text-[9px] text-[#8b95a5] uppercase">Credit</div></div>
        <div className="stat-card"><Users size={14} className="text-[#8b5cf6] mb-1" /><div className="font-mono-data text-lg font-bold text-violet-400">{summary.present}/{employees.length}</div><div className="text-[9px] text-[#8b95a5] uppercase">Present</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-[15px] font-semibold text-white mb-4">Route Breakdown</h3>
          <div className="space-y-3">
            {routeBreakdown.map(r => (
              <div key={r.route} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="badge-blue text-[10px]">{r.route}</span>
                  <span className="text-xs text-[#8b95a5]">{r.bills} bills</span>
                </div>
                <div className="text-right">
                  <div className="font-mono-data text-sm font-bold text-white">{formatCurrency(r.revenue)}</div>
                  <div className="font-mono-data text-[10px] text-[#8b95a5]">{formatNumber(r.cases)} cases</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-[15px] font-semibold text-white mb-4">Invoices - {activeSheet?.date}</h3>
          <DataTable
            columns={[
              { key: "BillId", header: "#", className: "font-mono-data text-[#ffb300]", width: "50px" },
              { key: "CustomerName", header: "Customer", className: "text-xs text-white" },
              { key: "Route", header: "Route", render: (r: SalesInvoice) => <span className="badge-blue text-[9px]">{r.Route}</span>, width: "70px" },
              { key: "TotalAmount", header: "Amount", className: "font-mono-data text-right", render: (r: SalesInvoice) => formatCurrency(r.TotalAmount) },
              { key: "PaymentStatus", header: "Status", render: (r: SalesInvoice) => <span className={r.PaymentStatus === "Paid" ? "badge-emerald text-[9px]" : "badge-amber text-[9px]"}>{r.PaymentStatus}</span> },
            ]}
            data={dateInvoices}
            keyExtractor={r => String(r.BillId)}
          />
        </div>
      </div>
    </div>
  );
}
