import { useEffect, useRef } from 'react';

/**
 * Renders two cursor-tracking effects fixed to the viewport:
 *   1. A soft orange glow orb that follows the mouse quickly
 *   2. The Rokit logo ghost that follows with a heavy lag (lazy float)
 * Only activates on pointer (non-touch) devices.
 */
export default function CursorEffects() {
  const orbRef  = useRef(null);
  const logoRef = useRef(null);

  const mouse = useRef({ x: -9999, y: -9999 });
  const orb   = useRef({ x: -9999, y: -9999 });
  const logo  = useRef({ x: -9999, y: -9999 });
  const raf   = useRef(null);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let initialized = false;

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Snap positions on first move so nothing "flies in" from a corner
      if (!initialized) {
        orb.current.x   = e.clientX;
        orb.current.y   = e.clientY;
        logo.current.x  = e.clientX;
        logo.current.y  = e.clientY;
        initialized = true;
        if (orbRef.current)  orbRef.current.style.opacity  = '1';
        if (logoRef.current) logoRef.current.style.opacity = '0.064';
      }
    };

    const tick = () => {
      // Orb: fast follow (feels magnetic)
      orb.current.x  += (mouse.current.x - orb.current.x)  * 0.10;
      orb.current.y  += (mouse.current.y - orb.current.y)  * 0.10;
      // Logo: slow follow (feels dreamy)
      logo.current.x += (mouse.current.x - logo.current.x) * 0.032;
      logo.current.y += (mouse.current.y - logo.current.y) * 0.032;

      if (orbRef.current) {
        orbRef.current.style.transform =
          `translate3d(${orb.current.x - 320}px, ${orb.current.y - 320}px, 0)`;
      }
      if (logoRef.current) {
        logoRef.current.style.transform =
          `translate3d(${logo.current.x - 64}px, ${logo.current.y - 64}px, 0)`;
      }

      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* ── Orange glow orb ── */}
      <div
        ref={orbRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9980]"
        style={{
          opacity: 0,
          width: 640,
          height: 640,
          background:
            'radial-gradient(circle, rgba(255,151,41,0.09) 0%, rgba(255,151,41,0.02) 45%, transparent 70%)',
          willChange: 'transform',
          mixBlendMode: 'screen',
          transition: 'opacity 0.6s ease',
        }}
      />

      {/* ── Logo ghost ── */}
      <img
        ref={logoRef}
        src="/assets/images/rokit-small-177x188-63.png"
        alt=""
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9979] select-none"
        style={{
          opacity: 0,
          width: 128,
          height: 'auto',
          filter: 'blur(9px) grayscale(1)',
          willChange: 'transform',
          transition: 'opacity 0.8s ease',
        }}
      />
    </>
  );
}
