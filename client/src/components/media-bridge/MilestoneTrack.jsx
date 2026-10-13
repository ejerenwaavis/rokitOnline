import React, { useState } from 'react';
import { Plus, Check, Folder } from 'lucide-react';

export default function MilestoneTrack({
  milestones = [],
  activeMilestoneId,
  onSelectMilestone,
  onAddMilestone,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddMilestone(newTitle.trim());
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Project Milestones ({milestones.length})
        </h3>
        <span className="text-xs text-gray-400">
          Select a milestone tab to stage and view media
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {milestones.map((m) => {
          const isActive = m.id === activeMilestoneId;
          const mediaCount = (m.media || []).length;

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMilestone(m.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
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
            </button>
          );
        })}

        {/* Inline Add Milestone */}
        {isAdding ? (
          <form onSubmit={handleCreate} className="flex items-center gap-1.5">
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
            >
              <Check size={14} />
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="p-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition text-xs"
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-xs font-semibold text-gray-600 hover:text-rokit-orange hover:border-rokit-orange transition"
          >
            <Plus size={14} /> Add Milestone
          </button>
        )}
      </div>
    </div>
  );
}
