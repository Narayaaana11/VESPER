import React, { useState } from "react";
import { X, ShieldCheck, FileText, Lock, ExternalLink, Mail } from "lucide-react";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "privacy" | "terms";
}

export function LegalModal({ isOpen, onClose, defaultTab = "privacy" }: LegalModalProps) {
  const [tab, setTab] = useState<"privacy" | "terms">(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-titanium-border bg-titanium shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-titanium-border px-6 py-4 bg-titanium-elevated">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/10 border border-emerald/30 text-emerald">
              {tab === "privacy" ? <Lock className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-stark">
                {tab === "privacy" ? "VESPER Privacy Policy" : "VESPER Terms of Service"}
              </h3>
              <p className="text-[11px] font-mono text-titanium-silver">
                Effective Date: October 2026 · Local-First Architecture
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-titanium-silver hover:bg-titanium hover:text-stark transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-titanium-border bg-obsidian px-6 pt-2">
          <button
            type="button"
            onClick={() => setTab("privacy")}
            className={`pb-2.5 px-3 font-mono text-xs font-semibold border-b-2 transition-all ${
              tab === "privacy"
                ? "border-emerald text-emerald"
                : "border-transparent text-titanium-silver hover:text-stark"
            }`}
          >
            Zero-Retention Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => setTab("terms")}
            className={`pb-2.5 px-3 font-mono text-xs font-semibold border-b-2 transition-all ${
              tab === "terms"
                ? "border-emerald text-emerald"
                : "border-transparent text-titanium-silver hover:text-stark"
            }`}
          >
            Software License &amp; Terms
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-xs text-titanium-silver leading-relaxed font-sans">
          {tab === "privacy" ? (
            <>
              <div className="rounded-xl border border-emerald/30 bg-emerald/10 p-4">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Zero Audio Retention Protocol</span>
                </div>
                <p className="mt-1.5 text-xs text-stark/90">
                  VESPER operates on a zero-retention paradigm. Audio buffers are captured into volatile
                  in-memory RAM slices, analyzed statelessly for speech tokens, and completely purged immediately
                  upon transcription delivery. No human ever listens to your recordings, and your voice is never used to train public models.
                </p>
              </div>

              <section className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-stark uppercase tracking-wider">
                  1. Information We Do Not Collect
                </h4>
                <p>
                  We do not collect, log, or persist raw microphone audio, keystrokes outside activation hooks, clipboard contents, or internal window titles. Local Windows keyboard hooks intercept only the registered hotkey (default F8) and bypass all normal key typing.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-stark uppercase tracking-wider">
                  2. Account &amp; Licensing Telemetry
                </h4>
                <p>
                  When you register for a VESPER license, we securely store your email, encrypted authentication credentials, and assigned license key in MongoDB Atlas to authenticate your software activation and meter tier quota.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-stark uppercase tracking-wider">
                  3. User Feedback &amp; Communications
                </h4>
                <p>
                  Any bug reports, ratings, or suggestions submitted through the platform or sent to <strong className="text-emerald">contact@vesper.ai</strong> are retained solely for developer support, product refinement, and answering your requests.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-stark uppercase tracking-wider">
                  4. Security &amp; Compliance
                </h4>
                <p>
                  All network communication is TLS 1.3 encrypted. VESPER complies with GDPR data portability, CCPA disclosure rights, and zero-storage enterprise confidentiality standards.
                </p>
              </section>
            </>
          ) : (
            <>
              <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-stark">
                  <FileText className="h-4 w-4 text-emerald" />
                  <span>Commercial Software Licensing Agreement</span>
                </div>
                <p className="mt-1.5 text-xs text-titanium-silver">
                  By downloading, installing, or executing VESPER Desktop, you agree to this non-exclusive, revocable software license agreement.
                </p>
              </div>

              <section className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-stark uppercase tracking-wider">
                  1. License Grant
                </h4>
                <p>
                  Subject to your license tier (Pro, Enterprise, or Developer), VESPER grants you a personal or organizational license to run the VESPER Windows executable across your registered devices. You may not decompile, reverse engineer the binary kernel, or distribute unlicensed copies.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-stark uppercase tracking-wider">
                  2. Push-to-Talk Windows Execution
                </h4>
                <p>
                  VESPER utilizes low-level Win32 keyboard and audio hooks to enable instant caret insertion into third-party processes (such as Cursor, VS Code, and Slack). Users maintain full operational responsibility for content dictated into their systems.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-stark uppercase tracking-wider">
                  3. User Feedback &amp; Improvements
                </h4>
                <p>
                  We welcome builder feedback at <strong className="text-emerald">contact@vesper.ai</strong>. By submitting ideas, you grant VESPER the right to implement software improvements, bug fixes, and feature requests without royalty.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-stark uppercase tracking-wider">
                  4. Warranty &amp; Liability
                </h4>
                <p>
                  VESPER is provided "as is" with enterprise stability engineering. We disclaim all implied warranties of merchantability or fitness for a particular purpose to the maximum extent permitted by applicable law.
                </p>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-titanium-border bg-titanium-elevated px-6 py-3.5 text-xs">
          <div className="flex items-center gap-2 text-titanium-silver">
            <Mail className="h-3.5 w-3.5 text-emerald" />
            <span>Questions or feedback?</span>
            <a
              href="mailto:contact@vesper.ai"
              className="text-emerald hover:underline font-semibold"
            >
              contact@vesper.ai
            </a>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-emerald px-4 py-1.5 font-bold text-obsidian hover:opacity-95 transition-opacity"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

export default LegalModal;
