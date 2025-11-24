"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MemeCard } from "@/components/MemeCard";
import type { UIMeme } from "@/types/meme";
import { placeholderMemes } from "@/data/placeholders";
import { Trophy } from "lucide-react";

export default function Trending() {
  const [memes, setMemes] = useState<UIMeme[]>(placeholderMemes);

  useEffect(() => {
    fetch("/api/memes/trending")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setMemes(data);
        }
      })
      .catch(() => setMemes(placeholderMemes));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-4"
    >
      <div className="mb-10 flex flex-col gap-4 text-center">
        <Trophy className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-4xl font-bold">Trending Memes</h1>
        <p className="text-slate-400">
          Real-time leaderboard of the hottest memes on OnlyMemes.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {memes.slice(0, 8).map((meme, index) => (
          <MemeCard
            key={`${meme._id}-${index}`}
            meme={meme}
            featuredBadge={`#${index + 1} Trending`}
          />
        ))}
      </div>
    </motion.div>
  );
}
