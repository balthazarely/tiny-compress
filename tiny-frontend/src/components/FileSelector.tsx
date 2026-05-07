import { useState, useEffect } from "react";

interface FileSelectorProps {
  selectedFile: File | null;
  format: string;
  quality: number;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFormatChange: (format: string) => void;
  onQualityChange: (quality: number) => void;
  onClearFile?: () => void;
}

export function FileSelector({
  selectedFile,
  format,
  quality,
  onFileChange,
  onFormatChange,
  onQualityChange,
  onClearFile,
}: FileSelectorProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  return (
    <div className="space-y-4">
      {/* File Input */}
      <div>
        <label className="block text-xs font-bold mb-2">
          Select Image or Drop Image Here:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{
            backgroundColor: "#ffffff",
            border: "2px solid",
            borderColor: "#808080 #dfdfdf",
            padding: "4px",
            width: "100%",
            boxSizing: "border-box",
            cursor: "pointer",
          }}
        />
      </div>

      {selectedFile && (
        <div
          style={{
            backgroundColor: "#dfdfdf",
            border: "1px solid",
            borderColor: "#808080 #dfdfdf",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
            )}
            <span className="text-xs">✓ {selectedFile.name}</span>
          </div>
          <button
            onClick={onClearFile}
            style={{
              backgroundColor: "#c0c0c0",
              border: "1px solid",
              borderColor: "#ffffff #808080",
              padding: "2px 6px",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              color: "#000000",
              minWidth: "24px",
              textAlign: "center",
            }}
          >
            ×
          </button>
        </div>
      )}

      {selectedFile && (
        <>
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
            {/* Quality Slider */}
            <div style={{ flex: "0 0 70%" }}>
              <label className="block text-xs font-bold mb-1">
                Quality: {quality}%
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => onQualityChange(Number(e.target.value))}
                style={{
                  width: "100%",
                  cursor: "pointer",
                }}
              />
            </div>

            {/* Format Dropdown */}
            <div style={{ flex: "0 0 30%" }}>
              <label className="block text-xs font-bold mb-1">Format:</label>
              <select
                value={format}
                onChange={(e) => onFormatChange(e.target.value)}
                style={{
                  backgroundColor: "#ffffff",
                  border: "2px solid",
                  borderColor: "#808080 #dfdfdf",
                  padding: "4px",
                  width: "100%",
                  boxSizing: "border-box",
                  fontSize: "12px",
                }}
              >
                <option value="webp">WebP</option>
                <option value="avif">AVIF</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
