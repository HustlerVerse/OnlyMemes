import Link from "next/link";
import { motion } from "framer-motion";
import type { TemplateCardData } from "@/types/template";

interface Props {
  template: TemplateCardData;
}

export function TemplateCard({ template }: Props) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl overflow-hidden border border-white/10 bg-card/70 backdrop-blur-xl shadow-2xl shadow-primary/5"
    >
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={template.imageUrl}
          alt={template.name}
          className="h-full w-full object-cover transition duration-500 hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <span className="absolute bottom-4 left-4 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-slate-900">
          {template.category}
        </span>
      </div>
      <div className="space-y-3 p-5">
        <h3 className="text-xl font-semibold">{template.name}</h3>
        {template.tags && (
          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
            {template.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-white/5 px-2 py-1">
                {tag}
              </span>
            ))}
          </div>
        )}
        <Link
          href={`/upload?template=${template._id}`}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 font-semibold text-slate-900 shadow-glow hover:-translate-y-0.5 transition"
        >
          Use Template
        </Link>
      </div>
    </motion.div>
  );
}
