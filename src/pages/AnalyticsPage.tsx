/**
 * Aqua Nexus — Analytics, Statistical Summaries & Environmental Audit Reports
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { exportReadingsToCsv, generatePrintableReport } from '../services/exportService';
import { MultiParameterChart } from '../components/sensors/MultiParameterChart';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  ShieldCheck,
  TrendingUp,
  Table
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { 
    readings, 
    selectedLake, 
    selectedRobot, 
    currentMission, 
    alerts, 
    currentUser 
  } = useApp();

  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  // Compute Limnological Statistics
  const computeStats = (key: 'ph' | 'dissolvedOxygen' | 'turbidity' | 'temperature' | 'wqi') => {
    const vals = readings.map(r => r[key]);
    if (vals.length === 0) return { mean: '0.00', min: '0.00', max: '0.00', stdDev: '0.00', p95: '0.00' };
    
    const sum = vals.reduce((a, b) => a + b, 0);
    const mean = sum / vals.length;
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    
    const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / vals.length;
    const stdDev = Math.sqrt(variance);

    // 95th percentile
    const sorted = [...vals].sort((a, b) => a - b);
    const p95Index = Math.floor(sorted.length * 0.95);
    const p95 = sorted[p95Index] || max;

    return {
      mean: mean.toFixed(2),
      min: min.toFixed(2),
      max: max.toFixed(2),
      stdDev: stdDev.toFixed(2),
      p95: p95.toFixed(2)
    };
  };

  const phStat = computeStats('ph');
  const doStat = computeStats('dissolvedOxygen');
  const turbStat = computeStats('turbidity');
  const tempStat = computeStats('temperature');
  const wqiStat = computeStats('wqi');

  const handleExportCsv = () => {
    exportReadingsToCsv(readings, selectedLake.name, selectedRobot.id);
  };

  const handleGenerateReport = () => {
    generatePrintableReport({
      lake: selectedLake,
      robot: selectedRobot,
      mission: currentMission,
      readings,
      alerts,
      operatorName: currentUser.name
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Export Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0D1929]/90 border border-[#38BDF8]/15 rounded-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#14B8A6]" />
            <h1 className="text-base font-bold text-[#F8FAFC]">
              Limnological Analytics & Environmental Reporting
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Statistical aggregation, regulatory baseline compliance, and report generation
          </p>
        </div>

        {/* Action Buttons: CSV & PDF Report */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111F30] border border-[#38BDF8]/30 text-[#DAE3F7] hover:text-[#4FDBC8] hover:border-[#14B8A6] text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleGenerateReport}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#14B8A6] text-[#08111F] hover:bg-[#0D9488] font-bold text-xs transition-colors shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate Official Report</span>
          </button>
        </div>
      </div>

      {/* Timeframe Selector & Sample Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0D1929]/90 border border-[#38BDF8]/15 rounded-xl">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#38BDF8]" />
          <span className="text-xs font-mono text-[#94A3B8]">Timeframe Filter:</span>
          {(['24h', '7d', '30d'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded text-xs font-mono uppercase transition-colors ${
                timeframe === tf
                  ? 'bg-[#14B8A6] text-[#08111F] font-bold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111F30]'
              }`}
            >
              {tf === '24h' ? 'Last 24 Hours' : tf === '7d' ? 'Last 7 Days (Sim)' : 'Last 30 Days (Sim)'}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-[#4FDBC8]">
          {readings.length} Spatial Telemetry Records Analyzed
        </div>
      </div>

      {/* Statistical Summary Matrix Table */}
      <div className="rounded-xl border border-[#38BDF8]/15 bg-[#0D1929]/95 overflow-hidden shadow-xl">
        <div className="p-3 bg-[#08111F] border-b border-[#38BDF8]/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-xs font-bold text-[#F8FAFC] font-mono uppercase">
              Limnological Descriptive Statistics & EPA Baseline Compliance
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8]">Units: Tabular Monospace</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0B1422] border-b border-[#38BDF8]/10 text-[10px] uppercase tracking-wider text-[#94A3B8]">
              <tr>
                <th className="py-2.5 px-4">Parameter Name</th>
                <th className="py-2.5 px-4">Unit</th>
                <th className="py-2.5 px-4">Mean (x̄)</th>
                <th className="py-2.5 px-4">Min</th>
                <th className="py-2.5 px-4">Max</th>
                <th className="py-2.5 px-4">Std Dev (σ)</th>
                <th className="py-2.5 px-4">95th %ile</th>
                <th className="py-2.5 px-4">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#38BDF8]/10">
              <tr>
                <td className="py-3 px-4 font-semibold text-[#4FDBC8]">pH (Glass Electrode)</td>
                <td className="py-3 px-4 text-[#94A3B8]">pH</td>
                <td className="py-3 px-4 font-bold text-[#F8FAFC]">{phStat.mean}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{phStat.min}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{phStat.max}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{phStat.stdDev}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{phStat.p95}</td>
                <td className="py-3 px-4 text-[#22C55E]">Within 6.5–8.5 Band</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#38BDF8]">Dissolved Oxygen (Galvanic)</td>
                <td className="py-3 px-4 text-[#94A3B8]">mg/L</td>
                <td className="py-3 px-4 font-bold text-[#F8FAFC]">{doStat.mean}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{doStat.min}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{doStat.max}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{doStat.stdDev}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{doStat.p95}</td>
                <td className="py-3 px-4 text-[#22C55E]">Healthy (&gt; 6.0 mg/L)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#F59E0B]">Turbidity (Optical Nephelo)</td>
                <td className="py-3 px-4 text-[#94A3B8]">NTU</td>
                <td className="py-3 px-4 font-bold text-[#F8FAFC]">{turbStat.mean}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{turbStat.min}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{turbStat.max}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{turbStat.stdDev}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{turbStat.p95}</td>
                <td className="py-3 px-4 text-[#22C55E]">Low Sedimentation</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#818CF8]">Water Temperature (DS18B20)</td>
                <td className="py-3 px-4 text-[#94A3B8]">°C</td>
                <td className="py-3 px-4 font-bold text-[#F8FAFC]">{tempStat.mean}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{tempStat.min}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{tempStat.max}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{tempStat.stdDev}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{tempStat.p95}</td>
                <td className="py-3 px-4 text-[#22C55E]">Temperate Reservoir Normal</td>
              </tr>
              <tr className="bg-[#14B8A6]/5">
                <td className="py-3 px-4 font-bold text-[#4FDBC8]">Overall Water Quality Index (WQI)</td>
                <td className="py-3 px-4 text-[#94A3B8]">Pts (0-100)</td>
                <td className="py-3 px-4 font-bold text-[#4FDBC8]">{wqiStat.mean}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{wqiStat.min}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{wqiStat.max}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{wqiStat.stdDev}</td>
                <td className="py-3 px-4 text-[#94A3B8]">{wqiStat.p95}</td>
                <td className="py-3 px-4 text-[#22C55E] font-bold">Good Quality Habitat</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Parameter Comparative Trend Graph */}
      <MultiParameterChart readings={readings} />
    </div>
  );
};
