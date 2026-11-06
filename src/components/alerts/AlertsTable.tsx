/**
 * Aqua Nexus — Alerts & Alarm Management Table
 * Comprehensive filtering by severity, category, and acknowledgement state
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Alert, AlertSeverity, AlertCategory } from '../../types/telemetry';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  ChevronRight,
  Check
} from 'lucide-react';

export const AlertsTable: React.FC = () => {
  const { alerts, acknowledgeAlert, clearAllAlerts, currentUser } = useApp();

  const [severityFilter, setSeverityFilter] = useState<'all' | AlertSeverity>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unacknowledged' | 'acknowledged'>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const canAcknowledge = currentUser.role === 'admin' || currentUser.role === 'operator';

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (statusFilter === 'unacknowledged' && a.acknowledged) return false;
    if (statusFilter === 'acknowledged' && !a.acknowledged) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Controls Bar: Filters & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0D1929]/90 backdrop-blur-md border border-[#38BDF8]/15 rounded-xl">
        {/* Severity Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono text-[#94A3B8] uppercase mr-1">Severity:</span>
          {(['all', 'critical', 'warning', 'advisory'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors ${
                severityFilter === sev
                  ? 'bg-[#14B8A6] text-[#08111F] font-bold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111F30]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#94A3B8] uppercase">Status:</span>
          {(['all', 'unacknowledged', 'acknowledged'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-[#38BDF8]/15 bg-[#0D1929]/95 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08111F] border-b border-[#38BDF8]/15 text-[10px] font-mono uppercase tracking-wider text-[#94A3B8]">
              <tr>
                <th className="py-3 px-4">Severity / Code</th>
                <th className="py-3 px-4">Category & Event Title</th>
                <th className="py-3 px-4">Vessel / Lake</th>
                <th className="py-3 px-4">Measured vs Threshold</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#38BDF8]/10">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#94A3B8] text-xs">
                    <ShieldAlert className="w-8 h-8 text-[#14B8A6]/40 mx-auto mb-2" />
                    No alerts matching current filter parameters.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map(alert => {
                  const severityBadge = {
                    critical: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40',
                    warning: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40',
                    advisory: 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/40'
                  }[alert.severity];

                  return (
                    <tr 
                      key={alert.id}
                      className="hover:bg-[#111F30]/70 transition-colors cursor-pointer group"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      {/* Severity */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${severityBadge}`}>
                            {alert.severity}
                          </span>
                          <span className="font-mono text-[10px] text-[#94A3B8]">{alert.id}</span>
                        </div>
                      </td>

                      {/* Title & Description */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#F8FAFC] group-hover:text-[#4FDBC8] transition-colors">
                          {alert.title}
                        </div>
                        <div className="text-[11px] text-[#94A3B8] line-clamp-1 mt-0.5">
                          {alert.description}
                        </div>
                      </td>

                      {/* Vessel */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-[#DAE3F7]">
                        <div>{alert.robotId}</div>
                        <div className="text-[10px] text-[#94A3B8]">{alert.lakeId}</div>
                      </td>

                      {/* Measured Value */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                        {alert.measuredValue !== undefined ? (
                          <div>
                            <span className="text-[#EF4444] font-bold">{alert.measuredValue} {alert.unit}</span>
                            <span className="text-[#94A3B8] text-[10px] block">Thresh: {alert.thresholdValue} {alert.unit}</span>
                          </div>
                        ) : (
                          <span className="text-[#94A3B8]">—</span>
                        )}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-[#94A3B8]">
                        {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>

                      {/* Acknowledge Button */}
                      <td className="py-3 px-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        {alert.acknowledged ? (
                          <div className="flex items-center gap-1.5 text-[#22C55E] text-[11px] font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Acknowledged</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            disabled={!canAcknowledge}
                            className="px-2.5 py-1 rounded bg-[#14B8A6]/20 border border-[#14B8A6]/40 text-[#4FDBC8] hover:bg-[#14B8A6] hover:text-[#08111F] text-[11px] font-medium transition-colors disabled:opacity-40"
                          >
                            Acknowledge
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Flyout Drawer */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#111F30] border border-[#38BDF8]/40 rounded-xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#38BDF8]/20">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#38BDF8]">{selectedAlert.id}</span>
                <h3 className="text-sm font-bold text-[#F8FAFC]">{selectedAlert.title}</h3>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-[#94A3B8] hover:text-[#F8FAFC] text-sm"
              >
                &times;
              </button>
            </div>

            <div className="p-3 bg-[#08111F] rounded-lg border border-[#38BDF8]/15 space-y-2 text-xs">
              <div className="text-[11px] text-[#DAE3F7] leading-relaxed">
                {selectedAlert.description}
              </div>
              <div className="pt-2 border-t border-[#38BDF8]/10 grid grid-cols-2 gap-2 text-[10px] font-mono text-[#94A3B8]">
                <div>Vessel: <strong className="text-[#DAE3F7]">{selectedAlert.robotId}</strong></div>
                <div>Coordinates: <strong className="text-[#DAE3F7]">{selectedAlert.coords.lat.toFixed(5)}, {selectedAlert.coords.lng.toFixed(5)}</strong></div>
                <div>Timestamp: <strong className="text-[#DAE3F7]">{new Date(selectedAlert.timestamp).toLocaleString()}</strong></div>
                <div>Severity: <strong className="text-[#EF4444] uppercase">{selectedAlert.severity}</strong></div>
              </div>
            </div>

            {/* Mitigation Recommendation */}
            <div className="p-3 rounded-lg bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-xs text-[#DAE3F7] space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#4FDBC8] font-bold">
                Operational Mitigation Protocol
              </div>
              <p className="leading-relaxed">{selectedAlert.recommendation}</p>
            </div>

            {selectedAlert.acknowledged && (
              <div className="text-[10px] font-mono text-[#22C55E]">
                Signed off by: {selectedAlert.acknowledgedBy || 'Operator'} at {selectedAlert.acknowledgedAt ? new Date(selectedAlert.acknowledgedAt).toLocaleString() : ''}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#38BDF8]/15">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-3 py-1.5 rounded-md text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Close
              </button>
              {!selectedAlert.acknowledged && canAcknowledge && (
                <button
                  onClick={() => {
                    acknowledgeAlert(selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                  className="px-4 py-1.5 rounded-md text-xs font-bold bg-[#14B8A6] text-[#08111F] hover:bg-[#0D9488]"
                >
                  Acknowledge Incident
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
