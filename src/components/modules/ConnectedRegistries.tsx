import { useState } from "react";
import { Truck, Building2, Users, FileText, Plus } from "lucide-react";
import { useERPStore } from "@/store/erpStore";
import { formatNumber, formatCurrency, generateUUID } from "@/utils/math";
import type { Vehicle, Warehouse, Employee, Supplier } from "@/types";

export default function ConnectedRegistries() {
  const { vehicles, warehouses, employees, suppliers, setVehicles, setWarehouses, setEmployees, setSuppliers } = useERPStore();
  const [activeRegistry, setActiveRegistry] = useState<"vehicles" | "warehouses" | "employees" | "suppliers">("vehicles");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  const handleSave = () => {
    if (!form.name && !form.Name) return;
    if (activeRegistry === "vehicles") {
      const v: Vehicle = editing ? { ...editing, ...form } : { ...form, Id: generateUUID() };
      setVehicles(editing ? vehicles.map(x => x.Id === v.Id ? v : x) : [...vehicles, v]);
    } else if (activeRegistry === "warehouses") {
      const w: Warehouse = editing ? { ...editing, ...form } : { ...form, Id: generateUUID() };
      setWarehouses(editing ? warehouses.map(x => x.Id === w.Id ? w : x) : [...warehouses, w]);
    } else if (activeRegistry === "employees") {
      const e: Employee = editing ? { ...editing, ...form } : { ...form, Id: generateUUID() };
      setEmployees(editing ? employees.map(x => x.Id === e.Id ? e : x) : [...employees, e]);
    } else {
      const s: Supplier = editing ? { ...editing, ...form } : { ...form, Supplier_Code: `SUP${String(suppliers.length + 1).padStart(3, "0")}` };
      setSuppliers(editing ? suppliers.map(x => x.Supplier_Code === s.Supplier_Code ? s : x) : [...suppliers, s]);
    }
    setShowForm(false); setEditing(null); setForm({});
  };

  const regConfig = {
    vehicles: { label: "Vehicles", icon: Truck, color: "#3b82f6", data: vehicles, fields: [
      { key: "Name", label: "Name", type: "text" },
      { key: "RegistrationNumber", label: "Registration", type: "text" },
      { key: "LoadCapacityCases", label: "Capacity (Cases)", type: "number" },
      { key: "Status", label: "Status", type: "select", options: ["Active", "In-field", "At-warehouse", "Breakdown"] },
    ]},
    warehouses: { label: "Warehouses", icon: Building2, color: "#10b981", data: warehouses, fields: [
      { key: "Name", label: "Name", type: "text" },
      { key: "Location", label: "Location", type: "text" },
      { key: "CapacityCases", label: "Capacity (Cases)", type: "number" },
      { key: "Status", label: "Status", type: "select", options: ["Active", "Maintenance", "Inactive"] },
    ]},
    employees: { label: "Employees", icon: Users, color: "#8b5cf6", data: employees, fields: [
      { key: "Name", label: "Name", type: "text" },
      { key: "Role", label: "Role", type: "text" },
      { key: "Department", label: "Department", type: "select", options: ["Logistics", "Sales", "Warehouse", "Admin"] },
      { key: "StandardDailyWage", label: "Daily Wage", type: "number" },
      { key: "Status", label: "Status", type: "select", options: ["Active", "Inactive", "Resigned"] },
    ]},
    suppliers: { label: "Suppliers", icon: FileText, color: "#ffb300", data: suppliers, fields: [
      { key: "Supplier_Name", label: "Name", type: "text" },
      { key: "Lead_Times", label: "Lead Time", type: "text" },
      { key: "Contact", label: "Contact", type: "text" },
      { key: "Email", label: "Email", type: "text" },
    ]},
  };

  const current = regConfig[activeRegistry];
  const Icon = current.icon;

  return (
    <div className="page-transition space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white tracking-tight">Master Registries Desk</h2>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({}); }} className="btn-amber text-xs py-2 px-4"><Plus size={14} /> Add {current.label.slice(0, -1)}</button>
      </div>

      <div className="flex gap-2">
        {(Object.keys(regConfig) as Array<keyof typeof regConfig>).map(key => {
          const R = regConfig[key];
          const RIcon = R.icon;
          return (
            <button key={key} onClick={() => setActiveRegistry(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${activeRegistry === key ? "bg-[#ffb300]/10 text-[#ffb300] border border-[#ffb300]/20" : "bg-white/[0.03] text-[#8b95a5] hover:text-white"}`}>
              <RIcon size={14} /> {R.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {current.data.map((item: any) => (
          <div key={item.Id || item.Supplier_Code} className="glass-card glow-card-hover p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl`} style={{ background: `${current.color}15`, border: `1px solid ${current.color}30` }}>
                <Icon size={18} style={{ color: current.color }} />
              </div>
              <button onClick={() => { setEditing(item); setForm(item); setShowForm(true); }} className="text-[#3b82f6] hover:text-blue-300 text-[10px] font-bold cursor-pointer">Edit</button>
            </div>
            <h3 className="text-sm font-bold text-white">{item.Name || item.Supplier_Name}</h3>
            <div className="mt-2 space-y-1 text-xs text-[#8b95a5]">
              {activeRegistry === "vehicles" && <><div className="font-mono-data">{(item as Vehicle).RegistrationNumber}</div><div>{formatNumber((item as Vehicle).LoadCapacityCases)} cases capacity</div><span className={`inline-block mt-1 ${(item as Vehicle).Status === "At-warehouse" ? "badge-emerald" : "badge-amber"}`}>{(item as Vehicle).Status}</span></>}
              {activeRegistry === "warehouses" && <><div>{(item as Warehouse).Location}</div><div className="font-mono-data">{formatNumber((item as Warehouse).CapacityCases)} cases</div><span className={`inline-block mt-1 ${(item as Warehouse).Status === "Active" ? "badge-emerald" : "badge-amber"}`}>{(item as Warehouse).Status}</span></>}
              {activeRegistry === "employees" && <><div>{(item as Employee).Role}</div><div className="font-mono-data">{formatCurrency((item as Employee).StandardDailyWage)}/day</div><span className={`inline-block mt-1 ${(item as Employee).Status === "Active" ? "badge-emerald" : "badge-rose"}`}>{(item as Employee).Status}</span></>}
              {activeRegistry === "suppliers" && <><div className="font-mono-data">{(item as Supplier).Lead_Times}</div><div>{(item as Supplier).Contact}</div></>}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="glass-panel rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-white mb-4">{editing ? "Edit" : "New"} {current.label.slice(0, -1)}</h3>
            <div className="grid grid-cols-1 gap-3">
              {current.fields.map(f => (
                <div key={f.key}>
                  <label className="text-[10px] uppercase tracking-wider text-[#8b95a5] font-bold">{f.label}</label>
                  {f.type === "select" ? (
                    <select value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="glass-select w-full px-3 py-2 text-xs mt-1">
                      <option value="">Select...</option>
                      {(f as any).options?.map((o: string) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })} className="glass-input w-full px-3 py-2 text-xs mt-1" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSave} className="btn-amber flex-1 text-xs py-2.5">Save</button>
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-xs py-2.5">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
