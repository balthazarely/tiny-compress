import { useEffect } from "react";
import { Window95 } from "./Window95";
import { History } from "./History";
import type { HistoryItem } from "./History";

interface RecentImagesModalProps {
  isOpen: boolean;
  history: HistoryItem[];
  isLoading: boolean;
  onClose: () => void;
  onSelectImage: (item: HistoryItem) => void;
}

export function RecentImagesModal({
  isOpen,
  history,
  isLoading,
  onClose,
  onSelectImage,
}: RecentImagesModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "90%",
          backgroundColor: "#c0c0c0",
          border: "2px solid",
          borderColor: "#dfdfdf #808080",
          boxShadow: "inset 1px 1px #ffffff, inset -1px -1px #808080",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Window95
          title="Recent Images"
          onClose={onClose}
          icon="📁"
          padding="p-0"
        >
          <div style={{ backgroundColor: "#ffffff", padding: "8px" }}>
            <History
              items={history}
              onSelectImage={onSelectImage}
              isLoading={isLoading}
            />
          </div>
        </Window95>
      </div>
    </div>
  );
}
