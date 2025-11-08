"use client";

import { useState, useCallback } from "react";
import { Upload, X, File, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export interface FileWithProgress {
  file: File;
  progress: number;
  error?: string;
}

interface FileUploaderProps {
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  onFilesSelected: (files: File[]) => void;
  onFileRemove?: (index: number) => void;
  files?: FileWithProgress[];
  className?: string;
}

export function FileUploader({
  accept = "video/*",
  maxSize = 100 * 1024 * 1024, // 100MB default
  maxFiles = 1,
  onFilesSelected,
  onFileRemove,
  files = [],
  className,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = useCallback(
    (fileList: FileList | null): File[] => {
      if (!fileList) return [];

      const validFiles: File[] = [];
      const errors: string[] = [];

      Array.from(fileList).forEach((file) => {
        // Check file count
        if (files.length + validFiles.length >= maxFiles) {
          errors.push(`Maximum ${maxFiles} file(s) allowed`);
          return;
        }

        // Check file size
        if (file.size > maxSize) {
          errors.push(
            `${file.name} exceeds maximum size of ${(maxSize / 1024 / 1024).toFixed(0)}MB`
          );
          return;
        }

        // Check file type
        if (accept && accept !== "*") {
          const acceptTypes = accept.split(",").map((t) => t.trim());
          const fileExtension = `.${file.name.split(".").pop()}`;
          const mimeType = file.type;

          const isValid = acceptTypes.some(
            (type) =>
              type === mimeType ||
              type === fileExtension ||
              (type.endsWith("/*") &&
                mimeType.startsWith(type.replace("/*", "")))
          );

          if (!isValid) {
            errors.push(`${file.name} is not an accepted file type`);
            return;
          }
        }

        validFiles.push(file);
      });

      if (errors.length > 0) {
        setError(errors[0]);
      } else {
        setError(null);
      }

      return validFiles;
    },
    [files.length, maxFiles, maxSize, accept]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const validFiles = validateFiles(e.dataTransfer.files);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    },
    [validateFiles, onFilesSelected]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const validFiles = validateFiles(e.target.files);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    },
    [validateFiles, onFilesSelected]
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50",
          files.length >= maxFiles && "opacity-50 pointer-events-none"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleChange}
          disabled={files.length >= maxFiles}
          aria-label="Upload file"
        />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm font-medium mb-1">
          Drop files here or click to upload
        </p>
        <p className="text-xs text-muted-foreground">
          Max {(maxSize / 1024 / 1024).toFixed(0)}MB • {accept}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              <File className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(item.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                {item.progress > 0 && item.progress < 100 && (
                  <Progress value={item.progress} className="mt-2 h-1" />
                )}
                {item.error && (
                  <p className="text-xs text-destructive mt-1">{item.error}</p>
                )}
              </div>
              {onFileRemove && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={() => onFileRemove(index)}
                  aria-label={`Remove ${item.file.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


