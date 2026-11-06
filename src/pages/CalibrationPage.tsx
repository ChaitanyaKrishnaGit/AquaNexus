/**
 * Aqua Nexus — Sensor Calibration Certificates & Laboratory Records
 * Strict metrological audit log for pH, DO, Turbidity, and Temperature probes
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SensorCalibrationRecord } from '../types/telemetry';
import { 
  SlidersHorizontal, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ShieldCheck,
  FileCheck,
  Clock
} from 'lucide-react';

export const CalibrationPage: React.FC = () => {
  const { calibrations, addCalibrationRecord, selectedRobot, currentUser } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const [sensorType, setSensorType] = useState<SensorCalibrationRecord['sensorType']>('pH Glass Electrode');
  const [standards, setStandards] = useState('NIST Buffers pH 4.01, 7.00, 10.01');
  const [notes, setNotes] = useState('2-point verification slope 98.8%. Offset 0.02.');

  const canCalibrate = currentUser.role === 'admin' || currentUser.role === 'operator' || currentUser.role === 'researcher';

  const handleRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().slice(0, 10);
    const nextDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    addCalibrationRecord({
      sensorId: `SEN-${sensorType.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-3)}`,
      sensorType,
      robotId: selectedRobot.id,
      calibrationDate: today,
      calibratedBy: currentUser.name,
      calibrationStandards: standards,
      status: 'valid',
      nextCalibrationDate: nextDate,
      notes
    });

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0D1929]/90 border border-[#38BDF8]/15 rounded-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#14B8A6]" />
            <h1 className="text-base font-bold text-[#F8FAFC]">
              Sensor Calibration Log & Metrological Certificates
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Audit-grade traceable calibration records for physical and simulated probe arrays
          </p>
        </div>

        {canCalibrate && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14B8A6] text-[#08111F] hover:bg-[#0D9488] font-bold text-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Calibration</span>
          </button>
        )}
      </div>

      {/* Metrology Integrity Notice */}
      <div className="p-3.5 rounded-xl bg-[#08111F] border border-[#38BDF8]/20 text-xs text-[#DAE3F7] flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-[#4FDBC8] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Metrological Quality Standard:</strong> Sensors are never flagged as calibrated without an explicit certificate record signed by an operator or researcher. Regular 30-day recalibration prevents optical window biofouling and galvanic membrane electrolyte depletion.
        </p>
      </div>

      {/* Calibration Records Table */}
      <div className="rounded-xl border border-[#38BDF8]/15 bg-[#0D1929]/95 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#08111F] border-b border-[#38BDF8]/15 text-[10px] uppercase tracking-wider text-[#94A3B8]">
              <tr>
                <th className="py-3 px-4">Certificate ID</th>
                <th className="py-3 px-4">Probe Type & Target Vessel</th>
                <th className="py-3 px-4">Calibration Standards Used</th>
                <th className="py-3 px-4">Calibrated By</th>
                <th className="py-3 px-4">Validity Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#38BDF8]/10">
              {calibrations.map(c => (
                <tr key={c.id} className="hover:bg-[#111F30]/70 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-bold text-[#4FDBC8]">{c.id}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-sans font-semibold text-[#F8FAFC]">{c.sensorType}</div>
                    <div className="text-[10px] text-[#94A3B8]">{c.sensorId} on {c.robotId}</div>
                  </td>
                  <td className="py-3 px-4 text-[11px] text-[#DAE3F7]">
                    <div>{c.calibrationStandards}</div>
                    <div className="text-[10px] text-[#94A3B8] font-sans italic mt-0.5">{c.notes}</div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-[11px] text-[#DAE3F7]">
                    {c.calibratedBy}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-[11px] text-[#94A3B8]">
                    <div>{c.calibrationDate}</div>
                    <div className="text-[10px] text-[#4FDBC8]">Next: {c.nextCalibrationDate}</div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="flex items-center gap-1 text-[#22C55E] font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      CERTIFIED VALID
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record New Calibration Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleRecord} className="w-full max-w-md bg-[#111F30] border border-[#14B8A6]/40 rounded-xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-[#F8FAFC]">Record Laboratory Probe Calibration</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-mono text-[#94A3B8] block mb-1">Sensor Probe Type:</label>
                <select
                  value={sensorType}
                  onChange={e => setSensorType(e.target.value as any)}
                  className="w-full bg-[#08111F] border border-[#38BDF8]/30 px-3 py-2 rounded text-[#F8FAFC] outline-none"
                >
                  <option value="pH Glass Electrode">pH Glass Electrode</option>
                  <option value="Galvanic Dissolved Oxygen">Galvanic Dissolved Oxygen</option>
                  <option value="Optical Turbidity">Optical Turbidity</option>
                  <option value="DS18B20 Digital Temp">DS18B20 Digital Temp</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#94A3B8] block mb-1">Reference Standard Protocol:</label>
                <input
                  type="text"
                  value={standards}
                  onChange={e => setStandards(e.target.value)}
                  className="w-full bg-[#08111F] border border-[#38BDF8]/30 px-3 py-2 rounded text-[#F8FAFC] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#94A3B8] block mb-1">Calibration Notes / Slope:</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full h-20 bg-[#08111F] border border-[#38BDF8]/30 px-3 py-2 rounded text-[#F8FAFC] outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#38BDF8]/15">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3 py-1.5 rounded text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-[#14B8A6] text-[#08111F] font-bold text-xs hover:bg-[#0D9488]"
              >
                Sign Certificate
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
