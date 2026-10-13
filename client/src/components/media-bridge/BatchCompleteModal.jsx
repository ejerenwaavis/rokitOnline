import React from 'react';
import { CheckCircle2, ArrowRight, RefreshCw, FolderCheck, Image } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BatchCompleteModal({
  session,
  onReset,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-xl mx-auto shadow-sm text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
        <CheckCircle2 size={32} />
      </div>

      <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
        Batch Ingestion & Staging Complete!
      </h2>
      <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
        All projects from <span className="font-semibold text-gray-800">{session?.sourceFilename || 'the register'}</span> have been processed and synchronized with Cloudinary and MongoDB.
      </p>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-left">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <FolderCheck size={16} className="text-rokit-orange" /> Projects Processed
          </div>
          <div className="text-2xl font-black text-gray-900">
            {session?.totalCount || 0}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-left">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <Image size={16} className="text-emerald-600" /> Completed Count
          </div>
          <div className="text-2xl font-black text-gray-900">
            {session?.completedCount || session?.totalCount || 0}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/admin/portfolio"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-rokit-dark hover:bg-black text-white text-xs font-bold rounded-lg transition"
        >
          View Portfolio Manager <ArrowRight size={14} />
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-lg transition"
        >
          <RefreshCw size={14} /> Start New Batch
        </button>
      </div>
    </div>
  );
}
