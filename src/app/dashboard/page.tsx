"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MemeCard } from "@/components/MemeCard";
import type { UIMeme } from "@/types/meme";
import { Image, ThumbsUp, Download, Trash2 } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [memes, setMemes] = useState<UIMeme[]>([]);
  const [stats, setStats] = useState({
    totalMemes: 0,
    totalReactions: 0,
    topMeme: null as UIMeme | null,
  });

  const fetchUserMemes = async (userId: string) => {
    try {
      const res = await fetch(`/api/memes?ownerId=${userId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMemes(data);
        const totalReactions = data.reduce(
          (sum, m) =>
            sum +
            (m.reactions?.likes || 0) +
            (m.reactions?.laughs || 0) +
            (m.reactions?.wows || 0) +
            (m.reactions?.sads || 0) +
            (m.reactions?.dislikes || 0),
          0
        );
        const topMeme =
          data.length > 0
            ? data.reduce((prev, curr) => {
                const prevScore =
                  (prev.reactions?.likes || 0) + (prev.reactions?.laughs || 0);
                const currScore =
                  (curr.reactions?.likes || 0) + (curr.reactions?.laughs || 0);
                return currScore > prevScore ? curr : prev;
              })
            : null;
        setStats({
          totalMemes: data.length,
          totalReactions,
          topMeme,
        });
      }
    } catch (error) {
      console.error("Failed to fetch memes", error);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth");
      return;
    }
    if (session.user?.id) {
      void fetchUserMemes(session.user.id);
    }
  }, [session, status, router]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this meme?")) return;
    try {
      // TODO: Implement delete API endpoint
      alert("Delete functionality coming soon");
      if (session?.user?.id) {
        void fetchUserMemes(session.user.id);
      }
    } catch (error) {
      console.error("Failed to delete meme", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">My Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-2xl border border-white/10 bg-card/70 p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Total Memes</p>
              <Image className="h-4 w-4 text-primary" aria-label="Total Memes" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.totalMemes}</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-card/70 p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Total Reactions</p>
              <ThumbsUp className="h-4 w-4 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.totalReactions}</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-card/70 p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Most Popular</p>
              <Download className="h-4 w-4 text-primary" />
            </div>
            <div className="text-lg font-bold text-foreground truncate">
              {stats.topMeme?.title || "N/A"}
            </div>
          </div>
        </div>

        {/* My Memes */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">My Memes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme) => (
              <div key={meme._id} className="relative group">
                <MemeCard meme={meme} />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete();
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-red-500/90 hover:bg-red-500 text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          {memes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                You haven&apos;t uploaded any memes yet.
              </p>
              <button
                onClick={() => router.push("/upload")}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                Upload Your First Meme
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
