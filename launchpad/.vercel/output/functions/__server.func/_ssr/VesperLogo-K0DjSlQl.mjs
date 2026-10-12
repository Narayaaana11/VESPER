import "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var VesperLogo = ({ size = 32, className = "", showText = false, textColor = "currentColor" }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `inline-flex items-center gap-2.5 ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: size,
			height: size,
			viewBox: "0 0 512 512",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			className: "shrink-0 transition-transform duration-200 group-hover:scale-105",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "vLaunchLogoGrad",
						x1: "0%",
						y1: "0%",
						x2: "100%",
						y2: "100%",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: "#ff7a1a"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "50%",
								stopColor: "#ea580c"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: "#c2410c"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "vLaunchAccentGrad",
						x1: "0%",
						y1: "0%",
						x2: "100%",
						y2: "100%",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "#ffffff"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "#fed7aa"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("filter", {
						id: "vLaunchGlow",
						x: "-15%",
						y: "-15%",
						width: "130%",
						height: "130%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feDropShadow", {
							dx: "0",
							dy: "8",
							stdDeviation: "14",
							floodColor: "#ea580c",
							floodOpacity: "0.25"
						})
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "20",
					y: "20",
					width: "472",
					height: "472",
					rx: "116",
					fill: "#ffffff"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "20",
					y: "20",
					width: "472",
					height: "472",
					rx: "116",
					fill: "none",
					stroke: "#ffedd5",
					strokeWidth: "12"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					filter: "url(#vLaunchGlow)",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M104 136 L192 136 L256 320 L204 320 Z",
							fill: "url(#vLaunchLogoGrad)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M408 136 L320 136 L256 320 L308 320 Z",
							fill: "url(#vLaunchLogoGrad)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M204 320 L256 400 L308 320 Z",
							fill: "url(#vLaunchLogoGrad)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M224 200 L288 200 L256 268 Z",
							fill: "url(#vLaunchAccentGrad)"
						})
					]
				})
			]
		}), showText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono font-bold tracking-[0.22em] text-sm uppercase select-none",
			style: { color: textColor },
			children: "VESPER"
		})]
	});
};
//#endregion
export { VesperLogo as t };
