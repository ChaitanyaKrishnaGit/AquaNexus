/**
 * Aqua Nexus — Dedicated Water Quality Monitoring Page
 * Deep-dive analysis of pH, Dissolved Oxygen, Turbidity, and Water Temperature
 * with configurable thresholds, statistical summaries, and normalized trend comparisons.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SensorTimeSeriesChart } from '../components/sensors/SensorTimeSeriesChart';
import { MultiParameterChart } from '../components/sensors/MultiParameterChart';
import { 
  Droplets, 
  Sliders, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export const WaterQualityPage: React.FC = () => {
  const { 
    readings, 
    latestReading, 
    thresholds, 
    updateThresholds, 
    selectedRobot,
    lastUpdateTime 
  } = useApp();

  const [activeParamTab, setActiveParamTab] = useState<'all' | 'ph' | 'do' | 'turbidity' | 'temp'>('all');
  const [editingThresholds, setEditingThresholds] = useState(false);
  const [tempThresholds, setTempThresholds] = useState(thresholds);

  const saveThresholdChanges = () => {
    updateThresholds(tempThresholds);
    setEditingThresholds(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0D1929]/90 border border-[#38BDF8]/15 rounded-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-[#14B8A6]" />
            <h1 className="text-base font-bold text-[#F8FAFC]">
              Water Quality Sensor Telemetry & Limnological Trends
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Continuous calibrated readings from {selectedRobot.name} (Updated {lastUpdateTime.toLocaleTimeString()})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditingThresholds(!editingThresholds)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111F30] border border-[#38BDF8]/30 text-[#38BDF8] hover:text-[#F8FAFC] text-xs font-medium transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{editingThresholds ? 'Hide Threshold Settings' : 'Configure Alert Thresholds'}</span>
          </button>
        </div>
      </div>

      {/* Threshold Editing Drawer */}
      {editingThresholds && (
        <div className="p-4 rounded-xl bg-[#08111F] border border-[#38BDF8]/30 shadow-2xl space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#38BDF8]/20">
            <h3 className="text-xs font-bold text-[#F8FAFC] uppercase font-mono">
              Adjust Water-Quality Alarm Thresholds
            </h3>
            <span className="text-[10px] text-[#94A3B8]">Changes apply immediately to simulation rule engine</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            {/* pH Thresholds */}
            <div className="p-3 bg-[#111F30] rounded-lg border border-[#38BDF8]/20 space-y-2">
              <span className="text-[#4FDBC8] font-bold">pH Nominal Band:</span>
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-[#94A3B8]">Min:</label>
                <input
                  type="number"
                  step="0.1"
                  value={tempThresholds.ph.min}
                  onChange={e => setTempThresholds({
                    ...tempThresholds,
                    ph: { ...tempThresholds.ph, min: parseFloat(e.target.value) || 6.0 }
                  })}
                  className="w-16 bg-[#08111F] border border-[#38BDF8]/30 px-2 py-0.5 rounded text-[#F8FAFC]"
                />
                <label className="text-[10px] text-[#94A3B8]">Max:</label>
                <input
                  type="number"
                  step="0.1"
                  value={tempThresholds.ph.max}
                  onChange={e => setTempThresholds({
                    ...tempThresholds,
                    ph: { ...tempThresholds.ph, max: parseFloat(e.target.value) || 8.5 }
                  })}
                  className="w-16 bg-[#08111F] border border-[#38BDF8]/30 px-2 py-0.5 rounded text-[#F8FAFC]"
                />
              </div>
            </div>

            {/* DO Thresholds */}
            <div className="p-3 bg-[#111F30] rounded-lg border border-[#38BDF8]/20 space-y-2">
              <span className="text-[#38BDF8] font-bold">Dissolved Oxygen (mg/L):</span>
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-[#94A3B8]">Critical Min:</label>
                <input
                  type="number"
                  step="0.1"
                  value={tempThresholds.dissolvedOxygen.minCritical}
                  onChange={e => setTempThresholds({
                    ...tempThresholds,
                    dissolvedOxygen: { ...tempThresholds.dissolvedOxygen, minCritical: parseFloat(e.target.value) || 4.0 }
                  })}
                  className="w-20 bg-[#08111F] border border-[#38BDF8]/30 px-2 py-0.5 rounded text-[#F8FAFC]"
                />
              </div>
            </div>

            {/* Turbidity Thresholds */}
            <div className="p-3 bg-[#111F30] rounded-lg border border-[#38BDF8]/20 space-y-2">
              <span className="text-[#F59E0B] font-bold">Turbidity (NTU):</span>
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-[#94A3B8]">Warn Max:</label>
                <input
                  type="number"
                  step="1"
                  value={tempThresholds.turbidity.maxWarning}
                  onChange={e => setTempThresholds({
                    ...tempThresholds,
                    turbidity: { ...tempThresholds.turbidity, maxWarning: parseFloat(e.target.value) || 10 }
                  })}
                  className="w-20 bg-[#08111F] border border-[#38BDF8]/30 px-2 py-0.5 rounded text-[#F8FAFC]"
                />
              </div>
            </div>

            {/* Temperature Thresholds */}
            <div className="p-3 bg-[#111F30] rounded-lg border border-[#38BDF8]/20 space-y-2">
              <span className="text-[#818CF8] font-bold">Temp Band (°C):</span>
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-[#94A3B8]">Min:</label>
                <input
                  type="number"
                  value={tempThresholds.temperature.min}
                  onChange={e => setTempThresholds({
                    ...tempThresholds,
                    temperature: { ...tempThresholds.temperature, min: parseFloat(e.target.value) || 14 }
                  })}
                  className="w-14 bg-[#08111F] border border-[#38BDF8]/30 px-2 py-0.5 rounded text-[#F8FAFC]"
                />
                <label className="text-[10px] text-[#94A3B8]">Max:</label>
                <input
                  type="number"
                  value={tempThresholds.temperature.max}
                  onChange={e => setTempThresholds({
                    ...tempThresholds,
                    temperature: { ...tempThresholds.temperature, max: parseFloat(e.target.value) || 26 }
                  })}
                  className="w-14 bg-[#08111F] border border-[#38BDF8]/30 px-2 py-0.5 rounded text-[#F8FAFC]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#38BDF8]/15">
            <button
              onClick={() => setEditingThresholds(false)}
              className="px-3 py-1 text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              Cancel
            </button>
            <button
              onClick={saveThresholdChanges}
              className="px-4 py-1.5 rounded-lg bg-[#14B8A6] text-[#08111F] hover:bg-[#0D9488] font-bold text-xs"
            >
              Save Thresholds
            </button>
          </div>
        </div>
      )}

      {/* Multi-Parameter Comparative Trend Overview */}
      <MultiParameterChart readings={readings} />

      {/* Dedicated Separate Charts for all 4 parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* pH Chart */}
        <SensorTimeSeriesChart
          title="pH (Acidity / Alkalinity Scale)"
          parameterKey="ph"
          unit="pH"
          readings={readings}
          color="#4FDBC8"
          gradientId="grad-ph"
          nominalBand={{ min: thresholds.ph.min, max: thresholds.ph.max }}
        />

        {/* Dissolved Oxygen Chart */}
        <SensorTimeSeriesChart
          title="Dissolved Oxygen (DO Saturation)"
          parameterKey="dissolvedOxygen"
          unit="mg/L"
          readings={readings}
          color="#38BDF8"
          gradientId="grad-do"
          criticalThreshold={thresholds.dissolvedOxygen.minCritical}
        />

        {/* Turbidity Chart */}
        <SensorTimeSeriesChart
          title="Turbidity (Nephelometric Turbidity Units)"
          parameterKey="turbidity"
          unit="NTU"
          readings={readings}
          color="#F59E0B"
          gradientId="grad-turb"
          criticalThreshold={thresholds.turbidity.maxCritical}
        />

        {/* Water Temperature Chart */}
        <SensorTimeSeriesChart
          title="Water Temperature (DS18B20 1-Wire)"
          parameterKey="temperature"
          unit="°C"
          readings={readings}
          color="#818CF8"
          gradientId="grad-temp"
          nominalBand={{ min: thresholds.temperature.min, max: thresholds.temperature.max }}
        />
      </div>
    </div>
  );
};
