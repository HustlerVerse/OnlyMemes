"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CategoryPills } from "@/components/CategoryPills";
import { MemeCard } from "@/components/MemeCard";
import type { UIMeme } from "@/types/meme";
import { placeholderMemes } from "@/data/placeholders";
import { Search } from "lucide-react";

const categories = [
  "All",
  "Funny",
  "Relatable",
  "Anime",
  "Dark Humor",
  "Wholesome",
  "Tech",
];

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [memes, setMemes] = useState<UIMeme[]>(placeholderMemes);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const url =
      selectedCategory === "All"
        ? "/api/memes"
        : `/api/memes/category/${selectedCategory}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setMemes(data);
        } else {
          setMemes(placeholderMemes);
        }
      })
      .catch(() => setMemes(placeholderMemes))
      .finally(() => setIsLoading(false));
  }, [selectedCategory]);

  const filteredMemes = memes.filter((meme) =>
    meme.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-4"
    >
      <div className="mb-10 space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
          Explore
        </p>
        <h1 className="text-4xl font-bold">Explore Memes</h1>
        <p className="text-slate-400">
          Filter by vibe, search for templates, and save your favourites.
        </p>
      </div>
      <div className="relative mb-6">
        <Search className="absolute left-4 top-4 h-5 w-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search memes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-primary/70 focus:outline-none"
        />
      </div>
      <CategoryPills
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <div className="mt-8 min-h-[200px]">
        {isLoading ? (
          <p className="text-center text-slate-400">Loading memes...</p>
        ) : filteredMemes.length ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {filteredMemes.slice(0, 8).map((meme, idx) => (
              <MemeCard key={`${meme._id}-${idx}`} meme={meme} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400">
            No memes found. Try a different search or category.
          </p>
        )}
      </div>
    </motion.div>
  );
}
