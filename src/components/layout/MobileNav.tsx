/**
 * Aqua Nexus — Mobile Navigation Bar
 * Respects 15% mobile sticky cap and provides fluid thumb touch access
 */

import React, { useState } from 'react';
import { useApp, NavView } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Map, 
  Droplets, 
  Navigation, 
  Menu, 
  X,
  AlertTriangle,
  BrainCircuit,
  BarChart3,
  History,
  Bot,
  SlidersHorizontal,
  Users,
  Settings,
  Cpu
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeView, setActiveView, alerts, currentUser } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const unackCount = alerts.filter(a => !a.acknowledged).length;

  const quickTabs: { id: NavView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'map', label: 'GPS Map', icon: Map },
    { id: 'water-quality', label: 'Sensors', icon: Droplets },
    { id: 'operations', label: 'Control', icon: Navigation }
  ];

  const fullNav: { id: NavView; label: string; icon: React.ComponentType<{ className?: string }>; adminOnly?: boolean }[] = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Live GPS Map', icon: Map },
    { id: 'water-quality', label: 'Water Quality Telemetry', icon: Droplets },
    { id: 'operations', label: 'Robot Operations', icon: Navigation },
    { id: 'insights', label: 'AI Anomaly Insights', icon: BrainCircuit },
    { id: 'alerts', label: 'Alerts & Alarms', icon: AlertTriangle },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'missions', label: 'Mission History', icon: History },
    { id: 'devices', label: 'Device Management', icon: Bot },
    { id: 'calibrations', label: 'Sensor Calibration', icon: SlidersHorizontal },
    { id: 'esp32-bridge', label: 'ESP32 & MQTT Bridge', icon: Cpu },
    { id: 'users', label: 'User Admin', icon: Users, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Pinned Bottom Quick Navigation Strip for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#08111F]/95 backdrop-blur-lg border-t border-[#38BDF8]/20 px-3 py-1.5 flex items-center justify-around">
        {quickTabs.map(tab => {
          const isActive = activeView === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors ${
                isActive ? 'text-[#4FDBC8]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-tight">{tab.label}</span>
            </button>
          );
        })}

        {/* More Menu Drawer Button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] relative"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight">More</span>
          {unackCount > 0 && (
            <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-[#EF4444]" />
          )}
        </button>
      </nav>

      {/* Slide-over Drawer for All Pages */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-72 bg-[#0D1929] border-l border-[#38BDF8]/20 h-full p-4 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#38BDF8]/15 mb-3">
                <span className="text-xs font-bold text-[#F8FAFC] font-mono uppercase">
                  Aqua Nexus Navigation
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1 rounded text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {fullNav.map(item => {
                  if (item.adminOnly && currentUser.role !== 'admin') return null;
                  const isActive = activeView === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        setMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-[#14B8A6]/20 text-[#4FDBC8] font-bold border border-[#14B8A6]/30'
                          : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111F30]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.id === 'alerts' && unackCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-[#EF4444] text-white text-[9px] font-bold">
                          {unackCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#38BDF8]/15 text-[10px] font-mono text-[#94A3B8]">
              Role: <span className="text-[#4FDBC8] uppercase">{currentUser.role}</span>
              <div className="text-[9px] text-[#94A3B8]/60 mt-1">Aqua Nexus IoT Catamaran Platform</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
