import { useNavigate } from 'react-router-dom';
import { CreamBG } from '../components/CreamBG';
import { PUButton, PUTextLink } from '../components/PUButton';
import { Wordmark } from '../components/Wordmark';

export function Landing() {
  const nav = useNavigate();
  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <CreamBG />
      <div style={{
        position: 'relative', zIndex: 1, height: '100%', boxSizing: 'border-box',
        padding: '120px 32px 44px', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <Wordmark size={22} />
        </div>

        <div style={{ width: '100%', aspectRatio: '1/1', maxHeight: 280, position: 'relative', margin: '8px auto 0' }}>
          <svg viewBox="0 0 320 320" width="100%" height="100%" style={{ display: 'block' }}>
            <defs>
              <radialGradient id="hero-sun" cx="50%" cy="55%" r="45%">
                <stop offset="0%" stopColor="#FFF1C7" stopOpacity="1" />
                <stop offset="55%" stopColor="#E8D38A" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="hero-page" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#FFFBEF" />
                <stop offset="100%" stopColor="#F1E3C2" />
              </linearGradient>
            </defs>
            <circle cx="160" cy="150" r="120" fill="url(#hero-sun)" />
            <ellipse cx="160" cy="240" rx="140" ry="14" fill="#E8D38A" opacity="0.4" />
            <circle cx="160" cy="150" r="60" fill="none" stroke="#C9A227" strokeWidth="1" opacity="0.6" />
            <circle cx="160" cy="150" r="90" fill="none" stroke="#C9A227" strokeWidth="0.5" opacity="0.35" />
            <path d="M40 230 L160 220 L280 230 L280 260 L160 252 L40 260 Z" fill="url(#hero-page)" stroke="#C9A227" strokeOpacity="0.3" />
            <line x1="160" y1="220" x2="160" y2="252" stroke="#C9A227" strokeOpacity="0.4" />
            <line x1="60" y1="238" x2="140" y2="236" stroke="#0F172A" strokeOpacity="0.18" strokeWidth="1.2" />
            <line x1="60" y1="246" x2="120" y2="244" stroke="#0F172A" strokeOpacity="0.14" strokeWidth="1.2" />
            <line x1="180" y1="236" x2="260" y2="238" stroke="#0F172A" strokeOpacity="0.18" strokeWidth="1.2" />
            <line x1="180" y1="244" x2="240" y2="246" stroke="#0F172A" strokeOpacity="0.14" strokeWidth="1.2" />
          </svg>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <p style={{
            fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.32em',
            textTransform: 'uppercase', color: 'var(--gold-dim)',
            textAlign: 'center', margin: '0 0 14px',
          }}>A daily sacred pause</p>

          <h1 style={{
            fontFamily: 'var(--serif-display)', fontWeight: 500,
            fontSize: 40, lineHeight: 1.05, letterSpacing: '-0.02em',
            color: 'var(--ink)', textAlign: 'center', margin: '0 0 14px',
          }}>
            Pause. Pray.<br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold-dim)' }}>Proceed with clarity.</em>
          </h1>

          <p style={{
            fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.55,
            color: 'var(--ink-muted)', textAlign: 'center', margin: '0 32px 32px',
          }}>
            A few quiet minutes to settle your heart, hear a word from Scripture, and set one clear intention before the day takes you.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <PUButton variant="primary" onClick={() => nav('/onboard/1')}>Begin your ritual</PUButton>
            <PUTextLink onClick={() => nav('/home')} style={{ textAlign: 'center', alignSelf: 'center' }}>
              I already have an account →
            </PUTextLink>
          </div>
        </div>
      </div>
    </div>
  );
}
