import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Navigation,
  Radio,
  Layers,
  Droplets,
  AlertTriangle,
  RotateCcw,
  Sliders,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { DrainPoint } from '../../types';
import { useApp } from '../../context/AppContext';

interface ChennaiMapProps {
  onSelectDrain?: (drain: DrainPoint) => void;
  filteredStatus?: 'all' | 'normal' | 'warning' | 'critical';
  compact?: boolean;
  roleMode?: 'admin' | 'citizen' | 'worker';
}

const CHENNAI_HOTSPOTS = [
  { name: 'Guindy', lat: 13.0067, lng: 80.2025, zoom: 15, tag: 'High Risk' },
  { name: 'Tambaram', lat: 12.9249, lng: 80.1275, zoom: 15, tag: 'Canal Junction' },
  { name: 'Perungallur', lat: 12.9050, lng: 80.0820, zoom: 15, tag: 'Outfall Feeder' },
  { name: 'Adyar', lat: 13.0012, lng: 80.2565, zoom: 15, tag: 'Estuary Basin' },
  { name: 'Velachery', lat: 12.9815, lng: 80.2180, zoom: 15, tag: 'Flood Prone' },
  { name: 'Anna Nagar', lat: 13.0850, lng: 80.2101, zoom: 15, tag: 'Command Hub' },
];

