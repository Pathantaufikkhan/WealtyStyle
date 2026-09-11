"use client";

import React, { useEffect, useRef } from "react";

export function CinematicAmbientLight() {
  const glowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -500, y: -500 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const updateGlow = () => {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${posRef.current.x - 300}px, ${posRef.current.y - 300}px, 0)`;
      }
      rafId.current = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (glowRef.current && glowRef.current.style.opacity !== "1") {
        glowRef.current.style.opacity = "1";
      }
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(updateGlow);
      }
    };

    const handleMouseLeave = () => {
      if (glowRef.current) {
        glowRef.current.style.opacity = "0";
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden hidden md:block"
      aria-hidden="true"
    >
      {/* Subtle Warm Gold Radial Ambient Cursor Glow */}
      <div
        ref={glowRef}
        style={{
          transform: "translate3d(-500px, -500px, 0)",
          opacity: 0,
          background:
            "radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0.015) 40%, transparent 70%)",
        }}
        className="h-[600px] w-[600px] rounded-full blur-[40px] will-change-transform transition-opacity duration-500"
      />
    </div>
  );
}

