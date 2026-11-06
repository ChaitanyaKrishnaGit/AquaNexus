/**
 * Aqua Nexus — Desktop & Tablet Navigation Sidebar
 */

import React from 'react';
import { useApp, NavView } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Map, 
  Droplets, 
  Navigation, 
  BrainCircuit, 
  AlertTriangle, 
  BarChart3, 
  History, 
  Bot, 
  SlidersHorizontal, 
  Users, 
  Settings, 
  Cpu,
  Layers,
  ShieldAlert
} from 'lucide-react';

interface NavItem {
  id: NavView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roleRestricted?: boolean;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, currentUser, alerts } = useApp();

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Live GPS Map', icon: Map },
    { id: 'water-quality', label: 'Water Quality', icon: Droplets },
    { id: 'operations', label: 'Robot Operations', icon: Navigation },
    { id: 'insights', label: 'AI Anomaly Insights', icon: BrainCircuit },
    { id: 'alerts', label: 'Alerts & Alarms', icon: AlertTriangle, badge: unacknowledgedCount },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'missions', label: 'Mission History', icon: History },
    { id: 'devices', label: 'Device Management', icon: Bot },
    { id: 'calibrations', label: 'Sensor Calibration', icon: SlidersHorizontal },
    { id: 'esp32-bridge', label: 'ESP32 & MQTT Bridge', icon: Cpu },
    { id: 'users', label: 'User Admin', icon: Users, roleRestricted: true },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0D1929] border-r border-[#38BDF8]/15 flex flex-col justify-between shrink-0 h-[calc(100vh-57px)] sticky top-[57px]">
      {/* Top Menu Links */}
      <div className="p-3 overflow-y-auto space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#94A3B8]">
          Navigation
        </div>
        {navItems.map(item => {
          // If restricted to Admin, disable or show lock for non-admin
          const isRestricted = item.roleRestricted && currentUser.role !== 'admin';
          if (isRestricted) return null;

          const isActive = activeView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-[#14B8A6]/20 text-[#4FDBC8] border border-[#14B8A6]/40 shadow-[0_0_12px_rgba(20,184,166,0.15)] font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111F30]'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#14B8A6]' : 'text-[#94A3B8] group-hover:text-[#38BDF8]'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold font-mono bg-[#EF4444] text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Telemetry Health Status Panel */}
      <div className="p-3 border-t border-[#38BDF8]/15 bg-[#08111F]/80">
        <div className="p-2.5 rounded-lg bg-[#111F30] border border-[#38BDF8]/20 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#94A3B8] font-mono">SIMULATION FEED:</span>
            <span className="text-[#22C55E] font-mono font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              ONLINE
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#94A3B8] font-mono">HARDWARE BRIDGE:</span>
            <span className="text-[#38BDF8] font-mono text-[10px] border border-[#38BDF8]/30 px-1 py-0.2 rounded">
              READY (ESP32)
            </span>
          </div>
          <div className="text-[10px] text-[#94A3B8] leading-tight pt-1 border-t border-[#38BDF8]/10">
            Catamaran Prototype · Dual Propeller · 4-Probe Array
          </div>
        </div>
      </div>
    </aside>
  );
};
