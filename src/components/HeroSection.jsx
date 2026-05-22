// src/components/HeroSection.jsx
export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"
        alt="Fashion editorial"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="relative z-10 flex h-full flex-col items-start justify-end px-6 pb-20 text-white md:px-12 md:pb-32">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-rose-300">New Season</p>
        <h1 className="mb-6 max-w-2xl text-5xl font-bold md:text-7xl">
          Define Your<br />Signature Look
        </h1>
        <p className="mb-8 max-w-xl text-lg text-zinc-200">
          Curated pieces and bespoke styling for the modern muse. Accra to the world.
        </p>
        <div className="flex gap-4">
          <a href="#collections" className="rounded-full bg-rose-500 px-8 py-3 font-semibold text-white transition hover:bg-rose-400">
            Shop Collection
          </a>
          <a href="#book" className="rounded-full border border-white px-8 py-3 font-semibold transition hover:bg-white hover:text-black">
            Book Stylist
          </a>
        </div>
      </div>
    </section>
  );
}