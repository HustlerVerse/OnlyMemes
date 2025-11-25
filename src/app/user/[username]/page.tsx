"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { MemeCard } from "@/components/MemeCard";
import type { UIUser } from "@/types/user";
import type { UIMeme } from "@/types/meme";

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState<UIUser | null>(null);
  const [memes, setMemes] = useState<UIMeme[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/users/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        return fetch(`/api/memes?ownerId=${data._id}`);
      })
      .then((res) => res.json())
      .then((memesData) => {
        if (Array.isArray(memesData)) {
          setMemes(memesData);
        }
      })
      .catch((err: Error) => {
        setError(err.message || "Unable to load profile");
      });
  }, [username]);

  if (!user && !error) return <p>Loading...</p>;
  if (error) return <p className="text-center py-20 text-red-400">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-4"
    >
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-card/70 p-6 shadow-soft md:flex-row md:items-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 text-4xl font-bold text-primary">
          {user?.name?.[0]?.toUpperCase() ?? "M"}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user?.name || "User"}</h1>
          <p className="text-slate-400">@{user?.username || "user"}</p>
          <p className="text-sm text-slate-500">
            Joined:{" "}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "Recently"}
          </p>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4 mt-10">Memes</h2>
      {memes.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {memes.map((meme) => (
            <MemeCard key={meme._id} meme={meme} />
          ))}
        </div>
      ) : (
        <p className="text-slate-400">{user?.name || "User"} has not uploaded any memes yet.</p>
      )}
    </motion.div>
  );
}
