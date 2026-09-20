import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Trash2,
  HardHat,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  ExternalLink,
} from 'lucide-react';
import { DrainPoint } from '../../types';
import { useApp } from '../../context/AppContext';
import { CHENNAI_ZONES } from '../../data/mockData';

interface DrainTableProps {
  onInspect: (drain: DrainPoint) => void;
  onAssignWorker: (drain: DrainPoint) => void;
}

export const DrainTable: React.FC<DrainTableProps> = ({ onInspect, onAssignWorker }) => {
  const { drains, updateDrainMetrics, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'normal' | 'warning' | 'critical'>('all');
  const [sortBy, setSortBy] = useState<'riskScore' | 'waterLevel' | 'wasteLoad' | 'id'>('riskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const filteredAndSortedDrains = useMemo(() => {
    let result = drains.filter((d) => {
      if (selectedZone !== 'all' && d.zone !== selectedZone) return false;
      if (selectedStatus !== 'all' && d.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          d.id.toLowerCase().includes(q) ||
          d.name.toLowerCase().includes(q) ||
          d.zone.toLowerCase().includes(q)
        );
      }
      return true;
    });

    result.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === 'string') {
        return sortOrder === 'asc'
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }
      return sortOrder === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return result;
  }, [drains, selectedZone, selectedStatus, searchQuery, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedDrains.length / pageSize) || 1;
  const paginatedDrains = filteredAndSortedDrains.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSort = (field: 'riskScore' | 'waterLevel' | 'wasteLoad' | 'id') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleQuickClear = (drain: DrainPoint) => {
    updateDrainMetrics(drain.id, {
      wasteLoad: Math.max(drain.wasteLoad - 45, 10),
      waterLevel: Math.max(drain.waterLevel - 30, 20),
      status: 'normal',
      riskScore: Math.max(drain.riskScore - 35, 15),
    });

    showToast({
      type: 'SUCCESS',
      title: 'Mechanism Cleared Drain',
      message: `${drain.id} waste purged. Levels returned to normal.`,
    });
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-cyan-500/25 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Droplets className="w-5 h-5 text-cyan-400" />
            <span>Drainage Telemetry Data Grid</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing {filteredAndSortedDrains.length} of {drains.length} monitored drainage points
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, road or zone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#041220] border border-cyan-500/30 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 w-44 sm:w-52"
            />
          </div>

          <select
            value={selectedZone}
            onChange={(e) => {
              setSelectedZone(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#041220] border border-cyan-500/30 text-xs rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All 9 Zones</option>
            {CHENNAI_ZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as any);
              setCurrentPage(1);
            }}
            className="bg-[#041220] border border-cyan-500/30 text-xs rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Statuses</option>
            <option value="normal">Normal Only</option>
            <option value="warning">Warning Only</option>
            <option value="critical">Critical Only</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto rounded-2xl border border-cyan-500/20 bg-[#04111f]">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#06182c] border-b border-cyan-500/20 text-[11px] font-mono uppercase text-slate-400">
            <tr>
              <th
                onClick={() => toggleSort('id')}
                className="py-3 px-4 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Drain ID</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Location / Zone</th>
              <th
                onClick={() => toggleSort('waterLevel')}
                className="py-3 px-4 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Water Level</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('wasteLoad')}
                className="py-3 px-4 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Waste Load</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Flow Rate</th>
              <th
                onClick={() => toggleSort('riskScore')}
                className="py-3 px-4 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Risk Score</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-500/10">
            {paginatedDrains.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                  No drainage nodes matching criteria.
                </td>
              </tr>
            ) : (
              paginatedDrains.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-[#07203a]/70 transition-colors group"
                >
                  <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                    {d.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white truncate max-w-[200px]">
                      {d.name}
                    </div>
                    <div className="text-[11px] text-slate-400">{d.zone}</div>
                  </td>
                  <td className="py-3 px-4 w-36">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-bold text-slate-200">
                        {d.waterLevel}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          d.waterLevel > 75
                            ? 'bg-rose-500'
                            : d.waterLevel > 50
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                        style={{ width: `${Math.min(d.waterLevel, 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 w-32">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-bold text-slate-200">
                        {d.wasteLoad}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          d.wasteLoad > 70
                            ? 'bg-rose-500'
                            : d.wasteLoad > 40
                            ? 'bg-amber-400'
                            : 'bg-cyan-400'
                        }`}
                        style={{ width: `${Math.min(d.wasteLoad, 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {d.flowRate} m³/s
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                        d.riskScore > 75
                          ? 'bg-rose-500/20 text-rose-300'
                          : d.riskScore > 45
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {d.riskScore}/100
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        d.status === 'critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : d.status === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onInspect(d)}
                        className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
                        title="Inspect Telemetry Drawer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleQuickClear(d)}
                        className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
                        title="Trigger Automated Mechanical Clearance"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onAssignWorker(d)}
                        className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 transition-colors"
                        title="Assign Field Worker"
                      >
                        <HardHat className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-3 text-xs text-slate-400">
        <div>
          Page <span className="text-white font-bold">{currentPage}</span> of{' '}
          <span className="text-white font-bold">{totalPages}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="p-1.5 rounded-lg bg-[#041220] border border-cyan-500/20 text-slate-300 disabled:opacity-40 hover:bg-cyan-500/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="p-1.5 rounded-lg bg-[#041220] border border-cyan-500/20 text-slate-300 disabled:opacity-40 hover:bg-cyan-500/10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
