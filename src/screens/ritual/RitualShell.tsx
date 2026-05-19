import type { ReactNode } from 'react';
import { CreamBG } from '../../components/CreamBG';
import { Icon } from '../../components/Icon';

type Props = {
  step?: number;
  total?: number;
  onBack: () => void;
  onClose: () => void;
  dark?: boolean;
  bgLight?: boolean;
  children: ReactNode;
};

export function RitualShell({ step, total = 5, onBack, onClose, dark = false, bgLight = true, children }: Props) {
  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <CreamBG light={bgLight} />
      <div style={{
        position: 'relative', zIndex: 1, height: '100%', boxSizing: 'border-box',
        padding: '72px 24px 32px', display: 'flex', flexDirection: 'column',
        color: dark ? '#F7F1E5' : 'var(--ink)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <button onClick={onBack} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 8,
            color: dark ? 'rgba(247,241,229,0.8)' : 'var(--ink-muted)',
          }}>
            <Icon.Arrow dir="left" size={20} />
          </button>
          {step ? (
            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} style={{
                  width: i + 1 === step ? 22 : 6, height: 5, borderRadius: 3,
                  background: i + 1 <= step
                    ? (dark ? '#E8D38A' : 'var(--ink)')
                    : (dark ? 'rgba(247,241,229,0.18)' : 'rgba(15,23,42,0.18)'),
                  transition: 'width 200ms ease',
                }} />
              ))}
            </div>
          ) : <div style={{ width: 1 }} />}
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 8,
            color: dark ? 'rgba(247,241,229,0.8)' : 'var(--ink-muted)',
          }}>
            <Icon.Close size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
