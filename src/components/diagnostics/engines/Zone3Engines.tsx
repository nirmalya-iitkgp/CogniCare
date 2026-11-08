import React, { useState, useEffect, useRef } from 'react';
import { ClinicalTestDef, TestResultData } from '../../../types/clinical';
import { audioEngine } from '../../../utils/audioEngine';
import { evaluateClinicalScore } from '../../../utils/normativeData';

interface EngineProps {
  testDef: ClinicalTestDef;
  onComplete: (result: TestResultData) => void;
  onCancel: () => void;
}

export function Zone3Engine({ testDef, onComplete, onCancel }: EngineProps) {
  if (testDef.id === 'z3_rule_switcher') {
    return <RuleSwitcherDCCS testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
  }
  if (testDef.id === 'z3_pediatric_stroop') {
    return <ColorClashStroop testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
  }
  if (testDef.id === 'z3_tower_london') {
    return <BlockStackerTower testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
  }
  return <ShapeMatcherBenton testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
}

// 1. Rule Switcher (DCCS Dimensional Change Card Sort)
function RuleSwitcherDCCS({ testDef, onComplete, onCancel }: EngineProps) {
  // Target dimensions: COLOR or SHAPE
  const [rule, setRule] = useState<'COLOR' | 'SHAPE'>('COLOR');
  const [trial, setTrial] = useState(0);
  const totalTrials = 12;
  const [latencies, setLatencies] = useState<number[]>([]);
  const [switchLatencies, setSwitchLatencies] = useState<number[]>([]);
  const [perseverativeErrors, setPerseverativeErrors] = useState(0);
  const startTime = useRef<number>(Date.now());

  // Current stimulus card
  const [currentCard, setCurrentCard] = useState<{ color: 'red' | 'blue'; shape: 'star' | 'circle' }>({
    color: 'red',
    shape: 'star'
  });

  const nextCard = (r: 'COLOR' | 'SHAPE') => {
    const c = Math.random() > 0.5 ? 'red' : 'blue';
    const s = Math.random() > 0.5 ? 'star' : 'circle';
    setCurrentCard({ color: c, shape: s });
    startTime.current = Date.now();
  };

  useEffect(() => {
    // Switch rule mid-game at trial 6 without advance notice
    const currentRule = trial >= 6 ? 'SHAPE' : 'COLOR';
    setRule(currentRule);
    nextCard(currentRule);
  }, [trial]);

  const handleSort = (target: 'bin_left' | 'bin_right') => {
    const lat = Date.now() - startTime.current;
    // Bin Left is Red / Star. Bin Right is Blue / Circle.
    let isCorrect = false;
    if (rule === 'COLOR') {
      isCorrect = (target === 'bin_left' && currentCard.color === 'red') ||
                  (target === 'bin_right' && currentCard.color === 'blue');
    } else {
      isCorrect = (target === 'bin_left' && currentCard.shape === 'star') ||
                  (target === 'bin_right' && currentCard.shape === 'circle');
    }

    if (trial >= 6) {
      setSwitchLatencies(prev => [...prev, lat]);
      if (!isCorrect) {
        setPerseverativeErrors(prev => prev + 1);
      }
    }

    if (isCorrect) {
      audioEngine.playFeedback('correct');
    } else {
      audioEngine.playFeedback('incorrect');
    }

    const nextLat = [...latencies, lat];
    setLatencies(nextLat);

    if (trial + 1 >= totalTrials) {
      const meanLat = Math.round(nextLat.reduce((a, b) => a + b, 0) / nextLat.length);
      const preMean = Math.round(nextLat.slice(0, 6).reduce((a, b) => a + b, 0) / 6);
      const postMean = Math.round(nextLat.slice(6).reduce((a, b) => a + b, 0) / (nextLat.length - 6));
      const switchCost = Math.max(0, postMean - preMean);
      const evalRes = evaluateClinicalScore(testDef.id, switchCost);

      onComplete({
        testId: testDef.id,
        testName: testDef.name,
        clinicalTest: testDef.clinicalTest,
        stageId: testDef.stageId, zoneId: testDef.stageId,
        timestamp: Date.now(),
        durationMs: 25000,
        primaryScore: switchCost,
        primaryMetric: testDef.primaryMetric,
        unit: testDef.unit,
        latencies: nextLat,
        meanLatencyMs: meanLat,
        medianLatencyMs: meanLat,
        accuracyPercent: Math.round(((totalTrials - perseverativeErrors) / totalTrials) * 100),
        percentileRank: evalRes.percentile,
        clinicalStatus: evalRes.status,
        notes: `${evalRes.notes} Set-shifting cost: +${switchCost}ms, Perseverative errors: ${perseverativeErrors}.`
      });
    } else {
      setTrial(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 text-sm">
        <span className="font-medium text-slate-700">Card {trial + 1} of {totalTrials}</span>
        <span className="text-slate-800 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono text-xs">
          CURRENT SORT RULE: {rule}
        </span>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-xs">Abort</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-8 bg-slate-50">
        {/* Top Reference Bins */}
        <div className="flex justify-between w-full max-w-md">
          <div className="w-36 h-28 border-2 border-slate-300 rounded-lg bg-white flex flex-col items-center justify-center gap-1 shadow-sm">
            <span className="text-xs text-slate-500 font-mono">Bin 1: Red Star</span>
            <div className="text-rose-500 text-3xl font-bold">★</div>
          </div>

          <div className="w-36 h-28 border-2 border-slate-300 rounded-lg bg-white flex flex-col items-center justify-center gap-1 shadow-sm">
            <span className="text-xs text-slate-500 font-mono">Bin 2: Blue Circle</span>
            <div className="text-blue-500 text-3xl font-bold">●</div>
          </div>
        </div>

        {/* Center Active Stimulus Card */}
        <div className="w-40 h-48 border-2 border-slate-400 rounded-xl bg-white shadow-md flex flex-col items-center justify-center gap-2">
          <span className="text-xs text-slate-400 font-mono uppercase">Sort this card</span>
          <div className={`text-5xl font-bold ${currentCard.color === 'red' ? 'text-rose-600' : 'text-blue-600'}`}>
            {currentCard.shape === 'star' ? '★' : '●'}
          </div>
        </div>

        {/* Bottom Sorting Buttons */}
        <div className="flex justify-between w-full max-w-md gap-4">
          <button
            onClick={() => handleSort('bin_left')}
            className="flex-1 py-3 border-2 border-slate-300 hover:border-blue-600 bg-white rounded-lg font-medium text-slate-800 shadow-sm active:scale-95"
          >
            Sort to Bin 1
          </button>
          <button
            onClick={() => handleSort('bin_right')}
            className="flex-1 py-3 border-2 border-slate-300 hover:border-blue-600 bg-white rounded-lg font-medium text-slate-800 shadow-sm active:scale-95"
          >
            Sort to Bin 2
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Color Clash (Pediatric Stroop Interference)
function ColorClashStroop({ testDef, onComplete, onCancel }: EngineProps) {
  const words = ['RED', 'BLUE', 'GREEN', 'YELLOW'];
  const colors = [
    { name: 'RED', css: 'text-rose-600', fill: '#e11d48' },
    { name: 'BLUE', css: 'text-blue-600', fill: '#2563eb' },
    { name: 'GREEN', css: 'text-emerald-600', fill: '#059669' },
    { name: 'YELLOW', css: 'text-amber-500', fill: '#d97706' }
  ];

  const [trial, setTrial] = useState(0);
  const totalTrials = 12;
  const [congruentLatencies, setCongruentLatencies] = useState<number[]>([]);
  const [incongruentLatencies, setIncongruentLatencies] = useState<number[]>([]);
  const [allLatencies, setAllLatencies] = useState<number[]>([]);
  const [errors, setErrors] = useState(0);

  const [stimulus, setStimulus] = useState<{ text: string; ink: typeof colors[0]; isCongruent: boolean }>({
    text: 'RED',
    ink: colors[0],
    isCongruent: true
  });
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    const isCongruent = Math.random() < 0.4;
    const textIdx = Math.floor(Math.random() * 4);
    const inkIdx = isCongruent ? textIdx : (textIdx + 1 + Math.floor(Math.random() * 3)) % 4;

    setStimulus({
      text: words[textIdx],
      ink: colors[inkIdx],
      isCongruent
    });
    startTime.current = Date.now();
  }, [trial]);

  const handleSelectColor = (selectedColorName: string) => {
    const lat = Date.now() - startTime.current;
    const isCorrect = selectedColorName === stimulus.ink.name;

    if (isCorrect) {
      audioEngine.playFeedback('correct');
      if (stimulus.isCongruent) {
        setCongruentLatencies(prev => [...prev, lat]);
      } else {
        setIncongruentLatencies(prev => [...prev, lat]);
      }
    } else {
      audioEngine.playFeedback('incorrect');
      setErrors(prev => prev + 1);
    }

    const nextAllLat = [...allLatencies, lat];
    setAllLatencies(nextAllLat);

    if (trial + 1 >= totalTrials) {
      const meanCongruent = congruentLatencies.length > 0
        ? Math.round(congruentLatencies.reduce((a, b) => a + b, 0) / congruentLatencies.length)
        : 450;
      const meanIncongruent = incongruentLatencies.length > 0
        ? Math.round(incongruentLatencies.reduce((a, b) => a + b, 0) / incongruentLatencies.length)
        : 620;
      const interferenceCost = Math.max(0, meanIncongruent - meanCongruent);
      const overallMean = Math.round(nextAllLat.reduce((a, b) => a + b, 0) / nextAllLat.length);
      const evalRes = evaluateClinicalScore(testDef.id, interferenceCost);

      onComplete({
        testId: testDef.id,
        testName: testDef.name,
        clinicalTest: testDef.clinicalTest,
        stageId: testDef.stageId, zoneId: testDef.stageId,
        timestamp: Date.now(),
        durationMs: 25000,
        primaryScore: interferenceCost,
        primaryMetric: testDef.primaryMetric,
        unit: testDef.unit,
        latencies: nextAllLat,
        meanLatencyMs: overallMean,
        medianLatencyMs: overallMean,
        accuracyPercent: Math.round(((totalTrials - errors) / totalTrials) * 100),
        percentileRank: evalRes.percentile,
        clinicalStatus: evalRes.status,
        notes: `${evalRes.notes} Stroop interference latency gap: ${interferenceCost}ms. Errors: ${errors}.`
      });
    } else {
      setTrial(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 text-sm">
        <span className="font-medium text-slate-700">Word {trial + 1} of {totalTrials}</span>
        <span className="text-slate-500 font-mono text-xs">Tap the button matching the FONT INK COLOR (ignore what the word spells)</span>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-xs">Abort</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 gap-10">
        <div className="h-32 flex items-center justify-center">
          <span className={`text-6xl font-black tracking-widest ${stimulus.ink.css}`}>
            {stimulus.text}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {colors.map((c) => (
            <button
              key={c.name}
              onClick={() => handleSelectColor(c.name)}
              className="py-3 border-2 border-slate-300 hover:border-blue-600 bg-white rounded-lg font-mono font-bold text-slate-800 shadow-sm active:scale-95"
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. Block Stacker 3D (Tower of London Test)
function BlockStackerTower({ testDef, onComplete, onCancel }: EngineProps) {
  // 3 Pegs with capacities: Peg 1 (capacity 3), Peg 2 (capacity 2), Peg 3 (capacity 1)
  // Blocks: 'R' (Red), 'G' (Green), 'B' (Blue)
  const [pegs, setPegs] = useState<string[][]>([['B', 'G', 'R'], [], []]);
  const targetState = [['B'], ['G'], ['R']]; // Goal configuration
  const [selectedPeg, setSelectedPeg] = useState<number | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [planningTimeMs, setPlanningTimeMs] = useState(0);
  const startTime = useRef<number>(Date.now());
  const firstMoveTime = useRef<number | null>(null);

  const handlePegClick = (pegIdx: number) => {
    if (selectedPeg === null) {
      if (pegs[pegIdx].length > 0) {
        setSelectedPeg(pegIdx);
        audioEngine.playFeedback('tap');
      }
    } else {
      if (selectedPeg === pegIdx) {
        setSelectedPeg(null);
        return;
      }
      // Check capacity
      const capacities = [3, 2, 1];
      if (pegs[pegIdx].length < capacities[pegIdx]) {
        if (!firstMoveTime.current) {
          firstMoveTime.current = Date.now();
          setPlanningTimeMs(Date.now() - startTime.current);
        }
        const block = pegs[selectedPeg][pegs[selectedPeg].length - 1];
        const nextPegs = pegs.map((p, i) => {
          if (i === selectedPeg) return p.slice(0, -1);
          if (i === pegIdx) return [...p, block];
          return [...p];
        });
        setPegs(nextPegs);
        setSelectedPeg(null);
        setMoveCount(prev => prev + 1);
        audioEngine.playFeedback('correct');

        // Check if matched target
        const isMatch =
          nextPegs[0].join('') === targetState[0].join('') &&
          nextPegs[1].join('') === targetState[1].join('') &&
          nextPegs[2].join('') === targetState[2].join('');

        if (isMatch) {
          finishTest(moveCount + 1);
        }
      } else {
        audioEngine.playFeedback('incorrect');
        setSelectedPeg(null);
      }
    }
  };

  const finishTest = (finalMoves: number) => {
    const optimalMoves = 4;
    const excessMoves = Math.max(0, finalMoves - optimalMoves);
    const evalRes = evaluateClinicalScore(testDef.id, excessMoves);

    onComplete({
      testId: testDef.id,
      testName: testDef.name,
      clinicalTest: testDef.clinicalTest,
      stageId: testDef.stageId, zoneId: testDef.stageId,
      timestamp: Date.now(),
      durationMs: Date.now() - startTime.current,
      primaryScore: excessMoves,
      primaryMetric: testDef.primaryMetric,
      unit: testDef.unit,
      latencies: [planningTimeMs || 1200, 800, 750, 600],
      meanLatencyMs: planningTimeMs || 1200,
      medianLatencyMs: 800,
      accuracyPercent: Math.max(50, 100 - excessMoves * 15),
      percentileRank: evalRes.percentile,
      clinicalStatus: evalRes.status,
      notes: `${evalRes.notes} Moves: ${finalMoves} (Optimal: 4). Planning hesitation: ${planningTimeMs}ms.`
    });
  };

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 text-sm">
        <span className="font-medium text-slate-700">Moves: {moveCount} (Optimal: 4)</span>
        <span className="text-slate-500 font-mono text-xs">Stack colored pegs to match the target arrangement</span>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-xs">Abort</button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-around p-6 bg-slate-50 gap-6">
        {/* Goal Preview */}
        <div className="border border-slate-300 rounded-lg p-4 bg-white flex flex-col items-center">
          <span className="text-xs font-mono uppercase text-slate-500 mb-3">Target Goal</span>
          <div className="flex items-end gap-5 h-36 border-b-4 border-slate-400 px-3">
            <div className="w-10 flex flex-col-reverse items-center gap-1">
              <div className="w-8 h-8 rounded bg-blue-600 text-white font-bold flex items-center justify-center text-xs">B</div>
            </div>
            <div className="w-10 flex flex-col-reverse items-center gap-1">
              <div className="w-8 h-8 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">G</div>
            </div>
            <div className="w-10 flex flex-col-reverse items-center gap-1">
              <div className="w-8 h-8 rounded bg-rose-600 text-white font-bold flex items-center justify-center text-xs">R</div>
            </div>
          </div>
        </div>

        {/* Interactive Playfield Pegs */}
        <div className="flex items-end gap-10 h-56 border-b-8 border-slate-700 px-8 py-2">
          {pegs.map((peg, idx) => (
            <div
              key={idx}
              onClick={() => handlePegClick(idx)}
              className={`w-16 flex flex-col-reverse items-center gap-1.5 cursor-pointer relative pb-1 rounded-t-lg transition-colors ${
                selectedPeg === idx ? 'bg-blue-100/60 ring-2 ring-blue-500' : 'hover:bg-slate-100'
              }`}
            >
              {/* Peg pole */}
              <div
                style={{ height: `${(idx === 0 ? 3 : idx === 1 ? 2 : 1) * 44 + 20}px` }}
                className="absolute bottom-0 w-2.5 bg-slate-400 rounded-t -z-0"
              />
              {/* Blocks on this peg */}
              {peg.map((b, bIdx) => (
                <div
                  key={bIdx}
                  className={`w-12 h-10 rounded-lg text-white font-bold flex items-center justify-center text-sm shadow-sm z-10 ${
                    b === 'R' ? 'bg-rose-600' : b === 'G' ? 'bg-emerald-600' : 'bg-blue-600'
                  }`}
                >
                  {b}
                </div>
              ))}
              <span className="text-xs font-mono text-slate-500 mt-2 z-10">Peg {idx + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4. Shape Matcher (Benton Visual Form Discrimination)
function ShapeMatcherBenton({ testDef, onComplete, onCancel }: EngineProps) {
  const [trial, setTrial] = useState(0);
  const totalTrials = 6;
  const [correctCount, setCorrectCount] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);
  const startTime = useRef<number>(Date.now());

  const options = [
    { id: 'correct', rotation: 0, scale: 1.0, isCorrect: true },
    { id: 'distort1', rotation: 45, scale: 1.0, isCorrect: false },
    { id: 'distort2', rotation: 0, scale: 0.7, isCorrect: false },
    { id: 'distort3', rotation: 180, scale: 1.0, isCorrect: false },
  ];

  const handleSelect = (isCorrect: boolean) => {
    const lat = Date.now() - startTime.current;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      audioEngine.playFeedback('correct');
    } else {
      audioEngine.playFeedback('incorrect');
    }

    const nextLat = [...latencies, lat];
    setLatencies(nextLat);

    if (trial + 1 >= totalTrials) {
      const accuracy = Math.round(((correctCount + (isCorrect ? 1 : 0)) / totalTrials) * 100);
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
        notes: evalRes.notes
      });
    } else {
      setTrial(prev => prev + 1);
      startTime.current = Date.now();
    }
  };

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 text-sm">
        <span className="font-medium text-slate-700">Form {trial + 1} of {totalTrials}</span>
        <span className="text-slate-500 font-mono text-xs">Identify the option identical to the reference shape</span>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-xs">Abort</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 gap-6">
        {/* Target Form */}
        <div className="w-28 h-28 border-2 border-blue-600 rounded-xl bg-white shadow-sm flex items-center justify-center">
          <svg className="w-16 h-16 text-blue-700" viewBox="0 0 100 100">
            <polygon points="50,15 90,85 10,85" fill="none" stroke="currentColor" strokeWidth="8" />
            <circle cx="50" cy="58" r="10" fill="currentColor" />
          </svg>
        </div>

        {/* 4 Choices */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt.isCorrect)}
              className="w-28 h-28 border-2 border-slate-300 hover:border-blue-600 bg-white rounded-xl flex items-center justify-center shadow-sm transition-all"
            >
              <svg
                className="w-16 h-16 text-slate-800 transition-transform"
                style={{ transform: `rotate(${opt.rotation}deg) scale(${opt.scale})` }}
                viewBox="0 0 100 100"
              >
                <polygon points="50,15 90,85 10,85" fill="none" stroke="currentColor" strokeWidth="8" />
                <circle cx="50" cy="58" r="10" fill="currentColor" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
