/**
 * Aqua Nexus — Multi-Parameter Comparative Trend Overlay
 * Normalizes pH, DO, Turbidity, and Water Temperature to 0-100% scale
 * to reveal limnological correlations and diurnal shifts.
 */

import React, { useState } from 'react';
import { WaterQualityReading } from '../../types/telemetry';

interface MultiParameterChartProps {
  readings: WaterQualityReading[];
  height?: number;
}

export const MultiParameterChart: React.FC<MultiParameterChartProps> = ({ readings, height = 260 }) => {
  const [activeParams, setActiveParams] = useState({
    ph: true,
    do: true,
    turbidity: true,
    temp: true
  });

  const width = 800;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Normalized min-max ranges for environmental parameters
  // pH: 6.0 - 9.0
  // DO: 2.0 - 12.0 mg/L
  // Turbidity: 0 - 25 NTU
  // Temp: 15.0 - 30.0 °C
  const normalize = (val: number, min: number, max: number) => {
    return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
  };

  const recent = readings.slice(-40);

  const buildPath = (extractor: (r: WaterQualityReading) => number) => {
    if (recent.length === 0) return '';
    const points = recent.map((r, i) => {
      const norm = extractor(r);
      const x = padding.left + (i / (recent.length - 1 || 1)) * chartWidth;
      const y = padding.top + chartHeight - (norm / 100) * chartHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const pathPh = buildPath(r => normalize(r.ph, 6.0, 9.0));
  const pathDo = buildPath(r => normalize(r.dissolvedOxygen, 2.0, 12.0));
  const pathTurb = buildPath(r => normalize(r.turbidity, 0, 25));
  const pathTemp = buildPath(r => normalize(r.temperature, 15.0, 30.0));

  return (
    <div className="p-4 rounded-xl bg-[#0D1929]/90 backdrop-blur-md border border-[#38BDF8]/15 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#38BDF8]/10 mb-2">
        <div>
          <h3 className="text-xs font-bold text-[#F8FAFC]">Multi-Parameter Limnological Correlation</h3>
          <p className="text-[10px] text-[#94A3B8]">Normalized 0–100% dynamic dynamic span</p>
        </div>

        {/* Legend / Toggle Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveParams(p => ({ ...p, ph: !p.ph }))}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              activeParams.ph ? 'bg-[#4FDBC8]/20 text-[#4FDBC8] border border-[#4FDBC8]/40' : 'text-[#94A3B8] opacity-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#4FDBC8]" />
            <span>pH (6-9)</span>
          </button>

          <button
            onClick={() => setActiveParams(p => ({ ...p, do: !p.do }))}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              activeParams.do ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40' : 'text-[#94A3B8] opacity-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            <span>DO (2-12 mg/L)</span>
          </button>

          <button
            onClick={() => setActiveParams(p => ({ ...p, turbidity: !p.turbidity }))}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              activeParams.turbidity ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40' : 'text-[#94A3B8] opacity-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span>Turbidity (0-25 NTU)</span>
          </button>

          <button
            onClick={() => setActiveParams(p => ({ ...p, temp: !p.temp }))}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              activeParams.temp ? 'bg-[#818CF8]/20 text-[#818CF8] border border-[#818CF8]/40' : 'text-[#94A3B8] opacity-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#818CF8]" />
            <span>Temp (15-30°C)</span>
          </button>
        </div>
      </div>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(val => {
            const y = padding.top + chartHeight - (val / 100) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartWidth}
                  y2={y}
                  stroke="rgba(56, 189, 248, 0.08)"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] font-mono fill-[#94A3B8]"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Curves */}
          {activeParams.ph && (
            <path d={pathPh} fill="none" stroke="#4FDBC8" strokeWidth="2" strokeLinecap="round" />
          )}
          {activeParams.do && (
            <path d={pathDo} fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          )}
          {activeParams.turbidity && (
            <path d={pathTurb} fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5 3" strokeLinecap="round" />
          )}
          {activeParams.temp && (
            <path d={pathTemp} fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
          )}

          {/* Time axis */}
          {recent.map((r, i) => {
            if (i % 8 !== 0 && i !== recent.length - 1) return null;
            const x = padding.left + (i / (recent.length - 1 || 1)) * chartWidth;
            const timeStr = new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <text
                key={i}
                x={x}
                y={padding.top + chartHeight + 18}
                textAnchor="middle"
                className="text-[9px] font-mono fill-[#94A3B8]"
              >
                {timeStr}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
