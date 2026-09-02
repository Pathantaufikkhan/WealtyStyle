"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="system"
        toastOptions={{
          style: {
            fontFamily: "var(--font-sans)",
            borderRadius: "0.5rem",
          },
        }}
      />
    </NextThemesProvider>
  );
}
