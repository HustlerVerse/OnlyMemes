"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MemeCard } from "@/components/MemeCard";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { Flame, Sparkles } from "lucide-react";
import { placeholderMemes } from "@/data/placeholders";
import type { UIMeme } from "@/types/meme";

export default function Home() {
  const { data: session } = useSession();
  const [trendingMemes, setTrendingMemes] =
    useState<UIMeme[]>(placeholderMemes);
  const [latestMemes, setLatestMemes] = useState<UIMeme[]>(
    placeholderMemes.slice().reverse()
  );

  const highlights = useMemo(
    () => [
      { label: "Total Reactions", value: "12", icon: Sparkles },
      { label: "Total Memes", value: "2", icon: Flame },
      { label: "Creators Online", value: "128+", icon: Sparkles },
    ],
    []
  );

  useEffect(() => {
    fetch("/api/memes/trending")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setTrendingMemes(data);
        }
      })
      .catch(() => setTrendingMemes(placeholderMemes));

    fetch("/api/memes")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setLatestMemes(data);
        }
      })
      .catch(() => setLatestMemes(placeholderMemes.slice().reverse()));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-16 pt-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-900/20 to-slate-900/60 px-6 py-16 text-center shadow-2xl shadow-primary/10 backdrop-blur-3xl"
      >
        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">
          The Ultimate Meme Platform
        </p>
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
          Discover, Create & Share
          <span className="text-primary block mt-2">Epic Memes</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join the most vibrant meme community. Upload your creations, react to
          others, and become a meme legend.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-3 font-semibold text-slate-900 shadow-glow transition hover:-translate-y-0.5"
          >
            Explore Memes
          </Link>

          <Link
            href={session ? "/upload" : "/auth"}
            className="rounded-2xl border border-white/15 px-8 py-3 font-semibold text-white transition hover:border-primary/60"
          >
            Upload Meme
          </Link>
        </div>

        <div className="mt-12 grid gap-4 text-left md:grid-cols-3">
          {highlights.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-300"
            >
              <div className="flex items-center justify-between text-white">
                <p className="text-3xl font-semibold">{value}</p>
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-400">
                {label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <section className="mt-16 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
              🔥 Trending
            </p>
            <h3 className="text-3xl font-bold text-white">Trending Memes</h3>
          </div>
          <Link
            href="/trending"
            className="text-primary transition hover:underline"
          >
            View leaderboard →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {trendingMemes.slice(0, 8).map((meme, idx) => (
            <MemeCard
              key={`${meme._id}-${idx}`}
              meme={meme}
              featuredBadge={idx < 2 ? `#${idx + 1} Trending` : undefined}
            />
          ))}
        </div>
      </section>

      <section className="mt-20 space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
            ✨ Fresh Drops
          </p>
          <h3 className="text-3xl font-bold text-white">Latest Memes</h3>
          <p className="text-slate-400">
            New uploads from the community. React before they trend!
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {latestMemes.slice(0, 8).map((meme, idx) => (
            <MemeCard
              key={`${meme._id}-latest-${idx}`}
              meme={meme}
              featuredBadge={idx === 0 ? "New" : undefined}
            />
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/20 via-slate-900 to-primary/10 p-8 text-center shadow-glow">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-900">
          Ready to create?
        </p>
        <h3 className="mt-4 text-3xl font-bold text-slate-900">
          Browse templates & craft your story
        </h3>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/templates"
            className="rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white"
          >
            Use a Template
          </Link>
          <Link
            href="/upload"
            className="rounded-2xl border border-slate-900 px-6 py-3 font-semibold text-slate-900"
          >
            Upload Now
          </Link>
        </div>
      </section>
    </div>
  );
}
