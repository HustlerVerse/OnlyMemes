import Link from "next/link";
import { motion } from "framer-motion";
import { Meme } from "@/models/Meme";
import { Trash, Edit } from "lucide-react";

interface Props {
  meme: Meme;
  showEditDelete?: boolean;
}

export function MemeCard({ meme, showEditDelete }: Props) {
  const totalReactions = Object.values(meme.reactions).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-surface rounded-2xl shadow-soft overflow-hidden"
    >
      <Link href={`/meme/${meme._id}`}>
        <img
          src={meme.imageUrl}
          alt={meme.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-bold">{meme.title}</h3>
          <span className="bg-primary text-background px-2 py-1 rounded-full text-sm">
            {meme.category}
          </span>
          <p className="text-sm mt-2">Reactions: {totalReactions}</p>
        </div>
      </Link>
      {showEditDelete && (
        <div className="flex justify-end p-2 space-x-2">
          <Edit className="w-4 h-4 cursor-pointer" />
          <Trash
            className="w-4 h-4 cursor-pointer"
            onClick={() => {
              /* Delete logic */
            }}
          />
        </div>
      )}
    </motion.div>
  );
}
