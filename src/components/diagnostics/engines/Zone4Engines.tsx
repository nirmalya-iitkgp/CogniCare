import React, { useState, useEffect, useRef } from 'react';
import { ClinicalTestDef, TestResultData } from '../../../types/clinical';
import { audioEngine } from '../../../utils/audioEngine';
import { evaluateClinicalScore } from '../../../utils/normativeData';

interface EngineProps {
  testDef: ClinicalTestDef;
  onComplete: (result: TestResultData) => void;
  onCancel: () => void;
}

export function Zone4Engine({ testDef, onComplete, onCancel }: EngineProps) {
  if (testDef.id === 'z4_impact_reflex') {
    return <ReflexGridImPACT testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
  }
  if (testDef.id === 'z4_pvt_speedometer') {
    return <NightDrivePVT testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
  }
  if (testDef.id === 'z4_iowa_gambling') {
    return <IowaGamblingDeck testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
  }
  return <LogicMatrixWCST testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
}

// 1. Reflex Grid (ImPACT Symbol-Digit Matching)
function ReflexGridImPACT({ testDef, onComplete, onCancel }: EngineProps) {
  const symbols = ['▲', '■', '●', '★', '◆'];
  const [trial, setTrial] = useState(0);
  const totalTrials = 12;
  const [currentSymbol, setCurrentSymbol] = useState('▲');
  const [targetNumber, setTargetNumber] = useState(1);
  const [latencies, setLatencies] = useState<number[]>([]);
  const [errors, setErrors] = useState(0);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    const sIdx = Math.floor(Math.random() * symbols.length);
    setCurrentSymbol(symbols[sIdx]);
    setTargetNumber(sIdx + 1);
    startTime.current = Date.now();
  }, [trial]);

  const handleKeyChoice = (num: number) => {
    const lat = Date.now() - startTime.current;
    const isCorrect = num === targetNumber;

    if (isCorrect) {
      audioEngine.playFeedback('correct');
    } else {
      audioEngine.playFeedback('incorrect');
      setErrors(prev => prev + 1);
    }

    const nextLat = [...latencies, lat];
    setLatencies(nextLat);

    if (trial + 1 >= totalTrials) {
      const meanLat = Math.round(nextLat.reduce((a, b) => a + b, 0) / nextLat.length);
      const evalRes = evaluateClinicalScore(testDef.id, meanLat);

      onComplete({
        testId: testDef.id,
        testName: testDef.name,
        clinicalTest: testDef.clinicalTest,
        stageId: testDef.stageId, zoneId: testDef.stageId,
        timestamp: Date.now(),
        durationMs: 25000,
        primaryScore: meanLat,
        primaryMetric: testDef.primaryMetric,
        unit: testDef.unit,
        latencies: nextLat,
        meanLatencyMs: meanLat,
        medianLatencyMs: meanLat,
        accuracyPercent: Math.round(((totalTrials - errors) / totalTrials) * 100),
        percentileRank: evalRes.percentile,
        clinicalStatus: evalRes.status,
        notes: `${evalRes.notes} ImPACT processing speed: ${meanLat}ms. Errors: ${errors}.`
      });
    } else {
      setTrial(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col h-full select-none" tabIndex={0} onKeyDown={(e) => {
      const n = parseInt(e.key);
      if (n >= 1 && n <= 5) handleKeyChoice(n);
    }}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 text-sm">
        <span className="font-medium text-slate-700">Probe {trial + 1} of {totalTrials}</span>
        <span className="text-slate-500 font-mono text-xs">Press matching digit key (1–5) or click digit button</span>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-xs">Abort</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 gap-8">
        {/* Symbol Key Legend */}
        <div className="flex gap-4 p-3 bg-white border border-slate-300 rounded-lg shadow-sm">
          {symbols.map((sym, idx) => (
            <div key={idx} className="flex flex-col items-center px-3 py-1 border-r last:border-r-0 border-slate-200">
              <span className="text-xl font-bold text-violet-700">{sym}</span>
              <span className="text-xs font-mono font-semibold text-slate-600">{idx + 1}</span>
            </div>
          ))}
        </div>

        {/* Current Target Symbol */}
        <div className="w-28 h-28 bg-white border-2 border-violet-600 rounded-2xl flex items-center justify-center shadow-md">
          <span className="text-5xl font-black text-violet-900">{currentSymbol}</span>
        </div>

        {/* Keypad Buttons */}
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => handleKeyChoice(n)}
              className="w-14 h-14 bg-white border-2 border-slate-300 hover:border-violet-600 rounded-lg font-mono font-bold text-xl text-slate-800 active:scale-95 shadow-sm"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. Night Drive Speedometer (Psychomotor Vigilance Task PVT)
