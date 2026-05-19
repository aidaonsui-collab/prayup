import type { ReactNode } from 'react';

type Props = { children: ReactNode; action?: ReactNode };

export function SectionTitle({ children, action }: Props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0 12px' }}>
      <h3 style={{
        fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.22em',
        textTransform: 'uppercase', color: 'var(--ink-faint)', fontWeight: 600,
        margin: 0,
      }}>{children}</h3>
      {action}
    </div>
  );
}
