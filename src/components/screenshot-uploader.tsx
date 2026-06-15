import { useCallback, useRef, useState } from "react";
import { Upload, ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

interface Props {
  onImage: (dataUrl: string, name: string) => void;
  onAnalyze: () => void;
  imageDataUrl: string | null;
  imageName: string | null;
  onClear: () => void;
  isLoading: boolean;
}

export function ScreenshotUploader({
  onImage,
  onAnalyze,
  imageDataUrl,
  imageName,
  onClear,
  isLoading,
}: Props) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (!ALLOWED.includes(file.type)) {
        setError("Only PNG, JPG, or WEBP are supported.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError("File exceeds 10 MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => onImage(String(reader.result), file.name);
      reader.onerror = () => setError("Failed to read file.");
      reader.readAsDataURL(file);
    },
    [onImage],
  );

  return (
    <div className="w-full">
      {!imageDataUrl ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "group relative cursor-pointer rounded-2xl border-2 border-dashed transition-all",
            "px-6 py-16 text-center hover:border-primary/60",
            dragging ? "border-primary scale-[1.01]" : "border-border",
          )}
          style={{
            background: dragging ? 'rgba(142, 101, 171, 0.12)' : 'rgba(142, 101, 171, 0.06)',
            backdropFilter: 'blur(20px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
            boxShadow: dragging ? 'var(--shadow-glow)' : '0 8px 32px rgba(26, 18, 37, 0.3)',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED.join(",")}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, rgba(142, 101, 171, 0.3), rgba(220, 148, 176, 0.2))' }}>
            <Upload className="h-8 w-8" style={{ color: '#d3ba83' }} />
          </div>
          <h3 className="mt-6 text-xl font-semibold">Drop your screenshot here</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            or click to browse · PNG, JPG, WEBP up to 10 MB
          </p>
          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        </div>
      ) : (
        <div
          className="rounded-2xl p-4"
          style={{
            background: 'rgba(142, 101, 171, 0.08)',
            backdropFilter: 'blur(20px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
            border: '1px solid rgba(142, 101, 171, 0.18)',
            boxShadow: '0 8px 32px rgba(26, 18, 37, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
              <ImageIcon className="h-4 w-4 shrink-0" style={{ color: '#dc94b0' }} />
              <span className="truncate">{imageName}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              disabled={isLoading}
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="overflow-hidden rounded-xl border bg-background/40">
            <img
              src={imageDataUrl}
              alt="Screenshot preview"
              className="w-full max-h-[480px] object-contain"
            />
          </div>
          <Button
            onClick={onAnalyze}
            disabled={isLoading}
            className="mt-4 w-full h-12 text-base font-semibold"
            style={{
              background: "var(--gradient-primary)",
              color: "var(--primary-foreground)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            {isLoading ? "Analyzing screenshot…" : "Analyze with AI"}
          </Button>
        </div>
      )}
    </div>
  );
}
