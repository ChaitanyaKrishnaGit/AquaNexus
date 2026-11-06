/**
 * Aqua Nexus — Simulation Control Bar & Integrity Disclaimer
 * Explicitly designates simulated telemetry vs physical hardware
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  AlertOctagon, 
  Activity, 
  Info,
  Clock,
  ChevronDown
} from 'lucide-react';

export const SimulationBar: React.FC = () => {
  const {
    simulationRunning,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    simulationIntervalMs,
    setSimulationIntervalMs,
    injectAnomaly,
    emergencyStop,
    selectedRobot
  } = useApp();

  const [anomalyMenuOpen, setAnomalyMenuOpen] = useState(false);

  const anomaliesList: { type: 'hypoxia' | 'turbidity_spike' | 'alkaline_drift' | 'thermal_surge' | 'low_battery' | 'sensor_fault'; label: string; desc: string }[] = [
    { type: 'hypoxia', label: 'Hypoxic Plume Event', desc: 'Drop DO to 3.3 mg/L (Critical alert)' },
    { type: 'turbidity_spike', label: 'Sediment Turbidity Surge', desc: 'Spike Turbidity to 32 NTU' },
    { type: 'alkaline_drift', label: 'Alkaline Runoff (pH Surge)', desc: 'Increase pH to 9.15' },
    { type: 'thermal_surge', label: 'Thermal Outflow Discharge', desc: 'Water temperature spikes to 28.5°C' },
    { type: 'low_battery', label: 'Critical Battery Depletion', desc: 'Force battery down to 14%' },
    { type: 'sensor_fault', label: 'Sensor Impedance Drift', desc: 'Simulate electrode drift warning' }
  ];

  return (
    <div className="bg-[#0B1422] border-b border-[#38BDF8]/20 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Left: Integrity Disclaimer Badge */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-[#F59E0B] font-mono font-bold text-[11px] tracking-wide">
          <Info className="w-3.5 h-3.5" />
          <span>SIMULATED TELEMETRY MODE</span>
        </div>
        <span className="hidden md:inline text-[11px] text-[#94A3B8]">
          Physics & limnology model active · Target vessel: <strong className="text-[#DAE3F7]">{selectedRobot.name}</strong>
        </span>
      </div>

      {/* Right: Simulation Controls & Anomaly Injection */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Play / Pause Toggle */}
        <button
          onClick={simulationRunning ? pauseSimulation : startSimulation}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
            simulationRunning 
              ? 'bg-[#111F30] border border-[#F59E0B]/40 text-[#F59E0B] hover:bg-[#F59E0B]/10' 
              : 'bg-[#14B8A6] text-[#08111F] font-semibold hover:bg-[#0D9488]'
          }`}
          title={simulationRunning ? 'Pause simulation updates' : 'Resume simulation updates'}
        >
          {simulationRunning ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Sim</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Sim</span>
            </>
          )}
        </button>

        {/* Reset Simulation */}
        <button
          onClick={resetSimulation}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#111F30] border border-[#38BDF8]/20 text-[#DAE3F7] hover:text-[#F8FAFC] hover:border-[#38BDF8]/40 transition-colors"
          title="Reset simulation baselines and readings"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Reset</span>
        </button>

        {/* Update Frequency Selector */}
        <div className="flex items-center gap-1 bg-[#0D1929] border border-[#38BDF8]/20 rounded-md px-1.5 py-0.5 text-[11px]">
          <Clock className="w-3 h-3 text-[#94A3B8]" />
          <span className="text-[#94A3B8]">Rate:</span>
          {[1000, 3000, 5000].map(ms => (
            <button
              key={ms}
              onClick={() => setSimulationIntervalMs(ms)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                simulationIntervalMs === ms 
                  ? 'bg-[#14B8A6]/20 text-[#4FDBC8] font-bold border border-[#14B8A6]/40' 
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {ms / 1000}s
            </button>
          ))}
        </div>

        {/* Anomaly Injector Tool */}
        <div className="relative">
          <button
            onClick={() => setAnomalyMenuOpen(!anomalyMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111F30] border border-[#818CF8]/30 text-[#818CF8] hover:border-[#818CF8] hover:bg-[#818CF8]/10 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Test Anomaly</span>
            <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
          </button>

          {anomalyMenuOpen && (
            <div 
              className="absolute right-0 mt-1 w-64 bg-[#111F30] border border-[#818CF8]/40 rounded-lg shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setAnomalyMenuOpen(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#818CF8] border-b border-[#38BDF8]/10">
                QA Anomaly Injection Suite
              </div>
              <div className="p-1 space-y-0.5">
                {anomaliesList.map(item => (
                  <button
                    key={item.type}
                    onClick={() => {
                      injectAnomaly(item.type);
                      setAnomalyMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded text-xs text-[#DAE3F7] hover:bg-[#17202E] hover:text-[#4FDBC8] transition-colors"
                  >
                    <div className="font-medium">{item.label}</div>
                    <div className="text-[10px] text-[#94A3B8] leading-tight mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* E-Stop Simulator Button */}
        <button
          onClick={emergencyStop}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EF4444]/20 border border-[#EF4444]/50 text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all font-semibold"
          title="Emergency Stop Propulsion Simulator"
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>E-STOP</span>
        </button>
      </div>
    </div>
  );
};
