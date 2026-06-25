import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
  icon: ReactNode;
  accentColor?: string;
}

export default function StatCard({ title, value, subtitle, trend, icon, accentColor = "#ffb300" }: StatCardProps) {
  return (
    <div className="stat-card glow-card-hover">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg" style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold font-mono ${trend.isPositive ? "text-emerald-400" : "text-rose-400"}`}>
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      <div className="font-mono-data text-2xl font-bold text-white tracking-tight mb-1">{value}</div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8b95a5]">{title}</div>
      {subtitle && <div className="text-[11px] text-[#8b95a5]/70 mt-1">{subtitle}</div>}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(to right, transparent, ${accentColor}80, transparent)` }}
      />
    </div>
  );
}
