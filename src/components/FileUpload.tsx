import { useState, useRef, memo } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Paperclip, File, FileImage, X } from "lucide-react";

export interface UploadedFile {
  id: string;
  name: string;
  /** data: URL or blob URL; API expects data URLs for server-side processing */
  url: string;
  type: string;
  size: number;
}

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void;
  files: UploadedFile[];
  disabled?: boolean;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const MAX_DIMENSION = 2048;
const JPEG_QUALITY = 0.8;

/** Compress an image file using the canvas API. Returns a smaller data URL. */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;

      // Down-scale if either dimension exceeds the cap
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }
      ctx.drawImage(img, 0, 0, width, height);

      // Use JPEG for photos (non-transparent); keep PNG for transparency
      const isPng = file.type === "image/png";
      const mimeOut = isPng ? "image/png" : "image/jpeg";
      const quality = isPng ? undefined : JPEG_QUALITY;
      const dataUrl = canvas.toDataURL(mimeOut, quality);
      resolve(dataUrl);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
    img.src = url;
  });
}

export const FileUpload = memo(function FileUpload({ onFilesChange, files, disabled }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    setIsUploading(true);
    const uploadPromises: Promise<UploadedFile | null>[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      // Vercel has a 4.5 MB request body limit; base64 adds ~33% overhead,
      // so cap individual files at 3 MB to stay safely under the limit.
      if (file.size > 3 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 3 MB. Please resize or compress it first.`,
          variant: "destructive",
        });
        continue;
      }

      const id = `local-${Date.now()}-${i}-${file.name}`;

      const isImage = file.type.startsWith("image/");
      uploadPromises.push(
        (isImage ? compressImage(file) : readFileAsDataUrl(file))
          .then((dataUrl) => ({
            id,
            name: file.name,
            url: dataUrl,
            type: file.type || "application/octet-stream",
            size: file.size,
          }))
          .catch(() => {
            toast({
              title: "Read failed",
              description: `Could not read ${file.name}`,
              variant: "destructive",
            });
            return null;
          })
      );
    }

    try {
      const uploadResults = await Promise.all(uploadPromises);
      const successfulUploads = uploadResults.filter((result): result is UploadedFile => result !== null);

      if (successfulUploads.length > 0) {
        onFilesChange([...files, ...successfulUploads]);
        toast({
          title: "Files attached",
          description: `${successfulUploads.length} file(s) ready to send with your request`,
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong reading files",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeFile = (fileToRemove: UploadedFile) => {
    onFilesChange(files.filter((file) => file.id !== fileToRemove.id));
    toast({
      title: "File removed",
      description: `${fileToRemove.name} has been removed`,
    });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <FileImage className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="font-inter"
        >
          <Paperclip className="h-4 w-4" />
          {isUploading ? "Reading..." : "Attach Files"}
        </Button>
        <span className="text-sm text-muted-foreground font-inter">
          Images, PDFs, Word docs &amp; text files, max 3 MB each
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt,.md"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Attach files"
        title="Attach files"
      />

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-background/30 border border-glass rounded-lg backdrop-blur-sm"
            >
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium font-inter truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground font-inter">{formatFileSize(file.size)}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file)}
                disabled={disabled}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
