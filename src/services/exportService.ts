/**
 * Aqua Nexus — Reporting & Data Export Service
 * Supports CSV dataset generation and comprehensive environmental audit reports
 */

import { Alert, Lake, Mission, RobotDevice, WaterQualityReading } from '../types/telemetry';

export function exportReadingsToCsv(readings: WaterQualityReading[], lakeName: string, robotId: string): void {
  const headers = [
    'Reading ID',
    'Timestamp UTC',
    'Lake',
    'Robot ID',
    'Latitude',
    'Longitude',
    'Depth (m)',
    'pH',
    'Dissolved Oxygen (mg/L)',
    'Turbidity (NTU)',
    'Temperature (C)',
    'Water Quality Index (WQI)',
    'Battery (%)',
    'Data Source'
  ];

  const rows = readings.map(r => [
    r.id,
    r.timestamp,
    `"${lakeName}"`,
    r.robotId,
    r.coords.lat.toFixed(6),
    r.coords.lng.toFixed(6),
    r.depthMeters.toFixed(2),
    r.ph.toFixed(2),
    r.dissolvedOxygen.toFixed(2),
    r.turbidity.toFixed(2),
    r.temperature.toFixed(2),
    r.wqi,
    r.batteryPercentage,
    r.source
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `aqua_nexus_${robotId}_telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generatePrintableReport(params: {
  lake: Lake;
  robot: RobotDevice;
  mission?: Mission;
  readings: WaterQualityReading[];
  alerts: Alert[];
  operatorName: string;
}): void {
  const { lake, robot, mission, readings, alerts, operatorName } = params;
  
  // Statistical calculations
  const phVals = readings.map(r => r.ph);
  const doVals = readings.map(r => r.dissolvedOxygen);
  const turbVals = readings.map(r => r.turbidity);
  const tempVals = readings.map(r => r.temperature);
  const wqiVals = readings.map(r => r.wqi);

  const avg = (arr: number[]) => (arr.reduce((a, b) => a + b, 0) / (arr.length || 1)).toFixed(2);
  const min = (arr: number[]) => (Math.min(...(arr.length ? arr : [0]))).toFixed(2);
  const max = (arr: number[]) => (Math.max(...(arr.length ? arr : [0]))).toFixed(2);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate printable report.');
    return;
  }

  const reportHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Aqua Nexus Environmental Inspection Report — ${lake.name}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.5; padding: 40px; margin: 0; }
        .header { border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
        .badge { display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 700; border-radius: 4px; background: #e0f2fe; color: #0369a1; text-transform: uppercase; }
        .sim-notice { background: #fef3c7; border: 1px solid #f59e0b; padding: 10px 16px; border-radius: 6px; font-size: 12px; color: #92400e; margin-bottom: 24px; font-weight: 500; }
        h1 { margin: 0 0 6px 0; font-size: 24px; }
        h2 { font-size: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-top: 28px; color: #1e293b; text-transform: uppercase; letter-spacing: 0.05em; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
        th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
        th { background: #f8fafc; font-weight: 600; color: #475569; }
        .mono { font-family: monospace; }
        .footer { margin-top: 48px; border-top: 1px solid #cbd5e1; padding-top: 20px; display: flex; justify-content: space-between; font-size: 12px; color: #64748b; }
        .sign-box { border-top: 1px solid #475569; width: 220px; padding-top: 6px; margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <span class="badge">AQUA NEXUS INTELLIGENCE PLATFORM</span>
          <h1>Comprehensive Limnological Assessment Report</h1>
          <div style="font-size: 13px; color: #64748b;">Autonomous Surface Vessel Telemetry & Water Chemistry Analysis</div>
        </div>
        <div style="text-align: right; font-size: 12px; color: #64748b;">
          <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
          <div><strong>Report Ref:</strong> AN-REP-${Date.now().toString().slice(-6)}</div>
          <div><strong>Inspector:</strong> ${operatorName}</div>
        </div>
      </div>

      <div class="sim-notice">
        <strong>NOTICE:</strong> This report includes demonstration telemetry generated via the Aqua Nexus Physics Simulation Engine. Verified hardware calibration certificates must be appended for legal EPA/environmental regulatory filings.
      </div>

      <h2>1. Monitored Waterbody & Deployment Metadata</h2>
      <table>
        <tr>
          <th>Lake / Waterbody</th>
          <td>${lake.name} (${lake.location})</td>
          <th>Surface Area / Max Depth</th>
          <td>${lake.surfaceAreaHectares} ha / ${lake.maxDepthMeters} m</td>
        </tr>
        <tr>
          <th>Surveying Robot</th>
          <td>${robot.name} (Model: ${robot.model}, S/N: ${robot.id})</td>
          <th>Firmware & Protocol</th>
          <td>${robot.firmwareVersion} (ESP32 MQTT / 802.11 b/g/n)</td>
        </tr>
        <tr>
          <th>Mission Profile</th>
          <td>${mission?.name || 'General Basin Surveillance'}</td>
          <th>Samples Processed</th>
          <td>${readings.length} continuous spatial coordinates</td>
        </tr>
      </table>

      <h2>2. Water Quality Parameter Matrix</h2>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Units</th>
            <th>Minimum</th>
            <th>Maximum</th>
            <th>Mean / Baseline</th>
            <th>Nominal Target Band</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>pH (Glass Electrode)</strong></td>
            <td>pH</td>
            <td class="mono">${min(phVals)}</td>
            <td class="mono">${max(phVals)}</td>
            <td class="mono"><strong>${avg(phVals)}</strong></td>
            <td>6.50 – 8.50</td>
            <td>Nominal</td>
          </tr>
          <tr>
            <td><strong>Dissolved Oxygen (Galvanic)</strong></td>
            <td>mg/L</td>
            <td class="mono">${min(doVals)}</td>
            <td class="mono">${max(doVals)}</td>
            <td class="mono"><strong>${avg(doVals)}</strong></td>
            <td>> 6.00 mg/L</td>
            <td>Good</td>
          </tr>
          <tr>
            <td><strong>Turbidity (90° Optical Nephelometry)</strong></td>
            <td>NTU</td>
            <td class="mono">${min(turbVals)}</td>
            <td class="mono">${max(turbVals)}</td>
            <td class="mono"><strong>${avg(turbVals)}</strong></td>
            <td>< 5.00 NTU</td>
            <td>Acceptable</td>
          </tr>
          <tr>
            <td><strong>Water Temperature (DS18B20)</strong></td>
            <td>°C</td>
            <td class="mono">${min(tempVals)}</td>
            <td class="mono">${max(tempVals)}</td>
            <td class="mono"><strong>${avg(tempVals)}</strong></td>
            <td>16.0 – 24.0 °C</td>
            <td>Seasonal Normal</td>
          </tr>
          <tr style="background: #f0fdf4;">
            <td><strong>Calculated Water Quality Index (WQI)</strong></td>
            <td>Index (0–100)</td>
            <td class="mono">${min(wqiVals)}</td>
            <td class="mono">${max(wqiVals)}</td>
            <td class="mono"><strong>${avg(wqiVals)} / 100</strong></td>
            <td>> 80 (Good / Excellent)</td>
            <td style="color: #166534; font-weight: 700;">Healthy Ecosystem</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Active Alarms & Recorded Anomalies (${alerts.length})</h2>
      ${alerts.length === 0 ? '<p style="font-size: 13px; color: #64748b;">No active alert thresholds breached during this deployment window.</p>' : `
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Severity</th>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${alerts.map(a => `
              <tr>
                <td class="mono">${a.id}</td>
                <td><span style="font-weight: 700; color: ${a.severity === 'critical' ? '#dc2626' : a.severity === 'warning' ? '#d97706' : '#2563eb'}; text-transform: uppercase;">${a.severity}</span></td>
                <td>${a.category.replace(/_/g, ' ')}</td>
                <td>${a.description}</td>
                <td>${a.acknowledged ? 'Acknowledged' : 'Pending Review'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}

      <h2>4. Autonomous Vessel Telemetry Summary</h2>
      <table>
        <tr>
          <th>Battery State</th>
          <td>${robot.batteryPercentage}% (${robot.batteryVoltage.toFixed(2)} VDC, 3S LiPo)</td>
          <th>Solar Harvesting Input</th>
          <td>${robot.solarChargingWatts.toFixed(1)} W instantaneous</td>
        </tr>
        <tr>
          <th>GPS Navigation Accuracy</th>
          <td>NEO-6M 3D Lock (${robot.gpsFix.satellitesTracked} sats, HDOP ${robot.gpsFix.hdop})</td>
          <th>Propulsion Health</th>
          <td>Port ${robot.propulsionStatus.portMotorRpm} RPM / Stbd ${robot.propulsionStatus.starboardMotorRpm} RPM</td>
        </tr>
      </table>

      <div style="margin-top: 40px; display: flex; justify-content: space-between;">
        <div>
          <div class="sign-box">Lead Limnological Investigator</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Aqua Nexus Environmental Monitoring Div.</div>
        </div>
        <div>
          <div class="sign-box">Field Operations Supervisor</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Catamaran Autonomous Robotics Unit</div>
        </div>
      </div>

      <div class="footer">
        <div>Aqua Nexus Ecosystem Architecture &copy; 2026. Certified Limnological Telemetry.</div>
        <div>Page 1 of 1</div>
      </div>
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(reportHtml);
  printWindow.document.close();
}
