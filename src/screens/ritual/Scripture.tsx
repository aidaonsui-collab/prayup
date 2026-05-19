import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RitualShell } from './RitualShell';
import { useRitual } from './state';
import { useVerseForMood } from '../../lib/bible';
import { PUButton, PUTextLink } from '../../components/PUButton';

export function Scripture() {
  const nav = useNavigate();
  const { mood } = useRitual();
  const { verse, loading: verseLoading } = useVerseForMood(mood);
  const words = verse.body.split(' ');
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (verseLoading) return;
    setShown(0);
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i += 1;
      setShown(i);
      if (i < words.length) timer = setTimeout(tick, 90);
    };
    const initial = setTimeout(tick, 280);
    return () => {
      clearTimeout(initial);
      clearTimeout(timer);
    };
  }, [words.length, verseLoading]);

  return (
    <RitualShell step={2} total={5} onBack={() => nav('/ritual/checkin')} onClose={() => nav('/home')}>
      <p style={{
        fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.32em',
        textTransform: 'uppercase', color: 'var(--gold-dim)', margin: '4px 0 12px',
      }}>Today's Word</p>

      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', margin: '4px 0 20px' }}>
        <svg width="120" height="100" viewBox="0 0 120 100">
          <defs>
            <radialGradient id="rs-sun" cx="50%" cy="100%" r="80%">
              <stop offset="0%" stopColor="#FFF1C7" stopOpacity="1" />
              <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="80" rx="60" ry="50" fill="url(#rs-sun)" />
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i}
              x1="60" y1="80"
              x2={60 + Math.sin((i - 2) * 0.4) * 70}
              y2={80 - Math.cos((i - 2) * 0.4) * 70}
              stroke="#C9A227" strokeOpacity="0.35" strokeWidth="0.8" />
          ))}
          <circle cx="60" cy="80" r="4" fill="#C9A227" />
        </svg>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 4px', textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--serif)', fontSize: 24, lineHeight: 1.4, fontStyle: 'italic',
          color: 'var(--ink)', margin: '0 0 24px',
          letterSpacing: '-0.005em', fontWeight: 400,
        }}>
          <span style={{ color: 'var(--gold)', fontFamily: 'var(--serif-display)', fontSize: 46, lineHeight: 0, verticalAlign: '-0.2em', marginRight: 4 }}>"</span>
          {words.map((w, i) => (
            <span key={i} style={{
              opacity: i < shown ? 1 : 0,
              transition: 'opacity 600ms ease',
              transitionDelay: `${i * 30}ms`,
            }}>{w}{' '}</span>
          ))}
          <span style={{ color: 'var(--gold)', fontFamily: 'var(--serif-display)', fontSize: 46, lineHeight: 0, verticalAlign: '-0.2em' }}>"</span>
        </p>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', margin: '0 0 6px',
        }}>
          <div style={{ height: 1, width: 24, background: 'var(--gold)' }} />
          <p style={{
            fontFamily: 'var(--sans)', fontSize: 12, letterSpacing: '0.28em',
            textTransform: 'uppercase', color: 'var(--gold-dim)', margin: 0,
          }}>{verse.ref}</p>
          <div style={{ height: 1, width: 24, background: 'var(--gold)' }} />
        </div>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-faint)', margin: '10px 0 0' }}>
          ESV · Tap to read context
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PUButton variant="primary" onClick={() => nav('/ritual/prayer')}>Continue to prayer</PUButton>
        <PUTextLink onClick={() => nav('/ritual/prayer')} style={{ textAlign: 'center', alignSelf: 'center' }}>
          Try another verse
        </PUTextLink>
      </div>
    </RitualShell>
  );
}
