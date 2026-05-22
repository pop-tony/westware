// src/components/LookbookCarousel.jsx
import { useState } from 'react';

const looks = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920",
    title: "Urban Goddess",
    description: "Ankara meets streetwear"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070",
    title: "Minimal Muse",
    description: "Clean lines, bold energy"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070",
    title: "Evening Royale",
    description: "Silk and statement jewelry"
  },
];

export default function LookbookCarousel() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % looks.length);
  const prev = () => setCurrent((current - 1 + looks.length) % looks.length);

  return (
    <section id="lookbook" className="bg-white py-20 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-12 text-center text-4xl font-bold text-zinc-900 dark:text-white">Lookbook</h2>
        <div className="relative">
          <div className="aspect-[16/9] overflow-hidden rounded-2xl">
            <img
              src={looks[current].image}
              alt={looks[current].title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="mb-2 text-3xl font-bold">{looks[current].title}</h3>
              <p className="text-lg text-zinc-200">{looks[current].description}</p>
            </div>
          </div>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 backdrop-blur hover:bg-white/30"
          >
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 backdrop-blur hover:bg-white/30"
          >
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}