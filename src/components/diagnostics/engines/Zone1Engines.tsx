import React, { useState, useEffect, useRef } from 'react';
import { ClinicalTestDef, TestResultData } from '../../../types/clinical';
import { audioEngine } from '../../../utils/audioEngine';
import { evaluateClinicalScore } from '../../../utils/normativeData';

interface EngineProps {
  testDef: ClinicalTestDef;
  onComplete: (result: TestResultData) => void;
  onCancel: () => void;
}

export function Zone1Engine({ testDef, onComplete, onCancel }: EngineProps) {
  if (testDef.id === 'z1_bayley_touch') {
    return <TinyTouchPaws testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
  }
  if (testDef.id === 'z1_fagan_novelty') {
    return <NoveltyPeek testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
  }
  if (testDef.id === 'z1_sound_hop') {
    return <SoundHop testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
  }
  return <HideAndSeekBox testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
}

// 1. Tiny Touch Paws (Bayley Touch Precision)
function TinyTouchPaws({ testDef, onComplete, onCancel }: EngineProps) {
  const [target, setTarget] = useState({ x: 50, y: 50, size: 70 });
  const [trialsDone, setTrialsDone] = useState(0);
  const totalTrials = 10;
  const [latencies, setLatencies] = useState<number[]>([]);
  const [accuracySum, setAccuracySum] = useState<number>(0);
  const appearanceTime = useRef<number>(Date.now());
  const playfieldRef = useRef<HTMLDivElement>(null);

  const spawnTarget = () => {
    const x = Math.floor(15 + Math.random() * 70);
    const y = Math.floor(15 + Math.random() * 70);
    const size = Math.floor(55 + Math.random() * 30);
    setTarget({ x, y, size });
    appearanceTime.current = Date.now();
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playfieldRef.current) return;
    const rect = playfieldRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const dx = clickX - target.x;
    const dy = clickY - target.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const tapAccuracy = Math.max(0, Math.round(100 - dist * 3.5));
    const latency = Date.now() - appearanceTime.current;

    audioEngine.playFeedback('tap');
    const newLatencies = [...latencies, latency];
    const newAccSum = accuracySum + tapAccuracy;
    setLatencies(newLatencies);
    setAccuracySum(newAccSum);

    if (trialsDone + 1 >= totalTrials) {
      const avgAccuracy = Math.round(newAccSum / totalTrials);
      const meanLat = Math.round(newLatencies.reduce((a, b) => a + b, 0) / newLatencies.length);
      const evalResult = evaluateClinicalScore(testDef.id, avgAccuracy);

      onComplete({
        testId: testDef.id,
        testName: testDef.name,
        clinicalTest: testDef.clinicalTest,
        stageId: testDef.stageId, zoneId: testDef.stageId,
        timestamp: Date.now(),
        durationMs: 25000,
        primaryScore: avgAccuracy,
        primaryMetric: testDef.primaryMetric,
        unit: testDef.unit,
        latencies: newLatencies,
        meanLatencyMs: meanLat,
        medianLatencyMs: meanLat,
        accuracyPercent: avgAccuracy,
        percentileRank: evalResult.percentile,
        clinicalStatus: evalResult.status,
        notes: evalResult.notes
      });
    } else {
      setTrialsDone(prev => prev + 1);
      spawnTarget();
    }
  };

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 text-sm">
        <span className="font-medium text-slate-700">Trial {trialsDone + 1} of {totalTrials}</span>
        <span className="text-slate-500 font-mono text-xs">Tap moving paw target promptly</span>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-xs">Abort</button>
      </div>
      <div
        ref={playfieldRef}
        onClick={handleTap}
        className="relative flex-1 bg-teal-50/40 cursor-crosshair overflow-hidden touch-none"
      >
        <div
          style={{
            left: `${target.x}%`,
            top: `${target.y}%`,
            width: `${target.size}px`,
            height: `${target.size}px`,
            transform: 'translate(-50%, -50%)'
          }}
          className="absolute rounded-full bg-teal-600 text-white flex items-center justify-center shadow-sm transition-all duration-150 animate-pulse active:scale-95"
        >
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

