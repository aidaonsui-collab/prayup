import { useNavigate } from 'react-router-dom';
import { CreamBG } from '../components/CreamBG';
import { LightRays } from '../components/LightRays';
import { Wordmark } from '../components/Wordmark';
import { Icon } from '../components/Icon';
import { TabBar } from '../components/TabBar';
import { SectionTitle } from '../components/SectionTitle';
import { useState } from 'react';
import {
  formatRelativeDate,
  getRecentEntries,
  getStreak,
  getThisWeek,
  useJourneyVersion,
} from '../lib/journey';
import { getDisplayName, getProfile, useProfile } from '../lib/profile';

function StatCard({ label, value, unit, icon }: { label: string; value: string | number; unit: string; icon: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)',
      border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)',
      padding: '14px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        {icon}
        <span style={{ fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span style={{ fontFamily: 'var(--serif-display)', fontSize: 30, fontWeight: 500, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</span>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-muted)' }}>{unit}</span>
      </div>
    </div>
  );
}

export function Home() {
  const nav = useNavigate();
  useJourneyVersion();
  const [profile, setProfile] = useProfile();
  const name = getDisplayName('friend');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const streak = getStreak();
  const weekDone = getThisWeek();
  const weekCount = weekDone.filter(Boolean).length;
  const todayDow = (new Date().getDay() + 6) % 7; // Mon-based
  const recent = getRecentEntries(2);

  const [addingCarry, setAddingCarry] = useState(false);
  const [carryDraft, setCarryDraft] = useState('');
  const addCarry = (label: string) => {
    const v = label.trim();
    if (!v) return;
    const cur = getProfile().carrying;
    setProfile({ carrying: Array.from(new Set([...cur, v])) });
    setCarryDraft('');
    setAddingCarry(false);
  };
  const removeCarry = (label: string) => {
    const cur = getProfile().carrying;
    setProfile({ carrying: cur.filter((c) => c !== label) });
  };

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'auto' }}>
      <CreamBG />
      <div style={{ position: 'relative', zIndex: 1, padding: '72px 24px 110px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
          <Wordmark size={20} />
          <button onClick={() => nav('/settings')} aria-label="Notifications" style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)', border: '1px solid var(--hairline)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--ink)',
          }}>
            <Icon.Bell size={18} />
          </button>
        </div>

        <p style={{
          fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.28em',
          textTransform: 'uppercase', color: 'var(--gold-dim)', margin: '0 0 6px',
        }}>{today}</p>
        <h1 style={{
          fontFamily: 'var(--serif-display)', fontWeight: 500, fontSize: 34, lineHeight: 1.1,
          letterSpacing: '-0.02em', color: 'var(--ink)', margin: '0 0 6px',
        }}>Welcome back, <em style={{ color: 'var(--gold-dim)', fontStyle: 'italic' }}>{name}.</em></h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-muted)', margin: '0 0 24px' }}>
          Take a breath. Today is held.
        </p>

        <div onClick={() => nav('/ritual/welcome')} style={{
          position: 'relative', borderRadius: 'var(--r-lg)', overflow: 'hidden',
          background: 'linear-gradient(160deg, #1B2540 0%, #0F172A 70%)',
          color: '#F7F1E5', padding: '24px 22px 22px',
          boxShadow: '0 20px 40px rgba(15,23,42,0.18), 0 4px 14px rgba(15,23,42,0.12)',
          cursor: 'pointer', marginBottom: 18,
        }}>
          <LightRays opacity={0.22} color="#E8D38A" />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{
                fontFamily: 'var(--sans)', fontSize: 10.5, letterSpacing: '0.28em',
                textTransform: 'uppercase', color: '#E8D38A',
              }}>Today's sacred pause</span>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'rgba(247,241,229,0.7)' }}>~5 min</span>
            </div>
            <p style={{
              fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 21, lineHeight: 1.35,
              margin: '0 0 22px', color: '#F7F1E5',
            }}>"Be still, and know that I am God."</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'linear-gradient(180deg, #E8D38A 0%, #C9A227 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(201,162,39,0.4)',
                  color: '#1A1408',
                }}>
                  <Icon.Arrow dir="right" size={16} c="#1A1408" />
                </div>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 500 }}>Begin the ritual</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
          <StatCard label="Current streak" value={streak} unit={streak === 1 ? 'day' : 'days'} icon={<Icon.Flame size={16} c="#C9A227" />} />
          <StatCard label="This week" value={`${weekCount}/7`} unit="rituals" icon={<Icon.Check size={16} c="#7C8B7A" />} />
        </div>

        <SectionTitle>This week</SectionTitle>
        <div style={{
          background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(8px)',
          border: '1px solid var(--hairline)', borderRadius: 'var(--r-lg)',
          padding: '18px 18px', display: 'flex', justifyContent: 'space-between', marginBottom: 22,
        }}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
            const done = weekDone[i];
            const isToday = i === todayDow;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.1em' }}>{d}</span>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: done ? (isToday ? 'linear-gradient(180deg, #E8D38A 0%, #C9A227 100%)' : 'var(--ink)') : 'transparent',
                  border: done ? 'none' : '1.5px dashed rgba(15,23,42,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: done ? (isToday ? '#1A1408' : 'var(--cream)') : 'var(--ink-faint)',
                  boxShadow: isToday ? '0 6px 16px rgba(201,162,39,0.35)' : 'none',
                }}>
                  {done && <Icon.Check size={14} c={isToday ? '#1A1408' : 'var(--cream)'} stroke={2.4} />}
                </div>
              </div>
            );
          })}
        </div>

        <SectionTitle>What you're carrying</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
          {profile.carrying.map((t) => (
            <button key={t} onClick={() => removeCarry(t)} title="Tap to remove" style={{
              fontFamily: 'var(--sans)', fontSize: 13,
              padding: '9px 14px', borderRadius: 9999,
              background: 'rgba(255,255,255,0.7)',
              border: '1px solid var(--hairline)',
              color: 'var(--ink)', cursor: 'pointer',
            }}>{t}</button>
          ))}
          {addingCarry ? (
            <form onSubmit={(e) => { e.preventDefault(); addCarry(carryDraft); }} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input
                autoFocus
                value={carryDraft}
                onChange={(e) => setCarryDraft(e.target.value)}
                onBlur={() => { if (!carryDraft.trim()) setAddingCarry(false); }}
                placeholder="What's on your heart?"
                maxLength={28}
                style={{
                  fontFamily: 'var(--sans)', fontSize: 13,
                  padding: '8px 14px', borderRadius: 9999,
                  background: 'rgba(255,255,255,0.85)',
                  border: '1px solid var(--gold-soft)',
                  color: 'var(--ink)', outline: 'none', minWidth: 0, width: 160,
                }}
              />
            </form>
          ) : (
            <button onClick={() => setAddingCarry(true)} style={{
              fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
              padding: '9px 14px', borderRadius: 9999,
              background: 'transparent',
              border: '1px dashed rgba(15,23,42,0.25)',
              color: 'var(--ink-muted)', cursor: 'pointer',
            }}>+ Add</button>
          )}
        </div>

        {recent.length > 0 && (
          <>
            <SectionTitle>Recent reflections</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recent.map((r) => {
                const note = (r.intention && r.intention.trim()) || (r.heart && r.heart.trim()) || 'A quiet pause.';
                return (
                  <div key={r.date} style={{
                    background: 'rgba(255,255,255,0.55)', border: '1px solid var(--hairline)',
                    borderRadius: 'var(--r-md)', padding: '14px 16px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-dim)' }}>{r.verseRef || r.mood}</span>
                      <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-faint)' }}>{formatRelativeDate(r.date)}</span>
                    </div>
                    <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--ink)', margin: 0 }}>{note}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <TabBar active="home" />
    </div>
  );
}
