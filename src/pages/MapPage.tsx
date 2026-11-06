/**
 * Aqua Nexus — Dedicated Full-Screen Live GPS Map
 * High-resolution GIS interface with waypoints inspector and real-time boat telemetry
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { LakeMap } from '../components/map/LakeMap';
import { 
  Navigation, 
  MapPin, 
  Compass, 
  Battery, 
  Radio, 
  ShieldCheck, 
  Crosshair,
  Info
} from 'lucide-react';

export const MapPage: React.FC = () => {
  const { selectedLake, selectedRobot, currentMission, latestReading } = useApp();

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0D1929]/90 border border-[#38BDF8]/15 rounded-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#14B8A6]" />
            <h1 className="text-base font-bold text-[#F8FAFC]">
              Autonomous Spatial Navigation & GPS Mapping
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Geospatial tracking of {selectedRobot.name} over {selectedLake.name} ({selectedLake.location})
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-[#14B8A6]/15 border border-[#14B8A6]/30 text-[#4FDBC8]">
            3D GPS LOCK ({selectedRobot.gpsFix.satellitesTracked} SATS · HDOP {selectedRobot.gpsFix.hdop})
          </span>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Map Container */}
        <div className="lg:col-span-9">
          <LakeMap heightClass="h-[620px]" />
        </div>

        {/* Right Telemetry & Waypoints Panel */}
        <div className="lg:col-span-3 space-y-4">
          {/* Target Vessel Inspector */}
          <div className="p-4 rounded-xl bg-[#0D1929] border border-[#38BDF8]/15 space-y-3">
            <div className="flex items-center justify-between border-b border-[#38BDF8]/10 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8]">
                Vessel Spatial HUD
              </span>
              <span className="text-[10px] font-mono text-[#22C55E] uppercase font-bold">
                {selectedRobot.status}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-[#94A3B8] block text-[10px]">LATITUDE:</span>
                <strong className="text-[#F8FAFC]">{selectedRobot.currentCoords.lat.toFixed(6)}° N</strong>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px]">LONGITUDE:</span>
                <strong className="text-[#F8FAFC]">{selectedRobot.currentCoords.lng.toFixed(6)}° W</strong>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[#94A3B8] block text-[10px]">SPEED:</span>
                  <strong className="text-[#4FDBC8]">{selectedRobot.speedKnots.toFixed(1)} kts</strong>
                </div>
                <div>
                  <span className="text-[#94A3B8] block text-[10px]">HEADING:</span>
                  <strong className="text-[#4FDBC8]">{Math.round(selectedRobot.headingDegrees)}°</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#38BDF8]/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#22C55E] font-mono">
                <Battery className="w-4 h-4" />
                <span>{selectedRobot.batteryPercentage}%</span>
              </div>
              <span className="text-[10px] font-mono text-[#94A3B8]">
                {selectedRobot.batteryVoltage.toFixed(2)}V
              </span>
            </div>
          </div>

          {/* Established Sampling Stations List */}
          <div className="p-4 rounded-xl bg-[#0D1929] border border-[#38BDF8]/15 space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] border-b border-[#38BDF8]/10 pb-1">
              Fixed Sampling Stations ({selectedLake.samplingStations.length})
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {selectedLake.samplingStations.map(st => (
                <div key={st.id} className="p-2 rounded bg-[#08111F] border border-[#38BDF8]/10 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[#4FDBC8] text-[10px]">{st.stationCode}</span>
                    <span className="text-[9px] font-mono text-[#94A3B8]">Depth: ~1.5m</span>
                  </div>
                  <div className="font-semibold text-[#F8FAFC] mt-0.5">{st.name}</div>
                  <div className="text-[10px] text-[#94A3B8] font-mono mt-1">
                    {st.coords.lat.toFixed(4)}° N, {Math.abs(st.coords.lng).toFixed(4)}° W
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
