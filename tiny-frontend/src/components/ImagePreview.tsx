import { useState } from "react";

interface ImagePreviewProps {
  fileType: string;
  file: string;
}

export function ImagePreview({ fileType, file }: ImagePreviewProps) {
  const [imageHovered, setImageHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <div
      style={{
        overflow: "hidden",
        marginBottom: "8px",
        backgroundColor: "#ffffff",
        border: "2px solid",
        borderColor: "#808080 #dfdfdf",
        padding: "4px",
        cursor: imageHovered ? "crosshair" : "zoom-in",
        height: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={() => setImageHovered(true)}
      onMouseLeave={() => {
        setImageHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onMouseMove={(e) => {
        if (!imageHovered) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
      }}
    >
      <img
        src={`data:${fileType};base64,${file}`}
        alt="Compressed"
        style={{
          width: "100%",
          maxHeight: "300px",
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
    </div>
  );
}
