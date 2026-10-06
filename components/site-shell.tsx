"use client";

import { usePathname } from "next/navigation";
import { CartDrawer } from "@/components/cart-drawer";
import { AnnouncementBar } from "@/components/announcement-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <CartDrawer />
    </>
  );
}
