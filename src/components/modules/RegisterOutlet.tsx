import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { useERPStore } from "@/store/erpStore";
import DataTable from "@/components/shared/DataTable";
import { formatCurrency } from "@/utils/math";
import type { Customer } from "@/types";

export default function RegisterOutlet() {
  const { customers, addCustomer, updateCustomer, invoices, rateExceptions, setRateExceptions } = useERPStore();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState<Partial<Customer>>({});
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [rateItem, setRateItem] = useState("");
  const [ratePrice, setRatePrice] = useState(0);

  const filtered = customers.filter(c =>
    c.Customer_Name.toLowerCase().includes(search.toLowerCase()) ||
    c.Customer_Code.includes(search) || c.Beat.toLowerCase().includes(search.toLowerCase())
  );

  const customerBills = (code: string) => invoices.filter(i => i.CustomerCode === code);

  const handleSave = () => {
    if (!form.Customer_Name || !form.Beat) return;
    if (editing) {
      updateCustomer({ ...editing, ...form } as Customer);
    } else {
      const nextCode = String(Math.max(...customers.map(c => Number(c.Customer_Code))) + 1);
      addCustomer({ ...form, Customer_Code: nextCode } as Customer);
    }
    setShowForm(false); setEditing(null); setForm({});
  };

  const addRateOverride = () => {
    if (!selectedCustomer || !rateItem || ratePrice <= 0) return;
    const updated = { ...rateExceptions };
    if (!updated[selectedCustomer.Customer_Code]) updated[selectedCustomer.Customer_Code] = {};
    updated[selectedCustomer.Customer_Code][rateItem] = ratePrice;
    setRateExceptions(updated);
    setRateItem(""); setRatePrice(0);
  };

  return (
    <div className="page-transition space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white tracking-tight">Outlet Master Desk</h2>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({}); }} className="btn-amber text-xs py-2 px-4">
          <Plus size={14} /> Add Outlet
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b95a5]" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="glass-input w-full pl-9 pr-3 py-2.5 text-xs" placeholder="Search outlets..." />
        </div>
      </div>

      <DataTable
        columns={[
          { key: "Customer_Code", header: "Code", className: "font-mono-data text-[#ffb300]", width: "60px" },
          { key: "Customer_Name", header: "Outlet Name", className: "text-white font-semibold" },
          { key: "Beat", header: "Beat", render: (r: Customer) => <span className="badge-blue">{r.Beat}</span> },
          { key: "Contact", header: "Contact", className: "font-mono-data text-[#8b95a5]", render: (r: Customer) => r.Contact || "-" },
          { key: "Credit_Limit", header: "Credit", className: "font-mono-data text-right", render: (r: Customer) => formatCurrency(r.Credit_Limit || 0) },
          { key: "bills", header: "Bills", className: "font-mono-data text-right", render: (r: Customer) => customerBills(r.Customer_Code).length },
          { key: "actions", header: "", render: (r: Customer) => (
            <div className="flex gap-1">
              <button onClick={() => { setEditing(r); setForm(r); setShowForm(true); }} className="text-[#3b82f6] hover:text-blue-300 text-[10px] font-bold cursor-pointer">Edit</button>
              <button onClick={() => setSelectedCustomer(r)} className="text-[#ffb300] hover:text-amber-300 text-[10px] font-bold cursor-pointer ml-2">Rates</button>
            </div>
          ), width: "100px" },
        ]}
        data={filtered}
        keyExtractor={r => r.Customer_Code}
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="glass-panel rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-white mb-4">{editing ? "Edit" : "New"} Outlet</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Name</label><input value={form.Customer_Name || ""} onChange={e => setForm({ ...form, Customer_Name: e.target.value })} className="glass-input w-full px-3 py-2 text-xs mt-1" /></div>
              <div><label className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Beat</label><select value={form.Beat || "Sinhgad"} onChange={e => setForm({ ...form, Beat: e.target.value })} className="glass-select w-full px-3 py-2 text-xs mt-1"><option>Sinhgad</option><option>Purandar</option><option>Rajgad</option><option>Counter</option></select></div>
              <div><label className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Credit Limit</label><input type="number" value={form.Credit_Limit || ""} onChange={e => setForm({ ...form, Credit_Limit: Number(e.target.value) })} className="glass-input w-full px-3 py-2 text-xs mt-1" /></div>
              <div><label className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Contact</label><input value={form.Contact || ""} onChange={e => setForm({ ...form, Contact: e.target.value })} className="glass-input w-full px-3 py-2 text-xs mt-1" /></div>
              <div><label className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">GST</label><input value={form.GST_Number || ""} onChange={e => setForm({ ...form, GST_Number: e.target.value })} className="glass-input w-full px-3 py-2 text-xs mt-1" /></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSave} className="btn-amber flex-1 text-xs py-2.5">Save</button>
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-xs py-2.5">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)}>
          <div className="glass-panel rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-white mb-1">Rate Overrides</h3>
            <p className="text-xs text-[#8b95a5] mb-4">{selectedCustomer.Customer_Name} (#{selectedCustomer.Customer_Code})</p>
            <div className="flex gap-2 mb-4">
              <select value={rateItem} onChange={e => setRateItem(e.target.value)} className="glass-select flex-1 px-3 py-2 text-xs">
                <option value="">Select SKU...</option>
                {Object.keys(rateExceptions[selectedCustomer.Customer_Code] || {}).map(code => {
                  return <option key={code} value={code}>{code}</option>;
                })}
              </select>
              <input type="number" value={ratePrice || ""} onChange={e => setRatePrice(Number(e.target.value))} className="glass-input w-28 px-2 py-2 text-xs" placeholder="Price" />
              <button onClick={addRateOverride} className="btn-amber text-xs py-2 px-3"><Plus size={12} /></button>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {Object.entries(rateExceptions[selectedCustomer.Customer_Code] || {}).map(([code, price]) => (
                <div key={code} className="flex justify-between items-center px-3 py-2 bg-white/[0.02] rounded-lg">
                  <span className="font-mono-data text-[11px] text-[#ffb300]">{code}</span>
                  <span className="font-mono-data text-xs text-white">{formatCurrency(price)}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedCustomer(null)} className="btn-secondary w-full text-xs py-2.5 mt-4">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
