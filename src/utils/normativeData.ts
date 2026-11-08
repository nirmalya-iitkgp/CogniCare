/**
 * NeuroPulse Diagnostics - Normative Clinical Algorithms
 */

import { LifeStageId } from '../types/clinical';

export interface ClinicalNormBaseline {
  meanScore: number;
  stdDev: number;
  higherIsBetter: boolean;
  borderlineThreshold: number; // in standard deviations or z-score
  flaggedThreshold: number;
}

// Normative clinical references by test ID
export const CLINICAL_NORMS: Record<string, ClinicalNormBaseline> = {
  // Zone 1
  z1_bayley_touch: { meanScore: 82, stdDev: 10, higherIsBetter: true, borderlineThreshold: -1.0, flaggedThreshold: -2.0 },
  z1_fagan_novelty: { meanScore: 68, stdDev: 8, higherIsBetter: true, borderlineThreshold: -1.0, flaggedThreshold: -2.0 },
  z1_sound_hop: { meanScore: 88, stdDev: 7, higherIsBetter: true, borderlineThreshold: -1.0, flaggedThreshold: -2.0 },
  z1_object_permanence: { meanScore: 85, stdDev: 9, higherIsBetter: true, borderlineThreshold: -1.0, flaggedThreshold: -2.0 },

  // Zone 2
  z2_space_pilot: { meanScore: 2.8, stdDev: 0.5, higherIsBetter: true, borderlineThreshold: -1.2, flaggedThreshold: -2.0 },
  z2_ishihara_safari: { meanScore: 5.6, stdDev: 0.6, higherIsBetter: true, borderlineThreshold: -1.5, flaggedThreshold: -2.5 },
  z2_corsi_block: { meanScore: 4.8, stdDev: 0.8, higherIsBetter: true, borderlineThreshold: -1.2, flaggedThreshold: -2.0 },
  z2_beery_vmi: { meanScore: 84, stdDev: 9, higherIsBetter: true, borderlineThreshold: -1.0, flaggedThreshold: -2.0 },

  // Zone 3
  z3_rule_switcher: { meanScore: 180, stdDev: 45, higherIsBetter: false, borderlineThreshold: 1.2, flaggedThreshold: 2.0 },
  z3_pediatric_stroop: { meanScore: 165, stdDev: 35, higherIsBetter: false, borderlineThreshold: 1.2, flaggedThreshold: 2.0 },
  z3_tower_london: { meanScore: 1.2, stdDev: 0.8, higherIsBetter: false, borderlineThreshold: 1.2, flaggedThreshold: 2.2 },
  z3_benton_form: { meanScore: 88, stdDev: 8, higherIsBetter: true, borderlineThreshold: -1.0, flaggedThreshold: -2.0 },

  // Zone 4
  z4_impact_reflex: { meanScore: 260, stdDev: 40, higherIsBetter: false, borderlineThreshold: 1.3, flaggedThreshold: 2.2 },
  z4_pvt_speedometer: { meanScore: 1.2, stdDev: 1.0, higherIsBetter: false, borderlineThreshold: 1.5, flaggedThreshold: 2.5 },
  z4_iowa_gambling: { meanScore: 18, stdDev: 8, higherIsBetter: true, borderlineThreshold: -1.2, flaggedThreshold: -2.0 },
  z4_wcst_matrix: { meanScore: 12, stdDev: 5, higherIsBetter: false, borderlineThreshold: 1.2, flaggedThreshold: 2.0 },

  // Zone 5
  z5_phq9_rpg: { meanScore: 4.5, stdDev: 3.5, higherIsBetter: false, borderlineThreshold: 1.5, flaggedThreshold: 2.5 },
  z5_gad7_calm: { meanScore: 110, stdDev: 30, higherIsBetter: false, borderlineThreshold: 1.3, flaggedThreshold: 2.2 },
  z5_pasat_math: { meanScore: 82, stdDev: 11, higherIsBetter: true, borderlineThreshold: -1.0, flaggedThreshold: -2.0 },
  z5_sternberg_scan: { meanScore: 38, stdDev: 9, higherIsBetter: false, borderlineThreshold: 1.2, flaggedThreshold: 2.0 },

  // Zone 6
  z6_humphrey_perimetry: { meanScore: 29.5, stdDev: 2.0, higherIsBetter: true, borderlineThreshold: -1.2, flaggedThreshold: -2.2 },
  z6_cantab_rvp: { meanScore: 86, stdDev: 9, higherIsBetter: true, borderlineThreshold: -1.0, flaggedThreshold: -2.0 },
  z6_trail_making: { meanScore: 24.5, stdDev: 7.0, higherIsBetter: false, borderlineThreshold: 1.2, flaggedThreshold: 2.2 },
  z6_tone_tuner: { meanScore: 18, stdDev: 6, higherIsBetter: false, borderlineThreshold: 1.2, flaggedThreshold: 2.0 },

  // Zone 7
  z7_speed_tapper: { meanScore: 4.8, stdDev: 0.9, higherIsBetter: true, borderlineThreshold: -1.2, flaggedThreshold: -2.0 },
  z7_tremor_canvas: { meanScore: 4.2, stdDev: 1.5, higherIsBetter: false, borderlineThreshold: 1.2, flaggedThreshold: 2.2 },
  z7_moca_market: { meanScore: 26.5, stdDev: 2.5, higherIsBetter: true, borderlineThreshold: -1.0, flaggedThreshold: -2.0 },
  z7_clock_drawing: { meanScore: 9.1, stdDev: 1.1, higherIsBetter: true, borderlineThreshold: -1.2, flaggedThreshold: -2.0 }
};

