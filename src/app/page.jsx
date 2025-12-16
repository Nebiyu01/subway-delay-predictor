"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/SubwayHeader";
import StationSearch from "@/components/StationSearch";
import RiskScore from "@/components/RiskScore";
import NextArrivals from "@/components/NextArrivals";
import ServiceAlerts from "@/components/ServiceAlerts";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function SubwayDelayPredictor() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Initialize database on mount
  useEffect(() => {
    const initDB = async () => {
      try {
        const response = await fetch("/api/mta/init", { method: "POST" });
        const data = await response.json();
        if (data.success) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };

    initDB();
  }, []);

  // Fetch prediction for selected station
  const {
    data: prediction,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["prediction", selectedStation?.stop_id],
    queryFn: async () => {
      if (!selectedStation) return null;

      const response = await fetch(
        `/api/mta/predict?stop_id=${selectedStation.stop_id}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }

      const data = await response.json();
      setLastUpdate(new Date());
      return data;
    },
    enabled: !!selectedStation,
    refetchInterval: autoRefresh ? 60000 : false, // Refresh every 60 seconds if enabled
  });

  // Fetch alerts for selected station
  const { data: alertsData } = useQuery({
    queryKey: ["alerts", selectedStation?.stop_id],
    queryFn: async () => {
      if (!selectedStation) return null;

      const response = await fetch(
        `/api/mta/alerts?stop_id=${selectedStation.stop_id}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch alerts");
      }

      return response.json();
    },
    enabled: !!selectedStation,
    refetchInterval: autoRefresh ? 60000 : false,
  });

  const handleRefresh = () => {
    refetch();
    setLastUpdate(new Date());
  };

  const formatLastUpdate = () => {
    const seconds = Math.floor((new Date() - lastUpdate) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#050505] pt-16 pb-12 md:pt-20 md:pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#090909] via-[#050505] to-[#050505]" />
        <div className="absolute inset-x-0 top-32 h-24 bg-[#0E1D36]" />
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-[0_15px_60px_rgba(0,0,0,0.65)]">
              NYC Subway Delay Predictor
            </h1>
            <p className="text-base md:text-lg text-[#B0B5C3] max-w-[60ch] mx-auto">
              Real-time delay predictions powered by live MTA data and machine
              learning
            </p>
          </div>

          {/* Station Search */}
          <div className="max-w-2xl mx-auto mb-6">
            <StationSearch
              onStationSelect={setSelectedStation}
              selectedStation={selectedStation}
            />
          </div>

          {/* Instructions when no station selected */}
          {!selectedStation && isInitialized && (
            <div className="text-center py-8 text-[#7D87A8]">
              <p className="text-sm">
                Search for a station above to see delay predictions
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      {selectedStation && (
        <section className="w-full bg-[#050505] py-10 md:py-16">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Data Freshness Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-[#161616]">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#34D399] rounded-full animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.6)]" />
                  <span className="text-sm text-[#9FA7B8]">
                    Last update: {formatLastUpdate()}
                  </span>
                </div>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors border font-semibold tracking-wide ${
                    autoRefresh
                      ? "bg-[#0F2116] text-[#5BE49E] border-[#1A3D28]"
                      : "bg-[#0B101A] text-[#8F97B3] border-[#1B2030]"
                  }`}
                >
                  Auto-refresh {autoRefresh ? "ON" : "OFF"}
                </button>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center space-x-2 text-sm text-[#4D7CFF] hover:opacity-80 active:opacity-60 transition-opacity disabled:opacity-40 font-semibold"
              >
                <RefreshCw
                  size={16}
                  className={isLoading ? "animate-spin" : ""}
                />
                <span>Refresh</span>
              </button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block w-10 h-10 border-4 border-[#151A24] border-t-[#4D7CFF] rounded-full animate-spin" />
                <p className="text-sm text-[#9FA7B8] mt-4">
                  Analyzing delay patterns...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-[#2B0D13] border border-[#651D2D] rounded-2xl p-6 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle
                    size={20}
                    className="text-[#FB7185] flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <h3 className="font-semibold text-sm text-white mb-1">
                      Failed to load prediction
                    </h3>
                    <p className="text-sm text-[#FCA5B9]">{error.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Prediction Results */}
            {!isLoading && !error && prediction && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Risk Score - Takes 1 column */}
                <div className="lg:col-span-1">
                  <RiskScore prediction={prediction.prediction} />
                </div>

                {/* Next Arrivals - Takes 2 columns */}
                <div className="lg:col-span-2">
                  <NextArrivals
                    arrivals={prediction.nextArrivals}
                    station={prediction.station}
                  />
                </div>

                {/* Service Alerts - Full width */}
                <div className="lg:col-span-3">
                  <ServiceAlerts
                    alerts={alertsData?.alerts || []}
                    station={prediction.station}
                  />
                </div>

                {/* Model Info */}
                <div className="lg:col-span-3 mt-4">
                  <div className="bg-[#111317] border border-[#1F222C] rounded-2xl p-5 shadow-[0_25px_70px_rgba(0,0,0,0.55)]">
                    <h3 className="font-semibold text-sm text-white mb-2 uppercase tracking-[0.3em] text-[#8F97B3]">
                      Prediction Details
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[#A1ABC7]">
                      <div>
                        <div className="font-semibold text-white mb-1">
                          Model Version
                        </div>
                        <div>{prediction.modelVersion}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-white mb-1">
                          Confidence
                        </div>
                        <div>
                          {(prediction.prediction.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-white mb-1">
                          Recent Delay Rate
                        </div>
                        <div>
                          {(prediction.features.recentDelayRate * 100).toFixed(
                            0,
                          )}
                          %
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-white mb-1">
                          Avg Delay
                        </div>
                        <div>
                          {Math.round(prediction.features.avgDelaySeconds)}s
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Info Banner */}
      <section className="w-full bg-[#101624] border-t border-[#1F2A3F] py-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="font-semibold text-sm text-[#7BA7FF] mb-2 uppercase tracking-[0.3em]">
              About This Predictor
            </h3>
            <p className="text-sm text-[#A7B5D5] max-w-[70ch] mx-auto leading-relaxed">
              This system uses a baseline rule-based classifier analyzing recent
              delays, service alerts, headway gaps, and time-of-day patterns. In
              production, this would connect to live MTA GTFS Realtime feeds and
              use an ML model trained on historical data.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
