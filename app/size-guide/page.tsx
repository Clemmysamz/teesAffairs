const sizes = [
  { label: "XS", chest: "32-33", waist: "26-27", hip: "34-35" },
  { label: "S", chest: "34-35", waist: "28-29", hip: "36-37" },
  { label: "M", chest: "36-37", waist: "30-31", hip: "38-39" },
  { label: "L", chest: "38-39", waist: "32-33", hip: "40-41" },
  { label: "XL", chest: "40-41", waist: "34-35", hip: "42-43" },
];

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#666]">Size guide</div>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">FIND YOUR FIT.</h1>
      </div>

      <div className="overflow-hidden border border-[#080808]/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f4f2ed] text-[10px] uppercase tracking-[0.25em] text-[#666]">
            <tr>
              <th className="p-4">Size</th>
              <th className="p-4">Chest</th>
              <th className="p-4">Waist</th>
              <th className="p-4">Hip</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((size) => (
              <tr key={size.label} className="border-t border-[#080808]/10">
                <td className="p-4 font-medium">{size.label}</td>
                <td className="p-4">{size.chest}</td>
                <td className="p-4">{size.waist}</td>
                <td className="p-4">{size.hip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
