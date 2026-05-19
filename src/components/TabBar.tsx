import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';

type Active = 'home' | 'dashboard' | 'settings';

const items: { id: Active; label: string; icon: typeof Icon.Home; path: string }[] = [
  { id: 'home',      label: 'Today',    icon: Icon.Home,     path: '/home' },
  { id: 'dashboard', label: 'Journey',  icon: Icon.Insights, path: '/dashboard' },
  { id: 'settings',  label: 'Settings', icon: Icon.Settings, path: '/settings' },
];

export function TabBar({ active }: { active: Active }) {
  const navigate = useNavigate();
  return (
    <div style={{
      position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      background: 'rgba(255, 252, 244, 0.78)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(15,23,42,0.08)', borderRadius: 9999,
      padding: 6, display: 'flex', gap: 2,
      boxShadow: '0 16px 40px rgba(15,23,42,0.12), 0 4px 12px rgba(15,23,42,0.06)',
      zIndex: 10,
    }}>
      {items.map((it) => {
        const I = it.icon;
        const isActive = active === it.id;
        return (
          <button
            key={it.id}
            onClick={() => navigate(it.path)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: isActive ? '10px 18px' : '10px 14px',
              borderRadius: 9999,
              background: isActive ? 'var(--ink)' : 'transparent',
              color: isActive ? 'var(--cream)' : 'var(--ink-muted)',
              border: 'none', cursor: 'pointer',
              fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
              transition: 'all 200ms ease',
            }}
          >
            <I size={18} c="currentColor" />
            {isActive && <span>{it.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
