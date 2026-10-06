const faqs = [
  { question: "What is the shipping timeline?", answer: "Domestic orders typically arrive within 3–5 business days, while international shipping varies by destination." },
  { question: "Do you offer exchanges?", answer: "Yes. Unworn items in original condition can be exchanged or refunded within 30 days of delivery." },
  { question: "How do I care for my pieces?", answer: "Each product includes care instructions on the product page and in the packaging. Most cotton items are machine washable cold." },
  { question: "Can I track my order?", answer: "Once your order ships, you’ll receive an email with tracking details and a link to your order status page." },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">FAQ</div>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">COMMON QUESTIONS.</h1>
      </div>

      <div className="space-y-4">
        {faqs.map((item) => (
          <div key={item.question} className="border border-[#080808]/10 bg-white p-6">
            <div className="text-base font-medium">{item.question}</div>
            <p className="mt-3 text-sm leading-relaxed text-[#444]">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
