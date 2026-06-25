import { useState } from "react";
import { Plus, Send } from "lucide-react";
import { useERPStore } from "@/store/erpStore";
import { PRODUCTS } from "@/data/masterData";
import { formatCurrency, generatePONumber } from "@/utils/math";
import type { PurchaseOrder, PurchaseOrderItem } from "@/types";

export default function SupplierPurchases() {
  const { suppliers, purchaseOrders, addPurchaseOrder, updatePurchaseOrder, postPOToDSR, sheets } = useERPStore();
  const [view, setView] = useState<"list" | "create">("list");
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);
  const [supplierCode, setSupplierCode] = useState("");
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedSheet, setSelectedSheet] = useState("");

  const filteredPOs = purchaseOrders;

  const addItem = (product: typeof PRODUCTS[0]) => {
    if (items.find(i => i.Item_Code === product.Item_Code)) return;
    const totalBefore = product.Purchase_Rate || 0;
    const gstAmt = totalBefore * (product.GST_Percent / 100);
    setItems(prev => [...prev, {
      Item_Code: product.Item_Code, Item_Name: product.Item_Name, Brand: product.Brand,
      Case_Pack: product.Case_Pack, Quantity_Cases: 1, Purchase_Rate: product.Purchase_Rate || 0,
      Total_Before_Tax: totalBefore, GST_Percent: product.GST_Percent,
      GST_Amount: gstAmt, Total_Amount: totalBefore + gstAmt,
    }]);
  };

  const updateQty = (code: string, qty: number) => {
    setItems(prev => prev.map(i => {
      if (i.Item_Code !== code) return i;
      const totalBefore = qty * i.Purchase_Rate;
      const gstAmt = totalBefore * (i.GST_Percent / 100);
      return { ...i, Quantity_Cases: qty, Total_Before_Tax: totalBefore, GST_Amount: gstAmt, Total_Amount: totalBefore + gstAmt };
    }));
  };

  const grandTotal = items.reduce((s, i) => s + i.Total_Amount, 0);
  const totalGST = items.reduce((s, i) => s + i.GST_Amount, 0);
  const totalBefore = items.reduce((s, i) => s + i.Total_Before_Tax, 0);

  const handleSave = (status: PurchaseOrder["Status"]) => {
    if (!supplierCode || items.length === 0) return;
    const supplier = suppliers.find(s => s.Supplier_Code === supplierCode);
    const po: PurchaseOrder = {
      PO_Number: editingPO ? editingPO.PO_Number : generatePONumber(purchaseOrders.length),
      Date: new Date().toISOString().split("T")[0],
      Supplier_Code: supplierCode, Supplier_Name: supplier?.Supplier_Name || "",
      Items: items, Total_Before_Tax: totalBefore, Total_GST: totalGST, Grand_Total: grandTotal,
      Status: status, Expected_Delivery: expectedDelivery || new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
      Notes: notes,
    };
    if (editingPO) updatePurchaseOrder(po); else addPurchaseOrder(po);
    setView("list"); setEditingPO(null); setItems([]); setSupplierCode(""); setNotes("");
  };

  const handlePostToDSR = (po: PurchaseOrder) => {
    if (!selectedSheet) return;
    postPOToDSR(po, selectedSheet);
    updatePurchaseOrder({ ...po, Status: "Received", Sync_To_DSR: true, Synced_Sheet_Date: selectedSheet });
    setSelectedSheet("");
  };

  const statusColor = (s: PurchaseOrder["Status"]) => {
    if (s === "Draft") return "badge-amber";
    if (s === "Sent") return "badge-blue";
    if (s === "Received") return "badge-emerald";
    return "badge-rose";
  };

  return (
    <div className="page-transition space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white tracking-tight">Supplier Purchase</h2>
        <button onClick={() => { setView("create"); setEditingPO(null); setItems([]); setSupplierCode(""); setNotes(""); }} className="btn-amber text-xs py-2 px-4"><Plus size={14} /> New PO</button>
      </div>

      {view === "list" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPOs.map(po => (
            <div key={po.PO_Number} className="glass-card glow-card-hover p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-mono-data text-[#ffb300] text-xs font-bold">{po.PO_Number}</div>
                  <div className="text-xs text-[#8b95a5] mt-0.5">{po.Supplier_Name}</div>
                </div>
                <span className={statusColor(po.Status)}>{po.Status}</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-[#8b95a5]">Items</span><span className="font-mono-data text-white">{po.Items.length} SKUs</span></div>
                <div className="flex justify-between"><span className="text-[#8b95a5]">Delivery</span><span className="font-mono-data text-white">{po.Expected_Delivery}</span></div>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/[0.04]">
                <span className="font-mono-data text-lg font-bold text-white">{formatCurrency(po.Grand_Total)}</span>
                <div className="flex gap-1">
                  {po.Status === "Draft" && <button onClick={() => { setEditingPO(po); setSupplierCode(po.Supplier_Code); setItems(po.Items); setExpectedDelivery(po.Expected_Delivery); setNotes(po.Notes || ""); setView("create"); }} className="text-[#3b82f6] hover:text-blue-300 text-[10px] font-bold cursor-pointer">Edit</button>}
                  {po.Status === "Draft" && <button onClick={() => updatePurchaseOrder({ ...po, Status: "Sent" })} className="text-emerald-400 hover:text-emerald-300 text-[10px] font-bold cursor-pointer ml-2">Send</button>}
                  {po.Status === "Sent" && (
                    <>
                      <select value={selectedSheet} onChange={e => setSelectedSheet(e.target.value)} className="glass-select text-[10px] px-1 py-0.5 w-20">
                        <option value="">DSR Date</option>
                        {sheets.map(s => <option key={s.sheetName} value={s.date}>{s.date}</option>)}
                      </select>
                      <button onClick={() => handlePostToDSR(po)} disabled={!selectedSheet} className="text-[#ffb300] hover:text-amber-300 text-[10px] font-bold cursor-pointer ml-1 disabled:opacity-40">Post</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="glass-card p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div><label className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Supplier</label><select value={supplierCode} onChange={e => setSupplierCode(e.target.value)} className="glass-select w-full px-3 py-2.5 text-xs mt-1"><option value="">Select...</option>{suppliers.map(s => <option key={s.Supplier_Code} value={s.Supplier_Code}>{s.Supplier_Name}</option>)}</select></div>
              <div><label className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Expected Delivery</label><input type="date" value={expectedDelivery} onChange={e => setExpectedDelivery(e.target.value)} className="glass-input w-full px-3 py-2.5 text-xs mt-1" /></div>
              <div><label className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Notes</label><input value={notes} onChange={e => setNotes(e.target.value)} className="glass-input w-full px-3 py-2.5 text-xs mt-1" placeholder="Notes..." /></div>
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#8b95a5] mb-3">Add Items</h3>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {PRODUCTS.filter(p => !items.find(i => i.Item_Code === p.Item_Code)).map(p => (
                <button key={p.Item_Code} onClick={() => addItem(p)} className="w-full text-left px-3 py-2 flex justify-between items-center hover:bg-white/[0.03] transition rounded-lg">
                  <span className="text-xs text-white">{p.Item_Name}</span>
                  <div className="flex items-center gap-2"><span className="font-mono-data text-[10px] text-[#ffb300]">{formatCurrency(p.Purchase_Rate || 0)}</span><Plus size={14} className="text-emerald-400" /></div>
                </button>
              ))}
            </div>
          </div>

          {items.length > 0 && (
            <div className="glass-card overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-[#0e1322] text-left"><th className="px-3 py-2 text-[10px] uppercase text-[#8b95a5]">SKU</th><th className="px-3 py-2 text-[10px] uppercase text-[#8b95a5]">Item</th><th className="px-3 py-2 text-[10px] uppercase text-[#8b95a5] text-right">Cases</th><th className="px-3 py-2 text-[10px] uppercase text-[#8b95a5] text-right">Rate</th><th className="px-3 py-2 text-[10px] uppercase text-[#8b95a5] text-right">GST</th><th className="px-3 py-2 text-[10px] uppercase text-[#8b95a5] text-right">Total</th></tr></thead>
                <tbody>
                  {items.map(i => (
                    <tr key={i.Item_Code} className="border-b border-white/[0.04]">
                      <td className="px-3 py-2 font-mono-data text-[10px] text-[#ffb300]">{i.Item_Code}</td>
                      <td className="px-3 py-2 text-xs text-white">{i.Item_Name}</td>
                      <td className="px-3 py-2 text-right"><input type="number" value={i.Quantity_Cases} min={1} onChange={e => updateQty(i.Item_Code, Number(e.target.value))} className="glass-input w-16 px-2 py-1 text-right text-xs" /></td>
                      <td className="px-3 py-2 font-mono-data text-xs text-right">{formatCurrency(i.Purchase_Rate)}</td>
                      <td className="px-3 py-2 font-mono-data text-xs text-right text-[#8b95a5]">{i.GST_Percent}%</td>
                      <td className="px-3 py-2 font-mono-data text-xs text-[#ffb300] text-right">{formatCurrency(i.Total_Amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="glass-card p-5 sticky bottom-0">
            <div className="flex justify-between items-center mb-3">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between gap-8"><span className="text-[#8b95a5]">Subtotal</span><span className="font-mono-data text-white">{formatCurrency(totalBefore)}</span></div>
                <div className="flex justify-between gap-8"><span className="text-[#8b95a5]">GST</span><span className="font-mono-data text-white">{formatCurrency(totalGST)}</span></div>
                <div className="flex justify-between gap-8"><span className="text-white font-bold">Grand Total</span><span className="font-mono-data text-xl font-bold text-[#ffb300]">{formatCurrency(grandTotal)}</span></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleSave("Draft")} className="btn-secondary text-xs py-2.5 px-4">Save Draft</button>
                <button onClick={() => handleSave("Sent")} className="btn-amber text-xs py-2.5 px-4"><Send size={12} /> Send PO</button>
                <button onClick={() => setView("list")} className="btn-danger text-xs py-2.5 px-4">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
