import { useState, useMemo } from "react";
import { Search, Coins } from "lucide-react";
import { useERPStore } from "@/store/erpStore";
import { formatCurrency, calculateCreditRisk } from "@/utils/math";
import DataTable from "@/components/shared/DataTable";

export default function ARCollections() {
  const { invoices, collections, addCollection } = useERPStore();
  const [search, setSearch] = useState("");
  const [selectedBill, setSelectedBill] = useState<number | null>(null);
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState<"Cash" | "UPI" | "Cheque">("Cash");

  const arData = useMemo(() => {
    const today = new Date("2026-06-14");
    return invoices
      .filter(i => i.PaymentStatus !== "Paid" && i.Status !== "Cancelled")
      .map(inv => {
        const agingDays = Math.floor((today.getTime() - new Date(inv.Date).getTime()) / (1000 * 60 * 60 * 24));
        const colls = collections.filter(c => c.BillId === inv.BillId);
        const collected = colls.reduce((s, c) => s + c.AmountCollected, 0);
        const creditBalance = Math.max(0, inv.TotalAmount - inv.CashReceived - inv.UPIReceived - inv.ChequeReceived - collected);
        const status = calculateCreditRisk(creditBalance, agingDays);
        return { ...inv, agingDays, collected, creditBalance, status };
      })
      .filter(a => !search || a.CustomerName.toLowerCase().includes(search.toLowerCase()) || String(a.BillId).includes(search))
      .sort((a, b) => b.agingDays - a.agingDays);
  }, [invoices, collections, search]);

  const summary = useMemo(() => ({
    totalOutstanding: arData.reduce((s, a) => s + a.creditBalance, 0),
    totalBills: arData.length,
    highRisk: arData.filter(a => a.status === "High Credit Risk").length,
    overdueLimit: arData.filter(a => a.status === "Over Credit Limit").length,
  }), [arData]);

  const handleCollect = () => {
    if (!selectedBill || amount <= 0) return;
    addCollection(selectedBill, amount, method);
    setSelectedBill(null); setAmount(0); setMethod("Cash");
  };

  return (
    <div className="page-transition space-y-6">
      <h2 className="text-lg font-bold text-white tracking-tight">Ledger & Outstanding</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4"><div className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Total Outstanding</div><div className="text-xl font-mono-data text-rose-400 font-bold mt-1">{formatCurrency(summary.totalOutstanding)}</div></div>
        <div className="glass-card p-4"><div className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Open Bills</div><div className="text-xl font-mono-data text-white font-bold mt-1">{summary.totalBills}</div></div>
        <div className="glass-card p-4"><div className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">High Risk</div><div className="text-xl font-mono-data text-rose-400 font-bold mt-1">{summary.highRisk}</div></div>
        <div className="glass-card p-4"><div className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Over Limit</div><div className="text-xl font-mono-data text-amber-400 font-bold mt-1">{summary.overdueLimit}</div></div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b95a5]" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="glass-input w-full pl-9 pr-3 py-2.5 text-xs" placeholder="Search bills..." />
        </div>
      </div>

      <DataTable
        columns={[
          { key: "BillId", header: "Bill #", className: "font-mono-data text-[#ffb300]", width: "70px" },
          { key: "Date", header: "Date", className: "font-mono-data text-[#8b95a5]", width: "90px" },
          { key: "CustomerName", header: "Customer", className: "text-white" },
          { key: "Route", header: "Route", render: (r: typeof arData[0]) => <span className="badge-blue">{r.Route}</span>, width: "80px" },
          { key: "TotalAmount", header: "Total", className: "font-mono-data text-right", render: (r: typeof arData[0]) => formatCurrency(r.TotalAmount) },
          { key: "creditBalance", header: "Due", className: "font-mono-data text-rose-400 text-right", render: (r: typeof arData[0]) => formatCurrency(r.creditBalance) },
          { key: "agingDays", header: "Aging", className: "font-mono-data text-right", render: (r: typeof arData[0]) => <span className={r.agingDays > 30 ? "text-rose-400" : "text-[#8b95a5]"}>{r.agingDays}d</span> },
          { key: "status", header: "Status", render: (r: typeof arData[0]) => {
            const colors: Record<string, string> = { "Fully Reconciled": "badge-emerald", "High Credit Risk": "badge-rose", "Over Credit Limit": "badge-amber", "Active Credit": "badge-blue" };
            return <span className={colors[r.status] || "badge-blue"}>{r.status}</span>;
          }},
          { key: "action", header: "Collect", render: (r: typeof arData[0]) => (
            <button onClick={() => setSelectedBill(r.BillId)} className="btn-amber text-[10px] py-1 px-2.5"><Coins size={10} /> Collect</button>
          ), width: "90px" },
        ]}
        data={arData}
        keyExtractor={r => String(r.BillId)}
      />

      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setSelectedBill(null)}>
          <div className="glass-panel rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-white mb-4">Collect Payment - Bill #{selectedBill}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Amount</label>
                <input type="number" value={amount || ""} onChange={e => setAmount(Number(e.target.value))} className="glass-input w-full px-3 py-2.5 text-sm mt-1" min={1} />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Method</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(["Cash", "UPI", "Cheque"] as const).map(m => (
                    <button key={m} onClick={() => setMethod(m)} className={`py-2 rounded-lg text-xs font-bold ${method === m ? "bg-[#ffb300] text-black" : "bg-white/[0.03] text-[#8b95a5]"}`}>{m}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleCollect} className="btn-amber flex-1 text-xs py-2.5">Confirm Collection</button>
                <button onClick={() => setSelectedBill(null)} className="btn-secondary flex-1 text-xs py-2.5">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
