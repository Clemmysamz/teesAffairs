import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://teesaffairs.example"),
  title: {
    default: "Tees Affairs | Contemporary Premium Clothing",
    template: "%s | Tees Affairs",
  },
  description: "Premium contemporary clothing for movement, presence, and everyday distinction.",
  openGraph: {
    title: "Tees Affairs",
    description: "Contemporary premium clothing for movement, presence, and everyday distinction.",
    url: "https://teesaffairs.example",
    siteName: "Tees Affairs",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#f4f2ed] text-[#080808]">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
