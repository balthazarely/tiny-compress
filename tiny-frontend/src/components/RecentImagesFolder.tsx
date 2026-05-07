import docFolder from "../assets/doc-folder.png";

interface RecentImagesFolderProps {
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
}

export function RecentImagesFolder({
  isSelected,
  onSelect,
  onDoubleClick,
}: RecentImagesFolderProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={() => {
        onDoubleClick();
      }}
    >
      <img
        src={docFolder}
        alt="Recent Images"
        style={{
          width: "48px",
          height: "48px",
          backgroundColor: isSelected ? "#000080" : "transparent",
          borderRadius: "4px",
        }}
      />
      <span
        className="text-xs"
        style={{
          color: "#ffffff",
          backgroundColor: isSelected ? "#000080" : "transparent",
          padding: "2px 4px",
          borderRadius: "2px",
        }}
      >
        Recent Images
      </span>
    </div>
  );
}