export const ChennaiMap: React.FC<ChennaiMapProps> = ({
  onSelectDrain,
  filteredStatus = 'all',
  compact = false,
  roleMode = 'admin',
}) => {
  const { drains, setSelectedDrain } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapTheme, setMapTheme] = useState<'dark' | 'streets'>('dark');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'normal' | 'warning' | 'critical'>(filteredStatus);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedDrainId, setSelectedDrainId] = useState<string | null>(null);

  const criticalCount = drains.filter((d) => d.status === 'critical').length;
  const warningCount = drains.filter((d) => d.status === 'warning').length;
  const normalCount = drains.filter((d) => d.status === 'normal').length;

  const filteredDrains = useMemo(() => {
    return drains.filter((d) => {
      if (selectedZone !== 'all' && d.zone !== selectedZone) return false;
      if (statusFilter !== 'all' && d.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          d.id.toLowerCase().includes(q) ||
          d.name.toLowerCase().includes(q) ||
          d.zone.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [drains, selectedZone, statusFilter, searchQuery]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Chennai
    const map = L.map(mapContainerRef.current, {
      center: [13.0250, 80.2180],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark GIS tiles default
    const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const tileLayer = L.tileLayer(darkTileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Markers layer
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Theme
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    const tileUrl =
      mapTheme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    tileLayerRef.current.setUrl(tileUrl);
  }, [mapTheme]);

  // Update Markers when filteredDrains change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    filteredDrains.forEach((drain) => {
      const lat = drain.coordinates.lat || 13.0475;
      const lng = drain.coordinates.lng || 80.2200;

      // Color coding
      const isCritical = drain.status === 'critical';
      const isWarning = drain.status === 'warning';

      const color = isCritical ? '#f43f5e' : isWarning ? '#f59e0b' : '#10b981';
      const pulseClass = isCritical ? 'animate-ping' : '';

      const iconHtml = `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
          ${
            isCritical
              ? `<span style="position: absolute; width: 30px; height: 30px; border-radius: 9999px; background-color: rgba(244, 63, 94, 0.45);" class="${pulseClass}"></span>`
              : ''
          }
          <div style="
            width: 22px; 
            height: 22px; 
            border-radius: 9999px; 
            background: #061a2e; 
            border: 2.5px solid ${color}; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            box-shadow: 0 0 12px ${color}88;
            cursor: pointer;
          ">
            <div style="width: 8px; height: 8px; border-radius: 9999px; background: ${color};"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-drain-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const popupContent = `
        <div style="
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          background: #081e36;
          color: #f1f5f9;
          padding: 12px;
          border-radius: 14px;
          min-width: 230px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
          border: 1px solid rgba(34, 211, 238, 0.3);
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; border-bottom: 1px solid rgba(34, 211, 238, 0.2); padding-bottom: 4px;">
            <span style="font-weight: 700; font-size: 13px; color: #22d3ee;">${drain.id}</span>
            <span style="
              font-size: 10px; 
              font-weight: 800; 
              text-transform: uppercase; 
              padding: 2px 6px; 
              border-radius: 6px; 
              background: ${isCritical ? '#f43f5e33' : isWarning ? '#f59e0b33' : '#10b98133'}; 
              color: ${color};
            ">${drain.status}</span>
          </div>

          <div style="font-size: 12px; font-weight: 600; color: #ffffff; margin-bottom: 8px;">
            ${drain.name}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px; margin-bottom: 10px;">
            <div style="background: #051323; padding: 5px 8px; border-radius: 8px;">
              <span style="color: #94a3b8; font-size: 10px; display: block;">Water Level</span>
              <strong style="color: ${color}; font-size: 12px;">${drain.waterLevel}%</strong>
            </div>
            <div style="background: #051323; padding: 5px 8px; border-radius: 8px;">
              <span style="color: #94a3b8; font-size: 10px; display: block;">Waste Load</span>
              <strong style="color: #e2e8f0; font-size: 12px;">${drain.wasteLoad}%</strong>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; margin-bottom: 8px;">
            <span>Flow: <strong>${drain.flowRate} m³/s</strong></span>
            <span>Sensor: <strong style="color: #10b981;">${drain.sensorStatus}</strong></span>
          </div>

          <button id="btn-inspect-${drain.id}" style="
            width: 100%;
            padding: 6px 10px;
            background: linear-gradient(to right, #00a8ff, #22d3ee);
            color: #061a2e;
            font-weight: 700;
            font-size: 11px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          ">
            Inspect Drain Node
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-leaflet-popup',
        closeButton: false,
      });

      marker.on('popupopen', () => {
        setSelectedDrainId(drain.id);
        const btn = document.getElementById(`btn-inspect-${drain.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectDrain) {
              onSelectDrain(drain);
            } else {
              setSelectedDrain(drain);
            }
          };
        }
      });

      marker.addTo(markersLayerRef.current!);
    });
  }, [filteredDrains, onSelectDrain, setSelectedDrain]);

  const handleFlyTo = (lat: number, lng: number, zoom = 15) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([lat, lng], zoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  };

  const handleDrainItemClick = (drain: DrainPoint) => {
    setSelectedDrainId(drain.id);
    handleFlyTo(drain.coordinates.lat, drain.coordinates.lng, 16);
    if (onSelectDrain) {
      onSelectDrain(drain);
    } else {
      setSelectedDrain(drain);
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleReset = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([13.0250, 80.2180], 12);
    }
  };

  return (
    <div
      className={`relative rounded-3xl bg-[#06182c] border border-cyan-500/25 overflow-hidden flex flex-col shadow-2xl ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : compact ? 'h-[500px]' : 'h-[700px]'
      }`}
    >
      {/* Top Controls Header */}
      <div className="p-3.5 sm:p-4 border-b border-cyan-500/20 bg-[#041222] flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search drain / road..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#081e36] border border-cyan-500/30 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 w-36 sm:w-52"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#081e36] p-1 rounded-xl border border-cyan-500/30 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({drains.length})
            </button>
            <button
              onClick={() => setStatusFilter('critical')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                statusFilter === 'critical'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              Critical ({criticalCount})
            </button>
            <button
              onClick={() => setStatusFilter('warning')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                statusFilter === 'warning'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Warning ({warningCount})
            </button>
            <button
              onClick={() => setStatusFilter('normal')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                statusFilter === 'normal'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Safe ({normalCount})
            </button>
          </div>
        </div>

        {/* Right side controls: Layer switch & Fullscreen */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMapTheme(mapTheme === 'dark' ? 'streets' : 'dark')}
            className="px-3 py-1.5 rounded-xl bg-[#081e36] hover:bg-[#0c2b4d] border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-1.5 transition-colors"
            title="Toggle Map Style"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono">{mapTheme === 'dark' ? 'Dark GIS' : 'OSM Street'}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-[#081e36] hover:bg-[#0c2b4d] border border-cyan-500/30 text-slate-300 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Chennai Hotspots Quick Jump Strip */}
      <div className="px-4 py-2 bg-[#05162a] border-b border-cyan-500/15 flex items-center gap-2 overflow-x-auto scrollbar-none z-10">
        <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
          <Navigation className="w-3 h-3" /> Quick Jump:
        </span>
        {CHENNAI_HOTSPOTS.map((spot) => (
          <button
            key={spot.name}
            onClick={() => handleFlyTo(spot.lat, spot.lng, spot.zoom)}
            className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#08223f]/80 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-cyan-500/25 transition-all whitespace-nowrap flex items-center gap-1.5"
          >
            <span>{spot.name}</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              {spot.tag}
            </span>
          </button>
        ))}
      </div>

      {/* Main Map Body: Sidebar list + Leaflet Canvas */}
      <div className="relative flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Real Leaflet Map Container */}
        <div ref={mapContainerRef} className="flex-1 w-full h-full min-h-[300px] z-0 bg-[#030d17]" />

        {/* Floating Zoom & Compass Controls */}
        <div className="absolute right-4 top-4 z-20 flex flex-col gap-1.5 bg-[#061a2e]/90 p-1.5 rounded-2xl border border-cyan-500/30 backdrop-blur-md shadow-xl">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-cyan-300" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-cyan-300" />
          </button>
          <div className="h-px bg-cyan-500/20 my-0.5" />
          <button
            onClick={handleReset}
            className="p-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            title="Reset to Greater Chennai view"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Side Panel: Drains / Problems List */}
        <div className="w-full md:w-80 lg:w-96 bg-[#06182c]/95 backdrop-blur-xl border-t md:border-t-0 md:border-l border-cyan-500/20 flex flex-col h-48 md:h-full z-10">
          <div className="p-3 border-b border-cyan-500/20 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              Drain Nodes ({filteredDrains.length})
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Click to fly & inspect</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-cyan-500/10 p-2 space-y-1">
            {filteredDrains.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No drains match active filter.
              </div>
            ) : (
              filteredDrains.map((drain) => {
                const isSelected = selectedDrainId === drain.id;
                const isCrit = drain.status === 'critical';
                const isWarn = drain.status === 'warning';

                return (
                  <div
                    key={drain.id}
                    onClick={() => handleDrainItemClick(drain)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isCrit
                              ? 'bg-rose-500 animate-ping'
                              : isWarn
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                        />
                        <span className="text-xs font-bold font-mono text-cyan-300">
                          {drain.id}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          isCrit
                            ? 'bg-rose-500/20 text-rose-300'
                            : isWarn
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {drain.status}
                      </span>
                    </div>

                    <div className="text-xs font-medium text-slate-200 mt-1 truncate">
                      {drain.name}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
                      <span>
                        Water: <strong className={isCrit ? 'text-rose-400' : isWarn ? 'text-amber-400' : 'text-emerald-400'}>{drain.waterLevel}%</strong>
                      </span>
                      <span>
                        Waste: <strong>{drain.wasteLoad}%</strong>
                      </span>
                      <span>
                        Flow: <strong>{drain.flowRate} m³/s</strong>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
