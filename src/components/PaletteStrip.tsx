import type { ColorFormat, PaletteColor } from "../types";
import { formatColor, idealText } from "../utils/color";
import { CheckIcon, CopyIcon, LockIcon } from "./Icons";

type Props = {
  colors: PaletteColor[];
  format: ColorFormat;
  copied: number | null;
  labels: Record<string, string>;
  onCopy: (index: number) => void;
  onLock: (index: number) => void;
};

export default function PaletteStrip({ colors, format, copied, labels, onCopy, onLock }: Props) {
  return <div className="palette-strip">
    {colors.map((color, index) => (
      <article className="swatch" key={`${index}-${color.hex}`} style={{ "--swatch": color.hex, "--ink-on": idealText(color.hex), "--delay": `${index * 45}ms` } as React.CSSProperties}>
        <div className="swatch-shine" />
        <div className="swatch-top">
          <span className="swatch-number">0{index + 1}</span>
          <button className={`icon-button swatch-lock ${color.locked ? "is-locked" : ""}`} onClick={() => onLock(index)} aria-label={color.locked ? labels.unlock : labels.lock} title={color.locked ? labels.unlock : labels.lock}>
            <LockIcon open={!color.locked} />
          </button>
        </div>
        <button className="swatch-code" onClick={() => onCopy(index)} aria-label={`${labels.copy} ${formatColor(color.hex, format)}`}>
          <span>{formatColor(color.hex, format)}</span>
          {copied === index ? <CheckIcon /> : <CopyIcon />}
        </button>
      </article>
    ))}
  </div>;
}
