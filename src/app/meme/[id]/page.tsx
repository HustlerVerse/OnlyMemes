"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { MemeCard } from "@/components/MemeCard";
import type { UIMeme } from "@/types/meme";
import type { UIUser } from "@/types/user";
import {
  ThumbsUp,
  Download,
  Share2,
  Calendar,
  Laugh,
  Eye,
  Frown,
  ThumbsDown,
} from "lucide-react";

type ReactionKey = "likes" | "laughs" | "wows" | "sads" | "dislikes";

export default function MemePage() {
  const { id } = useParams();
  const { data: session } = useSession();

  const [meme, setMeme] = useState<UIMeme | null>(null);
  const [uploader, setUploader] = useState<UIUser | null>(null);
  const [relatedMemes, setRelatedMemes] = useState<UIMeme[]>([]);
  const [reactions, setReactions] = useState({
    likes: 0,
    laughs: 0,
    wows: 0,
    sads: 0,
    dislikes: 0,
  });
  const [activeReaction, setActiveReaction] = useState<ReactionKey | null>(
    null
  );
  const [isReacting, setIsReacting] = useState(false);

  const fetchMeme = async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/memes/${id}`);
      const data: UIMeme & {
        isLiked?: boolean;
        userReaction?: ReactionKey;
      } = await res.json();

      if (data) {
        setMeme(data);
        setReactions(
          data.reactions || {
            likes: 0,
            laughs: 0,
            wows: 0,
            sads: 0,
            dislikes: 0,
          }
        );

        if (data.userReaction) {
          setActiveReaction(data.userReaction);
        } else if (data.isLiked) {
          setActiveReaction("likes");
        } else {
          setActiveReaction(null);
        }

        if (data.ownerId) {
          fetch(`/api/users/${data.ownerId}`)
            .then((r) => r.json())
            .then(setUploader)
            .catch(() => setUploader(null));
        }

        if (data.category) {
          fetch(`/api/memes/category/${data.category}`)
            .then((r) => r.json())
            .then((rels: UIMeme[]) =>
              setRelatedMemes(
                (rels || []).filter((r) => r._id !== id).slice(0, 3)
              )
            )
            .catch(() => setRelatedMemes([]));
        }

        // count view (no await)
        fetch(`/api/memes/${id}/view`, { method: "PATCH" }).catch(() => {});
      }
    } catch (error) {
      console.error("Failed to fetch meme", error);
    }
  };

  useEffect(() => {
    if (id) {
      void fetchMeme();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const sendReaction = async (
    type: ReactionKey,
    nextActive: ReactionKey | null
  ) => {
    try {
      const res = await fetch(`/api/memes/${id}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reactionType: type }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reactions) {
          setReactions(data.reactions);
        }
        if (data.userReaction) {
          setActiveReaction(data.userReaction as ReactionKey);
        } else {
          setActiveReaction(nextActive);
        }
      } else {
        setActiveReaction(nextActive);
      }
    } catch (error) {
      console.error("Failed to update reaction", error);
      setActiveReaction(nextActive);
    } finally {
      setIsReacting(false);
    }
  };

  const handleReaction = async (type: ReactionKey) => {
    if (!session) {
      alert("Please login to react");
      return;
    }
    if (!meme || !id) return;
    if (isReacting) return;

    setIsReacting(true);

    // optimistic update
    setReactions((prev) => {
      const next = { ...prev };

      if (activeReaction && activeReaction !== type) {
        next[activeReaction] = Math.max(0, (next[activeReaction] || 0) - 1);
      }

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

  const handleDownload = async () => {
    if (!meme || !id) return;

    try {
      const url = meme.videoUrl || meme.memeUrl || meme.imageUrl;
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${meme.title}.${
        meme.mediaType === "video" ? "mp4" : "jpg"
      }`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      await fetch(`/api/memes/${id}/download`, { method: "PATCH" });
    } catch (error) {
      console.error("Failed to download meme", error);
    }
  };

  const handleShare = async () => {
    try {
      await fetch(`/api/memes/${id}/share`, { method: "PATCH" });
      if (navigator.clipboard && document.hasFocus()) {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } else {
        const url = window.location.href;
        prompt("Copy this link:", url);
      }
    } catch (error) {
      console.error("Failed to share", error);
      const url = window.location.href;
      prompt("Copy this link:", url);
    }
  };

  if (!meme) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  const totalReactions =
    (reactions.likes || 0) +
    (reactions.laughs || 0) +
    (reactions.wows || 0) +
    (reactions.sads || 0) +
    (reactions.dislikes || 0);

  const pillClasses = (type: ReactionKey) =>
    `flex-1 min-w-[90px] flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
      activeReaction === type
        ? "border-emerald-500 bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
        : "border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
    }`;

  const iconClasses = (type: ReactionKey) =>
    `h-4 w-4 ${
      activeReaction === type ? "text-emerald-950" : "text-slate-200"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Title and category at top of image */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300 border border-emerald-500/40">
                  {meme.category}
                </span>
                {meme.tags &&
                  meme.tags.length > 0 &&
                  meme.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
              </div>
              <h1 className="text-2xl font-bold text-slate-50">{meme.title}</h1>
            </div>

            {/* Meme media */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 shadow-[0_18px_45px_rgba(0,0,0,0.7)]">
              {meme.mediaType === "video" ? (
                <video
                  src={meme.videoUrl || meme.memeUrl || meme.imageUrl}
                  controls
                  className="w-full"
                />
              ) : (
                <img
                  src={meme.memeUrl || meme.imageUrl}
                  alt={meme.title}
                  className="w-full"
                />
              )}
            </div>

            {/* Reactions */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className={pillClasses("likes")}
                  onClick={() => handleReaction("likes")}
                  disabled={isReacting}
                >
                  <ThumbsUp className={iconClasses("likes")} />
                  {reactions.likes || 0}
                </button>
                <button
                  type="button"
                  className={pillClasses("laughs")}
                  onClick={() => handleReaction("laughs")}
                  disabled={isReacting}
                >
                  <Laugh className={iconClasses("laughs")} />
                  {reactions.laughs || 0}
                </button>
                <button
                  type="button"
                  className={pillClasses("wows")}
                  onClick={() => handleReaction("wows")}
                  disabled={isReacting}
                >
                  <Eye className={iconClasses("wows")} />
                  {reactions.wows || 0}
                </button>
                <button
                  type="button"
                  className={pillClasses("sads")}
                  onClick={() => handleReaction("sads")}
                  disabled={isReacting}
                >
                  <Frown className={iconClasses("sads")} />
                  {reactions.sads || 0}
                </button>
                <button
                  type="button"
                  className={pillClasses("dislikes")}
                  onClick={() => handleReaction("dislikes")}
                  disabled={isReacting}
                >
                  <ThumbsDown className={iconClasses("dislikes")} />
                  {reactions.dislikes || 0}
                </button>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                {totalReactions} total reactions
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-800 transition-all"
              >
                <Download className="h-4 w-4" />
                Download ({meme.downloads || 0})
              </button>
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-800 transition-all"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* info card */}
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/85 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
              <h2 className="text-lg font-semibold text-slate-50">
                Meme details
              </h2>

              {meme.description && (
                <p className="text-sm text-slate-300">{meme.description}</p>
              )}

              <div className="mt-4 flex items-center gap-3 border-t border-slate-800 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-semibold text-emerald-300">
                  {uploader?.name?.[0]?.toUpperCase() ||
                    uploader?.username?.[0]?.toUpperCase() ||
                    "U"}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-100">
                    {uploader?.username || uploader?.name || "Unknown"}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="h-3 w-3" />
                    {meme.createdAt
                      ? new Date(meme.createdAt).toLocaleDateString()
                      : "Recently"}
                  </p>
                </div>
              </div>
            </div>

            {/* Related memes */}
            {relatedMemes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-50">
                  More like this
                </h3>
                <div className="space-y-4">
                  {relatedMemes.map((related) => (
                    <MemeCard key={related._id} meme={related} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
