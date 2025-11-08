import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FileUploader } from "@/components/common/FileUploader";

describe("FileUploader Component", () => {
  it("should render upload area", () => {
    render(<FileUploader onFilesSelected={vi.fn()} />);
    expect(
      screen.getByText(/Drop files here or click to upload/i)
    ).toBeInTheDocument();
  });

  it("should show file size limit", () => {
    render(<FileUploader onFilesSelected={vi.fn()} maxSize={50 * 1024 * 1024} />);
    expect(screen.getByText(/Max 50MB/i)).toBeInTheDocument();
  });

  it("should accept file input", () => {
    render(<FileUploader onFilesSelected={vi.fn()} />);
    const input = screen.getByLabelText(/Upload file/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "file");
  });

  it("should display uploaded files", () => {
    const mockFiles = [
      {
        file: new File(["content"], "test.mp4", { type: "video/mp4" }),
        progress: 50,
      },
    ];

    render(<FileUploader onFilesSelected={vi.fn()} files={mockFiles} />);
    expect(screen.getByText("test.mp4")).toBeInTheDocument();
  });

  it("should call onFileRemove when remove button is clicked", () => {
    const onFileRemove = vi.fn();
    const mockFiles = [
      {
        file: new File(["content"], "test.mp4", { type: "video/mp4" }),
        progress: 50,
      },
    ];

    render(
      <FileUploader
        onFilesSelected={vi.fn()}
        files={mockFiles}
        onFileRemove={onFileRemove}
      />
    );

    const removeButton = screen.getByLabelText(/Remove test.mp4/i);
    fireEvent.click(removeButton);
    expect(onFileRemove).toHaveBeenCalledWith(0);
  });
});


