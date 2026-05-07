import type { ReactNode } from "react";
import closeBtn from "../assets/close-btn.png";
import minBtn from "../assets/min-button.png";

interface Window95Props {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  padding?: "p-0" | "p-1" | "p-4";
  icon?: string;
}

export function Window95({ title, children, onClose, padding = "p-4", icon }: Window95Props) {
  return (
    <div
      style={{
        backgroundColor: "#c0c0c0",
        border: "2px solid",
        borderColor: "#dfdfdf #808080",
        boxShadow: "inset 1px 1px #ffffff, inset -1px -1px #808080",
        minWidth: 0,
      }}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-2 py-1"
        style={{
          background: "linear-gradient(90deg, #000080 0%, #1084d7 100%)",
          color: "#ffffff",
          height: "20px",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <div className="flex items-center gap-1 min-w-0">
          {icon && <span style={{ fontSize: "12px", flexShrink: 0 }}>{icon}</span>}
          <span className="text-xs font-bold truncate">{title}</span>
        </div>
        <div className="flex flex-shrink-0" style={{ marginRight: "2px", gap: "calc(var(--spacing) * 0.2)" }}>
          <button
            style={{
              width: "34px",
              height: "14px",
              backgroundColor: "transparent",
              border: "none",
              padding: "0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={minBtn} alt="Minimize/Maximize" style={{ width: "34px", height: "14px", objectFit: "contain" }} />
          </button>
          <button
            onClick={onClose}
            style={{
              width: "16px",
              height: "14px",
              backgroundColor: "transparent",
              border: "none",
              padding: "0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={closeBtn} alt="Close" style={{ width: "16px", height: "14px", objectFit: "contain" }} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={padding}>{children}</div>
    </div>
  );
}
