"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { MemeCard } from "@/components/MemeCard";
import type { UIUser } from "@/types/user";
import type { UIMeme } from "@/types/meme";
import { placeholderMemes } from "@/data/placeholders";

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState<UIUser | null>(null);
  const [memes, setMemes] = useState<UIMeme[]>(placeholderMemes.slice(0, 2));

  useEffect(() => {
    fetch(`/api/users/${username}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        fetch(`/api/memes?ownerId=${data._id}`)
          .then((res) => res.json())
          .then((memesData) => {
            if (Array.isArray(memesData) && memesData.length) {
              setMemes(memesData);
            }
          })
          .catch(() => setMemes(placeholderMemes.slice(0, 2)));
      })
      .catch(() =>
        setUser({
          _id: "placeholder-user",
          name: "Meme Creator",
          username: username as string,
          email: "creator@example.com",
        })
      );
  }, [username]);

  if (!user) return <p>Loading...</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-4"
    >
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-card/70 p-6 shadow-soft md:flex-row md:items-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 text-4xl font-bold text-primary">
          {user.name?.[0]?.toUpperCase() ?? "M"}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-slate-400">@{user.username}</p>
          <p className="text-sm text-slate-500">
            Joined:{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "Recently"}
          </p>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4 mt-10">Memes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {memes.slice(0, 8).map((meme) => (
          <MemeCard key={meme._id} meme={meme} />
        ))}
      </div>
    </motion.div>
  );
}
