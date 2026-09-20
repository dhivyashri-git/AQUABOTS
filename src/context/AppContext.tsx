import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DrainPoint,
  Incident,
  WorkerTask,
  WorkerProfile,
  CitizenReport,
  NotificationItem,
  SystemThresholds,
  WasteManagementData,
  WorkerTaskStatus,
  IncidentPriority,
  IncidentStatus,
} from '../types';
import {
  INITIAL_DRAINS,
  INITIAL_INCIDENTS,
  INITIAL_WORKER_TASKS,
  INITIAL_WORKERS,
  INITIAL_CITIZEN_REPORTS,
  INITIAL_WASTE_DATA,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import { DEFAULT_THRESHOLDS, evaluateDrainStatus, checkDrainAlerts } from '../utils/riskEngine';

export interface ToastMessage {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  title: string;
  message: string;
  timestamp?: string;
}

interface AppContextType {
  drains: DrainPoint[];
  incidents: Incident[];
  workerTasks: WorkerTask[];
  workers: WorkerProfile[];
  citizenReports: CitizenReport[];
  notifications: NotificationItem[];
  wasteData: WasteManagementData;
  thresholds: SystemThresholds;
  toasts: ToastMessage[];
  selectedDrain: DrainPoint | null;
  setSelectedDrain: (drain: DrainPoint | null) => void;
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  updateDrainMetrics: (drainId: string, updates: Partial<DrainPoint>) => void;
  updateTaskStatus: (taskId: string, newStatus: WorkerTaskStatus, proofImage?: string) => void;
  updateIncident: (incidentId: string, updates: Partial<Incident>) => void;
  assignWorkerToIncident: (incidentId: string, workerId: string) => void;
  assignWorkerToDrain: (drainId: string, workerId: string) => void;
  submitCitizenReport: (report: Omit<CitizenReport, 'id' | 'submittedAt' | 'status' | 'timeline'>) => CitizenReport;
  updateThresholds: (updates: Partial<SystemThresholds>) => void;
  simulateWasteCleaned: (drainId: string, kgRemoved?: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or mockData
  const [drains, setDrains] = useState<DrainPoint[]>(() => {
    try {
      const saved = localStorage.getItem('cityhealth_drains');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_DRAINS;
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    try {
      const saved = localStorage.getItem('cityhealth_incidents');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_INCIDENTS;
  });

  const [workerTasks, setWorkerTasks] = useState<WorkerTask[]>(() => {
    try {
      const saved = localStorage.getItem('cityhealth_worker_tasks');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_WORKER_TASKS;
  });

  const [workers, setWorkers] = useState<WorkerProfile[]>(INITIAL_WORKERS);

  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>(() => {
    try {
      const saved = localStorage.getItem('cityhealth_citizen_reports');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_CITIZEN_REPORTS;
  });

  const [wasteData, setWasteData] = useState<WasteManagementData>(() => {
    try {
      const saved = localStorage.getItem('cityhealth_waste_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_WASTE_DATA;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('cityhealth_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_NOTIFICATIONS;
  });

  const [thresholds, setThresholds] = useState<SystemThresholds>(() => {
    try {
      const saved = localStorage.getItem('cityhealth_thresholds');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_THRESHOLDS;
  });

  const [selectedDrain, setSelectedDrain] = useState<DrainPoint | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // LocalStorage synchronizers
  useEffect(() => {
    try {
      localStorage.setItem('cityhealth_drains', JSON.stringify(drains));
    } catch (e) {}
  }, [drains]);

  useEffect(() => {
    try {
      localStorage.setItem('cityhealth_incidents', JSON.stringify(incidents));
    } catch (e) {}
  }, [incidents]);

  useEffect(() => {
    try {
      localStorage.setItem('cityhealth_worker_tasks', JSON.stringify(workerTasks));
    } catch (e) {}
  }, [workerTasks]);

  useEffect(() => {
    try {
      localStorage.setItem('cityhealth_citizen_reports', JSON.stringify(citizenReports));
    } catch (e) {}
  }, [citizenReports]);

  useEffect(() => {
    try {
      localStorage.setItem('cityhealth_waste_data', JSON.stringify(wasteData));
    } catch (e) {}
  }, [wasteData]);

  useEffect(() => {
    try {
      localStorage.setItem('cityhealth_notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('cityhealth_thresholds', JSON.stringify(thresholds));
    } catch (e) {}
  }, [thresholds]);

  // Subtle real-time sensor simulation (modulates water level & flow subtly on DRN-042 and others)
  useEffect(() => {
    const timer = setInterval(() => {
      setDrains((prev) =>
        prev.map((d) => {
          if (d.id === 'DRN-042' || d.id === 'DRN-018' || d.id === 'DRN-021') {
            const jitterWater = Math.round((Math.random() - 0.48) * 1.5);
            const newWater = Math.min(99, Math.max(15, d.waterLevel + jitterWater));
            const newFlow = Number(Math.max(0.2, d.flowRate + (Math.random() - 0.5) * 0.1).toFixed(1));
            const newStatus = evaluateDrainStatus(newWater, d.wasteLoad, thresholds);
            return {
              ...d,
              waterLevel: newWater,
              flowRate: newFlow,
              status: newStatus,
            };
          }
          return d;
        })
      );
    }, 4500);

    return () => clearInterval(timer);
  }, [thresholds]);

  const showToast = (t: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...t, id };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

    setTimeout(() => {
      removeToast(id);
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateDrainMetrics = (drainId: string, updates: Partial<DrainPoint>) => {
    setDrains((prev) =>
      prev.map((d) => {
        if (d.id === drainId) {
          const updated = { ...d, ...updates };
          updated.status = evaluateDrainStatus(updated.waterLevel, updated.wasteLoad, thresholds);
          return updated;
        }
        return d;
      })
    );
  };

  const updateTaskStatus = (taskId: string, newStatus: WorkerTaskStatus, proofImage?: string) => {
    setWorkerTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isComplete = newStatus === 'COMPLETED';
          return {
            ...t,
            status: newStatus,
            proofImage: proofImage || t.proofImage,
            completedAt: isComplete ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t.completedAt,
          };
        }
        return t;
      })
    );

    // If task is completed, update corresponding drain & incidents
    const targetTask = workerTasks.find((t) => t.id === taskId);
    if (targetTask && newStatus === 'COMPLETED') {
      simulateWasteCleaned(targetTask.drainId, targetTask.wasteCollectedKg || 22);

      // Resolve linked incidents
      setIncidents((prev) =>
        prev.map((inc) =>
          inc.drainId === targetTask.drainId ? { ...inc, status: 'RESOLVED', updatedAt: 'Just now' } : inc
        )
      );

      // Update citizen report if linked
      setCitizenReports((prev) =>
        prev.map((rep) => {
          if (rep.drainId === targetTask.drainId || rep.id === 'CH-1042') {
            return {
              ...rep,
              status: 'Resolved',
              timeline: [
                ...rep.timeline,
                {
                  stage: 'Resolved',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  note: 'Automated mechanism cleared waste. Sensor readings normalized.',
                },
              ],
            };
          }
          return rep;
        })
      );

      showToast({
        type: 'SUCCESS',
        title: 'Task Completed',
        message: `Task ${taskId} completed for drain ${targetTask.drainId}. System status updated.`,
      });
    }
  };

  const updateIncident = (incidentId: string, updates: Partial<Incident>) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === incidentId ? { ...inc, ...updates, updatedAt: 'Just now' } : inc))
    );
  };

  const assignWorkerToIncident = (incidentId: string, workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return;

    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              assignedWorkerId: workerId,
              assignedWorkerName: worker.name,
              status: 'IN_PROGRESS',
              updatedAt: 'Just now',
              notes: [...inc.notes, `Worker ${worker.name} (${workerId}) dispatched by Command Center`],
            }
          : inc
      )
    );

    showToast({
      type: 'INFO',
      title: 'Worker Dispatched',
      message: `Assigned ${worker.name} to Incident ${incidentId}.`,
    });
  };

  const assignWorkerToDrain = (drainId: string, workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return;

    setDrains((prev) =>
      prev.map((d) => (d.id === drainId ? { ...d, assignedWorker: `${worker.id} (${worker.name})` } : d))
    );

    // Also create or update task
    const newTask: WorkerTask = {
      id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
      drainId,
      location: drains.find((d) => d.id === drainId)?.name || `Drain ${drainId}`,
      zone: drains.find((d) => d.id === drainId)?.zone || 'Anna Nagar',
      priority: 'HIGH',
      reason: 'Command Center manual dispatch',
      waterLevel: drains.find((d) => d.id === drainId)?.waterLevel || 75,
      wasteLoad: drains.find((d) => d.id === drainId)?.wasteLoad || 70,
      flowRate: 1.2,
      assignedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deadline: 'Within 24 hours',
      status: 'ASSIGNED',
      workerId,
    };

    setWorkerTasks((prev) => [newTask, ...prev]);

    showToast({
      type: 'INFO',
      title: 'Task Assigned',
      message: `Task ${newTask.id} assigned to ${worker.name} for ${drainId}.`,
    });
  };

  const submitCitizenReport = (
    reportData: Omit<CitizenReport, 'id' | 'submittedAt' | 'status' | 'timeline'>
  ): CitizenReport => {
    const randomNum = Math.floor(1045 + Math.random() * 8900);
    const newReportId = `CH-${randomNum}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowFull = `20 Sep 2026, ${nowTime}`;

    // Find nearest drain in zone
    const matchedDrain = drains.find((d) => d.zone === reportData.zone) || drains[0];

    const newReport: CitizenReport = {
      ...reportData,
      id: newReportId,
      submittedAt: nowFull,
      status: 'Reported',
      drainId: matchedDrain.id,
      timeline: [
        {
          stage: 'Reported',
          time: nowTime,
          note: `Report filed by ${reportData.citizenName} for ${reportData.zone}`,
        },
      ],
    };

    setCitizenReports((prev) => [newReport, ...prev]);

    // Create corresponding incident
    const newIncident: Incident = {
      id: `INC-${Math.floor(2100 + Math.random() * 8000)}`,
      drainId: matchedDrain.id,
      location: `${reportData.locationDetails} (${reportData.zone})`,
      zone: reportData.zone,
      type: (reportData.issueType === 'Other' ? 'Waste Accumulation' : reportData.issueType) as Incident['type'],
      priority: 'HIGH',
      waterLevel: matchedDrain.waterLevel,
      wasteLoad: Math.min(95, matchedDrain.wasteLoad + 20),
      status: 'OPEN',
      createdAt: nowFull,
      updatedAt: nowFull,
      notes: [`Citizen Report ${newReportId}: "${reportData.description}"`],
    };

    setIncidents((prev) => [newIncident, ...prev]);

    showToast({
      type: 'SUCCESS',
      title: 'Report Registered',
      message: `Report #${newReportId} registered. Tracking timeline active.`,
    });

    return newReport;
  };

  const updateThresholds = (updates: Partial<SystemThresholds>) => {
    setThresholds((prev) => ({ ...prev, ...updates }));
    showToast({
      type: 'INFO',
      title: 'Settings Updated',
      message: 'System alert thresholds updated successfully.',
    });
  };

  const simulateWasteCleaned = (drainId: string, kgRemoved = 20) => {
    setDrains((prev) =>
      prev.map((d) => {
        if (d.id === drainId) {
          const newWaste = Math.max(12, Math.round(d.wasteLoad * 0.25));
          const newWater = Math.max(25, Math.round(d.waterLevel * 0.5));
          const newFlow = Number((d.flowRate + 1.2).toFixed(1));
          return {
            ...d,
            wasteLoad: newWaste,
            waterLevel: newWater,
            flowRate: newFlow,
            status: 'normal',
            riskScore: Math.round(d.riskScore * 0.35),
            lastCleaned: 'Today (Just now)',
            mechanismStatus: 'READY',
          };
        }
        return d;
      })
    );

    setWasteData((prev) => {
      const organicInc = kgRemoved * 0.45;
      const recycInc = kgRemoved * 0.35;
      const nonRecycInc = kgRemoved * 0.2;
      return {
        ...prev,
        todayTotalKg: Number((prev.todayTotalKg + kgRemoved).toFixed(1)),
        organicKg: Number((prev.organicKg + organicInc).toFixed(1)),
        recyclableKg: Number((prev.recyclableKg + recycInc).toFixed(1)),
        nonRecyclableKg: Number((prev.nonRecyclableKg + nonRecycInc).toFixed(1)),
        bins: prev.bins.map((b) => {
          if (b.category === 'Recyclable') {
            const newFill = Math.min(98, b.fillPercent + 3);
            return { ...b, fillPercent: newFill, status: newFill >= 80 ? 'WARNING' : 'NORMAL' };
          }
          return b;
        }),
      };
    });

    // Add notification
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'Drain Cleaned',
      message: `Drain ${drainId} was cleaned. ${kgRemoved}kg waste removed and segregated.`,
      type: 'SUCCESS',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      drainId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        drains,
        incidents,
        workerTasks,
        workers,
        citizenReports,
        notifications,
        wasteData,
        thresholds,
        toasts,
        selectedDrain,
        setSelectedDrain,
        showToast,
        removeToast,
        markNotificationRead,
        clearAllNotifications,
        updateDrainMetrics,
        updateTaskStatus,
        updateIncident,
        assignWorkerToIncident,
        assignWorkerToDrain,
        submitCitizenReport,
        updateThresholds,
        simulateWasteCleaned,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
