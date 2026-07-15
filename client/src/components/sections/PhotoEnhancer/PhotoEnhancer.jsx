import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, RotateCcw, Sparkles, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../utils/api'; // existing axios instance — adjust path if yours differs
import DropZone from './DropZone';
import BeforeAfterSlider from './BeforeAfterSlider';
import { rokitTheme, themeToCSSVars } from './enhancerTheme';
import './enhancer.css';

const STATUS_MESSAGES = [
  'Uploading your photo…',
  'Analyzing image details…',
  'Restoring facial features…',
  'Upscaling to HD resolution…',
  'Polishing the final result…',
];

/**
 * PhotoEnhancer
 * Self-contained "AI Photo Enhancer" feature section. Pass a `theme`
 * object (see enhancerTheme.js) to re-skin it for any site — every
 * color/font in enhancer.css reads from the CSS variables this
 * component sets on its root element.
 */
export default function PhotoEnhancer({ theme = rokitTheme }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | processing | done | error
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState(STATUS_MESSAGES[0]);
  const [enhancedUrl, setEnhancedUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [mode, setMode] = useState('restore'); // 'restore' (identity-safe, default) | 'dramatic' (creative, can alter faces)
  const messageTimerRef = useRef(null);

  // Clean up the local object URL when it's no longer needed.
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const cycleStatusMessages = useCallback(() => {
    let i = 1; // index 0 already shown for "uploading"
    messageTimerRef.current = setInterval(() => {
      setStatusMessage(STATUS_MESSAGES[Math.min(i, STATUS_MESSAGES.length - 1)]);
      i += 1;
    }, 2500);
  }, []);

  const reset = () => {
    if (messageTimerRef.current) clearInterval(messageTimerRef.current);
    setFile(null);
    setPreviewUrl(null);
    setStatus('idle');
    setUploadProgress(0);
    setStatusMessage(STATUS_MESSAGES[0]);
    setEnhancedUrl(null);
    setErrorMessage(null);
  };

  const handleFileSelected = async (selectedFile) => {
    setErrorMessage(null);
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    await runEnhancement(selectedFile);
  };

  const runEnhancement = async (selectedFile) => {
    setStatus('uploading');
    setUploadProgress(0);
    setStatusMessage(STATUS_MESSAGES[0]);

    const formData = new FormData();
    formData.append('photo', selectedFile);
    formData.append('mode', mode);

    try {
      const response = await api.post('/enhance-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 90000, // enhancement can take longer than the global axios default
        onUploadProgress: (evt) => {
          const pct = Math.round((evt.loaded * 100) / evt.total);
          setUploadProgress(pct);
          if (pct >= 100) {
            setStatus('processing');
            cycleStatusMessages();
          }
        },
      });

      if (messageTimerRef.current) clearInterval(messageTimerRef.current);
      setEnhancedUrl(response.data.enhancedUrl);
      setStatus('done');
    } catch (err) {
      if (messageTimerRef.current) clearInterval(messageTimerRef.current);
      const message = err.response?.data?.message
        || (err.code === 'ECONNABORTED' ? 'This is taking longer than expected. Please try again.' : 'Something went wrong. Please try again.');
      setErrorMessage(message);
      setStatus('error');
      toast.error(message);
    }
  };

  const handleDownload = async () => {
    if (!enhancedUrl) return;
    try {
      const res = await fetch(enhancedUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `enhanced-${file?.name || 'photo'}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // CORS or network hiccup — fall back to opening it in a new tab
      window.open(enhancedUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="ae-root" style={themeToCSSVars(theme)}>
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <span className="ae-eyebrow">AI Photo Restoration</span>
        <h1 className="ae-title">Re-hance Your Photos</h1>
        <p className="ae-subtitle" style={{ margin: '0 auto 2rem' }}>
          Turn old, blurry, or vintage photos into crisp HD images in seconds — powered by AI face
          restoration and upscaling. Drop a photo below to bring it back to life.
        </p>

        {errorMessage && status === 'error' && (
          <div className="ae-error-banner">
            <AlertTriangle size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} />
            {errorMessage}
          </div>
        )}

        {status === 'idle' && (
          <>
            <div className="ae-mode-toggle" role="radiogroup" aria-label="Enhancement mode">
              <button
                type="button"
                className={`ae-mode-btn ${mode === 'restore' ? 'ae-mode-active' : ''}`}
                onClick={() => setMode('restore')}
                aria-pressed={mode === 'restore'}
              >
                Restore <span className="ae-mode-hint">keeps faces true to life</span>
              </button>
              <button
                type="button"
                className={`ae-mode-btn ${mode === 'dramatic' ? 'ae-mode-active' : ''}`}
                onClick={() => setMode('dramatic')}
                aria-pressed={mode === 'dramatic'}
              >
                Dramatic <span className="ae-mode-hint">max detail, best for scenery</span>
              </button>
            </div>
            <DropZone onFileSelected={handleFileSelected} onError={(msg) => { setErrorMessage(msg); setStatus('error'); }} />
          </>
        )}

        {status === 'error' && (
          <DropZone onFileSelected={handleFileSelected} onError={(msg) => { setErrorMessage(msg); setStatus('error'); }} />
        )}

        {(status === 'uploading' || status === 'processing') && (
          <div className="ae-loading">
            <div className="ae-spinner" />
            <p className="ae-loading-status">
              <Sparkles size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} />
              {statusMessage}
            </p>
            {status === 'uploading' && (
              <div className="ae-progress-track">
                <div className="ae-progress-fill" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}
          </div>
        )}

        {status === 'done' && enhancedUrl && previewUrl && (
          <>
            <BeforeAfterSlider beforeSrc={previewUrl} afterSrc={enhancedUrl} />
            <div className="ae-result-actions">
              <button className="ae-btn ae-btn-primary" onClick={handleDownload}>
                <Download size={16} /> Download Enhanced Photo
              </button>
              <button className="ae-btn ae-btn-outline" onClick={reset}>
                <RotateCcw size={16} /> Enhance Another
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
