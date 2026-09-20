import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Settings,
  Cpu,
  Radio,
  Sliders,
  Bell,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Cog,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HardwareSettingsView: React.FC = () => {
  const { showToast } = useApp();

  // Hardware Parameters State
  const [ultrasonicThreshold, setUltrasonicThreshold] = useState<number>(75);
  const [irSensitivity, setIrSensitivity] = useState<'low' | 'medium' | 'high'>('medium');
  const [motorDurationSec, setMotorDurationSec] = useState<number>(18);
  const [servoDeflectionDeg, setServoDeflectionDeg] = useState<number>(90);
  const [alertTriggerDelaySec, setAlertTriggerDelaySec] = useState<number>(10);

  // Toggle States
  const [autoMotorActuation, setAutoMotorActuation] = useState<boolean>(true);
  const [aiVisionClassification, setAiVisionClassification] = useState<boolean>(true);
  const [emergencySmsAlerts, setEmergencySmsAlerts] = useState<boolean>(true);
  const [lorawanGatewayConnected, setLorawanGatewayConnected] = useState<boolean>(true);

  const handleSave = () => {
    showToast({
      type: 'SUCCESS',
      title: 'Configuration Broadcast',
      message: 'New hardware thresholds synced to 128 ESP32 edge nodes over LoRaWAN.',
    });
  };

  const handleResetDefaults = () => {
    setUltrasonicThreshold(75);
    setIrSensitivity('medium');
    setMotorDurationSec(18);
    setServoDeflectionDeg(90);
    setAlertTriggerDelaySec(10);
    setAutoMotorActuation(true);
    setAiVisionClassification(true);
    setEmergencySmsAlerts(true);

    showToast({
      type: 'INFO',
      title: 'Reset to Defaults',
      message: 'Factory SIH prototype firmware profiles restored.',
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Cpu className="w-4 h-4" />
          <span>CYBER-PHYSICAL EDGE SUITE</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
          Hardware & Edge Controller Configuration
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure physical actuation parameters, optical sensitivity, and cloud broadcast relays for ESP32 microcontrollers deployed across Chennai culverts.
        </p>
      </div>

      {/* LoRaWAN & Network Status Strip */}
      <div className="p-4 rounded-2xl bg-[#05182d] border border-cyan-500/25 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>LoRaWAN Gateway Cluster (Ripon Building Node)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[11px] text-slate-400">Frequency: 865.0 - 867.0 MHz IN865 | RSSI: -74 dBm (Excellent)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            128 / 128 Nodes Synced
          </span>
        </div>
      </div>

      {/* Main Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Actuator Durations & Angles */}
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/25 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-cyan-500/20">
            <Cog className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              1. DC Motor & Servo Actuators
            </h3>
          </div>

          {/* Motor duration slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Conveyor Cycle Duration</span>
              <span className="font-mono text-cyan-300 font-bold">{motorDurationSec} seconds</span>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              value={motorDurationSec}
              onChange={(e) => setMotorDurationSec(parseInt(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800"
            />
            <p className="text-[11px] text-slate-400">
              Duration the 12V 45 RPM high-torque DC motor drives the chain-lift rake upon blockage detection.
            </p>
          </div>

          {/* Servo Angle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Servo Gate Deflection Angle</span>
              <span className="font-mono text-purple-300 font-bold">{servoDeflectionDeg}°</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[0, 90, 180].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => setServoDeflectionDeg(deg)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold border transition-colors ${
                    servoDeflectionDeg === deg
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                      : 'bg-[#041220] border-cyan-500/20 text-slate-400 hover:text-white'
                  }`}
                >
                  {deg}° ({deg === 0 ? 'Recycle' : deg === 90 ? 'Organic' : 'Other'})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Optical & Ultrasonic Sensors */}
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/25 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-cyan-500/20">
            <Radio className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              2. Sensing & Trigger Logic
            </h3>
          </div>

          {/* Ultrasonic threshold */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Ultrasonic Alert Threshold</span>
              <span className="font-mono text-amber-300 font-bold">{ultrasonicThreshold}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="95"
              value={ultrasonicThreshold}
              onChange={(e) => setUltrasonicThreshold(parseInt(e.target.value))}
              className="w-full accent-amber-400 bg-slate-800"
            />
            <p className="text-[11px] text-slate-400">
              When water head rises above this percentage of culvert clearance, an emergency warning fires.
            </p>
          </div>

          {/* IR Sensitivity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">IR Break-Beam Sensitivity</span>
              <span className="font-mono text-cyan-300 font-bold uppercase">{irSensitivity}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((sens) => (
                <button
                  key={sens}
                  type="button"
                  onClick={() => setIrSensitivity(sens)}
                  className={`py-2 rounded-xl text-xs font-bold uppercase border transition-colors ${
                    irSensitivity === sens
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-[#041220] border-cyan-500/20 text-slate-400 hover:text-white'
                  }`}
                >
                  {sens}
                </button>
              ))}
            </div>
          </div>

          {/* Alert trigger delay */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Debounce / Trigger Delay</span>
              <span className="font-mono text-emerald-300 font-bold">{alertTriggerDelaySec}s</span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              value={alertTriggerDelaySec}
              onChange={(e) => setAlertTriggerDelaySec(parseInt(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Autonomous Toggles */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/25 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
          3. Autonomous Edge Operations & Dispatch Relays
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => setAutoMotorActuation(!autoMotorActuation)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              autoMotorActuation
                ? 'bg-[#06241a] border-emerald-500/40 text-emerald-300'
                : 'bg-[#041220] border-slate-800 text-slate-400'
            }`}
          >
            <div>
              <div className="text-xs font-bold">Auto Motor Actuation</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Clears debris on sensor trigger</p>
            </div>
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                autoMotorActuation ? 'bg-emerald-400 border-emerald-300' : 'border-slate-600'
              }`}
            />
          </div>

          <div
            onClick={() => setAiVisionClassification(!aiVisionClassification)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              aiVisionClassification
                ? 'bg-[#081e3a] border-cyan-500/40 text-cyan-300'
                : 'bg-[#041220] border-slate-800 text-slate-400'
            }`}
          >
            <div>
              <div className="text-xs font-bold">AI Vision Classification</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Runs rack camera CNN model</p>
            </div>
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                aiVisionClassification ? 'bg-cyan-400 border-cyan-300' : 'border-slate-600'
              }`}
            />
          </div>

          <div
            onClick={() => setEmergencySmsAlerts(!emergencySmsAlerts)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              emergencySmsAlerts
                ? 'bg-[#210818] border-rose-500/40 text-rose-300'
                : 'bg-[#041220] border-slate-800 text-slate-400'
            }`}
          >
            <div>
              <div className="text-xs font-bold">Emergency SMS Broadcast</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Auto-alerts GCC field engineers</p>
            </div>
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                emergencySmsAlerts ? 'bg-rose-500 border-rose-400' : 'border-slate-600'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={handleResetDefaults}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-2 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore Factory Defaults</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save & Flash Over IoT Gateway</span>
        </button>
      </div>
    </div>
  );
};
