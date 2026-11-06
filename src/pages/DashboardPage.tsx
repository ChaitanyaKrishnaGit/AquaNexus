/**
 * Aqua Nexus — Overview Dashboard
 * Visual highlight of the platform: Real-time GIS map, sensor telemetry quadrant,
 * WQI gauge, active vessel health, and recent alert ribbons.
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { LakeMap } from '../components/map/LakeMap';
import { SensorMetricCard } from '../components/sensors/SensorMetricCard';
import { WaterQualityIndexGauge } from '../components/sensors/WaterQualityIndexGauge';
import { 
  Bot, 
  Waves, 
  AlertTriangle, 
  Activity, 
  Battery, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    selectedLake, 
    selectedRobot, 
    robots, 
    lakes, 
    alerts, 
    readings, 
    latestReading, 
    currentMission,
    setActiveView 
  } = useApp();

  const unackAlerts = alerts.filter(a => !a.acknowledged);

  // Compute 24h min/max/avg for all 4 parameters
  const stats = (key: 'ph' | 'dissolvedOxygen' | 'turbidity' | 'temperature') => {
    const vals = readings.map(r => r[key]);
    if (vals.length === 0) return { min: 0, max: 0, avg: 0, delta: 0, sparkline: [0] };
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const latest = vals[vals.length - 1];
    const prev = vals[Math.max(0, vals.length - 10)] || latest;
    const delta = prev !== 0 ? ((latest - prev) / prev) * 100 : 0;
    const sparkline = vals.slice(-20);
    return { min, max, avg, delta, sparkline };
  };

  const phStats = stats('ph');
  const doStats = stats('dissolvedOxygen');
  const turbStats = stats('turbidity');
  const tempStats = stats('temperature');

  return (
    <div className="space-y-6">
      {/* Top Section: KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Total Robots */}
        <div className="p-3.5 rounded-xl bg-[#0D1929]/90 border border-[#38BDF8]/15 backdrop-blur-md">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#94A3B8]">
            <span>Active Robots</span>
            <Bot className="w-3.5 h-3.5 text-[#14B8A6]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#F8FAFC] mt-1 tabular-nums">
            {robots.filter(r => r.status === 'navigating').length} <span className="text-xs font-normal text-[#94A3B8]">/ {robots.length}</span>
          </div>
          <div className="text-[10px] text-[#4FDBC8] font-mono mt-0.5">
            100% Catamaran readiness
          </div>
        </div>

        {/* Monitored Lakes */}
        <div className="p-3.5 rounded-xl bg-[#0D1929]/90 border border-[#38BDF8]/15 backdrop-blur-md">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#94A3B8]">
            <span>Lakes Monitored</span>
            <Waves className="w-3.5 h-3.5 text-[#38BDF8]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#F8FAFC] mt-1 tabular-nums">
            {lakes.length}
          </div>
          <div className="text-[10px] text-[#38BDF8] font-mono mt-0.5 truncate">
            {selectedLake.name}
          </div>
        </div>

        {/* Vessel Battery */}
        <div className="p-3.5 rounded-xl bg-[#0D1929]/90 border border-[#38BDF8]/15 backdrop-blur-md">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#94A3B8]">
            <span>Vessel Battery</span>
            <Battery className="w-3.5 h-3.5 text-[#22C55E]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#F8FAFC] mt-1 tabular-nums">
            {selectedRobot.batteryPercentage}%
          </div>
          <div className="text-[10px] text-[#22C55E] font-mono mt-0.5">
            +{selectedRobot.solarChargingWatts}W Solar assist
          </div>
        </div>

        {/* Water Quality Index */}
        <div className="p-3.5 rounded-xl bg-[#0D1929]/90 border border-[#38BDF8]/15 backdrop-blur-md">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#94A3B8]">
            <span>Overall WQI Score</span>
            <Activity className="w-3.5 h-3.5 text-[#4FDBC8]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#4FDBC8] mt-1 tabular-nums">
            {latestReading.wqi} <span className="text-xs font-normal text-[#94A3B8]">/ 100</span>
          </div>
          <div className="text-[10px] text-[#22C55E] font-mono mt-0.5">
            Good Ecological State
          </div>
        </div>

        {/* Unacknowledged Alerts */}
        <div className="p-3.5 rounded-xl bg-[#0D1929]/90 border border-[#38BDF8]/15 backdrop-blur-md col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#94A3B8]">
            <span>Active Alerts</span>
            <AlertTriangle className={`w-3.5 h-3.5 ${unackAlerts.length > 0 ? 'text-[#EF4444]' : 'text-[#22C55E]'}`} />
          </div>
          <div className={`font-mono text-2xl font-bold mt-1 tabular-nums ${unackAlerts.length > 0 ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
            {unackAlerts.length}
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
            {unackAlerts.length > 0 ? 'Attention required' : 'All nominal'}
          </div>
        </div>
      </div>

      {/* Main Grid: Map & Primary Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Cols: Interactive GPS Lake Map */}
        <div className="lg:col-span-8 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
              <h2 className="text-sm font-bold text-[#F8FAFC]">Live GIS Basin Telemetry</h2>
              <span className="text-[10px] font-mono text-[#94A3B8]">
                [Waypoint Navigation Active]
              </span>
            </div>
            <button
              onClick={() => setActiveView('map')}
              className="text-xs text-[#38BDF8] hover:text-[#4FDBC8] font-medium flex items-center gap-1 transition-colors"
            >
              <span>Full Map & Routes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <LakeMap heightClass="h-[420px]" />
        </div>

        {/* Right 4 Cols: WQI Dial & Active Mission Card */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <WaterQualityIndexGauge score={latestReading.wqi} />

          {/* Active Mission Card */}
          <div className="p-4 rounded-xl bg-[#0D1929]/90 border border-[#38BDF8]/15 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#38BDF8]/10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8]">
                  ACTIVE LIMNOLOGICAL MISSION
                </span>
                <span className="text-[10px] font-mono text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/30 px-1.5 py-0.2 rounded">
                  IN PROGRESS
                </span>
              </div>
              <h3 className="text-xs font-bold text-[#F8FAFC] mt-2">
                {currentMission?.name}
              </h3>
              <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">
                Autonomous surface vessel executing continuous 4-probe spatial transects across designated reservoir sectors.
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-[#38BDF8]/10 flex items-center justify-between text-xs">
              <div className="font-mono text-[10px] text-[#94A3B8]">
                <div>Samples: <strong className="text-[#DAE3F7]">{currentMission?.totalSamplesCollected}</strong></div>
                <div>Distance: <strong className="text-[#DAE3F7]">{currentMission?.distanceTraveledMeters}m</strong></div>
              </div>
              <button
                onClick={() => setActiveView('operations')}
                className="px-3 py-1.5 rounded-lg bg-[#14B8A6] text-[#08111F] hover:bg-[#0D9488] font-bold text-xs transition-colors"
              >
                Control Mission
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Quadrant: 4 Core Parameters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#F8FAFC]">Water Chemistry Sensor Stream</h2>
            <p className="text-[11px] text-[#94A3B8]">Real-time calibrated probe telemetry from {selectedRobot.name}</p>
          </div>
          <button
            onClick={() => setActiveView('water-quality')}
            className="text-xs text-[#38BDF8] hover:text-[#4FDBC8] font-medium flex items-center gap-1 transition-colors"
          >
            <span>Deep Dive Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* pH */}
          <SensorMetricCard
            label="pH (Acidity / Alkalinity)"
            code="PH-ELECTRODE"
            value={latestReading.ph}
            unit="pH"
            minVal={phStats.min}
            maxVal={phStats.max}
            avgVal={phStats.avg}
            deltaPercent={phStats.delta}
            status={latestReading.ph < 6.5 || latestReading.ph > 8.5 ? 'warning' : 'nominal'}
            thresholdText="6.50 – 8.50 pH"
            accentColor="#4FDBC8"
            sparklineData={phStats.sparkline}
            onClick={() => setActiveView('water-quality')}
          />

          {/* Dissolved Oxygen */}
          <SensorMetricCard
            label="Dissolved Oxygen"
            code="GALVANIC-DO"
            value={latestReading.dissolvedOxygen}
            unit="mg/L"
            minVal={doStats.min}
            maxVal={doStats.max}
            avgVal={doStats.avg}
            deltaPercent={doStats.delta}
            status={latestReading.dissolvedOxygen < 4.0 ? 'critical' : latestReading.dissolvedOxygen < 5.5 ? 'warning' : 'nominal'}
            thresholdText="> 6.00 mg/L"
            accentColor="#38BDF8"
            sparklineData={doStats.sparkline}
            onClick={() => setActiveView('water-quality')}
          />

          {/* Turbidity */}
          <SensorMetricCard
            label="Turbidity (Clarity)"
            code="OPTICAL-NEPHELO"
            value={latestReading.turbidity}
            unit="NTU"
            minVal={turbStats.min}
            maxVal={turbStats.max}
            avgVal={turbStats.avg}
            deltaPercent={turbStats.delta}
            status={latestReading.turbidity > 25.0 ? 'critical' : latestReading.turbidity > 10.0 ? 'warning' : 'nominal'}
            thresholdText="< 5.00 NTU"
            accentColor="#F59E0B"
            sparklineData={turbStats.sparkline}
            onClick={() => setActiveView('water-quality')}
          />

          {/* Water Temperature */}
          <SensorMetricCard
            label="Water Temperature"
            code="DS18B20-TEMP"
            value={latestReading.temperature}
            unit="°C"
            minVal={tempStats.min}
            maxVal={tempStats.max}
            avgVal={tempStats.avg}
            deltaPercent={tempStats.delta}
            status={latestReading.temperature < 14 || latestReading.temperature > 26 ? 'warning' : 'nominal'}
            thresholdText="16.0 – 24.0 °C"
            accentColor="#818CF8"
            sparklineData={tempStats.sparkline}
            onClick={() => setActiveView('water-quality')}
          />
        </div>
      </div>

      {/* Bottom Alert Ribbon if unacknowledged alerts exist */}
      {unackAlerts.length > 0 && (
        <div className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#EF4444] shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#F8FAFC]">
                {unackAlerts.length} Unacknowledged Alert{unackAlerts.length > 1 ? 's' : ''} Requiring Review
              </div>
              <div className="text-[11px] text-[#94A3B8] line-clamp-1">
                Latest: {unackAlerts[0].title} — {unackAlerts[0].description}
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveView('alerts')}
            className="px-3 py-1.5 rounded-lg bg-[#EF4444] text-white hover:bg-[#DC2626] font-bold text-xs whitespace-nowrap transition-colors"
          >
            Review & Acknowledge
          </button>
        </div>
      )}
    </div>
  );
};
