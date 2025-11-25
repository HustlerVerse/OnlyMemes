"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MemeCard } from "@/components/MemeCard";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { Flame, Sparkles } from "lucide-react";
import type { TemplateCardData } from "@/types/template";
import {
  fetchAllMemes,
  selectAllMemes,
  selectMemesGroupedByCategory,
  selectMemesStatus,
  selectTrendingMemes,
} from "@/features/memes/memesSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function Home() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectMemesStatus);
  const trendingMemes = useAppSelector(selectTrendingMemes);
  const allMemes = useAppSelector(selectAllMemes);
  const groupedByCategory = useAppSelector(selectMemesGroupedByCategory);
  const [featuredTemplates, setFeaturedTemplates] = useState<
    TemplateCardData[]
  >([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllMemes());
    }
  }, [dispatch, status]);

  useEffect(() => {
    let ignore = false;
    const fetchTemplates = async () => {
      try {
        const res = await fetch("/api/templates");
        if (!res.ok) return;
        const data: TemplateCardData[] = await res.json();
        if (!ignore && Array.isArray(data)) {
          setFeaturedTemplates(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to load templates", error);
      } finally {
        if (!ignore) setTemplatesLoading(false);
      }
    };
    fetchTemplates();
    return () => {
      ignore = true;
    };
  }, []);

  const latestMemes = useMemo(
    () =>
      [...allMemes]
        .sort(
          (a, b) =>
            new Date(b.createdAt ?? "").getTime() -
            new Date(a.createdAt ?? "").getTime()
        )
        .slice(0, 8),
    [allMemes]
  );

  const highlights = useMemo(() => {
    const totalReactions = allMemes.reduce((acc, meme) => {
      const reactionSum = Object.values(meme.reactions ?? {}).reduce(
        (sum, value) => sum + (value ?? 0),
        0
      );
      return acc + reactionSum;
    }, 0);

    return [
      {
        label: "Total Reactions",
        value: totalReactions.toString(),
        icon: Sparkles,
      },
      { label: "Total Memes", value: allMemes.length.toString(), icon: Flame },
      { label: "Creators Online", value: "Live", icon: Sparkles },
    ];
  }, [allMemes]);

  const categoryEntries = useMemo(
    () =>
      Object.entries(groupedByCategory).sort(
        (a, b) => b[1].length - a[1].length
      ),
    [groupedByCategory]
  );

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

        <div className="mt-12 grid  gap-4 text-left md:grid-cols-3">
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
        {status === "loading" ? (
          <p className="text-center text-slate-400">
            Loading trending memes...
          </p>
        ) : trendingMemes.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trendingMemes.map((meme, idx) => (
              <MemeCard
                key={`${meme._id}-${idx}`}
                meme={meme}
                featuredBadge={idx < 2 ? `#${idx + 1} Trending` : undefined}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400">
            No trending memes yet. Be the first to upload!
          </p>
        )}
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
        {status === "loading" ? (
          <p className="text-center text-slate-400">Fetching latest memes...</p>
        ) : latestMemes.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestMemes.map((meme, idx) => (
              <MemeCard
                key={`${meme._id}-latest-${idx}`}
                meme={meme}
                featuredBadge={idx === 0 ? "New" : undefined}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400">
            Upload your first meme to light up the feed.
          </p>
        )}
      </section>

      <section className="mt-20 space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
            🗂️ Categories
          </p>
          <h3 className="text-3xl font-bold text-white">
            Browse by your favourite vibe
          </h3>
          <p className="text-slate-400">
            We automatically group every upload by category so you can dive
            straight into the mood you want.
          </p>
        </div>
        {status === "loading" ? (
          <p className="text-center text-slate-400">Loading categories...</p>
        ) : categoryEntries.length ? (
          <div className="space-y-10">
            {categoryEntries.slice(0, 4).map(([category, memes]) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-2xl font-semibold text-white">
                    {category}
                  </h4>
                  <Link
                    href={`/explore?category=${encodeURIComponent(category)}`}
                    className="text-sm text-primary hover:underline"
                  >
                    See all
                  </Link>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {memes.slice(0, 4).map((meme) => (
                    <MemeCard key={meme._id} meme={meme} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400">
            No categories to show yet. Upload a meme to start!
          </p>
        )}
      </section>

      <section className="mt-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-black p-10 shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.25),transparent_45%)] opacity-70" />
          <div className="relative z-10">
            <p className="text-sm uppercase tracking-[0.4em] text-primary">
              Templates Hub
            </p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-white">
                  Browse templates & craft your story
                </h3>
                <p className="text-slate-400 max-w-2xl">
                  Kickstart your next meme with community favorite templates.
                  Tap a card to jump into the uploader with the template ready
                  to go.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/templates"
                  className="rounded-2xl bg-primary px-6 py-3 font-semibold text-slate-950 hover:bg-primary/90 transition"
                >
                  Browse Templates
                </Link>
                <Link
                  href="/upload"
                  className="rounded-2xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
                >
                  Upload Now
                </Link>
              </div>
            </div>

            <div className="mt-10">
              {templatesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : featuredTemplates.length ? (
                <div className="grid gap-6 md:grid-cols-3">
                  {featuredTemplates.map((template) => (
                    <div
                      key={template._id}
                      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden shadow-xl shadow-black/40 hover:shadow-2xl hover:border-primary/40 transition-all"
                    >
                      <div className="aspect-video overflow-hidden bg-black/40">
                        <img
                          src={template.imageUrl}
                          alt={template.name}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225'%3E%3Crect fill='%23111' width='400' height='225'/%3E%3Ctext fill='%23fff' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ETemplate%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      <div className="p-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-white font-semibold">
                            {template.name}
                          </p>
                          <p className="text-xs text-slate-400 uppercase tracking-wide">
                            {template.category}
                          </p>
                        </div>
                        <Link
                          href="/upload"
                          className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-primary hover:text-slate-900 transition"
                        >
                          Use
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  No templates yet. Head over to the templates page to add the
                  first one!
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
