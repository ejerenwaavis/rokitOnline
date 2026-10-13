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
    <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rokit-orange/10 flex items-center justify-center text-rokit-orange">
            <Layers size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Rapid Project Media Bridge</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                {session?.fileType || 'Register'} Batch
              </span>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-0.5 truncate max-w-md">
              Source: {session?.sourceFilename || 'Batch Session'}
            </p>
          </div>
        </div>

        {/* Progress & Controls */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5 text-sm font-semibold text-gray-900">
              <span>Project {Math.min(currentIndex + 1, totalCount)}</span>
              <span className="text-gray-400">of</span>
              <span>{totalCount}</span>
              <span className="ml-2 text-xs font-bold text-rokit-orange">({percent}%)</span>
            </div>
            <p className="text-xs text-gray-500">
              {completedCount} completed · {totalCount - completedCount} remaining
            </p>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            {onDiscard && (
              <button
                type="button"
                onClick={onDiscard}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors title='Discard Batch'"
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
