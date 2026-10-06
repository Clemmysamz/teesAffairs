export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">Shipping & returns</div>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">DELIVERED WITH CARE.</h1>
      </div>

      <div className="space-y-6">
        <div className="border border-[#080808]/10 bg-white p-6">
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#666]">Shipping</div>
          <p className="mt-3 text-sm leading-relaxed text-[#444]">All orders over $150 ship free within the continental United States. Domestic orders typically arrive within 3–5 business days; international shipping times vary.</p>
        </div>
        <div className="border border-[#080808]/10 bg-white p-6">
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#666]">Returns</div>
          <p className="mt-3 text-sm leading-relaxed text-[#444]">We accept returns on unused items within 30 days of delivery. Items must be in original condition with tags attached. If your item is damaged or incorrect, we’ll arrange a replacement or refund.</p>
        </div>
        <div className="border border-[#080808]/10 bg-white p-6">
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#666]">Exchanges</div>
          <p className="mt-3 text-sm leading-relaxed text-[#444]">Need a different size? Contact our customer care team and we’ll help coordinate a straightforward exchange.</p>
        </div>
      </div>
    </div>
  );
}
