import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  HardHat,
  Eye,
  ShieldAlert,
  ChevronRight,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Incident, IncidentPriority, IncidentStatus } from '../../types';
import { CHENNAI_ZONES } from '../../data/mockData';

const INCIDENT_TYPES: Incident['type'][] = [
  'Blocked Drain',
  'Waterlogging',
  'Waste Accumulation',
  'Overflow',
  'Sensor Anomaly',
  'Damaged Drain',
];

export const IncidentsView: React.FC = () => {
  const { incidents, updateIncident, assignWorkerToIncident, workers, drains, setSelectedDrain, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'open' | 'critical' | 'resolved'>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New incident form state
  const [newLocation, setNewLocation] = useState('');
  const [newZone, setNewZone] = useState<string>(CHENNAI_ZONES[0]);
  const [newType, setNewType] = useState<Incident['type']>('Blocked Drain');
  const [newPriority, setNewPriority] = useState<IncidentPriority>('HIGH');
  const [newDrainId, setNewDrainId] = useState('DRN-042');
  const [newWorkerId, setNewWorkerId] = useState(workers[0]?.id || '');
  const [newNote, setNewNote] = useState('');

  const filteredIncidents = incidents.filter((inc) => {
    if (filterTab === 'open' && inc.status === 'RESOLVED') return false;
    if (filterTab === 'critical' && inc.priority !== 'CRITICAL') return false;
    if (filterTab === 'resolved' && inc.status !== 'RESOLVED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inc.id.toLowerCase().includes(q) ||
        inc.location.toLowerCase().includes(q) ||
        inc.drainId.toLowerCase().includes(q) ||
        inc.type.toLowerCase().includes(q) ||
        inc.zone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation.trim()) return;

    const newId = `INC-${Math.floor(2100 + Math.random() * 800)}`;
    const assignedWorker = workers.find((w) => w.id === newWorkerId);

    const created: Incident = {
      id: newId,
      drainId: newDrainId,
      location: newLocation,
      zone: newZone,
      type: newType,
      priority: newPriority,
      status: assignedWorker ? 'IN_PROGRESS' : 'OPEN',
      assignedWorkerId: assignedWorker?.id,
      assignedWorkerName: assignedWorker?.name,
      createdAt: 'Just now',
      updatedAt: 'Just now',
      waterLevel: 78,
      wasteLoad: 65,
      notes: [
        newNote || 'Logged manually via Command Center incidents dispatch console.',
        assignedWorker ? `Initial dispatch assigned to ${assignedWorker.name}` : 'Unassigned, pending field queue',
      ],
    };

    // Prepend to incidents
    updateIncident(created.id, created);

    showToast({
      type: 'SUCCESS',
      title: 'Incident Registered',
      message: `${created.id} broadcasted across GCC dispatch console.`,
    });

    setCreateModalOpen(false);
    setNewLocation('');
    setNewNote('');
  };

  const getPriorityBadge = (priority: IncidentPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-slate-700/30 text-slate-400 border-slate-600';
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'IN_PROGRESS':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'OPEN':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Incident Management & Remediation</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time emergency dispatch, field response tracking, and automated sensor breaches
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs tracking-wide shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Log Emergency Incident</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#041220] border border-cyan-500/20">
        <div className="flex items-center gap-2">
          {(['all', 'open', 'critical', 'resolved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                filterTab === tab
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white bg-[#06182c]'
              }`}
            >
              {tab === 'all' ? 'All Incidents' : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search ID, street, zone, type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#06182c] border border-cyan-500/30 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Incident Cards Roster */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIncidents.map((inc) => {
          const drain = drains.find((d) => d.id === inc.drainId);

          return (
            <div
              key={inc.id}
              className="glass-card p-5 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-300">{inc.id}</span>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${getPriorityBadge(
                          inc.priority
                        )}`}
                      >
                        {inc.priority}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1">{inc.location}</h3>
                    <p className="text-xs text-slate-400">
                      {inc.zone} • <span className="font-mono text-cyan-400">{inc.drainId}</span>
                    </p>
                  </div>

                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${getStatusBadge(
                      inc.status
                    )}`}
                  >
                    {inc.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#04111f] border border-cyan-500/10 text-xs space-y-1">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Category:</span>
                    <span className="font-semibold text-slate-200">{inc.type}</span>
                  </div>
                  {inc.waterLevel !== undefined && (
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Water / Waste Head:</span>
                      <span className="font-mono text-cyan-300">
                        {inc.waterLevel}% / {inc.wasteLoad || 0}%
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Assigned Field Worker:</span>
                    <span className="font-semibold text-white">
                      {inc.assignedWorkerName || 'Pending Assignment'}
                    </span>
                  </div>
                </div>

                {inc.notes.length > 0 && (
                  <div className="text-[11px] text-slate-400 italic bg-[#030d17] p-2 rounded-lg border border-slate-800">
                    "{inc.notes[inc.notes.length - 1]}"
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-cyan-500/15 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    if (drain) setSelectedDrain(drain);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Drain Drawer</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {inc.status !== 'RESOLVED' ? (
                    <>
                      {/* Assign Worker Dropdown */}
                      <select
                        value={inc.assignedWorkerId || ''}
                        onChange={(e) => assignWorkerToIncident(inc.id, e.target.value)}
                        className="bg-[#041220] border border-cyan-500/30 text-[11px] rounded-xl px-2 py-1 text-slate-300 focus:outline-none focus:border-cyan-400"
                      >
                        <option value="" disabled>
                          Assign Worker...
                        </option>
                        {workers.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name} ({w.assignedZone})
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => {
                          updateIncident(inc.id, { status: 'RESOLVED' });
                          showToast({
                            type: 'SUCCESS',
                            title: 'Incident Resolved',
                            message: `Incident ${inc.id} marked as cleared.`,
                          });
                        }}
                        className="px-2.5 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold"
                      >
                        Resolve
                      </button>
                    </>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Closed</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Incident Modal */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCreateModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#081e36] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <h3 className="text-base font-bold text-white">Log High-Priority Incident</h3>
                </div>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Issue Category</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as Incident['type'])}
                      className="w-full bg-[#041220] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      {INCIDENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Emergency Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as IncidentPriority)}
                      className="w-full bg-[#041220] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="CRITICAL">CRITICAL (Immediate Inundation)</option>
                      <option value="HIGH">HIGH (Severe Obstruction)</option>
                      <option value="MEDIUM">MEDIUM (Moderate Silt)</option>
                      <option value="LOW">LOW (Scheduled Routine)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Chennai Zone</label>
                    <select
                      value={newZone}
                      onChange={(e) => setNewZone(e.target.value)}
                      className="w-full bg-[#041220] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      {CHENNAI_ZONES.map((z) => (
                        <option key={z} value={z}>
                          {z}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Target Culvert Node</label>
                    <select
                      value={newDrainId}
                      onChange={(e) => setNewDrainId(e.target.value)}
                      className="w-full bg-[#041220] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      {drains.slice(0, 15).map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.id} - {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Street / Location Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2nd Avenue Roundtana feeder canal"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-[#041220] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Assign Initial Worker</label>
                    <select
                      value={newWorkerId}
                      onChange={(e) => setNewWorkerId(e.target.value)}
                      className="w-full bg-[#041220] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="">Leave Unassigned in Queue</option>
                      {workers.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.assignedZone})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Dispatch Note</label>
                    <input
                      type="text"
                      placeholder="e.g. Deploy mobile pump & suction"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="w-full bg-[#041220] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 text-xs font-extrabold transition-all"
                  >
                    Dispatch Incident
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
