"use client";

import { useState, MouseEvent } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ThumbsUp, Laugh, Eye, Frown, ThumbsDown } from "lucide-react";
import type { UIMeme } from "@/types/meme";

type ReactionKey = "likes" | "laughs" | "wows" | "sads" | "dislikes";

interface Props {
  meme: UIMeme;
  showEditDelete?: boolean;
  featuredBadge?: string;
  onReactionUpdate?: (
    memeId: string,
    reactions: UIMeme["reactions"],
    activeReaction: ReactionKey | null
  ) => void;
}

export function MemeCard({ meme, featuredBadge, onReactionUpdate }: Props) {
  const { data: session } = useSession();

  const [reactions, setReactions] = useState(
    meme.reactions || {
      likes: 0,
      laughs: 0,
      wows: 0,
      sads: 0,
      dislikes: 0,
    }
  );

  // we only know about likes from backend, so use that as initial active reaction
  const [activeReaction, setActiveReaction] = useState<ReactionKey | null>(
    meme.isLiked ? "likes" : null
  );
  const [isReacting, setIsReacting] = useState(false);

  const href = `/meme/${meme._id}`;
  const imageUrl = meme.memeUrl || meme.imageUrl;

  const totalReactions =
    (reactions.likes || 0) +
    (reactions.laughs || 0) +
    (reactions.wows || 0) +
    (reactions.sads || 0) +
    (reactions.dislikes || 0);

  const sendReaction = async (
    type: ReactionKey,
    nextActive: ReactionKey | null
  ) => {
    try {
      const res = await fetch(`/api/memes/${meme._id}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reactionType: type }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reactions) {
          setReactions(data.reactions);
          // if backend sends userReaction, prefer that
          if (data.userReaction) {
            setActiveReaction(data.userReaction as ReactionKey);
            onReactionUpdate?.(meme._id, data.reactions, data.userReaction);
          } else {
            setActiveReaction(nextActive);
            onReactionUpdate?.(meme._id, data.reactions, nextActive);
          }
        } else {
          setActiveReaction(nextActive);
        }
      } else {
        // on failure we just refetch reactions on next load
        setActiveReaction(nextActive);
      }
    } catch (err) {
      console.error("Failed to react", err);
      setActiveReaction(nextActive);
    } finally {
      setIsReacting(false);
    }
  };

  const handleReactionClick = async (
    e: MouseEvent<HTMLButtonElement | SVGSVGElement>,
    type: ReactionKey
  ) => {
    e.stopPropagation();

    if (!session) {
      alert("Please login to react");
      return;
    }

    if (isReacting) return;
    setIsReacting(true);

    // optimistic update
    setReactions((prev) => {
      const next = { ...prev };

      // remove previous reaction
      if (activeReaction && activeReaction !== type) {
        next[activeReaction] = Math.max(0, (next[activeReaction] || 0) - 1);
      }

      // toggle current
      if (activeReaction === type) {
        next[type] = Math.max(0, (next[type] || 0) - 1);
      } else {
        next[type] = (next[type] || 0) + 1;
      }

      return next;
    });

    const nextActive = activeReaction === type ? null : type;
    await sendReaction(type, nextActive);
  };

  const iconClasses = (type: ReactionKey) =>
    `h-3.5 w-3.5 ${
      activeReaction === type ? "text-emerald-400" : "text-slate-400"
    }`;

  const pillClasses = (type: ReactionKey) =>
    `flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-all ${
      activeReaction === type
        ? "border-emerald-500 bg-emerald-500/15 text-emerald-300"
        : "border-slate-700 bg-slate-900/70 text-slate-300 hover:bg-slate-800/80"
    }`;

  return (
    <div className="relative">
      {featuredBadge && (
        <span className="absolute z-20 top-3 left-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-emerald-950 shadow-lg">
          {featuredBadge}
        </span>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 shadow-[0_18px_45px_rgba(0,0,0,0.6)] hover:shadow-[0_22px_60px_rgba(16,185,129,0.35)] transition-all duration-300 hover:scale-[1.03]">
        {/* Only IMAGE is clickable */}
        <Link href={href} className="block">
          <div className="aspect-square overflow-hidden bg-slate-900">
            {meme.mediaType === "video" ? (
              <video
                src={meme.videoUrl || imageUrl}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={imageUrl}
                alt={meme.title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%2308181f' width='400' height='400'/%3E%3Ctext fill='%236b7280' font-family='system-ui' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage not available%3C/text%3E%3C/svg%3E";
                }}
              />
            )}
          </div>
        </Link>

        {/* Info + reactions (not clickable for navigation) */}
        <div className="space-y-3 px-4 py-4 bg-gradient-to-b from-slate-950/90 to-slate-900/80">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="flex-1 text-sm font-semibold text-slate-50 line-clamp-2">
              {meme.title}
            </h3>
            <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
              {meme.category}
            </span>
          </div>

          <div className="flex mt-2 items-center justify-between gap-2 text-[11px]">
            {/* clickable reactions */}
            <div className="flex flex-wrap gap-2 text-slate-300">
              <button
                type="button"
                className={pillClasses("likes")}
                onClick={(e) => handleReactionClick(e, "likes")}
                disabled={isReacting}
              >
                <ThumbsUp className={iconClasses("likes")} />
                {reactions.likes || 0}
              </button>

              <button
                type="button"
                className={pillClasses("laughs")}
                onClick={(e) => handleReactionClick(e, "laughs")}
                disabled={isReacting}
              >
                <Laugh className={iconClasses("laughs")} />
                {reactions.laughs || 0}
              </button>
            </div>

            <div className="flex flex-col items-end gap-1 text-[11px] text-slate-400">
              <button
                type="button"
                className={pillClasses("wows")}
                onClick={(e) => handleReactionClick(e, "wows")}
                disabled={isReacting}
              >
                <Eye className={iconClasses("wows")} />
                {reactions.wows || 0}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
