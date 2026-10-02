import React from 'react';

/**
 * GrainOverlay
 * A global texture layer that makes the flat design feel analog and tactile.
 * 0.35 opacity fractal noise SVG filter with baseFrequency 0.65, mix-blend-mode: overlay.
 */
export default function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      data-testid="grain-overlay"
      className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-35 mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}
