/**
 * Aqua Nexus — Vessel Operations & Mission Dispatch Center
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MissionControlPanel } from '../components/operations/MissionControlPanel';
import { Waypoint } from '../types/telemetry';
import { 
  Navigation, 
  MapPin, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  Compass, 
  Bot,
  Layers
} from 'lucide-react';

export const OperationsPage: React.FC = () => {
  const { currentMission, updateWaypoints, selectedRobot, currentUser } = useApp();
  const [newLabel, setNewLabel] = useState('');
  const [newLat, setNewLat] = useState('37.7760');
  const [newLng, setNewLng] = useState('-122.4180');
  const [newDepth, setNewDepth] = useState('1.0');

  const canEditWaypoints = currentUser.role === 'admin' || currentUser.role === 'operator';

  const handleAddWaypoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMission || !canEditWaypoints) return;
    const waypoints = currentMission.waypoints;
    const newWp: Waypoint = {
      id: `wp-${Date.now().toString().slice(-4)}`,
      order: waypoints.length + 1,
      label: newLabel || `Waypoint #${waypoints.length + 1}`,
      lat: parseFloat(newLat) || selectedRobot.currentCoords.lat,
      lng: parseFloat(newLng) || selectedRobot.currentCoords.lng,
      targetDepthMeters: parseFloat(newDepth) || 1.0,
      dwellTimeSeconds: 10,
      completed: false
    };
    updateWaypoints([...waypoints, newWp]);
    setNewLabel('');
  };

  const handleRemoveWaypoint = (wpId: string) => {
    if (!currentMission || !canEditWaypoints) return;
    const updated = currentMission.waypoints.filter(w => w.id !== wpId).map((w, idx) => ({
      ...w,
      order: idx + 1
    }));
    updateWaypoints(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0D1929]/90 border border-[#38BDF8]/15 rounded-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#14B8A6]" />
            <h1 className="text-base font-bold text-[#F8FAFC]">
              Autonomous Surface Vessel Operations & Route Dispatch
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Mission sequencing, propulsion state machine, and waypoint planning for {selectedRobot.name}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8]">
            OPERATING MODE: AUTONOMOUS GPS TRANSECT
          </span>
        </div>
      </div>

      {/* Main Mission Control Panel */}
      <MissionControlPanel />

      {/* Waypoint Route Planner */}
      <div className="p-5 rounded-xl bg-[#0D1929]/90 border border-[#38BDF8]/15 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#38BDF8]/10">
          <div>
            <h3 className="text-xs font-bold text-[#F8FAFC] uppercase font-mono">
              Autonomous Waypoint Mission Planner
            </h3>
            <p className="text-[11px] text-[#94A3B8]">
              Configure GPS coordinates, target probe depth, and dwell duration
            </p>
          </div>
          <span className="text-xs font-mono text-[#4FDBC8]">
            Total Waypoints: {currentMission?.waypoints.length || 0}
          </span>
        </div>

        {/* Add Waypoint Form */}
        {canEditWaypoints && (
          <form onSubmit={handleAddWaypoint} className="p-3 bg-[#08111F] rounded-lg border border-[#38BDF8]/20 grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-mono text-[#94A3B8] block mb-1">Station / Waypoint Label:</label>
              <input
                type="text"
                placeholder="e.g. South Inflow Basin Transect"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                className="w-full bg-[#111F30] border border-[#38BDF8]/30 px-2.5 py-1.5 rounded text-[#F8FAFC] text-xs outline-none focus:border-[#14B8A6]"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-[#94A3B8] block mb-1">Latitude:</label>
              <input
                type="text"
                value={newLat}
                onChange={e => setNewLat(e.target.value)}
                className="w-full bg-[#111F30] border border-[#38BDF8]/30 px-2.5 py-1.5 rounded text-[#F8FAFC] font-mono text-xs outline-none focus:border-[#14B8A6]"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-[#94A3B8] block mb-1">Longitude:</label>
              <input
                type="text"
                value={newLng}
                onChange={e => setNewLng(e.target.value)}
                className="w-full bg-[#111F30] border border-[#38BDF8]/30 px-2.5 py-1.5 rounded text-[#F8FAFC] font-mono text-xs outline-none focus:border-[#14B8A6]"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-1.5 px-3 rounded bg-[#14B8A6] text-[#08111F] font-bold text-xs hover:bg-[#0D9488] transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Waypoint</span>
              </button>
            </div>
          </form>
        )}

        {/* Waypoints Sequence List */}
        <div className="space-y-1.5">
          {currentMission?.waypoints.map((wp, idx) => (
            <div
              key={wp.id}
              className="p-3 rounded-lg bg-[#08111F] border border-[#38BDF8]/10 flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-[#111F30] border border-[#38BDF8]/30 text-[#38BDF8] flex items-center justify-center font-bold text-[10px]">
                  {wp.order}
                </span>
                <div>
                  <div className="text-[#F8FAFC] font-semibold">{wp.label}</div>
                  <div className="text-[10px] text-[#94A3B8]">
                    {wp.lat.toFixed(5)}° N, {Math.abs(wp.lng).toFixed(5)}° W · Depth: {wp.targetDepthMeters || 1.0}m
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#94A3B8]">Dwell: {wp.dwellTimeSeconds || 10}s</span>
                {canEditWaypoints && idx > 0 && (
                  <button
                    onClick={() => handleRemoveWaypoint(wp.id)}
                    className="p-1 rounded text-[#94A3B8] hover:text-[#EF4444] transition-colors"
                    title="Remove Waypoint"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
