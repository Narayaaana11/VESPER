import { r as __toESM } from "../_runtime.mjs";
import { c as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as useAuth } from "./auth-context-CFmidOKR.mjs";
import { t as crmService } from "./crm-service-Yn1PsX10.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Clock, E as Plus, J as Database, K as Download, L as Key, M as Mail, P as Lock, S as Search, Z as Copy, _ as Shield, a as Users, at as Check, b as Server, c as TrendingUp, dt as ArrowLeft, l as Trash2, lt as Award, nt as CircleCheckBig, pt as Activity, q as DollarSign, rt as CircleAlert, s as UserCheck, t as Zap, w as RefreshCw, x as Send } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Bjl7_mq3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/gowri/Videos/QEVRA/launchpad/src/routes/admin.tsx?tsr-split=component";
var ALL_STAGES = [
	"New Lead",
	"Contacted",
	"Qualified",
	"Pro Trial",
	"Closed Won",
	"Enterprise Pilot",
	"Lost"
];
function getStageBadgeClass(stage) {
	switch (stage) {
		case "Closed Won": return "border-emerald/40 bg-emerald/10 text-emerald";
		case "Enterprise Pilot": return "border-purple-500/40 bg-purple-500/10 text-purple-400";
		case "Pro Trial": return "border-amber-500/40 bg-amber-500/10 text-amber-400";
		case "Qualified": return "border-cyan-500/40 bg-cyan-500/10 text-cyan-400";
		case "Contacted": return "border-blue-500/40 bg-blue-500/10 text-blue-400";
		case "Lost": return "border-zinc-700 bg-zinc-800/60 text-zinc-400";
		default: return "border-titanium-border bg-titanium-elevated text-titanium-silver";
	}
}
function AdminPage() {
	const { user, isAdmin, login, loginWithGoogle, logout, openAuthModal } = useAuth();
	const [adminTab, setAdminTab] = (0, import_react.useState)("users");
	const [stats, setStats] = (0, import_react.useState)(null);
	const [leads, setLeads] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [refreshing, setRefreshing] = (0, import_react.useState)(false);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [selectedStage, setSelectedStage] = (0, import_react.useState)("All");
	const [viewMode, setViewMode] = (0, import_react.useState)("table");
	const [activeLead, setActiveLead] = (0, import_react.useState)(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = (0, import_react.useState)(false);
	const [isAddModalOpen, setIsAddModalOpen] = (0, import_react.useState)(false);
	const [newLeadForm, setNewLeadForm] = (0, import_react.useState)({
		name: "",
		email: "",
		company: "",
		stage: "New Lead",
		value: 120,
		score: 80,
		useCase: "Power Engineering",
		notes: ""
	});
	const [users, setUsers] = (0, import_react.useState)([]);
	const [usersLoading, setUsersLoading] = (0, import_react.useState)(false);
	const [userSearchQuery, setUserSearchQuery] = (0, import_react.useState)("");
	const [userFilter, setUserFilter] = (0, import_react.useState)("all");
	const [isInviteModalOpen, setIsInviteModalOpen] = (0, import_react.useState)(false);
	const [inviteForm, setInviteForm] = (0, import_react.useState)({
		name: "",
		email: "",
		tier: "pro"
	});
	const [copiedKeyId, setCopiedKeyId] = (0, import_react.useState)(null);
	const [telemetry, setTelemetry] = (0, import_react.useState)(null);
	const [telemetryLoading, setTelemetryLoading] = (0, import_react.useState)(false);
	const [emailInput, setEmailInput] = (0, import_react.useState)("");
	const [passwordInput, setPasswordInput] = (0, import_react.useState)("");
	const [authLoading, setAuthLoading] = (0, import_react.useState)(false);
	const loadData = async (isBackground = false) => {
		if (!isBackground) setLoading(true);
		else setRefreshing(true);
		try {
			const [fetchedStats, fetchedLeads] = await Promise.all([crmService.getStats(), crmService.getLeads()]);
			setStats(fetchedStats);
			setLeads(fetchedLeads.leads);
		} catch (err) {
			console.error("Failed to load CRM data:", err);
			toast.error("Could not load CRM data from server.");
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};
	const loadUsers = async (isBackground = false) => {
		if (!isBackground) setUsersLoading(true);
		try {
			const data = await (await fetch("/api/admin/users")).json();
			if (Array.isArray(data.users)) setUsers(data.users);
		} catch (err) {
			console.error("Failed to load users:", err);
			toast.error("Could not load user accounts from database.");
		} finally {
			setUsersLoading(false);
		}
	};
	const loadTelemetry = async () => {
		setTelemetryLoading(true);
		try {
			const data = await (await fetch("/api/health")).json();
			setTelemetry(data);
		} catch (err) {
			console.error("Failed to load system health:", err);
		} finally {
			setTelemetryLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (isAdmin) {
			loadData();
			loadUsers();
			loadTelemetry();
		}
	}, [isAdmin]);
	const handleToggleUserVerify = async (userId, currentStatus) => {
		try {
			const data = await (await fetch(`/api/admin/users/${userId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ isVerified: !currentStatus })
			})).json();
			if (data.success) {
				setUsers((prev) => prev.map((u) => u.id === userId ? {
					...u,
					isVerified: !currentStatus
				} : u));
				toast.success(!currentStatus ? "User email manually verified and accepted." : "User set to unverified status.");
			} else toast.error(data.error || "Failed to update verification.");
		} catch {
			toast.error("Network error updating user.");
		}
	};
	const handleToggleLicenseActive = async (userId, currentStatus) => {
		try {
			const data = await (await fetch(`/api/admin/users/${userId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ licenseActive: !currentStatus })
			})).json();
			if (data.success) {
				setUsers((prev) => prev.map((u) => u.id === userId ? {
					...u,
					licenseActive: !currentStatus
				} : u));
				toast.success(!currentStatus ? "Desktop license key activated." : "Desktop license key revoked.");
			} else toast.error(data.error || "Failed to toggle license.");
		} catch {
			toast.error("Network error toggling license.");
		}
	};
	const handleChangeTier = async (userId, newTier) => {
		try {
			const data = await (await fetch(`/api/admin/users/${userId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ tier: newTier })
			})).json();
			if (data.success) {
				setUsers((prev) => prev.map((u) => u.id === userId ? {
					...u,
					tier: newTier
				} : u));
				toast.success(`User upgraded to ${newTier.toUpperCase()} tier.`);
			} else toast.error(data.error || "Failed to change tier.");
		} catch {
			toast.error("Network error changing tier.");
		}
	};
	const handleInviteUser = async (e) => {
		e.preventDefault();
		if (!inviteForm.email.includes("@")) {
			toast.error("Valid email required.");
			return;
		}
		try {
			const data = await (await fetch("/api/admin/invite", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: inviteForm.email.trim(),
					name: inviteForm.name.trim() || "Invited Developer",
					tier: inviteForm.tier
				})
			})).json();
			if (data.success) {
				toast.success(`User invited! Verification and software license key dispatched to ${inviteForm.email}.`);
				setIsInviteModalOpen(false);
				setInviteForm({
					name: "",
					email: "",
					tier: "pro"
				});
				loadUsers(true);
			} else toast.error(data.error || "Failed to send invitation.");
		} catch {
			toast.error("Network error sending invite.");
		}
	};
	const handleCopyLicenseKey = (key, id) => {
		navigator.clipboard.writeText(key);
		setCopiedKeyId(id);
		toast.success("License key copied to clipboard!");
		setTimeout(() => setCopiedKeyId(null), 2e3);
	};
	const userStats = (0, import_react.useMemo)(() => {
		const total = users.length;
		const verified = users.filter((u) => u.isVerified).length;
		return {
			total,
			verified,
			activeLicenses: users.filter((u) => u.licenseActive).length,
			proTier: users.filter((u) => u.tier === "pro" || u.tier === "enterprise").length,
			pending: total - verified,
			totalTokensBurned: users.reduce((acc, u) => acc + (u.tokenQuota?.usedTokens || 0), 0),
			totalPromptTokens: users.reduce((acc, u) => acc + (u.tokenQuota?.promptTokens || 0), 0),
			totalCompletionTokens: users.reduce((acc, u) => acc + (u.tokenQuota?.completionTokens || 0), 0)
		};
	}, [users]);
	const filteredUsers = (0, import_react.useMemo)(() => {
		return users.filter((u) => {
			const q = userSearchQuery.toLowerCase().trim();
			const matchesQuery = !q || u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q) || u.licenseKey && u.licenseKey.toLowerCase().includes(q);
			let matchesFilter = true;
			if (userFilter === "verified") matchesFilter = u.isVerified;
			if (userFilter === "pending") matchesFilter = !u.isVerified;
			if (userFilter === "activeLicense") matchesFilter = u.licenseActive;
			return matchesQuery && matchesFilter;
		});
	}, [
		users,
		userSearchQuery,
		userFilter
	]);
	const handleStageChange = async (leadId, nextStage) => {
		try {
			const updated = await crmService.updateLead(leadId, { stage: nextStage });
			setLeads((prev) => prev.map((l) => l.id === leadId ? updated : l));
			if (activeLead && activeLead.id === leadId) setActiveLead(updated);
			toast.success(`Updated stage to ${nextStage}`);
			crmService.getStats().then(setStats).catch(() => {});
		} catch {
			toast.error("Failed to update lead stage.");
		}
	};
	const handleDeleteLead = async (leadId) => {
		if (!window.confirm("Are you sure you want to remove this lead from the CRM pipeline?")) return;
		try {
			await crmService.deleteLead(leadId);
			setLeads((prev) => prev.filter((l) => l.id !== leadId));
			if (activeLead && activeLead.id === leadId) {
				setIsDetailModalOpen(false);
				setActiveLead(null);
			}
			toast.success("Lead removed successfully.");
			crmService.getStats().then(setStats).catch(() => {});
		} catch {
			toast.error("Failed to delete lead.");
		}
	};
	const handleCreateLead = async (e) => {
		e.preventDefault();
		if (!newLeadForm.email.includes("@")) {
			toast.error("Please enter a valid email address.");
			return;
		}
		try {
			const created = await crmService.createLead({
				name: newLeadForm.name.trim() || "Anonymous Lead",
				email: newLeadForm.email.trim(),
				company: newLeadForm.company.trim() || "Independent",
				stage: newLeadForm.stage,
				value: Number(newLeadForm.value) || 0,
				score: Number(newLeadForm.score) || 75,
				useCase: newLeadForm.useCase,
				notes: newLeadForm.notes.trim()
			});
			setLeads((prev) => [created, ...prev]);
			setIsAddModalOpen(false);
			setNewLeadForm({
				name: "",
				email: "",
				company: "",
				stage: "New Lead",
				value: 120,
				score: 80,
				useCase: "Power Engineering",
				notes: ""
			});
			toast.success("Lead created successfully.");
			crmService.getStats().then(setStats).catch(() => {});
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to create lead.";
			toast.error(msg);
		}
	};
	const handleExportCsv = async () => {
		try {
			await crmService.exportCsv();
			toast.success("CRM Leads exported to CSV successfully.");
		} catch {
			toast.error("Failed to export leads.");
		}
	};
	const filteredLeads = (0, import_react.useMemo)(() => {
		return leads.filter((l) => {
			const matchesStage = selectedStage === "All" || l.stage === selectedStage;
			const query = searchQuery.toLowerCase().trim();
			if (!query) return matchesStage;
			const matchesQuery = l.name.toLowerCase().includes(query) || l.email.toLowerCase().includes(query) || l.company.toLowerCase().includes(query) || l.useCase && l.useCase.toLowerCase().includes(query) || l.notes && l.notes.toLowerCase().includes(query);
			return matchesStage && matchesQuery;
		});
	}, [
		leads,
		selectedStage,
		searchQuery
	]);
	const stageCounts = (0, import_react.useMemo)(() => {
		const counts = { All: leads.length };
		ALL_STAGES.forEach((s) => {
			counts[s] = leads.filter((l) => l.stage === s).length;
		});
		return counts;
	}, [leads]);
	const handleGateLogin = async (e) => {
		e.preventDefault();
		setAuthLoading(true);
		try {
			await login(emailInput, passwordInput);
			toast.success("Authenticated as Administrator");
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Invalid credentials.";
			toast.error(msg);
		} finally {
			setAuthLoading(false);
		}
	};
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen flex-col items-center justify-center bg-obsidian px-5 py-12 text-stark",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "w-full max-w-md rounded-2xl border border-titanium-border bg-titanium p-8 shadow-[0_24px_64px_rgba(0,0,0,0.8)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mb-6 flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald/40 bg-emerald/10 text-emerald shadow-[0_0_24px_rgba(16,185,129,0.2)]",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Shield, { className: "h-6 w-6" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 443,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 442,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "font-mono text-xl font-bold tracking-tight text-stark",
							children: "VESPER CRM Administration"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 445,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-1 text-xs text-titanium-silver",
							children: "Restricted portal for pipeline telemetry, lead scoring, and trial governance."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 448,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 441,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
					onSubmit: handleGateLogin,
					className: "flex flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "mb-1 block font-mono text-xs text-titanium-silver",
							children: "Admin Email"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 455,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
							type: "email",
							required: true,
							value: emailInput,
							onChange: (e) => setEmailInput(e.target.value),
							className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3.5 py-2.5 font-mono text-xs text-stark placeholder-titanium-silver/50 focus:border-emerald focus:outline-none"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 458,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 454,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "mb-1 block font-mono text-xs text-titanium-silver",
							children: "Password"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 462,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
							type: "password",
							required: true,
							value: passwordInput,
							onChange: (e) => setPasswordInput(e.target.value),
							className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3.5 py-2.5 font-mono text-xs text-stark placeholder-titanium-silver/50 focus:border-emerald focus:outline-none"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 463,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 461,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "submit",
							disabled: authLoading,
							className: "mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-stark px-4 py-3 text-xs font-bold text-obsidian shadow-lg transition-all hover:bg-white active:scale-[0.98]",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Lock, { className: "h-4 w-4 text-obsidian" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 467,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: authLoading ? "Verifying..." : "Access Admin CRM" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 468,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 466,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 453,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/",
						className: "flex items-center gap-1.5 text-xs text-titanium-silver transition-colors hover:text-stark",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { className: "h-3.5 w-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 474,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Return to VESPER Home" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 475,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 473,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 472,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 439,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 438,
		columnNumber: 12
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen bg-obsidian text-stark selection:bg-emerald/20 selection:text-emerald",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
				className: "sticky top-0 z-40 border-b border-titanium-border bg-obsidian/90 backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-5",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/",
								className: "flex items-center gap-2 text-xs font-medium text-titanium-silver transition-colors hover:text-stark",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { className: "h-4 w-4 text-emerald" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 491,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "hidden sm:inline",
									children: "Landing Page"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 492,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 490,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-4 w-px bg-titanium-border" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 495,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-mono text-sm font-bold tracking-[0.2em] text-stark",
									children: "VESPER"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 498,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "flex items-center gap-1.5 rounded-md border border-emerald/40 bg-emerald/10 px-2 py-0.5 font-mono text-[10px] text-emerald",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 500,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "ADMIN CONSOLE" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 501,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 499,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 497,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 489,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-3",
						children: [
							adminTab === "users" && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => loadUsers(true),
								disabled: usersLoading,
								className: "flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium px-3 py-1.5 text-xs font-mono text-titanium-silver transition-all hover:border-emerald/40 hover:text-stark",
								title: "Refresh users and licenses",
								children: [/* @__PURE__ */ (void 0)(RefreshCw, { className: `h-3.5 w-3.5 ${usersLoading ? "animate-spin text-emerald" : ""}` }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 509,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "hidden sm:inline",
									children: "Sync Users"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 510,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 508,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => setIsInviteModalOpen(true),
								className: "flex items-center gap-1.5 rounded-lg bg-emerald px-3.5 py-1.5 text-xs font-semibold text-obsidian shadow transition-all hover:bg-emerald-400 active:scale-[0.98]",
								children: [/* @__PURE__ */ (void 0)(Send, { className: "h-3.5 w-3.5 text-obsidian" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 513,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("span", { children: "Invite User" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 514,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 512,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 507,
								columnNumber: 38
							}, this),
							adminTab === "leads" && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [
								/* @__PURE__ */ (void 0)("button", {
									type: "button",
									onClick: () => loadData(true),
									disabled: refreshing,
									className: "flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium px-3 py-1.5 text-xs font-mono text-titanium-silver transition-all hover:border-emerald/40 hover:text-stark",
									title: "Refresh live CRM stats",
									children: [/* @__PURE__ */ (void 0)(RefreshCw, { className: `h-3.5 w-3.5 ${refreshing ? "animate-spin text-emerald" : ""}` }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 520,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "hidden sm:inline",
										children: "Sync"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 521,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 519,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("button", {
									type: "button",
									onClick: handleExportCsv,
									className: "flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium px-3 py-1.5 text-xs font-mono text-titanium-silver transition-all hover:border-emerald/40 hover:text-stark",
									title: "Export leads to CSV",
									children: [/* @__PURE__ */ (void 0)(Download, { className: "h-3.5 w-3.5 text-emerald" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 525,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "hidden sm:inline",
										children: "Export CSV"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 526,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 524,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (void 0)("button", {
									type: "button",
									onClick: () => setIsAddModalOpen(true),
									className: "flex items-center gap-1.5 rounded-lg bg-stark px-3.5 py-1.5 text-xs font-semibold text-obsidian shadow transition-all hover:bg-white active:scale-[0.98]",
									children: [/* @__PURE__ */ (void 0)(Plus, { className: "h-3.5 w-3.5 text-obsidian" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 530,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", { children: "New Lead" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 531,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 529,
									columnNumber: 17
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 518,
								columnNumber: 38
							}, this),
							adminTab === "telemetry" && /* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: loadTelemetry,
								disabled: telemetryLoading,
								className: "flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium px-3 py-1.5 text-xs font-mono text-titanium-silver transition-all hover:border-emerald/40 hover:text-stark",
								children: [/* @__PURE__ */ (void 0)(RefreshCw, { className: `h-3.5 w-3.5 ${telemetryLoading ? "animate-spin text-emerald" : ""}` }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 536,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("span", {
									className: "hidden sm:inline",
									children: "Refresh Telemetry"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 537,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 535,
								columnNumber: 42
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-4 w-px bg-titanium-border" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 541,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex h-7 w-7 items-center justify-center rounded-full bg-titanium-elevated font-mono text-xs text-stark border border-titanium-border",
									children: user?.name?.charAt(0) || "A"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 544,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									onClick: logout,
									className: "text-xs text-titanium-silver transition-colors hover:text-stark",
									title: "Sign out of Admin session",
									children: "Logout"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 547,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 543,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 506,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 488,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 487,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "border-b border-titanium-border bg-titanium/30 px-5 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto py-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: () => setAdminTab("users"),
							className: `flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-mono transition-all whitespace-nowrap ${adminTab === "users" ? "border-emerald text-emerald font-semibold" : "border-transparent text-titanium-silver hover:text-stark"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 559,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "User Accounts & Licenses" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 560,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "rounded-full bg-titanium-elevated px-2 py-0.5 text-[10px] text-emerald border border-titanium-border",
									children: users.length
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 561,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 558,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: () => setAdminTab("leads"),
							className: `flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-mono transition-all whitespace-nowrap ${adminTab === "leads" ? "border-emerald text-emerald font-semibold" : "border-transparent text-titanium-silver hover:text-stark"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TrendingUp, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 567,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "CRM Sales Pipeline" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 568,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "rounded-full bg-titanium-elevated px-2 py-0.5 text-[10px] text-stark border border-titanium-border",
									children: leads.length
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 569,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 566,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: () => setAdminTab("telemetry"),
							className: `flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-mono transition-all whitespace-nowrap ${adminTab === "telemetry" ? "border-emerald text-emerald font-semibold" : "border-transparent text-titanium-silver hover:text-stark"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Server, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 575,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Infrastructure Telemetry" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 576,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-2 w-2 rounded-full bg-emerald animate-pulse" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 577,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 574,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 557,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 556,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
				className: "mx-auto max-w-7xl px-5 py-8",
				children: [
					adminTab === "users" && /* @__PURE__ */ (void 0)("div", {
						className: "flex flex-col gap-8",
						children: [
							/* @__PURE__ */ (void 0)("section", {
								className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "flex items-center justify-between text-titanium-silver",
												children: [/* @__PURE__ */ (void 0)("span", {
													className: "font-mono text-xs uppercase tracking-wider",
													children: "Total Accounts"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 594,
													columnNumber: 19
												}, this), /* @__PURE__ */ (void 0)(Users, { className: "h-4 w-4 text-titanium-silver" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 595,
													columnNumber: 19
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 593,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "mt-3 font-mono text-2xl font-bold text-stark",
												children: userStats.total
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 597,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "mt-1 flex items-center gap-1.5 font-mono text-[11px] text-emerald",
												children: [/* @__PURE__ */ (void 0)(Database, { className: "h-3 w-3" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 601,
													columnNumber: 19
												}, this), /* @__PURE__ */ (void 0)("span", { children: "MongoDB Atlas synced" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 602,
													columnNumber: 19
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 600,
												columnNumber: 17
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 592,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "flex items-center justify-between text-titanium-silver",
												children: [/* @__PURE__ */ (void 0)("span", {
													className: "font-mono text-xs uppercase tracking-wider",
													children: "Email Verified"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 609,
													columnNumber: 19
												}, this), /* @__PURE__ */ (void 0)(UserCheck, { className: "h-4 w-4 text-emerald" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 610,
													columnNumber: 19
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 608,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "mt-3 font-mono text-2xl font-bold text-emerald",
												children: userStats.verified
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 612,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "mt-1 font-mono text-[11px] text-titanium-silver",
												children: "Nodemailer & Google OAuth"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 615,
												columnNumber: 17
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 607,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "flex items-center justify-between text-titanium-silver",
												children: [/* @__PURE__ */ (void 0)("span", {
													className: "font-mono text-xs uppercase tracking-wider",
													children: "Active Workstations"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 623,
													columnNumber: 19
												}, this), /* @__PURE__ */ (void 0)(Key, { className: "h-4 w-4 text-cyan-400" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 624,
													columnNumber: 19
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 622,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "mt-3 font-mono text-2xl font-bold text-cyan-400",
												children: userStats.activeLicenses
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 626,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "mt-1 font-mono text-[11px] text-titanium-silver",
												children: "Desktop client gate verified"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 629,
												columnNumber: 17
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 621,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "flex items-center justify-between text-titanium-silver",
												children: [/* @__PURE__ */ (void 0)("span", {
													className: "font-mono text-xs uppercase tracking-wider",
													children: "Tokens Burned"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 637,
													columnNumber: 19
												}, this), /* @__PURE__ */ (void 0)(Zap, { className: "h-4 w-4 text-amber-400" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 638,
													columnNumber: 19
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 636,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "mt-3 font-mono text-2xl font-bold text-amber-400",
												children: userStats.totalTokensBurned.toLocaleString()
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 640,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "mt-1 font-mono text-[11px] text-titanium-silver",
												children: [
													"P: ",
													userStats.totalPromptTokens.toLocaleString(),
													" | C: ",
													userStats.totalCompletionTokens.toLocaleString()
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 643,
												columnNumber: 17
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 635,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "flex items-center justify-between text-titanium-silver",
												children: [/* @__PURE__ */ (void 0)("span", {
													className: "font-mono text-xs uppercase tracking-wider",
													children: "Paid Subscribers"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 651,
													columnNumber: 19
												}, this), /* @__PURE__ */ (void 0)(Award, { className: "h-4 w-4 text-purple-400" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 652,
													columnNumber: 19
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 650,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "mt-3 font-mono text-2xl font-bold text-stark",
												children: userStats.proTier
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 654,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "mt-1 font-mono text-[11px] text-purple-400",
												children: "Pro ($29) & Enterprise"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 657,
												columnNumber: 17
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 649,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "flex items-center justify-between text-titanium-silver",
												children: [/* @__PURE__ */ (void 0)("span", {
													className: "font-mono text-xs uppercase tracking-wider",
													children: "Pending PIN"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 665,
													columnNumber: 19
												}, this), /* @__PURE__ */ (void 0)(Clock, { className: "h-4 w-4 text-rose-400" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 666,
													columnNumber: 19
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 664,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "mt-3 font-mono text-2xl font-bold text-rose-400",
												children: userStats.pending
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 668,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "mt-1 font-mono text-[11px] text-titanium-silver",
												children: "Awaiting email confirmation"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 671,
												columnNumber: 17
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 663,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 590,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (void 0)("section", {
								className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
								children: [/* @__PURE__ */ (void 0)("div", {
									className: "relative flex-1 max-w-md",
									children: [/* @__PURE__ */ (void 0)(Search, { className: "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-titanium-silver" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 680,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("input", {
										type: "text",
										placeholder: "Search users by name, email, license key...",
										value: userSearchQuery,
										onChange: (e) => setUserSearchQuery(e.target.value),
										className: "w-full rounded-xl border border-titanium-border bg-titanium pl-10 pr-4 py-2 text-xs text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 681,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 679,
									columnNumber: 15
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (void 0)("button", {
											type: "button",
											onClick: () => setUserFilter("all"),
											className: `rounded-lg px-3 py-1.5 text-xs font-mono transition-colors border ${userFilter === "all" ? "border-emerald/40 bg-emerald/10 text-emerald" : "border-titanium-border bg-titanium text-titanium-silver hover:text-stark"}`,
											children: [
												"All (",
												users.length,
												")"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 685,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)("button", {
											type: "button",
											onClick: () => setUserFilter("verified"),
											className: `rounded-lg px-3 py-1.5 text-xs font-mono transition-colors border ${userFilter === "verified" ? "border-emerald/40 bg-emerald/10 text-emerald" : "border-titanium-border bg-titanium text-titanium-silver hover:text-stark"}`,
											children: [
												"Verified (",
												userStats.verified,
												")"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 688,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)("button", {
											type: "button",
											onClick: () => setUserFilter("pending"),
											className: `rounded-lg px-3 py-1.5 text-xs font-mono transition-colors border ${userFilter === "pending" ? "border-amber-500/40 bg-amber-500/10 text-amber-400" : "border-titanium-border bg-titanium text-titanium-silver hover:text-stark"}`,
											children: [
												"Pending PIN (",
												userStats.pending,
												")"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 691,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)("button", {
											type: "button",
											onClick: () => setUserFilter("activeLicense"),
											className: `rounded-lg px-3 py-1.5 text-xs font-mono transition-colors border ${userFilter === "activeLicense" ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400" : "border-titanium-border bg-titanium text-titanium-silver hover:text-stark"}`,
											children: [
												"Active Licenses (",
												userStats.activeLicenses,
												")"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 694,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 684,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 678,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "overflow-hidden rounded-xl border border-titanium-border bg-titanium shadow-sm",
								children: /* @__PURE__ */ (void 0)("div", {
									className: "overflow-x-auto",
									children: /* @__PURE__ */ (void 0)("table", {
										className: "w-full text-left text-xs",
										children: [/* @__PURE__ */ (void 0)("thead", {
											className: "border-b border-titanium-border bg-titanium-elevated font-mono text-[11px] uppercase tracking-wider text-titanium-silver",
											children: /* @__PURE__ */ (void 0)("tr", { children: [
												/* @__PURE__ */ (void 0)("th", {
													className: "px-5 py-3.5",
													children: "User Identity"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 706,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ (void 0)("th", {
													className: "px-4 py-3.5",
													children: "Auth Provider"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 707,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ (void 0)("th", {
													className: "px-4 py-3.5",
													children: "Verification Status"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 708,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ (void 0)("th", {
													className: "px-4 py-3.5",
													children: "Software License"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 709,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ (void 0)("th", {
													className: "px-4 py-3.5",
													children: "Subscription Tier"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 710,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ (void 0)("th", {
													className: "px-4 py-3.5",
													children: "Tokens Burned"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 711,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ (void 0)("th", {
													className: "px-4 py-3.5",
													children: "Usage Quota"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 712,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ (void 0)("th", {
													className: "px-5 py-3.5 text-right",
													children: "Admin Actions"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 713,
													columnNumber: 23
												}, this)
											] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 705,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 704,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("tbody", {
											className: "divide-y divide-titanium-border font-sans",
											children: filteredUsers.length === 0 ? /* @__PURE__ */ (void 0)("tr", { children: /* @__PURE__ */ (void 0)("td", {
												colSpan: 8,
												className: "px-5 py-12 text-center text-titanium-silver",
												children: usersLoading ? "Loading user accounts..." : "No users match the search filters."
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 718,
												columnNumber: 25
											}, this) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 717,
												columnNumber: 51
											}, this) : filteredUsers.map((u) => /* @__PURE__ */ (void 0)("tr", {
												className: "transition-colors hover:bg-titanium-elevated/60",
												children: [
													/* @__PURE__ */ (void 0)("td", {
														className: "px-5 py-3.5",
														children: /* @__PURE__ */ (void 0)("div", {
															className: "flex items-center gap-3",
															children: [/* @__PURE__ */ (void 0)("div", {
																className: "flex h-8 w-8 items-center justify-center rounded-full bg-titanium-elevated font-mono text-xs font-bold text-stark border border-titanium-border",
																children: u.name ? u.name.charAt(0).toUpperCase() : "U"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 725,
																columnNumber: 31
															}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("div", {
																className: "font-semibold text-stark",
																children: u.name || "Anonymous User"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 729,
																columnNumber: 33
															}, this), /* @__PURE__ */ (void 0)("div", {
																className: "font-mono text-[11px] text-titanium-silver",
																children: u.email
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 730,
																columnNumber: 33
															}, this)] }, void 0, true, {
																fileName: _jsxFileName,
																lineNumber: 728,
																columnNumber: 31
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 724,
															columnNumber: 29
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 723,
														columnNumber: 27
													}, this),
													/* @__PURE__ */ (void 0)("td", {
														className: "px-4 py-3.5",
														children: u.provider === "google" ? /* @__PURE__ */ (void 0)("span", {
															className: "inline-flex items-center gap-1.5 rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 font-mono text-[10px] text-blue-400",
															children: /* @__PURE__ */ (void 0)("span", { children: "Google OAuth" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 738,
																columnNumber: 33
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 737,
															columnNumber: 56
														}, this) : /* @__PURE__ */ (void 0)("span", {
															className: "inline-flex items-center gap-1.5 rounded-md border border-titanium-border bg-titanium-elevated px-2 py-0.5 font-mono text-[10px] text-titanium-silver",
															children: /* @__PURE__ */ (void 0)("span", { children: "Email / Password" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 740,
																columnNumber: 33
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 739,
															columnNumber: 41
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 736,
														columnNumber: 27
													}, this),
													/* @__PURE__ */ (void 0)("td", {
														className: "px-4 py-3.5",
														children: u.isVerified ? /* @__PURE__ */ (void 0)("span", {
															className: "inline-flex items-center gap-1.5 rounded-md border border-emerald/40 bg-emerald/10 px-2 py-0.5 font-mono text-[10px] text-emerald",
															children: [/* @__PURE__ */ (void 0)(CircleCheckBig, { className: "h-3 w-3" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 747,
																columnNumber: 33
															}, this), /* @__PURE__ */ (void 0)("span", { children: "Verified" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 748,
																columnNumber: 33
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 746,
															columnNumber: 45
														}, this) : /* @__PURE__ */ (void 0)("div", {
															className: "flex items-center gap-2",
															children: [/* @__PURE__ */ (void 0)("span", {
																className: "inline-flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-400",
																children: [/* @__PURE__ */ (void 0)(CircleAlert, { className: "h-3 w-3" }, void 0, false, {
																	fileName: _jsxFileName,
																	lineNumber: 751,
																	columnNumber: 35
																}, this), /* @__PURE__ */ (void 0)("span", { children: "Pending PIN" }, void 0, false, {
																	fileName: _jsxFileName,
																	lineNumber: 752,
																	columnNumber: 35
																}, this)]
															}, void 0, true, {
																fileName: _jsxFileName,
																lineNumber: 750,
																columnNumber: 33
															}, this), /* @__PURE__ */ (void 0)("button", {
																type: "button",
																onClick: () => handleToggleUserVerify(u.id, false),
																className: "rounded border border-titanium-border bg-titanium-elevated px-2 py-0.5 font-mono text-[10px] text-stark hover:border-emerald hover:text-emerald transition-colors",
																title: "Manually verify and accept user",
																children: "Accept Now"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 754,
																columnNumber: 33
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 749,
															columnNumber: 41
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 745,
														columnNumber: 27
													}, this),
													/* @__PURE__ */ (void 0)("td", {
														className: "px-4 py-3.5",
														children: u.licenseKey ? /* @__PURE__ */ (void 0)("div", {
															className: "flex items-center gap-2",
															children: [
																/* @__PURE__ */ (void 0)("div", {
																	className: "flex items-center gap-1 rounded bg-titanium-elevated px-2 py-1 font-mono text-[11px] text-stark border border-titanium-border",
																	children: [/* @__PURE__ */ (void 0)(Key, { className: "h-3 w-3 text-titanium-silver" }, void 0, false, {
																		fileName: _jsxFileName,
																		lineNumber: 764,
																		columnNumber: 35
																	}, this), /* @__PURE__ */ (void 0)("span", { children: u.licenseKey }, void 0, false, {
																		fileName: _jsxFileName,
																		lineNumber: 765,
																		columnNumber: 35
																	}, this)]
																}, void 0, true, {
																	fileName: _jsxFileName,
																	lineNumber: 763,
																	columnNumber: 33
																}, this),
																/* @__PURE__ */ (void 0)("button", {
																	type: "button",
																	onClick: () => handleCopyLicenseKey(u.licenseKey, u.id),
																	className: "rounded p-1 text-titanium-silver hover:text-stark",
																	title: "Copy license key",
																	children: copiedKeyId === u.id ? /* @__PURE__ */ (void 0)(Check, { className: "h-3.5 w-3.5 text-emerald" }, void 0, false, {
																		fileName: _jsxFileName,
																		lineNumber: 768,
																		columnNumber: 59
																	}, this) : /* @__PURE__ */ (void 0)(Copy, { className: "h-3.5 w-3.5" }, void 0, false, {
																		fileName: _jsxFileName,
																		lineNumber: 768,
																		columnNumber: 108
																	}, this)
																}, void 0, false, {
																	fileName: _jsxFileName,
																	lineNumber: 767,
																	columnNumber: 33
																}, this),
																/* @__PURE__ */ (void 0)("button", {
																	type: "button",
																	onClick: () => handleToggleLicenseActive(u.id, u.licenseActive),
																	className: `rounded px-1.5 py-0.5 font-mono text-[10px] transition-colors ${u.licenseActive ? "bg-emerald/15 text-emerald border border-emerald/40" : "bg-zinc-800 text-zinc-400 border border-zinc-700"}`,
																	title: "Toggle license active status",
																	children: u.licenseActive ? "Active" : "Revoked"
																}, void 0, false, {
																	fileName: _jsxFileName,
																	lineNumber: 770,
																	columnNumber: 33
																}, this)
															]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 762,
															columnNumber: 45
														}, this) : /* @__PURE__ */ (void 0)("span", {
															className: "font-mono text-[11px] text-titanium-silver",
															children: "No key issued"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 773,
															columnNumber: 40
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 761,
														columnNumber: 27
													}, this),
													/* @__PURE__ */ (void 0)("td", {
														className: "px-4 py-3.5",
														children: /* @__PURE__ */ (void 0)("select", {
															value: u.tier || "free",
															onChange: (e) => handleChangeTier(u.id, e.target.value),
															className: "rounded-lg border border-titanium-border bg-titanium-elevated px-2.5 py-1 font-mono text-xs text-stark focus:border-emerald focus:outline-none",
															children: [
																/* @__PURE__ */ (void 0)("option", {
																	value: "free",
																	children: "Free Tier"
																}, void 0, false, {
																	fileName: _jsxFileName,
																	lineNumber: 779,
																	columnNumber: 31
																}, this),
																/* @__PURE__ */ (void 0)("option", {
																	value: "pro",
																	children: "Pro ($29/mo)"
																}, void 0, false, {
																	fileName: _jsxFileName,
																	lineNumber: 780,
																	columnNumber: 31
																}, this),
																/* @__PURE__ */ (void 0)("option", {
																	value: "enterprise",
																	children: "Enterprise"
																}, void 0, false, {
																	fileName: _jsxFileName,
																	lineNumber: 781,
																	columnNumber: 31
																}, this)
															]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 778,
															columnNumber: 29
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 777,
														columnNumber: 27
													}, this),
													/* @__PURE__ */ (void 0)("td", {
														className: "px-4 py-3.5",
														children: [/* @__PURE__ */ (void 0)("div", {
															className: "font-mono text-xs font-semibold text-stark flex items-center gap-1.5",
															children: [/* @__PURE__ */ (void 0)(Zap, { className: "h-3 w-3 text-amber-400" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 788,
																columnNumber: 31
															}, this), /* @__PURE__ */ (void 0)("span", { children: (u.tokenQuota?.usedTokens || 0).toLocaleString() }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 789,
																columnNumber: 31
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 787,
															columnNumber: 29
														}, this), /* @__PURE__ */ (void 0)("div", {
															className: "font-mono text-[10px] text-titanium-silver",
															children: [
																"P: ",
																(u.tokenQuota?.promptTokens || 0).toLocaleString(),
																" | C: ",
																(u.tokenQuota?.completionTokens || 0).toLocaleString()
															]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 791,
															columnNumber: 29
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 786,
														columnNumber: 27
													}, this),
													/* @__PURE__ */ (void 0)("td", {
														className: "px-4 py-3.5 font-mono text-[11px] text-titanium-silver",
														children: u.tier === "enterprise" ? "Unlimited" : u.tier === "pro" ? "5,000 / mo" : `${u.usageQuota || 100} / mo`
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 797,
														columnNumber: 27
													}, this),
													/* @__PURE__ */ (void 0)("td", {
														className: "px-5 py-3.5 text-right",
														children: /* @__PURE__ */ (void 0)("div", {
															className: "flex items-center justify-end gap-2",
															children: /* @__PURE__ */ (void 0)("button", {
																type: "button",
																onClick: () => handleToggleUserVerify(u.id, u.isVerified),
																className: `rounded px-2 py-1 font-mono text-[10px] transition-colors ${u.isVerified ? "text-titanium-silver hover:text-rose-400" : "text-emerald hover:underline"}`,
																children: u.isVerified ? "Revoke Verify" : "Verify User"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 804,
																columnNumber: 31
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 803,
															columnNumber: 29
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 802,
														columnNumber: 27
													}, this)
												]
											}, u.id, true, {
												fileName: _jsxFileName,
												lineNumber: 721,
												columnNumber: 54
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 716,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 703,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 702,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 701,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 588,
						columnNumber: 34
					}, this),
					adminTab === "leads" && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [
						/* @__PURE__ */ (void 0)("section", {
							className: "mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
									children: [
										/* @__PURE__ */ (void 0)("div", {
											className: "flex items-center justify-between text-titanium-silver",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "font-mono text-xs uppercase tracking-wider",
												children: "Total Leads"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 825,
												columnNumber: 15
											}, this), /* @__PURE__ */ (void 0)(Users, { className: "h-4 w-4 text-titanium-silver" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 826,
												columnNumber: 15
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 824,
											columnNumber: 13
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "mt-3 font-mono text-2xl font-bold text-stark",
											children: stats ? stats.totalLeads : leads.length
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 828,
											columnNumber: 13
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "mt-1 flex items-center gap-1.5 font-mono text-[11px] text-emerald",
											children: [/* @__PURE__ */ (void 0)(TrendingUp, { className: "h-3 w-3" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 832,
												columnNumber: 15
											}, this), /* @__PURE__ */ (void 0)("span", { children: "+14% this week" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 833,
												columnNumber: 15
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 831,
											columnNumber: 13
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 823,
									columnNumber: 11
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
									children: [
										/* @__PURE__ */ (void 0)("div", {
											className: "flex items-center justify-between text-titanium-silver",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "font-mono text-xs uppercase tracking-wider",
												children: "Pipeline Value"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 840,
												columnNumber: 15
											}, this), /* @__PURE__ */ (void 0)(DollarSign, { className: "h-4 w-4 text-emerald" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 841,
												columnNumber: 15
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 839,
											columnNumber: 13
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "mt-3 font-mono text-2xl font-bold text-stark",
											children: ["$", (stats?.totalPipelineValue ?? stats?.pipelineValue ?? 0).toLocaleString()]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 843,
											columnNumber: 13
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "mt-1 font-mono text-[11px] text-titanium-silver",
											children: "ARR expansion projection"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 846,
											columnNumber: 13
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 838,
									columnNumber: 11
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
									children: [
										/* @__PURE__ */ (void 0)("div", {
											className: "flex items-center justify-between text-titanium-silver",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "font-mono text-xs uppercase tracking-wider",
												children: "Win Rate"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 854,
												columnNumber: 15
											}, this), /* @__PURE__ */ (void 0)(Award, { className: "h-4 w-4 text-amber-400" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 855,
												columnNumber: 15
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 853,
											columnNumber: 13
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "mt-3 font-mono text-2xl font-bold text-stark",
											children: stats ? `${stats.conversionRate ?? 0}%` : "0%"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 857,
											columnNumber: 13
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "mt-1 font-mono text-[11px] text-titanium-silver",
											children: "Trial to paid velocity"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 860,
											columnNumber: 13
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 852,
									columnNumber: 11
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
									children: [
										/* @__PURE__ */ (void 0)("div", {
											className: "flex items-center justify-between text-titanium-silver",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "font-mono text-xs uppercase tracking-wider",
												children: "Qualified Leads"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 868,
												columnNumber: 15
											}, this), /* @__PURE__ */ (void 0)(CircleCheckBig, { className: "h-4 w-4 text-cyan-400" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 869,
												columnNumber: 15
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 867,
											columnNumber: 13
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "mt-3 font-mono text-2xl font-bold text-stark",
											children: stats ? stats.qualifiedLeads ?? stats.leadsByStatus?.["Qualified"] ?? 0 : 0
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 871,
											columnNumber: 13
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "mt-1 font-mono text-[11px] text-cyan-400",
											children: "High intent builders"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 874,
											columnNumber: 13
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 866,
									columnNumber: 11
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
									children: [
										/* @__PURE__ */ (void 0)("div", {
											className: "flex items-center justify-between text-titanium-silver",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "font-mono text-xs uppercase tracking-wider",
												children: "Active Pro Trials"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 880,
												columnNumber: 15
											}, this), /* @__PURE__ */ (void 0)(Clock, { className: "h-4 w-4 text-amber-400" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 881,
												columnNumber: 15
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 879,
											columnNumber: 13
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "mt-3 font-mono text-2xl font-bold text-stark",
											children: stats ? stats.activeTrials ?? stats.proTrials ?? stats.leadsByStatus?.["Pro Trial"] ?? 0 : 0
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 883,
											columnNumber: 13
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "mt-1 font-mono text-[11px] text-amber-400",
											children: "In-app activation"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 886,
											columnNumber: 13
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 878,
									columnNumber: 11
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 821,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("section", {
							className: "mb-8 rounded-xl border border-titanium-border bg-titanium p-5",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "mb-3 flex items-center justify-between",
									children: /* @__PURE__ */ (void 0)("h2", {
										className: "font-mono text-xs uppercase tracking-wider text-titanium-silver",
										children: "Pipeline Funnel Velocity"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 893,
										columnNumber: 13
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 892,
									columnNumber: 11
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "flex h-2.5 w-full overflow-hidden rounded-full bg-titanium-elevated",
									children: ALL_STAGES.map((stg) => {
										const count = stageCounts[stg] || 0;
										const pct = leads.length > 0 ? count / leads.length * 100 : 0;
										if (pct === 0) return null;
										let bg = "bg-titanium-silver";
										if (stg === "Closed Won") bg = "bg-emerald";
										if (stg === "Enterprise Pilot") bg = "bg-purple-500";
										if (stg === "Pro Trial") bg = "bg-amber-500";
										if (stg === "Qualified") bg = "bg-cyan-500";
										if (stg === "Contacted") bg = "bg-blue-500";
										if (stg === "Lost") bg = "bg-zinc-700";
										return /* @__PURE__ */ (void 0)("div", {
											style: { width: `${pct}%` },
											className: `${bg} transition-all duration-300`,
											title: `${stg}: ${count} leads (${pct.toFixed(0)}%)`
										}, stg, false, {
											fileName: _jsxFileName,
											lineNumber: 910,
											columnNumber: 22
										}, this);
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 898,
									columnNumber: 11
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "mt-3 flex flex-wrap gap-4 pt-1 font-mono text-[11px]",
									children: ALL_STAGES.map((stg) => {
										const count = stageCounts[stg] || 0;
										return /* @__PURE__ */ (void 0)("button", {
											type: "button",
											onClick: () => setSelectedStage(selectedStage === stg ? "All" : stg),
											className: `flex items-center gap-1.5 transition-colors ${selectedStage === stg ? "text-stark font-semibold" : "text-titanium-silver hover:text-stark"}`,
											children: [/* @__PURE__ */ (void 0)("span", { className: `h-2 w-2 rounded-full ${stg === "Closed Won" ? "bg-emerald" : stg === "Enterprise Pilot" ? "bg-purple-500" : stg === "Pro Trial" ? "bg-amber-500" : stg === "Qualified" ? "bg-cyan-500" : stg === "Contacted" ? "bg-blue-500" : stg === "Lost" ? "bg-zinc-700" : "bg-titanium-silver"}` }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 920,
												columnNumber: 19
											}, this), /* @__PURE__ */ (void 0)("span", { children: [
												stg,
												" (",
												count,
												")"
											] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 921,
												columnNumber: 19
											}, this)]
										}, stg, true, {
											fileName: _jsxFileName,
											lineNumber: 919,
											columnNumber: 22
										}, this);
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 916,
									columnNumber: 11
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 891,
							columnNumber: 9
						}, this),
						/* @__PURE__ */ (void 0)("section", {
							className: "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "relative flex-1 max-w-md",
								children: [/* @__PURE__ */ (void 0)(Search, { className: "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-titanium-silver" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 933,
									columnNumber: 13
								}, this), /* @__PURE__ */ (void 0)("input", {
									type: "text",
									placeholder: "Search leads by name, email, company, notes...",
									value: searchQuery,
									onChange: (e) => setSearchQuery(e.target.value),
									className: "w-full rounded-xl border border-titanium-border bg-titanium pl-10 pr-4 py-2 text-xs text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 934,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 932,
								columnNumber: 11
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (void 0)("select", {
									value: selectedStage,
									onChange: (e) => setSelectedStage(e.target.value),
									className: "rounded-xl border border-titanium-border bg-titanium px-3 py-2 font-mono text-xs text-stark focus:border-emerald focus:outline-none",
									children: [/* @__PURE__ */ (void 0)("option", {
										value: "All",
										children: [
											"All Stages (",
											leads.length,
											")"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 940,
										columnNumber: 15
									}, this), ALL_STAGES.map((s) => /* @__PURE__ */ (void 0)("option", {
										value: s,
										children: [
											s,
											" (",
											stageCounts[s] || 0,
											")"
										]
									}, s, true, {
										fileName: _jsxFileName,
										lineNumber: 941,
										columnNumber: 36
									}, this))]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 939,
									columnNumber: 13
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "flex rounded-xl border border-titanium-border bg-titanium p-0.5",
									children: [/* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: () => setViewMode("table"),
										className: `rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${viewMode === "table" ? "bg-titanium-elevated text-stark font-semibold" : "text-titanium-silver hover:text-stark"}`,
										children: "Table"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 947,
										columnNumber: 15
									}, this), /* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: () => setViewMode("kanban"),
										className: `rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${viewMode === "kanban" ? "bg-titanium-elevated text-stark font-semibold" : "text-titanium-silver hover:text-stark"}`,
										children: "Cards"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 950,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 946,
									columnNumber: 13
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 938,
								columnNumber: 11
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 930,
							columnNumber: 9
						}, this),
						viewMode === "table" && /* @__PURE__ */ (void 0)("div", {
							className: "overflow-hidden rounded-xl border border-titanium-border bg-titanium shadow-sm",
							children: /* @__PURE__ */ (void 0)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (void 0)("table", {
									className: "w-full text-left text-xs",
									children: [/* @__PURE__ */ (void 0)("thead", {
										className: "border-b border-titanium-border bg-titanium-elevated font-mono text-[11px] uppercase tracking-wider text-titanium-silver",
										children: /* @__PURE__ */ (void 0)("tr", { children: [
											/* @__PURE__ */ (void 0)("th", {
												className: "px-5 py-3.5",
												children: "Lead / Contact"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 963,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("th", {
												className: "px-4 py-3.5",
												children: "Company & Role"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 964,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("th", {
												className: "px-4 py-3.5",
												children: "Pipeline Stage"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 965,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("th", {
												className: "px-4 py-3.5",
												children: "Deal Value"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 966,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("th", {
												className: "px-4 py-3.5",
												children: "Score"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 967,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("th", {
												className: "px-4 py-3.5",
												children: "Last Touch"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 968,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("th", {
												className: "px-5 py-3.5 text-right",
												children: "Actions"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 969,
												columnNumber: 21
											}, this)
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 962,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 961,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("tbody", {
										className: "divide-y divide-titanium-border font-sans",
										children: filteredLeads.length === 0 ? /* @__PURE__ */ (void 0)("tr", { children: /* @__PURE__ */ (void 0)("td", {
											colSpan: 7,
											className: "px-5 py-12 text-center text-titanium-silver",
											children: "No leads match the active search and stage criteria."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 974,
											columnNumber: 23
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 973,
											columnNumber: 49
										}, this) : filteredLeads.map((lead) => /* @__PURE__ */ (void 0)("tr", {
											className: "transition-colors hover:bg-titanium-elevated/60",
											children: [
												/* @__PURE__ */ (void 0)("td", {
													className: "px-5 py-3.5",
													children: [/* @__PURE__ */ (void 0)("div", {
														className: "font-semibold text-stark",
														children: lead.name
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 980,
														columnNumber: 27
													}, this), /* @__PURE__ */ (void 0)("div", {
														className: "font-mono text-[11px] text-titanium-silver",
														children: lead.email
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 981,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 979,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("td", {
													className: "px-4 py-3.5",
													children: [/* @__PURE__ */ (void 0)("div", {
														className: "text-stark font-medium",
														children: lead.company
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 988,
														columnNumber: 27
													}, this), /* @__PURE__ */ (void 0)("div", {
														className: "text-[11px] text-titanium-silver truncate max-w-[180px]",
														children: lead.useCase || "Developer Workstation"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 989,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 987,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("td", {
													className: "px-4 py-3.5",
													children: /* @__PURE__ */ (void 0)("select", {
														value: lead.stage,
														onChange: (e) => handleStageChange(lead.id, e.target.value),
														className: `rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors focus:outline-none ${getStageBadgeClass(lead.stage)}`,
														children: ALL_STAGES.map((s) => /* @__PURE__ */ (void 0)("option", {
															value: s,
															className: "bg-titanium text-stark",
															children: s
														}, s, false, {
															fileName: _jsxFileName,
															lineNumber: 997,
															columnNumber: 50
														}, this))
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 996,
														columnNumber: 27
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 995,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("td", {
													className: "px-4 py-3.5 font-mono font-medium text-stark",
													children: ["$", (lead.dealValue ?? lead.value ?? 0).toLocaleString()]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1004,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("td", {
													className: "px-4 py-3.5",
													children: /* @__PURE__ */ (void 0)("div", {
														className: "flex items-center gap-1.5 font-mono text-[11px]",
														children: [/* @__PURE__ */ (void 0)("span", { className: `h-2 w-2 rounded-full ${lead.score >= 85 ? "bg-emerald" : lead.score >= 70 ? "bg-amber-400" : "bg-titanium-silver"}` }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1011,
															columnNumber: 29
														}, this), /* @__PURE__ */ (void 0)("span", { children: [lead.score, "/100"] }, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 1012,
															columnNumber: 29
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 1010,
														columnNumber: 27
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1009,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("td", {
													className: "px-4 py-3.5 font-mono text-[11px] text-titanium-silver whitespace-nowrap",
													children: lead.lastContacted || lead.createdAt?.slice(0, 10)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1017,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (void 0)("td", {
													className: "px-5 py-3.5 text-right",
													children: /* @__PURE__ */ (void 0)("div", {
														className: "flex items-center justify-end gap-2",
														children: [/* @__PURE__ */ (void 0)("button", {
															type: "button",
															onClick: () => {
																setActiveLead(lead);
																setIsDetailModalOpen(true);
															},
															className: "rounded-lg border border-titanium-border bg-titanium-elevated px-2.5 py-1 font-mono text-[11px] text-titanium-silver hover:text-stark hover:border-titanium-silver/40",
															title: "Inspect lead details",
															children: "Details"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1024,
															columnNumber: 29
														}, this), /* @__PURE__ */ (void 0)("button", {
															type: "button",
															onClick: () => handleDeleteLead(lead.id),
															className: "rounded-lg p-1 text-titanium-silver hover:text-rose-400",
															title: "Delete lead",
															children: /* @__PURE__ */ (void 0)(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 1031,
																columnNumber: 31
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1030,
															columnNumber: 29
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 1023,
														columnNumber: 27
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1022,
													columnNumber: 25
												}, this)
											]
										}, lead.id, true, {
											fileName: _jsxFileName,
											lineNumber: 977,
											columnNumber: 55
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 972,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 960,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 959,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 958,
							columnNumber: 34
						}, this),
						viewMode === "kanban" && /* @__PURE__ */ (void 0)("div", {
							className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
							children: filteredLeads.map((lead) => /* @__PURE__ */ (void 0)("div", {
								className: "flex flex-col justify-between rounded-xl border border-titanium-border bg-titanium p-5 transition-all hover:border-titanium-border/80",
								children: [/* @__PURE__ */ (void 0)("div", { children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "flex items-start justify-between",
										children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
											className: "font-semibold text-stark",
											children: lead.name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1047,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)("p", {
											className: "font-mono text-xs text-titanium-silver",
											children: lead.email
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1048,
											columnNumber: 23
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1046,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: `rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold ${getStageBadgeClass(lead.stage)}`,
											children: lead.stage
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1050,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1045,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "mt-4 flex flex-col gap-2 rounded-lg border border-titanium-border bg-titanium-elevated p-3 text-xs",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "flex justify-between",
												children: [/* @__PURE__ */ (void 0)("span", {
													className: "text-titanium-silver",
													children: "Company:"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1057,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("span", {
													className: "font-medium text-stark",
													children: lead.company
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1058,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1056,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "flex justify-between",
												children: [/* @__PURE__ */ (void 0)("span", {
													className: "text-titanium-silver",
													children: "Deal Value:"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1061,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("span", {
													className: "font-mono font-medium text-stark",
													children: ["$", (lead.dealValue ?? lead.value ?? 0).toLocaleString()]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1062,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1060,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "flex justify-between",
												children: [/* @__PURE__ */ (void 0)("span", {
													className: "text-titanium-silver",
													children: "Lead Score:"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1067,
													columnNumber: 23
												}, this), /* @__PURE__ */ (void 0)("span", {
													className: "font-mono font-semibold text-emerald",
													children: [lead.score, "/100"]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1068,
													columnNumber: 23
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1066,
												columnNumber: 21
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1055,
										columnNumber: 19
									}, this),
									lead.notes && /* @__PURE__ */ (void 0)("p", {
										className: "mt-3 line-clamp-2 text-xs text-titanium-silver italic",
										children: [
											"\"",
											lead.notes,
											"\""
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1072,
										columnNumber: 34
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1044,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "mt-5 flex items-center justify-between pt-3 border-t border-titanium-border",
									children: [/* @__PURE__ */ (void 0)("select", {
										value: lead.stage,
										onChange: (e) => handleStageChange(lead.id, e.target.value),
										className: "rounded-md border border-titanium-border bg-titanium px-2 py-1 font-mono text-[10px] text-stark focus:outline-none",
										children: ALL_STAGES.map((s) => /* @__PURE__ */ (void 0)("option", {
											value: s,
											children: ["Move: ", s]
										}, s, true, {
											fileName: _jsxFileName,
											lineNumber: 1079,
											columnNumber: 42
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1078,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (void 0)("button", {
											type: "button",
											onClick: () => {
												setActiveLead(lead);
												setIsDetailModalOpen(true);
											},
											className: "font-mono text-xs text-titanium-silver hover:text-stark",
											children: "Inspect"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1085,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("button", {
											type: "button",
											onClick: () => handleDeleteLead(lead.id),
											className: "text-titanium-silver hover:text-rose-400",
											children: /* @__PURE__ */ (void 0)(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1092,
												columnNumber: 23
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1091,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1084,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1077,
									columnNumber: 17
								}, this)]
							}, lead.id, true, {
								fileName: _jsxFileName,
								lineNumber: 1043,
								columnNumber: 40
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1042,
							columnNumber: 35
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 819,
						columnNumber: 34
					}, this),
					adminTab === "telemetry" && /* @__PURE__ */ (void 0)("div", {
						className: "flex flex-col gap-6",
						children: /* @__PURE__ */ (void 0)("div", {
							className: "rounded-xl border border-titanium-border bg-titanium p-6",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "flex items-center justify-between border-b border-titanium-border pb-4",
									children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h2", {
										className: "font-mono text-sm font-bold uppercase tracking-wider text-stark",
										children: "System Health & Infrastructure Telemetry"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1107,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("p", {
										className: "mt-1 text-xs text-titanium-silver",
										children: "Live telemetry for database replica sets, Nodemailer SMTP transport, and desktop license gates."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1110,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1106,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (void 0)("span", { className: "flex h-2.5 w-2.5 rounded-full bg-emerald animate-pulse" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1115,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "font-mono text-xs font-semibold text-emerald",
											children: "ONLINE & OPERATIONAL"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1116,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1114,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1105,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5",
									children: [
										/* @__PURE__ */ (void 0)("div", {
											className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
											children: [
												/* @__PURE__ */ (void 0)("div", {
													className: "flex items-center justify-between text-titanium-silver",
													children: [/* @__PURE__ */ (void 0)("span", {
														className: "font-mono text-xs uppercase",
														children: "Primary Database"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1124,
														columnNumber: 21
													}, this), /* @__PURE__ */ (void 0)(Database, { className: "h-4 w-4 text-emerald" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1125,
														columnNumber: 21
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1123,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "mt-2 font-mono text-base font-bold text-stark",
													children: telemetry?.mongoConnected ? "MongoDB Atlas" : "Local Memory (Resilient)"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1127,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "mt-1 font-mono text-[11px] text-titanium-silver truncate",
													children: "cluster0.hbxhsws.mongodb.net"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1130,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "mt-3 flex items-center gap-1.5 font-mono text-[10px] text-emerald",
													children: [/* @__PURE__ */ (void 0)(CircleCheckBig, { className: "h-3 w-3" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1134,
														columnNumber: 21
													}, this), /* @__PURE__ */ (void 0)("span", { children: "Replica Set Connected" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1135,
														columnNumber: 21
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1133,
													columnNumber: 19
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1122,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
											children: [
												/* @__PURE__ */ (void 0)("div", {
													className: "flex items-center justify-between text-titanium-silver",
													children: [/* @__PURE__ */ (void 0)("span", {
														className: "font-mono text-xs uppercase",
														children: "Fleet Token Burn"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1142,
														columnNumber: 21
													}, this), /* @__PURE__ */ (void 0)(Zap, { className: "h-4 w-4 text-amber-400" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1143,
														columnNumber: 21
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1141,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "mt-2 font-mono text-base font-bold text-amber-400",
													children: [
														userStats.totalTokensBurned.toLocaleString(),
														" ",
														/* @__PURE__ */ (void 0)("span", {
															className: "text-xs text-stark font-normal",
															children: "tokens"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 1146,
															columnNumber: 68
														}, this)
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1145,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "mt-1 font-mono text-[11px] text-titanium-silver",
													children: [userStats.activeLicenses, " active workstations"]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1148,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "mt-3 flex items-center gap-1.5 font-mono text-[10px] text-amber-400",
													children: [/* @__PURE__ */ (void 0)(Activity, { className: "h-3 w-3" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1152,
														columnNumber: 21
													}, this), /* @__PURE__ */ (void 0)("span", { children: "Live Desktop REST Stream" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1153,
														columnNumber: 21
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1151,
													columnNumber: 19
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1140,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
											children: [
												/* @__PURE__ */ (void 0)("div", {
													className: "flex items-center justify-between text-titanium-silver",
													children: [/* @__PURE__ */ (void 0)("span", {
														className: "font-mono text-xs uppercase",
														children: "Email Dispatch"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1160,
														columnNumber: 21
													}, this), /* @__PURE__ */ (void 0)(Mail, { className: "h-4 w-4 text-cyan-400" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1161,
														columnNumber: 21
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1159,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "mt-2 font-mono text-base font-bold text-stark",
													children: "Nodemailer SMTP"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1163,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "mt-1 font-mono text-[11px] text-titanium-silver",
													children: "TLS 587 Gateway"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1166,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "mt-3 flex items-center gap-1.5 font-mono text-[10px] text-cyan-400",
													children: [/* @__PURE__ */ (void 0)(CircleCheckBig, { className: "h-3 w-3" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1170,
														columnNumber: 21
													}, this), /* @__PURE__ */ (void 0)("span", { children: "PIN & License Delivery" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1171,
														columnNumber: 21
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1169,
													columnNumber: 19
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1158,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
											children: [
												/* @__PURE__ */ (void 0)("div", {
													className: "flex items-center justify-between text-titanium-silver",
													children: [/* @__PURE__ */ (void 0)("span", {
														className: "font-mono text-xs uppercase",
														children: "Software Gate"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1178,
														columnNumber: 21
													}, this), /* @__PURE__ */ (void 0)(Key, { className: "h-4 w-4 text-purple-400" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1179,
														columnNumber: 21
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1177,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "mt-2 font-mono text-base font-bold text-stark",
													children: "/api/license/verify"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1181,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "mt-1 font-mono text-[11px] text-titanium-silver",
													children: "Hardware & Tier Gate"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1184,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "mt-3 flex items-center gap-1.5 font-mono text-[10px] text-purple-400",
													children: [/* @__PURE__ */ (void 0)(Shield, { className: "h-3 w-3" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1188,
														columnNumber: 21
													}, this), /* @__PURE__ */ (void 0)("span", { children: "Cryptographic Verification" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1189,
														columnNumber: 21
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1187,
													columnNumber: 19
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1176,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
											children: [
												/* @__PURE__ */ (void 0)("div", {
													className: "flex items-center justify-between text-titanium-silver",
													children: [/* @__PURE__ */ (void 0)("span", {
														className: "font-mono text-xs uppercase",
														children: "Speech Pipeline"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1196,
														columnNumber: 21
													}, this), /* @__PURE__ */ (void 0)(Activity, { className: "h-4 w-4 text-emerald" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1197,
														columnNumber: 21
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1195,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "mt-2 font-mono text-base font-bold text-stark",
													children: "Low-Latency Hook"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1199,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "mt-1 font-mono text-[11px] text-titanium-silver",
													children: "Zero-Focus Steal Native"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1202,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (void 0)("div", {
													className: "mt-3 flex items-center gap-1.5 font-mono text-[10px] text-emerald",
													children: [/* @__PURE__ */ (void 0)(CircleCheckBig, { className: "h-3 w-3" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1206,
														columnNumber: 21
													}, this), /* @__PURE__ */ (void 0)("span", { children: "Average Latency < 350ms" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1207,
														columnNumber: 21
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 1205,
													columnNumber: 19
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1194,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1120,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", {
									className: "mt-6 rounded-xl border border-titanium-border bg-titanium-elevated p-5",
									children: [/* @__PURE__ */ (void 0)("h3", {
										className: "font-mono text-xs font-semibold uppercase text-titanium-silver",
										children: "Active Database Collections & Architecture"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1214,
										columnNumber: 17
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4 font-mono text-xs",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-lg border border-titanium-border bg-titanium p-3",
												children: [
													/* @__PURE__ */ (void 0)("div", {
														className: "text-[10px] uppercase text-titanium-silver",
														children: "Collection"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1219,
														columnNumber: 21
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "font-bold text-stark mt-0.5",
														children: "users"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1220,
														columnNumber: 21
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "text-[10px] text-emerald mt-1",
														children: [users.length, " documents"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 1221,
														columnNumber: 21
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1218,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-lg border border-titanium-border bg-titanium p-3",
												children: [
													/* @__PURE__ */ (void 0)("div", {
														className: "text-[10px] uppercase text-titanium-silver",
														children: "Collection"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1224,
														columnNumber: 21
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "font-bold text-stark mt-0.5",
														children: "leads"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1225,
														columnNumber: 21
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "text-[10px] text-cyan-400 mt-1",
														children: [leads.length, " documents"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 1226,
														columnNumber: 21
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1223,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-lg border border-titanium-border bg-titanium p-3",
												children: [
													/* @__PURE__ */ (void 0)("div", {
														className: "text-[10px] uppercase text-titanium-silver",
														children: "Release"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1229,
														columnNumber: 21
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "font-bold text-stark mt-0.5",
														children: "v1.0.0 Production"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1230,
														columnNumber: 21
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "text-[10px] text-titanium-silver mt-1",
														children: "Desktop Suite Active"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1231,
														columnNumber: 21
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1228,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (void 0)("div", {
												className: "rounded-lg border border-titanium-border bg-titanium p-3",
												children: [
													/* @__PURE__ */ (void 0)("div", {
														className: "text-[10px] uppercase text-titanium-silver",
														children: "Uptime"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1234,
														columnNumber: 21
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "font-bold text-stark mt-0.5",
														children: telemetry?.uptime ? `${Math.floor(telemetry.uptime / 60)} mins` : "Live"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1235,
														columnNumber: 21
													}, this),
													/* @__PURE__ */ (void 0)("div", {
														className: "text-[10px] text-emerald mt-1",
														children: "100% SLA"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 1238,
														columnNumber: 21
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1233,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1217,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1213,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1104,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1103,
						columnNumber: 38
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 584,
				columnNumber: 7
			}, this),
			isDetailModalOpen && activeLead && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "w-full max-w-lg rounded-2xl border border-titanium-border bg-titanium p-6 shadow-2xl",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "flex items-start justify-between border-b border-titanium-border pb-4",
						children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
							className: "text-base font-bold text-stark",
							children: activeLead.name
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1254,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)("p", {
							className: "font-mono text-xs text-titanium-silver",
							children: activeLead.email
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1255,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1253,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: () => setIsDetailModalOpen(false),
							className: "text-titanium-silver hover:text-stark",
							children: "✕"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1257,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1252,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("div", {
						className: "mt-4 flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (void 0)("div", {
								className: "grid grid-cols-2 gap-3 text-xs",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium-elevated p-3",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "text-titanium-silver font-mono text-[10px] uppercase",
											children: "Company"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1265,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "font-semibold text-stark mt-0.5",
											children: activeLead.company
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1268,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1264,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium-elevated p-3",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "text-titanium-silver font-mono text-[10px] uppercase",
											children: "Pipeline Value"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1271,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "font-mono font-semibold text-stark mt-0.5",
											children: ["$", (activeLead.dealValue ?? activeLead.value ?? 0).toLocaleString()]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1274,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1270,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium-elevated p-3",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "text-titanium-silver font-mono text-[10px] uppercase",
											children: "Stage"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1279,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "font-mono font-semibold text-emerald mt-0.5",
											children: activeLead.stage
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1280,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1278,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium-elevated p-3",
										children: [/* @__PURE__ */ (void 0)("div", {
											className: "text-titanium-silver font-mono text-[10px] uppercase",
											children: "Lead Score"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1285,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "font-mono font-semibold text-stark mt-0.5",
											children: [activeLead.score, "/100"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1288,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1284,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1263,
								columnNumber: 15
							}, this),
							activeLead.useCase && /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("div", {
								className: "font-mono text-[11px] text-titanium-silver uppercase",
								children: "Environment & Workflow"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1295,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "mt-1 rounded-xl border border-titanium-border bg-titanium-elevated p-3 text-xs text-stark",
								children: activeLead.useCase
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1298,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1294,
								columnNumber: 38
							}, this),
							activeLead.notes && /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("div", {
								className: "font-mono text-[11px] text-titanium-silver uppercase",
								children: "Executive Notes & Logs"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1304,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "mt-1 rounded-xl border border-titanium-border bg-titanium-elevated p-3 text-xs text-titanium-silver leading-relaxed",
								children: activeLead.notes
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1307,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1303,
								columnNumber: 36
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "pt-2 flex justify-between items-center border-t border-titanium-border",
								children: [/* @__PURE__ */ (void 0)("span", {
									className: "font-mono text-[10px] text-titanium-silver",
									children: ["Recorded: ", activeLead.createdAt || "Live Session"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1313,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("button", {
									type: "button",
									onClick: () => setIsDetailModalOpen(false),
									className: "rounded-lg bg-stark px-4 py-2 text-xs font-semibold text-obsidian hover:bg-white",
									children: "Close"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1316,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1312,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1262,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1251,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1250,
				columnNumber: 43
			}, this),
			isAddModalOpen && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "w-full max-w-lg rounded-2xl border border-titanium-border bg-titanium p-6 shadow-2xl",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "flex items-center justify-between border-b border-titanium-border pb-4",
						children: [/* @__PURE__ */ (void 0)("h3", {
							className: "font-mono text-sm font-bold text-stark",
							children: "Add New CRM Lead"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1330,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: () => setIsAddModalOpen(false),
							className: "text-titanium-silver hover:text-stark",
							children: "✕"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1331,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1329,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("form", {
						onSubmit: handleCreateLead,
						className: "mt-4 flex flex-col gap-4 text-xs",
						children: [
							/* @__PURE__ */ (void 0)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									className: "mb-1 block font-mono text-[11px] text-titanium-silver",
									children: "Full Name"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1339,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("input", {
									type: "text",
									required: true,
									placeholder: "e.g. Jordan Hayes",
									value: newLeadForm.name,
									onChange: (e) => setNewLeadForm({
										...newLeadForm,
										name: e.target.value
									}),
									className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1342,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1338,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									className: "mb-1 block font-mono text-[11px] text-titanium-silver",
									children: "Work Email"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1348,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("input", {
									type: "email",
									required: true,
									placeholder: "jordan@company.com",
									value: newLeadForm.email,
									onChange: (e) => setNewLeadForm({
										...newLeadForm,
										email: e.target.value
									}),
									className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1351,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1347,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1337,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									className: "mb-1 block font-mono text-[11px] text-titanium-silver",
									children: "Company"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1360,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("input", {
									type: "text",
									placeholder: "e.g. Stripe, OpenAI, Studio",
									value: newLeadForm.company,
									onChange: (e) => setNewLeadForm({
										...newLeadForm,
										company: e.target.value
									}),
									className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1363,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1359,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									className: "mb-1 block font-mono text-[11px] text-titanium-silver",
									children: "Pipeline Stage"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1369,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("select", {
									value: newLeadForm.stage,
									onChange: (e) => setNewLeadForm({
										...newLeadForm,
										stage: e.target.value
									}),
									className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 font-mono text-stark focus:border-emerald focus:outline-none",
									children: ALL_STAGES.map((s) => /* @__PURE__ */ (void 0)("option", {
										value: s,
										children: s
									}, s, false, {
										fileName: _jsxFileName,
										lineNumber: 1376,
										columnNumber: 42
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1372,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1368,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1358,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									className: "mb-1 block font-mono text-[11px] text-titanium-silver",
									children: "Deal Value ($ ARR)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1385,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("input", {
									type: "number",
									min: "0",
									step: "10",
									value: newLeadForm.value,
									onChange: (e) => setNewLeadForm({
										...newLeadForm,
										value: Number(e.target.value)
									}),
									className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 font-mono text-stark focus:border-emerald focus:outline-none"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1388,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1384,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									className: "mb-1 block font-mono text-[11px] text-titanium-silver",
									children: "Lead Score (1-100)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1394,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("input", {
									type: "number",
									min: "1",
									max: "100",
									value: newLeadForm.score,
									onChange: (e) => setNewLeadForm({
										...newLeadForm,
										score: Number(e.target.value)
									}),
									className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 font-mono text-stark focus:border-emerald focus:outline-none"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1397,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1393,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1383,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "mb-1 block font-mono text-[11px] text-titanium-silver",
								children: "Use Case & Technical Environment"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1405,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("input", {
								type: "text",
								placeholder: "e.g. VS Code, Terminal, CUDA RTX 4090",
								value: newLeadForm.useCase,
								onChange: (e) => setNewLeadForm({
									...newLeadForm,
									useCase: e.target.value
								}),
								className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1408,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1404,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "mb-1 block font-mono text-[11px] text-titanium-silver",
								children: "Discovery Notes"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1415,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("textarea", {
								rows: 3,
								placeholder: "Inquiry notes, follow-up timeline, team size...",
								value: newLeadForm.notes,
								onChange: (e) => setNewLeadForm({
									...newLeadForm,
									notes: e.target.value
								}),
								className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1418,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1414,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "mt-2 flex justify-end gap-2 border-t border-titanium-border pt-4",
								children: [/* @__PURE__ */ (void 0)("button", {
									type: "button",
									onClick: () => setIsAddModalOpen(false),
									className: "rounded-xl border border-titanium-border px-4 py-2 text-titanium-silver hover:text-stark",
									children: "Cancel"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1425,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("button", {
									type: "submit",
									className: "rounded-xl bg-stark px-5 py-2 font-semibold text-obsidian hover:bg-white",
									children: "Create Lead"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1428,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1424,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1336,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1328,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1327,
				columnNumber: 26
			}, this),
			isInviteModalOpen && /* @__PURE__ */ (void 0)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (void 0)("div", {
					className: "w-full max-w-lg rounded-2xl border border-titanium-border bg-titanium p-6 shadow-2xl",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "flex items-center justify-between border-b border-titanium-border pb-4",
						children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
							className: "font-mono text-sm font-bold text-stark",
							children: "Invite Developer & Issue License"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1443,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)("p", {
							className: "mt-0.5 text-xs text-titanium-silver",
							children: "Provisions a new user account and dispatches an automated verification email with an official desktop license key."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1444,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1442,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("button", {
							type: "button",
							onClick: () => setIsInviteModalOpen(false),
							className: "text-titanium-silver hover:text-stark",
							children: "✕"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1448,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1441,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("form", {
						onSubmit: handleInviteUser,
						className: "mt-4 flex flex-col gap-4 text-xs",
						children: [
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "mb-1 block font-mono text-[11px] text-titanium-silver",
								children: "Developer Name"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1455,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("input", {
								type: "text",
								required: true,
								placeholder: "e.g. Jordan Hayes",
								value: inviteForm.name,
								onChange: (e) => setInviteForm({
									...inviteForm,
									name: e.target.value
								}),
								className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1458,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1454,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "mb-1 block font-mono text-[11px] text-titanium-silver",
								children: "Email Address"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1465,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("input", {
								type: "email",
								required: true,
								placeholder: "jordan@company.com",
								value: inviteForm.email,
								onChange: (e) => setInviteForm({
									...inviteForm,
									email: e.target.value
								}),
								className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1468,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1464,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
								className: "mb-1 block font-mono text-[11px] text-titanium-silver",
								children: "Initial Subscription Tier"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1475,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("select", {
								value: inviteForm.tier,
								onChange: (e) => setInviteForm({
									...inviteForm,
									tier: e.target.value
								}),
								className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 font-mono text-stark focus:border-emerald focus:outline-none",
								children: [
									/* @__PURE__ */ (void 0)("option", {
										value: "free",
										children: "Free Tier (100 dictations/mo)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1482,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("option", {
										value: "pro",
										children: "Pro ($29/mo, 5,000 dictations/mo)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1483,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (void 0)("option", {
										value: "enterprise",
										children: "Enterprise (Unlimited, Dedicated SLA)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1484,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1478,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1474,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "rounded-xl border border-titanium-border bg-titanium-elevated p-3 text-xs text-titanium-silver",
								children: [/* @__PURE__ */ (void 0)("div", {
									className: "flex items-center gap-1.5 font-mono text-[10px] text-emerald",
									children: [/* @__PURE__ */ (void 0)(Mail, { className: "h-3 w-3" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1490,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", { children: "Automated Nodemailer Dispatch" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1491,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1489,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("p", {
									className: "mt-1 text-[11px] text-titanium-silver leading-relaxed",
									children: [
										"The recipient will receive an onboarding email containing a 6-digit verification code and their pre-provisioned VESPER desktop software license key (",
										/* @__PURE__ */ (void 0)("code", {
											className: "text-emerald",
											children: "VESPER-XXXX-XXXX-XXXX"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1494,
											columnNumber: 168
										}, this),
										")."
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1493,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1488,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "mt-2 flex justify-end gap-2 border-t border-titanium-border pt-4",
								children: [/* @__PURE__ */ (void 0)("button", {
									type: "button",
									onClick: () => setIsInviteModalOpen(false),
									className: "rounded-xl border border-titanium-border px-4 py-2 text-titanium-silver hover:text-stark",
									children: "Cancel"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1499,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("button", {
									type: "submit",
									className: "rounded-xl bg-emerald px-5 py-2 font-semibold text-obsidian hover:bg-emerald-400",
									children: "Dispatch Invitation"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1502,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1498,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1453,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1440,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1439,
				columnNumber: 29
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 485,
		columnNumber: 10
	}, this);
}
//#endregion
export { AdminPage as component };
