import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HardHat,
  Search,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Radio,
  ExternalLink,
  ChevronRight,
  Sparkles,
  KeyRound,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkerProfile, DrainPoint } from '../../types';
import { CHENNAI_ZONES } from '../../data/mockData';

export const WorkersView: React.FC = () => {
  const { workers, drains, assignWorkerToDrain, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ONLINE' | 'ON_TASK' | 'OFFLINE'>('all');

  // Dispatch modal
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [selectedDrainId, setSelectedDrainId] = useState('DRN-042');

  const filteredWorkers = workers.filter((w) => {
    if (zoneFilter !== 'all' && w.assignedZone !== zoneFilter) return false;
    if (statusFilter !== 'all' && w.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        w.name.toLowerCase().includes(q) ||
        w.id.toLowerCase().includes(q) ||
        w.assignedZone.toLowerCase().includes(q) ||
        w.phone.includes(q)
      );
    }
    return true;
  });

  const handleOpenDispatch = (worker: WorkerProfile) => {
    setSelectedWorker(worker);
    setDispatchModalOpen(true);
  };

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker) return;

    assignWorkerToDrain(selectedDrainId, selectedWorker.id);

    showToast({
      type: 'SUCCESS',
      title: 'Field Work Order Dispatched',
      message: `Assigned ${selectedWorker.name} (${selectedWorker.id}) to ${selectedDrainId}.`,
    });

    setDispatchModalOpen(false);
    setSelectedWorker(null);
  };

  const getStatusBadge = (status: WorkerProfile['status']) => {
    switch (status) {
      case 'ONLINE':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'ON_TASK':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'OFFLINE':
        return 'bg-slate-700/30 text-slate-400 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HardHat className="w-5 h-5 text-blue-400" />
            <span>Field Workforce & Dispatch Roster</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            24 Greater Chennai Corporation ward sanitation operators with 24-hour dynamic session security
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-blue-950/80 border border-blue-500/30 text-xs font-mono text-blue-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Active: {workers.filter((w) => w.status !== 'OFFLINE').length} / {workers.length}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#041220] border border-cyan-500/20">
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'ONLINE', 'ON_TASK', 'OFFLINE'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-colors ${
                statusFilter === st
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white bg-[#06182c]'
              }`}
            >
              {st === 'all' ? 'All Statuses' : st.replace('_', ' ')}
            </button>
          ))}

          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="bg-[#06182c] border border-cyan-500/30 text-xs rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400 ml-2"
          >
            <option value="all">All 9 Zones</option>
            {CHENNAI_ZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search worker by name, ID, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#06182c] border border-cyan-500/30 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkers.map((w) => (
          <div
            key={w.id}
            className="glass-card p-5 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-300">{w.id}</span>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${getStatusBadge(
                        w.status
                      )}`}
                    >
                      {w.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">{w.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{w.assignedZone} Ward Sector</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Score</span>
                  <span className="font-mono text-sm font-bold text-emerald-400">{w.performance}%</span>
                </div>
              </div>

              {/* Contact and Session */}
              <div className="p-2.5 rounded-xl bg-[#04111f] border border-cyan-500/10 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-cyan-400" />
                    <span>{w.phone}</span>
                  </span>
                  <span className="text-slate-300 font-mono text-[11px]">
                    {w.completedToday}/{w.tasksToday} Completed
                  </span>
                </div>

                {w.currentDrainId && (
                  <div className="text-[11px] text-cyan-300 bg-cyan-950/60 p-1.5 rounded-lg border border-cyan-500/20 flex items-center justify-between">
                    <span>Active at:</span>
                    <span className="font-mono font-bold">{w.currentDrainId}</span>
                  </div>
                )}
              </div>

              {/* 24h Dynamic Session Token Pill */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 bg-[#030d17] p-2 rounded-lg border border-slate-800">
                <span className="flex items-center gap-1 text-slate-300">
                  <KeyRound className="w-3 h-3 text-cyan-400" />
                  <span>TOKEN: WF-{w.id}-89F</span>
                </span>
                <span className="text-emerald-400 font-semibold">24h Valid</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-cyan-500/15 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">
                Shift: 07:00 - 19:00 IST
              </span>

              <button
                onClick={() => handleOpenDispatch(w)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-md active:scale-98"
              >
                Dispatch Task
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dispatch Modal */}
      <AnimatePresence>
        {dispatchModalOpen && selectedWorker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDispatchModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#081e36] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                <div>
                  <span className="text-xs font-mono text-cyan-300">Emergency Dispatch</span>
                  <h3 className="text-base font-bold text-white">
                    Assign Task to {selectedWorker.name}
                  </h3>
                </div>
                <button
                  onClick={() => setDispatchModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleDispatchSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Select Blocked Drain Node
                  </label>
                  <select
                    value={selectedDrainId}
                    onChange={(e) => setSelectedDrainId(e.target.value)}
                    className="w-full bg-[#041220] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {drains.slice(0, 20).map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.id} - {d.name} ({d.zone}, {d.status.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-300 text-[11px] space-y-1">
                  <div className="font-semibold text-white">Operative Profile:</div>
                  <div>ID: {selectedWorker.id} • Phone: {selectedWorker.phone}</div>
                  <div>Assigned Zone: {selectedWorker.assignedZone}</div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDispatchModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 text-slate-950 text-xs font-extrabold transition-all"
                  >
                    Dispatch Work Order
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
