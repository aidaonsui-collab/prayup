import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { CreamBG } from '../components/CreamBG';
import { Icon } from '../components/Icon';
import { TabBar } from '../components/TabBar';
import { SectionTitle } from '../components/SectionTitle';
import { useLocalState } from '../lib/state';
import { PrayUpPWA, type PWAState } from '../lib/pwa';

function permLabel(perm: PWAState['permission'], subscribed: boolean) {
  if (perm === 'unsupported') return 'Not supported on this device';
  if (perm === 'granted') return subscribed ? 'Active · gentle daily nudge' : 'Allowed · tap to start daily reminder';
  if (perm === 'denied') return 'Blocked — enable in browser settings';
  return 'Permission needed for daily reminder';
}

function DotIcon({ c }: { c: string }) {
  return <div style={{ width: 14, height: 14, borderRadius: '50%', background: c, border: '1px solid rgba(15,23,42,0.15)' }} />;
}

function Switch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-pressed={on} style={{
      width: 48, height: 28, borderRadius: 999,
      background: on ? 'linear-gradient(180deg, #2D8A5A 0%, #1F6B43 100%)' : 'rgba(15,23,42,0.15)',
      border: 'none', cursor: 'pointer', position: 'relative',
      transition: 'background 200ms ease',
      boxShadow: on ? '0 2px 6px rgba(31,107,67,0.3), inset 0 1px 0 rgba(255,255,255,0.15)' : 'inset 0 1px 2px rgba(0,0,0,0.06)',
      padding: 0,
    }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 22 : 2,
        width: 24, height: 24, borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.18), 0 1px 0 rgba(0,0,0,0.04)',
        transition: 'left 200ms cubic-bezier(.2,.8,.2,1)',
      }} />
    </button>
  );
}

