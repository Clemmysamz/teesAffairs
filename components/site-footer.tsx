import Link from "next/link";
import { ArrowUpRight, Camera, Music2, Send } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#080808]/10 bg-[#f4f2ed] text-[#080808]">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-5 md:gap-10">
          <div className="col-span-2 min-w-0 md:col-span-1">
            <div className="mb-4 text-[11px] uppercase tracking-[0.25em]">Tees Affairs</div>
            <p className="max-w-xs text-sm text-[#4f4f4f]">
              Contemporary essentials for movement, presence, and everyday distinction.
            </p>
          </div>

          <div className="min-w-0">
            <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#747474]">Shop</div>
            <ul className="space-y-2 text-sm text-[#080808]/80">
              <li><Link href="/shop">Shop All</Link></li>
              <li><Link href="/collections/new-arrivals">New Arrivals</Link></li>
              <li><Link href="/collections/essentials">Essentials</Link></li>
              <li><Link href="/collections/outerwear">Outerwear</Link></li>
              <li><Link href="/collections/tops">Tops</Link></li>
              <li><Link href="/collections/accessories">Accessories</Link></li>
            </ul>
          </div>

          <div className="min-w-0">
            <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#747474]">About</div>
            <ul className="space-y-2 text-sm text-[#080808]/80">
              <li><Link href="/about">Our Story</Link></li>
              <li><Link href="/lookbook">Lookbook</Link></li>
              <li><Link href="/journal">Journal</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="min-w-0">
            <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#747474]">Help</div>
            <ul className="space-y-2 text-sm text-[#080808]/80">
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/size-guide">Size Guide</Link></li>
              <li><Link href="/shipping-returns">Shipping & Returns</Link></li>
              <li><Link href="/track-order">Track Order</Link></li>
            </ul>
          </div>

          <div className="col-span-2 min-w-0 md:col-span-1">
            <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#747474]">Social</div>
            <div className="mb-5 flex flex-wrap items-center gap-1.5">
              <a href="https://instagram.com" aria-label="Instagram" className="rounded-full border border-[#080808]/15 p-1.5 transition hover:bg-[#080808] hover:text-[#f4f2ed]"><Camera size={15} /></a>
              <a href="https://www.tiktok.com" aria-label="TikTok" className="rounded-full border border-[#080808]/15 p-1.5 transition hover:bg-[#080808] hover:text-[#f4f2ed]"><Music2 size={15} /></a>
              <a href="https://www.pinterest.com" aria-label="Pinterest" className="rounded-full border border-[#080808]/15 p-1.5 transition hover:bg-[#080808] hover:text-[#f4f2ed]"><ArrowUpRight size={15} /></a>
              <div className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-[#080808]/10 bg-white px-2 py-2 text-[9px] uppercase tracking-widest text-[#080808]">
                <Send size={12} />
                Join Tees Affairs
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[#080808]/10 pt-6 text-xs text-[#4f4f4f] md:mt-12 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/shipping-returns">Returns</Link>
          </div>
          <div className="flex gap-2">
            <span className="rounded border border-[#080808]/15 px-2 py-1">Visa</span>
            <span className="rounded border border-[#080808]/15 px-2 py-1">Mastercard</span>
            <span className="rounded border border-[#080808]/15 px-2 py-1">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
