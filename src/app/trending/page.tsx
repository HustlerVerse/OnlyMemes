"use client";

import { useEffect, useState } from "react";
import { MemeCard } from "@/components/MemeCard";
import type { UIMeme } from "@/types/meme";
import { TrendingUp } from "lucide-react";

export default function Trending() {
  const [memes, setMemes] = useState<UIMeme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrendingMemes();
  }, []);

  const fetchTrendingMemes = async () => {
    try {
      const res = await fetch("/api/memes/trending");
      const data = await res.json();
      if (Array.isArray(data)) {
        setMemes(data);
      }
    } catch (error) {
      console.error("Failed to fetch trending memes", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Trending Memes</h1>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading trending memes...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {memes.map((meme, index) => (
                <MemeCard
                  key={meme._id}
                  meme={meme}
                  featuredBadge={index < 3 ? `#${index + 1} Trending` : undefined}
                />
              ))}
            </div>
            {memes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No trending memes yet. Be the first to upload!
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
