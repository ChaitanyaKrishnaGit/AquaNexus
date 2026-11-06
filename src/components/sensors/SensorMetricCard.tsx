/**
 * Aqua Nexus — Precision Sensor Metric Card
 * Implements strict Science & Telemetry UI rules: Tabular monospace figures,
 * clear unit separation, status signaling, and mini trend sparkline.
 */

import React from 'react';
import { AlertSeverity } from '../../types/telemetry';
import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, CheckCircle } from 'lucide-react';

interface SensorMetricCardProps {
  label: string;
  code: string;
  value: number;
  unit: string;
  precision?: number;
  minVal: number;
  maxVal: number;
  avgVal: number;
  deltaPercent: number;
  status: 'nominal' | 'warning' | 'critical';
  thresholdText: string;
  accentColor: string; // e.g. '#14B8A6'
  sparklineData: number[];
  onClick?: () => void;
}

export const SensorMetricCard: React.FC<SensorMetricCardProps> = ({
  label,
  code,
  value,
  unit,
  precision = 2,
  minVal,
  maxVal,
  avgVal,
  deltaPercent,
  status,
  thresholdText,
  accentColor,
  sparklineData,
  onClick
}) => {
  // Generate SVG points for sparkline
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;
  const width = 100;
  const height = 32;

  const points = sparklineData.map((val, idx) => {
    const x = (idx / (sparklineData.length - 1 || 1)) * width;
    const y = height - ((val - min) / range) * (height - 6) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const statusColors = {
    nominal: { text: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10', border: 'border-[#22C55E]/30', label: 'NOMINAL' },
    warning: { text: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/30', label: 'WARNING' },
    critical: { text: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/30', label: 'CRITICAL' }
  }[status];

  return (
    <div 
      onClick={onClick}
      className="p-4 rounded-xl bg-[#0D1929]/90 backdrop-blur-md border border-[#38BDF8]/15 hover:border-[#14B8A6]/40 transition-all duration-200 shadow-lg relative group cursor-pointer"
    >
      {/* Top Header: Code, Label, & Status Chip */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 truncate">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] border border-[#38BDF8]/20 px-1 rounded">
            {code}
          </span>
          <h3 className="text-xs font-semibold text-[#DAE3F7] truncate">{label}</h3>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider ${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}>
          {statusColors.label}
        </div>
      </div>

      {/* Main Telemetry Numeric Readout */}
      <div className="flex items-baseline justify-between mt-2">
        <div className="flex items-baseline">
          <span className="font-mono text-3xl font-bold tracking-tight text-[#F8FAFC] tabular-nums">
            {value.toFixed(precision)}
          </span>
          <span className="font-mono text-xs uppercase text-[#94A3B8] ml-2 font-medium">
            {unit}
          </span>
        </div>

        {/* Delta Chip */}
        <div className="flex items-center text-xs font-mono">
          {deltaPercent > 0 ? (
            <span className="text-[#38BDF8] flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +{deltaPercent.toFixed(1)}%
            </span>
          ) : deltaPercent < 0 ? (
            <span className="text-[#F59E0B] flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5" />
              {deltaPercent.toFixed(1)}%
            </span>
          ) : (
            <span className="text-[#94A3B8] flex items-center">
              <Minus className="w-3.5 h-3.5" />
              0.0%
            </span>
          )}
        </div>
      </div>

      {/* Mini Trend Sparkline */}
      <div className="my-3 h-8 w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>

      {/* Bottom Sub-Metrics: Min / Max / Avg / Nominal Band */}
      <div className="pt-2 border-t border-[#38BDF8]/10 grid grid-cols-3 gap-1 text-[10px] font-mono text-[#94A3B8]">
        <div>
          <span>MIN: </span>
          <strong className="text-[#DAE3F7]">{minVal.toFixed(precision)}</strong>
        </div>
        <div>
          <span>AVG: </span>
          <strong className="text-[#DAE3F7]">{avgVal.toFixed(precision)}</strong>
        </div>
        <div className="text-right">
          <span>MAX: </span>
          <strong className="text-[#DAE3F7]">{maxVal.toFixed(precision)}</strong>
        </div>
      </div>

      <div className="mt-1.5 text-[10px] font-mono text-[#94A3B8] truncate">
        Nominal: <span className="text-[#4FDBC8]">{thresholdText}</span>
      </div>
    </div>
  );
};
