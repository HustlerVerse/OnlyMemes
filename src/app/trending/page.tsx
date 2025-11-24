"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MemeCard } from "@/components/MemeCard";
import { Meme } from "@/models/Meme";

export default function Trending() {
  const [memes, setMemes] = useState<Meme[]>([]);

  useEffect(() => {
    fetch("/api/memes/trending")
      .then((res) => res.json())
      .then(setMemes);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-4"
    >
      <h1 className="text-4xl font-bold mb-6">Trending Memes</h1>
      {memes.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {memes.map((meme) => (
            <MemeCard key={meme._id} meme={meme} />
          ))}
        </div>
      ) : (
        <p>No trending memes yet. Be the first to upload!</p>
      )}
    </motion.div>
  );
}
