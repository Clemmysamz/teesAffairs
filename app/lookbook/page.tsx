import Link from "next/link";

const looks = [
  { title: "City Form", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80", accent: "Quiet tailoring meets movement." },
  { title: "Soft Geometry", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80", accent: "Structured layers in monochrome tones." },
  { title: "After Hours", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80", accent: "Evening silhouettes with refined texture." },
];

export default function LookbookPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">Lookbook</div>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">CURATED STORIES</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {looks.map((look) => (
          <article key={look.title} className="group overflow-hidden border border-[#080808]/10 bg-white">
            <div className="relative overflow-hidden">
              <img src={look.image} alt={look.title} className="h-[540px] w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            <div className="space-y-3 p-5">
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#666]">{look.title}</div>
              <p className="text-sm text-[#3d3d3d]">{look.accent}</p>
              <Link href="/shop" className="inline-flex text-[10px] uppercase tracking-[0.25em] underline underline-offset-4">Shop The Edit</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
