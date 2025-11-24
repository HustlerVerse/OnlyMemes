"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#020817] text-white">
      {/* Hero Section */}
      <section className="w-full py-28 flex flex-col items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-6"
        >
          <span className="px-4 py-2 rounded-full bg-[#0f172a] text-[#22c55e] border border-[#22c55e]/30 text-sm font-medium">
            The Ultimate Meme Platform
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold leading-tight"
        >
          Discover, Create & Share <br />
          <span className="text-[#22c55e]">Epic Memes</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-300 mt-4 max-w-2xl"
        >
          Join the most vibrant meme community. Upload your creations, react to
          others, and become a meme legend.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 flex gap-4"
        >
          <Link
            href="/explore"
            className="px-6 py-3 rounded-lg bg-[#22c55e] text-black font-semibold hover:bg-[#1faa50] transition"
          >
            Explore Memes
          </Link>

          <Link
            href="/upload"
            className="px-6 py-3 rounded-lg border border-gray-600 hover:bg-gray-800 transition font-semibold flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 12h16m-8-8v16"
              />
            </svg>
            Upload Meme
          </Link>
        </motion.div>
      </section>

      {/* Trending Memes Section */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <span className="text-orange-400 text-4xl">🔥</span> Trending Memes
          </h2>

          <Link
            href="/trending"
            className="text-[#22c55e] hover:underline text-lg"
          >
            View All
          </Link>
        </div>

        {/* Placeholder section (empty UI stage) */}
        <div className="mt-8 text-gray-400 text-center border border-gray-800 py-16 rounded-xl">
          No trending memes yet.
        </div>
      </section>
    </div>
  );
}
