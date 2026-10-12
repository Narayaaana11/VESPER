import { X, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { VesperLogo } from "./VesperLogo";

function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, signup } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      if (tab === "signin") {
        await login(email, password);
      } else {
        await signup(email, password, name || email.split("@")[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    toast.info("Google Sign-In is in active sandbox. Please sign in via email or guest access.", {
      duration: 5000,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-white p-6 sm:p-7 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center">
            <VesperLogo size={42} />
          </div>
          <h3 className="mt-3 text-lg font-bold tracking-tight text-slate-900">
            {tab === "signin" ? "Sign In to VESPER" : "Create VESPER Account"}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {tab === "signin"
              ? "Access your assigned desktop software license and neural profile."
              : "Instant setup — your desktop license key is generated immediately."}
          </p>
        </div>

        {/* Google OAuth Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-slate-50 py-2.5 px-4 text-xs font-semibold text-slate-800 transition-all hover:bg-white hover:border-slate-300 active:scale-[0.99] shadow-sm"
          >
            <GoogleIcon className="h-4 w-4" />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="w-full border-t border-slate-200" />
          <span className="absolute bg-white px-3 font-mono text-[10px] text-slate-400 uppercase">
            Or with email
          </span>
        </div>

        {/* Tabs: Sign In / Create Account */}
        <div className="flex rounded-lg border border-border bg-slate-100 p-1 text-xs">
          <button
            type="button"
            onClick={() => setTab("signin")}
            className={`flex-1 rounded-md py-1.5 font-semibold transition-all ${
              tab === "signin"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab("signup")}
            className={`flex-1 rounded-md py-1.5 font-semibold transition-all ${
              tab === "signup"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {tab === "signup" && (
            <div>
              <label className="block text-xs font-medium text-slate-800 mb-1">Full Name</label>
              <div className="relative flex items-center">
                <UserIcon className="absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="w-full rounded-xl border border-border bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-800 mb-1">
              Work or Personal Email
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
                className="w-full rounded-xl border border-border bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-800 mb-1">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-border bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary hover:bg-orange-600 py-2.5 px-4 text-xs font-bold text-white shadow-[0_2px_12px_rgba(255,107,0,0.25)] transition-all active:scale-[0.99]"
          >
            <span>
              {loading
                ? "Processing..."
                : tab === "signin"
                ? "Sign In"
                : "Create Account & Activate License"}
            </span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
