import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreamBG } from '../components/CreamBG';
import { PUButton } from '../components/PUButton';
import { Icon } from '../components/Icon';

type StepProps = {
  step: number;
  total?: number;
  kicker: string;
  title: ReactNode;
  body: string;
  art: ReactNode;
  primary: string;
  onPrimary: () => void;
  onSkip: () => void;
  onBack: () => void;
};

function OnboardStep({ step, total = 3, kicker, title, body, art, primary, onPrimary, onSkip, onBack }: StepProps) {
  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <CreamBG />
      <div style={{
        position: 'relative', zIndex: 1, height: '100%', boxSizing: 'border-box',
        padding: '88px 32px 44px', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: 'var(--ink-muted)' }}>
            <Icon.Arrow dir="left" size={20} />
          </button>
          <div style={{ display: 'flex', gap: 6 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{
                width: i + 1 === step ? 22 : 6, height: 6, borderRadius: 3,
                background: i + 1 <= step ? 'var(--ink)' : 'rgba(15,23,42,0.18)',
                transition: 'width 200ms ease, background 200ms ease',
              }} />
            ))}
          </div>
          <button onClick={onSkip} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-muted)' }}>
            Skip
          </button>
        </div>

        <div style={{ flex: '0 0 280px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '12px 0 28px' }}>
          {art}
        </div>

        <p style={{
          fontFamily: 'var(--sans)', fontSize: 10.5, letterSpacing: '0.32em',
          textTransform: 'uppercase', color: 'var(--gold-dim)',
          textAlign: 'center', margin: '0 0 12px',
        }}>{kicker}</p>

        <h2 style={{
          fontFamily: 'var(--serif-display)', fontWeight: 500,
          fontSize: 30, lineHeight: 1.1, letterSpacing: '-0.015em',
          color: 'var(--ink)', textAlign: 'center', margin: '0 0 14px',
        }}>{title}</h2>

        <p style={{
          fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.55,
          color: 'var(--ink-muted)', textAlign: 'center', margin: '0 8px 28px',
        }}>{body}</p>

        <div style={{ marginTop: 'auto' }}>
          <PUButton variant="primary" onClick={onPrimary}>{primary}</PUButton>
        </div>
      </div>
    </div>
  );
}

const art1 = (
  <svg viewBox="0 0 220 220" width="220" height="220">
    <defs>
      <radialGradient id="ob1-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF1C7" stopOpacity="1" />
        <stop offset="100%" stopColor="#E8D38A" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="110" cy="110" r="100" fill="url(#ob1-glow)" />
    {[80, 60, 40, 22].map((r, i) => (
      <circle key={i} cx="110" cy="110" r={r} fill="none" stroke="#C9A227" strokeWidth="1" opacity={0.18 + i * 0.12} />
    ))}
    <circle cx="110" cy="110" r="10" fill="#C9A227" />
  </svg>
);

const art2 = (
  <svg viewBox="0 0 220 220" width="220" height="220">
    <defs>
      <linearGradient id="ob2-card" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#FFFBEF" />
        <stop offset="100%" stopColor="#F1E3C2" />
      </linearGradient>
    </defs>
    <g transform="translate(0,0)">
      <rect x="36" y="24" width="148" height="56" rx="14" fill="url(#ob2-card)" stroke="#C9A227" strokeOpacity="0.35" />
      <circle cx="58" cy="52" r="10" fill="#E8D38A" />
      <rect x="78" y="44" width="80" height="6" rx="3" fill="#0F172A" opacity="0.7" />
      <rect x="78" y="56" width="60" height="5" rx="2.5" fill="#0F172A" opacity="0.3" />
    </g>
    <g transform="translate(0,68)">
      <rect x="36" y="24" width="148" height="56" rx="14" fill="url(#ob2-card)" stroke="#C9A227" strokeOpacity="0.5" />
      <circle cx="58" cy="52" r="10" fill="#C9A227" />
      <rect x="78" y="44" width="64" height="6" rx="3" fill="#0F172A" opacity="0.85" />
      <rect x="78" y="56" width="80" height="5" rx="2.5" fill="#0F172A" opacity="0.3" />
    </g>
    <g transform="translate(0,136)">
      <rect x="36" y="24" width="148" height="56" rx="14" fill="url(#ob2-card)" stroke="#C9A227" strokeOpacity="0.35" />
      <circle cx="58" cy="52" r="10" fill="#A8B7C9" />
      <rect x="78" y="44" width="72" height="6" rx="3" fill="#0F172A" opacity="0.7" />
      <rect x="78" y="56" width="50" height="5" rx="2.5" fill="#0F172A" opacity="0.3" />
    </g>
  </svg>
);

const art3 = (
  <svg viewBox="0 0 220 220" width="220" height="220">
    <defs>
      <linearGradient id="ob3-book" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#FFFBEF" />
        <stop offset="100%" stopColor="#F1E3C2" />
      </linearGradient>
      <radialGradient id="ob3-glow" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#FFF1C7" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#E8D38A" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="110" cy="90" rx="110" ry="80" fill="url(#ob3-glow)" />
    <path d="M30 130 Q110 110 110 110 Q110 110 190 130 L190 180 Q110 158 110 158 Q110 158 30 180 Z" fill="url(#ob3-book)" stroke="#C9A227" strokeOpacity="0.4" />
    <line x1="110" y1="110" x2="110" y2="158" stroke="#C9A227" strokeOpacity="0.4" />
    {[140, 148, 156].map((y, i) => (
      <g key={i}>
        <line x1="44" y1={y} x2={100 - i * 4} y2={y} stroke="#0F172A" strokeOpacity={0.25 - i * 0.05} strokeWidth="1.2" />
        <line x1={120 + i * 4} y1={y} x2="176" y2={y} stroke="#0F172A" strokeOpacity={0.25 - i * 0.05} strokeWidth="1.2" />
      </g>
    ))}
    <circle cx="110" cy="60" r="6" fill="#FFF1C7" />
    <circle cx="110" cy="60" r="14" fill="none" stroke="#C9A227" strokeOpacity="0.4" />
  </svg>
);

export function Onboard() {
  const params = useParams<{ step?: string }>();
  const nav = useNavigate();
  const step = Number(params.step ?? 1);

  if (step === 1) {
    return (
      <OnboardStep
        step={1} kicker="The Idea"
        title="Before the scroll, the prayer."
        body="The moment your hand reaches for the phone becomes a sacred pause — a short prayer, then the rest of your day."
        art={art1}
        primary="Continue" onPrimary={() => nav('/onboard/2')}
        onBack={() => nav('/')} onSkip={() => nav('/home')}
      />
    );
  }
  if (step === 2) {
    return (
      <OnboardStep
        step={2} kicker="The Practice"
        title="Four small steps. One quiet ritual."
        body="Check in with your heart. Receive a verse. Pray. Proceed with purpose. Two to five minutes — no more."
        art={art2}
        primary="Continue" onPrimary={() => nav('/onboard/3')}
        onBack={() => nav('/onboard/1')} onSkip={() => nav('/home')}
      />
    );
  }
  return (
    <OnboardStep
      step={3} kicker="The Foundation"
      title="Every prayer, rooted in Scripture."
      body="Each prayer begins from a verse chosen for what you're carrying today. The Word leads, the prayer follows."
      art={art3}
      primary="Set up reminders" onPrimary={() => nav('/home')}
      onBack={() => nav('/onboard/2')} onSkip={() => nav('/home')}
    />
  );
}
