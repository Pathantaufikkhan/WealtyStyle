import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface WealthStyleLogoProps {
  variant?: "full" | "horizontal" | "monogram" | "stacked";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  monogramClassName?: string;
  textClassName?: string;
  href?: string;
  priority?: boolean;
}

export function WealthStyleLogo({
  variant = "horizontal",
  size = "md",
  className,
  showText = true,
  monogramClassName,
  textClassName,
  href = "/",
  priority = false,
}: WealthStyleLogoProps) {
  // Height metrics for the official 3:2 transparent gold logo
  const sizeMap = {
    xs: {
      heightClass: "h-8 sm:h-9",
      width: 60,
      height: 40,
    },
    sm: {
      heightClass: "h-10 sm:h-12",
      width: 80,
      height: 54,
    },
    md: {
      heightClass: "h-14 sm:h-16 md:h-18",
      width: 130,
      height: 86,
    },
    lg: {
      heightClass: "h-20 sm:h-24 md:h-28",
      width: 190,
      height: 126,
    },
    xl: {
      heightClass: "h-28 sm:h-36 md:h-40",
      width: 260,
      height: 172,
    },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div
      className={cn(
        "group relative flex items-center justify-center transition-all duration-300 select-none",
        className
      )}
    >
      <div className={cn("relative flex items-center justify-center", currentSize.heightClass, monogramClassName)}>
        <Image
          src="/logo.png"
          alt="WEALTHY STYLE Luxury"
          width={currentSize.width * 2}
          height={currentSize.height * 2}
          priority={priority || size === "md" || size === "lg"}
          className={cn(
            "w-auto max-h-full object-contain filter drop-shadow-[0_3px_16px_rgba(212,175,55,0.4)] transition-transform duration-300 group-hover:scale-105"
          )}
        />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none focus:ring-1 focus:ring-gold-500/40 rounded">
        {content}
      </Link>
    );
  }

  return content;
}
