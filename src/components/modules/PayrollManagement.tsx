import { useState, useMemo } from "react";
import { Coins, Users, TrendingUp, AlertCircle } from "lucide-react";
import { useERPStore } from "@/store/erpStore";
import { formatCurrency, generateUUID } from "@/utils/math";
import DataTable from "@/components/shared/DataTable";
import type { PayrollRecord } from "@/types";

export default function PayrollManagement() {
  const { employees, advances, payrollRecords, attendanceLog, setAdvances, setPayrollRecords } = useERPStore();
  const [showPayroll, setShowPayroll] = useState(false);
  const [selectedMonth] = useState("June 2026");

  const payrollData = useMemo(() =>
    employees.map(emp => {
      const monthAttendance = attendanceLog.filter(a => a.name === emp.Name && a.date.startsWith("2026-06"));
      const presentDays = monthAttendance.filter(a => a.status === "Present").length;
      const halfDays = monthAttendance.filter(a => a.status === "Half-Day").length;
      const effectiveDays = presentDays + halfDays * 0.5;
      const gross = effectiveDays * emp.StandardDailyWage;
      const empAdvances = advances.filter(a => a.EmployeeId === emp.Id && a.Status === "Pending");
      const advanceDeduction = empAdvances.reduce((s, a) => s + a.Amount, 0);
      const netPayout = Math.max(0, gross - advanceDeduction);
      return { emp, presentDays, halfDays, gross, advanceDeduction, netPayout, empAdvances };
    }),
  [employees, attendanceLog, advances]);

  const handleProcessPayroll = () => {
    const newRecords: PayrollRecord[] = payrollData.map(pd => ({
      Id: generateUUID(), EmployeeId: pd.emp.Id, Month: selectedMonth, Year: 2026,
      TotalPresentDays: pd.presentDays, TotalHalfDays: pd.halfDays,
      GrossWages: pd.gross, TotalAdvancesDeducted: pd.advanceDeduction, NetPayout: pd.netPayout,
      PaymentStatus: "Processed",
    }));
    setPayrollRecords([...payrollRecords, ...newRecords]);
    const updatedAdvances = advances.map(a => ({ ...a, Status: a.Status === "Pending" ? "Deducted" as const : a.Status }));
    setAdvances(updatedAdvances);
    setShowPayroll(false);
  };

  return (
    <div className="page-transition space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white tracking-tight">Staff & Payroll Node</h2>
        <button onClick={() => setShowPayroll(true)} className="btn-amber text-xs py-2 px-4"><Coins size={14} /> Process Payroll</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4"><Users size={14} className="text-[#ffb300] mb-1" /><div className="font-mono-data text-xl font-bold text-white">{employees.length}</div><div className="text-[9px] text-[#8b95a5] uppercase">Employees</div></div>
        <div className="glass-card p-4"><TrendingUp size={14} className="text-emerald-400 mb-1" /><div className="font-mono-data text-xl font-bold text-emerald-400">{formatCurrency(payrollData.reduce((s, p) => s + p.gross, 0))}</div><div className="text-[9px] text-[#8b95a5] uppercase">Total Gross</div></div>
        <div className="glass-card p-4"><AlertCircle size={14} className="text-rose-400 mb-1" /><div className="font-mono-data text-xl font-bold text-rose-400">{formatCurrency(payrollData.reduce((s, p) => s + p.advanceDeduction, 0))}</div><div className="text-[9px] text-[#8b95a5] uppercase">Advances</div></div>
        <div className="glass-card p-4"><Coins size={14} className="text-blue-400 mb-1" /><div className="font-mono-data text-xl font-bold text-blue-400">{formatCurrency(payrollData.reduce((s, p) => s + p.netPayout, 0))}</div><div className="text-[9px] text-[#8b95a5] uppercase">Net Payout</div></div>
      </div>

      <DataTable
        columns={[
          { key: "Name", header: "Employee", className: "text-xs text-white font-semibold", render: (pd: typeof payrollData[0]) => pd.emp.Name },
          { key: "Role", header: "Role", className: "text-[10px] text-[#8b95a5]", render: (pd: typeof payrollData[0]) => pd.emp.Role },
          { key: "presentDays", header: "Present", className: "font-mono-data text-emerald-400 text-right", render: (pd: typeof payrollData[0]) => pd.presentDays },
          { key: "halfDays", header: "Half", className: "font-mono-data text-amber-400 text-right", render: (pd: typeof payrollData[0]) => pd.halfDays },
          { key: "gross", header: "Gross", className: "font-mono-data text-right", render: (pd: typeof payrollData[0]) => formatCurrency(pd.gross) },
          { key: "advanceDeduction", header: "Adv Ded", className: "font-mono-data text-rose-400 text-right", render: (pd: typeof payrollData[0]) => formatCurrency(pd.advanceDeduction) },
          { key: "netPayout", header: "Net Pay", className: "font-mono-data text-[#ffb300] text-right font-bold", render: (pd: typeof payrollData[0]) => formatCurrency(pd.netPayout) },
        ]}
        data={payrollData}
        keyExtractor={pd => pd.emp.Id}
      />

      {showPayroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowPayroll(false)}>
          <div className="glass-panel rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-white mb-4">Process Payroll - {selectedMonth}</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {payrollData.map(pd => (
                <div key={pd.emp.Id} className="flex justify-between items-center px-3 py-2 bg-white/[0.02] rounded-lg">
                  <div><span className="text-xs text-white font-bold">{pd.emp.Name}</span><span className="text-[10px] text-[#8b95a5] ml-2">{pd.presentDays}P / {pd.halfDays}H</span></div>
                  <span className="font-mono-data text-xs text-[#ffb300]">{formatCurrency(pd.netPayout)}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleProcessPayroll} className="btn-amber flex-1 text-xs py-2.5">Confirm & Process</button>
              <button onClick={() => setShowPayroll(false)} className="btn-secondary flex-1 text-xs py-2.5">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
