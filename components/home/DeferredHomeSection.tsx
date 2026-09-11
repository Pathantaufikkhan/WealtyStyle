"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

type DeferredHomeSectionProps = {
  children: ReactNode;
  minHeight: string;
};

export function DeferredHomeSection({ children, minHeight }: DeferredHomeSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} style={!isNearViewport ? { minHeight } : undefined}>
      {isNearViewport ? children : null}
    </div>
  );
}
