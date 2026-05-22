// src/components/ProductCard.jsx
import { motion } from 'framer-motion';

export default function ProductCard({ image, name, price, tag, category, onSelect }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group cursor-pointer overflow-hidden bg-white dark:bg-zinc-900"
      onClick={() => onSelect({ name, price, image, tag, category })}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        {tag && (
          <span className="absolute left-4 top-4 bg-black px-3 py-1 text-xs uppercase tracking-wider text-white dark:bg-white dark:text-black">
            {tag}
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
      </div>
      <div className="p-4 text-zinc-900 dark:text-white">
        <p className="text-xs uppercase text-zinc-500 dark:text-zinc-400">{category}</p>
        <h3 className="mt-1 text-lg font-medium">{name}</h3>
        <p className="mt-1 text-lg font-semibold text-rose-500">${price}</p>
      </div>
    </motion.div>
  );
}