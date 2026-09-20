export type UserRole = 'public' | 'citizen' | 'worker' | 'admin';

export type DrainStatus = 'normal' | 'warning' | 'critical';

export interface DrainPoint {
  id: string; // e.g. DRN-042
  name: string; // e.g. Anna Nagar 2nd Avenue
  zone: 'Anna Nagar' | 'T. Nagar' | 'Velachery' | 'Adyar' | 'Guindy' | 'Tambaram' | 'Perambur' | 'Mylapore' | 'Kodambakkam';
  coordinates: { x: number; y: number; lat: number; lng: number }; // normalized 0-100 for SVG map and GPS coords
  waterLevel: number; // 0 - 100%
  wasteLoad: number; // 0 - 100%
  flowRate: number; // m3/s
  temperature: number; // Celsius
  riskScore: number; // 0 - 100%
  status: DrainStatus;
  lastCleaned: string;
  assignedWorker?: string;
  sensorStatus: 'ONLINE' | 'STANDBY' | 'MAINTENANCE';
  mechanismStatus: 'READY' | 'ACTIVE' | 'OFFLINE';
}

export type IncidentPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

export interface Incident {
  id: string; // e.g. INC-2041
  drainId: string;
  location: string;
  zone: string;
  type: 'Blocked Drain' | 'Waterlogging' | 'Waste Accumulation' | 'Overflow' | 'Sensor Anomaly' | 'Damaged Drain';
  priority: IncidentPriority;
  waterLevel: number;
  wasteLoad: number;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
  notes: string[];
}

export type WorkerTaskStatus =
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'ON THE WAY'
  | 'INSPECTING'
  | 'CLEANING'
  | 'WASTE REMOVED'
  | 'VERIFIED'
  | 'COMPLETED';

export interface WorkerTask {
  id: string; // e.g. T-1042
  drainId: string;
  location: string;
  zone: string;
  priority: IncidentPriority;
  reason: string;
  waterLevel: number;
  wasteLoad: number;
  flowRate: number;
  assignedTime: string;
  deadline: string;
  status: WorkerTaskStatus;
  completedAt?: string;
  workerId: string;
  proofImage?: string;
  wasteCollectedKg?: number;
}

export interface WorkerProfile {
  id: string; // e.g. WRK-001
  name: string;
  phone: string;
  status: 'ONLINE' | 'ON_TASK' | 'OFFLINE';
  assignedZone: string;
  currentTaskId?: string;
  currentDrainId?: string;
  tasksToday: number;
  completedToday: number;
  performance: number; // percentage
  avatarUrl?: string;
}

export interface WorkerSession {
  workerId: string;
  workerName: string;
  token: string; // e.g. WF-WRK-7F82A9C4
  loginTime: number;
  expiryTime: number; // 24 hours from login
}

export interface CitizenReport {
  id: string; // e.g. CH-1042
  citizenEmail: string;
  citizenName: string;
  citizenPhone?: string;
  issueType: 'Blocked Drain' | 'Waterlogging' | 'Waste Accumulation' | 'Overflow' | 'Damaged Drain' | 'Other';
  zone: string;
  locationDetails: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  description: string;
  imageUrl?: string;
  submittedAt: string;
  status: 'Reported' | 'Under Review' | 'Worker Assigned' | 'Cleaning' | 'Resolved';
  assignedWorkerId?: string;
  drainId?: string;
  timeline: {
    stage: 'Reported' | 'Under Review' | 'Worker Assigned' | 'Cleaning' | 'Resolved';
    time: string;
    note: string;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  timestamp: string;
  read: boolean;
  drainId?: string;
}

export interface SystemThresholds {
  waterWarning: number; // default 70
  waterCritical: number; // default 85
  binWarning: number; // default 80
  wasteBlockage: number; // default 80
  floodRisk: number; // default 90
  soundAlerts: boolean;
  pushNotifications: boolean;
}

export interface WasteManagementData {
  todayTotalKg: number;
  organicKg: number;
  recyclableKg: number;
  nonRecyclableKg: number;
  otherKg: number;
  bins: {
    category: 'Organic' | 'Recyclable' | 'Non-Recyclable' | 'Hazardous';
    fillPercent: number;
    capacityKg: number;
    status: 'NORMAL' | 'WARNING' | 'FULL';
    lastEmptied: string;
  }[];
}
