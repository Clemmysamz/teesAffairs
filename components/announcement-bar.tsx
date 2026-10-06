"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem("verano-announcement-dismissed");
    if (stored === "true") setVisible(false);
  }, []);

  const dismiss = () => {
    setVisible(false);
    window.localStorage.setItem("verano-announcement-dismissed", "true");
  };

  if (!visible) return null;

  return (
    <div className="relative border-b border-white/10 bg-[#080808] text-[11px] tracking-[0.28em] text-[#f4f2ed] uppercase">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-3 text-center">
        FREE WORLDWIDE SHIPPING ON ORDERS OVER $150
      </div>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={dismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a4a4a4] transition hover:text-white"
      >
        <X size={14} />
      </button>
    </div>
  );
}
