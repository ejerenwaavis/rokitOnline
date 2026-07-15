import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * BeforeAfterSlider
 * Drag the handle (mouse, touch, or arrow keys) to reveal more/less of
 * the enhanced image over the original. Built with pure pointer events —
 * no dependency — so it drops into any React project without extra installs.
 */
export default function BeforeAfterSlider({ beforeSrc, afterSrc, beforeLabel = 'Original', afterLabel = 'Enhanced' }) {
  const [clipPercent, setClipPercent] = useState(50);
  const frameRef = useRef(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setClipPercent(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e) => {
    draggingRef.current = true;
    updateFromClientX(e.clientX ?? e.touches?.[0]?.clientX);
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return;
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      if (clientX != null) updateFromClientX(clientX);
    };
    const onUp = () => { draggingRef.current = false; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [updateFromClientX]);

  const nudge = (delta) => setClipPercent((p) => Math.min(100, Math.max(0, p + delta)));

  return (
    <div className="ae-slider-wrap">
      <div className="ae-slider-frame" ref={frameRef}>
        <img src={beforeSrc} alt={beforeLabel} draggable={false} />
        <img
          src={afterSrc}
          alt={afterLabel}
          draggable={false}
          className="ae-slider-after"
          style={{ '--ae-clip': `${clipPercent}%` }}
        />
        <span className="ae-slider-label ae-slider-label-before">{beforeLabel}</span>
        <span className="ae-slider-label ae-slider-label-after">{afterLabel}</span>
        <div
          className="ae-slider-handle"
          style={{ '--ae-clip': `${clipPercent}%` }}
          onMouseDown={onPointerDown}
          onTouchStart={onPointerDown}
          role="slider"
          tabIndex={0}
          aria-label="Comparison slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(clipPercent)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') nudge(-5);
            if (e.key === 'ArrowRight') nudge(5);
          }}
        />
      </div>
    </div>
  );
}
