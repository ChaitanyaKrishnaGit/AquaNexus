/**
 * Aqua Nexus — ESP32 Hardware Integration & MQTT Ingestion Architecture
 * 
 * Formal JSON Schema and validation layer for physical catamaran robots.
 * Microcontroller: ESP32 dual-core Xtensa LX6
 * Sensors: pH analog probe, Galvanic DO probe, Optical Turbidity sensor, DS18B20 1-Wire, NEO-6M GPS via UART2
 */

export const ESP32_TELEMETRY_JSON_SCHEMA = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "AquaNexusRobotTelemetry",
  "description": "Standardized MQTT Telemetry Packet for Aqua Nexus Catamaran Robots",
  "type": "object",
  "required": [
    "schema_version",
    "robot_id",
    "timestamp_utc",
    "source",
    "gps",
    "sensors",
    "power",
    "propulsion",
    "diagnostics"
  ],
  "properties": {
    "schema_version": {
      "type": "string",
      "enum": ["1.0.0", "1.1.0"]
    },
    "robot_id": {
      "type": "string",
      "pattern": "^AN-[A-Z0-9]{3,8}$",
      "description": "Unique serial identifier of robot, e.g. AN-CAT01"
    },
    "timestamp_utc": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 UTC timestamp acquired from GPS NMEA or NTP"
    },
    "source": {
      "type": "string",
      "enum": ["hardware_esp32_mqtt", "simulated_telemetry"]
    },
    "gps": {
      "type": "object",
      "required": ["latitude", "longitude", "fix_status", "satellites", "hdop", "heading_deg", "speed_knots"],
      "properties": {
        "latitude": { "type": "number", "minimum": -90, "maximum": 90 },
        "longitude": { "type": "number", "minimum": -180, "maximum": 180 },
        "fix_status": { "type": "string", "enum": ["no_fix", "fix_2d", "fix_3d"] },
        "satellites": { "type": "integer", "minimum": 0, "maximum": 32 },
        "hdop": { "type": "number", "minimum": 0.0, "maximum": 50.0 },
        "heading_deg": { "type": "number", "minimum": 0, "maximum": 360 },
        "speed_knots": { "type": "number", "minimum": 0, "maximum": 30 }
      }
    },
    "sensors": {
      "type": "object",
      "required": ["ph", "dissolved_oxygen_mg_l", "turbidity_ntu", "water_temp_c", "depth_m"],
      "properties": {
        "ph": { "type": "number", "minimum": 0.0, "maximum": 14.0 },
        "dissolved_oxygen_mg_l": { "type": "number", "minimum": 0.0, "maximum": 20.0 },
        "turbidity_ntu": { "type": "number", "minimum": 0.0, "maximum": 1000.0 },
        "water_temp_c": { "type": "number", "minimum": -5.0, "maximum": 50.0 },
        "depth_m": { "type": "number", "minimum": 0.0, "maximum": 50.0 }
      }
    },
    "power": {
      "type": "object",
      "required": ["battery_voltage_v", "battery_percentage", "solar_charging_watts", "current_draw_ma"],
      "properties": {
        "battery_voltage_v": { "type": "number", "minimum": 9.0, "maximum": 14.0 },
        "battery_percentage": { "type": "number", "minimum": 0, "maximum": 100 },
        "solar_charging_watts": { "type": "number", "minimum": 0.0, "maximum": 50.0 },
        "current_draw_ma": { "type": "number", "minimum": 0, "maximum": 8000 }
      }
    },
    "propulsion": {
      "type": "object",
      "required": ["port_motor_rpm", "starboard_motor_rpm", "motor_temp_c"],
      "properties": {
        "port_motor_rpm": { "type": "integer", "minimum": 0, "maximum": 3000 },
        "starboard_motor_rpm": { "type": "integer", "minimum": 0, "maximum": 3000 },
        "motor_temp_c": { "type": "number", "minimum": 0, "maximum": 100 }
      }
    },
    "diagnostics": {
      "type": "object",
      "required": ["esp32_uptime_s", "free_heap_bytes", "wifi_rssi_dbm", "sensor_flags"],
      "properties": {
        "esp32_uptime_s": { "type": "integer", "minimum": 0 },
        "free_heap_bytes": { "type": "integer", "minimum": 1000 },
        "wifi_rssi_dbm": { "type": "integer", "minimum": -100, "maximum": 0 },
        "sensor_flags": {
          "type": "object",
          "properties": {
            "ph_ok": { "type": "boolean" },
            "do_ok": { "type": "boolean" },
            "turbidity_ok": { "type": "boolean" },
            "temp_ok": { "type": "boolean" }
          }
        }
      }
    }
  }
};

export interface TelemetryValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  parsedData?: any;
}

/**
 * Validates incoming JSON telemetry packets against the strict schema
 */
