import { useEffect, useState, useRef } from "react";
import { useCompress } from "./hooks/useApi";
import { useHistory } from "./hooks/useHistory";
import { getOrCreateUserId } from "./utils/userId";
import { Window95 } from "./components/Window95";
import { Button95 } from "./components/Button95";
import { FileSelector } from "./components/FileSelector";
import { ResultDisplay } from "./components/ResultDisplay";
import { RecentImagesFolder } from "./components/RecentImagesFolder";
import { RecentImagesModal } from "./components/RecentImagesModal";
import type { HistoryItem } from "./components/History";

function App() {
  // User identification
  const [userId] = useState(getOrCreateUserId());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compression flow state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [format, setFormat] = useState("webp");
  const [quality, setQuality] = useState(75);

  // UI state
  const [compressPressed, setCompressPressed] = useState(false);
  const [downloadPressed, setDownloadPressed] = useState(false);
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [isFolderSelected, setIsFolderSelected] = useState(false);

  // API hooks
  const { compress, isLoading } = useCompress(userId);
  const { getHistory, history, isLoading: historyIsLoading } = useHistory(userId);

  useEffect(() => {
    getHistory();
  }, [userId]);

  // File selection handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setResult(null);
  };

  // Compression handlers
  const handleCompressor = async () => {
    if (!selectedFile) {
      alert("Please select an image");
      return;
    }
    const response = await compress(selectedFile, format, quality);
    setResult(response);
    getHistory();
  };

  const handleDownload = () => {
    if (!result) return;
    const binary = atob(result.file);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: result.fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setFormat("webp");
    setQuality(75);
    setCompressPressed(false);
    setDownloadPressed(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // History handlers
  const decodeBase64ToFile = (base64: string, filename: string): File => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes]);
    return new File([blob], filename);
  };

  const handleSelectFromHistory = (item: HistoryItem) => {
    const file = decodeBase64ToFile(item.file, item.filename);
    setSelectedFile(file);
    setResult(null);
    setIsFolderOpen(false);
    setIsFolderSelected(false);
  };

  return (
    <div
      className="h-screen overflow-hidden"
      style={{
        fontFamily: "MS Sans Serif, Arial, sans-serif",
        background: "#268786",
      }}
      onClick={() => setIsFolderSelected(false)}
    >
      <div className="flex flex-col items-center justify-center overflow-y-auto p-4 gap-4" style={{ height: "100vh" }}>
        {/* Main Compressor Window */}
        <div className="w-full max-w-md">
          <Window95 title="Image Compressor" onClose={handleReset} icon="🖼️">
            <div className="space-y-4">
              {/* File Selector Component */}
              <FileSelector
                selectedFile={selectedFile}
                format={format}
                quality={quality}
                onFileChange={handleFileChange}
                onFormatChange={setFormat}
                onQualityChange={setQuality}
                onClearFile={handleClearFile}
                fileInputRef={fileInputRef}
              />

              {/* Compress Button */}
              <Button95
                onClick={handleCompressor}
                onMouseDown={() => setCompressPressed(true)}
                onMouseUp={() => setCompressPressed(false)}
                onMouseLeave={() => setCompressPressed(false)}
                disabled={!selectedFile || isLoading}
                isPressed={compressPressed}
              >
                {isLoading ? "Compressing..." : "Compress"}
              </Button95>

              {/* Result Display Component */}
              {(isLoading || result) && (
                <ResultDisplay
                  result={result}
                  isLoading={isLoading}
                  originalBuffer={selectedFile}
                  onDownloadClick={handleDownload}
                  downloadPressed={downloadPressed}
                  onDownloadMouseDown={() => setDownloadPressed(true)}
                  onDownloadMouseUp={() => setDownloadPressed(false)}
                  onDownloadMouseLeave={() => setDownloadPressed(false)}
                />
              )}
            </div>
          </Window95>
        </div>

        <RecentImagesFolder
          isSelected={isFolderSelected}
          onSelect={() => setIsFolderSelected(true)}
          onDoubleClick={() => {
            setIsFolderOpen(true);
            setIsFolderSelected(false);
          }}
        />
      </div>

      <RecentImagesModal
        isOpen={isFolderOpen}
        history={history}
        isLoading={historyIsLoading}
        onClose={() => {
          setIsFolderOpen(false);
          setIsFolderSelected(false);
        }}
        onSelectImage={handleSelectFromHistory}
      />
    </div>
  );
}

export default App;
