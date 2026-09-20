import React from 'react';
import { motion } from 'motion/react';
import {
  Cpu,
  Radio,
  Eye,
  Cog,
  Camera,
  Terminal,
  Brain,
  Database,
  LayoutDashboard,
  Wifi,
  Gauge,
  Sparkles,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export const TechStack: React.FC = () => {
  const hardwareStack = [
    {
      title: 'ESP32 / Arduino MCU',
      category: 'Edge Controller',
      desc: 'Dual-core 240MHz SoC with hardware interrupts, reading analogue ultrasonic head levels and driving relays.',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
    },
    {
      title: 'Ultrasonic Sensor (HC-SR04/JSN)',
      category: 'Water Level Telemetry',
      desc: 'Waterproof ultrasonic transceiver measuring water head-distance from culvert roof down to liquid surface.',
      icon: <Gauge className="w-5 h-5 text-cyan-400" />,
    },
    {
      title: 'IR Break-Beam Sensor',
      category: 'Obstruction Grid',
      desc: 'Optical infrared beam array positioned at drain entry to detect solid floating plastics and leaves.',
      icon: <Radio className="w-5 h-5 text-amber-400" />,
    },
    {
      title: 'High-Torque DC Geared Motor',
      category: 'Mechanical Conveyor',
      desc: '12V 45 RPM metal-gear motor driving the stainless-steel chain lift mesh to hoist heavy saturated waste.',
      icon: <Cog className="w-5 h-5 text-blue-400" />,
    },
    {
      title: 'High-Torque Servo Motor',
      category: 'Segregation Gate',
      desc: 'Metal-gear servo pivoting the sorting flap 90° to direct waste into appropriate category bins.',
      icon: <Cog className="w-5 h-5 text-purple-400" />,
    },
    {
      title: 'OV2640 Optical Camera Module',
      category: 'Vision Acquisition',
      desc: 'Wide-angle lens positioned above the extraction rack capturing high-clarity frames of lifted material.',
      icon: <Camera className="w-5 h-5 text-emerald-400" />,
    },
  ];

  const softwareStack = [
    {
      title: 'Python Core',
      category: 'Backend Processing',
      desc: 'Async telemetry ingestion server polling edge gateways, orchestrating ML pipeline and database writes.',
      icon: <Terminal className="w-5 h-5 text-yellow-400" />,
    },
    {
      title: 'OpenCV',
      category: 'Computer Vision',
      desc: 'Real-time image pre-processing, adaptive contour extraction, noise suppression, and bounding box cropping.',
      icon: <Eye className="w-5 h-5 text-teal-400" />,
    },
    {
      title: 'Machine Learning',
      category: 'Classification & Risk',
      desc: 'Trained convolutional neural network for solid waste segregation + gradient-boosted flood risk predictor.',
      icon: <Brain className="w-5 h-5 text-purple-400" />,
    },
    {
      title: 'PostgreSQL / Timescale DB',
      category: 'Time-Series Store',
      desc: 'High-throughput database archiving sensor telemetry every 30 seconds across 128 nodes with geo-indexing.',
      icon: <Database className="w-5 h-5 text-indigo-400" />,
    },
    {
      title: 'Web Command Dashboard',
      category: 'User Interface',
      desc: 'High-performance React & Tailwind interface with live GIS mapping, incident dispatch, and telemetry.',
      icon: <LayoutDashboard className="w-5 h-5 text-cyan-400" />,
    },
    {
      title: 'LoRaWAN / 4G IoT Gateway',
      category: 'Network Protocol',
      desc: 'Long-range ultra-low-power radio telemetry protocol ensuring reliable signals even from deep subterranean conduits.',
      icon: <Wifi className="w-5 h-5 text-emerald-400" />,
    },
  ];

  return (
    <section id="technology" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
          Hardware & Software Architecture
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
          Technology Stack
        </h2>
        <p className="text-sm text-slate-300 mt-2">
          Designed according to industrial cyber-physical systems standards with clear separation of edge actuation and cloud intelligence
        </p>
      </div>

      {/* Critical Architecture Callout Banner */}
      <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-[#082343] via-[#051930] to-[#082343] border border-cyan-500/30 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Architectural Boundary & Computational Division
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-[#041220] border border-cyan-500/20 text-slate-300">
                <span className="font-bold text-cyan-300 block mb-1">Physical Layer (Edge MCU):</span>
                “Arduino / ESP32 handles real-time sensor reading and actuator control directly at the drainage culvert with deterministic low-latency interrupts.”
              </div>
              <div className="p-3 rounded-xl bg-[#041220] border border-cyan-500/20 text-slate-300">
                <span className="font-bold text-emerald-300 block mb-1">Intelligence Layer (Software/Cloud):</span>
                “Python/ML handles image classification, analytics and prediction at the software level. Neural networks run on cloud/edge gateways, not directly on the microcontroller.”
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Components Grid */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            1. Physical Sensing & Actuation (Edge Hardware)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hardwareStack.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl bg-[#081e36]/70 border border-cyan-500/20 hover:border-cyan-400/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-[#04111f] border border-cyan-500/20">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {item.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">{item.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Software & Intelligence Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            2. Software, AI Vision & Municipal Cloud
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {softwareStack.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl bg-[#081e36]/70 border border-cyan-500/20 hover:border-cyan-400/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-[#04111f] border border-cyan-500/20">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {item.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">{item.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
