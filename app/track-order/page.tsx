export default function TrackOrderPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">Track order</div>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">FOLLOW YOUR DELIVERY.</h1>
      </div>

      <div className="border border-[#080808]/10 bg-white p-6">
        <label className="text-[10px] uppercase tracking-[0.28em] text-[#666]">Order number</label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input placeholder="VE-2048" className="min-w-0 w-full flex-1 border border-[#080808]/10 bg-[#f4f2ed] px-3 py-3 text-sm outline-none focus:border-[#080808]" />
          <button type="button" className="w-full shrink-0 border border-[#080808] bg-[#080808] px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-[#f4f2ed] sm:w-auto">Track</button>
        </div>
        <div className="mt-6 rounded border border-[#080808]/10 bg-[#f4f2ed] p-4 text-sm text-[#3d3d3d]">
          Status: In transit — expected delivery by Friday, 7:00 PM.
        </div>
      </div>
    </div>
  );
}
