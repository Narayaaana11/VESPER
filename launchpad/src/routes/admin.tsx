import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo, type FormEvent } from "react";
import {
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Clock,
  Search,
  Filter,
  Download,
  Plus,
  RefreshCw,
  Shield,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Trash2,
  Edit3,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Lock,
  Mail,
  Building,
  Monitor,
  Laptop,
  Key,
  Copy,
  Check,
  Send,
  Database,
  Server,
  UserCheck,
  UserX,
  Activity,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { crmService, type Lead, type CrmStats } from "@/lib/crm-service";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  provider: "local" | "google";
  isVerified: boolean;
  tier: "free" | "pro" | "enterprise";
  licenseKey: string | null;
  licenseActive: boolean;
  usageQuota: number;
  createdAt: string;
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "VESPER CRM: Admin Pipeline & Lead Management" },
      {
        name: "description",
        content:
          "Enterprise CRM pipeline, pro trial metrics, and lead qualification for VESPER Desktop.",
      },
    ],
  }),
  component: AdminPage,
});

const ALL_STAGES = [
  "New Lead",
  "Contacted",
  "Qualified",
  "Pro Trial",
  "Closed Won",
  "Enterprise Pilot",
  "Lost",
] as const;

type LeadStage = (typeof ALL_STAGES)[number];

function getStageBadgeClass(stage: string): string {
  switch (stage) {
    case "Closed Won":
      return "border-emerald/40 bg-emerald/10 text-emerald";
    case "Enterprise Pilot":
      return "border-purple-500/40 bg-purple-500/10 text-purple-400";
    case "Pro Trial":
      return "border-amber-500/40 bg-amber-500/10 text-amber-400";
    case "Qualified":
      return "border-cyan-500/40 bg-cyan-500/10 text-cyan-400";
    case "Contacted":
      return "border-blue-500/40 bg-blue-500/10 text-blue-400";
    case "Lost":
      return "border-zinc-700 bg-zinc-800/60 text-zinc-400";
    default:
      return "border-titanium-border bg-titanium-elevated text-titanium-silver";
  }
}

