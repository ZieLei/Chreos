import { useRef, useState, type ChangeEvent } from "react";

const SIZE = 256;
const MAX_FILE_BYTES = 15 * 1024 * 1024;

// Crops the image to a centered square and shrinks it, so the stored (and
// encrypted) data URL stays small no matter how big the original photo is
async function toProfilePicture(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);

  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  canvas
    .getContext("2d")
    ?.drawImage(
      bitmap,
      (bitmap.width - side) / 2,
      (bitmap.height - side) / 2,
      side,
      side,
      0,
      0,
      SIZE,
      SIZE,
    );
  bitmap.close();

  // Browsers without WebP encoding hand back PNG, fall back to JPEG then
  const webp = canvas.toDataURL("image/webp", 0.85);
  return webp.startsWith("data:image/webp")
    ? webp
    : canvas.toDataURL("image/jpeg", 0.85);
}

export type ImagePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ImagePicker({ value, onChange }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset so picking the same file again still triggers a change
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Not an image file");
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setError("Image is larger than 15MB");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      onChange(await toProfilePicture(file));
    } catch {
      setError("Could not read that image");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-row gap-2 items-center">
      {value ? (
        <img
          src={value}
          alt="Profile preview"
          className="aspect-square h-12 object-cover border-2 border-mint-green"
        />
      ) : (
        <div className="flex aspect-square h-12 justify-center items-center border-2 border-deep-teal text-deep-teal">
          ?
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        tabIndex={-1}
        onChange={handleFile}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="flex-1 border-2 border-mint-green bg-black text-2xl text-mint-green outline-none px-2 text-left focus:bg-mint-green focus:text-dark-cyan disabled:cursor-wait"
      >
        {loading ? "READING..." : value ? "[ CHANGE... ]" : "[ BROWSE... ]"}
      </button>

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="border-2 border-mint-green bg-black text-2xl text-mint-green outline-none px-2 focus:bg-mint-green focus:text-dark-cyan"
        >
          [ CLEAR ]
        </button>
      )}

      {error && (
        <span className="text-2xl text-cloud-sky whitespace-nowrap">
          {`>> ${error.toUpperCase()}`}
        </span>
      )}
    </div>
  );
}
