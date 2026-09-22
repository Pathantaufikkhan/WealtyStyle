"use client";

import { useEffect } from "react";
import { useStoreData } from "@/lib/store/useStoreData";

export function StoreInitializer() {
  const { syncWithSupabase, isSyncedOnce } = useStoreData();

  useEffect(() => {
    // Only run the global sync once when the app mounts
    if (!isSyncedOnce) {
      syncWithSupabase().catch(() => {
        // Silently swallow errors on the frontend to prevent 
        // unhandled promise rejections that could crash the React tree.
        // The error is already logged inside useStoreData.
      });
    }
  }, [syncWithSupabase, isSyncedOnce]);

  return null;
}
