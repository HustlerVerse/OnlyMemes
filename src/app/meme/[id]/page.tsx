"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ReactionBar } from "@/components/ReactionBar";
import { MemeCard } from "@/components/MemeCard";
import { useSession } from "next-auth/react";
import { Meme, User as UserType } from "@/models/Meme"; // Types

export default function MemeDetail() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [meme, setMeme] = useState<Meme | null>(null);
  const [uploader, setUploader] = useState<UserType | null>(null);
  const [relatedMemes, setRelatedMemes] = useState<Meme[]>([]);

  useEffect(() => {
    fetch(`/api/memes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMeme(data);
        fetch(`/api/users/${data.ownerId}`)
          .then((res) => res.json())
          .then(setUploader);
        fetch(`/api/memes/category/${data.category}`)
          .then((res) => res.json())
          .then((rels) =>
            setRelatedMemes(rels.filter((r: Meme) => r._id !== id))
          );
        fetch(`/api/memes/${id}/view`, { method: "PATCH" });
      });
  }, [id]);

  const handleDownload = () => {
    if (meme) {
      fetch(`/api/memes/${id}/download`, { method: "PATCH" });
      const a = document.createElement("a");
      a.href = meme.imageUrl;
      a.download = meme.title;
      a.click();
    }
  };

  const handleShare = () => {
    fetch(`/api/memes/${id}/share`, { method: "PATCH" });
    // Popover logic here, for simplicity alert
    alert("Share link copied!");
  };

  if (!meme) return <p>Loading...</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-4"
    >
      <img
        src={meme.imageUrl}
        alt={meme.title}
        className="w-full rounded-2xl mb-4"
      />
      <h1 className="text-3xl font-bold">{meme.title}</h1>
      <p className="mt-2">{meme.description}</p>
      <div className="flex items-center mt-2">
        <span className="bg-primary text-background px-2 py-1 rounded-full text-sm">
          {meme.category}
        </span>
        <span className="ml-4 text-sm">Tags: {meme.tags.join(", ")}</span>
      </div>
      <div className="flex items-center mt-4">
        <img
          src={uploader?.image}
          alt="Uploader"
          className="w-10 h-10 rounded-full"
        />
        <span className="ml-2">By @{uploader?.username}</span>
        <span className="ml-auto text-sm">
          {new Date(meme.createdAt).toLocaleDateString()}
        </span>
      </div>
      {session && <ReactionBar memeId={id} reactions={meme.reactions} />}
      <div className="mt-4 space-x-4">
        <button onClick={handleDownload} className="bg-primary p-2 rounded-xl">
          Download
        </button>
        <button onClick={handleShare} className="bg-surface p-2 rounded-xl">
          Share
        </button>
      </div>
      <h2 className="text-2xl font-bold mt-8">More like this</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {relatedMemes.map((rel) => (
          <MemeCard key={rel._id} meme={rel} />
        ))}
      </div>
    </motion.div>
  );
}
