"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { popularSearches, recentSearches } from "@/data/storefront";
import { searchProducts } from "@/lib/products";
import { useCatalogProducts } from "@/lib/use-catalog-products";
import { useCartStore } from "@/store/cart-store";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
];

const mobileCollections = [
  { href: "/collections/new-arrivals", label: "New Arrivals" },
  { href: "/collections/essentials", label: "Essentials" },
  { href: "/collections/outerwear", label: "Outerwear" },
  { href: "/collections/tops", label: "Tops" },
  { href: "/collections/bottoms", label: "Bottoms" },
  { href: "/collections/accessories", label: "Accessories" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function SearchOverlay({
  open,
  onClose,
  query,
  setQuery,
}: {
  open: boolean;
  onClose: () => void;
  query: string;
  setQuery: (value: string) => void;
}) {
  const products = useCatalogProducts();
  const results = useMemo(() => searchProducts(query, products).slice(0, 5), [query, products]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#080808]/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
            className="mx-auto mt-8 max-w-2xl rounded-none border border-white/10 bg-[#f4f2ed] p-6 text-[#080808]"
          >
            <div className="mb-4 flex items-center justify-between border-b border-[#080808]/10 pb-3">
              <h3 className="text-sm uppercase tracking-[0.35em]">Search</h3>
              <button type="button" onClick={onClose} aria-label="Close search" className="p-1">
                <X size={18} />
              </button>
            </div>
            <input
              aria-label="Search Tees Affairs products"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, categories, or tags..."
              className="w-full border border-[#080808]/10 bg-white px-4 py-3 text-sm outline-none ring-0 placeholder:text-[#6b6b6b] focus:border-[#080808]"
            />

            <div className="mt-6 grid gap-5 md:grid-cols-[1.1fr_1.4fr]">
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[#6b6b6b]">Recent</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="rounded-full border border-[#080808]/15 px-3 py-1.5 text-xs uppercase tracking-[0.2em] transition hover:border-[#080808]"
                    >
                      {term}
                    </button>
                  ))}
                </div>
                <p className="mb-3 mt-5 text-[10px] uppercase tracking-[0.28em] text-[#6b6b6b]">Popular</p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="rounded-full border border-[#080808]/15 px-3 py-1.5 text-xs uppercase tracking-[0.2em] transition hover:border-[#080808]"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[#6b6b6b]">Results</p>
                {query.length === 0 ? (
                  <div className="text-sm text-[#4d4d4d]">Search for product names, categories, or tags.</div>
                ) : results.length ? (
                  <div className="space-y-2">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 border-b border-[#080808]/10 py-2 last:border-b-0"
                      >
                        <img src={product.images[0]} alt={product.name} className="h-14 w-12 object-cover" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{product.name}</div>
                          <div className="text-xs uppercase tracking-[0.18em] text-[#6b6b6b]">{product.category}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-[#4d4d4d]">No products match your search.</div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  return <SiteHeaderContent key={pathname} />;
}

function SiteHeaderContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const openSearch = () => {
    setSearchQuery("");
    setIsSearchOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#080808]/10 bg-[#f4f2ed]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-[11px] uppercase tracking-[0.38em] text-[#080808] transition hover:opacity-80">
              Tees Affairs
            </Link>
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[10px] uppercase tracking-[0.28em] text-[#080808] transition hover:text-[#6a6a6a]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-between gap-3 md:flex-none md:justify-end">
            <button
              type="button"
              aria-label="Open mobile menu"
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex items-center gap-2 border border-[#080808]/15 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-[#080808] md:hidden"
            >
              <Menu size={15} />
              Menu
            </button>

            <Link href="/" className="mx-auto whitespace-nowrap text-center text-[11px] uppercase tracking-[0.18em] text-[#080808] md:mx-0 md:text-left md:text-[12px] md:tracking-[0.28em]">
              Tees Affairs
            </Link>

            <div className="hidden items-center gap-5 md:flex">
              <button type="button" onClick={openSearch} aria-label="Search products" className="inline-flex items-center gap-2">
                <Search size={16} />
                <span className="text-[10px] uppercase tracking-[0.28em]">Search</span>
              </button>
              <Link href="/account" className="inline-flex items-center gap-2">
                <User size={16} />
                <span className="text-[10px] uppercase tracking-[0.28em]">Account</span>
              </Link>
              <Link href="/wishlist" className="inline-flex items-center gap-2">
                <Heart size={16} />
                <span className="text-[10px] uppercase tracking-[0.28em]">Wishlist</span>
              </Link>
              <Link href="/cart" className="inline-flex items-center gap-2 relative">
                <ShoppingCart size={16} />
                <span className="text-[10px] uppercase tracking-[0.28em]">Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#080808] px-1 text-[9px] text-[#f4f2ed]">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <button type="button" onClick={openSearch} aria-label="Search products" className="p-1.5">
                <Search size={17} />
              </button>
              <Link href="/cart" aria-label="View cart" className="relative p-1.5">
                <ShoppingCart size={17} />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#080808] px-1 text-[8px] text-[#f4f2ed]">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
        </header>

        <AnimatePresence>
          {isMobileMenuOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#080808]/55 backdrop-blur-[2px] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Main navigation"
                className="ml-auto flex h-dvh w-[min(100%,27rem)] flex-col border-l border-[#080808]/10 bg-[#f4f2ed] px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] text-[#080808] shadow-2xl sm:px-8"
              >
                <div className="flex shrink-0 items-center justify-between border-b border-[#080808]/15 pb-5">
                  <div className="text-[10px] uppercase tracking-[0.3em]">Tees Affairs</div>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close menu"
                    className="inline-flex h-11 w-11 items-center justify-center border border-[#080808]/15 transition hover:bg-[#080808] hover:text-[#f4f2ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#080808]"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                  <section className="pt-8">
                    <p className="text-[9px] uppercase tracking-[0.32em] text-[#77736d]">Discover</p>
                    <Link
                      href="/shop"
                      onClick={() => setIsMobileMenuOpen(false)}
                    className="group mt-3 flex items-center justify-between border-b border-[#080808]/15 pb-5"
                  >
                    <span className="font-display text-4xl leading-none">Shop all</span>
                    <span className="inline-flex h-10 w-10 items-center justify-center border border-[#080808]/20 transition group-hover:bg-[#080808] group-hover:text-[#f4f2ed]">
                      <ArrowUpRight size={17} />
                    </span>
                  </Link>
                </section>

                <section className="pt-8">
                  <p className="text-[9px] uppercase tracking-[0.32em] text-[#77736d]">Collections</p>
                  <div className="mt-3 grid grid-cols-2 gap-x-6">
                    {mobileCollections.slice(0, 6).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex min-h-12 items-center border-b border-[#080808]/10 font-display text-xl transition-colors hover:text-[#77736d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#080808]"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="pt-8">
                  <p className="text-[9px] uppercase tracking-[0.32em] text-[#77736d]">The journal</p>
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                    {mobileCollections.slice(6, 8).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="inline-flex min-h-10 items-center gap-2 text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-[#77736d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#080808]"
                      >
                        {item.label}
                        <ArrowUpRight size={13} />
                      </Link>
                    ))}
                  </div>
                </section>
              </div>

              <div className="flex shrink-0 gap-6 border-t border-[#080808]/15 pt-5 text-[10px] uppercase tracking-[0.24em] text-[#5f5f5f]">
                {mobileCollections.slice(8).map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="transition-colors hover:text-[#080808]">
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <SearchOverlay open={isSearchOpen} onClose={closeSearch} query={searchQuery} setQuery={setSearchQuery} />
    </>
  );
}
