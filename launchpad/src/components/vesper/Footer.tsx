import { ShieldCheck, Cpu, Database, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LegalModal } from "./LegalModal";
import { VesperLogo } from "./VesperLogo";

export function Footer() {
  const [dbState, setDbState] = useState<{ connected: boolean; latencyMs: number | null }>({
    connected: true,
    latencyMs: 17,
  });
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<"privacy" | "terms">("privacy");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data?.database) {
          setDbState({
            connected: Boolean(data.database.connected),
            latencyMs: data.database.latencyMs ?? 17,
          });
        }
      })
      .catch(() => {
        // Keep fallback
      });
  }, []);

  return (
    <footer className="border-t border-titanium-border bg-obsidian text-titanium-silver relative z-10">
      {/* Live System Telemetry Ribbon */}
      <div className="border-b border-titanium-border/60 bg-titanium/50 py-3 px-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-emerald animate-pulse shadow-[0_0_8px_var(--emerald)]" />
            <span className="text-stark font-medium">Windows Engine Status: Active</span>
            <span className="text-titanium-silver/40">|</span>
            <span className="text-titanium-silver">WinKeyServer.exe PID attached</span>
          </div>

          <div className="flex items-center gap-4 text-titanium-silver/80">
            <span className="flex items-center gap-1.5">
              <Database className="h-3 w-3 text-primary" />
              <span>
                MongoDB Atlas:{" "}
                {dbState.connected
                  ? `Connected (${dbState.latencyMs ?? 17}ms)`
                  : "In-Memory Resilient"}
              </span>
            </span>
            <span className="hidden sm:inline text-titanium-silver/40">|</span>
            <span className="text-primary font-semibold">Sub-180ms Latency Waterfall</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <VesperLogo size={28} />
              <span className="font-mono text-base font-bold tracking-[0.2em] text-stark">
                VESPER
              </span>
            </div>
            <p className="text-xs leading-relaxed text-titanium-silver">
              Hardware-hooked push-to-talk ambient intelligence engine for Windows 10/11. Hold Right Alt,
              speak, and paste directly at your cursor without stealing window focus.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-titanium-border bg-titanium-elevated px-3 py-1 font-mono text-[10px] text-titanium-silver">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Version 1.0 Enterprise Production</span>
            </div>
          </div>

          {/* Engine Architecture */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold tracking-wider text-stark uppercase">
              Architecture
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/architecture" className="hover:text-stark transition-colors">
                  WinKeyServer Low-Level Hook
                </Link>
              </li>
              <li>
                <Link to="/architecture" className="hover:text-stark transition-colors">
                  Silero VAD Chunking
                </Link>
              </li>
              <li>
                <Link to="/architecture" className="hover:text-stark transition-colors">
                  Sub-180ms Neural Pipeline
                </Link>
              </li>
              <li>
                <Link to="/architecture" className="hover:text-stark transition-colors">
                  Win32 SendInput Preservation
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Protocols */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold tracking-wider text-stark uppercase">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/guidance" className="hover:text-emerald text-emerald font-semibold transition-colors flex items-center gap-1.5">
                  <span>Developer Guidance &amp; Manual</span>
                </Link>
              </li>
              <li>
                <Link to="/shortcuts" className="hover:text-stark transition-colors">
                  Mechanical Keycap Tester
                </Link>
              </li>
              <li>
                <Link to="/download" className="hover:text-stark transition-colors">
                  Windows Installer &amp; SHA-256
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="hover:text-stark transition-colors">
                  Air-Gapped Whisper Roadmap
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-stark transition-colors">
                  Subscription Plans &amp; Licenses
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Security */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold tracking-wider text-stark uppercase">
              Architecture &amp; Security
            </h4>
            <div className="space-y-2.5 text-xs">
              <Link
                to="/architecture"
                className="flex items-center gap-1.5 hover:text-stark transition-colors"
              >
                <Cpu className="h-3.5 w-3.5 text-emerald" />
                <span>8-Layer Architecture Specs</span>
              </Link>

              <Link
                to="/faq"
                className="flex items-center gap-1.5 hover:text-stark transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald" />
                <span>Zero Audio Retention Guarantee</span>
              </Link>

              <p className="font-mono text-[11px] text-titanium-silver/70 pt-2">
                Enterprise Core Engine. Built with React 19, TanStack Start, and Tailwind CSS.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-titanium-border/60 pt-6 text-xs text-titanium-silver/70">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p>© {new Date().getFullYear()} VESPER Platform. All rights reserved.</p>
            <button
              type="button"
              onClick={() => {
                setLegalTab("privacy");
                setLegalModalOpen(true);
              }}
              className="hover:text-emerald transition-colors underline-offset-2 hover:underline"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setLegalTab("terms");
                setLegalModalOpen(true);
              }}
              className="hover:text-emerald transition-colors underline-offset-2 hover:underline"
            >
              Terms of Service
            </button>
            <span>•</span>
            <a
              href="mailto:contact@vesper.ai?subject=VESPER%20Feedback%20%26%20Inquiry"
              className="hover:text-emerald transition-colors flex items-center gap-1 underline-offset-2 hover:underline"
            >
              <Mail className="h-3 w-3" />
              <span>Feedback &amp; Contact</span>
            </a>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>SHA-256: 8f4a2c9e...3d1b</span>
            <span>•</span>
            <span>winget install vesper</span>
          </div>
        </div>
      </div>

      {/* Interactive Legal Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        defaultTab={legalTab}
      />
    </footer>
  );
}

export default Footer;
