import { WorkerSession } from '../types';

const WORKER_SESSION_KEY = 'cityhealth_worker_session';

export function generateWorkerSessionToken(workerId: string, workerName: string): WorkerSession {
  const chars = '0123456789ABCDEF';
  let randomHex = '';
  for (let i = 0; i < 8; i++) {
    randomHex += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const token = `WF-WRK-${randomHex}`;
  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;

  const session: WorkerSession = {
    workerId,
    workerName,
    token,
    loginTime: now,
    expiryTime: now + twentyFourHours,
  };

  try {
    localStorage.setItem(WORKER_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save worker session to localStorage', err);
  }

  return session;
}

export function getStoredWorkerSession(): WorkerSession | null {
  try {
    const raw = localStorage.getItem(WORKER_SESSION_KEY);
    if (!raw) return null;
    const session: WorkerSession = JSON.parse(raw);
    if (Date.now() > session.expiryTime) {
      localStorage.removeItem(WORKER_SESSION_KEY);
      return null;
    }
    return session;
  } catch (err) {
    return null;
  }
}

export function clearWorkerSession(): void {
  try {
    localStorage.removeItem(WORKER_SESSION_KEY);
  } catch (err) {
    // ignore
  }
}

export function formatTimeRemaining(expiryTime: number): string {
  const diffMs = expiryTime - Date.now();
  if (diffMs <= 0) return 'Expired';
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}
