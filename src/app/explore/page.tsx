"use client";

import { useEffect, useState, Suspense } from "react";
import { MemeCard } from "@/components/MemeCard";
import type { UIMeme } from "@/types/meme";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

const categories = ["All", "Funny", "Relatable", "Anime", "Dark Humor", "Wholesome", "Tech"];

function ExploreContent() {
  const searchParams = useSearchParams();
  const [memes, setMemes] = useState<UIMeme[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category && categories.includes(category)) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const fetchMemes = async () => {
    setIsLoading(true);
    try {
      const url =
        selectedCategory === "All"
          ? "/api/memes"
          : `/api/memes/category/${selectedCategory}`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        let filtered = data;
        if (searchQuery) {
          filtered = data.filter((meme: UIMeme) =>
            meme.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setMemes(filtered);
      }
    } catch (error) {
      console.error("Failed to fetch memes", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchMemes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Explore Memes</h1>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search memes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-white/5 border border-white/10 text-foreground hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Memes Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading memes...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {memes.map((meme) => (
                <MemeCard key={meme._id} meme={meme} />
              ))}
            </div>
            {memes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No memes found. Try a different search or category.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function Explore() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
