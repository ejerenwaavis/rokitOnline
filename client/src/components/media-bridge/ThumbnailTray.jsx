import React from 'react';
import { Video, Image, Trash2, Edit2 } from 'lucide-react';

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function ThumbnailTray({
  media = [],
  milestoneTitle,
  onRemoveMedia,
  onUpdateCaption,
}) {
  if (!media || media.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
        <p className="text-xs">No media staged for "{milestoneTitle || 'this milestone'}" yet.</p>
        <p className="text-[11px] text-gray-400 mt-1">Upload images or videos above to populate this milestone.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Staged Media in "{milestoneTitle}" ({media.length})
        </h3>
        <span className="text-[11px] text-gray-400">
          Assets are uploaded and ready to commit with this project
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {media.map((asset, index) => (
          <div
            key={asset.publicId || index}
            className="group relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex flex-col transition hover:shadow-md"
          >
            {/* Preview */}
            <div className="aspect-video bg-gray-900 relative overflow-hidden flex items-center justify-center">
              {asset.resourceType === 'video' ? (
                <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
                  <video
                    src={asset.secureUrl}
                    className="w-full h-full object-cover opacity-80"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Video size={22} className="text-white drop-shadow" />
                  </div>
                </div>
              ) : (
                <img
                  src={asset.secureUrl}
                  alt={asset.caption || 'Project media'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}

              {/* Delete button overlay */}
              <button
                type="button"
                onClick={() => onRemoveMedia(index)}
                className="absolute top-1.5 right-1.5 p-1.5 bg-red-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-700 shadow"
                title="Remove asset"
              >
                <Trash2 size={12} />
              </button>

              {/* Format / Size badge */}
              <div className="absolute bottom-1 left-1.5 px-1.5 py-0.5 bg-black/70 rounded text-[9px] font-mono text-white">
                {asset.format?.toUpperCase() || asset.resourceType} · {formatBytes(asset.bytes)}
              </div>
            </div>

            {/* Caption Input */}
            <div className="p-2 flex-1 flex flex-col justify-between">
              <input
                type="text"
                value={asset.caption || ''}
                onChange={(e) => onUpdateCaption(index, e.target.value)}
                placeholder="Asset caption..."
                className="w-full text-[11px] text-gray-700 font-medium border-b border-transparent hover:border-gray-300 focus:border-rokit-orange outline-none bg-transparent py-0.5"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
