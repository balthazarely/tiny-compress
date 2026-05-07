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
    <div>
      <div style={{ color: "#ffffff", fontSize: "12px", fontWeight: "bold", marginBottom: "8px", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
        Recent Images:
      </div>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", padding: "8px", justifyContent: "center" }}>
      {safeItems.map((item) => {
        const truncatedName = item.filename.length > 12 ? item.filename.substring(0, 12) + "..." : item.filename;
        return (
          <div
            key={item.id}
            onClick={() => onSelectImage?.(item)}
            style={{
              textAlign: "center",
              cursor: "pointer",
              userSelect: "none",
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
                backgroundColor: "transparent",
                border: "1px solid transparent",
                padding: "2px",
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
                color: "#ffffff",
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              {truncatedName}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
