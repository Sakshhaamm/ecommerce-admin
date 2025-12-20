"use client";
import { CldUploadWidget } from "next-cloudinary";

export default function ImageUpload({ onUpload }: { onUpload: (url: string) => void }) {
  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onSuccess={(result: any) => {
        const url = result?.info?.secure_url;
        if (url) onUpload(url);
      }}
      options={{ maxFiles: 1, resourceType: "image" }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="w-full bg-slate-200 text-slate-700 font-semibold py-3 rounded border-2 border-dashed border-slate-300 hover:bg-slate-300 transition"
        >
          📸 Upload Image
        </button>
      )}
    </CldUploadWidget>
  );
}