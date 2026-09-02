"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnail Rails */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[550px] pb-2 lg:pb-0 scrollbar-none">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`relative h-20 w-20 sm:h-24 sm:w-24 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
              selectedIndex === idx
                ? "border-gold-500 shadow-md ring-1 ring-gold-500/50"
                : "border-border/60 opacity-60 hover:opacity-100 hover:border-zinc-400"
            }`}
          >
            <Image
              src={img}
              alt={`${productName} angle ${idx + 1}`}
              fill
              className="object-cover"
              sizes="96px"
            />
          </button>
        ))}
      </div>

      {/* Main Big Image Preview */}
      <div className="flex-1 relative aspect-square sm:aspect-[4/5] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-border/80 group">
        <div
          className="relative w-full h-full cursor-crosshair overflow-hidden"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image
            src={images[selectedIndex] || images[0]}
            alt={productName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={`object-cover transition-transform duration-200 ${
              isZooming ? "scale-150" : "scale-100"
            }`}
            style={
              isZooming
                ? {
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  }
                : undefined
            }
          />
        </div>

        {/* Fullscreen Lightbox Trigger */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background text-foreground shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="View Fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* Arrow Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background text-foreground shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background text-foreground shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLightboxOpen(false)}
              className="fixed inset-0 bg-black/95 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center z-10"
            >
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white z-20"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="relative w-full h-[80vh]">
                <Image
                  src={images[selectedIndex]}
                  alt={productName}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Lightbox Navigation */}
              {images.length > 1 && (
                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-full bg-zinc-900/80 hover:bg-gold-500 text-white hover:text-zinc-950 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-xs font-semibold text-zinc-400">
                    {selectedIndex + 1} / {images.length}
                  </span>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-full bg-zinc-900/80 hover:bg-gold-500 text-white hover:text-zinc-950 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
