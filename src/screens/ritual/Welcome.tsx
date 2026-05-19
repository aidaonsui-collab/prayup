import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreamBG } from '../../components/CreamBG';
import { BreathingOrb } from '../../components/BreathingOrb';
import { PUButton } from '../../components/PUButton';
import { Icon } from '../../components/Icon';

export function Welcome() {
  const nav = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 5 ? 'A late hour' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const close = () => nav('/home');

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <CreamBG />
      <div style={{
        position: 'relative', zIndex: 1, height: '100%', boxSizing: 'border-box',
        padding: '72px 32px 36px', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={close} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 8,
            color: 'var(--ink-muted)',
          }}>
            <Icon.Close size={18} />
          </button>
        </div>

        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 800ms ease, transform 800ms ease',
        }}>
          <div style={{ position: 'relative', width: 200, height: 200, marginBottom: 36 }}>
            <BreathingOrb size={200} color="#E8D38A" deep="#C9A227" running={visible} cycleMs={10000} />
          </div>

          <p style={{
            fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.32em',
            textTransform: 'uppercase', color: 'var(--gold-dim)', margin: '0 0 14px',
          }}>{greeting}, Daniel</p>

          <h2 style={{
            fontFamily: 'var(--serif-display)', fontWeight: 500, fontSize: 34,
            lineHeight: 1.1, letterSpacing: '-0.02em', textAlign: 'center',
            margin: '0 0 14px', maxWidth: 300,
          }}>
            You're here.<br />
            <em style={{ color: 'var(--gold-dim)' }}>That's already a kind of prayer.</em>
          </h2>

          <p style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, lineHeight: 1.55,
            color: 'var(--ink-muted)', textAlign: 'center', margin: '0 16px',
            maxWidth: 300,
          }}>
            Take three slow breaths. Let the day land. Then we'll begin.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 26 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--gold)', opacity: 0.35,
              animation: `pu-breath-dot 3s ease-in-out ${i * 0.4}s infinite`,
            }} />
          ))}
        </div>

        <PUButton variant="primary" onClick={() => nav('/ritual/checkin')}>
          Begin the pause
        </PUButton>
      </div>
    </div>
  );
}
