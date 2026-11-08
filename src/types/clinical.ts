/**
 * NeuroPulse Diagnostics - Core Types
 */

export type LifeStageId = 'stage1' | 'stage2' | 'stage3' | 'stage4' | 'stage5' | 'stage6' | 'stage7';

export interface LifeStageInfo {
  id: LifeStageId;
  name: string;
  ageBracket: string;
  subtitle: string;
  accentColor: string;
  imageUrl?: string;
}

export interface ClinicalTestDef {
  id: string;
  stageId: LifeStageId;
  zoneId?: LifeStageId;
  name: string;
  clinicalTest: string;
  shortDesc: string;
  primaryMetric: string;
  unit: string;
  defaultDurationSec: number;
}

export interface TestResultData {
  testId: string;
  testName: string;
  clinicalTest: string;
  stageId: LifeStageId;
  zoneId?: LifeStageId;
  timestamp: number;
  durationMs: number;
  primaryScore: number;
  primaryMetric: string;
  unit: string;
  latencies: number[];
  meanLatencyMs: number;
  medianLatencyMs: number;
  accuracyPercent: number;
  omissionErrors?: number;
  commissionErrors?: number;
  tremorFrequencyHz?: number;
  varianceScore?: number;
  percentileRank: number;
  clinicalStatus: 'Normal' | 'Borderline' | 'Flagged';
  notes: string;
}
