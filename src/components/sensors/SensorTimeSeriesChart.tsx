/**
 * Aqua Nexus — High-Precision SVG Time-Series Chart
 * Renders smooth sensor trajectories with crosshair HUD tooltip and threshold bands
 */

import React, { useState, useMemo } from 'react';
import { WaterQualityReading } from '../../types/telemetry';

interface SensorTimeSeriesChartProps {
  title: string;
  parameterKey: 'ph' | 'dissolvedOxygen' | 'turbidity' | 'temperature';
  unit: string;
  readings: WaterQualityReading[];
  color: string;
  gradientId: string;
  nominalBand?: { min: number; max: number };
  criticalThreshold?: number;
  height?: number;
}

export const SensorTimeSeriesChart: React.FC<SensorTimeSeriesChartProps> = ({
  title,
  parameterKey,
  unit,
  readings,
  color,
  gradientId,
  nominalBand,
  criticalThreshold,
  height = 240
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [timeFilter, setTimeFilter] = useState<'1h' | '6h' | '12h' | '24h'>('24h');

  // Filter readings by selected timeframe
  const filteredReadings = useMemo(() => {
    if (readings.length === 0) return [];
    const pointsCount = timeFilter === '1h' ? 12 : timeFilter === '6h' ? 24 : timeFilter === '12h' ? 36 : readings.length;
    return readings.slice(-pointsCount);
  }, [readings, timeFilter]);

  const values = useMemo(() => filteredReadings.map(r => r[parameterKey]), [filteredReadings, parameterKey]);

  // Chart bounds with 10% padding
  const { minVal, maxVal, range } = useMemo(() => {
    if (values.length === 0) return { minVal: 0, maxVal: 10, range: 10 };
    let min = Math.min(...values);
    let max = Math.max(...values);
    if (nominalBand) {
      min = Math.min(min, nominalBand.min);
      max = Math.max(max, nominalBand.max);
    }
    const pad = (max - min) * 0.15 || 1;
    return { minVal: min - pad, maxVal: max + pad, range: (max + pad) - (min - pad) };
  }, [values, nominalBand]);

  // SVG dimensions
  const width = 800;
  const padding = { top: 20, right: 30, bottom: 35, left: 55 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Convert reading index & value to SVG coordinate
  const getCoordinates = (index: number, val: number) => {
    const x = padding.left + (index / (filteredReadings.length - 1 || 1)) * chartWidth;
    const y = padding.top + chartHeight - ((val - minVal) / range) * chartHeight;
    return { x, y };
  };

  // Build SVG Path
  const points = useMemo(() => {
    return filteredReadings.map((r, i) => {
      const { x, y } = getCoordinates(i, r[parameterKey]);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
  }, [filteredReadings, minVal, range, chartWidth, chartHeight]);

  const linePath = points.length > 0 ? `M ${points.join(' L ')}` : '';
  const areaPath = points.length > 0
    ? `M ${padding.left},${padding.top + chartHeight} L ${points.join(' L ')} L ${padding.left + chartWidth},${padding.top + chartHeight} Z`
    : '';

  const hoveredReading = hoverIndex !== null ? filteredReadings[hoverIndex] : null;

  return (
    <div className="p-4 rounded-xl bg-[#0D1929]/90 backdrop-blur-md border border-[#38BDF8]/15 shadow-xl">
      {/* Header with Title and Time Interval Buttons */}
      <div className="flex items-center justify-between pb-3 border-b border-[#38BDF8]/10 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="text-xs font-bold text-[#F8FAFC] tracking-tight">{title}</h3>
          <span className="text-[10px] font-mono text-[#94A3B8]">({unit})</span>
        </div>

        {/* Time Filter Segmented Control */}
        <div className="flex items-center gap-1 bg-[#08111F] p-1 rounded-lg border border-[#38BDF8]/15">
          {(['1h', '6h', '12h', '24h'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                timeFilter === tf 
                  ? 'bg-[#14B8A6] text-[#08111F] font-bold shadow-sm' 
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseLeave={() => setHoverIndex(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * width;
            if (relX >= padding.left && relX <= padding.left + chartWidth) {
              const fraction = (relX - padding.left) / chartWidth;
              const idx = Math.min(
                filteredReadings.length - 1,
                Math.max(0, Math.round(fraction * (filteredReadings.length - 1)))
              );
              setHoverIndex(idx);
            }
          }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.30" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = padding.top + chartHeight * pct;
            const val = maxVal - pct * range;
            return (
              <g key={i}>
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
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Nominal Band Reference */}
          {nominalBand && (
            <rect
              x={padding.left}
              y={padding.top + chartHeight - ((nominalBand.max - minVal) / range) * chartHeight}
              width={chartWidth}
              height={((nominalBand.max - nominalBand.min) / range) * chartHeight}
              fill="rgba(34, 197, 94, 0.04)"
              stroke="rgba(34, 197, 94, 0.2)"
              strokeDasharray="2 2"
            />
          )}

          {/* Area Fill */}
          <path d={areaPath} fill={`url(#${gradientId})`} />

          {/* Primary Stroke Line */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Critical Threshold Line */}
          {criticalThreshold !== undefined && (
            <line
              x1={padding.left}
              y1={padding.top + chartHeight - ((criticalThreshold - minVal) / range) * chartHeight}
              x2={padding.left + chartWidth}
              y2={padding.top + chartHeight - ((criticalThreshold - minVal) / range) * chartHeight}
              stroke="#EF4444"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
          )}

          {/* Hover Crosshair & Data Indicator */}
          {hoverIndex !== null && hoveredReading && (
            <g>
              {(() => {
                const { x, y } = getCoordinates(hoverIndex, hoveredReading[parameterKey]);
                return (
                  <>
                    <line
                      x1={x}
                      y1={padding.top}
                      x2={x}
                      y2={padding.top + chartHeight}
                      stroke="rgba(56, 189, 248, 0.4)"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <circle cx={x} cy={y} r="5" fill="#08111F" stroke={color} strokeWidth="2.5" />
                  </>
                );
              })()}
            </g>
          )}

          {/* X-Axis Time Labels */}
          {filteredReadings.map((r, i) => {
            if (i % Math.ceil(filteredReadings.length / 5) !== 0 && i !== filteredReadings.length - 1) return null;
            const { x } = getCoordinates(i, r[parameterKey]);
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

        {/* Floating Tooltip HUD on Hover */}
        {hoveredReading && hoverIndex !== null && (
          <div className="absolute top-2 right-4 bg-[#111F30]/95 backdrop-blur-md border border-[#38BDF8]/30 rounded-lg p-2.5 shadow-xl text-xs font-mono pointer-events-none z-20">
            <div className="text-[10px] text-[#94A3B8]">
              {new Date(hoveredReading.timestamp).toLocaleTimeString()} · Sample #{hoverIndex + 1}
            </div>
            <div className="text-sm font-bold text-[#F8FAFC] mt-0.5">
              {hoveredReading[parameterKey].toFixed(2)} <span className="text-[10px] text-[#94A3B8]">{unit}</span>
            </div>
            <div className="text-[10px] text-[#4FDBC8] mt-1">
              WQI: {hoveredReading.wqi} / 100
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
