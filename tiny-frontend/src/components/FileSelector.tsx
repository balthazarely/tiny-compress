interface FileSelectorProps {
  selectedFile: File | null;
  format: string;
  quality: number;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFormatChange: (format: string) => void;
  onQualityChange: (quality: number) => void;
}

export function FileSelector({
  selectedFile,
  format,
  quality,
  onFileChange,
  onFormatChange,
  onQualityChange,
}: FileSelectorProps) {
  return (
    <div className="space-y-4">
      {/* File Input */}
      <div>
        <label className="block text-xs font-bold mb-2">Select Image:</label>
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
          }}
        >
          <span className="text-xs">✓ {selectedFile.name}</span>
        </div>
      )}

      {selectedFile && (
        <>
          {/* Format Dropdown */}
          <div>
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

          {/* Quality Slider */}
          <div>
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
        </>
      )}
    </div>
  );
}
