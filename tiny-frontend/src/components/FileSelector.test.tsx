import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FileSelector } from "./FileSelector";

const defaultProps = {
  selectedFile: null,
  format: "webp",
  quality: 80,
  onFileChange: vi.fn(),
  onFormatChange: vi.fn(),
  onQualityChange: vi.fn(),
};

describe("FileSelector", () => {
  it("renders the file input label", () => {
    render(<FileSelector {...defaultProps} />);
    expect(
      screen.getByText(/Select Image or Drop Image Here/i),
    ).toBeInTheDocument();
  });

  it("does not show preview or controls when no file is selected", () => {
    render(<FileSelector {...defaultProps} />);
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("shows filename, quality slider, and format dropdown when a file is selected", () => {
    const file = new File(["hello"], "photo.png", { type: "image/png" });
    render(<FileSelector {...defaultProps} selectedFile={file} />);

    expect(screen.getByText(/photo\.png/i)).toBeInTheDocument();
    expect(screen.getByRole("slider")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("calls onClearFile when the × button is clicked", () => {
    const file = new File(["hello"], "photo.png", { type: "image/png" });
    const onClearFile = vi.fn();
    render(
      <FileSelector
        {...defaultProps}
        selectedFile={file}
        onClearFile={onClearFile}
      />,
    );

    fireEvent.click(screen.getByText("×"));
    expect(onClearFile).toHaveBeenCalledTimes(1);
  });

  it("calls onQualityChange when slider is moved", () => {
    const file = new File(["hello"], "photo.png", { type: "image/png" });
    const onQualityChange = vi.fn();
    render(
      <FileSelector
        {...defaultProps}
        selectedFile={file}
        onQualityChange={onQualityChange}
      />,
    );

    fireEvent.change(screen.getByRole("slider"), { target: { value: "60" } });
    expect(onQualityChange).toHaveBeenCalledWith(60);
  });

  it("calls onFormatChange when a new format is selected", () => {
    const file = new File(["hello"], "photo.png", { type: "image/png" });
    const onFormatChange = vi.fn();
    render(
      <FileSelector
        {...defaultProps}
        selectedFile={file}
        onFormatChange={onFormatChange}
      />,
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "jpeg" },
    });
    expect(onFormatChange).toHaveBeenCalledWith("jpeg");
  });
});
