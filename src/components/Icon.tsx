import type { CSSProperties } from 'react';

type Common = { size?: number; c?: string };

export const Icon = {
  Pray: ({ size = 24, c = 'currentColor' }: Common) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2.5c-.6 1-1 2.2-1 3.6V11l-3 1.5v6.5c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-6.5L12 11V6.1c0-1.4-.4-2.6-1-3.6" />
      <path d="M10 2.5v8M14 2.5v8" />
    </svg>
  ),
  Sparkle: ({ size = 20, c = 'currentColor' }: Common) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </svg>
  ),
  Book: ({ size = 22, c = 'currentColor' }: Common) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H12v17H5.5A1.5 1.5 0 0 1 4 18.5v-14Z" />
      <path d="M20 4.5A1.5 1.5 0 0 0 18.5 3H12v17h6.5a1.5 1.5 0 0 0 1.5-1.5v-14Z" />
      <path d="M12 3v17" />
    </svg>
  ),
  Home: ({ size = 22, c = 'currentColor', filled = false }: Common & { filled?: boolean }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? c : 'none'} stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8.5Z" />
    </svg>
  ),
  Insights: ({ size = 22, c = 'currentColor' }: Common) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V5M4 19h16M8 16V11M12 16V8M16 16v-6" />
    </svg>
  ),
  Settings: ({ size = 22, c = 'currentColor' }: Common) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  ),
  Flame: ({ size = 18, c = 'currentColor' }: Common) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={c} stroke="none">
      <path d="M12 2c.3 2.2-1 3.4-2.2 4.8C8.4 8.4 7 10.4 7 13c0 3.3 2.7 6 5 6s5-2.7 5-6c0-1.6-.6-2.7-1.4-3.6-.4.7-.9 1.1-1.7 1.1-.6 0-1.2-.3-1.2-1.1 0-1 .6-1.6.6-3.3 0-1.5-.8-3-1.3-4.1Z" />
    </svg>
  ),
  Bell: ({ size = 20, c = 'currentColor' }: Common) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2.5h-15L6 16Z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </svg>
  ),
  Check: ({ size = 18, c = 'currentColor', stroke = 2 }: Common & { stroke?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5 10 17l9-10" />
    </svg>
  ),
  Arrow: ({ size = 18, c = 'currentColor', dir = 'right' }: Common & { dir?: 'left' | 'right' | 'up' | 'down' }) => {
    const rot = { right: 0, left: 180, up: -90, down: 90 }[dir];
    const style: CSSProperties = { transform: `rotate(${rot}deg)` };
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    );
  },
  Close: ({ size = 20, c = 'currentColor' }: Common) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  Heart: ({ size = 20, c = 'currentColor', filled = false }: Common & { filled?: boolean }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? c : 'none'} stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />
    </svg>
  ),
  Plus: ({ size = 18, c = 'currentColor' }: Common) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
};
