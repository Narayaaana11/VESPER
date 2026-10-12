import { Menu, X, Terminal, User as UserIcon, Shield, LogOut, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { VesperLogo } from "./VesperLogo";

const links = [
  { label: "Simulator", href: "/simulator" },
  { label: "Workflows", href: "/workflows" },
  { label: "Architecture", href: "/architecture" },
  { label: "Pricing", href: "/pricing" },
  { label: "Shortcuts", href: "/shortcuts" },
  { label: "Guidance", href: "/guidance" },
  { label: "Download", href: "/download" },
  { label: "FAQ", href: "/faq" },
];

function WindowsIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 88 88" fill="currentColor">
      <path d="M0 12.402l35.687-4.86.016 34.423-35.67.248L0 12.402zm35.67 33.529l.028 34.453L.028 75.48.003 46.179l35.667-.248zM40.97 6.479L87.977 0v41.526l-47.008.377V6.479zm47.037 39.467l-.03 41.602-46.99-6.613-.013-34.612 47.033-.377z" />
    </svg>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isAdmin, openAuthModal, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-white/95 backdrop-blur-xl shadow-sm py-0"
          : "border-b border-border/40 bg-white/80 backdrop-blur-md py-1"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 gap-3">
        {/* Brand identity with VesperLogo */}
        <Link to="/" className="group flex items-center gap-2.5 shrink-0">
          <VesperLogo size={28} showText={true} textColor="#0f172a" />
        </Link>

        {/* Desktop navigation links */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-primary whitespace-nowrap [&.active]:text-primary [&.active]:bg-primary/10"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Action cluster */}
        <div className="hidden items-center gap-2 sm:flex shrink-0">
          {/* User / Auth / CRM Admin controls */}
          {user ? (
            <div className="flex items-center gap-2 shrink-0">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-mono font-medium text-primary transition-all hover:bg-primary/20 hover:border-primary whitespace-nowrap shrink-0"
                  title="Open CRM & Lead Admin Dashboard"
                >
                  <Shield className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="whitespace-nowrap">Admin Portal</span>
                </Link>
              )}
              <div className="flex items-center gap-2 rounded-lg border border-border bg-slate-50 px-2.5 py-1.5 shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-5 w-5 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] text-primary font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="max-w-[100px] truncate text-xs font-semibold text-slate-800 whitespace-nowrap">
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="ml-1 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal()}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:border-primary/40 hover:text-primary hover:bg-white whitespace-nowrap shrink-0"
            >
              <UserIcon className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span className="whitespace-nowrap">Sign In</span>
            </button>
          )}

          <Link
            to="/download"
            className="flex items-center gap-2 rounded-lg bg-primary hover:bg-orange-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_2px_10px_rgba(255,107,0,0.25)] transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <WindowsIcon className="h-3.5 w-3.5 text-white shrink-0" />
            <span className="whitespace-nowrap">Download</span>
            <span className="rounded bg-black/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white whitespace-nowrap">
              Win 64
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-lg border border-border p-2 text-slate-600 md:hidden hover:text-slate-900 hover:bg-slate-100"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-b border-border bg-white px-5 py-6 md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-primary"
              >
                {l.label}
              </Link>
            ))}

            <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-border">
              {user ? (
                <div className="flex flex-col gap-2 rounded-xl border border-border bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-mono text-xs text-primary font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{user.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="text-xs text-slate-500 hover:text-red-500"
                    >
                      Sign Out
                    </button>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 py-2 text-xs font-mono font-medium text-primary"
                    >
                      <Shield className="h-3.5 w-3.5" />
                      <span>Open CRM Admin Dashboard</span>
                    </Link>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openAuthModal();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800"
                >
                  <UserIcon className="h-4 w-4 text-primary" />
                  <span>Sign In (Google or Email)</span>
                </button>
              )}

              <Link
                to="/download"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-orange-600 px-4 py-3 text-xs font-bold text-white shadow-[0_2px_10px_rgba(255,107,0,0.25)]"
              >
                <WindowsIcon className="h-4 w-4 text-white" />
                <span>Download VESPER Windows Installer</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Nav;
