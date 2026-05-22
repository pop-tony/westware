// src/components/ProductGrid.jsx
import { useState } from 'react';
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
];

export default function ProductGrid({ category = "All", onAddToCart }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = category === "All"
  ? sampleProducts
    : sampleProducts.filter(item => item.category === category);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <>
      <section id="collections" className="bg-zinc-50 px-4 py-20 dark:bg-black">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">Collections</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Handpicked for your next statement</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(product => (
              <ProductCard key={product.id} {...product} onSelect={handleSelectProduct} />
            ))}
          </div>
        </div>
      </section>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBook={onAddToCart}
      />
    </>
  );
}