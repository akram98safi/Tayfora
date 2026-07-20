export default function ColorOrb({ colors }: { colors: string[] }) {
  const stops = colors.map((c, i) => `${c} ${Math.round(i * 100 / colors.length)}% ${Math.round((i + 1) * 100 / colors.length)}%`).join(", ");
  return (
    <div className="orb-scene" aria-hidden="true">
      <div className="orb-stage">
        {/* مجموعة تدور حقيقياً في الفضاء ثلاثي الأبعاد */}
        <div className="orb-gyro">
          <span className="orb-ring3d ring-a" style={{ borderColor: colors[2] }} />
          <span className="orb-ring3d ring-b" style={{ borderColor: colors[3] }} />
          <span className="orb-ring3d ring-c" style={{ borderColor: colors[1] }} />
          <span className="orb-sat sat-a" style={{ background: colors[2] }} />
          <span className="orb-sat sat-b" style={{ background: colors[4] }} />
          <span className="orb-sat sat-c" style={{ background: colors[1] }} />
        </div>
        <div className="color-orb" style={{ background: `conic-gradient(from 32deg, ${stops})` }}>
          <div className="orb-shade" />
          <div className="orb-glass" />
        </div>
      </div>
    </div>
  );
}
