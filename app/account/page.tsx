import Link from "next/link";

const stats = [
  { label: "Orders", value: "04" },
  { label: "Wishlist", value: "12" },
  { label: "Rewards", value: "2,480" },
];

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">Account</div>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">HELLO, NAOMI.</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-[#080808]/10 bg-white p-6">
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#666]">{stat.label}</div>
            <div className="mt-4 font-display text-4xl">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border border-[#080808]/10 bg-white p-6">
          <div className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#666]">Recent orders</div>
          <div className="space-y-4">
            {[
              ["Order #VE-2048", "In Transit", "$420"],
              ["Order #VE-1981", "Delivered", "$150"],
              ["Order #VE-1830", "Delivered", "$280"],
            ].map(([code, status, total]) => (
              <div key={code} className="flex items-center justify-between border-b border-[#080808]/10 pb-3 last:border-none last:pb-0">
                <div>
                  <div className="text-sm font-medium">{code}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#666]">{status}</div>
                </div>
                <div className="text-sm">{total}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-[#080808]/10 bg-white p-6">
            <div className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#666]">Profile</div>
            <ul className="space-y-2 text-sm text-[#3d3d3d]">
              <li>Naomi Voss</li>
              <li>naomi@teesaffairs.studio</li>
              <li>Member since 2023</li>
            </ul>
          </div>
          <div className="border border-[#080808]/10 bg-white p-6">
            <div className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#666]">Quick links</div>
            <div className="space-y-2 text-sm">
              <Link href="/wishlist" className="block underline underline-offset-4">Wishlist</Link>
              <Link href="/track-order" className="block underline underline-offset-4">Track Order</Link>
              <Link href="/shipping-returns" className="block underline underline-offset-4">Shipping & Returns</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
