// src/components/ProductDetailModal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export default function ProductDetailModal({ product, isOpen, onClose, onBook }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xl"
          />

          {/* Modal Container - centered with padding for mobile */}
          <div className="backdrop-blur-xl m-5 rounded fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{
                opacity: 0,
                rotateY: -90,
                scale: 0.5,
                transformPerspective: 1000
              }}
              animate={{
                opacity: 1,
                rotateY: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  damping: 20,
                  stiffness: 200
                }
              }}
              exit={{
                opacity: 0,
                rotateY: 90,
                scale: 0.5,
                transition: { duration: 0.3 }
              }}
              className="relative my-8 w-full max-w-5xl rounded-3xl bg-white shadow-2xl dark:bg-zinc-900"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white backdrop-blur transition hover:bg-black/70 dark:bg-white/20"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Scrollable content wrapper */}
              <div className="max-h- overflow-y-auto md:max-h-none md:overflow-visible">
                <div className="grid md:grid-cols-2">
                  {/* Image side - fixed height on mobile */}
                  <motion.div
                    className="rounded-lg p-4 relative h-64 md:h-auto md:min-h-"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover md:rounded-l-3xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:rounded-l-3xl" />
                    {product.tag && (
                      <motion.span
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute left-6 top-6 bg-rose-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white"
                      >
                        {product.tag}
                      </motion.span>
                    )}
                  </motion.div>

                  {/* Info side - scrollable on mobile */}
                  <div className="flex flex-col p-6 text-zinc-900 dark:text-white md:p-12">
                    <div className="flex-1">
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-2 text-sm uppercase tracking-[0.3em] text-rose-500"
                      >
                        {product.category}
                      </motion.p>

                      <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-4 text-3xl font-bold md:text-4xl"
                      >
                        {product.name}
                      </motion.h2>

                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mb-6 text-3xl font-bold text-rose-500"
                      >
                        ${product.price}
                      </motion.p>

                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mb-8 space-y-4 text-zinc-600 dark:text-zinc-400"
                      >
                        <p className="leading-relaxed">
                          {product.description || "Crafted with premium materials and attention to detail. This piece embodies the AURA Luxe aesthetic — bold, refined, and unapologetically you."}
                        </p>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                          <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
                            <p className="text-xs text-zinc-500 dark:text-zinc-500">Material</p>
                            <p className="font-semibold">Premium Silk</p>
                          </div>
                          <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
                            <p className="text-xs text-zinc-500 dark:text-zinc-500">Fit</p>
                            <p className="font-semibold">True to Size</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Actions - sticky to bottom on mobile */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="space-y-3 pt-4"
                    >
                      <button
                        onClick={() => {
                          onBook(product);
                          onClose();
                        }}
                        className="w-full rounded-full bg-zinc-900 py-4 font-bold text-white transition hover:bg-rose-500 dark:bg-white dark:text-black dark:hover:bg-rose-500 dark:hover:text-white"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => {
                          onBook(product);
                          document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
                          onClose();
                        }}
                        className="w-full rounded-full border-2 border-zinc-900 py-4 font-bold text-zinc-900 transition hover:bg-zinc-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
                      >
                        Book Styling Session
                      </button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}