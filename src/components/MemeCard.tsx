"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ThumbsUp } from "lucide-react";
import type { UIMeme } from "@/types/meme";

interface Props {
  meme: UIMeme;
  showEditDelete?: boolean;
  featuredBadge?: string;
  onReactionUpdate?: (memeId: string, reactions: UIMeme["reactions"], isLiked: boolean) => void;
}

export function MemeCard({ meme, featuredBadge, onReactionUpdate }: Props) {
  const { data: session } = useSession();
  const [localReactions, setLocalReactions] = useState(meme.reactions || {
    likes: 0,
    laughs: 0,
    wows: 0,
    sads: 0,
    dislikes: 0,
  });
  const [isLiked, setIsLiked] = useState(meme.isLiked || false);
  const [isReacting, setIsReacting] = useState(false);

  const href = `/meme/${meme._id}`;
  const imageUrl = meme.memeUrl || meme.imageUrl;

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session) {
      alert("Please login to like");
      return;
    }

    if (isReacting) return;
    setIsReacting(true);

    // Optimistic update
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? (localReactions.likes || 0) + 1 : Math.max(0, (localReactions.likes || 0) - 1);
    
    setIsLiked(newIsLiked);
    setLocalReactions((prev) => ({
      ...prev,
      likes: newLikes,
    }));

    try {
      const res = await fetch(`/api/memes/${meme._id}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reactionType: "likes" }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reactions) {
          setLocalReactions(data.reactions);
          setIsLiked(data.isLiked);
          if (onReactionUpdate) {
            onReactionUpdate(meme._id, data.reactions, data.isLiked);
          }
        }
      } else {
        // Revert optimistic update on error
        setIsLiked(!newIsLiked);
        setLocalReactions((prev) => ({
          ...prev,
          likes: localReactions.likes || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to react", error);
      // Revert optimistic update on error
      setIsLiked(!newIsLiked);
      setLocalReactions((prev) => ({
        ...prev,
        likes: localReactions.likes || 0,
      }));
    } finally {
      setIsReacting(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/80 hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-black/30 hover:shadow-2xl hover:shadow-primary/30 group">
      {featuredBadge && (
        <span className="absolute top-3 left-3 z-30 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg backdrop-blur-sm">
          {featuredBadge}
        </span>
      )}
      
      {/* Clickable Image Section */}
      <Link href={href} className="block relative">
        <div className="aspect-square overflow-hidden bg-muted relative cursor-pointer">
          {meme.mediaType === "video" ? (
            <video
              src={meme.videoUrl || imageUrl}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              muted
              loop
              playsInline
              onError={(e) => {
                const target = e.target as HTMLVideoElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <img
              src={imageUrl}
              alt={meme.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23333' width='400' height='400'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage not available%3C/text%3E%3C/svg%3E";
              }}
            />
          )}
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
      
      {/* Card Info Section - Not clickable */}
      <div className="p-4 bg-card/95 backdrop-blur-sm space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-foreground line-clamp-2 flex-1">{meme.title}</h3>
          <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground whitespace-nowrap">
            {meme.category}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className={`flex items-center gap-2 text-sm font-semibold ${isLiked ? "text-primary" : "text-muted-foreground"}`}>
            <ThumbsUp className={`h-4 w-4 ${isLiked ? "fill-primary text-primary" : ""}`} />
            <span>{localReactions.likes || 0} {localReactions.likes === 1 ? "like" : "likes"}</span>
          </div>

          <button
            onClick={handleLike}
            disabled={isReacting}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 border transition-all text-sm font-semibold disabled:opacity-60 ${
              isLiked
                ? "bg-primary/20 border-primary/40 text-primary hover:bg-primary/30"
                : "bg-slate-900/70 border-white/10 text-white hover:bg-white/10"
            }`}
            title={isLiked ? "Unlike" : "Like"}
          >
            <ThumbsUp className={`h-4 w-4 ${isLiked ? "fill-primary text-primary" : ""}`} />
            {isLiked ? "Unlike" : "Like"}
          </button>
        </div>
      </div>
    </div>
  );
}
