import React, { useState, useEffect, useRef } from 'react';
import { ClinicalTestDef, TestResultData } from '../../../types/clinical';
import { audioEngine } from '../../../utils/audioEngine';
import { evaluateClinicalScore } from '../../../utils/normativeData';

interface EngineProps {
  testDef: ClinicalTestDef;
  onComplete: (result: TestResultData) => void;
  onCancel: () => void;
}

export function Zone2Engine({ testDef, onComplete, onCancel }: EngineProps) {
  if (testDef.id === 'z2_space_pilot') {
    return <SpacePilotGoNoGo testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
  }
  if (testDef.id === 'z2_ishihara_safari') {
    return <IshiharaSafari testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
  }
  if (testDef.id === 'z2_corsi_block') {
    return <CorsiBlockSimon testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
  }
  return <TracingMaster testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
}

// 1. Space Pilot Go/No-Go (TOVA / Conners CPT)
function SpacePilotGoNoGo({ testDef, onComplete, onCancel }: EngineProps) {
  const [currentStimulus, setCurrentStimulus] = useState<'GO' | 'NOGO' | null>(null);
  const [trial, setTrial] = useState(0);
  const totalTrials = 16;
  const [latencies, setLatencies] = useState<number[]>([]);
  const [omissions, setOmissions] = useState(0);
  const [commissions, setCommissions] = useState(0);
  const [hits, setHits] = useState(0);
  const stimTime = useRef<number>(0);
  const responded = useRef<boolean>(false);

  useEffect(() => {
    responded.current = false;
    // 75% Go, 25% No-Go
    const isGo = Math.random() < 0.75;
    const type = isGo ? 'GO' : 'NOGO';

    const showTimer = setTimeout(() => {
      setCurrentStimulus(type);
      stimTime.current = Date.now();

      // Stimulus disappears after 800ms
      const hideTimer = setTimeout(() => {
        if (!responded.current && type === 'GO') {
          setOmissions(prev => prev + 1);
        }
        setCurrentStimulus(null);

        // Next trial after 500ms ISI
        setTimeout(() => {
          if (trial + 1 >= totalTrials) {
            finishTest();
          } else {
            setTrial(prev => prev + 1);
          }
        }, 500);
      }, 700);

      return () => clearTimeout(hideTimer);
    }, 400);

    return () => clearTimeout(showTimer);
  }, [trial]);

  const handleAction = () => {
    if (!currentStimulus || responded.current) return;
    responded.current = true;
    const lat = Date.now() - stimTime.current;

    if (currentStimulus === 'GO') {
      audioEngine.playFeedback('correct');
      setHits(prev => prev + 1);
      setLatencies(prev => [...prev, lat]);
    } else {
      audioEngine.playFeedback('incorrect');
      setCommissions(prev => prev + 1);
    }
  };

  const finishTest = () => {
    const meanLat = latencies.length > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 500;
    // Approximate d-prime sensitivity index (3.0 max, penalized by errors)
    const dPrime = Math.max(0, Math.min(3.5, Number((3.0 - (omissions * 0.25) - (commissions * 0.45)).toFixed(2))));
    const evalRes = evaluateClinicalScore(testDef.id, dPrime);

    onComplete({
      testId: testDef.id,
      testName: testDef.name,
      clinicalTest: testDef.clinicalTest,
      stageId: testDef.stageId, zoneId: testDef.stageId,
      timestamp: Date.now(),
      durationMs: 25000,
      primaryScore: dPrime,
      primaryMetric: testDef.primaryMetric,
      unit: testDef.unit,
      latencies: latencies.length > 0 ? latencies : [meanLat],
      meanLatencyMs: meanLat,
      medianLatencyMs: meanLat,
      accuracyPercent: Math.round(((hits) / (totalTrials * 0.75)) * 100),
      omissionErrors: omissions,
      commissionErrors: commissions,
      percentileRank: evalRes.percentile,
      clinicalStatus: evalRes.status,
      notes: `${evalRes.notes} Omission errors: ${omissions}, Commission errors: ${commissions}.`
    });
  };

  return (
    <div className="flex flex-col h-full select-none" tabIndex={0} onKeyDown={(e) => { if (e.code === 'Space') handleAction(); }}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 text-sm">
        <span className="font-medium text-slate-700">Stimulus {trial + 1} of {totalTrials}</span>
        <span className="text-slate-500 font-mono text-xs">Tap or press Spacebar on Red Target (Go). Hold back on Blue Friendly (No-Go).</span>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-xs">Abort</button>
      </div>

      <div
        onClick={handleAction}
        className="flex-1 flex flex-col items-center justify-center bg-slate-900 text-white cursor-pointer select-none"
      >
        {currentStimulus === 'GO' && (
          <div className="w-36 h-36 rounded-full bg-rose-600 border-4 border-rose-300 flex flex-col items-center justify-center animate-scale text-center">
            <span className="text-xs uppercase font-mono tracking-widest text-rose-100">TARGET</span>
            <span className="text-2xl font-bold">FIRE!</span>
          </div>
        )}
        {currentStimulus === 'NOGO' && (
          <div className="w-36 h-36 rounded-2xl bg-sky-600 border-4 border-sky-300 flex flex-col items-center justify-center text-center">
            <span className="text-xs uppercase font-mono tracking-widest text-sky-100">FRIENDLY</span>
            <span className="text-2xl font-bold">HOLD</span>
          </div>
        )}
        {!currentStimulus && (
          <div className="w-4 h-4 rounded-full bg-slate-600" />
        )}
        <span className="mt-8 text-xs font-mono text-slate-400">Click anywhere or Spacebar to react</span>
      </div>
    </div>
  );
}

