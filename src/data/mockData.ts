import { DrainPoint, WorkerProfile, WorkerTask, Incident, CitizenReport, NotificationItem, WasteManagementData } from '../types';

export const CHENNAI_ZONES = [
  'Anna Nagar',
  'T. Nagar',
  'Velachery',
  'Adyar',
  'Guindy',
  'Tambaram',
  'Perambur',
  'Mylapore',
  'Kodambakkam',
] as const;

export const ZONE_COORDINATES: Record<string, { lat: number; lng: number; x: number; y: number }> = {
  'Perambur': { lat: 13.1114, lng: 80.2337, x: 42, y: 18 },
  'Anna Nagar': { lat: 13.0850, lng: 80.2101, x: 30, y: 32 },
  'Kodambakkam': { lat: 13.0513, lng: 80.2209, x: 38, y: 45 },
  'T. Nagar': { lat: 13.0418, lng: 80.2341, x: 48, y: 52 },
  'Mylapore': { lat: 13.0368, lng: 80.2676, x: 68, y: 54 },
  'Guindy': { lat: 13.0067, lng: 80.2025, x: 36, y: 66 },
  'Adyar': { lat: 13.0012, lng: 80.2565, x: 62, y: 68 },
  'Velachery': { lat: 12.9815, lng: 80.2180, x: 46, y: 76 },
  'Tambaram': { lat: 12.9249, lng: 80.1275, x: 22, y: 88 },
};

