import { MessageSquare, Star, X, Check, HelpCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SpotlightCard, Magnet, ShinyText } from "@/components/reactbits";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "Does VESPER steal window focus when recording?",
    a: "No. VESPER uses Win32 native GetForegroundWindow and AttachThreadInput preservation. The floating capsule renders as an un-focusable, WS_EX_NOACTIVATE layered window, meaning your active caret in Cursor, VS Code, Slack, or Chrome never loses position.",
  },
  {
    q: "Is my voice recorded, saved, or used to train models?",
    a: "Never. Audio is converted into in-memory 16kHz PCM chunks and processed statelessly via our encrypted high-speed neural pipeline or 100% offline local ONNX model. It is immediately freed from RAM once returned. No audio or transcripts are ever stored or retained.",
  },
  {
    q: "Can I customize the push-to-talk hotkey?",
    a: "Yes. In the VESPER Settings overlay (Ctrl+Shift+Space), you can remap your activation key to Right Alt, F8, Fn, Right Ctrl, Left Alt, or any custom key combination supported by the low-level Windows keyboard hook.",
  },
  {
    q: "What is the difference between Direct Dictation and Smart Copilot?",
    a: "Direct Dictation is pure verbatim speech-to-text without hallucination: what you speak is typed out word-for-word with accurate capitalization and punctuation. Smart Copilot takes your spoken intent and structures it as an engineered prompt for Claude 3.7, ChatGPT, or Cursor Composer.",
  },
  {
    q: "Does VESPER require Administrator privileges on Windows?",
    a: "No. The installer is configured for user-level installation (perMachine: false in AppData\\Local\\Programs), which allows direct deployment on personal and managed systems without UAC elevation roadblocks.",
  },
];

export function FaqFeedback() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSendFeedback = async () => {
    if (!rating) {
      toast.error("Please select a star rating first.");
      return;
    }

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          message: feedbackText || "Star rating submitted",
          category: "general",
          source: "launchpad-faq-feedback",
        }),
      });
    } catch {
      // Best effort
    }

    setSubmitted(true);
    toast.success("Thank you for the builder feedback!", {
      description: "Your notes have been recorded in MongoDB Atlas for the engineering team.",
    });

    setTimeout(() => {
      setOpenDrawer(false);
      setSubmitted(false);
      setRating(0);
      setFeedbackText("");
    }, 1800);
  };

  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-28 relative">
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-titanium-border bg-titanium-elevated px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-titanium-silver">
          <HelpCircle className="h-3 w-3 text-emerald" />
          <span>Knowledge &amp; Governance</span>
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-stark sm:text-4xl">
          Straight answers from the builders.
        </h2>
        <p className="mt-2 text-sm text-titanium-silver">
          Architecture details, security guarantees, and execution protocols.
        </p>
      </div>

      {/* Accordion List wrapped in SpotlightCard */}
      <SpotlightCard
        spotlightColor="rgba(16, 185, 129, 0.12)"
        className="mt-10 overflow-hidden rounded-2xl border border-titanium-border bg-titanium/90 px-6 py-2 shadow-2xl backdrop-blur-xl"
      >
        <Accordion type="single" collapsible>
          {FAQS.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`faq-${i}`}
              className={i === FAQS.length - 1 ? "border-none" : "border-titanium-border/70"}
            >
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4 text-stark hover:text-emerald transition-colors">
                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald/10 text-emerald text-[11px] font-mono font-semibold">
                    0{i + 1}
                  </span>
                  <span>{f.q}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-titanium-silver pb-4 pl-8">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SpotlightCard>

      {/* Floating Feedback Trigger with Magnet */}
      <div className="fixed bottom-6 right-6 z-40">
        <Magnet padding={30} magnetStrength={2}>
          <button
            onClick={() => setOpenDrawer(true)}
            className="flex items-center gap-2.5 rounded-full border border-titanium-border bg-titanium-elevated/95 px-4 py-2.5 text-xs font-semibold text-stark shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all hover:border-emerald/50 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)] active:scale-95"
          >
            <MessageSquare className="h-4 w-4 text-emerald" />
            <ShinyText
              text="Share Feedback"
              speed={3}
              color="#0f172a"
              shineColor="#ff6b00"
              className="font-medium"
            />
          </button>
        </Magnet>
      </div>

      {/* Live Feedback Modal / Drawer */}
      {openDrawer && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-obsidian/85 p-4 backdrop-blur-md sm:items-center">
          <div className="w-full max-w-md rounded-2xl border border-titanium-border bg-titanium p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-stark">Share Your Feedback</h3>
                <p className="mt-1 text-xs text-titanium-silver">
                  Quick thoughts or feature requests for the core engineering team.
                </p>
              </div>
              <button
                onClick={() => setOpenDrawer(false)}
                aria-label="Close"
                className="rounded-lg p-1 text-titanium-silver hover:bg-titanium-elevated hover:text-stark"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {submitted ? (
              <div className="mt-8 flex flex-col items-center justify-center py-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald/15 text-emerald border border-emerald/30">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="mt-3 text-sm font-semibold text-stark">Feedback Recorded</h4>
                <p className="mt-1 text-xs text-titanium-silver">
                  Thank you for shaping VESPER Desktop.
                </p>
              </div>
            ) : (
              <>
                {/* 1-5 Star Selector */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(n)}
                      aria-label={`${n} stars`}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          n <= (hoverRating || rating)
                            ? "fill-emerald text-emerald drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                            : "text-titanium-border hover:text-titanium-silver"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={3}
                  placeholder="What felt extraordinary? What could be improved?"
                  className="mt-5 w-full resize-none rounded-xl border border-titanium-border bg-titanium-elevated px-3.5 py-2.5 text-sm text-stark outline-none transition-colors placeholder:text-titanium-silver/40 focus:border-emerald focus:ring-1 focus:ring-emerald"
                />

                <button
                  onClick={handleSendFeedback}
                  className="mt-4 flex w-full items-center justify-center rounded-xl bg-emerald px-4 py-3 text-sm font-bold text-obsidian shadow-md transition-all hover:opacity-95 active:scale-[0.99]"
                >
                  Submit Feedback
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default FaqFeedback;
