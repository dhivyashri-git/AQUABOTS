import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Cpu,
  Droplets,
  Trash2,
  Camera,
  CheckCircle2,
  ArrowRight,
  Radio,
} from 'lucide-react';

export const SmartDrainSimulator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const steps = [
    {
      title: 'Waste Inflow',
      desc: 'Floating plastics and organic debris enter stormdrain culvert with storm runoff.',
      sensor: 'Inlet Channel Active',
      activeComponent: 'water',
    },
    {
      title: 'IR Detection',
      desc: 'Infrared break-beam optical grid senses accumulated obstruction at intake grate.',
      sensor: 'IR Sensor: OBJECT_DETECTED',
      activeComponent: 'ir',
    },
    {
      title: 'Water Level Check',
      desc: 'Waterproof ultrasonic sensor calculates rising head level and drainage obstruction.',
      sensor: 'Ultrasonic: 84% HEAD_LEVEL',
      activeComponent: 'ultrasonic',
    },
    {
      title: 'Controller Trigger',
      desc: 'ESP32 IoT controller verifies telemetry and primes 12V high-torque motor driver.',
      sensor: 'ESP32: ACTUATION_SIG_SENT',
      activeComponent: 'controller',
    },
    {
      title: 'Motor & Servo Activation',
      desc: 'High-torque DC geared motor drives dual stainless chain-lift mechanism.',
      sensor: 'Motor: 12V 45 RPM ENGAGED',
      activeComponent: 'motor',
    },
    {
      title: 'Mesh Lift Cycle',
      desc: 'Curved perforated collection mesh scoops debris from water floor up into sorting rack.',
      sensor: 'Conveyor: LIFT_ACTIVE',
      activeComponent: 'mesh',
    },
    {
      title: 'Debris on Rack',
      desc: 'Extracted solid waste reaches sorting staging platform clear of water flow.',
      sensor: 'Rack Load Cell: 4.8 KG',
      activeComponent: 'rack',
    },
    {
      title: 'Camera AI Capture',
      desc: 'Overhead optical camera snaps image frame of collected waste sample.',
      sensor: 'OV2640 Camera: FRAME_CAPTURED',
      activeComponent: 'camera',
    },
    {
      title: 'AI Classification',
      desc: 'Lightweight convolutional model classifies object (e.g. PET Bottle, 96% confidence).',
      sensor: 'ML Model: RECYCLABLE_PLASTIC',
      activeComponent: 'ai',
    },
    {
      title: 'Servo Segregation',
      desc: 'Servo deflector gate sweeps waste into dedicated Recyclable Municipal Bin.',
      sensor: 'Servo: 90° DEFLECTED TO BIN #2',
      activeComponent: 'bins',
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  return (
    <section id="drain-simulator" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
          Interactive Hardware Simulation
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
          Smart Automated Drainage & Segregation Mechanism
        </h2>
        <p className="text-sm text-slate-300 mt-2">
          Real-time physical sequence from storm water inflow to sensor detection, automated conveyor lift, and AI segregation
        </p>
      </div>

      {/* Main Simulator Card */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-cyan-500/30 overflow-hidden relative">
        {/* Controls Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
            </span>
            <div>
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </span>
              <p className="text-xs text-slate-400 mt-0.5">{steps[currentStep].desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Loop' : 'Auto Play'}</span>
            </button>
            <button
              onClick={() => setCurrentStep(0)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Reset to Step 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Schematic Stage */}
        <div className="my-8 relative rounded-2xl bg-[#04111f] border border-cyan-500/25 p-4 sm:p-8 overflow-hidden min-h-[360px] flex flex-col justify-between">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#08203d_1px,transparent_1px),linear-gradient(to_bottom,#08203d_1px,transparent_1px)] bg-[size:24px_24px] opacity-25" />

          {/* Top Sensor Cluster Diagram */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {/* Ultrasonic Sensor Indicator */}
            <div
              className={`p-3 rounded-xl border transition-all ${
                steps[currentStep].activeComponent === 'ultrasonic'
                  ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                  : 'bg-[#06182c]/80 border-cyan-500/10 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  Ultrasonic HC-SR04
                </span>
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>
              <p className="text-[10px] font-mono text-cyan-300 mt-1">Echo: 18cm (84% Head)</p>
            </div>

            {/* IR Beam Sensor */}
            <div
              className={`p-3 rounded-xl border transition-all ${
                steps[currentStep].activeComponent === 'ir'
                  ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-[#06182c]/80 border-cyan-500/10 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-amber-400" />
                  IR Beam Sensor
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
              <p className="text-[10px] font-mono text-amber-300 mt-1">Beam: Interrupted</p>
            </div>

            {/* ESP32 Controller */}
            <div
              className={`p-3 rounded-xl border transition-all ${
                steps[currentStep].activeComponent === 'controller'
                  ? 'bg-purple-500/20 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-[#06182c]/80 border-cyan-500/10 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  ESP32 Microcontroller
                </span>
                <span className="w-2 h-2 rounded-full bg-purple-400" />
              </div>
              <p className="text-[10px] font-mono text-purple-300 mt-1">State: Actuate Motor</p>
            </div>

            {/* Camera & ML */}
            <div
              className={`p-3 rounded-xl border transition-all ${
                steps[currentStep].activeComponent === 'camera' || steps[currentStep].activeComponent === 'ai'
                  ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-[#06182c]/80 border-cyan-500/10 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  AI Vision & Servo
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[10px] font-mono text-emerald-300 mt-1">Classification: PET Bottle</p>
            </div>
          </div>

          {/* SVG Animated Drainage Cross-Section */}
          <div className="relative z-10 w-full h-56 rounded-xl bg-[#030d17] border border-cyan-500/20 overflow-hidden flex items-center justify-center">
            <svg
              className="w-full h-full"
              viewBox="0 0 800 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Drain Culvert Walls */}
              <path
                d="M 50 40 L 50 200 L 450 200 L 550 90 L 750 90"
                stroke="#1e3a5f"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 50 120 L 300 120"
                stroke="#162c46"
                strokeWidth="3"
                strokeDasharray="4 4"
              />

              {/* Water Body */}
              <path
                d="M 50 130 Q 150 125, 250 130 T 450 130 L 450 196 L 50 196 Z"
                fill="url(#waterGradient)"
                opacity="0.75"
              />

              {/* Ultrasonic Beam Line */}
              <line
                x1="220"
                y1="40"
                x2="220"
                y2="130"
                stroke={steps[currentStep].activeComponent === 'ultrasonic' ? '#22D3EE' : '#1e3a5f'}
                strokeWidth="2"
                strokeDasharray="4 3"
                className={steps[currentStep].activeComponent === 'ultrasonic' ? 'animate-pulse' : ''}
              />
              <circle cx="220" cy="40" r="6" fill="#22D3EE" />

              {/* IR Beam Line */}
              <line
                x1="320"
                y1="90"
                x2="320"
                y2="180"
                stroke={steps[currentStep].activeComponent === 'ir' ? '#F59E0B' : '#1e3a5f'}
                strokeWidth="2"
                strokeDasharray="2 2"
                className={steps[currentStep].activeComponent === 'ir' ? 'animate-pulse' : ''}
              />

              {/* Collection Mesh / Conveyor Belt */}
              <motion.g
                animate={{
                  y:
                    steps[currentStep].activeComponent === 'mesh' ||
                    steps[currentStep].activeComponent === 'motor' ||
                    steps[currentStep].activeComponent === 'rack'
                      ? -25
                      : 0,
                }}
                transition={{ duration: 1 }}
              >
                <path
                  d="M 380 185 L 480 95 L 510 95"
                  stroke="#38bdf8"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* Mesh Grate Teeth */}
                <line x1="380" y1="185" x2="385" y2="165" stroke="#38bdf8" strokeWidth="4" />
                <line x1="410" y1="155" x2="415" y2="135" stroke="#38bdf8" strokeWidth="4" />
                <line x1="440" y1="125" x2="445" y2="105" stroke="#38bdf8" strokeWidth="4" />
              </motion.g>

              {/* DC Motor representation */}
              <circle cx="480" cy="85" r="14" fill="#0f2b48" stroke="#38bdf8" strokeWidth="3" />
              <text x="480" y="89" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                M
              </text>

              {/* Waste Floating -> Lifting -> Sorting */}
              <motion.g
                animate={{
                  x:
                    currentStep === 0
                      ? 0
                      : currentStep === 1
                      ? 80
                      : currentStep >= 2 && currentStep <= 4
                      ? 180
                      : currentStep === 5
                      ? 270
                      : currentStep >= 6 && currentStep <= 8
                      ? 340
                      : 420,
                  y:
                    currentStep >= 5 && currentStep <= 8
                      ? -55
                      : currentStep >= 9
                      ? -35
                      : 0,
                }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                {/* Plastic Bottle graphic */}
                <rect x="120" y="140" width="26" height="12" rx="4" fill="#F43F5E" opacity="0.9" />
                <rect x="146" y="143" width="5" height="6" rx="1" fill="#FFFFFF" />
                {/* Leaves graphic */}
                <circle cx="112" cy="148" r="6" fill="#10B981" />
              </motion.g>

              {/* Overhead Camera representation */}
              <rect x="520" y="30" width="30" height="20" rx="4" fill="#1e293b" stroke="#10B981" strokeWidth="2" />
              <circle cx="535" cy="40" r="5" fill="#10B981" />
              {/* Camera Field of View */}
              <polygon
                points="535,50 490,110 580,110"
                fill="#10B981"
                opacity={steps[currentStep].activeComponent === 'camera' ? 0.25 : 0.05}
              />

              {/* Segregation Bins */}
              {/* Bin 1: Organic */}
              <rect x="630" y="120" width="45" height="65" rx="6" fill="#064e3b" stroke="#10B981" strokeWidth="2" />
              <text x="652" y="155" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontWeight="bold">
                ORGANIC
              </text>

              {/* Bin 2: Recyclable */}
              <rect x="695" y="120" width="45" height="65" rx="6" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
              <text x="717" y="155" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="bold">
                RECYCLE
              </text>

              {/* Servo Deflector Arm */}
              <motion.line
                x1="570"
                y1="90"
                x2="615"
                y2="90"
                stroke="#A855F7"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{
                  rotate: currentStep >= 9 ? 35 : 0,
                }}
                transition={{ duration: 0.5 }}
                style={{ originX: '570px', originY: '90px' }}
              />

              {/* Water Gradient Defs */}
              <defs>
                <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284C7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#082f49" stopOpacity="0.95" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Current Live Status Banner */}
          <div className="relative z-10 mt-4 p-3 rounded-xl bg-[#08223f] border border-cyan-500/25 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Current Sensor Signal:</span>
              <span className="font-mono text-cyan-300 font-bold">{steps[currentStep].sensor}</span>
            </span>

            <span className="text-[11px] text-emerald-400 font-mono bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Auto-Sequencing Active
            </span>
          </div>
        </div>

        {/* Step Progression Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep(idx);
              }}
              className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                currentStep === idx
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                  : 'bg-[#06182c]/60 border-cyan-500/10 text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <div className="text-[10px] font-mono text-cyan-400 font-semibold mb-0.5">
                0{idx + 1}
              </div>
              <div className="font-bold truncate">{s.title}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
