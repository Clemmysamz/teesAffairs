export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">Contact</div>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">WE’RE HERE TO HELP.</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border border-[#080808]/10 bg-white p-6">
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#666]">Send a note</div>
          <form className="space-y-4">
            <input placeholder="Name" className="w-full border border-[#080808]/10 bg-[#f4f2ed] px-3 py-3 text-sm outline-none focus:border-[#080808]" />
            <input placeholder="Email" className="w-full border border-[#080808]/10 bg-[#f4f2ed] px-3 py-3 text-sm outline-none focus:border-[#080808]" />
            <textarea rows={5} placeholder="Message" className="w-full border border-[#080808]/10 bg-[#f4f2ed] px-3 py-3 text-sm outline-none focus:border-[#080808]" />
            <button type="submit" className="border border-[#080808] bg-[#080808] px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-[#f4f2ed]">Send</button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="border border-[#080808]/10 bg-white p-6">
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#666]">Support</div>
            <p className="mt-3 text-sm text-[#3d3d3d]">hello@teesaffairs.studio</p>
            <p className="mt-2 text-sm text-[#3d3d3d]">+1 (415) 210-8716</p>
          </div>
          <div className="border border-[#080808]/10 bg-white p-6">
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#666]">Visit</div>
            <p className="mt-3 text-sm text-[#3d3d3d]">118 Mercer Street</p>
            <p className="text-sm text-[#3d3d3d]">New York, NY 10012</p>
          </div>
        </div>
      </div>
    </div>
  );
}
