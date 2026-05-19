import { useNavigate } from 'react-router-dom';
import { RitualShell } from './RitualShell';
import { useRitual } from './state';
import { MOODS, type MoodId } from '../../lib/data';
import { PUButton } from '../../components/PUButton';

export function Checkin() {
  const nav = useNavigate();
  const { mood, setMood, heart, setHeart } = useRitual();

  return (
    <RitualShell step={1} total={5} onBack={() => nav('/ritual/welcome')} onClose={() => nav('/home')}>
      <p style={{
        fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.32em',
        textTransform: 'uppercase', color: 'var(--gold-dim)', margin: '4px 0 12px',
      }}>Heart Check-In · Step 1 of 5</p>
      <h2 style={{
        fontFamily: 'var(--serif-display)', fontWeight: 500, fontSize: 32,
        lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 8px',
      }}>How is your heart <em style={{ color: 'var(--gold-dim)' }}>today?</em></h2>
      <p style={{
        fontFamily: 'var(--sans)', fontSize: 14.5, lineHeight: 1.55,
        color: 'var(--ink-muted)', margin: '0 0 24px',
      }}>There's no wrong answer. Whatever is true, bring it.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {MOODS.map((m) => {
          const isSelected = mood === m.id;
          return (
            <button key={m.id} onClick={() => setMood(m.id as MoodId)} style={{
              position: 'relative', overflow: 'hidden', textAlign: 'left',
              padding: '16px 14px', borderRadius: 'var(--r-md)', cursor: 'pointer',
              background: isSelected
                ? `linear-gradient(160deg, ${m.tone}44 0%, ${m.tone}22 100%)`
                : 'rgba(255,255,255,0.62)',
              border: isSelected ? `1.5px solid ${m.tone}` : '1px solid var(--hairline)',
              boxShadow: isSelected ? `0 8px 22px ${m.tone}33` : 'none',
              transition: 'all 200ms ease',
              transform: isSelected ? 'translateY(-2px)' : 'none',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, #FFFFFF 0%, ${m.tone} 65%)`,
                boxShadow: `0 2px 6px ${m.tone}66`,
                marginBottom: 10,
              }} />
              <div style={{
                fontFamily: 'var(--serif-display)', fontSize: 18, fontWeight: 500,
                color: 'var(--ink)', letterSpacing: '-0.01em',
              }}>{m.label}</div>
              <div style={{
                fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--ink-muted)',
                marginTop: 3, lineHeight: 1.3,
              }}>{m.sub}</div>
            </button>
          );
        })}
      </div>

      <p style={{ fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: '2px 0 8px' }}>What is on your heart?</p>
      <div style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.6)',
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--r-md)',
        padding: '14px 14px 12px',
        marginBottom: 12,
      }}>
        <textarea
          value={heart}
          onChange={(e) => setHeart(e.target.value)}
          placeholder="Something you're carrying. A name. A question. Or nothing at all — just being here is enough."
          rows={3}
          style={{
            width: '100%', resize: 'none', border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15.5, lineHeight: 1.5,
            color: 'var(--ink)', padding: 0,
          }}
        />
      </div>
      <p style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-faint)', margin: '0 4px 16px', textAlign: 'center' }}>
        Private to you. Never shared.
      </p>

      <div style={{ marginTop: 'auto' }}>
        <PUButton variant="primary" onClick={() => nav('/ritual/scripture')}>
          Receive today's verse
        </PUButton>
      </div>
    </RitualShell>
  );
}
