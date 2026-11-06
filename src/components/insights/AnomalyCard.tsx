/**
 * Aqua Nexus — AI-Assisted Anomaly Insight Card
 * Complies with Limnological Verification Ethics: Distinguishes physical probe anomaly
 * from laboratory pollutant chemical identification.
 */

import React from 'react';
import { AnomalyInsight } from '../../types/telemetry';
import { 
  AlertTriangle, 
  BrainCircuit, 
  CheckCircle, 
  MapPin, 
  Clock, 
  Info,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface AnomalyCardProps {
  insight: AnomalyInsight;
  onVerify?: () => void;
}

export const AnomalyCard: React.FC<AnomalyCardProps> = ({ insight, onVerify }) => {
  const severityBadge = {
    critical: { text: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/30', label: 'CRITICAL ANOMALY' },
    warning: { text: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/30', label: 'THRESHOLD ADVISORY' },
    advisory: { text: 'text-[#38BDF8]', bg: 'bg-[#38BDF8]/10', border: 'border-[#38BDF8]/30', label: 'STATISTICAL DRIFT' }
  }[insight.severity];

  return (
    <div className="p-4 rounded-xl bg-[#0D1929]/95 backdrop-blur-md border border-[#38BDF8]/15 hover:border-[#818CF8]/40 transition-all shadow-xl space-y-3">
      {/* Top Header: Parameter & Severity */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-[#818CF8]" />
          <h3 className="text-xs font-bold text-[#F8FAFC]">
            {insight.parameter} Anomaly
          </h3>
          <span className="text-[10px] font-mono text-[#94A3B8]">
            [{insight.algorithm}]
          </span>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider ${severityBadge.bg} ${severityBadge.text} border ${severityBadge.border}`}>
          {severityBadge.label}
        </div>
      </div>

      {/* Metrics Row: Measured vs Baseline */}
      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-[#08111F] border border-[#38BDF8]/10 font-mono text-xs">
        <div>
          <div className="text-[10px] text-[#94A3B8]">OBSERVED VALUE:</div>
          <div className="text-sm font-bold text-[#EF4444] mt-0.5">{insight.measuredValue}</div>
        </div>
        <div>
          <div className="text-[10px] text-[#94A3B8]">HISTORICAL BASELINE:</div>
          <div className="text-sm font-semibold text-[#4FDBC8] mt-0.5">{insight.baselineRange}</div>
        </div>
      </div>

      {/* Reason for Flagging */}
      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8]">
          Statistical Flagging Rationale
        </div>
        <p className="text-xs text-[#DAE3F7] leading-relaxed mt-1">
          {insight.reason}
        </p>
      </div>

      {/* Recommended Verification Protocol */}
      <div className="p-2.5 rounded-lg bg-[#111F30] border border-[#38BDF8]/20 space-y-1">
        <div className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Recommended Limnological Protocol</span>
        </div>
        <p className="text-xs text-[#DAE3F7] leading-relaxed">
          {insight.recommendedVerification}
        </p>
      </div>

      {/* Metadata & Confidence Score */}
      <div className="pt-2 border-t border-[#38BDF8]/10 flex flex-wrap items-center justify-between text-[10px] font-mono text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3 text-[#38BDF8]" />
          <span>{insight.location}</span>
          <span>·</span>
          <Clock className="w-3 h-3 text-[#38BDF8]" />
          <span>{new Date(insight.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div>
          Model Confidence: <strong className="text-[#4FDBC8]">{insight.confidenceScore}%</strong>
        </div>
      </div>
    </div>
  );
};
