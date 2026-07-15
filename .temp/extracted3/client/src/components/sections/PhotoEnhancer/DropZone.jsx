import { useRef, useState, useCallback } from 'react';
import { UploadCloud, ImageIcon } from 'lucide-react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 20;

/**
 * DropZone
 * Drag-and-drop + click-to-browse file picker. Validates type/size
 * client-side (fast feedback) — the server re-validates independently,
 * since client-side checks are UX sugar, not security.
 */
export default function DropZone({ onFileSelected, onError, disabled }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const validateAndEmit = useCallback((file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      onError?.('Please upload a JPEG, PNG, or WEBP image.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      onError?.(`Image is too large. Max size is ${MAX_SIZE_MB}MB.`);
      return;
    }
    onFileSelected(file);
  }, [onFileSelected, onError]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    validateAndEmit(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div
      className={`ae-dropzone ${isDragOver ? 'ae-dragover' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="Upload a photo to enhance"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
    >
      <div className="ae-dropzone-icon">
        {isDragOver ? <ImageIcon size={36} /> : <UploadCloud size={36} />}
      </div>
      <p className="ae-dropzone-title">
        {isDragOver ? 'Drop it right here' : 'Drag & drop a photo, or click to browse'}
      </p>
      <p className="ae-dropzone-hint">JPEG, PNG, or WEBP — up to {MAX_SIZE_MB}MB</p>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        disabled={disabled}
        onChange={(e) => validateAndEmit(e.target.files?.[0])}
      />
    </div>
  );
}
