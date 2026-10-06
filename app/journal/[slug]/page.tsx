import Link from "next/link";
import { notFound } from "next/navigation";

const entries = {
  "the-shape-of-everyday": {
    title: "The Shape of Everyday",
    category: "Styling",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    excerpt: "How to create a wardrobe that feels considered without becoming precious.",
    body: "A modern wardrobe should not shout. It should move with ease, support your routines, and feel intentional in every context. The most compelling outfits often start with one well-structured base and a small number of tactile additions that sharpen the overall form.",
  },
  "quiet-wardrobe-rules": {
    title: "Quiet Wardrobe Rules",
    category: "Essentials",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
    excerpt: "The most useful essentials live in the background — but change everything.",
    body: "When the wardrobe is edited well, the everyday gets easier. A clean tee, a precise trouser, a tactile knit, and a strong coat can replace a dozen disposable pieces. Function and beauty become the same objective.",
  },
  "layering-for-transition": {
    title: "Layering for Transition",
    category: "Approach",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    excerpt: "A lighter layer can completely change the rhythm of a look.",
    body: "Transition dressing is less about seasonal compromise and more about calibrating weight, silhouette, and texture. Start with a pared-back foundation and add one sculptural layer that defines the silhouette without overwhelming it.",
  },
};

export function generateStaticParams() {
  return Object.keys(entries).map((slug) => ({ slug }));
}

export default async function JournalEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = entries[slug as keyof typeof entries];

  if (!entry) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <div className="mb-6 text-[10px] uppercase tracking-[0.35em] text-[#666]">{entry.category}</div>
      <h1 className="font-display text-5xl md:text-7xl">{entry.title}</h1>
      <p className="mt-4 max-w-2xl text-base text-[#444]">{entry.excerpt}</p>
      <img src={entry.image} alt={entry.title} className="mt-8 h-[460px] w-full object-cover" />
      <div className="mt-8 space-y-5 text-base leading-relaxed text-[#3d3d3d]">
        <p>{entry.body}</p>
        <p>Thoughtful dressing is not about excess or noise. It’s about clarity, confidence, and how each piece functions across the rhythm of real life.</p>
      </div>
      <div className="mt-10">
        <Link href="/journal" className="inline-flex border border-[#080808] px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-[#080808]">Back to Journal</Link>
      </div>
    </article>
  );
}
