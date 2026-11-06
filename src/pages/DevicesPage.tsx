/**
 * Aqua Nexus — Fleet & Device Management Page
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RobotDevice } from '../types/telemetry';
import { 
  Bot, 
  Plus, 
  Battery, 
  Sun, 
  Compass, 
  Radio, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  Cpu,
  Layers
} from 'lucide-react';

export const DevicesPage: React.FC = () => {
  const { robots, selectedRobot, setSelectedRobotId, registerRobot, currentUser, lakes } = useApp();

  const [registerOpen, setRegisterOpen] = useState(false);
  const [newRobotName, setNewRobotName] = useState('');
  const [newModel, setNewModel] = useState('AquaNexus Mark II Catamaran');

  const canManageDevices = currentUser.role === 'admin';

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRobotName) return;
    registerRobot({
      name: newRobotName,
      model: newModel
    });
    setNewRobotName('');
    setRegisterOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0D1929]/90 border border-[#38BDF8]/15 rounded-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#14B8A6]" />
            <h1 className="text-base font-bold text-[#F8FAFC]">
              Catamaran Fleet & Sensor Hardware Management
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Hardware provisioning, ESP32 firmware versions, sensor health matrices, and lake deployment
          </p>
        </div>

        {canManageDevices && (
          <button
            onClick={() => setRegisterOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14B8A6] text-[#08111F] hover:bg-[#0D9488] font-bold text-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Vessel</span>
          </button>
        )}
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {robots.map(robot => {
          const isSelected = robot.id === selectedRobot.id;

          return (
            <div
              key={robot.id}
              className={`p-5 rounded-xl border backdrop-blur-md transition-all shadow-xl space-y-4 ${
                isSelected
                  ? 'bg-[#0D1929] border-[#14B8A6]/50 shadow-[0_0_20px_rgba(20,184,166,0.15)]'
                  : 'bg-[#0D1929]/80 border-[#38BDF8]/15 hover:border-[#38BDF8]/40'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#38BDF8] border border-[#38BDF8]/30 px-1.5 py-0.2 rounded">
                      {robot.id}
                    </span>
                    <h3 className="text-sm font-bold text-[#F8FAFC]">{robot.name}</h3>
                  </div>
                  <p className="text-[11px] font-mono text-[#94A3B8] mt-0.5">{robot.model}</p>
                </div>

                <div className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                  robot.status === 'navigating' ? 'bg-[#14B8A6]/20 text-[#4FDBC8] border-[#14B8A6]/40' :
                  robot.status === 'emergency_stopped' ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40' :
                  'bg-[#17202E] text-[#94A3B8] border-[#38BDF8]/20'
                }`}>
                  {robot.status.replace(/_/g, ' ')}
                </div>
              </div>

              {/* Hardware Status Strip */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-[#08111F] rounded-lg border border-[#38BDF8]/10 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">BATTERY:</span>
                  <span className="text-[#22C55E] font-bold">{robot.batteryPercentage}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">SOLAR INPUT:</span>
                  <span className="text-[#F59E0B] font-bold">{robot.solarChargingWatts} W</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">FIRMWARE:</span>
                  <span className="text-[#DAE3F7]">{robot.firmwareVersion}</span>
                </div>
              </div>

              {/* Sensor Health Status */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8]">
                  Onboard Probes Health
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-[#22C55E]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>pH Glass Electrode: Nominal</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#22C55E]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Dissolved Oxygen: Nominal</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#22C55E]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Optical Turbidity: Nominal</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#22C55E]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>DS18B20 Temp: Nominal</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#38BDF8]/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#94A3B8]">
                  Assigned Lake: {robot.lakeId}
                </span>

                <button
                  onClick={() => setSelectedRobotId(robot.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-[#14B8A6]/20 text-[#4FDBC8] border border-[#14B8A6]/40'
                      : 'bg-[#111F30] border border-[#38BDF8]/30 text-[#DAE3F7] hover:text-[#4FDBC8]'
                  }`}
                >
                  {isSelected ? 'Active Selection' : 'Select Target Vessel'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Registration Modal */}
      {registerOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleRegister} className="w-full max-w-md bg-[#111F30] border border-[#14B8A6]/40 rounded-xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-[#F8FAFC]">Register New Catamaran Vessel</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-mono text-[#94A3B8] block mb-1">Vessel Call-sign / Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Proteus-3 Limno-Cat"
                  value={newRobotName}
                  onChange={e => setNewRobotName(e.target.value)}
                  required
                  className="w-full bg-[#08111F] border border-[#38BDF8]/30 px-3 py-2 rounded text-[#F8FAFC] outline-none focus:border-[#14B8A6]"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-[#94A3B8] block mb-1">Hardware Model:</label>
                <input
                  type="text"
                  value={newModel}
                  onChange={e => setNewModel(e.target.value)}
                  className="w-full bg-[#08111F] border border-[#38BDF8]/30 px-3 py-2 rounded text-[#F8FAFC] outline-none focus:border-[#14B8A6]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#38BDF8]/15">
              <button
                type="button"
                onClick={() => setRegisterOpen(false)}
                className="px-3 py-1.5 rounded text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-[#14B8A6] text-[#08111F] font-bold text-xs hover:bg-[#0D9488]"
              >
                Register Vessel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
