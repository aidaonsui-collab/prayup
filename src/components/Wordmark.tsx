type Props = { size?: number; color?: string; dot?: string };

export function Wordmark({ size = 28, color = 'var(--ink)', dot = 'var(--gold)' }: Props) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'baseline',
      fontFamily: 'var(--serif-display)',
      fontWeight: 500,
      fontSize: size,
      color,
      letterSpacing: '-0.01em',
      lineHeight: 1,
    }}>
      <span>Pray</span>
      <span style={{
        width: Math.round(size * 0.18),
        height: Math.round(size * 0.18),
        borderRadius: '50%',
        background: dot,
        display: 'inline-block',
        margin: `0 ${Math.round(size * 0.22)}px ${Math.round(size * 0.08)}px`,
      }} />
      <span>Up</span>
    </span>
  );
}
