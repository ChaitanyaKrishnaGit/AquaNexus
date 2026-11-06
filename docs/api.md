# AQUA NEXUS — REST & WebSocket API Specification

**Base URL:** `http://localhost:8000/api/v1` or `/api`  
**WebSocket URL:** `ws://localhost:8000/ws/monitoring`  
**Security:** Bearer JWT Header (`Authorization: Bearer <token>`) & Role-Based Access Control (RBAC)  

---

## 1. Authentication & Users

### `POST /api/auth/login`
Authenticates user and returns JWT token and user profile.
- **Request Body:**
  ```json
  { "email": "operator@aquanexus.org", "password": "SecurePassword123" }
  ```
- **Response 200 OK:**
  ```json
  {
    "access_token": "eyJhbG...",
    "token_type": "bearer",
    "user": { "id": "usr-2", "name": "Marcus Vance", "role": "operator" }
  }
  ```

### `GET /api/users` (Admin Only)
Returns list of registered users and activation states.

---

## 2. Dashboard & Summary

### `GET /api/dashboard/summary?lake_id=lake-crystal`
Returns consolidated KPIs: active robots count, lake surface area, current WQI, and unacknowledged alerts count.

---

## 3. Waterbody & Lakes

### `GET /api/lakes`
List all configured lakes, geofence polygons, and fixed sampling stations.

---

## 4. Robots & Fleet Telemetry

### `GET /api/robots`
List all catamaran robot vessels, operational statuses (`navigating`, `idle`, `paused`, `emergency_stopped`), battery levels, and last communication timestamps.

### `GET /api/robots/{robot_id}/readings/latest`
Latest telemetry packet including GPS coordinates and 4 calibrated probe values.

### `GET /api/robots/{robot_id}/readings/history?limit=100&timeframe=24h`
Historical telemetry array for time-series charts and export.

---

## 5. Missions & Waypoint Dispatch

### `POST /api/missions/{mission_id}/start`
Initiates autonomous waypoint traversal on catamaran MCU.

### `POST /api/missions/{mission_id}/pause`
Holds vessel position via GPS virtual anchor.

### `POST /api/missions/{mission_id}/stop`
Aborts active mission and places vessel in holding mode.

### `POST /api/missions/{mission_id}/rth`
Commands robot to return to docking coordinates.

---

## 6. Alerts & Incident Management

### `GET /api/alerts?status=unacknowledged`
Returns active threshold breach alarms.

### `PATCH /api/alerts/{alert_id}/acknowledge`
Signs off alert with operator timestamp and mitigation protocol.

---

## 7. Real-Time WebSocket Channel

### `WS /ws/monitoring?robot_id=AN-CAT01`
Full-duplex WebSocket stream broadcasting continuous 1Hz - 0.2Hz packets:
- `robot_position`: `{ "lat": 37.7745, "lng": -122.4220, "heading": 48 }`
- `sensor_readings`: `{ "ph": 7.42, "do": 7.85, "turbidity": 3.12, "temp": 19.8, "wqi": 88 }`
- `power_telemetry`: `{ "battery": 84, "volts": 12.18, "solar_w": 8.4 }`
