/**
 * Aqua Nexus — Client State & Local Persistence Service
 */

import { Alert, AnomalyInsight, Lake, Mission, RobotDevice, SensorCalibrationRecord, ThresholdConfig, User, WaterQualityReading } from '../types/telemetry';
import { DEFAULT_THRESHOLDS, DEMO_LAKES, INITIAL_ALERTS, INITIAL_ANOMALIES, INITIAL_MISSION, INITIAL_ROBOTS } from './simulationEngine';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Dr. Sarah Lin, PhD',
    email: 'admin@aquanexus.org',
    role: 'admin',
    isActive: true,
    lastLogin: 'Just now'
  },
  {
    id: 'usr-2',
    name: 'Marcus Vance',
    email: 'operator@aquanexus.org',
    role: 'operator',
    isActive: true,
    lastLogin: '24 mins ago'
  },
  {
    id: 'usr-3',
    name: 'Dr. Elena Rostova',
    email: 'researcher@aquanexus.org',
    role: 'researcher',
    isActive: true,
    lastLogin: '2 hours ago'
  },
  {
    id: 'usr-4',
    name: 'Environmental Agency Viewer',
    email: 'guest@epa.state.gov',
    role: 'viewer',
    isActive: true,
    lastLogin: 'Yesterday'
  }
];

export const INITIAL_CALIBRATIONS: SensorCalibrationRecord[] = [
  {
    id: 'CAL-01',
    sensorId: 'SEN-PH-41',
    sensorType: 'pH Glass Electrode',
    robotId: 'AN-CAT01',
    calibrationDate: '2026-10-14',
    calibratedBy: 'Marcus Vance',
    calibrationStandards: 'NIST Buffers pH 4.01, 7.00, 10.01 @ 25°C',
    slope: 98.4,
    offset: -0.04,
    status: 'valid',
    nextCalibrationDate: '2026-11-14',
    notes: '2-point calibration slope 98.4%. Response time 4.2 seconds.'
  },
  {
    id: 'CAL-02',
    sensorId: 'SEN-DO-88',
    sensorType: 'Galvanic Dissolved Oxygen',
    robotId: 'AN-CAT01',
    calibrationDate: '2026-10-20',
    calibratedBy: 'Dr. Elena Rostova',
    calibrationStandards: '100% Air-Saturated Water & Zero-Oxygen Sodium Sulfite',
    slope: 99.1,
    offset: 0.02,
    status: 'valid',
    nextCalibrationDate: '2026-11-20',
    notes: 'Electrolyte replaced and Teflon membrane inspected under microscope.'
  },
  {
    id: 'CAL-03',
    sensorId: 'SEN-TRB-12',
    sensorType: 'Optical Turbidity',
    robotId: 'AN-CAT01',
    calibrationDate: '2026-10-05',
    calibratedBy: 'Marcus Vance',
    calibrationStandards: 'Formazin Primary Standard: 0.0 NTU and 100.0 NTU',
    slope: 97.2,
    offset: 0.15,
    status: 'valid',
    nextCalibrationDate: '2026-11-05',
    notes: 'Optical glass cleaned with isopropyl alcohol. Infrared LED beam intensity verified.'
  },
  {
    id: 'CAL-04',
    sensorId: 'SEN-TMP-99',
    sensorType: 'DS18B20 Digital Temp',
    robotId: 'AN-CAT01',
    calibrationDate: '2026-09-18',
    calibratedBy: 'Marcus Vance',
    calibrationStandards: 'Certified Fluke Reference Thermometer in Ice Bath (0.0°C) and 25.0°C bath',
    slope: 100.0,
    offset: -0.1,
    status: 'valid',
    nextCalibrationDate: '2026-12-18',
    notes: '1-Wire Dallas protocol verified. Factory ROM CRC-checked.'
  }
];

class StorageService {
  private get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(`aquanexus_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`aquanexus_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }

  getThresholds(): ThresholdConfig {
    return this.get<ThresholdConfig>('thresholds', DEFAULT_THRESHOLDS);
  }

  saveThresholds(thresholds: ThresholdConfig): void {
    this.set('thresholds', thresholds);
  }

  getLakes(): Lake[] {
    return this.get<Lake[]>('lakes', DEMO_LAKES);
  }

  getRobots(): RobotDevice[] {
    return this.get<RobotDevice[]>('robots', INITIAL_ROBOTS);
  }

  saveRobots(robots: RobotDevice[]): void {
    this.set('robots', robots);
  }

  getMissions(): Mission[] {
    return this.get<Mission[]>('missions', [INITIAL_MISSION]);
  }

  saveMissions(missions: Mission[]): void {
    this.set('missions', missions);
  }

  getAlerts(): Alert[] {
    return this.get<Alert[]>('alerts', INITIAL_ALERTS);
  }

  saveAlerts(alerts: Alert[]): void {
    this.set('alerts', alerts);
  }

  getAnomalies(): AnomalyInsight[] {
    return this.get<AnomalyInsight[]>('anomalies', INITIAL_ANOMALIES);
  }

  saveAnomalies(anomalies: AnomalyInsight[]): void {
    this.set('anomalies', anomalies);
  }

  getCalibrations(): SensorCalibrationRecord[] {
    return this.get<SensorCalibrationRecord[]>('calibrations', INITIAL_CALIBRATIONS);
  }

  saveCalibrations(calibrations: SensorCalibrationRecord[]): void {
    this.set('calibrations', calibrations);
  }

  getUsers(): User[] {
    return this.get<User[]>('users', INITIAL_USERS);
  }

  saveUsers(users: User[]): void {
    this.set('users', users);
  }
}

export const storageService = new StorageService();
