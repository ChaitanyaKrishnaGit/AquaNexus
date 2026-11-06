# AQUA NEXUS — System Architecture & Hardware Specification

**Title:** AI-Powered Autonomous Floating Robot for Lake Water-Quality Monitoring and Restoration Support  
**Version:** 2.4.0 (Limno-IoT Production Baseline)  
**Status:** Software Simulation & ESP32 Hardware Integration Ready  

---

## 1. Executive Summary & Problem Space

Lakes and reservoirs face accelerated eutrophication, toxic cyanobacterial algal blooms, hypoxic dead zones, and illegal agricultural/industrial runoff. Traditional monitoring relies on manual water grab sampling followed by days of delayed laboratory analysis.

**Aqua Nexus** is an autonomous surface vessel (catamaran-style floating robot) paired with a real-time environmental intelligence platform that provides continuous spatial and temporal monitoring of four core limnological indicators:
1. **pH (Acidity/Alkalinity):** Range 0.00 – 14.00 pH
2. **Dissolved Oxygen (DO):** Range 0.00 – 20.00 mg/L
3. **Turbidity (Suspended Sediment/Particulates):** Range 0.0 – 1000.0 NTU
4. **Water Temperature:** Range -5.0°C – 50.0°C

---

## 2. Autonomous Catamaran Floating Robot Hardware

### 2.1 Mechanical Airframe & Hull
- **Design:** Twin-pontoon Catamaran hydrofoil for optimal stability in wind waves and shallow littoral margins.
- **Enclosure:** IP68 waterproof sealed compartment for electronics, with transparent optical quartz window for optical turbidity probe.
- **Propulsion:** Dual brushed DC geared motors driving twin 3-blade marine propellers (differential thrust steering eliminates fragile rudder linkages).

### 2.2 Embedded Microcontroller & Sensors
- **MCU:** Espressif ESP32-WROOM-32D (Dual-core 32-bit Xtensa LX6 @ 240MHz, 520KB SRAM, FreeRTOS).
- **Core 0 Allocation:** Wi-Fi / LTE telemetry, MQTT 5.0 client, TLS 1.3 encryption, and NMEA GPS parser.
- **Core 1 Allocation:** ADC sensor sampling, 100Hz moving-average filtering, temperature compensation, and differential PWM motor PID control.
- **Sensors:**
  - **pH Glass Electrode:** High-impedance analog signal conditioning board connected to ADC1.
  - **Galvanic Dissolved Oxygen Probe:** Membrane-isolated polarographic sensor with onboard thermistor.
  - **Optical Turbidity Sensor:** 90° nephelometric infrared scattering sensor (850nm LED).
  - **Water Temperature:** Dallas DS18B20 digital stainless-steel probe on 1-Wire bus (GPIO 4).
  - **GPS Receiver:** u-blox NEO-6M with ceramic patch antenna via UART2 (9600 baud, 5Hz update).
- **Power System:**
  - Primary battery: 11.1V 3S LiPo battery (5200 mAh, ~4 hours continuous propulsion).
  - Solar assist: 15W monocrystalline deck panel with step-down MPPT regulator.

---

## 3. Telemetry JSON Schema & MQTT Ingestion

To decouple the front-end intelligence dashboard from physical hardware evolution, all robot telemetry conforms to the standard schema:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "AquaNexusRobotTelemetry",
  "type": "object",
  "required": ["schema_version", "robot_id", "timestamp_utc", "source", "gps", "sensors", "power", "propulsion", "diagnostics"],
  "properties": {
    "schema_version": { "type": "string", "enum": ["1.0.0"] },
    "robot_id": { "type": "string" },
    "timestamp_utc": { "type": "string", "format": "date-time" },
    "source": { "type": "string", "enum": ["hardware_esp32_mqtt", "simulated_telemetry"] },
    "gps": {
      "type": "object",
      "required": ["latitude", "longitude", "fix_status", "satellites", "hdop", "heading_deg", "speed_knots"]
    },
    "sensors": {
      "type": "object",
      "required": ["ph", "dissolved_oxygen_mg_l", "turbidity_ntu", "water_temp_c", "depth_m"]
    },
    "power": {
      "type": "object",
      "required": ["battery_voltage_v", "battery_percentage", "solar_charging_watts", "current_draw_ma"]
    },
    "propulsion": {
      "type": "object",
      "required": ["port_motor_rpm", "starboard_motor_rpm", "motor_temp_c"]
    },
    "diagnostics": {
      "type": "object",
      "required": ["esp32_uptime_s", "free_heap_bytes", "wifi_rssi_dbm", "sensor_flags"]
    }
  }
}
```

### MQTT Topic Topology
- `aquanexus/v1/robots/{robot_id}/telemetry` (QoS 1) — Periodic sensor & GPS packets.
- `aquanexus/v1/robots/{robot_id}/events` (QoS 1) — Threshold breach and low-battery events.
- `aquanexus/v1/robots/{robot_id}/estop` (QoS 2) — Immediate propulsion disconnect.
- `aquanexus/v1/robots/{robot_id}/mission` (QoS 1, Retained) — Waypoint sequence updates.

---

## 4. Limnological Methodology & AI Ethics

### 4.1 Water Quality Index (WQI)
Aqua Nexus computes an index score (0–100) based on standard National Sanitation Foundation (NSF) limnology weighting:
$$\text{WQI} = (Q_{\text{DO}} \times 0.35) + (Q_{\text{pH}} \times 0.25) + (Q_{\text{Turb}} \times 0.20) + (Q_{\text{Temp}} \times 0.20)$$

### 4.2 Anomaly Detection Boundaries
- **Detection Scope:** Identifies statistical outliers, rate-of-change jumps ($> 3\sigma$ departure in $< 5$ minutes), and spatial clusters.
- **Scientific Boundary:** Four sensor measurements **cannot** identify specific chemical compounds (e.g. atrazine, organophosphates, or heavy metals) or declare legal contamination liabilities. Official lab spectrophotometry and grab samples are documented as required next verification steps.
