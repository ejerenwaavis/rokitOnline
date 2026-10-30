import { useEffect, useRef } from "react";

const GRID_SPACING = 52;
const COARSE_GRID_SPACING = 64;
const POINTER_RADIUS = 210;
const RIPPLE_DURATION = 900;
const WAKE_DURATION = 6000;

const NON_RIPPLE_SELECTOR = "a, button, input, select, textarea, [data-hero-content]";

function createHomeArrival() {
  let started = false;
  return {
    begin() {
      if (started) return false;
      started = true;
      return true;
    },
  };
}

export default function KineticHeroGrid({ children }) {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    if (!hero || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const styles = window.getComputedStyle(hero);
    const neutral = styles.getPropertyValue("--v4-neutral").trim() || "#AAAAA6";
    const signal = styles.getPropertyValue("--v4-signal").trim() || "#FF5B24";

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = null;
    let isIntersecting = false;
    let isPageVisible = !document.hidden;
    let reducedMotion = reducedMotionQuery.matches;
    let coarsePointer = coarsePointerQuery.matches;
    let wake = null;
    let activationTimer = null;
    const arrival = createHomeArrival();
    let pausedAt = null;
    let ripple = null;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let influence = 0;
    let targetInfluence = 0;

    const isActive = () => isIntersecting && isPageVisible;

    const warpPoint = (x, y, localInfluence) => {
      const dx = pointerX - x;
      const dy = pointerY - y;
      const distance = Math.hypot(dx, dy);
      if (distance === 0 || distance >= POINTER_RADIUS || localInfluence <= 0) return { x, y };
      const strength = (1 - distance / POINTER_RADIUS) ** 2 * 15 * localInfluence;
      return { x: x + (dx / distance) * strength, y: y + (dy / distance) * strength };
    };

    const drawSegment = (x1, y1, x2, y2, color, alpha, lineWidth) => {
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.strokeStyle = color;
      context.globalAlpha = alpha;
      context.lineWidth = lineWidth;
      context.stroke();
    };

    const draw = (time) => {
      context.clearRect(0, 0, width, height);
      const spacing = coarsePointer ? COARSE_GRID_SPACING : GRID_SPACING;
      const step = spacing / 2;
      const entryProgress = wake ? Math.min(1, Math.max(0, (time - wake.startedAt) / wake.duration)) : 1;
      const entryInfluence = wake && !reducedMotion ? Math.sin(entryProgress * Math.PI) * wake.intensity * (wake.network ? 0.6 : 1) : 0;
      const interactionInfluence = reducedMotion || coarsePointer ? 0 : influence;
      const activeInfluence = Math.max(interactionInfluence, entryInfluence);

      if (entryInfluence > interactionInfluence) {
        pointerX = targetX = width * 0.7;
        pointerY = targetY = height * 0.44;
      }

      for (let x = 0; x <= width + spacing; x += spacing) {
        let previous = warpPoint(x, 0, activeInfluence);
        for (let y = step; y <= height + step; y += step) {
          const next = warpPoint(x, y, activeInfluence);
          drawSegment(previous.x, previous.y, next.x, next.y, neutral, 0.105, 0.75);
          previous = next;
        }
      }

      for (let y = 0; y <= height + spacing; y += spacing) {
        let previous = warpPoint(0, y, activeInfluence);
        for (let x = step; x <= width + step; x += step) {
          const next = warpPoint(x, y, activeInfluence);
          drawSegment(previous.x, previous.y, next.x, next.y, neutral, 0.105, 0.75);
          previous = next;
        }
      }

      if (wake?.network || reducedMotion) {
        const travel = reducedMotion ? 1 : Math.max(0, Math.min(1, (entryProgress - 0.12) / 0.58));
        const settle = reducedMotion ? 0.35 : 1 - Math.max(0, (entryProgress - 0.72) / 0.28);
        for (let x = 0; x <= width; x += spacing) {
          for (let y = 0; y <= height; y += spacing) {
            const arr = Math.hypot(x - width * 0.35, y - height * 0.48) / Math.hypot(width * 0.65, height * 0.52);
            const delta = travel - arr;
            if (delta < 0) continue;
            const response = Math.max(0.1, 1 - delta / 0.18) * settle * (wake?.intensity ?? 1);
            const point = warpPoint(x, y, activeInfluence);
            const right = warpPoint(Math.min(width, x + spacing), y, activeInfluence);
            const below = warpPoint(x, Math.min(height, y + spacing), activeInfluence);
            drawSegment(point.x, point.y, right.x, right.y, signal, response * 0.46, 1);
            drawSegment(point.x, point.y, below.x, below.y, signal, response * 0.32, 1);
            context.beginPath();
            context.arc(point.x, point.y, 1.5 + response, 0, Math.PI * 2);
            context.fillStyle = signal;
            context.globalAlpha = response * 0.7;
            context.fill();
          }
        }
      }

      if (activeInfluence > 0.003) {
        for (let x = 0; x <= width + spacing; x += spacing) {
          for (let y = 0; y <= height + spacing; y += spacing) {
            const distance = Math.hypot(pointerX - x, pointerY - y);
            if (distance >= POINTER_RADIUS) continue;
            const proximity = (1 - distance / POINTER_RADIUS) ** 2 * activeInfluence;
            const point = warpPoint(x, y, activeInfluence);
            context.beginPath();
            context.arc(point.x, point.y, 1 + proximity * 1.6, 0, Math.PI * 2);
            context.fillStyle = signal;
            context.globalAlpha = proximity * 0.55;
            context.fill();

            const half = Math.min(spacing * 0.42, 16 + proximity * 10);
            drawSegment(point.x - half, point.y, point.x + half, point.y, signal, proximity * 0.28, 0.85);
            drawSegment(point.x, point.y - half, point.x, point.y + half, signal, proximity * 0.28, 0.85);
          }
        }
      }

      if (ripple && !reducedMotion && !coarsePointer) {
        const progress = Math.min(1, (time - ripple.startedAt) / RIPPLE_DURATION);
        const radius = progress * Math.hypot(width, height) * 0.52;
        const fade = Math.sin(progress * Math.PI);
        context.beginPath();
        context.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
        context.strokeStyle = signal;
        context.globalAlpha = fade * 0.22;
        context.lineWidth = 1.25;
        context.stroke();
        context.beginPath();
        context.arc(ripple.x, ripple.y, Math.max(0, radius - 10), 0, Math.PI * 2);
        context.strokeStyle = neutral;
        context.globalAlpha = fade * 0.12;
        context.lineWidth = 0.8;
        context.stroke();
        if (progress >= 1) ripple = null;
      }

      context.globalAlpha = 1;
      if (entryProgress >= 1) wake = null;
    };

    const needsAnotherFrame = () => {
      const pointerIsSettling = Math.abs(targetInfluence - influence) > 0.004
        || Math.abs(targetX - pointerX) > 0.35
        || Math.abs(targetY - pointerY) > 0.35;
      return !reducedMotion && (pointerIsSettling || ripple !== null || wake !== null);
    };

    const tick = (time) => {
      frame = null;
      if (!isActive()) return;
      pointerX += (targetX - pointerX) * 0.2;
      pointerY += (targetY - pointerY) * 0.2;
      influence += (targetInfluence - influence) * 0.18;
      draw(time);
      if (needsAnotherFrame()) frame = window.requestAnimationFrame(tick);
    };

    const requestFrame = () => {
      if (frame === null && isActive()) frame = window.requestAnimationFrame(tick);
    };

    const resizeCanvas = () => {
      const rect = hero.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (targetX === 0 && targetY === 0) {
        pointerX = targetX = width * 0.7;
        pointerY = targetY = height * 0.44;
      }
      draw(performance.now());
      if (wake !== null) requestFrame();
    };

    const updatePointer = (event) => {
      if (reducedMotion || coarsePointer || event.pointerType === "touch") return;
      if (wake || activationTimer !== null) return;
      const rect = hero.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
      targetInfluence = 1;
      requestFrame();
    };

    const settlePointer = () => {
      targetInfluence = 0;
      requestFrame();
    };

    const createRipple = (event) => {
      if (
        reducedMotion
        || coarsePointer
        || event.pointerType === "touch"
        || event.button !== 0
        || ripple !== null
        || wake !== null
        || activationTimer !== null
      ) return;
      const target = event.target;
      if (target instanceof Element && target.closest(NON_RIPPLE_SELECTOR)) return;
      const rect = hero.getBoundingClientRect();
      ripple = { x: event.clientX - rect.left, y: event.clientY - rect.top, startedAt: performance.now() };
      requestFrame();
    };

    const deactivate = () => {
      if (activationTimer !== null) { window.clearTimeout(activationTimer); activationTimer = null; }
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      if (wake && pausedAt === null) pausedAt = performance.now();
      ripple = null;
      targetInfluence = influence = 0;
    };

    const activate = () => {
      if (!isActive()) return;
      if (wake && pausedAt !== null) { wake.startedAt += performance.now() - pausedAt; pausedAt = null; }
      draw(performance.now());
      if (reducedMotion) return;
      if (arrival.begin()) {
        wake = { startedAt: performance.now() + 400, duration: coarsePointer ? 3500 : WAKE_DURATION, intensity: coarsePointer ? 0.65 : 1, network: true };
        activationTimer = window.setTimeout(() => {
          activationTimer = null;
          if (!isActive() || reducedMotion) return;
          requestFrame();
        }, 400);
      } else if (wake) requestFrame();
    };

    const handleVisibility = () => {
      isPageVisible = !document.hidden;
      if (isActive()) activate(); else deactivate();
    };

    const handleMotionPreference = () => {
      reducedMotion = reducedMotionQuery.matches;
      deactivate();
      if (isActive()) activate();
      else if (reducedMotion) draw(performance.now());
    };

    const handlePointerPreference = () => {
      coarsePointer = coarsePointerQuery.matches;
      deactivate();
      resizeCanvas();
      if (isActive()) activate();
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      const next = entry?.isIntersecting ?? false;
      if (next === isIntersecting) return;
      isIntersecting = next;
      if (isActive()) activate(); else deactivate();
    }, { threshold: 0.01 });

    resizeObserver.observe(hero);
    intersectionObserver.observe(hero);
    hero.addEventListener("pointermove", updatePointer);
    hero.addEventListener("pointerleave", settlePointer);
    hero.addEventListener("pointerdown", createRipple);
    document.addEventListener("visibilitychange", handleVisibility);
    reducedMotionQuery.addEventListener("change", handleMotionPreference);
    coarsePointerQuery.addEventListener("change", handlePointerPreference);
    resizeCanvas();

    return () => {
      deactivate();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      hero.removeEventListener("pointermove", updatePointer);
      hero.removeEventListener("pointerleave", settlePointer);
      hero.removeEventListener("pointerdown", createRipple);
      document.removeEventListener("visibilitychange", handleVisibility);
      reducedMotionQuery.removeEventListener("change", handleMotionPreference);
      coarsePointerQuery.removeEventListener("change", handlePointerPreference);
    };
  }, []);

  return (
    <section ref={heroRef} className="kinetic-hero relative overflow-hidden bg-night">
      <canvas ref={canvasRef} className="kinetic-hero-grid absolute inset-0 pointer-events-none z-0" aria-hidden="true" />
      <div className="kinetic-hero-content relative z-10">{children}</div>
    </section>
  );
}
