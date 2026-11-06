/**
 * Aqua Nexus — Top Bar Navigation Header
 * Complies with Top Bar Contract: Brand Zone, Central Telemetry Context, Primary User & Alerts
 */

import React, { useState } from 'react';
import { useApp, NavView } from '../../context/AppContext';
import { UserRole } from '../../types/telemetry';
import { 
  Waves, 
  Bell, 
  CheckCircle2, 
  Radio, 
  ShieldCheck, 
  ChevronDown, 
  Sliders, 
  LogOut,
  Sparkles,
  Cpu
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    switchRole, 
    lakes, 
    selectedLake, 
    setSelectedLakeId, 
    alerts, 
    setActiveView,
    activeView,
    simulationRunning,
    lastUpdateTime
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [lakeDropdownOpen, setLakeDropdownOpen] = useState(false);

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'admin', label: 'Administrator', desc: 'Full system, user, & device control' },
    { role: 'operator', label: 'Robot Operator', desc: 'Missions, waypoints, & alert mitigation' },
    { role: 'researcher', label: 'Limnology Researcher', desc: 'Water quality analytics & report exports' },
    { role: 'viewer', label: 'Public Agency Viewer', desc: 'Read-only lake monitoring' }
  ];

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-6 px-4 md:px-6 py-3 bg-[#08111F]/90 backdrop-blur-md border-b border-[#38BDF8]/15">
      {/* Zone 1: Single Brand Wordmark & System Identifier */}
      <div className="flex items-center gap-3 shrink-0">
        <button 
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#14B8A6] to-[#007065] flex items-center justify-center shadow-[0_0_12px_rgba(20,184,166,0.4)]">
            <Waves className="w-5 h-5 text-[#08111F] stroke-[2.5]" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-[#F8FAFC] group-hover:text-[#4FDBC8] transition-colors whitespace-nowrap">
              Aqua Nexus
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] border border-[#38BDF8]/30 px-1.5 py-0.2 rounded">
              Limno-IoT v2.4
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: Lake Selector & Telemetry Feed Status */}
      <div className="flex items-center gap-3">
        {/* Lake Selector Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setLakeDropdownOpen(!lakeDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#DAE3F7] bg-[#0D1929] border border-[#38BDF8]/20 rounded-md hover:border-[#38BDF8]/40 transition-colors"
          >
            <span className="text-[#94A3B8]">Waterbody:</span>
            <span className="font-semibold text-[#F8FAFC] truncate max-w-[140px] sm:max-w-[200px]">
              {selectedLake.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
          </button>

          {lakeDropdownOpen && (
            <div 
              className="absolute left-0 mt-1 w-64 bg-[#111F30] border border-[#38BDF8]/30 rounded-lg shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setLakeDropdownOpen(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] border-b border-[#38BDF8]/10">
                Monitored Waterbodies
              </div>
              {lakes.map(lake => (
                <button
                  key={lake.id}
                  onClick={() => {
                    setSelectedLakeId(lake.id);
                    setLakeDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors flex items-center justify-between ${
                    lake.id === selectedLake.id ? 'bg-[#14B8A6]/20 text-[#4FDBC8] font-semibold' : 'text-[#DAE3F7] hover:bg-[#17202E]'
                  }`}
                >
                  <div>
                    <div className="font-medium">{lake.name}</div>
                    <div className="text-[10px] text-[#94A3B8] font-mono">{lake.location}</div>
                  </div>
                  {lake.id === selectedLake.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#14B8A6]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Real-time Telemetry Live Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 text-[11px] font-mono bg-[#0D1929] border border-[#14B8A6]/30 rounded-md text-[#4FDBC8]">
          <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
          <span>STREAM:</span>
          <span className="text-[#F8FAFC]">
            {simulationRunning ? 'SIMULATOR ACTIVE' : 'PAUSED'}
          </span>
          <span className="text-[#94A3B8] border-l border-[#38BDF8]/20 pl-2">
            {lastUpdateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Zone 3: Alert Drawer Affordance & Role Switcher */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Alerts Bell */}
        <button
          onClick={() => setActiveView('alerts')}
          className="relative p-2 rounded-md bg-[#0D1929] border border-[#38BDF8]/20 text-[#DAE3F7] hover:text-[#F8FAFC] hover:border-[#38BDF8]/40 transition-colors"
          title="Active Alerts"
          aria-label="View Alerts"
        >
          <Bell className="w-4 h-4" />
          {unacknowledgedAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[10px] font-bold font-mono bg-[#EF4444] text-white rounded-full min-w-[18px] text-center shadow-[0_0_8px_rgba(239,68,68,0.6)]">
              {unacknowledgedAlerts.length}
            </span>
          )}
        </button>

        {/* Quick Role Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#F8FAFC] bg-[#111F30] border border-[#14B8A6]/30 rounded-md hover:border-[#14B8A6] transition-colors shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6]" />
            <span className="capitalize">{currentUser.role}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
          </button>

          {roleDropdownOpen && (
            <div 
              className="absolute right-0 mt-1 w-64 bg-[#111F30] border border-[#14B8A6]/30 rounded-lg shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setRoleDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-[#38BDF8]/10">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8]">
                  Switch Access Role (RBAC)
                </div>
                <div className="text-xs font-semibold text-[#F8FAFC] mt-0.5 truncate">
                  {currentUser.name}
                </div>
              </div>
              <div className="p-1 space-y-0.5">
                {roles.map(r => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchRole(r.role);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                      currentUser.role === r.role ? 'bg-[#14B8A6]/20 text-[#4FDBC8] font-semibold' : 'text-[#DAE3F7] hover:bg-[#17202E]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{r.label}</span>
                      {currentUser.role === r.role && <CheckCircle2 className="w-3 h-3 text-[#14B8A6]" />}
                    </div>
                    <div className="text-[10px] text-[#94A3B8] font-normal leading-tight mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
              <div className="pt-1 mt-1 border-t border-[#38BDF8]/10">
                <button
                  onClick={() => {
                    setActiveView('users');
                    setRoleDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-[11px] text-[#38BDF8] hover:bg-[#17202E] rounded transition-colors flex items-center gap-1.5"
                >
                  <Sliders className="w-3 h-3" />
                  <span>Manage Users & Permissions</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
