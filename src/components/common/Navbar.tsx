import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Droplets,
  Activity,
  User,
  Shield,
  HardHat,
  LogOut,
  Bell,
  Clock,
  Menu,
  X,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  onOpenLogin: (initialRole?: 'citizen' | 'worker' | 'admin') => void;
  activeSection?: string;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin, activeSection = 'home', onNavigateSection }) => {
  const { user, role, logout, workerSessionRemaining } = useAuth();
  const { notifications, markNotificationRead, clearAllNotifications } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'drain-simulator', label: 'Smart Drainage' },
    { id: 'technology', label: 'Technology' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled || role !== 'public'
          ? 'bg-[#061A2E]/90 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg shadow-cyan-950/40'
          : 'bg-gradient-to-b from-[#061A2E]/90 via-[#061A2E]/60 to-transparent backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Logo Mark: Water drop + leaf + sensor pulse */}
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00A8FF] via-[#22D3EE] to-[#39E58C] p-[1.5px] shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-400/40 transition-shadow">
            <div className="w-full h-full bg-[#061A2E] rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <Droplets className="w-5 h-5 text-cyan-400 absolute transition-transform group-hover:scale-110" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#061A2E] flex items-center justify-center">
                <Activity className="w-2 h-2 text-slate-950" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-lg font-extrabold tracking-tight text-white">CityHealth</span>
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                FlowSense
              </span>
            </div>
            <p className="text-[10px] font-mono tracking-wider text-cyan-400/80 mt-1 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              Chennai Smart Drainage
            </p>
          </div>
        </div>

        {/* Desktop Center Navigation (When in Public Landing) */}
        {role === 'public' ? (
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        ) : (
          /* Portal Status Badge when logged in */
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#08223f] border border-cyan-500/30 text-xs text-slate-200">
              {role === 'citizen' && <User className="w-4 h-4 text-emerald-400" />}
              {role === 'worker' && <HardHat className="w-4 h-4 text-blue-400" />}
              {role === 'admin' && <Shield className="w-4 h-4 text-purple-400" />}

              <span className="font-semibold capitalize text-slate-100">
                {role === 'citizen' ? 'Citizen Portal' : role === 'worker' ? 'Worker Portal' : 'Admin Command Center'}
              </span>

              {role === 'worker' && (
                <span className="ml-2 flex items-center gap-1 font-mono text-[11px] text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {workerSessionRemaining} left
                </span>
              )}
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Notification Bell (Visible when authenticated or on public) */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-cyan-500/20 bg-[#08203a]/60"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#081f3b] border border-cyan-500/30 shadow-2xl p-4 z-50 backdrop-blur-2xl text-left"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                        Live System Alerts
                      </h4>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] text-cyan-400 hover:underline"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-cyan-500/10 mt-2 space-y-2">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No active alerts at this time. All telemetry normal.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`pt-2 pb-2 px-1 cursor-pointer transition-colors ${
                            n.read ? 'opacity-60' : 'opacity-100'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-semibold">
                            <span
                              className={`${
                                n.type === 'CRITICAL'
                                  ? 'text-rose-400'
                                  : n.type === 'WARNING'
                                  ? 'text-amber-400'
                                  : n.type === 'SUCCESS'
                                  ? 'text-emerald-400'
                                  : 'text-cyan-400'
                              }`}
                            >
                              [{n.type}] {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Authentication Action */}
          {role === 'public' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenLogin('citizen')}
                className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-semibold text-cyan-300 hover:text-white hover:bg-cyan-500/10 border border-cyan-500/30 transition-colors"
              >
                Citizen Portal
              </button>
              <button
                onClick={() => onOpenLogin()}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-md shadow-cyan-500/25 transition-all transform hover:scale-105 active:scale-95"
              >
                Login
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}

          {/* Mobile menu hamburger */}
          {role === 'public' && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileMenuOpen && role === 'public' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-cyan-500/20 bg-[#061A2E]/95 backdrop-blur-xl px-4 pt-2 pb-5 space-y-2"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:text-cyan-300 hover:bg-white/5"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-cyan-500/20 grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin('citizen');
                }}
                className="py-2 text-center text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl"
              >
                Citizen
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin('worker');
                }}
                className="py-2 text-center text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl"
              >
                Worker
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin('admin');
                }}
                className="py-2 text-center text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl"
              >
                Admin
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
