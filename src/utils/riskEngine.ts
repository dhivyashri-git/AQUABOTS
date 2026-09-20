import { DrainStatus, SystemThresholds } from '../types';

export const DEFAULT_THRESHOLDS: SystemThresholds = {
  waterWarning: 70,
  waterCritical: 85,
  binWarning: 80,
  wasteBlockage: 80,
  floodRisk: 90,
  soundAlerts: true,
  pushNotifications: true,
};

export function evaluateDrainStatus(
  waterLevel: number,
  wasteLoad: number,
  thresholds: SystemThresholds = DEFAULT_THRESHOLDS
): DrainStatus {
  if (waterLevel >= thresholds.waterCritical || wasteLoad >= thresholds.wasteBlockage) {
    return 'critical';
  }
  if (waterLevel >= thresholds.waterWarning || wasteLoad >= 60) {
    return 'warning';
  }
  return 'normal';
}

export function calculateRiskScore(
  waterLevel: number,
  wasteLoad: number,
  flowRate: number,
  historicalBlockages = 2
): number {
  // Weighted algorithmic formula
  const waterFactor = (waterLevel / 100) * 0.45;
  const wasteFactor = (wasteLoad / 100) * 0.35;
  const flowFactor = flowRate < 1.0 ? 0.15 : (3 - Math.min(flowRate, 3)) / 3 * 0.1;
  const histFactor = (Math.min(historicalBlockages, 5) / 5) * 0.1;

  const score = Math.round((waterFactor + wasteFactor + flowFactor + histFactor) * 100);
  return Math.min(Math.max(score, 5), 99);
}

export function checkDrainAlerts(
  drainId: string,
  waterLevel: number,
  wasteLoad: number,
  thresholds: SystemThresholds = DEFAULT_THRESHOLDS
): { isAlert: boolean; type: 'CRITICAL' | 'WARNING' | 'INFO'; message: string } | null {
  if (waterLevel >= thresholds.floodRisk) {
    return {
      isAlert: true,
      type: 'CRITICAL',
      message: `CRITICAL FLOOD RISK: ${drainId} water level reached ${waterLevel}%! Immediate evacuation and sluice activation recommended.`,
    };
  }
  if (waterLevel >= thresholds.waterCritical) {
    return {
      isAlert: true,
      type: 'CRITICAL',
      message: `CRITICAL: ${drainId} water level reached ${waterLevel}% (threshold ${thresholds.waterCritical}%). Automated removal mechanism primed.`,
    };
  }
  if (wasteLoad >= thresholds.wasteBlockage) {
    return {
      isAlert: true,
      type: 'WARNING',
      message: `BLOCKAGE WARNING: Drain ${drainId} waste load reached ${wasteLoad}%. Mesh lift cycle initiated.`,
    };
  }
  if (waterLevel >= thresholds.waterWarning) {
    return {
      isAlert: true,
      type: 'WARNING',
      message: `WARNING: Drain ${drainId} water level elevated at ${waterLevel}%. Monitoring sensor telemetry.`,
    };
  }
  return null;
}
