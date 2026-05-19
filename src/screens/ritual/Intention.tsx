import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RitualShell } from './RitualShell';
import { useRitual } from './state';
import { INTENTION_SUGGESTIONS } from '../../lib/data';
import { PUButton } from '../../components/PUButton';

export function Intention() {
  const nav = useNavigate();
  const { intention, setIntention } = useRitual();
  const [draft, setDraft] = useState(intention);

  useEffect(() => { setDraft(intention); }, [intention]);

  const commit = (v: string) => {
    setDraft(v);
    setIntention(v);
  };

  return (
    <RitualShell step={5} total={5} onBack={() => nav('/ritual/space')} onClose={() => nav('/home')}>
      <p style={{
        fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.32em',
        textTransform: 'uppercase', color: 'var(--gold-dim)', margin: '4px 0 12px',
      }}>An Intention · Step 5 of 5</p>
      <h2 style={{
        fontFamily: 'var(--serif-display)', fontWeight: 500, fontSize: 30,
        lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 8px',
      }}>Carry one thing <em style={{ color: 'var(--gold-dim)' }}>into the day.</em></h2>
      <p style={{
        fontFamily: 'var(--sans)', fontSize: 14.5, lineHeight: 1.55,
        color: 'var(--ink-muted)', margin: '0 0 26px',
      }}>A word or short phrase to return to. Optional, always.</p>

      <div style={{
        background: 'linear-gradient(170deg, #FFFCF4 0%, #F7EBD0 100%)',
        border: '1px solid rgba(201,162,39,0.3)',
        borderRadius: 'var(--r-lg)', padding: '26px 22px',
        marginBottom: 22,
        boxShadow: '0 8px 22px rgba(201,162,39,0.10), inset 0 1px 0 rgba(255,255,255,0.6)',
        textAlign: 'center',
      }}>
        <input
          type="text"
          value={draft}
          onChange={(e) => commit(e.target.value)}
          placeholder="Today, I will…"
          maxLength={48}
          style={{
            width: '100%', border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'var(--serif-display)', fontWeight: 500,
            fontSize: draft && draft.length > 14 ? 24 : 30,
            fontStyle: draft ? 'normal' : 'italic',
            letterSpacing: '-0.015em', lineHeight: 1.15,
            color: draft ? 'var(--ink)' : 'rgba(15,23,42,0.35)',
            textAlign: 'center', padding: 0,
            transition: 'font-size 200ms ease',
          }}
        />
        <div style={{
          height: 1, width: '40%', margin: '14px auto 12px',
          background: 'rgba(201,162,39,0.4)',
        }} />
        <p style={{
          fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: 'var(--gold-dim)', margin: 0,
        }}>Today, I will carry this</p>
      </div>

      <p style={{ fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: '4px 0 10px', textAlign: 'center' }}>
        Or borrow one
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
        {INTENTION_SUGGESTIONS.map((s) => {
          const isActive = draft.trim().toLowerCase() === s.toLowerCase();
          return (
            <button key={s} onClick={() => commit(s)} style={{
              fontFamily: 'var(--sans)', fontSize: 13,
              padding: '7px 13px', borderRadius: 9999,
              background: isActive ? 'var(--ink)' : 'rgba(255,255,255,0.6)',
              border: isActive ? 'none' : '1px solid var(--hairline)',
              color: isActive ? 'var(--cream)' : 'var(--ink)',
              cursor: 'pointer', transition: 'all 160ms ease',
            }}>{s}</button>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PUButton variant="primary" onClick={() => nav('/ritual/complete')}>
          {draft.trim() ? 'Carry this with me' : 'Continue without one'}
        </PUButton>
      </div>
    </RitualShell>
  );
}
