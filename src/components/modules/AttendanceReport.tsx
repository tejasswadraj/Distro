import { useState, useMemo } from "react";
import { UserCheck, UserX, UserMinus } from "lucide-react";
import { useERPStore } from "@/store/erpStore";
import type { AttendanceRecord } from "@/types";

export default function AttendanceReport() {
  const { attendanceLog, employees, setAttendanceLog, activeDateString } = useERPStore();
  const today = activeDateString();
  const [selectedDate, setSelectedDate] = useState(today);

  const todayLog = useMemo(() =>
    attendanceLog.filter(a => a.date === selectedDate),
  [attendanceLog, selectedDate]);

  const stats = useMemo(() => ({
    present: todayLog.filter(a => a.status === "Present").length,
    absent: todayLog.filter(a => a.status === "Absent").length,
    half: todayLog.filter(a => a.status === "Half-Day").length,
  }), [todayLog]);

  const toggleStatus = (record: AttendanceRecord) => {
    const next: AttendanceRecord["status"][] = ["Present", "Half-Day", "Absent"];
    const currentIdx = next.indexOf(record.status);
    const newStatus = next[(currentIdx + 1) % next.length];
    setAttendanceLog(attendanceLog.map(a => a.name === record.name && a.date === record.date ? { ...a, status: newStatus, hours: newStatus === "Present" ? 12 : newStatus === "Half-Day" ? 4 : 0 } : a));
  };

  const statusIcon = (s: string) => {
    if (s === "Present") return <UserCheck size={14} className="text-emerald-400" />;
    if (s === "Absent") return <UserX size={14} className="text-rose-400" />;
    return <UserMinus size={14} className="text-amber-400" />;
  };

  return (
    <div className="page-transition space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white tracking-tight">Daily Shift Roster</h2>
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="glass-input px-3 py-2 text-xs" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4 text-center"><UserCheck size={16} className="text-emerald-400 mx-auto mb-1" /><div className="font-mono-data text-xl font-bold text-emerald-400">{stats.present}</div><div className="text-[9px] text-[#8b95a5] uppercase">Present</div></div>
        <div className="glass-card p-4 text-center"><UserMinus size={16} className="text-amber-400 mx-auto mb-1" /><div className="font-mono-data text-xl font-bold text-amber-400">{stats.half}</div><div className="text-[9px] text-[#8b95a5] uppercase">Half Day</div></div>
        <div className="glass-card p-4 text-center"><UserX size={16} className="text-rose-400 mx-auto mb-1" /><div className="font-mono-data text-xl font-bold text-rose-400">{stats.absent}</div><div className="text-[9px] text-[#8b95a5] uppercase">Absent</div></div>
      </div>

      <div className="space-y-2">
        {employees.map(emp => {
          const log = todayLog.find(a => a.name === emp.Name);
          return (
            <button key={emp.Id} onClick={() => log && toggleStatus(log)}
              className={`w-full text-left glass-card p-4 flex items-center gap-4 transition hover:border-white/[0.12] cursor-pointer ${!log ? "opacity-50" : ""}`}>
              <div className="p-2.5 rounded-xl bg-white/[0.03]">{statusIcon(log?.status || "Absent")}</div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white">{emp.Name}</div>
                <div className="text-[11px] text-[#8b95a5]">{emp.Role}</div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-bold ${log?.status === "Present" ? "text-emerald-400" : log?.status === "Half-Day" ? "text-amber-400" : "text-rose-400"}`}>
                  {log?.status || "Not Logged"}
                </span>
                <div className="font-mono-data text-[10px] text-[#8b95a5]">{log?.hours || 0} hrs</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
