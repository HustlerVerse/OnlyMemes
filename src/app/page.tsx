"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MemeCard } from "@/components/MemeCard";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Meme } from "@/models/Meme";

export default function Home() {
  const { data: session } = useSession();
  const [trendingMemes, setTrendingMemes] = useState<Meme[]>([]);
  const [latestMemes, setLatestMemes] = useState<Meme[]>([]);

  useEffect(() => {
    fetch("/api/memes/trending")
      .then((res) => res.json())
      .then(setTrendingMemes);

    fetch("/api/memes")
      .then((res) => res.json())
      .then(setLatestMemes);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-20"
      >
        <h1 className="text-5xl font-bold text-white">
          Discover, Create & Share
        </h1>
        <h2 className="text-4xl font-bold text-primary">Epic Memes</h2>
        <p className="mt-4 text-lg">
          Join the most vibrant meme community. Upload your creations, react to
          others, and become a meme legend.
        </p>

        <div className="mt-6 space-x-4">
          <Link
            href="/explore"
            className="bg-primary text-background px-6 py-3 rounded-xl shadow-soft hover:scale-105 transition"
          >
            Explore Memes
          </Link>

          <Link
            href={session ? "/upload" : "/api/auth/signin"}
            className="bg-surface text-text px-6 py-3 rounded-xl shadow-soft hover:scale-105 transition"
          >
            Upload Meme
          </Link>
        </div>
      </motion.div>

      <section className="my-10">
        <h3 className="text-2xl font-bold mb-4">Trending Memes</h3>
        {trendingMemes.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendingMemes.map((meme) => (
              <MemeCard key={meme._id} meme={meme} />
            ))}
          </div>
        ) : (
          <p>No trending memes yet. Be the first to upload!</p>
        )}
      </section>

      <section className="my-10">
        <h3 className="text-2xl font-bold mb-4">Latest Memes</h3>
        {latestMemes.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestMemes.map((meme) => (
              <MemeCard key={meme._id} meme={meme} />
            ))}
          </div>
        ) : (
          <p>No latest memes yet.</p>
        )}
      </section>
    </div>
  );
}
