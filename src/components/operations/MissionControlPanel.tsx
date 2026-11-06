/**
 * Aqua Nexus — Mission Control & Vessel Operations Panel
 * Provides autonomous route sequencing, propulsion throttle monitor,
 * mission lifecycle controls, and hardware safety advisories.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  Pause, 
  Square, 
  Anchor, 
  AlertOctagon, 
  Compass, 
  Battery, 
  Sun, 
  RotateCw, 
  Radio, 
  Gauge, 
  ShieldAlert,
  CheckCircle2,
  ListOrdered
} from 'lucide-react';

export const MissionControlPanel: React.FC = () => {
  const {
    selectedRobot,
    currentMission,
    startMission,
    pauseMission,
    resumeMission,
    stopMission,
    returnToDock,
    emergencyStop,
    currentUser
  } = useApp();

  const [stopConfirmOpen, setStopConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'controls' | 'waypoints' | 'diagnostics'>('controls');

  const canControl = currentUser.role === 'admin' || currentUser.role === 'operator';

  const waypoints = currentMission?.waypoints || [];
  const currentWpIndex = currentMission?.currentWaypointIndex || 0;

  return (
    <div className="rounded-xl bg-[#0D1929]/95 backdrop-blur-md border border-[#38BDF8]/20 shadow-2xl p-5 space-y-5">
      {/* Header: Vessel Name, Model, & Mode */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#38BDF8]/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#14B8A6] border border-[#14B8A6]/30 px-1.5 py-0.5 rounded">
              {selectedRobot.id}
            </span>
            <h2 className="text-sm font-bold text-[#F8FAFC]">{selectedRobot.name}</h2>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-0.5 font-mono">
            Model: {selectedRobot.model} · Firmware: {selectedRobot.firmwareVersion}
          </p>
        </div>

        {/* Operational Status Badge */}
        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded text-xs font-mono font-bold tracking-wider uppercase border flex items-center gap-1.5 ${
            selectedRobot.status === 'navigating' ? 'bg-[#14B8A6]/20 text-[#4FDBC8] border-[#14B8A6]/40' :
            selectedRobot.status === 'emergency_stopped' ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/50' :
            selectedRobot.status === 'returning_to_dock' ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40' :
            selectedRobot.status === 'paused' ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40' :
            'bg-[#17202E] text-[#94A3B8] border-[#38BDF8]/20'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              selectedRobot.status === 'navigating' ? 'bg-[#4FDBC8] animate-pulse' :
              selectedRobot.status === 'emergency_stopped' ? 'bg-[#EF4444]' : 'bg-[#94A3B8]'
            }`} />
            <span>{selectedRobot.status.replace(/_/g, ' ')}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#38BDF8]/10 pb-2">
        <button
          onClick={() => setActiveTab('controls')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'controls' ? 'bg-[#14B8A6]/20 text-[#4FDBC8] border border-[#14B8A6]/30' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          Propulsion & Controls
        </button>
        <button
          onClick={() => setActiveTab('waypoints')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'waypoints' ? 'bg-[#14B8A6]/20 text-[#4FDBC8] border border-[#14B8A6]/30' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          Waypoint Route ({waypoints.length})
        </button>
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'diagnostics' ? 'bg-[#14B8A6]/20 text-[#4FDBC8] border border-[#14B8A6]/30' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          ESP32 Subsystems
        </button>
      </div>

      {/* Tab 1: Primary Controls */}
      {activeTab === 'controls' && (
        <div className="space-y-4">
          {/* Action Button Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {selectedRobot.status === 'navigating' ? (
              <button
                onClick={pauseMission}
                disabled={!canControl}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-[#F59E0B] hover:bg-[#F59E0B]/25 font-semibold text-xs transition-colors disabled:opacity-40"
              >
                <Pause className="w-4 h-4" />
                <span>Pause Mission</span>
              </button>
            ) : (
              <button
                onClick={selectedRobot.status === 'paused' ? resumeMission : startMission}
                disabled={!canControl || selectedRobot.status === 'emergency_stopped'}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#14B8A6] text-[#08111F] hover:bg-[#0D9488] font-bold text-xs transition-all shadow-[0_0_16px_rgba(20,184,166,0.3)] disabled:opacity-40"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{selectedRobot.status === 'paused' ? 'Resume Mission' : 'Start Mission'}</span>
              </button>
            )}

            <button
              onClick={() => setStopConfirmOpen(true)}
              disabled={!canControl || selectedRobot.status === 'idle'}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#111F30] border border-[#38BDF8]/30 text-[#DAE3F7] hover:border-[#EF4444] hover:text-[#EF4444] font-medium text-xs transition-colors disabled:opacity-40"
            >
              <Square className="w-4 h-4" />
              <span>Stop Mission</span>
            </button>

            <button
              onClick={returnToDock}
              disabled={!canControl || selectedRobot.status === 'returning_to_dock'}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#111F30] border border-[#38BDF8]/30 text-[#38BDF8] hover:bg-[#38BDF8]/10 font-medium text-xs transition-colors disabled:opacity-40"
            >
              <Anchor className="w-4 h-4" />
              <span>Return to Dock</span>
            </button>

            <button
              onClick={emergencyStop}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#EF4444] text-white hover:bg-[#DC2626] font-bold text-xs transition-all shadow-[0_0_18px_rgba(239,68,68,0.4)]"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>EMERGENCY STOP</span>
            </button>
          </div>

          {!canControl && (
            <div className="p-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded text-[11px] text-[#F59E0B]">
              <strong>Read-Only Access:</strong> Operator or Admin credentials required to trigger mission state changes. Use the Top Bar role switcher to test permissions.
            </div>
          )}

          {/* Propulsion & Power Telemetry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Battery */}
            <div className="p-3 rounded-lg bg-[#08111F] border border-[#38BDF8]/15 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                <span>BATTERY PACK</span>
                <Battery className="w-3.5 h-3.5 text-[#22C55E]" />
              </div>
              <div className="font-mono text-xl font-bold text-[#F8FAFC]">
                {selectedRobot.batteryPercentage}%
              </div>
              <div className="text-[10px] font-mono text-[#94A3B8]">
                {selectedRobot.batteryVoltage.toFixed(2)} VDC (3S LiPo)
              </div>
            </div>

            {/* Solar Harvesting */}
            <div className="p-3 rounded-lg bg-[#08111F] border border-[#38BDF8]/15 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                <span>SOLAR HARVEST</span>
                <Sun className="w-3.5 h-3.5 text-[#F59E0B]" />
              </div>
              <div className="font-mono text-xl font-bold text-[#F8FAFC]">
                {selectedRobot.solarChargingWatts.toFixed(1)} W
              </div>
              <div className="text-[10px] font-mono text-[#4FDBC8]">
                Photovoltaic assist active
              </div>
            </div>

            {/* Port Motor */}
            <div className="p-3 rounded-lg bg-[#08111F] border border-[#38BDF8]/15 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                <span>PORT MOTOR</span>
                <RotateCw className="w-3.5 h-3.5 text-[#38BDF8]" />
              </div>
              <div className="font-mono text-xl font-bold text-[#F8FAFC]">
                {selectedRobot.propulsionStatus.portMotorRpm} <span className="text-[10px] text-[#94A3B8]">RPM</span>
              </div>
              <div className="text-[10px] font-mono text-[#94A3B8]">
                Temp: {selectedRobot.propulsionStatus.motorTempC}°C
              </div>
            </div>

            {/* Starboard Motor */}
            <div className="p-3 rounded-lg bg-[#08111F] border border-[#38BDF8]/15 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                <span>STARBOARD MOTOR</span>
                <RotateCw className="w-3.5 h-3.5 text-[#38BDF8]" />
              </div>
              <div className="font-mono text-xl font-bold text-[#F8FAFC]">
                {selectedRobot.propulsionStatus.starboardMotorRpm} <span className="text-[10px] text-[#94A3B8]">RPM</span>
              </div>
              <div className="text-[10px] font-mono text-[#94A3B8]">
                Temp: {selectedRobot.propulsionStatus.motorTempC}°C
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Waypoints List */}
      {activeTab === 'waypoints' && (
        <div className="space-y-2">
          <div className="text-[11px] text-[#94A3B8] mb-2 flex items-center justify-between">
            <span>Autonomous Waypoint Execution Sequence</span>
            <span className="font-mono text-[#4FDBC8]">Waypoint {currentWpIndex + 1} of {waypoints.length} Target</span>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto">
            {waypoints.map((wp, idx) => {
              const isCurrent = idx === currentWpIndex;
              const isPast = idx < currentWpIndex;

              return (
                <div
                  key={wp.id}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                    isCurrent
                      ? 'bg-[#14B8A6]/15 border-[#14B8A6]/50 text-[#F8FAFC]'
                      : isPast
                      ? 'bg-[#08111F]/60 border-[#38BDF8]/10 text-[#94A3B8]'
                      : 'bg-[#111F30] border-[#38BDF8]/15 text-[#DAE3F7]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                      isCurrent ? 'bg-[#14B8A6] text-[#08111F]' : isPast ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-[#17202E] text-[#94A3B8]'
                    }`}>
                      {wp.order}
                    </span>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <span>{wp.label}</span>
                        {isCurrent && (
                          <span className="text-[9px] font-mono uppercase bg-[#14B8A6]/30 text-[#4FDBC8] px-1.5 py-0.2 rounded">
                            NAVIGATING NOW
                          </span>
                        )}
                        {isPast && (
                          <span className="text-[9px] font-mono text-[#22C55E] flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Sampled
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-[#94A3B8]">
                        LAT: {wp.lat.toFixed(5)} · LNG: {wp.lng.toFixed(5)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono text-[11px] text-[#94A3B8]">
                    Dwell: {wp.dwellTimeSeconds || 10}s
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: ESP32 Diagnostics */}
      {activeTab === 'diagnostics' && (
        <div className="p-3 bg-[#08111F] rounded-lg border border-[#38BDF8]/15 text-xs font-mono space-y-2">
          <div className="text-[#38BDF8] font-bold border-b border-[#38BDF8]/20 pb-1 flex items-center justify-between">
            <span>ESP32 SENSOR BUS HEALTH</span>
            <span className="text-[10px] text-[#22C55E]">ALL OK (4/4 PROBES ONLINE)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-[#94A3B8]">pH Glass Electrode: </span>
              <span className="text-[#22C55E]">NOMINAL (ADC-CH1)</span>
            </div>
            <div>
              <span className="text-[#94A3B8]">Dissolved Oxygen Galvanic: </span>
              <span className="text-[#22C55E]">NOMINAL (ADC-CH2)</span>
            </div>
            <div>
              <span className="text-[#94A3B8]">Optical Turbidity IR: </span>
              <span className="text-[#22C55E]">NOMINAL (ADC-CH3)</span>
            </div>
            <div>
              <span className="text-[#94A3B8]">DS18B20 Temp Probe: </span>
              <span className="text-[#22C55E]">NOMINAL (1-WIRE GPIO4)</span>
            </div>
            <div>
              <span className="text-[#94A3B8]">NEO-6M GPS Module: </span>
              <span className="text-[#22C55E]">UART2 (3D LOCK 11 SATS)</span>
            </div>
            <div>
              <span className="text-[#94A3B8]">Dual Motor Driver: </span>
              <span className="text-[#22C55E]">L298N / PWM 20kHz</span>
            </div>
          </div>
        </div>
      )}

      {/* Safety Notice Disclaimer */}
      <div className="p-2.5 rounded-lg bg-[#08111F] border border-[#F59E0B]/20 text-[10px] text-[#94A3B8] leading-relaxed flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
        <span>
          <strong>Hardware Safety Architecture:</strong> These simulated controls reflect digital twin commands. In physical deployments, emergency stopping is executed via dedicated hardware RF kill switches and onboard ESP32 watchdog fail-safes independently of the web browser.
        </span>
      </div>

      {/* Mission Stop Confirmation Dialog */}
      {stopConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111F30] border border-[#EF4444]/40 rounded-xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-[#EF4444]" />
              Confirm Mission Abort
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Are you sure you want to stop the active survey mission <strong className="text-[#DAE3F7]">{currentMission?.name}</strong>? The catamaran will disengage waypoint navigation and enter idle holding mode.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#38BDF8]/15">
              <button
                onClick={() => setStopConfirmOpen(false)}
                className="px-3 py-1.5 rounded-md text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#17202E]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  stopMission();
                  setStopConfirmOpen(false);
                }}
                className="px-4 py-1.5 rounded-md text-xs font-bold bg-[#EF4444] text-white hover:bg-[#DC2626]"
              >
                Confirm Stop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