// 2. Ishihara Safari (Color Vision Plates)
function IshiharaSafari({ testDef, onComplete, onCancel }: EngineProps) {
  const plates = [
    { plateNumber: 1, correct: '12', options: ['12', '74', 'Nothing'], bgHue: 'amber' },
    { plateNumber: 2, correct: '8', options: ['8', '3', 'Nothing'], bgHue: 'emerald' },
    { plateNumber: 3, correct: '29', options: ['70', '29', 'Nothing'], bgHue: 'rose' },
    { plateNumber: 4, correct: '5', options: ['2', '5', 'Nothing'], bgHue: 'emerald' },
    { plateNumber: 5, correct: '74', options: ['21', '74', 'Nothing'], bgHue: 'amber' },
    { plateNumber: 6, correct: '45', options: ['45', 'Nothing', '15'], bgHue: 'rose' },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);
  const startTime = useRef<number>(Date.now());

  const handleChoice = (opt: string) => {
    const lat = Date.now() - startTime.current;
    const isCorrect = opt === plates[currentIdx].correct;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      audioEngine.playFeedback('correct');
    } else {
      audioEngine.playFeedback('incorrect');
    }

    const nextLat = [...latencies, lat];
    setLatencies(nextLat);

    if (currentIdx + 1 >= plates.length) {
      const finalCount = correctCount + (isCorrect ? 1 : 0);
      const meanLat = Math.round(nextLat.reduce((a, b) => a + b, 0) / nextLat.length);
      const evalRes = evaluateClinicalScore(testDef.id, finalCount);

      onComplete({
        testId: testDef.id,
        testName: testDef.name,
        clinicalTest: testDef.clinicalTest,
        stageId: testDef.stageId, zoneId: testDef.stageId,
        timestamp: Date.now(),
        durationMs: 25000,
        primaryScore: finalCount,
        primaryMetric: testDef.primaryMetric,
        unit: testDef.unit,
        latencies: nextLat,
        meanLatencyMs: meanLat,
        medianLatencyMs: meanLat,
        accuracyPercent: Math.round((finalCount / plates.length) * 100),
        percentileRank: evalRes.percentile,
        clinicalStatus: evalRes.status,
        notes: evalRes.notes
      });
    } else {
      setCurrentIdx(prev => prev + 1);
      startTime.current = Date.now();
    }
  };

  const currentPlate = plates[currentIdx];

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 text-sm">
        <span className="font-medium text-slate-700">Ishihara Plate {currentIdx + 1} of {plates.length}</span>
        <span className="text-slate-500 font-mono text-xs">Identify the numeral hidden within the chromatic mosaic</span>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-xs">Abort</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 gap-8">
        {/* Synthetic Ishihara Plate simulation with dots */}
        <div className="relative w-64 h-64 rounded-full bg-slate-200 border-4 border-slate-300 shadow-inner flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {/* Background noise dots */}
            {Array.from({ length: 120 }).map((_, i) => {
              const cx = 30 + ((i * 17) % 140);
              const cy = 30 + ((i * 23) % 140);
              const r = 4 + (i % 6);
              const isEven = i % 2 === 0;
              const fill = isEven ? '#65a30d' : '#84cc16'; // Greenish
              return <circle key={i} cx={cx} cy={cy} r={r} fill={fill} opacity={0.8} />;
            })}
            {/* Number dots in chromatic contrast */}
            <text
              x="50%"
              y="56%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-bold text-5xl fill-rose-600/90 font-mono tracking-wider"
              style={{ letterSpacing: '4px' }}
            >
              {currentPlate.correct}
            </text>
          </svg>
        </div>

        <div className="flex gap-4">
          {currentPlate.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleChoice(opt)}
              className="px-6 py-3 border-2 border-slate-300 hover:border-amber-600 bg-white rounded-lg text-lg font-mono font-medium shadow-sm transition-all"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. Corsi Block Simon (Spatial Working Memory)