// Generate 128 Drains
export const INITIAL_DRAINS: DrainPoint[] = (() => {
  const drains: DrainPoint[] = [];
  const roadNames: Record<string, string[]> = {
    'Anna Nagar': ['2nd Avenue Main', 'Shanthi Colony Trunk', 'Roundtana Culvert', '12th Main Canal', 'Thirumangalam Road', 'Blue Star Junction'],
    'T. Nagar': ['Usman Road Flyover', 'Pondy Bazaar Stormdrain', 'G.N. Chetty Canal', 'Panagal Park Conduit', 'Venkatnarayana Drain', 'Ranganathan St Link'],
    'Velachery': ['Velachery Bypass Drain', 'Lake View Culvert', 'Vijaya Nagar Main', 'Taramani Link Canal', 'Dhandeeswaram Sluice', 'Phoenix Mall Collector'],
    'Adyar': ['Kasturba Nagar Canal', 'Besant Nagar Outfall', 'Gandhi Nagar Trunk', 'Lattice Bridge Road', 'Malviya Avenue Drain', 'Indira Nagar Culvert'],
    'Guindy': ['Kathipara Interchange Drain', 'Race Course Culvert', 'SIDCO Industrial Channel', 'GST Road Feeder', 'Little Mount Outfall', 'Olympia Tech Trunk'],
    'Tambaram': ['GST Road Canal', 'Tambaram Sanatorium Feeder', 'Mudichur Road Sluice', 'East Tambaram Main', 'Camp Road Culvert', 'MEPZ Collector'],
    'Perambur': ['Paper Mills Road Sluice', 'Perambur High Road', 'Barracks Drain', 'Stephenson Road Canal', 'Loco Works Culvert', 'Venus Market Trunk'],
    'Mylapore': ['Luz Corner Stormdrain', 'Kutchery Road Culvert', 'Kapaleeshwarar Tank Channel', 'San Thome High Road Outfall', 'Royapettah Link', 'Alwarpet Junction'],
    'Kodambakkam': ['Arcot Road Sluice', 'Power House Culvert', 'Trustpuram Canal', 'Station Road Drain', 'Vadapalani Link', 'Meenakshi College Channel'],
  };

  // Pre-seed iconic drains including DRN-042 and DRN-018
  drains.push({
    id: 'DRN-042',
    name: 'Anna Nagar 2nd Avenue Trunk',
    zone: 'Anna Nagar',
    coordinates: { x: 32, y: 34, lat: 13.0855, lng: 80.2120 },
    waterLevel: 87,
    wasteLoad: 81,
    flowRate: 0.9,
    temperature: 30.2,
    riskScore: 88,
    status: 'critical',
    lastCleaned: '18 Sep 2026',
    assignedWorker: 'WRK-001 (Arun Kumar)',
    sensorStatus: 'ONLINE',
    mechanismStatus: 'ACTIVE',
  });

  drains.push({
    id: 'DRN-018',
    name: 'Velachery Bypass Drain Sluice',
    zone: 'Velachery',
    coordinates: { x: 48, y: 74, lat: 12.9830, lng: 80.2205 },
    waterLevel: 76,
    wasteLoad: 78,
    flowRate: 1.4,
    temperature: 29.5,
    riskScore: 79,
    status: 'warning',
    lastCleaned: '16 Sep 2026',
    assignedWorker: 'WRK-004 (Suresh K)',
    sensorStatus: 'ONLINE',
    mechanismStatus: 'READY',
  });

  drains.push({
    id: 'DRN-021',
    name: 'T. Nagar Pondy Bazaar Stormdrain',
    zone: 'T. Nagar',
    coordinates: { x: 50, y: 51, lat: 13.0410, lng: 80.2330 },
    waterLevel: 44,
    wasteLoad: 28,
    flowRate: 2.8,
    temperature: 28.9,
    riskScore: 32,
    status: 'normal',
    lastCleaned: '20 Sep 2026',
    sensorStatus: 'ONLINE',
    mechanismStatus: 'READY',
  });

  for (let i = 4; i <= 128; i++) {
    const paddedId = `DRN-${i.toString().padStart(3, '0')}`;
    const zone = CHENNAI_ZONES[i % CHENNAI_ZONES.length];
    const roadList = roadNames[zone];
    const road = roadList[(i * 3) % roadList.length] + ` Sector ${((i % 7) + 1)}`;
    const baseCoords = ZONE_COORDINATES[zone];
    
    // Spread around zone
    const xOff = ((i * 17) % 11) - 5;
    const yOff = ((i * 19) % 11) - 5;

    // Distribute realistic status
    let status: 'normal' | 'warning' | 'critical' = 'normal';
    let waterLevel = Math.round(25 + ((i * 13) % 45));
    let wasteLoad = Math.round(15 + ((i * 19) % 45));

    if (i % 8 === 0 || i === 15 || i === 29 || i === 54 || i === 73 || i === 91 || i === 114) {
      status = 'critical';
      waterLevel = Math.round(85 + ((i * 3) % 12));
      wasteLoad = Math.round(75 + ((i * 7) % 20));
    } else if (i % 4 === 0 || i % 6 === 0) {
      status = 'warning';
      waterLevel = Math.round(70 + ((i * 2) % 14));
      wasteLoad = Math.round(55 + ((i * 5) % 22));
    }

    const flowRate = status === 'critical' ? Number((0.6 + (i % 5) * 0.1).toFixed(1)) : Number((1.8 + (i % 12) * 0.15).toFixed(1));
    const riskScore = status === 'critical' ? Math.round(82 + (i % 15)) : status === 'warning' ? Math.round(62 + (i % 16)) : Math.round(20 + (i % 30));

    drains.push({
      id: paddedId,
      name: `${road} (${zone})`,
      zone,
      coordinates: {
        x: Math.min(92, Math.max(10, baseCoords.x + xOff)),
        y: Math.min(92, Math.max(10, baseCoords.y + yOff)),
        lat: Number((baseCoords.lat + (yOff * 0.003)).toFixed(4)),
        lng: Number((baseCoords.lng + (xOff * 0.003)).toFixed(4)),
      },
      waterLevel,
      wasteLoad,
      flowRate,
      temperature: Number((28.5 + (i % 4) * 0.5).toFixed(1)),
      riskScore,
      status,
      lastCleaned: `${(15 + (i % 6))} Sep 2026`,
      assignedWorker: status === 'critical' ? `WRK-${((i % 24) + 1).toString().padStart(3, '0')}` : undefined,
      sensorStatus: i % 31 === 0 ? 'STANDBY' : 'ONLINE',
      mechanismStatus: status === 'critical' ? 'ACTIVE' : 'READY',
    });
  }

  return drains;
})();

