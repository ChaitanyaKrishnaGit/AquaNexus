/**
 * Aqua Nexus — System Settings & Platform Configuration
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  Sliders, 
  MapPin, 
  Bell, 
  Cpu, 
  CheckCircle2, 
  RotateCcw,
  ShieldCheck,
  Info
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { 
    thresholds, 
    updateThresholds, 
    selectedLake, 
    simulationIntervalMs, 
    setSimulationIntervalMs,
    resetSimulation 
  } = useApp();

  const [localThresholds, setLocalThresholds] = useState(thresholds);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateThresholds(localThresholds);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0D1929]/90 border border-[#38BDF8]/15 rounded-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#14B8A6]" />
            <h1 className="text-base font-bold text-[#F8FAFC]">
              System Configuration & Environmental Parameters
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Configure limnological safety bands, simulation timings, and notification defaults
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Water Quality Alert Thresholds */}
        <div className="p-5 rounded-xl bg-[#0D1929] border border-[#38BDF8]/15 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#38BDF8]/10">
            <Sliders className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-xs font-bold text-[#F8FAFC] uppercase font-mono">
              1. Water Quality Regulatory Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#08111F] rounded-lg border border-[#38BDF8]/10 space-y-2">
              <span className="text-[#4FDBC8] font-bold">pH Safe Band (0–14):</span>
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">Min Safe:</span>
                  <input
                    type="number"
                    step="0.1"
                    value={localThresholds.ph.min}
                    onChange={e => setLocalThresholds({
                      ...localThresholds,
                      ph: { ...localThresholds.ph, min: parseFloat(e.target.value) || 6.5 }
                    })}
                    className="w-20 bg-[#111F30] border border-[#38BDF8]/30 px-2.5 py-1 rounded text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">Max Safe:</span>
                  <input
                    type="number"
                    step="0.1"
                    value={localThresholds.ph.max}
                    onChange={e => setLocalThresholds({
                      ...localThresholds,
                      ph: { ...localThresholds.ph, max: parseFloat(e.target.value) || 8.5 }
                    })}
                    className="w-20 bg-[#111F30] border border-[#38BDF8]/30 px-2.5 py-1 rounded text-[#F8FAFC]"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#08111F] rounded-lg border border-[#38BDF8]/10 space-y-2">
              <span className="text-[#38BDF8] font-bold">Dissolved Oxygen (mg/L):</span>
              <div>
                <span className="text-[10px] text-[#94A3B8] block">Critical Hypoxia Limit (Min):</span>
                <input
                  type="number"
                  step="0.1"
                  value={localThresholds.dissolvedOxygen.minCritical}
                  onChange={e => setLocalThresholds({
                    ...localThresholds,
                    dissolvedOxygen: { ...localThresholds.dissolvedOxygen, minCritical: parseFloat(e.target.value) || 4.0 }
                  })}
                  className="w-24 bg-[#111F30] border border-[#38BDF8]/30 px-2.5 py-1 rounded text-[#F8FAFC]"
                />
              </div>
            </div>

            <div className="p-3 bg-[#08111F] rounded-lg border border-[#38BDF8]/10 space-y-2">
              <span className="text-[#F59E0B] font-bold">Turbidity (NTU):</span>
              <div>
                <span className="text-[10px] text-[#94A3B8] block">Sediment Warning Threshold:</span>
                <input
                  type="number"
                  step="1"
                  value={localThresholds.turbidity.maxWarning}
                  onChange={e => setLocalThresholds({
                    ...localThresholds,
                    turbidity: { ...localThresholds.turbidity, maxWarning: parseFloat(e.target.value) || 10 }
                  })}
                  className="w-24 bg-[#111F30] border border-[#38BDF8]/30 px-2.5 py-1 rounded text-[#F8FAFC]"
                />
              </div>
            </div>

            <div className="p-3 bg-[#08111F] rounded-lg border border-[#38BDF8]/10 space-y-2">
              <span className="text-[#818CF8] font-bold">Water Temperature Band (°C):</span>
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">Min:</span>
                  <input
                    type="number"
                    value={localThresholds.temperature.min}
                    onChange={e => setLocalThresholds({
                      ...localThresholds,
                      temperature: { ...localThresholds.temperature, min: parseFloat(e.target.value) || 14 }
                    })}
                    className="w-20 bg-[#111F30] border border-[#38BDF8]/30 px-2.5 py-1 rounded text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">Max:</span>
                  <input
                    type="number"
                    value={localThresholds.temperature.max}
                    onChange={e => setLocalThresholds({
                      ...localThresholds,
                      temperature: { ...localThresholds.temperature, max: parseFloat(e.target.value) || 26 }
                    })}
                    className="w-20 bg-[#111F30] border border-[#38BDF8]/30 px-2.5 py-1 rounded text-[#F8FAFC]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Waterbody Metadata */}
        <div className="p-5 rounded-xl bg-[#0D1929] border border-[#38BDF8]/15 space-y-3 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#38BDF8]/10">
            <MapPin className="w-4 h-4 text-[#14B8A6]" />
            <h3 className="text-xs font-bold text-[#F8FAFC] uppercase font-mono">
              2. Active Waterbody Geofence
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3 font-mono">
            <div>
              <span className="text-[#94A3B8] block text-[10px]">WATERBODY NAME:</span>
              <span className="text-[#F8FAFC] font-bold">{selectedLake.name}</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block text-[10px]">CENTER COORDINATES:</span>
              <span className="text-[#4FDBC8]">{selectedLake.center.lat}° N, {selectedLake.center.lng}° W</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block text-[10px]">SURFACE AREA:</span>
              <span className="text-[#DAE3F7]">{selectedLake.surfaceAreaHectares} Hectares</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block text-[10px]">MAX BATHYMETRIC DEPTH:</span>
              <span className="text-[#DAE3F7]">{selectedLake.maxDepthMeters} Meters</span>
            </div>
          </div>
        </div>

        {/* Section 3: Simulation Engine Parameters */}
        <div className="p-5 rounded-xl bg-[#0D1929] border border-[#38BDF8]/15 space-y-3 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#38BDF8]/10">
            <Cpu className="w-4 h-4 text-[#818CF8]" />
            <h3 className="text-xs font-bold text-[#F8FAFC] uppercase font-mono">
              3. Telemetry Simulation Engine Settings
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-[#F8FAFC]">Physics Loop Interval</div>
              <div className="text-[11px] text-[#94A3B8]">Controls frequency of GPS and probe packet broadcasts</div>
            </div>
            <div className="flex items-center gap-1 font-mono">
              {[1000, 3000, 5000].map(ms => (
                <button
                  type="button"
                  key={ms}
                  onClick={() => setSimulationIntervalMs(ms)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    simulationIntervalMs === ms 
                      ? 'bg-[#14B8A6] text-[#08111F] font-bold' 
                      : 'bg-[#08111F] border border-[#38BDF8]/20 text-[#94A3B8]'
                  }`}
                >
                  {ms / 1000}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={resetSimulation}
            className="px-4 py-2 rounded-lg bg-[#111F30] border border-[#38BDF8]/20 text-[#DAE3F7] hover:border-[#F59E0B] text-xs font-medium transition-colors"
          >
            Reset Simulation Baselines
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-[#14B8A6] text-[#08111F] hover:bg-[#0D9488] font-bold text-xs transition-colors shadow-lg"
          >
            Save All Configurations
          </button>
        </div>
      </form>
    </div>
  );
};
