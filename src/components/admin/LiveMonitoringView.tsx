import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Radio,
  Droplets,
  Activity,
  Trash2,
  AlertTriangle,
  RotateCw,
  Cpu,
  CheckCircle2,
  Sliders,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DrainPoint } from '../../types';

interface LiveMonitoringViewProps {
  onInspect: (drain: DrainPoint) => void;
}

export const LiveMonitoringView: React.FC<LiveMonitoringViewProps> = ({ onInspect }) => {
  const { drains, updateDrainMetrics, simulateWasteCleaned, showToast } = useApp();
  const [clearingDrainId, setClearingDrainId] = useState<string | null>(null);

  // Key monitoring stations (Adyar, Velachery, Guindy, Tambaram, Perungallur, Anna Nagar)
  const keyStations = drains.filter((d) =>
    ['DRN-042', 'DRN-018', 'DRN-021', 'DRN-001', 'DRN-002', 'DRN-003'].includes(d.id)
  );

  const handleTriggerClean = (drain: DrainPoint) => {
    setClearingDrainId(drain.id);
    showToast({
      type: 'INFO',
      title: 'Actuator Activated',
      message: `Running automated waste collection gate at ${drain.name}...`,
    });

    setTimeout(() => {
      simulateWasteCleaned(drain.id, 24);
      setClearingDrainId(null);
      showToast({
        type: 'SUCCESS',
        title: 'Waste Removed',
        message: `Sluice gate cleared 24kg debris at ${drain.name}. Water flow restored.`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              Telemetry Stream • ESP32 & Ultrasonic Sensors
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">Live Drainage Monitoring Stations</h2>
          <p className="text-xs text-slate-300 mt-1">
            Real-time IoT data stream updating every 4.5 seconds with automated threshold alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            6 PRIMARY HUBS ONLINE
          </span>
        </div>
      </div>

      {/* Grid of Station Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {keyStations.map((drain) => {
          const isCrit = drain.status === 'critical';
          const isWarn = drain.status === 'warning';
          const isClearing = clearingDrainId === drain.id;

          const waterColor = isCrit ? 'from-rose-500 to-red-600' : isWarn ? 'from-amber-400 to-amber-600' : 'from-cyan-400 to-blue-600';
          const badgeColor = isCrit ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : isWarn ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

          return (
            <motion.div
              key={drain.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-3xl border border-cyan-500/20 flex flex-col justify-between relative overflow-hidden group hover:border-cyan-400/40 transition-all shadow-xl"
            >
              {/* Top info */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="font-mono text-xs font-bold text-cyan-300">{drain.id}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({drain.zone})</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${badgeColor}`}>
                    {drain.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-3 truncate">{drain.name}</h3>

                {/* Animated Water Level Tank Visualization */}
                <div className="mt-4 p-4 rounded-2xl bg-[#041324] border border-cyan-500/20">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Water Level
                    </span>
                    <span className={`font-bold text-sm ${isCrit ? 'text-rose-400' : isWarn ? 'text-amber-400' : 'text-cyan-300'}`}>
                      {drain.waterLevel}%
                    </span>
                  </div>

                  {/* Water tank column */}
                  <div className="relative h-20 w-full bg-[#030c17] rounded-xl overflow-hidden border border-cyan-500/30 p-1 flex flex-col justify-end">
                    {/* Water Level Fill with animated gradient wave */}
                    <motion.div
                      animate={{ height: `${drain.waterLevel}%` }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                      className={`w-full rounded-lg bg-gradient-to-t ${waterColor} opacity-85 relative shadow-[0_0_15px_rgba(34,211,238,0.3)]`}
                    >
                      {/* Subsurface animated wave */}
                      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/30 to-transparent" />
                    </motion.div>

                    {/* Threshold marks */}
                    <div className="absolute top-[15%] left-0 right-0 border-b border-rose-500/40 border-dashed text-[9px] text-rose-400 font-mono pl-2">
                      85% CRITICAL
                    </div>
                    <div className="absolute top-[30%] left-0 right-0 border-b border-amber-500/40 border-dashed text-[9px] text-amber-400 font-mono pl-2">
                      70% WARNING
                    </div>
                  </div>
                </div>

                {/* Flow Rate & Waste Load Bar */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 rounded-2xl bg-[#041324] border border-cyan-500/15">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Flow Rate</span>
                    <span className="text-lg font-black text-white font-mono mt-0.5 block">{drain.flowRate}</span>
                    <span className="text-[10px] text-slate-500 font-mono">m³/s velocity</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#041324] border border-cyan-500/15">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Waste Load</span>
                    <span className="text-lg font-black text-white font-mono mt-0.5 block">{drain.wasteLoad}%</span>
                    <span className="text-[10px] text-slate-500 font-mono">gate volume</span>
                  </div>
                </div>

                {/* IoT Hardware Telemetry Strip */}
                <div className="mt-4 pt-3 border-t border-cyan-500/15 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Cpu className="w-3.5 h-3.5" /> Sensor: {drain.sensorStatus}
                  </span>
                  <span>Motor: <strong className="text-cyan-300">{drain.mechanismStatus}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-3 border-t border-cyan-500/15 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleTriggerClean(drain)}
                  disabled={isClearing}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 disabled:opacity-50"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isClearing ? 'animate-spin' : ''}`} />
                  <span>{isClearing ? 'Actuating...' : 'Clear Sluice'}</span>
                </button>

                <button
                  onClick={() => onInspect(drain)}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold text-cyan-300 bg-[#08223f] hover:bg-[#0d345e] border border-cyan-500/30 transition-all flex items-center justify-center gap-1"
                >
                  <span>Full Telemetry</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
