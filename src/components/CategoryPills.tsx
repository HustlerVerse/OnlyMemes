"use client";

import { motion } from "framer-motion";

interface Props {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

export function CategoryPills({ categories, selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-3 overflow-x-auto">
      {categories.map((cat) => (
        <motion.button
          key={cat}
          onClick={() => onSelect(cat)}
          whileTap={{ scale: 0.95 }}
          className={`px-5 py-2 rounded-full border border-white/10 backdrop-blur transition ${
            selected === cat
              ? "bg-primary text-slate-900 shadow-glow"
              : "bg-white/5 text-slate-200 hover:border-primary/60 hover:text-white"
          }`}
        >
          {cat}
        </motion.button>
      ))}
    </div>
  );
}
