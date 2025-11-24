"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TemplateCard } from "@/components/TemplateCard";
import type { TemplateCardData } from "@/types/template";
import { placeholderTemplates } from "@/data/placeholders";
import { Sparkles } from "lucide-react";

export default function Templates() {
  const [templates, setTemplates] = useState<TemplateCardData[]>(
    placeholderTemplates
  );

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setTemplates(data);
        }
      })
      .catch(() => setTemplates(placeholderTemplates));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-4"
    >
      <div className="mb-10 text-center space-y-3">
        <Sparkles className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-4xl font-bold">Meme Templates</h1>
        <p className="text-slate-400">
          Choose a template and remix it with your own flavor.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {templates.slice(0, 8).map((template) => (
          <TemplateCard key={template._id} template={template} />
        ))}
      </div>
    </motion.div>
  );
}
