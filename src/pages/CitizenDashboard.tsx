import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  MapPin,
  AlertTriangle,
  FileText,
  Settings,
  PlusCircle,
  ThumbsUp,
  Clock,
  CheckCircle2,
  Camera,
  Navigation,
  Sparkles,
  ChevronRight,
  Droplets,
  HardHat,
  Search,
  Star,
  X,
  Menu,
  LogOut,
  Send,
  Upload,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { CitizenReport } from '../types';
import { ChennaiMap } from '../components/map/ChennaiMap';

type CitizenTab = 'home' | 'problem_map' | 'report_problem' | 'my_reports' | 'settings';

export const CitizenDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { citizenReports, submitCitizenReport, showToast, drains } = useApp();

  const [activeTab, setActiveTab] = useState<CitizenTab>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Upvotes state
  const [upvotedIds, setUpvotedIds] = useState<Record<string, number>>({
    'REP-2024-001': 14,
    'REP-2024-002': 8,
    'REP-2024-003': 3,
  });

  // Selected report for modal detail
  const [inspectedReport, setInspectedReport] = useState<CitizenReport | null>(null);

  // Rating modal for resolved issues
  const [ratingReportId, setRatingReportId] = useState<string | null>(null);
  const [ratingStars, setRatingStars] = useState(5);

  // Form State for "REPORT A PROBLEM"
  const [formStep, setFormStep] = useState<1 | 2 | 3 | 4>(1);
  const [formZone, setFormZone] = useState('Adyar');
  const [formLocation, setFormLocation] = useState('');
  const [formCoords, setFormCoords] = useState<{ lat: number; lng: number }>({
    lat: 13.0012,
    lng: 80.2565,
  });
  const [formIssueType, setFormIssueType] = useState<CitizenReport['issueType']>('Blocked Drain');
  const [formSeverity, setFormSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY'>('MEDIUM');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState<string | null>(null);
  const [formPhone, setFormPhone] = useState('+91 98410 99881');
  const [successReportId, setSuccessReportId] = useState<string | null>(null);

  const citizenEmail = user?.email || 'citizen@demo.com';
  const myReports = citizenReports.filter(
    (r) => r.citizenEmail.toLowerCase() === citizenEmail.toLowerCase() || r.citizenName === 'Priya Sundaram'
  );

  const handleUpvote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setUpvotedIds((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    showToast({
      type: 'SUCCESS',
      title: 'Report Upvoted',
      message: 'Priority score increased! Chennai Corporation notifies maintenance team.',
    });
  };

  const handleAutoDetectLocation = () => {
    showToast({
      type: 'INFO',
      title: 'GPS Locked',
      message: 'Detected: 13.0031° N, 80.2554° E (Besant Nagar / Adyar)',
    });
    setFormLocation('Near Besant Avenue & 3rd Cross St');
    setFormZone('Adyar');
    setFormCoords({ lat: 13.0031, lng: 80.2554 });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormImage(url);
    }
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLocation.trim()) {
      showToast({
        type: 'WARNING',
        title: 'Location Required',
        message: 'Please provide landmark or street name.',
      });
      return;
    }

    const createdReport = submitCitizenReport({
      citizenName: user?.name || 'Priya Sundaram',
      citizenEmail: user?.email || 'citizen@demo.com',
      citizenPhone: formPhone,
      locationDetails: formLocation,
      zone: formZone,
      coordinates: formCoords,
      issueType: formIssueType,
      severity: formSeverity,
      description: formDescription || 'Observed water logging and blocked storm channel.',
      imageUrl: formImage || undefined,
    });

    setSuccessReportId(createdReport.id);
    showToast({
      type: 'SUCCESS',
      title: 'Grievance Registered',
      message: `Your report ${createdReport.id} is submitted to Greater Chennai Corporation.`,
    });
  };

  const resetForm = () => {
    setFormStep(1);
    setFormLocation('');
    setFormDescription('');
    setFormImage(null);
    setSuccessReportId(null);
  };

  const handleSaveRating = () => {
    setRatingReportId(null);
    showToast({
      type: 'SUCCESS',
      title: 'Feedback Received',
      message: `Thank you! Rated ${ratingStars} stars for GCC sanitation response.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#041120] text-slate-100 flex flex-col">
      {/* Top Citizen Header / Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#06182c]/95 backdrop-blur-xl border-b border-cyan-500/20 px-4 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-400 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <div className="w-full h-full bg-[#061A2E] rounded-[14px] flex items-center justify-center">
                <Droplets className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>CityHealth FlowSense</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  CITIZEN
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">Greater Chennai Corporation</p>
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {([
            { id: 'home' as const, label: 'HOME', icon: <Home className="w-4 h-4" /> },
            { id: 'problem_map' as const, label: 'PROBLEM MAP', icon: <MapPin className="w-4 h-4" /> },
            { id: 'report_problem' as const, label: 'REPORT A PROBLEM', icon: <PlusCircle className="w-4 h-4" /> },
            { id: 'my_reports' as const, label: 'MY REPORTS', icon: <FileText className="w-4 h-4" />, badge: myReports.length },
            { id: 'settings' as const, label: 'SETTINGS', icon: <Settings className="w-4 h-4" /> },
          ] as { id: CitizenTab; label: string; icon: React.ReactNode; badge?: number }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold tracking-wide transition-all flex items-center gap-2 ${
                activeTab === t.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
              {t.badge !== undefined && t.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400 text-slate-950 font-mono">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User & Mobile Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-bold text-slate-200">{user?.name || 'Priya S.'}</span>
            <button
              onClick={logout}
              className="p-1.5 rounded-xl text-rose-400 hover:text-white hover:bg-rose-950/40 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#06182c] border-b border-cyan-500/20 p-4 space-y-2 z-40"
          >
            {(
              [
                { id: 'home', label: 'HOME' },
                { id: 'problem_map', label: 'PROBLEM MAP' },
                { id: 'report_problem', label: 'REPORT A PROBLEM' },
                { id: 'my_reports', label: 'MY REPORTS' },
                { id: 'settings', label: 'SETTINGS' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold ${
                  activeTab === t.id ? 'bg-cyan-500 text-slate-950' : 'text-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400"
            >
              LOGOUT
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* VIEW 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Welcome Hero Banner */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/25 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                    Citizen Service Portal
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  Welcome, {user?.name || 'Citizen'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
                  Help keep Chennai flood-free. Report blocked street gutters, stagnant monsoon water, or malfunctioning storm drains directly to local ward workers.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('report_problem')}
                className="px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-xl shadow-cyan-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report an Issue</span>
              </button>
            </div>

            {/* Current Area Status Cards */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 mb-3 font-mono">
                Ward Monsoon & Drainage Status
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-panel p-5 rounded-3xl border border-emerald-500/30 bg-emerald-950/15 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono text-slate-400 uppercase">Zone 13</div>
                    <div className="text-lg font-black text-white mt-0.5">Adyar / Besant Nagar</div>
                    <span className="text-xs text-emerald-400 font-mono mt-1 block">
                      Water Level: 44% (Normal)
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    NORMAL
                  </span>
                </div>

                <div className="glass-panel p-5 rounded-3xl border border-rose-500/30 bg-rose-950/20 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono text-rose-300 uppercase">Zone 9</div>
                    <div className="text-lg font-black text-white mt-0.5">Guindy / Kathipara</div>
                    <span className="text-xs text-rose-300 font-mono mt-1 block">
                      Water Level: 87% (High Flood Risk)
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-rose-500/30 text-rose-300 border border-rose-500/50 animate-pulse">
                    CRITICAL
                  </span>
                </div>

                <div className="glass-panel p-5 rounded-3xl border border-amber-500/30 bg-amber-950/15 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono text-slate-400 uppercase">Zone 14</div>
                    <div className="text-lg font-black text-white mt-0.5">Velachery Canal Link</div>
                    <span className="text-xs text-amber-300 font-mono mt-1 block">
                      Water Level: 76% (Debris Sluice Alert)
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    WARNING
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Reports Submitted by Citizen */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>My Active Reports</span>
                </h3>
                <button
                  onClick={() => setActiveTab('my_reports')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  View All ({myReports.length}) →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myReports.slice(0, 2).map((rep) => (
                  <div
                    key={rep.id}
                    onClick={() => {
                      setInspectedReport(rep);
                      setActiveTab('my_reports');
                    }}
                    className="glass-panel p-5 rounded-3xl border border-cyan-500/20 hover:border-cyan-400/50 cursor-pointer transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-300">{rep.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                        {rep.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white">{rep.locationDetails}</h4>
                    <p className="text-xs text-slate-300 line-clamp-2">{rep.description}</p>

                    <div className="pt-2 border-t border-cyan-500/15 flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>{rep.submittedAt}</span>
                      <span className="text-cyan-400 font-semibold">Track Progress →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PROBLEM MAP */}
        {activeTab === 'problem_map' && (
          <div className="space-y-4">
            <div className="glass-panel p-6 rounded-3xl border border-cyan-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">Community Problem Map</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Explore verified drainage choke points and upvote issues in your residential zone.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('report_problem')}
                className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Report Problem Here</span>
              </button>
            </div>

            {/* Interactive Leaflet Chennai Map in Citizen Mode */}
            <ChennaiMap
              roleMode="citizen"
              onSelectDrain={(drain) => {
                showToast({
                  type: 'INFO',
                  title: drain.name,
                  message: `Water Level: ${drain.waterLevel}% • Status: ${drain.status.toUpperCase()}`,
                });
              }}
            />

            {/* List of Public Reports with Upvoting */}
            <div className="space-y-3 mt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 font-mono">
                Recent Public Grievances in Chennai
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {citizenReports.map((report) => {
                  const votes = upvotedIds[report.id] || 4;

                  return (
                    <div
                      key={report.id}
                      className="glass-panel p-5 rounded-3xl border border-cyan-500/20 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
                          <span className="font-mono text-xs font-bold text-cyan-300">{report.id}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                            {report.status}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-white mt-3">{report.locationDetails}</h4>
                        <p className="text-xs text-slate-300 mt-1">{report.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-cyan-500/15 flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">{report.zone}</span>

                        <button
                          onClick={(e) => handleUpvote(report.id, e)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-cyan-300 bg-[#08223f] hover:bg-[#0c3159] border border-cyan-500/30 transition-all flex items-center gap-1.5 active:scale-95"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Upvote ({votes})</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: REPORT A PROBLEM (Interactive Multi-Step Form) */}
        {activeTab === 'report_problem' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-cyan-500/25">
              <h2 className="text-2xl font-black text-white">Log Drainage Problem</h2>
              <p className="text-xs text-slate-300 mt-1">
                Direct dispatch to Ward Executive Engineer and Local Sanitation Patrol.
              </p>

              {/* Step indicator */}
              <div className="grid grid-cols-4 gap-2 mt-6">
                {[
                  { n: 1, label: 'Location' },
                  { n: 2, label: 'Details' },
                  { n: 3, label: 'Photo' },
                  { n: 4, label: 'Confirm' },
                ].map((s) => (
                  <button
                    key={s.n}
                    onClick={() => setFormStep(s.n as any)}
                    className={`py-2 rounded-xl text-xs font-bold font-mono transition-all text-center ${
                      formStep === s.n
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                        : formStep > s.n
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-white/5 text-slate-500'
                    }`}
                  >
                    Step {s.n}: {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SUCCESS STATE */}
            {successReportId ? (
              <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 bg-emerald-950/15 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
                <h3 className="text-2xl font-black text-white">Report Registered Successfully!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Tracking ID: <strong className="text-cyan-300 font-mono text-sm">{successReportId}</strong>
                  <br />
                  A ward sanitation team has received your ticket. You will receive SMS alerts at {formPhone}.
                </p>

                <div className="flex justify-center gap-3 pt-4">
                  <button
                    onClick={() => {
                      resetForm();
                      setActiveTab('my_reports');
                    }}
                    className="px-6 py-3 rounded-2xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-lg"
                  >
                    View in My Reports
                  </button>

                  <button
                    onClick={resetForm}
                    className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-300 bg-white/10 hover:bg-white/20 transition-all"
                  >
                    Report Another Issue
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-6">
                {/* STEP 1: LOCATION */}
                {formStep === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-white flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-cyan-400" />
                        <span>Step 1: Where is the problem located?</span>
                      </h4>

                      <button
                        type="button"
                        onClick={handleAutoDetectLocation}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-cyan-300 bg-[#08223f] hover:bg-[#0c3159] border border-cyan-500/30 transition-all flex items-center gap-1.5"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Auto-Detect My GPS</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1.5">
                          Select Chennai Zone / Ward:
                        </label>
                        <select
                          value={formZone}
                          onChange={(e) => setFormZone(e.target.value)}
                          className="w-full bg-[#041222] border border-cyan-500/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                        >
                          <option value="Adyar">Adyar (Zone 13)</option>
                          <option value="Guindy">Guindy (Zone 9)</option>
                          <option value="Velachery">Velachery (Zone 14)</option>
                          <option value="T. Nagar">T. Nagar (Zone 10)</option>
                          <option value="Tambaram">Tambaram / GST Road</option>
                          <option value="Anna Nagar">Anna Nagar (Zone 8)</option>
                          <option value="Mylapore">Mylapore (Zone 9)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1.5">
                          Street Name / Nearest Landmark:
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Opposite Pillar 142, Sardar Patel Road"
                          value={formLocation}
                          onChange={(e) => setFormLocation(e.target.value)}
                          className="w-full bg-[#041222] border border-cyan-500/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => setFormStep(2)}
                        className="px-6 py-2.5 rounded-2xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all flex items-center gap-1.5"
                      >
                        <span>Next: Problem Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: PROBLEM DETAILS */}
                {formStep === 2 && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-cyan-400" />
                      <span>Step 2: Describe the issue</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1.5">
                          Problem Type:
                        </label>
                        <select
                          value={formIssueType}
                          onChange={(e) => setFormIssueType(e.target.value as CitizenReport['issueType'])}
                          className="w-full bg-[#041222] border border-cyan-500/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                        >
                          <option value="Blocked Drain">Blocked Drain (Plastic / Debris)</option>
                          <option value="Waterlogging">Street Waterlogging (Knee Deep)</option>
                          <option value="Waste Accumulation">Waste Accumulation in Catch Basin</option>
                          <option value="Overflow">Drainage Overflow onto Pavement</option>
                          <option value="Damaged Drain">Damaged Manhole Cover / Broken Slab</option>
                          <option value="Other">Other Hazardous Condition</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1.5">
                          Severity Level:
                        </label>
                        <select
                          value={formSeverity}
                          onChange={(e) => setFormSeverity(e.target.value as any)}
                          className="w-full bg-[#041222] border border-cyan-500/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                        >
                          <option value="LOW">Low (Partial Slow Drain)</option>
                          <option value="MEDIUM">Medium (Stagnant Water on Edge)</option>
                          <option value="HIGH">High (Roadway Obstructed)</option>
                          <option value="EMERGENCY">Emergency (Water Entering Homes)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        Description & Observations:
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Provide details such as bad odor, plastic bags choking the grill, or depth of water..."
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full bg-[#041222] border border-cyan-500/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setFormStep(1)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormStep(3)}
                        className="px-6 py-2.5 rounded-2xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all flex items-center gap-1.5"
                      >
                        <span>Next: Attach Photo</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: PHOTO UPLOAD */}
                {formStep === 3 && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-cyan-400" />
                      <span>Step 3: Capture or Upload Photo</span>
                    </h4>

                    {formImage ? (
                      <div className="relative max-w-sm mx-auto rounded-2xl overflow-hidden border border-cyan-500/30">
                        <img src={formImage} alt="Uploaded problem" className="w-full h-48 object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormImage(null)}
                          className="absolute top-2 right-2 p-1.5 bg-slate-950/80 rounded-full text-rose-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-[#041222]/50 hover:bg-[#041222] transition-colors text-center">
                        <Upload className="w-8 h-8 text-cyan-400" />
                        <div>
                          <span className="text-sm font-bold text-slate-200 block">
                            Click or Drag Photo Here
                          </span>
                          <span className="text-xs text-slate-400 mt-1 block">
                            PNG, JPG, HEIC up to 10MB
                          </span>
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setFormStep(2)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormStep(4)}
                        className="px-6 py-2.5 rounded-2xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all flex items-center gap-1.5"
                      >
                        <span>Next: Review & Submit</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: CONFIRMATION & CONTACT */}
                {formStep === 4 && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <Send className="w-4 h-4 text-cyan-400" />
                      <span>Step 4: Contact & Final Review</span>
                    </h4>

                    <div className="p-4 rounded-2xl bg-[#041222] border border-cyan-500/20 space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Location:</span>
                        <span className="text-white font-bold">{formLocation} ({formZone})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Issue Type:</span>
                        <span className="text-cyan-300">{formIssueType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Severity:</span>
                        <span className="text-amber-400">{formSeverity}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">
                        SMS Status Updates Phone Number:
                      </label>
                      <input
                        type="tel"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        className="w-full bg-[#041222] border border-cyan-500/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setFormStep(3)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10"
                      >
                        Back
                      </button>

                      <button
                        type="submit"
                        className="px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-xl shadow-cyan-500/25 transition-all transform hover:scale-105"
                      >
                        Submit to Chennai Smart Drainage
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        )}

        {/* VIEW 4: MY REPORTS */}
        {activeTab === 'my_reports' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-cyan-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">My Submitted Reports</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Track live field worker response and resolution timelines.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('report_problem')}
                className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Report</span>
              </button>
            </div>

            <div className="space-y-4">
              {myReports.map((report) => {
                const isResolved = report.status === 'Resolved';
                const isAssigned = report.status === 'Worker Assigned' || report.status === 'Cleaning';

                return (
                  <div
                    key={report.id}
                    className="glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cyan-500/15">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-cyan-300">{report.id}</span>
                        <span className="text-xs font-mono text-slate-400">• {report.zone}</span>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase font-mono tracking-wider w-fit ${
                          isResolved
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : isAssigned
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-white">{report.locationDetails}</h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{report.description}</p>
                    </div>

                    {/* LIVE PROGRESS STEPPER */}
                    <div className="p-4 rounded-2xl bg-[#041222] border border-cyan-500/20">
                      <div className="text-[10px] font-mono text-slate-400 uppercase mb-2">
                        Resolution Milestone
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          1. REPORTED
                        </div>
                        <div
                          className={`p-2 rounded-xl ${
                            isAssigned || isResolved
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-white/5 text-slate-500'
                          }`}
                        >
                          2. ASSIGNED
                        </div>
                        <div
                          className={`p-2 rounded-xl ${
                            report.status === 'Cleaning' || isResolved
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-white/5 text-slate-500'
                          }`}
                        >
                          3. IN PROGRESS
                        </div>
                        <div
                          className={`p-2 rounded-xl ${
                            isResolved
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-white/5 text-slate-500'
                          }`}
                        >
                          4. RESOLVED
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions / Rating */}
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400">
                        Logged: {report.submittedAt}
                      </span>

                      {isResolved && (
                        <button
                          onClick={() => setRatingReportId(report.id)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 transition-colors flex items-center gap-1.5"
                        >
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>Rate Sanitation Work</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 5: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/25 space-y-6">
            <h2 className="text-2xl font-black text-white">Citizen Account & Preferences</h2>

            <div className="space-y-4 text-xs font-medium">
              <div className="p-4 rounded-2xl bg-[#041222] border border-cyan-500/15 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">SMS Incident Alerts</div>
                  <div className="text-slate-400">Receive SMS notifications when your ward has flash flood alerts</div>
                </div>
                <span className="text-emerald-400 font-bold font-mono">ENABLED</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#041222] border border-cyan-500/15 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Primary Residential Ward</div>
                  <div className="text-slate-400">Adyar (Zone 13) - Chennai</div>
                </div>
                <button className="px-3 py-1 rounded-xl text-xs text-cyan-300 bg-cyan-950 border border-cyan-500/30">
                  Change
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#041222] border border-cyan-500/15 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Log Out</div>
                  <div className="text-slate-400">Exit the citizen reporting session</div>
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
        )}
      </main>

      {/* Citizen Feedback Rating Modal */}
      <AnimatePresence>
        {ratingReportId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#081e36] border border-cyan-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center space-y-4"
            >
              <h4 className="text-lg font-bold text-white">Rate Resolution Quality</h4>
              <p className="text-xs text-slate-300">
                How satisfied are you with the drainage clearing at {ratingReportId}?
              </p>

              {/* 5 Stars */}
              <div className="flex justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRatingStars(s)}
                    className="p-1 text-2xl transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        s <= ratingStars ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setRatingReportId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRating}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors"
                >
                  Submit Rating
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
