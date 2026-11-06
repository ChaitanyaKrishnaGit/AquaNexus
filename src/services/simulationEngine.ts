/**
 * Aqua Nexus — Real-Time Simulation Engine & Physics Simulator
 * 
 * Generates realistic autonomous catamaran robot movement, GPS telemetry,
 * 4-parameter water quality sensor readings, solar/battery dynamics, and alert triggering.
 * All readings are explicitly tagged with source: 'simulated_telemetry'.
 */

import { Coordinates, Lake, Mission, RobotDevice, WaterQualityReading, Waypoint, Alert, AnomalyInsight, ThresholdConfig } from '../types/telemetry';

export const DEMO_LAKES: Lake[] = [
  {
    id: 'lake-crystal',
    name: 'Crystal Lake Reservoir',
    location: 'Cascade Range Watershed, Sector 4',
    surfaceAreaHectares: 142.5,
    maxDepthMeters: 28.4,
    center: { lat: 37.7749, lng: -122.4194 },
    zoomLevel: 15,
    boundary: [
      { lat: 37.7800, lng: -122.4270 },
      { lat: 37.7820, lng: -122.4210 },
      { lat: 37.7810, lng: -122.4130 },
      { lat: 37.7760, lng: -122.4100 },
      { lat: 37.7700, lng: -122.4120 },
      { lat: 37.7680, lng: -122.4180 },
      { lat: 37.7700, lng: -122.4260 },
      { lat: 37.7750, lng: -122.4280 }
    ],
    samplingStations: [
      {
        id: 'st-alpha',
        name: 'Station Alpha — Inflow Inlet',
        coords: { lat: 37.7795, lng: -122.4230 },
        stationCode: 'WQ-ST01',
        description: 'Tributary inflow monitoring point for agricultural runoff and sediment.'
      },
      {
        id: 'st-bravo',
        name: 'Station Bravo — Deep Basin Central',
        coords: { lat: 37.7752, lng: -122.4190 },
        stationCode: 'WQ-ST02',
        description: 'Deepest reservoir sector (28m). Primary thermocline and dissolved oxygen baseline.'
      },
      {
        id: 'st-charlie',
        name: 'Station Charlie — Littoral Reed Zone',
        coords: { lat: 37.7708, lng: -122.4150 },
        stationCode: 'WQ-ST03',
        description: 'Shallow aquatic vegetation zone. Monitored for algal blooms and thermal shifts.'
      },
      {
        id: 'st-delta',
        name: 'Station Delta — Dam Outflow Spillway',
        coords: { lat: 37.7712, lng: -122.4245 },
        stationCode: 'WQ-ST04',
        description: 'Regulated discharge zone. Effluent compliance and downstream ecological safety.'
      }
    ]
  },
  {
    id: 'lake-mead',
    name: 'Lake Mead North Basin Demo',
    location: 'Colorado River Basin Sector B',
    surfaceAreaHectares: 480.0,
    maxDepthMeters: 62.0,
    center: { lat: 36.1400, lng: -114.7300 },
    zoomLevel: 14,
    boundary: [
      { lat: 36.148, lng: -114.745 },
      { lat: 36.152, lng: -114.720 },
      { lat: 36.136, lng: -114.715 },
      { lat: 36.128, lng: -114.735 }
    ],
    samplingStations: [
      {
        id: 'st-mead-1',
        name: 'Station M1 — Hoover Intake Reach',
        coords: { lat: 36.1420, lng: -114.7310 },
        stationCode: 'MD-01',
        description: 'Hydropower intake reservoir perimeter.'
      }
    ]
  }
];

export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  ph: { min: 6.5, max: 8.5, warningMargin: 0.3 },
  dissolvedOxygen: { minCritical: 4.0, minWarning: 5.5 },
  turbidity: { maxWarning: 10.0, maxCritical: 25.0 },
  temperature: { min: 14.0, max: 26.0 },
  battery: { lowWarning: 25, critical: 15 }
};

export const INITIAL_WAYPOINTS: Waypoint[] = [
  { id: 'wp-dock', order: 1, label: 'Docking Berth (Home)', lat: 37.7725, lng: -122.4260, dwellTimeSeconds: 5, completed: true },
  { id: 'wp-1', order: 2, label: 'Station Alpha Inflow', lat: 37.7795, lng: -122.4230, targetDepthMeters: 0.5, dwellTimeSeconds: 10, completed: false },
  { id: 'wp-2', order: 3, label: 'Northeast Transect', lat: 37.7785, lng: -122.4140, targetDepthMeters: 1.0, dwellTimeSeconds: 8, completed: false },
  { id: 'wp-3', order: 4, label: 'Station Bravo Deep Basin', lat: 37.7752, lng: -122.4190, targetDepthMeters: 1.5, dwellTimeSeconds: 15, completed: false },
  { id: 'wp-4', order: 5, label: 'Station Charlie Littoral', lat: 37.7708, lng: -122.4150, targetDepthMeters: 0.5, dwellTimeSeconds: 10, completed: false },
  { id: 'wp-5', order: 6, label: 'Station Delta Spillway', lat: 37.7712, lng: -122.4245, targetDepthMeters: 0.8, dwellTimeSeconds: 10, completed: false }
];

