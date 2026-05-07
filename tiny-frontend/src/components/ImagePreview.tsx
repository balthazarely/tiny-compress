import { useState, useEffect } from "react";
import closeBtn from "../assets/close-btn.png";

interface ImagePreviewProps {
  fileType: string;
  file: string;
  originalBuffer?: File | null;
}

export function ImagePreview({ fileType, file, originalBuffer }: ImagePreviewProps) {
  const [imageHovered, setImageHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [sliderPos, setSliderPos] = useState(50);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (originalBuffer) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalUrl(e.target?.result as string);
      };
      reader.readAsDataURL(originalBuffer);
    }
  }, [originalBuffer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging || !originalUrl) {
      if (!imageHovered) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    } else if (originalUrl) {
      const rect = e.currentTarget.getBoundingClientRect();
      const newPos = ((e.clientX - rect.left) / rect.width) * 100;
      setSliderPos(Math.max(0, Math.min(100, newPos)));
    }
  };

  return (
    <div
      style={{
        overflow: "hidden",
        marginBottom: "8px",
        backgroundColor: "#ffffff",
        border: "2px solid",
        borderColor: "#808080 #dfdfdf",
        padding: "4px",
        cursor: originalUrl ? "col-resize" : imageHovered ? "crosshair" : "zoom-in",
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
      onMouseEnter={() => !originalUrl && setImageHovered(true)}
      onMouseLeave={() => {
        !originalUrl && setImageHovered(false);
        setMousePos({ x: 0, y: 0 });
        setIsDragging(false);
      }}
      onMouseMove={handleMouseMove}
      onMouseDown={() => originalUrl && setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
    >
      {originalUrl ? (
        <>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {/* Original Image */}
            <img
              src={originalUrl}
              alt="Original"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />

            {/* Compressed Image Overlay with Clip */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
              }}
            >
              <img
                src={`data:${fileType};base64,${file}`}
                alt="Compressed"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Slider Handle */}
            <div
              style={{
                position: "absolute",
                left: `${sliderPos}%`,
                top: 0,
                height: "100%",
                width: "2px",
                backgroundColor: "#ffffff",
                boxShadow: "0 0 4px rgba(0,0,0,0.5)",
                cursor: "col-resize",
                transform: "translateX(-50%)",
                zIndex: 10,
              }}
            />

            {/* Labels */}
            <div
              style={{
                position: "absolute",
                bottom: "4px",
                left: "4px",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "#ffffff",
                padding: "2px 4px",
                fontSize: "10px",
                borderRadius: "2px",
                pointerEvents: "none",
              }}
            >
              Compressed
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "4px",
                right: "4px",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "#ffffff",
                padding: "2px 4px",
                fontSize: "10px",
                borderRadius: "2px",
                pointerEvents: "none",
              }}
            >
              Original
            </div>

            {/* Expand Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                backgroundColor: "#c0c0c0",
                border: "1px solid",
                borderColor: "#dfdfdf #808080 #808080 #dfdfdf",
                padding: "4px 8px",
                fontSize: "11px",
                cursor: "pointer",
                zIndex: 11,
              }}
            >
              ⛶ Expand
            </button>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
              onClick={() => setIsModalOpen(false)}
            >
              <div
                style={{
                  backgroundColor: "#c0c0c0",
                  border: "2px solid",
                  borderColor: "#dfdfdf #808080",
                  boxShadow: "inset 1px 1px #ffffff, inset -1px -1px #808080",
                  width: "90%",
                  maxWidth: "800px",
                  maxHeight: "90vh",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Title Bar */}
                <div
                  style={{
                    background: "linear-gradient(90deg, #000080 0%, #1084d7 100%)",
                    color: "#ffffff",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "2px 4px",
                  }}
                >
                  <span className="text-xs font-bold">Image Comparison</span>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      padding: "0",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img src={closeBtn} alt="Close" style={{ width: "16px", height: "14px", objectFit: "contain" }} />
                  </button>
                </div>

                {/* Modal Content */}
                <div
                  style={{
                    flex: 1,
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseDown={() => originalUrl && setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                >
                  {/* Original Image */}
                  <img
                    src={originalUrl}
                    alt="Original"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />

                  {/* Compressed Image Overlay with Clip */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                      clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                    }}
                  >
                    <img
                      src={`data:${fileType};base64,${file}`}
                      alt="Compressed"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  {/* Slider Handle */}
                  <div
                    style={{
                      position: "absolute",
                      left: `${sliderPos}%`,
                      top: 0,
                      height: "100%",
                      width: "3px",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 0 4px rgba(0,0,0,0.5)",
                      cursor: "col-resize",
                      transform: "translateX(-50%)",
                      zIndex: 10,
                    }}
                  />

                  {/* Labels */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      left: "8px",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      color: "#ffffff",
                      padding: "4px 8px",
                      fontSize: "12px",
                      borderRadius: "2px",
                      pointerEvents: "none",
                    }}
                  >
                    Compressed
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "8px",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      color: "#ffffff",
                      padding: "4px 8px",
                      fontSize: "12px",
                      borderRadius: "2px",
                      pointerEvents: "none",
                    }}
                  >
                    Original
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <img
          src={`data:${fileType};base64,${file}`}
          alt="Compressed"
          style={{
            width: "100%",
            maxHeight: "200px",
            objectFit: "contain",
            transform: imageHovered
              ? `scale(6) translate(${(50 - mousePos.x) * 0.015}px, ${
                  (50 - mousePos.y) * 0.015
                }px)`
              : "scale(1)",
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
            transition: imageHovered ? "none" : "none",
          }}
        />
      )}
    </div>
  );
}
