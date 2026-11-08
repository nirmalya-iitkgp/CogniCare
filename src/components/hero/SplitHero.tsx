import React, { useState } from 'react';
import { LIFE_STAGES, CLINICAL_TESTS } from '../../data/clinicalRegistry';
import { ClinicalTestDef } from '../../types/clinical';
import { LifeStageLineArt } from './LifeStageLineArt';

interface SplitHeroProps {
  onSelectTest: (test: ClinicalTestDef) => void;
  activeStageId: string;
  onActiveStageChange: (stageId: string) => void;
  searchQuery: string;
}

// Tailored light palettes for each life stage
const STAGE_LIGHT_PALETTES: Record<string, { bgGrad: string; activeBg: string; border: string }> = {
  stage1: {
    bgGrad: 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 85%)',
    activeBg: 'linear-gradient(180deg, #ccfbf1 0%, #f0fdfa 45%, #ffffff 100%)',
    border: '#99f6e4'
  },
  stage2: {
    bgGrad: 'linear-gradient(180deg, #fffbeb 0%, #ffffff 85%)',
    activeBg: 'linear-gradient(180deg, #fef3c7 0%, #fffbeb 45%, #ffffff 100%)',
    border: '#fde68a'
  },
  stage3: {
    bgGrad: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 85%)',
    activeBg: 'linear-gradient(180deg, #dbeafe 0%, #eff6ff 45%, #ffffff 100%)',
    border: '#bfdbfe'
  },
  stage4: {
    bgGrad: 'linear-gradient(180deg, #f5f3ff 0%, #ffffff 85%)',
    activeBg: 'linear-gradient(180deg, #ede9fe 0%, #f5f3ff 45%, #ffffff 100%)',
    border: '#ddd6fe'
  },
  stage5: {
    bgGrad: 'linear-gradient(180deg, #ecfdf5 0%, #ffffff 85%)',
    activeBg: 'linear-gradient(180deg, #d1fae5 0%, #ecfdf5 45%, #ffffff 100%)',
    border: '#a7f3d0'
  },
  stage6: {
    bgGrad: 'linear-gradient(180deg, #eef2ff 0%, #ffffff 85%)',
    activeBg: 'linear-gradient(180deg, #e0e7ff 0%, #eef2ff 45%, #ffffff 100%)',
    border: '#c7d2fe'
  },
  stage7: {
    bgGrad: 'linear-gradient(180deg, #fff1f2 0%, #ffffff 85%)',
    activeBg: 'linear-gradient(180deg, #ffe4e6 0%, #fff1f2 45%, #ffffff 100%)',
    border: '#fecdd3'
  }
};

