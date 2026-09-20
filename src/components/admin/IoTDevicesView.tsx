import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Cpu,
  Radio,
  Wifi,
  Battery,
  AlertTriangle,
  RefreshCw,
  Sliders,
  CheckCircle2,
  XCircle,
  Eye,
  Camera,
  Activity,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DeviceItem {
  id: string;
  name: string;
  drainId: string;
  location: string;
  status: 'ONLINE' | 'STANDBY' | 'FAULT' | 'OFFLINE';
  battery: number;
  signalStrength: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  firmware: string;
  lastSync: string;
  sensors: {
    name: string;
    type: string;
    status: 'HEALTHY' | 'WARNING' | 'FAULT';
    val: string;
  }[];
}

const INITIAL_DEVICES: DeviceItem[] = [
  {
    id: 'ESP32-DRN-042',
    name: 'Anna Nagar Trunk Sluice Gateway',
    drainId: 'DRN-042',
    location: 'Anna Nagar 2nd Ave',
    status: 'ONLINE',
    battery: 88,
    signalStrength: 'EXCELLENT',
    firmware: 'v3.4.1-SIH',
    lastSync: '6 sec ago',
    sensors: [
      { name: 'HC-SR04 Ultrasonic', type: 'Water Level', status: 'HEALTHY', val: '87% Full' },
      { name: 'YF-S201 Flowmeter', type: 'Velocity', status: 'HEALTHY', val: '0.9 m³/s' },
      { name: 'OV2640 AI Camera', type: 'Waste Vision', status: 'HEALTHY', val: 'Active Stream' },
      { name: 'IR Beam Interrupter', type: 'Debris Rake', status: 'WARNING', val: 'Partial Jam' },
    ],
  },
  {
    id: 'ESP32-DRN-018',
    name: 'Velachery Sluice Gate Gateway',
    drainId: 'DRN-018',
    location: 'Velachery Bypass Sluice',
    status: 'ONLINE',
    battery: 94,
    signalStrength: 'GOOD',
    firmware: 'v3.4.1-SIH',
    lastSync: '12 sec ago',
    sensors: [
      { name: 'JSN-SR04T Waterproof', type: 'Water Level', status: 'HEALTHY', val: '76% Full' },
      { name: 'Hall Effect Flowmeter', type: 'Velocity', status: 'HEALTHY', val: '1.4 m³/s' },
      { name: 'Relay Actuator 4-Ch', type: 'Motor Relay', status: 'HEALTHY', val: 'Ready' },
      { name: 'DS18B20 Temp Probe', type: 'Water Temp', status: 'HEALTHY', val: '29.5°C' },
    ],
  },
  {
    id: 'ESP32-DRN-021',
    name: 'T. Nagar Commercial Storm Conduit',
    drainId: 'DRN-021',
    location: 'Pondy Bazaar Link',
    status: 'ONLINE',
    battery: 82,
    signalStrength: 'GOOD',
    firmware: 'v3.3.8',
    lastSync: '18 sec ago',
    sensors: [
      { name: 'HC-SR04 Ultrasonic', type: 'Water Level', status: 'HEALTHY', val: '44% Normal' },
      { name: 'YF-S201 Flowmeter', type: 'Velocity', status: 'HEALTHY', val: '2.8 m³/s' },
      { name: 'Servo MG996R', type: 'Trash Gate', status: 'HEALTHY', val: 'Locked 0°' },
    ],
  },
  {
    id: 'ESP32-DRN-005',
    name: 'Guindy Industrial Outfall Station',
    drainId: 'DRN-005',
    location: 'SIDCO Industrial Channel',
    status: 'ONLINE',
    battery: 76,
    signalStrength: 'EXCELLENT',
    firmware: 'v3.4.1-SIH',
    lastSync: '4 sec ago',
    sensors: [
      { name: 'JSN-SR04T Ultrasonic', type: 'Water Level', status: 'HEALTHY', val: '62% Normal' },
      { name: 'Turbidity Sensor v1.0', type: 'Water Clarity', status: 'WARNING', val: 'High NTU' },
      { name: 'Solar MPPT Charger', type: 'Power Inverter', status: 'HEALTHY', val: 'Charging 14.2V' },
    ],
  },
];

