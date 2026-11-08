import React from 'react';
import { TestResultData } from '../../types/clinical';
import { LIFE_STAGES } from '../../data/clinicalRegistry';

interface Props {
  results: TestResultData[];
  onViewReport: (result: TestResultData) => void;
  onClearHistory: () => void;
  onLaunchTest: () => void;
}

export function SessionRecordsView({ results, onViewReport, onClearHistory, onLaunchTest }: Props) {
  const handleExportAll = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `neuropulse_records_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 sm:pb-4 mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Your Test History
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            {results.length} game{results.length === 1 ? '' : 's'} recorded this session
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {results.length > 0 && (
            <>
              <button
                onClick={handleExportAll}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-mono border border-slate-300 hover:border-slate-400 bg-white rounded-lg shadow-2xs"
              >
                Export JSON
              </button>
              <button
                onClick={onClearHistory}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-mono text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-200 rounded-lg"
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 text-center flex flex-col items-center justify-center">
          <p className="text-sm font-semibold text-slate-800">
            No completed games yet
          </p>
          <p className="text-xs text-slate-500 max-w-xs mt-1 mb-4">
            Pick any of the 7 stages on the hero page to play your first test!
          </p>
          <button
            onClick={onLaunchTest}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg"
          >
            Play a Game
          </button>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-mono">
                <th className="py-2.5 px-4 font-medium">TIME</th>
                <th className="py-2.5 px-4 font-medium">STAGE & TEST</th>
                <th className="py-2.5 px-4 font-medium text-right">SCORE</th>
                <th className="py-2.5 px-4 font-medium text-right">SPEED</th>
                <th className="py-2.5 px-4 font-medium text-right">PERCENTILE</th>
                <th className="py-2.5 px-4 font-medium">STATUS</th>
                <th className="py-2.5 px-4 font-medium text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((res, i) => {
                const stage = LIFE_STAGES.find(s => s.id === (res.stageId || res.zoneId)) || LIFE_STAGES[0];
                return (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-slate-500">
                      {new Date(res.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <div style={{ backgroundColor: stage.accentColor }} className="w-2 h-2 rounded-full shrink-0" />
                        <span>{stage.name} · {res.testName}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-800 text-right tabular-nums">
                      {res.primaryScore} {res.unit}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-600 text-right tabular-nums">
                      {res.meanLatencyMs} ms
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900 text-right tabular-nums">
                      {res.percentileRank}th
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`font-mono font-semibold ${
                        res.clinicalStatus === 'Normal' ? 'text-emerald-700' :
                        res.clinicalStatus === 'Borderline' ? 'text-amber-700' : 'text-rose-700'
                      }`}>
                        {res.clinicalStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => onViewReport(res)}
                        className="px-2.5 py-1 border border-slate-200 hover:border-slate-800 text-slate-800 rounded font-mono text-[11px]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
