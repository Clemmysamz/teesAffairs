export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">Privacy</div>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">YOUR INFORMATION IS HANDLED WITH CARE.</h1>
      </div>

      <div className="space-y-5 text-sm leading-relaxed text-[#3d3d3d]">
        <p>Tees Affairs respects your privacy and only uses data necessary to fulfill your orders, provide customer support, and improve your shopping experience.</p>
        <p>We do not sell your personal information. We may use your email and purchase history to send order updates, product updates, and occasional newsletters you can unsubscribe from at any time.</p>
        <p>Payments are processed securely and we retain order information only as long as needed for legal and service obligations.</p>
      </div>
    </div>
  );
}
