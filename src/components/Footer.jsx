// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-zinc-100 px-4 py-12 text-zinc-600 dark:bg-black dark:text-zinc-400">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
        <div>
          <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">
            AURA<span className="text-rose-500">Luxe</span>
          </h3>
          <p className="text-sm">Accra-based. Global style.</p>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-zinc-900 dark:text-white">Shop</h4>
          <div className="space-y-2 text-sm">
            <a href="#collections" className="block hover:text-rose-500">New Arrivals</a>
            <a href="#collections" className="block hover:text-rose-500">Dresses</a>
            <a href="#collections" className="block hover:text-rose-500">Beauty</a>
          </div>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-zinc-900 dark:text-white">Services</h4>
          <div className="space-y-2 text-sm">
            <a href="#book" className="block hover:text-rose-500">Personal Styling</a>
            <a href="#book" className="block hover:text-rose-500">Makeup</a>
            <a href="#book" className="block hover:text-rose-500">Hair</a>
          </div>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-zinc-900 dark:text-white">Connect</h4>
          <div className="space-y-2 text-sm">
            <a href="#" className="block hover:text-rose-500">Instagram</a>
            <a href="#" className="block hover:text-rose-500">TikTok</a>
            <a href="#" className="block hover:text-rose-500">WhatsApp</a>
          </div>
        </div>
      </div>
      <p className="mt-12 text-center text-sm">© 2026 AURA Luxe. All rights reserved.</p>
    </footer>
  );
}