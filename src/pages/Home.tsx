import { useEffect } from "react";
import { useERPStore } from "@/store/erpStore";
import AuroraBackground from "@/components/layout/AuroraBackground";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/components/modules/Dashboard";
import BillingEngine from "@/components/modules/BillingEngine";
import ARCollections from "@/components/modules/ARCollections";
import RegisterOutlet from "@/components/modules/RegisterOutlet";
import FinanceDesk from "@/components/modules/FinanceDesk";
import PayrollManagement from "@/components/modules/PayrollManagement";
import SupplierPurchases from "@/components/modules/SupplierPurchases";
import ConnectedRegistries from "@/components/modules/ConnectedRegistries";
import Inventory from "@/components/modules/Inventory";
import StockReconciliation from "@/components/modules/StockReconciliation";
import ServiceReport from "@/components/modules/ServiceReport";
import DailyReports from "@/components/modules/DailyReports";
import LogReport from "@/components/modules/LogReport";

export default function Home() {
  const { activeTab, init } = useERPStore();

  useEffect(() => {
    init();
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard />;
      case "billing": return <BillingEngine />;
      case "ar": return <ARCollections />;
      case "register-outlet": return <RegisterOutlet />;
      case "finance": return <FinanceDesk />;
      case "payroll": return <PayrollManagement />;
      case "procurement": return <SupplierPurchases />;
      case "registries": return <ConnectedRegistries />;
      case "inventory": return <Inventory />;
      case "reconcile": return <StockReconciliation />;
      case "service-report": return <ServiceReport />;
      case "daily-reports": return <DailyReports />;
      case "log-report": return <LogReport />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080b14] text-white flex flex-col font-sans selection:bg-[#ffb300]/20">
      <AuroraBackground />
      <Header />
      <div className="flex-1 flex flex-col md:flex-row relative pt-16">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto relative z-10">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}
