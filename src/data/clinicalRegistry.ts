import { LifeStageInfo, ClinicalTestDef, LifeStageId } from '../types/clinical';

export const LIFE_STAGES: LifeStageInfo[] = [
  {
    id: 'stage1',
    name: 'Infants',
    ageBracket: '0–3 years',
    subtitle: 'Motor & Sensory',
    accentColor: '#0d9488',
    imageUrl: '/heroes/infant.jpg'
  },
  {
    id: 'stage2',
    name: 'Toddlers',
    ageBracket: '4–6 years',
    subtitle: 'Focus & Vision',
    accentColor: '#d97706',
    imageUrl: '/heroes/child.jpg'
  },
  {
    id: 'stage3',
    name: 'Children',
    ageBracket: '7–12 years',
    subtitle: 'Thinking & Rules',
    accentColor: '#2563eb',
    imageUrl: '/heroes/school.jpg'
  },
  {
    id: 'stage4',
    name: 'Teens',
    ageBracket: '13–18 years',
    subtitle: 'Speed & Reflexes',
    accentColor: '#7c3aed',
    imageUrl: '/heroes/teen.jpg'
  },
  {
    id: 'stage5',
    name: 'Young Adults',
    ageBracket: '19–30 years',
    subtitle: 'Memory & Stress',
    accentColor: '#059669',
    imageUrl: '/heroes/young_adult.jpg'
  },
  {
    id: 'stage6',
    name: 'Adults',
    ageBracket: '31–60 years',
    subtitle: 'Attention & Vision',
    accentColor: '#4f46e5',
    imageUrl: '/heroes/adult.jpg'
  },
  {
    id: 'stage7',
    name: 'Seniors',
    ageBracket: '61+ years',
    subtitle: 'Motor & Recall',
    accentColor: '#e11d48',
    imageUrl: '/heroes/senior.jpg'
  }
];

