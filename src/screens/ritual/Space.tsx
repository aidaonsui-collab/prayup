import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BreathingOrb } from '../../components/BreathingOrb';
import { PUButton } from '../../components/PUButton';
import { Icon } from '../../components/Icon';

const TOTAL = 120;

export function Space() {
  const nav = useNavigate();
  const [remaining, setRemaining] = useState(TOTAL);
  const [paused, setPaused] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Breathe in');

  useEffect(() => {
    if (paused || remaining <= 0) return;
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, paused]);

  useEffect(() => {
    if (paused) return;
    setBreathPhase('Breathe in');
    const out = setTimeout(() => setBreathPhase('Breathe out'), 4000);
    const cycle = setInterval(() => {
      setBreathPhase('Breathe in');
      setTimeout(() => setBreathPhase('Breathe out'), 4000);
    }, 8000);
    return () => {
      clearTimeout(out);
      clearInterval(cycle);
    };
  }, [paused]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(120% 80% at 50% 35%, #243152 0%, #131C36 55%, #0A1024 100%)',
      }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} aria-hidden="true">
          {Array.from({ length: 40 }).map((_, i) => {
            const x = (i * 73 + 19) % 400;
            const y = (i * 127 + 31) % 870;
            const r = i % 3 === 0 ? 1.2 : 0.6;
            return <circle key={i} cx={x} cy={y} r={r} fill="#E8D38A" opacity={0.3 + (i % 5) * 0.1} />;
          })}
        </svg>
      </div>

      <div style={{
        position: 'relative', zIndex: 1, height: '100%', boxSizing: 'border-box',
        padding: '72px 24px 36px', display: 'flex', flexDirection: 'column',
        color: '#F7F1E5',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => nav('/ritual/prayer')} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 8,
            color: 'rgba(247,241,229,0.6)',
          }}><Icon.Arrow dir="left" size={20} /></button>
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.32em',
            textTransform: 'uppercase', color: 'rgba(232,211,138,0.85)',
          }}>The Prayer Space</span>
          <button onClick={() => nav('/home')} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 8,
            color: 'rgba(247,241,229,0.6)',
          }}><Icon.Close size={18} /></button>
        </div>

        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 36,
        }}>
          <BreathingOrb size={220} running={!paused} />
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: 'var(--serif-display)', fontStyle: 'italic',
              fontSize: 24, fontWeight: 400, color: '#F7F1E5', margin: '0 0 6px',
              letterSpacing: '-0.01em', opacity: 0.95, transition: 'opacity 600ms ease',
            }}>{breathPhase}</p>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: 13, color: 'rgba(247,241,229,0.55)',
              margin: 0, letterSpacing: '0.02em',
            }}>Let the words settle.</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{
            fontFamily: 'var(--serif-display)', fontSize: 48, fontWeight: 400,
            color: '#E8D38A', letterSpacing: '-0.02em', lineHeight: 1,
          }}>{timeStr}</div>
          <div style={{
            width: '60%', height: 1, margin: '14px auto 0',
            background: 'rgba(232,211,138,0.18)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, height: 1,
              width: `${((TOTAL - remaining) / TOTAL) * 100}%`,
              background: 'linear-gradient(90deg, transparent 0%, #E8D38A 100%)',
              transition: 'width 1000ms linear',
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => setPaused((p) => !p)} style={{
            width: 50, height: 50, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#F7F1E5', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}>
            {paused ? (
              <svg width="14" height="16" viewBox="0 0 14 16"><path d="M2 1l11 7L2 15V1z" fill="currentColor" /></svg>
            ) : (
              <svg width="14" height="16" viewBox="0 0 14 16"><rect x="2" y="1" width="3.5" height="14" fill="currentColor" /><rect x="8.5" y="1" width="3.5" height="14" fill="currentColor" /></svg>
            )}
          </button>
          <PUButton variant="gold" onClick={() => nav('/ritual/intention')} style={{ flex: 1 }}>
            I've prayed
          </PUButton>
        </div>
      </div>
    </div>
  );
}
