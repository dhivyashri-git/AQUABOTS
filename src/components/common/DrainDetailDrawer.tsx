import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Radio,
  Cpu,
  Droplets,
  Trash2,
  Wind,
  Thermometer,
  ShieldAlert,
  UserCheck,
  RotateCw,
  Play,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const DrainDetailDrawer: React.FC = () => {
  const { selectedDrain, setSelectedDrain, workers, assignWorkerToDrain, simulateWasteCleaned, showToast } = useApp();
  const { role } = useAuth();
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('WRK-001');
  const [isActuating, setIsActuating] = useState(false);

  if (!selectedDrain) return null;

  const getStatusBadge = () => {
    switch (selectedDrain.status) {
      case 'critical':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
            Critical Risk
          </span>
        );
      case 'warning':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
            Warning
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Normal Flow
          </span>
        );
    }
  };

  const handleActuateMechanism = () => {
    setIsActuating(true);
    showToast({
      type: 'INFO',
      title: 'Actuating Mechanism',
      message: `ESP32 servo gate opened on ${selectedDrain.id}. Automated conveyor lifting waste.`,
    });

    setTimeout(() => {
      simulateWasteCleaned(selectedDrain.id, 24);
      setIsActuating(false);
      showToast({
        type: 'SUCCESS',
        title: 'Waste Removed',
        message: `${selectedDrain.id} cleared. Water level and flow restored.`,
      });
    }, 2500);
  };

  const handleAssignWorker = () => {
    assignWorkerToDrain(selectedDrain.id, selectedWorkerId);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedDrain(null)}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Sliding Drawer */}
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-screen max-w-md bg-[#081c34] border-l border-cyan-500/20 shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-cyan-500/15 flex items-start justify-between bg-[#06172b]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {selectedDrain.id}
                  </span>
                  {getStatusBadge()}
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                    <Radio className="w-2.5 h-2.5 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100">{selectedDrain.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Zone: {selectedDrain.zone} • Chennai Urban District</p>
              </div>
              <button
                onClick={() => setSelectedDrain(null)}
                className="text-slate-400 hover:text-slate-100 p-2 rounded-xl hover:bg-white/10 transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Telemetry Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Water Level */}
                <div className="bg-[#0c2442] p-3.5 rounded-xl border border-cyan-500/20">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                      Water Level
                    </span>
                    <span className="font-mono text-slate-200">{selectedDrain.waterLevel}%</span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedDrain.waterLevel}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full rounded-full ${
                        selectedDrain.waterLevel >= 85
                          ? 'bg-rose-500'
                          : selectedDrain.waterLevel >= 70
                          ? 'bg-amber-500'
                          : 'bg-cyan-400'
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    Sensor: Ultrasonic HC-SR04 (Waterproof)
                  </p>
                </div>

                {/* Waste Load */}
                <div className="bg-[#0c2442] p-3.5 rounded-xl border border-cyan-500/20">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5 text-amber-400" />
                      Waste Load
                    </span>
                    <span className="font-mono text-slate-200">{selectedDrain.wasteLoad}%</span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedDrain.wasteLoad}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full rounded-full ${
                        selectedDrain.wasteLoad >= 80
                          ? 'bg-rose-500'
                          : selectedDrain.wasteLoad >= 55
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    Detection: Infrared Beam Grid + Load Cell
                  </p>
                </div>

                {/* Flow Rate */}
                <div className="bg-[#0c2442] p-3.5 rounded-xl border border-cyan-500/20">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Wind className="w-3.5 h-3.5 text-blue-400" />
                    Flow Velocity
                  </div>
                  <div className="text-lg font-bold font-mono text-cyan-300">
                    {selectedDrain.flowRate} <span className="text-xs font-normal text-slate-400">m³/s</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {selectedDrain.flowRate < 1.0 ? 'Restricted / Stagnant' : 'Optimal Gravity Flow'}
                  </span>
                </div>

                {/* Temperature */}
                <div className="bg-[#0c2442] p-3.5 rounded-xl border border-cyan-500/20">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
                    Water Temp
                  </div>
                  <div className="text-lg font-bold font-mono text-emerald-300">
                    {selectedDrain.temperature}°C
                  </div>
                  <span className="text-[10px] text-slate-400">Normal Range (26-32°C)</span>
                </div>
              </div>

              {/* Hardware Node Status */}
              <div className="bg-[#0c2442]/80 p-4 rounded-xl border border-cyan-500/20 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    IoT Edge Controller
                  </span>
                  <span className="font-mono text-cyan-300 text-xs">ESP32 Dual-Core (LoRaWAN)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-purple-400" />
                    Predictive Risk Score
                  </span>
                  <span className="font-bold font-mono text-purple-300 text-xs">
                    {selectedDrain.riskScore} / 100 (ML Weighted)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Last Serviced
                  </span>
                  <span className="text-slate-300 text-xs">{selectedDrain.lastCleaned}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    Assigned Worker
                  </span>
                  <span className="text-emerald-300 font-mono text-xs">
                    {selectedDrain.assignedWorker || 'Unassigned / Auto-Dispatch'}
                  </span>
                </div>
              </div>

              {/* Automated Mechanism Control */}
              <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-[#0c2442] p-4 rounded-xl border border-cyan-500/30">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    Automated Waste Removal System
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    {selectedDrain.mechanismStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  Triggers the DC geared motor & servo gate to raise the collection mesh, lift accumulated plastics to the sorting rack, and normalize drainage culvert intake.
                </p>

                <button
                  disabled={isActuating}
                  onClick={handleActuateMechanism}
                  className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                    isActuating
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 cursor-not-allowed'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  }`}
                >
                  {isActuating ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin text-cyan-400" />
                      Lifting Mesh & Running Conveyor...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      Activate Waste Removal Mechanism
                    </>
                  )}
                </button>
              </div>

              {/* Admin Worker Dispatcher */}
              {role === 'admin' && (
                <div className="bg-[#0c2442] p-4 rounded-xl border border-cyan-500/20 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-purple-400" />
                    Dispatch Field Worker
                  </h4>
                  <div className="flex gap-2">
                    <select
                      value={selectedWorkerId}
                      onChange={(e) => setSelectedWorkerId(e.target.value)}
                      className="flex-1 bg-[#06172b] border border-cyan-500/30 text-xs rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      {workers.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.id} - {w.name} ({w.assignedZone})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssignWorker}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                    >
                      Assign Task
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-cyan-500/15 bg-[#06172b] flex justify-end">
              <button
                onClick={() => setSelectedDrain(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
              >
                Close Panel
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