function NightDrivePVT({ testDef, onComplete, onCancel }: EngineProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [counterMs, setCounterMs] = useState(0);
  const [lapses, setLapses] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);
  const [trial, setTrial] = useState(0);
  const totalTrials = 8;
  const [waiting, setWaiting] = useState(true);
  const startTime = useRef<number>(0);
  const animFrame = useRef<number | null>(null);

  useEffect(() => {
    setWaiting(true);
    setIsRunning(false);
    setCounterMs(0);

    // Random ISI delay 1.5s - 4.5s
    const delay = 1500 + Math.random() * 2500;
    const triggerTimeout = setTimeout(() => {
      setWaiting(false);
      setIsRunning(true);
      startTime.current = Date.now();

      const tick = () => {
        setCounterMs(Date.now() - startTime.current);
        animFrame.current = requestAnimationFrame(tick);
      };
      animFrame.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(triggerTimeout);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [trial]);

  const handleStop = () => {
    if (waiting) {
      // False start / anticipation error
      audioEngine.playFeedback('incorrect');
      return;
    }
    if (!isRunning) return;

    if (animFrame.current) cancelAnimationFrame(animFrame.current);
    const finalLat = Date.now() - startTime.current;
    setIsRunning(false);

    if (finalLat > 500) {
      setLapses(prev => prev + 1);
      audioEngine.playFeedback('incorrect');
    } else {
      audioEngine.playFeedback('correct');
    }

    const nextLat = [...latencies, finalLat];
    setLatencies(nextLat);

    if (trial + 1 >= totalTrials) {
      const meanLat = Math.round(nextLat.reduce((a, b) => a + b, 0) / nextLat.length);
      const totalLapses = nextLat.filter(l => l > 500).length;
      const evalRes = evaluateClinicalScore(testDef.id, totalLapses);

      onComplete({
        testId: testDef.id,
        testName: testDef.name,
        clinicalTest: testDef.clinicalTest,
        stageId: testDef.stageId, zoneId: testDef.stageId,
        timestamp: Date.now(),
        durationMs: 30000,
        primaryScore: totalLapses,
        primaryMetric: testDef.primaryMetric,
        unit: testDef.unit,
        latencies: nextLat,
        meanLatencyMs: meanLat,
        medianLatencyMs: meanLat,
        accuracyPercent: Math.round(((totalTrials - totalLapses) / totalTrials) * 100),
        percentileRank: evalRes.percentile,
        clinicalStatus: evalRes.status,
        notes: `${evalRes.notes} Mean PVT reaction: ${meanLat}ms. Total micro-sleep lapses (>500ms): ${totalLapses}.`
      });
    } else {
      setTimeout(() => {
        setTrial(prev => prev + 1);
      }, 700);
    }
  };

  return (
    <div
      onClick={handleStop}
      tabIndex={0}
      onKeyDown={(e) => { if (e.code === 'Space') handleStop(); }}
      className="flex flex-col h-full select-none cursor-pointer bg-slate-950 text-white"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 text-sm">
        <span className="font-medium text-slate-300">Signal {trial + 1} of {totalTrials}</span>
        <span className="text-slate-400 font-mono text-xs">Press Spacebar or Click the instant the millisecond counter starts</span>
        <button onClick={(e) => { e.stopPropagation(); onCancel(); }} className="text-slate-400 hover:text-white text-xs">Abort</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
        {waiting && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-mono text-xs text-slate-500">Awaiting visual stimulus...</span>
          </div>
        )}

        {!waiting && (
          <div className="flex flex-col items-center">
            <span className="text-7xl font-mono font-black tabular-nums text-rose-500">
              {counterMs}
            </span>
            <span className="text-xs font-mono uppercase text-slate-400 mt-2">MILLISECONDS</span>
          </div>
        )}
      </div>
    </div>
  );
}

// 3. High-Stakes Deck (Iowa Gambling Task IGT)
function IowaGamblingDeck({ testDef, onComplete, onCancel }: EngineProps) {
  // Decks A, B (disadvantageous: high immediate gain + huge sporadic penalties)
  // Decks C, D (advantageous: modest gain + small sporadic penalties)
  const [bankroll, setBankroll] = useState(2000);
  const [trial, setTrial] = useState(0);
  const totalTrials = 15;
  const [lastOutcome, setLastOutcome] = useState<{ gain: number; penalty: number; deck: string } | null>(null);
  const [advantageousPicks, setAdvantageousPicks] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);
  const startTime = useRef<number>(Date.now());

  const handlePick = (deck: 'A' | 'B' | 'C' | 'D') => {
    const lat = Date.now() - startTime.current;
    let gain = 100;
    let penalty = 0;

    if (deck === 'A') {
      gain = 100;
      penalty = Math.random() < 0.5 ? 250 : 0;
    } else if (deck === 'B') {
      gain = 100;
      penalty = Math.random() < 0.1 ? 1250 : 0;
    } else if (deck === 'C') {
      gain = 50;
      penalty = Math.random() < 0.5 ? 50 : 0;
      setAdvantageousPicks(prev => prev + 1);
    } else {
      gain = 50;
      penalty = Math.random() < 0.1 ? 250 : 0;
      setAdvantageousPicks(prev => prev + 1);
    }

    const net = gain - penalty;
    setBankroll(prev => prev + net);
    setLastOutcome({ gain, penalty, deck });

    if (net >= 0) {
      audioEngine.playFeedback('correct');
    } else {
      audioEngine.playFeedback('incorrect');
    }

    const nextLat = [...latencies, lat];
    setLatencies(nextLat);

    if (trial + 1 >= totalTrials) {
      const netAdvantageScore = advantageousPicks * 2 - (totalTrials - advantageousPicks);
      const meanLat = Math.round(nextLat.reduce((a, b) => a + b, 0) / nextLat.length);
      const evalRes = evaluateClinicalScore(testDef.id, netAdvantageScore);

      onComplete({
        testId: testDef.id,
        testName: testDef.name,
        clinicalTest: testDef.clinicalTest,
        stageId: testDef.stageId, zoneId: testDef.stageId,
        timestamp: Date.now(),
        durationMs: 25000,
        primaryScore: netAdvantageScore,
        primaryMetric: testDef.primaryMetric,
        unit: testDef.unit,
        latencies: nextLat,
        meanLatencyMs: meanLat,
        medianLatencyMs: meanLat,
        accuracyPercent: Math.round((advantageousPicks / totalTrials) * 100),
        percentileRank: evalRes.percentile,
        clinicalStatus: evalRes.status,
        notes: `${evalRes.notes} Advantageous deck picks: ${advantageousPicks}/${totalTrials}. Final bankroll: $${bankroll + net}.`
      });
    } else {
      setTrial(prev => prev + 1);
      startTime.current = Date.now();
    }
  };

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 text-sm">
        <span className="font-medium text-slate-700">Turn {trial + 1} of {totalTrials} · Bankroll: ${bankroll}</span>
        <span className="text-slate-500 font-mono text-xs">Draw cards across 4 decks to maximize long-term balance</span>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-xs">Abort</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 gap-8">
        {lastOutcome && (
          <div className="text-xs font-mono px-3 py-1 bg-white border border-slate-300 rounded shadow-sm">
            Deck {lastOutcome.deck}: +${lastOutcome.gain} | -${lastOutcome.penalty} = Net {lastOutcome.gain - lastOutcome.penalty >= 0 ? '+' : ''}${lastOutcome.gain - lastOutcome.penalty}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {(['A', 'B', 'C', 'D'] as const).map((d) => (
            <button
              key={d}
              onClick={() => handlePick(d)}
              className="w-28 h-40 border-2 border-slate-300 hover:border-violet-600 bg-white rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 active:scale-95"
            >
              <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-700 font-bold text-lg flex items-center justify-center">
                {d}
              </div>
              <span className="text-xs text-slate-500 font-mono">Deck {d}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4. Logic Matrix (Wisconsin Card Sorting Test WCST)
function LogicMatrixWCST({ testDef, onComplete, onCancel }: EngineProps) {
  // Target Bins:
  // 1: 1 Red Triangle
  // 2: 2 Green Stars
  // 3: 3 Blue Crosses
  // 4: 4 Yellow Circles
  const rules = ['COLOR', 'SHAPE', 'COUNT'] as const;
  const [currentRuleIdx, setCurrentRuleIdx] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [trial, setTrial] = useState(0);
  const totalTrials = 15;
  const [perseverativeErrors, setPerseverativeErrors] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Stimulus card
  const [card, setCard] = useState({
    color: 'red',
    shape: 'star',
    count: 2
  });
  const startTime = useRef<number>(Date.now());

  const generateCard = () => {
    const colors = ['red', 'green', 'blue', 'yellow'];
    const shapes = ['triangle', 'star', 'cross', 'circle'];
    const counts = [1, 2, 3, 4];

    setCard({
      color: colors[Math.floor(Math.random() * 4)],
      shape: shapes[Math.floor(Math.random() * 4)],
      count: counts[Math.floor(Math.random() * 4)]
    });
    startTime.current = Date.now();
  };

  useEffect(() => {
    generateCard();
  }, [trial]);

  const handleBinSelect = (binIdx: number) => {
    const lat = Date.now() - startTime.current;
    // Evaluate correctness based on current hidden rule
    const rule = rules[currentRuleIdx];
    let isCorrect = false;

    // Bin 0: Red, Triangle, Count 1
    // Bin 1: Green, Star, Count 2
    // Bin 2: Blue, Cross, Count 3
    // Bin 3: Yellow, Circle, Count 4
    if (rule === 'COLOR') {
      const targetColors = ['red', 'green', 'blue', 'yellow'];
      isCorrect = card.color === targetColors[binIdx];
    } else if (rule === 'SHAPE') {
      const targetShapes = ['triangle', 'star', 'cross', 'circle'];
      isCorrect = card.shape === targetShapes[binIdx];
    } else {
      isCorrect = card.count === binIdx + 1;
    }

    if (isCorrect) {
      audioEngine.playFeedback('correct');
      setFeedbackMsg('CORRECT');
      const nextConsec = consecutiveCorrect + 1;
      setConsecutiveCorrect(nextConsec);

      // Rule shifts after 4 consecutive correct sorts
      if (nextConsec >= 4) {
        setCurrentRuleIdx((prev) => (prev + 1) % 3);
        setConsecutiveCorrect(0);
      }
    } else {
      audioEngine.playFeedback('incorrect');
      setFeedbackMsg('INCORRECT');
      setConsecutiveCorrect(0);
      setPerseverativeErrors(prev => prev + 1);
    }

    const nextLat = [...latencies, lat];
    setLatencies(nextLat);

    if (trial + 1 >= totalTrials) {
      const errorRate = Math.round((perseverativeErrors / totalTrials) * 100);
      const meanLat = Math.round(nextLat.reduce((a, b) => a + b, 0) / nextLat.length);
      const evalRes = evaluateClinicalScore(testDef.id, errorRate);

      onComplete({
        testId: testDef.id,
        testName: testDef.name,
        clinicalTest: testDef.clinicalTest,
        stageId: testDef.stageId, zoneId: testDef.stageId,
        timestamp: Date.now(),
        durationMs: 30000,
        primaryScore: errorRate,
        primaryMetric: testDef.primaryMetric,
        unit: testDef.unit,
        latencies: nextLat,
        meanLatencyMs: meanLat,
        medianLatencyMs: meanLat,
        accuracyPercent: 100 - errorRate,
        percentileRank: evalRes.percentile,
        clinicalStatus: evalRes.status,
        notes: `${evalRes.notes} Perseverative error rate: ${errorRate}%. Sets shifted: ${currentRuleIdx}.`
      });
    } else {
      setTrial(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 text-sm">
        <span className="font-medium text-slate-700">Sort {trial + 1} of {totalTrials}</span>
        <span className="text-slate-500 font-mono text-xs">Rule is hidden. Learn by trial feedback (Correct / Incorrect).</span>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-xs">Abort</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-6 bg-slate-50">
        {/* 4 Reference Bins */}
        <div className="grid grid-cols-4 gap-3 w-full max-w-xl">
          {[
            { label: 'Bin 1', sym: '▲', color: 'text-rose-600', count: 1 },
            { label: 'Bin 2', sym: '★', color: 'text-emerald-600', count: 2 },
            { label: 'Bin 3', sym: '✚', color: 'text-blue-600', count: 3 },
            { label: 'Bin 4', sym: '●', color: 'text-amber-500', count: 4 },
          ].map((bin, idx) => (
            <button
              key={idx}
              onClick={() => handleBinSelect(idx)}
              className="p-3 border-2 border-slate-300 hover:border-violet-600 bg-white rounded-lg flex flex-col items-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <div className="flex gap-1">
                {Array.from({ length: bin.count }).map((_, i) => (
                  <span key={i} className={`text-xl font-bold ${bin.color}`}>{bin.sym}</span>
                ))}
              </div>
              <span className="text-xs font-mono text-slate-400">{bin.label}</span>
            </button>
          ))}
        </div>

        {/* Center stimulus card & feedback */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-40 h-44 border-2 border-slate-400 rounded-xl bg-white shadow-md flex flex-col items-center justify-center gap-2">
            <div className="flex flex-wrap items-center justify-center gap-1 max-w-[100px]">
              {Array.from({ length: card.count }).map((_, i) => (
                <span
                  key={i}
                  className={`text-2xl font-bold ${
                    card.color === 'red' ? 'text-rose-600' :
                    card.color === 'green' ? 'text-emerald-600' :
                    card.color === 'blue' ? 'text-blue-600' : 'text-amber-500'
                  }`}
                >
                  {card.shape === 'triangle' ? '▲' : card.shape === 'star' ? '★' : card.shape === 'cross' ? '✚' : '●'}
                </span>
              ))}
            </div>
            <span className="text-xs font-mono text-slate-400">Card to sort</span>
          </div>

          {feedbackMsg && (
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${feedbackMsg === 'CORRECT' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
              {feedbackMsg}
            </span>
          )}
        </div>

        <span className="text-xs text-slate-400 font-mono">Click one of the 4 bins above to match</span>
      </div>
    </div>
  );
}
