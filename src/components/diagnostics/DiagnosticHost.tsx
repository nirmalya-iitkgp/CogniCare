import React from 'react';
import { ClinicalTestDef, TestResultData } from '../../types/clinical';
import { Zone1Engine } from './engines/Zone1Engines';
import { Zone2Engine } from './engines/Zone2Engines';
import { Zone3Engine } from './engines/Zone3Engines';
import { Zone4Engine } from './engines/Zone4Engines';
import { Zone5Engine } from './engines/Zone5Engines';
import { Zone6Engine } from './engines/Zone6Engines';
import { Zone7Engine } from './engines/Zone7Engines';
import { LIFE_STAGES } from '../../data/clinicalRegistry';

interface Props {
  testDef: ClinicalTestDef;
  onComplete: (result: TestResultData) => void;
  onCancel: () => void;
}

export function DiagnosticHost({ testDef, onComplete, onCancel }: Props) {
  const stage = LIFE_STAGES.find(s => s.id === testDef.stageId) || LIFE_STAGES[0];

  const renderEngine = () => {
    switch (testDef.stageId) {
      case 'stage1':
        return <Zone1Engine testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
      case 'stage2':
        return <Zone2Engine testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
      case 'stage3':
        return <Zone3Engine testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
      case 'stage4':
        return <Zone4Engine testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
      case 'stage5':
        return <Zone5Engine testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
      case 'stage6':
        return <Zone6Engine testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
      case 'stage7':
        return <Zone7Engine testDef={testDef} onComplete={onComplete} onCancel={onCancel} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl h-[92dvh] sm:h-[620px] max-h-[700px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Strip */}
        <div className="flex items-center justify-between gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div
              style={{ backgroundColor: stage.accentColor }}
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0"
            />
            <div className="truncate">
              <h2 className="text-sm sm:text-base font-semibold text-slate-900 leading-tight truncate">
                {testDef.name}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-mono truncate">
                {stage.name} ({stage.ageBracket}) · {testDef.clinicalTest}
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="text-xs font-mono px-2.5 sm:px-3 py-1.5 border border-slate-300 hover:border-slate-800 text-slate-700 rounded-md transition-colors shrink-0"
          >
            Exit ✕
          </button>
        </div>

        {/* Playfield Viewport */}
        <div className="flex-1 overflow-hidden relative">
          {renderEngine()}
        </div>
      </div>
    </div>
  );
}
