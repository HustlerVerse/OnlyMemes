"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trash,
  Edit,
  Heart,
  Laugh,
  Sparkles,
  Frown,
  ThumbsDown,
  ArrowUpRight,
} from "lucide-react";
import type { MemeReactions, UIMeme } from "@/types/meme";

interface Props {
  meme: UIMeme;
  showEditDelete?: boolean;
  featuredBadge?: string;
}

type ReactionKey = keyof MemeReactions;

const reactionIcons: { key: ReactionKey; icon: typeof Heart }[] = [
  { key: "likes", icon: Heart },
  { key: "laughs", icon: Laugh },
  { key: "wows", icon: Sparkles },
  { key: "sads", icon: Frown },
  { key: "dislikes", icon: ThumbsDown },
];

export function MemeCard({ meme, showEditDelete, featuredBadge }: Props) {
  const totalReactions = Object.values(meme.reactions ?? {}).reduce(
    (a, b) => a + b,
    0
  );

  const href = meme._id.startsWith("placeholder") ? "/explore" : `/meme/${meme._id}`;

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-3xl bg-card/70 backdrop-blur-xl border border-white/5 shadow-2xl shadow-primary/10"
    >
      {featuredBadge && (
        <span className="absolute z-20 top-4 left-4 text-xs font-semibold tracking-wide uppercase bg-primary/90 text-slate-900 px-3 py-1 rounded-full">
          {featuredBadge}
        </span>
      )}
      <Link href={href} className="block">
        <div className="relative h-56 w-full overflow-hidden">
          {meme.mediaType === "video" ? (
            <video
              src={meme.imageUrl}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={meme.imageUrl}
              alt={meme.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              loading="lazy"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white">
              {meme.category}
            </span>
            <span className="flex items-center gap-1 text-primary">
              View <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          <h3 className="text-xl font-semibold text-white">{meme.title}</h3>
          {meme.tags && (
            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
              {meme.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full bg-white/5 px-2 py-1">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{totalReactions}</span>
              reactions
            </div>
            <span className="text-xs text-slate-400">
              by {meme.ownerName ?? "OnlyMemes"}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 pt-2 text-xs text-slate-200">
            {reactionIcons.map(({ key, icon: Icon }) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                {meme.reactions[key] ?? 0}
              </span>
            ))}
          </div>
        </div>
      </Link>
      {showEditDelete && (
        <div className="flex justify-end p-2 space-x-2">
          <Edit className="w-4 h-4 cursor-pointer" />
          <Trash
            className="w-4 h-4 cursor-pointer"
            onClick={() => {
              /* Delete logic */
            }}
          />
        </div>
      )}
    </motion.article>
  );
}
