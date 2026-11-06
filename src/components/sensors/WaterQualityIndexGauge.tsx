/**
 * Aqua Nexus — Water Quality Index (WQI) Circular Arc Instrument
 * Follows National Sanitation Foundation (NSF) limnological weighting
 */

import React from 'react';
import { ShieldCheck, AlertCircle, Droplets } from 'lucide-react';

interface WaterQualityIndexGaugeProps {
  score: number; // 0 - 100
  subScores?: {
    do: number;
    ph: number;
    turbidity: number;
    temp: number;
  };
}

export const WaterQualityIndexGauge: React.FC<WaterQualityIndexGaugeProps> = ({ score, subScores }) => {
  // Classification
  const getQualityBand = (s: number) => {
    if (s >= 90) return { label: 'EXCELLENT', color: '#22C55E', desc: 'Pristine ecological balance' };
    if (s >= 75) return { label: 'GOOD', color: '#14B8A6', desc: 'Healthy aquatic habitat' };
    if (s >= 50) return { label: 'FAIR', color: '#F59E0B', desc: 'Moderate organic strain' };
    if (s >= 25) return { label: 'MARGINAL', color: '#F97316', desc: 'Severe limnological distress' };
    return { label: 'POOR', color: '#EF4444', desc: 'Hypoxic / degraded water' };
  };

  const band = getQualityBand(score);

  // SVG Arc calculation (Semi-circle or 240 deg arc)
  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius * 0.75; // 270 degree arc
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="p-4 rounded-xl bg-[#0D1929]/90 backdrop-blur-md border border-[#38BDF8]/15 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between pb-2 border-b border-[#38BDF8]/10 mb-2">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8]">
            COMPREHENSIVE INDEX
          </span>
          <h3 className="text-xs font-bold text-[#F8FAFC]">Water Quality Index (WQI)</h3>
        </div>
        <div 
          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider"
          style={{ color: band.color, backgroundColor: `${band.color}15`, border: `1px solid ${band.color}35` }}
        >
          {band.label}
        </div>
      </div>

      {/* Main Gauge Dial */}
      <div className="flex flex-col items-center justify-center my-2 relative">
        <svg className="w-36 h-36 transform -rotate-135" viewBox="0 0 160 160">
          {/* Background Track Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="rgba(56, 189, 248, 0.12)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset="0"
            strokeLinecap="round"
          />
          {/* Active Gradient Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={band.color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          />
        </svg>

        {/* Center Readout Numerical Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-mono text-3xl font-extrabold text-[#F8FAFC] tracking-tight tabular-nums">
            {score}
          </span>
          <span className="text-[10px] font-mono text-[#94A3B8]">/ 100 PTS</span>
        </div>
      </div>

      <div className="text-center text-[11px] text-[#DAE3F7] font-medium mb-3">
        {band.desc}
      </div>

      {/* Weighting Breakdown */}
      <div className="grid grid-cols-4 gap-1 pt-2 border-t border-[#38BDF8]/10 text-center text-[9px] font-mono">
        <div className="p-1 rounded bg-[#08111F]">
          <div className="text-[#94A3B8]">DO (35%)</div>
          <div className="text-[#38BDF8] font-bold">Good</div>
        </div>
        <div className="p-1 rounded bg-[#08111F]">
          <div className="text-[#94A3B8]">pH (25%)</div>
          <div className="text-[#4FDBC8] font-bold">Nominal</div>
        </div>
        <div className="p-1 rounded bg-[#08111F]">
          <div className="text-[#94A3B8]">TURB (20%)</div>
          <div className="text-[#F59E0B] font-bold">Clear</div>
        </div>
        <div className="p-1 rounded bg-[#08111F]">
          <div className="text-[#94A3B8]">TEMP (20%)</div>
          <div className="text-[#818CF8] font-bold">Normal</div>
        </div>
      </div>
    </div>
  );
};
