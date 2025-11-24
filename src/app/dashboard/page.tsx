"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MemeCard } from "@/components/MemeCard";
import { Meme } from "@/models/Meme";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [memes, setMemes] = useState<Meme[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/api/auth/signin");
    return null;
  }

  useEffect(() => {
    fetch(`/api/memes?ownerId=${session.user.id}`)
      .then((res) => res.json())
      .then(setMemes);
    fetch("/api/suggestions")
      .then((res) => res.json())
      .then(setSuggestions);
  }, [session]);

  const totalReactions = memes.reduce(
    (acc, m) => acc + Object.values(m.reactions).reduce((a, b) => a + b, 0),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-4"
    >
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface p-4 rounded-xl shadow-soft">
          <h3 className="text-xl">Total Memes</h3>
          <p className="text-3xl">{memes.length}</p>
        </div>
        <div className="bg-surface p-4 rounded-xl shadow-soft">
          <h3 className="text-xl">Total Reactions</h3>
          <p className="text-3xl">{totalReactions}</p>
        </div>
        {/* Add more stats */}
      </div>
      <h2 className="text-2xl font-bold mb-4">My Memes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {memes.map((meme) => (
          <MemeCard key={meme._id} meme={meme} showEditDelete />
        ))}
      </div>
      <h2 className="text-2xl font-bold mt-8 mb-4">Meme Suggestions</h2>
      <ul className="space-y-2">
        {suggestions.map((sug, i) => (
          <li key={i} className="bg-surface p-3 rounded-xl">
            {sug}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
