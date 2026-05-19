import type { ReactNode } from 'react';
import { LightRays } from './LightRays';

type Props = { children?: ReactNode; light?: boolean };

export function CreamBG({ children, light = true }: Props) {
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      background: light
        ? 'radial-gradient(120% 80% at 50% -10%, #FFF6E0 0%, #F7F1E5 55%, #EFE3C5 100%)'
        : 'radial-gradient(120% 80% at 50% 110%, #1B2540 0%, #0F172A 60%)',
    }}>
      <LightRays opacity={light ? 0.55 : 0.25} color={light ? '#E0B83C' : '#E8D38A'} />
      {children}
    </div>
  );
}
