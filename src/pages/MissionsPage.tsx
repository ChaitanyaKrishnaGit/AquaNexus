/**
 * Aqua Nexus — Mission History & Survey Records
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mission } from '../types/telemetry';
import { 
  History, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export const MissionsPage: React.FC = () => {
  const { missions, selectedRobot, selectedLake } = useApp();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0D1929]/90 border border-[#38BDF8]/15 rounded-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#14B8A6]" />
            <h1 className="text-base font-bold text-[#F8FAFC]">
              Historical Survey Missions & Cruise Logs
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Archived limnological transects, waypoint executions, and spatial sampling records
          </p>
        </div>

        <div className="text-xs font-mono text-[#38BDF8]">
          {missions.length} Missions Logged
        </div>
      </div>

      {/* Missions Table */}
      <div className="rounded-xl border border-[#38BDF8]/15 bg-[#0D1929]/95 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08111F] border-b border-[#38BDF8]/15 text-[10px] font-mono uppercase tracking-wider text-[#94A3B8]">
              <tr>
                <th className="py-3 px-4">Mission ID / Status</th>
                <th className="py-3 px-4">Mission Name</th>
                <th className="py-3 px-4">Vessel & Waterbody</th>
                <th className="py-3 px-4">Waypoints / Samples</th>
                <th className="py-3 px-4">Distance</th>
                <th className="py-3 px-4">Start Time</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#38BDF8]/10 font-mono">
              {missions.map(m => (
                <tr 
                  key={m.id}
                  className="hover:bg-[#111F30]/70 transition-colors cursor-pointer group"
                  onClick={() => setSelectedMission(m)}
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#4FDBC8]">{m.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${
                        m.status === 'in_progress' ? 'bg-[#14B8A6]/20 text-[#4FDBC8] border-[#14B8A6]/40' :
                        m.status === 'completed' ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40' :
                        'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40'
                      }`}>
                        {m.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-sans font-semibold text-[#F8FAFC] group-hover:text-[#4FDBC8]">
                    {m.name}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-[11px] text-[#DAE3F7]">
                    <div>{m.robotId}</div>
                    <div className="text-[10px] text-[#94A3B8]">{m.lakeId}</div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-[11px]">
                    <div>{m.waypoints.length} Waypoints</div>
                    <div className="text-[10px] text-[#4FDBC8]">{m.totalSamplesCollected} Samples Taken</div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-[11px] text-[#DAE3F7]">
                    {m.distanceTraveledMeters} m
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-[11px] text-[#94A3B8]">
                    {new Date(m.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMission(m);
                      }}
                      className="px-2.5 py-1 rounded bg-[#111F30] border border-[#38BDF8]/20 text-[#38BDF8] hover:border-[#14B8A6] hover:text-[#4FDBC8] text-[11px] font-sans"
                    >
                      Inspect Route
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mission Detail Modal */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#111F30] border border-[#38BDF8]/40 rounded-xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#38BDF8]/20">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#38BDF8]">{selectedMission.id}</span>
                <h3 className="text-sm font-bold text-[#F8FAFC] mt-0.5">{selectedMission.name}</h3>
              </div>
              <button
                onClick={() => setSelectedMission(null)}
                className="text-[#94A3B8] hover:text-[#F8FAFC] text-sm"
              >
                &times;
              </button>
            </div>

            <div className="p-3 bg-[#08111F] rounded-lg border border-[#38BDF8]/15 grid grid-cols-2 gap-2 text-xs font-mono">
              <div>Vessel: <strong className="text-[#DAE3F7]">{selectedMission.robotId}</strong></div>
              <div>Waterbody: <strong className="text-[#DAE3F7]">{selectedMission.lakeId}</strong></div>
              <div>Distance Traveled: <strong className="text-[#4FDBC8]">{selectedMission.distanceTraveledMeters} m</strong></div>
              <div>Samples Gathered: <strong className="text-[#4FDBC8]">{selectedMission.totalSamplesCollected}</strong></div>
              <div>Start: <strong className="text-[#DAE3F7]">{new Date(selectedMission.startTime).toLocaleTimeString()}</strong></div>
              <div>Alerts During Run: <strong className="text-[#EF4444]">{selectedMission.alertsTriggered}</strong></div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-[#38BDF8]">
                Executed Waypoints ({selectedMission.waypoints.length})
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {selectedMission.waypoints.map(wp => (
                  <div key={wp.id} className="p-2 rounded bg-[#08111F] border border-[#38BDF8]/10 text-xs font-mono flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[#4FDBC8] font-bold">#{wp.order}</span>
                      <span className="text-[#F8FAFC]">{wp.label}</span>
                    </div>
                    <span className="text-[10px] text-[#94A3B8]">
                      {wp.lat.toFixed(4)}, {wp.lng.toFixed(4)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#38BDF8]/15">
              <button
                onClick={() => setSelectedMission(null)}
                className="px-4 py-1.5 rounded-lg bg-[#14B8A6] text-[#08111F] font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
