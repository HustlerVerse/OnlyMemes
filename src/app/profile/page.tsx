"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MemeCard } from "@/components/MemeCard";
import { placeholderMemes } from "@/data/placeholders";
import type { UIMeme } from "@/types/meme";
import { CalendarDays, Edit3 } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [memes, setMemes] = useState<UIMeme[]>(placeholderMemes.slice(0, 2));

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth");
      return;
    }

    fetch(`/api/memes?ownerId=${session.user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setMemes(data);
        }
      })
      .catch(() => setMemes(placeholderMemes.slice(0, 2)));
  }, [router, session, status]);

  if (status === "loading" || !session) {
    return <p className="text-center py-20">Loading profile...</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-10"
    >
      <div className="rounded-3xl border border-white/10 bg-card/70 p-8 shadow-soft flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-3xl font-bold text-primary">
            {session.user?.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {session.user?.name ?? "Meme Legend"}
            </h1>
            <p className="text-slate-400">{session.user?.email}</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-400">
              <CalendarDays className="h-4 w-4" />
              Joined recently
            </p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:border-primary/60">
          <Edit3 className="h-4 w-4" /> Edit Profile
        </button>
      </div>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold">Memes</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {memes.slice(0, 8).map((meme) => (
            <MemeCard key={meme._id} meme={meme} />
          ))}
        </div>
      </section>
    </motion.div>
  );
}
