import React from 'react';

interface NavbarProps {
  onOpenRecords: () => void;
  completedCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function Navbar({ onOpenRecords, completedCount, searchQuery, onSearchChange }: NavbarProps) {
  return (
    <header className="flex items-center justify-between gap-2 sm:gap-6 px-3 sm:px-6 py-2.5 sm:py-3 bg-white border-b border-slate-200 sticky top-0 z-40 shrink-0">
      {/* Brand wordmark */}
      <div className="flex items-center gap-2 sm:gap-2.5 cursor-pointer text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <span className="hidden xs:inline sm:inline">NeuroPulse</span>
        <span className="hidden md:inline"> Diagnostics</span>
      </div>

      {/* Right Controls: Records & Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
        <button
          onClick={onOpenRecords}
          className="px-2.5 sm:px-3.5 py-1.5 text-xs font-mono font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 sm:gap-1.5"
          aria-label="View test records"
        >
          <span>Records</span>
          {completedCount > 0 && (
            <span className="font-bold text-slate-900">({completedCount})</span>
          )}
        </button>

        {/* Responsive Search Bar */}
        <div className="relative w-32 xs:w-44 sm:w-56 md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search games..."
            className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-slate-900 rounded-lg pl-7 sm:pl-8 pr-6 sm:pr-7 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors font-mono"
          />
          <svg
            className="w-3.5 h-3.5 text-slate-400 absolute left-2 sm:left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-mono"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
