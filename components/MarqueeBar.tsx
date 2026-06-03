"use client";

const items = [
  "CRAFTED STORIES",
  "PREMIUM MATERIALS",
  "SUSTAINABLE SOURCES",
  "TIMELESS DESIGN",
];

export function MarqueeBar() {
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="overflow-hidden whitespace-nowrap border-y border-dashed border-[#c4c7c7]/50 bg-[#fdf8f8] py-5">
      <div className="marquee-content inline-flex items-center gap-12">
        {repeated.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-8">
            <span
              className="text-[28px] md:text-[32px] tracking-widest text-[#1c1b1b]"
              style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
            >
              {item}
            </span>
            <span className="text-[#745a27] text-lg">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