export const INITIAL_ROBOTS: RobotDevice[] = [
  {
    id: 'AN-CAT01',
    name: 'Naiad-1 Catamaran',
    model: 'AquaNexus Mark II Catamaran',
    lakeId: 'lake-crystal',
    status: 'navigating',
    mode: 'autonomous',
    batteryPercentage: 86,
    batteryVoltage: 12.24,
    solarChargingWatts: 14.2,
    currentCoords: { lat: 37.7745, lng: -122.4220 },
    headingDegrees: 48,
    speedKnots: 1.6,
    gpsFix: {
      status: 'locked_3d',
      satellitesTracked: 11,
      hdop: 0.78
    },
    propulsionStatus: {
      portMotorRpm: 1120,
      starboardMotorRpm: 1135,
      motorTempC: 34.2
    },
    sensorHealth: {
      phProbe: 'nominal',
      doSensor: 'nominal',
      turbiditySensor: 'nominal',
      tempSensor: 'nominal'
    },
    currentMissionId: 'MSN-2026-042',
    lastCommunication: new Date().toISOString(),
    firmwareVersion: 'v2.4.1-esp32',
    hardwareBridgeReady: true
  },
  {
    id: 'AN-CAT02',
    name: 'Triton-2 Scout',
    model: 'AquaNexus Mark I Hydro-Surveyor',
    lakeId: 'lake-crystal',
    status: 'idle',
    mode: 'autonomous',
    batteryPercentage: 98,
    batteryVoltage: 12.58,
    solarChargingWatts: 0.0,
    currentCoords: { lat: 37.7720, lng: -122.4265 },
    headingDegrees: 180,
    speedKnots: 0.0,
    gpsFix: {
      status: 'locked_3d',
      satellitesTracked: 10,
      hdop: 0.82
    },
    propulsionStatus: {
      portMotorRpm: 0,
      starboardMotorRpm: 0,
      motorTempC: 22.1
    },
    sensorHealth: {
      phProbe: 'nominal',
      doSensor: 'nominal',
      turbiditySensor: 'nominal',
      tempSensor: 'nominal'
    },
    lastCommunication: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    firmwareVersion: 'v2.3.8-esp32',
    hardwareBridgeReady: true
  }
];

export const INITIAL_MISSION: Mission = {
  id: 'MSN-2026-042',
  robotId: 'AN-CAT01',
  lakeId: 'lake-crystal',
  name: 'Reservoir Limnological Baseline Survey #42',
  status: 'in_progress',
  startTime: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
  waypoints: INITIAL_WAYPOINTS,
  currentWaypointIndex: 2,
  totalSamplesCollected: 38,
  distanceTraveledMeters: 1420,
  alertsTriggered: 1,
  routeCoordinates: [
    { lat: 37.7725, lng: -122.4260 },
    { lat: 37.7750, lng: -122.4250 },
    { lat: 37.7770, lng: -122.4240 },
    { lat: 37.7795, lng: -122.4230 },
    { lat: 37.7788, lng: -122.4180 },
    { lat: 37.7785, lng: -122.4140 }
  ]
};

/**
 * Calculates NSF-inspired Water Quality Index (0 - 100)
 */
export function calculateWQI(ph: number, doMgL: number, turbidityNtu: number, tempC: number): number {
  // pH sub-index (ideal: 7.2 - 7.8 -> 100, drops off toward 0 or 14)
  const phDev = Math.abs(ph - 7.5);
  const qPh = Math.max(0, 100 - phDev * 35);

  // DO sub-index (>8 mg/L is 100%, <3 is severely depleted)
  let qDo = 0;
  if (doMgL >= 8.0) qDo = 100;
  else if (doMgL >= 6.0) qDo = 80 + (doMgL - 6.0) * 10;
  else if (doMgL >= 4.0) qDo = 50 + (doMgL - 4.0) * 15;
  else qDo = Math.max(10, doMgL * 12);

  // Turbidity sub-index (<2 NTU is 100, >30 is poor)
  const qTurb = Math.max(0, 100 - turbidityNtu * 2.8);

  // Temp sub-index (ideal 18-22C for temperate reservoir)
  const tempDev = Math.abs(tempC - 20.0);
  const qTemp = Math.max(40, 100 - tempDev * 5);

  // Weighted sum
  const wqi = (qDo * 0.35) + (qPh * 0.25) + (qTurb * 0.20) + (qTemp * 0.20);
  return Math.round(Math.min(100, Math.max(0, wqi)));
}

/**
 * Generates initial 24 hours of simulated historical readings
 */
