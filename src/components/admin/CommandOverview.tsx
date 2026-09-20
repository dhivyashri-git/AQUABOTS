import React from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  CartesianGrid,
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Clock,
  HardHat,
  ShieldAlert,
  Droplets,
  Layers,
  Radio,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  ZONE_WATER_LEVEL_DATA,
  DAILY_WASTE_TREND_DATA,
  WASTE_COMPOSITION_DATA,
  HOURLY_RAIN_FLOW_DATA,
  ZONE_RISK_RADAR_DATA,
} from '../../data/mockData';
import { DrainPoint } from '../../types';

interface CommandOverviewProps {
  onNavigateToMap?: () => void;
  onNavigateToIncidents?: () => void;
  onNavigateToWorkers?: () => void;
  onInspect?: (drain: DrainPoint) => void;
}

export const CommandOverview: React.FC<CommandOverviewProps> = ({
  onNavigateToMap = () => {},
  onNavigateToIncidents = () => {},
  onNavigateToWorkers = () => {},
  onInspect = () => {},
}) => {
  const { drains, incidents, workers, setSelectedDrain } = useApp();

  const normalCount = drains.filter((d) => d.status === 'normal').length;
  const warningCount = drains.filter((d) => d.status === 'warning').length;
  const criticalCount = drains.filter((d) => d.status === 'critical').length;
  const activeIncidents = incidents.filter((i) => i.status !== 'RESOLVED').length;
  const activeWorkers = workers.filter((w) => w.status !== 'OFFLINE').length;

  const criticalDrains = drains.filter((d) => d.status === 'critical').slice(0, 4);

  // Colors for charts
  const PIE_COLORS = ['#38BDF8', '#34D399', '#F59E0B', '#A855F7'];

  return (
    <div className="space-y-8">
      {/* 8 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Drains */}
        <div className="glass-card p-5 rounded-2xl border border-cyan-500/25 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Drains Monitored</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black font-mono text-cyan-300">128</div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            100% LoRaWAN nodes online
          </p>
        </div>

        {/* Card 2: Normal Drains */}
        <div className="glass-card p-5 rounded-2xl border border-emerald-500/25 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Normal Drainage</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400">{normalCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Water level &lt; 50%, unobstructed</p>
        </div>

        {/* Card 3: Warning Drains */}
        <div className="glass-card p-5 rounded-2xl border border-amber-500/25 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Warning Telemetry</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black font-mono text-amber-400">{warningCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Level 50-80% or elevated silt</p>
        </div>

        {/* Card 4: Critical Blockages */}
        <div className="glass-card p-5 rounded-2xl border border-rose-500/30 flex flex-col justify-between bg-rose-950/20">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Critical Inundations</span>
            <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div className="text-3xl font-black font-mono text-rose-400">{criticalCount}</div>
          <p className="text-[11px] text-rose-300 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            Immediate dispatch active
          </p>
        </div>

        {/* Card 5: Waste Collected */}
        <div className="glass-card p-5 rounded-2xl border border-cyan-500/25 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Waste Collected Today</span>
            <Trash2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black font-mono text-cyan-300">248 kg</div>
          <p className="text-[11px] text-slate-400 mt-1">+18.4% above seasonal baseline</p>
        </div>

        {/* Card 6: Active Incidents */}
        <div
          onClick={onNavigateToIncidents}
          className="glass-card p-5 rounded-2xl border border-purple-500/25 hover:border-purple-400/50 cursor-pointer flex flex-col justify-between transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active Incidents</span>
            <AlertTriangle className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black font-mono text-purple-300">{activeIncidents}</div>
          <p className="text-[11px] text-purple-300/80 mt-1 flex items-center gap-1">
            <span>Click to inspect incident log</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Card 7: Active Workers */}
        <div
          onClick={onNavigateToWorkers}
          className="glass-card p-5 rounded-2xl border border-blue-500/25 hover:border-blue-400/50 cursor-pointer flex flex-col justify-between transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active Field Workers</span>
            <HardHat className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black font-mono text-blue-300">{activeWorkers} / 24</div>
          <p className="text-[11px] text-slate-400 mt-1">75% roster deployed on shifts</p>
        </div>

        {/* Card 8: Avg Response Time */}
        <div className="glass-card p-5 rounded-2xl border border-cyan-500/25 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Avg Response Time</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400">18 min</div>
          <p className="text-[11px] text-slate-400 mt-1">From alert to mechanical clearance</p>
        </div>
      </div>

      {/* Critical Drains Emergency Ticker */}
      {criticalDrains.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#1b0812] border border-rose-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Emergency Inundation Warning ({criticalDrains.length} Critical Drains)
              </h4>
              <p className="text-xs text-rose-200">
                DRN-042 (Anna Nagar 2nd Ave) and DRN-018 (Velachery) exceed 75% water level.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {criticalDrains.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDrain(d)}
                className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold"
              >
                {d.id} ({d.waterLevel}%)
              </button>
            ))}
            <button
              onClick={onNavigateToMap}
              className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
            >
              View on Map
            </button>
          </div>
        </div>
      )}

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Live Water Level by Zone (Bar Chart) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-cyan-500/25">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                1. Water Level by Chennai Zone
              </h3>
              <p className="text-xs text-slate-400">
                Average vs peak water head level (%) across 9 zones
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              IoT Real-Time
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ZONE_WATER_LEVEL_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#102a45" />
                <XAxis dataKey="zone" stroke="#64748b" fontSize={11} angle={-25} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#081e36', borderColor: '#00A8FF', borderRadius: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="avgLevel" fill="#0284c7" name="Avg Water Level %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="peakLevel" fill="#f43f5e" name="Peak Level %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Waste Composition (Pie Chart) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-cyan-500/25">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                2. AI Waste Composition
              </h3>
              <p className="text-xs text-slate-400">Classified by edge camera models</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              Vision ML
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={WASTE_COMPOSITION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {WASTE_COMPOSITION_DATA.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#081e36', borderColor: '#22D3EE', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Daily Waste Removal Trend (Area Chart) */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-cyan-500/25">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                3. Daily Waste Extraction Trend
              </h3>
              <p className="text-xs text-slate-400">Weight of solid debris extracted over 7 days (kg)</p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              7-Day Metric
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DAILY_WASTE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="wasteColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#102a45" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#081e36', borderColor: '#22D3EE', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="weightKg" stroke="#22D3EE" strokeWidth={3} fillOpacity={1} fill="url(#wasteColor)" name="Waste Removed (kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Hourly Rainfall vs Drainage Flow (Composed Chart) */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-cyan-500/25">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                4. Hourly Rainfall vs Outflow
              </h3>
              <p className="text-xs text-slate-400">Precipitation (mm/h) against storm canal outflow (m³/s)</p>
            </div>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
              Hydro Model
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HOURLY_RAIN_FLOW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#102a45" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#081e36', borderColor: '#8B5CF6', borderRadius: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="rainfallMm" stroke="#38BDF8" strokeWidth={2} name="Rainfall (mm/h)" />
                <Line type="monotone" dataKey="flowRate" stroke="#34D399" strokeWidth={2} name="Canal Flow (m³/s)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Blockage Risk Radar Across Key Factors */}
        <div className="lg:col-span-12 glass-panel p-6 rounded-3xl border border-cyan-500/25">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                5. Zonal Drainage Vulnerability Radar
              </h3>
              <p className="text-xs text-slate-400">
                Evaluation across Sediment Index, Plastic Accumulation, Inundation Frequency, and Slope
              </p>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
              Risk Profiling
            </span>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={ZONE_RISK_RADAR_DATA}>
                <PolarGrid stroke="#102a45" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis stroke="#64748b" fontSize={10} angle={30} domain={[0, 100]} />
                <Radar name="Velachery Zone" dataKey="Velachery" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.3} />
                <Radar name="Anna Nagar Zone" dataKey="AnnaNagar" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.3} />
                <Radar name="T. Nagar Zone" dataKey="TNagar" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#081e36', borderColor: '#22D3EE', borderRadius: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
