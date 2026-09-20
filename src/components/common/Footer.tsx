import React from 'react';
import { Droplets, Activity, Github, Twitter, Linkedin, ShieldCheck, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#030d17] border-t border-cyan-500/20 text-slate-400 text-xs relative overflow-hidden">
      {/* Background glow vector */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 p-[1px] flex items-center justify-center">
                <div className="w-full h-full bg-[#061A2E] rounded-[11px] flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                CityHealth <span className="text-cyan-400">FlowSense</span>
              </span>
            </div>
            <p className="text-sm font-medium text-slate-300">
              “Smart Monitoring | Intelligent Action | Sustainable Future”
            </p>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              An intelligent IoT and AI-powered drainage monitoring and waste segregation command center designed to eliminate waterlogging, prevent vector diseases, and ensure resilient flood preparedness for the Greater Chennai Corporation.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                Smart India Hackathon Prototype
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono">
                <Cpu className="w-3 h-3 text-emerald-400" />
                GCC Zone 1-15 Pilot
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Platform Architecture
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="hover:text-cyan-400 transition-colors">About CityHealth</a>
              </li>
              <li>
                <a href="#features" className="hover:text-cyan-400 transition-colors">Key Capabilities</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">7-Stage Pipeline</a>
              </li>
              <li>
                <a href="#drain-simulator" className="hover:text-cyan-400 transition-colors">Automated Mechanism Simulator</a>
              </li>
              <li>
                <a href="#technology" className="hover:text-cyan-400 transition-colors">Hardware & Edge AI Stack</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Compliance & Emergency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Emergency & Support
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 text-slate-300">
                <span className="font-semibold text-rose-400">Flood Helpline:</span> 1913 (GCC Toll-Free)
              </li>
              <li>
                <span className="text-slate-400">Disaster Management Cell: Ripon Building, Chennai</span>
              </li>
              <li>
                <a href="#terms" className="hover:text-cyan-400 transition-colors">Terms of Prototype Use</a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-cyan-400 transition-colors">Citizen Privacy & Telemetry</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-cyan-500/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500 text-center sm:text-left">
            © 2026 CityHealth FlowSense • Smart City Drainage Management Prototype • Greater Chennai Municipal Corporation
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-[11px] font-mono text-cyan-400/80">v2.4.0-PROTOTYPE</span>
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-[11px] text-slate-300">IoT Grid: 128 Nodes Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
