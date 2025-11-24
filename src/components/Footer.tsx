export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 px-6 py-8 text-slate-400 text-sm md:flex-row md:items-center md:justify-between">
        <p className="text-white font-semibold tracking-wide">
          OnlyMemes — The Ultimate Meme Platform
        </p>
        <p>© {new Date().getFullYear()} OnlyMemes Collective. All rights reserved.</p>
      </div>
    </footer>
  );
}