// 24 Workers
export const INITIAL_WORKERS: WorkerProfile[] = [
  { id: 'WRK-001', name: 'Arun Kumar', phone: '+91 98401 22819', status: 'ONLINE', assignedZone: 'Anna Nagar', currentTaskId: 'T-1042', currentDrainId: 'DRN-042', tasksToday: 4, completedToday: 3, performance: 94 },
  { id: 'WRK-002', name: 'Rajesh V', phone: '+91 94440 88214', status: 'ONLINE', assignedZone: 'T. Nagar', currentTaskId: 'T-1043', currentDrainId: 'DRN-021', tasksToday: 5, completedToday: 4, performance: 96 },
  { id: 'WRK-003', name: 'Priya Narayanan', phone: '+91 98842 11902', status: 'ON_TASK', assignedZone: 'Adyar', currentTaskId: 'T-1044', currentDrainId: 'DRN-007', tasksToday: 3, completedToday: 2, performance: 92 },
  { id: 'WRK-004', name: 'Suresh Krishnan', phone: '+91 97909 33201', status: 'ONLINE', assignedZone: 'Velachery', currentTaskId: 'T-1045', currentDrainId: 'DRN-018', tasksToday: 4, completedToday: 4, performance: 98 },
  { id: 'WRK-005', name: 'Karthik Mani', phone: '+91 98410 44582', status: 'ONLINE', assignedZone: 'Guindy', tasksToday: 3, completedToday: 3, performance: 91 },
  { id: 'WRK-006', name: 'Deepa Rajan', phone: '+91 98847 90123', status: 'ONLINE', assignedZone: 'Mylapore', tasksToday: 2, completedToday: 2, performance: 95 },
  { id: 'WRK-007', name: 'Muthuvel S', phone: '+91 94451 22345', status: 'ON_TASK', assignedZone: 'Tambaram', tasksToday: 4, completedToday: 2, performance: 88 },
  { id: 'WRK-008', name: 'Gopalakrishnan B', phone: '+91 98400 99876', status: 'ONLINE', assignedZone: 'Perambur', tasksToday: 3, completedToday: 3, performance: 90 },
  { id: 'WRK-009', name: 'Anand Sundaram', phone: '+91 97102 33412', status: 'ONLINE', assignedZone: 'Kodambakkam', tasksToday: 5, completedToday: 4, performance: 93 },
  { id: 'WRK-010', name: 'Vigneshwaran P', phone: '+91 98840 55678', status: 'ONLINE', assignedZone: 'Anna Nagar', tasksToday: 4, completedToday: 3, performance: 89 },
  { id: 'WRK-011', name: 'Meenakshi S', phone: '+91 94441 67890', status: 'ONLINE', assignedZone: 'T. Nagar', tasksToday: 3, completedToday: 3, performance: 97 },
  { id: 'WRK-012', name: 'Saravanan D', phone: '+91 98412 34567', status: 'ON_TASK', assignedZone: 'Velachery', tasksToday: 4, completedToday: 2, performance: 86 },
  { id: 'WRK-013', name: 'Balaji Natarajan', phone: '+91 97910 88990', status: 'ONLINE', assignedZone: 'Adyar', tasksToday: 2, completedToday: 2, performance: 94 },
  { id: 'WRK-014', name: 'Senthil Nathan', phone: '+91 98843 22114', status: 'ONLINE', assignedZone: 'Guindy', tasksToday: 3, completedToday: 3, performance: 92 },
  { id: 'WRK-015', name: 'Kavitha Ramesh', phone: '+91 94452 77889', status: 'ONLINE', assignedZone: 'Mylapore', tasksToday: 4, completedToday: 3, performance: 95 },
  { id: 'WRK-016', name: 'Ravi Chandran', phone: '+91 98403 66778', status: 'ONLINE', assignedZone: 'Tambaram', tasksToday: 3, completedToday: 2, performance: 87 },
  { id: 'WRK-017', name: 'Dinesh Kumar', phone: '+91 97105 11223', status: 'ONLINE', assignedZone: 'Perambur', tasksToday: 4, completedToday: 4, performance: 99 },
  { id: 'WRK-018', name: 'Thirunavukkarasu M', phone: '+91 98846 44332', status: 'ON_TASK', assignedZone: 'Kodambakkam', tasksToday: 3, completedToday: 1, performance: 84 },
  { id: 'WRK-019', name: 'Manikandan V', phone: '+91 94443 99001', status: 'ONLINE', assignedZone: 'Anna Nagar', tasksToday: 4, completedToday: 3, performance: 91 },
  { id: 'WRK-020', name: 'Shankar G', phone: '+91 98415 88776', status: 'ONLINE', assignedZone: 'T. Nagar', tasksToday: 3, completedToday: 3, performance: 93 },
  { id: 'WRK-021', name: 'Jayaraman R', phone: '+91 97908 55443', status: 'ONLINE', assignedZone: 'Velachery', tasksToday: 4, completedToday: 3, performance: 90 },
  { id: 'WRK-022', name: 'Subramanian K', phone: '+91 98849 33221', status: 'ONLINE', assignedZone: 'Adyar', tasksToday: 2, completedToday: 2, performance: 96 },
  { id: 'WRK-023', name: 'Muruganandam C', phone: '+91 94454 11009', status: 'ONLINE', assignedZone: 'Guindy', tasksToday: 3, completedToday: 2, performance: 89 },
  { id: 'WRK-024', name: 'Vasanth Babu', phone: '+91 98407 22334', status: 'ONLINE', assignedZone: 'Tambaram', tasksToday: 4, completedToday: 4, performance: 97 },
];

