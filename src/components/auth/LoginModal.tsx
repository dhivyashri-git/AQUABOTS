import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  Mail,
  User,
  Shield,
  HardHat,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'citizen' | 'worker' | 'admin';
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, defaultRole = 'citizen' }) => {
  const { loginCitizen, loginWorker, loginAdmin } = useAuth();
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'citizen' | 'worker' | 'admin'>(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [citizenEmail, setCitizenEmail] = useState('citizen@demo.com');
  const [citizenPassword, setCitizenPassword] = useState('citizen123');
  const [rememberMe, setRememberMe] = useState(true);

  const [workerUsername, setWorkerUsername] = useState('worker01');
  const [workerPassword, setWorkerPassword] = useState('worker123');

  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');

  if (!isOpen) return null;

  const handleCitizenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await loginCitizen(citizenEmail, citizenPassword);
    setLoading(false);

    if (res.success) {
      showToast({
        type: 'SUCCESS',
        title: 'Authentication Successful',
        message: 'Welcome back, Citizen! Portal loaded.',
      });
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleWorkerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await loginWorker(workerUsername, workerPassword);
    setLoading(false);

    if (res.success) {
      showToast({
        type: 'SUCCESS',
        title: 'Field Worker Verified',
        message: '24-hour dynamic session active.',
      });
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await loginAdmin(adminUsername, adminPassword);
    setLoading(false);

    if (res.success) {
      showToast({
        type: 'SUCCESS',
        title: 'Command Access Granted',
        message: 'Chennai Smart Drainage Command Center active.',
      });
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  const setDemoCredentials = (role: 'citizen' | 'worker' | 'admin') => {
    setErrorMsg(null);
    if (role === 'citizen') {
      setCitizenEmail('citizen@demo.com');
      setCitizenPassword('citizen123');
    } else if (role === 'worker') {
      setWorkerUsername('worker01');
      setWorkerPassword('worker123');
    } else {
      setAdminUsername('admin');
      setAdminPassword('admin123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg bg-[#081c34] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 text-slate-100"
      >
        {/* Top security banner */}
        <div className="bg-[#051323] px-6 py-2.5 border-b border-cyan-500/20 flex items-center justify-between text-[11px] font-mono text-cyan-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SECURE GOV-TECH GATEWAY</span>
          </div>
          <span className="text-slate-400">TLS 1.3 / GCC Auth Protocol</span>
        </div>

        {/* Header & Tabs */}
        <div className="p-6 pb-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Access Portal</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                  Prototype
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Select your designated role to enter the command interface
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-2 mt-5 bg-[#051323] p-1.5 rounded-2xl border border-cyan-500/20">
            <button
              type="button"
              onClick={() => {
                setActiveTab('citizen');
                setErrorMsg(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'citizen'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Citizen</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('worker');
                setErrorMsg(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'worker'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HardHat className="w-3.5 h-3.5 text-blue-400" />
              <span>Worker</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setErrorMsg(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'admin'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Forms Content */}
        <div className="p-6 pt-3">
          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* CITIZEN FORM */}
          {activeTab === 'citizen' && (
            <form onSubmit={handleCitizenSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Citizen Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={citizenEmail}
                    onChange={(e) => setCitizenEmail(e.target.value)}
                    placeholder="citizen@demo.com"
                    className="w-full bg-[#051323] border border-cyan-500/30 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={citizenPassword}
                    onChange={(e) => setCitizenPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#051323] border border-cyan-500/30 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-[#051323] border-cyan-500/40 text-emerald-500 focus:ring-0"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    showToast({
                      type: 'INFO',
                      title: 'Password Reset',
                      message: 'Demo credentials: citizen@demo.com / citizen123',
                    })
                  }
                  className="text-emerald-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all transform active:scale-98 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Citizen Login</span>
                  </>
                )}
              </button>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-300/90 flex items-center justify-between">
                <span>Demo: citizen@demo.com / citizen123</span>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('citizen')}
                  className="font-semibold underline hover:text-white"
                >
                  Quick Fill
                </button>
              </div>
            </form>
          )}

          {/* WORKER FORM */}
          {activeTab === 'worker' && (
            <form onSubmit={handleWorkerSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-300 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-blue-200">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>24-Hour Ephemeral Session Token</span>
                </div>
                <p className="text-[11px] text-blue-300/80 leading-relaxed">
                  Upon authentication, a secure field-worker session token (e.g. WF-WRK-XXXXXXXX) is issued and validated with a 24-hour automatic expiration.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Worker ID or Username
                </label>
                <div className="relative">
                  <HardHat className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={workerUsername}
                    onChange={(e) => setWorkerUsername(e.target.value)}
                    placeholder="worker01"
                    className="w-full bg-[#051323] border border-cyan-500/30 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-400 transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={workerPassword}
                    onChange={(e) => setWorkerPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#051323] border border-cyan-500/30 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-slate-950 shadow-lg shadow-blue-500/20 transition-all transform active:scale-98 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Generate Session & Enter Portal</span>
                  </>
                )}
              </button>

              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-[11px] text-blue-300/90 flex items-center justify-between">
                <span>Demo: worker01 / worker123</span>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('worker')}
                  className="font-semibold underline hover:text-white"
                >
                  Quick Fill
                </button>
              </div>
            </form>
          )}

          {/* ADMIN FORM */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-300">
                <div className="flex items-center gap-1.5 font-semibold text-purple-200">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>Administrative Command Level</span>
                </div>
                <p className="text-[11px] text-purple-300/80 leading-relaxed mt-1">
                  Provides unified real-time supervision across all 128 drainage nodes, incident dispatch, workforce tracking, and predictive ML models.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Admin Officer Username
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full bg-[#051323] border border-cyan-500/30 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400 transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#051323] border border-cyan-500/30 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-400 hover:to-indigo-300 text-white shadow-lg shadow-purple-500/25 transition-all transform active:scale-98 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Command Login</span>
                  </>
                )}
              </button>

              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-300/90 flex items-center justify-between">
                <span>Demo: admin / admin123</span>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('admin')}
                  className="font-semibold underline hover:text-white"
                >
                  Quick Fill
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
