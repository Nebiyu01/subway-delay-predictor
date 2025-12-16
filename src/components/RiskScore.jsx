"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function RiskScore({ prediction }) {
  if (!prediction) return null;

  const { isDelayed, delayProbability, confidence, factors, riskLevel } =
    prediction;

  // Color scheme based on risk level
  const riskColors = {
    low: {
      container: "bg-[#0E130E] border border-[#1C241C]",
      accent: "#1EDC61",
      text: "text-[#54F28E]",
      icon: "text-[#54F28E]",
      gradient: "linear-gradient(135deg, #1EDC61 0%, #0FAF4A 100%)",
      bar: "bg-[#1EDC61]",
    },
    medium: {
      container: "bg-[#1D1609] border border-[#3A2C17]",
      accent: "#FACC15",
      text: "text-[#F7CE62]",
      icon: "text-[#FACC15]",
      gradient: "linear-gradient(135deg, #FACC15 0%, #E49A0A 100%)",
      bar: "bg-[#FACC15]",
    },
    high: {
      container: "bg-[#190B0B] border border-[#3A1414]",
      accent: "#F87171",
      text: "text-[#F8A3A3]",
      icon: "text-[#F87171]",
      gradient: "linear-gradient(135deg, #F87171 0%, #E02B43 100%)",
      bar: "bg-[#F87171]",
    },
  };

  const colors = riskColors[riskLevel];

  const RiskIcon =
    riskLevel === "high"
      ? TrendingUp
      : riskLevel === "low"
        ? TrendingDown
        : Minus;

  return (
    <div
      className={`${colors.container} rounded-3xl p-6 h-full shadow-[0_25px_70px_rgba(0,0,0,0.55)]`}
    >
      <h2 className="font-semibold text-sm text-[#B1B8C6] mb-6 uppercase tracking-[0.35em]">
        Delay Risk Score
      </h2>

      {/* Large Risk Indicator */}
      <div className="text-center mb-6">
        <div
          className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 shadow-[0_20px_45px_rgba(0,0,0,0.55)]"
          style={{ backgroundImage: colors.gradient }}
        >
          <div className="text-4xl font-extrabold">
            {Math.round(delayProbability * 100)}
          </div>
        </div>
        <div className={`text-lg font-semibold ${colors.text} uppercase`}>
          {riskLevel} Risk
        </div>
        <div className="text-sm text-[#AEB6C6] mt-1">
          {isDelayed ? "Delays likely" : "On-time expected"}
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-[#AEB6C6] mb-2">
          <span>Confidence</span>
          <span className="font-semibold text-white">
            {Math.round(confidence * 100)}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#1F2621] rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${confidence * 100}%`,
              backgroundColor: colors.accent,
            }}
          ></div>
        </div>
      </div>

      {/* Contributing Factors */}
      <div>
        <h3 className="font-medium text-xs text-[#B1B8C6] mb-3 uppercase tracking-[0.2em]">
          Contributing Factors
        </h3>
        {factors && factors.length > 0 ? (
          <ul className="space-y-2">
            {factors.map((factor, index) => (
              <li key={index} className="flex items-start space-x-2 text-xs">
                <RiskIcon
                  size={14}
                  className={`${colors.icon} flex-shrink-0 mt-0.5`}
                />
                <div className="flex-1">
                  <div className="text-white font-medium">
                    {factor.factor}
                  </div>
                  <div className="text-[#AEB6C6]">
                    Weight: {Math.round(factor.weight * 100)}%
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-[#C7D2E4]">
            No significant delay factors detected
          </p>
        )}
      </div>
    </div>
  );
}