// Initial Tasks for Worker (especially WRK-001)
export const INITIAL_WORKER_TASKS: WorkerTask[] = [
  {
    id: 'T-1042',
    drainId: 'DRN-042',
    location: 'Anna Nagar 2nd Avenue Trunk',
    zone: 'Anna Nagar',
    priority: 'CRITICAL',
    reason: 'High water level + waste blockage',
    waterLevel: 87,
    wasteLoad: 81,
    flowRate: 0.9,
    assignedTime: '10:42 AM',
    deadline: 'Within 24 hours',
    status: 'ASSIGNED',
    workerId: 'WRK-001',
    wasteCollectedKg: 18.5,
  },
  {
    id: 'T-1045',
    drainId: 'DRN-018',
    location: 'Velachery Bypass Drain Sluice',
    zone: 'Velachery',
    priority: 'HIGH',
    reason: 'Waste load reached 76%, flow restricted',
    waterLevel: 76,
    wasteLoad: 78,
    flowRate: 1.4,
    assignedTime: '09:15 AM',
    deadline: 'Within 18 hours',
    status: 'INSPECTING',
    workerId: 'WRK-001',
  },
  {
    id: 'T-1038',
    drainId: 'DRN-021',
    location: 'T. Nagar Pondy Bazaar Stormdrain',
    zone: 'T. Nagar',
    priority: 'MEDIUM',
    reason: 'Routine pre-monsoon clearing',
    waterLevel: 44,
    wasteLoad: 28,
    flowRate: 2.8,
    assignedTime: '07:30 AM',
    deadline: 'Completed',
    status: 'COMPLETED',
    workerId: 'WRK-001',
    completedAt: '08:45 AM',
    wasteCollectedKg: 24.0,
  },
];

