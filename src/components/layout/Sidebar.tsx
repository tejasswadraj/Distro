import {
  LayoutDashboard, ReceiptIndianRupee, UserSquare, Building2,
  Coins, Users, Truck, Server, Database, ClipboardCheck,
  ListOrdered, FileText, Activity, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useERPStore } from "@/store/erpStore";
import type { NavTab } from "@/types";

const ICONS: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard,
  billing: ReceiptIndianRupee,
  ar: UserSquare,
  "register-outlet": Building2,
  finance: Coins,
  payroll: Users,
  procurement: Truck,
  registries: Server,
  inventory: Database,
  reconcile: ClipboardCheck,
  "service-report": ListOrdered,
  "daily-reports": FileText,
  "log-report": Activity,
};

const SECTIONS: { label: string; emoji: string; tabs: NavTab[] }[] = [
  { label: "Office Operations", emoji: "\uD83D\uDDA5", tabs: ["dashboard", "billing", "ar", "register-outlet", "finance", "payroll", "procurement", "registries"] },
  { label: "Warehouse Deck", emoji: "\uD83D\uDCE6", tabs: ["inventory", "reconcile"] },
  { label: "Service & Fleet", emoji: "\uD83D\uDE9B", tabs: ["service-report"] },
  { label: "Reports & Audit", emoji: "\uD83D\uDCCA", tabs: ["daily-reports", "log-report"] },
];

const TAB_LABELS: Record<NavTab, string> = {
  dashboard: "Dashboard",
  billing: "Sales Billing",
  ar: "Ledger & Outstanding",
  "register-outlet": "Outlet Master",
  finance: "Cash & Finance",
  payroll: "Staff & Payroll",
  procurement: "Supplier Purchase",
  registries: "Master Registries",
  inventory: "Stock Holding",
  reconcile: "Stock Reconciliation",
  "service-report": "Vehicle Dispatch",
  "daily-reports": "Daily Sales Sheets",
  "log-report": "Operational Log",
};

export default function Sidebar() {
  const { activeTab, setActiveTab, activeRole, isSidebarCollapsed, setSidebarCollapsed, isMobileMenuOpen, setMobileMenuOpen } = useERPStore();

  const visibleTabs = activeRole === "Admin"
    ? new Set(SECTIONS.flatMap(s => s.tabs))
    : activeRole === "Warehouse"
    ? new Set(["inventory", "reconcile"])
    : new Set(["service-report"]);

  const visibleSections = SECTIONS.map(s => ({
    ...s,
    tabs: s.tabs.filter(t => visibleTabs.has(t)),
  })).filter(s => s.tabs.length > 0);

  return (
    <>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
      <nav
        className={`fixed inset-y-0 left-0 z-50 bg-[#0d1117]/90 backdrop-blur-md border-r border-white/[0.06] flex flex-col justify-between shadow-2xl transition-all duration-300 ease-in-out md:static md:translate-x-0 md:flex overflow-y-auto max-h-screen ${
          isSidebarCollapsed ? "md:w-20 px-2 py-4" : "md:w-64 px-4 py-5"
        } ${isMobileMenuOpen ? "translate-x-0 w-64 px-4 py-5" : "-translate-x-full md:translate-x-0"}`}
        style={{ paddingTop: "5rem" }}
      >
        <div className="space-y-4">
          {visibleSections.map((section) => (
            <div key={section.label} className="space-y-0.5">
              <div className={`text-[10px] font-black text-[#ffb300]/70 uppercase tracking-widest font-mono py-1 mb-1 border-b border-white/[0.04] flex justify-between items-center ${isSidebarCollapsed && !isMobileMenuOpen ? "px-1" : "px-1.5"}`}>
                {isSidebarCollapsed && !isMobileMenuOpen ? (
                  <span>{section.emoji}</span>
                ) : (
                  <span>{section.emoji} {section.label}</span>
                )}
              </div>
              {section.tabs.map((tab) => {
                const Icon = ICONS[tab];
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left rounded-lg text-xs font-bold transition-all flex items-center border cursor-pointer ${
                      isActive
                        ? "bg-[#ffb300]/10 text-[#ffb300] border-[#ffb300]/20"
                        : "text-[#8b95a5] border-transparent hover:bg-white/[0.03] hover:text-white"
                    } ${isSidebarCollapsed && !isMobileMenuOpen ? "justify-center p-2.5" : "px-3 py-2.5 gap-2.5"}`}
                  >
                    {Icon && <Icon size={15} />}
                    {(!isSidebarCollapsed || isMobileMenuOpen) && <span>{TAB_LABELS[tab]}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-white/[0.06] flex flex-col gap-3">
          <button
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#0e1322] border border-white/[0.06] hover:border-[#ffb300]/40 text-[#8b95a5] hover:text-[#ffb300] transition-all active:scale-95 cursor-pointer font-mono text-[10px]"
          >
            {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            {(!isSidebarCollapsed || isMobileMenuOpen) && <span>Collapse</span>}
          </button>
        </div>
      </nav>
    </>
  );
}
