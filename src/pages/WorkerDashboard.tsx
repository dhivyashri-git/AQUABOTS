import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  CheckSquare,
  AlertTriangle,
  History,
  CreditCard,
  Bell,
  User,
  Settings,
  HardHat,
  Clock,
  MapPin,
  CheckCircle2,
  Play,
  RotateCw,
  Camera,
  Upload,
  Droplets,
  Trash2,
  Navigation,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Cpu,
  KeyRound,
  FileCheck,
  CheckCircle,
  Menu,
  X,
  LogOut,
  IndianRupee,
  Phone,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { WorkerTask, DrainPoint, WorkerTaskStatus } from '../types';
import { ChennaiMap } from '../components/map/ChennaiMap';

type WorkerTab =
  | 'my_dashboard'
  | 'my_tasks'
  | 'emergency_alerts'
  | 'work_history'
  | 'payments'
  | 'notifications'
  | 'profile'
  | 'settings';

const STAGES: WorkerTaskStatus[] = [
  'ASSIGNED',
  'ACCEPTED',
  'ON THE WAY',
  'INSPECTING',
  'CLEANING',
  'WASTE REMOVED',
  'VERIFIED',
  'COMPLETED',
];

export const WorkerDashboard: React.FC = () => {
  const { user, workerSession, workerSessionRemaining, logout } = useAuth();
  const {
    workerTasks,
    updateTaskStatus,
    drains,
    setSelectedDrain,
    simulateWasteCleaned,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<WorkerTab>('my_dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Active task for details view
  const [activeTask, setActiveTask] = useState<WorkerTask | null>(() => {
    return workerTasks.find((t) => t.status !== 'COMPLETED') || workerTasks[0] || null;
  });

  // Completion modal state
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [taskToComplete, setTaskToComplete] = useState<WorkerTask | null>(null);
  const [wasteWeight, setWasteWeight] = useState<number>(18.5);
  const [proofPhoto, setProofPhoto] = useState<string | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [isActuating, setIsActuating] = useState(false);

  // Worker history filter
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');

  // Language state
  const [language, setLanguage] = useState<'EN' | 'TA'>('EN');

  // Stats calculation
  const pendingTasks = workerTasks.filter((t) => t.status !== 'COMPLETED');
  const completedTasks = workerTasks.filter((t) => t.status === 'COMPLETED');
  const urgentTasks = workerTasks.filter(
    (t) => t.priority === 'CRITICAL' && t.status !== 'COMPLETED'
  );
  const totalWasteCollected = workerTasks
    .filter((t) => t.status === 'COMPLETED' && t.wasteCollectedKg)
    .reduce((acc, t) => acc + (t.wasteCollectedKg || 0), 48.5);

  const sidebarItems: { id: WorkerTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'my_dashboard', label: 'MY DASHBOARD', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'my_tasks',
      label: 'MY TASKS',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingTasks.length,
    },
    {
      id: 'emergency_alerts',
      label: 'EMERGENCY ALERTS',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: urgentTasks.length,
    },
    { id: 'work_history', label: 'WORK HISTORY', icon: <History className="w-4 h-4" /> },
    { id: 'payments', label: 'PAYMENTS', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'notifications', label: 'NOTIFICATIONS', icon: <Bell className="w-4 h-4" /> },
    { id: 'profile', label: 'PROFILE', icon: <User className="w-4 h-4" /> },
    { id: 'settings', label: 'SETTINGS', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleAdvanceStatus = (task: WorkerTask) => {
    const currentIndex = STAGES.indexOf(task.status);
    if (currentIndex < STAGES.length - 1) {
      const nextStatus = STAGES[currentIndex + 1];

      if (nextStatus === 'COMPLETED') {
        setTaskToComplete(task);
        setCompleteModalOpen(true);
      } else {
        updateTaskStatus(task.id, nextStatus);

        showToast({
          type: 'INFO',
          title: `Status: ${nextStatus}`,
          message: `Task ${task.id} advanced to stage ${nextStatus}. Admin notified.`,
        });

        if (activeTask?.id === task.id) {
          setActiveTask({ ...task, status: nextStatus });
        }
      }
    }
  };

  const handleActuateHardware = () => {
    if (!activeTask) return;
    setIsActuating(true);

    showToast({
      type: 'INFO',
      title: 'Actuator Command Dispatched',
      message: `Running mobile suction unit on ${activeTask.drainId} for 10 seconds...`,
    });

    setTimeout(() => {
      setIsActuating(false);
      simulateWasteCleaned(activeTask.drainId, 16.5);
      showToast({
        type: 'SUCCESS',
        title: 'Mechanism Finished',
        message: `Debris hopper cleared. Ultrasonic level normalized.`,
      });
    }, 2500);
  };

  const handleFinalSubmitCompletion = () => {
    if (!taskToComplete) return;

    updateTaskStatus(taskToComplete.id, 'COMPLETED', proofPhoto || undefined);
    setCompleteModalOpen(false);
    setTaskToComplete(null);
    setProofPhoto(null);
    setCompletionNotes('');

    showToast({
      type: 'SUCCESS',
      title: 'Task Verified & Closed',
      message: `Task ${taskToComplete.id} marked COMPLETED. Payment credit added to your account.`,
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProofPhoto(url);
    }
  };

  const handleRequestPayout = () => {
    showToast({
      type: 'SUCCESS',
      title: 'Payout Request Submitted',
      message: 'Direct Bank Transfer (NEFT) of ₹2,300 scheduled to your linked SBI account.',
    });
  };

  return (
    <div className="min-h-screen bg-[#041120] text-slate-100 flex flex-col md:flex-row">
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

      {/* LEFT SIDEBAR */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 lg:w-72 bg-[#06182c] border-r border-cyan-500/20 flex flex-col justify-between z-50 transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand & Dynamic 24h Session Pill */}
          <div className="p-4 border-b border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-sm font-extrabold text-white">FlowSense Worker</h1>
                  <p className="text-[10px] text-cyan-300 font-mono">Field Operations</p>
                </div>
              </div>

              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 24-HOUR DYNAMIC SESSION INDICATOR */}
            <div className="mt-3 p-2.5 rounded-xl bg-[#041222] border border-cyan-500/25 text-[11px] font-mono">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  SESSION ACTIVE
                </span>
                <span className="text-cyan-300">{workerSessionRemaining} left</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 truncate">
                <KeyRound className="w-3 h-3 text-cyan-400" />
                <span>{workerSession?.token || 'WF-WRK-7F82A9C4'}</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] scrollbar-none">
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
                      ? 'bg-gradient-to-r from-blue-500/25 to-cyan-500/10 text-cyan-300 border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-blue-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  ) : isActive ? (
                    <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Worker Quick Profile / Logout */}
        <div className="p-4 border-t border-cyan-500/20 bg-[#041222]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center font-bold text-xs text-blue-300">
                AK
              </div>
              <div>
                <div className="text-xs font-bold text-white">Arun Kumar</div>
                <div className="text-[10px] text-slate-400 font-mono">WRK-001 • Adyar</div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-xl text-rose-400 hover:text-white hover:bg-rose-950/50 transition-colors"
              title="End Shift / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN WORKER CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#06182c]/90 backdrop-blur-xl border-b border-cyan-500/20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                Worker Portal
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-bold text-cyan-300 uppercase">
                {activeTab.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              STATUS: ON DUTY
            </span>
          </div>
        </header>

        {/* View Router */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* TAB 1: MY DASHBOARD */}
          {activeTab === 'my_dashboard' && (
            <div className="space-y-6">
              {/* Profile Greeting Header */}
              <div className="glass-panel p-6 rounded-3xl border border-cyan-500/25 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
                    <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
                      Field Operative Roster • Zone 4
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    Welcome, Arun Kumar (WRK-001)
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-3 font-mono">
                    <span>Assigned Area: Adyar / South Chennai</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-emerald-300 font-bold">Duty Status: Active Online</span>
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('my_tasks')}
                  className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>View Pending Assignments ({pendingTasks.length})</span>
                </button>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Today's Tasks</span>
                  <div className="text-2xl font-black text-white font-mono mt-1">4</div>
                  <span className="text-[10px] text-cyan-400 mt-0.5 block">2 completed</span>
                </div>

                <div className="glass-panel p-4 rounded-2xl border border-rose-500/25 bg-rose-950/20">
                  <span className="text-[10px] uppercase font-mono text-rose-300 block">Urgent Alerts</span>
                  <div className="text-2xl font-black text-rose-400 font-mono mt-1">1</div>
                  <span className="text-[10px] text-rose-300 mt-0.5 block">High flood risk</span>
                </div>

                <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">This Week</span>
                  <div className="text-2xl font-black text-emerald-300 font-mono mt-1">18</div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Tasks verified</span>
                </div>

                <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Earnings</span>
                  <div className="text-2xl font-black text-white font-mono mt-1">₹6,450</div>
                  <span className="text-[10px] text-emerald-400 mt-0.5 block">₹1,250 today</span>
                </div>

                <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Debris Lifted</span>
                  <div className="text-2xl font-black text-cyan-300 font-mono mt-1">
                    {totalWasteCollected} kg
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Logged by sensor</span>
                </div>
              </div>

              {/* Today's Assignments Delivery-style Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>Active Dispatches</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Live GPS Routing & Stepper
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workerTasks.map((task) => {
                    const isCrit = task.priority === 'CRITICAL';
                    const isComplete = task.status === 'COMPLETED';

                    return (
                      <div
                        key={task.id}
                        className={`glass-panel p-5 rounded-3xl border transition-all ${
                          isCrit && !isComplete
                            ? 'border-rose-500/40 bg-rose-950/15'
                            : 'border-cyan-500/20 hover:border-cyan-400/40'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-cyan-300">{task.id}</span>
                            <span className="text-[10px] text-slate-400 font-mono">• {task.drainId}</span>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                              isComplete
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : isCrit
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-white mt-3">{task.location}</h4>
                        <p className="text-xs text-slate-300 mt-1">{task.reason}</p>

                        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mt-3 pt-3 border-t border-cyan-500/15">
                          <span>
                            Water: <strong className={isCrit ? 'text-rose-400' : 'text-slate-200'}>{task.waterLevel}%</strong>
                          </span>
                          <span>
                            Waste: <strong className="text-slate-200">{task.wasteLoad}%</strong>
                          </span>
                          <span>
                            Deadline: <strong className="text-amber-300">{task.deadline}</strong>
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-4 pt-3 border-t border-cyan-500/15 flex items-center justify-between gap-2">
                          <button
                            onClick={() => {
                              setActiveTask(task);
                              setActiveTab('my_tasks');
                            }}
                            className="px-3 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-[#08223f] hover:bg-[#0c3159] border border-cyan-500/30 transition-colors"
                          >
                            View Details
                          </button>

                          {!isComplete ? (
                            <button
                              onClick={() => handleAdvanceStatus(task)}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                            >
                              <span>Next Step</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Completed
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY TASKS (Comprehensive Lifecycle Workflow) */}
          {activeTab === 'my_tasks' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-cyan-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                      Task Execution & Verification Engine
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">Field Task Workflow</h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Advance each assignment through inspection, motorized clearing, photo upload, and sign-off.
                  </p>
                </div>
              </div>

              {/* Task Selector Strip */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {workerTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTask(t)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-mono transition-all whitespace-nowrap flex items-center gap-2 ${
                      activeTask?.id === t.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md'
                        : 'bg-[#06182c] text-slate-400 hover:text-white border border-cyan-500/20'
                    }`}
                  >
                    <span>{t.id}</span>
                    <span className="text-[10px] text-slate-400">({t.zone})</span>
                  </button>
                ))}
              </div>

              {activeTask && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left 2 Cols: Stepper & Inspection Controls */}
                  <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-6">
                    <div className="flex items-start justify-between pb-4 border-b border-cyan-500/15">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-white">{activeTask.id}</span>
                          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                            {activeTask.drainId}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-200 mt-1">
                          {activeTask.location}
                        </h3>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          activeTask.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {activeTask.status}
                      </span>
                    </div>

                    {/* INTERACTIVE WORKFLOW STEPPER */}
                    <div className="p-4 rounded-2xl bg-[#041222] border border-cyan-500/20">
                      <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-3">
                        Progress Timeline (Click step to advance):
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-center">
                        {STAGES.map((st, i) => {
                          const currentIdx = STAGES.indexOf(activeTask.status);
                          const isDone = i <= currentIdx;
                          const isCurrent = i === currentIdx;

                          return (
                            <button
                              key={st}
                              onClick={() => {
                                updateTaskStatus(activeTask.id, st);
                                setActiveTask({ ...activeTask, status: st });
                                showToast({
                                  type: 'INFO',
                                  title: `Moved to ${st}`,
                                  message: `Task ${activeTask.id} updated to ${st}.`,
                                });
                              }}
                              className={`p-2 rounded-xl text-[9px] font-bold font-mono transition-all flex flex-col items-center gap-1 ${
                                isCurrent
                                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                                  : isDone
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-white/5 text-slate-500 border border-transparent'
                              }`}
                            >
                              <span>{i + 1}</span>
                              <span className="truncate w-full">{st}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sensor Telemetry Box */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-2xl bg-[#041222] border border-cyan-500/15 text-center">
                        <span className="text-[10px] uppercase font-mono text-slate-400 block">Water Level</span>
                        <span className="text-xl font-black text-rose-400 font-mono mt-0.5 block">
                          {activeTask.waterLevel}%
                        </span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-[#041222] border border-cyan-500/15 text-center">
                        <span className="text-[10px] uppercase font-mono text-slate-400 block">Waste Load</span>
                        <span className="text-xl font-black text-white font-mono mt-0.5 block">
                          {activeTask.wasteLoad}%
                        </span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-[#041222] border border-cyan-500/15 text-center">
                        <span className="text-[10px] uppercase font-mono text-slate-400 block">Flow Velocity</span>
                        <span className="text-xl font-black text-cyan-300 font-mono mt-0.5 block">
                          {activeTask.flowRate} m³/s
                        </span>
                      </div>
                    </div>

                    {/* Hardware Actuation Box */}
                    <div className="p-4 rounded-2xl bg-[#041222] border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-cyan-400" />
                          <span>Trigger Mobile Suction / Conveyor</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Sends an immediate Bluetooth / LoRa pulse to the node mechanical rake.
                        </p>
                      </div>

                      <button
                        onClick={handleActuateHardware}
                        disabled={isActuating}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        <RotateCw className={`w-3.5 h-3.5 ${isActuating ? 'animate-spin' : ''}`} />
                        <span>{isActuating ? 'Clearing Debris...' : 'Actuate Sluice'}</span>
                      </button>
                    </div>

                    {/* Step Advance Bar */}
                    <div className="pt-4 border-t border-cyan-500/15 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-mono">
                        Current Stage: <strong className="text-cyan-300">{activeTask.status}</strong>
                      </span>

                      {activeTask.status !== 'COMPLETED' ? (
                        <button
                          onClick={() => handleAdvanceStatus(activeTask)}
                          className="px-6 py-3 rounded-2xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
                        >
                          <span>Advance to Next Step</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4" /> Task Verified & Signed Off
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right 1 Col: Instructions & Map Snippet */}
                  <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3 flex items-center gap-2 font-mono">
                        <MapPin className="w-4 h-4" />
                        <span>Dispatch Instructions</span>
                      </h4>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        1. Deploy road cones along {activeTask.location}.<br />
                        2. Inspect ultrasonic sensor lens for moisture condensation.<br />
                        3. Open debris grill and engage hydraulic lift.<br />
                        4. Photograph segregated waste before disposal.<br />
                        5. Confirm water level drops below 50% in app.
                      </p>
                    </div>

                    {/* Proof Photo Upload */}
                    <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3 flex items-center gap-2 font-mono">
                        <Camera className="w-4 h-4" />
                        <span>Site Verification Photo</span>
                      </h4>

                      {proofPhoto ? (
                        <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30">
                          <img
                            src={proofPhoto}
                            alt="Proof"
                            className="w-full h-36 object-cover"
                          />
                          <button
                            onClick={() => setProofPhoto(null)}
                            className="absolute top-2 right-2 p-1.5 bg-slate-950/80 rounded-full text-rose-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#041222]/50 hover:bg-[#041222] transition-colors text-center">
                          <Camera className="w-6 h-6 text-cyan-400" />
                          <span className="text-xs font-bold text-slate-200">
                            Upload Completion Photo
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Capture cleared drain with timestamp
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EMERGENCY ALERTS */}
          {activeTab === 'emergency_alerts' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 bg-rose-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-semibold">
                      Urgent Incident Stream
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">Emergency Dispatch Alerts</h2>
                  <p className="text-xs text-rose-200 mt-1">
                    Severe flood hazard warnings requiring rapid field intervention within 2 hours.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass-panel p-6 rounded-3xl border border-rose-500/40 bg-[#16060c] shadow-[0_0_30px_rgba(244,63,94,0.15)]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                        <AlertTriangle className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500 text-white font-mono">
                            CRITICAL EMERGENCY
                          </span>
                          <span className="text-xs font-mono text-rose-300">DRN-042 • 10:42 AM</span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-1">
                          Anna Nagar 2nd Avenue Trunk Drain Sluice
                        </h3>
                      </div>
                    </div>

                    <span className="text-xl font-black font-mono text-rose-400">92% FULL</span>
                  </div>

                  <p className="text-xs text-slate-200 mt-4 leading-relaxed">
                    Automated ultrasonic sensor registered critical back-surge. Debris accumulation at trash gate has restricted discharge velocity to 0.4 m³/s. Waterlogging risk for adjacent residential tenements.
                  </p>

                  <div className="mt-6 pt-4 border-t border-rose-500/20 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-mono text-slate-400">
                      SLA: Response required within <strong className="text-rose-400">45 minutes</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveTab('my_tasks');
                          const t = workerTasks.find((x) => x.drainId === 'DRN-042');
                          if (t) setActiveTask(t);
                        }}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-rose-400 to-amber-400 hover:from-rose-300 hover:to-amber-300 transition-all flex items-center gap-1.5 shadow-lg shadow-rose-500/25"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Accept Emergency Task</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WORK HISTORY */}
          {activeTab === 'work_history' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-cyan-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Completed Work Log</h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Verified field tasks, weight of lifted waste, and municipality sign-offs.
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-[#041222] p-1 rounded-xl border border-cyan-500/20 text-xs">
                  {(['ALL', 'TODAY', 'WEEK', 'MONTH'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setHistoryFilter(f)}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                        historyFilter === f
                          ? 'bg-cyan-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-3xl border border-cyan-500/20 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#041222] text-[11px] uppercase font-mono tracking-wider text-cyan-400 border-b border-cyan-500/20">
                    <tr>
                      <th className="p-4">Task ID</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Date / Time</th>
                      <th className="p-4">Waste Lifted</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Earning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-500/10 font-medium">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-cyan-300">T-1038</td>
                      <td className="p-4">T. Nagar Pondy Bazaar Stormdrain</td>
                      <td className="p-4 font-mono text-slate-400">Today, 08:45 AM</td>
                      <td className="p-4 font-mono text-emerald-400 font-bold">24.0 kg</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          VERIFIED
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-white">₹450</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-cyan-300">T-1029</td>
                      <td className="p-4">Adyar Kasturba Nagar Feeder</td>
                      <td className="p-4 font-mono text-slate-400">19 Sep, 04:20 PM</td>
                      <td className="p-4 font-mono text-emerald-400 font-bold">32.5 kg</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          VERIFIED
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-white">₹800</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-cyan-300">T-1022</td>
                      <td className="p-4">Besant Nagar Outfall Sluice</td>
                      <td className="p-4 font-mono text-slate-400">18 Sep, 11:15 AM</td>
                      <td className="p-4 font-mono text-emerald-400 font-bold">19.0 kg</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          VERIFIED
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-white">₹600</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-cyan-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Earnings & Direct Payouts</h2>
                  <p className="text-xs text-slate-300 mt-1">
                    GCC sanitation operative performance compensation & emergency allowance.
                  </p>
                </div>

                <button
                  onClick={handleRequestPayout}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
                >
                  <IndianRupee className="w-4 h-4" />
                  <span>Request Instant Payout</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Today</span>
                  <div className="text-2xl font-black text-white font-mono mt-1">₹1,250</div>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">This Week</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1">₹6,450</div>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">This Month</span>
                  <div className="text-2xl font-black text-cyan-300 font-mono mt-1">₹24,800</div>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-amber-500/25 bg-amber-950/20">
                  <span className="text-[10px] font-mono text-amber-300 uppercase">Pending Balance</span>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-1">₹2,300</div>
                </div>
              </div>

              {/* Payment History Table */}
              <div className="glass-panel rounded-3xl border border-cyan-500/20 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#041222] text-[11px] uppercase font-mono tracking-wider text-cyan-400 border-b border-cyan-500/20">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Reference / Task</th>
                      <th className="p-4">Account Credited</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-500/10 font-medium">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono text-slate-400">20 Sep 2026</td>
                      <td className="p-4 font-bold text-white">Shift Allowance (Pondy Bazaar)</td>
                      <td className="p-4 font-mono text-slate-300">SBI ****3912</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          COMPLETED
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-emerald-400">₹450</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono text-slate-400">19 Sep 2026</td>
                      <td className="p-4 font-bold text-white">Heavy Debris Removal (Kasturba Canal)</td>
                      <td className="p-4 font-mono text-slate-300">SBI ****3912</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          COMPLETED
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-emerald-400">₹800</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono text-slate-400">Pending</td>
                      <td className="p-4 font-bold text-white">Weekend Monsoon Standby Bonus</td>
                      <td className="p-4 font-mono text-slate-300">SBI ****3912</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          PROCESSING
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-amber-300">₹2,300</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-cyan-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Operative Notifications</h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Direct dispatches from Command Room and citizen incident assignments.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="glass-panel p-4 rounded-2xl border border-rose-500/30 bg-rose-950/20">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                    <span>[URGENT DISPATCH] High Water Level on DRN-042</span>
                    <span className="font-mono text-[10px] text-slate-400">12 min ago</span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1">
                    You have been assigned to clear Anna Nagar 2nd Avenue Trunk Sluice. Suction unit dispatched.
                  </p>
                </div>

                <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/15">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>[PAYMENT CREDITED] ₹1,250 Added to Wallet</span>
                    <span className="font-mono text-[10px] text-slate-400">1 hr ago</span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1">
                    Verification approved for Task T-1038 (T. Nagar). Direct transfer processed.
                  </p>
                </div>

                <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20">
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                    <span>[SHIFT ACTIVE] 24-Hour Token Verified</span>
                    <span className="font-mono text-[10px] text-slate-400">2 hrs ago</span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1">
                    Token WF-WRK-7F82A9C4 authenticated successfully on Chennai Smart Drainage Grid.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-cyan-500/25">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center font-black text-xl text-blue-400">
                    AK
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Arun Kumar</h2>
                    <p className="text-xs text-cyan-300 font-mono">
                      Field Sanitation Operative • ID: WRK-001
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2 font-mono">
                      <span>Phone: +91 98401 23456</span>
                      <span>•</span>
                      <span>Assigned: Adyar / South Chennai</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-cyan-500/20 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#041222] border border-cyan-500/15">
                    <span className="text-slate-400 block">Session Token:</span>
                    <span className="text-cyan-300 font-bold">{workerSession?.token || 'WF-WRK-7F82A9C4'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#041222] border border-cyan-500/15">
                    <span className="text-slate-400 block">Joining Date:</span>
                    <span className="text-white">12 Jan 2024 (GCC Permanent)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#041222] border border-cyan-500/15">
                    <span className="text-slate-400 block">Safety Rating:</span>
                    <span className="text-emerald-400 font-bold">98% Compliance</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#041222] border border-cyan-500/15">
                    <span className="text-slate-400 block">Emergency Certification:</span>
                    <span className="text-purple-300 font-bold">Hazmat & High-Water Certified</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-cyan-500/25">
                <h2 className="text-xl font-bold text-white">Worker App Preferences</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Adjust alert vibrations, language, and offline synchronization modes.
                </p>

                <div className="mt-6 space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#041222] border border-cyan-500/15">
                    <div>
                      <div className="font-bold text-white">App Language</div>
                      <div className="text-slate-400">English / தமிழ் (Tamil)</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setLanguage('EN')}
                        className={`px-3 py-1.5 rounded-xl font-bold ${
                          language === 'EN'
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => setLanguage('TA')}
                        className={`px-3 py-1.5 rounded-xl font-bold ${
                          language === 'TA'
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        தமிழ்
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#041222] border border-cyan-500/15">
                    <div>
                      <div className="font-bold text-white">High Priority Audio Siren</div>
                      <div className="text-slate-400">Ring even in Do Not Disturb for critical flood alarms</div>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono">ENABLED</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#041222] border border-cyan-500/15">
                    <div>
                      <div className="font-bold text-white">End Shift Session</div>
                      <div className="text-slate-400">Sign out and release current 24-hour token</div>
                    </div>
                    <button
                      onClick={logout}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/50 hover:bg-rose-900 border border-rose-500/30 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Complete Task Modal */}
      <AnimatePresence>
        {completeModalOpen && taskToComplete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#081e36] border border-cyan-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-base text-white">Complete & Verify Task</h3>
                </div>
                <button
                  onClick={() => setCompleteModalOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div className="p-3 rounded-xl bg-[#041222] border border-cyan-500/15 text-xs font-mono">
                  <div className="text-cyan-300 font-bold">{taskToComplete.id}</div>
                  <div className="text-white mt-0.5">{taskToComplete.location}</div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Waste Lifted & Segregated (kg):
                  </label>
                  <input
                    type="number"
                    value={wasteWeight}
                    onChange={(e) => setWasteWeight(Number(e.target.value))}
                    className="w-full bg-[#041222] border border-cyan-500/30 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Completion Notes:
                  </label>
                  <textarea
                    rows={2}
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    placeholder="Sluice debris cleared, gate flushed with high velocity..."
                    className="w-full bg-[#041222] border border-cyan-500/30 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setCompleteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalSubmitCompletion}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all shadow-lg"
                >
                  Submit & Log Completion
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
