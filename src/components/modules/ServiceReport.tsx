import { useState, useMemo } from "react";
import { Truck } from "lucide-react";
import { useERPStore } from "@/store/erpStore";
import { formatCurrency, formatNumber } from "@/utils/math";
import DataTable from "@/components/shared/DataTable";
import type { SalesInvoice } from "@/types";

export default function ServiceReport() {
  const { invoices, expenses, vehicles } = useERPStore();
  const [activeRoute, setActiveRoute] = useState<string>("Sinhgad");
  const today = "2026-06-14";

  const routeInvoices = useMemo(() =>
    invoices.filter(i => i.Route === activeRoute && i.Date === today && i.Status !== "Cancelled"),
  [invoices, activeRoute]);

  const routeSummary = useMemo(() => ({
    totalCash: routeInvoices.reduce((s, i) => s + i.CashReceived + i.UPIReceived + i.ChequeReceived, 0),
    totalCredit: routeInvoices.reduce((s, i) => s + i.CreditAmount, 0),
    totalCases: routeInvoices.reduce((s, i) => s + Object.values(i.Items).reduce((a, b) => a + b, 0), 0),
    billCount: routeInvoices.length,
    fuelExpense: expenses.filter(e => e.Date === today && e.VehicleOrLocation === `${activeRoute} Vehicle`).reduce((s, e) => s + e.Amount, 0),
  }), [routeInvoices, expenses, activeRoute]);

  const vehicle = vehicles.find(v => v.Name === activeRoute);

  return (
    <div className="page-transition space-y-6">
      <h2 className="text-lg font-bold text-white tracking-tight">Vehicle Dispatch</h2>

      <div className="flex gap-2">
        {["Sinhgad", "Purandar", "Rajgad"].map(r => (
          <button key={r} onClick={() => setActiveRoute(r)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeRoute === r ? "bg-[#ffb300] text-black" : "bg-white/[0.03] text-[#8b95a5] hover:text-white"}`}>
            {r}
          </button>
        ))}
      </div>

      {vehicle && (
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20">
            <Truck size={24} className="text-[#3b82f6]" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white">{vehicle.Name} <span className="text-[#8b95a5] font-normal">({vehicle.RegistrationNumber})</span></div>
            <div className="text-[11px] text-[#8b95a5] mt-0.5">Capacity: {formatNumber(vehicle.LoadCapacityCases)} cases | Status: <span className={vehicle.Status === "At-warehouse" ? "text-emerald-400" : "text-amber-400"}>{vehicle.Status}</span></div>
          </div>
          <div className="text-right">
            <div className="font-mono-data text-sm font-bold text-emerald-400">{formatCurrency(routeSummary.totalCash)}</div>
            <div className="text-[10px] text-[#8b95a5]">collected today</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center"><div className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Bills</div><div className="font-mono-data text-xl font-bold text-white mt-1">{routeSummary.billCount}</div></div>
        <div className="glass-card p-4 text-center"><div className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Cases</div><div className="font-mono-data text-xl font-bold text-[#ffb300] mt-1">{formatNumber(routeSummary.totalCases)}</div></div>
        <div className="glass-card p-4 text-center"><div className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Cash</div><div className="font-mono-data text-xl font-bold text-emerald-400 mt-1">{formatCurrency(routeSummary.totalCash)}</div></div>
        <div className="glass-card p-4 text-center"><div className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Credit</div><div className="font-mono-data text-xl font-bold text-rose-400 mt-1">{formatCurrency(routeSummary.totalCredit)}</div></div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-[15px] font-semibold text-white mb-4">Route Invoices - {activeRoute}</h3>
        <DataTable
          columns={[
            { key: "BillId", header: "Bill #", className: "font-mono-data text-[#ffb300]", width: "70px" },
            { key: "CustomerName", header: "Customer", className: "text-xs text-white" },
            { key: "Items", header: "Items", className: "font-mono-data text-[10px] text-[#8b95a5]", render: (r: SalesInvoice) => `${Object.values(r.Items).reduce((a, b) => a + b, 0)} cases` },
            { key: "TotalAmount", header: "Total", className: "font-mono-data text-right", render: (r: SalesInvoice) => formatCurrency(r.TotalAmount) },
            { key: "CashReceived", header: "Cash", className: "font-mono-data text-right text-emerald-400", render: (r: SalesInvoice) => formatCurrency(r.CashReceived + r.UPIReceived) },
            { key: "CreditAmount", header: "Credit", className: "font-mono-data text-right text-rose-400", render: (r: SalesInvoice) => formatCurrency(r.CreditAmount) },
            { key: "Time", header: "Time", className: "font-mono-data text-[#8b95a5]", render: (r: SalesInvoice) => r.Time || "-" },
            { key: "PaymentStatus", header: "Status", render: (r: SalesInvoice) => <span className={r.PaymentStatus === "Paid" ? "badge-emerald" : r.PaymentStatus === "Partial" ? "badge-amber" : "badge-rose"}>{r.PaymentStatus}</span> },
          ]}
          data={routeInvoices}
          keyExtractor={r => String(r.BillId)}
        />
      </div>
    </div>
  );
}
