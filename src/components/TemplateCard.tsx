import Link from "next/link";
import { motion } from "framer-motion";
import { Template } from "@/models/Template";

interface Props {
  template: Template;
}

export function TemplateCard({ template }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-surface rounded-2xl shadow-soft overflow-hidden"
    >
      <img
        src={template.imageUrl}
        alt={template.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold">{template.name}</h3>
        <span className="bg-primary text-background px-2 py-1 rounded-full text-sm">
          {template.category}
        </span>
        <Link
          href={`/upload?template=${template._id}`}
          className="block mt-2 bg-primary p-2 rounded-xl text-center"
        >
          Use Template
        </Link>
      </div>
    </motion.div>
  );
}