function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <SectionTitle>{title}</SectionTitle>
      <div style={{
        background: 'rgba(255,255,255,0.65)', border: '1px solid var(--hairline)',
        borderRadius: 'var(--r-lg)', overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

function SettingsRow({
  icon, label, value, valueColor, isLast = false,
}: { icon?: ReactNode; label: string; value?: string; valueColor?: string; isLast?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '15px 16px',
      borderBottom: isLast ? 'none' : '1px solid var(--hairline)',
      cursor: 'pointer',
    }}>
      {icon && <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: 'rgba(15,23,42,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>{icon}</div>}
      <span style={{ flex: 1, fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--ink)' }}>{label}</span>
      {value && <span style={{ fontFamily: 'var(--sans)', fontSize: 14, color: valueColor || 'var(--ink-muted)' }}>{value}</span>}
      <Icon.Arrow dir="right" size={14} c="var(--ink-faint)" />
    </div>
  );
}

export function Settings() {
  const [pwa, setPwa] = useState<PWAState>(() => PrayUpPWA.state());
  useEffect(() => {
    setPwa(PrayUpPWA.state());
    return PrayUpPWA.subscribe(setPwa);
  }, []);

  const [remindersOn, setRemindersOn] = useLocalState<boolean>('prayup.reminders', false);
  const [reminderTime, setReminderTime] = useLocalState<string>('prayup.reminderTime', '07:00');

  const toggleReminders = async () => {
    if (!remindersOn) {
      const perm = await PrayUpPWA.requestPermission();
      if (perm === 'granted') {
        await PrayUpPWA.subscribePush();
        setRemindersOn(true);
      }
    } else {
      await PrayUpPWA.unsubscribePush();
      setRemindersOn(false);
    }
  };

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'auto' }}>
      <CreamBG />
      <div style={{ position: 'relative', zIndex: 1, padding: '72px 24px 120px', boxSizing: 'border-box' }}>
        <h1 style={{
          fontFamily: 'var(--serif-display)', fontWeight: 500, fontSize: 28,
          letterSpacing: '-0.015em', margin: '0 0 26px',
        }}>Settings</h1>

        <div style={{
          background: 'rgba(255,255,255,0.7)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-lg)', padding: 18, display: 'flex', alignItems: 'center', gap: 14,
          marginBottom: 24,
        }}>
          <div style={{
            width: 54, height: 54, borderRadius: '50%',
            background: 'linear-gradient(135deg, #E8D38A 0%, #C9A227 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--serif-display)', fontSize: 22, color: '#1A1408', fontWeight: 500,
          }}>D</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--serif-display)', fontSize: 18, fontWeight: 500, margin: '0 0 2px', letterSpacing: '-0.01em' }}>Daniel Park</p>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-muted)', margin: 0 }}>Member since March 2026</p>
          </div>
          <Icon.Arrow dir="right" size={16} c="var(--ink-faint)" />
        </div>

        <SettingsGroup title="Practice">
          <SettingsRow icon={<Icon.Bell size={18} c="var(--ink)" />} label="Daily reminder" value={reminderTime} />
          <SettingsRow icon={<Icon.Heart size={18} c="var(--ink)" />} label="Focus areas" value="4 selected" />
          <SettingsRow icon={<Icon.Book size={18} c="var(--ink)" />} label="Bible translation" value="ESV" />
          <SettingsRow icon={<Icon.Sparkle size={18} c="var(--ink)" />} label="Prayer length" value="2 min" isLast />
        </SettingsGroup>

        <SectionTitle>Your focus areas</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {[
            { label: 'Anxiety', on: true },
            { label: 'Work', on: true },
            { label: 'Family', on: true },
            { label: 'Healing', on: true },
            { label: 'Patience', on: false },
            { label: 'Gratitude', on: false },
            { label: 'Direction', on: false },
            { label: '+ Add', on: false, add: true },
          ].map((c) => (
            <div key={c.label} style={{
              fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
              padding: '8px 14px', borderRadius: 9999,
              background: c.on ? 'var(--ink)' : 'rgba(255,255,255,0.7)',
              color: c.on ? 'var(--cream)' : c.add ? 'var(--ink-muted)' : 'var(--ink)',
              border: c.on ? 'none' : c.add ? '1px dashed rgba(15,23,42,0.25)' : '1px solid var(--hairline)',
              cursor: 'pointer',
            }}>{c.label}</div>
          ))}
        </div>

        <SectionTitle>Daily reminder</SectionTitle>
        <div style={{
          background: 'rgba(255,255,255,0.65)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: 24,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '15px 16px',
            borderBottom: '1px solid var(--hairline)',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'rgba(15,23,42,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon.Bell size={18} c="var(--ink)" /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--ink)' }}>Push notifications</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--ink-muted)', marginTop: 2, lineHeight: 1.4 }}>
                {permLabel(pwa.permission, pwa.subscribed)}
              </div>
            </div>
            <Switch on={remindersOn && pwa.permission === 'granted'} onClick={toggleReminders} />
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '15px 16px',
            opacity: remindersOn ? 1 : 0.45,
            pointerEvents: remindersOn ? 'auto' : 'none',
            borderBottom: '1px solid var(--hairline)',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, background: 'rgba(15,23,42,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
              </svg>
            </div>
            <span style={{ flex: 1, fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--ink)' }}>Remind me at</span>
            <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} style={{
              fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink)',
              background: 'rgba(255,255,255,0.7)', border: '1px solid var(--hairline)',
              borderRadius: 8, padding: '5px 10px', outline: 'none',
            }} />
          </div>

          <button onClick={() => PrayUpPWA.sendSampleNotification()} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '15px 16px',
            width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, background: 'rgba(201,162,39,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon.Sparkle size={16} c="var(--gold-dim)" /></div>
            <span style={{ flex: 1, fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--ink)' }}>Send a sample notification</span>
            <Icon.Arrow dir="right" size={14} c="var(--ink-faint)" />
          </button>
        </div>

        {(pwa.installable || pwa.standalone) && (
          <div style={{ marginBottom: 24 }}>
            <SectionTitle>Install</SectionTitle>
            <div style={{
              background: 'linear-gradient(160deg, rgba(232,211,138,0.35) 0%, rgba(255,251,239,0.6) 100%)',
              border: '1px solid rgba(201,162,39,0.3)',
              borderRadius: 'var(--r-lg)', padding: '18px 18px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: 'linear-gradient(180deg, #E8D38A 0%, #C9A227 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#1A1408', flexShrink: 0,
                boxShadow: '0 4px 12px rgba(201,162,39,0.35)',
              }}><Icon.Plus size={20} c="#1A1408" /></div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'var(--serif-display)', fontSize: 17, fontWeight: 500, margin: '0 0 2px', letterSpacing: '-0.01em' }}>
                  {pwa.standalone ? 'Installed' : 'Add to Home Screen'}
                </p>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-muted)', margin: 0, lineHeight: 1.4 }}>
                  {pwa.standalone ? "You're using Pray Up as an app." : 'For a one-tap sacred pause.'}
                </p>
              </div>
              {!pwa.standalone && (
                <button onClick={() => PrayUpPWA.promptInstall()} style={{
                  fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
                  padding: '8px 14px', borderRadius: 9999,
                  background: 'var(--ink)', color: 'var(--cream)', border: 'none', cursor: 'pointer',
                }}>Install</button>
              )}
            </div>
          </div>
        )}

        <SettingsGroup title="Appearance">
          <SettingsRow icon={<DotIcon c="#F7F1E5" />} label="Theme" value="Cream" />
          <SettingsRow icon={<DotIcon c="#C9A227" />} label="Accent" value="Warm gold" isLast />
        </SettingsGroup>

        <SettingsGroup title="Account">
          <SettingsRow label="Privacy & data" />
          <SettingsRow label="Subscription" value="Pray Up+" />
          <SettingsRow label="Help & feedback" />
          <SettingsRow label="Sign out" valueColor="#C99A8D" isLast />
        </SettingsGroup>

        <p style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13,
          color: 'var(--ink-faint)', textAlign: 'center', margin: '28px 0 0',
        }}>"In quietness and trust is your strength." — Isaiah 30:15</p>
      </div>
      <TabBar active="settings" />
    </div>
  );
}
