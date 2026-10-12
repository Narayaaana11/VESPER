import { o as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { R as Gauge, Y as Crosshair, Z as Copy, _ as Shield, at as Check, d as Terminal, dt as ArrowDown, t as Zap } from "../_libs/lucide-react.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { _ as SpotlightCard, a as DownloadSetup, c as Footer, d as Personas, f as Pricing, g as Simulator, h as Shortcuts, i as ContextInspector, l as Magnet, m as ShinyText, n as Capabilities, o as EnterpriseModal, p as Roadmap, r as ClickSpark, s as FaqFeedback, t as ArchitectureModal, u as Nav, v as StarBorder, x as Waitlist, y as UtoExplorerModal } from "./Personas-B0b6j4YH.mjs";
import { a as Geometry, i as Program, n as Camera, r as Renderer, t as Mesh } from "../_libs/ogl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DgOnN22S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
function WindowsIcon({ className = "h-4 w-4" }) {
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
								href: "/download",
								color: "#ff6b00",
								speed: "3.5s",
								thickness: 1.5,
								backgroundColor: "#ffffff",
								className: "group relative flex w-full items-center justify-center text-slate-900 transition-all active:scale-[0.98] sm:w-auto shadow-[0_4px_20px_rgba(255,107,0,0.18)] border border-orange-200",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 px-5 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WindowsIcon, { className: "h-5 w-5 text-primary transition-transform group-hover:scale-110" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
								href: "/simulator",
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
