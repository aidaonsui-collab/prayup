import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RitualShell } from './RitualShell';
import { useRitual } from './state';
import { PRAYER_BY_MOOD, PRAYER_TEMPLATES, type TemplateId } from '../../lib/data';
import { PUButton } from '../../components/PUButton';
import { Icon } from '../../components/Icon';
import { usePersonalPrayer } from '../../lib/usePersonalPrayer';
import { useVerseForMood } from '../../lib/bible';
import { isPrayerSaved, savePrayer, useProfile } from '../../lib/profile';

export function Prayer() {
  const nav = useNavigate();
  const { mood, heart, template, setTemplate } = useRitual();
  const [profile] = useProfile();

  const tpl = PRAYER_TEMPLATES.find((t) => t.id === template) ?? PRAYER_TEMPLATES[0];
  const { verse } = useVerseForMood(mood);
  const ai = usePersonalPrayer({ mood, heart, verse, focusAreas: profile.focusAreas, enabled: tpl.id === 'personal' });

  const fallbackText = tpl.id === 'personal'
    ? (PRAYER_BY_MOOD[mood] ?? PRAYER_BY_MOOD.hopeful)
    : (tpl.text ?? '');
  const prayerText = tpl.id === 'personal' ? (ai.prayer ?? fallbackText) : fallbackText;
  const showingAi = tpl.id === 'personal' && ai.source === 'ai' && !!ai.prayer;

  const [visible, setVisible] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, [template, ai.prayer]);

  useEffect(() => { setSaved(isPrayerSaved(prayerText)); }, [prayerText]);

  const handleSave = () => {
    if (saved || !prayerText) return;
    savePrayer({ text: prayerText, template: tpl.id, mood, verseRef: verse.ref });
    setSaved(true);
  };

  const handleReword = () => {
    if (tpl.id !== 'personal') {
      // Switching to personal also implicitly fires the AI.
      setTemplate('personal' as TemplateId);
      return;
    }
    ai.reword();
  };

  return (
    <RitualShell step={3} total={5} onBack={() => nav('/ritual/scripture')} onClose={() => nav('/home')}>
      <p style={{
        fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.32em',
        textTransform: 'uppercase', color: 'var(--gold-dim)', margin: '4px 0 8px',
      }}>A Prayer for You</p>
      <h2 style={{
        fontFamily: 'var(--serif-display)', fontWeight: 500, fontSize: 24,
        lineHeight: 1.15, letterSpacing: '-0.015em', margin: '0 0 14px',
      }}>Choose a posture. Read it like you mean it.</h2>

      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto', overflowY: 'hidden',
        margin: '0 -24px 14px', padding: '2px 24px 6px',
        scrollbarWidth: 'none',
      }}>
        {PRAYER_TEMPLATES.map((t) => {
          const active = tpl.id === t.id;
          return (
            <button key={t.id} onClick={() => setTemplate(t.id as TemplateId)} style={{
              flexShrink: 0, textAlign: 'left', minWidth: 130,
              padding: '10px 14px', borderRadius: 'var(--r-md)', cursor: 'pointer',
              background: active ? 'var(--ink)' : 'rgba(255,255,255,0.6)',
              color: active ? 'var(--cream)' : 'var(--ink)',
              border: active ? 'none' : '1px solid var(--hairline)',
              boxShadow: active ? '0 6px 14px rgba(15,23,42,0.18)' : 'none',
              transition: 'all 200ms ease',
            }}>
              <div style={{
                fontFamily: 'var(--sans)', fontSize: 9.5, letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: active ? 'rgba(232,211,138,0.9)' : 'var(--gold-dim)',
                marginBottom: 2,
              }}>{t.kind}</div>
              <div style={{
                fontFamily: 'var(--serif-display)', fontSize: 15.5, fontWeight: 500,
                letterSpacing: '-0.005em', lineHeight: 1.2,
              }}>{t.label}</div>
            </button>
          );
        })}
      </div>

      <div style={{
        flex: 1, background: 'linear-gradient(170deg, #FFFCF4 0%, #F7EBD0 100%)',
        border: '1px solid rgba(201,162,39,0.3)',
        borderRadius: 'var(--r-lg)', padding: '24px 22px',
        overflow: 'auto',
        boxShadow: '0 12px 30px rgba(201,162,39,0.10), inset 0 1px 0 rgba(255,255,255,0.6)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 14, right: 14,
          fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: 'var(--gold-dim)',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <Icon.Sparkle size={11} c="var(--gold-dim)" />
          {tpl.kind === 'Personalized'
            ? (ai.loading ? 'Writing for you…' : showingAi ? 'For you, today' : 'Personalized')
            : tpl.label}
        </div>
        {tpl.id === 'personal' && ai.loading ? (
          <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--gold)', opacity: 0.4,
                animation: `pu-breath-dot 1.4s ease-in-out ${i * 0.18}s infinite`,
              }} />
            ))}
          </div>
        ) : (
          <p style={{
            fontFamily: 'var(--serif)', fontSize: 17, lineHeight: 1.55,
            color: 'var(--ink)', margin: '18px 0 0', fontStyle: 'italic',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 800ms ease, transform 800ms ease',
            whiteSpace: 'pre-wrap',
          }}>{prayerText}</p>
        )}

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginTop: 22,
          paddingTop: 18, borderTop: '1px solid rgba(201,162,39,0.25)',
        }}>
          <div style={{ height: 1, flex: 1, background: 'rgba(201,162,39,0.3)' }} />
          <span style={{ fontFamily: 'var(--serif)', fontSize: 14, fontStyle: 'italic', color: 'var(--gold-dim)' }}>Amen.</span>
          <div style={{ height: 1, flex: 1, background: 'rgba(201,162,39,0.3)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, margin: '14px 0 10px' }}>
        <button onClick={handleReword} disabled={ai.loading} style={{
          flex: 1, fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
          padding: '12px', borderRadius: 9999,
          background: 'rgba(255,255,255,0.65)', border: '1px solid var(--hairline)',
          color: ai.loading ? 'var(--ink-faint)' : 'var(--ink)',
          cursor: ai.loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Icon.Sparkle size={14} c="var(--ink-muted)" />
          {tpl.id === 'personal' ? 'Try another wording' : 'Personalize for me'}
        </button>
        <button onClick={handleSave} disabled={saved || !prayerText} style={{
          flex: 1, fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
          padding: '12px', borderRadius: 9999,
          background: saved ? 'rgba(201,162,39,0.18)' : 'rgba(255,255,255,0.65)',
          border: saved ? '1px solid rgba(201,162,39,0.4)' : '1px solid var(--hairline)',
          color: 'var(--ink)', cursor: saved ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Icon.Heart size={14} c={saved ? 'var(--gold-dim)' : 'var(--ink-muted)'} filled={saved} />
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      <PUButton variant="primary" onClick={() => nav('/ritual/space')}>
        Enter the Prayer Space
      </PUButton>
    </RitualShell>
  );
}
