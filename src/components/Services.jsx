// src/components/Services.jsx
const services = [
  {
    id: 1,
    icon: "💇🏾‍♀️",
    title: "Hair Styling",
    description: "Braids, silk press, frontal installs, and custom wigs. Our stylists specialize in natural and protective styles.",
    price: "From $80",
    duration: "2-4 hrs",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2069"
  },
  {
    id: 2,
    icon: "💄",
    title: "Makeup Artistry",
    description: "Soft glam, bridal, editorial looks. Using premium products for melanin-rich skin tones.",
    price: "From $60",
    duration: "45-90 min",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2080"
  },
  {
    id: 3,
    icon: "👗",
    title: "Personal Styling",
    description: "1-on-1 wardrobe consultation, personal shopping, and event styling. Find your signature look.",
    price: "From $150",
    duration: "2 hrs",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070"
  },
  {
    id: 4,
    icon: "✨",
    title: "Facial Treatments",
    description: "Deep cleanse, dermaplaning, and glow facials. Customized for your skin type and concerns.",
    price: "From $85",
    duration: "60 min",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070"
  },
  {
    id: 5,
    icon: "💅",
    title: "Nail Artistry",
    description: "Acrylics, gel, and intricate designs. We’re obsessed with detail and long-lasting sets.",
    price: "From $40",
    duration: "1-2 hrs",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=2070"
  },
  {
    id: 6,
    icon: "📸",
    title: "Full Glam Package",
    description: "Hair + makeup + styling for photoshoots, weddings, and special events. Red carpet ready.",
    price: "From $350",
    duration: "4-5 hrs",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070"
  },
];

export default function Services({ onBookService }) {
  return (
    <section id="services" className="bg-white px-4 py-20 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-rose-500">What We Do</p>
          <h2 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white md:text-5xl">
            Our Services
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            From everyday glow-ups to special occasions — we’ve got you covered
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map(service => (
            <div
              key={service.id}
              className="group overflow-hidden rounded-2xl bg-zinc-50 transition hover:shadow-xl dark:bg-zinc-900"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute left-4 top-4 text-4xl">{service.icon}</span>
              </div>

              <div className="p-6">
                <h3 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
                  {service.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {service.description}
                </p>

                <div className="mb-6 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">Starting at</p>
                    <p className="text-xl font-bold text-rose-500">{service.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">Duration</p>
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{service.duration}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onBookService(service.title);
                    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full rounded-lg bg-zinc-900 py-3 font-semibold text-white transition hover:bg-rose-500 dark:bg-white dark:text-black dark:hover:bg-rose-500 dark:hover:text-white"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}