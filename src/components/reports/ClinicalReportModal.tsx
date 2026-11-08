import React from 'react';
import { TestResultData } from '../../types/clinical';
import { LIFE_STAGES } from '../../data/clinicalRegistry';

interface Props {
  result: TestResultData;
  onClose: () => void;
  onRetest?: () => void;
}

export function ClinicalReportModal({ result, onClose, onRetest }: Props) {
  const stage = LIFE_STAGES.find(s => s.id === (result.stageId || result.zoneId)) || LIFE_STAGES[0];

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `neuropulse_${result.testId}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const minLat = result.latencies.length > 0 ? Math.min(...result.latencies) : 200;
  const maxLat = result.latencies.length > 0 ? Math.max(...result.latencies) : 600;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92dvh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-0.5 truncate">
              <span>{stage.name} ({stage.ageBracket})</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{result.clinicalTest}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
              {result.testName} Results
            </h2>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="hidden xs:inline-block px-2.5 sm:px-3 py-1.5 border border-slate-200 hover:border-slate-400 bg-white text-xs font-medium text-slate-700 rounded-lg shadow-2xs"
            >
              Print
            </button>
            <button
              onClick={handleExportJSON}
              className="px-2.5 sm:px-3 py-1.5 border border-slate-200 hover:border-slate-400 bg-white text-xs font-medium text-slate-700 rounded-lg shadow-2xs"
            >
              Export
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 bg-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          {/* Top Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            <div className="border border-slate-200 rounded-xl p-3 sm:p-4 bg-slate-50/50">
              <span className="text-xs font-mono text-slate-500 block mb-1">
                Score
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {result.primaryScore} <span className="text-sm font-normal text-slate-500">{result.unit}</span>
              </div>
              <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                {result.primaryMetric}
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <span className="text-xs font-mono text-slate-500 block mb-1">
                Percentile Rank
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {result.percentileRank}th
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Age Normalized
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <span className="text-xs font-mono text-slate-500 block mb-1">
                Evaluation
              </span>
              <div className={`text-xl font-bold font-mono ${
                result.clinicalStatus === 'Normal' ? 'text-emerald-700' :
                result.clinicalStatus === 'Borderline' ? 'text-amber-700' : 'text-rose-700'
              }`}>
                {result.clinicalStatus}
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Baseline Rating
              </span>
            </div>
          </div>

          {/* Reaction Latency Breakdown */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase font-mono">
                Response Times
              </h4>
              <span className="text-xs font-mono text-slate-500">
                Average: {result.meanLatencyMs} ms
              </span>
            </div>

            <div className="h-20 flex items-end gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              {result.latencies.map((lat, idx) => {
                const heightPercent = Math.min(100, Math.max(20, Math.round(((lat - minLat + 40) / (maxLat - minLat + 80)) * 100)));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-slate-800 rounded-t hover:bg-slate-950 transition-all"
                    />
                    <span className="text-[9px] font-mono text-slate-400">
                      {idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Plain Summary Note */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <p className="text-xs text-slate-700 leading-relaxed font-mono">
              {result.notes}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-white">
          <span className="text-xs font-mono text-slate-400">
            {new Date(result.timestamp).toLocaleTimeString()}
          </span>
          <div className="flex gap-2">
            {onRetest && (
              <button
                onClick={onRetest}
                className="px-4 py-1.5 border border-slate-300 hover:border-slate-800 text-slate-800 text-xs font-semibold rounded-lg"
              >
                Play Again
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
