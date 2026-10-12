import { o as __toESM } from "../_runtime.mjs";
import { a as Trigger2, c as require_react, i as Root2, n as Header, r as Item, s as require_jsx_runtime, t as Content2 } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAuth } from "./auth-context-DIX5izGL.mjs";
import { t as crmService } from "./crm-service-Yn1PsX10.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Clock, A as MessageSquare, B as FileSpreadsheet, C as ScanEye, D as PenTool, F as Layers, G as ExternalLink, H as FileBraces, I as Keyboard, J as Database, K as Download, L as Key, M as Mail, N as LogOut, O as Network, P as Lock, Q as CodeXml, R as Gauge, S as Search, T as Radio, U as Eye, V as FileCode, W as EyeOff, X as Cpu, Y as Crosshair, Z as Copy, _ as Shield, at as Check, ct as BookOpen, d as Terminal, et as CircleQuestionMark, f as Target, ft as ArrowDown, g as SlidersHorizontal, h as Sparkles, i as Volume2, it as ChevronDown, j as Menu, k as Mic, l as Trash2, m as Star, n as X, nt as CircleCheckBig, o as User, ot as Building2, p as Table, pt as Activity, r as VolumeX, st as Briefcase, t as Zap, tt as CircleCheck, u as Ticket, ut as ArrowRight, v as ShieldCheck, x as Send, y as ShieldAlert, z as FileText } from "../_libs/lucide-react.mjs";
import { t as VesperLogo } from "./VesperLogo-K0DjSlQl.mjs";
import { a as useMotionValue, i as useTransform, n as useAnimationFrame, r as useSpring, t as useInView } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { a as Geometry, i as Program, n as Camera, r as Renderer, t as Mesh } from "../_libs/ogl.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Db8ge_x6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var links = [
	{
		label: "Simulator",
		href: "/#simulator"
	},
	{
		label: "Workflows",
		href: "/#workflows"
	},
	{
		label: "Architecture",
		href: "/#pipeline"
	},
	{
		label: "Pricing",
		href: "/#pricing"
	},
	{
		label: "Shortcuts",
		href: "/#shortcuts"
	},
	{
		label: "Guidance",
		href: "/guidance",
		isRoute: true
	},
	{
		label: "Download",
		href: "/#download"
	},
	{
		label: "FAQ",
		href: "/#faq"
	}
];
function WindowsIcon$2({ className = "h-3.5 w-3.5" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		className,
		viewBox: "0 0 88 88",
		fill: "currentColor",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M0 12.402l35.687-4.86.016 34.423-35.67.248L0 12.402zm35.67 33.529l.028 34.453L.028 75.48.003 46.179l35.667-.248zM40.97 6.479L87.977 0v41.526l-47.008.377V6.479zm47.037 39.467l-.03 41.602-46.99-6.613-.013-34.612 47.033-.377z" })
	});
}
function Nav() {
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	const { user, isAdmin, openAuthModal, logout } = useAuth();
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 16);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: `fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-border/80 bg-white/95 backdrop-blur-xl shadow-sm py-0" : "border-b border-border/40 bg-white/80 backdrop-blur-md py-1"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "group flex items-center gap-2.5 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VesperLogo, {
						size: 28,
						showText: true,
						textColor: "#0f172a"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden items-center gap-1 lg:flex",
					children: links.map((l) => l.isRoute ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: l.href,
						className: "rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-primary whitespace-nowrap flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-3 w-3 text-primary/80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l.label })]
					}, l.href) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: l.href,
						className: "rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-primary whitespace-nowrap",
						children: l.label
					}, l.href))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden items-center gap-2 sm:flex shrink-0",
					children: [user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 shrink-0",
						children: [isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin",
							className: "flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-mono font-medium text-primary transition-all hover:bg-primary/20 hover:border-primary whitespace-nowrap shrink-0",
							title: "Open CRM & Lead Admin Dashboard",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3.5 w-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "whitespace-nowrap",
								children: "Admin Portal"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-lg border border-border bg-slate-50 px-2.5 py-1.5 shrink-0",
							children: [
								user.avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: user.avatar,
									alt: user.name,
									className: "h-5 w-5 rounded-full object-cover shrink-0"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] text-primary font-bold shrink-0",
									children: user.name.charAt(0).toUpperCase()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "max-w-[100px] truncate text-xs font-semibold text-slate-800 whitespace-nowrap",
									children: user.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: logout,
									className: "ml-1 text-slate-400 hover:text-red-500 transition-colors shrink-0",
									title: "Sign Out",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" })
								})
							]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => openAuthModal(),
						className: "flex items-center gap-1.5 rounded-lg border border-border bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:border-primary/40 hover:text-primary hover:bg-white whitespace-nowrap shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5 text-slate-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "whitespace-nowrap",
							children: "Sign In"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "/#download",
						className: "flex items-center gap-2 rounded-lg bg-primary hover:bg-orange-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_2px_10px_rgba(255,107,0,0.25)] transition-all active:scale-[0.98] whitespace-nowrap shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WindowsIcon$2, { className: "h-3.5 w-3.5 text-white shrink-0" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "whitespace-nowrap",
								children: "Download"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded bg-black/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white whitespace-nowrap",
								children: "Win 64"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setOpen(!open),
					className: "rounded-lg border border-border p-2 text-slate-600 md:hidden hover:text-slate-900 hover:bg-slate-100",
					"aria-label": "Toggle navigation",
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border bg-white px-5 py-6 md:hidden animate-in slide-in-from-top-2 duration-200",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: l.href,
					onClick: () => setOpen(false),
					className: "rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-primary",
					children: l.label
				}, l.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col gap-2 pt-4 border-t border-border",
					children: [user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 rounded-xl border border-border bg-slate-50 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-mono text-xs text-primary font-bold",
									children: user.name.charAt(0).toUpperCase()
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold text-slate-800",
									children: user.name
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									logout();
									setOpen(false);
								},
								className: "text-xs text-slate-500 hover:text-red-500",
								children: "Sign Out"
							})]
						}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin",
							onClick: () => setOpen(false),
							className: "mt-2 flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 py-2 text-xs font-mono font-medium text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open CRM Admin Dashboard" })]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setOpen(false);
							openAuthModal();
						},
						className: "flex items-center justify-center gap-2 rounded-xl border border-border bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign In (Google or Email)" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "#download",
						onClick: () => setOpen(false),
						className: "flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-orange-600 px-4 py-3 text-xs font-bold text-white shadow-[0_2px_10px_rgba(255,107,0,0.25)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WindowsIcon$2, { className: "h-4 w-4 text-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download VESPER Windows Installer" })]
					})]
				})]
			})
		})]
	});
}
var buildKeyframes = (from, steps) => {
	const keys = /* @__PURE__ */ new Set([...Object.keys(from), ...steps.flatMap((s) => Object.keys(s))]);
	const keyframes = {};
	keys.forEach((k) => {
		keyframes[k] = [from[k], ...steps.map((s) => s[k])];
	});
	return keyframes;
};
var BlurText = ({ text = "", delay = 200, className = "", animateBy = "words", direction = "top", threshold = .1, rootMargin = "0px", animationFrom, animationTo, easing = (t) => t, onAnimationComplete, stepDuration = .35 }) => {
	const elements = animateBy === "words" ? text.split(" ") : text.split("");
	const [inView, setInView] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setInView(true);
				observer.unobserve(ref.current);
			}
		}, {
			threshold,
			rootMargin
		});
		observer.observe(ref.current);
		return () => observer.disconnect();
	}, [threshold, rootMargin]);
	const defaultFrom = (0, import_react.useMemo)(() => direction === "top" ? {
		filter: "blur(10px)",
		opacity: 0,
		y: -50
	} : {
		filter: "blur(10px)",
		opacity: 0,
		y: 50
	}, [direction]);
	const defaultTo = (0, import_react.useMemo)(() => [{
		filter: "blur(5px)",
		opacity: .5,
		y: direction === "top" ? 5 : -5
	}, {
		filter: "blur(0px)",
		opacity: 1,
		y: 0
	}], [direction]);
	const fromSnapshot = animationFrom ?? defaultFrom;
	const toSnapshots = animationTo ?? defaultTo;
	const stepCount = toSnapshots.length + 1;
	const totalDuration = stepDuration * (stepCount - 1);
	const times = Array.from({ length: stepCount }, (_, i) => stepCount === 1 ? 0 : i / (stepCount - 1));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		ref,
		className: `blur-text ${className} flex flex-wrap`,
		children: elements.map((segment, index) => {
			const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);
			const spanTransition = {
				duration: totalDuration,
				times,
				delay: index * delay / 1e3,
				ease: easing
			};
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.span, {
				initial: fromSnapshot,
				animate: inView ? animateKeyframes : fromSnapshot,
				transition: spanTransition,
				onAnimationComplete: index === elements.length - 1 ? onAnimationComplete : void 0,
				style: {
					display: "inline-block",
					willChange: "transform, filter, opacity"
				},
				children: [segment === " " ? "\xA0" : segment, animateBy === "words" && index < elements.length - 1 && "\xA0"]
			}, index);
		})
	});
};
var ShinyText = ({ text, disabled = false, speed = 2, className = "", color = "#b5b5b5", shineColor = "#ffffff", spread = 120, yoyo = false, pauseOnHover = false, direction = "left", delay = 0 }) => {
	const [isPaused, setIsPaused] = (0, import_react.useState)(false);
	const progress = useMotionValue(0);
	const elapsedRef = (0, import_react.useRef)(0);
	const lastTimeRef = (0, import_react.useRef)(null);
	const directionRef = (0, import_react.useRef)(direction === "left" ? 1 : -1);
	const animationDuration = speed * 1e3;
	const delayDuration = delay * 1e3;
	useAnimationFrame((time) => {
		if (disabled || isPaused) {
			lastTimeRef.current = null;
			return;
		}
		if (lastTimeRef.current === null) {
			lastTimeRef.current = time;
			return;
		}
		const deltaTime = time - lastTimeRef.current;
		lastTimeRef.current = time;
		elapsedRef.current += deltaTime;
		if (yoyo) {
			const cycleDuration = animationDuration + delayDuration;
			const fullCycle = cycleDuration * 2;
			const cycleTime = elapsedRef.current % fullCycle;
			if (cycleTime < animationDuration) {
				const p = cycleTime / animationDuration * 100;
				progress.set(directionRef.current === 1 ? p : 100 - p);
			} else if (cycleTime < cycleDuration) progress.set(directionRef.current === 1 ? 100 : 0);
			else if (cycleTime < cycleDuration + animationDuration) {
				const p = 100 - (cycleTime - cycleDuration) / animationDuration * 100;
				progress.set(directionRef.current === 1 ? p : 100 - p);
			} else progress.set(directionRef.current === 1 ? 0 : 100);
		} else {
			const cycleDuration = animationDuration + delayDuration;
			const cycleTime = elapsedRef.current % cycleDuration;
			if (cycleTime < animationDuration) {
				const p = cycleTime / animationDuration * 100;
				progress.set(directionRef.current === 1 ? p : 100 - p);
			} else progress.set(directionRef.current === 1 ? 100 : 0);
		}
	});
	(0, import_react.useEffect)(() => {
		directionRef.current = direction === "left" ? 1 : -1;
		elapsedRef.current = 0;
		progress.set(0);
	}, [direction, progress]);
	const backgroundPosition = useTransform(progress, (p) => `${150 - p * 2}% center`);
	const handleMouseEnter = (0, import_react.useCallback)(() => {
		if (pauseOnHover) setIsPaused(true);
	}, [pauseOnHover]);
	const handleMouseLeave = (0, import_react.useCallback)(() => {
		if (pauseOnHover) setIsPaused(false);
	}, [pauseOnHover]);
	const gradientStyle = {
		backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
		backgroundSize: "200% auto",
		WebkitBackgroundClip: "text",
		backgroundClip: "text",
		WebkitTextFillColor: "transparent"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
		className: `inline-block ${className}`,
		style: {
			...gradientStyle,
			backgroundPosition
		},
		onMouseEnter: handleMouseEnter,
		onMouseLeave: handleMouseLeave,
		children: text
	});
};
var styles = { srOnly: {
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: 0,
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0,0,0,0)",
	whiteSpace: "nowrap",
	border: 0,
	visibility: "hidden"
} };
var DecryptedText = ({ text, speed = 50, maxIterations = 10, sequential = false, revealDirection = "start", useOriginalCharsOnly = false, characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+", className = "", parentClassName = "", encryptedClassName = "", animateOn = "hover", clickMode = "once", ...props }) => {
	const [displayText, setDisplayText] = (0, import_react.useState)(text);
	const [isAnimating, setIsAnimating] = (0, import_react.useState)(false);
	const [revealedIndices, setRevealedIndices] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [hasAnimated, setHasAnimated] = (0, import_react.useState)(false);
	const [isDecrypted, setIsDecrypted] = (0, import_react.useState)(animateOn !== "click");
	const [direction, setDirection] = (0, import_react.useState)("forward");
	const containerRef = (0, import_react.useRef)(null);
	const orderRef = (0, import_react.useRef)([]);
	const pointerRef = (0, import_react.useRef)(0);
	const intervalRef = (0, import_react.useRef)(null);
	const availableChars = (0, import_react.useMemo)(() => {
		return useOriginalCharsOnly ? Array.from(new Set(text.split(""))).filter((char) => char !== " ") : characters.split("");
	}, [
		useOriginalCharsOnly,
		text,
		characters
	]);
	const shuffleText = (0, import_react.useCallback)((originalText, currentRevealed) => {
		return originalText.split("").map((char, i) => {
			if (char === " ") return " ";
			if (currentRevealed.has(i)) return originalText[i];
			return availableChars[Math.floor(Math.random() * availableChars.length)];
		}).join("");
	}, [availableChars]);
	const computeOrder = (0, import_react.useCallback)((len) => {
		const order = [];
		if (len <= 0) return order;
		if (revealDirection === "start") {
			for (let i = 0; i < len; i++) order.push(i);
			return order;
		}
		if (revealDirection === "end") {
			for (let i = len - 1; i >= 0; i--) order.push(i);
			return order;
		}
		const middle = Math.floor(len / 2);
		let offset = 0;
		while (order.length < len) {
			if (offset % 2 === 0) {
				const idx = middle + offset / 2;
				if (idx >= 0 && idx < len) order.push(idx);
			} else {
				const idx = middle - Math.ceil(offset / 2);
				if (idx >= 0 && idx < len) order.push(idx);
			}
			offset++;
		}
		return order.slice(0, len);
	}, [revealDirection]);
	const fillAllIndices = (0, import_react.useCallback)(() => {
		const s = /* @__PURE__ */ new Set();
		for (let i = 0; i < text.length; i++) s.add(i);
		return s;
	}, [text]);
	const removeRandomIndices = (0, import_react.useCallback)((set, count) => {
		const arr = Array.from(set);
		for (let i = 0; i < count && arr.length > 0; i++) {
			const idx = Math.floor(Math.random() * arr.length);
			arr.splice(idx, 1);
		}
		return new Set(arr);
	}, []);
	const encryptInstantly = (0, import_react.useCallback)(() => {
		const emptySet = /* @__PURE__ */ new Set();
		setRevealedIndices(emptySet);
		setDisplayText(shuffleText(text, emptySet));
		setIsDecrypted(false);
	}, [text, shuffleText]);
	const triggerDecrypt = (0, import_react.useCallback)(() => {
		if (sequential) {
			orderRef.current = computeOrder(text.length);
			pointerRef.current = 0;
			setRevealedIndices(/* @__PURE__ */ new Set());
		} else setRevealedIndices(/* @__PURE__ */ new Set());
		setDirection("forward");
		setIsAnimating(true);
	}, [
		sequential,
		computeOrder,
		text.length
	]);
	const triggerReverse = (0, import_react.useCallback)(() => {
		if (sequential) {
			orderRef.current = computeOrder(text.length).slice().reverse();
			pointerRef.current = 0;
			setRevealedIndices(fillAllIndices());
			setDisplayText(shuffleText(text, fillAllIndices()));
		} else {
			setRevealedIndices(fillAllIndices());
			setDisplayText(shuffleText(text, fillAllIndices()));
		}
		setDirection("reverse");
		setIsAnimating(true);
	}, [
		sequential,
		computeOrder,
		fillAllIndices,
		shuffleText,
		text
	]);
	(0, import_react.useEffect)(() => {
		if (!isAnimating) return;
		let currentIteration = 0;
		const getNextIndex = (revealedSet) => {
			const textLength = text.length;
			switch (revealDirection) {
				case "start": return revealedSet.size;
				case "end": return textLength - 1 - revealedSet.size;
				case "center": {
					const middle = Math.floor(textLength / 2);
					const offset = Math.floor(revealedSet.size / 2);
					const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;
					if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) return nextIndex;
					for (let i = 0; i < textLength; i++) if (!revealedSet.has(i)) return i;
					return 0;
				}
				default: return revealedSet.size;
			}
		};
		intervalRef.current = setInterval(() => {
			setRevealedIndices((prevRevealed) => {
				if (sequential) {
					if (direction === "forward") if (prevRevealed.size < text.length) {
						const nextIndex = getNextIndex(prevRevealed);
						const newRevealed = new Set(prevRevealed);
						newRevealed.add(nextIndex);
						setDisplayText(shuffleText(text, newRevealed));
						return newRevealed;
					} else {
						clearInterval(intervalRef.current ?? void 0);
						setIsAnimating(false);
						setIsDecrypted(true);
						return prevRevealed;
					}
					if (direction === "reverse") if (pointerRef.current < orderRef.current.length) {
						const idxToRemove = orderRef.current[pointerRef.current++];
						const newRevealed = new Set(prevRevealed);
						newRevealed.delete(idxToRemove);
						setDisplayText(shuffleText(text, newRevealed));
						if (newRevealed.size === 0) {
							clearInterval(intervalRef.current ?? void 0);
							setIsAnimating(false);
							setIsDecrypted(false);
						}
						return newRevealed;
					} else {
						clearInterval(intervalRef.current ?? void 0);
						setIsAnimating(false);
						setIsDecrypted(false);
						return prevRevealed;
					}
				} else {
					if (direction === "forward") {
						setDisplayText(shuffleText(text, prevRevealed));
						currentIteration++;
						if (currentIteration >= maxIterations) {
							clearInterval(intervalRef.current ?? void 0);
							setIsAnimating(false);
							setDisplayText(text);
							setIsDecrypted(true);
						}
						return prevRevealed;
					}
					if (direction === "reverse") {
						let currentSet = prevRevealed;
						if (currentSet.size === 0) currentSet = fillAllIndices();
						const removeCount = Math.max(1, Math.ceil(text.length / Math.max(1, maxIterations)));
						const nextSet = removeRandomIndices(currentSet, removeCount);
						setDisplayText(shuffleText(text, nextSet));
						currentIteration++;
						if (nextSet.size === 0 || currentIteration >= maxIterations) {
							clearInterval(intervalRef.current ?? void 0);
							setIsAnimating(false);
							setIsDecrypted(false);
							setDisplayText(shuffleText(text, /* @__PURE__ */ new Set()));
							return /* @__PURE__ */ new Set();
						}
						return nextSet;
					}
				}
				return prevRevealed;
			});
		}, speed);
		return () => clearInterval(intervalRef.current ?? void 0);
	}, [
		isAnimating,
		text,
		speed,
		maxIterations,
		sequential,
		revealDirection,
		shuffleText,
		direction,
		fillAllIndices,
		removeRandomIndices,
		characters,
		useOriginalCharsOnly
	]);
	const handleClick = () => {
		if (animateOn !== "click") return;
		if (clickMode === "once") {
			if (isDecrypted) return;
			setDirection("forward");
			triggerDecrypt();
		}
		if (clickMode === "toggle") if (isDecrypted) triggerReverse();
		else {
			setDirection("forward");
			triggerDecrypt();
		}
	};
	const triggerHoverDecrypt = (0, import_react.useCallback)(() => {
		if (isAnimating) return;
		setRevealedIndices(/* @__PURE__ */ new Set());
		setIsDecrypted(false);
		setDisplayText(text);
		setDirection("forward");
		setIsAnimating(true);
	}, [isAnimating, text]);
	const resetToPlainText = (0, import_react.useCallback)(() => {
		clearInterval(intervalRef.current ?? void 0);
		setIsAnimating(false);
		setRevealedIndices(/* @__PURE__ */ new Set());
		setDisplayText(text);
		setIsDecrypted(true);
		setDirection("forward");
	}, [text]);
	(0, import_react.useEffect)(() => {
		if (animateOn !== "view" && animateOn !== "inViewHover") return;
		const observerCallback = (entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && !hasAnimated) {
					triggerDecrypt();
					setHasAnimated(true);
				}
			});
		};
		const observer = new IntersectionObserver(observerCallback, {
			root: null,
			rootMargin: "0px",
			threshold: .1
		});
		const currentRef = containerRef.current;
		if (currentRef) observer.observe(currentRef);
		return () => {
			if (currentRef) observer.unobserve(currentRef);
		};
	}, [
		animateOn,
		hasAnimated,
		triggerDecrypt
	]);
	(0, import_react.useEffect)(() => {
		if (animateOn === "click") encryptInstantly();
		else {
			setDisplayText(text);
			setIsDecrypted(true);
		}
		setRevealedIndices(/* @__PURE__ */ new Set());
		setDirection("forward");
	}, [
		animateOn,
		text,
		encryptInstantly
	]);
	const animateProps = animateOn === "hover" || animateOn === "inViewHover" ? {
		onMouseEnter: triggerHoverDecrypt,
		onMouseLeave: resetToPlainText
	} : animateOn === "click" ? { onClick: handleClick } : {};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.span, {
		ref: containerRef,
		className: `inline-block whitespace-pre-wrap ${parentClassName}`,
		...animateProps,
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			style: styles.srOnly,
			children: displayText
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": "true",
			children: displayText.split("").map((char, index) => {
				const isRevealedOrDone = revealedIndices.has(index) || !isAnimating && isDecrypted;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: isRevealedOrDone ? className : encryptedClassName,
					children: char
				}, index);
			})
		})]
	});
};
var CountUp = ({ to, from = 0, direction = "up", delay = 0, duration = 2, className = "", startWhen = true, separator = "", onStart, onEnd }) => {
	const ref = (0, import_react.useRef)(null);
	const motionValue = useMotionValue(direction === "down" ? to : from);
	const damping = 20 + 40 * (1 / duration);
	const stiffness = 100 * (1 / duration);
	const springValue = useSpring(motionValue, {
		damping,
		stiffness
	});
	const isInView = useInView(ref, {
		once: true,
		margin: "0px"
	});
	const getDecimalPlaces = (num) => {
		const str = num.toString();
		if (str.includes(".")) {
			const decimals = str.split(".")[1];
			if (parseInt(decimals) !== 0) return decimals.length;
		}
		return 0;
	};
	const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));
	const formatValue = (0, import_react.useCallback)((latest) => {
		const hasDecimals = maxDecimals > 0;
		const options = {
			useGrouping: !!separator,
			minimumFractionDigits: hasDecimals ? maxDecimals : 0,
			maximumFractionDigits: hasDecimals ? maxDecimals : 0
		};
		const formattedNumber = Intl.NumberFormat("en-US", options).format(latest);
		return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;
	}, [maxDecimals, separator]);
	(0, import_react.useEffect)(() => {
		if (ref.current) ref.current.textContent = formatValue(direction === "down" ? to : from);
	}, [
		from,
		to,
		direction,
		formatValue
	]);
	(0, import_react.useEffect)(() => {
		if (isInView && startWhen) {
			if (typeof onStart === "function") onStart();
			const timeoutId = setTimeout(() => {
				motionValue.set(direction === "down" ? from : to);
			}, delay * 1e3);
			const durationTimeoutId = setTimeout(() => {
				if (typeof onEnd === "function") onEnd();
			}, delay * 1e3 + duration * 1e3);
			return () => {
				clearTimeout(timeoutId);
				clearTimeout(durationTimeoutId);
			};
		}
	}, [
		isInView,
		startWhen,
		motionValue,
		direction,
		from,
		to,
		delay,
		onStart,
		onEnd,
		duration
	]);
	(0, import_react.useEffect)(() => {
		const unsubscribe = springValue.on("change", (latest) => {
			if (ref.current) ref.current.textContent = formatValue(latest);
		});
		return () => unsubscribe();
	}, [springValue, formatValue]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className,
		ref
	});
};
var SpotlightCard = ({ children, className = "", spotlightColor = "rgba(56, 189, 248, 0.15)" }) => {
	const divRef = (0, import_react.useRef)(null);
	const [isFocused, setIsFocused] = (0, import_react.useState)(false);
	const [position, setPosition] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [opacity, setOpacity] = (0, import_react.useState)(0);
	const handleMouseMove = (e) => {
		if (!divRef.current || isFocused) return;
		const rect = divRef.current.getBoundingClientRect();
		setPosition({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		});
	};
	const handleFocus = () => {
		setIsFocused(true);
		setOpacity(.6);
	};
	const handleBlur = () => {
		setIsFocused(false);
		setOpacity(0);
	};
	const handleMouseEnter = () => {
		setOpacity(.6);
	};
	const handleMouseLeave = () => {
		setOpacity(0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: divRef,
		onMouseMove: handleMouseMove,
		onFocus: handleFocus,
		onBlur: handleBlur,
		onMouseEnter: handleMouseEnter,
		onMouseLeave: handleMouseLeave,
		className: `relative rounded-2xl border border-white/10 bg-[#0c0e14]/90 overflow-hidden ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-in-out -z-0",
			style: {
				opacity,
				background: `radial-gradient(circle 320px at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative z-10",
			children
		})]
	});
};
var StarBorder = ({ as, className = "", color = "#ff6b00", speed = "4s", thickness = 1, backgroundColor = "transparent", textColor = "#ffffff", borderColor = "rgba(255, 255, 255, 0.15)", children, style, ...rest }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(as || "button", {
		className: `relative inline-flex items-center justify-center overflow-hidden rounded-xl ${className}`,
		style: {
			padding: `${thickness}px`,
			...style
		},
		...rest,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute w-[300%] h-[60%] opacity-80 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom pointer-events-none z-0",
				style: {
					background: `radial-gradient(circle, ${color}, transparent 20%)`,
					animationDuration: speed
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute w-[300%] h-[60%] opacity-80 top-[-10px] left-[-250%] rounded-full animate-star-movement-top pointer-events-none z-0",
				style: {
					background: `radial-gradient(circle, ${color}, transparent 20%)`,
					animationDuration: speed
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 w-full h-full rounded-[inherit] flex items-center justify-center",
				style: {
					background: backgroundColor,
					color: textColor
				},
				children
			})
		]
	});
};
var Magnet = ({ children, padding = 100, disabled = false, magnetStrength = 2, activeTransition = "transform 0.3s ease-out", inactiveTransition = "transform 0.5s ease-in-out", wrapperClassName = "", innerClassName = "", ...props }) => {
	const [isActive, setIsActive] = (0, import_react.useState)(false);
	const [position, setPosition] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const magnetRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (disabled) {
			setPosition({
				x: 0,
				y: 0
			});
			return;
		}
		const handleMouseMove = (e) => {
			if (!magnetRef.current) return;
			const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
			const centerX = left + width / 2;
			const centerY = top + height / 2;
			const distX = Math.abs(centerX - e.clientX);
			const distY = Math.abs(centerY - e.clientY);
			if (distX < width / 2 + padding && distY < height / 2 + padding) {
				setIsActive(true);
				const offsetX = (e.clientX - centerX) / magnetStrength;
				const offsetY = (e.clientY - centerY) / magnetStrength;
				setPosition({
					x: offsetX,
					y: offsetY
				});
			} else {
				setIsActive(false);
				setPosition({
					x: 0,
					y: 0
				});
			}
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [
		padding,
		disabled,
		magnetStrength
	]);
	const transitionStyle = isActive ? activeTransition : inactiveTransition;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: magnetRef,
		className: wrapperClassName,
		style: {
			position: "relative",
			display: "inline-block"
		},
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: innerClassName,
			style: {
				transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
				transition: transitionStyle,
				willChange: "transform"
			},
			children
		})
	});
};
var ClickSpark = ({ sparkColor = "#38bdf8", sparkSize = 10, sparkRadius = 20, sparkCount = 8, duration = 400, easing = "ease-out", extraScale = 1, children }) => {
	const canvasRef = (0, import_react.useRef)(null);
	const sparksRef = (0, import_react.useRef)([]);
	const startTimeRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const parent = canvas.parentElement;
		if (!parent) return;
		let resizeTimeout;
		const resizeCanvas = () => {
			const { width, height } = parent.getBoundingClientRect();
			if (canvas.width !== width || canvas.height !== height) {
				canvas.width = width;
				canvas.height = height;
			}
		};
		const handleResize = () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(resizeCanvas, 100);
		};
		const ro = new ResizeObserver(handleResize);
		ro.observe(parent);
		resizeCanvas();
		return () => {
			ro.disconnect();
			clearTimeout(resizeTimeout);
		};
	}, []);
	const easeFunc = (0, import_react.useCallback)((t) => {
		switch (easing) {
			case "linear": return t;
			case "ease-in": return t * t;
			case "ease-in-out": return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
			default: return t * (2 - t);
		}
	}, [easing]);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let animationId;
		const draw = (timestamp) => {
			if (!startTimeRef.current) startTimeRef.current = timestamp;
			ctx?.clearRect(0, 0, canvas.width, canvas.height);
			sparksRef.current = sparksRef.current.filter((spark) => {
				const elapsed = timestamp - spark.startTime;
				if (elapsed >= duration) return false;
				const progress = elapsed / duration;
				const eased = easeFunc(progress);
				const distance = eased * sparkRadius * extraScale;
				const lineLength = sparkSize * (1 - eased);
				const x1 = spark.x + distance * Math.cos(spark.angle);
				const y1 = spark.y + distance * Math.sin(spark.angle);
				const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
				const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);
				ctx.strokeStyle = sparkColor;
				ctx.lineWidth = 1.8;
				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.stroke();
				return true;
			});
			animationId = requestAnimationFrame(draw);
		};
		animationId = requestAnimationFrame(draw);
		return () => {
			cancelAnimationFrame(animationId);
		};
	}, [
		sparkColor,
		sparkSize,
		sparkRadius,
		sparkCount,
		duration,
		easeFunc,
		extraScale
	]);
	const handleClick = (e) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const now = performance.now();
		const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
			x,
			y,
			angle: 2 * Math.PI * i / sparkCount,
			startTime: now
		}));
		sparksRef.current.push(...newSparks);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full h-full",
		onClick: handleClick,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "absolute inset-0 pointer-events-none z-50"
		}), children]
	});
};
function parseHSL(hslStr) {
	const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
	if (!match) return {
		h: 40,
		s: 80,
		l: 80
	};
	return {
		h: parseFloat(match[1]),
		s: parseFloat(match[2]),
		l: parseFloat(match[3])
	};
}
function buildBoxShadow(glowColor, intensity) {
	const { h, s, l } = parseHSL(glowColor);
	const base = `${h}deg ${s}% ${l}%`;
	return [
		[
			0,
			0,
			0,
			1,
			100,
			true
		],
		[
			0,
			0,
			1,
			0,
			60,
			true
		],
		[
			0,
			0,
			3,
			0,
			50,
			true
		],
		[
			0,
			0,
			6,
			0,
			40,
			true
		],
		[
			0,
			0,
			15,
			0,
			30,
			true
		],
		[
			0,
			0,
			25,
			2,
			20,
			true
		],
		[
			0,
			0,
			50,
			2,
			10,
			true
		],
		[
			0,
			0,
			1,
			0,
			60,
			false
		],
		[
			0,
			0,
			3,
			0,
			50,
			false
		],
		[
			0,
			0,
			6,
			0,
			40,
			false
		],
		[
			0,
			0,
			15,
			0,
			30,
			false
		],
		[
			0,
			0,
			25,
			2,
			20,
			false
		],
		[
			0,
			0,
			50,
			2,
			10,
			false
		]
	].map(([x, y, blur, spread, alpha, inset]) => {
		const a = Math.min(alpha * intensity, 100);
		return `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`;
	}).join(", ");
}
function easeOutCubic(x) {
	return 1 - Math.pow(1 - x, 3);
}
function easeInCubic(x) {
	return x * x * x;
}
function animateValue({ start = 0, end = 100, duration = 1e3, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) {
	const t0 = performance.now() + delay;
	function tick() {
		const elapsed = performance.now() - t0;
		const t = Math.min(elapsed / duration, 1);
		onUpdate(start + (end - start) * ease(t));
		if (t < 1) requestAnimationFrame(tick);
		else if (onEnd) onEnd();
	}
	setTimeout(() => requestAnimationFrame(tick), delay);
}
var GRADIENT_POSITIONS = [
	"80% 55%",
	"69% 34%",
	"8% 6%",
	"41% 38%",
	"86% 85%",
	"82% 18%",
	"51% 4%"
];
var COLOR_MAP = [
	0,
	1,
	2,
	0,
	1,
	2,
	1
];
function buildMeshGradients(colors) {
	const gradients = [];
	for (let i = 0; i < 7; i++) {
		const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
		gradients.push(`radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`);
	}
	gradients.push(`linear-gradient(${colors[0]} 0 100%)`);
	return gradients;
}
function isLightColor(color) {
	const value = color.trim().replace("#", "");
	if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(value)) return false;
	const hex = value.length === 3 ? value.split("").map((char) => char + char).join("") : value;
	const red = parseInt(hex.slice(0, 2), 16);
	const green = parseInt(hex.slice(2, 4), 16);
	const blue = parseInt(hex.slice(4, 6), 16);
	return red * .2126 + green * .7152 + blue * .0722 > 180;
}
var BorderGlow = ({ children, className = "", edgeSensitivity = 30, glowColor = "190 80 60", backgroundColor = "#0c0e14", borderRadius = 24, glowRadius = 35, glowIntensity = .8, coneSpread = 25, animated = false, colors = [
	"#ff6b00",
	"#ff8533",
	"#ea580c"
], fillOpacity = .4 }) => {
	const cardRef = (0, import_react.useRef)(null);
	const [isHovered, setIsHovered] = (0, import_react.useState)(false);
	const [cursorAngle, setCursorAngle] = (0, import_react.useState)(45);
	const [edgeProximity, setEdgeProximity] = (0, import_react.useState)(0);
	const [sweepActive, setSweepActive] = (0, import_react.useState)(false);
	const getCenterOfElement = (0, import_react.useCallback)((el) => {
		const { width, height } = el.getBoundingClientRect();
		return [width / 2, height / 2];
	}, []);
	const getEdgeProximity = (0, import_react.useCallback)((el, x, y) => {
		const [cx, cy] = getCenterOfElement(el);
		const dx = x - cx;
		const dy = y - cy;
		let kx = Infinity;
		let ky = Infinity;
		if (dx !== 0) kx = cx / Math.abs(dx);
		if (dy !== 0) ky = cy / Math.abs(dy);
		return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
	}, [getCenterOfElement]);
	const getCursorAngle = (0, import_react.useCallback)((el, x, y) => {
		const [cx, cy] = getCenterOfElement(el);
		const dx = x - cx;
		const dy = y - cy;
		if (dx === 0 && dy === 0) return 0;
		let degrees = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
		if (degrees < 0) degrees += 360;
		return degrees;
	}, [getCenterOfElement]);
	const handlePointerMove = (0, import_react.useCallback)((e) => {
		const card = cardRef.current;
		if (!card) return;
		const rect = card.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		setEdgeProximity(getEdgeProximity(card, x, y));
		setCursorAngle(getCursorAngle(card, x, y));
	}, [getEdgeProximity, getCursorAngle]);
	(0, import_react.useEffect)(() => {
		if (!animated) return;
		const angleStart = 110;
		setSweepActive(true);
		setCursorAngle(angleStart);
		animateValue({
			duration: 500,
			onUpdate: (v) => setEdgeProximity(v / 100)
		});
		animateValue({
			ease: easeInCubic,
			duration: 1500,
			end: 50,
			onUpdate: (v) => {
				setCursorAngle(355 * (v / 100) + angleStart);
			}
		});
		animateValue({
			ease: easeOutCubic,
			delay: 1500,
			duration: 2250,
			start: 50,
			end: 100,
			onUpdate: (v) => {
				setCursorAngle(355 * (v / 100) + angleStart);
			}
		});
		animateValue({
			ease: easeInCubic,
			delay: 2500,
			duration: 1500,
			start: 100,
			end: 0,
			onUpdate: (v) => setEdgeProximity(v / 100),
			onEnd: () => setSweepActive(false)
		});
	}, [animated]);
	const colorSensitivity = edgeSensitivity + 20;
	const isVisible = isHovered || sweepActive;
	const borderOpacity = isVisible ? Math.max(0, (edgeProximity * 100 - colorSensitivity) / (100 - colorSensitivity)) : 0;
	const glowOpacity = isVisible ? Math.max(0, (edgeProximity * 100 - edgeSensitivity) / (100 - edgeSensitivity)) : 0;
	const meshGradients = buildMeshGradients(colors);
	const borderBg = meshGradients.map((g) => `${g} border-box`);
	const fillBg = meshGradients.map((g) => `${g} padding-box`);
	const angleDeg = `${cursorAngle.toFixed(3)}deg`;
	const lightSurface = isLightColor(backgroundColor);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: cardRef,
		onPointerMove: handlePointerMove,
		onPointerEnter: () => setIsHovered(true),
		onPointerLeave: () => setIsHovered(false),
		className: `relative grid isolate border ${className}`,
		style: {
			background: backgroundColor,
			borderColor: lightSurface ? "rgb(24 24 27 / 12%)" : "rgb(255 255 255 / 15%)",
			borderRadius: `${borderRadius}px`,
			transform: "translate3d(0, 0, 0.01px)",
			boxShadow: lightSurface ? "rgb(24 24 27 / 4%) 0 1px 2px, rgb(24 24 27 / 5%) 0 8px 24px" : "rgba(0,0,0,0.2) 0 4px 16px, rgba(0,0,0,0.3) 0 12px 32px"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 rounded-[inherit] -z-[1]",
				style: {
					border: "1px solid transparent",
					background: [
						`linear-gradient(${backgroundColor} 0 100%) padding-box`,
						"linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box",
						...borderBg
					].join(", "),
					opacity: borderOpacity,
					maskImage: `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
					WebkitMaskImage: `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
					transition: isVisible ? "opacity 0.25s ease-out" : "opacity 0.75s ease-in-out"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 rounded-[inherit] -z-[1]",
				style: {
					border: "1px solid transparent",
					background: fillBg.join(", "),
					maskImage: [
						"linear-gradient(to bottom, black, black)",
						"radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)",
						"radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)",
						"radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)",
						"radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)",
						"radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)",
						`conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`
					].join(", "),
					WebkitMaskImage: [
						"linear-gradient(to bottom, black, black)",
						"radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)",
						"radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)",
						"radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)",
						"radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)",
						"radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)",
						`conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`
					].join(", "),
					maskComposite: "subtract, add, add, add, add, add",
					WebkitMaskComposite: "source-out, source-over, source-over, source-over, source-over, source-over",
					opacity: borderOpacity * fillOpacity,
					mixBlendMode: lightSurface ? "normal" : "soft-light",
					transition: isVisible ? "opacity 0.25s ease-out" : "opacity 0.75s ease-in-out"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute pointer-events-none z-[1] rounded-[inherit]",
				style: {
					inset: `${-glowRadius}px`,
					maskImage: `conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
					WebkitMaskImage: `conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
					opacity: glowOpacity,
					mixBlendMode: lightSurface ? "normal" : "plus-lighter",
					transition: isVisible ? "opacity 0.25s ease-out" : "opacity 0.75s ease-in-out"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute rounded-[inherit]",
					style: {
						inset: `${glowRadius}px`,
						boxShadow: buildBoxShadow(glowColor, glowIntensity)
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col relative overflow-hidden z-[1]",
				children
			})
		]
	});
};
var defaultColors = [
	"#ff6b00",
	"#ff8533",
	"#f97316",
	"#ffffff"
];
var hexToRgb = (hex) => {
	hex = hex.replace(/^#/, "");
	if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
	const int = parseInt(hex.slice(0, 6), 16);
	return [
		(int >> 16 & 255) / 255,
		(int >> 8 & 255) / 255,
		(int & 255) / 255
	];
};
var vertex = `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vRandom = random;
    vColor = color;
    
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    
    vec4 mvPos = viewMatrix * mPos;

    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }
    
    gl_Position = projectionMatrix * mvPos;
  }
