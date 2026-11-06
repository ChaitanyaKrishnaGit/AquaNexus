# AQUA NEXUS — Smart Lake Intelligence & Autonomous Floating Robot Platform

**AI-Powered Autonomous Floating Robot for Lake Water-Quality Monitoring and Restoration Support**

---

## 1. Project Overview

Aqua Nexus is an environmental technology platform that integrates autonomous surface vessel (catamaran robot) telemetry with real-time limnological intelligence. It empowers limnologists, environmental protection agencies, and water utilities to monitor lake health with spatial precision and early anomaly warnings.

### Key Capabilities
- **Real-Time GPS Tracking & GIS Map:** Interactive Leaflet GIS viewport tracking autonomous catamaran floating robot with animated vessel marker, compass heading, waypoint pathing, and sampling station checkpoints.
- **4-Parameter Limnological Telemetry:** High-precision monitoring of **pH**, **Dissolved Oxygen (mg/L)**, **Turbidity (NTU)**, and **Water Temperature (°C)** with statistical bands (Min/Max/Avg) and tabular figures.
- **Water Quality Index (WQI):** Automated NSF weighted index scoring (0–100) classifying aquatic habitat health.
- **Vessel Mission Operations:** Complete operational state machine (Start, Pause, Resume, Stop, Return-to-Dock, Emergency Stop).
- **AI-Assisted Anomaly Insights:** Multi-layer statistical anomaly detection (Rate-of-change surges, spatial cluster outliers, Isolation Forest model).
- **Incident Alarm Management:** Configurable alert thresholds, multi-severity filtering, and 1-click audit sign-offs.
- **Audit-Grade Reports & CSV Export:** Download structured CSV datasets and generate comprehensive printable limnological inspection reports with investigator signature blocks.
- **ESP32 & MQTT Bridge Architecture:** Full JSON Schema (Draft 2020-12), MQTT topic conventions, and an interactive live packet validator for physical hardware integration.
- **Role-Based Access Control (RBAC):** 4 distinct roles (**Admin**, **Operator**, **Researcher**, **Viewer**) with instant 1-click switching.

---

## 2. Visual Theme & Design System

Constructed in accordance with the **Deep Abyss Glassmorphism & Cyber-Marine Precision** constitution:
- **Canvas Void:** `#08111F` (Abyssal deep baseline)
- **Container Surfaces:** `#0D1929` (Frosted sub-surface layers with blur)
- **Elevated Instruments:** `#111F30` (Interactive panels)
- **Bioluminescent Teal:** `#14B8A6` / `#4FDBC8` (Primary action & active vessels)
- **Hydro Cyan:** `#38BDF8` (Water flow & sub-metrics)
- **Nominal State:** `#22C55E` | **Warning:** `#F59E0B` | **Critical:** `#EF4444`
- **Typography:** `Inter` for interface structure, `JetBrains Mono` for tabular telemetry readouts.

---

## 3. QA Testing & Verification Report

| Subsystem | Test Objective | Test Result | Verification Notes |
| :--- | :--- | :--- | :--- |
| **GPS Navigation** | Waypoint progression & catamaran heading | **PASS** | Smooth 40ms position interpolation; heading rotates toward active waypoint target. |
| **Sensor Physics** | Diurnal waves for DO, Temp & pH | **PASS** | Daylight photosynthesis raises DO & pH; nocturnal benthic respiration simulated accurately. |
| **Alert Generation** | Injected anomaly breaches threshold | **PASS** | Injected Hypoxia event (<4.0 mg/L) triggers Critical alert within 1 simulation tick. |
| **Mission Controls** | Start, Pause, Resume, E-Stop | **PASS** | E-Stop cuts motor RPM to 0, halts waypoint traversal, and triggers an incident log. |
| **Export Engine** | CSV and PDF Inspection Report | **PASS** | CSV exports valid formatted columns; PDF report opens in print-ready layout with sign-off lines. |
| **RBAC Security** | Viewer cannot trigger mission changes | **PASS** | Mission controls disabled for Viewer/Researcher; User Admin restricted to Admin. |
| **ESP32 Validator** | JSON Schema compliance testing | **PASS** | Out-of-bound sensor values and malformed JSON caught with precise field error messages. |

---

## 4. Hardware Integration Readiness (ESP32 & Catamaran)

The platform is designed to seamlessly swap simulated telemetry with physical robot telemetry over MQTT:
1. **Microcontroller:** ESP32-WROOM-32D with FreeRTOS.
2. **Sensors:** Analog pH probe (ADC1), Galvanic DO probe (ADC2), Optical Turbidity sensor (ADC3), DS18B20 1-Wire (GPIO 4), NEO-6M GPS (UART2).
3. **Telemetry Topic:** `aquanexus/v1/robots/{robot_id}/telemetry`
4. **Emergency Stop Topic:** `aquanexus/v1/robots/{robot_id}/estop`
5. **Interactive Schema Tester:** Available directly in the app under the **ESP32 & MQTT Bridge** tab.

---

## 5. Local Setup & Execution

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Launch Vite development server
npm run dev
```

The application will start on `http://localhost:3000`.

### Building for Production
```bash
npm run build
```
