import React from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Trash2,
  Cpu,
  Bell,
  HardHat,
  MessageSquare,
  BarChart3,
  ShieldAlert,
  Search,
  Layers,
  ArrowUpRight,
  Filter,
  CheckCircle,
  Archive,
  Eye,
  Radio,
} from 'lucide-react';

export const PublicSections: React.FC = () => {
  const features = [
    {
      icon: <Activity className="w-6 h-6 text-cyan-400" />,
      title: 'Real-Time Telemetry',
      desc: 'Continuous ultrasonic water level and flow-rate monitoring across 128 Chennai drainage nodes.',
      tag: 'IoT Mesh',
    },
    {
      icon: <Trash2 className="w-6 h-6 text-emerald-400" />,
      title: 'Automatic Waste Removal',
      desc: 'Motorized stainless-steel rake conveyor lifts plastics and debris immediately upon detection.',
      tag: 'Actuation',
    },
    {
      icon: <Cpu className="w-6 h-6 text-purple-400" />,
      title: 'AI Waste Classification',
      desc: 'Edge camera classification identifying PET plastics, organic mass, and municipal recyclables.',
      tag: 'Computer Vision',
    },
    {
      icon: <Bell className="w-6 h-6 text-rose-400" />,
      title: 'Smart Instant Alerts',
      desc: 'Threshold-triggered warnings broadcasted to zonal disaster management desks before waterlogging occurs.',
      tag: 'Proactive',
    },
    {
      icon: <HardHat className="w-6 h-6 text-blue-400" />,
      title: 'Worker Task Management',
      desc: '24-hour dynamic session workflow with geo-navigation, status steps, and photo proof verification.',
      tag: 'Field Operations',
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-teal-400" />,
      title: 'Citizen Geo-Reporting',
      desc: 'Public portal for snapping localized blockage issues, auto-generating CH tracking tickets.',
      tag: 'Civic Engagement',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-amber-400" />,
      title: 'Drainage Analytics',
      desc: 'Comprehensive multi-day trends for water head, waste volume, and average cleaning response time.',
      tag: 'Analytics',
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-indigo-400" />,
      title: 'Predictive Risk Monitoring',
      desc: 'ML regression model calculating blockage probability using runoff, rainfall, and historical sediment.',
      tag: 'Risk Engine',
    },
  ];

  const workflowStages = [
    { stage: 'DETECT', label: 'IR & Ultrasonic Sensing', desc: 'Continuous head-level and object detection' },
    { stage: 'COLLECT', label: 'Conveyor Engagement', desc: 'Geared motor drives angled collection mesh' },
    { stage: 'LIFT', label: 'Mechanical Elevation', desc: 'Waste lifted out of water flow to top rack' },
    { stage: 'SEGREGATE', label: 'AI Vision Classification', desc: 'Camera + ML identifies material composition' },
    { stage: 'STORE', label: 'Automated Bin Deposit', desc: 'Servo deflector sorts into municipal bins' },
    { stage: 'ALERT', label: 'Cloud Notification', desc: 'Command Center & field crew notified' },
    { stage: 'MONITOR', label: 'Feedback Loop', desc: 'Sensor validates normalized gravity flow' },
  ];

  return (
    <div className="space-y-24 py-10 relative z-10">
      {/* ABOUT CITYHEALTH SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-14 border border-cyan-500/20 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                About CityHealth FlowSense
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Transforming Urban Drainage from Reactive Cleaning to Proactive Intelligence
              </h2>
              <blockquote className="text-base sm:text-lg text-cyan-200/90 font-medium italic border-l-2 border-cyan-400 pl-4 py-1">
                “Urban drainage systems are often cleaned only after severe blockage or waterlogging occurs. CityHealth FlowSense changes this approach by continuously monitoring drainage conditions and automatically responding to detected waste and rising water levels.”
              </blockquote>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
                In monsoon-prone coastal metropolises like Chennai, storm drains frequently choke due to single-use plastics, silt accumulation, and organic leaves at bridge culverts and canal outfalls. CityHealth FlowSense bridges edge IoT hardware with centralized municipal command to prevent urban paralysis, preserve public health, and safeguard low-lying areas like Velachery and Anna Nagar.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#08223f]/80 border border-cyan-500/20">
                <div className="text-3xl font-extrabold font-mono text-cyan-300">128+</div>
                <div className="text-xs font-semibold text-slate-200 mt-1">Smart Culverts</div>
                <p className="text-[11px] text-slate-400 mt-1">Instrumented with LoRaWAN & ESP32 telemetry nodes.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#08223f]/80 border border-cyan-500/20">
                <div className="text-3xl font-extrabold font-mono text-emerald-300">&lt; 18 min</div>
                <div className="text-xs font-semibold text-slate-200 mt-1">Automated Action</div>
                <p className="text-[11px] text-slate-400 mt-1">Direct mechanical actuation with zero human delay.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#08223f]/80 border border-cyan-500/20">
                <div className="text-3xl font-extrabold font-mono text-purple-300">94.2%</div>
                <div className="text-xs font-semibold text-slate-200 mt-1">Segregation Accuracy</div>
                <p className="text-[11px] text-slate-400 mt-1">Machine learning vision classifying waste on rack.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#08223f]/80 border border-cyan-500/20">
                <div className="text-3xl font-extrabold font-mono text-amber-300">9 Zones</div>
                <div className="text-xs font-semibold text-slate-200 mt-1">GCC City Coverage</div>
                <p className="text-[11px] text-slate-400 mt-1">From Anna Nagar and T. Nagar to Tambaram.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 CORE FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            System Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            End-to-End Smart City Drainage Management
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Integrated architecture combining hardware sensors, mechanical extraction, AI vision, and civic participation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl bg-[#081e36]/80 border border-cyan-500/20 hover:border-cyan-400/50 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-[#04111f] border border-cyan-500/20 shadow-inner">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{feat.desc}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-cyan-500/10 flex items-center justify-between text-[11px] text-cyan-400 font-medium">
                <span>Production Prototype</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION (Animated Horizontal Flow) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-cyan-500/25">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              Workflow Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
              How It Works: 7-Stage Pipeline
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              From physical debris entrapment to automated classification and municipal feedback
            </p>
          </div>

          {/* Horizontal / Wrapped Process Chain */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 relative">
            {workflowStages.map((st, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative p-4 rounded-2xl bg-[#051528] border border-cyan-500/20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">0{i + 1}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </div>
                  <h4 className="text-xs font-black tracking-wider text-white uppercase mb-1">
                    {st.stage}
                  </h4>
                  <div className="text-[11px] font-semibold text-cyan-300 mb-1 leading-tight">
                    {st.label}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">{st.desc}</p>
                </div>

                {i < workflowStages.length - 1 && (
                  <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-20">
                    <div className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-md">
                      →
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