export const CLINICAL_TESTS: ClinicalTestDef[] = [
  // Stage 1: Infants (0–3 yrs)
  {
    id: 'z1_bayley_touch',
    stageId: 'stage1',
    name: 'Tiny Touch',
    clinicalTest: 'Bayley Scales (Fine Motor)',
    shortDesc: 'Tap moving targets to measure hand-eye coordination.',
    primaryMetric: 'Accuracy',
    unit: '%',
    defaultDurationSec: 25
  },
  {
    id: 'z1_fagan_novelty',
    stageId: 'stage1',
    name: 'Novelty Peek',
    clinicalTest: 'Fagan Test (Visual Memory)',
    shortDesc: 'Pick the new pattern to measure visual interest.',
    primaryMetric: 'Novelty Score',
    unit: '%',
    defaultDurationSec: 20
  },
  {
    id: 'z1_sound_hop',
    stageId: 'stage1',
    name: 'Sound Hop',
    clinicalTest: 'Audiometry (Sound Direction)',
    shortDesc: 'Listen through headphones and tap left or right.',
    primaryMetric: 'Hearing Accuracy',
    unit: '%',
    defaultDurationSec: 20
  },
  {
    id: 'z1_object_permanence',
    stageId: 'stage1',
    name: 'Hide & Seek',
    clinicalTest: 'Object Permanence Test',
    shortDesc: 'Track where the hidden item slides under the boxes.',
    primaryMetric: 'Recall Score',
    unit: 'pts',
    defaultDurationSec: 20
  },

  // Stage 2: Toddlers (4–6 yrs)
  {
    id: 'z2_space_pilot',
    stageId: 'stage2',
    name: 'Space Pilot',
    clinicalTest: 'TOVA / CPT (Impulse Control)',
    shortDesc: 'Tap enemy targets and hold back on friendly units.',
    primaryMetric: 'Focus Score',
    unit: 'pts',
    defaultDurationSec: 25
  },
  {
    id: 'z2_ishihara_safari',
    stageId: 'stage2',
    name: 'Color Safari',
    clinicalTest: 'Ishihara Color Plates',
    shortDesc: 'Find hidden numbers in colorful dot plates.',
    primaryMetric: 'Correct Plates',
    unit: '/ 6',
    defaultDurationSec: 25
  },
  {
    id: 'z2_corsi_block',
    stageId: 'stage2',
    name: 'Pattern Simon',
    clinicalTest: 'Corsi Block Test (Memory Span)',
    shortDesc: 'Watch the tiles flash and repeat the order.',
    primaryMetric: 'Max Span',
    unit: 'tiles',
    defaultDurationSec: 30
  },
  {
    id: 'z2_beery_vmi',
    stageId: 'stage2',
    name: 'Tracing Master',
    clinicalTest: 'Beery VMI (Tracing Precision)',
    shortDesc: 'Trace shapes cleanly with mouse or finger.',
    primaryMetric: 'Precision',
    unit: '%',
    defaultDurationSec: 25
  },

  // Stage 3: Children (7–12 yrs)
  {
    id: 'z3_rule_switcher',
    stageId: 'stage3',
    name: 'Rule Switcher',
    clinicalTest: 'DCCS (Cognitive Flexibility)',
    shortDesc: 'Sort cards when the rule switches from color to shape.',
    primaryMetric: 'Adaptation Speed',
    unit: 'ms',
    defaultDurationSec: 25
  },
  {
    id: 'z3_pediatric_stroop',
    stageId: 'stage3',
    name: 'Color Clash',
    clinicalTest: 'Stroop Test (Word vs Color)',
    shortDesc: 'Tap the ink color, ignoring what the word spells.',
    primaryMetric: 'Reaction Speed',
    unit: 'ms',
    defaultDurationSec: 25
  },
  {
    id: 'z3_tower_london',
    stageId: 'stage3',
    name: 'Block Stacker',
    clinicalTest: 'Tower of London (Planning)',
    shortDesc: 'Move pegs to match the target in the fewest moves.',
    primaryMetric: 'Move Efficiency',
    unit: 'moves',
    defaultDurationSec: 35
  },
  {
    id: 'z3_benton_form',
    stageId: 'stage3',
    name: 'Shape Matcher',
    clinicalTest: 'Benton Discrimination Test',
    shortDesc: 'Identify the exact matching shape from 4 choices.',
    primaryMetric: 'Accuracy',
    unit: '%',
    defaultDurationSec: 25
  },

  // Stage 4: Teens (13–18 yrs)
  {
    id: 'z4_impact_reflex',
    stageId: 'stage4',
    name: 'Reflex Grid',
    clinicalTest: 'ImPACT (Reaction Baseline)',
    shortDesc: 'Match symbols to numbers as quickly as possible.',
    primaryMetric: 'Reaction Time',
    unit: 'ms',
    defaultDurationSec: 25
  },
  {
    id: 'z4_pvt_speedometer',
    stageId: 'stage4',
    name: 'Speedometer',
    clinicalTest: 'PVT (Vigilance & Attention)',
    shortDesc: 'Hit spacebar the millisecond the counter starts.',
    primaryMetric: 'Lapse Count',
    unit: 'lapses',
    defaultDurationSec: 30
  },
  {
    id: 'z4_iowa_gambling',
    stageId: 'stage4',
    name: 'Card Decks',
    clinicalTest: 'Iowa Gambling Task (Risk vs Reward)',
    shortDesc: 'Pick from 4 decks to build your bankroll.',
    primaryMetric: 'Decision Score',
    unit: 'pts',
    defaultDurationSec: 30
  },
  {
    id: 'z4_wcst_matrix',
    stageId: 'stage4',
    name: 'Logic Matrix',
    clinicalTest: 'Wisconsin Card Sorting',
    shortDesc: 'Sort cards by learning the secret shifting rule.',
    primaryMetric: 'Sorting Accuracy',
    unit: '%',
    defaultDurationSec: 30
  },

  // Stage 5: Young Adults (19–30 yrs)
  {
    id: 'z5_phq9_rpg',
    stageId: 'stage5',
    name: 'Life Canvas',
    clinicalTest: 'PHQ-9 (Mood & Energy Check)',
    shortDesc: 'Answer quick daily scenario choices.',
    primaryMetric: 'Mood Index',
    unit: '/ 27',
    defaultDurationSec: 30
  },
  {
    id: 'z5_gad7_calm',
    stageId: 'stage5',
    name: 'Calm State',
    clinicalTest: 'GAD-7 (Pressure & Focus)',
    shortDesc: 'Solve quick timed puzzles before the bar runs out.',
    primaryMetric: 'Hesitation Spike',
    unit: 'ms',
    defaultDurationSec: 30
  },
  {
    id: 'z5_pasat_math',
    stageId: 'stage5',
    name: 'Rhythm Math',
    clinicalTest: 'PASAT (Auditory Memory)',
    shortDesc: 'Listen to spoken numbers and enter the running sum.',
    primaryMetric: 'Sum Accuracy',
    unit: '%',
    defaultDurationSec: 30
  },
  {
    id: 'z5_sternberg_scan',
    stageId: 'stage5',
    name: 'Memory Scan',
    clinicalTest: 'Sternberg Task (Search Speed)',
    shortDesc: 'Memorize digits and decide if the target was present.',
    primaryMetric: 'Scan Speed',
    unit: 'ms',
    defaultDurationSec: 30
  },

  // Stage 6: Adults (31–60 yrs)
  {
    id: 'z6_humphrey_perimetry',
    stageId: 'stage6',
    name: 'Star Field',
    clinicalTest: 'Humphrey Perimetry (Visual Field)',
    shortDesc: 'Watch the center cross and click when flashes appear.',
    primaryMetric: 'Field Sensitivity',
    unit: 'dB',
    defaultDurationSec: 30
  },
  {
    id: 'z6_cantab_rvp',
    stageId: 'stage6',
    name: 'Radar Operator',
    clinicalTest: 'CANTAB RVP (Sustained Vigilance)',
    shortDesc: 'Catch the 3-5-7 sequence in a streaming number line.',
    primaryMetric: 'Sequence Accuracy',
    unit: '%',
    defaultDurationSec: 30
  },
  {
    id: 'z6_trail_making',
    stageId: 'stage6',
    name: 'Pathfinder',
    clinicalTest: 'Trail Making Test A & B',
    shortDesc: 'Connect targets alternating 1 -> A -> 2 -> B -> 3 -> C.',
    primaryMetric: 'Switching Time',
    unit: 's',
    defaultDurationSec: 30
  },
  {
    id: 'z6_tone_tuner',
    stageId: 'stage6',
    name: 'Tone Tuner',
    clinicalTest: 'Pure-Tone Hearing Test',
    shortDesc: 'Test hearing across frequencies with soft sine waves.',
    primaryMetric: 'Hearing Threshold',
    unit: 'dB HL',
    defaultDurationSec: 30
  },

  // Stage 7: Seniors (61+ yrs)
  {
    id: 'z7_speed_tapper',
    stageId: 'stage7',
    name: 'Speed Tapper',
    clinicalTest: 'Finger Tapping Test (Motor Speed)',
    shortDesc: 'Tap as fast as you can in 10 seconds.',
    primaryMetric: 'Tap Speed',
    unit: 'taps/s',
    defaultDurationSec: 15
  },
  {
    id: 'z7_tremor_canvas',
    stageId: 'stage7',
    name: 'Steady Hand',
    clinicalTest: 'Tremor Rating Scale',
    shortDesc: 'Trace the spiral track to check hand steadiness.',
    primaryMetric: 'Steadiness Score',
    unit: 'pts',
    defaultDurationSec: 20
  },
  {
    id: 'z7_moca_market',
    stageId: 'stage7',
    name: 'Market Manager',
    clinicalTest: 'MoCA Everyday Memory Screen',
    shortDesc: 'Recall groceries and calculate change.',
    primaryMetric: 'Recall Score',
    unit: '/ 30',
    defaultDurationSec: 35
  },
  {
    id: 'z7_clock_drawing',
    stageId: 'stage7',
    name: 'Clock Drawing',
    clinicalTest: 'Clock Drawing Test (Executive)',
    shortDesc: 'Draw a clock face pointing to 10 past 11.',
    primaryMetric: 'Drawing Score',
    unit: '/ 10',
    defaultDurationSec: 30
  }
];

export function getTestsForStage(stageId: LifeStageId): ClinicalTestDef[] {
  return CLINICAL_TESTS.filter(t => t.stageId === stageId);
}

export const getTestsForZone = getTestsForStage;

export function getTestById(testId: string): ClinicalTestDef | undefined {
  return CLINICAL_TESTS.find(t => t.id === testId);
}
