import { useState, type FormEvent } from "react";
import {
  Building2,
  Users,
  ShieldCheck,
  CheckCircle,
  X,
  Sparkles,
  ArrowRight,
  Server,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { crmService } from "@/lib/crm-service";

interface EnterpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TEAM_SIZES = [
  "5 - 20 Engineers",
  "20 - 50 Engineers",
  "50 - 200 Engineers",
  "200+ Enterprise",
];
const SECURITY_REQUIREMENTS = [
  "Air-Gapped On-Premise ONNX Whisper Relay",
  "Centralized Team Vocabulary Synchronization",
  "SOC2 Type II & HIPAA Compliance Documentation",
  "Custom Single Sign-On (Okta / SAML 2.0)",
];

export function EnterpriseModal({ isOpen, onClose }: EnterpriseModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [teamSize, setTeamSize] = useState(TEAM_SIZES[1]);
  const [selectedSecurity, setSelectedSecurity] = useState<string[]>([SECURITY_REQUIREMENTS[0]]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleSecurity = (item: string) => {
    setSelectedSecurity((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please provide a valid work email address.");
      return;
    }

    setLoading(true);
    try {
      const calculatedValue =
        teamSize === TEAM_SIZES[0]
          ? 2400
          : teamSize === TEAM_SIZES[1]
            ? 6000
            : teamSize === TEAM_SIZES[2]
              ? 18000
              : 45000;

      await crmService.createLead({
        name: name.trim() || "Enterprise Engineering Lead",
        email: email.trim(),
        company: company.trim() || "Enterprise Organization",
        stage: "Enterprise Pilot",
        value: calculatedValue,
        score: 95,
        useCase: `Enterprise Team (${teamSize})`,
        notes: `Enterprise Pilot inquiry. Security requests: ${selectedSecurity.join(
          ", ",
        )}. Custom requirements: ${notes || "None specified"}`,
      });

      setSubmitted(true);
      toast.success("Enterprise Pilot Request Dispatched", {
        description:
          "Lead logged into Executive CRM. Dedicated engineering channel being provisioned.",
      });

      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setName("");
        setEmail("");
        setCompany("");
        setNotes("");
      }, 2200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit request.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-titanium-border bg-titanium p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.85)] text-stark">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-1 text-titanium-silver hover:bg-titanium-elevated hover:text-stark transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center py-8 text-center animate-in zoom-in-95 duration-200">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald/40 bg-emerald/10 text-emerald shadow-[0_0_32px_rgba(16,185,129,0.3)]">
              <CheckCircle className="h-7 w-7" />
            </div>
            <h3 className="mt-4 font-mono text-lg font-bold text-stark">
              Enterprise Pilot Registered
            </h3>
            <p className="mt-1 text-xs text-titanium-silver max-w-sm">
              Your inquiry has been stored in the VESPER Executive CRM pipeline. An engineering
              partner will reach out within 4 business hours.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-titanium-border pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/40 bg-purple-500/10 text-purple-400">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-mono text-base font-bold text-stark">
                  Deploy VESPER for Engineering Teams
                </h3>
                <p className="text-xs text-titanium-silver">
                  Air-gapped on-premise relays, custom team dictionaries, and SOC2 compliance.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono text-[11px] text-titanium-silver">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rachel Sterling"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver/50 focus:border-emerald focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[11px] text-titanium-silver">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rachel@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver/50 focus:border-emerald focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono text-[11px] text-titanium-silver">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OpenAI, Stripe, Scale"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver/50 focus:border-emerald focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[11px] text-titanium-silver">
                    Engineering Team Size
                  </label>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 font-mono text-stark focus:border-emerald focus:outline-none"
                  >
                    {TEAM_SIZES.map((sz) => (
                      <option key={sz} value={sz} className="bg-titanium text-stark">
                        {sz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[11px] text-titanium-silver">
                  Security & Architecture Requirements
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SECURITY_REQUIREMENTS.map((req) => {
                    const active = selectedSecurity.includes(req);
                    return (
                      <button
                        key={req}
                        type="button"
                        onClick={() => toggleSecurity(req)}
                        className={`flex items-start gap-2 rounded-lg border p-2 text-left transition-all ${
                          active
                            ? "border-emerald/40 bg-emerald/10 text-stark"
                            : "border-titanium-border bg-titanium-elevated text-titanium-silver hover:text-stark"
                        }`}
                      >
                        <ShieldCheck
                          className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                            active ? "text-emerald" : "text-titanium-silver"
                          }`}
                        />
                        <span className="text-[11px] leading-tight">{req}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-1 block font-mono text-[11px] text-titanium-silver">
                  Workflow Notes & Technical Stack
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 50 Cursor licenses, local RTX 4090 workstations, custom internal API names..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver/50 focus:border-emerald focus:outline-none"
                />
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-titanium-border pt-4">
                <span className="font-mono text-[10px] text-titanium-silver flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-emerald" />
                  <span>Confidential NDA Guarded</span>
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-titanium-border px-3.5 py-2 text-titanium-silver hover:text-stark transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-stark px-5 py-2 font-semibold text-obsidian shadow transition-all hover:bg-white active:scale-[0.98]"
                  >
                    <span>{loading ? "Submitting..." : "Schedule Pilot"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default EnterpriseModal;
