"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MemeCard } from "@/components/MemeCard";
import type { UIMeme } from "@/types/meme";
import { Calendar, Image } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Profile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [memes, setMemes] = useState<UIMeme[]>([]);

  const fetchUserMemes = async (userId: string) => {
    try {
      const res = await fetch(`/api/memes?ownerId=${userId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMemes(data);
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
        {/* Profile Header */}
        <div className="rounded-2xl border border-white/10 bg-card/70 p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="h-32 w-32 rounded-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary">
              {session.user?.name?.[0]?.toUpperCase() || "U"}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {session.user?.name || "User"}
              </h1>
              {session.user?.email && (
                <p className="text-muted-foreground mb-4">{session.user.email}</p>
              )}
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Image className="h-4 w-4" />
                  {memes.length} memes
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined recently
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-foreground"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* User's Memes */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Memes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme) => (
              <MemeCard key={meme._id} meme={meme} />
            ))}
          </div>
          {memes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No memes uploaded yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
