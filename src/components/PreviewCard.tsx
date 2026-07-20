import { contrastRatio, idealText } from "../utils/color";
import { ArrowIcon, CheckIcon } from "./Icons";

export default function PreviewCard({ colors, t }: { colors: string[]; t: Record<string, string> }) {
  const bg = colors[5], ink = colors[0], accent = colors[2], button = colors[1];
  const whiteRatio = contrastRatio(accent, "#FFFFFF");
  const blackRatio = contrastRatio(accent, "#111111");
  return <section className="preview-grid">
    <div className="preview-card" style={{ background: bg, color: ink }}>
      <div className="preview-nav"><span className="preview-mark" style={{ background: accent }} /><span>FORM / 08</span><span>•••</span></div>
      <div className="preview-copy">
        <span className="micro-label">{t.livePreview}</span>
        <h3>{t.previewTitle}</h3>
        <p>{t.previewText}</p>
        <button style={{ background: button, color: idealText(button) }}>{t.previewCta}<ArrowIcon /></button>
      </div>
      <div className="preview-shape" style={{ background: accent }}><span style={{ background: colors[3] }} /></div>
    </div>
    <div className="contrast-card">
      <div className="section-kicker">{t.contrast}</div>
      <div className="contrast-sample" style={{ background: accent, color: idealText(accent) }}>Aa</div>
      <div className="ratio-row"><span><i className="dot white" />{t.white}</span><strong>{whiteRatio.toFixed(2)}:1</strong><em className={whiteRatio >= 4.5 ? "pass" : "fail"}>{whiteRatio >= 4.5 ? <CheckIcon /> : "×"}</em></div>
      <div className="ratio-row"><span><i className="dot black" />{t.black}</span><strong>{blackRatio.toFixed(2)}:1</strong><em className={blackRatio >= 4.5 ? "pass" : "fail"}>{blackRatio >= 4.5 ? <CheckIcon /> : "×"}</em></div>
      <div className={`contrast-verdict ${Math.max(whiteRatio, blackRatio) >= 4.5 ? "pass" : "fail"}`}>{Math.max(whiteRatio, blackRatio) >= 4.5 ? t.contrastPass : t.contrastFail}</div>
    </div>
  </section>;
}
