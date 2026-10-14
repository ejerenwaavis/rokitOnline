import React from 'react';
import { Layers, Pause, Play, Trash2, CheckCircle2 } from 'lucide-react';

export default function SessionHeaderBar({
  session,
  currentIndex,
  totalCount,
  completedCount,
  onPauseResume,
  onDiscard,
}) {
  const percent = totalCount > 0 ? Math.round(((currentIndex) / totalCount) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title & Badge */}
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-rokit-orange/10 flex items-center justify-center text-rokit-orange shrink-0 mt-0.5 sm:mt-0">
            <Layers size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-snug">
                Rapid Project Media Bridge
              </h2>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold uppercase bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                {session?.fileType || 'Register'} Batch
              </span>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-1 truncate">
              Source: {session?.sourceFilename || 'Batch Session'}
            </p>
          </div>
        </div>

        {/* Progress & Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-900">
              <span>Project {Math.min(currentIndex + 1, totalCount)}</span>
              <span className="text-gray-400">of</span>
              <span>{totalCount}</span>
              <span className="ml-1 text-xs font-bold text-rokit-orange">({percent}%)</span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
              {completedCount} completed · {Math.max(0, totalCount - completedCount)} remaining
            </p>
          </div>

          <div className="flex items-center pl-3 border-l border-gray-200">
            {onDiscard && (
              <button
                type="button"
                onClick={onDiscard}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Discard Batch"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Persistent Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 mt-4 overflow-hidden">
        <div
          className="bg-rokit-orange h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
