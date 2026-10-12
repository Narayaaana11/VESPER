import { r as __toESM } from "../_runtime.mjs";
import { c as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as useAuth } from "./auth-context-CFmidOKR.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as Key, P as Lock, X as Cpu, Z as Copy, _ as Shield, d as Terminal, h as Sparkles, rt as CircleAlert, tt as CircleCheck, ut as ArrowRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guidance-CZozgtuu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/gowri/Videos/QEVRA/launchpad/src/routes/guidance.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen bg-obsidian text-stark pt-24 pb-20 px-4 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-auto max-w-7xl",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mb-10",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2 font-mono text-xs text-titanium-silver mb-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/",
							className: "hover:text-emerald transition-colors",
							children: "VESPER"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 88,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "/" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 91,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-emerald",
							children: "Guidance & Documentation"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 92,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 87,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-titanium-border pb-8",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3",
						children: "VESPER Guidance & Operational Manual"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 97,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-base text-titanium-silver max-w-3xl leading-relaxed",
						children: "The technical manual for configuring VESPER's local-first speech pipeline, low-level Win32 event hooks, ambient context MCP protocol, and subscription license verification."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 100,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 96,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-3 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/",
							className: "rounded-lg border border-titanium-border bg-titanium px-4 py-2 text-xs font-semibold text-titanium-silver hover:text-white hover:border-titanium-silver/40 transition-all",
							children: "Launchpad Home"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 107,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
							href: "/#download",
							className: "flex items-center gap-2 rounded-lg bg-emerald px-4 py-2 text-xs font-bold text-obsidian shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Download Desktop Client" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 111,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 112,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 110,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 106,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 95,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 86,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-1 lg:grid-cols-4 gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
					className: "lg:col-span-1",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "sticky top-24 rounded-2xl border border-titanium-border bg-titanium/60 p-3 backdrop-blur-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-titanium-silver/70 font-semibold",
								children: "Documentation Index"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 123,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
								className: "flex flex-col gap-1 mt-1",
								children: sections.map((sec) => {
									const Icon = sec.icon;
									const isActive = activeSection === sec.id;
									return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => setActiveSection(sec.id),
										className: `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium text-left transition-all ${isActive ? "bg-emerald/15 text-emerald font-semibold border border-emerald/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]" : "text-titanium-silver hover:bg-titanium-elevated hover:text-white"}`,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: `h-4 w-4 shrink-0 ${isActive ? "text-emerald" : "text-titanium-silver"}` }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 131,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: sec.title }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 132,
											columnNumber: 23
										}, this)]
									}, sec.id, true, {
										fileName: _jsxFileName,
										lineNumber: 130,
										columnNumber: 24
									}, this);
								})
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 126,
								columnNumber: 15
							}, this),
							user && /* @__PURE__ */ (void 0)("div", {
								className: "mt-6 pt-4 border-t border-titanium-border/60 px-2",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "font-mono text-[10px] uppercase text-titanium-silver/70 mb-1",
										children: "Your Active License"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 139,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center justify-between rounded-lg border border-titanium-border bg-obsidian px-2.5 py-1.5",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "font-mono text-xs font-bold text-emerald truncate",
											children: user.licenseKey || "VESPER-PRO-ACTIVE"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 143,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("button", {
											type: "button",
											onClick: () => copyToClipboard(user.licenseKey || "VESPER-PRO-ACTIVE"),
											className: "text-titanium-silver hover:text-white ml-1 shrink-0",
											title: "Copy Key",
											children: /* @__PURE__ */ (void 0)(Copy, { className: "h-3.5 w-3.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 147,
												columnNumber: 23
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 146,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 142,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "mt-1.5 flex items-center justify-between text-[10px] text-titanium-silver",
										children: [/* @__PURE__ */ (void 0)("span", { children: ["Tier: ", user.tier?.toUpperCase() || "PRO"] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 151,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "text-emerald font-medium",
											children: "● Verified"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 152,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 150,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 138,
								columnNumber: 24
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 122,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 121,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
					className: "lg:col-span-3 space-y-12",
					children: [
						activeSection === "quickstart" && /* @__PURE__ */ (void 0)("div", {
							className: "space-y-6",
							children: /* @__PURE__ */ (void 0)("div", {
								className: "rounded-2xl border border-titanium-border bg-titanium/50 p-6 sm:p-8",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center gap-3 text-emerald mb-2 font-mono text-xs",
										children: [/* @__PURE__ */ (void 0)(Sparkles, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 164,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("span", { children: "01 // ONBOARDING" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 165,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 163,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("h2", {
										className: "text-2xl font-bold text-white mb-4",
										children: "Quickstart & Initial Setup"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 167,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("p", {
										className: "text-sm text-titanium-silver leading-relaxed mb-6",
										children: "VESPER runs as a local-first Windows service with a lightweight system tray companion. It binds directly to your global keyboard and audio input drivers to enable zero-latency voice dictation across all active software."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 168,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-8",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [
													/* @__PURE__ */ (void 0)("div", {
														className: "font-mono text-xs text-emerald mb-1 font-bold",
														children: "1. Install"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 176,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "text-xs text-white font-medium mb-1",
														children: "Download Native Package"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 177,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (void 0)("p", {
														className: "text-[11px] text-titanium-silver",
														children: "Grab the Windows 64-bit installer (.exe) or portable build. Run the installer to register low-level hooks."
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 178,
														columnNumber: 23
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 175,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [
													/* @__PURE__ */ (void 0)("div", {
														className: "font-mono text-xs text-emerald mb-1 font-bold",
														children: "2. Activate"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 184,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "text-xs text-white font-medium mb-1",
														children: "Enter License Key"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 185,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (void 0)("p", {
														className: "text-[11px] text-titanium-silver",
														children: "Paste your verified VESPER License Key generated upon account registration into the desktop setup prompt."
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 186,
														columnNumber: 23
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 183,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [
													/* @__PURE__ */ (void 0)("div", {
														className: "font-mono text-xs text-emerald mb-1 font-bold",
														children: "3. Speak"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 192,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "text-xs text-white font-medium mb-1",
														children: "Hold F8 to Talk"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 193,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (void 0)("p", {
														className: "text-[11px] text-titanium-silver",
														children: "Hold F8 anywhere in Windows. Speak naturally. Release F8 to paste polished text instantly at your cursor."
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 194,
														columnNumber: 23
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 191,
												columnNumber: 21
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 174,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("h3", {
										className: "text-base font-bold text-white mb-3",
										children: "System Prerequisites"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 200,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("ul", {
										className: "space-y-2 text-xs text-titanium-silver font-mono",
										children: [
											/* @__PURE__ */ (void 0)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 203,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("span", { children: "Windows 10 (Build 19041+) or Windows 11 (64-bit architecture)" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 204,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 202,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 207,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("span", { children: "DirectML / AVX2 capable processor for offline ONNX neural fallback" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 208,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 206,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 211,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("span", { children: "Active microphone input with standard 16kHz or 48kHz sampling support" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 212,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 210,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 215,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("span", { children: "Administrative privileges required only for first-time low-level hook registration" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 216,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 214,
												columnNumber: 21
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 201,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 162,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 161,
							columnNumber: 48
						}, this),
						activeSection === "hardware-hooks" && /* @__PURE__ */ (void 0)("div", {
							className: "space-y-6",
							children: /* @__PURE__ */ (void 0)("div", {
								className: "rounded-2xl border border-titanium-border bg-titanium/50 p-6 sm:p-8",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center gap-3 text-emerald mb-2 font-mono text-xs",
										children: [/* @__PURE__ */ (void 0)(Cpu, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 226,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("span", { children: "02 // ARCHITECTURE" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 227,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 225,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("h2", {
										className: "text-2xl font-bold text-white mb-4",
										children: "Hardware & Win32 Hooks Deep-Dive"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 229,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("p", {
										className: "text-sm text-titanium-silver leading-relaxed mb-6",
										children: "Unlike web-based or Electron overlay tools that take window focus, VESPER uses direct Windows OS subsystems to maintain completely transparent execution."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 230,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "space-y-4",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (void 0)("div", {
													className: "flex items-center justify-between mb-2",
													children: [/* @__PURE__ */ (void 0)("span", {
														className: "font-mono text-xs text-emerald font-bold",
														children: "WH_KEYBOARD_LL Interception"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 238,
														columnNumber: 25
													}, this), /* @__PURE__ */ (void 0)("span", {
														className: "font-mono text-[10px] text-titanium-silver",
														children: "Sub-0.5ms Polling"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 239,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 237,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "VESPER registers a low-level keyboard hook callback via the Win32 API. Key presses (such as F8 or configured modifiers) are intercepted before reaching standard message loops, eliminating any delay or interference with foreground applications."
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 241,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 236,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (void 0)("div", {
													className: "flex items-center justify-between mb-2",
													children: [/* @__PURE__ */ (void 0)("span", {
														className: "font-mono text-xs text-emerald font-bold",
														children: "Raw 16kHz Audio Ring Buffer"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 250,
														columnNumber: 25
													}, this), /* @__PURE__ */ (void 0)("span", {
														className: "font-mono text-[10px] text-titanium-silver",
														children: "Volatile RAM Storage"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 251,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 249,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "Microphone capture operates on a dedicated background audio thread. As soon as the trigger key is depressed, the driver records 16-bit PCM chunks into an in-memory ring buffer. No temporary audio files are ever written to disk."
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 253,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 248,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (void 0)("div", {
													className: "flex items-center justify-between mb-2",
													children: [/* @__PURE__ */ (void 0)("span", {
														className: "font-mono text-xs text-emerald font-bold",
														children: "Zero-Focus Window Text Injection"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 262,
														columnNumber: 25
													}, this), /* @__PURE__ */ (void 0)("span", {
														className: "font-mono text-[10px] text-titanium-silver",
														children: "SendInput API"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 263,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 261,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "When speech finishes, transcribed text is emitted into the exact focused control using native keystroke events. You can dictate into VS Code, Cursor Composer, Windows Terminal, Slack, or any custom desktop application without the focus stealing or window switching of traditional assistants."
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 265,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 260,
												columnNumber: 21
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 235,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 224,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 223,
							columnNumber: 52
						}, this),
						activeSection === "zero-backspace" && /* @__PURE__ */ (void 0)("div", {
							className: "space-y-6",
							children: /* @__PURE__ */ (void 0)("div", {
								className: "rounded-2xl border border-titanium-border bg-titanium/50 p-6 sm:p-8",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center gap-3 text-emerald mb-2 font-mono text-xs",
										children: [/* @__PURE__ */ (void 0)(Terminal, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 279,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("span", { children: "03 // SPEECH PHILOSOPHY" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 280,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 278,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("h2", {
										className: "text-2xl font-bold text-white mb-4",
										children: "The Zero-Backspace Rule"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 282,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("p", {
										className: "text-sm text-titanium-silver leading-relaxed mb-6",
										children: "Real-time dictation engines typically stream partial tokens into the active cursor, causing rapid backspacing, cursor jumping, and disruption of code indentations. VESPER eliminates this entirely."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 283,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-xl border border-emerald/30 bg-emerald/5 p-5 mb-6",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "font-mono text-xs text-emerald font-bold mb-2",
											children: "CORE PRINCIPLE: ATOMIC SYNTHESIS"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 289,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("p", {
											className: "text-xs text-titanium-silver leading-relaxed",
											children: "VESPER holds transcription until speech finishes. The neural engine cleans hesitation fillers, formats code symbols and punctuation, and injects the final string as an atomic keystroke sequence. The cursor moves once, exactly where it belongs. Zero backspaces. Zero cursor jitter."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 290,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 288,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("h3", {
										className: "text-base font-bold text-white mb-3",
										children: "Spoken Formatting Shortcuts"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 297,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "overflow-x-auto rounded-xl border border-titanium-border",
										children: /* @__PURE__ */ (void 0)("table", {
											className: "w-full text-left text-xs font-mono",
											children: [/* @__PURE__ */ (void 0)("thead", {
												className: "border-b border-titanium-border bg-titanium-elevated text-titanium-silver",
												children: /* @__PURE__ */ (void 0)("tr", { children: [
													/* @__PURE__ */ (void 0)("th", {
														className: "p-3",
														children: "You Say"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 302,
														columnNumber: 27
													}, this),
													/* @__PURE__ */ (void 0)("th", {
														className: "p-3",
														children: "VESPER Injects"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 303,
														columnNumber: 27
													}, this),
													/* @__PURE__ */ (void 0)("th", {
														className: "p-3",
														children: "Behavior"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 304,
														columnNumber: 27
													}, this)
												] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 301,
													columnNumber: 25
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 300,
												columnNumber: 23
											}, this), /* @__PURE__ */ (void 0)("tbody", {
												className: "divide-y divide-titanium-border/60 text-titanium-silver",
												children: [
													/* @__PURE__ */ (void 0)("tr", { children: [
														/* @__PURE__ */ (void 0)("td", {
															className: "p-3 text-white",
															children: "\"new line\" or \"line break\""
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 309,
															columnNumber: 27
														}, this),
														/* @__PURE__ */ (void 0)("td", {
															className: "p-3 text-emerald font-bold",
															children: "\\n"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 310,
															columnNumber: 27
														}, this),
														/* @__PURE__ */ (void 0)("td", {
															className: "p-3",
															children: "Inserts Enter keystroke"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 311,
															columnNumber: 27
														}, this)
													] }, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 308,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (void 0)("tr", { children: [
														/* @__PURE__ */ (void 0)("td", {
															className: "p-3 text-white",
															children: "\"function parse user token camel case\""
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 314,
															columnNumber: 27
														}, this),
														/* @__PURE__ */ (void 0)("td", {
															className: "p-3 text-emerald font-bold",
															children: "parseUserToken"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 315,
															columnNumber: 27
														}, this),
														/* @__PURE__ */ (void 0)("td", {
															className: "p-3",
															children: "Converts to code identifier"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 316,
															columnNumber: 27
														}, this)
													] }, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 313,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (void 0)("tr", { children: [
														/* @__PURE__ */ (void 0)("td", {
															className: "p-3 text-white",
															children: "\"open brace close brace\""
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 319,
															columnNumber: 27
														}, this),
														/* @__PURE__ */ (void 0)("td", {
															className: "p-3 text-emerald font-bold",
															children: "{}"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 320,
															columnNumber: 27
														}, this),
														/* @__PURE__ */ (void 0)("td", {
															className: "p-3",
															children: "Inserts brackets"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 321,
															columnNumber: 27
														}, this)
													] }, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 318,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (void 0)("tr", { children: [
														/* @__PURE__ */ (void 0)("td", {
															className: "p-3 text-white",
															children: "\"git status dash s\""
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 324,
															columnNumber: 27
														}, this),
														/* @__PURE__ */ (void 0)("td", {
															className: "p-3 text-emerald font-bold",
															children: "git status -s"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 325,
															columnNumber: 27
														}, this),
														/* @__PURE__ */ (void 0)("td", {
															className: "p-3",
															children: "Formats CLI arguments"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 326,
															columnNumber: 27
														}, this)
													] }, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 323,
														columnNumber: 25
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 307,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 299,
											columnNumber: 21
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 298,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 277,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 276,
							columnNumber: 52
						}, this),
						activeSection === "licensing" && /* @__PURE__ */ (void 0)("div", {
							className: "space-y-6",
							children: /* @__PURE__ */ (void 0)("div", {
								className: "rounded-2xl border border-titanium-border bg-titanium/50 p-6 sm:p-8",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center gap-3 text-emerald mb-2 font-mono text-xs",
										children: [/* @__PURE__ */ (void 0)(Key, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 338,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("span", { children: "04 // SOFTWARE LICENSING" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 339,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 337,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("h2", {
										className: "text-2xl font-bold text-white mb-4",
										children: "Desktop App Subscription & License Verification"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 341,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("p", {
										className: "text-sm text-titanium-silver leading-relaxed mb-6",
										children: "Similar to professional developer toolchains, VESPER protects its proprietary neural runtime and ambient memory protocol through authenticated software licenses. Users must verify their account to unlock desktop client access."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 342,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium-elevated p-5 mb-8",
										children: [
											/* @__PURE__ */ (void 0)("h3", {
												className: "text-sm font-bold text-white mb-2 flex items-center gap-2",
												children: [/* @__PURE__ */ (void 0)(Lock, { className: "h-4 w-4 text-emerald" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 351,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("span", { children: "Live License Gate Verification" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 352,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 350,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("p", {
												className: "text-xs text-titanium-silver mb-4",
												children: "Test your license key against the live MongoDB verification engine (/api/license/verify)."
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 354,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "flex flex-col sm:flex-row gap-3",
												children: [/* @__PURE__ */ (void 0)("input", {
													type: "text",
													value: licenseInput,
													onChange: (e) => setLicenseInput(e.target.value),
													placeholder: user?.licenseKey || "VESPER-XXXX-XXXX-XXXX",
													className: "flex-1 rounded-lg border border-titanium-border bg-obsidian px-3.5 py-2 font-mono text-xs text-white placeholder:text-titanium-silver/50 focus:border-emerald focus:outline-none"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 359,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("button", {
													type: "button",
													onClick: handleTestLicense,
													disabled: isCheckingLicense,
													className: "rounded-lg bg-emerald px-5 py-2 text-xs font-bold text-obsidian hover:bg-emerald-400 disabled:opacity-50 transition-all shrink-0",
													children: isCheckingLicense ? "Verifying..." : "Validate Key"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 360,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 358,
												columnNumber: 21
											}, this),
											licenseStatus && /* @__PURE__ */ (void 0)("div", {
												className: `mt-4 rounded-lg p-3 text-xs font-mono border ${licenseStatus.valid ? "border-emerald/40 bg-emerald/10 text-emerald" : "border-red-500/40 bg-red-500/10 text-red-400"}`,
												children: [/* @__PURE__ */ (void 0)("div", {
													className: "font-bold mb-1",
													children: licenseStatus.valid ? "✓ LICENSE VALID & ACTIVE" : "✗ VERIFICATION REJECTED"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 366,
													columnNumber: 25
												}, this), licenseStatus.valid ? /* @__PURE__ */ (void 0)("div", { children: [
													/* @__PURE__ */ (void 0)("div", { children: ["Key: ", licenseStatus.licenseKey] }, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 370,
														columnNumber: 29
													}, this),
													/* @__PURE__ */ (void 0)("div", { children: ["Tier: ", licenseStatus.tier?.toUpperCase()] }, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 371,
														columnNumber: 29
													}, this),
													/* @__PURE__ */ (void 0)("div", { children: [
														"Quota: ",
														licenseStatus.quota?.totalSeconds,
														"s total speech capacity"
													] }, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 372,
														columnNumber: 29
													}, this),
													/* @__PURE__ */ (void 0)("div", { children: ["Engine: ", licenseStatus.engineConfig?.neuralPipeline] }, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 373,
														columnNumber: 29
													}, this)
												] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 369,
													columnNumber: 48
												}, this) : /* @__PURE__ */ (void 0)("div", { children: licenseStatus.error }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 374,
													columnNumber: 36
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 365,
												columnNumber: 39
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 349,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("h3", {
										className: "text-base font-bold text-white mb-3",
										children: "Subscription Tier Specifications"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 378,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "grid grid-cols-1 md:grid-cols-3 gap-4",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium p-4",
												children: [
													/* @__PURE__ */ (void 0)("div", {
														className: "font-mono text-xs text-titanium-silver uppercase mb-1",
														children: "Free Community"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 381,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "text-xl font-bold text-white mb-2",
														children: "$0"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 382,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (void 0)("p", {
														className: "text-xs text-titanium-silver mb-3",
														children: "Ideal for evaluating local Hold-to-Talk and offline ONNX models."
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 383,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "text-[11px] font-mono text-titanium-silver space-y-1",
														children: [
															/* @__PURE__ */ (void 0)("div", { children: "• 3,600s speech quota" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 387,
																columnNumber: 25
															}, this),
															/* @__PURE__ */ (void 0)("div", { children: "• Direct dictation mode" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 388,
																columnNumber: 25
															}, this),
															/* @__PURE__ */ (void 0)("div", { children: "• Local model support" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 389,
																columnNumber: 25
															}, this)
														]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 386,
														columnNumber: 23
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 380,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-xl border border-emerald/50 bg-emerald/5 p-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]",
												children: [
													/* @__PURE__ */ (void 0)("div", {
														className: "font-mono text-xs text-emerald uppercase mb-1 font-bold",
														children: "Pro Developer"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 394,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "text-xl font-bold text-white mb-2",
														children: "$12/mo"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 395,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (void 0)("p", {
														className: "text-xs text-titanium-silver mb-3",
														children: "For engineers, founders, and power writers seeking sub-180ms neural latency."
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 396,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "text-[11px] font-mono text-emerald space-y-1",
														children: [
															/* @__PURE__ */ (void 0)("div", { children: "• 72,000s speech quota" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 400,
																columnNumber: 25
															}, this),
															/* @__PURE__ */ (void 0)("div", { children: "• Sub-180ms Neural Pipeline" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 401,
																columnNumber: 25
															}, this),
															/* @__PURE__ */ (void 0)("div", { children: "• VESPER Ambient Context MCP" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 402,
																columnNumber: 25
															}, this),
															/* @__PURE__ */ (void 0)("div", { children: "• Priority model routing" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 403,
																columnNumber: 25
															}, this)
														]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 399,
														columnNumber: 23
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 393,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium p-4",
												children: [
													/* @__PURE__ */ (void 0)("div", {
														className: "font-mono text-xs text-titanium-silver uppercase mb-1",
														children: "Enterprise"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 408,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "text-xl font-bold text-white mb-2",
														children: "Custom"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 409,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (void 0)("p", {
														className: "text-xs text-titanium-silver mb-3",
														children: "Air-gapped on-premise clusters, HIPAA compliance, and seat governance."
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 410,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "text-[11px] font-mono text-titanium-silver space-y-1",
														children: [
															/* @__PURE__ */ (void 0)("div", { children: "• Unlimited seat capacity" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 414,
																columnNumber: 25
															}, this),
															/* @__PURE__ */ (void 0)("div", { children: "• Zero-data-retention SLA" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 415,
																columnNumber: 25
															}, this),
															/* @__PURE__ */ (void 0)("div", { children: "• Dedicated hardware cluster" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 416,
																columnNumber: 25
															}, this)
														]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 413,
														columnNumber: 23
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 407,
												columnNumber: 21
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 379,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 336,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 335,
							columnNumber: 47
						}, this),
						activeSection === "privacy" && /* @__PURE__ */ (void 0)("div", {
							className: "space-y-6",
							children: /* @__PURE__ */ (void 0)("div", {
								className: "rounded-2xl border border-titanium-border bg-titanium/50 p-6 sm:p-8",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center gap-3 text-emerald mb-2 font-mono text-xs",
										children: [/* @__PURE__ */ (void 0)(Shield, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 427,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("span", { children: "05 // SECURITY GOVERNANCE" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 428,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 426,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("h2", {
										className: "text-2xl font-bold text-white mb-4",
										children: "Privacy Sandbox & Neural Runtime"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 430,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("p", {
										className: "text-sm text-titanium-silver leading-relaxed mb-6",
										children: "Developer workstations contain critical keys, SSH credentials, and private intellectual property. VESPER is architected with strict confidentiality boundaries at every tier."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 431,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "space-y-4",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (void 0)("div", {
													className: "font-mono text-xs text-emerald font-bold mb-1",
													children: "1. Local Credential Sanitization"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 438,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "Before context is passed to the ambient memory MCP or neural speech models, regex filters automatically detect and redact bearer tokens, API keys, passwords, and sensitive environment strings locally on your CPU."
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 441,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 437,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (void 0)("div", {
													className: "font-mono text-xs text-emerald font-bold mb-1",
													children: "2. 100% Offline Air-Gapped Fallback"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 449,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "For defense, legal, or medical institutions where outbound internet traffic is forbidden, VESPER includes a DirectML INT8 ONNX offline speech engine that executes entirely on local GPUs or NPUs without sending a single packet over the network."
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 452,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 448,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (void 0)("div", {
													className: "font-mono text-xs text-emerald font-bold mb-1",
													children: "3. Zero Cloud Audio Retention"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 460,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "When using high-speed private cloud inference, audio is streamed over encrypted TLS, transcribed statelessly, and immediately freed from RAM. No audio files or transcripts are ever stored, cached, or used to train third-party models."
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 463,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 459,
												columnNumber: 21
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 436,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 425,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 424,
							columnNumber: 45
						}, this),
						activeSection === "troubleshooting" && /* @__PURE__ */ (void 0)("div", {
							className: "space-y-6",
							children: /* @__PURE__ */ (void 0)("div", {
								className: "rounded-2xl border border-titanium-border bg-titanium/50 p-6 sm:p-8",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center gap-3 text-emerald mb-2 font-mono text-xs",
										children: [/* @__PURE__ */ (void 0)(CircleAlert, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 477,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("span", { children: "06 // DIAGNOSTICS" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 478,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 476,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("h2", {
										className: "text-2xl font-bold text-white mb-4",
										children: "Troubleshooting & Diagnostic FAQ"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 480,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("p", {
										className: "text-sm text-titanium-silver leading-relaxed mb-6",
										children: "Resolutions for common Windows hardware, permissions, and network setup questions."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 481,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "space-y-4",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (void 0)("h4", {
													className: "text-xs font-bold text-white mb-1",
													children: "Q: Why does F8 not trigger when running terminal or IDE as Administrator?"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 487,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "Windows User Interface Privilege Isolation (UIPI) prevents applications running at standard integrity from injecting keystrokes into elevated Administrator windows. To resolve this, run VESPER as Administrator, or launch both processes under the same privilege level."
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 490,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 486,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (void 0)("h4", {
													className: "text-xs font-bold text-white mb-1",
													children: "Q: Windows Defender or Antivirus flags the keyboard hook executable. Is it safe?"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 498,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "Low-level keyboard hooks (WH_KEYBOARD_LL) are common triggers for heuristic scanner warnings because malware keyloggers use similar OS hooks. VESPER is code-signed and strictly reads the trigger key without logging background keystrokes. Add VESPER to your Defender whitelist if prompted."
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 501,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 497,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (void 0)("h4", {
													className: "text-xs font-bold text-white mb-1",
													children: "Q: Microphone audio shows zero volume or transcription times out."
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 510,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "Check Windows Settings > Privacy & Security > Microphone. Ensure \"Let desktop apps access your microphone\" is toggled ON. In VESPER Settings, ensure your primary recording device is selected instead of a virtual audio loopback cable."
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 513,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 509,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
												children: [/* @__PURE__ */ (void 0)("h4", {
													className: "text-xs font-bold text-white mb-1",
													children: "Q: How do I change the default trigger key from F8?"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 521,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("p", {
													className: "text-xs text-titanium-silver leading-relaxed",
													children: "Open the VESPER system tray icon > Preferences > Shortcuts. You can assign any single key or combination (e.g., Caps Lock, Right Alt, Ctrl+Shift+Space, or dedicated mouse thumb buttons)."
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 524,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 520,
												columnNumber: 21
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 485,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 475,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 474,
							columnNumber: 53
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 159,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 119,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 84,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 83,
		columnNumber: 10
	}, this);
}
//#endregion
export { GuidancePage as component };
