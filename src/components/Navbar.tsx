"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Home,
  Compass,
  TrendingUp,
  Image,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const baseBtn =
  "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition";

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        profileRef.current &&
        event.target instanceof Node &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials =
    session?.user?.name?.[0]?.toUpperCase() ??
    session?.user?.email?.[0]?.toUpperCase() ??
    "A";

  const navItems = useMemo(
    () => [
      { label: "Home", href: "/", icon: Home },
      { label: "Explore", href: "/explore", icon: Compass },
      { label: "Trending", href: "/trending", icon: TrendingUp },
      { label: "Templates", href: "/templates", icon: Image },
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, auth: true },
    ],
    []
  );

  const handleLogout = async () => {
    setProfileOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  const NavButton = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: typeof Home;
  }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`${baseBtn} ${
          active
            ? "bg-primary text-slate-900 shadow-glow"
            : "text-slate-200 hover:bg-white/10"
        }`}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-card/60 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-white"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-slate-900 shadow-glow">
            <Zap className="h-5 w-5" />
          </span>
          OnlyMemes
        </Link>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="text-white md:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div className="hidden items-center gap-3 md:flex">
          {navItems
            .filter((item) => (item.auth ? !!session : true))
            .map(({ label, href, icon }) => (
              <NavButton key={href} label={label} href={href} icon={icon} />
            ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {!session ? (
            <>
              <Link
                href="/auth"
                className={`${baseBtn} border border-white/15 text-slate-200 hover:border-primary/50`}
              >
                Login
              </Link>
              <Link
                href="/auth?mode=signup"
                className={`${baseBtn} bg-primary text-slate-900 shadow-glow`}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white"
              >
                {initials}
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 bg-card/95 p-3 shadow-2xl"
                  >
                    <div className="mb-3 rounded-xl bg-white/5 p-3 text-sm">
                      <p className="font-semibold text-white">
                        {session.user?.name ?? "Meme Creator"}
                      </p>
                      <p className="text-slate-400">{session.user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        router.push("/profile");
                      }}
                      className={`${baseBtn} w-full justify-start text-white hover:bg-white/10`}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        router.push("/dashboard");
                      }}
                      className={`${baseBtn} w-full justify-start text-white hover:bg-white/10`}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </button>
                    <hr className="my-2 border-white/10" />
                    <button
                      onClick={handleLogout}
                      className={`${baseBtn} w-full justify-start text-red-400 hover:bg-red-500/10`}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/10 bg-card/80 px-4 pb-4"
          >
            <div className="flex flex-col gap-3 py-4">
              {navItems
                .filter((item) => (item.auth ? !!session : true))
                .map(({ label, href, icon }) => (
                  <NavButton key={`${href}-mobile`} label={label} href={href} icon={icon} />
                ))}
            </div>
            <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
              {!session ? (
                <>
                  <Link
                    href="/auth"
                    className={`${baseBtn} justify-center border border-white/15 text-slate-200`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth?mode=signup"
                    className={`${baseBtn} justify-center bg-primary text-slate-900`}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      router.push("/profile");
                    }}
                    className={`${baseBtn} justify-start text-white hover:bg-white/10`}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      router.push("/dashboard");
                    }}
                    className={`${baseBtn} justify-start text-white hover:bg-white/10`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`${baseBtn} justify-start text-red-400 hover:bg-red-500/10`}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
