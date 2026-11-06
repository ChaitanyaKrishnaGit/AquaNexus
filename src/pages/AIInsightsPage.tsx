/**
 * Aqua Nexus — AI-Assisted Environmental Anomaly Insights
 * Multi-layer statistical anomaly detection and laboratory verification guidance
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AnomalyCard } from '../components/insights/AnomalyCard';
import { 
  BrainCircuit, 
  Zap, 
  ShieldCheck, 
  Filter, 
  AlertTriangle, 
  Info,
  CheckCircle2
} from 'lucide-react';

export const AIInsightsPage: React.FC = () => {
  const { anomalies, injectAnomaly, selectedRobot } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'advisory'>('all');

  const filtered = anomalies.filter(a => {
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0D1929]/90 border border-[#38BDF8]/15 rounded-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-[#818CF8]" />
            <h1 className="text-base font-bold text-[#F8FAFC]">
              AI-Assisted Limnological Anomaly Insights
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Statistical deviation monitoring: Sudden rate-of-change, multi-sensor outlier clustering, and Isolation Forest
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-[#818CF8]/15 border border-[#818CF8]/30 text-[#818CF8] text-xs font-mono">
            {anomalies.length} Flags Identified
          </span>
        </div>
      </div>

      {/* Scientific Integrity Disclaimer */}
      <div className="p-3.5 rounded-xl bg-[#08111F] border border-[#38BDF8]/20 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
        <div className="text-xs text-[#DAE3F7] leading-relaxed">
          <strong className="text-[#38BDF8]">Scientific & Limnological Methodology Notice:</strong> These AI insights identify physical sensor departures (e.g. sudden optical turbidity spikes or nocturnal dissolved oxygen depletion). <em>Four telemetry parameters (pH, DO, Turbidity, Temp) cannot confirm specific chemical pollutant identities or pinpoint legal point-source origins.</em> Laboratory grab sampling, spectrophotometry, and mass spectrometry remain mandatory for regulatory confirmation.
        </div>
      </div>

      {/* Severity Filter & Quick Anomaly Injection Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0D1929]/90 border border-[#38BDF8]/15 rounded-xl">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-[#94A3B8] uppercase mr-1">Filter Severity:</span>
          {(['all', 'critical', 'warning', 'advisory'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors ${
                filterSeverity === sev
                  ? 'bg-[#14B8A6] text-[#08111F] font-bold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Quick Test Injection Action */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#94A3B8] uppercase">Inject QA Test:</span>
          <button
            onClick={() => injectAnomaly('hypoxia')}
            className="px-2.5 py-1 rounded bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] text-[11px] font-mono hover:bg-[#EF4444]/30"
          >
            + Hypoxia Event
          </button>
          <button
            onClick={() => injectAnomaly('turbidity_spike')}
            className="px-2.5 py-1 rounded bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#F59E0B] text-[11px] font-mono hover:bg-[#F59E0B]/30"
          >
            + Turbidity Spike
          </button>
        </div>
      </div>

      {/* Anomaly Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(insight => (
          <AnomalyCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
};
