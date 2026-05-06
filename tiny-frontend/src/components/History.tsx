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
}

export function History({ items, onSelectImage }: HistoryProps) {
  if (items.length === 0) {
    return (
      <div style={{ padding: "12px", textAlign: "center" }}>
        <div className="text-xs">No recent images</div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#dfdfdf",
        border: "1px solid",
        borderColor: "#808080 #dfdfdf",
        padding: "4px",
      }}
    >
      <div className="text-xs font-bold mb-3">Recent Images:</div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {items.map((item) => (
          <div key={item.id} style={{ textAlign: "center" }}>
            <img
              src={`data:image/jpeg;base64,${item.file}`}
              alt={item.filename}
              onClick={() => onSelectImage?.(item)}
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                border: "1px solid #808080",
                cursor: "pointer",
              }}
              title={item.filename}
            />
            <div className="text-xs mt-1" style={{ maxWidth: "60px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.filename}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
