import type { CSSProperties, ReactNode } from 'react';

type Variant = 'primary' | 'gold' | 'ghost' | 'light' | 'onDark';

type Props = {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  style?: CSSProperties;
  icon?: ReactNode;
  full?: boolean;
};

const base: CSSProperties = {
  fontFamily: 'var(--sans)',
  fontWeight: 500,
  fontSize: 16,
  letterSpacing: '-0.005em',
  border: 'none',
  borderRadius: 9999,
  padding: '17px 26px',
  cursor: 'pointer',
  transition: 'transform 120ms ease, box-shadow 200ms ease, background 200ms ease',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
};

const variants: Record<Variant, CSSProperties> = {
  primary: { background: 'var(--ink)', color: 'var(--cream)', boxShadow: '0 10px 26px rgba(15,23,42,0.22), inset 0 1px 0 rgba(255,255,255,0.08)' },
  gold:    { background: 'linear-gradient(180deg, #D8B43F 0%, #B68C18 100%)', color: '#1A1408', boxShadow: '0 10px 26px rgba(201,162,39,0.32), inset 0 1px 0 rgba(255,255,255,0.4)' },
  ghost:   { background: 'transparent', color: 'var(--ink)', border: '1px solid var(--hairline-2)' },
  light:   { background: 'rgba(255,255,255,0.7)', color: 'var(--ink)', border: '1px solid var(--hairline)', backdropFilter: 'blur(8px)' },
  onDark:  { background: 'rgba(255,255,255,0.12)', color: '#F7F1E5', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' },
};

export function PUButton({ children, onClick, variant = 'primary', style = {}, icon = null, full = true }: Props) {
  return (
    <button
      onClick={onClick}
      style={{ ...base, ...variants[variant], width: full ? '100%' : 'auto', ...style }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = '')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

type LinkProps = { children: ReactNode; onClick?: () => void; style?: CSSProperties };

export function PUTextLink({ children, onClick, style = {} }: LinkProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-muted)',
        letterSpacing: '0.02em', padding: 8, ...style,
      }}
    >
      {children}
    </button>
  );
}