/**
 * Standard normal cumulative distribution approximation (Abramowitz & Stegun)
 */
function normalCDF(z: number): number {
  const t = 1.0 / (1.0 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2.0);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1.0 - p : p;
}

/**
 * Calculate statistical percentiles and clinical interpretation
 */
export function evaluateClinicalScore(testId: string, rawScore: number): {
  percentile: number;
  status: 'Normal' | 'Borderline' | 'Flagged';
  notes: string;
} {
  const norm = CLINICAL_NORMS[testId] || {
    meanScore: 80,
    stdDev: 15,
    higherIsBetter: true,
    borderlineThreshold: -1.0,
    flaggedThreshold: -2.0
  };

  const rawZ = (rawScore - norm.meanScore) / (norm.stdDev || 1);
  const directionalZ = norm.higherIsBetter ? rawZ : -rawZ;

  // Convert Z-score to 1-99 percentile
  const cdf = normalCDF(directionalZ);
  const percentile = Math.min(99, Math.max(1, Math.round(cdf * 100)));

  let status: 'Normal' | 'Borderline' | 'Flagged' = 'Normal';
  let notes = 'Performance aligns within expected clinical normative variance.';

  if (norm.higherIsBetter) {
    if (rawZ <= norm.flaggedThreshold) {
      status = 'Flagged';
      notes = `Performance is below the -2.0 SD cutoff (${percentile}th percentile), suggesting potential deficit.`;
    } else if (rawZ <= norm.borderlineThreshold) {
      status = 'Borderline';
      notes = `Performance is between -1.0 and -2.0 SD (${percentile}th percentile), warranting monitoring.`;
    }
  } else {
    if (rawZ >= norm.flaggedThreshold) {
      status = 'Flagged';
      notes = `Metrics exceed the clinical threshold (${percentile}th percentile), indicating elevated latency/errors.`;
    } else if (rawZ >= norm.borderlineThreshold) {
      status = 'Borderline';
      notes = `Metrics are mildly elevated (${percentile}th percentile), suggestive of sub-optimal efficiency.`;
    }
  }

  return { percentile, status, notes };
}

/**
 * Compute array statistics
 */
export function computeLatencyStats(latencies: number[]): {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
} {
  if (latencies.length === 0) {
    return { mean: 0, median: 0, stdDev: 0, min: 0, max: 0 };
  }

  const sorted = [...latencies].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, val) => acc + val, 0);
  const mean = Math.round(sum / sorted.length);

  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);

  const variance = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / sorted.length;
  const stdDev = Math.round(Math.sqrt(variance));

  return {
    mean,
    median,
    stdDev,
    min: sorted[0],
    max: sorted[sorted.length - 1]
  };
}
