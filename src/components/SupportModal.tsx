import { useState } from "react";
import { CheckIcon, CopyIcon, HeartIcon, WarningIcon } from "./Icons";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  t: Record<string, string>;
  flash: (msg: string) => void;
};

const CRYPTO_LIST = [
  {
    id: "btc",
    symbol: "₿",
    name: "Bitcoin",
    network: "BTC",
    address: "38vkjFo9PPCujXnSa995CUvzV1yoPFcAHP",
    color: "#F7931A",
  },
  {
    id: "eth",
    symbol: "Ξ",
    name: "Ethereum",
    network: "ETH / ERC-20",
    address: "0xbd9ab78bbe70d5ec9b68b14e701bf79a9ee91945",
    color: "#627EEA",
  },
  {
    id: "usdt",
    symbol: "₮",
    name: "USDT",
    network: "TRC-20",
    address: "TU5N2R7xut1ig9kPSR866kWEwNEeM8yaYc",
    color: "#26A17B",
  },
];

export default function SupportModal({ isOpen, onClose, t, flash }: Props) {
  const [tab, setTab] = useState<"crypto" | "fiat">("crypto");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyAddress = async (id: string, address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedId(id);
    flash(t.addressCopied);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) onClose();
      }}
    >
      <section className="modal support-modal" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label={t.close}>
          ×
        </button>

        <div className="support-header">
          <span className="support-badge">
            <HeartIcon />
            {t.supportBtn}
          </span>
          <h2>{t.supportTitle}</h2>
          <p className="modal-sub">{t.supportSub}</p>
        </div>

        <div className="export-tabs support-tabs">
          <button
            className={tab === "crypto" ? "active" : ""}
            onClick={() => setTab("crypto")}
          >
            {t.cryptoTab}
          </button>
          <button
            className={tab === "fiat" ? "active" : ""}
            onClick={() => setTab("fiat")}
          >
            {t.fiatTab}
          </button>
        </div>

        {tab === "crypto" && (
          <div className="crypto-section">
            <div className="crypto-list">
              {CRYPTO_LIST.map((item) => (
                <div key={item.id} className="crypto-card">
                  <div className="crypto-info">
                    <span
                      className="crypto-symbol"
                      style={{ color: item.color, borderColor: item.color }}
                    >
                      {item.symbol}
                    </span>
                    <div>
                      <b className="crypto-name">{item.name}</b>
                      <span className="crypto-net">{item.network}</span>
                    </div>
                  </div>

                  <div className="crypto-address-wrap">
                    <input
                      type="text"
                      readOnly
                      value={item.address}
                      className="crypto-address-input"
                      dir="ltr"
                    />
                    <button
                      className="crypto-copy-btn"
                      onClick={() => copyAddress(item.id, item.address)}
                      title={t.copy}
                    >
                      {copiedId === item.id ? (
                        <>
                          <CheckIcon />
                          <span>{t.copied}</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon />
                          <span>{t.copy}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="crypto-warning">
              <WarningIcon />
              <span>{t.cryptoWarning}</span>
            </div>
          </div>
        )}

        {tab === "fiat" && (
          <div className="fiat-section">
            <div className="fiat-card">
              <div className="fiat-icon">🏦</div>
              <h3>{t.bankTransferTitle}</h3>
              <p>{t.bankTransferDesc}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
