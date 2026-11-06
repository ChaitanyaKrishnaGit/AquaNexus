/**
 * Aqua Nexus — Alerts & Alarm Management Page
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertsTable } from '../components/alerts/AlertsTable';
import { AlertTriangle, ShieldCheck, CheckCheck } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { alerts, clearAllAlerts, currentUser } = useApp();
  const unackCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0D1929]/90 border border-[#38BDF8]/15 rounded-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            <h1 className="text-base font-bold text-[#F8FAFC]">
              Alerts & Incident Response Center
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Real-time threshold breaches, vessel telemetry alarms, and sensor diagnostic warnings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="font-mono text-xs">
            <span className="text-[#94A3B8]">Pending: </span>
            <strong className="text-[#EF4444]">{unackCount}</strong>
            <span className="text-[#94A3B8]"> / Total: {alerts.length}</span>
          </div>

          {currentUser.role === 'admin' && alerts.length > 0 && (
            <button
              onClick={clearAllAlerts}
              className="px-3 py-1.5 rounded-lg bg-[#111F30] border border-[#38BDF8]/20 text-[#94A3B8] hover:text-[#EF4444] text-xs font-medium transition-colors"
            >
              Clear Dismissed
            </button>
          )}
        </div>
      </div>

      <AlertsTable />
    </div>
  );
};
