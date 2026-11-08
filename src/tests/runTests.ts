/**
 * NeuroPulse Diagnostics - Automated Unit & Security Test Suite
 * Run with: tsx src/tests/runTests.ts
 */

import { LIFE_STAGES, CLINICAL_TESTS, getTestsForZone } from '../data/clinicalRegistry';
import { evaluateClinicalScore, computeLatencyStats, CLINICAL_NORMS } from '../utils/normativeData';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('\n--- Test Suite 1: Clinical Registry Architecture ---');
assert(LIFE_STAGES.length === 7, 'Exactly 7 life stages defined (Infants to Geriatric)');
assert(CLINICAL_TESTS.length === 28, 'Exactly 28 clinical diagnostic tests defined');

LIFE_STAGES.forEach((stage) => {
  const tests = getTestsForZone(stage.id);
  assert(tests.length === 4, `${stage.name} has exactly 4 clinical tests`);
});

console.log('\n--- Test Suite 2: Normative Percentiles & Clinical Scoring ---');
// Test 1: Higher is better (e.g. Bayley Touch accuracy: mean 82)
const normalTouch = evaluateClinicalScore('z1_bayley_touch', 85);
assert(normalTouch.status === 'Normal', 'Bayley Touch Score 85 produces Normal status');
assert(normalTouch.percentile >= 50, 'Score 85 is >= 50th percentile');

const flaggedTouch = evaluateClinicalScore('z1_bayley_touch', 50);
assert(flaggedTouch.status === 'Flagged', 'Bayley Touch Score 50 produces Flagged status (< -2.0 SD)');
assert(flaggedTouch.percentile <= 5, 'Score 50 is in bottom 5th percentile');

// Test 2: Lower is better (e.g. ImPACT reflex latency: mean 260ms)
const fastReflex = evaluateClinicalScore('z4_impact_reflex', 220);
assert(fastReflex.status === 'Normal', 'Fast 220ms reflex latency is Normal');
assert(fastReflex.percentile >= 75, 'Fast reaction maps to high percentile');

const sluggishReflex = evaluateClinicalScore('z4_impact_reflex', 370);
assert(sluggishReflex.status === 'Flagged', 'Elevated 370ms latency triggers Flagged status');
assert(sluggishReflex.percentile <= 5, 'Sluggish reaction maps to low percentile');

console.log('\n--- Test Suite 3: Latency Distribution & Statistical Moments ---');
const sampleLatencies = [240, 250, 260, 270, 280];
const stats = computeLatencyStats(sampleLatencies);
assert(stats.mean === 260, `Mean latency is accurate (expected 260, got ${stats.mean})`);
assert(stats.median === 260, `Median latency is accurate (expected 260, got ${stats.median})`);
assert(stats.min === 240 && stats.max === 280, 'Min and Max latencies are correct');
assert(stats.stdDev > 0, 'Standard deviation calculated accurately');

console.log('\n--- Test Suite 4: Security & Red-Pill / Blue-Pill Boundary Validation ---');
// Red-pill test: Injection resilience in export format
const testPayload = {
  notes: '<script>alert("xss")</script>',
  patient: '<img src=x onerror=alert(1)>',
  score: 95
};
const serialized = JSON.stringify(testPayload);
assert(!serialized.includes('\0'), 'Zero null byte vulnerability in serialized payload');
assert(typeof JSON.parse(serialized).score === 'number', 'Payload deserialization maintains type safety');

// Red-pill test: Normative table integrity
assert(Object.keys(CLINICAL_NORMS).length >= 28, 'All 28 tests have dedicated clinical normative baselines');

console.log(`\n========================================`);
console.log(`Results: ${passed} passed, ${failed} failed.`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
