import React from 'react';
import { CheckCircle2, SkipForward, Save, Loader2 } from 'lucide-react';

export default function ProjectActionBar({
  isSubmitting,
  onCommitAndAdvance,
  onSkip,
  onSaveDraft,
  mediaCount,
}) {
  return (
    <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur border-t border-gray-200 px-6 py-4 shadow-lg rounded-t-xl flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="font-semibold text-gray-800">{mediaCount}</span> media asset{mediaCount === 1 ? '' : 's'} staged across milestones
      </div>

      <div className="flex items-center gap-3">
        {/* Skip Project */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSkip}
          className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-semibold transition disabled:opacity-50"
        >
          <SkipForward size={14} /> Skip Project
        </button>

        {/* Save Draft */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSaveDraft}
          className="flex items-center gap-1.5 px-4 py-2 border border-rokit-dark text-rokit-dark hover:bg-gray-50 rounded-lg text-xs font-semibold transition disabled:opacity-50"
        >
          <Save size={14} /> Save Draft
        </button>

        {/* Save & Advance */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onCommitAndAdvance}
          className="flex items-center gap-2 px-5 py-2 bg-rokit-orange hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition shadow-md shadow-orange-500/20 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              <span>Save & Advance</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
