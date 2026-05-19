import { CreamBG } from '../components/CreamBG';
import { LightRays } from '../components/LightRays';
import { TabBar } from '../components/TabBar';
import { SectionTitle } from '../components/SectionTitle';

const STREAK = 17;

export function Dashboard() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const today = 18;
  const completed = new Set([1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18]);
  const firstDow = 5; // May 1, 2026 = Friday
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (const d of days) cells.push(d);

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
              <span style={{ fontFamily: 'var(--serif-display)', fontSize: 64, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.03em' }}>{STREAK}</span>
              <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, color: 'var(--ink-muted)' }}>days of pausing</span>
            </div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-muted)', margin: '8px 0 0', lineHeight: 1.55 }}>
              <span style={{ color: 'var(--gold-dim)' }}>Faithful in small things.</span> Not a score — a quiet record of presence.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 26 }}>
          {[
            { label: 'Total', value: '47', unit: 'days' },
            { label: 'This month', value: '16', unit: 'days' },
            { label: 'Verses', value: '29', unit: '' },
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

        <SectionTitle>May 2026</SectionTitle>
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
              const isToday = d === today;
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

        <SectionTitle>Gentle insights</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
          {[
            { kicker: 'Mornings', body: 'You pray most at 7:14 am, before the day begins.' },
            { kicker: 'Themes', body: 'This week you carried work, family, and patience.' },
            { kicker: 'Verses', body: 'You returned to Psalm 23 four times this month.' },
          ].map((it) => (
            <div key={it.kicker} style={{
              background: 'rgba(255,255,255,0.55)', border: '1px solid var(--hairline)',
              borderRadius: 'var(--r-md)', padding: '14px 16px',
            }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold-dim)', margin: '0 0 6px' }}>{it.kicker}</p>
              <p style={{ fontFamily: 'var(--serif)', fontSize: 15.5, lineHeight: 1.4, color: 'var(--ink)', margin: 0, fontStyle: 'italic' }}>{it.body}</p>
            </div>
          ))}
        </div>

        <SectionTitle>Verses you've prayed</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { ref: 'Psalm 23:1', body: 'The Lord is my shepherd; I shall not want.' },
            { ref: 'Philippians 4:6', body: 'Do not be anxious about anything.' },
            { ref: 'Isaiah 41:10', body: 'Fear not, for I am with you.' },
          ].map((v) => (
            <div key={v.ref} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 4px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', marginTop: 9, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-dim)', margin: '0 0 3px' }}>{v.ref}</p>
                <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14.5, color: 'var(--ink)', margin: 0, lineHeight: 1.4 }}>"{v.body}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="dashboard" />
    </div>
  );
}
