import React from 'react';
import { Tag, ShieldCheck, Activity, FileText } from 'lucide-react';

export default function ProjectMetaEditor({
  formData,
  onChange,
  isDirty,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2.5 py-1 bg-rokit-dark text-white rounded">
            {formData.projectCode || 'PRJ-???'}
          </span>
          <span className="text-xs font-mono text-gray-500">
            /{formData.slug}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Unsaved text modifications
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded bg-gray-100 text-gray-700">
            <Tag size={12} /> {formData.category || 'General'}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck size={12} /> {formData.publicClearance || 'Pending'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
            Project Title
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full px-3.5 py-2 text-base font-semibold text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rokit-orange focus:border-rokit-orange outline-none transition"
            placeholder="e.g. AfriTeach Institute"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={formData.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            className="w-full px-3.5 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rokit-orange focus:border-rokit-orange outline-none transition resize-none"
            placeholder="Project summary and scope..."
          />
        </div>

        {/* Flow / Milestones Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
            Flow Notes
          </label>
          <input
            type="text"
            value={formData.flowNotes || ''}
            onChange={(e) => onChange('flowNotes', e.target.value)}
            className="w-full px-3.5 py-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rokit-orange outline-none"
            placeholder="e.g. Identity system -> Rollout"
          />
        </div>

        {/* Next Action */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
            Next Action
          </label>
          <input
            type="text"
            value={formData.nextAction || ''}
            onChange={(e) => onChange('nextAction', e.target.value)}
            className="w-full px-3.5 py-2 text-xs text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rokit-orange outline-none"
            placeholder="e.g. Upload photo hero"
          />
        </div>
      </div>
    </div>
  );
}