function AdminPage() {
  const { user, isAdmin, login, loginWithGoogle, logout, openAuthModal } = useAuth();

  // Tab State: "users" | "leads" | "telemetry"
  const [adminTab, setAdminTab] = useState<"users" | "leads" | "telemetry">("users");

  // CRM State
  const [stats, setStats] = useState<CrmStats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");

  // Lead detail modal state
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // New lead modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    email: "",
    company: "",
    stage: "New Lead" as LeadStage,
    value: 120,
    score: 80,
    useCase: "Power Engineering",
    notes: "",
  });

  // User Accounts & License Management State
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userFilter, setUserFilter] = useState<"all" | "verified" | "pending" | "activeLicense">("all");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    tier: "pro" as "free" | "pro" | "enterprise",
  });
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // System Telemetry State
  const [telemetry, setTelemetry] = useState<{
    status: string;
    version: string;
    database: string;
    mongoConnected: boolean;
    uptime: number;
    timestamp?: string;
  } | null>(null);
  const [telemetryLoading, setTelemetryLoading] = useState(false);

  // Admin gate login state
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Load CRM data
  const loadData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    else setRefreshing(true);

    try {
      const [fetchedStats, fetchedLeads] = await Promise.all([
        crmService.getStats(),
        crmService.getLeads(),
      ]);
      setStats(fetchedStats);
      setLeads(fetchedLeads.leads);
    } catch (err: unknown) {
      console.error("Failed to load CRM data:", err);
      toast.error("Could not load CRM data from server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load User Accounts & Licenses
  const loadUsers = async (isBackground = false) => {
    if (!isBackground) setUsersLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (err: unknown) {
      console.error("Failed to load users:", err);
      toast.error("Could not load user accounts from database.");
    } finally {
      setUsersLoading(false);
    }
  };

  // Load System Telemetry
  const loadTelemetry = async () => {
    setTelemetryLoading(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setTelemetry(data);
    } catch (err: unknown) {
      console.error("Failed to load system health:", err);
    } finally {
      setTelemetryLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
      loadUsers();
      loadTelemetry();
    }
  }, [isAdmin]);

  // User Management Actions
  const handleToggleUserVerify = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isVerified: !currentStatus } : u))
        );
        toast.success(
          !currentStatus
            ? "User email manually verified and accepted."
            : "User set to unverified status."
        );
      } else {
        toast.error(data.error || "Failed to update verification.");
      }
    } catch {
      toast.error("Network error updating user.");
    }
  };

  const handleToggleLicenseActive = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, licenseActive: !currentStatus } : u))
        );
        toast.success(
          !currentStatus ? "Desktop license key activated." : "Desktop license key revoked."
        );
      } else {
        toast.error(data.error || "Failed to toggle license.");
      }
    } catch {
      toast.error("Network error toggling license.");
    }
  };

  const handleChangeTier = async (userId: string, newTier: "free" | "pro" | "enterprise") => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: newTier }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, tier: newTier } : u))
        );
        toast.success(`User upgraded to ${newTier.toUpperCase()} tier.`);
      } else {
        toast.error(data.error || "Failed to change tier.");
      }
    } catch {
      toast.error("Network error changing tier.");
    }
  };

  const handleInviteUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!inviteForm.email.includes("@")) {
      toast.error("Valid email required.");
      return;
    }
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteForm.email.trim(),
          name: inviteForm.name.trim() || "Invited Developer",
          tier: inviteForm.tier,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          `User invited! Verification and software license key dispatched to ${inviteForm.email}.`
        );
        setIsInviteModalOpen(false);
        setInviteForm({ name: "", email: "", tier: "pro" });
        loadUsers(true);
      } else {
        toast.error(data.error || "Failed to send invitation.");
      }
    } catch {
      toast.error("Network error sending invite.");
    }
  };

  const handleCopyLicenseKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    toast.success("License key copied to clipboard!");
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const userStats = useMemo(() => {
    const total = users.length;
    const verified = users.filter((u) => u.isVerified).length;
    const activeLicenses = users.filter((u) => u.licenseActive).length;
    const proTier = users.filter((u) => u.tier === "pro" || u.tier === "enterprise").length;
    const pending = total - verified;
    return { total, verified, activeLicenses, proTier, pending };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = userSearchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        u.email.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        (u.licenseKey && u.licenseKey.toLowerCase().includes(q));

      let matchesFilter = true;
      if (userFilter === "verified") matchesFilter = u.isVerified;
      if (userFilter === "pending") matchesFilter = !u.isVerified;
      if (userFilter === "activeLicense") matchesFilter = u.licenseActive;

      return matchesQuery && matchesFilter;
    });
  }, [users, userSearchQuery, userFilter]);

  // Handle stage change directly
  const handleStageChange = async (leadId: string, nextStage: string) => {
    try {
      const updated = await crmService.updateLead(leadId, { stage: nextStage });
      setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
      if (activeLead && activeLead.id === leadId) {
        setActiveLead(updated);
      }
      toast.success(`Updated stage to ${nextStage}`);
      // Refresh stats
      crmService
        .getStats()
        .then(setStats)
        .catch(() => {});
    } catch {
      toast.error("Failed to update lead stage.");
    }
  };

  // Handle delete
  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm("Are you sure you want to remove this lead from the CRM pipeline?")) {
      return;
    }
    try {
      await crmService.deleteLead(leadId);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      if (activeLead && activeLead.id === leadId) {
        setIsDetailModalOpen(false);
        setActiveLead(null);
      }
      toast.success("Lead removed successfully.");
      crmService
        .getStats()
        .then(setStats)
        .catch(() => {});
    } catch {
      toast.error("Failed to delete lead.");
    }
  };

  // Handle add lead
  const handleCreateLead = async (e: FormEvent) => {
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
        notes: newLeadForm.notes.trim(),
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
        notes: "",
      });
      toast.success("Lead created successfully.");
      crmService
        .getStats()
        .then(setStats)
        .catch(() => {});
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create lead.";
      toast.error(msg);
    }
  };

  // Handle seed
  const handleSeedPipeline = async () => {
    try {
      setRefreshing(true);
      await crmService.seedPipeline();
      await loadData(true);
      toast.success("CRM pipeline reseeded with default ICP leads.");
    } catch {
      toast.error("Failed to reseed pipeline.");
    } finally {
      setRefreshing(false);
    }
  };

  // Handle export
  const handleExportCsv = async () => {
    try {
      await crmService.exportCsv();
      toast.success("CRM Leads exported to CSV successfully.");
    } catch {
      toast.error("Failed to export leads.");
    }
  };

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchesStage = selectedStage === "All" || l.stage === selectedStage;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesStage;
      const matchesQuery =
        l.name.toLowerCase().includes(query) ||
        l.email.toLowerCase().includes(query) ||
        l.company.toLowerCase().includes(query) ||
        (l.useCase && l.useCase.toLowerCase().includes(query)) ||
        (l.notes && l.notes.toLowerCase().includes(query));
      return matchesStage && matchesQuery;
    });
  }, [leads, selectedStage, searchQuery]);

  // Stage counts
  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = { All: leads.length };
    ALL_STAGES.forEach((s) => {
      counts[s] = leads.filter((l) => l.stage === s).length;
    });
    return counts;
  }, [leads]);

  // Handle Admin Gate Login
  const handleGateLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      await login(emailInput, passwordInput);
      toast.success("Authenticated as Administrator");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid credentials.";
      toast.error(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  // -------------------------------------------------------------
  // If user is not admin, show Obsidian styled Admin Gate
  // -------------------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-5 py-12 text-stark">
        <div className="w-full max-w-md rounded-2xl border border-titanium-border bg-titanium p-8 shadow-[0_24px_64px_rgba(0,0,0,0.8)]">
          {/* Header */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald/40 bg-emerald/10 text-emerald shadow-[0_0_24px_rgba(16,185,129,0.2)]">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="font-mono text-xl font-bold tracking-tight text-stark">
              VESPER CRM Administration
            </h1>
            <p className="mt-1 text-xs text-titanium-silver">
              Restricted portal for pipeline telemetry, lead scoring, and trial governance.
            </p>
          </div>

          <form onSubmit={handleGateLogin} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block font-mono text-xs text-titanium-silver">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3.5 py-2.5 font-mono text-xs text-stark placeholder-titanium-silver/50 focus:border-emerald focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block font-mono text-xs text-titanium-silver">Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3.5 py-2.5 font-mono text-xs text-stark placeholder-titanium-silver/50 focus:border-emerald focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-stark px-4 py-3 text-xs font-bold text-obsidian shadow-lg transition-all hover:bg-white active:scale-[0.98]"
            >
              <Lock className="h-4 w-4 text-obsidian" />
              <span>{authLoading ? "Verifying..." : "Access Admin CRM"}</span>
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs text-titanium-silver transition-colors hover:text-stark"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to VESPER Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Admin CRM Dashboard View
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-obsidian text-stark selection:bg-emerald/20 selection:text-emerald">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-titanium-border bg-obsidian/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-xs font-medium text-titanium-silver transition-colors hover:text-stark"
            >
              <ArrowLeft className="h-4 w-4 text-emerald" />
              <span className="hidden sm:inline">Landing Page</span>
            </Link>

            <div className="h-4 w-px bg-titanium-border" />

            <div className="flex items-center gap-2.5">
              <span className="font-mono text-sm font-bold tracking-[0.2em] text-stark">VESPER</span>
              <span className="flex items-center gap-1.5 rounded-md border border-emerald/40 bg-emerald/10 px-2 py-0.5 font-mono text-[10px] text-emerald">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
                <span>ADMIN CONSOLE</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {adminTab === "users" && (
              <>
                <button
                  type="button"
                  onClick={() => loadUsers(true)}
                  disabled={usersLoading}
                  className="flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium px-3 py-1.5 text-xs font-mono text-titanium-silver transition-all hover:border-emerald/40 hover:text-stark"
                  title="Refresh users and licenses"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${usersLoading ? "animate-spin text-emerald" : ""}`}
                  />
                  <span className="hidden sm:inline">Sync Users</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald px-3.5 py-1.5 text-xs font-semibold text-obsidian shadow transition-all hover:bg-emerald-400 active:scale-[0.98]"
                >
                  <Send className="h-3.5 w-3.5 text-obsidian" />
                  <span>Invite User</span>
                </button>
              </>
            )}

            {adminTab === "leads" && (
              <>
                <button
                  type="button"
                  onClick={() => loadData(true)}
                  disabled={refreshing}
                  className="flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium px-3 py-1.5 text-xs font-mono text-titanium-silver transition-all hover:border-emerald/40 hover:text-stark"
                  title="Refresh live CRM stats"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-emerald" : ""}`}
                  />
                  <span className="hidden sm:inline">Sync</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium px-3 py-1.5 text-xs font-mono text-titanium-silver transition-all hover:border-emerald/40 hover:text-stark"
                  title="Export leads to CSV"
                >
                  <Download className="h-3.5 w-3.5 text-emerald" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-stark px-3.5 py-1.5 text-xs font-semibold text-obsidian shadow transition-all hover:bg-white active:scale-[0.98]"
                >
                  <Plus className="h-3.5 w-3.5 text-obsidian" />
                  <span>New Lead</span>
                </button>
              </>
            )}

            {adminTab === "telemetry" && (
              <button
                type="button"
                onClick={loadTelemetry}
                disabled={telemetryLoading}
                className="flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium px-3 py-1.5 text-xs font-mono text-titanium-silver transition-all hover:border-emerald/40 hover:text-stark"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${telemetryLoading ? "animate-spin text-emerald" : ""}`}
                />
                <span className="hidden sm:inline">Refresh Telemetry</span>
              </button>
            )}


            <div className="h-4 w-px bg-titanium-border" />

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-titanium-elevated font-mono text-xs text-stark border border-titanium-border">
                {user?.name?.charAt(0) || "A"}
              </div>
              <button
                type="button"
                onClick={logout}
                className="text-xs text-titanium-silver transition-colors hover:text-stark"
                title="Sign out of Admin session"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sub-Navigation Bar */}
      <div className="border-b border-titanium-border bg-titanium/30 px-5 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto py-0">
          <button
            type="button"
            onClick={() => setAdminTab("users")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-mono transition-all whitespace-nowrap ${
              adminTab === "users"
                ? "border-emerald text-emerald font-semibold"
                : "border-transparent text-titanium-silver hover:text-stark"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>User Accounts & Licenses</span>
            <span className="rounded-full bg-titanium-elevated px-2 py-0.5 text-[10px] text-emerald border border-titanium-border">
              {users.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab("leads")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-mono transition-all whitespace-nowrap ${
              adminTab === "leads"
                ? "border-emerald text-emerald font-semibold"
                : "border-transparent text-titanium-silver hover:text-stark"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>CRM Sales Pipeline</span>
            <span className="rounded-full bg-titanium-elevated px-2 py-0.5 text-[10px] text-stark border border-titanium-border">
              {leads.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab("telemetry")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-mono transition-all whitespace-nowrap ${
              adminTab === "telemetry"
                ? "border-emerald text-emerald font-semibold"
                : "border-transparent text-titanium-silver hover:text-stark"
            }`}
          >
            <Server className="h-4 w-4" />
            <span>Infrastructure Telemetry</span>
            <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
          </button>

        </div>
      </div>

      {/* Main Admin Body */}
      <main className="mx-auto max-w-7xl px-5 py-8">
        {/* ============================================================= */}
        {/* TAB 1: USER ACCOUNTS & SOFTWARE LICENSES */}
        {/* ============================================================= */}
        {adminTab === "users" && (
          <div className="flex flex-col gap-8">
            {/* Metric Cards Row */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {/* Card 1: Total Accounts */}
              <div className="rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80">
                <div className="flex items-center justify-between text-titanium-silver">
                  <span className="font-mono text-xs uppercase tracking-wider">Total Accounts</span>
                  <Users className="h-4 w-4 text-titanium-silver" />
                </div>
                <div className="mt-3 font-mono text-2xl font-bold text-stark">
                  {userStats.total}
                </div>
                <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-emerald">
                  <Database className="h-3 w-3" />
                  <span>MongoDB Atlas synced</span>
                </div>
              </div>

              {/* Card 2: Verified Users */}
              <div className="rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80">
                <div className="flex items-center justify-between text-titanium-silver">
                  <span className="font-mono text-xs uppercase tracking-wider">Email Verified</span>
                  <UserCheck className="h-4 w-4 text-emerald" />
                </div>
                <div className="mt-3 font-mono text-2xl font-bold text-emerald">
                  {userStats.verified}
                </div>
                <div className="mt-1 font-mono text-[11px] text-titanium-silver">
                  Nodemailer & Google OAuth
                </div>
              </div>

              {/* Card 3: Active Desktop Licenses */}
              <div className="rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80">
                <div className="flex items-center justify-between text-titanium-silver">
                  <span className="font-mono text-xs uppercase tracking-wider">Active Licenses</span>
                  <Key className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="mt-3 font-mono text-2xl font-bold text-cyan-400">
                  {userStats.activeLicenses}
                </div>
                <div className="mt-1 font-mono text-[11px] text-titanium-silver">
                  Desktop client gate verified
                </div>
              </div>

              {/* Card 4: Pro / Enterprise Tiers */}
              <div className="rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80">
                <div className="flex items-center justify-between text-titanium-silver">
                  <span className="font-mono text-xs uppercase tracking-wider">Paid Subscribers</span>
                  <Award className="h-4 w-4 text-purple-400" />
                </div>
                <div className="mt-3 font-mono text-2xl font-bold text-stark">
                  {userStats.proTier}
                </div>
                <div className="mt-1 font-mono text-[11px] text-purple-400">
                  Pro ($29) & Enterprise
                </div>
              </div>

              {/* Card 5: Pending Verification */}
              <div className="rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80">
                <div className="flex items-center justify-between text-titanium-silver">
                  <span className="font-mono text-xs uppercase tracking-wider">Pending PIN</span>
                  <Clock className="h-4 w-4 text-amber-400" />
                </div>
                <div className="mt-3 font-mono text-2xl font-bold text-amber-400">
                  {userStats.pending}
                </div>
                <div className="mt-1 font-mono text-[11px] text-titanium-silver">
                  Awaiting email confirmation
                </div>
              </div>
            </section>

            {/* Filter and Search Bar */}
            <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-titanium-silver" />
                <input
                  type="text"
                  placeholder="Search users by name, email, license key..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-titanium-border bg-titanium pl-10 pr-4 py-2 text-xs text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUserFilter("all")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-colors border ${
                    userFilter === "all"
                      ? "border-emerald/40 bg-emerald/10 text-emerald"
                      : "border-titanium-border bg-titanium text-titanium-silver hover:text-stark"
                  }`}
                >
                  All ({users.length})
                </button>
                <button
                  type="button"
                  onClick={() => setUserFilter("verified")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-colors border ${
                    userFilter === "verified"
                      ? "border-emerald/40 bg-emerald/10 text-emerald"
                      : "border-titanium-border bg-titanium text-titanium-silver hover:text-stark"
                  }`}
                >
                  Verified ({userStats.verified})
                </button>
                <button
                  type="button"
                  onClick={() => setUserFilter("pending")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-colors border ${
                    userFilter === "pending"
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                      : "border-titanium-border bg-titanium text-titanium-silver hover:text-stark"
                  }`}
                >
                  Pending PIN ({userStats.pending})
                </button>
                <button
                  type="button"
                  onClick={() => setUserFilter("activeLicense")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-colors border ${
                    userFilter === "activeLicense"
                      ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                      : "border-titanium-border bg-titanium text-titanium-silver hover:text-stark"
                  }`}
                >
                  Active Licenses ({userStats.activeLicenses})
                </button>
              </div>
            </section>

            {/* Users Table */}
            <div className="overflow-hidden rounded-xl border border-titanium-border bg-titanium shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-titanium-border bg-titanium-elevated font-mono text-[11px] uppercase tracking-wider text-titanium-silver">
                    <tr>
                      <th className="px-5 py-3.5">User Identity</th>
                      <th className="px-4 py-3.5">Auth Provider</th>
                      <th className="px-4 py-3.5">Verification Status</th>
                      <th className="px-4 py-3.5">Software License</th>
                      <th className="px-4 py-3.5">Subscription Tier</th>
                      <th className="px-4 py-3.5">Usage Quota</th>
                      <th className="px-5 py-3.5 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-titanium-border font-sans">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center text-titanium-silver">
                          {usersLoading ? "Loading user accounts..." : "No users match the search filters."}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="transition-colors hover:bg-titanium-elevated/60">
                          {/* Identity */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-titanium-elevated font-mono text-xs font-bold text-stark border border-titanium-border">
                                {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                              </div>
                              <div>
                                <div className="font-semibold text-stark">{u.name || "Anonymous User"}</div>
                                <div className="font-mono text-[11px] text-titanium-silver">{u.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Provider */}
                          <td className="px-4 py-3.5">
                            {u.provider === "google" ? (
                              <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 font-mono text-[10px] text-blue-400">
                                <span>Google OAuth</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-md border border-titanium-border bg-titanium-elevated px-2 py-0.5 font-mono text-[10px] text-titanium-silver">
                                <span>Email / Password</span>
                              </span>
                            )}
                          </td>

                          {/* Verification */}
                          <td className="px-4 py-3.5">
                            {u.isVerified ? (
                              <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald/40 bg-emerald/10 px-2 py-0.5 font-mono text-[10px] text-emerald">
                                <CheckCircle className="h-3 w-3" />
                                <span>Verified</span>
                              </span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-400">
                                  <AlertCircle className="h-3 w-3" />
                                  <span>Pending PIN</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleToggleUserVerify(u.id, false)}
                                  className="rounded border border-titanium-border bg-titanium-elevated px-2 py-0.5 font-mono text-[10px] text-stark hover:border-emerald hover:text-emerald transition-colors"
                                  title="Manually verify and accept user"
                                >
                                  Accept Now
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Software License */}
                          <td className="px-4 py-3.5">
                            {u.licenseKey ? (
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 rounded bg-titanium-elevated px-2 py-1 font-mono text-[11px] text-stark border border-titanium-border">
                                  <Key className="h-3 w-3 text-titanium-silver" />
                                  <span>{u.licenseKey}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopyLicenseKey(u.licenseKey!, u.id)}
                                  className="rounded p-1 text-titanium-silver hover:text-stark"
                                  title="Copy license key"
                                >
                                  {copiedKeyId === u.id ? (
                                    <Check className="h-3.5 w-3.5 text-emerald" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleLicenseActive(u.id, u.licenseActive)}
                                  className={`rounded px-1.5 py-0.5 font-mono text-[10px] transition-colors ${
                                    u.licenseActive
                                      ? "bg-emerald/15 text-emerald border border-emerald/40"
                                      : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                                  }`}
                                  title="Toggle license active status"
                                >
                                  {u.licenseActive ? "Active" : "Revoked"}
                                </button>
                              </div>
                            ) : (
                              <span className="font-mono text-[11px] text-titanium-silver">No key issued</span>
                            )}
                          </td>

                          {/* Tier */}
                          <td className="px-4 py-3.5">
                            <select
                              value={u.tier || "free"}
                              onChange={(e) =>
                                handleChangeTier(
                                  u.id,
                                  e.target.value as "free" | "pro" | "enterprise"
                                )
                              }
                              className="rounded-lg border border-titanium-border bg-titanium-elevated px-2.5 py-1 font-mono text-xs text-stark focus:border-emerald focus:outline-none"
                            >
                              <option value="free">Free Tier</option>
                              <option value="pro">Pro ($29/mo)</option>
                              <option value="enterprise">Enterprise</option>
                            </select>
                          </td>

                          {/* Quota */}
                          <td className="px-4 py-3.5 font-mono text-[11px] text-titanium-silver">
                            {u.tier === "enterprise"
                              ? "Unlimited"
                              : u.tier === "pro"
                                ? "5,000 / mo"
                                : `${u.usageQuota || 100} / mo`}
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleUserVerify(u.id, u.isVerified)}
                                className={`rounded px-2 py-1 font-mono text-[10px] transition-colors ${
                                  u.isVerified
                                    ? "text-titanium-silver hover:text-rose-400"
                                    : "text-emerald hover:underline"
                                }`}
                              >
                                {u.isVerified ? "Revoke Verify" : "Verify User"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 2: CRM SALES PIPELINE */}
        {/* ============================================================= */}
        {adminTab === "leads" && (
          <>
            {/* Metric Cards Row */}
            <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Card 1: Total Leads */}
          <div className="rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80">
            <div className="flex items-center justify-between text-titanium-silver">
              <span className="font-mono text-xs uppercase tracking-wider">Total Leads</span>
              <Users className="h-4 w-4 text-titanium-silver" />
            </div>
            <div className="mt-3 font-mono text-2xl font-bold text-stark">
              {stats ? stats.totalLeads : leads.length}
            </div>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-emerald">
              <TrendingUp className="h-3 w-3" />
              <span>+14% this week</span>
            </div>
          </div>

          {/* Card 2: Pipeline Value */}
          <div className="rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80">
            <div className="flex items-center justify-between text-titanium-silver">
              <span className="font-mono text-xs uppercase tracking-wider">Pipeline Value</span>
              <DollarSign className="h-4 w-4 text-emerald" />
            </div>
            <div className="mt-3 font-mono text-2xl font-bold text-stark">
              ${(stats?.totalPipelineValue ?? stats?.pipelineValue ?? 0).toLocaleString()}
            </div>
            <div className="mt-1 font-mono text-[11px] text-titanium-silver">
              ARR expansion projection
            </div>
          </div>

          {/* Card 3: Win Rate / Conversion */}
          <div className="rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80">
            <div className="flex items-center justify-between text-titanium-silver">
              <span className="font-mono text-xs uppercase tracking-wider">Win Rate</span>
              <Award className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-3 font-mono text-2xl font-bold text-stark">
              {stats ? `${stats.conversionRate ?? 0}%` : "0%"}
            </div>
            <div className="mt-1 font-mono text-[11px] text-titanium-silver">
              Trial to paid velocity
            </div>
          </div>

          {/* Card 4: Qualified Leads */}
          <div className="rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80">
            <div className="flex items-center justify-between text-titanium-silver">
              <span className="font-mono text-xs uppercase tracking-wider">Qualified Leads</span>
              <CheckCircle className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-3 font-mono text-2xl font-bold text-stark">
              {stats ? (stats.qualifiedLeads ?? stats.leadsByStatus?.["Qualified"] ?? 0) : 0}
            </div>
            <div className="mt-1 font-mono text-[11px] text-cyan-400">High intent builders</div>
          </div>

          {/* Card 5: Pro Trials */}
          <div className="rounded-xl border border-titanium-border bg-titanium p-5 shadow-sm transition-all hover:border-titanium-border/80">
            <div className="flex items-center justify-between text-titanium-silver">
              <span className="font-mono text-xs uppercase tracking-wider">Active Pro Trials</span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-3 font-mono text-2xl font-bold text-stark">
              {stats ? (stats.activeTrials ?? stats.proTrials ?? stats.leadsByStatus?.["Pro Trial"] ?? 0) : 0}
            </div>
            <div className="mt-1 font-mono text-[11px] text-amber-400">In-app activation</div>
          </div>
        </section>

        {/* Pipeline Stage Visual Breakdown */}
        <section className="mb-8 rounded-xl border border-titanium-border bg-titanium p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-wider text-titanium-silver">
              Pipeline Funnel Velocity
            </h2>
          </div>

          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-titanium-elevated">
            {ALL_STAGES.map((stg) => {
              const count = stageCounts[stg] || 0;
              const pct = leads.length > 0 ? (count / leads.length) * 100 : 0;
              if (pct === 0) return null;
              let bg = "bg-titanium-silver";
              if (stg === "Closed Won") bg = "bg-emerald";
              if (stg === "Enterprise Pilot") bg = "bg-purple-500";
              if (stg === "Pro Trial") bg = "bg-amber-500";
              if (stg === "Qualified") bg = "bg-cyan-500";
              if (stg === "Contacted") bg = "bg-blue-500";
              if (stg === "Lost") bg = "bg-zinc-700";

              return (
                <div
                  key={stg}
                  style={{ width: `${pct}%` }}
                  className={`${bg} transition-all duration-300`}
                  title={`${stg}: ${count} leads (${pct.toFixed(0)}%)`}
                />
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap gap-4 pt-1 font-mono text-[11px]">
            {ALL_STAGES.map((stg) => {
              const count = stageCounts[stg] || 0;
              return (
                <button
                  key={stg}
                  type="button"
                  onClick={() => setSelectedStage(selectedStage === stg ? "All" : stg)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    selectedStage === stg
                      ? "text-stark font-semibold"
                      : "text-titanium-silver hover:text-stark"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      stg === "Closed Won"
                        ? "bg-emerald"
                        : stg === "Enterprise Pilot"
                          ? "bg-purple-500"
                          : stg === "Pro Trial"
                            ? "bg-amber-500"
                            : stg === "Qualified"
                              ? "bg-cyan-500"
                              : stg === "Contacted"
                                ? "bg-blue-500"
                                : stg === "Lost"
                                  ? "bg-zinc-700"
                                  : "bg-titanium-silver"
                    }`}
                  />
                  <span>
                    {stg} ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Filter and Search Bar */}
        <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-titanium-silver" />
            <input
              type="text"
              placeholder="Search leads by name, email, company, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-titanium-border bg-titanium pl-10 pr-4 py-2 text-xs text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
            />
          </div>

          {/* Stage pills & View toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="rounded-xl border border-titanium-border bg-titanium px-3 py-2 font-mono text-xs text-stark focus:border-emerald focus:outline-none"
            >
              <option value="All">All Stages ({leads.length})</option>
              {ALL_STAGES.map((s) => (
                <option key={s} value={s}>
                  {s} ({stageCounts[s] || 0})
                </option>
              ))}
            </select>

            <div className="flex rounded-xl border border-titanium-border bg-titanium p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
                  viewMode === "table"
                    ? "bg-titanium-elevated text-stark font-semibold"
                    : "text-titanium-silver hover:text-stark"
                }`}
              >
                Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
                  viewMode === "kanban"
                    ? "bg-titanium-elevated text-stark font-semibold"
                    : "text-titanium-silver hover:text-stark"
                }`}
              >
                Cards
              </button>
            </div>
          </div>
        </section>

        {/* Lead Table View */}
        {viewMode === "table" && (
          <div className="overflow-hidden rounded-xl border border-titanium-border bg-titanium shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-titanium-border bg-titanium-elevated font-mono text-[11px] uppercase tracking-wider text-titanium-silver">
                  <tr>
                    <th className="px-5 py-3.5">Lead / Contact</th>
                    <th className="px-4 py-3.5">Company & Role</th>
                    <th className="px-4 py-3.5">Pipeline Stage</th>
                    <th className="px-4 py-3.5">Deal Value</th>
                    <th className="px-4 py-3.5">Score</th>
                    <th className="px-4 py-3.5">Last Touch</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-titanium-border font-sans">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-titanium-silver">
                        No leads match the active search and stage criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="transition-colors hover:bg-titanium-elevated/60">
                        {/* Contact */}
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-stark">{lead.name}</div>
                          <div className="font-mono text-[11px] text-titanium-silver">
                            {lead.email}
                          </div>
                        </td>

                        {/* Company & Role */}
                        <td className="px-4 py-3.5">
                          <div className="text-stark font-medium">{lead.company}</div>
                          <div className="text-[11px] text-titanium-silver truncate max-w-[180px]">
                            {lead.useCase || "Developer Workstation"}
                          </div>
                        </td>

                        {/* Stage Selector */}
                        <td className="px-4 py-3.5">
                          <select
                            value={lead.stage}
                            onChange={(e) => handleStageChange(lead.id, e.target.value)}
                            className={`rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors focus:outline-none ${getStageBadgeClass(
                              lead.stage,
                            )}`}
                          >
                            {ALL_STAGES.map((s) => (
                              <option key={s} value={s} className="bg-titanium text-stark">
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Deal Value */}
                        <td className="px-4 py-3.5 font-mono font-medium text-stark">
                          ${(lead.dealValue ?? (lead as any).value ?? 0).toLocaleString()}
                        </td>

                        {/* Score */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                lead.score >= 85
                                  ? "bg-emerald"
                                  : lead.score >= 70
                                    ? "bg-amber-400"
                                    : "bg-titanium-silver"
                              }`}
                            />
                            <span>{lead.score}/100</span>
                          </div>
                        </td>

                        {/* Last Touch */}
                        <td className="px-4 py-3.5 font-mono text-[11px] text-titanium-silver whitespace-nowrap">
                          {lead.lastContacted || lead.createdAt?.slice(0, 10)}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveLead(lead);
                                setIsDetailModalOpen(true);
                              }}
                              className="rounded-lg border border-titanium-border bg-titanium-elevated px-2.5 py-1 font-mono text-[11px] text-titanium-silver hover:text-stark hover:border-titanium-silver/40"
                              title="Inspect lead details"
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLead(lead.id)}
                              className="rounded-lg p-1 text-titanium-silver hover:text-rose-400"
                              title="Delete lead"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Lead Kanban / Cards View */}
        {viewMode === "kanban" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex flex-col justify-between rounded-xl border border-titanium-border bg-titanium p-5 transition-all hover:border-titanium-border/80"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-stark">{lead.name}</h3>
                      <p className="font-mono text-xs text-titanium-silver">{lead.email}</p>
                    </div>
                    <span
                      className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold ${getStageBadgeClass(
                        lead.stage,
                      )}`}
                    >
                      {lead.stage}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 rounded-lg border border-titanium-border bg-titanium-elevated p-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-titanium-silver">Company:</span>
                      <span className="font-medium text-stark">{lead.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-titanium-silver">Deal Value:</span>
                      <span className="font-mono font-medium text-stark">
                        ${(lead.dealValue ?? (lead as any).value ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-titanium-silver">Lead Score:</span>
                      <span className="font-mono font-semibold text-emerald">{lead.score}/100</span>
                    </div>
                  </div>

                  {lead.notes && (
                    <p className="mt-3 line-clamp-2 text-xs text-titanium-silver italic">
                      "{lead.notes}"
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between pt-3 border-t border-titanium-border">
                  <select
                    value={lead.stage}
                    onChange={(e) => handleStageChange(lead.id, e.target.value)}
                    className="rounded-md border border-titanium-border bg-titanium px-2 py-1 font-mono text-[10px] text-stark focus:outline-none"
                  >
                    {ALL_STAGES.map((s) => (
                      <option key={s} value={s}>
                        Move: {s}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveLead(lead);
                        setIsDetailModalOpen(true);
                      }}
                      className="font-mono text-xs text-titanium-silver hover:text-stark"
                    >
                      Inspect
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLead(lead.id)}
                      className="text-titanium-silver hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}

        {/* ============================================================= */}
        {/* TAB 3: INFRASTRUCTURE & TELEMETRY */}
        {/* ============================================================= */}
        {adminTab === "telemetry" && (
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-titanium-border bg-titanium p-6">
              <div className="flex items-center justify-between border-b border-titanium-border pb-4">
                <div>
                  <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-stark">
                    System Health & Infrastructure Telemetry
                  </h2>
                  <p className="mt-1 text-xs text-titanium-silver">
                    Live telemetry for database replica sets, Nodemailer SMTP transport, and desktop license gates.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald animate-pulse" />
                  <span className="font-mono text-xs font-semibold text-emerald">ONLINE & OPERATIONAL</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Metric 1: Database */}
                <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                  <div className="flex items-center justify-between text-titanium-silver">
                    <span className="font-mono text-xs uppercase">Primary Database</span>
                    <Database className="h-4 w-4 text-emerald" />
                  </div>
                  <div className="mt-2 font-mono text-base font-bold text-stark">
                    {telemetry?.mongoConnected ? "MongoDB Atlas" : "Local Memory (Resilient)"}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-titanium-silver truncate">
                    cluster0.hbxhsws.mongodb.net
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 font-mono text-[10px] text-emerald">
                    <CheckCircle className="h-3 w-3" />
                    <span>Replica Set Connected</span>
                  </div>
                </div>

                {/* Metric 2: Nodemailer */}
                <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                  <div className="flex items-center justify-between text-titanium-silver">
                    <span className="font-mono text-xs uppercase">Email Dispatch Engine</span>
                    <Mail className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="mt-2 font-mono text-base font-bold text-stark">
                    Nodemailer SMTP
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-titanium-silver">
                    TLS 587 Gateway + Local Fallback
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 font-mono text-[10px] text-cyan-400">
                    <CheckCircle className="h-3 w-3" />
                    <span>PIN & License Delivery Active</span>
                  </div>
                </div>

                {/* Metric 3: License Gate */}
                <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                  <div className="flex items-center justify-between text-titanium-silver">
                    <span className="font-mono text-xs uppercase">Desktop Software Gate</span>
                    <Key className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="mt-2 font-mono text-base font-bold text-stark">
                    /api/license/verify
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-titanium-silver">
                    Subscription & Quota Validation
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 font-mono text-[10px] text-purple-400">
                    <Shield className="h-3 w-3" />
                    <span>Cryptographic Verification Gate</span>
                  </div>
                </div>

                {/* Metric 4: Speech Engine */}
                <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                  <div className="flex items-center justify-between text-titanium-silver">
                    <span className="font-mono text-xs uppercase">Speech Pipeline</span>
                    <Zap className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="mt-2 font-mono text-base font-bold text-stark">
                    Ultra-Low Latency
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-titanium-silver">
                    Zero-Focus Steal Low-Level Hook
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 font-mono text-[10px] text-amber-400">
                    <Activity className="h-3 w-3" />
                    <span>Average Latency &lt; 350ms</span>
                  </div>
                </div>
              </div>

              {/* Collections & Storage Overview */}
              <div className="mt-6 rounded-xl border border-titanium-border bg-titanium-elevated p-5">
                <h3 className="font-mono text-xs font-semibold uppercase text-titanium-silver">
                  Active Database Collections & Architecture
                </h3>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4 font-mono text-xs">
                  <div className="rounded-lg border border-titanium-border bg-titanium p-3">
                    <div className="text-[10px] uppercase text-titanium-silver">Collection</div>
                    <div className="font-bold text-stark mt-0.5">users</div>
                    <div className="text-[10px] text-emerald mt-1">{users.length} documents</div>
                  </div>
                  <div className="rounded-lg border border-titanium-border bg-titanium p-3">
                    <div className="text-[10px] uppercase text-titanium-silver">Collection</div>
                    <div className="font-bold text-stark mt-0.5">leads</div>
                    <div className="text-[10px] text-cyan-400 mt-1">{leads.length} documents</div>
                  </div>
                  <div className="rounded-lg border border-titanium-border bg-titanium p-3">
                    <div className="text-[10px] uppercase text-titanium-silver">Release</div>
                    <div className="font-bold text-stark mt-0.5">v1.0.0 Production</div>
                    <div className="text-[10px] text-titanium-silver mt-1">Desktop Suite Active</div>
                  </div>
                  <div className="rounded-lg border border-titanium-border bg-titanium p-3">
                    <div className="text-[10px] uppercase text-titanium-silver">Uptime</div>
                    <div className="font-bold text-stark mt-0.5">
                      {telemetry?.uptime ? `${Math.floor(telemetry.uptime / 60)} mins` : "Live"}
                    </div>
                    <div className="text-[10px] text-emerald mt-1">100% SLA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ------------------------------------------------------------- */}
      {/* Modal: Lead Details Inspector */}
      {/* ------------------------------------------------------------- */}
      {isDetailModalOpen && activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-titanium-border bg-titanium p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-titanium-border pb-4">
              <div>
                <h3 className="text-base font-bold text-stark">{activeLead.name}</h3>
                <p className="font-mono text-xs text-titanium-silver">{activeLead.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="text-titanium-silver hover:text-stark"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-3">
                  <div className="text-titanium-silver font-mono text-[10px] uppercase">
                    Company
                  </div>
                  <div className="font-semibold text-stark mt-0.5">{activeLead.company}</div>
                </div>
                <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-3">
                  <div className="text-titanium-silver font-mono text-[10px] uppercase">
                    Pipeline Value
                  </div>
                  <div className="font-mono font-semibold text-stark mt-0.5">
                    ${(activeLead.dealValue ?? (activeLead as any).value ?? 0).toLocaleString()}
                  </div>
                </div>
                <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-3">
                  <div className="text-titanium-silver font-mono text-[10px] uppercase">Stage</div>
                  <div className="font-mono font-semibold text-emerald mt-0.5">
                    {activeLead.stage}
                  </div>
                </div>
                <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-3">
                  <div className="text-titanium-silver font-mono text-[10px] uppercase">
                    Lead Score
                  </div>
                  <div className="font-mono font-semibold text-stark mt-0.5">
                    {activeLead.score}/100
                  </div>
                </div>
              </div>

              {activeLead.useCase && (
                <div>
                  <div className="font-mono text-[11px] text-titanium-silver uppercase">
                    Environment & Workflow
                  </div>
                  <div className="mt-1 rounded-xl border border-titanium-border bg-titanium-elevated p-3 text-xs text-stark">
                    {activeLead.useCase}
                  </div>
                </div>
              )}

              {activeLead.notes && (
                <div>
                  <div className="font-mono text-[11px] text-titanium-silver uppercase">
                    Executive Notes & Logs
                  </div>
                  <div className="mt-1 rounded-xl border border-titanium-border bg-titanium-elevated p-3 text-xs text-titanium-silver leading-relaxed">
                    {activeLead.notes}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-between items-center border-t border-titanium-border">
                <span className="font-mono text-[10px] text-titanium-silver">
                  Recorded: {activeLead.createdAt || "Live Session"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="rounded-lg bg-stark px-4 py-2 text-xs font-semibold text-obsidian hover:bg-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Modal: Add New Lead */}
      {/* ------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-titanium-border bg-titanium p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-titanium-border pb-4">
              <h3 className="font-mono text-sm font-bold text-stark">Add New CRM Lead</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-titanium-silver hover:text-stark"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="mt-4 flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono text-[11px] text-titanium-silver">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Hayes"
                    value={newLeadForm.name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    className="w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[11px] text-titanium-silver">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jordan@company.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono text-[11px] text-titanium-silver">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Stripe, OpenAI, Studio"
                    value={newLeadForm.company}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
                    className="w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[11px] text-titanium-silver">
                    Pipeline Stage
                  </label>
                  <select
                    value={newLeadForm.stage}
                    onChange={(e) =>
                      setNewLeadForm({
                        ...newLeadForm,
                        stage: e.target.value as LeadStage,
                      })
                    }
                    className="w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 font-mono text-stark focus:border-emerald focus:outline-none"
                  >
                    {ALL_STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono text-[11px] text-titanium-silver">
                    Deal Value ($ ARR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={newLeadForm.value}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, value: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 font-mono text-stark focus:border-emerald focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[11px] text-titanium-silver">
                    Lead Score (1-100)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newLeadForm.score}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, score: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 font-mono text-stark focus:border-emerald focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-mono text-[11px] text-titanium-silver">
                  Use Case & Technical Environment
                </label>
                <input
                  type="text"
                  placeholder="e.g. VS Code, Terminal, CUDA RTX 4090"
                  value={newLeadForm.useCase}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, useCase: e.target.value })}
                  className="w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[11px] text-titanium-silver">
                  Discovery Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Inquiry notes, follow-up timeline, team size..."
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  className="w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
                />
              </div>

              <div className="mt-2 flex justify-end gap-2 border-t border-titanium-border pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-titanium-border px-4 py-2 text-titanium-silver hover:text-stark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-stark px-5 py-2 font-semibold text-obsidian hover:bg-white"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Modal: Invite User & Issue Software License */}
      {/* ------------------------------------------------------------- */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-titanium-border bg-titanium p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-titanium-border pb-4">
              <div>
                <h3 className="font-mono text-sm font-bold text-stark">Invite Developer & Issue License</h3>
                <p className="mt-0.5 text-xs text-titanium-silver">
                  Provisions a new user account and dispatches an automated verification email with an official desktop license key.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="text-titanium-silver hover:text-stark"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteUser} className="mt-4 flex flex-col gap-4 text-xs">
              <div>
                <label className="mb-1 block font-mono text-[11px] text-titanium-silver">
                  Developer Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Hayes"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[11px] text-titanium-silver">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="jordan@company.com"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 text-stark placeholder-titanium-silver focus:border-emerald focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[11px] text-titanium-silver">
                  Initial Subscription Tier
                </label>
                <select
                  value={inviteForm.tier}
                  onChange={(e) =>
                    setInviteForm({
                      ...inviteForm,
                      tier: e.target.value as "free" | "pro" | "enterprise",
                    })
                  }
                  className="w-full rounded-xl border border-titanium-border bg-titanium-elevated px-3 py-2 font-mono text-stark focus:border-emerald focus:outline-none"
                >
                  <option value="free">Free Tier (100 dictations/mo)</option>
                  <option value="pro">Pro ($29/mo, 5,000 dictations/mo)</option>
                  <option value="enterprise">Enterprise (Unlimited, Dedicated SLA)</option>
                </select>
              </div>

              <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-3 text-xs text-titanium-silver">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald">
                  <Mail className="h-3 w-3" />
                  <span>Automated Nodemailer Dispatch</span>
                </div>
                <p className="mt-1 text-[11px] text-titanium-silver leading-relaxed">
                  The recipient will receive an onboarding email containing a 6-digit verification code and their pre-provisioned VESPER desktop software license key (<code className="text-emerald">VESPER-XXXX-XXXX-XXXX</code>).
                </p>
              </div>

              <div className="mt-2 flex justify-end gap-2 border-t border-titanium-border pt-4">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="rounded-xl border border-titanium-border px-4 py-2 text-titanium-silver hover:text-stark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald px-5 py-2 font-semibold text-obsidian hover:bg-emerald-400"
                >
                  Dispatch Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
