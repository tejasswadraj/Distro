import { useState, useMemo } from "react";
import { Search, Plus, Trash2, Save, AlertCircle, CheckCircle } from "lucide-react";
import { useERPStore } from "@/store/erpStore";
import { PRODUCTS } from "@/data/masterData";
import { getCalculatedPrice, verifyInvoiceBalance, getNextBillId, formatCurrency } from "@/utils/math";
import type { SalesInvoice } from "@/types";

interface CartItem {
  Item_Code: string;
  Item_Name: string;
  Brand: string;
  Case_Pack: number;
  cases: number;
  unitPrice: number;
  scheme: string;
  total: number;
}

export default function BillingEngine() {
  const { invoices, addInvoice, activeDateString } = useERPStore();
  const [route, setRoute] = useState<SalesInvoice["Route"]>("Sinhgad");
  const [customerCode, setCustomerCode] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [cash, setCash] = useState(0);
  const [upi, setUpi] = useState(0);
  const [cheque, setCheque] = useState(0);

  const customers = useERPStore(s => s.customers);
  const filteredCustomers = useMemo(() =>
    customers.filter(c => c.Customer_Name.toLowerCase().includes(search.toLowerCase()) || c.Customer_Code.includes(search)),
  [customers, search]);

  const selectedCustomer = customers.find(c => c.Customer_Code === customerCode);

  const addToCart = (product: typeof PRODUCTS[0]) => {
    if (cart.find(i => i.Item_Code === product.Item_Code)) return;
    const price = getCalculatedPrice(customerCode, product.Item_Code);
    const scheme = product.Offer_Active ? `${product.Offer_Buy_Qty}+${product.Offer_Free_Qty}` : "";
    setCart(prev => [...prev, {
      Item_Code: product.Item_Code, Item_Name: product.Item_Name, Brand: product.Brand,
      Case_Pack: product.Case_Pack, cases: 1, unitPrice: price, scheme, total: price,
    }]);
  };

  const updateQty = (code: string, qty: number) => {
    setCart(prev => prev.map(i => {
      if (i.Item_Code !== code) return i;
      const total = qty * i.unitPrice;
      return { ...i, cases: qty, total };
    }));
  };

  const removeFromCart = (code: string) => setCart(prev => prev.filter(i => i.Item_Code !== code));

  const subtotal = cart.reduce((s, i) => s + i.total, 0);
  const gst = cart.reduce((s, i) => {
    const product = PRODUCTS.find(p => p.Item_Code === i.Item_Code);
    return s + (i.total * (product?.GST_Percent || 0) / 100);
  }, 0);
  const grandTotal = subtotal + gst;

  const auditStatus = verifyInvoiceBalance({
    TotalAmount: grandTotal, CashReceived: cash, UPIReceived: upi, ChequeReceived: cheque,
    CreditAmount: Math.max(0, grandTotal - cash - upi - cheque),
  } as Omit<SalesInvoice, "AuditStatus">);

  const handleSave = () => {
    if (!selectedCustomer || cart.length === 0) return;
    const credit = Math.max(0, grandTotal - cash - upi - cheque);
    const paymentStatus: SalesInvoice["PaymentStatus"] = credit <= 0 ? "Paid" : (cash + upi + cheque > 0 ? "Partial" : "Pending");

    const newInvoice: SalesInvoice = {
      BillId: getNextBillId(invoices), Date: activeDateString(),
      CustomerCode: selectedCustomer.Customer_Code, CustomerName: selectedCustomer.Customer_Name,
      Route: route, Items: Object.fromEntries(cart.map(i => [i.Item_Code, i.cases])),
      UnitPrices: Object.fromEntries(cart.map(i => [i.Item_Code, i.unitPrice])),
      TotalAmount: grandTotal, CashReceived: cash, UPIReceived: upi, ChequeReceived: cheque,
      CreditAmount: credit, PaymentStatus: paymentStatus, AuditStatus: auditStatus,
      Time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      Status: "Delivered",
    };
    addInvoice(newInvoice);
    setCart([]); setCustomerCode(""); setSearch(""); setCash(0); setUpi(0); setCheque(0);
  };

  const filteredProducts = useMemo(() =>
    PRODUCTS.filter(p => !cart.find(c => c.Item_Code === p.Item_Code) &&
      (p.Item_Name.toLowerCase().includes(search.toLowerCase()) || p.Item_Code.toLowerCase().includes(search.toLowerCase()))),
  [cart, search]);

  return (
    <div className="page-transition space-y-4">
      <h2 className="text-lg font-bold text-white tracking-tight">Sales Billing</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Customer & Meta */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card p-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b95a5] mb-2 block">Route</label>
            <div className="grid grid-cols-2 gap-1">
              {(["Sinhgad", "Purandar", "Rajgad", "Counter"] as const).map(r => (
                <button key={r} onClick={() => setRoute(r)}
                  className={`py-2 rounded-lg text-xs font-bold transition ${route === r ? "bg-[#ffb300] text-black" : "bg-white/[0.03] text-[#8b95a5] hover:text-white"}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b95a5] mb-2 block">Customer</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b95a5]" />
              <input value={search} onChange={e => { setSearch(e.target.value); setCustomerCode(""); }}
                className="glass-input w-full pl-9 pr-3 py-2.5 text-xs" placeholder="Search customer..." />
            </div>
            {search && !customerCode && (
              <div className="mt-1 max-h-40 overflow-y-auto glass-panel rounded-lg">
                {filteredCustomers.map(c => (
                  <button key={c.Customer_Code} onClick={() => { setCustomerCode(c.Customer_Code); setSearch(c.Customer_Name); }}
                    className="w-full text-left px-3 py-2 text-xs text-white hover:bg-white/[0.05] transition">
                    <span className="font-bold">{c.Customer_Name}</span>
                    <span className="text-[#8b95a5] ml-2">#{c.Customer_Code}</span>
                  </button>
                ))}
              </div>
            )}
            {selectedCustomer && (
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-[#8b95a5]">Credit Limit</span><span className="font-mono-data">{formatCurrency(selectedCustomer.Credit_Limit || 0)}</span></div>
                <div className="flex justify-between"><span className="text-[#8b95a5]">Beat</span><span className="badge-blue">{selectedCustomer.Beat}</span></div>
              </div>
            )}
          </div>

          <div className="glass-card p-4 space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b95a5] block">Payment</label>
            {[
              { label: "Cash", value: cash, setter: setCash },
              { label: "UPI", value: upi, setter: setUpi },
              { label: "Cheque", value: cheque, setter: setCheque },
            ].map(p => (
              <div key={p.label} className="flex items-center justify-between">
                <span className="text-xs text-[#8b95a5]">{p.label}</span>
                <input type="number" value={p.value || ""} onChange={e => p.setter(Number(e.target.value))}
                  className="glass-input w-28 px-2 py-1.5 text-right text-xs" min={0} />
              </div>
            ))}
          </div>
        </div>

        {/* SKU Scanner & Cart */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card p-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b95a5]" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-3 text-sm text-center placeholder:text-[#8b95a5]/50"
                placeholder="Scan SKU or type item name..." />
            </div>
          </div>

          {search && filteredProducts.length > 0 && (
            <div className="glass-card max-h-48 overflow-y-auto">
              {filteredProducts.map(p => (
                <button key={p.Item_Code} onClick={() => addToCart(p)}
                  className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-white/[0.03] transition border-b border-white/[0.04] last:border-0">
                  <div>
                    <div className="text-xs font-bold text-white">{p.Item_Name}</div>
                    <div className="text-[10px] text-[#8b95a5] font-mono-data">{p.Item_Code} | {p.Brand}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.Offer_Active && <span className="badge-blue text-[9px]">{p.Offer_Buy_Qty}+{p.Offer_Free_Qty}</span>}
                    <span className="text-xs font-mono-data text-[#ffb300]">{formatCurrency(p.Sale_Rate_Wholesale || 0)}</span>
                    <Plus size={14} className="text-emerald-400" />
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="glass-card overflow-hidden">
            <div className="px-4 py-3 bg-[#0e1322] border-b border-white/[0.06] flex justify-between items-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b95a5]">Cart ({cart.length})</span>
            </div>
            {cart.length === 0 ? (
              <div className="p-8 text-center text-[#8b95a5] text-sm">Add items to cart</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#0e1322] text-left">
                      <th className="px-3 py-2 text-[10px] uppercase tracking-wider text-[#8b95a5]">SKU</th>
                      <th className="px-3 py-2 text-[10px] uppercase tracking-wider text-[#8b95a5]">Item</th>
                      <th className="px-3 py-2 text-[10px] uppercase tracking-wider text-[#8b95a5]">Scheme</th>
                      <th className="px-3 py-2 text-[10px] uppercase tracking-wider text-[#8b95a5] text-right">Cases</th>
                      <th className="px-3 py-2 text-[10px] uppercase tracking-wider text-[#8b95a5] text-right">Price</th>
                      <th className="px-3 py-2 text-[10px] uppercase tracking-wider text-[#8b95a5] text-right">Total</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.Item_Code} className="border-b border-white/[0.04] table-row-hover">
                        <td className="px-3 py-2 font-mono-data text-[10px] text-[#ffb300]">{item.Item_Code}</td>
                        <td className="px-3 py-2 text-xs text-white">{item.Item_Name}</td>
                        <td className="px-3 py-2">{item.scheme && <span className="badge-blue text-[9px]">{item.scheme}</span>}</td>
                        <td className="px-3 py-2 text-right">
                          <input type="number" value={item.cases} min={1} onChange={e => updateQty(item.Item_Code, Number(e.target.value))}
                            className="glass-input w-16 px-2 py-1 text-right text-xs" />
                        </td>
                        <td className="px-3 py-2 font-mono-data text-xs text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-3 py-2 font-mono-data text-xs text-[#ffb300] text-right">{formatCurrency(item.total)}</td>
                        <td className="px-3 py-2">
                          <button onClick={() => removeFromCart(item.Item_Code)} className="text-rose-400 hover:text-rose-300 transition cursor-pointer"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Totals */}
        <div className="lg:col-span-3">
          <div className="glass-card p-5 sticky top-6 space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8b95a5]">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#8b95a5]">Subtotal</span><span className="font-mono-data text-white">{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-[#8b95a5]">GST</span><span className="font-mono-data text-white">{formatCurrency(gst)}</span></div>
              <div className="h-px bg-white/[0.06]" />
              <div className="flex justify-between"><span className="text-white font-bold">Grand Total</span><span className="font-mono-data text-xl font-bold text-[#ffb300]">{formatCurrency(grandTotal)}</span></div>
              <div className="h-px bg-white/[0.06]" />
              <div className="flex justify-between"><span className="text-[#8b95a5]">Credit</span><span className="font-mono-data text-rose-400">{formatCurrency(Math.max(0, grandTotal - cash - upi - cheque))}</span></div>
            </div>

            <div className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold ${auditStatus === "OK" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
              {auditStatus === "OK" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
              {auditStatus === "OK" ? "Balance OK" : "Balance Error"}
            </div>

            <button onClick={handleSave} disabled={!selectedCustomer || cart.length === 0}
              className="btn-amber w-full text-sm py-3 disabled:opacity-50 disabled:cursor-not-allowed">
              <Save size={14} /> Print & Save
            </button>
            <button onClick={() => { setCart([]); setCash(0); setUpi(0); setCheque(0); }}
              className="btn-secondary w-full text-sm py-2.5">
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
