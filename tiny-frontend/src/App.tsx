import { useEffect, useState } from "react";
import { useCompress } from "./hooks/useApi";
import { Window95 } from "./components/Window95";
import { Button95 } from "./components/Button95";
import { FileSelector } from "./components/FileSelector";
import { ResultDisplay } from "./components/ResultDisplay";
import { History } from "./components/History";
import { useHistory } from "./hooks/useHistory";
import type { HistoryItem } from "./components/History";
import { getOrCreateUserId } from "./utils/userId";

function App() {
  const [userId] = useState(getOrCreateUserId());
  const { compress, isLoading } = useCompress(userId);
  const { getHistory, history, isLoading: historyIsLoading } = useHistory(userId);

  useEffect(() => {
    getHistory();
  }, [userId]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [format, setFormat] = useState("webp");
  const [quality, setQuality] = useState(75);
  const [compressPressed, setCompressPressed] = useState(false);
  const [downloadPressed, setDownloadPressed] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  }

  function handleClearFile() {
    setSelectedFile(null);
  }

  async function handleCompressor() {
    if (!selectedFile) {
      alert("Please select an image");
      return;
    }
    const response = await compress(selectedFile, format, quality);
    setResult(response);
    getHistory();
  }

  function handleDownload() {
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
  }

  function handleReset() {
    setSelectedFile(null);
    setResult(null);
    setFormat("webp");
    setQuality(75);
    setCompressPressed(false);
    setDownloadPressed(false);
  }

  function handleSelectFromHistory(item: HistoryItem) {
    const binary = atob(item.file);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes]);
    const file = new File([blob], item.filename);
    setSelectedFile(file);
    setResult(null);
  }

  return (
    <div
      className="h-screen overflow-hidden"
      style={{
        fontFamily: "MS Sans Serif, Arial, sans-serif",
        background: "#268786",
      }}
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

        {/* Recent Images Desktop Icons */}
        <div className="w-full max-w-md">
          <History
            items={history}
            onSelectImage={handleSelectFromHistory}
            isLoading={historyIsLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
