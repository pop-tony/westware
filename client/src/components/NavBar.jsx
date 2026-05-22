// src/components/NavBar.jsx
import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 z-50 w-full transition ${
      scrolled
    ? 'bg-white/90 backdrop-blur dark:bg-black/90'
        : 'bg-transparent'
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-zinc-900 dark:text-white">
        <a href="#" className="text-2xl font-bold tracking-tight">
          AURA<span className="text-rose-500">Luxe</span>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#collections" className="hover:text-rose-500">Collections</a>
          <a href="#lookbook" className="hover:text-rose-500">Lookbook</a>
          <a href="#services" className="hover:text-rose-500">Services</a>
          <a href="#consultation" className="hover:text-rose-500">Consultation</a>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-white/10"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center gap-4 md:hidden">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative rounded-full p-2"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}