export function SplitHero({
  onSelectTest,
  activeStageId,
  onActiveStageChange,
  searchQuery,
}: SplitHeroProps) {
  const [hoveredStageId, setHoveredStageId] = useState<string | null>(null);

  // If search matches a test, automatically expand that stage
  let effectiveStageId = hoveredStageId || activeStageId;
  if (searchQuery.trim()) {
    const match = CLINICAL_TESTS.find(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (match) {
      effectiveStageId = match.stageId;
    }
  }

  return (
    <section className="relative w-full h-full min-h-0 bg-white select-none">
      {/* 7-Way Vertical Split Slices on Desktop, Smooth Accordion on Mobile/Tablet */}
      <div className="flex flex-col lg:flex-row w-full h-full divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {LIFE_STAGES.map((stage) => {
          const isExpanded = effectiveStageId === stage.id;
          const stageTests = CLINICAL_TESTS.filter(t => t.stageId === stage.id);
          const palette = STAGE_LIGHT_PALETTES[stage.id] || STAGE_LIGHT_PALETTES.stage1;
          const hasSearchMatch = searchQuery.trim() && stageTests.some(t =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
          );

          return (
            <div
              key={stage.id}
              onMouseEnter={() => setHoveredStageId(stage.id)}
              onMouseLeave={() => setHoveredStageId(null)}
              onClick={() => onActiveStageChange(isExpanded ? '' : stage.id)}
              style={{
                background: isExpanded ? palette.activeBg : palette.bgGrad,
              }}
              className={`relative transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between overflow-hidden group ${
                isExpanded
                  ? 'lg:flex-[3.5] min-h-[360px] sm:min-h-[380px] lg:min-h-0'
                  : 'lg:flex-[1] min-h-[56px] sm:min-h-[64px] lg:min-h-0 hover:bg-slate-50'
              } ${hasSearchMatch ? 'ring-2 ring-inset ring-amber-500' : ''}`}
            >
              {/* Subtle background stage index watermark (desktop) */}
              <div
                style={{ color: stage.accentColor }}
                className="hidden lg:block absolute right-3 top-3 font-mono font-black text-6xl opacity-[0.06] pointer-events-none select-none transition-opacity"
              >
                0{stage.id.replace('stage', '')}
              </div>

              {/* Vector Line Art Illustration */}
              <div
                className={`absolute inset-x-0 lg:top-12 lg:bottom-20 flex items-center justify-center p-3 transition-all duration-500 pointer-events-none ${
                  isExpanded
                    ? 'top-4 bottom-4 lg:top-12 lg:bottom-20 opacity-35 lg:opacity-30 scale-100 lg:scale-105'
                    : 'hidden lg:flex opacity-90 group-hover:opacity-100 group-hover:scale-102'
                }`}
              >
                <LifeStageLineArt
                  stageId={stage.id}
                  accentColor={stage.accentColor}
                  isExpanded={isExpanded}
                />
              </div>

              {/* Mobile / Tablet Collapsed Header Row */}
              <div className="lg:hidden p-3.5 sm:p-4.5 flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <span
                    style={{
                      color: stage.accentColor,
                      borderColor: `${stage.accentColor}40`,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                    className="font-mono text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded border shadow-2xs shrink-0"
                  >
                    {stage.ageBracket}
                  </span>
                  <div className="truncate">
                    <span className="text-base sm:text-lg font-bold text-slate-900 leading-none">
                      {stage.name}
                    </span>
                    <span className="hidden sm:inline text-xs text-slate-500 font-mono ml-2">
                      · {stage.subtitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono text-slate-600 font-medium">
                    4 Games
                  </span>
                  <div
                    style={{ color: stage.accentColor }}
                    className={`transform transition-transform duration-200 text-sm font-bold ${
                      isExpanded ? 'rotate-180' : 'rotate-0'
                    }`}
                  >
                    ▼
                  </div>
                </div>
              </div>

              {/* Desktop Top Meta: Age Bracket */}
              <div className="hidden lg:flex relative z-10 p-5 items-center justify-between">
                <span
                  style={{
                    color: stage.accentColor,
                    borderColor: `${stage.accentColor}40`,
                    backgroundColor: 'rgba(255, 255, 255, 0.85)'
                  }}
                  className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md border shadow-2xs backdrop-blur-xs"
                >
                  {stage.ageBracket}
                </span>
              </div>

              {/* Bottom Body Content / Expanded Panel */}
              <div className={`relative z-10 px-4 pb-4 pt-1 sm:p-5 lg:p-6 flex flex-col justify-end ${!isExpanded ? 'hidden lg:flex' : ''}`}>
                {/* Title Lockup (Desktop) */}
                <div className="hidden lg:block">
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                    {stage.name}
                  </h3>
                  <p
                    style={{ color: stage.accentColor }}
                    className="text-xs font-medium font-mono mt-0.5"
                  >
                    {stage.subtitle}
                  </p>
                </div>

                {/* Subtitle note on mobile when expanded */}
                <div className="lg:hidden mb-2">
                  <p style={{ color: stage.accentColor }} className="text-xs font-medium font-mono">
                    {stage.subtitle}
                  </p>
                </div>

                {/* Expanded State: 4 Clean Game Cards (Responsive 1-col on mobile, 2-col on tablet, 1-col on split desktop) */}
                {isExpanded ? (
                  <div className="mt-2 lg:mt-4 space-y-2 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                      {stageTests.map((test) => {
                        const isMatch = searchQuery.trim() && (
                          test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
                        );

                        return (
                          <div
                            key={test.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTest(test);
                            }}
                            className={`p-3 sm:p-3.5 rounded-xl border transition-all text-left flex items-center justify-between gap-2.5 sm:gap-3 shadow-2xs ${
                              isMatch
                                ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300'
                                : 'bg-white/95 hover:bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="truncate mr-1">
                              <h4 className="text-xs font-bold text-slate-900 truncate">
                                {test.name}
                              </h4>
                              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                {test.shortDesc}
                              </p>
                            </div>

                            <button
                              style={{ backgroundColor: stage.accentColor }}
                              className="px-3.5 sm:px-4 py-2 sm:py-1.5 text-xs font-semibold text-white rounded-lg shrink-0 shadow-2xs hover:opacity-95 active:scale-95 transition-transform"
                            >
                              Play
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 hidden lg:flex items-center justify-between text-xs font-medium text-slate-600">
                    <span className="font-mono text-[11px]">4 Games</span>
                    <span style={{ color: stage.accentColor }} className="font-semibold text-xs">
                      Open →
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
