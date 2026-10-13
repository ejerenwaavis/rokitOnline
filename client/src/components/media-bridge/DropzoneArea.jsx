import React, { useState, useRef } from 'react';
import axios from 'axios';
import api from '../../utils/api';
import { UploadCloud, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DropzoneArea({
  project,
  activeMilestoneId,
  onMediaUploaded,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]); // [{ id, filename, progress, status, error }]
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (files) => {
    if (!activeMilestoneId) {
      toast.error('Please select a milestone before uploading media');
      return;
    }

    files.forEach((file) => {
      uploadFileDirectToCloudinary(file);
    });
  };

  const uploadFileDirectToCloudinary = async (file) => {
    const queueId = `${file.name}-${Date.now()}-${Math.random()}`;
    const queueItem = {
      id: queueId,
      file,
      filename: file.name,
      progress: 0,
      status: 'signing', // signing, uploading, done, error
      error: null,
    };

    setUploadQueue((prev) => [queueItem, ...prev]);

    try {
      // 1. Request signed upload credentials from media bridge
      const signRes = await api.post('/media-bridge/cloudinary-sign', {
        projectCode: project.projectCode,
        projectTitle: project.title,
        milestoneId: activeMilestoneId,
      });

      const { signature, timestamp, apiKey, cloudName, folder } = signRes.data;

      setUploadQueue((prev) =>
        prev.map((q) => (q.id === queueId ? { ...q, status: 'uploading', progress: 5 } : q))
      );

      // 2. Direct Signed Upload to Cloudinary REST API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

      const uploadRes = await axios.post(cloudinaryUrl, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadQueue((prev) =>
              prev.map((q) => (q.id === queueId ? { ...q, progress: percent } : q))
            );
          }
        },
      });

      const cData = uploadRes.data;
      const mediaAsset = {
        publicId: cData.public_id,
        secureUrl: cData.secure_url,
        resourceType: cData.resource_type || (file.type.startsWith('video/') ? 'video' : 'image'),
        format: cData.format,
        bytes: cData.bytes,
        width: cData.width,
        height: cData.height,
        caption: file.name.replace(/\.[^/.]+$/, ''),
        createdAt: new Date(),
      };

      // 3. Stage locally in milestone
      onMediaUploaded(activeMilestoneId, mediaAsset);

      setUploadQueue((prev) =>
        prev.map((q) => (q.id === queueId ? { ...q, status: 'done', progress: 100 } : q))
      );

      // Auto-clear successful upload from queue after 3s
      setTimeout(() => {
        setUploadQueue((prev) => prev.filter((q) => q.id !== queueId));
      }, 3000);
    } catch (err) {
      console.error('Direct upload failed:', err);
      const errMsg = err.response?.data?.error?.message || err.message || 'Upload failed';
      setUploadQueue((prev) =>
        prev.map((q) => (q.id === queueId ? { ...q, status: 'error', error: errMsg } : q))
      );
      toast.error(`Failed to upload ${file.name}: ${errMsg}`);
    }
  };

  const handleRetry = (item) => {
    setUploadQueue((prev) => prev.filter((q) => q.id !== item.id));
    uploadFileDirectToCloudinary(item.file);
  };

  return (
    <div className="mb-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-rokit-orange bg-rokit-orange/5 scale-[1.01]'
            : 'border-gray-300 hover:border-rokit-orange/60 bg-gray-50/50 hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-200 mx-auto flex items-center justify-center text-rokit-orange mb-3">
          <UploadCloud size={24} />
        </div>

        <h4 className="text-sm font-bold text-gray-800 mb-1">
          Direct Cloudinary Staging Dropzone
        </h4>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-2">
          Drag & drop images or videos here, or click to browse. Files upload directly to Cloudinary with secure signature.
        </p>
        <span className="inline-block text-[11px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
          Target: rokit/projects/{project?.projectCode?.toLowerCase() || 'prj'}/{activeMilestoneId}
        </span>
      </div>

      {/* Upload Queue Progress */}
      {uploadQueue.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadQueue.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between text-xs shadow-sm"
            >
              <div className="flex-1 pr-4 truncate">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-800 truncate">{item.filename}</span>
                  <span className="font-mono text-gray-500">
                    {item.status === 'signing' ? 'Signing...' : `${item.progress}%`}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      item.status === 'error'
                        ? 'bg-red-500'
                        : item.status === 'done'
                        ? 'bg-emerald-500'
                        : 'bg-rokit-orange'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              {item.status === 'uploading' && (
                <Loader2 size={16} className="animate-spin text-rokit-orange shrink-0" />
              )}
              {item.status === 'error' && (
                <div className="flex items-center gap-1.5 text-red-600 shrink-0">
                  <AlertCircle size={16} />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRetry(item);
                    }}
                    className="p-1 hover:bg-red-50 rounded"
                    title="Retry"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
