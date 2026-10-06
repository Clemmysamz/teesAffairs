import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 md:px-6">
      <div className="border border-[#080808]/10 bg-white p-10 text-center">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">404</div>
        <h1 className="mt-4 font-display text-5xl md:text-6xl">PAGE NOT FOUND.</h1>
        <p className="mt-4 text-base text-[#444]">The page you’re looking for has moved or no longer exists.</p>
        <div className="mt-8 flex justify-center">
          <Link href="/shop" className="border border-[#080808] bg-[#080808] px-6 py-3 text-[10px] uppercase tracking-[0.28em] text-[#f4f2ed]">Return to shop</Link>
        </div>
      </div>
    </div>
  );
}
