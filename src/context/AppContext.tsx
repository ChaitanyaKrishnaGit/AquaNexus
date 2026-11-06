/**
 * Aqua Nexus — Global Application Context & Real-Time Telemetry Bus
 */

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import {
  Alert,
  AnomalyInsight,
  Lake,
  Mission,
  RobotDevice,
  SensorCalibrationRecord,
  ThresholdConfig,
  User,
  UserRole,
  WaterQualityReading,
  Coordinates,
  Waypoint
} from '../types/telemetry';
import {
  calculateWQI,
  DEFAULT_THRESHOLDS,
  DEMO_LAKES,
  generateInitialHistory,
  INITIAL_ALERTS,
  INITIAL_ANOMALIES,
  INITIAL_MISSION,
  INITIAL_ROBOTS,
  INITIAL_WAYPOINTS
} from '../services/simulationEngine';
import { INITIAL_CALIBRATIONS, INITIAL_USERS, storageService } from '../services/storageService';

export type NavView = 
  | 'dashboard' 
  | 'map' 
  | 'water-quality' 
  | 'operations' 
  | 'insights' 
  | 'alerts' 
  | 'analytics' 
  | 'missions' 
  | 'devices' 
  | 'calibrations' 
  | 'users' 
  | 'settings' 
  | 'esp32-bridge';

interface AppContextType {
  // Navigation & User
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  users: User[];
  updateUserRole: (userId: string, role: UserRole) => void;
  toggleUserActive: (userId: string) => void;
  createUser: (name: string, email: string, role: UserRole) => void;

  // Monitored Lakes & Fleet
  lakes: Lake[];
  selectedLake: Lake;
  setSelectedLakeId: (id: string) => void;
  robots: RobotDevice[];
  selectedRobot: RobotDevice;
  setSelectedRobotId: (id: string) => void;
  updateRobot: (robot: RobotDevice) => void;
  registerRobot: (robot: Partial<RobotDevice>) => void;

  // Missions & Telemetry
  currentMission: Mission | undefined;
  missions: Mission[];
  readings: WaterQualityReading[];
  latestReading: WaterQualityReading;
  lastUpdateTime: Date;
  isOnline: boolean;

  // Thresholds & Alerts
  thresholds: ThresholdConfig;
  updateThresholds: (thresholds: ThresholdConfig) => void;
  alerts: Alert[];
  acknowledgeAlert: (alertId: string) => void;
  clearAllAlerts: () => void;

  // Anomaly Insights & Injection
  anomalies: AnomalyInsight[];
  injectAnomaly: (type: 'hypoxia' | 'turbidity_spike' | 'alkaline_drift' | 'thermal_surge' | 'low_battery' | 'sensor_fault') => void;

  // Calibrations
  calibrations: SensorCalibrationRecord[];
  addCalibrationRecord: (record: Omit<SensorCalibrationRecord, 'id'>) => void;

  // Simulation Controls
  simulationRunning: boolean;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  simulationIntervalMs: number;
  setSimulationIntervalMs: (ms: number) => void;

