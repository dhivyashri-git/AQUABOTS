import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Sparkles, Droplets, Shield, Play, LogIn } from 'lucide-react';
import chennaiHeroBg from '../../assets/images/chennai_smart_city_1789896254787.jpg';

interface HeroProps {
  onOpenLogin: (role?: 'citizen' | 'worker' | 'admin') => void;
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenLogin, onExplore }) => {
  return (
    <div id="home" className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden pt-20">
      {/* Background Image: Chennai Smart City */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url(${chennaiHeroBg})`,
        }}
      />

      {/* Dark Navy Transparent Gradient Overlay for Crisp Readability */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-[#061A2E]/90 via-[#061A2E]/80 to-[#061A2E] backdrop-blur-[1.5px]" />

      {/* Subtle Animated Water Wave / Particle Gradient */}
      <div className="absolute inset-0 z-2 opacity-35 pointer-events-none mix-blend-screen overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/20 via-blue-600/10 to-transparent animate-pulse-glow" />
        
        {/* Subtle floating light particles */}
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400/40 blur-[1px]"
            style={{
              width: `${(i % 4) + 2}px`,
              height: `${(i % 4) + 2}px`,
              top: `${(i * 19) % 95}%`,
              left: `${(i * 23) % 95}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 4 + (i % 5),
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto py-12">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(34,211,238,0.2)] backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>CHENNAI SMART DRAINAGE</span>
          <span className="text-slate-500">|</span>
          <span>SIH COMMAND PROTOTYPE</span>
        </motion.div>

        {/* Large Brand Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4"
        >
          CityHealth{' '}
          <span className="bg-gradient-to-r from-[#00A8FF] via-[#22D3EE] to-[#39E58C] bg-clip-text text-transparent">
            FlowSense
          </span>
        </motion.h1>

        {/* Main Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-2xl font-bold text-slate-100 tracking-wide mb-4"
        >
          Smarter Drains • Cleaner Cities • Healthier Tomorrow
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-8"
        >
          “An intelligent IoT and AI-powered drainage management system designed to detect blockages, prevent waterlogging, automate waste removal and improve urban cleanliness across Greater Chennai.”
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onExplore}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-xl shadow-cyan-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Explore System</span>
          </button>

          <button
            onClick={() => onOpenLogin()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-[#08223f]/90 hover:bg-[#0c2f57] border border-cyan-500/40 hover:border-cyan-400 transition-all transform hover:scale-105 active:scale-95 backdrop-blur-xl flex items-center justify-center gap-2.5 shadow-lg"
          >
            <LogIn className="w-4 h-4 text-cyan-400" />
            <span>Login to Portal</span>
          </button>
        </motion.div>

        {/* Real-time stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mt-12 pt-6 border-t border-cyan-500/20"
        >
          <div className="p-3 rounded-xl bg-[#08223f]/60 backdrop-blur-md border border-cyan-500/15">
            <div className="text-2xl font-black font-mono text-cyan-300">128</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Monitored Drains</div>
          </div>
          <div className="p-3 rounded-xl bg-[#08223f]/60 backdrop-blur-md border border-cyan-500/15">
            <div className="text-2xl font-black font-mono text-emerald-300">248 kg</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Waste Lifted Today</div>
          </div>
          <div className="p-3 rounded-xl bg-[#08223f]/60 backdrop-blur-md border border-cyan-500/15">
            <div className="text-2xl font-black font-mono text-blue-300">24</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Field Workers</div>
          </div>
          <div className="p-3 rounded-xl bg-[#08223f]/60 backdrop-blur-md border border-cyan-500/15">
            <div className="text-2xl font-black font-mono text-purple-300">18 min</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Avg Response Time</div>
          </div>
        </motion.div>
      </div>

      {/* Animated Glowing Scroll Indicator */}
      <motion.button
        onClick={onExplore}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 mb-6 flex flex-col items-center gap-1.5 text-xs font-mono text-cyan-400/80 hover:text-cyan-300 transition-colors"
        aria-label="Scroll down to explore"
      >
        <span className="text-[10px] tracking-widest uppercase">Scroll Down</span>
        <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          <ArrowDown className="w-4 h-4 text-cyan-400" />
        </div>
      </motion.button>
    </div>
  );
};
