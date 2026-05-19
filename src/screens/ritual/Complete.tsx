import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LightRays } from '../../components/LightRays';
import { PUButton } from '../../components/PUButton';
import { Icon } from '../../components/Icon';
import { useRitual } from './state';
import { VERSE_BY_MOOD } from '../../lib/data';
import { getStreak, recordEntry, updateTodaysReflection } from '../../lib/journey';

export function Complete() {
  const nav = useNavigate();
  const { mood, heart, template, intention } = useRitual();
  const [phase, setPhase] = useState(0);
  const [streak, setStreak] = useState(0);
  const [reflectOpen, setReflectOpen] = useState(false);
  const [reflection, setReflection] = useState('');
  const recordedRef = useRef(false);

  // Record this completion exactly once (guards against StrictMode double-mount).
  useEffect(() => {
    if (recordedRef.current) return;
    recordedRef.current = true;
    recordEntry({
      mood,
      template,
      heart: heart.trim() || undefined,
      intention: intention.trim() || undefined,
      verseRef: VERSE_BY_MOOD[mood]?.ref,
    });
    setStreak(getStreak());
  }, [mood, template, heart, intention]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(120% 80% at 50% 40%, #FFF6E0 0%, #F7F1E5 50%, #ECDFC1 100%)',
      }}>
        <LightRays opacity={0.65} color="#E0B83C" />
      </div>

      <div style={{
        position: 'relative', zIndex: 1, height: '100%', boxSizing: 'border-box',
        padding: '72px 32px 36px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
      }}>
        <button onClick={() => nav('/home')} style={{
          position: 'absolute', top: 62, right: 24,
          background: 'none', border: 'none', cursor: 'pointer', padding: 8,
          color: 'var(--ink-muted)',
        }}><Icon.Close size={18} /></button>

        <div style={{ flex: 1 }} />

        <div style={{
          position: 'relative', width: 132, height: 132,
          marginBottom: 36,
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'scale(1)' : 'scale(0.6)',
          transition: 'opacity 700ms ease, transform 800ms cubic-bezier(.2,.8,.2,1)',
        }}>
          <div style={{
            position: 'absolute', inset: -16, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,162,39,0.25) 0%, transparent 70%)',
            animation: phase >= 1 ? 'pu-gentle-pulse 3s ease-in-out infinite' : 'none',
          }} />
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '1px solid rgba(201,162,39,0.35)',
          }} />
          <div style={{
            position: 'absolute', inset: 8, borderRadius: '50%',
            border: '1px solid rgba(201,162,39,0.25)',
          }} />
          <div style={{
            position: 'absolute', inset: 18, borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, #FFF1C7 0%, #E8D38A 35%, #C9A227 100%)',
            boxShadow: '0 8px 24px rgba(201,162,39,0.45), inset -4px -8px 20px rgba(160,128,26,0.5), inset 6px 8px 18px rgba(255,255,255,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? 'scale(1)' : 'scale(0.5)',
              transition: 'all 500ms ease',
            }}>
              <Icon.Check size={42} c="#1A1408" stroke={2.4} />
            </div>
          </div>
        </div>

        <p style={{
          fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.32em',
          textTransform: 'uppercase', color: 'var(--gold-dim)', margin: '0 0 10px',
          opacity: phase >= 2 ? 1 : 0, transition: 'opacity 500ms ease',
        }}>Ritual complete</p>

        <h2 style={{
          fontFamily: 'var(--serif-display)', fontWeight: 500, fontSize: 34,
          lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 14px',
          color: 'var(--ink)',
          opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'translateY(0)' : 'translateY(8px)',
          transition: 'all 600ms ease',
        }}>Proceed with <em style={{ color: 'var(--gold-dim)' }}>clarity.</em></h2>

        <p style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.5,
          color: 'var(--ink-muted)', margin: '0 0 22px', maxWidth: 280,
          opacity: phase >= 3 ? 1 : 0, transition: 'opacity 600ms ease',
        }}>
          You showed up for the One who has been waiting to spend this day with you.
        </p>

        {intention.trim() && (
          <div style={{
            background: 'linear-gradient(170deg, rgba(255,252,244,0.9) 0%, rgba(247,235,208,0.8) 100%)',
            border: '1px solid rgba(201,162,39,0.35)',
            borderRadius: 'var(--r-md)', padding: '14px 18px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 600ms ease 50ms', marginBottom: 16, maxWidth: 320,
            boxShadow: '0 6px 18px rgba(201,162,39,0.15)',
          }}>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold-dim)', margin: 0 }}>
              Carry this today
            </p>
            <p style={{
              fontFamily: 'var(--serif-display)', fontSize: 22, fontWeight: 500,
              fontStyle: 'italic', color: 'var(--ink)', margin: 0,
              letterSpacing: '-0.01em', textAlign: 'center',
            }}>{intention.trim()}</p>
          </div>
        )}

        <div style={{
          background: 'rgba(255,255,255,0.55)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 14,
          opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? 'translateY(0)' : 'translateY(8px)',
          transition: 'all 600ms ease 100ms', marginBottom: 32,
        }}>
          <Icon.Flame size={22} c="#C9A227" />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--serif-display)', fontSize: 20, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
              {streak} day{streak === 1 ? '' : 's'} of pausing
            </div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-muted)' }}>
              {streak <= 1 ? 'A quiet beginning.' : 'Faithful in small things.'}
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{
          width: '100%', display: 'flex', flexDirection: 'column', gap: 10,
          opacity: phase >= 3 ? 1 : 0, transition: 'opacity 700ms ease 200ms',
        }}>
          {!reflectOpen ? (
            <button onClick={() => setReflectOpen(true)} style={{
              background: 'rgba(255,255,255,0.6)', border: '1px solid var(--hairline)',
              borderRadius: 9999, padding: '12px 18px',
              fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-muted)',
              cursor: 'pointer', textAlign: 'center',
            }}>Leave a brief reflection</button>
          ) : (
            <div style={{
              background: 'rgba(255,255,255,0.7)', border: '1px solid var(--hairline)',
              borderRadius: 'var(--r-md)', padding: 14, textAlign: 'left',
            }}>
              <textarea
                value={reflection}
                onChange={(e) => { setReflection(e.target.value); updateTodaysReflection(e.target.value); }}
                placeholder="A note for future you — what shifted, what God whispered, anything at all."
                rows={3}
                autoFocus
                style={{
                  width: '100%', resize: 'none', border: 'none', outline: 'none',
                  background: 'transparent', fontFamily: 'var(--serif)', fontStyle: 'italic',
                  fontSize: 14, lineHeight: 1.5, color: 'var(--ink)', padding: 0,
                }}
              />
              <p style={{ fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--ink-faint)', margin: '6px 0 0', textAlign: 'center' }}>
                Saved as you type.
              </p>
            </div>
          )}
          <PUButton variant="primary" onClick={() => nav('/home')}>Proceed with my day</PUButton>
        </div>
      </div>
    </div>
  );
}
