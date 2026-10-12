import { o as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAuth } from "./auth-context-DIX5izGL.mjs";
import { t as crmService } from "./crm-service-Yn1PsX10.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Clock, E as Plus, J as Database, K as Download, L as Key, M as Mail, P as Lock, S as Search, Z as Copy, _ as Shield, a as Users, at as Check, b as Server, c as TrendingUp, ct as Award, ft as Activity, l as Trash2, nt as CircleCheckBig, q as DollarSign, rt as CircleAlert, s as UserCheck, t as Zap, ut as ArrowLeft, w as RefreshCw, x as Send } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-AoA0Wnbq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen flex-col items-center justify-center bg-obsidian px-5 py-12 text-stark",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl border border-titanium-border bg-titanium p-8 shadow-[0_24px_64px_rgba(0,0,0,0.8)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald/40 bg-emerald/10 text-emerald shadow-[0_0_24px_rgba(16,185,129,0.2)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-mono text-xl font-bold tracking-tight text-stark",
							children: "VESPER CRM Administration"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-titanium-silver",
							children: "Restricted portal for pipeline telemetry, lead scoring, and trial governance."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleGateLogin,
					className: "flex flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block font-mono text-xs text-titanium-silver",
							children: "Admin Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							required: true,
							value: emailInput,
							onChange: (e) => setEmailInput(e.target.value),
							className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3.5 py-2.5 font-mono text-xs text-stark placeholder-titanium-silver/50 focus:border-emerald focus:outline-none"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block font-mono text-xs text-titanium-silver",
							children: "Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							required: true,
							value: passwordInput,
							onChange: (e) => setPasswordInput(e.target.value),
							className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3.5 py-2.5 font-mono text-xs text-stark placeholder-titanium-silver/50 focus:border-emerald focus:outline-none"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: authLoading,
							className: "mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-stark px-4 py-3 text-xs font-bold text-obsidian shadow-lg transition-all hover:bg-white active:scale-[0.98]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-obsidian" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: authLoading ? "Verifying..." : "Access Admin CRM" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-1.5 text-xs text-titanium-silver transition-colors hover:text-stark",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Return to VESPER Home" })]
					})
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-obsidian text-stark selection:bg-emerald/20 selection:text-emerald",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 border-b border-titanium-border bg-obsidian/90 backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "flex items-center gap-2 text-xs font-medium text-titanium-silver transition-colors hover:text-stark",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Landing Page"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-px bg-titanium-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-sm font-bold tracking-[0.2em] text-stark",
									children: "VESPER"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 rounded-md border border-emerald/40 bg-emerald/10 px-2 py-0.5 font-mono text-[10px] text-emerald",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ADMIN CONSOLE" })]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							adminTab === "users" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => loadUsers(true),
								disabled: usersLoading,
								className: "flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium px-3 py-1.5 text-xs font-mono text-titanium-silver transition-all hover:border-emerald/40 hover:text-stark",
								title: "Refresh users and licenses",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${usersLoading ? "animate-spin text-emerald" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Sync Users"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setIsInviteModalOpen(true),
								className: "flex items-center gap-1.5 rounded-lg bg-emerald px-3.5 py-1.5 text-xs font-semibold text-obsidian shadow transition-all hover:bg-emerald-400 active:scale-[0.98]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5 text-obsidian" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Invite User" })]
							})] }),
							adminTab === "leads" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => loadData(true),
									disabled: refreshing,
									className: "flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium px-3 py-1.5 text-xs font-mono text-titanium-silver transition-all hover:border-emerald/40 hover:text-stark",
									title: "Refresh live CRM stats",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${refreshing ? "animate-spin text-emerald" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "Sync"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleExportCsv,
									className: "flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium px-3 py-1.5 text-xs font-mono text-titanium-silver transition-all hover:border-emerald/40 hover:text-stark",
									title: "Export leads to CSV",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 text-emerald" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "Export CSV"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setIsAddModalOpen(true),
									className: "flex items-center gap-1.5 rounded-lg bg-stark px-3.5 py-1.5 text-xs font-semibold text-obsidian shadow transition-all hover:bg-white active:scale-[0.98]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 text-obsidian" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "New Lead" })]
								})
							] }),
							adminTab === "telemetry" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: loadTelemetry,
								disabled: telemetryLoading,
								className: "flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium px-3 py-1.5 text-xs font-mono text-titanium-silver transition-all hover:border-emerald/40 hover:text-stark",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${telemetryLoading ? "animate-spin text-emerald" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Refresh Telemetry"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-px bg-titanium-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-7 w-7 items-center justify-center rounded-full bg-titanium-elevated font-mono text-xs text-stark border border-titanium-border",
									children: user?.name?.charAt(0) || "A"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: logout,
									className: "text-xs text-titanium-silver transition-colors hover:text-stark",
									title: "Sign out of Admin session",
									children: "Logout"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-titanium-border bg-titanium/30 px-5 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto py-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setAdminTab("users"),
							className: `flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-mono transition-all whitespace-nowrap ${adminTab === "users" ? "border-emerald text-emerald font-semibold" : "border-transparent text-titanium-silver hover:text-stark"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "User Accounts & Licenses" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-titanium-elevated px-2 py-0.5 text-[10px] text-emerald border border-titanium-border",
									children: users.length
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setAdminTab("leads"),
							className: `flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-mono transition-all whitespace-nowrap ${adminTab === "leads" ? "border-emerald text-emerald font-semibold" : "border-transparent text-titanium-silver hover:text-stark"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CRM Sales Pipeline" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-titanium-elevated px-2 py-0.5 text-[10px] text-stark border border-titanium-border",
									children: leads.length
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setAdminTab("telemetry"),
							className: `flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-mono transition-all whitespace-nowrap ${adminTab === "telemetry" ? "border-emerald text-emerald font-semibold" : "border-transparent text-titanium-silver hover:text-stark"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "h-4 w-4" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Infrastructure Telemetry" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald animate-pulse" })
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-7xl px-5 py-8",
				children: [
					adminTab === "users" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-titanium-silver",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-xs uppercase tracking-wider",
													children: "Total Accounts"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-titanium-silver" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-3 font-mono text-2xl font-bold text-stark",
												children: userStats.total
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 flex items-center gap-1.5 font-mono text-[11px] text-emerald",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MongoDB Atlas synced" })]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-titanium-silver",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-xs uppercase tracking-wider",
													children: "Email Verified"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4 text-emerald" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-3 font-mono text-2xl font-bold text-emerald",
												children: userStats.verified
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 font-mono text-[11px] text-titanium-silver",
												children: "Nodemailer & Google OAuth"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-titanium-silver",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-xs uppercase tracking-wider",
													children: "Active Workstations"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "h-4 w-4 text-cyan-400" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-3 font-mono text-2xl font-bold text-cyan-400",
												children: userStats.activeLicenses
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 font-mono text-[11px] text-titanium-silver",
												children: "Desktop client gate verified"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-titanium-silver",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-xs uppercase tracking-wider",
													children: "Tokens Burned"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-amber-400" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-3 font-mono text-2xl font-bold text-amber-400",
												children: userStats.totalTokensBurned.toLocaleString()
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 font-mono text-[11px] text-titanium-silver",
												children: [
													"P: ",
													userStats.totalPromptTokens.toLocaleString(),
													" | C: ",
													userStats.totalCompletionTokens.toLocaleString()
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-titanium-silver",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-xs uppercase tracking-wider",
													children: "Paid Subscribers"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4 text-purple-400" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-3 font-mono text-2xl font-bold text-stark",
												children: userStats.proTier
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 font-mono text-[11px] text-purple-400",
												children: "Pro ($29) & Enterprise"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-titanium-silver",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-xs uppercase tracking-wider",
													children: "Pending PIN"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-rose-400" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-3 font-mono text-2xl font-bold text-rose-400",
												children: userStats.pending
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 font-mono text-[11px] text-titanium-silver",
												children: "Awaiting email confirmation"
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex-1 max-w-md",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-titanium-silver" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "Search users by name, email, license key...",
										value: userSearchQuery,
										onChange: (e) => setUserSearchQuery(e.target.value),
										className: "w-full rounded-xl border border-titanium-border bg-titanium pl-10 pr-4 py-2 text-xs text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setUserFilter("all"),
											className: `rounded-lg px-3 py-1.5 text-xs font-mono transition-colors border ${userFilter === "all" ? "border-emerald/40 bg-emerald/10 text-emerald" : "border-titanium-border bg-titanium text-titanium-silver hover:text-stark"}`,
											children: [
												"All (",
												users.length,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setUserFilter("verified"),
											className: `rounded-lg px-3 py-1.5 text-xs font-mono transition-colors border ${userFilter === "verified" ? "border-emerald/40 bg-emerald/10 text-emerald" : "border-titanium-border bg-titanium text-titanium-silver hover:text-stark"}`,
											children: [
												"Verified (",
												userStats.verified,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setUserFilter("pending"),
											className: `rounded-lg px-3 py-1.5 text-xs font-mono transition-colors border ${userFilter === "pending" ? "border-amber-500/40 bg-amber-500/10 text-amber-400" : "border-titanium-border bg-titanium text-titanium-silver hover:text-stark"}`,
											children: [
												"Pending PIN (",
												userStats.pending,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setUserFilter("activeLicense"),
											className: `rounded-lg px-3 py-1.5 text-xs font-mono transition-colors border ${userFilter === "activeLicense" ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400" : "border-titanium-border bg-titanium text-titanium-silver hover:text-stark"}`,
											children: [
												"Active Licenses (",
												userStats.activeLicenses,
												")"
											]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-hidden rounded-xl border border-titanium-border bg-titanium shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-x-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full text-left text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
											className: "border-b border-titanium-border bg-titanium-elevated font-mono text-[11px] uppercase tracking-wider text-titanium-silver",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-5 py-3.5",
													children: "User Identity"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3.5",
													children: "Auth Provider"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3.5",
													children: "Verification Status"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3.5",
													children: "Software License"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3.5",
													children: "Subscription Tier"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3.5",
													children: "Tokens Burned"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3.5",
													children: "Usage Quota"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-5 py-3.5 text-right",
													children: "Admin Actions"
												})
											] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
											className: "divide-y divide-titanium-border font-sans",
											children: filteredUsers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												colSpan: 8,
												className: "px-5 py-12 text-center text-titanium-silver",
												children: usersLoading ? "Loading user accounts..." : "No users match the search filters."
											}) }) : filteredUsers.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "transition-colors hover:bg-titanium-elevated/60",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-5 py-3.5",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-3",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "flex h-8 w-8 items-center justify-center rounded-full bg-titanium-elevated font-mono text-xs font-bold text-stark border border-titanium-border",
																children: u.name ? u.name.charAt(0).toUpperCase() : "U"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "font-semibold text-stark",
																children: u.name || "Anonymous User"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "font-mono text-[11px] text-titanium-silver",
																children: u.email
															})] })]
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3.5",
														children: u.provider === "google" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "inline-flex items-center gap-1.5 rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 font-mono text-[10px] text-blue-400",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Google OAuth" })
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "inline-flex items-center gap-1.5 rounded-md border border-titanium-border bg-titanium-elevated px-2 py-0.5 font-mono text-[10px] text-titanium-silver",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Email / Password" })
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3.5",
														children: u.isVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "inline-flex items-center gap-1.5 rounded-md border border-emerald/40 bg-emerald/10 px-2 py-0.5 font-mono text-[10px] text-emerald",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verified" })]
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "inline-flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-400",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pending PIN" })]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => handleToggleUserVerify(u.id, false),
																className: "rounded border border-titanium-border bg-titanium-elevated px-2 py-0.5 font-mono text-[10px] text-stark hover:border-emerald hover:text-emerald transition-colors",
																title: "Manually verify and accept user",
																children: "Accept Now"
															})]
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3.5",
														children: u.licenseKey ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "flex items-center gap-1 rounded bg-titanium-elevated px-2 py-1 font-mono text-[11px] text-stark border border-titanium-border",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "h-3 w-3 text-titanium-silver" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: u.licenseKey })]
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	type: "button",
																	onClick: () => handleCopyLicenseKey(u.licenseKey, u.id),
																	className: "rounded p-1 text-titanium-silver hover:text-stark",
																	title: "Copy license key",
																	children: copiedKeyId === u.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	type: "button",
																	onClick: () => handleToggleLicenseActive(u.id, u.licenseActive),
																	className: `rounded px-1.5 py-0.5 font-mono text-[10px] transition-colors ${u.licenseActive ? "bg-emerald/15 text-emerald border border-emerald/40" : "bg-zinc-800 text-zinc-400 border border-zinc-700"}`,
																	title: "Toggle license active status",
																	children: u.licenseActive ? "Active" : "Revoked"
																})
															]
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono text-[11px] text-titanium-silver",
															children: "No key issued"
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3.5",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
															value: u.tier || "free",
															onChange: (e) => handleChangeTier(u.id, e.target.value),
															className: "rounded-lg border border-titanium-border bg-titanium-elevated px-2.5 py-1 font-mono text-xs text-stark focus:border-emerald focus:outline-none",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																	value: "free",
																	children: "Free Tier"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																	value: "pro",
																	children: "Pro ($29/mo)"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																	value: "enterprise",
																	children: "Enterprise"
																})
															]
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "px-4 py-3.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "font-mono text-xs font-semibold text-stark flex items-center gap-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3 w-3 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: (u.tokenQuota?.usedTokens || 0).toLocaleString() })]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "font-mono text-[10px] text-titanium-silver",
															children: [
																"P: ",
																(u.tokenQuota?.promptTokens || 0).toLocaleString(),
																" | C: ",
																(u.tokenQuota?.completionTokens || 0).toLocaleString()
															]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3.5 font-mono text-[11px] text-titanium-silver",
														children: u.tier === "enterprise" ? "Unlimited" : u.tier === "pro" ? "5,000 / mo" : `${u.usageQuota || 100} / mo`
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-5 py-3.5 text-right",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "flex items-center justify-end gap-2",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => handleToggleUserVerify(u.id, u.isVerified),
																className: `rounded px-2 py-1 font-mono text-[10px] transition-colors ${u.isVerified ? "text-titanium-silver hover:text-rose-400" : "text-emerald hover:underline"}`,
																children: u.isVerified ? "Revoke Verify" : "Verify User"
															})
														})
													})
												]
											}, u.id))
										})]
									})
								})
							})
						]
					}),
					adminTab === "leads" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-titanium-silver",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-xs uppercase tracking-wider",
												children: "Total Leads"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-titanium-silver" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3 font-mono text-2xl font-bold text-stark",
											children: stats ? stats.totalLeads : leads.length
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 flex items-center gap-1.5 font-mono text-[11px] text-emerald",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "+14% this week" })]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-titanium-silver",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-xs uppercase tracking-wider",
												children: "Pipeline Value"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-4 w-4 text-emerald" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 font-mono text-2xl font-bold text-stark",
											children: ["$", (stats?.totalPipelineValue ?? stats?.pipelineValue ?? 0).toLocaleString()]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 font-mono text-[11px] text-titanium-silver",
											children: "ARR expansion projection"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-titanium-silver",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-xs uppercase tracking-wider",
												children: "Win Rate"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4 text-amber-400" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3 font-mono text-2xl font-bold text-stark",
											children: stats ? `${stats.conversionRate ?? 0}%` : "0%"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 font-mono text-[11px] text-titanium-silver",
											children: "Trial to paid velocity"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-titanium-silver",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-xs uppercase tracking-wider",
												children: "Qualified Leads"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-4 w-4 text-cyan-400" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3 font-mono text-2xl font-bold text-stark",
											children: stats ? stats.qualifiedLeads ?? stats.leadsByStatus?.["Qualified"] ?? 0 : 0
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 font-mono text-[11px] text-cyan-400",
											children: "High intent builders"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-titanium-silver",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-xs uppercase tracking-wider",
												children: "Active Pro Trials"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-amber-400" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3 font-mono text-2xl font-bold text-stark",
											children: stats ? stats.activeTrials ?? stats.proTrials ?? stats.leadsByStatus?.["Pro Trial"] ?? 0 : 0
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 font-mono text-[11px] text-amber-400",
											children: "In-app activation"
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mb-8 rounded-xl border border-titanium-border bg-titanium p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-3 flex items-center justify-between",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-mono text-xs uppercase tracking-wider text-titanium-silver",
										children: "Pipeline Funnel Velocity"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: { width: `${pct}%` },
											className: `${bg} transition-all duration-300`,
											title: `${stg}: ${count} leads (${pct.toFixed(0)}%)`
										}, stg);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex flex-wrap gap-4 pt-1 font-mono text-[11px]",
									children: ALL_STAGES.map((stg) => {
										const count = stageCounts[stg] || 0;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setSelectedStage(selectedStage === stg ? "All" : stg),
											className: `flex items-center gap-1.5 transition-colors ${selectedStage === stg ? "text-stark font-semibold" : "text-titanium-silver hover:text-stark"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full ${stg === "Closed Won" ? "bg-emerald" : stg === "Enterprise Pilot" ? "bg-purple-500" : stg === "Pro Trial" ? "bg-amber-500" : stg === "Qualified" ? "bg-cyan-500" : stg === "Contacted" ? "bg-blue-500" : stg === "Lost" ? "bg-zinc-700" : "bg-titanium-silver"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												stg,
												" (",
												count,
												")"
											] })]
										}, stg);
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1 max-w-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-titanium-silver" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "Search leads by name, email, company, notes...",
									value: searchQuery,
									onChange: (e) => setSearchQuery(e.target.value),
									className: "w-full rounded-xl border border-titanium-border bg-titanium pl-10 pr-4 py-2 text-xs text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: selectedStage,
									onChange: (e) => setSelectedStage(e.target.value),
									className: "rounded-xl border border-titanium-border bg-titanium px-3 py-2 font-mono text-xs text-stark focus:border-emerald focus:outline-none",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: "All",
										children: [
											"All Stages (",
											leads.length,
											")"
										]
									}), ALL_STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: s,
										children: [
											s,
											" (",
											stageCounts[s] || 0,
											")"
										]
									}, s))]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex rounded-xl border border-titanium-border bg-titanium p-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setViewMode("table"),
										className: `rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${viewMode === "table" ? "bg-titanium-elevated text-stark font-semibold" : "text-titanium-silver hover:text-stark"}`,
										children: "Table"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setViewMode("kanban"),
										className: `rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${viewMode === "kanban" ? "bg-titanium-elevated text-stark font-semibold" : "text-titanium-silver hover:text-stark"}`,
										children: "Cards"
									})]
								})]
							})]
						}),
						viewMode === "table" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-xl border border-titanium-border bg-titanium shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "border-b border-titanium-border bg-titanium-elevated font-mono text-[11px] uppercase tracking-wider text-titanium-silver",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-5 py-3.5",
												children: "Lead / Contact"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3.5",
												children: "Company & Role"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3.5",
												children: "Pipeline Stage"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3.5",
												children: "Deal Value"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3.5",
												children: "Score"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3.5",
												children: "Last Touch"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-5 py-3.5 text-right",
												children: "Actions"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-titanium-border font-sans",
										children: filteredLeads.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											colSpan: 7,
											className: "px-5 py-12 text-center text-titanium-silver",
											children: "No leads match the active search and stage criteria."
										}) }) : filteredLeads.map((lead) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "transition-colors hover:bg-titanium-elevated/60",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "px-5 py-3.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-semibold text-stark",
														children: lead.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-mono text-[11px] text-titanium-silver",
														children: lead.email
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "px-4 py-3.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-stark font-medium",
														children: lead.company
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[11px] text-titanium-silver truncate max-w-[180px]",
														children: lead.useCase || "Developer Workstation"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3.5",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
														value: lead.stage,
														onChange: (e) => handleStageChange(lead.id, e.target.value),
														className: `rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors focus:outline-none ${getStageBadgeClass(lead.stage)}`,
														children: ALL_STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: s,
															className: "bg-titanium text-stark",
															children: s
														}, s))
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "px-4 py-3.5 font-mono font-medium text-stark",
													children: ["$", (lead.dealValue ?? lead.value ?? 0).toLocaleString()]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3.5",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1.5 font-mono text-[11px]",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full ${lead.score >= 85 ? "bg-emerald" : lead.score >= 70 ? "bg-amber-400" : "bg-titanium-silver"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [lead.score, "/100"] })]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3.5 font-mono text-[11px] text-titanium-silver whitespace-nowrap",
													children: lead.lastContacted || lead.createdAt?.slice(0, 10)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-5 py-3.5 text-right",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-end gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: () => {
																setActiveLead(lead);
																setIsDetailModalOpen(true);
															},
															className: "rounded-lg border border-titanium-border bg-titanium-elevated px-2.5 py-1 font-mono text-[11px] text-titanium-silver hover:text-stark hover:border-titanium-silver/40",
															title: "Inspect lead details",
															children: "Details"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: () => handleDeleteLead(lead.id),
															className: "rounded-lg p-1 text-titanium-silver hover:text-rose-400",
															title: "Delete lead",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
														})]
													})
												})
											]
										}, lead.id))
									})]
								})
							})
						}),
						viewMode === "kanban" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
							children: filteredLeads.map((lead) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col justify-between rounded-xl border border-titanium-border bg-titanium p-5 transition-all hover:border-titanium-border/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-semibold text-stark",
											children: lead.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-xs text-titanium-silver",
											children: lead.email
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold ${getStageBadgeClass(lead.stage)}`,
											children: lead.stage
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex flex-col gap-2 rounded-lg border border-titanium-border bg-titanium-elevated p-3 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-titanium-silver",
													children: "Company:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-stark",
													children: lead.company
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-titanium-silver",
													children: "Deal Value:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono font-medium text-stark",
													children: ["$", (lead.dealValue ?? lead.value ?? 0).toLocaleString()]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-titanium-silver",
													children: "Lead Score:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono font-semibold text-emerald",
													children: [lead.score, "/100"]
												})]
											})
										]
									}),
									lead.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-3 line-clamp-2 text-xs text-titanium-silver italic",
										children: [
											"\"",
											lead.notes,
											"\""
										]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 flex items-center justify-between pt-3 border-t border-titanium-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: lead.stage,
										onChange: (e) => handleStageChange(lead.id, e.target.value),
										className: "rounded-md border border-titanium-border bg-titanium px-2 py-1 font-mono text-[10px] text-stark focus:outline-none",
										children: ALL_STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: s,
											children: ["Move: ", s]
										}, s))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												setActiveLead(lead);
												setIsDetailModalOpen(true);
											},
											className: "font-mono text-xs text-titanium-silver hover:text-stark",
											children: "Inspect"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => handleDeleteLead(lead.id),
											className: "text-titanium-silver hover:text-rose-400",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
										})]
									})]
								})]
							}, lead.id))
						})
					] }),
					adminTab === "telemetry" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-titanium-border bg-titanium p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-titanium-border pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-mono text-sm font-bold uppercase tracking-wider text-stark",
										children: "System Health & Infrastructure Telemetry"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-titanium-silver",
										children: "Live telemetry for database replica sets, Nodemailer SMTP transport, and desktop license gates."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex h-2.5 w-2.5 rounded-full bg-emerald animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs font-semibold text-emerald",
											children: "ONLINE & OPERATIONAL"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-titanium-silver",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-xs uppercase",
														children: "Primary Database"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-4 w-4 text-emerald" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-2 font-mono text-base font-bold text-stark",
													children: telemetry?.mongoConnected ? "MongoDB Atlas" : "Local Memory (Resilient)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1 font-mono text-[11px] text-titanium-silver truncate",
													children: "cluster0.hbxhsws.mongodb.net"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-3 flex items-center gap-1.5 font-mono text-[10px] text-emerald",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Replica Set Connected" })]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-titanium-silver",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-xs uppercase",
														children: "Fleet Token Burn"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-amber-400" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-2 font-mono text-base font-bold text-amber-400",
													children: [
														userStats.totalTokensBurned.toLocaleString(),
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs text-stark font-normal",
															children: "tokens"
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-1 font-mono text-[11px] text-titanium-silver",
													children: [userStats.activeLicenses, " active workstations"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-3 flex items-center gap-1.5 font-mono text-[10px] text-amber-400",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Live Desktop REST Stream" })]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-titanium-silver",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-xs uppercase",
														children: "Email Dispatch"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-cyan-400" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-2 font-mono text-base font-bold text-stark",
													children: "Nodemailer SMTP"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1 font-mono text-[11px] text-titanium-silver",
													children: "TLS 587 Gateway"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-3 flex items-center gap-1.5 font-mono text-[10px] text-cyan-400",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PIN & License Delivery" })]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-titanium-silver",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-xs uppercase",
														children: "Software Gate"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "h-4 w-4 text-purple-400" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-2 font-mono text-base font-bold text-stark",
													children: "/api/license/verify"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1 font-mono text-[11px] text-titanium-silver",
													children: "Hardware & Tier Gate"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-3 flex items-center gap-1.5 font-mono text-[10px] text-purple-400",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cryptographic Verification" })]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-titanium-border bg-titanium-elevated p-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-titanium-silver",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-xs uppercase",
														children: "Speech Pipeline"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4 text-emerald" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-2 font-mono text-base font-bold text-stark",
													children: "Low-Latency Hook"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1 font-mono text-[11px] text-titanium-silver",
													children: "Zero-Focus Steal Native"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-3 flex items-center gap-1.5 font-mono text-[10px] text-emerald",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Average Latency < 350ms" })]
												})
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 rounded-xl border border-titanium-border bg-titanium-elevated p-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-mono text-xs font-semibold uppercase text-titanium-silver",
										children: "Active Database Collections & Architecture"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4 font-mono text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg border border-titanium-border bg-titanium p-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[10px] uppercase text-titanium-silver",
														children: "Collection"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-bold text-stark mt-0.5",
														children: "users"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-[10px] text-emerald mt-1",
														children: [users.length, " documents"]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg border border-titanium-border bg-titanium p-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[10px] uppercase text-titanium-silver",
														children: "Collection"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-bold text-stark mt-0.5",
														children: "leads"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-[10px] text-cyan-400 mt-1",
														children: [leads.length, " documents"]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg border border-titanium-border bg-titanium p-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[10px] uppercase text-titanium-silver",
														children: "Release"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-bold text-stark mt-0.5",
														children: "v1.0.0 Production"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[10px] text-titanium-silver mt-1",
														children: "Desktop Suite Active"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg border border-titanium-border bg-titanium p-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[10px] uppercase text-titanium-silver",
														children: "Uptime"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-bold text-stark mt-0.5",
														children: telemetry?.uptime ? `${Math.floor(telemetry.uptime / 60)} mins` : "Live"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[10px] text-emerald mt-1",
														children: "100% SLA"
													})
												]
											})
										]
									})]
								})
							]
						})
					})
				]
			}),
			isDetailModalOpen && activeLead && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-lg rounded-2xl border border-titanium-border bg-titanium p-6 shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between border-b border-titanium-border pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold text-stark",
							children: activeLead.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-titanium-silver",
							children: activeLead.email
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setIsDetailModalOpen(false),
							className: "text-titanium-silver hover:text-stark",
							children: "✕"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium-elevated p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-titanium-silver font-mono text-[10px] uppercase",
											children: "Company"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-stark mt-0.5",
											children: activeLead.company
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium-elevated p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-titanium-silver font-mono text-[10px] uppercase",
											children: "Pipeline Value"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-mono font-semibold text-stark mt-0.5",
											children: ["$", (activeLead.dealValue ?? activeLead.value ?? 0).toLocaleString()]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium-elevated p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-titanium-silver font-mono text-[10px] uppercase",
											children: "Stage"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono font-semibold text-emerald mt-0.5",
											children: activeLead.stage
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-titanium-border bg-titanium-elevated p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-titanium-silver font-mono text-[10px] uppercase",
											children: "Lead Score"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-mono font-semibold text-stark mt-0.5",
											children: [activeLead.score, "/100"]
										})]
									})
								]
							}),
							activeLead.useCase && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[11px] text-titanium-silver uppercase",
								children: "Environment & Workflow"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 rounded-xl border border-titanium-border bg-titanium-elevated p-3 text-xs text-stark",
								children: activeLead.useCase
							})] }),
							activeLead.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[11px] text-titanium-silver uppercase",
								children: "Executive Notes & Logs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 rounded-xl border border-titanium-border bg-titanium-elevated p-3 text-xs text-titanium-silver leading-relaxed",
								children: activeLead.notes
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex justify-between items-center border-t border-titanium-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-[10px] text-titanium-silver",
									children: ["Recorded: ", activeLead.createdAt || "Live Session"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIsDetailModalOpen(false),
									className: "rounded-lg bg-stark px-4 py-2 text-xs font-semibold text-obsidian hover:bg-white",
									children: "Close"
								})]
							})
						]
					})]
				})
			}),
			isAddModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-lg rounded-2xl border border-titanium-border bg-titanium p-6 shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-titanium-border pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-mono text-sm font-bold text-stark",
							children: "Add New CRM Lead"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setIsAddModalOpen(false),
							className: "text-titanium-silver hover:text-stark",
							children: "✕"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateLead,
						className: "mt-4 flex flex-col gap-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block font-mono text-[11px] text-titanium-silver",
									children: "Full Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									placeholder: "e.g. Jordan Hayes",
									value: newLeadForm.name,
									onChange: (e) => setNewLeadForm({
										...newLeadForm,
										name: e.target.value
									}),
									className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block font-mono text-[11px] text-titanium-silver",
									children: "Work Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									required: true,
									placeholder: "jordan@company.com",
									value: newLeadForm.email,
									onChange: (e) => setNewLeadForm({
										...newLeadForm,
										email: e.target.value
									}),
									className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block font-mono text-[11px] text-titanium-silver",
									children: "Company"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "e.g. Stripe, OpenAI, Studio",
									value: newLeadForm.company,
									onChange: (e) => setNewLeadForm({
										...newLeadForm,
										company: e.target.value
									}),
									className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block font-mono text-[11px] text-titanium-silver",
									children: "Pipeline Stage"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: newLeadForm.stage,
									onChange: (e) => setNewLeadForm({
										...newLeadForm,
										stage: e.target.value
									}),
									className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 font-mono text-stark focus:border-emerald focus:outline-none",
									children: ALL_STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: s
									}, s))
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block font-mono text-[11px] text-titanium-silver",
									children: "Deal Value ($ ARR)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: "0",
									step: "10",
									value: newLeadForm.value,
									onChange: (e) => setNewLeadForm({
										...newLeadForm,
										value: Number(e.target.value)
									}),
									className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 font-mono text-stark focus:border-emerald focus:outline-none"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block font-mono text-[11px] text-titanium-silver",
									children: "Lead Score (1-100)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: "1",
									max: "100",
									value: newLeadForm.score,
									onChange: (e) => setNewLeadForm({
										...newLeadForm,
										score: Number(e.target.value)
									}),
									className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 font-mono text-stark focus:border-emerald focus:outline-none"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block font-mono text-[11px] text-titanium-silver",
								children: "Use Case & Technical Environment"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "e.g. VS Code, Terminal, CUDA RTX 4090",
								value: newLeadForm.useCase,
								onChange: (e) => setNewLeadForm({
									...newLeadForm,
									useCase: e.target.value
								}),
								className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block font-mono text-[11px] text-titanium-silver",
								children: "Discovery Notes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 3,
								placeholder: "Inquiry notes, follow-up timeline, team size...",
								value: newLeadForm.notes,
								onChange: (e) => setNewLeadForm({
									...newLeadForm,
									notes: e.target.value
								}),
								className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex justify-end gap-2 border-t border-titanium-border pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIsAddModalOpen(false),
									className: "rounded-xl border border-titanium-border px-4 py-2 text-titanium-silver hover:text-stark",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "rounded-xl bg-stark px-5 py-2 font-semibold text-obsidian hover:bg-white",
									children: "Create Lead"
								})]
							})
						]
					})]
				})
			}),
			isInviteModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-lg rounded-2xl border border-titanium-border bg-titanium p-6 shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-titanium-border pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-mono text-sm font-bold text-stark",
							children: "Invite Developer & Issue License"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-titanium-silver",
							children: "Provisions a new user account and dispatches an automated verification email with an official desktop license key."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setIsInviteModalOpen(false),
							className: "text-titanium-silver hover:text-stark",
							children: "✕"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleInviteUser,
						className: "mt-4 flex flex-col gap-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block font-mono text-[11px] text-titanium-silver",
								children: "Developer Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								placeholder: "e.g. Jordan Hayes",
								value: inviteForm.name,
								onChange: (e) => setInviteForm({
									...inviteForm,
									name: e.target.value
								}),
								className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block font-mono text-[11px] text-titanium-silver",
								children: "Email Address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								required: true,
								placeholder: "jordan@company.com",
								value: inviteForm.email,
								onChange: (e) => setInviteForm({
									...inviteForm,
									email: e.target.value
								}),
								className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block font-mono text-[11px] text-titanium-silver",
								children: "Initial Subscription Tier"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: inviteForm.tier,
								onChange: (e) => setInviteForm({
									...inviteForm,
									tier: e.target.value
								}),
								className: "w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 font-mono text-stark focus:border-emerald focus:outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "free",
										children: "Free Tier (100 dictations/mo)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "pro",
										children: "Pro ($29/mo, 5,000 dictations/mo)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "enterprise",
										children: "Enterprise (Unlimited, Dedicated SLA)"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-titanium-border bg-titanium-elevated p-3 text-xs text-titanium-silver",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 font-mono text-[10px] text-emerald",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Automated Nodemailer Dispatch" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-[11px] text-titanium-silver leading-relaxed",
									children: [
										"The recipient will receive an onboarding email containing a 6-digit verification code and their pre-provisioned VESPER desktop software license key (",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "text-emerald",
											children: "VESPER-XXXX-XXXX-XXXX"
										}),
										")."
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex justify-end gap-2 border-t border-titanium-border pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIsInviteModalOpen(false),
									className: "rounded-xl border border-titanium-border px-4 py-2 text-titanium-silver hover:text-stark",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "rounded-xl bg-emerald px-5 py-2 font-semibold text-obsidian hover:bg-emerald-400",
									children: "Dispatch Invitation"
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { AdminPage as component };
