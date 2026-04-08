"use client";

import { CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[10000] bg-background flex flex-col items-center justify-center gap-6 w-full">
      <div className="flex items-center justify-center text-muted-foreground">
        <CircularProgress size={64} color="inherit" />
      </div>
    </div>
  );
}