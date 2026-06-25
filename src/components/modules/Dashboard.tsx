import { ReceiptIndianRupee, UserSquare, Truck, Database, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useERPStore } from "@/store/erpStore";
import { useMemo } from "react";
import StatCard from "@/components/shared/StatCard";
import DataTable from "@/components/shared/DataTable";
import { formatCurrency, formatNumber } from "@/utils/math";
import type { SalesInvoice } from "@/types";

export default function Dashboard() {
  const { invoices, reconciledSheets, purchaseOrders, expenses, activeSheetName } = useERPStore();
  const sheets = reconciledSheets();

  const kpi = useMemo(() => {
    const today = "2026-06-14";
    const todayInvoices = invoices.filter(i => i.Date === today && i.Status !== "Cancelled");
    const revenue = todayInvoices.reduce((s, i) => s + i.TotalAmount, 0);
    const outstanding = invoices.filter(i => i.PaymentStatus === "Pending" || i.PaymentStatus === "Partial")
      .reduce((s, i) => s + i.CreditAmount, 0);
    const totalStock = sheets[sheets.length - 1]?.rows.reduce((s, r) => s + r.Total_Closing, 0) || 0;
    const pendingPOs = purchaseOrders.filter(p => p.Status === "Draft" || p.Status === "Sent").length;
    const overdueBills = invoices.filter(i => i.PaymentStatus === "Pending").length;
    const todayExpenses = expenses.filter(e => e.Date === today).reduce((s, e) => s + e.Amount, 0);
    return { revenue, outstanding, totalStock, pendingPOs, overdueBills, todayExpenses };
  }, [invoices, sheets, purchaseOrders, expenses]);

  const chartData = useMemo(() => {
    const dates = ["2026-06-12", "2026-06-13", "2026-06-14"];
    return dates.map(d => ({
      date: d.slice(5),
      revenue: invoices.filter(i => i.Date === d && i.Status !== "Cancelled").reduce((s, i) => s + i.TotalAmount, 0),
      orders: invoices.filter(i => i.Date === d && i.Status !== "Cancelled").length,
    }));
  }, [invoices]);

  const recentInvoices = useMemo(() =>
    [...invoices].sort((a, b) => b.BillId - a.BillId).slice(0, 6),
  [invoices]);

  const pendingCollections = useMemo(() =>
    invoices.filter(i => i.PaymentStatus === "Pending" || i.PaymentStatus === "Partial").slice(0, 5),
  [invoices]);

  return (
    <div className="page-transition space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Dashboard</h2>
          <p className="text-[11px] text-[#8b95a5] font-mono mt-0.5">SHEET: {activeSheetName} | {sheets.find(s => s.sheetName === activeSheetName)?.date || "2026-06-14"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Revenue" value={formatCurrency(kpi.revenue)} subtitle={`${formatNumber(kpi.todayExpenses)} expenses`}
          icon={<ReceiptIndianRupee size={16} style={{ color: "#ffb300" }} />} trend={{ value: 12.5, isPositive: true }} accentColor="#ffb300" />
        <StatCard title="Outstanding AR" value={formatCurrency(kpi.outstanding)} subtitle={`${kpi.overdueBills} overdue bills`}
          icon={<UserSquare size={16} style={{ color: "#f43f5e" }} />} accentColor="#f43f5e" />
        <StatCard title="Active Fleet" value="3/3" subtitle="All vehicles operational"
          icon={<Truck size={16} style={{ color: "#3b82f6" }} />} accentColor="#3b82f6" />
        <StatCard title="Warehouse Stock" value={`${formatNumber(kpi.totalStock)} cases`} subtitle={`${kpi.pendingPOs} pending POs`}
          icon={<Database size={16} style={{ color: "#10b981" }} />} accentColor="#10b981" />
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[15px] font-semibold text-white">Revenue Trends</h3>
          <div className="flex gap-1">
            {["7D", "30D", "3M"].map(p => (
              <button key={p} className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition ${p === "7D" ? "bg-[#ffb300]/10 text-[#ffb300] border border-[#ffb300]/20" : "text-[#8b95a5] hover:text-white"}`}>{p}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffb300" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ffb300" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "#8b95a5", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#8b95a5", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ backgroundColor: "#161d30", borderColor: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: 12, fontSize: 12, fontFamily: "JetBrains Mono" }} />
            <Area type="monotone" dataKey="revenue" stroke="#ffb300" strokeWidth={2.5} fill="url(#colorRev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-white">Recent Invoices</h3>
            <span className="text-[11px] text-[#3b82f6] font-bold cursor-pointer hover:underline">View All</span>
          </div>
          <DataTable
            columns={[
              { key: "BillId", header: "Bill #", className: "font-mono-data text-[#ffb300]", width: "70px" },
              { key: "CustomerName", header: "Customer", className: "text-white" },
              { key: "Route", header: "Route", render: (r: SalesInvoice) => <span className="badge-blue">{r.Route}</span> },
              { key: "TotalAmount", header: "Amount", className: "font-mono-data text-right", render: (r: SalesInvoice) => formatCurrency(r.TotalAmount) },
              { key: "PaymentStatus", header: "Status", render: (r: SalesInvoice) => (
                <span className={`inline-flex items-center gap-1 ${r.PaymentStatus === "Paid" ? "text-emerald-400" : r.PaymentStatus === "Partial" ? "text-amber-400" : "text-rose-400"}`}>
                  {r.PaymentStatus === "Paid" ? <CheckCircle size={12} /> : r.PaymentStatus === "Pending" ? <AlertTriangle size={12} /> : <TrendingUp size={12} />}
                  <span className="text-[11px] font-bold">{r.PaymentStatus}</span>
                </span>
              )},
            ]}
            data={recentInvoices}
            keyExtractor={r => String(r.BillId)}
          />
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-white">Pending Collections</h3>
            <span className="badge-rose text-[10px]">{formatCurrency(pendingCollections.reduce((s, i) => s + i.CreditAmount, 0))}</span>
          </div>
          <DataTable
            columns={[
              { key: "CustomerName", header: "Customer", className: "text-white" },
              { key: "CreditAmount", header: "Amount Due", className: "font-mono-data text-rose-400 text-right", render: (r: SalesInvoice) => formatCurrency(r.CreditAmount) },
              { key: "Route", header: "Route", render: (r: SalesInvoice) => <span className="badge-blue">{r.Route}</span> },
              { key: "PaymentStatus", header: "Status", render: (r: SalesInvoice) => (
                <span className={r.PaymentStatus === "Pending" ? "badge-rose" : "badge-amber"}>{r.PaymentStatus}</span>
              )},
            ]}
            data={pendingCollections}
            keyExtractor={r => String(r.BillId)}
          />
        </div>
      </div>
    </div>
  );
}
