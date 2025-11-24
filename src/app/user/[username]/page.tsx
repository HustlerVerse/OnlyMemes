"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { MemeCard } from "@/components/MemeCard";
import { User as UserType } from "@/models/User"; // Assume export as type
import { Meme } from "@/models/Meme";

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState<UserType | null>(null);
  const [memes, setMemes] = useState<Meme[]>([]);

  useEffect(() => {
    // Assume API to fetch user by username
    fetch(`/api/users/${username}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        fetch(`/api/memes?ownerId=${data._id}`)
          .then((res) => res.json())
          .then(setMemes);
      });
  }, [username]);

  if (!user) return <p>Loading...</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-4"
    >
      <div className="flex items-center mb-6">
        <img
          src={user.image || "/placeholder-avatar.jpg"}
          alt="Avatar"
          className="w-20 h-20 rounded-full"
        />
        <div className="ml-4">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p>@{user.username}</p>
          <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">Memes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {memes.map((meme) => (
          <MemeCard key={meme._id} meme={meme} />
        ))}
      </div>
    </motion.div>
  );
}
