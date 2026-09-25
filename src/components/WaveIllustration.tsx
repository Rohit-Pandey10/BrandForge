import React, { useMemo } from 'react';

interface AudioStrand {
  d: string;
  p: number; // normalized position from -1 to 1
  opacity: number;
  strokeWidth: number;
}

export const WaveIllustration: React.FC = () => {
  // Pre-calculate subtle, elegant audio wave harmonics
  const { strands, ambientStrands } = useMemo(() => {
    const width = 1600;
    const height = 180;
    const centerY = height / 2;
    const lineCount = 30; // 30 delicate, interwoven acoustic harmonic lines
    const step = 16;

    const list: AudioStrand[] = [];

    for (let k = 0; k < lineCount; k++) {
      // p in [-1, 1], where 0 is the center core strand
      const p = (k / (lineCount - 1)) * 2 - 1;
      const phaseOffset = k * 0.25;
      // Amplitude multiplier: center strands oscillate slightly more, outer strands feather out
      const ampMult = 0.58 + 0.42 * (1 - Math.abs(p) * 0.55);

      const points: { x: number; y: number }[] = [];

      for (let x = 0; x <= width; x += step) {
        const normX = x / width; // 0 to 1

        // Smooth acoustic envelope: tapers serenely at ends into a clean horizontal beam
        const env = Math.pow(Math.sin(normX * Math.PI), 1.35);

        // Vocal resonance packets (3 gentle harmonic energy swells across speech frequency)
        const modulation = 0.74 + 0.26 * Math.cos(normX * Math.PI * 4 - 0.4);

        // Multi-frequency harmonic acoustic superposition
        const w1 = Math.sin(normX * Math.PI * 5.2 + phaseOffset);
        const w2 = 0.42 * Math.sin(normX * Math.PI * 9.8 - phaseOffset * 1.35);
        const w3 = 0.16 * Math.sin(normX * Math.PI * 15.2 + phaseOffset * 0.75);

        // Subtle amplitude: max deflection ~28px so it remains refined and unobtrusive
        const waveY = (w1 + w2 + w3) * 28 * ampMult * env * modulation;

        // Vertical harmonic ribbon dispersion
        const strandSpread = p * 11 * env;

        const y = centerY + waveY + strandSpread;
        points.push({ x, y: Number(y.toFixed(2)) });
      }

      // Smooth Catmull-Rom to Cubic Bezier curve
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let j = 0; j < points.length - 1; j++) {
        const p0 = points[Math.max(0, j - 1)];
        const p1 = points[j];
        const p2 = points[j + 1];
        const p3 = points[Math.min(points.length - 1, j + 2)];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      }

      const dist = Math.abs(p);
      list.push({
        d,
        p,
        opacity: Number((0.36 + (1 - dist * 0.4) * 0.58).toFixed(2)),
        strokeWidth: Number((0.85 + (1 - dist * 0.5) * 0.55).toFixed(2))
      });
    }

    // Sample a few strands for soft ambient acoustic glow
    const ambient = list.filter((_, idx) => idx % 5 === 0);

    return { strands: list, ambientStrands: ambient };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '8px var(--spacing-24) 28px var(--spacing-24)',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <style>{`
        @keyframes audioBreathe {
          0%, 100% {
            transform: scaleY(1);
            opacity: 0.92;
          }
          50% {
            transform: scaleY(1.05);
            opacity: 1;
          }
        }
        .audio-strand {
          transition: stroke-width 0.25s ease, opacity 0.25s ease;
        }
        .audio-strand:hover {
          stroke-width: 2.0px !important;
          opacity: 1 !important;
        }
        .audio-wave-group {
          animation: audioBreathe 7s ease-in-out infinite alternate;
          transform-origin: center center;
        }
        @media (prefers-reduced-motion: reduce) {
          .audio-wave-group {
            animation: none;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 1600 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '180px',
          display: 'block',
          filter: 'drop-shadow(0 6px 20px rgba(0, 0, 0, 0.02))'
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle Ambient Acoustic Glow */}
          <filter id="audioSoftGlow" x="-5%" y="-30%" width="110%" height="160%">
            <feGaussianBlur stdDeviation="5.5" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 
            EACH LINE/STRAND HAS A GRADIENT OF: YELLOW -> BLUE -> YELLOW
            Subtle, refined acoustic coloration:
            - Left: Warm golden amber & radiant sunlight yellow
            - Center: Electric azure, celestial sky blue, and luminous cyan
            - Right: Warm golden amber & radiant sunlight yellow
          */}

          {/* 1. Core Strand Gradient: Yellow -> Blue -> Yellow */}
          <linearGradient id="audioYBY_Core" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
            <stop offset="12%" stopColor="#fbbf24" stopOpacity="0.96" />
            <stop offset="25%" stopColor="#fde047" stopOpacity="0.98" />
            <stop offset="38%" stopColor="#38bdf8" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#2563eb" stopOpacity="1" />
            <stop offset="62%" stopColor="#38bdf8" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#fde047" stopOpacity="0.98" />
            <stop offset="88%" stopColor="#fbbf24" stopOpacity="0.96" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.85" />
          </linearGradient>

          {/* 2. Highlight Strand Gradient: Yellow -> Blue -> Yellow */}
          <linearGradient id="audioYBY_Bright" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0.80" />
            <stop offset="14%" stopColor="#f59e0b" stopOpacity="0.95" />
            <stop offset="28%" stopColor="#fef08a" stopOpacity="1" />
            <stop offset="42%" stopColor="#60a5fa" stopOpacity="0.96" />
            <stop offset="50%" stopColor="#93c5fd" stopOpacity="1" />
            <stop offset="58%" stopColor="#60a5fa" stopOpacity="0.96" />
            <stop offset="72%" stopColor="#fef08a" stopOpacity="1" />
            <stop offset="86%" stopColor="#f59e0b" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.80" />
          </linearGradient>

          {/* 3. Soft Harmonic Strand Gradient: Yellow -> Blue -> Yellow */}
          <linearGradient id="audioYBY_Soft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.65" />
            <stop offset="24%" stopColor="#fde047" stopOpacity="0.85" />
            <stop offset="44%" stopColor="#38bdf8" stopOpacity="0.90" />
            <stop offset="56%" stopColor="#3b82f6" stopOpacity="0.90" />
            <stop offset="76%" stopColor="#fde047" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.65" />
          </linearGradient>
        </defs>

        <g className="audio-wave-group">
          {/* Layer 1: Ambient Luminous Halo (Subtle acoustic radiance) */}
          <g filter="url(#audioSoftGlow)" opacity="0.25">
            {ambientStrands.map((strand, idx) => (
              <path
                key={`amb-${idx}`}
                d={strand.d}
                fill="none"
                stroke="url(#audioYBY_Core)"
                strokeWidth={3.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>

          {/* Layer 2: Subtle Audio Wave Strands (Multiple Thin Lines with Yellow -> Blue -> Yellow Gradient) */}
          <g>
            {strands.map((strand, idx) => {
              const grad =
                idx % 3 === 0
                  ? 'url(#audioYBY_Bright)'
                  : Math.abs(strand.p) > 0.6
                  ? 'url(#audioYBY_Soft)'
                  : 'url(#audioYBY_Core)';

              return (
                <path
                  key={`audio-${idx}`}
                  className="audio-strand"
                  d={strand.d}
                  fill="none"
                  stroke={grad}
                  strokeWidth={strand.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={strand.opacity}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
};
