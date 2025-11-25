"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MemeCard } from "@/components/MemeCard";
import type { UIMeme } from "@/types/meme";
import { placeholderMemes } from "@/data/placeholders";
import { Sparkles, ThumbsUp, Flame } from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [memes, setMemes] = useState<UIMeme[]>(placeholderMemes.slice(0, 2));
  const [suggestions, setSuggestions] = useState<string[]>([
    "Drop your next Hustlerverse update.",
    "Share a relatable coding moment.",
    "Remix a trending template.",
  ]);

  // Loading state
  if (status === "loading") return <p>Loading...</p>;

  // If no session → redirect
  if (!session) {
    router.push("/auth");
    return null;
  }

  // SAFE fetch after session exists
  useEffect(() => {
    if (!session?.user?.id) return; // prevent TypeScript build error

    fetch(`/api/memes?ownerId=${session.user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMemes(data);
        }
      })
      .catch(() => setMemes(placeholderMemes.slice(0, 2)));

    fetch("/api/suggestions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setSuggestions(data);
        }
      })
      .catch(() => {});
  }, [session?.user?.id]);

  const totalReactions = memes.reduce(
    (acc, m) => acc + Object.values(m.reactions).reduce((a, b) => a + b, 0),
    0
  );

  const statCards = [
    {
      label: "Total Memes",
      value: memes.length,
      icon: Sparkles,
    },
    {
      label: "Total Reactions",
      value: totalReactions,
      icon: ThumbsUp,
    },
    {
      label: "Most Popular",
      value: memes[0]?.title ?? "Keep creating",
      icon: Flame,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-4"
    >
      <div className="mb-10 space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
          My Dashboard
        </p>
        <h1 className="text-4xl font-bold">Creator Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-3xl border border-white/10 bg-card/70 p-5 shadow-soft flex flex-col gap-3"
          >
            <Icon className="h-6 w-6 text-primary" />
            <p className="text-4xl font-semibold">{value}</p>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* My Memes */}
      <h2 className="text-2xl font-bold mb-4">My Memes</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {memes.slice(0, 8).map((meme) => (
          <MemeCard key={meme._id} meme={meme} showEditDelete />
        ))}
      </div>

      {/* Suggestions */}
      <h2 className="text-2xl font-bold mt-12 mb-4">Meme Suggestions</h2>
      <ul className="grid gap-3 md:grid-cols-3">
        {suggestions.slice(0, 3).map((sug, i) => (
          <li
            key={i}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-300"
          >
            {sug}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
