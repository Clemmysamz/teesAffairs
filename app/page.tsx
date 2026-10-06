import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";
import { ProductCard } from "@/components/product-card";
import { ThreeDViewer } from "@/components/three-viewer";
import { lookbookImages } from "@/data/storefront";
import { getBestSellers, getNewArrivals } from "@/lib/products";
import { getCatalogProducts } from "@/lib/product-catalog.server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getCatalogProducts();
  const newArrivals = getNewArrivals(products);
  const bestSellers = getBestSellers(products);

  return (
    <div className="bg-[#f4f2ed] text-[#080808]">
      <section className="relative isolate overflow-hidden border-b border-[#080808]/10">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=80"
            alt="Fashion portrait"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[#080808]/20" />
        <div className="relative mx-auto flex min-h-[760px] max-w-7xl items-end px-4 pb-10 pt-20 md:px-6">
          <div className="max-w-2xl text-[#f4f2ed]">
            <div className="mb-4 text-[10px] uppercase tracking-[0.42em] text-[#f4f2ed]/80">Tees Affairs</div>
            <h1 className="font-display text-5xl leading-none md:text-8xl">FORM FOLLOWS ATTITUDE.</h1>
            <p className="mt-5 max-w-xl text-base text-[#f4f2ed]/90 md:text-lg">
              Contemporary clothing designed for movement, presence, and everyday distinction.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/shop" className="inline-flex items-center justify-center bg-[#f4f2ed] px-6 py-3 text-[10px] uppercase tracking-[0.28em] text-[#080808] transition hover:bg-[#080808] hover:text-[#f4f2ed]">
                Shop New Arrivals
              </Link>
              <Link href="/collections" className="inline-flex items-center justify-center border border-[#f4f2ed]/40 bg-transparent px-6 py-3 text-[10px] uppercase tracking-[0.28em] text-[#f4f2ed] transition hover:bg-[#f4f2ed] hover:text-[#080808]">
                Explore the Collection
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[#f4f2ed]">
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">New Arrivals</div>
            <h2 className="mt-2 font-display text-4xl md:text-6xl">NEW ARRIVALS</h2>
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#666]">The latest from Tees Affairs.</div>
        </div>

        <div className="product-grid grid grid-cols-2 gap-4 md:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-[#080808]/10 bg-[#e7e1d8]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:grid-cols-[1.5fr_1fr] md:px-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.35em] text-[#444]">Brand Statement</div>
            <h2 className="mt-4 font-display text-5xl leading-none md:text-[7rem]">
              BUILT FOR THE WAY YOU MOVE.
            </h2>
          </div>
          <div className="flex flex-col justify-between gap-6">
            <p className="max-w-md text-lg leading-relaxed text-[#171717]">
              Tees Affairs creates refined everyday clothing through considered silhouettes, elevated materials, and details designed to last beyond the season.
            </p>
            <Link href="/about" className="inline-flex w-fit items-center gap-2 border border-[#080808] px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-[#080808] transition hover:bg-[#080808] hover:text-[#f4f2ed]">
              Explore Our Story <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="grid overflow-hidden rounded-xl border border-[#080808]/10 bg-white md:grid-cols-2">
          <div className="relative min-h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80"
              alt="Editorial campaign"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">The Essentials</div>
            <h3 className="mt-4 font-display text-5xl md:text-6xl">THE ESSENTIALS</h3>
            <p className="mt-4 max-w-md text-lg text-[#333]">THE FOUNDATION OF THE TEES AFFAIRS WARDROBE.</p>
            <Link href="/collections/essentials" className="mt-8 inline-flex w-fit items-center border border-[#080808] px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-[#080808] transition hover:bg-[#080808] hover:text-[#f4f2ed]">
              Shop Essentials
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="font-display text-5xl md:text-6xl">SEE THE FORM.</h3>
        </div>
        <ThreeDViewer fallbackImage="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">Best Sellers</div>
            <h3 className="mt-2 font-display text-5xl md:text-6xl">THE TEES AFFAIRS EDIT</h3>
          </div>
          <Link href="/shop" className="text-[10px] uppercase tracking-[0.28em] text-[#080808]">View All</Link>
        </div>

        <div className="product-grid grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-3">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="relative overflow-hidden rounded-xl border border-[#080808]/10 bg-[#ede6dc]">
          <img src={lookbookImages[0]} alt="Lookbook campaign" className="h-[500px] w-full object-cover md:h-[620px]" />
          <div className="absolute inset-0 bg-[#080808]/20" />
          <div className="absolute bottom-0 left-0 flex max-w-lg flex-col gap-4 p-6 text-[#f4f2ed] md:p-10">
            <div className="text-[10px] uppercase tracking-[0.35em] text-[#f4f2ed]/75">Season 01 / 26</div>
            <h3 className="font-display text-5xl leading-none md:text-7xl">THE NEW STANDARD.</h3>
            <Link href="/lookbook" className="inline-flex w-fit items-center gap-2 border border-[#f4f2ed] px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-[#f4f2ed] transition hover:bg-[#f4f2ed] hover:text-[#080808]">
              View Lookbook
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#080808] py-20 text-[#f4f2ed]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[1.2fr_1fr] md:px-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.35em] text-[#d0d0d0]">Tees Affairs Journal</div>
            <h3 className="mt-4 font-display text-5xl md:text-6xl">ENTER THE WORLD OF TEES AFFAIRS.</h3>
            <p className="mt-4 max-w-xl text-base text-[#d0d0d0]">Be first to know about new drops, private releases, and limited collections.</p>
          </div>
          <div className="flex items-end justify-end">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
