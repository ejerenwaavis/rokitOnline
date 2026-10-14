import React, { useState } from 'react';
import { Plus, Check, Folder, Trash2, X } from 'lucide-react';

export default function MilestoneTrack({
  milestones = [],
  activeMilestoneId,
  onSelectMilestone,
  onAddMilestone,
  onDeleteMilestone,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const activeMilestone = milestones.find((m) => m.id === activeMilestoneId);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddMilestone(newTitle.trim());
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Project Milestones ({milestones.length})
          </h3>
          <span className="text-[11px] text-gray-400 hidden sm:inline">
            Select a milestone tab to stage and view media
          </span>
        </div>

        {activeMilestone && onDeleteMilestone && (
          <button
            type="button"
            onClick={() => onDeleteMilestone(activeMilestone.id)}
            className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition"
            title={`Delete milestone "${activeMilestone.title}"`}
          >
            <Trash2 size={13} />
            <span>Delete Selected Milestone</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {milestones.map((m) => {
          const isActive = m.id === activeMilestoneId;
          const mediaCount = (m.media || []).length;

          return (
            <div
              key={m.id}
              onClick={() => onSelectMilestone(m.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectMilestone(m.id);
                }
              }}
              className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer select-none transition-all ${
                isActive
                  ? 'bg-rokit-dark text-white shadow-sm ring-2 ring-rokit-orange'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Folder size={14} className={isActive ? 'text-rokit-orange' : 'text-gray-400'} />
              <span>{m.title}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-rokit-orange text-white'
                    : mediaCount > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {mediaCount}
              </span>

              {onDeleteMilestone && (
                <button
                  type="button"
                  title={`Delete milestone "${m.title}"`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteMilestone(m.id);
                  }}
                  className={`p-0.5 rounded transition ${
                    isActive
                      ? 'text-gray-400 hover:text-white hover:bg-white/20'
                      : 'text-gray-400 hover:text-red-600 hover:bg-red-100'
                  }`}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          );
        })}

        {/* Inline Add Milestone */}
        {isAdding ? (
          <form onSubmit={handleCreate} className="flex items-center gap-1.5 shrink-0">
            <input
              type="text"
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Milestone name..."
              className="px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg outline-none focus:border-rokit-orange w-36"
            />
            <button
              type="submit"
              className="p-1.5 bg-rokit-orange text-white rounded-lg hover:bg-orange-600 transition"
              title="Confirm Add"
            >
              <Check size={14} />
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="p-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition text-xs"
              title="Cancel"
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-xs font-semibold text-gray-600 hover:text-rokit-orange hover:border-rokit-orange transition shrink-0"
          >
            <Plus size={14} /> Add Milestone
          </button>
        )}
      </div>

      {milestones.length === 0 && !isAdding && (
        <p className="text-xs text-gray-400 italic mt-2">
          No milestones defined for this project. Click "+ Add Milestone" to add one.
        </p>
      )}
    </div>
  );
}
