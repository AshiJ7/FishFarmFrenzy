"use client";

import { useMemo, useState } from "react";
import { updateProfile } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";

const avatars = [
  { name: "Otter", src: "/otter.png" },
  { name: "Koi", src: "/koi.png" },
  { name: "Fly", src: "/fly.png" },
  { name: "Tomato", src: "/tomato.png" },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(user?.photoURL || "/otter.png");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const displayName = user?.displayName || "Player";

  const bubbles = useMemo(
    () =>
      [
        { left: 8, size: 18, dur: 9, delay: 0 },
        { left: 16, size: 28, dur: 13, delay: 2 },
        { left: 25, size: 14, dur: 8, delay: 1 },
        { left: 33, size: 22, dur: 11, delay: 3.5 },
        { left: 42, size: 32, dur: 14, delay: 0.5 },
        { left: 51, size: 16, dur: 9, delay: 2.8 },
        { left: 60, size: 24, dur: 12, delay: 1.5 },
        { left: 68, size: 20, dur: 10, delay: 4 },
        { left: 76, size: 30, dur: 13, delay: 0.8 },
        { left: 84, size: 12, dur: 7, delay: 3 },
      ],
    []
  );

  // firebase has updateProfile, use that to update pic using photo src
  // might need to upload pic to firestore in some way to save across logouts
  const handleSaveAvatar = async () => {
    if (!user) return;

    setSaving(true);
    setStatus("");

    try {
      await updateProfile(user, { photoURL: selectedAvatar });
      setStatus("Updated profile picture!");
    }
    catch {
      setStatus("Could not update profile picture.");
    }
    finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(145deg, #CFFCFF 0%, #AAEFDF 45%, #63C132 100%)" }}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {bubbles.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              bottom: "-60px",
              left: `${b.left}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.7), rgba(170,239,223,0.3))",
              border: "1px solid rgba(255,255,255,0.4)",
              animation: `homeBubble ${b.dur}s linear infinite`,
              animationDelay: `${b.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes homeBubble {
          0%   { transform: translateY(0) scale(1); opacity: 0.55; }
          80%  { opacity: 0.35; }
          100% { transform: translateY(-105vh) scale(1.2); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shine-text {
          background: linear-gradient(90deg, #2C2416 30%, #4A8E9E 50%, #6B8E4E 60%, #2C2416 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl items-center justify-center px-4 py-10">
        <section
          className="w-full max-w-2xl rounded-[28px] border-2 p-8"
          style={{
            background: "rgba(255,255,255,0.62)",
            backdropFilter: "blur(18px)",
            borderColor: "rgba(255,255,255,0.75)",
            boxShadow: "0 8px 32px rgba(74,142,158,0.35), 0 2px 8px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          <h1 className="shine-text text-center text-4xl font-extrabold" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
            Hello, {user?.displayName}!
          </h1>

          <div className="mt-8 flex flex-col items-center gap-3">
            <img
              src={selectedAvatar}
              alt="Selected profile"
              className="h-28 w-28 rounded-full border-2 object-contain"
              style={{ borderColor: "var(--color-border-light)", background: "rgba(255,255,255,0.9)" }}
            />
            <p className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
              {displayName}
            </p>
            {user?.email && (
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {user.email}
              </p>
            )}
          </div>

          <div className="mt-8">
            <p className="mb-3 text-center text-sm font-semibold" style={{ color: "var(--color-text-secondary)" }}>
              Choose a profile picture
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {avatars.map((avatar) => {
                const isSelected = selectedAvatar === avatar.src;
                return (
                  <button
                    key={avatar.src}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.src)}
                    className="flex w-28 flex-col items-center gap-2 rounded-2xl border-2 px-3 py-3 transition-transform hover:scale-105"
                    style={{
                      borderColor: isSelected ? "var(--teal-medium)" : "var(--color-border-light)",
                      background: isSelected ? "rgba(168,200,232,0.28)" : "rgba(255,255,255,0.75)",
                    }}
                  >
                    <img src={avatar.src} alt={avatar.name} className="h-14 w-14 object-contain" />
                    <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                      {avatar.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleSaveAvatar}
              disabled={saving || !user}
              className="btn btn-green justify-center px-6"
            >
              {saving ? "Saving..." : "Save Profile Picture"}
            </button>
            <p className="h-6 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              {status}
            </p>

            <div className="card">
            {/* progress bar here and need to input the percentage with firebase in everything*/}
            <p className=" text-left text-xl font-semibold" style={{ color: "var(--color-text-secondary)" }}>
              Your current progress on the minigames: 80%
            </p>
            <div
            className="h-3 rounded-full"
            style={{ background: "var(--periwinkle)" }}
          >
            <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `80%`,
              background: `linear-gradient(to right, var(--teal-medium), var(--olive-green))`,
            }}
          />
          </div>
        </div>

        <div className="card">
            {/* here is badge space but unsure how we want badges to look*/}
            <p className=" text-center text-2xl font-extrabold" style={{ color: "var(--color-text-secondary)" }}>
              Your Badges
            </p>
            
        </div>
          

          </div>
        </section>
      </main>
    </div>
  );
}
