"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const gameLinks = [
  { n: 1, label: "Feeding Frenzy" },
  { n: 2, label: "Cycle Explorer" },
  { n: 3, label: "Save Your Fish Farm" },
  { n: 4, label: "Bacteria Battle" },
  { n: 5, label: "Perfect Pairs" },
];

export default function Header() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;
  const name = user.displayName || "";

  return (
    <header className="w-full border-b" style={{ background: "transparent" }}>
      <div
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"
        style={{ fontFamily: "var(--font-nunito), var(--font-geist-sans), sans-serif" }}
      >
        {/* Left: Welcome */}
        <div className="flex items-center" style={{ minWidth: 0 }}>
          <div className="text-base md:text-lg" style={{ color: "var(--color-text-secondary)", fontWeight: 600 }}>
            {name ? (
              <>Welcome, <span style={{ fontWeight: 900 }}>{name}</span>!</>
            ) : (
              <span>Welcome!</span>
            )}
          </div>
        </div>

        {/* Desktop nav — hidden on small screens */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/" className="text-2xl font-extrabold" style={{ color: "var(--color-text-primary)" }}>
            Home
          </Link>
          <Link href="/profile" className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>
            Profile
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            {gameLinks.map(({ n, label }) => (
              <Link
                key={n}
                href={`/mini-game-${n}`}
                className="rounded-md px-3 py-1"
                style={{ color: "var(--color-text-primary)", fontWeight: 700, transition: "background 0.15s ease" }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Sign Out (desktop) + Hamburger (mobile) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => signOut()}
            className="hidden md:block ml-4"
            style={{
              color: "var(--salmon)",
              fontWeight: 800,
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid var(--color-border-light)",
              background: "rgba(255,255,255,0.02)",
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>

          {/* Hamburger button — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2 rounded-lg"
            style={{ background: "rgba(255,255,255,0.3)", border: "1px solid var(--color-border-light)" }}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span
              style={{
                display: "block", width: 22, height: 2, background: "var(--color-text-primary)",
                borderRadius: 2, transition: "transform 0.2s",
                transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
              }}
            />
            <span
              style={{
                display: "block", width: 22, height: 2, background: "var(--color-text-primary)",
                borderRadius: 2, transition: "opacity 0.2s",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block", width: 22, height: 2, background: "var(--color-text-primary)",
                borderRadius: 2, transition: "transform 0.2s",
                transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-4 py-3 flex flex-col gap-2"
          style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)" }}
        >
          <Link
            href="/"
            className="text-xl font-extrabold py-2"
            style={{ color: "var(--color-text-primary)" }}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/profile"
            className="text-base font-bold py-1"
            style={{ color: "var(--color-text-primary)" }}
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </Link>
          {gameLinks.map(({ n, label }) => (
            <Link
              key={n}
              href={`/mini-game-${n}`}
              className="text-sm font-bold py-1 px-2 rounded-md"
              style={{ color: "var(--color-text-primary)" }}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={() => { signOut(); setMenuOpen(false); }}
            className="mt-1 text-left font-extrabold py-2"
            style={{ color: "var(--salmon)", background: "none", border: "none", cursor: "pointer" }}
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}