  // Mission Operational Controls
  startMission: () => void;
  pauseMission: () => void;
  resumeMission: () => void;
  stopMission: () => void;
  returnToDock: () => void;
  emergencyStop: () => void;
  updateWaypoints: (waypoints: Waypoint[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [users, setUsers] = useState<User[]>(() => storageService.getUsers());
  const [currentUser, setCurrentUser] = useState<User>(() => users[0] || INITIAL_USERS[0]);
  
  const [lakes] = useState<Lake[]>(() => storageService.getLakes());
  const [selectedLakeId, setSelectedLakeId] = useState<string>(lakes[0]?.id || 'lake-crystal');
  const selectedLake = lakes.find(l => l.id === selectedLakeId) || lakes[0];

  const [robots, setRobots] = useState<RobotDevice[]>(() => storageService.getRobots());
  const [selectedRobotId, setSelectedRobotId] = useState<string>(robots[0]?.id || 'AN-CAT01');
  const selectedRobot = robots.find(r => r.id === selectedRobotId) || robots[0];

  const [missions, setMissions] = useState<Mission[]>(() => storageService.getMissions());
  const currentMission = missions.find(m => m.id === selectedRobot.currentMissionId) || missions[0];

  const [readings, setReadings] = useState<WaterQualityReading[]>(() => 
    generateInitialHistory(selectedRobotId, selectedLakeId, 48)
  );
  const [latestReading, setLatestReading] = useState<WaterQualityReading>(() => readings[readings.length - 1]);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [isOnline] = useState<boolean>(true);

  const [thresholds, setThresholds] = useState<ThresholdConfig>(() => storageService.getThresholds());
  const [alerts, setAlerts] = useState<Alert[]>(() => storageService.getAlerts());
  const [anomalies, setAnomalies] = useState<AnomalyInsight[]>(() => storageService.getAnomalies());
  const [calibrations, setCalibrations] = useState<SensorCalibrationRecord[]>(() => storageService.getCalibrations());

  // Simulation parameters
  const [simulationRunning, setSimulationRunning] = useState<boolean>(true);
  const [simulationIntervalMs, setSimulationIntervalMs] = useState<number>(3000);

  // Active anomaly override state
  const activeAnomalyRef = useRef<{
    type: string;
    expiresAt: number;
  } | null>(null);

  // Switch role helper
  const switchRole = useCallback((role: UserRole) => {
    const match = users.find(u => u.role === role);
    if (match) {
      setCurrentUser(match);
    } else {
      setCurrentUser(prev => ({ ...prev, role }));
    }
  }, [users]);

  const updateUserRole = useCallback((userId: string, role: UserRole) => {
    setUsers(prev => {
      const updated = prev.map(u => u.id === userId ? { ...u, role } : u);
      storageService.saveUsers(updated);
      return updated;
    });
  }, []);

  const toggleUserActive = useCallback((userId: string) => {
    setUsers(prev => {
      const updated = prev.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u);
      storageService.saveUsers(updated);
      return updated;
    });
  }, []);

  const createUser = useCallback((name: string, email: string, role: UserRole) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      isActive: true,
      lastLogin: 'Never'
    };
    setUsers(prev => {
      const updated = [...prev, newUser];
      storageService.saveUsers(updated);
      return updated;
    });
  }, []);

  const updateThresholds = useCallback((newThresholds: ThresholdConfig) => {
    setThresholds(newThresholds);
    storageService.saveThresholds(newThresholds);
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => {
      const updated = prev.map(a => 
        a.id === alertId ? {
          ...a,
          acknowledged: true,
          acknowledgedBy: currentUser.name,
          acknowledgedAt: new Date().toISOString()
        } : a
      );
      storageService.saveAlerts(updated);
      return updated;
    });
  }, [currentUser.name]);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
    storageService.saveAlerts([]);
  }, []);

  const updateRobot = useCallback((updatedRobot: RobotDevice) => {
    setRobots(prev => {
      const updated = prev.map(r => r.id === updatedRobot.id ? updatedRobot : r);
      storageService.saveRobots(updated);
      return updated;
    });
  }, []);

  const registerRobot = useCallback((robotData: Partial<RobotDevice>) => {
    const newId = `AN-CAT0${robots.length + 1}`;
    const newRobot: RobotDevice = {
      id: newId,
      name: robotData.name || `Catamaran Scout #${robots.length + 1}`,
      model: robotData.model || 'AquaNexus Mark II Catamaran',
      lakeId: selectedLakeId,
      status: 'idle',
      mode: 'autonomous',
      batteryPercentage: 100,
      batteryVoltage: 12.6,
      solarChargingWatts: 12.0,
      currentCoords: selectedLake.center,
      headingDegrees: 0,
      speedKnots: 0,
      gpsFix: { status: 'locked_3d', satellitesTracked: 9, hdop: 0.9 },
      propulsionStatus: { portMotorRpm: 0, starboardMotorRpm: 0, motorTempC: 22 },
      sensorHealth: { phProbe: 'nominal', doSensor: 'nominal', turbiditySensor: 'nominal', tempSensor: 'nominal' },
      lastCommunication: new Date().toISOString(),
      firmwareVersion: 'v2.4.1-esp32',
      hardwareBridgeReady: true
    };
    setRobots(prev => {
      const updated = [...prev, newRobot];
      storageService.saveRobots(updated);
      return updated;
    });
  }, [robots.length, selectedLake.center, selectedLakeId]);

  const addCalibrationRecord = useCallback((record: Omit<SensorCalibrationRecord, 'id'>) => {
    const newRecord: SensorCalibrationRecord = {
      ...record,
      id: `CAL-0${calibrations.length + 1}`
    };
    setCalibrations(prev => {
      const updated = [newRecord, ...prev];
      storageService.saveCalibrations(updated);
      return updated;
    });
  }, [calibrations.length]);

  const updateWaypoints = useCallback((newWaypoints: Waypoint[]) => {
    if (!currentMission) return;
    const updatedMission: Mission = {
      ...currentMission,
      waypoints: newWaypoints
    };
    setMissions(prev => {
      const updated = prev.map(m => m.id === updatedMission.id ? updatedMission : m);
      storageService.saveMissions(updated);
      return updated;
    });
  }, [currentMission]);

  // Operational controls
  const startMission = useCallback(() => {
    if (selectedRobot.status === 'emergency_stopped') {
      alert('Cannot start mission: Vessel is in Emergency Stop state. Reset emergency stop first.');
      return;
    }
    setRobots(prev => prev.map(r => r.id === selectedRobotId ? { ...r, status: 'navigating', speedKnots: 1.6 } : r));
    if (currentMission) {
      setMissions(prev => prev.map(m => m.id === currentMission.id ? { ...m, status: 'in_progress' } : m));
    }
  }, [selectedRobot.status, selectedRobotId, currentMission]);

  const pauseMission = useCallback(() => {
    setRobots(prev => prev.map(r => r.id === selectedRobotId ? { ...r, status: 'paused', speedKnots: 0.0 } : r));
    if (currentMission) {
      setMissions(prev => prev.map(m => m.id === currentMission.id ? { ...m, status: 'paused' } : m));
    }
  }, [selectedRobotId, currentMission]);

  const resumeMission = useCallback(() => {
    setRobots(prev => prev.map(r => r.id === selectedRobotId ? { ...r, status: 'navigating', speedKnots: 1.6 } : r));
    if (currentMission) {
      setMissions(prev => prev.map(m => m.id === currentMission.id ? { ...m, status: 'in_progress' } : m));
    }
  }, [selectedRobotId, currentMission]);

  const stopMission = useCallback(() => {
    setRobots(prev => prev.map(r => r.id === selectedRobotId ? { ...r, status: 'idle', speedKnots: 0.0 } : r));
    if (currentMission) {
      setMissions(prev => prev.map(m => m.id === currentMission.id ? { ...m, status: 'completed', endTime: new Date().toISOString() } : m));
    }
  }, [selectedRobotId, currentMission]);

  const returnToDock = useCallback(() => {
    setRobots(prev => prev.map(r => r.id === selectedRobotId ? { ...r, status: 'returning_to_dock', speedKnots: 1.8 } : r));
  }, [selectedRobotId]);

  const emergencyStop = useCallback(() => {
    setRobots(prev => prev.map(r => r.id === selectedRobotId ? {
      ...r,
      status: 'emergency_stopped',
      speedKnots: 0.0,
      propulsionStatus: { ...r.propulsionStatus, portMotorRpm: 0, starboardMotorRpm: 0 }
    } : r));

    // Generate emergency alert
    const estopAlert: Alert = {
      id: `ALT-ESTOP-${Date.now().toString().slice(-4)}`,
      robotId: selectedRobotId,
      lakeId: selectedLakeId,
      category: 'robot_offline',
      severity: 'critical',
      title: 'Emergency Propulsion Stop Triggered',
      description: 'Operator or software fail-safe initiated emergency shutdown. Propellers disengaged.',
      coords: selectedRobot.currentCoords,
      timestamp: new Date().toISOString(),
      acknowledged: false,
      recommendation: 'Verify physical robot surroundings for obstacles or entanglements before disengaging e-stop.'
    };
    setAlerts(prev => [estopAlert, ...prev]);
  }, [selectedRobot.currentCoords, selectedRobotId, selectedLakeId]);

  // Anomaly injector
  const injectAnomaly = useCallback((type: 'hypoxia' | 'turbidity_spike' | 'alkaline_drift' | 'thermal_surge' | 'low_battery' | 'sensor_fault') => {
    activeAnomalyRef.current = {
      type,
      expiresAt: Date.now() + 45000 // Lasts 45 seconds
    };

    const titles: Record<string, string> = {
      hypoxia: 'Hypoxic Event (Dissolved Oxygen Depletion)',
      turbidity_spike: 'Heavy Silt / Sediment Plume Spike',
      alkaline_drift: 'Alkaline Runoff Drift (pH Surge)',
      thermal_surge: 'Thermal Outflow Discharge',
      low_battery: 'Battery Depletion Warning',
      sensor_fault: 'pH Glass Probe Impedance Drift'
    };

    const newAnomaly: AnomalyInsight = {
      id: `ANOM-${Date.now().toString().slice(-4)}`,
      parameter: type === 'hypoxia' ? 'Dissolved Oxygen' : type === 'turbidity_spike' ? 'Turbidity' : type === 'alkaline_drift' ? 'pH' : 'Water Temperature',
      measuredValue: type === 'hypoxia' ? '3.40 mg/L' : type === 'turbidity_spike' ? '32.8 NTU' : type === 'alkaline_drift' ? '9.15 pH' : '28.4 °C',
      baselineRange: type === 'hypoxia' ? '7.0 – 8.5 mg/L' : type === 'turbidity_spike' ? '2.5 – 5.0 NTU' : type === 'alkaline_drift' ? '7.2 – 7.8 pH' : '19 – 22 °C',
      location: `Simulated Sector near ${selectedRobot.name}`,
      coords: selectedRobot.currentCoords,
      timestamp: new Date().toISOString(),
      reason: `Real-time anomaly injected via test protocol: ${titles[type]}. Significant statistical departure from moving 24h baseline.`,
      severity: type === 'hypoxia' || type === 'low_battery' ? 'critical' : 'warning',
      confidenceScore: 96,
      recommendedVerification: 'Deploy handheld laboratory probe for cross-validation; check automated robot intake for biological obstruction.',
      algorithm: 'Isolation Forest Model'
    };

    setAnomalies(prev => [newAnomaly, ...prev]);
  }, [selectedRobot.currentCoords, selectedRobot.name]);

  const startSimulation = useCallback(() => setSimulationRunning(true), []);
  const pauseSimulation = useCallback(() => setSimulationRunning(false), []);
  const resetSimulation = useCallback(() => {
    const freshReadings = generateInitialHistory(selectedRobotId, selectedLakeId, 48);
    setReadings(freshReadings);
    setLatestReading(freshReadings[freshReadings.length - 1]);
    setRobots(INITIAL_ROBOTS);
    setAlerts(INITIAL_ALERTS);
    setAnomalies(INITIAL_ANOMALIES);
  }, [selectedRobotId, selectedLakeId]);

  // Main Simulation Physics & Sensor Loop
  useEffect(() => {
    if (!simulationRunning) return;

    const timer = setInterval(() => {
      setRobots(prevRobots => {
        return prevRobots.map(robot => {
          if (robot.id !== selectedRobotId) return robot;

          let { status, currentCoords, headingDegrees, batteryPercentage, batteryVoltage, solarChargingWatts } = robot;
          let speedKnots = robot.speedKnots;

          // Check if active anomaly is present
          const activeAnomaly = activeAnomalyRef.current;
          const isAnomalyActive = activeAnomaly && activeAnomaly.expiresAt > Date.now();

          // If navigating or returning to dock, step along waypoints
          if (status === 'navigating' || status === 'returning_to_dock') {
            const waypoints = currentMission?.waypoints || INITIAL_WAYPOINTS;
            const targetWp = status === 'returning_to_dock'
              ? waypoints[0]
              : waypoints[currentMission?.currentWaypointIndex || 1] || waypoints[0];

            // Compute distance and delta
            const dLat = targetWp.lat - currentCoords.lat;
            const dLng = targetWp.lng - currentCoords.lng;
            const dist = Math.sqrt(dLat * dLat + dLng * dLng);

            // Compute target bearing
            const targetHeading = ((Math.atan2(dLng, dLat) * 180) / Math.PI + 360) % 360;
            // Smoothly rotate heading towards target
            const headingDiff = (targetHeading - headingDegrees + 540) % 360 - 180;
            headingDegrees = (headingDegrees + Math.sign(headingDiff) * Math.min(Math.abs(headingDiff), 15) + 360) % 360;

            if (dist < 0.0003) {
              // Reached waypoint!
              if (currentMission) {
                const nextIdx = (currentMission.currentWaypointIndex + 1) % waypoints.length;
                setMissions(prevM => prevM.map(m => m.id === currentMission.id ? {
                  ...m,
                  currentWaypointIndex: nextIdx,
                  totalSamplesCollected: m.totalSamplesCollected + 1
                } : m));
              }
            } else {
              // Step position
              const stepFraction = 0.04;
              currentCoords = {
                lat: currentCoords.lat + dLat * stepFraction,
                lng: currentCoords.lng + dLng * stepFraction
              };
            }

            speedKnots = 1.6;
          } else {
            speedKnots = 0.0;
          }

          // Battery dynamics
          if (status === 'navigating') {
            batteryPercentage = Math.max(5, batteryPercentage - 0.04);
          } else {
            batteryPercentage = Math.min(100, batteryPercentage + 0.01);
          }

          // Handle low battery anomaly
          if (isAnomalyActive && activeAnomaly.type === 'low_battery') {
            batteryPercentage = 14;
          }

          batteryVoltage = Number((10.8 + (batteryPercentage / 100) * 1.8).toFixed(2));
          solarChargingWatts = Number((8.0 + Math.random() * 4.0).toFixed(1));

          return {
            ...robot,
            currentCoords,
            headingDegrees,
            speedKnots,
            batteryPercentage: Math.round(batteryPercentage),
            batteryVoltage,
            solarChargingWatts,
            lastCommunication: new Date().toISOString(),
            propulsionStatus: {
              portMotorRpm: status === 'navigating' ? Math.round(1100 + Math.random() * 50) : 0,
              starboardMotorRpm: status === 'navigating' ? Math.round(1100 + Math.random() * 50) : 0,
              motorTempC: status === 'navigating' ? Number((33.5 + Math.random()).toFixed(1)) : 24.0
            }
          };
        });
      });

      // Generate new Sensor Reading
      const now = new Date();
      const hour = now.getHours() + now.getMinutes() / 60;
      const diurnalDO = Math.sin((hour - 8) * (Math.PI / 12)) * 1.1;
      const diurnalTemp = Math.sin((hour - 9) * (Math.PI / 12)) * 1.8;

      let ph = Number((7.45 + (diurnalDO * 0.12) + (Math.random() * 0.06 - 0.03)).toFixed(2));
      let dissolvedOxygen = Number((7.9 + diurnalDO + (Math.random() * 0.2 - 0.1)).toFixed(2));
      let turbidity = Number((3.4 + (Math.random() * 0.8 - 0.4)).toFixed(2));
      let temperature = Number((20.4 + diurnalTemp + (Math.random() * 0.2 - 0.1)).toFixed(2));

      // Apply injected anomaly if active
      const activeAnomaly = activeAnomalyRef.current;
      if (activeAnomaly && activeAnomaly.expiresAt > Date.now()) {
        if (activeAnomaly.type === 'hypoxia') {
          dissolvedOxygen = Number((3.35 + Math.random() * 0.3).toFixed(2));
        } else if (activeAnomaly.type === 'turbidity_spike') {
          turbidity = Number((28.5 + Math.random() * 6.0).toFixed(2));
        } else if (activeAnomaly.type === 'alkaline_drift') {
          ph = Number((9.12 + Math.random() * 0.2).toFixed(2));
        } else if (activeAnomaly.type === 'thermal_surge') {
          temperature = Number((28.6 + Math.random() * 1.2).toFixed(2));
        }
      }

      const wqi = calculateWQI(ph, dissolvedOxygen, turbidity, temperature);

      const newReading: WaterQualityReading = {
        id: `READ-LIVE-${Date.now().toString().slice(-6)}`,
        robotId: selectedRobotId,
        lakeId: selectedLakeId,
        timestamp: now.toISOString(),
        coords: selectedRobot.currentCoords,
        depthMeters: 0.65,
        ph,
        dissolvedOxygen,
        turbidity,
        temperature,
        wqi,
        source: 'simulated_telemetry',
        batteryPercentage: selectedRobot.batteryPercentage
      };

      setReadings(prev => {
        const next = [...prev, newReading];
        return next.length > 100 ? next.slice(-100) : next;
      });
      setLatestReading(newReading);
      setLastUpdateTime(new Date());

      // Evaluate Thresholds and Trigger Alerts
      if (dissolvedOxygen < thresholds.dissolvedOxygen.minCritical) {
        setAlerts(prev => {
          if (prev.some(a => a.category === 'low_dissolved_oxygen' && !a.acknowledged)) return prev;
          return [{
            id: `ALT-${Date.now().toString().slice(-4)}`,
            robotId: selectedRobotId,
            lakeId: selectedLakeId,
            category: 'low_dissolved_oxygen',
            severity: 'critical',
            title: 'Critical Hypoxia Alert (< 4.0 mg/L)',
            description: `Dissolved oxygen dropped to ${dissolvedOxygen} mg/L, creating severe ecological stress for fish species.`,
            parameter: 'dissolvedOxygen',
            measuredValue: dissolvedOxygen,
            thresholdValue: thresholds.dissolvedOxygen.minCritical,
            unit: 'mg/L',
            coords: selectedRobot.currentCoords,
            timestamp: now.toISOString(),
            acknowledged: false,
            recommendation: 'Evaluate sector for artificial aeration support or biological degradation. Verify sensor calibration.'
          }, ...prev];
        });
      }

      if (turbidity > thresholds.turbidity.maxWarning) {
        setAlerts(prev => {
          if (prev.some(a => a.category === 'high_turbidity' && !a.acknowledged)) return prev;
          return [{
            id: `ALT-${Date.now().toString().slice(-4)}`,
            robotId: selectedRobotId,
            lakeId: selectedLakeId,
            category: 'high_turbidity',
            severity: turbidity > thresholds.turbidity.maxCritical ? 'critical' : 'warning',
            title: 'High Turbidity Sediment Event',
            description: `Turbidity measured ${turbidity} NTU, exceeding nominal safety threshold (${thresholds.turbidity.maxWarning} NTU).`,
            parameter: 'turbidity',
            measuredValue: turbidity,
            thresholdValue: thresholds.turbidity.maxWarning,
            unit: 'NTU',
            coords: selectedRobot.currentCoords,
            timestamp: now.toISOString(),
            acknowledged: false,
            recommendation: 'Inspect shoreline runoff barriers and catamaran optical glass sensor window.'
          }, ...prev];
        });
      }

      if (ph < thresholds.ph.min || ph > thresholds.ph.max) {
        setAlerts(prev => {
          if (prev.some(a => a.category === 'unusual_ph' && !a.acknowledged)) return prev;
          return [{
            id: `ALT-${Date.now().toString().slice(-4)}`,
            robotId: selectedRobotId,
            lakeId: selectedLakeId,
            category: 'unusual_ph',
            severity: 'warning',
            title: 'Unusual Water pH Range',
            description: `Water pH measured ${ph}, outside recommended basin regulatory band (6.5 - 8.5).`,
            parameter: 'ph',
            measuredValue: ph,
            thresholdValue: ph > 8.5 ? thresholds.ph.max : thresholds.ph.min,
            unit: 'pH',
            coords: selectedRobot.currentCoords,
            timestamp: now.toISOString(),
            acknowledged: false,
            recommendation: 'Check surrounding tributary chemical runoff and recalibrate pH glass bulb in buffer 7.00.'
          }, ...prev];
        });
      }

    }, simulationIntervalMs);

    return () => clearInterval(timer);
  }, [
    simulationRunning,
    simulationIntervalMs,
    selectedRobotId,
    selectedLakeId,
    selectedRobot.currentCoords,
    selectedRobot.batteryPercentage,
    currentMission,
    thresholds
  ]);

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        currentUser,
        setCurrentUser,
        switchRole,
        users,
        updateUserRole,
        toggleUserActive,
        createUser,
        lakes,
        selectedLake,
        setSelectedLakeId,
        robots,
        selectedRobot,
        setSelectedRobotId,
        updateRobot,
        registerRobot,
        currentMission,
        missions,
        readings,
        latestReading,
        lastUpdateTime,
        isOnline,
        thresholds,
        updateThresholds,
        alerts,
        acknowledgeAlert,
        clearAllAlerts,
        anomalies,
        injectAnomaly,
        calibrations,
        addCalibrationRecord,
        simulationRunning,
        startSimulation,
        pauseSimulation,
        resetSimulation,
        simulationIntervalMs,
        setSimulationIntervalMs,
        startMission,
        pauseMission,
        resumeMission,
        stopMission,
        returnToDock,
        emergencyStop,
        updateWaypoints
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
