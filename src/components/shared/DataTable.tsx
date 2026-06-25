import type { ReactNode } from "react";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  maxHeight?: string;
  className?: string;
}

export default function DataTable<T>({ columns, data, keyExtractor, emptyMessage = "No data", maxHeight, className = "" }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-[#8b95a5] text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-white/[0.06] ${className}`} style={maxHeight ? { maxHeight } : undefined}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[#0e1322] text-left border-b border-white/[0.06]">
            {columns.map(col => (
              <th
                key={col.key}
                className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#8b95a5] ${col.className || ""}`}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={keyExtractor(row)}
              className="border-b border-white/[0.04] table-row-hover"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              {columns.map(col => (
                <td key={col.key} className={`px-4 py-3 text-[13px] ${col.className || ""}`}>
                  {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
