import { o as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as useAuth, t as AuthProvider } from "./auth-context-DIX5izGL.mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, g as useRouter, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as Mail, P as Lock, lt as ArrowRight, n as X, o as User } from "../_libs/lucide-react.mjs";
import { a as DownloadSetup, b as VesperLogo, c as Footer, d as Personas, f as Pricing, g as Simulator, h as Shortcuts, i as ContextInspector, n as Capabilities, o as EnterpriseModal, p as Roadmap, r as ClickSpark, s as FaqFeedback, t as ArchitectureModal, u as Nav, x as Waitlist, y as UtoExplorerModal } from "./Personas-B0b6j4YH.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Analytics } from "../_libs/vercel__analytics.mjs";
import { t as SpeedInsights } from "../_libs/vercel__speed-insights.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DErEvt4v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-C_DpofL4.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function GoogleIcon({ className = "h-4 w-4" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className,
		viewBox: "0 0 24 24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#4285F4",
				d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#34A853",
				d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#FBBC05",
				d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#EA4335",
				d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
			})
		]
	});
}
function AuthModal() {
	const { isAuthModalOpen, closeAuthModal, login, signup } = useAuth();
	const [tab, setTab] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	if (!isAuthModalOpen) return null;
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email || !password) {
			toast.error("Please fill in all required fields.");
			return;
		}
		setLoading(true);
		try {
			if (tab === "signin") await login(email, password);
			else await signup(email, password, name || email.split("@")[0]);
		} finally {
			setLoading(false);
		}
	};
	const handleGoogleClick = () => {
		toast.info("Google Sign-In is in active sandbox. Please sign in via email or guest access.", { duration: 5e3 });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-md rounded-2xl border border-border bg-white p-6 sm:p-7 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: closeAuthModal,
					className: "absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors",
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VesperLogo, { size: 42 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3 text-lg font-bold tracking-tight text-slate-900",
							children: tab === "signin" ? "Sign In to VESPER" : "Create VESPER Account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-slate-500",
							children: tab === "signin" ? "Access your assigned desktop software license and neural profile." : "Instant setup — your desktop license key is generated immediately."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleGoogleClick,
						disabled: loading,
						className: "flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-slate-50 py-2.5 px-4 text-xs font-semibold text-slate-800 transition-all hover:bg-white hover:border-slate-300 active:scale-[0.99] shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleIcon, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Continue with Google" })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative my-5 flex items-center justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t border-slate-200" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute bg-white px-3 font-mono text-[10px] text-slate-400 uppercase",
						children: "Or with email"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex rounded-lg border border-border bg-slate-100 p-1 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab("signin"),
						className: `flex-1 rounded-md py-1.5 font-semibold transition-all ${tab === "signin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`,
						children: "Sign In"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab("signup"),
						className: `flex-1 rounded-md py-1.5 font-semibold transition-all ${tab === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`,
						children: "Create Account"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "mt-4 space-y-3.5",
					children: [
						tab === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-medium text-slate-800 mb-1",
							children: "Full Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "text",
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Ada Lovelace",
								className: "w-full rounded-xl border border-border bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-medium text-slate-800 mb-1",
							children: "Work or Personal Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "developer@company.com",
								className: "w-full rounded-xl border border-border bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-medium text-slate-800 mb-1",
							children: "Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								placeholder: "••••••••••••",
								className: "w-full rounded-xl border border-border bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: loading,
							className: "mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary hover:bg-orange-600 py-2.5 px-4 text-xs font-bold text-white shadow-[0_2px_12px_rgba(255,107,0,0.25)] transition-all active:scale-[0.99]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: loading ? "Processing..." : tab === "signin" ? "Sign In" : "Create Account & Activate License" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
						})
					]
				})
			]
		})
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$11 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "VESPER Desktop: Local-First AI Voice-to-Action for Windows" },
			{
				name: "description",
				content: "Hold Right Alt anywhere on Windows to speak naturally and paste text instantly at your cursor without stealing window focus."
			},
			{
				name: "author",
				content: "VESPER Team"
			},
			{
				property: "og:title",
				content: "VESPER Desktop: Say What You Mean"
			},
			{
				property: "og:description",
				content: "Local-first ambient voice dictation and context-aware copilot for Windows 10/11. Powered by VESPER Ultra-Low Latency Neural Speech Pipeline."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "VESPER Desktop: Windows Voice-to-Action"
			},
			{
				name: "twitter:description",
				content: "Ambient push-to-talk voice dictation and copilot for Windows 10/11. Zero focus stealing."
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-background text-foreground selection:bg-primary/20 selection:text-primary",
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$11.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthModal, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				richColors: true,
				theme: "light",
				position: "bottom-right",
				closeButton: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Analytics, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpeedInsights, {})
		] })
	});
}
var $$splitComponentImporter$2 = () => import("./routes-DgOnN22S.mjs");
var title$8 = "VESPER Desktop: Software 3.0 Ambient Voice-to-Action for Windows";
var description$8 = "The high-bandwidth biological bridge to your PC. Hold Right Alt, speak naturally, and paste pre-polished text directly at your cursor in sub-180ms. Follows the Zero-Backspace Rule.";
var Route$10 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: title$8 },
		{
			name: "description",
			content: description$8
		},
		{
			property: "og:title",
			content: title$8
		},
		{
			property: "og:description",
			content: description$8
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin-AoA0Wnbq.mjs");
var Route$9 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "VESPER CRM: Admin Pipeline & Lead Management" }, {
		name: "description",
		content: "Enterprise CRM pipeline, pro trial metrics, and lead qualification for VESPER Desktop."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var title$7 = "System Architecture & 8-Layer Pipeline | VESPER Desktop";
var description$7 = "Explore the sub-180ms neural speech pipeline, WinKeyServer C++ hardware hooks, Silero VAD, and caret injection architecture.";
var Route$8 = createFileRoute("/architecture")({
	head: () => ({ meta: [
		{ title: title$7 },
		{
			name: "description",
			content: description$7
		},
		{
			property: "og:title",
			content: title$7
		},
		{
			property: "og:description",
			content: description$7
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: ArchitecturePage
});
function ArchitecturePage() {
	const [isArchitectureOpen, setIsArchitectureOpen] = (0, import_react.useState)(false);
	const [isContextInspectorOpen, setIsContextInspectorOpen] = (0, import_react.useState)(false);
	const [isUtoOpen, setIsUtoOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClickSpark, {
		sparkColor: "#ff6b00",
		sparkSize: 10,
		sparkRadius: 20,
		sparkCount: 8,
		duration: 400,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "relative z-10 pt-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Capabilities, {
						onOpenArchitectureModal: () => setIsArchitectureOpen(true),
						onOpenContextInspector: () => setIsContextInspectorOpen(true),
						onOpenUtoModal: () => setIsUtoOpen(true)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArchitectureModal, {
					isOpen: isArchitectureOpen,
					onClose: () => setIsArchitectureOpen(false)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContextInspector, {
					isOpen: isContextInspectorOpen,
					onClose: () => setIsContextInspectorOpen(false)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtoExplorerModal, {
					isOpen: isUtoOpen,
					onClose: () => setIsUtoOpen(false)
				})
			]
		})
	});
}
var title$6 = "Download VESPER for Windows (.exe) | Official Release";
var description$6 = "Download the official VESPER Windows Installer (64-bit), verify SHA-256 checksums, or install via Windows Package Manager (winget).";
var Route$7 = createFileRoute("/download")({
	head: () => ({ meta: [
		{ title: title$6 },
		{
			name: "description",
			content: description$6
		},
		{
			property: "og:title",
			content: title$6
		},
		{
			property: "og:description",
			content: description$6
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: DownloadPage
});
function DownloadPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClickSpark, {
		sparkColor: "#ff6b00",
		sparkSize: 10,
		sparkRadius: 20,
		sparkCount: 8,
		duration: 400,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "relative z-10 pt-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DownloadSetup, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
			]
		})
	});
}
var title$5 = "FAQ & Community Feedback | VESPER Desktop";
var description$5 = "Frequently asked questions about VESPER's caret preservation, zero audio retention privacy guarantee, and feedback submission.";
var Route$6 = createFileRoute("/faq")({
	head: () => ({ meta: [
		{ title: title$5 },
		{
			name: "description",
			content: description$5
		},
		{
			property: "og:title",
			content: title$5
		},
		{
			property: "og:description",
			content: description$5
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: FaqPage
});
function FaqPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClickSpark, {
		sparkColor: "#ff6b00",
		sparkSize: 10,
		sparkRadius: 20,
		sparkCount: 8,
		duration: 400,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "relative z-10 pt-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqFeedback, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
			]
		})
	});
}
var $$splitComponentImporter = () => import("./guidance-BAIhV20d.mjs");
var Route$5 = createFileRoute("/guidance")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var title$4 = "Transparent Pricing & Licenses | VESPER Desktop";
var description$4 = "Simple, transparent pricing for VESPER Desktop. Free community tier with 30m daily allowance, Pro tier, and custom Enterprise deployments.";
var Route$4 = createFileRoute("/pricing")({
	head: () => ({ meta: [
		{ title: title$4 },
		{
			name: "description",
			content: description$4
		},
		{
			property: "og:title",
			content: title$4
		},
		{
			property: "og:description",
			content: description$4
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: PricingPage
});
function PricingPage() {
	const [isEnterpriseOpen, setIsEnterpriseOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClickSpark, {
		sparkColor: "#ff6b00",
		sparkSize: 10,
		sparkRadius: 20,
		sparkCount: 8,
		duration: 400,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "relative z-10 pt-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pricing, { onOpenEnterpriseModal: () => setIsEnterpriseOpen(true) })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnterpriseModal, {
					isOpen: isEnterpriseOpen,
					onClose: () => setIsEnterpriseOpen(false)
				})
			]
		})
	});
}
var title$3 = "Software 3.0 Engineering Roadmap | VESPER Desktop";
var description$3 = "Explore the upcoming development phases of VESPER: local on-device neural pipelines, multi-modal screen agents, and enterprise telemetry.";
var Route$3 = createFileRoute("/roadmap")({
	head: () => ({ meta: [
		{ title: title$3 },
		{
			name: "description",
			content: description$3
		},
		{
			property: "og:title",
			content: title$3
		},
		{
			property: "og:description",
			content: description$3
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: RoadmapPage
});
function RoadmapPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClickSpark, {
		sparkColor: "#ff6b00",
		sparkSize: 10,
		sparkRadius: 20,
		sparkCount: 8,
		duration: 400,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "relative z-10 pt-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Roadmap, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waitlist, {})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
			]
		})
	});
}
var title$2 = "Keyboard Shortcuts & Hardware Keys | VESPER Desktop";
var description$2 = "Hardware-hooked push-to-talk key combinations, mechanical keycap tester, and sub-1ms WinKeyServer keyboard shortcuts for Windows.";
var Route$2 = createFileRoute("/shortcuts")({
	head: () => ({ meta: [
		{ title: title$2 },
		{
			name: "description",
			content: description$2
		},
		{
			property: "og:title",
			content: title$2
		},
		{
			property: "og:description",
			content: description$2
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: ShortcutsPage
});
function ShortcutsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClickSpark, {
		sparkColor: "#ff6b00",
		sparkSize: 10,
		sparkRadius: 20,
		sparkCount: 8,
		duration: 400,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "relative z-10 pt-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shortcuts, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
			]
		})
	});
}
var title$1 = "Interactive Voice Simulator | VESPER Desktop";
var description$1 = "Test the sub-180ms physical push-to-talk voice mechanic in your browser. Live WebAudio feedback, HWND caret simulation, and the Zero-Backspace Rule.";
var Route$1 = createFileRoute("/simulator")({
	head: () => ({ meta: [
		{ title: title$1 },
		{
			name: "description",
			content: description$1
		},
		{
			property: "og:title",
			content: title$1
		},
		{
			property: "og:description",
			content: description$1
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: SimulatorPage
});
function SimulatorPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClickSpark, {
		sparkColor: "#ff6b00",
		sparkSize: 10,
		sparkRadius: 20,
		sparkCount: 8,
		duration: 400,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "relative z-10 pt-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Simulator, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
			]
		})
	});
}
var title = "High-Frequency Daily Workflows | VESPER Desktop";
var description = "See how senior engineers, founders, and creators use VESPER for code reviews, rapid memos, and documentation with the Zero-Backspace Rule.";
var Route = createFileRoute("/workflows")({
	head: () => ({ meta: [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: WorkflowsPage
});
function WorkflowsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClickSpark, {
		sparkColor: "#ff6b00",
		sparkSize: 10,
		sparkRadius: 20,
		sparkCount: 8,
		duration: 400,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "relative z-10 pt-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Personas, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
			]
		})
	});
}
var rootRouteChildren = {
	IndexRoute: Route$10.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$11
	}),
	AdminRoute: Route$9.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$11
	}),
	ArchitectureRoute: Route$8.update({
		id: "/architecture",
		path: "/architecture",
		getParentRoute: () => Route$11
	}),
	DownloadRoute: Route$7.update({
		id: "/download",
		path: "/download",
		getParentRoute: () => Route$11
	}),
	FaqRoute: Route$6.update({
		id: "/faq",
		path: "/faq",
		getParentRoute: () => Route$11
	}),
	GuidanceRoute: Route$5.update({
		id: "/guidance",
		path: "/guidance",
		getParentRoute: () => Route$11
	}),
	PricingRoute: Route$4.update({
		id: "/pricing",
		path: "/pricing",
		getParentRoute: () => Route$11
	}),
	RoadmapRoute: Route$3.update({
		id: "/roadmap",
		path: "/roadmap",
		getParentRoute: () => Route$11
	}),
	ShortcutsRoute: Route$2.update({
		id: "/shortcuts",
		path: "/shortcuts",
		getParentRoute: () => Route$11
	}),
	SimulatorRoute: Route$1.update({
		id: "/simulator",
		path: "/simulator",
		getParentRoute: () => Route$11
	}),
	WorkflowsRoute: Route.update({
		id: "/workflows",
		path: "/workflows",
		getParentRoute: () => Route$11
	})
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
