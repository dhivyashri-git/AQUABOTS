import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Radio,
  ListFilter,
  MapPin,
  AlertTriangle,
  Brain,
  Cog,
  FileText,
  HardHat,
  Cpu,
  Bell,
  Settings,
  Shield,
  Search,
  Sparkles,
  LogOut,
  X,
  Play,
  Menu,
  ChevronRight,
  Droplets,
  RotateCw,
  Power,
  AlertOctagon,
  Wrench,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { CommandOverview } from '../components/admin/CommandOverview';
import { LiveMonitoringView } from '../components/admin/LiveMonitoringView';
import { DrainTable } from '../components/admin/DrainTable';
import { ChennaiMap } from '../components/map/ChennaiMap';
import { IncidentsView } from '../components/admin/IncidentsView';
import { MLInsightsView } from '../components/admin/MLInsightsView';
import { MotorControlView } from '../components/admin/MotorControlView';
import { AdminReportsView } from '../components/admin/AdminReportsView';
import { WorkersView } from '../components/admin/WorkersView';
import { IoTDevicesView } from '../components/admin/IoTDevicesView';
import { AdminNotificationsView } from '../components/admin/AdminNotificationsView';
import { HardwareSettingsView } from '../components/admin/HardwareSettingsView';
import { DrainPoint } from '../types';

