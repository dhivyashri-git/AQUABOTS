import React from 'react';
import { motion } from 'motion/react';
import { User, HardHat, Shield, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface RoleSelectorProps {
  onSelectRole: (role: 'citizen' | 'worker' | 'admin') => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl mx-auto">
      {/* Container Glass Card */}
      <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 border border-cyan-500/25 relative overflow-hidden">
        {/* Background decorative glow elements */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-12 relative z-10">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            Access Portals
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            Choose Your Role
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Login to access your customized dashboard and operational capabilities
          </p>
        </div>

        {/* 3 Animated Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
          {/* Card 1: CITIZEN (Green) */}
          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative rounded-2xl bg-gradient-to-b from-[#092419]/90 to-[#06182c]/90 border border-emerald-500/30 p-8 flex flex-col justify-between shadow-lg hover:shadow-[0_0_35px_rgba(16,185,129,0.25)] hover:border-emerald-400 transition-all"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all shadow-inner">
                <User className="w-7 h-7 text-emerald-400" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white tracking-wide">CITIZEN</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                  PUBLIC
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Report drainage issues and track updates in real-time across your neighborhood with automated status tracking.
              </p>

              <div className="space-y-2 mb-8 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Interactive nearby drains map</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Geo-tagged photo report submission</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Live 5-stage progress timeline tracking</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectRole('citizen')}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40"
            >
              <span>Citizen Login</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Card 2: WORKER (Blue) */}
          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative rounded-2xl bg-gradient-to-b from-[#08223f]/90 to-[#06182c]/90 border border-blue-500/30 p-8 flex flex-col justify-between shadow-lg hover:shadow-[0_0_35px_rgba(59,130,246,0.25)] hover:border-blue-400 transition-all"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all shadow-inner">
                <HardHat className="w-7 h-7 text-blue-400" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white tracking-wide">WORKER</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold">
                  FIELD CREW
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                View assigned tasks and update field status with 24-hour dynamic sessions and live IoT waste-removal actuation.
              </p>

              <div className="space-y-2 mb-8 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>24-Hour dynamic token session</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Live motor & servo mechanism activator</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>8-step task workflow & photo proof</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectRole('worker')}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40"
            >
              <span>Worker Login</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Card 3: ADMIN (Purple) */}
          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative rounded-2xl bg-gradient-to-b from-[#1b0e36]/90 to-[#06182c]/90 border border-purple-500/30 p-8 flex flex-col justify-between shadow-lg hover:shadow-[0_0_35px_rgba(168,85,247,0.25)] hover:border-purple-400 transition-all"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-500/30 transition-all shadow-inner">
                <Shield className="w-7 h-7 text-purple-400" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white tracking-wide">ADMIN</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold">
                  COMMAND CENTER
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Manage drainage operations and monitor the city with live telemetry, workforce dispatch, waste analytics, and ML risk models.
              </p>

              <div className="space-y-2 mb-8 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>128-Node real-time telemetry grid</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Interactive Chennai GIS map & incidents</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Predictive flood risk ML & waste segregation</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectRole('admin')}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40"
            >
              <span>Admin Login</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
