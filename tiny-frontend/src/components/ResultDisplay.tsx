import { Button95 } from "./Button95";
import { ImagePreview } from "./ImagePreview";
import loaderGif from "../assets/loader.gif";

interface ResultDisplayProps {
  result: {
    originalSize: number;
    compressedSize: number;
    file: string;
    fileType: string;
  } | null;
  isLoading: boolean;
  onDownloadClick: () => void;
  downloadPressed: boolean;
  onDownloadMouseDown: () => void;
  onDownloadMouseUp: () => void;
  onDownloadMouseLeave: () => void;
}

export function ResultDisplay({
  result,
  isLoading,
  onDownloadClick,
  downloadPressed,
  onDownloadMouseDown,
  onDownloadMouseUp,
  onDownloadMouseLeave,
}: ResultDisplayProps) {
  const reduction = result
    ? (
        ((result.originalSize - result.compressedSize) / result.originalSize) *
        100
      ).toFixed(0)
    : "0";

  return (
    <div
      style={{
        backgroundColor: "#dfdfdf",
        border: "1px solid",
        borderColor: "#808080 #dfdfdf",
        padding: "4px",
      }}
    >
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "32px" }}>
          <div className="text-xs font-bold mb-4">Compressing...</div>
          <img src={loaderGif} alt="Loading" style={{ width: "40px", height: "40px", margin: "0 auto" }} />
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
