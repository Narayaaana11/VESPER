//#region node_modules/.nitro/vite/services/ssr/assets/crm-service-Yn1PsX10.js
var crmService = {
	async getStats() {
		const res = await fetch("/api/crm/stats");
		if (!res.ok) throw new Error("Failed to load CRM stats");
		return res.json();
	},
	async getLeads(query = "", status = "All") {
		const params = new URLSearchParams();
		if (query) params.set("q", query);
		if (status && status !== "All") params.set("status", status);
		const res = await fetch(`/api/crm/leads?${params.toString()}`);
		if (!res.ok) throw new Error("Failed to load CRM leads");
		return res.json();
	},
	async createLead(data) {
		const payload = {
			name: data.name,
			email: data.email,
			...data.company ? { company: data.company } : {},
			...data.useCase ? { useCase: data.useCase } : {},
			...data.platforms ? { platforms: data.platforms } : {},
			...data.hardware ? { hardware: data.hardware } : {},
			dealValue: typeof data.dealValue === "number" ? data.dealValue : typeof data.value === "number" ? data.value : 0,
			status: data.status || data.stage || "New Lead",
			...data.notes ? { notes: data.notes } : {}
		};
		const res = await fetch("/api/crm/leads", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});
		if (!res.ok) throw new Error("Failed to create lead");
		return (await res.json()).lead;
	},
	async updateLead(id, updates) {
		const payload = {
			...updates,
			...updates.stage ? { status: updates.stage } : {}
		};
		const res = await fetch(`/api/crm/leads/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});
		if (!res.ok) throw new Error("Failed to update lead");
		return (await res.json()).lead;
	},
	async deleteLead(id) {
		return (await fetch(`/api/crm/leads/${id}`, { method: "DELETE" })).ok;
	},
	async seedInitialLeads() {
		if (!(await fetch("/api/crm/seed", { method: "POST" })).ok) throw new Error("Failed to reset CRM leads");
	},
	async seedPipeline() {
		return this.seedInitialLeads();
	},
	async exportCsv(leads) {
		let targetLeads = leads;
		if (!targetLeads || targetLeads.length === 0) targetLeads = (await this.getLeads()).leads;
		if (!targetLeads || targetLeads.length === 0) return;
		const headers = [
			"Ticket",
			"Full Name",
			"Email Address",
			"Company",
			"Stage",
			"Deal Value ($)",
			"Role / Use Case",
			"Platforms",
			"Hardware Target",
			"Notes",
			"Created At"
		];
		const rows = leads.map((l) => [
			`"#${l.position}"`,
			`"${l.name.replace(/"/g, "\"\"")}"`,
			`"${l.email.replace(/"/g, "\"\"")}"`,
			`"${(l.company || "").replace(/"/g, "\"\"")}"`,
			`"${l.status}"`,
			`"${l.dealValue || 0}"`,
			`"${l.useCase.replace(/"/g, "\"\"")}"`,
			`"${(l.platforms || []).join("; ").replace(/"/g, "\"\"")}"`,
			`"${(l.hardware || "Unspecified").replace(/"/g, "\"\"")}"`,
			`"${(l.notes || "").replace(/"/g, "\"\"")}"`,
			`"${l.createdAt}"`
		]);
		const csvContent = "﻿" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", `VESPER_CRM_Pipeline_${Date.now()}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}
};
//#endregion
export { crmService as t };