export function validateEsp32Telemetry(payloadString: string): TelemetryValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let parsed: any;

  try {
    parsed = JSON.parse(payloadString);
  } catch (err: any) {
    return {
      isValid: false,
      errors: [`Malformed JSON: ${err.message}`],
      warnings: []
    };
  }

  // Required top-level fields
  const requiredTop = ['schema_version', 'robot_id', 'timestamp_utc', 'source', 'gps', 'sensors', 'power', 'propulsion', 'diagnostics'];
  for (const field of requiredTop) {
    if (parsed[field] === undefined) {
      errors.push(`Missing required top-level property: '${field}'`);
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors, warnings };
  }

  // Schema version check
  if (!['1.0.0', '1.1.0'].includes(parsed.schema_version)) {
    warnings.push(`Unrecognized schema_version '${parsed.schema_version}'. Expected '1.0.0' or '1.1.0'.`);
  }

  // GPS checks
  if (parsed.gps) {
    if (typeof parsed.gps.latitude !== 'number' || parsed.gps.latitude < -90 || parsed.gps.latitude > 90) {
      errors.push(`gps.latitude must be a number between -90 and 90`);
    }
    if (typeof parsed.gps.longitude !== 'number' || parsed.gps.longitude < -180 || parsed.gps.longitude > 180) {
      errors.push(`gps.longitude must be a number between -180 and 180`);
    }
    if (parsed.gps.fix_status === 'no_fix') {
      warnings.push(`GPS reported 'no_fix'. Spatial positioning accuracy is degraded.`);
    }
  }

  // Sensor range checks
  if (parsed.sensors) {
    const { ph, dissolved_oxygen_mg_l, turbidity_ntu, water_temp_c } = parsed.sensors;
    if (typeof ph !== 'number' || ph < 0 || ph > 14) {
      errors.push(`sensors.ph must be a float between 0.0 and 14.0 (got ${ph})`);
    }
    if (typeof dissolved_oxygen_mg_l !== 'number' || dissolved_oxygen_mg_l < 0 || dissolved_oxygen_mg_l > 25) {
      errors.push(`sensors.dissolved_oxygen_mg_l must be between 0.0 and 25.0 (got ${dissolved_oxygen_mg_l})`);
    }
    if (typeof turbidity_ntu !== 'number' || turbidity_ntu < 0) {
      errors.push(`sensors.turbidity_ntu must be a non-negative number`);
    }
    if (typeof water_temp_c !== 'number' || water_temp_c < -10 || water_temp_c > 60) {
      errors.push(`sensors.water_temp_c out of realistic water range: ${water_temp_c}°C`);
    }
  }

  // Power checks
  if (parsed.power) {
    if (parsed.power.battery_percentage < 20) {
      warnings.push(`Low battery alert: ${parsed.power.battery_percentage}%. Immediate return-to-dock advised.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    parsedData: parsed
  };
}

/**
 * Standard MQTT Topic Architecture for Aqua Nexus
 */
export const MQTT_TOPIC_CONVENTION = {
  telemetryPublish: "aquanexus/v1/robots/{robot_id}/telemetry",
  eventsPublish: "aquanexus/v1/robots/{robot_id}/events",
  commandsSubscribe: "aquanexus/v1/robots/{robot_id}/commands",
  missionUpdateSubscribe: "aquanexus/v1/robots/{robot_id}/mission",
  emergencyStopSubscribe: "aquanexus/v1/robots/{robot_id}/estop",
  brokerRecommendation: "Mosquitto 2.0 / EMQX Enterprise with TLS 1.3 & mTLS client certs"
};

/**
 * Standard reference sample payload for hardware testing
 */
export const SAMPLE_ESP32_PAYLOAD = JSON.stringify({
  "schema_version": "1.0.0",
  "robot_id": "AN-CAT01",
  "timestamp_utc": new Date().toISOString(),
  "source": "hardware_esp32_mqtt",
  "gps": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "fix_status": "fix_3d",
    "satellites": 9,
    "hdop": 0.85,
    "heading_deg": 142.5,
    "speed_knots": 1.4
  },
  "sensors": {
    "ph": 7.42,
    "dissolved_oxygen_mg_l": 7.85,
    "turbidity_ntu": 3.12,
    "water_temp_c": 19.8,
    "depth_m": 0.45
  },
  "power": {
    "battery_voltage_v": 12.18,
    "battery_percentage": 84,
    "solar_charging_watts": 8.4,
    "current_draw_ma": 1420
  },
  "propulsion": {
    "port_motor_rpm": 950,
    "starboard_motor_rpm": 945,
    "motor_temp_c": 32.4
  },
  "diagnostics": {
    "esp32_uptime_s": 4210,
    "free_heap_bytes": 182400,
    "wifi_rssi_dbm": -68,
    "sensor_flags": {
      "ph_ok": true,
      "do_ok": true,
      "turbidity_ok": true,
      "temp_ok": true
    }
  }
}, null, 2);
