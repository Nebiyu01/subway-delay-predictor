"use client";

import { Clock, AlertTriangle } from "lucide-react";

export default function NextArrivals({ arrivals, station }) {
  if (!arrivals || arrivals.length === 0) {
    return (
      <div className="bg-[#111213] border border-[#1E1F22] rounded-3xl p-6 h-full">
        <h2 className="font-semibold text-sm text-[#9BA1B4] uppercase tracking-[0.35em] mb-4">
          Next Arrivals
        </h2>
        <div className="text-center py-10">
          <Clock size={32} className="text-[#3A4156] mx-auto mb-3" />
          <p className="text-sm text-[#C2C9E0]">No upcoming arrivals available</p>
          <p className="text-xs text-[#7F859D] mt-2">
            This may be due to limited data or no scheduled trains
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#101010] border border-[#1A1A1A] rounded-3xl p-6 h-full shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-sm text-[#9BA1B4] uppercase tracking-[0.35em]">
          Next Arrivals
        </h2>
        <div className="text-xs text-[#B0B5C3] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
          <span>{station?.stop_name}</span>
        </div>
      </div>

      <div className="space-y-3">
        {arrivals.map((arrival, index) => {
          const isDelayed = arrival.delaySeconds > 60;
          const delayMinutes = Math.max(1, Math.round(arrival.delaySeconds / 60));
          const routeColor = arrival.routeColor ? `#${arrival.routeColor}` : "#2B2E3A";
          const isYellowRoute = arrival.routeColor?.toLowerCase?.() === "fccc0a";

          return (
            <div
              key={`${arrival.routeId}-${index}`}
              className="flex items-center justify-between px-4 py-3 bg-[#181818] rounded-2xl border border-[#222224]"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: routeColor, color: isYellowRoute ? "#111" : "#fff" }}
                >
                  {arrival.routeName}
                </div>
                <div>
                  <div className="font-semibold text-base text-white">
                    {arrival.minutesUntilArrival} min
                  </div>
                  {isDelayed && (
                    <div className="flex items-center space-x-1 text-xs text-[#F5BF3A]">
                      <AlertTriangle size={12} />
                      <span>+{delayMinutes} min delay</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium text-[#B0B5C3]">
                  {new Date(arrival.arrivalTime * 1000).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
                <div className={`text-xs font-semibold ${isDelayed ? "text-[#F5BF3A]" : "text-[#4ADE80]"}`}>
                  {isDelayed ? "Delayed" : "On time"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
