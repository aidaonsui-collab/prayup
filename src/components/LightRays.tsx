import { useId } from 'react';

type Props = { opacity?: number; color?: string; from?: 'top' | 'bottom' };

export function LightRays({ opacity = 0.35, color = '#C9A227', from = 'top' }: Props) {
  const uid = useId().replace(/:/g, '');
  const sunId = `rays-sun-${uid}`;
  const lineId = `rays-line-${uid}`;
  const transform = from === 'top' ? 'translate(160,0)' : 'translate(160,320) scale(1,-1)';

  return (
    <svg width="100%" height="100%" viewBox="0 0 320 320" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity }} aria-hidden="true">
      <defs>
        <radialGradient id={sunId} cx="50%" cy="0%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.55" />
          <stop offset="55%" stopColor={color} stopOpacity="0.08" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={lineId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g transform={transform}>
        <ellipse cx="0" cy="-20" rx="220" ry="160" fill={`url(#${sunId})`} />
        {Array.from({ length: 13 }).map((_, i) => {
          const angle = -60 + i * 10;
          return (
            <line
              key={i}
              x1="0" y1="0"
              x2={Math.sin((angle * Math.PI) / 180) * 340}
              y2={Math.cos((angle * Math.PI) / 180) * 340}
              stroke={`url(#${lineId})`}
              strokeWidth="1"
            />
          );
        })}
      </g>
    </svg>
  );
}
