import { Building2, Clock, Menu, X } from "lucide-react";
import { useERPStore } from "@/store/erpStore";
import type { Role } from "@/types";

export default function Header() {
  const { activeRole, setActiveRole, isMobileMenuOpen, setMobileMenuOpen, isSyncing } = useERPStore();

  return (
    <header className="fixed top-0 w-full h-16 z-40 flex items-center justify-between px-4 md:px-6 bg-[#080b14]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#ffb300]/10 border border-[#ffb300]/30">
          <Building2 size={18} className="text-[#ffb300]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffb300] font-mono">Swadraj Agencies</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-sm font-bold tracking-tight text-white">Distribution ERP</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 bg-[#0e1322] border border-white/[0.06] p-1 rounded-xl">
          <span className="text-[9px] font-bold text-[#8b95a5] uppercase px-2 font-mono">ACCESS:</span>
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value as Role)}
            className="bg-[#080b14] text-xs font-bold text-[#ffb300] border-0 rounded-lg py-1 px-3 focus:ring-1 focus:ring-[#ffb300] outline-none cursor-pointer"
          >
            <option value="Admin">Office Manager</option>
            <option value="Warehouse">Warehouse Staff</option>
            <option value="Logistics">Logistics Team</option>
          </select>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-[#0e1322]/60 px-3 py-1.5 rounded-lg border border-white/[0.06] text-[#8b95a5] text-xs font-mono">
          <Clock size={12} className="text-[#ffb300]" />
          <span>08:00 - 20:00</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 sync-badge">
          <span className={`w-1.5 h-1.5 rounded-full ${isSyncing ? "bg-amber-400 animate-pulse" : "bg-emerald-500 animate-pulse"}`} />
          <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-emerald-400">
            {isSyncing ? "Syncing..." : "Live Sync"}
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-[#0e1322] border border-white/[0.06] text-[#8b95a5] hover:text-white rounded-lg md:hidden transition active:scale-95 cursor-pointer"
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </header>
  );
}
