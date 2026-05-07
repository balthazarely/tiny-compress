import { useState } from "react";
import loaderGif from "../assets/loader.gif";

export interface HistoryItem {
  id: number;
  filename: string;
  originalSize: number;
  compressedSize: number;
  format: string;
  quality: number;
  createdAt: string;
  file: string;
}

interface HistoryProps {
  items: HistoryItem[];
  onSelectImage?: (item: HistoryItem) => void;
  isLoading?: boolean;
}

export function History({ items, onSelectImage, isLoading = false }: HistoryProps) {
  const safeItems = Array.isArray(items) ? items : [];
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px" }}>
        <div style={{ color: "#ffffff", fontSize: "12px", fontWeight: "bold", marginBottom: "16px", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
          Loading...
        </div>
        <img src={loaderGif} alt="Loading" style={{ width: "40px", height: "40px" }} />
      </div>
    );
  }

  return (
    <div
      style={{ display: "flex", gap: "16px", flexWrap: "wrap", padding: "8px", justifyContent: "center" }}
      onClick={() => setSelectedId(null)}
    >
      {safeItems.map((item) => {
        const truncatedName = item.filename.length > 12 ? item.filename.substring(0, 12) + "..." : item.filename;
        const isSelected = selectedId === item.id;
        return (
          <div
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedId(item.id);
            }}
            onDoubleClick={() => onSelectImage?.(item)}
            style={{
              textAlign: "center",
              cursor: "pointer",
              userSelect: "none",
              padding: "4px",
              borderRadius: "2px",
              backgroundColor: isSelected ? "#000080" : "transparent",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "4px",
              }}
            >
              <img
                src={`data:image/jpeg;base64,${item.file}`}
                alt={item.filename}
                style={{
                  width: "48px",
                  height: "48px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                title={item.filename}
              />
            </div>
            <div
              className="text-xs"
              style={{
                maxWidth: "64px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: isSelected ? "#ffffff" : "#000000",
              }}
            >
              {truncatedName}
            </div>
          </div>
        );
      })}
    </div>
  );
}
