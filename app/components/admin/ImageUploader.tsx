"use client";
import { useState, useRef } from "react";

export default function ImageUploader({
  onChange,
}: {
  onChange: (urls: string[]) => void;
}) {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    const uploaded: string[] = [];

    for (const file of Array.from(files).slice(0, 5 - images.length)) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Upload failed");
        setUploading(false);
        return;
      }

      const { url } = await res.json();
      uploaded.push(url);
    }

    const next = [...images, ...uploaded];
    setImages(next);
    onChange(next);
    setUploading(false);

    // reset input so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        disabled={uploading || images.length >= 5}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading || images.length >= 5}
        className="border-2 border-dashed border-ash rounded-lg px-4 py-8 w-full text-stone-500
                   hover:border-rose hover:text-rose transition-colors disabled:opacity-50"
      >
        {uploading
          ? "Uploading…"
          : images.length >= 5
            ? "Maximum 5 images"
            : "+ Upload product images"}
      </button>

      {error && <p className="text-rose text-sm mt-2">{error}</p>}

      {images.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {images.map((url) => (
            <div key={url} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-20 w-20 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => {
                  const next = images.filter((u) => u !== url);
                  setImages(next);
                  onChange(next);
                }}
                className="absolute -top-2 -right-2 bg-rose text-white rounded-full w-5 h-5 text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