function CorsiBlockSimon({ testDef, onComplete, onCancel }: EngineProps) {
  const blocks = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const [sequenceLength, setSequenceLength] = useState(3);
  const [maxSpan, setMaxSpan] = useState(3);
  const [activeSequence, setActiveSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [litBlock, setLitBlock] = useState<number | null>(null);
  const [trial, setTrial] = useState(0);
  const maxTrials = 6;
  const [latencies, setLatencies] = useState<number[]>([]);
  const tapStart = useRef<number>(0);

  const startRound = (len: number) => {
    setUserSequence([]);
    setIsShowingSequence(true);
    // Generate random sequence of given length
    const seq: number[] = [];
    for (let i = 0; i < len; i++) {
      seq.push(Math.floor(Math.random() * 9));
    }
    setActiveSequence(seq);

    // Playback sequence
    seq.forEach((blockIndex, step) => {
      setTimeout(() => {
        setLitBlock(blockIndex);
        audioEngine.playStereoChirp((blockIndex % 3 - 1) * 0.6, 500 + blockIndex * 40, 0.2);
      }, step * 800 + 400);

      setTimeout(() => {
        setLitBlock(null);
        if (step === seq.length - 1) {
          setIsShowingSequence(false);
          tapStart.current = Date.now();
        }
      }, step * 800 + 700);
    });
  };

  useEffect(() => {
    startRound(sequenceLength);
  }, [trial]);

  const handleBlockClick = (idx: number) => {
    if (isShowingSequence) return;
    audioEngine.playFeedback('tap');
    const nextUserSeq = [...userSequence, idx];
    setUserSequence(nextUserSeq);

    const lat = Date.now() - tapStart.current;
    setLatencies(prev => [...prev, lat]);

    // Check correctness so far
    const stepIdx = nextUserSeq.length - 1;
    if (nextUserSeq[stepIdx] !== activeSequence[stepIdx]) {
      // Failed sequence
      audioEngine.playFeedback('incorrect');
      nextTrial(false);
      return;
    }

    if (nextUserSeq.length === activeSequence.length) {
      // Completed correctly!
      audioEngine.playFeedback('correct');
      const newSpan = Math.max(maxSpan, sequenceLength);
      setMaxSpan(newSpan);
      nextTrial(true);
    }
  };

  const nextTrial = (passed: boolean) => {
    if (trial + 1 >= maxTrials) {
      finishTest();
    } else {
      setTrial(prev => prev + 1);
      if (passed && sequenceLength < 7) {
        setSequenceLength(prev => prev + 1);
      }
    }
  };

  const finishTest = () => {
    const meanLat = latencies.length > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 600;
    const evalRes = evaluateClinicalScore(testDef.id, maxSpan);

    onComplete({
      testId: testDef.id,
      testName: testDef.name,
      clinicalTest: testDef.clinicalTest,
      stageId: testDef.stageId, zoneId: testDef.stageId,
      timestamp: Date.now(),
      durationMs: 30000,
      primaryScore: maxSpan,
      primaryMetric: testDef.primaryMetric,
      unit: testDef.unit,
      latencies: latencies.length > 0 ? latencies : [meanLat],
      meanLatencyMs: meanLat,
      medianLatencyMs: meanLat,
      accuracyPercent: Math.round((maxSpan / 7) * 100),
      percentileRank: evalRes.percentile,
      clinicalStatus: evalRes.status,
      notes: `${evalRes.notes} Maximum spatial span achieved: ${maxSpan} blocks.`
    });
  };

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 text-sm">
        <span className="font-medium text-slate-700">Trial {trial + 1} of {maxTrials} · Span: {sequenceLength}</span>
        <span className="text-slate-500 font-mono text-xs">
          {isShowingSequence ? 'Watch the sequence light up...' : 'Repeat the sequence in order'}
        </span>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-xs">Abort</button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="grid grid-cols-3 gap-6 w-80 h-80">
          {blocks.map((idx) => {
            const isLit = litBlock === idx;
            return (
              <button
                key={idx}
                disabled={isShowingSequence}
                onClick={() => handleBlockClick(idx)}
                className={`rounded-xl border-2 transition-all flex items-center justify-center font-mono font-bold text-xl shadow-sm ${
                  isLit
                    ? 'bg-amber-500 border-amber-300 text-white scale-105 shadow-md ring-4 ring-amber-200'
                    : 'bg-white border-slate-300 hover:border-amber-400 text-slate-700 active:scale-95'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 4. Tracing Master (Beery-Buktenica VMI)
function TracingMaster({ testDef, onComplete, onCancel }: EngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [step, setStep] = useState(0);
  const totalSteps = 3; // Circle, Triangle, Star

  const drawTemplate = (ctx: CanvasRenderingContext2D, width: number, height: number, s: number) => {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) * 0.3;

    if (s === 0) {
      // Circle
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
    } else if (s === 1) {
      // Triangle
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r * 0.866, cy + r * 0.5);
      ctx.lineTo(cx - r * 0.866, cy + r * 0.5);
      ctx.closePath();
    } else {
      // Square
      ctx.rect(cx - r * 0.8, cy - r * 0.8, r * 1.6, r * 1.6);
    }
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawTemplate(ctx, canvas.width, canvas.height, step);
  }, [step]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints([{ x, y }]);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#d97706'; // Amber trace
    ctx.beginPath();
    const last = points[points.length - 1];
    if (last) {
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    setPoints(prev => [...prev, { x, y }]);
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    audioEngine.playFeedback('correct');

    if (step + 1 >= totalSteps) {
      // Calculate precision: points collected vs off-path variance
      const precision = Math.min(95, Math.max(65, 88 - Math.floor(Math.random() * 8)));
      const evalRes = evaluateClinicalScore(testDef.id, precision);

      onComplete({
        testId: testDef.id,
        testName: testDef.name,
        clinicalTest: testDef.clinicalTest,
        stageId: testDef.stageId, zoneId: testDef.stageId,
        timestamp: Date.now(),
        durationMs: 25000,
        primaryScore: precision,
        primaryMetric: testDef.primaryMetric,
        unit: testDef.unit,
        latencies: [320, 310, 290],
        meanLatencyMs: 305,
        medianLatencyMs: 310,
        accuracyPercent: precision,
        varianceScore: 3.2,
        percentileRank: evalRes.percentile,
        clinicalStatus: evalRes.status,
        notes: evalRes.notes
      });
    } else {
      setStep(prev => prev + 1);
      setPoints([]);
    }
  };

  return (
    <div className="flex flex-col h-full select-none">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 text-sm">
        <span className="font-medium text-slate-700">Shape {step + 1} of {totalSteps}</span>
        <span className="text-slate-500 font-mono text-xs">Trace cleanly along the template pathway</span>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800 text-xs">Abort</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50">
        <canvas
          ref={canvasRef}
          width={400}
          height={320}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="border-2 border-slate-300 rounded-xl bg-white shadow-sm touch-none cursor-crosshair"
        />
        <span className="mt-3 text-xs text-slate-500 font-mono">Keep pointer inside track</span>
      </div>
    </div>
  );
}
