"use client";

import React, { useEffect, useState } from "react";

export function CinematicAmbientLight() {
  const [position, setPosition] = useState({ x: -500, y: -500 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // keep visible
      }, 1000);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(timeoutId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-700 hidden md:block"
      aria-hidden="true"
    >
      {/* Subtle Warm Gold Radial Ambient Cursor Glow */}
      <div
        style={{
          transform: `translate3d(${position.x - 300}px, ${position.y - 300}px, 0)`,
          background: "radial-gradient(circle, rgba(212, 175, 55, 0.045) 0%, rgba(212, 175, 55, 0.015) 40%, transparent 70%)",
        }}
        className="h-[600px] w-[600px] rounded-full blur-[40px] will-change-transform"
      />
    </div>
  );
}
