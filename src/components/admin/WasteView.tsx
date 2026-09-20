import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Trash2,
  Recycle,
  Cpu,
  RotateCw,
  Camera,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Droplets,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WASTE_COMPOSITION_DATA, RECENT_CLASSIFICATION_LOGS } from '../../data/mockData';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const WasteView: React.FC = () => {
  const { wasteData, showToast } = useApp();

  const [simulatingClassification, setSimulatingClassification] = useState(false);
  const [activeServoAngle, setActiveServoAngle] = useState<number>(0);
  const [lastDivertedCategory, setLastDivertedCategory] = useState<string>('Recyclable (Plastic)');

  const PIE_COLORS = ['#38BDF8', '#34D399', '#F59E0B', '#A855F7'];

  const handleSimulateVisionClassification = () => {
    setSimulatingClassification(true);

    const categories = [
      { name: 'Recyclable (PET Plastic)', angle: 0 },
      { name: 'Organic (Palm fronds / Neem Leaves)', angle: 90 },
      { name: 'Non-Recyclable (Silt & Sludge)', angle: 180 },
      { name: 'Hazardous (E-waste battery pack)', angle: 270 },
    ];

    const pick = categories[Math.floor(Math.random() * categories.length)];

    setTimeout(() => {
      setActiveServoAngle(pick.angle);
      setLastDivertedCategory(pick.name);
      setSimulatingClassification(false);

      showToast({
        type: 'SUCCESS',
        title: 'Optical Sorting Completed',
        message: `Edge camera detected ${pick.name}. Servo positioned to ${pick.angle}° divert chute.`,
      });
    }, 1800);
  };

  const handleEmptyBin = (category: string) => {
    showToast({
      type: 'INFO',
      title: 'Collection Truck Alert Sent',
      message: `${category} bin emptied. Capacity reset to 0% in civic ERP.`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-cyan-400" />
            <span>Automatic Waste Segregation & 4-Bin Sluice Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time vision classification, LoRa automated mechanical rake, and 4-way servo chute sorting
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateVisionClassification}
            disabled={simulatingClassification}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {simulatingClassification ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Running Edge Vision Model...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>Simulate Camera Scan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Storage Bins Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {wasteData.bins.map((bin) => {
          const isFull = bin.fillPercent >= 80;
          const isWarning = bin.fillPercent >= 70;

          return (
            <div
              key={bin.category}
              className={`glass-card p-5 rounded-2xl border transition-all space-y-3 ${
                isFull
                  ? 'border-rose-500/40 bg-rose-950/20'
                  : isWarning
                  ? 'border-amber-500/40 bg-amber-950/20'
                  : 'border-cyan-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {bin.category}
                </span>
                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                    isFull
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : isWarning
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {isFull ? 'COLLECTION NEEDED' : `${bin.fillPercent}% FULL`}
                </span>
              </div>

              {/* Visual fill gauge */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300 font-mono">
                  <span>Fill Level</span>
                  <span>{bin.fillPercent}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFull
                        ? 'bg-rose-500'
                        : isWarning
                        ? 'bg-amber-400'
                        : 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                    }`}
                    style={{ width: `${bin.fillPercent}%` }}
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-0.5">
                <div className="flex justify-between">
                  <span>Gross Capacity:</span>
                  <span className="text-slate-200 font-mono">{bin.capacityKg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Emptied:</span>
                  <span className="text-slate-300">{bin.lastEmptied}</span>
                </div>
              </div>

              <button
                onClick={() => handleEmptyBin(bin.category)}
                className="w-full py-1.5 rounded-xl bg-[#041220] hover:bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-colors mt-2"
              >
                Schedule Bin Collection
              </button>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Mechanical Chute Live Visualizer + Edge Vision Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Servo Chute Diagram */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-cyan-500/25 space-y-5">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Automated 4-Way Chute Sluice
              </h3>
              <p className="text-xs text-slate-400">ESP32 180° High-Torque Servo Diverter</p>
            </div>
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-500/30">
              {activeServoAngle}° ANGLE
            </span>
          </div>

          {/* Sluice Graphic */}
          <div className="relative h-64 w-full bg-[#041220] rounded-2xl border border-cyan-500/20 flex items-center justify-center overflow-hidden">
            {/* Compass / Degree markings */}
            <div className="absolute inset-4 rounded-full border border-dashed border-cyan-500/30 flex items-center justify-center">
              <span className="absolute top-2 text-[10px] font-mono text-emerald-400 font-bold">
                Organic (90°)
              </span>
              <span className="absolute right-3 text-[10px] font-mono text-cyan-400 font-bold">
                Plastic (0°)
              </span>
              <span className="absolute bottom-2 text-[10px] font-mono text-amber-400 font-bold">
                Non-Recycle (180°)
              </span>
              <span className="absolute left-3 text-[10px] font-mono text-purple-400 font-bold">
                Hazardous (270°)
              </span>
            </div>

            {/* Rotating Servo Pointer */}
            <motion.div
              animate={{ rotate: activeServoAngle }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              className="w-1.5 h-28 bg-gradient-to-t from-cyan-400 via-emerald-400 to-white rounded-full shadow-lg shadow-cyan-400/50 origin-bottom relative"
            >
              <div className="w-3 h-3 rounded-full bg-white absolute -top-1 -left-[3px] shadow" />
            </motion.div>

            {/* Central Servo Hub */}
            <div className="absolute w-8 h-8 rounded-full bg-[#081e36] border-2 border-cyan-400 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-cyan-300" />
            </div>
          </div>

          {/* Current Status Footer */}
          <div className="p-3.5 rounded-2xl bg-[#04111f] border border-cyan-500/20 text-xs space-y-1">
            <div className="text-slate-400">Current Divert Target:</div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{lastDivertedCategory}</span>
            </div>
          </div>
        </div>

        {/* Right: Vision Model Classification Logs */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-cyan-500/25 space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Edge Camera Object Detections
              </h3>
              <p className="text-xs text-slate-400">
                Real-time YOLOv8 classification on DRN-042 & DRN-018 intake flumes
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-500/30">
              95.8% Avg Confidence
            </span>
          </div>

          <div className="space-y-3">
            {RECENT_CLASSIFICATION_LOGS.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-[#041220] border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-300 font-bold">{log.id}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-mono text-slate-300">{log.drainId}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-400">{log.timestamp}</span>
                  </div>
                  <div className="font-bold text-white text-xs">{log.detectedObject}</div>
                  <div className="text-[11px] text-slate-400">{log.action}</div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">
                    Confidence
                  </span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {log.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
