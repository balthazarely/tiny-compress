import { useState } from "react";
import { useCompress } from "./hooks/useApi";
import { Window95 } from "./components/Window95";
import { Button95 } from "./components/Button95";
import { FileSelector } from "./components/FileSelector";
import { ResultDisplay } from "./components/ResultDisplay";

function App() {
  const { compress, isLoading } = useCompress();
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

  async function handleCompressor() {
    if (!selectedFile) {
      alert("Please select an image");
      return;
    }
    const response = await compress(selectedFile, format, quality);
    setResult(response);
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
    a.download = `compressed.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      className="min-h-screen bg-cyan-400"
      style={{ fontFamily: "MS Sans Serif, Arial, sans-serif" }}
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <Window95 title="Image Compressor">
            <div className="space-y-4">
              {/* File Selector Component */}
              <FileSelector
                selectedFile={selectedFile}
                format={format}
                quality={quality}
                onFileChange={handleFileChange}
                onFormatChange={setFormat}
                onQualityChange={setQuality}
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
              {result && (
                <ResultDisplay
                  result={result}
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
      </div>
    </div>
  );
}

export default App;
