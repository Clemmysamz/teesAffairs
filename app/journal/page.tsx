import Link from "next/link";

const entries = [
  { slug: "the-shape-of-everyday", title: "The Shape of Everyday", category: "Styling", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80" },
  { slug: "quiet-wardrobe-rules", title: "Quiet Wardrobe Rules", category: "Essentials", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80" },
  { slug: "layering-for-transition", title: "Layering for Transition", category: "Approach", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80" },
];

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">Journal</div>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">NOTES FROM THE STUDIO.</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {entries.map((entry) => (
          <article key={entry.slug} className="overflow-hidden border border-[#080808]/10 bg-white">
            <img src={entry.image} alt={entry.title} className="h-[360px] w-full object-cover" />
            <div className="space-y-3 p-5">
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#666]">{entry.category}</div>
              <h2 className="text-2xl font-medium">{entry.title}</h2>
              <Link href={`/journal/${entry.slug}`} className="inline-flex text-[10px] uppercase tracking-[0.25em] underline underline-offset-4">Read more</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