`;
var fragment = `
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    
    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.35, d) * 0.85;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;
var Particles = ({ particleCount = 140, particleSpread = 12, speed = .12, particleColors, moveParticlesOnHover = true, particleHoverFactor = .5, alphaParticles = true, particleBaseSize = 85, sizeRandomness = 1, cameraDistance = 20, disableRotation = false, pixelRatio = 1, className = "" }) => {
	const containerRef = (0, import_react.useRef)(null);
	const mouseRef = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	(0, import_react.useEffect)(() => {
		const container = containerRef.current;
		if (!container) return;
		let renderer;
		try {
			renderer = new Renderer({
				dpr: pixelRatio,
				depth: false,
				alpha: true
			});
		} catch {
			return;
		}
		const gl = renderer.gl;
		container.appendChild(gl.canvas);
		gl.clearColor(0, 0, 0, 0);
		const camera = new Camera(gl, { fov: 15 });
		camera.position.set(0, 0, cameraDistance);
		const resize = () => {
			if (!container) return;
			const width = container.clientWidth || window.innerWidth;
			const height = container.clientHeight || window.innerHeight;
			renderer.setSize(width, height);
			camera.perspective({ aspect: gl.canvas.width / (gl.canvas.height || 1) });
		};
		window.addEventListener("resize", resize, false);
		resize();
		const handleMouseMove = (e) => {
			const rect = container.getBoundingClientRect();
			const x = (e.clientX - rect.left) / rect.width * 2 - 1;
			const y = -((e.clientY - rect.top) / rect.height * 2 - 1);
			mouseRef.current = {
				x,
				y
			};
		};
		if (moveParticlesOnHover) window.addEventListener("mousemove", handleMouseMove);
		const count = particleCount;
		const positions = new Float32Array(count * 3);
		const randoms = new Float32Array(count * 4);
		const colors = new Float32Array(count * 3);
		const palette = particleColors && particleColors.length > 0 ? particleColors : defaultColors;
		for (let i = 0; i < count; i++) {
			let x, y, z, len;
			do {
				x = Math.random() * 2 - 1;
				y = Math.random() * 2 - 1;
				z = Math.random() * 2 - 1;
				len = x * x + y * y + z * z;
			} while (len > 1 || len === 0);
			const r = Math.cbrt(Math.random());
			positions.set([
				x * r,
				y * r,
				z * r
			], i * 3);
			randoms.set([
				Math.random(),
				Math.random(),
				Math.random(),
				Math.random()
			], i * 4);
			const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
			colors.set(col, i * 3);
		}
		const geometry = new Geometry(gl, {
			position: {
				size: 3,
				data: positions
			},
			random: {
				size: 4,
				data: randoms
			},
			color: {
				size: 3,
				data: colors
			}
		});
		const program = new Program(gl, {
			vertex,
			fragment,
			uniforms: {
				uTime: { value: 0 },
				uSpread: { value: particleSpread },
				uBaseSize: { value: particleBaseSize * pixelRatio },
				uSizeRandomness: { value: sizeRandomness },
				uAlphaParticles: { value: alphaParticles ? 1 : 0 }
			},
			transparent: true,
			depthTest: false
		});
		const particles = new Mesh(gl, {
			mode: gl.POINTS,
			geometry,
			program
		});
		let animationFrameId;
		let lastTime = performance.now();
		let elapsed = 0;
		const update = (t) => {
			animationFrameId = requestAnimationFrame(update);
			const delta = t - lastTime;
			lastTime = t;
			elapsed += delta * speed;
			program.uniforms.uTime.value = elapsed * .001;
			if (moveParticlesOnHover) {
				particles.position.x = -mouseRef.current.x * particleHoverFactor;
				particles.position.y = -mouseRef.current.y * particleHoverFactor;
			} else {
				particles.position.x = 0;
				particles.position.y = 0;
			}
			if (!disableRotation) {
				particles.rotation.x = Math.sin(elapsed * 2e-4) * .1;
				particles.rotation.y = Math.cos(elapsed * 5e-4) * .15;
				particles.rotation.z += .01 * speed;
			}
			renderer.render({
				scene: particles,
				camera
			});
		};
		animationFrameId = requestAnimationFrame(update);
		return () => {
			window.removeEventListener("resize", resize);
			if (moveParticlesOnHover) window.removeEventListener("mousemove", handleMouseMove);
			cancelAnimationFrame(animationFrameId);
			if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
		};
	}, [
		particleCount,
		particleSpread,
		speed,
		moveParticlesOnHover,
		particleHoverFactor,
		alphaParticles,
		particleBaseSize,
		sizeRandomness,
		cameraDistance,
		disableRotation,
		pixelRatio,
		particleColors
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: containerRef,
		className: `absolute inset-0 pointer-events-none ${className}`
	});
};
function WindowsIcon$1({ className = "h-4 w-4" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		className,
		viewBox: "0 0 88 88",
		fill: "currentColor",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M0 12.402l35.687-4.86.016 34.423-35.67.248L0 12.402zm35.67 33.529l.028 34.453L.028 75.48.003 46.179l35.667-.248zM40.97 6.479L87.977 0v41.526l-47.008.377V6.479zm47.037 39.467l-.03 41.602-46.99-6.613-.013-34.612 47.033-.377z" })
	});
}
function Hero() {
	const [copiedWinget, setCopiedWinget] = (0, import_react.useState)(false);
	const copyWinget = () => {
		navigator.clipboard?.writeText("winget install vesper");
		setCopiedWinget(true);
		toast.success("Command copied to clipboard", { description: "Paste in Windows Terminal or PowerShell to install." });
		setTimeout(() => setCopiedWinget(false), 2200);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "top",
		className: "relative overflow-hidden pt-36 pb-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 z-0 opacity-40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Particles, {
					particleCount: 75,
					particleSpread: 10,
					speed: .06,
					particleColors: [
						"#ff7a1a",
						"#ea580c",
						"#fed7aa",
						"#cbd5e1"
					],
					alphaParticles: true,
					particleBaseSize: 70
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 grid-backdrop [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,black,transparent)] -z-10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute left-1/2 top-0 h-[450px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,107,0,0.08),transparent_70%)] blur-3xl -z-10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mx-auto max-w-5xl px-5 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2.5 rounded-full border border-orange-200/80 bg-orange-50/80 px-4 py-1.5 backdrop-blur-md shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "relative flex h-2 w-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_#ff6b00]" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShinyText, {
								text: "THE SOFTWARE 3.0 AMBIENT INTELLIGENCE PLATFORM",
								speed: 2.2,
								color: "#ea580c",
								shineColor: "#ffffff",
								className: "font-mono text-[11px] font-bold tracking-[0.16em]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline text-orange-300",
								children: "|"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline font-mono text-[11px] font-semibold text-slate-600",
								children: "Sub-180ms Latency"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlurText, {
							text: "Say what you mean.",
							delay: 90,
							animateBy: "words",
							direction: "top",
							className: "text-balance text-4xl font-extrabold leading-[1.12] tracking-[-0.035em] text-slate-900 sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-7xl justify-center text-center"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlurText, {
							text: "Get it done at the speed of speech.",
							delay: 110,
							animateBy: "words",
							direction: "bottom",
							className: "mt-2 text-balance text-4xl font-extrabold leading-[1.12] tracking-[-0.035em] text-slate-500 sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-7xl justify-center text-center"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg",
						children: [
							"The high-bandwidth biological bridge to your Windows PC. Hold",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kbd font-mono text-slate-900 font-bold bg-slate-100 border border-slate-300 px-2 py-0.5 rounded shadow-sm",
								children: "Right Alt"
							}),
							", speak naturally, and watch dense, pre-polished text paste directly at your cursor in sub-180ms. Follows the Zero-Backspace Rule."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnet, {
							padding: 50,
							magnetStrength: 3,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarBorder, {
								as: "a",
								href: "#download",
								color: "#ff6b00",
								speed: "3.5s",
								thickness: 1.5,
								backgroundColor: "#ffffff",
								className: "group relative flex w-full items-center justify-center text-slate-900 transition-all active:scale-[0.98] sm:w-auto shadow-[0_4px_20px_rgba(255,107,0,0.18)] border border-orange-200",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 px-5 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WindowsIcon$1, { className: "h-5 w-5 text-primary transition-transform group-hover:scale-110" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-start text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-bold tracking-tight text-slate-900",
												children: "Download VESPER for Windows (.exe)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "h-3.5 w-3.5 text-primary transition-transform group-hover:translate-y-0.5" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] text-slate-500",
											children: "v1.0.0 Release · ~74 MB · 64-bit · Native Windows 11 / 10"
										})]
									})]
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnet, {
							padding: 40,
							magnetStrength: 3,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "#simulator",
								className: "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 py-4 text-sm font-semibold text-slate-700 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-orange-50/50 hover:text-primary sm:w-auto shadow-sm active:scale-[0.98]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Try Interactive Simulator" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded font-bold",
									children: "Live WebAudio"
								})]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: copyWinget,
							className: "group flex items-center gap-2.5 rounded-lg border border-border bg-white px-3.5 py-1.5 font-mono text-xs text-slate-600 transition-all hover:border-primary/40 hover:text-slate-900 shadow-sm",
							title: "Click to copy winget command",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "h-3.5 w-3.5 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "winget install vesper" }),
								copiedWinget ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3 text-slate-400 transition-colors group-hover:text-primary" })
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpotlightCard, {
								spotlightColor: "rgba(255, 107, 0, 0.12)",
								className: "p-5 text-left border-border bg-white shadow-sm transition-transform hover:-translate-y-0.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200 bg-orange-50",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "h-4 w-4 text-primary" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "mt-3.5 text-sm font-bold text-slate-900 flex items-center gap-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "<180ms Latency" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 text-xs text-slate-500",
										children: "Sub-second biological feedback"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpotlightCard, {
								spotlightColor: "rgba(255, 107, 0, 0.12)",
								className: "p-5 text-left border-border bg-white shadow-sm transition-transform hover:-translate-y-0.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200 bg-orange-50",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "h-4 w-4 text-primary" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "mt-3.5 text-sm font-bold text-slate-900",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Zero Focus Loss" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 text-xs text-slate-500",
										children: "Native Win32 caret preservation"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpotlightCard, {
								spotlightColor: "rgba(255, 107, 0, 0.12)",
								className: "p-5 text-left border-border bg-white shadow-sm transition-transform hover:-translate-y-0.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200 bg-orange-50",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-primary" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "mt-3.5 text-sm font-bold text-slate-900",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Zero-Backspace Rule" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 text-xs text-slate-500",
										children: "Deterministic filler stripping"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpotlightCard, {
								spotlightColor: "rgba(255, 107, 0, 0.12)",
								className: "p-5 text-left border-border bg-white shadow-sm transition-transform hover:-translate-y-0.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200 bg-orange-50",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 text-primary" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "mt-3.5 text-sm font-bold text-slate-900",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Secure Local Audio" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 text-xs text-slate-500",
										children: "In-memory 16kHz PCM buffer"
									})
								]
							})
						]
					})
				]
			})
		]
	});
}
function SmartQAOverlay({ question, onSelectOption, onDismiss }) {
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape" && onDismiss) {
				e.preventDefault();
				onDismiss();
				return;
			}
			const match = question.options.find((opt) => opt.key === e.key);
			if (match) {
				e.preventDefault();
				onSelectOption(match.key, match.value);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		question,
		onSelectOption,
		onDismiss
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-2xl border border-emerald/40 bg-obsidian-elevated/95 p-5 shadow-[0_12px_40px_-8px_rgba(16,185,129,0.25)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 border-b border-titanium-border/80 pb-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-6 w-6 items-center justify-center rounded-lg bg-emerald/15 text-emerald border border-emerald/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald",
							children: "Layer 4: Smart Q&A Disambiguation"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-titanium-border/60 px-1.5 py-0.2 font-mono text-[9px] text-titanium-silver",
							children: "0–3 Questions Max"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-sm font-semibold text-stark mt-0.5",
						children: question.question
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden sm:flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium/80 px-2.5 py-1 font-mono text-[11px] text-titanium-silver",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Press" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "rounded border border-emerald/40 bg-emerald/10 px-1 py-0.5 font-bold text-emerald",
							children: "1"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "–" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "rounded border border-emerald/40 bg-emerald/10 px-1 py-0.5 font-bold text-emerald",
							children: question.options.length
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "to select" })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 rounded-lg border border-titanium-border/60 bg-titanium/40 px-3 py-2 text-xs font-mono text-titanium-silver flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-emerald shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-titanium-silver/80",
						children: "Spoken intent:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-stark font-medium truncate",
						children: [
							"\"",
							question.contextPrompt,
							"\""
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3.5 grid gap-2 sm:grid-cols-2",
				children: question.options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onSelectOption(opt.key, opt.value),
					className: `group relative flex items-start gap-3 rounded-xl border p-3 text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${opt.isRecommended ? "border-emerald/50 bg-emerald/5 hover:border-emerald hover:bg-emerald/10 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]" : "border-titanium-border bg-titanium/60 hover:border-titanium-silver/40 hover:bg-titanium"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold transition-colors ${opt.isRecommended ? "border border-emerald/50 bg-emerald text-obsidian shadow-[0_0_8px_var(--emerald)]" : "border border-titanium-border bg-titanium-elevated text-stark group-hover:border-emerald/40 group-hover:text-emerald"}`,
							children: opt.key
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-stark group-hover:text-emerald transition-colors",
									children: opt.label
								}), opt.isRecommended && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 font-mono text-[9px] font-bold text-emerald bg-emerald/10 px-1.5 py-0.5 rounded-full border border-emerald/30",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-2.5 w-2.5" }), "Recommended"]
								})]
							}), opt.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-[11px] text-titanium-silver line-clamp-1",
								children: opt.description
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 text-titanium-silver/40 opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0" })
					]
				}, opt.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-between text-[11px] text-titanium-silver/70 font-mono",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sub-180ms zero-backspace synthesis" }), onDismiss && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onDismiss,
					className: "hover:text-stark transition-colors underline",
					children: "Dismiss (Esc)"
				})]
			})
		]
	});
}
function AgentApprovalCard({ initialText, targetApp, contextSummary, onApprove, onReject }) {
	const [draft, setDraft] = (0, import_react.useState)(initialText);
	(0, import_react.useEffect)(() => {
		setDraft(initialText);
	}, [initialText]);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				e.preventDefault();
				onReject();
			} else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				onApprove(draft);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		draft,
		onApprove,
		onReject
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-2xl border border-titanium-border bg-obsidian-elevated/95 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 border-b border-titanium-border/80 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-6 w-6 items-center justify-center rounded-lg bg-emerald/15 text-emerald border border-emerald/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] font-semibold uppercase tracking-wider text-stark",
							children: "Screen Agent Pilot Verification"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-emerald/10 border border-emerald/30 px-2 py-0.5 font-mono text-[9px] text-emerald",
							children: targetApp
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-titanium-silver mt-0.5",
						children: contextSummary
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 font-mono text-[10px] text-titanium-silver/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Human-in-the-Loop" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-[10px] font-mono uppercase tracking-wider text-titanium-silver mb-1.5 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Drafted Intent Response (Click to edit)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-emerald flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-2.5 w-2.5" }), "Zero-Backspace Pre-Polished"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: draft,
					onChange: (e) => setDraft(e.target.value),
					rows: 3,
					className: "w-full rounded-xl border border-titanium-border bg-titanium/80 p-3 font-mono text-xs text-stark placeholder-titanium-silver/40 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald/40 transition-all resize-none"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-titanium-border/50 text-xs font-mono",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-[11px] text-titanium-silver",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Press" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "rounded border border-titanium-border bg-titanium px-1.5 py-0.5 font-bold text-stark",
							children: "Ctrl+Enter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "to inject" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "rounded border border-titanium-border bg-titanium px-1.5 py-0.5 font-bold text-stark",
							children: "Esc"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "to cancel" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onReject,
						className: "inline-flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium/60 px-3 py-1.5 text-xs text-titanium-silver hover:border-red-500/40 hover:text-red-400 transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reject" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onApprove(draft),
						className: "inline-flex items-center gap-1.5 rounded-lg border border-emerald/50 bg-emerald px-3.5 py-1.5 text-xs font-semibold text-obsidian shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:opacity-95 transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Approve & Paste (Ctrl+Enter)" })]
					})]
				})]
			})
		]
	});
}
function ContextInspector({ isOpen, onClose, activeApp = "Cursor.exe (PID 14208)", activeWindow = "auth.middleware.ts - VESPER" }) {
	const [activeTab, setActiveTab] = (0, import_react.useState)("context");
	const [rawText, setRawText] = (0, import_react.useState)("const API_SECRET_KEY = \"sec_live_9f42c9e3d1b847291a0\";\nconst dbPassword = \"SuperSecretPassword2026!\";\nconst userToken = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\";");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const sanitizedText = (0, import_react.useMemo)(() => {
		let result = rawText;
		result = result.replace(/sec_[a-zA-Z0-9_-]{10,}/g, "[SHIELDED_API_KEY]");
		result = result.replace(/sk-[a-zA-Z0-9_-]{15,}/g, "[SHIELDED_SECRET_KEY]");
		result = result.replace(/eyJ[a-zA-Z0-9_-]{20,}/g, "[SHIELDED_JWT_TOKEN]");
		result = result.replace(/(password|passwd|secret)\s*[:=]\s*["']([^"']+)["']/gi, "$1 = \"[SHIELDED_CREDENTIAL]\"");
		result = result.replace(/\b(?:\d{4}[ -]?){3}\d{4}\b/g, "[SHIELDED_PAYMENT_CARD]");
		return result;
	}, [rawText]);
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-3xl overflow-hidden rounded-2xl border border-titanium-border bg-obsidian-elevated shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-titanium-border px-6 py-4 bg-titanium/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-8 w-8 items-center justify-center rounded-lg border border-emerald/40 bg-emerald/10 text-emerald shadow-[0_0_12px_rgba(16,185,129,0.2)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-semibold text-stark",
								children: "VESPER Multimodal Context & Privacy Inspector"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-emerald/40 bg-emerald/10 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald",
								children: "Layer 2 Live"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-titanium-silver",
							children: "Active Windows API hook · Zero focus stealing · Regex & entropy credential shield"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-lg p-1.5 text-titanium-silver hover:bg-titanium hover:text-stark transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex border-b border-titanium-border bg-titanium/20 px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveTab("context"),
							className: `flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-medium transition-all ${activeTab === "context" ? "border-emerald text-emerald" : "border-transparent text-titanium-silver hover:text-stark"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "What VESPER Sees" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveTab("privacy"),
							className: `flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-medium transition-all ${activeTab === "privacy" ? "border-emerald text-emerald" : "border-transparent text-titanium-silver hover:text-stark"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Privacy Shield & Redaction" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveTab("latency"),
							className: `flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-medium transition-all ${activeTab === "latency" ? "border-emerald text-emerald" : "border-transparent text-titanium-silver hover:text-stark"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sub-180ms Latency Waterfall" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 max-h-[70vh] overflow-y-auto",
					children: [
						activeTab === "context" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium/50 p-3.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-xs font-mono text-titanium-silver",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Active Application" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex h-2 w-2 rounded-full bg-emerald" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 font-mono text-sm font-semibold text-stark",
												children: activeApp
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 text-[11px] text-titanium-silver",
												children: "Target process focused; caret position preserved"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium/50 p-3.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-xs font-mono text-titanium-silver",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Window / Buffer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-emerald",
													children: "98% Confidence"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 font-mono text-sm font-semibold text-stark truncate",
												children: activeWindow
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 text-[11px] text-titanium-silver",
												children: "Domain classification: Software Engineering"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-titanium-border bg-titanium/30 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs font-mono",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-stark font-semibold flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCode, { className: "h-3.5 w-3.5 text-emerald" }), "Caret Selection Buffer (Non-destructive)"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-titanium-silver",
											children: "142 Tokens"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
										className: "mt-2.5 overflow-x-auto rounded-lg border border-titanium-border/80 bg-obsidian p-3 font-mono text-xs text-stark/90 leading-relaxed",
										children: `// Captured from foreground editor without overwriting Windows clipboard
export async function authenticate(req: Request) {
  const token = req.headers.get("Authorization");
  if (!token) throw new AuthError("Missing bearer token");
  return verifySession(token);
}`
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-emerald/30 bg-emerald/5 p-4 text-xs leading-relaxed text-titanium-silver",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 font-semibold text-stark mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Why Context Was Enriched" })]
										}),
										"WinKeyServer tracked that you held Right Alt while inside Cursor Composer. VESPER fused the active file path (",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "font-mono text-stark",
											children: "auth.middleware.ts"
										}),
										") and the surrounding authentication functions so that your voice command was executed with zero manual prompt engineering."
									]
								})
							]
						}),
						activeTab === "privacy" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-sm font-semibold text-stark",
										children: "Live Privacy Shield Redactor"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-titanium-silver",
										children: "Type or paste sensitive tokens below to test real-time client-side scrubbing."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setRawText("const API_KEY = \"sk-live-481948204820481029\";\nconst password = \"mySecurePassword!\";"),
											className: "rounded-lg border border-titanium-border bg-titanium px-2.5 py-1 font-mono text-[11px] text-titanium-silver hover:text-stark",
											children: "Preset 1"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setRawText("Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0;\nCard: 4532-8921-3921-9042"),
											className: "rounded-lg border border-titanium-border bg-titanium px-2.5 py-1 font-mono text-[11px] text-titanium-silver hover:text-stark",
											children: "Preset 2"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[11px] font-mono uppercase text-titanium-silver mb-1.5",
										children: "Raw User Environment Input"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: rawText,
										onChange: (e) => setRawText(e.target.value),
										rows: 5,
										className: "w-full rounded-xl border border-titanium-border bg-obsidian p-3 font-mono text-xs text-red-300 focus:border-emerald focus:outline-none resize-none",
										placeholder: "Enter code or text with credentials..."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between mb-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-[11px] font-mono uppercase text-emerald flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }), "Sanitized Payload (Sent to Model)"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												navigator.clipboard.writeText(sanitizedText);
												setCopied(true);
												setTimeout(() => setCopied(false), 2e3);
											},
											className: "text-[11px] font-mono text-titanium-silver hover:text-stark flex items-center gap-1",
											children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-emerald" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copied ? "Copied" : "Copy" })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
										className: "h-[120px] overflow-auto rounded-xl border border-emerald/40 bg-obsidian p-3 font-mono text-xs text-emerald/90 whitespace-pre-wrap",
										children: sanitizedText
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-titanium-border bg-titanium/40 p-4 text-xs text-titanium-silver",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-semibold text-stark mb-1 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Zero Audio Retention Protocol" })]
									}), "Audio streams are kept solely in 16kHz PCM RAM buffers for inference and instantly purged upon key release. No telemetry recording of voice waveforms ever leaves your Windows machine."]
								})
							]
						}),
						activeTab === "latency" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-titanium-border pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs text-emerald font-semibold",
										children: "SUB-180ms END-TO-END BENCHMARK"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-sm font-semibold text-stark",
										children: "Physical Pipeline Latency"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-lg font-bold text-emerald",
										children: "175ms Total"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 font-mono text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-titanium-silver mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1. Win32 Hook + Silero VAD Audio Chunking" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-stark",
												children: "30 ms"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-2 w-full rounded-full bg-titanium overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full bg-emerald/60 rounded-full",
												style: { width: "17%" }
											})
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-titanium-silver mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2. High-Speed Neural Speech Pipeline Inference" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-stark",
												children: "85 ms"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-2 w-full rounded-full bg-titanium overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full bg-emerald rounded-full",
												style: { width: "48%" }
											})
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-titanium-silver mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3. Local LLM Intent Extraction & Zero-Backspace Formatter" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-stark",
												children: "45 ms"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-2 w-full rounded-full bg-titanium overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full bg-emerald/80 rounded-full",
												style: { width: "25%" }
											})
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-titanium-silver mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "4. Win32 SendInput Unicode Direct Caret Injection" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-stark",
												children: "15 ms"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-2 w-full rounded-full bg-titanium overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full bg-emerald/50 rounded-full",
												style: { width: "10%" }
											})
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[11px] text-titanium-silver pt-2 text-center",
									children: "Compared to traditional typing: 5.4× faster bandwidth than 120 WPM keyboard input."
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-titanium-border bg-titanium/50 px-6 py-3 font-mono text-xs text-titanium-silver",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Obsidian Glass Engine" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-lg border border-titanium-border bg-titanium px-4 py-1.5 text-stark hover:border-emerald hover:text-emerald transition-colors",
						children: "Close Inspector"
					})]
				})
			]
		})
	});
}
var PRESETS = {
	cursor: {
		name: "Cursor Composer Refactor",
		app: "Cursor.exe",
		description: "Code generation intent with context fusion from open TypeScript file",
		uto: {
			$schema: "https://vesper.dev/schemas/task-v1.json",
			taskId: "task_9f42c1ae",
			timestamp: "2026-10-09T00:30:00Z",
			source: {
				rawSpeech: "Refactor auth middleware to verify bearer token with per IP token bucket",
				sttConfidence: .992,
				inferenceLatencyMs: 84
			},
			context: {
				activeApp: "Cursor",
				processId: 14208,
				windowTitle: "auth.middleware.ts - VESPER",
				activeFilePath: "src/server/auth.middleware.ts",
				caretSelectedTokens: 142,
				privacyShieldStatus: "CLEAN (0 secrets detected)"
			},
			intent: {
				domain: "code.refactor",
				action: "inject_composer_prompt",
				slots: {
					authentication_scheme: "Bearer JWT",
					rate_limiting: "token-bucket",
					downtime_policy: "zero-downtime"
				},
				ambiguityScore: .04
			},
			routing: {
				targetAdapter: "adapters.ai.cursor_composer",
				hotkeyTrigger: "Ctrl+I",
				riskLevel: "LOW",
				permissionGranted: true
			},
			executionPayload: {
				method: "Win32_SendInput_Unicode",
				focusStealing: false,
				zeroBackspaceCompliant: true
			}
		}
	},
	slack: {
		name: "Slack Executive Standup",
		app: "Slack.exe",
		description: "Communication triage with automatic tone polishing and channel routing",
		uto: {
			$schema: "https://vesper.dev/schemas/task-v1.json",
			taskId: "task_3c1780b2",
			timestamp: "2026-10-09T00:30:00Z",
			source: {
				rawSpeech: "Drop a quick update in product launch that the MVP installer passed all tests",
				sttConfidence: .985,
				inferenceLatencyMs: 78
			},
			context: {
				activeApp: "Slack",
				processId: 1804,
				windowTitle: "#product-launch - Slack",
				channel: "C0842910F",
				privacyShieldStatus: "CLEAN"
			},
			intent: {
				domain: "comms.post_update",
				action: "draft_message",
				slots: {
					channelName: "#product-launch",
					tone: "concise_executive",
					verdict: "passed_all_tests"
				},
				ambiguityScore: .02
			},
			routing: {
				targetAdapter: "adapters.comms.slack_caret",
				riskLevel: "LOW",
				screenAgentVerified: true
			},
			executionPayload: { renderedText: "Team update: The VESPER v0.1.0 MVP installer has been compiled and verified with 100% test coverage (241/241 passing). Download links are live in the channel." }
		}
	},
	terminal: {
		name: "PowerShell Git Automation",
		app: "pwsh.exe",
		description: "System command execution with safety checks",
		uto: {
			$schema: "https://vesper.dev/schemas/task-v1.json",
			taskId: "task_6b829e01",
			timestamp: "2026-10-09T00:30:00Z",
			source: {
				rawSpeech: "Commit changes with message feat win32 get foreground window preservation",
				sttConfidence: .994,
				inferenceLatencyMs: 81
			},
			context: {
				activeApp: "Windows Terminal (PowerShell 7.4)",
				processId: 2284,
				workingDirectory: "C:/Users/VESPER/projects/vesper",
				gitBranch: "feature/win32-hooks"
			},
			intent: {
				domain: "system.terminal.git",
				action: "git_commit",
				slots: {
					commit_type: "feat",
					scope: "win32",
					subject: "implement GetForegroundWindow preservation with zero focus stealing"
				},
				ambiguityScore: 0
			},
			routing: {
				targetAdapter: "adapters.os.terminal",
				riskLevel: "MEDIUM",
				requiresReview: false
			},
			executionPayload: { command: "git commit -m 'feat(win32): implement GetForegroundWindow preservation with zero focus stealing in context-detector'" }
		}
	},
	vision: {
		name: "Visual Screen Pilot",
		app: "Browser / Desktop",
		description: "Multimodal visual bounding box targeting and automated action",
		uto: {
			$schema: "https://vesper.dev/schemas/task-v1.json",
			taskId: "task_vis_7721",
			timestamp: "2026-10-09T00:30:00Z",
			source: {
				rawSpeech: "Export the last 30 days of telemetry into CSV and save to downloads",
				sttConfidence: .978
			},
			context: {
				activeApp: "Chrome (VESPER Dashboard)",
				screenResolution: "3840x2160 (DPI 150%)",
				detectedUIElement: "button#export-csv",
				coordinates: {
					x: 1840,
					y: 320
				}
			},
			intent: {
				domain: "pilot.ui_click",
				action: "trigger_export",
				slots: {
					format: "csv",
					timeframe: "30d"
				}
			},
			routing: {
				targetAdapter: "adapters.pilot.win32_mouse_action",
				riskLevel: "LOW"
			}
		}
	}
};
function UtoExplorerModal({ isOpen, onClose }) {
	const [activePreset, setActivePreset] = (0, import_react.useState)("cursor");
	const [copied, setCopied] = (0, import_react.useState)(false);
	if (!isOpen) return null;
	const current = PRESETS[activePreset];
	const jsonString = JSON.stringify(current.uto, null, 2);
	const handleCopy = () => {
		navigator.clipboard.writeText(jsonString);
		setCopied(true);
		toast.success("Universal Task Object (UTO) copied to clipboard.");
		setTimeout(() => setCopied(false), 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-3xl overflow-hidden rounded-2xl border border-titanium-border bg-obsidian-elevated shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-titanium-border px-6 py-4 bg-titanium/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-8 w-8 items-center justify-center rounded-lg border border-emerald/40 bg-emerald/10 text-emerald shadow-[0_0_12px_rgba(16,185,129,0.2)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileBraces, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-semibold text-stark",
								children: "Universal Task Object (UTO) Contract Explorer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-emerald/40 bg-emerald/10 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald",
								children: "Layer 5 Canonical Spec"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-titanium-silver",
							children: "Deterministic JSON interface bridging messy human speech with target OS/AI adapters"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-lg p-1.5 text-titanium-silver hover:bg-titanium hover:text-stark transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 border-b border-titanium-border bg-titanium/20 px-6 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs text-titanium-silver mr-2",
						children: "Preset Scenario:"
					}), Object.keys(PRESETS).map((key) => {
						const p = PRESETS[key];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActivePreset(key),
							className: `rounded-lg px-3 py-1.5 font-mono text-xs transition-all ${activePreset === key ? "border border-emerald/50 bg-emerald/15 font-semibold text-emerald shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "border border-titanium-border bg-titanium text-titanium-silver hover:border-titanium-silver/40 hover:text-stark"}`,
							children: p.name
						}, key);
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 max-h-[60vh] overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-2 text-xs font-mono",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-titanium-silver",
							children: current.description
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleCopy,
							className: "inline-flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium px-2.5 py-1 text-stark hover:border-emerald hover:text-emerald transition-colors",
							children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copied ? "Copied" : "Copy JSON Contract" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "overflow-x-auto rounded-xl border border-titanium-border/80 bg-obsidian p-4 font-mono text-xs text-emerald/90 leading-relaxed shadow-inner",
						children: jsonString
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-titanium-border bg-titanium/50 px-6 py-3 font-mono text-xs text-titanium-silver",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-emerald",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), "Immutable Contract"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Zero Hallucination Guarantee" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-lg border border-titanium-border bg-titanium px-4 py-1.5 text-stark hover:border-emerald hover:text-emerald transition-colors",
						children: "Close"
					})]
				})
			]
		})
	});
}
var SAMPLES = {
	cursor: {
		direct: "Refactor auth.middleware.ts to check for bearer tokens and return 401 if missing.",
		smart: "You are a senior backend architect. Refactor auth.middleware.ts to support bearer JWTs with zero downtime, and add per-IP token-bucket rate limiting with sane defaults.",
		filename: "cursor : auth.middleware.ts",
		comment: "// Composer Prompt (Ctrl+I)",
		process: "Cursor.exe (PID 14208)",
		qaQuestion: {
			id: "qa-cursor-auth",
			question: "Which authentication architecture should be synthesized?",
			contextPrompt: "Create rate-limited auth check for API endpoints",
			options: [
				{
					key: "1",
					label: "Bearer JWT + Per-IP Token Bucket",
					value: "export const auth = createRateLimitedAuth({ scheme: 'Bearer JWT', algorithm: 'HS256', rateLimit: { capacity: 60, refillPerSec: 1 } });",
					description: "Production grade rate-limited bearer authentication",
					isRecommended: true
				},
				{
					key: "2",
					label: "Session Cookies + Redis Store",
					value: "export const auth = createSessionAuth({ store: 'redis', cookieName: 'vesper_session', httpOnly: true, secure: true });",
					description: "Stateful session validation for web applications"
				},
				{
					key: "3",
					label: "OAuth 2.0 PKCE Flow",
					value: "export const auth = createOAuthPkceVerifier({ audience: 'https://api.vesper.dev', tokenEndpoint: '/oauth/token' });",
					description: "Modern Single Page Application standard"
				},
				{
					key: "4",
					label: "HMAC Signed Header Token",
					value: "export const auth = createHmacSignatureGuard({ secretEnv: 'HMAC_SECRET', maxAgeMs: 30000 });",
					description: "Microservice-to-microservice internal RPC"
				}
			]
		},
		pilotProposal: {
			initial: "Refactor auth.middleware.ts: Added Bearer JWT guard with token-bucket limiter (60 req/min). Handled expired tokens with 401 Unauthorized.",
			summary: "Verified in Cursor active editor buffer"
		}
	},
	vscode: {
		direct: "Add a native Windows keyboard hook to detect Right Alt key release within 180ms.",
		smart: "Write a Win32 native hook in C++ using SetWindowsHookEx(WH_KEYBOARD_LL) to track Right Alt press and release duration with sub-millisecond precision.",
		filename: "vscode : win-hook.cc",
		comment: "// Copilot Inline Instruction",
		process: "Code.exe (PID 9184)",
		qaQuestion: {
			id: "qa-vscode-hook",
			question: "What Win32 hook threading model should be applied?",
			contextPrompt: "Set up keyboard hook for Right Alt key detection",
			options: [
				{
					key: "1",
					label: "Dedicated Background Message Pump (Thread Isolated)",
					value: "HANDLE hThread = CreateThread(NULL, 0, HookThreadProc, NULL, 0, NULL); // Sub-millisecond latency isolation",
					description: "Zero stutter; guarantees zero UI thread interference",
					isRecommended: true
				},
				{
					key: "2",
					label: "Standard Main Loop SetWindowsHookEx",
					value: "HHOOK hHook = SetWindowsHookExW(WH_KEYBOARD_LL, LowLevelKeyboardProc, hInstance, 0);",
					description: "Standard single-process event loop"
				},
				{
					key: "3",
					label: "RawInput Intercept (WM_INPUT)",
					value: "RAWINPUTDEVICE rid = { 0x01, 0x06, RIDEV_INPUTSINK, hWnd }; RegisterRawInputDevices(&rid, 1, sizeof(rid));",
					description: "Ultra-low overhead raw input stream"
				},
				{
					key: "4",
					label: "WinKeyServer IPC Named Pipe Bridge",
					value: "HANDLE hPipe = CreateNamedPipeW(L\"\\\\\\\\.\\\\pipe\\\\VesperWinKey\", PIPE_ACCESS_DUPLEX, PIPE_TYPE_MESSAGE, 1, 512, 512, 0, NULL);",
					description: "Electron-to-C++ binary micro-service"
				}
			]
		},
		pilotProposal: {
			initial: "Generated C++ SetWindowsHookEx(WH_KEYBOARD_LL) with dedicated message pump thread to track VK_RMENU timing.",
			summary: "Win32 low-level keyboard hook injection"
		}
	},
	slack: {
		direct: "Hey team, the Windows v1.0.0 installer is built and passed all 241 tests. Ready for testing!",
		smart: "Team update: The VESPER v1.0.0 Production installer has been compiled and verified with 100% test coverage (241/241 passing). Download links are live in the channel.",
		filename: "slack : #product-launch",
		comment: "// Message #product-launch",
		process: "slack.exe (PID 1804)",
		qaQuestion: {
			id: "qa-slack-triage",
			question: "Select executive announcement tone for Slack #product-launch:",
			contextPrompt: "Post update about production installer ready for team testing",
			options: [
				{
					key: "1",
					label: "Concise Engineering Release Note",
					value: "🚀 VESPER v1.0.0 Production installer is compiled & SHA-256 verified. All 241 tests passing. Ready for deployment on Windows 10/11.",
					description: "High signal, zero fluff, immediate test links",
					isRecommended: true
				},
				{
					key: "2",
					label: "Casual Developer Ping",
					value: "Hey squad! Fresh Windows build is ready in releases. Give Hold-to-Talk a spin and drop any latency feedback in this thread.",
					description: "Friendly peer notification for rapid testing"
				},
				{
					key: "3",
					label: "Executive Brief for Investors / Leadership",
					value: "Milestone reached: The native Windows engine has achieved sub-180ms TTFT with 100% test coverage. Initial distribution begins today.",
					description: "Formal progress summary highlighting KPIs"
				},
				{
					key: "4",
					label: "Bullet-Point Changelog Breakdown",
					value: "• WinKeyServer: Low-level Right Alt hook attached\n• Audio: 16kHz PCM zero-backspace pipeline active\n• Installer: 170MB signed production package ready",
					description: "Structured technical bullets"
				}
			]
		},
		pilotProposal: {
			initial: "Team update: The VESPER v1.0.0 Production installer has been compiled and verified with 100% test coverage (241/241 passing). Ready for deployment.",
			summary: "Slack #product-launch channel message"
		}
	},
	terminal: {
		direct: "git commit -m 'feat: optimize native Win32 window detection for zero focus stealing'",
		smart: "git commit -m 'feat(win32): implement GetForegroundWindow preservation with zero focus stealing in context-detector'",
		filename: "powershell : ~/projects/vesper",
		comment: "# PowerShell 7.4 (x64)",
		process: "pwsh.exe (PID 2284)",
		qaQuestion: {
			id: "qa-terminal-git",
			question: "Which Git commit convention format should be executed?",
			contextPrompt: "Commit changes optimizing native Win32 focus detector",
			options: [
				{
					key: "1",
					label: "Conventional Commits: feat(win32): ...",
					value: "git commit -m 'feat(win32): implement GetForegroundWindow preservation with zero focus stealing in context-detector'",
					description: "Standard semantic commit structure",
					isRecommended: true
				},
				{
					key: "2",
					label: "Short Imperative Message",
					value: "git commit -m 'Optimize native Win32 window detection for zero focus stealing'",
					description: "Clean single-line git log"
				},
				{
					key: "3",
					label: "Multi-line Detailed Changelog",
					value: "git commit -m 'feat: optimize window detection' -m '- Preserves foreground window handle\n- Zero focus stealing during push-to-talk\n- Sub-15ms SendInput caret injection'",
					description: "Includes bulleted breakdown in commit body"
				},
				{
					key: "4",
					label: "Commit & Push to Remote Branch",
					value: "git commit -m 'feat(win32): zero focus stealing detector' && git push origin HEAD",
					description: "Atomic commit with immediate branch push"
				}
			]
		},
		pilotProposal: {
			initial: "git commit -m 'feat(win32): implement GetForegroundWindow preservation with zero focus stealing in context-detector'",
			summary: "PowerShell terminal git command"
		}
	}
};
function playHapticTone(type, enabled) {
	if (!enabled) return;
	try {
		const ctx = new (window.AudioContext || window.webkitAudioContext)();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.connect(gain);
		gain.connect(ctx.destination);
		if (type === "press") {
			osc.frequency.setValueAtTime(440, ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + .04);
			gain.gain.setValueAtTime(.04, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .04);
			osc.start();
			osc.stop(ctx.currentTime + .05);
		} else {
			osc.frequency.setValueAtTime(880, ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + .06);
			gain.gain.setValueAtTime(.05, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .06);
			osc.start();
			osc.stop(ctx.currentTime + .07);
		}
	} catch {}
}
function Simulator() {
	const [activeApp, setActiveApp] = (0, import_react.useState)("cursor");
	const [mode, setMode] = (0, import_react.useState)("direct");
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [typed, setTyped] = (0, import_react.useState)("");
	const [soundEnabled, setSoundEnabled] = (0, import_react.useState)(true);
	const typingTimer = (0, import_react.useRef)(null);
	const [showSmartQA, setShowSmartQA] = (0, import_react.useState)(false);
	const [showApprovalCard, setShowApprovalCard] = (0, import_react.useState)(false);
	const [isInspectorOpen, setIsInspectorOpen] = (0, import_react.useState)(false);
	const [isUtoOpen, setIsUtoOpen] = (0, import_react.useState)(false);
	const [isLiveMicActive, setIsLiveMicActive] = (0, import_react.useState)(false);
	const [micAudioLevel, setMicAudioLevel] = (0, import_react.useState)(new Array(24).fill(4));
	const audioContextRef = (0, import_react.useRef)(null);
	const analyserRef = (0, import_react.useRef)(null);
	const micStreamRef = (0, import_react.useRef)(null);
	const animFrameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		try {
			const stored = localStorage.getItem("vesper_sound_fx");
			if (stored !== null) setSoundEnabled(stored === "true");
		} catch (_err) {}
	}, []);
	const toggleSound = () => {
		setSoundEnabled((prev) => {
			const next = !prev;
			try {
				localStorage.setItem("vesper_sound_fx", String(next));
			} catch (_err) {}
			return next;
		});
	};
	const toggleLiveMic = async () => {
		if (isLiveMicActive) {
			if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
			if (micStreamRef.current) {
				micStreamRef.current.getTracks().forEach((t) => t.stop());
				micStreamRef.current = null;
			}
			if (audioContextRef.current) {
				audioContextRef.current.close();
				audioContextRef.current = null;
			}
			setIsLiveMicActive(false);
			setMicAudioLevel(new Array(24).fill(4));
		} else try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			micStreamRef.current = stream;
			const ctx = new (window.AudioContext || window.webkitAudioContext)();
			audioContextRef.current = ctx;
			const analyser = ctx.createAnalyser();
			analyser.fftSize = 64;
			analyserRef.current = analyser;
			ctx.createMediaStreamSource(stream).connect(analyser);
			setIsLiveMicActive(true);
			const dataArray = new Uint8Array(analyser.frequencyBinCount);
			const updateWave = () => {
				if (!analyserRef.current) return;
				analyserRef.current.getByteFrequencyData(dataArray);
				const bars = [];
				for (let i = 0; i < 24; i++) {
					const val = dataArray[i % dataArray.length] || 0;
					bars.push(Math.max(4, Math.round(val / 255 * 26)));
				}
				setMicAudioLevel(bars);
				animFrameRef.current = requestAnimationFrame(updateWave);
			};
			updateWave();
		} catch (err) {
			alert("Microphone access could not be acquired or is blocked by browser permissions.");
			setIsLiveMicActive(false);
		}
	};
	(0, import_react.useEffect)(() => {
		return () => {
			if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
			if (micStreamRef.current) micStreamRef.current.getTracks().forEach((t) => t.stop());
			if (audioContextRef.current) audioContextRef.current.close();
		};
	}, []);
	const currentSample = SAMPLES[activeApp];
	const targetText = mode === "direct" ? currentSample.direct : currentSample.smart;
	const startHold = () => {
		if (phase !== "idle") return;
		playHapticTone("press", soundEnabled);
		setPhase("recording");
		setTyped("");
		setShowSmartQA(false);
		setShowApprovalCard(false);
	};
	const endHold = () => {
		if (phase !== "recording") return;
		playHapticTone("release", soundEnabled);
		setPhase("transcribing");
		window.setTimeout(() => {
			if (mode === "smart_qa") {
				setPhase("idle");
				setShowSmartQA(true);
				return;
			}
			if (mode === "pilot") {
				setPhase("idle");
				setShowApprovalCard(true);
				return;
			}
			setPhase("typing");
			let i = 0;
			if (typingTimer.current) window.clearInterval(typingTimer.current);
			typingTimer.current = window.setInterval(() => {
				i += 3;
				setTyped(targetText.slice(0, i));
				if (i >= targetText.length) {
					if (typingTimer.current) window.clearInterval(typingTimer.current);
					setPhase("idle");
				}
			}, 16);
		}, 280);
	};
	const handleSelectQAOption = (_key, value) => {
		setShowSmartQA(false);
		setPhase("typing");
		let i = 0;
		if (typingTimer.current) window.clearInterval(typingTimer.current);
		typingTimer.current = window.setInterval(() => {
			i += 3;
			setTyped(value.slice(0, i));
			if (i >= value.length) {
				if (typingTimer.current) window.clearInterval(typingTimer.current);
				setPhase("idle");
			}
		}, 16);
	};
	const handleApprovePilot = (finalText) => {
		setShowApprovalCard(false);
		setPhase("typing");
		let i = 0;
		if (typingTimer.current) window.clearInterval(typingTimer.current);
		typingTimer.current = window.setInterval(() => {
			i += 3;
			setTyped(finalText.slice(0, i));
			if (i >= finalText.length) {
				if (typingTimer.current) window.clearInterval(typingTimer.current);
				setPhase("idle");
			}
		}, 16);
	};
	(0, import_react.useEffect)(() => {
		return () => {
			if (typingTimer.current) window.clearInterval(typingTimer.current);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "simulator",
		className: "mx-auto max-w-5xl scroll-mt-28 px-5 py-28 relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				id: "demo",
				className: "sr-only",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center sm:text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-titanium-border bg-titanium-elevated px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-titanium-silver",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3 w-3 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Interactive Software 3.0 Sandbox" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 text-3xl font-semibold tracking-[-0.03em] text-stark sm:text-4xl",
							children: "Test the physical push-to-talk mechanic."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-titanium-silver",
							children: [
								"Hold the button or press and hold",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "kbd font-mono text-stark",
									children: "Space"
								}),
								" to experience the exact sub-180ms flow with synthetic audio feedback. Follows the Zero-Backspace Rule."
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 self-center sm:self-start shrink-0 sm:mt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: toggleLiveMic,
						className: `inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs transition-all ${isLiveMicActive ? "border-emerald bg-emerald/15 text-emerald shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-pulse" : "border-titanium-border bg-titanium text-titanium-silver hover:border-emerald/40 hover:text-stark"}`,
						title: "Toggle live microphone frequency analyser",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isLiveMicActive ? "Mic Active (16kHz)" : "Live Mic Test" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: toggleSound,
						className: "inline-flex items-center gap-2 rounded-xl border border-titanium-border bg-titanium px-3 py-1.5 font-mono text-xs text-titanium-silver hover:border-emerald/40 hover:text-stark transition-all",
						title: soundEnabled ? "Disable tactile sound FX" : "Enable tactile sound FX",
						children: soundEnabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-3.5 w-3.5 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sound: On" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-3.5 w-3.5 text-zinc-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sound: Muted" })] })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-titanium-border/60 py-3 text-xs font-mono",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-titanium-silver",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-emerald flex h-2 w-2 rounded-full bg-emerald shadow-[0_0_8px_var(--emerald)]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "WinKeyServer IPC: Connected" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-titanium-silver/40",
							children: "|"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Silero VAD: Active"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setIsInspectorOpen(true),
						className: "inline-flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium px-2.5 py-1 text-stark hover:border-emerald hover:text-emerald transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Inspect Context & Privacy (L2)" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setIsUtoOpen(true),
						className: "inline-flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium px-2.5 py-1 text-stark hover:border-emerald hover:text-emerald transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileBraces, { className: "h-3.5 w-3.5 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View UTO Contract (L5)" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs uppercase tracking-wider text-titanium-silver",
					children: "Foreground Target Window:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5 rounded-xl border border-titanium-border bg-titanium p-1 shadow-inner",
					children: [
						{
							id: "cursor",
							label: "Cursor IDE",
							icon: CodeXml
						},
						{
							id: "vscode",
							label: "VS Code",
							icon: CodeXml
						},
						{
							id: "slack",
							label: "Slack Desktop",
							icon: MessageSquare
						},
						{
							id: "terminal",
							label: "Windows Terminal",
							icon: Terminal
						}
					].map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setActiveApp(app.id);
							setPhase("idle");
							setTyped("");
							setShowSmartQA(false);
							setShowApprovalCard(false);
						},
						className: `flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3.5 py-1.5 text-xs font-medium transition-all ${activeApp === app.id ? "border border-titanium-border bg-titanium-elevated text-stark shadow-sm" : "text-titanium-silver hover:text-stark"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(app.icon, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: app.label })]
					}, app.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpotlightCard, {
				spotlightColor: "rgba(16, 185, 129, 0.12)",
				className: "relative mt-6 overflow-hidden rounded-2xl border border-titanium-border bg-titanium shadow-2xl p-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-titanium-border bg-titanium-elevated px-4 py-2.5 backdrop-blur-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-zinc-700/80" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-zinc-700/80" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-zinc-700/80" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-3 font-mono text-[11px] text-titanium-silver",
									children: currentSample.filename
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-mono text-[10px] text-emerald",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecryptedText, {
								text: `HWND Attached: ${currentSample.process}`,
								speed: 40,
								maxIterations: 8,
								animateOn: "hover",
								className: "text-emerald font-semibold",
								encryptedClassName: "text-titanium-silver font-mono"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none relative flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `absolute top-4 z-20 flex items-center gap-3.5 rounded-full border border-white/10 bg-titanium/95 shadow-[0_16px_45px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all duration-300 ${phase === "idle" && !isLiveMicActive ? "px-4 py-2 opacity-85" : phase === "recording" || isLiveMicActive ? "scale-105 px-5 py-2.5 opacity-100 shadow-[0_0_35px_-8px_rgba(255,107,0,0.5)] ring-1 ring-primary/50" : "px-4 py-2 opacity-100 shadow-[0_0_25px_-5px_rgba(255,107,0,0.25)]"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `flex h-6 w-6 items-center justify-center rounded-full transition-colors ${phase === "recording" || isLiveMicActive ? "bg-primary text-white shadow-[0_0_12px_#ff6b00]" : phase === "transcribing" ? "bg-amber-400 text-slate-900" : "bg-slate-100 text-slate-600"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-3 w-3" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs font-medium tracking-tight text-stark",
									children: [
										isLiveMicActive && "Live Microphone Stream · Listening...",
										!isLiveMicActive && phase === "idle" && "VESPER Ready · Hold Alt",
										!isLiveMicActive && phase === "recording" && "Listening at 16kHz PCM...",
										!isLiveMicActive && phase === "transcribing" && "Neural Speech Pipeline (140ms)...",
										!isLiveMicActive && phase === "typing" && "Injecting via SendInput..."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-4 items-center gap-0.5",
									children: (isLiveMicActive ? micAudioLevel : [
										6,
										14,
										8,
										18,
										12,
										16,
										9,
										20,
										11,
										7,
										15,
										10,
										19,
										8,
										13,
										17,
										10,
										14,
										6,
										12,
										16,
										9,
										14,
										8
									]).map((h, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `w-0.5 rounded-full transition-all duration-150 ${phase === "recording" || isLiveMicActive ? "bg-emerald animate-pulse" : phase === "transcribing" ? "bg-amber-400" : "bg-titanium-silver/40"}`,
										style: { height: isLiveMicActive ? `${h}px` : phase === "recording" ? `${Math.max(4, h * (idx % 2 === 0 ? 1.2 : .8))}px` : "4px" }
									}, idx))
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-h-[350px] bg-obsidian px-6 pb-6 pt-16 sm:px-8 sm:pb-8 sm:pt-20 font-mono text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-titanium-silver/50 select-none pb-3 border-b border-titanium-border/40 mb-4 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: currentSample.comment }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-emerald/80",
									children: "Caret Focused in Foreground Window"
								})]
							}),
							showSmartQA && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartQAOverlay, {
									question: currentSample.qaQuestion,
									onSelectOption: handleSelectQAOption,
									onDismiss: () => setShowSmartQA(false)
								})
							}),
							showApprovalCard && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentApprovalCard, {
									initialText: currentSample.pilotProposal.initial,
									targetApp: currentSample.process,
									contextSummary: currentSample.pilotProposal.summary,
									onApprove: handleApprovePilot,
									onReject: () => setShowApprovalCard(false)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "leading-relaxed text-stark pt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: typed }),
									phase === "typing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-4 w-2 bg-primary animate-pulse ml-0.5 align-middle shadow-[0_0_8px_#ff6b00]" }),
									phase === "idle" && typed.length === 0 && !showSmartQA && !showApprovalCard && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-titanium-silver/50 italic",
										children: "Press and hold the button below to stream spoken intent here..."
									})
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col items-center justify-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnet, {
					padding: 40,
					magnetStrength: 3,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onMouseDown: startHold,
						onMouseUp: endHold,
						onTouchStart: startHold,
						onTouchEnd: endHold,
						className: `group relative flex items-center gap-3 rounded-2xl border px-8 py-4 text-sm font-semibold transition-all duration-200 select-none ${phase === "recording" ? "border-primary bg-primary text-white shadow-[0_0_35px_rgba(255,107,0,0.4)] scale-[0.98]" : "border-border bg-white text-slate-900 hover:border-primary/50 hover:shadow-[0_0_24px_-4px_rgba(255,107,0,0.18)]"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `flex h-6 w-6 items-center justify-center rounded-full transition-transform ${phase === "recording" ? "scale-110" : "group-hover:scale-105"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: `h-4 w-4 ${phase === "recording" ? "text-white" : "text-primary"}` })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: phase === "recording" ? "Release Key to Inject Text" : "Press & Hold to Dictate" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md border border-border bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-600 group-hover:text-slate-900 font-bold",
								children: phase === "recording" ? "ACTIVE" : "SPACE"
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-center justify-center gap-3 w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center justify-center rounded-xl border border-border bg-slate-50 p-1 shadow-inner gap-1",
						children: [
							{
								id: "direct",
								label: "Direct Dictation",
								icon: null
							},
							{
								id: "smart",
								label: "Smart Expansion",
								icon: Sparkles
							},
							{
								id: "smart_qa",
								label: "Smart Q&A (Layer 4)",
								icon: Layers
							},
							{
								id: "pilot",
								label: "Screen Pilot (L7/8)",
								icon: Eye
							}
						].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setMode(m.id);
								setPhase("idle");
								setTyped("");
								setShowSmartQA(false);
								setShowApprovalCard(false);
							},
							className: `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${mode === m.id ? "border border-border bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`,
							children: [m.icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(m.icon, { className: "h-3.5 w-3.5 text-primary shrink-0" }), mode === m.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShinyText, {
								text: m.label,
								speed: 2.5,
								color: "#0f172a",
								shineColor: "#ff6b00"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.label })]
						}, m.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-1.5 rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1.5 font-mono text-[10px] text-emerald font-semibold whitespace-nowrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald animate-pulse shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Zero-Backspace Rule Active" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContextInspector, {
				isOpen: isInspectorOpen,
				onClose: () => setIsInspectorOpen(false),
				activeApp: currentSample.process,
				activeWindow: currentSample.filename
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtoExplorerModal, {
				isOpen: isUtoOpen,
				onClose: () => setIsUtoOpen(false)
			})
		]
	});
}
var PERSONAS = [
	{
		id: "alex",
		name: "Alex Chen",
		role: "Senior Full-Stack Engineer",
		category: "AI Coding in Cursor Composer",
		icon: CodeXml,
		environment: "Cursor, VS Code, Windows Terminal",
		hardware: "Mechanical Keyboard, Windows 11 Dev Box",
		spokenRaw: "Refactor this auth middleware to check for bearer tokens in the authorization header and return a four zero one if missing.",
		polishedResult: "Refactor this auth middleware to check for bearer tokens in the Authorization header and return a 401 if missing.",
		metrics: [
			{
				label: "Target App",
				value: "Cursor Composer"
			},
			{
				label: "Latency",
				value: "172ms"
			},
			{
				label: "Focus Preserved",
				value: "100%"
			}
		],
		quote: "I formulate complex code prompts at 180 WPM without ever touching the mouse or losing my cursor in Composer."
	},
	{
		id: "elena",
		name: "Elena Rostova",
		role: "Co-Founder & CEO",
		category: "Executive Message Triage",
		icon: Briefcase,
		environment: "Slack, Gmail, Superhuman, Notion",
		hardware: "Dell XPS 13, AirPods",
		spokenRaw: "Hey team, um, let's reschedule our product review to, uh, tomorrow at three PM instead of four because investor call ran late, thanks!",
		polishedResult: "Hey team, let's reschedule our product review to tomorrow at 3:00 PM instead of 4:00 PM because investor call ran late, thanks!",
		metrics: [
			{
				label: "Target App",
				value: "Slack Desktop"
			},
			{
				label: "Fillers Stripped",
				value: "100% ('um', 'uh')"
			},
			{
				label: "Time Saved",
				value: "45 min/day"
			}
		],
		quote: "All my spoken rambling and restarts disappear instantly. My Slack replies look like I sat and drafted them for minutes."
	},
	{
		id: "marcus",
		name: "Marcus Vance",
		role: "DevRel Lead & Tech Author",
		category: "Long-Form Technical Writing",
		icon: PenTool,
		environment: "Obsidian, Notion, Substack",
		hardware: "USB Studio Microphone, Windows 11",
		spokenRaw: "Modern AI infrastructure requires sub-second streaming pipelines. [pause 4s] By moving inference directly to client hardware, we eliminate round-trip network variance.",
		polishedResult: "Modern AI infrastructure requires sub-second streaming pipelines. By moving inference directly to client hardware, we eliminate round-trip network variance.",
		metrics: [
			{
				label: "Target App",
				value: "Obsidian Vault"
			},
			{
				label: "Silence Hallucinations",
				value: "0"
			},
			{
				label: "Mode",
				value: "Persistent Hands-Free"
			}
		],
		quote: "Persistent Mode lets me pace my room and talk through architectural essays. Pauses don't cause Whisper repetition loops."
	},
	{
		id: "maya",
		name: "Maya Patel",
		role: "Senior Data Analyst",
		category: "RSI & Ergonomic Voice Control",
		icon: Activity,
		environment: "Excel, PowerBI, Jupyter",
		hardware: "Ergonomic Split Keyboard, Rebound to F8",
		spokenRaw: "Calculate quarterly growth rate by dividing fourth quarter revenue by first quarter revenue minus one and format as percentage.",
		polishedResult: "=(Q4_Revenue / Q1_Revenue) - 1",
		metrics: [
			{
				label: "Target App",
				value: "Microsoft Excel"
			},
			{
				label: "Typing Replaced",
				value: "85%"
			},
			{
				label: "Trigger Reliability",
				value: "100% (50/50 runs)"
			}
		],
		quote: "Severe wrist tendonitis made typing agony. Remapping VESPER to my F8 key saved my engineering career."
	},
	{
		id: "david",
		name: "David Miller",
		role: "Legal Counsel & Compliance Director",
		category: "Air-Gapped Enterprise Privacy",
		icon: ShieldCheck,
		environment: "Microsoft Word, Outlook, Adobe Acrobat",
		hardware: "Corporate Locked Laptop, VPN",
		spokenRaw: "The recipient shall not disclose proprietary algorithmic weights to any third party without explicit prior written authorization.",
		polishedResult: "The Recipient shall not disclose proprietary algorithmic weights to any third party without explicit prior written authorization.",
		metrics: [
			{
				label: "Egress Packets",
				value: "0 bytes"
			},
			{
				label: "Engine",
				value: "Local INT8 ONNX"
			},
			{
				label: "Compliance",
				value: "HIPAA / SOC2"
			}
		],
		quote: "Our security audit confirmed zero outbound packets in Local Mode. We can dictate confidential legal clauses safely."
	}
];
function Personas() {
	const [activeId, setActiveId] = (0, import_react.useState)("alex");
	const active = PERSONAS.find((p) => p.id === activeId) || PERSONAS[0];
	const Icon = active.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "workflows",
		className: "mx-auto max-w-6xl scroll-mt-20 px-5 py-28 relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center sm:text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 rounded-full border border-titanium-border bg-titanium-elevated px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-titanium-silver",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Validated User Ergonomics" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-3xl font-semibold tracking-[-0.03em] text-stark sm:text-4xl",
						children: "Engineered for high-frequency daily workflows."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-titanium-silver max-w-2xl",
						children: "Not generic speech-to-text. Tested and certified across 5 acute jobs-to-be-done with the Zero-Backspace Rule."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 flex flex-wrap gap-2.5",
				children: PERSONAS.map((p) => {
					const isSelected = p.id === activeId;
					const PillIcon = p.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveId(p.id),
						className: `flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all ${isSelected ? "border-emerald/50 bg-emerald/10 text-emerald shadow-sm" : "border-titanium-border bg-titanium text-titanium-silver hover:border-titanium-silver/40 hover:text-stark"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillIcon, { className: "h-3.5 w-3.5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "hidden sm:inline text-[10px] opacity-70",
								children: [
									"(",
									p.role.split(" ")[0],
									")"
								]
							})
						]
					}, p.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightCard, {
					spotlightColor: "rgba(16, 185, 129, 0.12)",
					className: "rounded-2xl border border-titanium-border bg-titanium/90 p-6 sm:p-9 shadow-2xl backdrop-blur-xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-8 lg:grid-cols-12 items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:col-span-5 space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald/10 text-emerald border border-emerald/30",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-base font-bold text-stark",
											children: active.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-titanium-silver",
											children: active.role
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-1 inline-block rounded-md border border-titanium-border bg-titanium-elevated px-2 py-0.5 font-mono text-[10px] text-emerald",
											children: active.category
										})
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
									className: "rounded-xl border border-titanium-border/70 bg-titanium-elevated/60 p-4 text-xs italic leading-relaxed text-stark/90",
									children: [
										"\"",
										active.quote,
										"\""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 text-xs text-titanium-silver",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[10px] uppercase text-titanium-silver/70",
										children: "Primary Tools:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-stark/90 font-medium",
										children: active.environment
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[10px] uppercase text-titanium-silver/70",
										children: "Hardware Setup:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-stark/90 font-medium",
										children: active.hardware
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-3 gap-2.5 border-t border-titanium-border/60 pt-4",
									children: active.metrics.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg bg-titanium-elevated p-2 text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block font-mono text-[9px] uppercase text-titanium-silver/70 truncate",
											children: m.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-0.5 block font-mono text-xs font-bold text-emerald truncate",
											children: m.value
										})]
									}, m.label))
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:col-span-7 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-titanium-border bg-obsidian p-4 sm:p-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between pb-2 border-b border-titanium-border/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-3.5 w-3.5 text-titanium-silver" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-[11px] font-semibold text-titanium-silver uppercase",
												children: "Raw Spoken Audio Input"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono text-amber-400/80",
											children: "With verbal pauses & missteps"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-3 text-xs leading-relaxed text-titanium-silver/80 font-mono italic",
										children: [
											"\"",
											active.spokenRaw,
											"\""
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1 font-mono text-[10px] text-emerald",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "VESPER Deterministic Polish & Caret Injection" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-emerald/40 bg-titanium-elevated p-4 sm:p-5 shadow-lg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between pb-2 border-b border-titanium-border/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-[11px] font-semibold text-stark uppercase",
												children: "Target Caret Output (Zero Backspace)"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded bg-emerald/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald",
											children: "Sub-180ms"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-sm leading-relaxed text-stark font-medium",
										children: active.polishedResult
									})]
								})
							]
						})]
					})
				})
			})
		]
	});
}
function BentoCard({ icon: Icon, badge, title, children, className = "", spotlightColor = "rgba(16, 185, 129, 0.12)" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpotlightCard, {
		spotlightColor,
		className: `group relative overflow-hidden rounded-xl border border-titanium-border bg-titanium p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-titanium-border/80 hover:bg-titanium-elevated hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)] ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-9 w-9 items-center justify-center rounded-lg border border-titanium-border bg-titanium-elevated transition-colors group-hover:border-emerald/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4.5 w-4.5 text-emerald" })
				}), badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-md border border-titanium-border bg-obsidian px-2.5 py-0.5 font-mono text-[10px] text-titanium-silver",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShinyText, {
						text: badge,
						speed: 3,
						color: "#8e8e9f",
						shineColor: "#ff6b00"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 text-base font-semibold tracking-tight text-stark",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2.5 space-y-2 text-sm leading-relaxed text-titanium-silver",
				children
			})
		]
	});
}
var PIPELINE_STEPS = [
	{
		step: "01",
		title: "Low-Level Hardware Hook",
		component: "WinKeyServer.exe",
		desc: "C++ raw Windows keyboard hook intercepts VK_MENU Right/Left Alt with <1ms timing.",
		color: "#ff6b00"
	},
	{
		step: "02",
		title: "Silero VAD & Stream Chunking",
		component: "16kHz In-Memory PCM",
		desc: "On-device speech boundary detection; zero background noise leakage into audio buffer.",
		color: "#f59e0b"
	},
	{
		step: "03",
		title: "Sub-180ms Neural Inference",
		component: "Whisper-large-v3 Pipeline",
		desc: "Greedy beam-free decoding runs in <180ms on specialized neural hardware with 0 cloud retention.",
		color: "#ff8533"
	},
	{
		step: "04",
		title: "Win32 Caret Injection",
		component: "AttachThreadInput API",
		desc: "Native SendInput writes text directly into the foreground window without stealing focus.",
		color: "#ff6b00"
	}
];
function Capabilities({ onOpenArchitectureModal, onOpenContextInspector, onOpenUtoModal } = {}) {
	const [activeStep, setActiveStep] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "pipeline",
		className: "mx-auto max-w-6xl scroll-mt-20 px-5 py-28",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center sm:text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 rounded-full border border-titanium-border bg-titanium-elevated px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-titanium-silver",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "h-3 w-3 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "8-Layer System Architecture" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 max-w-2xl text-3xl font-bold tracking-[-0.03em] text-stark sm:text-4xl",
						children: "Engineered as a native Windows power-tool. Not another browser wrapper."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2.5 max-w-xl text-sm text-titanium-silver",
						children: "Discover how VESPER achieves sub-220ms end-to-end voice-to-action execution while guaranteeing zero window focus loss."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 rounded-2xl border border-titanium-border bg-titanium p-6 shadow-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between border-b border-titanium-border pb-4 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs font-semibold uppercase tracking-wider text-stark",
							children: "End-to-End Latency Waterfall (<220ms Total)"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [onOpenArchitectureModal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onOpenArchitectureModal,
							className: "inline-flex items-center gap-1.5 rounded-lg border border-emerald/40 bg-emerald/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-emerald hover:bg-emerald/20 transition-all cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Inspect MCP Schemas" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[11px] text-titanium-silver",
							children: "Click steps to inspect mechanics"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
					children: PIPELINE_STEPS.map((s, idx) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveStep(idx),
							className: `relative flex flex-col text-left p-4 rounded-xl border transition-all duration-200 ${activeStep === idx ? "border-emerald/60 bg-titanium-elevated shadow-[0_0_24px_rgba(16,185,129,0.15)] ring-1 ring-emerald/30" : "border-titanium-border bg-obsidian hover:border-titanium-silver/40 hover:bg-titanium"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs font-bold text-emerald",
										children: s.step
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded bg-titanium border border-titanium-border px-1.5 py-0.5 font-mono text-[9px] text-titanium-silver",
										children: s.component
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "mt-3 text-sm font-semibold text-stark",
									children: s.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-xs text-titanium-silver leading-relaxed",
									children: s.desc
								})
							]
						}, s.step);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BorderGlow, {
							borderRadius: 12,
							glowColor: "255 107 0",
							glowRadius: 20,
							glowIntensity: .5,
							colors: ["#ff6b00", "#ea580c"],
							className: "w-full h-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-6 bg-titanium rounded-xl h-full flex flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-9 w-9 items-center justify-center rounded-lg border border-titanium-border bg-titanium-elevated",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-4.5 w-4.5 text-emerald" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-md border border-titanium-border bg-obsidian px-2.5 py-0.5 font-mono text-[10px] text-titanium-silver",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShinyText, {
												text: "Native Win32 Hook",
												speed: 2.5,
												color: "#ff6b00",
												shineColor: "#ffffff"
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-4 text-base font-semibold tracking-tight text-stark",
										children: "Hold-to-Talk: Sub-180ms Trigger"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2.5 space-y-2 text-sm leading-relaxed text-titanium-silver",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											"Press and hold ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "kbd font-mono text-stark",
												children: "Right Alt"
											}),
											" (or",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "kbd font-mono text-stark",
												children: "F8"
											}),
											" /",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "kbd font-mono text-stark",
												children: "Fn"
											}),
											") for ≥180ms. The non-activating obsidian capsule floats at the top without stealing window focus."
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Release the key to transcribe via the high-speed neural engine and paste directly at your exact cursor position across any active Windows application." })]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-6 flex flex-wrap gap-2 pt-3 border-t border-titanium-border",
									children: [
										"Cursor Composer",
										"VS Code",
										"Google Chrome",
										"Slack Desktop",
										"Microsoft Excel",
										"Obsidian Vault",
										"Windows Terminal"
									].map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-md border border-titanium-border bg-obsidian px-2 py-0.5 font-mono text-[10px] text-titanium-silver hover:text-emerald hover:border-emerald/30 transition-colors",
										children: app
									}, app))
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
						icon: Network,
						badge: "Port 32123",
						title: "VESPER Context Protocol MCP Server",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "VESPER runs an embedded Model Context Protocol (MCP) server. External AI agents in Cursor, Claude Code, Windsurf, and Antigravity can directly query active desktop memory." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 rounded-lg border border-titanium-border bg-obsidian p-2.5 font-mono text-[11px] text-emerald",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "http://127.0.0.1:32123/mcp" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-titanium-silver pt-1",
								children: [
									"Exposes ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "search_user_context" }),
									" and ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "get_active_screen_context" }),
									" with zero cloud transmission."
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
						icon: Zap,
						badge: "380ms Window",
						title: "Double-Tap Persistent Mode",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Double-tap ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kbd font-mono text-stark",
								children: "Right Alt"
							}),
							" within 380ms to lock the HUD open for long-form dictation, meetings, or multi-step prompt drafting."
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Features interactive on-screen controls for ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-stark",
								children: "Record"
							}),
							",",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-stark",
								children: "Pause / Resume"
							}),
							",",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-stark",
								children: "Stop & Insert"
							}),
							", and",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-stark",
								children: "Discard"
							}),
							"."
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BentoCard, {
						icon: Target,
						badge: "Dual Pipeline",
						title: "Direct Dictation vs. Smart Copilot",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-titanium-border bg-obsidian p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] font-semibold text-emerald",
									children: "DIRECT MODE (VERBATIM)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-titanium-silver",
									children: "Pure verbatim transcription with strict capitalization, punctuation, and code formatting. Zero hallucinations."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-titanium-border bg-obsidian p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] font-semibold text-emerald",
									children: "SMART COPILOT MODE"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-titanium-silver",
									children: "Contextual prompt engineering designed specifically for Claude 3.7, ChatGPT, and Cursor Composer workflows."
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
						icon: ScanEye,
						badge: "Strict HITL Gate",
						title: "Autonomous Screen Copilot & Safety",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Multimodal visual inspection of active windows via low-latency native screen capture." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-amber-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] font-semibold",
									children: "HUMAN-IN-THE-LOOP SAFETY GATE"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-titanium-silver",
								children: [
									"Actions with external side effects require explicit approval: press",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "kbd font-mono text-xs text-stark",
										children: "Enter"
									}),
									" to execute or",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "kbd font-mono text-xs text-stark",
										children: "Esc"
									}),
									" to reject."
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
						icon: Cpu,
						badge: "DirectML & CUDA",
						title: "Hardware Acceleration (Jensen's Law)",
						className: "lg:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Co-designed for modern AI PC silicon. Operates on dedicated NVIDIA RTX Tensor Cores, Intel Core Ultra NPUs, or AMD Ryzen AI via DirectML execution providers." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Runs quantized INT8 models under 60 MB RAM with less than 1W background power, keeping laptop thermals whisper-quiet." })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-wrap items-center justify-center gap-3",
				children: [
					onOpenArchitectureModal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onOpenArchitectureModal,
						className: "inline-flex items-center gap-2 rounded-xl border border-titanium-border bg-titanium-elevated px-5 py-3 font-mono text-xs font-semibold text-stark transition-all hover:border-emerald/50 hover:bg-titanium-border active:scale-[0.99] cursor-pointer shadow-lg",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "h-4 w-4 text-emerald" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open 8-Layer Architecture Modal" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-titanium-silver" })
						]
					}),
					onOpenContextInspector && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onOpenContextInspector,
						className: "inline-flex items-center gap-2 rounded-xl border border-titanium-border bg-titanium px-4 py-3 font-mono text-xs text-stark transition-all hover:border-emerald/50 hover:text-emerald cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanEye, { className: "h-4 w-4 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Context & Privacy Shield (Layer 2)" })]
					}),
					onOpenUtoModal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onOpenUtoModal,
						className: "inline-flex items-center gap-2 rounded-xl border border-titanium-border bg-titanium px-4 py-3 font-mono text-xs text-stark transition-all hover:border-emerald/50 hover:text-emerald cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "h-4 w-4 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Universal Task Object (Layer 5)" })]
					})
				]
			})
		]
	});
}
var SHORTCUT_ROWS = [
	{
		keys: ["Hold", "Right Alt"],
		timing: "≥180ms",
		action: "Push-to-Talk Voice Dictation",
		context: "Transcribes audio on release and pastes directly at active cursor without losing focus."
	},
	{
		keys: ["Double-tap", "Right Alt"],
		timing: "≤380ms",
		action: "Toggle Persistent HUD Capsule",
		context: "Locks the floating capsule open with manual Record, Pause, Stop, and Discard controls."
	},
	{
		keys: [
			"Ctrl",
			"Shift",
			"Space"
		],
		action: "Open / Hide VESPER Flow Dashboard",
		context: "Summons the full workspace overlay, intent history, memory hub, and settings panel."
	},
	{
		keys: ["Esc"],
		action: "Discard Active Recording / Dismiss Prompt",
		context: "Instantly aborts in-progress recording without pasting, or closes active modals."
	},
	{
		keys: [
			"1",
			"2",
			"3"
		],
		action: "Instant Option Disambiguation",
		context: "Selects numbered clarification pills when the AI detects ambiguous instructions."
	}
];
function playKeyClick(enabled) {
	if (!enabled) return;
	try {
		const ctx = new (window.AudioContext || window.webkitAudioContext)();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.frequency.setValueAtTime(620, ctx.currentTime);
		osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + .03);
		gain.gain.setValueAtTime(.04, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .03);
		osc.start();
		osc.stop(ctx.currentTime + .03);
	} catch {}
}
function Shortcuts() {
	const [pressedKey, setPressedKey] = (0, import_react.useState)(null);
	const [lastTiming, setLastTiming] = (0, import_react.useState)("Press any key to test native hook");
	const [soundEnabled, setSoundEnabled] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		try {
			const stored = localStorage.getItem("vesper_sound_fx");
			if (stored !== null) setSoundEnabled(stored === "true");
		} catch (_err) {}
	}, []);
	const toggleSound = () => {
		setSoundEnabled((prev) => {
			const next = !prev;
			try {
				localStorage.setItem("vesper_sound_fx", String(next));
			} catch (_err) {}
			return next;
		});
	};
	(0, import_react.useEffect)(() => {
		let startTime = 0;
		const onDown = (e) => {
			if (["INPUT", "TEXTAREA"].includes(e.target?.tagName)) return;
			if (!startTime) startTime = performance.now();
			const code = e.code === "AltRight" ? "Right Alt" : e.code === "Space" ? "Space" : e.key;
			setPressedKey(code);
			playKeyClick(soundEnabled);
		};
		const onUp = (e) => {
			if (["INPUT", "TEXTAREA"].includes(e.target?.tagName)) return;
			const duration = startTime ? Math.round(performance.now() - startTime) : 0;
			startTime = 0;
			setPressedKey(null);
			if (duration > 0) if (duration >= 180) setLastTiming(`${duration}ms hold : Push-to-Talk Triggered!`);
			else setLastTiming(`${duration}ms tap : (<180ms standard keypress pass-through)`);
		};
		window.addEventListener("keydown", onDown);
		window.addEventListener("keyup", onUp);
		return () => {
			window.removeEventListener("keydown", onDown);
			window.removeEventListener("keyup", onUp);
		};
	}, [soundEnabled]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "shortcuts",
		className: "mx-auto max-w-6xl px-5 py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center sm:text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] tracking-[0.2em] text-titanium-silver",
							children: "KEYBOARD ARCHITECTURE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 text-3xl font-bold tracking-[-0.025em] text-stark sm:text-4xl",
							children: "Global Shortcuts & Hardware Keycap Matrix"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-titanium-silver",
							children: "Zero-delay low-level Win32 hardware hooks. Works across any active window without stealing caret position."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: toggleSound,
					className: "inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-titanium-border bg-titanium px-3 py-1.5 font-mono text-xs text-titanium-silver hover:border-emerald/40 hover:text-stark transition-all",
					title: soundEnabled ? "Disable tactile sound FX" : "Enable tactile sound FX",
					children: soundEnabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-3.5 w-3.5 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sound FX: On" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-3.5 w-3.5 text-zinc-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sound FX: Muted" })] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 rounded-2xl border border-[#262632] bg-[#121217] p-6 shadow-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262632] pb-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, { className: "h-4 w-4 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs font-semibold uppercase tracking-wider text-[#f4f4f7]",
							children: "Live Win32 Virtual Key Tester"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs text-emerald bg-emerald/10 border border-emerald/20 px-2.5 py-1 rounded-md",
						children: lastTiming
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex flex-wrap items-center justify-center gap-3 py-2",
					children: [
						{
							label: "Right Alt",
							hint: "PTT Hold",
							width: "w-28"
						},
						{
							label: "Left Alt",
							hint: "Secondary",
							width: "w-24"
						},
						{
							label: "Space",
							hint: "Simulator",
							width: "w-36"
						},
						{
							label: "Ctrl",
							hint: "Modifier",
							width: "w-20"
						},
						{
							label: "Shift",
							hint: "Modifier",
							width: "w-20"
						},
						{
							label: "Esc",
							hint: "Dismiss",
							width: "w-20"
						},
						{
							label: "F8",
							hint: "Function",
							width: "w-20"
						}
					].map((k) => {
						const isDown = pressedKey?.toLowerCase().includes(k.label.toLowerCase());
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onMouseDown: () => {
								setPressedKey(k.label);
								playKeyClick();
							},
							onMouseUp: () => {
								setPressedKey(null);
								setLastTiming(`Clicked ${k.label} : Low-level simulated hook`);
							},
							className: `relative flex flex-col items-center justify-center ${k.width} h-16 rounded-xl border font-mono transition-all duration-100 select-none ${isDown ? "border-emerald bg-emerald/20 translate-y-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" : "border-[#262632] bg-[#181820] shadow-[0_4px_0_#262632,0_8px_16px_rgba(0,0,0,0.5)] hover:border-[#38384a]"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-xs font-bold ${isDown ? "text-emerald" : "text-[#f4f4f7]"}`,
								children: k.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] text-[#8e8e9f] mt-0.5",
								children: k.hint
							})]
						}, k.label);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightCard, {
				spotlightColor: "rgba(16, 185, 129, 0.12)",
				className: "mt-8 overflow-hidden rounded-xl border border-[#262632] bg-[#121217] shadow-xl backdrop-blur-md p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-[#262632]",
					children: SHORTCUT_ROWS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group flex flex-col gap-4 p-5 transition-colors hover:bg-[#181820] sm:flex-row sm:items-center sm:justify-between sm:px-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [r.keys.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center justify-center rounded-lg border border-[#262632] bg-[#0a0a0c] px-3 py-1.5 font-mono text-xs font-bold text-[#f4f4f7] shadow-sm transition-transform group-hover:border-emerald/40",
								children: k
							}, k)), r.timing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md border border-emerald/20 bg-emerald/10 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald",
								children: r.timing
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:items-end sm:text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold text-[#f4f4f7]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecryptedText, {
									text: r.action,
									speed: 35,
									maxIterations: 8,
									animateOn: "hover",
									className: "text-[#f4f4f7] font-semibold",
									encryptedClassName: "text-emerald font-mono"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 text-xs text-[#8e8e9f]",
								children: r.context
							})]
						})]
					}, r.action))
				})
			})
		]
	});
}
var PLANS = [
	{
		id: "free",
		name: "Free Tier",
		badge: "30m Daily Allowance",
		priceMonthly: "$0",
		priceAnnual: "$0",
		billingPeriod: "daily quota resets at 12:00 AM",
		description: "Essential ambient voice dictation with 30 minutes daily usage limit for individual developers.",
		features: [
			"30 minutes daily voice dictation",
			"Automatic quota reset at 12:00 AM midnight",
			"Silero Voice Activity Detection (VAD)",
			"Win32 zero-focus caret pasting",
			"Sub-5ms on-device vector context search",
			"Local SQLite history & session memory"
		],
		ctaText: "Download Free Installer",
		ctaHref: "#download"
	},
	{
		id: "pro",
		name: "VESPER Pro",
		badge: "Instant License",
		popular: true,
		priceMonthly: "$10",
		priceAnnual: "$8",
		billingPeriod: "per month",
		description: "Unlimited ambient dictation, high-speed Neural LPU pipeline, and priority cloud acceleration.",
		features: [
			"Unlimited daily dictation (no 30m cap)",
			"Sub-180ms ultra-low latency Neural LPU pipeline",
			"Instant license generation & automated key delivery",
			"In-place Selection Transformer (Edit Mode)",
			"Multi-utterance context chaining & memory",
			"Custom vocabulary & voice expansion snippets",
			"Automatic multilingual speech-to-English letters"
		],
		ctaText: "Activate VESPER Pro ($10/mo)",
		ctaHref: "#pricing"
	},
	{
		id: "team",
		name: "Team & Enterprise",
		badge: "Enterprise SLA",
		priceMonthly: "Custom",
		priceAnnual: "Custom",
		billingPeriod: "tailored SLA & seats",
		description: "Dedicated infrastructure, custom fine-tuned Whisper models, centralized team seat management, and zero-retention privacy for engineering teams.",
		features: [
			"Everything in VESPER Pro",
			"Dedicated enterprise Neural LPU & local GPU clusters",
			"Centralized team dictionary synchronization",
			"SOC2 Type II & HIPAA compliant zero-retention",
			"Centralized admin console & license seats",
			"24/7 dedicated support engineer & SLA"
		],
		ctaText: "Contact the Team",
		ctaHref: "#pricing"
	}
];
function Pricing({ onOpenEnterpriseModal } = {}) {
	const [billingCycle, setBillingCycle] = (0, import_react.useState)("annual");
	const [isProModalOpen, setIsProModalOpen] = (0, import_react.useState)(false);
	const [copiedKey, setCopiedKey] = (0, import_react.useState)(false);
	const { user, openAuthModal } = useAuth();
	const handleProClick = () => {
		if (!user) {
			toast.info("Create a free account or sign in to activate your VESPER Pro license.", { description: "Your license key is generated immediately upon registration." });
			openAuthModal();
		} else setIsProModalOpen(true);
	};
	const copyLicense = (key) => {
		navigator.clipboard?.writeText(key);
		setCopiedKey(true);
		toast.success("License key copied to clipboard!");
		setTimeout(() => setCopiedKey(false), 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "pricing",
		className: "mx-auto max-w-6xl scroll-mt-20 px-5 py-28 relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 rounded-full border border-titanium-border bg-titanium-elevated px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-titanium-silver",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3 w-3 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Transparent Unit Economics" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-3xl font-semibold tracking-[-0.03em] text-stark sm:text-4xl",
						children: "Free on-device compute. High-leverage Pro cloud."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-titanium-silver max-w-2xl mx-auto",
						children: "VESPER never holds your local PC hostage. Use unlimited on-device Whisper for zero dollars, or unlock sub-180ms neural cloud speed and VESPER Context Protocol MCP memory."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 inline-flex items-center rounded-xl border border-titanium-border bg-titanium p-1 shadow-inner",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setBillingCycle("monthly"),
							className: `rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${billingCycle === "monthly" ? "bg-titanium-elevated text-stark shadow-sm" : "text-titanium-silver hover:text-stark"}`,
							children: "Monthly"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setBillingCycle("annual"),
							className: `relative flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${billingCycle === "annual" ? "bg-titanium-elevated text-stark shadow-sm" : "text-titanium-silver hover:text-stark"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Annual" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-emerald/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald",
								children: "Save 20%"
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 grid gap-8 lg:grid-cols-3 items-stretch",
				children: PLANS.map((plan) => {
					const isPro = plan.popular;
					const displayPrice = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;
					const cardContent = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-full flex-col justify-between p-6 sm:p-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-mono text-sm font-bold tracking-tight text-stark",
									children: plan.name
								}), plan.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold ${isPro ? "border border-emerald/50 bg-emerald/10 text-emerald" : "border border-titanium-border bg-titanium-elevated text-titanium-silver"}`,
									children: plan.badge
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex items-baseline gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-4xl font-bold tracking-tight text-stark",
									children: displayPrice
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-titanium-silver",
									children: displayPrice === "Custom" ? " — tailored SLA & seats" : `/${plan.billingPeriod}`
								})]
							}),
							isPro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-[11px] text-emerald",
								children: "Or $99 one-time Founder Lifetime Pass"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs leading-relaxed text-titanium-silver",
								children: plan.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 border-t border-titanium-border/60 pt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] font-semibold tracking-wider text-titanium-silver uppercase",
									children: "Included Capabilities"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 space-y-2.5 text-xs text-titanium-silver",
									children: plan.features.map((feat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-start gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 shrink-0 text-emerald mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-stark/90",
											children: feat
										})]
									}, feat))
								})]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 pt-4",
							children: isPro ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnet, {
								padding: 40,
								magnetStrength: 3,
								wrapperClassName: "w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarBorder, {
									as: "button",
									type: "button",
									onClick: handleProClick,
									color: "#ff6b00",
									speed: "3s",
									thickness: 1.5,
									backgroundColor: "#ff6b00",
									textColor: "#ffffff",
									className: "w-full text-xs font-bold shadow-md transition-all hover:opacity-95 cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-center gap-2 py-3 px-4 text-white font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: plan.ctaText }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-white" })]
									})
								})
							}) : plan.id === "team" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									if (onOpenEnterpriseModal) onOpenEnterpriseModal();
									else toast.info("Opening enterprise inquiry channel...");
								},
								className: "flex w-full items-center justify-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-4 py-3 text-xs font-bold text-primary transition-all hover:bg-primary/20 hover:border-primary active:scale-[0.99] cursor-pointer shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Contact the Team" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-primary" })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: plan.ctaHref,
								className: "flex w-full items-center justify-center gap-2 rounded-xl border border-titanium-border bg-titanium-elevated px-4 py-3 text-xs font-semibold text-stark transition-all hover:border-titanium-silver/50 hover:bg-titanium-border active:scale-[0.99]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: plan.ctaText }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-titanium-silver" })]
							})
						})]
					});
					if (isPro) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BorderGlow, {
						borderRadius: 20,
						glowColor: "25 95% 53%",
						glowRadius: 28,
						glowIntensity: .7,
						colors: [
							"#ff6b00",
							"#ff8533",
							"#ea580c"
						],
						className: "h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-2xl bg-titanium border border-titanium-border shadow-2xl",
							children: cardContent
						})
					}, plan.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightCard, {
						spotlightColor: "rgba(255, 255, 255, 0.04)",
						className: "h-full rounded-2xl border border-titanium-border bg-titanium/90 shadow-xl backdrop-blur-xl transition-all hover:border-titanium-border/80",
						children: cardContent
					}, plan.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 rounded-2xl border border-titanium-border bg-titanium-elevated/80 p-6 sm:p-8 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald/10 text-emerald border border-emerald/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-sm font-semibold text-stark",
							children: "Zero Cloud Audio Lock-In Guarantee"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-titanium-silver max-w-xl leading-relaxed",
							children: "Both Free and Pro tiers include complete access to on-device ONNX execution. If you ever cancel Pro, VESPER remains 100% operational on your local machine with zero downtime."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-titanium-silver",
								children: "Hardware Verified:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md border border-titanium-border bg-titanium px-2 py-1 font-mono text-[10px] text-stark",
								children: "RTX CUDA"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md border border-titanium-border bg-titanium px-2 py-1 font-mono text-[10px] text-stark",
								children: "DirectML"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md border border-titanium-border bg-titanium px-2 py-1 font-mono text-[10px] text-stark",
								children: "Intel NPU"
							})
						]
					})]
				})
			}),
			isProModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-md rounded-2xl border border-titanium-border bg-titanium p-6 shadow-2xl text-stark",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setIsProModalOpen(false),
							className: "rounded-lg p-1.5 text-titanium-silver hover:bg-titanium-elevated hover:text-stark transition-colors absolute right-4 top-4",
							"aria-label": "Close modal",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 border-b border-titanium-border pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-xl border border-emerald/40 bg-emerald/10 text-emerald",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-bold text-stark",
								children: "VESPER Pro Subscription"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-titanium-silver",
								children: "Account & Software License Status"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[10px] text-titanium-silver uppercase tracking-wider",
										children: "Assigned Desktop License Key"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1.5 flex items-center justify-between gap-2 rounded-lg border border-titanium-border bg-obsidian px-3 py-2 font-mono text-xs font-semibold text-emerald",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: user?.licenseKey || "VSP-PRO-ACTIVE-KEY"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => copyLicense(user?.licenseKey || "VSP-PRO-ACTIVE-KEY"),
											className: "text-titanium-silver hover:text-stark transition-colors p-1",
											title: "Copy License Key",
											children: copiedKey ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-emerald" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" })
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium-elevated p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-titanium-silver text-[11px]",
											children: "Tier Status"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 font-bold text-stark flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [user?.tier ? user.tier.toUpperCase() : "PRO", " Active"] })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium-elevated p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-titanium-silver text-[11px]",
											children: "Speech Latency"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 font-mono font-bold text-stark",
											children: "<180ms Neural"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-titanium-silver leading-relaxed",
									children: "Your Pro license key is authorized for unlimited on-device dictation and the high-speed Neural LPU pipeline. Paste this key into the desktop client setup gate or inspect guidance below."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/guidance",
										onClick: () => setIsProModalOpen(false),
										className: "flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-orange-600 px-4 py-2.5 text-xs font-bold text-white transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open License Validator" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setIsProModalOpen(false),
										className: "rounded-xl border border-titanium-border bg-titanium-elevated px-4 py-2.5 text-xs font-semibold text-stark hover:bg-titanium-border transition-colors",
										children: "Done"
									})]
								})
							]
						})
					]
				})
			})
		]
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var Accordion = Root2;
var AccordionItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
	className: "flex",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger2, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = Trigger2.displayName;
var AccordionContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = Content2.displayName;
var SHA256_CHECKSUM = "9c2639de9aa7012d3855a2335993c17322258e2bbbc800bbacad16e053f91d7f";
function WindowsIcon({ className = "h-4 w-4" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		className,
		viewBox: "0 0 88 88",
		fill: "currentColor",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M0 12.402l35.687-4.86.016 34.423-35.67.248L0 12.402zm35.67 33.529l.028 34.453L.028 75.48.003 46.179l35.667-.248zM40.97 6.479L87.977 0v41.526l-47.008.377V6.479zm47.037 39.467l-.03 41.602-46.99-6.613-.013-34.612 47.033-.377z" })
	});
}
function DownloadSetup() {
	const [showSha, setShowSha] = (0, import_react.useState)(false);
	const [copiedCode, setCopiedCode] = (0, import_react.useState)(false);
	const [copiedWinget, setCopiedWinget] = (0, import_react.useState)(false);
	const [copiedPowerShell, setCopiedPowerShell] = (0, import_react.useState)(false);
	const [isDownloadModalOpen, setIsDownloadModalOpen] = (0, import_react.useState)(false);
	const copyCode = () => {
		navigator.clipboard?.writeText("# Authorized internal developer access\ncd vesper-desktop\nnpm install\nnpm run dev");
		setCopiedCode(true);
		toast.success("Command copied to clipboard");
		setTimeout(() => setCopiedCode(false), 2e3);
	};
	const copyWinget = () => {
		navigator.clipboard?.writeText("winget install vesper");
		setCopiedWinget(true);
		toast.success("Winget command copied to clipboard!");
		setTimeout(() => setCopiedWinget(false), 2e3);
	};
	const copyPowerShell = () => {
		navigator.clipboard?.writeText("irm https://vesperflow-ai.vercel.app/api/download/windows -OutFile VESPER-Setup.exe; .\\VESPER-Setup.exe");
		setCopiedPowerShell(true);
		toast.success("PowerShell automated install script copied!");
		setTimeout(() => setCopiedPowerShell(false), 2e3);
	};
	const handleDownloadClick = () => {
		setIsDownloadModalOpen(true);
		toast.success("Opening VESPER Download & Verification Center...");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "download",
		className: "mx-auto max-w-6xl scroll-mt-20 px-5 py-24 relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center sm:text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] tracking-[0.2em] text-primary font-semibold",
						children: "DOWNLOAD & ONBOARDING"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-3xl font-semibold tracking-[-0.025em] text-foreground sm:text-4xl",
						children: "Zero-friction setup. Running in under two minutes."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Download the pre-compiled native installer, activate your VESPER subscription license, and begin speaking anywhere in Windows."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-6 lg:grid-cols-[400px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpotlightCard, {
					spotlightColor: "rgba(255, 107, 0, 0.15)",
					className: "flex flex-col justify-between rounded-xl border border-border bg-white p-6 shadow-sm backdrop-blur-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-orange-50 shadow-inner",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WindowsIcon, { className: "h-5 w-5 text-primary" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-semibold text-foreground",
									children: "VESPER for Windows"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary font-semibold",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShinyText, {
										text: "Official Release",
										speed: 2,
										color: "#ff6b00",
										shineColor: "#ffffff"
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[11px] text-muted-foreground",
								children: "~170 MB · Windows 10 & 11 (x64) · Direct Caret Injection"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnet, {
								padding: 40,
								magnetStrength: 3,
								wrapperClassName: "w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: handleDownloadClick,
									className: "w-full focus:outline-none",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarBorder, {
										as: "div",
										color: "#ff6b00",
										speed: "3s",
										thickness: 1.5,
										backgroundColor: "#ff6b00",
										className: "flex w-full items-center justify-center text-sm font-semibold shadow-md transition-all hover:opacity-95 active:scale-[0.98] cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 text-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download VESPER Installer (.exe)" })]
										})
									})
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-border bg-slate-50 px-3 py-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verified Release Package" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] text-primary font-semibold",
								children: "SHA-256 Checksum Verified"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-lg border border-border bg-slate-50 p-3 text-[11px] leading-relaxed text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: "Notice:"
								}),
								" Because this is an unsigned community preview, Windows SmartScreen may show an initial prompt. Click",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground font-semibold underline",
									children: "More info"
								}),
								" >",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground font-semibold underline",
									children: "Run anyway"
								}),
								"."
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 border-t border-border pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setShowSha((v) => !v),
							className: "flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground cursor-pointer",
							children: [showSha ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verify SHA256 Checksum" })]
						}), showSha && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2.5 flex items-start gap-2 rounded-lg border border-border bg-slate-50 p-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "break-all font-mono text-[10px] leading-4 text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecryptedText, {
									text: SHA256_CHECKSUM,
									speed: 25,
									maxIterations: 6,
									animateOn: "view",
									className: "text-primary font-mono font-medium",
									encryptedClassName: "text-muted-foreground font-mono"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									navigator.clipboard?.writeText(SHA256_CHECKSUM);
									toast.success("SHA256 checksum copied to clipboard");
								},
								className: "shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-slate-200 hover:text-foreground cursor-pointer",
								"aria-label": "Copy checksum",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
							})]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightCard, {
					spotlightColor: "rgba(255, 107, 0, 0.12)",
					className: "rounded-xl border border-border bg-white px-6 py-4 shadow-sm backdrop-blur-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Accordion, {
						type: "single",
						collapsible: true,
						defaultValue: "s1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
								value: "s1",
								className: "border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
									className: "text-left text-sm font-medium hover:no-underline py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-semibold text-primary",
											children: "1"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold",
											children: "Activate Your VESPER Subscription License"
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionContent, {
									className: "space-y-3.5 text-sm text-muted-foreground pb-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "VESPER authenticates desktop sessions against your developer subscription license. Sign in with Google or verify your email on this portal to generate your license key." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
											className: "list-decimal space-y-1.5 pl-5 text-xs text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Create your account or sign in using the top navigation bar." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Verify your email address via the 6-digit PIN sent to your inbox." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
													"Copy your assigned license key (format:",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-foreground font-medium",
														children: "VESPER-XXXX-XXXX-XXXX"
													}),
													")."
												] })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "/guidance",
											className: "inline-flex items-center gap-2 rounded-lg border border-border bg-slate-50 px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:border-border hover:bg-slate-100",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open Guidance & License Gate" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5 text-primary" })]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
								value: "s2",
								className: "border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
									className: "text-left text-sm font-medium hover:no-underline py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-semibold text-primary",
											children: "2"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold",
											children: "Enable Windows Microphone Permissions"
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionContent, {
									className: "space-y-2.5 text-sm text-muted-foreground pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Ensure Windows grants desktop apps permission to access your microphone:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-lg border border-border bg-slate-50 p-3 font-mono text-xs text-muted-foreground",
										children: "Settings > Privacy & security > Microphone > Allow desktop apps to access your microphone (ON)"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
								value: "s3",
								className: "border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
									className: "text-left text-sm font-medium hover:no-underline py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-semibold text-primary",
											children: "3"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold",
											children: "Launch VESPER & Paste Your License Key"
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionContent, {
									className: "space-y-3 text-sm text-muted-foreground pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Run the installer or click the desktop shortcut." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "list-disc space-y-1 pl-5 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
												"Press",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "kbd font-mono text-[11px] text-foreground bg-slate-100 border border-slate-300 px-1 py-0.5 rounded",
													children: "Ctrl + Shift + Space"
												}),
												" ",
												"(or click the system tray icon) to open the VESPER Flow Dashboard."
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
												"Navigate to Settings, paste your",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-foreground font-medium",
													children: "VESPER_LICENSE_KEY"
												}),
												", and pick your preferred mode (Direct Dictation or Smart Copilot)."
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
												"Click ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-foreground font-medium",
													children: "Save Settings"
												}),
												": you are now ready to hold",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "kbd font-mono text-[11px] text-foreground bg-slate-100 border border-slate-300 px-1 py-0.5 rounded",
													children: "F8"
												}),
												" and speak anywhere!"
											] })
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
								value: "s4",
								className: "border-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
									className: "text-left text-sm font-medium hover:no-underline py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 font-mono text-[10px] font-semibold text-slate-700",
											children: "4"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-semibold",
											children: "Private Developer Setup (Authorized Contributors)"
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionContent, {
									className: "space-y-3 text-sm text-muted-foreground pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs",
										children: "Source code repositories are private. Authorized contributors with organization access can run and test locally:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative rounded-lg border border-border bg-slate-50 p-3 font-mono text-xs text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: copyCode,
											className: "absolute right-2.5 top-2.5 rounded p-1 text-muted-foreground transition-colors hover:bg-slate-200 hover:text-foreground cursor-pointer",
											title: "Copy commands",
											children: copiedCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
											className: "overflow-x-auto text-[11px] leading-5",
											children: `# Authorized internal developer access\ncd vesper-desktop\nnpm install\nnpm run dev`
										})]
									})]
								})]
							})
						]
					})
				})]
			}),
			isDownloadModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "dialog",
				"aria-modal": "true",
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md",
				onClick: () => setIsDownloadModalOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-xl rounded-2xl border border-border bg-white shadow-2xl p-6 sm:p-7 text-foreground",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-4 border-b border-border pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WindowsIcon, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-bold text-foreground",
										children: "VESPER Installation Center"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 font-mono text-[10px] font-semibold",
										children: "v1.0.0 Stable"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Native Windows 10 & 11 (64-bit) · Low-latency Win32 caret injection"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsDownloadModalOpen(false),
								className: "rounded-lg p-1.5 text-muted-foreground hover:bg-slate-100 hover:text-foreground transition-colors cursor-pointer",
								"aria-label": "Close modal",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-xl border border-border bg-slate-50/70 p-4 transition-all hover:border-primary/40",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-primary",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-semibold text-foreground",
												children: "Direct Installer (.exe)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-mono text-[11px] text-muted-foreground",
												children: "VESPER-Setup-1.0.0.exe · ~170 MB · Standard NSIS"
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "/api/download/windows",
											download: "VESPER-Flow-Setup.exe",
											onClick: () => {
												toast.success("Starting download of VESPER-Setup-1.0.0.exe...");
											},
											className: "inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-orange-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-[0.98]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download" })]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-slate-50/70 p-4 transition-all hover:border-primary/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3 mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-semibold text-foreground",
												children: "Windows Package Manager (winget)"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] text-muted-foreground",
											children: "Recommended for CLI"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2 font-mono text-xs text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: "winget install vesper"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: copyWinget,
											className: "shrink-0 rounded p-1 text-muted-foreground hover:bg-slate-100 hover:text-foreground transition-colors cursor-pointer",
											title: "Copy command",
											children: copiedWinget ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-slate-50/70 p-4 transition-all hover:border-primary/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3 mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-semibold text-foreground",
												children: "PowerShell One-Liner Install"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] text-muted-foreground",
											children: "Auto-fetch & run"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2 font-mono text-[11px] text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-slate-600",
											children: "irm .../api/download/windows -OutFile ..."
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: copyPowerShell,
											className: "shrink-0 rounded p-1 text-muted-foreground hover:bg-slate-100 hover:text-foreground transition-colors cursor-pointer",
											title: "Copy PowerShell script",
											children: copiedPowerShell ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-xl border border-border bg-orange-50/50 p-3.5 text-xs text-slate-700 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold text-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Windows SmartScreen Note" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] leading-relaxed text-muted-foreground",
								children: [
									"Because VESPER installs low-level Win32 keyboard hooks for zero-focus text injection, Windows SmartScreen may show an initial prompt on unsigned previews. Simply click ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: "More info > Run anyway"
									}),
									"."
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex items-center justify-between gap-3 border-t border-border pt-4 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "/guidance",
								className: "inline-flex items-center gap-1.5 font-medium text-primary hover:text-orange-700 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "h-3.5 w-3.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Validate License Key in Guidance" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsDownloadModalOpen(false),
								className: "rounded-lg border border-border bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-800 transition-colors cursor-pointer",
								children: "Close"
							})]
						})
					]
				})
			})
		]
	});
}
var PHASES = [
	{
		tag: "PHASE 1: CURRENT",
		badge: "Production v1.0 Active",
		state: "live",
		title: "Windows Native Push-to-Talk & Context Engine",
		description: "Full native Windows client with sub-180ms neural speech pipeline transcription, zero-focus cursor pasting, and direct verbatim dictation.",
		features: [
			"Hardware-hooked Right Alt via WinKeyServer.exe",
			"Win32 foreground window and caret preservation",
			"Direct Dictation and Smart Copilot prompt modes",
			"Human-in-the-Loop safety approval system"
		]
	},
	{
		tag: "PHASE 2: UPCOMING",
		badge: "In Active Build",
		state: "building",
		title: "Air-Gapped On-Device Whisper (ONNX + Transformers)",
		description: "Zero internet connection required. Run compact Whisper models entirely on local GPU and NPU hardware with INT8 quantized weights.",
		features: [
			"Local ONNX Runtime engine execution",
			"NVIDIA TensorRT and Intel NPU acceleration",
			"Zero egress network guarantees for classified workflows",
			"Local vector semantic index for clipboard memory"
		]
	},
	{
		tag: "PHASE 3",
		badge: "Planned",
		state: "planned",
		title: "macOS & Linux Companion Architecture",
		description: "Cross-platform parity with global accessibility hooks, native Wayland/X11 support, and per-app prompt templates.",
		features: [
			"macOS Apple Silicon (Metal) native binary",
			"Application-specific prompt presets (Cursor, Slack, Word)",
			"Global multi-monitor capsule positioning",
			"Unified local telemetry and history sync"
		]
	},
	{
		tag: "PHASE 4",
		badge: "Architecture Roadmap",
		state: "planned",
		title: "Team Dictionary & Enterprise Vocabulary Sync",
		description: "Collaborative domain dictionaries for engineering organizations, medical terminology, and proprietary codebase symbols.",
		features: [
			"Real-time synchronized custom vocabulary",
			"Enterprise audit logging and compliance verification",
			"Self-hosted team dictionary relays",
			"Role-based access controls for corporate deployments"
		]
	}
];
function Roadmap() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "roadmap",
		className: "mx-auto max-w-6xl scroll-mt-20 px-5 py-28 relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center sm:text-left",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "inline-flex items-center gap-2 rounded-full border border-titanium-border bg-titanium-elevated px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-titanium-silver",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Product Trajectory" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 text-3xl font-semibold tracking-[-0.03em] text-stark sm:text-4xl",
					children: "Engineered for privacy. Built for speed."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-titanium-silver max-w-2xl",
					children: "From today's live Windows MVP to a 100% air-gapped, offline ambient intelligence platform."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-16 relative border-l border-titanium-border pl-6 sm:pl-10 ml-2 sm:ml-4 space-y-12",
			children: PHASES.map((p) => {
				const isLive = p.state === "live";
				const isBuilding = p.state === "building";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `absolute -left-[31px] sm:-left-[47px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border bg-obsidian transition-transform group-hover:scale-125 ${isLive ? "border-emerald/50 shadow-[0_0_12px_rgba(16,185,129,0.4)]" : isBuilding ? "border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]" : "border-titanium-border"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-2 w-2 rounded-full ${isLive ? "bg-emerald animate-pulse" : isBuilding ? "bg-amber-400" : "bg-titanium-silver/40"}` })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpotlightCard, {
						spotlightColor: isLive ? "rgba(16, 185, 129, 0.14)" : isBuilding ? "rgba(245, 158, 11, 0.12)" : "rgba(255, 255, 255, 0.04)",
						className: "rounded-2xl border border-titanium-border bg-titanium/90 p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-titanium-border/80",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] font-semibold tracking-[0.16em] text-titanium-silver",
									children: p.tag
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium ${isLive ? "border-emerald/40 bg-emerald/10 text-emerald" : isBuilding ? "border-amber-400/40 bg-amber-400/10 text-amber-300" : "border-titanium-border bg-titanium-elevated text-titanium-silver"}`,
									children: isLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShinyText, {
										text: p.badge,
										speed: 2,
										color: "#ff6b00",
										shineColor: "#ffffff"
									}) : isBuilding ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-2.5 w-2.5 text-amber-400 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.badge })]
									}) : p.badge
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 text-lg font-semibold text-stark tracking-tight",
								children: p.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-sm leading-relaxed text-titanium-silver",
								children: p.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 grid gap-2.5 pt-4 border-t border-titanium-border/60 sm:grid-cols-2",
								children: p.features.map((feat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 text-xs text-titanium-silver",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: `h-3.5 w-3.5 shrink-0 ${isLive ? "text-emerald" : isBuilding ? "text-amber-400" : "text-titanium-silver/60"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-stark/90",
										children: feat
									})]
								}, feat))
							})
						]
					})]
				}, p.tag);
			})
		})]
	});
}
function ExcelWaitlistModal({ isOpen, onClose, submissions, onClear }) {
	const [search, setSearch] = (0, import_react.useState)("");
	const [roleFilter, setRoleFilter] = (0, import_react.useState)("All");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const filtered = (0, import_react.useMemo)(() => {
		return submissions.filter((sub) => {
			const matchRole = roleFilter === "All" || sub.useCase === roleFilter;
			const q = search.toLowerCase();
			const matchSearch = !q || sub.name.toLowerCase().includes(q) || sub.email.toLowerCase().includes(q) || sub.useCase.toLowerCase().includes(q) || sub.platforms.some((p) => p.toLowerCase().includes(q)) || sub.hardware && sub.hardware.toLowerCase().includes(q);
			return matchRole && matchSearch;
		});
	}, [
		submissions,
		search,
		roleFilter
	]);
	const handleExportCSV = () => {
		if (submissions.length === 0) {
			toast.error("No waitlist submissions to export.");
			return;
		}
		const headers = [
			"Ticket ID",
			"Timestamp",
			"Full Name",
			"Email Address",
			"Role / Use Case",
			"Target Platforms",
			"Hardware / GPU",
			"Status"
		];
		const rows = submissions.map((s) => [
			`"#${s.position}"`,
			`"${s.timestamp}"`,
			`"${s.name.replace(/"/g, "\"\"")}"`,
			`"${s.email.replace(/"/g, "\"\"")}"`,
			`"${s.useCase.replace(/"/g, "\"\"")}"`,
			`"${s.platforms.join("; ").replace(/"/g, "\"\"")}"`,
			`"${(s.hardware || "Unspecified").replace(/"/g, "\"\"")}"`,
			`"${s.status || "Priority Confirmed"}"`
		]);
		const csvContent = "﻿" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", `VESPER_Waitlist_Leads_${Date.now()}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		toast.success("Excel Spreadsheet exported successfully!", { description: `Downloaded ${submissions.length} rows as CSV.` });
	};
	const handleCopyCSV = () => {
		if (submissions.length === 0) return;
		const headers = [
			"Ticket",
			"Date",
			"Name",
			"Email",
			"Role",
			"Platforms",
			"Hardware",
			"Status"
		];
		const rows = submissions.map((s) => [
			`#${s.position}`,
			s.timestamp,
			s.name,
			s.email,
			s.useCase,
			s.platforms.join("; "),
			s.hardware || "Auto",
			s.status || "Confirmed"
		].join("	"));
		const tsv = [headers.join("	"), ...rows].join("\n");
		navigator.clipboard.writeText(tsv);
		setCopied(true);
		toast.success("Table copied to clipboard (Tab-delimited for Excel paste)");
		setTimeout(() => setCopied(false), 2e3);
	};
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-obsidian/90 p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex max-h-[92vh] w-full max-w-5xl flex-col rounded-2xl border border-titanium-border bg-titanium text-stark shadow-2xl overflow-hidden font-sans",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-titanium-border bg-titanium-elevated px-4 py-3 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-8 w-8 items-center justify-center rounded-lg bg-[#107c41]/20 border border-[#107c41]/40 text-[#107c41]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold tracking-tight text-stark",
								children: "VESPER_Waitlist_Submissions.xlsx"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md border border-[#107c41]/30 bg-[#107c41]/10 px-2 py-0.5 font-mono text-[10px] text-[#107c41] font-semibold",
								children: "EXCEL TABLE"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-titanium-silver font-mono",
							children: [
								"Live Submissions Database: ",
								submissions.length,
								" Total Records"
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleExportCSV,
							className: "flex items-center gap-1.5 rounded-lg border border-emerald/50 bg-emerald/10 px-3 py-1.5 text-xs font-semibold text-emerald transition-all hover:bg-emerald/20 hover:border-emerald active:scale-[0.98]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Export to Excel (.csv)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sm:hidden",
									children: "Export"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onClose,
							"aria-label": "Close modal",
							className: "rounded-lg border border-titanium-border p-1.5 text-titanium-silver transition-colors hover:text-stark hover:bg-titanium-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 border-b border-titanium-border/80 bg-titanium px-4 py-2.5 sm:px-6 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 h-3.5 w-3.5 text-titanium-silver pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: search,
								onChange: (e) => setSearch(e.target.value),
								placeholder: "Search leads...",
								className: "h-8 w-44 sm:w-60 rounded-lg border border-titanium-border bg-titanium-elevated pl-8 pr-3 text-xs text-stark outline-none transition-all placeholder:text-titanium-silver/40 focus:border-emerald focus:ring-1 focus:ring-emerald"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3.5 w-3.5 text-titanium-silver" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: roleFilter,
								onChange: (e) => setRoleFilter(e.target.value),
								className: "h-8 rounded-lg border border-titanium-border bg-titanium-elevated px-2.5 text-xs text-stark outline-none focus:border-emerald",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "All",
										children: "All Roles"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Developer / Engineer",
										children: "Developers"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Writer / Creator",
										children: "Writers"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Founder / Exec",
										children: "Founders"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Customer Support",
										children: "Support"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Other",
										children: "Other"
									})
								]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleCopyCSV,
							className: "flex items-center gap-1 rounded-md border border-titanium-border px-2.5 py-1 text-xs text-titanium-silver hover:text-stark hover:bg-titanium-elevated transition-colors",
							title: "Copy table data to paste directly into Excel or Sheets",
							children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-emerald" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copied ? "Copied" : "Copy TSV" })]
						}), submissions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onClear,
							className: "flex items-center gap-1 rounded-md border border-titanium-border px-2.5 py-1 text-xs text-titanium-silver hover:text-red-400 hover:border-red-400/40 transition-colors",
							title: "Clear all stored waitlist entries",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Clear" })]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-auto bg-obsidian",
					children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center py-16 text-center px-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-titanium-elevated border border-titanium-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, { className: "h-6 w-6 text-titanium-silver" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "mt-3 text-sm font-semibold text-stark",
								children: "No submissions found"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-titanium-silver max-w-sm",
								children: search || roleFilter !== "All" ? "Try adjusting your search query or role filter." : "Submit the waitlist form on the website to see your entries populate this Excel spreadsheet in real time."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full border-collapse text-left font-mono text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "sticky top-0 z-10 border-b border-titanium-border bg-titanium-elevated text-titanium-silver",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "w-10 border-r border-titanium-border px-2.5 py-2 text-center text-[10px] text-titanium-silver/60 font-normal",
									children: "#"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "border-r border-titanium-border px-3.5 py-2 font-medium text-stark/80",
									children: "A: Ticket"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "border-r border-titanium-border px-3.5 py-2 font-medium text-stark/80",
									children: "B: Timestamp"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "border-r border-titanium-border px-3.5 py-2 font-medium text-stark/80",
									children: "C: Full Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "border-r border-titanium-border px-3.5 py-2 font-medium text-stark/80",
									children: "D: Email Address"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "border-r border-titanium-border px-3.5 py-2 font-medium text-stark/80",
									children: "E: Role / Use Case"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "border-r border-titanium-border px-3.5 py-2 font-medium text-stark/80",
									children: "F: Platforms"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "border-r border-titanium-border px-3.5 py-2 font-medium text-stark/80",
									children: "G: Hardware Spec"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3.5 py-2 font-medium text-stark/80",
									children: "H: Status"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-titanium-border/50",
							children: filtered.map((row, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "group transition-colors hover:bg-titanium-elevated/80 active:bg-titanium-elevated",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "border-r border-titanium-border/50 bg-titanium px-2.5 py-2 text-center text-[10px] text-titanium-silver/60 group-hover:text-titanium-silver select-none",
										children: idx + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "border-r border-titanium-border/50 px-3.5 py-2 font-semibold text-emerald",
										children: ["#", row.position]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "border-r border-titanium-border/50 px-3.5 py-2 text-titanium-silver whitespace-nowrap text-[10px]",
										children: row.timestamp
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "border-r border-titanium-border/50 px-3.5 py-2 font-sans font-medium text-stark whitespace-nowrap",
										children: row.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "border-r border-titanium-border/50 px-3.5 py-2 text-stark/90 font-mono whitespace-nowrap",
										children: row.email
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "border-r border-titanium-border/50 px-3.5 py-2 font-sans text-titanium-silver whitespace-nowrap",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded bg-titanium-elevated px-1.5 py-0.5 border border-titanium-border",
											children: row.useCase
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "border-r border-titanium-border/50 px-3.5 py-2 text-titanium-silver whitespace-nowrap",
										children: row.platforms.join(", ")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "border-r border-titanium-border/50 px-3.5 py-2 text-titanium-silver whitespace-nowrap",
										children: row.hardware || "NVIDIA / Intel PC"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3.5 py-2 whitespace-nowrap",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 rounded-full border border-emerald/40 bg-emerald/10 px-2 py-0.5 text-[9px] font-semibold text-emerald",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald" }), row.status || "Priority Access"]
										})
									})
								]
							}, row.id))
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-titanium-border bg-titanium-elevated px-4 py-2 sm:px-6 text-[11px] text-titanium-silver font-mono",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 rounded-t border-t-2 border-t-[#107c41] bg-titanium px-3 py-1 text-stark font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-3 w-3 text-[#107c41]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sheet1 (Waitlist Leads)" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-titanium-silver/60 hidden sm:inline",
							children: "| Ready"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-4 text-xs font-sans",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Displaying " }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-stark",
								children: filtered.length
							}),
							" of",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-stark",
								children: submissions.length
							}),
							" rows"
						] })
					})]
				})
			]
		})
	});
}
var PLATFORMS = [
	"Windows Power User",
	"macOS",
	"Linux"
];
var STORAGE_KEY = "vesper_waitlist_entry";
var ALL_SUBMISSIONS_KEY = "vesper_waitlist_all_submissions";
var HARDWARE_OPTIONS = [
	"NVIDIA RTX 30/40 Series (CUDA)",
	"Apple M-Series Silicon (Metal)",
	"Intel Core Ultra / NPU",
	"AMD Ryzen AI",
	"Standard CPU (AVX2)"
];
function Waitlist() {
	const [data, setData] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [useCase, setUseCase] = (0, import_react.useState)("Developer / Engineer");
	const [hardware, setHardware] = (0, import_react.useState)(HARDWARE_OPTIONS[0]);
	const [pickedPlatforms, setPickedPlatforms] = (0, import_react.useState)(["Windows Power User"]);
	const [isExcelOpen, setIsExcelOpen] = (0, import_react.useState)(false);
	const [allSubmissions, setAllSubmissions] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) setData(JSON.parse(stored));
			const storedAll = localStorage.getItem(ALL_SUBMISSIONS_KEY);
			if (storedAll) {
				const parsed = JSON.parse(storedAll);
				setAllSubmissions(Array.isArray(parsed) ? parsed : []);
			} else setAllSubmissions([]);
		} catch {
			setAllSubmissions([]);
		}
	}, []);
	const togglePlatform = (p) => {
		setPickedPlatforms((cur) => cur.includes(p) ? cur.length > 1 ? cur.filter((x) => x !== p) : cur : [...cur, p]);
	};
	const saveSubmissions = (newSubs) => {
		setAllSubmissions(newSubs);
		try {
			localStorage.setItem(ALL_SUBMISSIONS_KEY, JSON.stringify(newSubs));
		} catch {}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!email || !email.includes("@")) {
			toast.error("Please provide a valid work or personal email.");
			return;
		}
		const calculatedPos = allSubmissions.length + 1;
		const now = /* @__PURE__ */ new Date();
		const timestamp = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`;
		const newSubmission = {
			id: `lead-${Date.now()}`,
			name: name.trim() || "Builder",
			email: email.trim(),
			useCase,
			platforms: pickedPlatforms,
			hardware,
			timestamp,
			position: calculatedPos,
			status: "Priority Confirmed"
		};
		const updated = [newSubmission, ...allSubmissions.filter((s) => s.email.toLowerCase() !== newSubmission.email.toLowerCase())];
		saveSubmissions(updated);
		const entry = {
			name: newSubmission.name,
			email: newSubmission.email,
			useCase: newSubmission.useCase,
			platforms: newSubmission.platforms,
			hardware: newSubmission.hardware || hardware,
			position: calculatedPos
		};
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
		} catch {}
		setData(entry);
		crmService.createLead({
			name: newSubmission.name,
			email: newSubmission.email,
			company: newSubmission.useCase.includes("Enterprise") ? "Enterprise Pilot" : "Independent Operator",
			status: "New Lead",
			dealValue: 120,
			score: 85,
			useCase: `${newSubmission.useCase} (${newSubmission.hardware})`,
			notes: `Joined waitlist from website. Platforms: ${pickedPlatforms.join(", ")}. Hardware: ${hardware}`
		}).catch((err) => {
			console.warn("Backend CRM sync status:", err);
		});
		toast.success("You are on the priority list!", { description: `Waitlist ticket #${calculatedPos} recorded and synced to CRM. Click 'View in Excel' to inspect.` });
	};
	const handleReset = () => {
		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch {}
		setData(null);
		setName("");
		setEmail("");
	};
	const handleClearAll = () => {
		saveSubmissions([]);
		toast.success("Excel waitlist database cleared.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "waitlist",
		className: "mx-auto max-w-3xl scroll-mt-20 px-5 py-28 relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BorderGlow, {
			borderRadius: 24,
			glowColor: "25 95% 53%",
			glowRadius: 30,
			glowIntensity: .6,
			colors: [
				"#ff6b00",
				"#ff8533",
				"#ea580c"
			],
			className: "w-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-3xl bg-titanium border border-titanium-border p-8 sm:p-11 backdrop-blur-xl shadow-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald/5 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-titanium-border/30 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[11px] tracking-[0.2em] text-titanium-silver",
									children: "PRIORITY PIPELINE"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-2 text-2xl font-bold tracking-[-0.03em] text-stark sm:text-3xl",
									children: "Join the VESPER Pro & Multi-Platform Beta"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setIsExcelOpen(true),
									className: "group flex items-center gap-2 rounded-xl border border-[#107c41]/50 bg-[#107c41]/10 px-3.5 py-2 text-xs font-semibold text-[#107c41] transition-all hover:bg-[#107c41]/20 hover:border-[#107c41] active:scale-[0.98] shadow-sm",
									title: "Open live spreadsheet view of all submissions",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 transition-transform group-hover:scale-110" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"View Database in Excel (",
										allSubmissions.length,
										")"
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed text-titanium-silver",
								children: "Be the first to access on-device offline Whisper models, team custom dictionaries, and cross-platform companion releases. All submissions are indexed into an Excel-ready database."
							}),
							data === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSubmit,
								className: "mt-8 space-y-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-4 sm:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "block",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-medium text-stark",
												children: "Your Name"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												required: true,
												value: name,
												onChange: (e) => setName(e.target.value),
												placeholder: "Ada Lovelace",
												className: "mt-1.5 w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3.5 py-2.5 text-sm text-stark outline-none transition-all placeholder:text-titanium-silver/40 focus:border-emerald focus:ring-1 focus:ring-emerald"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "block",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-medium text-stark",
												children: "Work or Personal Email"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												required: true,
												type: "email",
												value: email,
												onChange: (e) => setEmail(e.target.value),
												placeholder: "ada@company.com",
												className: "mt-1.5 w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3.5 py-2.5 text-sm text-stark outline-none transition-all placeholder:text-titanium-silver/40 focus:border-emerald focus:ring-1 focus:ring-emerald"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-4 sm:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "block",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-medium text-stark",
												children: "Primary Role / Use Case"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												value: useCase,
												onChange: (e) => setUseCase(e.target.value),
												className: "mt-1.5 w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3.5 py-2.5 text-sm text-stark outline-none transition-all focus:border-emerald focus:ring-1 focus:ring-emerald",
												children: [
													"Developer / Engineer",
													"Writer / Creator",
													"Founder / Exec",
													"Customer Support",
													"Other"
												].map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: o,
													className: "bg-titanium",
													children: o
												}, o))
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "block",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-medium text-stark",
												children: "Target GPU / Architecture"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												value: hardware,
												onChange: (e) => setHardware(e.target.value),
												className: "mt-1.5 w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3.5 py-2.5 text-sm text-stark outline-none transition-all focus:border-emerald focus:ring-1 focus:ring-emerald",
												children: HARDWARE_OPTIONS.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: h,
													className: "bg-titanium",
													children: h
												}, h))
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-stark",
										children: "Platform Interest"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 flex flex-wrap gap-2.5",
										children: PLATFORMS.map((p) => {
											const isSelected = pickedPlatforms.includes(p);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => togglePlatform(p),
												className: `flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${isSelected ? "border-emerald/50 bg-emerald/10 text-emerald shadow-sm" : "border-titanium-border bg-titanium-elevated text-titanium-silver hover:border-titanium-silver/40 hover:text-stark"}`,
												children: [isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p })]
											}, p);
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "pt-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnet, {
											padding: 40,
											magnetStrength: 3,
											wrapperClassName: "w-full",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarBorder, {
												as: "button",
												type: "submit",
												color: "#ff6b00",
												speed: "3.5s",
												thickness: 1.5,
												backgroundColor: "#ff6b00",
												textColor: "#ffffff",
												className: "w-full text-sm font-semibold shadow-md transition-all hover:opacity-95 active:scale-[0.99]",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-center gap-2 py-3 px-5 text-white font-bold",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Get Priority Access & Save to Excel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
												})
											})
										})
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 rounded-2xl border border-emerald/40 bg-titanium-elevated p-6 shadow-xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/10 text-emerald border border-emerald/30",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "h-5 w-5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
												className: "text-base font-semibold text-stark",
												children: [
													"You are on the list, ",
													data.name.split(" ")[0],
													"!"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShinyText, {
												text: "VESPER PRO PRIORITY PASS",
												speed: 2,
												color: "#ff6b00",
												shineColor: "#ffffff",
												className: "font-mono text-[11px] font-semibold"
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: handleReset,
											className: "text-xs text-titanium-silver hover:text-stark underline font-mono",
											children: "Edit details"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-titanium-border pt-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-titanium-silver",
												children: "Registered Email"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 font-mono text-xs text-stark truncate",
												children: data.email
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-titanium-silver",
												children: "Target Platforms"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 text-xs text-stark",
												children: data.platforms.join(", ")
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-titanium-silver",
												children: "Hardware Target"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 text-xs text-stark truncate",
												children: data.hardware || "NVIDIA / Intel"
											})] })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-emerald/30 bg-emerald/5 p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-[11px] text-emerald font-semibold uppercase tracking-wider",
												children: "Confirmed Waitlist Position"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-titanium-silver",
												children: "Stored in live Excel database. Invites batch weekly."
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setIsExcelOpen(true),
												className: "flex items-center gap-1.5 rounded-lg border border-[#107c41]/50 bg-[#107c41]/10 px-3 py-1.5 text-xs font-semibold text-[#107c41] transition-all hover:bg-[#107c41]/20",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View in Excel" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-baseline font-mono text-3xl font-bold text-emerald",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "#" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, {
													to: data.position,
													duration: 1.5
												})]
											})]
										})]
									})
								]
							})
						]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExcelWaitlistModal, {
			isOpen: isExcelOpen,
			onClose: () => setIsExcelOpen(false),
			submissions: allSubmissions,
			onClear: handleClearAll
		})]
	});
}
var FAQS = [
	{
		q: "Does VESPER steal window focus when recording?",
		a: "No. VESPER uses Win32 native GetForegroundWindow and AttachThreadInput preservation. The floating capsule renders as an un-focusable, WS_EX_NOACTIVATE layered window, meaning your active caret in Cursor, VS Code, Slack, or Chrome never loses position."
	},
	{
		q: "Is my voice recorded, saved, or used to train models?",
		a: "Never. Audio is converted into in-memory 16kHz PCM chunks and processed statelessly via our encrypted high-speed neural pipeline or 100% offline local ONNX model. It is immediately freed from RAM once returned. No audio or transcripts are ever stored or retained."
	},
	{
		q: "Can I customize the push-to-talk hotkey?",
		a: "Yes. In the VESPER Settings overlay (Ctrl+Shift+Space), you can remap your activation key to Right Alt, F8, Fn, Right Ctrl, Left Alt, or any custom key combination supported by the low-level Windows keyboard hook."
	},
	{
		q: "What is the difference between Direct Dictation and Smart Copilot?",
		a: "Direct Dictation is pure verbatim speech-to-text without hallucination: what you speak is typed out word-for-word with accurate capitalization and punctuation. Smart Copilot takes your spoken intent and structures it as an engineered prompt for Claude 3.7, ChatGPT, or Cursor Composer."
	},
	{
		q: "Does VESPER require Administrator privileges on Windows?",
		a: "No. The installer is configured for user-level installation (perMachine: false in AppData\\Local\\Programs), which allows direct deployment on personal and managed systems without UAC elevation roadblocks."
	}
];
function FaqFeedback() {
	const [openDrawer, setOpenDrawer] = (0, import_react.useState)(false);
	const [rating, setRating] = (0, import_react.useState)(0);
	const [hoverRating, setHoverRating] = (0, import_react.useState)(0);
	const [feedbackText, setFeedbackText] = (0, import_react.useState)("");
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
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
					source: "launchpad-faq-feedback"
				})
			});
		} catch {}
		setSubmitted(true);
		toast.success("Thank you for the builder feedback!", { description: "Your notes have been recorded in MongoDB Atlas for the engineering team." });
		setTimeout(() => {
			setOpenDrawer(false);
			setSubmitted(false);
			setRating(0);
			setFeedbackText("");
		}, 1800);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "faq",
		className: "mx-auto max-w-3xl scroll-mt-20 px-5 py-28 relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center sm:text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 rounded-full border border-titanium-border bg-titanium-elevated px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-titanium-silver",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3 w-3 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Knowledge & Governance" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-3xl font-semibold tracking-[-0.03em] text-stark sm:text-4xl",
						children: "Straight answers from the builders."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-titanium-silver",
						children: "Architecture details, security guarantees, and execution protocols."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightCard, {
				spotlightColor: "rgba(16, 185, 129, 0.12)",
				className: "mt-10 overflow-hidden rounded-2xl border border-titanium-border bg-titanium/90 px-6 py-2 shadow-2xl backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
					type: "single",
					collapsible: true,
					children: FAQS.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
						value: `faq-${i}`,
						className: i === FAQS.length - 1 ? "border-none" : "border-titanium-border/70",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
							className: "text-left text-sm font-medium hover:no-underline py-4 text-stark hover:text-emerald transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex h-5 w-5 items-center justify-center rounded-md bg-emerald/10 text-emerald text-[11px] font-mono font-semibold",
									children: ["0", i + 1]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f.q })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
							className: "text-sm leading-relaxed text-titanium-silver pb-4 pl-8",
							children: f.a
						})]
					}, f.q))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed bottom-6 right-6 z-40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnet, {
					padding: 30,
					magnetStrength: 2,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setOpenDrawer(true),
						className: "flex items-center gap-2.5 rounded-full border border-titanium-border bg-titanium-elevated/95 px-4 py-2.5 text-xs font-semibold text-stark shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all hover:border-emerald/50 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)] active:scale-95",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShinyText, {
							text: "Share Feedback",
							speed: 3,
							color: "#0f172a",
							shineColor: "#ff6b00",
							className: "font-medium"
						})]
					})
				})
			}),
			openDrawer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-end justify-center bg-obsidian/85 p-4 backdrop-blur-md sm:items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-2xl border border-titanium-border bg-titanium p-6 shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold text-stark",
							children: "Share Your Feedback"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-titanium-silver",
							children: "Quick thoughts or feature requests for the core engineering team."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setOpenDrawer(false),
							"aria-label": "Close",
							className: "rounded-lg p-1 text-titanium-silver hover:bg-titanium-elevated hover:text-stark",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}), submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col items-center justify-center py-6 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-12 w-12 items-center justify-center rounded-full bg-emerald/15 text-emerald border border-emerald/30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "mt-3 text-sm font-semibold text-stark",
								children: "Feedback Recorded"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-titanium-silver",
								children: "Thank you for shaping VESPER Desktop."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 flex items-center justify-center gap-2",
							children: [
								1,
								2,
								3,
								4,
								5
							].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onMouseEnter: () => setHoverRating(n),
								onMouseLeave: () => setHoverRating(0),
								onClick: () => setRating(n),
								"aria-label": `${n} stars`,
								className: "p-1 transition-transform hover:scale-110",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-7 w-7 transition-colors ${n <= (hoverRating || rating) ? "fill-emerald text-emerald drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "text-titanium-border hover:text-titanium-silver"}` })
							}, n))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: feedbackText,
							onChange: (e) => setFeedbackText(e.target.value),
							rows: 3,
							placeholder: "What felt extraordinary? What could be improved?",
							className: "mt-5 w-full resize-none rounded-xl border border-titanium-border bg-titanium-elevated px-3.5 py-2.5 text-sm text-stark outline-none transition-colors placeholder:text-titanium-silver/40 focus:border-emerald focus:ring-1 focus:ring-emerald"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleSendFeedback,
							className: "mt-4 flex w-full items-center justify-center rounded-xl bg-emerald px-4 py-3 text-sm font-bold text-obsidian shadow-md transition-all hover:opacity-95 active:scale-[0.99]",
							children: "Submit Feedback"
						})
					] })]
				})
			})
		]
	});
}
function LegalModal({ isOpen, onClose, defaultTab = "privacy" }) {
	const [tab, setTab] = (0, import_react.useState)(defaultTab);
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-md animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-titanium-border bg-titanium shadow-2xl overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-titanium-border px-6 py-4 bg-titanium-elevated",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/10 border border-emerald/30 text-emerald",
							children: tab === "privacy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-bold text-stark",
							children: tab === "privacy" ? "VESPER Privacy Policy" : "VESPER Terms of Service"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-mono text-titanium-silver",
							children: "Effective Date: October 2026 · Local-First Architecture"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-lg p-1.5 text-titanium-silver hover:bg-titanium hover:text-stark transition-colors",
						"aria-label": "Close modal",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex border-b border-titanium-border bg-obsidian px-6 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab("privacy"),
						className: `pb-2.5 px-3 font-mono text-xs font-semibold border-b-2 transition-all ${tab === "privacy" ? "border-emerald text-emerald" : "border-transparent text-titanium-silver hover:text-stark"}`,
						children: "Zero-Retention Privacy Policy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab("terms"),
						className: `pb-2.5 px-3 font-mono text-xs font-semibold border-b-2 transition-all ${tab === "terms" ? "border-emerald text-emerald" : "border-transparent text-titanium-silver hover:text-stark"}`,
						children: "Software License & Terms"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto px-6 py-5 space-y-5 text-xs text-titanium-silver leading-relaxed font-sans",
					children: tab === "privacy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-emerald/30 bg-emerald/10 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-mono text-xs font-bold text-emerald",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Zero Audio Retention Protocol" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-xs text-stark/90",
								children: "VESPER operates on a zero-retention paradigm. Audio buffers are captured into volatile in-memory RAM slices, analyzed statelessly for speech tokens, and completely purged immediately upon transcription delivery. No human ever listens to your recordings, and your voice is never used to train public models."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-mono text-xs font-bold text-stark uppercase tracking-wider",
								children: "1. Information We Do Not Collect"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We do not collect, log, or persist raw microphone audio, keystrokes outside activation hooks, clipboard contents, or internal window titles. Local Windows keyboard hooks intercept only the registered hotkey (default F8) and bypass all normal key typing." })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-mono text-xs font-bold text-stark uppercase tracking-wider",
								children: "2. Account & Licensing Telemetry"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "When you register for a VESPER license, we securely store your email, encrypted authentication credentials, and assigned license key in MongoDB Atlas to authenticate your software activation and meter tier quota." })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-mono text-xs font-bold text-stark uppercase tracking-wider",
								children: "3. User Feedback & Communications"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"Any bug reports, ratings, or suggestions submitted through the platform or sent to ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-emerald",
									children: "contact@vesper.ai"
								}),
								" are retained solely for developer support, product refinement, and answering your requests."
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-mono text-xs font-bold text-stark uppercase tracking-wider",
								children: "4. Security & Compliance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "All network communication is TLS 1.3 encrypted. VESPER complies with GDPR data portability, CCPA disclosure rights, and zero-storage enterprise confidentiality standards." })]
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-mono text-xs font-bold text-stark",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Commercial Software Licensing Agreement" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-xs text-titanium-silver",
								children: "By downloading, installing, or executing VESPER Desktop, you agree to this non-exclusive, revocable software license agreement."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-mono text-xs font-bold text-stark uppercase tracking-wider",
								children: "1. License Grant"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Subject to your license tier (Pro, Enterprise, or Developer), VESPER grants you a personal or organizational license to run the VESPER Windows executable across your registered devices. You may not decompile, reverse engineer the binary kernel, or distribute unlicensed copies." })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-mono text-xs font-bold text-stark uppercase tracking-wider",
								children: "2. Push-to-Talk Windows Execution"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "VESPER utilizes low-level Win32 keyboard and audio hooks to enable instant caret insertion into third-party processes (such as Cursor, VS Code, and Slack). Users maintain full operational responsibility for content dictated into their systems." })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-mono text-xs font-bold text-stark uppercase tracking-wider",
								children: "3. User Feedback & Improvements"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"We welcome builder feedback at ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-emerald",
									children: "contact@vesper.ai"
								}),
								". By submitting ideas, you grant VESPER the right to implement software improvements, bug fixes, and feature requests without royalty."
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-mono text-xs font-bold text-stark uppercase tracking-wider",
								children: "4. Warranty & Liability"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "VESPER is provided \"as is\" with enterprise stability engineering. We disclaim all implied warranties of merchantability or fitness for a particular purpose to the maximum extent permitted by applicable law." })]
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-titanium-border bg-titanium-elevated px-6 py-3.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-titanium-silver",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5 text-emerald" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Questions or feedback?" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "mailto:contact@vesper.ai",
								className: "text-emerald hover:underline font-semibold",
								children: "contact@vesper.ai"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-lg bg-emerald px-4 py-1.5 font-bold text-obsidian hover:opacity-95 transition-opacity",
						children: "I Understand"
					})]
				})
			]
		})
	});
}
function Footer() {
	const [dbState, setDbState] = (0, import_react.useState)({
		connected: true,
		latencyMs: 17
	});
	const [legalModalOpen, setLegalModalOpen] = (0, import_react.useState)(false);
	const [legalTab, setLegalTab] = (0, import_react.useState)("privacy");
	(0, import_react.useEffect)(() => {
		fetch("/api/health").then((res) => res.json()).then((data) => {
			if (data?.database) setDbState({
				connected: Boolean(data.database.connected),
				latencyMs: data.database.latencyMs ?? 17
			});
		}).catch(() => {});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-titanium-border bg-obsidian text-titanium-silver relative z-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-titanium-border/60 bg-titanium/50 py-3 px-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-xs font-mono",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex h-2 w-2 rounded-full bg-emerald animate-pulse shadow-[0_0_8px_var(--emerald)]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-stark font-medium",
								children: "Windows Engine Status: Active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-titanium-silver/40",
								children: "|"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-titanium-silver",
								children: "WinKeyServer.exe PID attached"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 text-titanium-silver/80",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-3 w-3 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"MongoDB Atlas:",
									" ",
									dbState.connected ? `Connected (${dbState.latencyMs ?? 17}ms)` : "In-Memory Resilient"
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline text-titanium-silver/40",
								children: "|"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary font-semibold",
								children: "Sub-180ms Latency Waterfall"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-5 py-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-10 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VesperLogo, { size: 28 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-base font-bold tracking-[0.2em] text-stark",
										children: "VESPER"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs leading-relaxed text-titanium-silver",
									children: "Hardware-hooked push-to-talk ambient intelligence engine for Windows 10/11. Hold Right Alt, speak, and paste directly at your cursor without stealing window focus."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 rounded-full border border-titanium-border bg-titanium-elevated px-3 py-1 font-mono text-[10px] text-titanium-silver",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Version 1.0 Enterprise Production" })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-mono text-xs font-semibold tracking-wider text-stark uppercase",
								children: "Architecture"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "space-y-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#pipeline",
										className: "hover:text-stark transition-colors",
										children: "WinKeyServer Low-Level Hook"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#pipeline",
										className: "hover:text-stark transition-colors",
										children: "Silero VAD Chunking"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#pipeline",
										className: "hover:text-stark transition-colors",
										children: "Sub-180ms Neural Pipeline"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#pipeline",
										className: "hover:text-stark transition-colors",
										children: "Win32 SendInput Preservation"
									}) })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-mono text-xs font-semibold tracking-wider text-stark uppercase",
								children: "Resources"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "space-y-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "/guidance",
										className: "hover:text-emerald text-emerald font-semibold transition-colors flex items-center gap-1.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Developer Guidance & Manual" })
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#shortcuts",
										className: "hover:text-stark transition-colors",
										children: "Mechanical Keycap Tester"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#download",
										className: "hover:text-stark transition-colors",
										children: "Windows Installer & SHA-256"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#roadmap",
										className: "hover:text-stark transition-colors",
										children: "Air-Gapped Whisper Roadmap"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#waitlist",
										className: "hover:text-stark transition-colors",
										children: "Excel Leads Database"
									}) })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-mono text-xs font-semibold tracking-wider text-stark uppercase",
								children: "Architecture & Security"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2.5 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "#pipeline",
										className: "flex items-center gap-1.5 hover:text-stark transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "h-3.5 w-3.5 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "8-Layer Architecture Specs" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "#faq",
										className: "flex items-center gap-1.5 hover:text-stark transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Zero Audio Retention Guarantee" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-[11px] text-titanium-silver/70 pt-2",
										children: "Enterprise Core Engine. Built with React 19, TanStack Start, and Tailwind CSS."
									})
								]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-titanium-border/60 pt-6 text-xs text-titanium-silver/70",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-x-4 gap-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"© ",
								(/* @__PURE__ */ new Date()).getFullYear(),
								" VESPER Platform. All rights reserved."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setLegalTab("privacy");
									setLegalModalOpen(true);
								},
								className: "hover:text-emerald transition-colors underline-offset-2 hover:underline",
								children: "Privacy Policy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setLegalTab("terms");
									setLegalModalOpen(true);
								},
								className: "hover:text-emerald transition-colors underline-offset-2 hover:underline",
								children: "Terms of Service"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "mailto:contact@vesper.ai?subject=VESPER%20Feedback%20%26%20Inquiry",
								className: "hover:text-emerald transition-colors flex items-center gap-1 underline-offset-2 hover:underline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Feedback & Contact" })]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 font-mono text-[11px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "SHA-256: 8f4a2c9e...3d1b" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "winget install vesper" })
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalModal, {
				isOpen: legalModalOpen,
				onClose: () => setLegalModalOpen(false),
				defaultTab: legalTab
			})
		]
	});
}
var TEAM_SIZES = [
	"5 - 20 Engineers",
	"20 - 50 Engineers",
	"50 - 200 Engineers",
	"200+ Enterprise"
];
var SECURITY_REQUIREMENTS = [
	"Air-Gapped On-Premise ONNX Whisper Relay",
	"Centralized Team Vocabulary Synchronization",
	"SOC2 Type II & HIPAA Compliance Documentation",
	"Custom Single Sign-On (Okta / SAML 2.0)"
];
function EnterpriseModal({ isOpen, onClose }) {
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [company, setCompany] = (0, import_react.useState)("");
	const [teamSize, setTeamSize] = (0, import_react.useState)(TEAM_SIZES[1]);
	const [selectedSecurity, setSelectedSecurity] = (0, import_react.useState)([SECURITY_REQUIREMENTS[0]]);
	const [notes, setNotes] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	if (!isOpen) return null;
	const toggleSecurity = (item) => {
		setSelectedSecurity((prev) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email || !email.includes("@")) {
			toast.error("Please provide a valid work email address.");
			return;
		}
		setLoading(true);
		try {
			const calculatedValue = teamSize === TEAM_SIZES[0] ? 2400 : teamSize === TEAM_SIZES[1] ? 6e3 : teamSize === TEAM_SIZES[2] ? 18e3 : 45e3;
			await crmService.createLead({
				name: name.trim() || "Enterprise Engineering Lead",
				email: email.trim(),
				company: company.trim() || "Enterprise Organization",
				stage: "Enterprise Pilot",
				value: calculatedValue,
				score: 95,
				useCase: `Enterprise Team (${teamSize})`,
				notes: `Enterprise Pilot inquiry. Security requests: ${selectedSecurity.join(", ")}. Custom requirements: ${notes || "None specified"}`
			});
			setSubmitted(true);
			toast.success("Enterprise Pilot Request Dispatched", { description: "Lead logged into Executive CRM. Dedicated engineering channel being provisioned." });
			setTimeout(() => {
				onClose();
				setSubmitted(false);
				setName("");
				setEmail("");
				setCompany("");
				setNotes("");
			}, 2200);
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to submit request.";
			toast.error(msg);
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-xl rounded-2xl border border-titanium-border bg-titanium p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.85)] text-stark",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onClose,
				className: "absolute right-5 top-5 rounded-lg p-1 text-titanium-silver hover:bg-titanium-elevated hover:text-stark transition-colors",
				"aria-label": "Close dialog",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
			}), submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center py-8 text-center animate-in zoom-in-95 duration-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald/40 bg-emerald/10 text-emerald shadow-[0_0_32px_rgba(16,185,129,0.3)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-7 w-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 font-mono text-lg font-bold text-stark",
						children: "Enterprise Pilot Registered"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-titanium-silver max-w-sm",
						children: "Your inquiry has been stored in the VESPER Executive CRM pipeline. An engineering partner will reach out within 4 business hours."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border-b border-titanium-border pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/40 bg-purple-500/10 text-purple-400",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-mono text-base font-bold text-stark",
					children: "Deploy VESPER for Engineering Teams"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-titanium-silver",
					children: "Air-gapped on-premise relays, custom team dictionaries, and SOC2 compliance."
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "mt-5 flex flex-col gap-4 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block font-mono text-[11px] text-titanium-silver",
							children: "Your Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							required: true,
							placeholder: "e.g. Rachel Sterling",
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver/50 focus:border-emerald focus:outline-none"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block font-mono text-[11px] text-titanium-silver",
							children: "Work Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							required: true,
							placeholder: "rachel@company.com",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver/50 focus:border-emerald focus:outline-none"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block font-mono text-[11px] text-titanium-silver",
							children: "Company / Organization"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							required: true,
							placeholder: "e.g. OpenAI, Stripe, Scale",
							value: company,
							onChange: (e) => setCompany(e.target.value),
							className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver/50 focus:border-emerald focus:outline-none"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block font-mono text-[11px] text-titanium-silver",
							children: "Engineering Team Size"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: teamSize,
							onChange: (e) => setTeamSize(e.target.value),
							className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 font-mono text-stark focus:border-emerald focus:outline-none",
							children: TEAM_SIZES.map((sz) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: sz,
								className: "bg-titanium text-stark",
								children: sz
							}, sz))
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block font-mono text-[11px] text-titanium-silver",
						children: "Security & Architecture Requirements"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
						children: SECURITY_REQUIREMENTS.map((req) => {
							const active = selectedSecurity.includes(req);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => toggleSecurity(req),
								className: `flex items-start gap-2 rounded-lg border p-2 text-left transition-all ${active ? "border-emerald/40 bg-emerald/10 text-stark" : "border-titanium-border bg-titanium-elevated text-titanium-silver hover:text-stark"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: `mt-0.5 h-3.5 w-3.5 shrink-0 ${active ? "text-emerald" : "text-titanium-silver"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] leading-tight",
									children: req
								})]
							}, req);
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block font-mono text-[11px] text-titanium-silver",
						children: "Workflow Notes & Technical Stack"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 2,
						placeholder: "e.g. 50 Cursor licenses, local RTX 4090 workstations, custom internal API names...",
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver/50 focus:border-emerald focus:outline-none"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center justify-between border-t border-titanium-border pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[10px] text-titanium-silver flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Confidential NDA Guarded" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onClose,
								className: "rounded-xl border border-titanium-border px-3.5 py-2 text-titanium-silver hover:text-stark transition-colors",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: loading,
								className: "flex items-center gap-2 rounded-xl bg-stark px-5 py-2 font-semibold text-obsidian shadow transition-all hover:bg-white active:scale-[0.98]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: loading ? "Submitting..." : "Schedule Pilot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
							})]
						})]
					})
				]
			})] })]
		})
	});
}
var MCP_SCHEMA_SAMPLE = `{
  "name": "search_user_context",
  "description": "Semantic vector search over local desktop window history, active code references, and recent user actions.",
  "parameters": {
    "type": "object",
    "properties": {
      "query": { "type": "string", "description": "Natural language query, e.g. 'recent auth middleware refactoring'" },
      "limit": { "type": "number", "default": 5 },
      "windowTitleFilter": { "type": "string", "optional": true }
    },
    "required": ["query"]
  }
}`;
var MCP_SCREEN_SCHEMA = `{
  "name": "get_active_screen_context",
  "description": "Zero focus-loss Win32 inspection of the current foreground process, window title, and active text selection bounds.",
  "parameters": {
    "type": "object",
    "properties": {
      "includeClipboard": { "type": "boolean", "default": false },
      "processFilter": { "type": "string", "optional": true }
    }
  }
}`;
function ArchitectureModal({ isOpen, onClose }) {
	const [activeTab, setActiveTab] = (0, import_react.useState)("mcp");
	const [copied, setCopied] = (0, import_react.useState)(false);
	if (!isOpen) return null;
	const copyConfig = () => {
		const config = JSON.stringify({ mcpServers: { vesper: {
			command: "npx",
			args: ["-y", "@vesper/mcp-server@latest"],
			env: { VESPER_PORT: "32123" }
		} } }, null, 2);
		navigator.clipboard?.writeText(config);
		setCopied(true);
		toast.success("MCP configuration copied to clipboard");
		setTimeout(() => setCopied(false), 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-titanium-border bg-titanium shadow-[0_24px_64px_rgba(0,0,0,0.85)] text-stark",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-titanium-border px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-xl border border-emerald/40 bg-emerald/10 text-emerald",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-mono text-sm font-bold text-stark",
							children: "VESPER Architecture & MCP Telemetry"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-titanium-silver",
							children: "VESPER Ambient Context Protocol, low-level Win32 hooks, and deterministic latency budgets."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-lg p-1 text-titanium-silver hover:bg-titanium-elevated hover:text-stark transition-colors",
						"aria-label": "Close modal",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex border-b border-titanium-border bg-titanium-elevated px-6 py-2 gap-2 text-xs font-mono",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveTab("mcp"),
							className: `rounded-lg px-3 py-1.5 transition-colors ${activeTab === "mcp" ? "bg-titanium text-stark font-semibold border border-titanium-border" : "text-titanium-silver hover:text-stark"}`,
							children: "VESPER Context Protocol MCP"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveTab("waterfall"),
							className: `rounded-lg px-3 py-1.5 transition-colors ${activeTab === "waterfall" ? "bg-titanium text-stark font-semibold border border-titanium-border" : "text-titanium-silver hover:text-stark"}`,
							children: "Latency Waterfall (<180ms)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveTab("layers"),
							className: `rounded-lg px-3 py-1.5 transition-colors ${activeTab === "layers" ? "bg-titanium text-stark font-semibold border border-titanium-border" : "text-titanium-silver hover:text-stark"}`,
							children: "8-Layer Brain Pipeline"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-y-auto p-6 text-xs space-y-4",
					children: [
						activeTab === "mcp" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 font-mono text-[11px] text-emerald",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "http://127.0.0.1:32123/mcp & stdio" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: copyConfig,
											className: "flex items-center gap-1.5 font-mono text-[10px] text-titanium-silver hover:text-stark transition-colors",
											children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-emerald" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copied ? "Copied" : "Copy claude_desktop_config.json" })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-titanium-silver leading-relaxed",
										children: "External AI agents running in Cursor, Claude Code, Windsurf, or Antigravity can connect to VESPER's local MCP server to retrieve ground-truth screen telemetry without cloud round-trips."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-mono text-[11px] uppercase tracking-wider text-titanium-silver mb-2",
									children: "Tool 1: Semantic User Context Query"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "overflow-x-auto rounded-xl border border-titanium-border bg-obsidian p-3 font-mono text-[11px] text-emerald leading-relaxed",
									children: MCP_SCHEMA_SAMPLE
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-mono text-[11px] uppercase tracking-wider text-titanium-silver mb-2",
									children: "Tool 2: Zero Focus-Loss Screen State"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "overflow-x-auto rounded-xl border border-titanium-border bg-obsidian p-3 font-mono text-[11px] text-cyan-400 leading-relaxed",
									children: MCP_SCREEN_SCHEMA
								})] })
							]
						}),
						activeTab === "waterfall" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-titanium-silver leading-relaxed",
									children: "Every millisecond is measured under hardware constraints. VESPER eliminates the latency variance of traditional multi-hop cloud bots."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 font-mono text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-titanium-silver text-[11px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1. Ring Buffer Audio Ingestion" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-emerald",
													children: "<15ms"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-2 w-full rounded-full bg-titanium-elevated overflow-hidden",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full bg-emerald w-[8%]" })
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-titanium-silver text-[11px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2. Energy-Gated Silero VAD Chunking" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-emerald",
													children: "<12ms"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-2 w-full rounded-full bg-titanium-elevated overflow-hidden",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full bg-emerald w-[7%]" })
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-titanium-silver text-[11px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3. High-Speed Neural Speech Pipeline" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-emerald",
													children: "<145ms"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-2 w-full rounded-full bg-titanium-elevated overflow-hidden",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full bg-emerald w-[76%]" })
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-titanium-silver text-[11px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "4. Deterministic Zero-Backspace Polisher" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-emerald",
													children: "<3ms"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-2 w-full rounded-full bg-titanium-elevated overflow-hidden",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full bg-emerald w-[3%]" })
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-titanium-silver text-[11px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "5. Win32 SendInput Native Caret Insertion" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-emerald",
													children: "<2ms"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-2 w-full rounded-full bg-titanium-elevated overflow-hidden",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full bg-emerald w-[2%]" })
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-sm font-bold text-stark",
										children: "Total Latency Waterfall"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-titanium-silver",
										children: "Sub-second biological threshold"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-lg font-bold text-emerald",
										children: "177ms End-to-End"
									})]
								})
							]
						}),
						activeTab === "layers" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 font-mono text-xs",
							children: [
								{
									layer: "L1",
									name: "Physical Audio Hook",
									desc: "16kHz PCM ring buffer with WinKeyServer low-level keyboard hook"
								},
								{
									layer: "L2",
									name: "Window Context Engine",
									desc: "Win32 GetForegroundWindow caret preservation and process telemetry"
								},
								{
									layer: "L3",
									name: "Hybrid Inference Engine",
									desc: "High-speed private neural cloud + DirectML INT8 ONNX offline local fallback"
								},
								{
									layer: "L4",
									name: "Zero-Backspace Polisher",
									desc: "Regex-compiled filler stripping, punctuation injection, code formatting"
								},
								{
									layer: "L5",
									name: "Universal Task Object",
									desc: "Standardized typed task dispatch envelope"
								},
								{
									layer: "L6",
									name: "Action Router",
									desc: "Determines direct text paste vs Cursor prompt expansion vs CLI command"
								},
								{
									layer: "L7",
									name: "Risk Governance Gate",
									desc: "3-tier safety verification (Safe, Moderate, Destructive)"
								},
								{
									layer: "L8",
									name: "SendInput Native Injection",
									desc: "Physical keystroke synthesis with zero focus loss"
								}
							].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3 rounded-xl border border-titanium-border bg-titanium-elevated p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-obsidian border border-titanium-border px-2 py-0.5 text-emerald font-bold",
									children: l.layer
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-stark",
									children: l.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-titanium-silver font-sans",
									children: l.desc
								})] })]
							}, l.layer))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-titanium-border bg-titanium-elevated px-6 py-3 flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-xl bg-stark px-5 py-2 font-semibold text-xs text-obsidian hover:bg-white transition-colors",
						children: "Close Inspector"
					})
				})
			]
		})
	});
}
function Index() {
	const [isEnterpriseOpen, setIsEnterpriseOpen] = (0, import_react.useState)(false);
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "relative z-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Simulator, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Personas, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Capabilities, {
							onOpenArchitectureModal: () => setIsArchitectureOpen(true),
							onOpenContextInspector: () => setIsContextInspectorOpen(true),
							onOpenUtoModal: () => setIsUtoOpen(true)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shortcuts, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pricing, { onOpenEnterpriseModal: () => setIsEnterpriseOpen(true) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DownloadSetup, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Roadmap, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waitlist, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqFeedback, {})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnterpriseModal, {
					isOpen: isEnterpriseOpen,
					onClose: () => setIsEnterpriseOpen(false)
				}),
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
//#endregion
export { Index as component };
