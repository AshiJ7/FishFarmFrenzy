"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      router.push("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div
        className="w-full max-w-md rounded-3xl p-8"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(16px)",
          border: "2px solid var(--color-border-light)",
          boxShadow: "0 8px 40px rgba(53,134,0,0.13)",
        }}
      >
        <h1
          className="mb-6 text-center text-3xl font-extrabold"
          style={{
            backgroundImage: "linear-gradient(to right, var(--teal-medium), var(--olive-green))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h1>

        {error && (
          <div className="mb-4 rounded-lg p-3 text-sm text-red-700" style={{ background: "rgba(255,127,92,0.15)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl border-2 px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--teal-medium)]"
            style={{ borderColor: "var(--color-border-light)", color: "var(--color-text-primary)" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="rounded-xl border-2 px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--teal-medium)]"
            style={{ borderColor: "var(--color-border-light)", color: "var(--color-text-primary)" }}
          />
          <button type="submit" className="btn btn-green justify-center text-base">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            className="font-bold underline"
            style={{ color: "var(--salmon)", cursor: "pointer"}}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
