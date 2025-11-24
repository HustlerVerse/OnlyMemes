"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { User } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-background p-4 shadow-soft">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          MemeVerse
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-primary transition">
            Home
          </Link>
          <Link href="/explore" className="hover:text-primary transition">
            Explore
          </Link>
          <Link href="/trending" className="hover:text-primary transition">
            Trending
          </Link>
          <Link href="/templates" className="hover:text-primary transition">
            Templates
          </Link>
          {session && (
            <Link href="/dashboard" className="hover:text-primary transition">
              Dashboard
            </Link>
          )}
        </div>
        <div>
          {session ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-2"
            >
              <User className="w-6 h-6" />
              <span>{session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="text-sm hover:text-primary"
              >
                Logout
              </button>
            </motion.div>
          ) : (
            <div className="space-x-4">
              <button
                onClick={() => signIn()}
                className="bg-primary px-4 py-2 rounded-xl"
              >
                Login
              </button>
              <Link
                href="/register"
                className="bg-surface px-4 py-2 rounded-xl"
              >
                Sign Up
              </Link>{" "}
              {/* Create register page */}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
