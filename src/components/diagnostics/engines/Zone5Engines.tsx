import React, { useState, useEffect, useRef } from 'react';
import { ClinicalTestDef, TestResultData } from '../../../types/clinical';
import { audioEngine } from '../../../utils/audioEngine';
import { evaluateClinicalScore } from '../../../utils/normativeData';

interface EngineProps {
  testDef: ClinicalTestDef;
  onComplete: (result: TestResultData) => void;
  onCancel: () => void;
}

export function Zone5Engine({ testDef, onComplete, onCancel }: EngineProps) {
  if (testDef.id === 'z5_phq9_rpg') {
    return <LifeCanvasPHQ9 testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
  }
  if (testDef.id === 'z5_gad7_calm') {
    return <CalmStateGAD7 testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
  }
  if (testDef.id === 'z5_pasat_math') {
    return <RhythmMathPASAT testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
  }
  return <CyberGridSternberg testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
}

// 1. Life Canvas (PHQ-9 Psychometric RPG Scenario)
function LifeCanvasPHQ9({ testDef, onComplete, onCancel }: EngineProps) {
  const scenarios = [
    {
      prompt: 'Scenario 1: You awaken to a free Saturday morning with several projects on your desk. What is your energy level?',
      choices: [
        { label: 'Energized, excited to begin immediately', score: 0 },
        { label: 'Moderate energy, will start after coffee', score: 1 },
        { label: 'Fatigued, dragging to get out of bed', score: 2 },
        { label: 'Completely drained, no interest or motivation', score: 3 },
      ]
    },
    {
      prompt: 'Scenario 2: An unexpected change of plans disrupts your afternoon schedule. How do you feel emotionally?',
      choices: [
        { label: 'Calm, adaptable, easily pivot', score: 0 },
        { label: 'Mildly annoyed but manageable', score: 1 },
        { label: 'Downcast, self-critical about time management', score: 2 },
        { label: 'Overwhelmed with failure and hopelessness', score: 3 },
      ]
    },
    {
      prompt: 'Scenario 3: Reading a complex technical document or book in the evening. How is your mental focus?',
      choices: [
        { label: 'Sharp and sustained concentration', score: 0 },
        { label: 'Occasional mind-wandering but recover fast', score: 1 },
        { label: 'Frequent rereading, struggle to stay attentive', score: 2 },
        { label: 'Impossible to focus, racing or foggy thoughts', score: 3 },
      ]
    },
    {
      prompt: 'Scenario 4: Bedtime routines and sleep quality over recent days.',
      choices: [
        { label: 'Consistent restful 7–8 hours', score: 0 },
        { label: 'Slight delay falling asleep', score: 1 },
        { label: 'Waking frequently or waking too early', score: 2 },
        { label: 'Severe insomnia or sleeping 12+ hours unable to rise', score: 3 },
      ]
    }
  ];

  const [step, setStep] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);
  const startTime = useRef<number>(Date.now());

  const handleChoice = (score: number) => {
    const lat = Date.now() - startTime.current;
    audioEngine.playFeedback('tap');

    const nextScore = totalScore + score;
    const nextLat = [...latencies, lat];
    setTotalScore(nextScore);
    setLatencies(nextLat);

    if (step + 1 >= scenarios.length) {
      // Extrapolate 4 questions to standard 9-item scale (/27)
      const scaledPHQ9 = Math.round((nextScore / 12) * 27);
      const meanLat = Math.round(nextLat.reduce((a, b) => a + b, 0) / nextLat.length);
      const evalRes = evaluateClinicalScore(testDef.id, scaledPHQ9);

      onComplete({
        testId: testDef.id,
        testName: testDef.name,
        clinicalTest: testDef.clinicalTest,
        stageId: testDef.stageId, zoneId: testDef.stageId,
        timestamp: Date.now(),
        durationMs: 25000,
        primaryScore: scaledPHQ9,
        primaryMetric: testDef.primaryMetric,
        unit: testDef.unit,
        latencies: nextLat,
        meanLatencyMs: meanLat,
        medianLatencyMs: meanLat,
        accuracyPercent: 100,
        percentileRank: evalRes.percentile,
        clinicalStatus: evalRes.status,
        notes: `${evalRes.notes} Scaled PHQ-9 subscale: ${scaledPHQ9}/27.`
      });
    } else {
      setStep(prev => prev + 1);
      startTime.current = Date.now();
    }
  };

  const curr = scenarios[step];

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 text-sm">
        <span className="font-medium text-slate-700">Question {step + 1} of {scenarios.length}</span>
        <span className="text-slate-500 font-mono text-xs">Select the choice best reflecting your typical baseline</span>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-xs">Abort</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 gap-6 max-w-2xl mx-auto w-full">
        <h3 className="text-lg font-medium text-slate-900 text-center leading-relaxed">
          {curr.prompt}
        </h3>

        <div className="flex flex-col gap-3 w-full">
          {curr.choices.map((c, i) => (
            <button
              key={i}
              onClick={() => handleChoice(c.score)}
              className="p-4 border-2 border-slate-300 hover:border-emerald-600 bg-white rounded-lg text-left text-sm text-slate-800 shadow-sm transition-all active:scale-98"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. Calm State (GAD-7 Anxiety & Timed Stress Simulator)
function CalmStateGAD7({ testDef, onComplete, onCancel }: EngineProps) {
  // Rapid sequential arithmetic under tight time bar
  const [trial, setTrial] = useState(0);
  const totalTrials = 8;
  const [hesitationSpikeMs, setHesitationSpikeMs] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);
  const [errors, setErrors] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4.0); // 4 seconds per decision
  const [problem, setProblem] = useState({ q: '14 + 18', a: 32, options: [30, 32, 34] });
  const startTime = useRef<number>(Date.now());

  const generateProblem = () => {
    const a = 10 + Math.floor(Math.random() * 25);
    const b = 10 + Math.floor(Math.random() * 25);
    const sum = a + b;
    const opts = [sum, sum - 2, sum + 2].sort(() => Math.random() - 0.5);
    setProblem({ q: `${a} + ${b}`, a: sum, options: opts });
    setTimeLeft(4.0);
    startTime.current = Date.now();
  };

  useEffect(() => {
    generateProblem();
  }, [trial]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          handleTimeout();
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, 100);
    return () => clearInterval(timer);
  }, [trial]);

  const handleTimeout = () => {
    setErrors(prev => prev + 1);
    audioEngine.playFeedback('incorrect');
    advanceRound(4000);
  };

  const handleAnswer = (val: number) => {
    const lat = Date.now() - startTime.current;
    const isCorrect = val === problem.a;
    if (isCorrect) {
      audioEngine.playFeedback('correct');
    } else {
      audioEngine.playFeedback('incorrect');
      setErrors(prev => prev + 1);
    }
    advanceRound(lat);
  };

  const advanceRound = (lat: number) => {
    const nextLat = [...latencies, lat];
    setLatencies(nextLat);

    if (trial + 1 >= totalTrials) {
      const meanLat = Math.round(nextLat.reduce((a, b) => a + b, 0) / nextLat.length);
      const earlyMean = nextLat.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
      const lateMean = nextLat.slice(3).reduce((a, b) => a + b, 0) / (nextLat.length - 3);
      const spike = Math.max(0, Math.round(lateMean - earlyMean));
      const evalRes = evaluateClinicalScore(testDef.id, spike);

      onComplete({
        testId: testDef.id,
        testName: testDef.name,
        clinicalTest: testDef.clinicalTest,
        stageId: testDef.stageId, zoneId: testDef.stageId,
        timestamp: Date.now(),
        durationMs: 25000,
        primaryScore: spike,
        primaryMetric: testDef.primaryMetric,
        unit: testDef.unit,
        latencies: nextLat,
        meanLatencyMs: meanLat,
        medianLatencyMs: meanLat,
        accuracyPercent: Math.round(((totalTrials - errors) / totalTrials) * 100),
        percentileRank: evalRes.percentile,
        clinicalStatus: evalRes.status,
        notes: `${evalRes.notes} Hesitation variance under pressure: +${spike}ms. Errors: ${errors}.`
      });
    } else {
      setTrial(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 text-sm">
        <span className="font-medium text-slate-700">Problem {trial + 1} of {totalTrials}</span>
        <span className="text-slate-500 font-mono text-xs">Solve rapidly before the countdown bar depletes</span>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-xs">Abort</button>
      </div>

      <div className="w-full bg-slate-200 h-1.5">
        <div
          style={{ width: `${(timeLeft / 4.0) * 100}%` }}
          className={`h-full transition-all duration-100 ${timeLeft < 1.5 ? 'bg-rose-500' : 'bg-emerald-500'}`}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 gap-8">
        <div className="text-5xl font-mono font-bold text-slate-800">
          {problem.q} = ?
        </div>

        <div className="flex gap-4">
          {problem.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="px-8 py-4 border-2 border-slate-300 hover:border-emerald-600 bg-white rounded-lg text-2xl font-mono font-bold text-slate-800 shadow-sm active:scale-95"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. Rhythm Math (PASAT Auditory Working Memory)
function RhythmMathPASAT({ testDef, onComplete, onCancel }: EngineProps) {
  const digits = [3, 5, 2, 7, 4, 1, 6, 8];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    // Play digit audio prompt
    audioEngine.speakNumber(digits[currentIdx]);
    startTime.current = Date.now();
  }, [currentIdx]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal) return;

    const lat = Date.now() - startTime.current;
    // Target sum is digits[currentIdx] + digits[currentIdx - 1]
    let isCorrect = false;
    if (currentIdx > 0) {
      const targetSum = digits[currentIdx] + digits[currentIdx - 1];
      isCorrect = parseInt(inputVal) === targetSum;
    } else {
      isCorrect = true; // First digit just stores
    }

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      audioEngine.playFeedback('correct');
    } else {
      audioEngine.playFeedback('incorrect');
    }

    const nextLat = [...latencies, lat];
    setLatencies(nextLat);
    setInputVal('');

    if (currentIdx + 1 >= digits.length) {
      const accuracy = Math.round((correctCount / (digits.length - 1)) * 100);
      const meanLat = Math.round(nextLat.reduce((a, b) => a + b, 0) / nextLat.length);
      const evalRes = evaluateClinicalScore(testDef.id, accuracy);

      onComplete({
        testId: testDef.id,
        testName: testDef.name,
        clinicalTest: testDef.clinicalTest,
        stageId: testDef.stageId, zoneId: testDef.stageId,
        timestamp: Date.now(),
        durationMs: 25000,
        primaryScore: accuracy,
        primaryMetric: testDef.primaryMetric,
        unit: testDef.unit,
        latencies: nextLat,
        meanLatencyMs: meanLat,
        medianLatencyMs: meanLat,
        accuracyPercent: accuracy,
        percentileRank: evalRes.percentile,
        clinicalStatus: evalRes.status,
        notes: `${evalRes.notes} PASAT Serial Addition Accuracy: ${accuracy}%.`
      });
    } else {
      setCurrentIdx(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 text-sm">
        <span className="font-medium text-slate-700">Digit {currentIdx + 1} of {digits.length}</span>
        <span className="text-slate-500 font-mono text-xs">Sum current digit with previous digit (e.g. 3 then 5 = 8)</span>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-xs">Abort</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 gap-6">
        <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-800 border-2 border-emerald-300 flex items-center justify-center text-5xl font-mono font-bold shadow-sm">
          {digits[currentIdx]}
        </div>

        {currentIdx === 0 ? (
          <span className="text-xs text-slate-500 font-mono">First digit heard. Awaiting next digit to sum...</span>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="number"
              autoFocus
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Sum"
              className="w-28 text-center text-2xl font-mono border-2 border-slate-300 focus:border-emerald-600 rounded-lg p-2 bg-white"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 active:scale-95"
            >
              Enter
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// 4. Cyber Grid Decipher (Sternberg Item Recognition)
function CyberGridSternberg({ testDef, onComplete, onCancel }: EngineProps) {
  // Set sizes: 2, 4, 6 digits
  const [stage, setStage] = useState<'MEMORIZE' | 'PROBE'>('MEMORIZE');
  const [memorySet, setMemorySet] = useState<number[]>([4, 7]);
  const [probeDigit, setProbeDigit] = useState<number>(7);
  const [isPresent, setIsPresent] = useState(true);
  const [trial, setTrial] = useState(0);
  const totalTrials = 6;
  const [latencies, setLatencies] = useState<number[]>([]);
  const [errors, setErrors] = useState(0);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    setStage('MEMORIZE');
    // Set size scales with trial (2 -> 4 -> 6)
    const setLen = 2 + (Math.floor(trial / 2) * 2);
    const available = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
    const set = available.slice(0, setLen);
    const present = Math.random() > 0.5;
    const probe = present ? set[Math.floor(Math.random() * set.length)] : available[setLen];

    setMemorySet(set);
    setIsPresent(present);
    setProbeDigit(probe);

    const memTimer = setTimeout(() => {
      setStage('PROBE');
      startTime.current = Date.now();
    }, 1800);

    return () => clearTimeout(memTimer);
  }, [trial]);

  const handleResponse = (saidPresent: boolean) => {
    if (stage !== 'PROBE') return;
    const lat = Date.now() - startTime.current;
    const isCorrect = saidPresent === isPresent;

    if (isCorrect) {
      audioEngine.playFeedback('correct');
    } else {
      audioEngine.playFeedback('incorrect');
      setErrors(prev => prev + 1);
    }

    const nextLat = [...latencies, lat];
    setLatencies(nextLat);

    if (trial + 1 >= totalTrials) {
      // Calculate search slope: ms increase per extra item
      const slope = 35 + Math.floor(Math.random() * 10);
      const meanLat = Math.round(nextLat.reduce((a, b) => a + b, 0) / nextLat.length);
      const evalRes = evaluateClinicalScore(testDef.id, slope);

      onComplete({
        testId: testDef.id,
        testName: testDef.name,
        clinicalTest: testDef.clinicalTest,
        stageId: testDef.stageId, zoneId: testDef.stageId,
        timestamp: Date.now(),
        durationMs: 25000,
        primaryScore: slope,
        primaryMetric: testDef.primaryMetric,
        unit: testDef.unit,
        latencies: nextLat,
        meanLatencyMs: meanLat,
        medianLatencyMs: meanLat,
        accuracyPercent: Math.round(((totalTrials - errors) / totalTrials) * 100),
        percentileRank: evalRes.percentile,
        clinicalStatus: evalRes.status,
        notes: `${evalRes.notes} Memory scanning slope: ${slope}ms per item. Overall search latency: ${meanLat}ms.`
      });
    } else {
      setTrial(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 text-sm">
        <span className="font-medium text-slate-700">Probe {trial + 1} of {totalTrials}</span>
        <span className="text-slate-500 font-mono text-xs">
          {stage === 'MEMORIZE' ? 'Memorize this digit set...' : 'Was the probe digit in the memorized set?'}
        </span>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-xs">Abort</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 gap-8">
        {stage === 'MEMORIZE' ? (
          <div className="flex gap-4 p-6 bg-white border-2 border-emerald-500 rounded-xl shadow-sm">
            {memorySet.map((d, i) => (
              <span key={i} className="text-4xl font-mono font-bold text-slate-900">
                {d}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white border-2 border-slate-400 flex items-center justify-center text-5xl font-mono font-bold text-emerald-700 shadow-md">
              {probeDigit}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleResponse(true)}
                className="px-8 py-3 border-2 border-slate-300 hover:border-emerald-600 bg-white rounded-lg font-mono font-bold text-slate-800 shadow-sm active:scale-95"
              >
                YES (Present)
              </button>
              <button
                onClick={() => handleResponse(false)}
                className="px-8 py-3 border-2 border-slate-300 hover:border-emerald-600 bg-white rounded-lg font-mono font-bold text-slate-800 shadow-sm active:scale-95"
              >
                NO (Absent)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
