"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-bg-primary neural-grid flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 max-w-md text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold gradient-text mb-2">Account Created!</h2>
          <p className="text-sm text-text-secondary mb-6">Check your email for a confirmation link, then sign in.</p>
          <Link href="/auth/login" className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-semibold hover:opacity-90">
            Go to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary neural-grid flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              <line x1="12" y1="22" x2="12" y2="15.5" />
              <polyline points="22 8.5 12 15.5 2 8.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold gradient-text">Create Account</h1>
          <p className="text-sm text-text-muted mt-1">Join the OpenDesk platform</p>
        </div>

        <form onSubmit={handleSignUp} className="glass-card p-8 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-accent-red/10 border border-accent-red/20 text-accent-red text-xs">{error}</div>
          )}

          <div>
            <label className="text-xs text-text-secondary font-medium mb-1.5 block">Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" required
              className="w-full bg-bg-hover border border-border-default rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent-blue/50 transition-colors" />
          </div>

          <div>
            <label className="text-xs text-text-secondary font-medium mb-1.5 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@institution.edu" required
              className="w-full bg-bg-hover border border-border-default rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent-blue/50 transition-colors" />
          </div>

          <div>
            <label className="text-xs text-text-secondary font-medium mb-1.5 block">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6}
              className="w-full bg-bg-hover border border-border-default rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent-blue/50 transition-colors" />
          </div>

          <div>
            <label className="text-xs text-text-secondary font-medium mb-1.5 block">Role</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "student", label: "Student", icon: "🎓" },
                { value: "faculty", label: "Faculty", icon: "👨‍🏫" },
                { value: "admin", label: "Admin", icon: "🏛️" },
              ].map((r) => (
                <button key={r.value} type="button" onClick={() => setRole(r.value)}
                  className={`p-3 rounded-xl border text-center transition-all ${role === r.value ? "border-accent-blue/40 bg-accent-blue/10" : "border-border-default hover:border-border-active"}`}>
                  <div className="text-xl mb-1">{r.icon}</div>
                  <span className="text-[10px] font-medium text-text-secondary">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-xs text-text-muted">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-accent-blue hover:underline">Sign In</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
