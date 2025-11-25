"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import type { TemplateCardData } from "@/types/template";
import { Image as ImageIcon, Sparkles } from "lucide-react";

export default function Templates() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      if (Array.isArray(data)) {
        setTemplates(data);
      }
    } catch (error) {
      console.error("Failed to fetch templates", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchTemplates();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Meme Templates
          </h1>
          <p className="text-muted-foreground">
            Choose a template and create your own meme
          </p>
        </div>
        {/* Templates Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading templates...</p>
          </div>
        ) : templates.length > 0 ? (
          <motion.div
            id="templates-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {templates.map((template, index) => (
              <motion.div
                key={template._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/70 hover:border-primary/30 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-primary/30"
              >
                <div className="aspect-square overflow-hidden bg-muted relative">
                  <img
                    src={template.imageUrl}
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23333' width='400' height='400'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ETemplate%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-4 space-y-3 bg-card/95 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground line-clamp-1 flex-1">
                      {template.name}
                    </h3>
                    <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground shrink-0">
                      {template.category}
                    </span>
                  </div>

                  <button
                    onClick={() => router.push("/upload")}
                    className="w-full px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2 flex items-center justify-center font-semibold transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Use Template
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">
              No templates available yet.
            </p>
            <Link
              href="/upload"
              className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-colors"
            >
              Upload Your First Template
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
