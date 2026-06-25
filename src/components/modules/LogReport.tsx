import { useMemo } from "react";
import { Activity, ShoppingCart, FileText, TrendingDown, Package, UserPlus } from "lucide-react";
import { useERPStore } from "@/store/erpStore";
import { formatCurrency } from "@/utils/math";

interface LogEntry {
  id: string;
  timestamp: string;
  type: "sale" | "expense" | "po" | "collection" | "customer" | "roster";
  title: string;
  description: string;
  amount?: number;
  date: string;
}

export default function LogReport() {
  const { invoices, expenses, purchaseOrders, collections } = useERPStore();

  const logs = useMemo<LogEntry[]>(() => {
    const entries: LogEntry[] = [];
    invoices.forEach(inv => {
      entries.push({
        id: `inv_${inv.BillId}`, timestamp: `${inv.Date} ${inv.Time || "12:00"}`,
        type: "sale", title: `Invoice #${inv.BillId}`,
        description: `${inv.CustomerName} (${inv.Route}) - ${Object.values(inv.Items).reduce((a, b) => a + b, 0)} cases`,
        amount: inv.TotalAmount, date: inv.Date,
      });
    });
    expenses.forEach(exp => {
      entries.push({
        id: `exp_${exp.Id}`, timestamp: exp.Date,
        type: "expense", title: exp.Category,
        description: exp.Description, amount: exp.Amount, date: exp.Date,
      });
    });
    purchaseOrders.forEach(po => {
      entries.push({
        id: `po_${po.PO_Number}`, timestamp: po.Date,
        type: "po", title: `PO ${po.PO_Number}`,
        description: `${po.Supplier_Name} - ${po.Items.length} SKUs`, amount: po.Grand_Total, date: po.Date,
      });
    });
    collections.forEach(col => {
      entries.push({
        id: `col_${col.Id}`, timestamp: `${col.Date} 12:00`,
        type: "collection", title: "Collection",
        description: `${col.CustomerName} via ${col.Method}`, amount: col.AmountCollected, date: col.Date,
      });
    });
    return entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [invoices, expenses, purchaseOrders, collections]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, LogEntry[]> = {};
    logs.forEach(l => { if (!groups[l.date]) groups[l.date] = []; groups[l.date].push(l); });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [logs]);

  const typeConfig: Record<string, { icon: React.ElementType; color: string; borderColor: string }> = {
    sale: { icon: ShoppingCart, color: "#3b82f6", borderColor: "border-l-[#3b82f6]" },
    expense: { icon: TrendingDown, color: "#f43f5e", borderColor: "border-l-[#f43f5e]" },
    po: { icon: Package, color: "#10b981", borderColor: "border-l-[#10b981]" },
    collection: { icon: FileText, color: "#ffb300", borderColor: "border-l-[#ffb300]" },
    customer: { icon: UserPlus, color: "#8b5cf6", borderColor: "border-l-[#8b5cf6]" },
    roster: { icon: Activity, color: "#8b95a5", borderColor: "border-l-[#8b95a5]" },
  };

  return (
    <div className="page-transition space-y-6">
      <h2 className="text-lg font-bold text-white tracking-tight">Operational Log Report</h2>

      <div className="space-y-6">
        {groupedByDate.map(([date, entries]) => (
          <div key={date}>
            <div className="sticky top-0 bg-[#080b14]/90 backdrop-blur z-10 py-2 mb-3">
              <span className="text-[#ffb300] text-[11px] font-bold uppercase tracking-widest font-mono">{date}</span>
              <span className="text-[#8b95a5] text-[10px] ml-3">{entries.length} events</span>
            </div>
            <div className="space-y-2">
              {entries.map(entry => {
                const config = typeConfig[entry.type];
                const Icon = config.icon;
                return (
                  <div key={entry.id} className={`glass-card p-4 border-l-2 ${config.borderColor} rounded-r-xl flex items-start gap-3`}>
                    <div className="p-1.5 rounded-lg mt-0.5" style={{ background: `${config.color}15` }}>
                      <Icon size={14} style={{ color: config.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{entry.title}</span>
                        <span className="font-mono-data text-[10px] text-[#8b95a5]">{entry.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[#8b95a5] mt-0.5">{entry.description}</p>
                    </div>
                    {entry.amount !== undefined && (
                      <span className="font-mono-data text-xs font-bold text-white">{formatCurrency(entry.amount)}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
