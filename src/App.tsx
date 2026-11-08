import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { SplitHero } from './components/hero/SplitHero';
import { DiagnosticHost } from './components/diagnostics/DiagnosticHost';
import { ClinicalReportModal } from './components/reports/ClinicalReportModal';
import { SessionRecordsView } from './components/session/SessionRecordsView';
import { ClinicalTestDef, TestResultData } from './types/clinical';
import { CLINICAL_TESTS } from './data/clinicalRegistry';

export default function App() {
  const [activeStageId, setActiveStageId] = useState<string>('stage2');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTest, setActiveTest] = useState<ClinicalTestDef | null>(null);
  const [activeReport, setActiveReport] = useState<TestResultData | null>(null);
  const [showRecordsModal, setShowRecordsModal] = useState<boolean>(false);
  const [history, setHistory] = useState<TestResultData[]>([]);

  // Load session history from localStorage on initial load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('neuropulse_results_v1');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  const saveResult = (result: TestResultData) => {
    const updated = [result, ...history];
    setHistory(updated);
    try {
      localStorage.setItem('neuropulse_results_v1', JSON.stringify(updated));
    } catch {
      // LocalStorage fallback
    }
    setActiveTest(null);
    setActiveReport(result);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('neuropulse_results_v1');
    } catch {
      // LocalStorage fallback
    }
  };

  const handleStartTest = (test: ClinicalTestDef) => {
    setActiveTest(test);
  };

  const handleRandomTest = () => {
    const randomTest = CLINICAL_TESTS[Math.floor(Math.random() * CLINICAL_TESTS.length)];
    setActiveStageId(randomTest.stageId);
    setActiveTest(randomTest);
  };

  return (
    <div className="h-dvh w-full overflow-hidden bg-white text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Clean Light Navbar with Search Bar moved to the right */}
      <Navbar
        onOpenRecords={() => setShowRecordsModal(true)}
        completedCount={history.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Viewport: The 7-Way Split Hero Centerpiece */}
      <main className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden relative">
        <SplitHero
          onSelectTest={handleStartTest}
          activeStageId={activeStageId}
          onActiveStageChange={setActiveStageId}
          searchQuery={searchQuery}
        />
      </main>

      {/* Active Game Modal */}
      {activeTest && (
        <DiagnosticHost
          testDef={activeTest}
          onComplete={saveResult}
          onCancel={() => setActiveTest(null)}
        />
      )}

      {/* Results Report Modal */}
      {activeReport && (
        <ClinicalReportModal
          result={activeReport}
          onClose={() => setActiveReport(null)}
          onRetest={() => {
            const def = CLINICAL_TESTS.find(t => t.id === activeReport.testId);
            if (def) {
              setActiveReport(null);
              setActiveTest(def);
            }
          }}
        />
      )}

      {/* History Slide-Over Modal */}
      {showRecordsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto p-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowRecordsModal(false)}
                className="text-xs font-mono px-3 py-1.5 border border-slate-300 hover:border-slate-800 rounded-md"
              >
                Close History ✕
              </button>
            </div>
            <SessionRecordsView
              results={history}
              onViewReport={(r) => {
                setShowRecordsModal(false);
                setActiveReport(r);
              }}
              onClearHistory={handleClearHistory}
              onLaunchTest={() => {
                setShowRecordsModal(false);
                handleRandomTest();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
