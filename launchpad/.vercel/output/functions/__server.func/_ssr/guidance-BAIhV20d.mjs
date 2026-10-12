import { o as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAuth } from "./auth-context-DIX5izGL.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as Key, P as Lock, X as Cpu, Z as Copy, _ as Shield, d as Terminal, h as Sparkles, lt as ArrowRight, rt as CircleAlert, tt as CircleCheck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guidance-BAIhV20d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sections = [
	{
		id: "quickstart",
		title: "Quickstart & Setup",
		icon: Sparkles
	},
	{
		id: "hardware-hooks",
		title: "Hardware & Win32 Hooks",
		icon: Cpu
	},
	{
		id: "zero-backspace",
		title: "Zero-Backspace Philosophy",
		icon: Terminal
	},
	{
		id: "licensing",
		title: "Licensing & Desktop Gate",
		icon: Key
	},
	{
		id: "privacy",
		title: "Privacy Sandbox & Inference",
		icon: Shield
	},
	{
		id: "troubleshooting",
		title: "Troubleshooting & Diagnostics",
		icon: CircleAlert
	}
];
function GuidancePage() {
	const [activeSection, setActiveSection] = (0, import_react.useState)("quickstart");
	const [copiedKey, setCopiedKey] = (0, import_react.useState)(false);
	const [licenseInput, setLicenseInput] = (0, import_react.useState)("");
	const [licenseStatus, setLicenseStatus] = (0, import_react.useState)(null);
	const [isCheckingLicense, setIsCheckingLicense] = (0, import_react.useState)(false);
	const { user, verifyLicense } = useAuth();
	(0, import_react.useEffect)(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.get("verified") === "true") {
			toast.success("Account & License Verified!", { description: "Your VESPER software license is active. You can now use the desktop application." });
			const licenseParam = params.get("license");
			if (licenseParam) setLicenseInput(licenseParam);
		}
	}, []);
	const handleTestLicense = async () => {
		const key = licenseInput.trim() || user?.licenseKey || "";
		if (!key) {
			toast.error("Please enter a VESPER license key to verify.");
			return;
		}
		setIsCheckingLicense(true);
		setLicenseStatus(null);
		try {
			const res = await verifyLicense(key);
			setLicenseStatus(res);
			if (res.valid) toast.success(`License Active [${res.tier?.toUpperCase()}]`, { description: "Authorized for unlimited native desktop client sessions." });
			else toast.error(res.error || "License verification failed.");
		} catch {
			toast.error("Error connecting to license verification service.");
		} finally {
			setIsCheckingLicense(false);
		}
	};
	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text);
		toast.success("Copied to clipboard");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-obsidian text-stark pt-24 pb-20 px-4 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 font-mono text-xs text-titanium-silver mb-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:text-emerald transition-colors",
							children: "VESPER"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-emerald",
							children: "Guidance & Documentation"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-titanium-border pb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3",
						children: "VESPER Guidance & Operational Manual"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base text-titanium-silver max-w-3xl leading-relaxed",
						children: "The technical manual for configuring VESPER's local-first speech pipeline, low-level Win32 event hooks, ambient context MCP protocol, and subscription license verification."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "rounded-lg border border-titanium-border bg-titanium px-4 py-2 text-xs font-semibold text-titanium-silver hover:text-white hover:border-titanium-silver/40 transition-all",
							children: "Launchpad Home"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "/#download",
							className: "flex items-center gap-2 rounded-lg bg-emerald px-4 py-2 text-xs font-bold text-obsidian shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download Desktop Client" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
						})]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-4 gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "lg:col-span-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sticky top-24 rounded-2xl border border-titanium-border bg-titanium/60 p-3 backdrop-blur-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-titanium-silver/70 font-semibold",
								children: "Documentation Index"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
								className: "flex flex-col gap-1 mt-1",
								children: sections.map((sec) => {
									const Icon = sec.icon;
									const isActive = activeSection === sec.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setActiveSection(sec.id),
										className: `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium text-left transition-all ${isActive ? "bg-emerald/15 text-emerald font-semibold border border-emerald/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]" : "text-titanium-silver hover:bg-titanium-elevated hover:text-white"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 shrink-0 ${isActive ? "text-emerald" : "text-titanium-silver"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sec.title })]
									}, sec.id);
								})
							}),
							user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 pt-4 border-t border-titanium-border/60 px-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-[10px] uppercase text-titanium-silver/70 mb-1",
										children: "Your Active License"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between rounded-lg border border-titanium-border bg-obsidian px-2.5 py-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs font-bold text-emerald truncate",
											children: user.licenseKey || "VESPER-PRO-ACTIVE"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => copyToClipboard(user.licenseKey || "VESPER-PRO-ACTIVE"),
											className: "text-titanium-silver hover:text-white ml-1 shrink-0",
											title: "Copy Key",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1.5 flex items-center justify-between text-[10px] text-titanium-silver",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Tier: ", user.tier?.toUpperCase() || "PRO"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald font-medium",
											children: "● Verified"
										})]
									})
								]
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "lg:col-span-3 space-y-12",
					children: [
						activeSection === "quickstart" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-titanium-border bg-titanium/50 p-6 sm:p-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 text-emerald mb-2 font-mono text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "01 // ONBOARDING" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-2xl font-bold text-white mb-4",
										children: "Quickstart & Initial Setup"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-titanium-silver leading-relaxed mb-6",
										children: "VESPER runs as a local-first Windows service with a lightweight system tray companion. It binds directly to your global keyboard and audio input drivers to enable zero-latency voice dictation across all active software."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-8",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-mono text-xs text-emerald mb-1 font-bold",
														children: "1. Install"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-xs text-white font-medium mb-1",
														children: "Download Native Package"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-titanium-silver",
														children: "Grab the Windows 64-bit installer (.exe) or portable build. Run the installer to register low-level hooks."
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-mono text-xs text-emerald mb-1 font-bold",
														children: "2. Activate"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-xs text-white font-medium mb-1",
														children: "Enter License Key"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-titanium-silver",
														children: "Paste your verified VESPER License Key generated upon account registration into the desktop setup prompt."
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-mono text-xs text-emerald mb-1 font-bold",
														children: "3. Speak"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-xs text-white font-medium mb-1",
														children: "Hold F8 to Talk"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-titanium-silver",
														children: "Hold F8 anywhere in Windows. Speak naturally. Release F8 to paste polished text instantly at your cursor."
													})
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base font-bold text-white mb-3",
										children: "System Prerequisites"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "space-y-2 text-xs text-titanium-silver font-mono",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Windows 10 (Build 19041+) or Windows 11 (64-bit architecture)" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DirectML / AVX2 capable processor for offline ONNX neural fallback" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Active microphone input with standard 16kHz or 48kHz sampling support" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Administrative privileges required only for first-time low-level hook registration" })]
											})
										]
									})
								]
							})
						}),
						activeSection === "hardware-hooks" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-titanium-border bg-titanium/50 p-6 sm:p-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 text-emerald mb-2 font-mono text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "02 // ARCHITECTURE" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-2xl font-bold text-white mb-4",
										children: "Hardware & Win32 Hooks Deep-Dive"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-titanium-silver leading-relaxed mb-6",
										children: "Unlike web-based or Electron overlay tools that take window focus, VESPER uses direct Windows OS subsystems to maintain completely transparent execution."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between mb-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-xs text-emerald font-bold",
														children: "WH_KEYBOARD_LL Interception"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-[10px] text-titanium-silver",
														children: "Sub-0.5ms Polling"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "VESPER registers a low-level keyboard hook callback via the Win32 API. Key presses (such as F8 or configured modifiers) are intercepted before reaching standard message loops, eliminating any delay or interference with foreground applications."
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between mb-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-xs text-emerald font-bold",
														children: "Raw 16kHz Audio Ring Buffer"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-[10px] text-titanium-silver",
														children: "Volatile RAM Storage"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "Microphone capture operates on a dedicated background audio thread. As soon as the trigger key is depressed, the driver records 16-bit PCM chunks into an in-memory ring buffer. No temporary audio files are ever written to disk."
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between mb-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-xs text-emerald font-bold",
														children: "Zero-Focus Window Text Injection"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-[10px] text-titanium-silver",
														children: "SendInput API"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "When speech finishes, transcribed text is emitted into the exact focused control using native keystroke events. You can dictate into VS Code, Cursor Composer, Windows Terminal, Slack, or any custom desktop application without the focus stealing or window switching of traditional assistants."
												})]
											})
										]
									})
								]
							})
						}),
						activeSection === "zero-backspace" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-titanium-border bg-titanium/50 p-6 sm:p-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 text-emerald mb-2 font-mono text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "03 // SPEECH PHILOSOPHY" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-2xl font-bold text-white mb-4",
										children: "The Zero-Backspace Rule"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-titanium-silver leading-relaxed mb-6",
										children: "Real-time dictation engines typically stream partial tokens into the active cursor, causing rapid backspacing, cursor jumping, and disruption of code indentations. VESPER eliminates this entirely."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-emerald/30 bg-emerald/5 p-5 mb-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-xs text-emerald font-bold mb-2",
											children: "CORE PRINCIPLE: ATOMIC SYNTHESIS"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-titanium-silver leading-relaxed",
											children: "VESPER holds transcription until speech finishes. The neural engine cleans hesitation fillers, formats code symbols and punctuation, and injects the final string as an atomic keystroke sequence. The cursor moves once, exactly where it belongs. Zero backspaces. Zero cursor jitter."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base font-bold text-white mb-3",
										children: "Spoken Formatting Shortcuts"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "overflow-x-auto rounded-xl border border-titanium-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
											className: "w-full text-left text-xs font-mono",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
												className: "border-b border-titanium-border bg-titanium-elevated text-titanium-silver",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "p-3",
														children: "You Say"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "p-3",
														children: "VESPER Injects"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "p-3",
														children: "Behavior"
													})
												] })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
												className: "divide-y divide-titanium-border/60 text-titanium-silver",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 text-white",
															children: "\"new line\" or \"line break\""
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 text-emerald font-bold",
															children: "\\n"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3",
															children: "Inserts Enter keystroke"
														})
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 text-white",
															children: "\"function parse user token camel case\""
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 text-emerald font-bold",
															children: "parseUserToken"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3",
															children: "Converts to code identifier"
														})
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 text-white",
															children: "\"open brace close brace\""
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 text-emerald font-bold",
															children: "{}"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3",
															children: "Inserts brackets"
														})
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 text-white",
															children: "\"git status dash s\""
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 text-emerald font-bold",
															children: "git status -s"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3",
															children: "Formats CLI arguments"
														})
													] })
												]
											})]
										})
									})
								]
							})
						}),
						activeSection === "licensing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-titanium-border bg-titanium/50 p-6 sm:p-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 text-emerald mb-2 font-mono text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "04 // SOFTWARE LICENSING" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-2xl font-bold text-white mb-4",
										children: "Desktop App Subscription & License Verification"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-titanium-silver leading-relaxed mb-6",
										children: "Similar to professional developer toolchains, VESPER protects its proprietary neural runtime and ambient memory protocol through authenticated software licenses. Users must verify their account to unlock desktop client access."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium-elevated p-5 mb-8",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
												className: "text-sm font-bold text-white mb-2 flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Live License Gate Verification" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-titanium-silver mb-4",
												children: "Test your license key against the live MongoDB verification engine (/api/license/verify)."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col sm:flex-row gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: licenseInput,
													onChange: (e) => setLicenseInput(e.target.value),
													placeholder: user?.licenseKey || "VESPER-XXXX-XXXX-XXXX",
													className: "flex-1 rounded-lg border border-titanium-border bg-obsidian px-3.5 py-2 font-mono text-xs text-white placeholder:text-titanium-silver/50 focus:border-emerald focus:outline-none"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: handleTestLicense,
													disabled: isCheckingLicense,
													className: "rounded-lg bg-emerald px-5 py-2 text-xs font-bold text-obsidian hover:bg-emerald-400 disabled:opacity-50 transition-all shrink-0",
													children: isCheckingLicense ? "Verifying..." : "Validate Key"
												})]
											}),
											licenseStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: `mt-4 rounded-lg p-3 text-xs font-mono border ${licenseStatus.valid ? "border-emerald/40 bg-emerald/10 text-emerald" : "border-red-500/40 bg-red-500/10 text-red-400"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-bold mb-1",
													children: licenseStatus.valid ? "✓ LICENSE VALID & ACTIVE" : "✗ VERIFICATION REJECTED"
												}), licenseStatus.valid ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Key: ", licenseStatus.licenseKey] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Tier: ", licenseStatus.tier?.toUpperCase()] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
														"Quota: ",
														licenseStatus.quota?.totalSeconds,
														"s total speech capacity"
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Engine: ", licenseStatus.engineConfig?.neuralPipeline] })
												] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: licenseStatus.error })]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base font-bold text-white mb-3",
										children: "Subscription Tier Specifications"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 md:grid-cols-3 gap-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium p-4",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-mono text-xs text-titanium-silver uppercase mb-1",
														children: "Free Community"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-xl font-bold text-white mb-2",
														children: "$0"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-titanium-silver mb-3",
														children: "Ideal for evaluating local Hold-to-Talk and offline ONNX models."
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-[11px] font-mono text-titanium-silver space-y-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "• 3,600s speech quota" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "• Direct dictation mode" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "• Local model support" })
														]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-emerald/50 bg-emerald/5 p-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-mono text-xs text-emerald uppercase mb-1 font-bold",
														children: "Pro Developer"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-xl font-bold text-white mb-2",
														children: "$12/mo"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-titanium-silver mb-3",
														children: "For engineers, founders, and power writers seeking sub-180ms neural latency."
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-[11px] font-mono text-emerald space-y-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "• 72,000s speech quota" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "• Sub-180ms Neural Pipeline" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "• VESPER Ambient Context MCP" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "• Priority model routing" })
														]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium p-4",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-mono text-xs text-titanium-silver uppercase mb-1",
														children: "Enterprise"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-xl font-bold text-white mb-2",
														children: "Custom"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-titanium-silver mb-3",
														children: "Air-gapped on-premise clusters, HIPAA compliance, and seat governance."
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-[11px] font-mono text-titanium-silver space-y-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "• Unlimited seat capacity" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "• Zero-data-retention SLA" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "• Dedicated hardware cluster" })
														]
													})
												]
											})
										]
									})
								]
							})
						}),
						activeSection === "privacy" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-titanium-border bg-titanium/50 p-6 sm:p-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 text-emerald mb-2 font-mono text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "05 // SECURITY GOVERNANCE" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-2xl font-bold text-white mb-4",
										children: "Privacy Sandbox & Neural Runtime"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-titanium-silver leading-relaxed mb-6",
										children: "Developer workstations contain critical keys, SSH credentials, and private intellectual property. VESPER is architected with strict confidentiality boundaries at every tier."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-mono text-xs text-emerald font-bold mb-1",
													children: "1. Local Credential Sanitization"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "Before context is passed to the ambient memory MCP or neural speech models, regex filters automatically detect and redact bearer tokens, API keys, passwords, and sensitive environment strings locally on your CPU."
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-mono text-xs text-emerald font-bold mb-1",
													children: "2. 100% Offline Air-Gapped Fallback"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "For defense, legal, or medical institutions where outbound internet traffic is forbidden, VESPER includes a DirectML INT8 ONNX offline speech engine that executes entirely on local GPUs or NPUs without sending a single packet over the network."
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-mono text-xs text-emerald font-bold mb-1",
													children: "3. Zero Cloud Audio Retention"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "When using high-speed private cloud inference, audio is streamed over encrypted TLS, transcribed statelessly, and immediately freed from RAM. No audio files or transcripts are ever stored, cached, or used to train third-party models."
												})]
											})
										]
									})
								]
							})
						}),
						activeSection === "troubleshooting" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-titanium-border bg-titanium/50 p-6 sm:p-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 text-emerald mb-2 font-mono text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "06 // DIAGNOSTICS" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-2xl font-bold text-white mb-4",
										children: "Troubleshooting & Diagnostic FAQ"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-titanium-silver leading-relaxed mb-6",
										children: "Resolutions for common Windows hardware, permissions, and network setup questions."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "text-xs font-bold text-white mb-1",
													children: "Q: Why does F8 not trigger when running terminal or IDE as Administrator?"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "Windows User Interface Privilege Isolation (UIPI) prevents applications running at standard integrity from injecting keystrokes into elevated Administrator windows. To resolve this, run VESPER as Administrator, or launch both processes under the same privilege level."
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "text-xs font-bold text-white mb-1",
													children: "Q: Windows Defender or Antivirus flags the keyboard hook executable. Is it safe?"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "Low-level keyboard hooks (WH_KEYBOARD_LL) are common triggers for heuristic scanner warnings because malware keyloggers use similar OS hooks. VESPER is code-signed and strictly reads the trigger key without logging background keystrokes. Add VESPER to your Defender whitelist if prompted."
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "text-xs font-bold text-white mb-1",
													children: "Q: Microphone audio shows zero volume or transcription times out."
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "Check Windows Settings > Privacy & Security > Microphone. Ensure \"Let desktop apps access your microphone\" is toggled ON. In VESPER Settings, ensure your primary recording device is selected instead of a virtual audio loopback cable."
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "text-xs font-bold text-white mb-1",
													children: "Q: How do I change the default trigger key from F8?"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "Open the VESPER system tray icon > Preferences > Shortcuts. You can assign any single key or combination (e.g., Caps Lock, Right Alt, Ctrl+Shift+Space, or dedicated mouse thumb buttons)."
												})]
											})
										]
									})
								]
							})
						})
					]
				})]
			})]
		})
	});
}
//#endregion
export { GuidancePage as component };