// 52 Incidents for Admin
export const INITIAL_INCIDENTS: Incident[] = (() => {
  const incs: Incident[] = [];
  const types: Incident['type'][] = ['Blocked Drain', 'Waterlogging', 'Waste Accumulation', 'Overflow', 'Sensor Anomaly', 'Damaged Drain'];
  const priorities: Incident['priority'][] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  // Critical items
  incs.push({
    id: 'INC-2041',
    drainId: 'DRN-042',
    location: 'Anna Nagar 2nd Avenue Trunk',
    zone: 'Anna Nagar',
    type: 'Waterlogging',
    priority: 'CRITICAL',
    waterLevel: 87,
    wasteLoad: 81,
    assignedWorkerId: 'WRK-001',
    assignedWorkerName: 'Arun Kumar',
    status: 'IN_PROGRESS',
    createdAt: '20 Sep 2026, 10:30 AM',
    updatedAt: '20 Sep 2026, 10:45 AM',
    notes: ['Automated sensor threshold triggered.', 'Worker WRK-001 dispatched with mobile suction unit.'],
  });

  incs.push({
    id: 'INC-2042',
    drainId: 'DRN-018',
    location: 'Velachery Bypass Drain Sluice',
    zone: 'Velachery',
    type: 'Waste Accumulation',
    priority: 'HIGH',
    waterLevel: 76,
    wasteLoad: 78,
    assignedWorkerId: 'WRK-004',
    assignedWorkerName: 'Suresh Krishnan',
    status: 'OPEN',
    createdAt: '20 Sep 2026, 09:12 AM',
    updatedAt: '20 Sep 2026, 09:12 AM',
    notes: ['Citizen reported heavy plastic bottle buildup near bridge pillar.'],
  });

  for (let i = 3; i <= 52; i++) {
    const drainIndex = ((i * 7) % 127) + 1;
    const drainId = `DRN-${drainIndex.toString().padStart(3, '0')}`;
    const zone = CHENNAI_ZONES[i % CHENNAI_ZONES.length];
    const type = types[i % types.length];
    const priority = i % 5 === 0 ? 'CRITICAL' : i % 3 === 0 ? 'HIGH' : i % 2 === 0 ? 'MEDIUM' : 'LOW';
    const status: Incident['status'] = i % 7 === 0 ? 'RESOLVED' : i % 2 === 0 ? 'IN_PROGRESS' : 'OPEN';
    const waterLevel = priority === 'CRITICAL' ? 84 + (i % 12) : 50 + (i % 30);
    const wasteLoad = priority === 'CRITICAL' ? 78 + (i % 16) : 40 + (i % 35);
    const worker = INITIAL_WORKERS[i % INITIAL_WORKERS.length];

    incs.push({
      id: `INC-${(2040 + i)}`,
      drainId,
      location: `${zone} Sector ${((i % 5) + 1)} Conduit`,
      zone,
      type,
      priority,
      waterLevel,
      wasteLoad,
      assignedWorkerId: status !== 'OPEN' ? worker.id : undefined,
      assignedWorkerName: status !== 'OPEN' ? worker.name : undefined,
      status,
      createdAt: `20 Sep 2026, ${((8 + (i % 4))).toString().padStart(2, '0')}:${((i * 11) % 60).toString().padStart(2, '0')} AM`,
      updatedAt: `20 Sep 2026, 10:15 AM`,
      notes: [`Telemetry reading: water ${waterLevel}%, waste ${wasteLoad}%.`],
    });
  }

  return incs;
})();

// Citizen Reports
export const INITIAL_CITIZEN_REPORTS: CitizenReport[] = [
  {
    id: 'CH-1042',
    citizenEmail: 'citizen@demo.com',
    citizenName: 'Sundar Raman',
    issueType: 'Blocked Drain',
    zone: 'Anna Nagar',
    locationDetails: 'Near 2nd Avenue Bus Depot culvert',
    description: 'Heavy collection of plastic containers and branch debris causing dirty water to back up onto pedestrian walkway.',
    submittedAt: '20 Sep 2026, 09:30 AM',
    status: 'Cleaning',
    assignedWorkerId: 'WRK-001',
    drainId: 'DRN-042',
    timeline: [
      { stage: 'Reported', time: '09:30 AM', note: 'Issue lodged with geo-tagged coordinates' },
      { stage: 'Under Review', time: '09:38 AM', note: 'AI classified as high priority blockage' },
      { stage: 'Worker Assigned', time: '09:45 AM', note: 'Assigned to field worker WRK-001 (Arun Kumar)' },
      { stage: 'Cleaning', time: '10:15 AM', note: 'Automated mesh lift & manual sweep in progress' },
    ],
  },
  {
    id: 'CH-1039',
    citizenEmail: 'citizen@demo.com',
    citizenName: 'Sundar Raman',
    issueType: 'Waterlogging',
    zone: 'Velachery',
    locationDetails: 'Vijaya Nagar junction underpass',
    description: 'Rain runoff pooling to calf height after morning shower.',
    submittedAt: '19 Sep 2026, 04:15 PM',
    status: 'Resolved',
    assignedWorkerId: 'WRK-004',
    drainId: 'DRN-018',
    timeline: [
      { stage: 'Reported', time: '04:15 PM', note: 'Citizen submission received' },
      { stage: 'Under Review', time: '04:22 PM', note: 'Verified by zone supervisor' },
      { stage: 'Worker Assigned', time: '04:30 PM', note: 'Worker WRK-004 deployed' },
      { stage: 'Cleaning', time: '04:50 PM', note: 'Submersible dewatering pump deployed' },
      { stage: 'Resolved', time: '06:10 PM', note: 'Water drained, debris cleared, normal flow verified' },
    ],
  },
  {
    id: 'CH-1035',
    citizenEmail: 'citizen@demo.com',
    citizenName: 'Sundar Raman',
    issueType: 'Damaged Drain',
    zone: 'T. Nagar',
    locationDetails: 'Pondy Bazaar footpath slab cracked',
    description: 'Concrete drain cover broken, posing safety risk for pedestrians.',
    submittedAt: '18 Sep 2026, 11:20 AM',
    status: 'Resolved',
    assignedWorkerId: 'WRK-002',
    drainId: 'DRN-021',
    timeline: [
      { stage: 'Reported', time: '11:20 AM', note: 'Lodged with photograph' },
      { stage: 'Under Review', time: '11:45 AM', note: 'Reviewed by GCC Engineering Cell' },
      { stage: 'Worker Assigned', time: '12:15 PM', note: 'Maintenance crew dispatched' },
      { stage: 'Cleaning', time: '01:30 PM', note: 'Debris extracted, slab replaced' },
      { stage: 'Resolved', time: '03:45 PM', note: 'Heavy duty RCC cover installed' },
    ],
  },
  {
    id: 'CH-1028',
    citizenEmail: 'citizen@demo.com',
    citizenName: 'Sundar Raman',
    issueType: 'Waste Accumulation',
    zone: 'Adyar',
    locationDetails: 'Kasturba Nagar 3rd Cross',
    description: 'Household waste dumped near open storm intake.',
    submittedAt: '17 Sep 2026, 08:10 AM',
    status: 'Resolved',
    assignedWorkerId: 'WRK-003',
    drainId: 'DRN-007',
    timeline: [
      { stage: 'Reported', time: '08:10 AM', note: 'Reported via mobile portal' },
      { stage: 'Resolved', time: '10:30 AM', note: 'Sanitation team cleared waste and sanitized grate' },
    ],
  },
];

