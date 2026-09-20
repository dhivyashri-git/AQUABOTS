import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sliders,
  Mail,
  Smartphone,
  MessageSquare,
  Shield,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminNotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, clearAllNotifications, showToast } = useApp();

  const [channels, setChannels] = useState({
    dashboard: true,
    email: true,
    sms: true,
    push: true,
  });

  const [toggles, setToggles] = useState({
    criticalAlerts: true,
    workerAssignment: true,
    motorFailure: true,
    sensorFailure: true,
    floodRisk: true,
    citizenReports: true,
    binFull: true,
    maintenance: true,
  });

  const handleToggleChannel = (key: keyof typeof channels) => {
    setChannels((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      showToast({
        type: 'INFO',
        title: 'Channel Updated',
        message: `${key.toUpperCase()} notification channel is now ${next[key] ? 'ENABLED' : 'DISABLED'}.`,
      });
      return next;
    });
  };

  const handleToggleAlert = (key: keyof typeof toggles) => {
    setToggles((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      showToast({
        type: 'INFO',
        title: 'Rule Updated',
        message: `Alert trigger for ${key} updated.`,
      });
      return next;
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
              Alert Rules & Dispatch Channels
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">Notification Center</h2>
          <p className="text-xs text-slate-300 mt-1">
            Configure automated broadcast rules, emergency sirens, SMS dispatch to field crews, and webhooks.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Notifications</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Notification Stream */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-cyan-500/20">
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">Live Alert Log</h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                {notifications.length} Total
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Click to acknowledge</span>
          </div>

          <div className="divide-y divide-cyan-500/10 mt-4 max-h-[500px] overflow-y-auto pr-1 space-y-2">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No active notifications. System operating normally.
              </div>
            ) : (
              notifications.map((n) => {
                const isCrit = n.type === 'CRITICAL';
                const isWarn = n.type === 'WARNING';

                return (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all ${
                      n.read
                        ? 'opacity-60 bg-[#041222]/40 hover:opacity-100'
                        : 'bg-[#041222] border border-cyan-500/20 hover:border-cyan-400/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          isCrit
                            ? 'text-rose-400'
                            : isWarn
                            ? 'text-amber-400'
                            : 'text-cyan-300'
                        }`}
                      >
                        [{n.type}] {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-200 mt-1 leading-relaxed">{n.message}</p>
                    {n.drainId && (
                      <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                        Node: {n.drainId}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Col: Channels & Toggles */}
        <div className="space-y-6">
          {/* Dispatch Channels */}
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-4 flex items-center gap-2 font-mono">
              <Radio className="w-3.5 h-3.5" />
              <span>Broadcast Channels</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div
                onClick={() => handleToggleChannel('dashboard')}
                className="p-3 rounded-2xl bg-[#041222] border border-cyan-500/15 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-white">Dashboard Bell</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    channels.dashboard
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {channels.dashboard ? 'ACTIVE' : 'MUTED'}
                </span>
              </div>

              <div
                onClick={() => handleToggleChannel('sms')}
                className="p-3 rounded-2xl bg-[#041222] border border-cyan-500/15 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">SMS to Field Workers</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    channels.sms
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {channels.sms ? 'ACTIVE' : 'MUTED'}
                </span>
              </div>

              <div
                onClick={() => handleToggleChannel('email')}
                className="p-3 rounded-2xl bg-[#041222] border border-cyan-500/15 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-white">GCC Officer Email Digest</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    channels.email
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {channels.email ? 'ACTIVE' : 'MUTED'}
                </span>
              </div>

              <div
                onClick={() => handleToggleChannel('push')}
                className="p-3 rounded-2xl bg-[#041222] border border-cyan-500/15 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-white">Mobile Push Notifications</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    channels.push
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {channels.push ? 'ACTIVE' : 'MUTED'}
                </span>
              </div>
            </div>
          </div>

          {/* Trigger Rules */}
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3 flex items-center gap-2 font-mono">
              <Sliders className="w-3.5 h-3.5" />
              <span>Notification Triggers</span>
            </h4>

            <div className="space-y-2 text-xs">
              {Object.entries(toggles).map(([key, val]) => (
                <div
                  key={key}
                  onClick={() => handleToggleAlert(key as any)}
                  className="p-2.5 rounded-xl bg-[#041222] border border-cyan-500/10 flex items-center justify-between cursor-pointer"
                >
                  <span className="text-slate-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span
                    className={`w-3 h-3 rounded-full ${
                      val ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
