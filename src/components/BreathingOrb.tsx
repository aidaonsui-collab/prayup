type Props = {
  size?: number;
  color?: string;
  deep?: string;
  running?: boolean;
  cycleMs?: number;
};

export function BreathingOrb({
  size = 220,
  color = '#E8D38A',
  deep = '#C9A227',
  running = true,
  cycleMs = 8000,
}: Props) {
  const dur = `${cycleMs}ms`;
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', inset: -40, borderRadius: '50%',
        background: `radial-gradient(circle, ${color}22 0%, transparent 65%)`,
        animation: running ? `pu-breathe-halo ${dur} ease-in-out infinite` : undefined,
      }} />
      <div style={{
        position: 'absolute', inset: -12, borderRadius: '50%',
        background: `radial-gradient(circle, ${color}33 0%, ${color}11 50%, transparent 75%)`,
        animation: running ? `pu-breathe-mid ${dur} ease-in-out infinite` : undefined,
      }} />
      <div style={{
        width: size * 0.7, height: size * 0.7, borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, #FFF6D8 0%, ${color} 45%, ${deep} 100%)`,
        boxShadow: `0 0 60px ${color}55, inset -10px -20px 40px ${deep}66, inset 8px 12px 30px #FFFFFF66`,
        animation: running ? `pu-breathe-core ${dur} ease-in-out infinite` : undefined,
      }} />
    </div>
  );
}