// Waste Data
export const INITIAL_WASTE_DATA: WasteManagementData = {
  todayTotalKg: 248.5,
  organicKg: 94.2,
  recyclableKg: 82.7,
  nonRecyclableKg: 58.1,
  otherKg: 13.5,
  bins: [
    { category: 'Organic', fillPercent: 62, capacityKg: 250, status: 'NORMAL', lastEmptied: '19 Sep 2026, 06:00 PM' },
    { category: 'Recyclable', fillPercent: 78, capacityKg: 200, status: 'NORMAL', lastEmptied: '19 Sep 2026, 04:30 PM' },
    { category: 'Non-Recyclable', fillPercent: 84, capacityKg: 200, status: 'WARNING', lastEmptied: '18 Sep 2026, 09:00 PM' },
    { category: 'Hazardous', fillPercent: 35, capacityKg: 80, status: 'NORMAL', lastEmptied: '16 Sep 2026, 11:00 AM' },
  ],
};

// Initial Notifications
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-01',
    title: 'Critical Water Level',
    message: 'DRN-042 water level reached 87% in Anna Nagar. Suction alert broadcasted.',
    type: 'CRITICAL',
    timestamp: '10:42 AM',
    read: false,
    drainId: 'DRN-042',
  },
  {
    id: 'NOTIF-02',
    title: 'Waste Load Warning',
    message: 'Drain DRN-018 waste load reached 76% in Velachery.',
    type: 'WARNING',
    timestamp: '09:15 AM',
    read: false,
    drainId: 'DRN-018',
  },
  {
    id: 'NOTIF-03',
    title: 'Task Completed',
    message: 'Worker WRK-004 completed task T-1038 at Pondy Bazaar drain.',
    type: 'INFO',
    timestamp: '08:45 AM',
    read: true,
    drainId: 'DRN-021',
  },
  {
    id: 'NOTIF-04',
    title: 'Drain Cleaned',
    message: 'Drain DRN-021 successfully cleaned and automated flow verified.',
    type: 'SUCCESS',
    timestamp: '08:40 AM',
    read: true,
    drainId: 'DRN-021',
  },
  {
    id: 'NOTIF-05',
    title: 'Bin Capacity Threshold',
    message: 'Non-Recyclable segregation bin reached 84% capacity. Collection truck dispatched.',
    type: 'WARNING',
    timestamp: '07:20 AM',
    read: true,
  },
];

