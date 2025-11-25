"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Upload as UploadIcon, Image } from "lucide-react";

const categories = [
  "Funny",
  "Relatable",
  "Anime",
  "Dark Humor",
  "Wholesome",
  "Tech",
];

export default function Upload() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Funny");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      setError("Please login to upload memes");
      router.push("/auth");
      return;
    }
  }, [session, status, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session || !imageFile) return;

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("tags", tags);
      formData.append("image", imageFile);

      const res = await fetch("/api/memes", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to upload meme");
      }

      const memeData = await res.json();
      router.push(`/meme/${memeData._id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload meme";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-white/10 bg-card/70 p-6 shadow-soft">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Upload Meme
            </h1>
            <p className="text-muted-foreground">
              Share your meme with the community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <label
                htmlFor="image"
                className="text-sm font-medium text-foreground"
              >
                Meme Image *
              </label>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-primary transition-colors">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-foreground"
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <label htmlFor="image" className="cursor-pointer">
                    <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      PNG, JPG, GIF, MP4 up to 20MB
                    </p>
                    <input
                      id="image"
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-medium text-foreground"
              >
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your meme a catchy title"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-foreground"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add context or a funny caption (optional)"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="text-sm font-medium text-foreground"
              >
                Category *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-primary"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label
                htmlFor="tags"
                className="text-sm font-medium text-foreground"
              >
                Tags
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="funny, relatable, cats (comma separated)"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2 flex items-center justify-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !imageFile}
            >
              <UploadIcon className="h-5 w-5" />
              {isLoading ? "Uploading..." : "Upload Meme"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
