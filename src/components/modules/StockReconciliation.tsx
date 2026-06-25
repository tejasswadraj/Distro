import { useState } from "react";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useERPStore } from "@/store/erpStore";
import { formatNumber } from "@/utils/math";
import type { DailyServiceRow } from "@/types";

export default function StockReconciliation() {
  const { reconciledSheets, activeSheetName, setActiveSheetName, updateSheet, rollover } = useERPStore();
  const allSheets = reconciledSheets();
  const activeSheet = allSheets.find(s => s.sheetName === activeSheetName) || allSheets[allSheets.length - 1];
  const [editingCell, setEditingCell] = useState<{ row: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState("");

  const editableFields = ["Open", "Primary", "Counter_Sale", "Sinhgad_Load1", "Sinhgad_Load2", "Sinhgad_Load_In", "Purandar_Load1", "Purandar_Load2", "Purandar_Load_In", "Rajgad_Load1", "Rajgad_Load2", "Rajgad_Load_In"];

  const handleCellClick = (row: DailyServiceRow, field: string) => {
    if (!editableFields.includes(field)) return;
    setEditingCell({ row: row.Item_Code, field });
    setEditValue(String((row as unknown as Record<string, number>)[field]));
  };

  const handleCellSave = () => {
    if (!editingCell || !activeSheet) return;
    const val = Number(editValue);
    if (isNaN(val)) { setEditingCell(null); return; }
    const updatedRows = activeSheet.rows.map(r => {
      if (r.Item_Code !== editingCell.row) return r;
      return { ...r, [editingCell.field]: val };
    });
    updateSheet({ ...activeSheet, rows: updatedRows });
    setEditingCell(null);
  };

  const sheetIdx = allSheets.findIndex(s => s.sheetName === activeSheetName);
  const goPrev = () => { if (sheetIdx > 0) setActiveSheetName(allSheets[sheetIdx - 1].sheetName); };
  const goNext = () => { if (sheetIdx < allSheets.length - 1) setActiveSheetName(allSheets[sheetIdx + 1].sheetName); };

  const routeKeys = [
    { prefix: "Sinhgad", color: "#3b82f6" },
    { prefix: "Purandar", color: "#10b981" },
    { prefix: "Rajgad", color: "#f43f5e" },
  ];

  return (
    <div className="page-transition space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Stock Reconciliation</h2>
          <p className="text-[11px] text-[#8b95a5] font-mono mt-0.5">Daily Service Sheet Management</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={goPrev} disabled={sheetIdx <= 0} className="p-2 glass-card hover:border-[#ffb300]/40 transition disabled:opacity-30 cursor-pointer"><ChevronLeft size={16} /></button>
          <span className="font-mono-data text-sm font-bold text-[#ffb300] px-3 py-2 glass-card">{activeSheetName} {activeSheet && `(${activeSheet.date})`}</span>
          <button onClick={goNext} disabled={sheetIdx >= allSheets.length - 1} className="p-2 glass-card hover:border-[#ffb300]/40 transition disabled:opacity-30 cursor-pointer"><ChevronRight size={16} /></button>
          <button onClick={rollover} className="btn-amber text-xs py-2 px-3 ml-2"><RefreshCw size={12} /> Rollover</button>
        </div>
      </div>

      {activeSheet && (
        <div className="overflow-x-auto glass-card">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-[#0e1322] text-left">
                <th className="px-2 py-2 text-[9px] uppercase tracking-wider text-[#8b95a5] sticky left-0 bg-[#0e1322] z-10">SKU</th>
                <th className="px-2 py-2 text-[9px] uppercase tracking-wider text-[#8b95a5]">Brand</th>
                <th className="px-2 py-2 text-[9px] uppercase tracking-wider text-[#8b95a5] text-right">Open</th>
                <th className="px-2 py-2 text-[9px] uppercase tracking-wider text-[#8b95a5] text-right">Primary</th>
                <th className="px-2 py-2 text-[9px] uppercase tracking-wider text-[#8b95a5] text-right">Total Open</th>
                <th className="px-2 py-2 text-[9px] uppercase tracking-wider text-[#8b95a5] text-right">Load Out</th>
                <th className="px-2 py-2 text-[9px] uppercase tracking-wider text-[#8b95a5] text-right">Load In</th>
                <th className="px-2 py-2 text-[9px] uppercase tracking-wider text-[#ffb300] text-right">Closing</th>
                <th className="px-2 py-2 text-[9px] uppercase tracking-wider text-[#8b95a5] text-right">Counter</th>
                <th className="px-2 py-2 text-[9px] uppercase tracking-wider text-[#8b95a5] text-right">Total Sale</th>
                {routeKeys.map(r => (
                  <th key={r.prefix} className="px-1 py-2 text-center" colSpan={4}><span style={{ color: r.color }} className="font-bold text-[9px]">{r.prefix}</span></th>
                ))}
              </tr>
              <tr className="bg-[#0e1322]/60 text-left border-b border-white/[0.06]">
                <th className="px-2 py-1 text-[8px] text-[#8b95a5] sticky left-0 bg-[#0e1322]/60 z-10"></th>
                <th></th>
                <th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th>
                {routeKeys.map(r => ["Open", "L1", "L2", "Sale"].map(label => (
                  <th key={`${r.prefix}-${label}`} className="px-1 py-1 text-[8px] text-center" style={{ color: r.color }}>{label}</th>
                )))}
              </tr>
            </thead>
            <tbody>
              {activeSheet.rows.map(row => (
                <tr key={row.Item_Code} className="border-b border-white/[0.04] table-row-hover">
                  <td className="px-2 py-1.5 font-mono-data text-[9px] text-[#ffb300] sticky left-0 bg-inherit z-10">{row.Item_Code}</td>
                  <td className="px-2 py-1.5"><span className="badge-amber text-[8px]">{row.Brand}</span></td>
                  <td className="px-2 py-1.5 font-mono-data text-right text-white cursor-pointer hover:bg-white/[0.05]" onClick={() => handleCellClick(row, "Open")}>
                    {editingCell?.row === row.Item_Code && editingCell.field === "Open" ? <input value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={handleCellSave} onKeyDown={e => e.key === "Enter" && handleCellSave()} autoFocus className="glass-input w-14 px-1 py-0.5 text-right text-[10px]" /> : formatNumber(row.Open)}
                  </td>
                  <td className="px-2 py-1.5 font-mono-data text-right text-white cursor-pointer hover:bg-white/[0.05]" onClick={() => handleCellClick(row, "Primary")}>
                    {editingCell?.row === row.Item_Code && editingCell.field === "Primary" ? <input value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={handleCellSave} onKeyDown={e => e.key === "Enter" && handleCellSave()} autoFocus className="glass-input w-14 px-1 py-0.5 text-right text-[10px]" /> : formatNumber(row.Primary)}
                  </td>
                  <td className="px-2 py-1.5 font-mono-data text-right text-[#8b95a5]">{formatNumber(row.Total_Open)}</td>
                  <td className="px-2 py-1.5 font-mono-data text-right text-rose-400">{formatNumber(row.Total_Load_Out)}</td>
                  <td className="px-2 py-1.5 font-mono-data text-right text-emerald-400">{formatNumber(row.Total_Load_In)}</td>
                  <td className="px-2 py-1.5 font-mono-data text-right text-[#ffb300] font-bold">{formatNumber(row.Total_Closing)}</td>
                  <td className="px-2 py-1.5 font-mono-data text-right text-white cursor-pointer hover:bg-white/[0.05]" onClick={() => handleCellClick(row, "Counter_Sale")}>
                    {editingCell?.row === row.Item_Code && editingCell.field === "Counter_Sale" ? <input value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={handleCellSave} onKeyDown={e => e.key === "Enter" && handleCellSave()} autoFocus className="glass-input w-14 px-1 py-0.5 text-right text-[10px]" /> : formatNumber(row.Counter_Sale)}
                  </td>
                  <td className="px-2 py-1.5 font-mono-data text-right text-emerald-400">{formatNumber(row.Total_Sale)}</td>
                  {routeKeys.map(r => {
                    const prefix = r.prefix;
                    return ["Open", "Load1", "Load2", "Sale"].map(field => {
                      const fullField = `${prefix}_${field}`;
                      const val = (row as unknown as Record<string, number>)[fullField] || 0;
                      const isEditable = field === "Load1" || field === "Load2" || field === "Load_In";
                      return (
                        <td key={fullField} className={`px-1 py-1.5 font-mono-data text-center ${isEditable ? "cursor-pointer hover:bg-white/[0.05]" : ""}`} style={{ color: r.color }} onClick={isEditable ? () => handleCellClick(row, fullField) : undefined}>
                          {editingCell?.row === row.Item_Code && editingCell.field === fullField ? <input value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={handleCellSave} onKeyDown={e => e.key === "Enter" && handleCellSave()} autoFocus className="glass-input w-10 px-0.5 py-0.5 text-center text-[10px]" /> : formatNumber(val)}
                        </td>
                      );
                    });
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