// 2. Novelty Peek (Fagan Infant Test)
function NoveltyPeek({ testDef, onComplete, onCancel }: EngineProps) {
  const [round, setRound] = useState(0);
  const totalRounds = 6;
  const [latencies, setLatencies] = useState<number[]>([]);
  const [noveltySelections, setNoveltySelections] = useState<number>(0);
  const startTime = useRef<number>(Date.now());

  // Left vs right stimulus (randomize novel position)
  const isNovelLeft = useRef(Math.random() > 0.5);

  const handleSelect = (selectedLeft: boolean) => {
    const lat = Date.now() - startTime.current;
    const isNovel = selectedLeft === isNovelLeft.current;
    if (isNovel) {
      setNoveltySelections(prev => prev + 1);
      audioEngine.playFeedback('correct');
    } else {
      audioEngine.playFeedback('tap');
    }

    const nextLatencies = [...latencies, lat];
    setLatencies(nextLatencies);

    if (round + 1 >= totalRounds) {
      const noveltyScore = Math.round(((noveltySelections + (isNovel ? 1 : 0)) / totalRounds) * 100);
      const meanLat = Math.round(nextLatencies.reduce((a, b) => a + b, 0) / nextLatencies.length);
      const evalRes = evaluateClinicalScore(testDef.id, noveltyScore);

      onComplete({
        testId: testDef.id,
        testName: testDef.name,
        clinicalTest: testDef.clinicalTest,
        stageId: testDef.stageId, zoneId: testDef.stageId,
        timestamp: Date.now(),
        durationMs: 20000,
        primaryScore: noveltyScore,
        primaryMetric: testDef.primaryMetric,
        unit: testDef.unit,
        latencies: nextLatencies,
        meanLatencyMs: meanLat,
        medianLatencyMs: meanLat,
        accuracyPercent: noveltyScore,
        percentileRank: evalRes.percentile,
        clinicalStatus: evalRes.status,
        notes: evalRes.notes
      });
    } else {
      setRound(prev => prev + 1);
      isNovelLeft.current = Math.random() > 0.5;
      startTime.current = Date.now();
    }
  };

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 text-sm">
        <span className="font-medium text-slate-700">Pair {round + 1} of {totalRounds}</span>
        <span className="text-slate-500 font-mono text-xs">Tap the novel / unfamiliar pattern</span>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-xs">Abort</button>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-8 p-8 items-center bg-slate-50">
        <button
          onClick={() => handleSelect(true)}
          className="h-64 border-2 border-slate-300 hover:border-teal-500 bg-white rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-colors shadow-sm"
        >
          <div className={`w-32 h-32 rounded-lg ${isNovelLeft.current ? 'bg-indigo-600 rotate-45' : 'bg-slate-400'} flex items-center justify-center text-white font-mono text-xl`}>
            {isNovelLeft.current ? '★' : '●'}
          </div>
          <span className="text-xs text-slate-500">Pattern A</span>
        </button>

        <button
          onClick={() => handleSelect(false)}
          className="h-64 border-2 border-slate-300 hover:border-teal-500 bg-white rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-colors shadow-sm"
        >
          <div className={`w-32 h-32 rounded-lg ${!isNovelLeft.current ? 'bg-indigo-600 rotate-45' : 'bg-slate-400'} flex items-center justify-center text-white font-mono text-xl`}>
            {!isNovelLeft.current ? '★' : '●'}
          </div>
          <span className="text-xs text-slate-500">Pattern B</span>
        </button>
      </div>
    </div>
  );
}

// 3. Sound Hop (Behavioral Audiometry)
function SoundHop({ testDef, onComplete, onCancel }: EngineProps) {
  const [trial, setTrial] = useState(0);
  const totalTrials = 8;
  const [side, setSide] = useState<'left' | 'right'>('left');
  const [isPlaying, setIsPlaying] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);
  const chirpTime = useRef<number>(0);

  const playChirp = () => {
    const nextSide = Math.random() > 0.5 ? 'left' : 'right';
    setSide(nextSide);
    setIsPlaying(true);
    const pan = nextSide === 'left' ? -0.85 : 0.85;
    audioEngine.playStereoChirp(pan, 600, 0.4);
    chirpTime.current = Date.now();
  };

  useEffect(() => {
    const timer = setTimeout(playChirp, 700);
    return () => clearTimeout(timer);
  }, [trial]);

  const handleResponse = (selectedSide: 'left' | 'right') => {
    if (!isPlaying) return;
    const lat = Date.now() - chirpTime.current;
    const isCorrect = selectedSide === side;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      audioEngine.playFeedback('correct');
    } else {
      audioEngine.playFeedback('incorrect');
    }

    const nextLat = [...latencies, lat];
    setLatencies(nextLat);
    setIsPlaying(false);

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
        durationMs: 20000,
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
    }
  };

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 text-sm">
        <span className="font-medium text-slate-700">Chirp {trial + 1} of {totalTrials}</span>
        <span className="text-slate-500 font-mono text-xs">Wear headphones: Tap the side the chirp played from</span>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-xs">Abort</button>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-6 p-8 items-center bg-slate-50">
        <button
          onClick={() => handleResponse('left')}
          className="h-64 border-2 border-slate-300 hover:border-teal-600 bg-white rounded-lg flex flex-col items-center justify-center gap-4 transition-all shadow-sm active:scale-98"
        >
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl">
            L
          </div>
          <span className="font-medium text-slate-800">Left Channel</span>
        </button>

        <button
          onClick={() => handleResponse('right')}
          className="h-64 border-2 border-slate-300 hover:border-teal-600 bg-white rounded-lg flex flex-col items-center justify-center gap-4 transition-all shadow-sm active:scale-98"
        >
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl">
            R
          </div>
          <span className="font-medium text-slate-800">Right Channel</span>
        </button>
      </div>
    </div>
  );
}