// Recharts visualization datasets
export const ZONE_WATER_LEVEL_DATA = [
  { zone: 'Anna Nagar', avgLevel: 62, peakLevel: 87 },
  { zone: 'T. Nagar', avgLevel: 54, peakLevel: 79 },
  { zone: 'Velachery', avgLevel: 71, peakLevel: 89 },
  { zone: 'Adyar', avgLevel: 42, peakLevel: 68 },
  { zone: 'Guindy', avgLevel: 49, peakLevel: 74 },
  { zone: 'Tambaram', avgLevel: 58, peakLevel: 82 },
  { zone: 'Perambur', avgLevel: 64, peakLevel: 85 },
  { zone: 'Mylapore', avgLevel: 38, peakLevel: 60 },
  { zone: 'Kodambakkam', avgLevel: 51, peakLevel: 72 },
];

export const DAILY_WASTE_TREND_DATA = [
  { day: 'Mon', weightKg: 192 },
  { day: 'Tue', weightKg: 215 },
  { day: 'Wed', weightKg: 248 },
  { day: 'Thu', weightKg: 220 },
  { day: 'Fri', weightKg: 284 },
  { day: 'Sat', weightKg: 310 },
  { day: 'Sun', weightKg: 248 },
];

export const WASTE_COMPOSITION_DATA = [
  { name: 'Plastic', value: 44 },
  { name: 'Organic / Leaves', value: 31 },
  { name: 'Silt / Sludge', value: 16 },
  { name: 'Metallic / Other', value: 9 },
];

export const HOURLY_RAIN_FLOW_DATA = [
  { time: '06:00', rainfallMm: 8, flowRate: 1.2 },
  { time: '07:00', rainfallMm: 14, flowRate: 1.5 },
  { time: '08:00', rainfallMm: 28, flowRate: 2.3 },
  { time: '09:00', rainfallMm: 42, flowRate: 3.8 },
  { time: '10:00', rainfallMm: 35, flowRate: 3.4 },
  { time: '11:00', rainfallMm: 18, flowRate: 2.6 },
  { time: '12:00', rainfallMm: 10, flowRate: 1.9 },
];

export const ZONE_RISK_RADAR_DATA = [
  { metric: 'Sediment Silt', Velachery: 85, AnnaNagar: 60, TNagar: 72 },
  { metric: 'Plastic Load', Velachery: 90, AnnaNagar: 78, TNagar: 84 },
  { metric: 'Inundation Freq', Velachery: 92, AnnaNagar: 55, TNagar: 80 },
  { metric: 'Canal Gradient', Velachery: 30, AnnaNagar: 65, TNagar: 45 },
  { metric: 'Pump Resilience', Velachery: 70, AnnaNagar: 82, TNagar: 75 },
];

export const RECENT_CLASSIFICATION_LOGS = [
  {
    id: 'LOG-881',
    timestamp: '10:44 AM',
    drainId: 'DRN-042',
    detectedObject: 'PET Plastic Bottle (500ml)',
    confidence: 96.4,
    action: 'Diverted to Bin 1 (Recycle 0°)',
  },
  {
    id: 'LOG-880',
    timestamp: '10:42 AM',
    drainId: 'DRN-042',
    detectedObject: 'Neem & Palm Leaf Biomass',
    confidence: 94.2,
    action: 'Diverted to Bin 2 (Organic 90°)',
  },
  {
    id: 'LOG-879',
    timestamp: '10:39 AM',
    drainId: 'DRN-018',
    detectedObject: 'Coarse Sand Sludge Clump',
    confidence: 88.7,
    action: 'Chuted to Bin 3 (Silt Deflector)',
  },
  {
    id: 'LOG-878',
    timestamp: '10:35 AM',
    drainId: 'DRN-021',
    detectedObject: 'Aluminium Beverage Can',
    confidence: 97.1,
    action: 'Diverted to Bin 1 (Recycle 0°)',
  },
  {
    id: 'LOG-877',
    timestamp: '10:28 AM',
    drainId: 'DRN-003',
    detectedObject: 'Polythene Shopping Carrybag',
    confidence: 92.8,
    action: 'Diverted to Bin 1 (Recycle 0°)',
  },
];

