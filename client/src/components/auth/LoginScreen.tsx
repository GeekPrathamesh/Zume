import { useState } from "react";
import { useAuth } from "@/context/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, FileText, Loader2, Sparkles } from "lucide-react";

// Reusable Wrapper for both screens
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center bg-black overflow-hidden font-sans">
    {/* 1. Background Grid Pattern */}
    <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    
    {/* 2. Yellow Glowing Orbs */}
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-500/10 blur-[120px] animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-600/5 blur-[120px]" />

    {/* 3. Top Branding/Navigation */}
    <nav className="absolute top-0 w-full p-8 flex justify-between items-center z-20">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center font-black text-black">
          L
        </div>
        <span className="text-white font-bold tracking-tighter text-xl uppercase">
          Lumo <span className="text-yellow-400">Chat</span>
        </span>
      </div>
      <div className="hidden md:block h-[1px] flex-1 mx-8 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent" />
      <div className="text-zinc-500 text-xs tracking-[0.2em] uppercase font-mono">System_v2.0</div>
    </nav>

    {/* 4. The Component Container */}
    <main className="relative z-10 w-full max-w-md px-4 py-24 sm:py-0">
      {children}
    </main>

    {/* 5. Decorative Footer */}
    <footer className="absolute bottom-6 text-zinc-600 text-[10px] tracking-widest uppercase pointer-events-none">
      © 2026 All Rights Reserved // <span className="text-yellow-400/50">Encrypted Connection</span>
    </footer>
  </div>
);

export function LoginScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const success = await login({ email, password });
    setLoading(false);
    if (success) navigate("/");
  };

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-zinc-950/90 backdrop-blur-xl border border-yellow-400/20 rounded-2xl p-8 shadow-2xl shadow-yellow-400/10 space-y-6"
      >
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-yellow-400 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            Welcome Back
          </h2>
          <p className="text-zinc-400 text-sm">Access your secure workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-yellow-400/95 font-semibold text-xs flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="bg-zinc-900/60 border border-zinc-800 text-white placeholder:text-zinc-650 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 rounded-xl px-4 py-3 w-full text-sm transition-all focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-yellow-400/95 font-semibold text-xs flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-zinc-900/60 border border-zinc-800 text-white placeholder:text-zinc-650 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 rounded-xl px-4 py-3 w-full text-sm transition-all focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-500 text-black border-none shadow-[0_0_20px_rgba(250,204,21,0.4)] disabled:opacity-75 transition-all font-semibold rounded-xl py-3 w-full flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-550 border-t border-zinc-900 pt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
            Create one
          </Link>
        </div>
      </motion.div>
    </PageWrapper>
  );
}

export function SignupScreen() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;
    setLoading(true);
    const success = await signup({ fullName, email, password, bio });
    setLoading(false);
    if (success) navigate("/");
  };

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-zinc-950/90 backdrop-blur-xl border border-yellow-400/20 rounded-2xl p-8 shadow-2xl shadow-yellow-400/10 space-y-5"
      >
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-yellow-400 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            Create Account
          </h2>
          <p className="text-zinc-400 text-sm">Join the secure communication hub</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-yellow-400/95 font-semibold text-xs flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              FULL NAME
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
              className="bg-zinc-900/60 border border-zinc-800 text-white placeholder:text-zinc-650 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 rounded-xl px-4 py-3 w-full text-sm transition-all focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-yellow-400/95 font-semibold text-xs flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="bg-zinc-900/60 border border-zinc-800 text-white placeholder:text-zinc-650 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 rounded-xl px-4 py-3 w-full text-sm transition-all focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-yellow-400/95 font-semibold text-xs flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-zinc-900/60 border border-zinc-800 text-white placeholder:text-zinc-650 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 rounded-xl px-4 py-3 w-full text-sm transition-all focus:outline-none"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-yellow-400/95 font-semibold text-xs flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              ABOUT YOU (BIO)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a bit about yourself..."
              rows={2}
              className="bg-zinc-900/60 border border-zinc-800 text-white placeholder:text-zinc-650 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 rounded-xl px-4 py-3 w-full text-sm transition-all resize-none focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-500 text-black border-none shadow-[0_0_20px_rgba(250,204,21,0.4)] disabled:opacity-75 transition-all font-semibold rounded-xl py-3 w-full flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-550 border-t border-zinc-900 pt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
            Sign In
          </Link>
        </div>
      </motion.div>
    </PageWrapper>
  );
}