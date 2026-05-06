import type { ReactNode } from "react";

interface Button95Props {
  onClick?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  disabled?: boolean;
  isPressed?: boolean;
  children: ReactNode;
}

export function Button95({
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  disabled = false,
  isPressed = false,
  children,
}: Button95Props) {
  return (
    <button
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
      style={{
        backgroundColor: "#c0c0c0",
        color: "#000000",
        border: "2px solid",
        borderStyle: "solid",
        borderTopColor: isPressed ? "#808080" : "#ffffff",
        borderLeftColor: isPressed ? "#808080" : "#ffffff",
        borderRightColor: isPressed ? "#ffffff" : "#808080",
        borderBottomColor: isPressed ? "#ffffff" : "#808080",
        padding: "4px 12px",
        fontSize: "11px",
        fontWeight: "normal",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        userSelect: "none",
        outline: "none",
        width: "100%",
      }}
    >
      {children}
    </button>
  );
}