export function generateInitialHistory(robotId: string, lakeId: string, count: number = 48): WaterQualityReading[] {
  const readings: WaterQualityReading[] = [];
  const now = Date.now();
  const stepMs = 30 * 60 * 1000; // 30 min intervals

  for (let i = count; i >= 0; i--) {
    const time = new Date(now - i * stepMs);
    const hour = time.getHours();

    // Diurnal temperature cycle: peak at 15:00, trough at 06:00
    const diurnalTemp = Math.sin((hour - 9) * (Math.PI / 12)) * 1.8;
    const temperature = Number((20.2 + diurnalTemp + (Math.random() * 0.4 - 0.2)).toFixed(2));

    // DO diurnal wave (photosynthesis generates DO during daylight)
    const diurnalDO = Math.sin((hour - 8) * (Math.PI / 12)) * 1.1;
    const dissolvedOxygen = Number((7.8 + diurnalDO + (Math.random() * 0.3 - 0.15)).toFixed(2));

    // pH follows mild diurnal drift
    const ph = Number((7.45 + (diurnalDO * 0.15) + (Math.random() * 0.08 - 0.04)).toFixed(2));

    // Turbidity baseline with occasional wind ripple
    const turbidity = Number((3.2 + (Math.random() * 1.2 - 0.6)).toFixed(2));

    const wqi = calculateWQI(ph, dissolvedOxygen, turbidity, temperature);

    readings.push({
      id: `READ-INIT-${count - i}`,
      robotId,
      lakeId,
      timestamp: time.toISOString(),
      coords: {
        lat: 37.7745 + (Math.random() * 0.004 - 0.002),
        lng: -122.4200 + (Math.random() * 0.006 - 0.003)
      },
      depthMeters: 0.6,
      ph,
      dissolvedOxygen,
      turbidity,
      temperature,
      wqi,
      source: 'simulated_telemetry',
      batteryPercentage: Math.max(30, Math.min(100, Math.round(95 - (count - i) * 0.4 + (hour > 10 && hour < 17 ? 4 : 0))))
    });
  }

  return readings;
}

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'ALT-108',
    robotId: 'AN-CAT01',
    lakeId: 'lake-crystal',
    category: 'high_turbidity',
    severity: 'warning',
    title: 'Elevated Turbidity Runoff Event',
    description: 'Turbidity sensor registered 16.4 NTU at Station Alpha Inflow, exceeding warning threshold (10.0 NTU).',
    parameter: 'turbidity',
    measuredValue: 16.4,
    thresholdValue: 10.0,
    unit: 'NTU',
    coords: { lat: 37.7795, lng: -122.4230 },
    timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    acknowledged: false,
    recommendation: 'Check tributary inlet flow for upstream construction or rainfall sediment runoff. Plan follow-up sampling in 30 minutes.'
  },
  {
    id: 'ALT-107',
    robotId: 'AN-CAT01',
    lakeId: 'lake-crystal',
    category: 'low_dissolved_oxygen',
    severity: 'advisory',
    title: 'Dissolved Oxygen Diurnal Dip',
    description: 'Dissolved oxygen reached 5.4 mg/L during dawn benthic respiration in shallow littoral vegetation zone.',
    parameter: 'dissolvedOxygen',
    measuredValue: 5.4,
    thresholdValue: 5.5,
    unit: 'mg/L',
    coords: { lat: 37.7708, lng: -122.4150 },
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    acknowledged: true,
    acknowledgedBy: 'Dr. Elena Rostova (Limnologist)',
    acknowledgedAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    recommendation: 'Normal dawn botanical respiration. Monitor DO resurgence under direct sunlight.'
  }
];

export const INITIAL_ANOMALIES: AnomalyInsight[] = [
  {
    id: 'ANOM-401',
    parameter: 'Turbidity',
    measuredValue: '16.4 NTU',
    baselineRange: '2.5 – 4.5 NTU',
    location: 'Station Alpha (Inflow Mouth)',
    coords: { lat: 37.7795, lng: -122.4230 },
    timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    reason: 'Sudden 3.8x rate-of-change jump detected within 4 minutes. Spatial cluster confirms localized plume at northern tributary inlet.',
    severity: 'warning',
    confidenceScore: 94,
    recommendedVerification: '1. Take photographic confirmation of northern inlet plume; 2. Cross-reference municipal stream gauge; 3. Inspect catamaran optical window for suspended plant debris.',
    algorithm: 'Spatial Cluster Outlier'
  },
  {
    id: 'ANOM-402',
    parameter: 'Dissolved Oxygen',
    measuredValue: '5.4 mg/L',
    baselineRange: '7.2 – 8.8 mg/L',
    location: 'Station Charlie (Littoral Zone)',
    coords: { lat: 37.7708, lng: -122.4150 },
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    reason: 'Transient hypoxic stratification detected in shallow weed bed. Rebounded naturally with solar morning irradiance.',
    severity: 'advisory',
    confidenceScore: 88,
    recommendedVerification: 'Verify diurnal algae photosynthesis cycle. Check for excessive weed senescence or decaying biomass.',
    algorithm: 'Sudden-Rate RateOfChange'
  }
];
