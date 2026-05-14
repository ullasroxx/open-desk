"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/student";
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Fetch role to redirect to correct dashboard
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single() as { data: { role: string } | null };
      const roleRedirect = profile?.role === "faculty" ? "/faculty" : profile?.role === "admin" ? "/admin" : "/student";
      router.push(redirect !== "/student" ? redirect : roleRedirect);
    }

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            <line x1="12" y1="22" x2="12" y2="15.5" />
            <polyline points="22 8.5 12 15.5 2 8.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold gradient-text">Welcome Back</h1>
        <p className="text-sm text-text-muted mt-1">Sign in to OpenDesk</p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="glass-card p-8 space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-accent-red/10 border border-accent-red/20 text-accent-red text-xs">
            {error}
          </div>
        )}

        <div>
          <label className="text-xs text-text-secondary font-medium mb-1.5 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@institution.edu"
            required
            className="w-full bg-bg-hover border border-border-default rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent-blue/50 transition-colors"
          />
        </div>

        <div>
          <label className="text-xs text-text-secondary font-medium mb-1.5 block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full bg-bg-hover border border-border-default rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent-blue/50 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-xs text-text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-accent-blue hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bg-primary neural-grid flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-text-muted text-sm">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
