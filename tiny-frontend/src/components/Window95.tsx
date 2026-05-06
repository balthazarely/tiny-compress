import type { ReactNode } from "react";

interface Window95Props {
  title: string;
  children: ReactNode;
}

export function Window95({ title, children }: Window95Props) {
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
        <div className="flex gap-0">
          <button
            className="w-5 h-5 flex items-center justify-center"
            style={{
              backgroundColor: "#c0c0c0",
              border: "1px solid",
              borderColor: "#dfdfdf #808080",
              fontSize: "10px",
            }}
          >
            _
          </button>
          <button
            className="w-5 h-5 flex items-center justify-center"
            style={{
              backgroundColor: "#c0c0c0",
              border: "1px solid",
              borderColor: "#dfdfdf #808080",
              fontSize: "10px",
            }}
          >
            □
          </button>
          <button
            className="w-5 h-5 flex items-center justify-center"
            style={{
              backgroundColor: "#c0c0c0",
              border: "1px solid",
              borderColor: "#dfdfdf #808080",
              fontSize: "10px",
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">{children}</div>
    </div>
  );
}
