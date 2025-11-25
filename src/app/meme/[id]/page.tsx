"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { MemeCard } from "@/components/MemeCard";
import type { UIMeme } from "@/types/meme";
import type { UIUser } from "@/types/user";
import { ThumbsUp, Download, Share2, Calendar } from "lucide-react";

export default function MemePage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [meme, setMeme] = useState<UIMeme | null>(null);
  const [uploader, setUploader] = useState<UIUser | null>(null);
  const [relatedMemes, setRelatedMemes] = useState<UIMeme[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [reactions, setReactions] = useState({
    likes: 0,
    laughs: 0,
    wows: 0,
    sads: 0,
    dislikes: 0,
  });

  const fetchMeme = async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/memes/${id}`);
      const data = await res.json();
      if (data) {
        setMeme(data);
        setIsLiked(data.isLiked || false);
        setReactions(data.reactions || {
          likes: 0,
          laughs: 0,
          wows: 0,
          sads: 0,
          dislikes: 0,
        });
        if (data.ownerId) {
        fetch(`/api/users/${data.ownerId}`)
          .then((res) => res.json())
            .then(setUploader)
            .catch(() => setUploader(null));
        }
        if (data.category) {
        fetch(`/api/memes/category/${data.category}`)
          .then((res) => res.json())
          .then((rels) =>
              setRelatedMemes((rels || []).filter((r: UIMeme) => r._id !== id).slice(0, 3))
            )
            .catch(() => setRelatedMemes([]));
        }
        fetch(`/api/memes/${id}/view`, { method: "PATCH" });
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

  const handleLike = async () => {
    if (!session) {
      alert("Please login to like");
      return;
    }
    if (!meme || !id) return;
    
    // Optimistic update
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? (reactions.likes || 0) + 1 : Math.max(0, (reactions.likes || 0) - 1);
    
    setIsLiked(newIsLiked);
    setReactions((prev) => ({
      ...prev,
      likes: newLikes,
    }));

    try {
      const res = await fetch(`/api/memes/${id}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reactionType: "likes" }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reactions) {
          setReactions(data.reactions);
          setIsLiked(data.isLiked);
        }
      } else {
        // Revert optimistic update on error
        setIsLiked(!newIsLiked);
        setReactions((prev) => ({
          ...prev,
          likes: reactions.likes || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to update reaction", error);
      // Revert optimistic update on error
      setIsLiked(!newIsLiked);
      setReactions((prev) => ({
        ...prev,
        likes: reactions.likes || 0,
      }));
    }
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
      a.download = `${meme.title}.${meme.mediaType === "video" ? "mp4" : "jpg"}`;
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
        // Fallback: show the URL in a prompt
        const url = window.location.href;
        prompt("Copy this link:", url);
      }
    } catch (error) {
      console.error("Failed to share", error);
      // Fallback: show the URL in a prompt
      const url = window.location.href;
      prompt("Copy this link:", url);
    }
  };

  if (!meme) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-card/70 overflow-hidden">
              <div className="p-0">
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
            </div>

            {/* Like Button */}
            <div className="rounded-2xl border border-white/10 bg-card/70 p-6">
              <button
                onClick={handleLike}
                className={`w-full px-6 py-3 rounded-xl gap-2 flex items-center justify-center font-semibold transition-all ${
                  isLiked
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-white/5 border border-white/10 hover:bg-white/10 text-foreground"
                }`}
              >
                <ThumbsUp className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? "Liked" : "Like"} ({reactions.likes || 0})
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 gap-2 flex items-center justify-center"
              >
                <Download className="h-4 w-4" />
                Download ({meme.downloads || 0})
        </button>
              <button
                onClick={handleShare}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 gap-2 flex items-center justify-center"
              >
                <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-card/70 p-6 space-y-4">
              <h1 className="text-2xl font-bold text-foreground">{meme.title}</h1>

              {meme.description && (
                <p className="text-muted-foreground">{meme.description}</p>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                  {meme.category}
                </span>
                {meme.tags && meme.tags.length > 0 && meme.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  {uploader?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {uploader?.username || uploader?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {meme.createdAt
                      ? new Date(meme.createdAt).toLocaleDateString()
                      : "Recently"}
                  </p>
                </div>
              </div>
            </div>

            {/* Related Memes */}
            {relatedMemes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">More like this</h3>
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
