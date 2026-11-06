/**
 * Aqua Nexus — Interactive Lake GPS Map & GIS Viewport
 * Powered by Leaflet + OpenStreetMap dark tiles with Catamaran vessel tracking,
 * waypoints, sampling station popups, and route path visualization.
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { Coordinates, Waypoint } from '../../types/telemetry';
import { 
  Navigation, 
  Layers, 
  Crosshair, 
  Maximize2, 
  Battery, 
  Radio, 
  MapPin, 
  Compass, 
  Info,
  Clock,
  ExternalLink
} from 'lucide-react';

interface LakeMapProps {
  heightClass?: string;
  showControls?: boolean;
  interactive?: boolean;
}

export const LakeMap: React.FC<LakeMapProps> = ({ 
  heightClass = 'h-[540px]', 
  showControls = true,
  interactive = true 
}) => {
  const { 
    selectedLake, 
    selectedRobot, 
    currentMission, 
    latestReading, 
    readings,
    simulationRunning 
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const robotMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const boundaryPolygonRef = useRef<L.Polygon | null>(null);
  const waypointMarkersRef = useRef<L.Marker[]>([]);
  const stationMarkersRef = useRef<L.Marker[]>([]);

  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite' | 'streets'>('dark');
  const [selectedStation, setSelectedStation] = useState<any | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up existing map if already initialized
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [selectedLake.center.lat, selectedLake.center.lng],
      zoom: selectedLake.zoomLevel || 15,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Tile Layer based on chosen style
    let tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    if (mapStyle === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else if (mapStyle === 'streets') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    // Lake Boundary Polygon
    const boundaryCoords = selectedLake.boundary.map(c => [c.lat, c.lng] as [number, number]);
    const boundaryPolygon = L.polygon(boundaryCoords, {
      color: '#38BDF8',
      weight: 1.5,
      opacity: 0.6,
      fillColor: '#14B8A6',
      fillOpacity: 0.08,
      dashArray: '4, 4'
    }).addTo(map);
    boundaryPolygonRef.current = boundaryPolygon;

    // Predefined Route Polyline
    const waypoints = currentMission?.waypoints || [];
    const routeCoords = waypoints.map(w => [w.lat, w.lng] as [number, number]);
    if (routeCoords.length > 0) {
      routeCoords.push(routeCoords[0]); // Loop back to dock
    }
    const routePolyline = L.polyline(routeCoords, {
      color: '#14B8A6',
      weight: 2,
      opacity: 0.5,
      dashArray: '6, 6'
    }).addTo(map);
    routePolylineRef.current = routePolyline;

    // Station Markers
    stationMarkersRef.current = [];
    selectedLake.samplingStations.forEach(station => {
      const stationIcon = L.divIcon({
        className: 'custom-station-pin',
        html: `
          <div style="background: rgba(17,31,48,0.9); border: 1.5px solid #38BDF8; border-radius: 6px; padding: 2px 6px; font-family: monospace; font-size: 10px; color: #38BDF8; box-shadow: 0 0 10px rgba(56,189,248,0.4); display: flex; align-items: center; gap: 4px; white-space: nowrap; transform: translate(-50%, -50%);">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#38BDF8;"></span>
            ${station.stationCode}
          </div>
        `,
        iconSize: [60, 20],
        iconAnchor: [30, 10]
      });

      const marker = L.marker([station.coords.lat, station.coords.lng], { icon: stationIcon })
        .addTo(map)
        .on('click', () => setSelectedStation(station));

      stationMarkersRef.current.push(marker);
    });

    // Waypoint Markers
    waypointMarkersRef.current = [];
    waypoints.forEach((wp, index) => {
      const wpIcon = L.divIcon({
        className: 'custom-waypoint-marker',
        html: `
          <div style="background: #08111F; border: 1.5px solid #14B8A6; color: #14B8A6; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-family: monospace; font-size: 10px; font-weight: bold; box-shadow: 0 0 8px rgba(20,184,166,0.5); transform: translate(-50%, -50%);">
            ${wp.order}
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([wp.lat, wp.lng], { icon: wpIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; color: #f8fafc;">
            <div style="font-weight: bold; color: #14b8a6; margin-bottom: 2px;">Waypoint #${wp.order}: ${wp.label}</div>
            <div style="color: #94a3b8; font-family: monospace; font-size: 10px;">LAT: ${wp.lat.toFixed(5)} | LNG: ${wp.lng.toFixed(5)}</div>
            ${wp.targetDepthMeters ? `<div style="color: #38bdf8; font-size: 11px; margin-top: 4px;">Target Depth: ${wp.targetDepthMeters}m</div>` : ''}
          </div>
        `);

      waypointMarkersRef.current.push(marker);
    });

    // Create Initial Robot Marker
    const boatIconHtml = `
      <div id="catamaran-marker-wrapper" style="transform: translate(-50%, -50%) rotate(${selectedRobot.headingDegrees}deg); transition: transform 0.4s ease-out; position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
        <!-- Pulsing radar ring -->
        <div style="position: absolute; inset: -4px; border: 1.5px solid rgba(20,184,166,0.6); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <!-- Catamaran vessel SVG representation -->
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Port Hull -->
          <rect x="4" y="6" width="6" height="24" rx="3" fill="#111F30" stroke="#14B8A6" stroke-width="2"/>
          <!-- Starboard Hull -->
          <rect x="26" y="6" width="6" height="24" rx="3" fill="#111F30" stroke="#14B8A6" stroke-width="2"/>
          <!-- Cross Deck Bridge & Electronics Enclosure -->
          <rect x="8" y="12" width="20" height="12" rx="2" fill="#0D1929" stroke="#38BDF8" stroke-width="1.5"/>
          <!-- Solar Panel Array on Deck -->
          <rect x="11" y="14" width="14" height="8" rx="1" fill="#1E293B" stroke="#818CF8" stroke-width="0.75"/>
          <!-- Forward Heading Arrow -->
          <polygon points="18,3 22,11 14,11" fill="#4FDBC8"/>
        </svg>
      </div>
    `;

    const boatIcon = L.divIcon({
      className: 'catamaran-vessel-icon',
      html: boatIconHtml,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const robotMarker = L.marker([selectedRobot.currentCoords.lat, selectedRobot.currentCoords.lng], {
      icon: boatIcon,
      zIndexOffset: 1000
    }).addTo(map);

    robotMarkerRef.current = robotMarker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [selectedLake.id, mapStyle]);

  // Update robot position and heading smoothly
  useEffect(() => {
    if (!robotMarkerRef.current || !selectedRobot) return;

    robotMarkerRef.current.setLatLng([selectedRobot.currentCoords.lat, selectedRobot.currentCoords.lng]);

    // Update rotation transform of SVG catamaran
    const wrapper = document.getElementById('catamaran-marker-wrapper');
    if (wrapper) {
      wrapper.style.transform = `translate(-50%, -50%) rotate(${selectedRobot.headingDegrees}deg)`;
    }
  }, [selectedRobot.currentCoords, selectedRobot.headingDegrees]);

  const recenterOnRobot = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedRobot.currentCoords.lat, selectedRobot.currentCoords.lng], 16, { animate: true });
    }
  };

  const recenterOnLake = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedLake.center.lat, selectedLake.center.lng], selectedLake.zoomLevel, { animate: true });
    }
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-xl overflow-hidden border border-[#38BDF8]/20 bg-[#08111F] shadow-2xl`}>
      {/* Leaflet Mount Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Left: GIS HUD Telemetry Badge */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-auto">
        <div className="px-3 py-1.5 rounded-lg bg-[#0D1929]/90 backdrop-blur-md border border-[#38BDF8]/30 shadow-lg flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#14B8A6] animate-pulse" />
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8]">
              Target Vessel: {selectedRobot.name}
            </div>
            <div className="text-xs font-mono font-semibold text-[#F8FAFC]">
              {selectedRobot.currentCoords.lat.toFixed(5)}° N, {Math.abs(selectedRobot.currentCoords.lng).toFixed(5)}° W
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#08111F]/80 backdrop-blur border border-[#38BDF8]/15 text-[10px] font-mono text-[#94A3B8]">
          <Compass className="w-3 h-3 text-[#14B8A6]" />
          <span>HDG: <strong className="text-[#DAE3F7]">{Math.round(selectedRobot.headingDegrees)}°</strong></span>
          <span className="text-[#38BDF8]/40">·</span>
          <span>SPD: <strong className="text-[#DAE3F7]">{selectedRobot.speedKnots.toFixed(1)} kts</strong></span>
          <span className="text-[#38BDF8]/40">·</span>
          <span>SATS: <strong className="text-[#DAE3F7]">{selectedRobot.gpsFix.satellitesTracked}</strong></span>
        </div>
      </div>

      {/* Top Right: Layer Switcher & Re-center Toolbar */}
      {showControls && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-[#0D1929]/90 backdrop-blur-md border border-[#38BDF8]/30 p-1 rounded-lg shadow-lg">
          <button
            onClick={recenterOnRobot}
            className="p-1.5 rounded text-[#94A3B8] hover:text-[#4FDBC8] hover:bg-[#111F30] transition-colors"
            title="Center on Catamaran Robot"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            onClick={recenterOnLake}
            className="p-1.5 rounded text-[#94A3B8] hover:text-[#4FDBC8] hover:bg-[#111F30] transition-colors"
            title="Center on Lake Basin"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-[#38BDF8]/20 mx-0.5" />

          {/* Map Layer Mode Buttons */}
          <button
            onClick={() => setMapStyle('dark')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-colors ${
              mapStyle === 'dark' ? 'bg-[#14B8A6] text-[#08111F] font-bold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Bathymetric
          </button>
          <button
            onClick={() => setMapStyle('satellite')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-colors ${
              mapStyle === 'satellite' ? 'bg-[#14B8A6] text-[#08111F] font-bold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Satellite
          </button>
        </div>
      )}

      {/* Bottom Center / Right: Robot Quick Telemetry HUD Strip */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-10 bg-[#0D1929]/95 backdrop-blur-md border border-[#20B8A6]/40 rounded-lg p-2.5 shadow-2xl flex flex-wrap items-center justify-between sm:justify-start gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="font-semibold text-[#F8FAFC]">{selectedRobot.status.replace(/_/g, ' ').toUpperCase()}</span>
          <span className="text-[10px] font-mono text-[#94A3B8] border-l border-[#38BDF8]/20 pl-2">
            Mission: {currentMission?.name.slice(0, 24)}...
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div>
            <span className="text-[#94A3B8]">pH: </span>
            <span className="text-[#4FDBC8] font-bold">{latestReading.ph.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[#94A3B8]">DO: </span>
            <span className="text-[#38BDF8] font-bold">{latestReading.dissolvedOxygen.toFixed(1)} <span className="text-[9px]">mg/L</span></span>
          </div>
          <div>
            <span className="text-[#94A3B8]">TURB: </span>
            <span className="text-[#F59E0B] font-bold">{latestReading.turbidity.toFixed(1)} <span className="text-[9px]">NTU</span></span>
          </div>
          <div>
            <span className="text-[#94A3B8]">TEMP: </span>
            <span className="text-[#818CF8] font-bold">{latestReading.temperature.toFixed(1)}°C</span>
          </div>
          <div className="flex items-center gap-1 border-l border-[#38BDF8]/20 pl-2">
            <Battery className="w-3.5 h-3.5 text-[#22C55E]" />
            <span className="text-[#22C55E] font-bold">{selectedRobot.batteryPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Clicked Station Inspector Flyout Modal */}
      {selectedStation && (
        <div className="absolute top-14 right-3 z-20 w-72 bg-[#111F30]/95 backdrop-blur-lg border border-[#38BDF8]/40 rounded-xl p-3.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#38BDF8]/20">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8]">
                {selectedStation.stationCode}
              </span>
              <h4 className="text-xs font-bold text-[#F8FAFC] mt-0.5">{selectedStation.name}</h4>
            </div>
            <button 
              onClick={() => setSelectedStation(null)}
              className="text-[#94A3B8] hover:text-[#F8FAFC] text-sm p-1"
            >
              &times;
            </button>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-2 leading-relaxed">
            {selectedStation.description}
          </p>
          <div className="mt-3 p-2 bg-[#08111F] rounded-lg border border-[#38BDF8]/10 text-[10px] font-mono space-y-1">
            <div className="text-[#94A3B8]">COORDINATES:</div>
            <div className="text-[#4FDBC8]">{selectedStation.coords.lat.toFixed(5)}° N, {Math.abs(selectedStation.coords.lng).toFixed(5)}° W</div>
            <div className="text-[#94A3B8] pt-1">HISTORICAL RISK PROFILE:</div>
            <div className="text-[#F8FAFC]">Moderate agricultural tributary influence · Priority DO checkpoint</div>
          </div>
        </div>
      )}
    </div>
  );
};
