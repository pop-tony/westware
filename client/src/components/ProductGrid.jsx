// src/components/ProductGrid.jsx
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';

const sampleProducts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1887",
    name: "Silk Wrap Dress",
    price: "220",
    category: "Dresses",
    tag: "Bestseller",
    description: "Flowing silk wrap dress with adjustable tie. Perfect for day to night transitions. Ethically sourced from Ghanaian artisans."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974",
    name: "Kente Blazer Set",
    price: "340",
    category: "Sets",
    tag: "New",
    description: "Modern Kente print blazer with matching wide-leg trousers. Power dressing redefined."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2080",
    name: "Glow Facial Package",
    price: "85",
    category: "Beauty",
    description: "60-minute deep cleanse facial with dermaplaning and LED therapy. Leave with glass skin."
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070",
    name: "Braided Crown Style",
    price: "120",
    category: "Hair",
    tag: "Trending",
    description: "Intricate braided crown with gold cuffs. Lasts 6-8 weeks with proper care."
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070",
    name: "Evening Gown",
    price: "450",
    category: "Dresses",
    description: "Floor-length silk gown with thigh slit. Red carpet approved."
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920",
    name: "Ankara Jumpsuit",
    price: "180",
    category: "Sets",
    tag: "Limited",
    description: "Bold Ankara print jumpsuit with wide legs and cinched waist."
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070",
    name: "Bridal Glam Package",
    price: "300",
    category: "Beauty",
    description: "Full bridal makeup + hair styling. Includes trial session."
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=2070",
    name: "Acrylic Nail Set",
    price: "60",
    category: "Beauty",
    description: "Custom acrylic set with nail art. 3-week guarantee."
  },
];

export default function ProductGrid({ category = "All", onAddToCart }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef(null);

  const filtered = category === "All"
 ? sampleProducts
    : sampleProducts.filter(item => item.category === category);

  const displayProducts = showAll? filtered : filtered.slice(0, 8);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScroll);
      return () => scrollEl.removeEventListener('scroll', checkScroll);
    }
  }, [showAll, filtered]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left'? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <section id="collections" className="bg-zinc-50 px-4 py-20 dark:bg-black">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-4xl font-bold text-zinc-900 dark:text-white">Collections</h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                {filtered.length} {filtered.length === 1? 'piece' : 'pieces'} available
              </p>
            </div>

            {/* Desktop: Scroll buttons - only show when collapsed */}
            {!showAll && filtered.length > 3 && (
              <div className="hidden gap-2 md:flex">
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className="rounded-full border border-zinc-300 p-2 text-zinc-900 transition hover:bg-zinc-900 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-900 dark:border-zinc-700 dark:text-white dark:hover:bg-white dark:hover:text-black dark:disabled:hover:bg-transparent dark:disabled:hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className="rounded-full border border-zinc-300 p-2 text-zinc-900 transition hover:bg-zinc-900 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-900 dark:border-zinc-700 dark:text-white dark:hover:bg-white dark:hover:text-black dark:disabled:hover:bg-transparent dark:disabled:hover:text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Scroll view when collapsed */}
          {!showAll? (
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {displayProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="w-72 shrink-0"
                >
                  <ProductCard {...product} onSelect={handleSelectProduct} />
                </motion.div>
              ))}
            </div>
          ) : (
            /* Grid view when expanded */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <ProductCard {...product} onSelect={handleSelectProduct} />
                </motion.div>
              ))}
            </div>
          )}

          {/* View All / Show Less button */}
          {filtered.length > 7 && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 rounded-full border-2 border-zinc-900 px-8 py-3 font-semibold text-zinc-900 transition hover:bg-zinc-900 hover:text-white active:scale-95 dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
              >
                <LayoutGrid className="h-5 w-5" />
                {showAll? 'Show Less' : `View All ${filtered.length} Items`}
              </button>
            </div>
          )}
        </div>
      </section>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBook={onAddToCart}
      />

      <style>{`
       .snap-x::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}