type AdminTab =
  | 'command_center'
  | 'live_monitoring'
  | 'drainage_monitoring'
  | 'chennai_map'
  | 'alerts_incidents'
  | 'ai_prediction'
  | 'motor_control'
  | 'reports'
  | 'workers'
  | 'iot_devices'
  | 'notifications'
  | 'settings';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    drains,
    selectedDrain,
    setSelectedDrain,
    updateDrainMetrics,
    showToast,
    notifications,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('command_center');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [drainDrawerOpen, setDrainDrawerOpen] = useState(false);
  const [inspectingDrain, setInspectingDrain] = useState<DrainPoint | null>(null);

  const sidebarItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'command_center', label: 'COMMAND CENTER', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'live_monitoring', label: 'LIVE MONITORING', icon: <Radio className="w-4 h-4" /> },
    { id: 'drainage_monitoring', label: 'DRAINAGE MONITORING', icon: <ListFilter className="w-4 h-4" /> },
    { id: 'chennai_map', label: 'CHENNAI MAP', icon: <MapPin className="w-4 h-4" /> },
    { id: 'alerts_incidents', label: 'ALERTS & INCIDENTS', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'ai_prediction', label: 'AI PREDICTION', icon: <Brain className="w-4 h-4" /> },
    { id: 'motor_control', label: 'MOTOR CONTROL', icon: <Cog className="w-4 h-4" /> },
    { id: 'reports', label: 'REPORTS', icon: <FileText className="w-4 h-4" /> },
    { id: 'workers', label: 'WORKERS', icon: <HardHat className="w-4 h-4" /> },
    { id: 'iot_devices', label: 'IoT DEVICES', icon: <Cpu className="w-4 h-4" /> },
    { id: 'notifications', label: 'NOTIFICATIONS', icon: <Bell className="w-4 h-4" /> },
    { id: 'settings', label: 'SETTINGS', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleInspect = (drain: DrainPoint) => {
    setInspectingDrain(drain);
    setSelectedDrain(drain);
    setDrainDrawerOpen(true);
  };

  const handleSimulateCriticalDrain = () => {
    const targetDrain = drains.find((d) => d.id === 'DRN-042') || drains[0];
    updateDrainMetrics(targetDrain.id, {
      waterLevel: 92,
      wasteLoad: 88,
      status: 'critical',
      riskScore: 94,
    });

    showToast({
      type: 'CRITICAL',
      title: 'CRITICAL FLOOD RISK DETECTED',
      message: `${targetDrain.name} reached 92% capacity! Alert dispatched to Command Room & Field Workers.`,
    });

    // Switch to Alerts & Incidents or Map
    setActiveTab('alerts_incidents');
  };

  return (
    <div className="min-h-screen bg-[#041120] text-slate-100 flex flex-col md:flex-row">
      {/* LEFT SIDEBAR (Permanent Desktop, Drawer Mobile) */}
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed md:sticky top-0 h-screen w-64 lg:w-72 bg-[#06182c] border-r border-cyan-500/20 flex flex-col justify-between z-50 transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-5 border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <div className="w-full h-full bg-[#061A2E] rounded-[14px] flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  <span>FlowSense</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
                    ADMIN
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400 font-mono">GCC Command Center</p>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-none">
            {sidebarItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold tracking-wide transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info & Quick Logout */}
        <div className="p-4 border-t border-cyan-500/20 bg-[#041222]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white truncate w-32">Dr. C. Jayaprakash</div>
                <div className="text-[10px] text-slate-400 font-mono">Special Officer (IAS)</div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-xl text-rose-400 hover:text-white hover:bg-rose-950/50 transition-colors"
              title="Logout from Command Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#06182c]/90 backdrop-blur-xl border-b border-cyan-500/20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  Command Room
                </span>
                <span className="text-slate-600">/</span>
                <span className="text-xs font-bold text-cyan-300 uppercase">
                  {activeTab.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* DEMO TRIGGER: Simulate Critical Drain */}
            <button
              onClick={handleSimulateCriticalDrain}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(244,63,94,0.25)]"
              title="Demonstrate SIH flood threshold alert workflow"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="hidden sm:inline">Demo:</span>
              <span>Simulate Critical Drain</span>
            </button>

            {/* Quick Live Status */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-[#041222] border border-cyan-500/20 text-xs font-mono text-slate-300">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>128 Drains Online</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'command_center' && (
            <CommandOverview
              onInspect={handleInspect}
              onNavigateToMap={() => setActiveTab('chennai_map')}
              onNavigateToIncidents={() => setActiveTab('alerts_incidents')}
              onNavigateToWorkers={() => setActiveTab('workers')}
            />
          )}

          {activeTab === 'live_monitoring' && <LiveMonitoringView onInspect={handleInspect} />}

          {activeTab === 'drainage_monitoring' && (
            <DrainTable
              onInspect={handleInspect}
              onAssignWorker={(drain) => {
                setInspectingDrain(drain);
                setDrainDrawerOpen(true);
              }}
            />
          )}

          {activeTab === 'chennai_map' && (
            <div className="space-y-4">
              <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Interactive Chennai GIS Grid</h3>
                  <p className="text-xs text-slate-300">
                    Real-time OpenStreetMap / CartoDB tiles with automated drain node markers.
                  </p>
                </div>
              </div>
              <ChennaiMap onSelectDrain={handleInspect} roleMode="admin" />
            </div>
          )}

          {activeTab === 'alerts_incidents' && <IncidentsView />}

          {activeTab === 'ai_prediction' && <MLInsightsView />}

          {activeTab === 'motor_control' && <MotorControlView />}

          {activeTab === 'reports' && <AdminReportsView />}

          {activeTab === 'workers' && <WorkersView />}

          {activeTab === 'iot_devices' && <IoTDevicesView />}

          {activeTab === 'notifications' && <AdminNotificationsView />}

          {activeTab === 'settings' && <HardwareSettingsView />}
        </div>
      </main>

      {/* Drain Inspection Side Drawer */}
      <AnimatePresence>
        {drainDrawerOpen && inspectingDrain && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrainDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-[#06182c] border-l border-cyan-500/30 p-6 overflow-y-auto h-full shadow-2xl z-10 flex flex-col justify-between text-slate-100"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-cyan-300">
                      {inspectingDrain.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        inspectingDrain.status === 'critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : inspectingDrain.status === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {inspectingDrain.status}
                    </span>
                  </div>

                  <button
                    onClick={() => setDrainDrawerOpen(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white mt-4">{inspectingDrain.name}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Zone: {inspectingDrain.zone} • Lat: {inspectingDrain.coordinates.lat}, Lng:{' '}
                  {inspectingDrain.coordinates.lng}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="p-3.5 rounded-2xl bg-[#041222] border border-cyan-500/15">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      Water Level
                    </span>
                    <span
                      className={`text-2xl font-black font-mono mt-1 block ${
                        inspectingDrain.waterLevel >= 85
                          ? 'text-rose-400'
                          : inspectingDrain.waterLevel >= 70
                          ? 'text-amber-400'
                          : 'text-cyan-300'
                      }`}
                    >
                      {inspectingDrain.waterLevel}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#041222] border border-cyan-500/15">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      Waste Load
                    </span>
                    <span className="text-2xl font-black font-mono mt-1 block text-slate-100">
                      {inspectingDrain.wasteLoad}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#041222] border border-cyan-500/15">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      Flow Velocity
                    </span>
                    <span className="text-lg font-black font-mono mt-1 block text-white">
                      {inspectingDrain.flowRate} m³/s
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#041222] border border-cyan-500/15">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      Risk Score
                    </span>
                    <span className="text-lg font-black font-mono mt-1 block text-purple-300">
                      {inspectingDrain.riskScore}%
                    </span>
                  </div>
                </div>

                {/* Telemetry specs */}
                <div className="mt-6 p-4 rounded-2xl bg-[#041222] border border-cyan-500/15 space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sensor Status:</span>
                    <span className="text-emerald-400 font-bold">{inspectingDrain.sensorStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Motor Actuator:</span>
                    <span className="text-cyan-300 font-bold">{inspectingDrain.mechanismStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Water Temperature:</span>
                    <span className="text-slate-200">{inspectingDrain.temperature}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Maintenance:</span>
                    <span className="text-slate-200">{inspectingDrain.lastCleaned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Worker:</span>
                    <span className="text-white">{inspectingDrain.assignedWorker || 'None'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-4 border-t border-cyan-500/20 space-y-2.5">
                <button
                  onClick={() => {
                    setDrainDrawerOpen(false);
                    setActiveTab('chennai_map');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all flex items-center justify-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View on Interactive GIS Map</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setDrainDrawerOpen(false);
                      setActiveTab('motor_control');
                    }}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold text-cyan-300 bg-[#08223f] hover:bg-[#0d345e] border border-cyan-500/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Power className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Motor Control</span>
                  </button>

                  <button
                    onClick={() => {
                      setDrainDrawerOpen(false);
                      setActiveTab('alerts_incidents');
                    }}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Create Alert</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
