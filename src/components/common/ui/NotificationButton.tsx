"use client";

import * as React from "react";
import { Bell } from "lucide-react";

export function NotificationButton() {
  return (
    <button
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
      aria-label="Notificações"
    >
      <Bell className="h-[1.2rem] w-[1.2rem] transition-all" />
    </button>
  );
}
