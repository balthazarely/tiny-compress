import { Button95 } from "./Button95";
import { ImagePreview } from "./ImagePreview";

interface ResultDisplayProps {
  result: {
    originalSize: number;
    compressedSize: number;
    file: string;
    fileType: string;
  };
  onDownloadClick: () => void;
  downloadPressed: boolean;
  onDownloadMouseDown: () => void;
  onDownloadMouseUp: () => void;
  onDownloadMouseLeave: () => void;
}

export function ResultDisplay({
  result,
  onDownloadClick,
  downloadPressed,
  onDownloadMouseDown,
  onDownloadMouseUp,
  onDownloadMouseLeave,
}: ResultDisplayProps) {
  const reduction = (
    ((result.originalSize - result.compressedSize) / result.originalSize) *
    100
  ).toFixed(0);

  return (
    <div
      style={{
        backgroundColor: "#dfdfdf",
        border: "1px solid",
        borderColor: "#808080 #dfdfdf",
        padding: "4px",
      }}
    >
      <div className="text-xs font-bold mb-2">Compression Complete!</div>

      <ImagePreview fileType={result.fileType} file={result.file} />

      <div className="text-xs space-y-1 mb-4">
        <div>Original: {(result.originalSize / 1024).toFixed(1)} KB</div>
        <div>Compressed: {(result.compressedSize / 1024).toFixed(1)} KB</div>
        <div>Saved: {reduction}%</div>
      </div>

      <Button95
        onClick={onDownloadClick}
        onMouseDown={onDownloadMouseDown}
        onMouseUp={onDownloadMouseUp}
        onMouseLeave={onDownloadMouseLeave}
        isPressed={downloadPressed}
      >
        Download
      </Button95>
    </div>
  );
}
