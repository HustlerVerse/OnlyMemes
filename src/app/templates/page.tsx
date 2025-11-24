"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TemplateCard } from "@/components/TemplateCard";
import { Template } from "@/models/Template";

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then(setTemplates);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-4"
    >
      <h1 className="text-4xl font-bold mb-6">Meme Templates</h1>
      <p className="mb-4">Choose a template and create your own meme</p>
      {templates.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <TemplateCard key={template._id} template={template} />
          ))}
        </div>
      ) : (
        <p>No templates available yet.</p>
      )}
    </motion.div>
  );
}
