/**
 * Aqua Nexus — Core Data Types and Schemas
 * Smart Lake Intelligence & Autonomous Floating Robot Environmental Monitoring Platform
 */

export type UserRole = 'admin' | 'operator' | 'researcher' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string;
  lastLogin: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Waypoint extends Coordinates {
  id: string;
  order: number;
  label: string;
  targetDepthMeters?: number;
  dwellTimeSeconds?: number;
  completed?: boolean;
}

export type RobotOperationalState = 
  | 'idle' 
  | 'navigating' 
  | 'sampling' 
  | 'paused' 
  | 'returning_to_dock' 
  | 'emergency_stopped'
  | 'offline';

export type OperatingMode = 'autonomous' | 'manual_override' | 'simulation_assisted';

export interface Lake {
  id: string;
  name: string;
  location: string;
  surfaceAreaHectares: number;
  maxDepthMeters: number;
  center: Coordinates;
  zoomLevel: number;
  boundary: Coordinates[];
  samplingStations: {
    id: string;
    name: string;
    coords: Coordinates;
    stationCode: string;
    description: string;
  }[];
}

export interface WaterQualityReading {
  id: string;
  robotId: string;
  lakeId: string;
  timestamp: string; // ISO string
  coords: Coordinates;
  depthMeters: number;
  ph: number; // 0-14 pH
  dissolvedOxygen: number; // mg/L
  turbidity: number; // NTU
  temperature: number; // Celsius
  wqi: number; // Calculated Water Quality Index (0-100)
  source: 'simulated_telemetry' | 'hardware_esp32_mqtt' | 'laboratory_manual';
  batteryPercentage: number;
}

export interface ThresholdConfig {
  ph: { min: number; max: number; warningMargin: number };
  dissolvedOxygen: { minCritical: number; minWarning: number };
  turbidity: { maxWarning: number; maxCritical: number };
  temperature: { min: number; max: number };
  battery: { lowWarning: number; critical: number };
}

export type AlertSeverity = 'advisory' | 'warning' | 'critical';
export type AlertCategory = 
  | 'low_dissolved_oxygen' 
  | 'unusual_ph' 
  | 'high_turbidity' 
  | 'temperature_anomaly' 
  | 'low_battery' 
  | 'robot_offline' 
  | 'gps_signal_lost' 
  | 'sensor_malfunction';

export interface Alert {
  id: string;
  robotId: string;
  lakeId: string;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  description: string;
  parameter?: 'ph' | 'dissolvedOxygen' | 'turbidity' | 'temperature' | 'battery';
  measuredValue?: number;
  thresholdValue?: number;
  unit?: string;
  coords: Coordinates;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  recommendation: string;
}

export interface AnomalyInsight {
  id: string;
  parameter: 'Dissolved Oxygen' | 'pH' | 'Turbidity' | 'Water Temperature';
  measuredValue: string;
  baselineRange: string;
  location: string;
  coords: Coordinates;
  timestamp: string;
  reason: string;
  severity: AlertSeverity;
  confidenceScore: number; // 0-100%
  recommendedVerification: string;
  algorithm: 'Rule-Based Threshold' | 'Sudden-Rate RateOfChange' | 'Spatial Cluster Outlier' | 'Isolation Forest Model';
}

export interface RobotDevice {
  id: string;
  name: string;
  model: string;
  lakeId: string;
  status: RobotOperationalState;
  mode: OperatingMode;
  batteryPercentage: number;
  batteryVoltage: number; // e.g. 11.1 - 12.6V for 3S LiPo
  solarChargingWatts: number;
  currentCoords: Coordinates;
  headingDegrees: number; // 0-359 deg
  speedKnots: number;
  gpsFix: {
    status: 'locked_3d' | 'locked_2d' | 'searching' | 'lost';
    satellitesTracked: number;
    hdop: number;
  };
  propulsionStatus: {
    portMotorRpm: number;
    starboardMotorRpm: number;
    motorTempC: number;
  };
  sensorHealth: {
    phProbe: 'nominal' | 'calibrating' | 'drift_detected' | 'fault';
    doSensor: 'nominal' | 'calibrating' | 'membrane_check' | 'fault';
    turbiditySensor: 'nominal' | 'calibrating' | 'optical_cleaning_req' | 'fault';
    tempSensor: 'nominal' | 'fault';
  };
  currentMissionId?: string;
  lastCommunication: string;
  firmwareVersion: string;
  hardwareBridgeReady: boolean;
}

export interface Mission {
  id: string;
  robotId: string;
  lakeId: string;
  name: string;
  status: 'planned' | 'in_progress' | 'completed' | 'aborted' | 'paused';
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  waypoints: Waypoint[];
  currentWaypointIndex: number;
  totalSamplesCollected: number;
  distanceTraveledMeters: number;
  alertsTriggered: number;
  routeCoordinates: Coordinates[];
}

export interface SensorCalibrationRecord {
  id: string;
  sensorId: string;
  sensorType: 'pH Glass Electrode' | 'Galvanic Dissolved Oxygen' | 'Optical Turbidity' | 'DS18B20 Digital Temp';
  robotId: string;
  calibrationDate: string;
  calibratedBy: string;
  calibrationStandards: string;
  slope?: number;
  offset?: number;
  status: 'valid' | 'expiring_soon' | 'expired' | 'uncalibrated';
  nextCalibrationDate: string;
  notes: string;
}
