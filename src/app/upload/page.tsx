"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Upload() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = (useState < File) | (null > null);
  const [error, setError] = useState("");

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/api/auth/signin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError("Please upload an image");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("image", file);

    const res = await fetch("/api/memes", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      router.push(`/meme/${data._id}`);
    } else {
      setError("Upload failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto p-4"
    >
      <h1 className="text-3xl font-bold mb-6">Upload Meme</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full p-2 bg-surface border border-slate-700 rounded-xl"
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 bg-surface border border-slate-700 rounded-xl focus:border-primary"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 bg-surface border border-slate-700 rounded-xl focus:border-primary"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 bg-surface border border-slate-700 rounded-xl focus:border-primary"
        >
          <option value="">Select Category</option>
          <option value="Funny">Funny</option>
          <option value="Relatable">Relatable</option>
          {/* Add more */}
        </select>
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-3 bg-surface border border-slate-700 rounded-xl focus:border-primary"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-primary text-background p-3 rounded-xl hover:scale-105 transition"
        >
          Upload
        </button>
      </form>
    </motion.div>
  );
}
