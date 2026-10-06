import Link from "next/link";
import { collectionList } from "@/data/storefront";

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-10">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">Collections</div>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">COLLECTIONS</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {collectionList.map((collection) => (
          <Link key={collection.slug} href={`/collections/${collection.slug}`} className="group relative overflow-hidden border border-[#080808]/10 bg-white">
            <img src={collection.heroImage} alt={collection.title} className="h-[420px] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-[#080808]/20" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-[#f4f2ed]">
              <div className="text-[10px] uppercase tracking-[0.3em]">{collection.tagline}</div>
              <h2 className="mt-2 font-display text-4xl md:text-5xl">{collection.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