export const IoTDevicesView: React.FC = () => {
  const { showToast } = useApp();
  const [devices, setDevices] = useState<DeviceItem[]>(INITIAL_DEVICES);

  const handleSimulateOffline = (devId: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === devId
          ? {
              ...d,
              status: d.status === 'OFFLINE' ? 'ONLINE' : 'OFFLINE',
              lastSync: d.status === 'OFFLINE' ? 'Just now' : 'Failed 2m ago',
            }
          : d
      )
    );

    const dev = devices.find((d) => d.id === devId);
    if (dev?.status !== 'OFFLINE') {
      showToast({
        type: 'CRITICAL',
        title: 'IoT Gateway Disconnected',
        message: `Heartbeat lost on ${devId} (${dev?.location}). Incident ticket created.`,
      });
    } else {
      showToast({
        type: 'SUCCESS',
        title: 'IoT Gateway Reconnected',
        message: `Telemetry link re-established for ${devId}. LoRaWAN RSSI -72dBm.`,
      });
    }
  };

  const handlePingAll = () => {
    showToast({
      type: 'INFO',
      title: 'Broadcast Ping Sent',
      message: 'Queried 128 distributed ESP32 nodes over LoRaWAN mesh. All 128 responded.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              Edge Computing & Sensor Telemetry
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">IoT Node & Gateway Grid</h2>
          <p className="text-xs text-slate-300 mt-1">
            Monitoring distributed ESP32 microcontrollers, ultrasonic depth transceivers, and automated relays.
          </p>
        </div>

        <button
          onClick={handlePingAll}
          className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Broadcast Health Ping</span>
        </button>
      </div>

      {/* Grid of Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {devices.map((device) => {
          const isOffline = device.status === 'OFFLINE';

          return (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-panel p-6 rounded-3xl border transition-all ${
                isOffline
                  ? 'border-rose-500/40 bg-rose-950/20 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                  : 'border-cyan-500/20 hover:border-cyan-400/40'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-cyan-500/15">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      isOffline
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    }`}
                  >
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{device.name}</h3>
                    <div className="text-[11px] text-cyan-300 font-mono flex items-center gap-2 mt-0.5">
                      <span>{device.id}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300">{device.location}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                    isOffline
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {device.status}
                </span>
              </div>

              {/* Status Specs Strip */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2.5 rounded-2xl bg-[#041222] border border-cyan-500/15">
                  <span className="text-[10px] text-slate-400 font-mono block">Battery</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono flex items-center justify-center gap-1 mt-0.5">
                    <Battery className="w-3.5 h-3.5" />
                    {device.battery}%
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#041222] border border-cyan-500/15">
                  <span className="text-[10px] text-slate-400 font-mono block">Signal</span>
                  <span className="text-xs font-bold text-cyan-300 font-mono flex items-center justify-center gap-1 mt-0.5">
                    <Wifi className="w-3.5 h-3.5" />
                    {device.signalStrength}
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#041222] border border-cyan-500/15">
                  <span className="text-[10px] text-slate-400 font-mono block">Last Sync</span>
                  <span className="text-xs font-bold text-slate-200 font-mono mt-0.5 block">
                    {device.lastSync}
                  </span>
                </div>
              </div>

              {/* Attached Sensor Probes */}
              <div className="mt-4 pt-3 border-t border-cyan-500/15">
                <div className="text-[11px] font-bold text-slate-300 font-mono uppercase tracking-wider mb-2">
                  Connected Sensor Modules:
                </div>
                <div className="space-y-1.5">
                  {device.sensors.map((sensor, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-[#041222] border border-cyan-500/10 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-white">{sensor.name}</span>
                        <span className="text-[10px] text-slate-400 ml-2 font-mono">({sensor.type})</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-cyan-300">{sensor.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-cyan-500/15 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">Firmware: {device.firmware}</span>
                <button
                  onClick={() => handleSimulateOffline(device.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    isOffline
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-rose-950/40 text-rose-300 border-rose-500/30 hover:bg-rose-900/60'
                  }`}
                >
                  {isOffline ? 'Restore Gateway' : 'Simulate Failure'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
