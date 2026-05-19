import { CreamBG } from '../components/CreamBG';
import { LightRays } from '../components/LightRays';
import { TabBar } from '../components/TabBar';
import { SectionTitle } from '../components/SectionTitle';
import {
  getAllEntries,
  getMonthStats,
  getRecentEntries,
  getStreak,
  getThisMonthCount,
  getTotalCompleted,
  getUniqueVerseCount,
  useJourneyVersion,
} from '../lib/journey';
import { VERSE_BY_MOOD } from '../lib/data';

export function Dashboard() {
  useJourneyVersion();
  const streak = getStreak();
  const total = getTotalCompleted();
  const thisMonth = getThisMonthCount();
  const verseCount = getUniqueVerseCount();
  const month = getMonthStats();
  const { firstDow, daysInMonth, completed, today } = month;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (const d of days) cells.push(d);

  const allEntries = getAllEntries();
  const recentVerses = getRecentEntries(3)
    .map((e) => ({
      ref: e.verseRef ?? VERSE_BY_MOOD[e.mood]?.ref ?? '',
      body: VERSE_BY_MOOD[e.mood]?.body ?? '',
    }))
    .filter((v) => v.ref && v.body);

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'auto' }}>
      <CreamBG />
      <div style={{ position: 'relative', zIndex: 1, padding: '72px 24px 120px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h1 style={{
            fontFamily: 'var(--serif-display)', fontWeight: 500, fontSize: 28, margin: 0,
            letterSpacing: '-0.015em',
          }}>A quiet record</h1>
        </div>

        <div style={{
          background: 'linear-gradient(165deg, rgba(232,211,138,0.35) 0%, rgba(255,251,239,0.6) 100%)',
          border: '1px solid rgba(201,162,39,0.3)',
          borderRadius: 'var(--r-lg)', padding: '24px 22px', marginBottom: 18,
          position: 'relative', overflow: 'hidden',
        }}>
          <LightRays opacity={0.18} color="#C9A227" />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.28em',
              textTransform: 'uppercase', color: 'var(--gold-dim)', margin: '0 0 8px',
            }}>Current streak</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: 'var(--serif-display)', fontSize: 64, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.03em' }}>{streak}</span>
              <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, color: 'var(--ink-muted)' }}>days of pausing</span>
            </div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-muted)', margin: '8px 0 0', lineHeight: 1.55 }}>
              <span style={{ color: 'var(--gold-dim)' }}>Faithful in small things.</span> Not a score — a quiet record of presence.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 26 }}>
          {[
            { label: 'Total', value: String(total), unit: 'days' },
            { label: 'This month', value: String(thisMonth), unit: 'days' },
            { label: 'Verses', value: String(verseCount), unit: '' },
          ].map((s) => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.65)', border: '1px solid var(--hairline)',
              borderRadius: 'var(--r-md)', padding: '14px 12px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'var(--serif-display)', fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <SectionTitle>{month.monthLabel}</SectionTitle>
        <div style={{
          background: 'rgba(255,255,255,0.6)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-lg)', padding: '16px 14px 18px', marginBottom: 22,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--ink-faint)' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />;
              const isToday = today !== null && d === today;
              const isDone = completed.has(d);
              return (
                <div key={i} style={{
                  aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--sans)', fontSize: 12, fontWeight: isToday ? 600 : 400,
                  borderRadius: '50%', position: 'relative',
                  background: isDone && !isToday ? 'rgba(201,162,39,0.18)' : 'transparent',
                  color: isDone ? (isToday ? '#1A1408' : 'var(--ink)') : 'var(--ink-faint)',
                  boxShadow: isToday ? '0 4px 12px rgba(201,162,39,0.35)' : 'none',
                }}>
                  {isToday && <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: 'linear-gradient(180deg, #E8D38A 0%, #C9A227 100%)',
                  }} />}
                  <span style={{ position: 'relative', zIndex: 1 }}>{d}</span>
                </div>
              );
            })}
          </div>
        </div>

        {allEntries.length >= 3 && (() => {
          const insights = deriveInsights(allEntries);
          return (
            <>
              <SectionTitle>Gentle insights</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
                {insights.map((it) => (
                  <div key={it.kicker} style={{
                    background: 'rgba(255,255,255,0.55)', border: '1px solid var(--hairline)',
                    borderRadius: 'var(--r-md)', padding: '14px 16px',
                  }}>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold-dim)', margin: '0 0 6px' }}>{it.kicker}</p>
                    <p style={{ fontFamily: 'var(--serif)', fontSize: 15.5, lineHeight: 1.4, color: 'var(--ink)', margin: 0, fontStyle: 'italic' }}>{it.body}</p>
                  </div>
                ))}
              </div>
            </>
          );
        })()}

        {recentVerses.length > 0 && (
          <>
            <SectionTitle>Verses you've prayed</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {recentVerses.map((v, i) => (
                <div key={`${v.ref}-${i}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 4px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', marginTop: 9, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-dim)', margin: '0 0 3px' }}>{v.ref}</p>
                    <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14.5, color: 'var(--ink)', margin: 0, lineHeight: 1.4 }}>"{v.body}"</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {allEntries.length === 0 && (
          <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-faint)', textAlign: 'center', margin: '24px 16px 0' }}>
            Your journey starts with the first pause. Begin today's ritual when you're ready.
          </p>
        )}
      </div>
      <TabBar active="dashboard" />
    </div>
  );
}

// Derive insight cards from real ritual history.
import type { RitualEntry } from '../lib/journey';
import { MOODS } from '../lib/data';

function deriveInsights(entries: RitualEntry[]): { kicker: string; body: string }[] {
  const out: { kicker: string; body: string }[] = [];

  // Mornings: median hour of completedAt
  const hours = entries.map((e) => new Date(e.completedAt).getHours());
  if (hours.length) {
    const avg = Math.round(hours.reduce((a, b) => a + b, 0) / hours.length);
    const label = avg < 5 ? 'late night' : avg < 12 ? 'morning' : avg < 18 ? 'afternoon' : 'evening';
    out.push({ kicker: label.charAt(0).toUpperCase() + label.slice(1), body: `You return to prayer most often in the ${label}.` });
  }

  // Themes: top 3 moods this week
  const weekAgo = Date.now() - 7 * 86400000;
  const recentMoods = entries.filter((e) => e.completedAt >= weekAgo).map((e) => e.mood);
  if (recentMoods.length) {
    const counts = new Map<string, number>();
    for (const m of recentMoods) counts.set(m, (counts.get(m) ?? 0) + 1);
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
      .map(([id]) => MOODS.find((m) => m.id === id)?.label.toLowerCase() ?? id);
    if (top.length) {
      out.push({ kicker: 'Themes', body: `This week you came as ${top.join(', ')}.` });
    }
  }

  // Verses: most-returned
  const refCounts = new Map<string, number>();
  for (const e of entries) if (e.verseRef) refCounts.set(e.verseRef, (refCounts.get(e.verseRef) ?? 0) + 1);
  const topVerse = [...refCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topVerse && topVerse[1] >= 2) {
    out.push({ kicker: 'Verses', body: `You returned to ${topVerse[0]} ${topVerse[1]} times.` });
  }

  return out;
}
