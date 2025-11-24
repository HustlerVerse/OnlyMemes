"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CategoryPills } from "@/components/CategoryPills";
import { MemeCard } from "@/components/MemeCard";
import { Meme } from "@/models/Meme";

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
  const [memes, setMemes] = useState<Meme[]>([]);

  useEffect(() => {
    const url =
      selectedCategory === "All"
        ? "/api/memes"
        : `/api/memes/category/${selectedCategory}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const filtered = search
          ? data.filter((m: Meme) =>
              m.title.toLowerCase().includes(search.toLowerCase())
            )
          : data;
        setMemes(filtered);
      });
  }, [selectedCategory, search]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-4"
    >
      <h1 className="text-4xl font-bold mb-6">Explore Memes</h1>
      <input
        type="text"
        placeholder="Search memes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-xl bg-surface border border-slate-700 focus:outline-none focus:border-primary mb-4"
      />
      <CategoryPills
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {memes.length ? (
          memes.map((meme) => <MemeCard key={meme._id} meme={meme} />)
        ) : (
          <p>No memes found. Try a different search or category.</p>
        )}
      </div>
    </motion.div>
  );
}
