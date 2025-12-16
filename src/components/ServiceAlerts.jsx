"use client";

import { AlertCircle, Info, AlertTriangle } from "lucide-react";

export default function ServiceAlerts({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-[#0F100F] border border-[#1C241C] rounded-3xl p-6">
        <h2 className="font-semibold text-sm text-[#9BA1B4] uppercase tracking-[0.35em] mb-4">
          Service Alerts
        </h2>
        <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-[#132515] border border-[#1E3B20]">
          <Info size={20} className="text-[#4ADE80]" />
          <div className="text-sm text-[#C8FFDC]">
            No active service alerts for this station
          </div>
        </div>
      </div>
    );
  }

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
      case "severe":
        return <AlertCircle size={20} className="text-[#FB7185]" />;
      case "warning":
        return <AlertTriangle size={20} className="text-[#FACC15]" />;
      default:
        return <Info size={20} className="text-[#60A5FA]" />;
    }
  };

  const getSeverityColors = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
      case "severe":
        return "bg-[#2B0C12] border-[#5E1824] text-[#FB7185]";
      case "warning":
        return "bg-[#2B1F05] border-[#5B3C0C] text-[#FACC15]";
      default:
        return "bg-[#0C1423] border-[#1C2D4F] text-[#60A5FA]";
    }
  };

  return (
    <div className="bg-[#0F100F] border border-[#1C241C] rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-sm text-[#9BA1B4] uppercase tracking-[0.35em]">
          Active Service Alerts
        </h2>
        <div className="px-3 py-1 bg-[#1B0D11] text-[#FB7185] text-xs font-semibold rounded-full border border-[#5E1824]">
          {alerts.length} {alerts.length === 1 ? "Alert" : "Alerts"}
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const severityClasses = getSeverityColors(alert.severity);
          const icon = getSeverityIcon(alert.severity);

          return (
            <div key={alert.id || index} className={`rounded-2xl border px-4 py-4 ${severityClasses}`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1">
                    {alert.header || "Service Alert"}
                  </h3>
                  {alert.description && (
                    <p className="text-sm text-white/70 mb-2">{alert.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs text-white/70">
                    {alert.effect && (
                      <span className="px-2 py-1 rounded-full bg-black/20">
                        {alert.effect}
                      </span>
                    )}
                    {alert.routes && alert.routes.length > 0 && (
                      <span className="px-2 py-1 rounded-full bg-black/20">
                        Lines: {alert.routes.join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
