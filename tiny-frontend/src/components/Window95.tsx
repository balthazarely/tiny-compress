import type { ReactNode } from "react";

interface Window95Props {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  padding?: "p-0" | "p-1" | "p-4";
}

export function Window95({ title, children, onClose, padding = "p-4" }: Window95Props) {
  return (
    <div
      style={{
        backgroundColor: "#c0c0c0",
        border: "2px solid",
        borderColor: "#dfdfdf #808080",
        boxShadow: "inset 1px 1px #ffffff, inset -1px -1px #808080",
      }}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-2 py-1"
        style={{
          background: "linear-gradient(90deg, #000080 0%, #1084d7 100%)",
          color: "#ffffff",
          height: "20px",
        }}
      >
        <span className="text-xs font-bold">{title}</span>
        <div className="flex gap-1" style={{ marginRight: "2px" }}>
          <button
            style={{
              width: "16px",
              height: "14px",
              backgroundColor: "#c0c0c0",
              border: "1px solid",
              borderColor: "#dfdfdf #808080 #808080 #dfdfdf",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: "bold",
              padding: "0",
              color: "#000000",
              cursor: "pointer",
            }}
          >
            −
          </button>
          <button
            style={{
              width: "16px",
              height: "14px",
              backgroundColor: "#c0c0c0",
              border: "1px solid",
              borderColor: "#dfdfdf #808080 #808080 #dfdfdf",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: "bold",
              padding: "0",
              color: "#000000",
              cursor: "pointer",
            }}
          >
            □
          </button>
          <button
            onClick={onClose}
            style={{
              width: "16px",
              height: "14px",
              backgroundColor: "#c0c0c0",
              border: "1px solid",
              borderColor: "#dfdfdf #808080 #808080 #dfdfdf",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: "bold",
              padding: "0",
              color: "#000000",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={padding}>{children}</div>
    </div>
  );
}
