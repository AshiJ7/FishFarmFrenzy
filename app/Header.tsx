"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, signOut } = useAuth();

  if (!user) return null;
  // Use the displayName provided at signup; do not fall back to the email local-part
  const name = user.displayName || "";

  return (
    <header className="w-full border-b" style={{ background: "transparent" }}>
      <div
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"
        style={{ fontFamily: "var(--font-nunito), var(--font-geist-sans), sans-serif" }}
      >
        {/* Left: Welcome, flush to the left */}
        <div className="flex items-center" style={{ minWidth: 0 }}>
          <div className="text-lg" style={{ color: "var(--color-text-secondary)", fontWeight: 600 }}>
            {name ? (
              <>
                Welcome, <span style={{ fontWeight: 900 }}>{name}</span>!
              </>
            ) : (
              <span>Welcome!</span>
            )}
          </div>
        </div>

        {/* Middle: Home + nav links (reduced gap between Home and first game) */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-extrabold" style={{ color: "var(--color-text-primary)" }}>
            Home
          </Link>
          <Link href="/profile" className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>
            Profile
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            {[
              { n: 1, label: "Feeding Frenzy" },
              { n: 2, label: "Cycle Explorer" },
              { n: 3, label: "Save Your Fish Farm" },
              { n: 4, label: "Bacteria Battle" },
              { n: 5, label: "Perfect Pairs" },
            ].map(({ n, label }) => (
              <Link
                key={n}
                href={`/mini-game-${n}`}
                className="rounded-md px-3 py-1"
                style={{
                  color: "var(--color-text-primary)",
                  fontWeight: 700,
                  transition: "background 0.15s ease",
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Sign out */}
        <div>
          <button
            onClick={() => signOut()}
            className="ml-4"
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
        </div>
      </div>
    </header>
  );
}
