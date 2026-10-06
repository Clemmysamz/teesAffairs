import Link from "next/link";

const values = [
  "Designed in Copenhagen for everyday movement.",
  "Built with durable natural fibers and modern tailoring.",
  "Rooted in quiet luxury and functional silhouettes.",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">Our story</div>
          <h1 className="mt-3 font-display text-5xl md:text-7xl">A QUIETER FORM OF LUXURY.</h1>
        </div>
        <div className="overflow-hidden border border-[#080808]/10 bg-white">
          <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80" alt="Tees Affairs atelier" className="h-[500px] w-full object-cover" />
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {values.map((value) => (
          <div key={value} className="border border-[#080808]/10 bg-white p-6 text-sm text-[#444]">
            {value}
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        <div className="border border-[#080808]/10 bg-white p-8">
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#666]">Design philosophy</div>
          <p className="mt-4 text-base leading-relaxed text-[#3d3d3d]">
            Tees Affairs was created to strip away excess and celebrate intention. Every silhouette is shaped to feel polished yet easy, refined yet wearable. We design for real life: movement, layering, everyday rituals, and the confidence that comes from understated precision.
          </p>
        </div>
        <div className="border border-[#080808]/10 bg-white p-8">
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#666]">Made to last</div>
          <p className="mt-4 text-base leading-relaxed text-[#3d3d3d]">
            We source premium fibers, work with small-batch production partners, and create pieces that transcend seasonal trends. The result is a wardrobe of essentials built to be worn, layered, and lived in over time.
          </p>
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link href="/shop" className="inline-flex border border-[#080808] bg-[#080808] px-6 py-3 text-[10px] uppercase tracking-[0.28em] text-[#f4f2ed]">Shop the collection</Link>
      </div>
    </div>
  );
}
