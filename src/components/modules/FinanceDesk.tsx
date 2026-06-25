import { useState, useMemo } from "react";
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet, PieChart } from "lucide-react";
import { useERPStore } from "@/store/erpStore";
import { formatCurrency, generateUUID } from "@/utils/math";
import DataTable from "@/components/shared/DataTable";
import type { Expense } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function FinanceDesk() {
  const { expenses, invoices, collections, addExpense, removeExpense, activeDateString } = useERPStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Expense>>({ Date: activeDateString(), Category: "Vehicle Fuel", Amount: 0, Description: "", VehicleOrLocation: "None" });

  const today = activeDateString();

  const summary = useMemo(() => {
    const todayRevenue = invoices.filter(i => i.Date === today && i.Status !== "Cancelled").reduce((s, i) => s + i.CashReceived + i.UPIReceived + i.ChequeReceived, 0);
    const todayExpenses = expenses.filter(e => e.Date === today).reduce((s, e) => s + e.Amount, 0);
    const todayCollections = collections.filter(c => c.Date === today).reduce((s, c) => s + c.AmountCollected, 0);
    const totalPending = invoices.filter(i => i.PaymentStatus === "Pending").reduce((s, i) => s + i.CreditAmount, 0);
    return { todayRevenue, todayExpenses, todayCollections, totalPending };
  }, [invoices, expenses, collections, today]);

  const expenseByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => { map[e.Category] = (map[e.Category] || 0) + e.Amount; });
    return Object.entries(map).map(([name, value]) => ({ name: name.replace(/\s/g, " "), value }));
  }, [expenses]);

  const handleSave = () => {
    if (!form.Amount || !form.Description || !form.Category) return;
    addExpense({ ...form, Id: generateUUID() } as Expense);
    setShowForm(false); setForm({ Date: today, Category: "Vehicle Fuel", Amount: 0, Description: "", VehicleOrLocation: "None" });
  };

  return (
    <div className="page-transition space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white tracking-tight">Cash & Finance Desk</h2>
        <button onClick={() => setShowForm(true)} className="btn-amber text-xs py-2 px-4"><Plus size={14} /> Add Expense</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4"><div className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold flex items-center gap-1"><TrendingUp size={10} className="text-emerald-400" /> Today's Revenue</div><div className="text-xl font-mono-data text-emerald-400 font-bold mt-1">{formatCurrency(summary.todayRevenue)}</div></div>
        <div className="glass-card p-4"><div className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold flex items-center gap-1"><TrendingDown size={10} className="text-rose-400" /> Today's Expenses</div><div className="text-xl font-mono-data text-rose-400 font-bold mt-1">{formatCurrency(summary.todayExpenses)}</div></div>
        <div className="glass-card p-4"><div className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold flex items-center gap-1"><Wallet size={10} className="text-[#3b82f6]" /> Collections</div><div className="text-xl font-mono-data text-blue-400 font-bold mt-1">{formatCurrency(summary.todayCollections)}</div></div>
        <div className="glass-card p-4"><div className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold flex items-center gap-1"><PieChart size={10} className="text-[#ffb300]" /> Pending AR</div><div className="text-xl font-mono-data text-amber-400 font-bold mt-1">{formatCurrency(summary.totalPending)}</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-[15px] font-semibold text-white mb-4">Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={expenseByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#8b95a5", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#8b95a5", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: "#161d30", borderColor: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: 12, fontSize: 12, fontFamily: "JetBrains Mono" }} />
              <Bar dataKey="value" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-[15px] font-semibold text-white mb-4">Expense Register</h3>
          <DataTable
            columns={[
              { key: "Date", header: "Date", className: "font-mono-data text-[#8b95a5]", width: "90px" },
              { key: "Category", header: "Category", render: (r: Expense) => <span className="badge-amber text-[10px]">{r.Category}</span> },
              { key: "Description", header: "Description", className: "text-white text-xs" },
              { key: "Amount", header: "Amount", className: "font-mono-data text-rose-400 text-right", render: (r: Expense) => formatCurrency(r.Amount) },
              { key: "action", header: "", render: (r: Expense) => (
                <button onClick={() => removeExpense(r.Id)} className="text-rose-400 hover:text-rose-300 transition cursor-pointer"><Trash2 size={14} /></button>
              ), width: "40px" },
            ]}
            data={expenses.slice().reverse()}
            keyExtractor={r => r.Id}
            maxHeight="280px"
          />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="glass-panel rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-white mb-4">Add Expense</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Category</label><select value={form.Category} onChange={e => setForm({ ...form, Category: e.target.value as Expense["Category"] })} className="glass-select w-full px-3 py-2 text-xs mt-1">
                  {["Fixed Warehouse Rent", "Employee Wages", "Cost of Electricity", "Vehicle Maintenance", "Vehicle Fuel", "Advance Taken", "Other Expenses"].map(c => <option key={c} value={c}>{c}</option>)}
                </select></div>
                <div><label className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Amount</label><input type="number" value={form.Amount || ""} onChange={e => setForm({ ...form, Amount: Number(e.target.value) })} className="glass-input w-full px-3 py-2 text-xs mt-1" /></div>
              </div>
              <div><label className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Description</label><input value={form.Description || ""} onChange={e => setForm({ ...form, Description: e.target.value })} className="glass-input w-full px-3 py-2 text-xs mt-1" /></div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="btn-amber flex-1 text-xs py-2.5">Save</button>
                <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-xs py-2.5">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
