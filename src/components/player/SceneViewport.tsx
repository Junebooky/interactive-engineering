import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  type SceneFraming,
  getSceneFraming,
  computeAutoFitScale,
} from '../../engine/sceneFraming';

export interface SceneViewportProps {
  sceneId: string;
  userZoom: number;
  panOffset?: { x: number; y: number };
  onPanChange?: (offset: { x: number; y: number }) => void;
  children: React.ReactNode;
}

/**
 * Reusable subject-aware SceneViewport component.
 * Implements A03 Smart Scene Fit & Camera Framing (Issue #80).
 *
 * Automatically fits subject geometry to safe content slot with 8-12% breathing room,
 * applies relative user zoom, isolates scaling from controls and labels,
 * and supports accessible pointer and keyboard panning when magnified.
 */
export const SceneViewport: React.FC<SceneViewportProps> = ({
  sceneId,
  userZoom,
  panOffset = { x: 0, y: 0 },
  onPanChange,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState<{ width: number; height: number }>({
    width: 600,
    height: 340,
  });

  const framing: SceneFraming = getSceneFraming(sceneId);

  // ResizeObserver to track safe content stage dimensions
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setStageSize({ width, height });
        }
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { fitScale, dominantFillRatio } = computeAutoFitScale(
    stageSize.width,
    stageSize.height,
    framing,
    0.08
  );

  const effectiveScale = Number((fitScale * userZoom).toFixed(3));

  // Measure actual DOM projected bounding box of rendered SVG subject
  const [measuredRatio, setMeasuredRatio] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const slotRect = el.getBoundingClientRect();
      const subjectEl =
        el.querySelector<SVGGraphicsElement>('[data-scene-subject="true"] svg') ||
        el.querySelector<HTMLElement>('[data-scene-subject="true"]');
      if (slotRect.width > 0 && slotRect.height > 0 && subjectEl) {
        const subjRect = subjectEl.getBoundingClientRect();
        const rw = subjRect.width / slotRect.width;
        const rh = subjRect.height / slotRect.height;
        const maxR = Math.max(rw, rh);
        if (maxR > 0 && Number.isFinite(maxR)) {
          setMeasuredRatio(Number(maxR.toFixed(2)));
        }
      }
    };

    measure();
    const rafId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(rafId);
  }, [stageSize, effectiveScale, children]);

  // Panning interaction state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; startPanX: number; startPanY: number }>({
    x: 0,
    y: 0,
    startPanX: 0,
    startPanY: 0,
  });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (userZoom <= 1.05) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPanX: panOffset.x,
      startPanY: panOffset.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || userZoom <= 1.05) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    onPanChange?.({
      x: dragStartRef.current.startPanX + dx,
      y: dragStartRef.current.startPanY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if capture already lost
    }
  };

  // Keyboard accessible panning
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (userZoom <= 1.05) return;
      const step = 25;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPanChange?.({ x: panOffset.x + step, y: panOffset.y });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onPanChange?.({ x: panOffset.x - step, y: panOffset.y });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onPanChange?.({ x: panOffset.x, y: panOffset.y + step });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onPanChange?.({ x: panOffset.x, y: panOffset.y - step });
      }
    },
    [userZoom, panOffset, onPanChange]
  );

  return (
    <div
      ref={containerRef}
      className={`a03-scene-slot ${userZoom > 1.05 ? 'is-magnified' : ''} ${isDragging ? 'is-dragging' : ''}`}
      data-scene-slot="true"
      data-scene-id={framing.sceneId}
      data-dominant-fill-ratio={dominantFillRatio.toFixed(2)}
      data-measured-ratio={
        measuredRatio !== null && measuredRatio > 0
          ? measuredRatio.toFixed(2)
          : dominantFillRatio.toFixed(2)
      }
      tabIndex={userZoom > 1.05 ? 0 : -1}
      role="region"
      aria-label={`${framing.familyId} 2.5D 장면 뷰포트 (배율: ${(userZoom * 100).toFixed(0)}%)`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        touchAction: userZoom > 1.05 ? 'none' : 'auto',
        cursor: userZoom > 1.05 ? (isDragging ? 'grabbing' : 'grab') : 'default',
      }}
    >
      <div
        className="a03-scene-camera"
        data-scene-camera="true"
        data-fit-scale={fitScale.toFixed(3)}
        data-user-zoom={userZoom.toFixed(2)}
        data-effective-scale={effectiveScale.toFixed(3)}
        style={{
          width: `${framing.stableBounds.width}px`,
          height: `${framing.stableBounds.height}px`,
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${effectiveScale})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.16s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <div
          className="a03-scene-subject"
          data-scene-subject="true"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
