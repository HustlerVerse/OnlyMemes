"use client";

import { motion } from "framer-motion";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const tabs = [
  { key: "login", label: "Login" },
  { key: "signup", label: "Sign Up" },
];

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState(searchParams.get("mode") ?? "login");
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
      callbackUrl: "/",
    });
    setIsSubmitting(false);
    if (res?.error) {
      setError("Invalid credentials. Try again.");
      return;
    }
    router.push("/");
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const payload = {
      name: form.name || form.username,
      username: form.username,
      email: form.email,
      password: form.password,
    };
    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Unable to register. Try again.");
      setIsSubmitting(false);
      return;
    }
    const loginRes = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
      callbackUrl: "/",
    });
    setIsSubmitting(false);
    if (loginRes?.error) {
      setError("Account created. Please login manually.");
      return;
    }
    router.push("/");
  };

  const renderForm = () => {
    if (mode === "login") {
      return (
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="text-sm text-slate-400">Email</label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-primary/80 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400">Password</label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-primary/80 focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-primary py-3 font-semibold text-slate-900 shadow-glow disabled:opacity-70"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      );
    }

    return (
      <form className="space-y-5" onSubmit={handleSignup}>
        <div>
          <label className="text-sm text-slate-400">Username</label>
          <input
            name="username"
            required
            value={form.username}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-primary/80 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400">Email</label>
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-primary/80 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400">Password</label>
          <input
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-primary/80 focus:outline-none"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-primary py-3 font-semibold text-slate-900 shadow-glow disabled:opacity-70"
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    );
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-3xl border border-white/10 bg-card/70 p-8 shadow-2xl shadow-primary/10"
      >
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-slate-900">
            ⚡
          </div>
          <h1 className="text-3xl font-bold">Welcome to OnlyMemes</h1>
          <p className="text-sm text-slate-400">
            Create an account or login to start sharing memes
          </p>
        </div>
        <div className="mt-8 flex rounded-2xl border border-white/10 p-1 bg-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMode(tab.key)}
              className={`w-1/2 rounded-2xl py-2 text-sm font-semibold transition ${
                mode === tab.key ? "bg-primary text-slate-900" : "text-slate-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-8">{renderForm()}</div>
      </motion.div>
    </div>
  );
}
