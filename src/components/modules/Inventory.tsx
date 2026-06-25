import { useMemo } from "react";
import { Package, AlertTriangle, TrendingUp } from "lucide-react";
import { useERPStore } from "@/store/erpStore";
import { formatNumber } from "@/utils/math";
import DataTable from "@/components/shared/DataTable";
import type { DailyServiceRow } from "@/types";

export default function Inventory() {
  const { reconciledSheets, activeSheetName } = useERPStore();
  const sheets = reconciledSheets();
  const activeSheet = sheets.find(s => s.sheetName === activeSheetName) || sheets[sheets.length - 1];

  const stockSummary = useMemo(() => {
    if (!activeSheet) return { total: 0, low: 0, byBrand: {} as Record<string, number> };
    const total = activeSheet.rows.reduce((s, r) => s + r.Total_Closing, 0);
    const low = activeSheet.rows.filter(r => r.Total_Closing < 20).length;
    const byBrand: Record<string, number> = {};
    activeSheet.rows.forEach(r => { byBrand[r.Brand] = (byBrand[r.Brand] || 0) + r.Total_Closing; });
    return { total, low, byBrand };
  }, [activeSheet]);

  return (
    <div className="page-transition space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Stock Holding</h2>
          <p className="text-[11px] text-[#8b95a5] font-mono mt-0.5">Sheet: {activeSheetName} | {activeSheet?.date || "N/A"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card"><div className="flex items-center gap-2 mb-2"><Package size={14} className="text-[#ffb300]" /><span className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Total Stock</span></div><div className="font-mono-data text-2xl font-bold text-white">{formatNumber(stockSummary.total)} <span className="text-sm text-[#8b95a5]">cases</span></div></div>
        <div className="stat-card"><div className="flex items-center gap-2 mb-2"><AlertTriangle size={14} className="text-rose-400" /><span className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Low Stock</span></div><div className="font-mono-data text-2xl font-bold text-rose-400">{stockSummary.low} <span className="text-sm text-[#8b95a5]">SKUs</span></div></div>
        <div className="stat-card"><div className="flex items-center gap-2 mb-2"><TrendingUp size={14} className="text-emerald-400" /><span className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">Brands</span></div><div className="font-mono-data text-2xl font-bold text-emerald-400">{Object.keys(stockSummary.byBrand).length} <span className="text-sm text-[#8b95a5]">active</span></div></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(stockSummary.byBrand).map(([brand, qty]) => (
          <div key={brand} className="glass-card p-3 flex justify-between items-center">
            <span className="text-xs font-bold text-white">{brand}</span>
            <span className="font-mono-data text-xs text-[#ffb300]">{formatNumber(qty)} cases</span>
          </div>
        ))}
      </div>

      {activeSheet && (
        <DataTable
          columns={[
            { key: "Brand", header: "Brand", render: (r: DailyServiceRow) => <span className="badge-amber text-[10px]">{r.Brand}</span> },
            { key: "Net_Qty", header: "SKU", className: "text-xs text-white" },
            { key: "Item_Code", header: "Code", className: "font-mono-data text-[10px] text-[#ffb300]" },
            { key: "Total_Closing", header: "Closing", className: "font-mono-data text-right font-bold", render: (r: DailyServiceRow) => <span className={r.Total_Closing < 20 ? "text-rose-400" : "text-white"}>{formatNumber(r.Total_Closing)}</span> },
            { key: "Total_Sale", header: "Today Sales", className: "font-mono-data text-right text-emerald-400", render: (r: DailyServiceRow) => formatNumber(r.Total_Sale) },
            { key: "Counter_Sale", header: "Counter", className: "font-mono-data text-right text-[#8b95a5]", render: (r: DailyServiceRow) => formatNumber(r.Counter_Sale) },
            { key: "Case_Pack", header: "Pack", className: "font-mono-data text-right text-[#8b95a5]", render: (r: DailyServiceRow) => `${r.Case_Pack}pc` },
          ]}
          data={activeSheet.rows}
          keyExtractor={r => r.Item_Code}
        />
      )}
    </div>
  );
}
