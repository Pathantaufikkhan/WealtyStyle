"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Link as LinkIcon, X, Loader2, Image as ImageIcon } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  bucketName?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = "Product Image",
  bucketName = "products",
}) => {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImageToWebP = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new (window.Image as any)();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Canvas to Blob failed"));
                return;
              }
              const fileName = file.name.split(".")[0] + ".webp";
              const compressedFile = new File([blob], fileName, {
                type: "image/webp",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/webp",
            0.85 // 85% quality - visually lossless but great compression
          );
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP, etc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size should be less than 10MB");
      return;
    }

    setIsUploading(true);

    try {
      toast.loading("Compressing and formatting image...", { id: "upload-toast" });
      const compressedFile = await compressImageToWebP(file);

      if (isSupabaseConfigured()) {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, compressedFile, { cacheControl: "3600", upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
          if (data?.publicUrl) {
            onChange(data.publicUrl);
            toast.success("Image compressed and uploaded successfully!", { id: "upload-toast" });
            setIsUploading(false);
            return;
          }
        }
      }

      // Local / Offline fallback: Convert to optimized Data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onChange(result);
          toast.success("Image loaded and compressed successfully!", { id: "upload-toast" });
        }
        setIsUploading(false);
      };
      reader.onerror = () => {
        toast.error("Failed to read image file from your device", { id: "upload-toast" });
        setIsUploading(false);
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Could not process image. Please try again.", { id: "upload-toast" });
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded border border-zinc-800 text-[10px]">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2 py-0.5 rounded transition-colors ${
              mode === "upload"
                ? "bg-gold-500 text-zinc-950 font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Upload Device
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2 py-0.5 rounded transition-colors ${
              mode === "url"
                ? "bg-gold-500 text-zinc-950 font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Web URL
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer border-2 border-dashed rounded-lg p-4 transition-all duration-200 flex flex-col items-center justify-center text-center group ${
            dragActive
              ? "border-gold-500 bg-gold-500/10"
              : value
              ? "border-zinc-700 bg-zinc-950/60 hover:border-gold-500/50"
              : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {isUploading ? (
            <div className="py-6 flex flex-col items-center gap-2 text-gold-400">
              <Loader2 className="h-7 w-7 animate-spin" />
              <span className="text-xs font-medium">Processing photo...</span>
            </div>
          ) : value ? (
            <div className="relative w-full flex items-center justify-between gap-3">
              <div className="relative h-16 w-16 rounded border border-gold-500/30 overflow-hidden bg-black flex-shrink-0">
                <Image
                  src={value}
                  alt="Product preview"
                  fill
                  className="object-cover"
                  unoptimized={value.startsWith("data:")}
                />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-semibold text-white truncate">Photo Selected</p>
                <p className="text-[10px] text-zinc-400 truncate">
                  Click or drag another image to replace
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
                className="p-1.5 rounded-full bg-zinc-800 hover:bg-rose-500 hover:text-white text-zinc-400 transition-colors"
                title="Remove photo"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="py-4 flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-gold-400 group-hover:border-gold-500/50 transition-colors">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-white">
                  Click to browse from your device
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  Supports PNG, JPG, WEBP or AVIF up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://..."
              className="w-full h-10 pl-9 pr-3 rounded-md bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500"
            />
          </div>
          {value && (
            <div className="relative h-20 w-20 rounded border border-zinc-800 overflow-hidden bg-black">
              <Image
                src={value}
                alt="URL Preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
