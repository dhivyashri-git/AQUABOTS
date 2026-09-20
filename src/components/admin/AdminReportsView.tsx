import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  User,
  HardHat,
  ChevronRight,
  Eye,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CitizenReport } from '../../types';

export const AdminReportsView: React.FC = () => {
  const { citizenReports, workers, assignWorkerToIncident, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const filteredReports = useMemo(() => {
    return citizenReports.filter((rep) => {
      if (categoryFilter !== 'ALL' && rep.issueType !== categoryFilter) return false;
      if (statusFilter !== 'ALL' && rep.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          rep.id.toLowerCase().includes(q) ||
          rep.citizenName.toLowerCase().includes(q) ||
          rep.locationDetails.toLowerCase().includes(q) ||
          rep.zone.toLowerCase().includes(q) ||
          rep.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [citizenReports, categoryFilter, statusFilter, searchQuery]);

  const handleExportCSV = () => {
    const headers = ['Report ID', 'Citizen', 'Zone', 'Location', 'Problem Type', 'Date', 'Status'];
    const rows = filteredReports.map((r) => [
      r.id,
      `"${r.citizenName}"`,
      r.zone,
      `"${r.locationDetails}"`,
      r.issueType,
      r.submittedAt,
      r.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CityHealth_Reports_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'SUCCESS',
      title: 'Report Exported',
      message: `${filteredReports.length} citizen incident records exported to CSV.`,
    });
  };

  const handleAssignWorker = (workerId: string) => {
    if (!selectedReport) return;
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return;

    assignWorkerToIncident(selectedReport.id, workerId);
    setAssignModalOpen(false);

    showToast({
      type: 'SUCCESS',
      title: 'Worker Dispatched',
      message: `Assigned ${worker.name} (${workerId}) to citizen report ${selectedReport.id}.`,
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
              Public Grievance Registry
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">Citizen Problem Reports</h2>
          <p className="text-xs text-slate-300 mt-1">
            Real-time feed of drainage blockages, waterlogging complaints, and hazardous overflow logged by Chennai citizens.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Filter Strip */}
      <div className="glass-panel p-4 rounded-3xl border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports by ID, resident, road..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#041222] border border-cyan-500/30 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 w-52 sm:w-64"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#041222] border border-cyan-500/30 text-xs rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Categories</option>
            <option value="Blocked Drain">Blocked Drain</option>
            <option value="Waterlogging">Waterlogging</option>
            <option value="Waste Accumulation">Waste Accumulation</option>
            <option value="Overflow">Overflow</option>
            <option value="Damaged Drain">Damaged Drain</option>
            <option value="Other">Other Issues</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#041222] border border-cyan-500/30 text-xs rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="Reported">Reported (New)</option>
            <option value="Worker Assigned">Worker Assigned</option>
            <option value="Cleaning">Cleaning in Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Total stats */}
        <div className="text-xs font-mono text-slate-400">
          Showing <strong className="text-cyan-300">{filteredReports.length}</strong> of{' '}
          {citizenReports.length} records
        </div>
      </div>

      {/* Reports Table */}
      <div className="glass-panel rounded-3xl border border-cyan-500/20 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#041222] text-[11px] uppercase font-mono tracking-wider text-cyan-400 border-b border-cyan-500/20">
              <tr>
                <th className="p-4">Report ID</th>
                <th className="p-4">Citizen</th>
                <th className="p-4">Location</th>
                <th className="p-4">Problem</th>
                <th className="p-4">Date</th>
                <th className="p-4">Assigned Worker</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10 font-medium">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No reports match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => {
                  const isResolved = report.status === 'Resolved';
                  const isAssigned = report.status === 'Worker Assigned' || report.status === 'Cleaning';

                  return (
                    <tr key={report.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-cyan-300">
                        {report.id}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{report.citizenName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{report.citizenEmail}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-slate-100">{report.locationDetails}</div>
                        <div className="text-[10px] text-cyan-400 font-mono">{report.zone}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                          {report.issueType}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-400">
                        {report.submittedAt}
                      </td>
                      <td className="p-4 font-mono">
                        {report.assignedWorkerId ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <HardHat className="w-3.5 h-3.5" />
                            {report.assignedWorkerId}
                          </span>
                        ) : (
                          <span className="text-slate-500">Unassigned</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                            isResolved
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : isAssigned
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedReport(report);
                              setAssignModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-cyan-300 bg-[#08223f] hover:bg-[#0c3159] border border-cyan-500/30 transition-colors"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10"
                            title="View details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Worker Modal */}
      <AnimatePresence>
        {assignModalOpen && selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#081e36] border border-cyan-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-100"
            >
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <HardHat className="w-5 h-5 text-cyan-400" />
                <span>Dispatch Worker to {selectedReport.id}</span>
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Select an active sanitation worker in {selectedReport.zone} to attend to{' '}
                {selectedReport.locationDetails}.
              </p>

              <div className="mt-4 max-h-60 overflow-y-auto space-y-2 pr-1">
                {workers
                  .filter((w) => w.status === 'ONLINE')
                  .map((worker) => (
                    <div
                      key={worker.id}
                      onClick={() => handleAssignWorker(worker.id)}
                      className="p-3 rounded-2xl bg-[#041222] hover:bg-cyan-500/15 border border-cyan-500/20 hover:border-cyan-400/50 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-white">{worker.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ID: {worker.id} • Zone: {worker.assignedZone}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        ONLINE
                      </span>
                    </div>
                  ))}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
