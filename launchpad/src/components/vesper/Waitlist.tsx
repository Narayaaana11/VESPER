import { Ticket, ArrowRight, Check, FileSpreadsheet, Eye, Sparkles } from "lucide-react";
import { useState, useEffect, type FormEvent } from "react";
import { toast } from "sonner";
import { BorderGlow, StarBorder, Magnet, ShinyText, CountUp } from "@/components/reactbits";
import { ExcelWaitlistModal, type WaitlistSubmission } from "./ExcelWaitlistModal";
import { crmService } from "@/lib/crm-service";

const PLATFORMS = ["Windows Power User", "macOS", "Linux"];
const STORAGE_KEY = "vesper_waitlist_entry";
const ALL_SUBMISSIONS_KEY = "vesper_waitlist_all_submissions";

const HARDWARE_OPTIONS = [
  "NVIDIA RTX 30/40 Series (CUDA)",
  "Apple M-Series Silicon (Metal)",
  "Intel Core Ultra / NPU",
  "AMD Ryzen AI",
  "Standard CPU (AVX2)",
];

interface WaitlistData {
  name: string;
  email: string;
  useCase: string;
  platforms: string[];
  hardware: string;
  position: number;
}

export function Waitlist() {
  const [data, setData] = useState<WaitlistData | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [useCase, setUseCase] = useState("Developer / Engineer");
  const [hardware, setHardware] = useState(HARDWARE_OPTIONS[0]);
  const [pickedPlatforms, setPickedPlatforms] = useState<string[]>(["Windows Power User"]);
  const [isExcelOpen, setIsExcelOpen] = useState(false);
  const [allSubmissions, setAllSubmissions] = useState<WaitlistSubmission[]>([]);

  // Restore stored submission and all submissions
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setData(JSON.parse(stored));
      }

      const storedAll = localStorage.getItem(ALL_SUBMISSIONS_KEY);
      if (storedAll) {
        const parsed = JSON.parse(storedAll);
        setAllSubmissions(Array.isArray(parsed) ? parsed : []);
      } else {
        setAllSubmissions([]);
      }
    } catch {
      setAllSubmissions([]);
    }
  }, []);

  const togglePlatform = (p: string) => {
    setPickedPlatforms((cur) =>
      cur.includes(p) ? (cur.length > 1 ? cur.filter((x) => x !== p) : cur) : [...cur, p],
    );
  };

  const saveSubmissions = (newSubs: WaitlistSubmission[]) => {
    setAllSubmissions(newSubs);
    try {
      localStorage.setItem(ALL_SUBMISSIONS_KEY, JSON.stringify(newSubs));
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please provide a valid work or personal email.");
      return;
    }

    const calculatedPos = allSubmissions.length + 1;
    const now = new Date();
    const timestamp = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`;

    const newSubmission: WaitlistSubmission = {
      id: `lead-${Date.now()}`,
      name: name.trim() || "Builder",
      email: email.trim(),
      useCase,
      platforms: pickedPlatforms,
      hardware,
      timestamp,
      position: calculatedPos,
      status: "Priority Confirmed",
    };

    const updated = [
      newSubmission,
      ...allSubmissions.filter((s) => s.email.toLowerCase() !== newSubmission.email.toLowerCase()),
    ];
    saveSubmissions(updated);

    const entry: WaitlistData = {
      name: newSubmission.name,
      email: newSubmission.email,
      useCase: newSubmission.useCase,
      platforms: newSubmission.platforms,
      hardware: newSubmission.hardware || hardware,
      position: calculatedPos,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
    } catch {
      // ignore
    }

    setData(entry);

    // Sync seamlessly into backend CRM store
    crmService
      .createLead({
        name: newSubmission.name,
        email: newSubmission.email,
        company: newSubmission.useCase.includes("Enterprise")
          ? "Enterprise Pilot"
          : "Independent Operator",
        status: "New Lead",
        dealValue: 120,
        score: 85,
        useCase: `${newSubmission.useCase} (${newSubmission.hardware})`,
        notes: `Joined waitlist from website. Platforms: ${pickedPlatforms.join(", ")}. Hardware: ${hardware}`,
      })
      .catch((err) => {
        console.warn("Backend CRM sync status:", err);
      });

    toast.success("You are on the priority list!", {
      description: `Waitlist ticket #${calculatedPos} recorded and synced to CRM. Click 'View in Excel' to inspect.`,
    });
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setData(null);
    setName("");
    setEmail("");
  };

  const handleClearAll = () => {
    saveSubmissions([]);
    toast.success("Excel waitlist database cleared.");
  };

  return (
    <section id="waitlist" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-28 relative">
      <BorderGlow
        borderRadius={24}
        glowColor="25 95% 53%"
        glowRadius={30}
        glowIntensity={0.6}
        colors={["#ff6b00", "#ff8533", "#ea580c"]}
        className="w-full"
      >
        <div className="relative overflow-hidden rounded-3xl bg-titanium border border-titanium-border p-8 sm:p-11 backdrop-blur-xl shadow-2xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald/5 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-titanium-border/30 blur-3xl" />

          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] text-titanium-silver">
                  PRIORITY PIPELINE
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-stark sm:text-3xl">
                  Join the VESPER Pro &amp; Multi-Platform Beta
                </h2>
              </div>

              {/* View in Excel Trigger Button */}
              <button
                type="button"
                onClick={() => setIsExcelOpen(true)}
                className="group flex items-center gap-2 rounded-xl border border-[#107c41]/50 bg-[#107c41]/10 px-3.5 py-2 text-xs font-semibold text-[#107c41] transition-all hover:bg-[#107c41]/20 hover:border-[#107c41] active:scale-[0.98] shadow-sm"
                title="Open live spreadsheet view of all submissions"
              >
                <FileSpreadsheet className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>View Database in Excel ({allSubmissions.length})</span>
              </button>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-titanium-silver">
              Be the first to access on-device offline Whisper models, team custom dictionaries, and
              cross-platform companion releases. All submissions are indexed into an Excel-ready
              database.
            </p>

            {data === null ? (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-medium text-stark">Your Name</span>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ada Lovelace"
                      className="mt-1.5 w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3.5 py-2.5 text-sm text-stark outline-none transition-all placeholder:text-titanium-silver/40 focus:border-emerald focus:ring-1 focus:ring-emerald"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-medium text-stark">Work or Personal Email</span>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ada@company.com"
                      className="mt-1.5 w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3.5 py-2.5 text-sm text-stark outline-none transition-all placeholder:text-titanium-silver/40 focus:border-emerald focus:ring-1 focus:ring-emerald"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-medium text-stark">Primary Role / Use Case</span>
                    <select
                      value={useCase}
                      onChange={(e) => setUseCase(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3.5 py-2.5 text-sm text-stark outline-none transition-all focus:border-emerald focus:ring-1 focus:ring-emerald"
                    >
                      {[
                        "Developer / Engineer",
                        "Writer / Creator",
                        "Founder / Exec",
                        "Customer Support",
                        "Other",
                      ].map((o) => (
                        <option key={o} value={o} className="bg-titanium">
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-xs font-medium text-stark">
                      Target GPU / Architecture
                    </span>
                    <select
                      value={hardware}
                      onChange={(e) => setHardware(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3.5 py-2.5 text-sm text-stark outline-none transition-all focus:border-emerald focus:ring-1 focus:ring-emerald"
                    >
                      {HARDWARE_OPTIONS.map((h) => (
                        <option key={h} value={h} className="bg-titanium">
                          {h}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div>
                  <span className="text-xs font-medium text-stark">Platform Interest</span>
                  <div className="mt-2 flex flex-wrap gap-2.5">
                    {PLATFORMS.map((p) => {
                      const isSelected = pickedPlatforms.includes(p);
                      return (
                        <button
                          type="button"
                          key={p}
                          onClick={() => togglePlatform(p)}
                          className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                            isSelected
                              ? "border-emerald/50 bg-emerald/10 text-emerald shadow-sm"
                              : "border-titanium-border bg-titanium-elevated text-titanium-silver hover:border-titanium-silver/40 hover:text-stark"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                          <span>{p}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3">
                  <Magnet padding={40} magnetStrength={3} wrapperClassName="w-full">
                    <StarBorder
                      as="button"
                      type="submit"
                      color="#ff6b00"
                      speed="3.5s"
                      thickness={1.5}
                      backgroundColor="#ff6b00"
                      textColor="#ffffff"
                      className="w-full text-sm font-semibold shadow-md transition-all hover:opacity-95 active:scale-[0.99]"
                    >
                      <div className="flex items-center justify-center gap-2 py-3 px-5 text-white font-bold">
                        <span>Get Priority Access &amp; Save to Excel</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </StarBorder>
                  </Magnet>
                </div>
              </form>
            ) : (
              <div className="mt-8 rounded-2xl border border-emerald/40 bg-titanium-elevated p-6 shadow-xl">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/10 text-emerald border border-emerald/30">
                      <Ticket className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-stark">
                        You are on the list, {data.name.split(" ")[0]}!
                      </h3>
                      <ShinyText
                        text="VESPER PRO PRIORITY PASS"
                        speed={2}
                        color="#ff6b00"
                        shineColor="#ffffff"
                        className="font-mono text-[11px] font-semibold"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-xs text-titanium-silver hover:text-stark underline font-mono"
                  >
                    Edit details
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-titanium-border pt-5">
                  <div>
                    <span className="text-xs text-titanium-silver">Registered Email</span>
                    <p className="mt-0.5 font-mono text-xs text-stark truncate">{data.email}</p>
                  </div>
                  <div>
                    <span className="text-xs text-titanium-silver">Target Platforms</span>
                    <p className="mt-0.5 text-xs text-stark">{data.platforms.join(", ")}</p>
                  </div>
                  <div>
                    <span className="text-xs text-titanium-silver">Hardware Target</span>
                    <p className="mt-0.5 text-xs text-stark truncate">
                      {data.hardware || "NVIDIA / Intel"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-emerald/30 bg-emerald/5 p-4">
                  <div className="flex flex-col">
                    <span className="font-mono text-[11px] text-emerald font-semibold uppercase tracking-wider">
                      Confirmed Waitlist Position
                    </span>
                    <span className="text-xs text-titanium-silver">
                      Stored in live Excel database. Invites batch weekly.
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setIsExcelOpen(true)}
                      className="flex items-center gap-1.5 rounded-lg border border-[#107c41]/50 bg-[#107c41]/10 px-3 py-1.5 text-xs font-semibold text-[#107c41] transition-all hover:bg-[#107c41]/20"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      <span>View in Excel</span>
                    </button>
                    <div className="flex items-baseline font-mono text-3xl font-bold text-emerald">
                      <span>#</span>
                      <CountUp to={data.position} duration={1.5} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </BorderGlow>

      {/* Full-featured Excel spreadsheet viewer modal */}
      <ExcelWaitlistModal
        isOpen={isExcelOpen}
        onClose={() => setIsExcelOpen(false)}
        submissions={allSubmissions}
        onClear={handleClearAll}
      />
    </section>
  );
}

export default Waitlist;