// 4. Hide & Seek Box (Object Permanence)
function HideAndSeekBox({ testDef, onComplete, onCancel }: EngineProps) {
  const [hiddenUnder, setHiddenUnder] = useState<number>(1);
  const [round, setRound] = useState(0);
  const totalRounds = 5;
  const [isRevealed, setIsRevealed] = useState(true);
  const [score, setScore] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);
  const startTime = useRef<number>(0);

  useEffect(() => {
    // Show item for 1.2s, then cover it
    setIsRevealed(true);
    const chosen = Math.floor(Math.random() * 3);
    setHiddenUnder(chosen);

    const timer = setTimeout(() => {
      setIsRevealed(false);
      startTime.current = Date.now();
    }, 1200);

    return () => clearTimeout(timer);
  }, [round]);

  const handleBoxClick = (index: number) => {
    if (isRevealed) return;
    const lat = Date.now() - startTime.current;
    const correct = index === hiddenUnder;
    if (correct) {
      setScore(prev => prev + 20);
      audioEngine.playFeedback('correct');
    } else {
      audioEngine.playFeedback('incorrect');
    }

    const nextLat = [...latencies, lat];
    setLatencies(nextLat);
    setIsRevealed(true);

    setTimeout(() => {
      if (round + 1 >= totalRounds) {
        const finalScore = score + (correct ? 20 : 0);
        const meanLat = Math.round(nextLat.reduce((a, b) => a + b, 0) / nextLat.length);
        const evalRes = evaluateClinicalScore(testDef.id, finalScore);

        onComplete({
          testId: testDef.id,
          testName: testDef.name,
          clinicalTest: testDef.clinicalTest,
          stageId: testDef.stageId, zoneId: testDef.stageId,
          timestamp: Date.now(),
          durationMs: 25000,
          primaryScore: finalScore,
          primaryMetric: testDef.primaryMetric,
          unit: testDef.unit,
          latencies: nextLat,
          meanLatencyMs: meanLat,
          medianLatencyMs: meanLat,
          accuracyPercent: finalScore,
          percentileRank: evalRes.percentile,
          clinicalStatus: evalRes.status,
          notes: evalRes.notes
        });
      } else {
        setRound(prev => prev + 1);
      }
    }, 900);
  };

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 text-sm">
        <span className="font-medium text-slate-700">Trial {round + 1} of {totalRounds}</span>
        <span className="text-slate-500 font-mono text-xs">
          {isRevealed ? 'Observe which box conceals the token...' : 'Where is the token hidden? Click to retrieve'}
        </span>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-xs">Abort</button>
      </div>

      <div className="flex-1 flex items-center justify-center gap-8 p-8 bg-slate-50">
        {[0, 1, 2].map((idx) => (
          <button
            key={idx}
            onClick={() => handleBoxClick(idx)}
            className="w-48 h-56 border-2 border-slate-300 hover:border-teal-600 bg-white rounded-xl flex flex-col items-center justify-center gap-4 transition-all shadow-sm relative overflow-hidden"
          >
            <div className="w-24 h-24 bg-amber-100 rounded-lg border border-amber-300 flex items-center justify-center text-3xl">
              📦
            </div>
            {isRevealed && hiddenUnder === idx && (
              <div className="absolute top-6 w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center text-xl font-bold animate-bounce shadow">
                ★
              </div>
            )}
            <span className="text-xs font-mono text-slate-500">Box {idx + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
