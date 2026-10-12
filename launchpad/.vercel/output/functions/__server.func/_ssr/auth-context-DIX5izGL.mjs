import { r as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-context-DIX5izGL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)(void 0);
var TOKEN_KEY = "vesper_auth_token";
var USER_KEY = "vesper_auth_user";
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [token, setToken] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isAuthModalOpen, setIsAuthModalOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const storedToken = localStorage.getItem(TOKEN_KEY);
			const storedUser = localStorage.getItem(USER_KEY);
			if (storedToken && storedUser) {
				setToken(storedToken);
				setUser(JSON.parse(storedUser));
			}
			if (typeof window !== "undefined") {
				const checkHash = () => {
					if (window.location.hash.includes("signup") || window.location.hash.includes("login") || window.location.search.includes("auth=true")) setIsAuthModalOpen(true);
				};
				checkHash();
				window.addEventListener("hashchange", checkHash);
				return () => window.removeEventListener("hashchange", checkHash);
			}
		} catch {} finally {
			setIsLoading(false);
		}
	}, []);
	const saveSession = (newToken, newUser) => {
		setToken(newToken);
		setUser(newUser);
		try {
			localStorage.setItem(TOKEN_KEY, newToken);
			localStorage.setItem(USER_KEY, JSON.stringify(newUser));
		} catch {}
	};
	const login = async (email, password) => {
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					password
				})
			});
			const data = await res.json();
			if (!res.ok) {
				toast.error(data.error || "Login failed");
				return false;
			}
			saveSession(data.token, data.user);
			toast.success(`Welcome back, ${data.user.name}!`, { description: data.user.role === "admin" ? "Logged in with Admin CRM privileges." : "Ready to rock." });
			setIsAuthModalOpen(false);
			return true;
		} catch {
			toast.error("Network error during login. Check connection.");
			return false;
		}
	};
	const signup = async (email, password, name) => {
		try {
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					password,
					name
				})
			});
			const data = await res.json();
			if (!res.ok) {
				toast.error(data.error || "Signup failed");
				return false;
			}
			saveSession(data.token, data.user);
			toast.success("Welcome to VESPER!", { description: "Your account and license are active. A welcome email has been sent." });
			setIsAuthModalOpen(false);
			return true;
		} catch {
			toast.error("Network error during account registration.");
			return false;
		}
	};
	const loginWithGoogle = async () => {
		toast.info("Google Sign-In is currently in progress. Please use email authentication — we are working on that.", { duration: 5e3 });
		return false;
	};
	const sendVerificationEmail = async (email) => {
		try {
			const res = await fetch("/api/auth/send-verification", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email })
			});
			const data = await res.json();
			if (!res.ok) {
				toast.error(data.error || "Failed to send verification email");
				return {
					success: false,
					message: data.error
				};
			}
			toast.success(data.message || "Verification code sent to your email!");
			return {
				success: true,
				simulatedPin: data.simulatedPin,
				message: data.message
			};
		} catch {
			toast.error("Network error sending verification code.");
			return { success: false };
		}
	};
	const verifyEmail = async (email, code) => {
		try {
			const res = await fetch("/api/auth/verify-email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					code
				})
			});
			const data = await res.json();
			if (!res.ok) {
				toast.error(data.error || "Email verification failed");
				return false;
			}
			if (user && user.email.toLowerCase() === email.toLowerCase()) {
				const updated = {
					...user,
					isVerified: true,
					licenseActive: true,
					licenseKey: data.licenseKey || user.licenseKey
				};
				setUser(updated);
				localStorage.setItem(USER_KEY, JSON.stringify(updated));
			}
			toast.success("Email verified!", { description: `Software license activated: ${data.licenseKey || "Active"}` });
			return true;
		} catch {
			toast.error("Network error verifying email.");
			return false;
		}
	};
	const verifyLicense = async (licenseKey) => {
		try {
			return await (await fetch("/api/license/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ licenseKey })
			})).json();
		} catch {
			return {
				valid: false,
				error: "Network error reaching license verification gateway."
			};
		}
	};
	const logout = () => {
		setToken(null);
		setUser(null);
		try {
			localStorage.removeItem(TOKEN_KEY);
			localStorage.removeItem(USER_KEY);
		} catch {}
		toast.info("Signed out of VESPER.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			user,
			token,
			isLoading,
			isAdmin: user?.role === "admin",
			isAuthModalOpen,
			openAuthModal: () => setIsAuthModalOpen(true),
			closeAuthModal: () => setIsAuthModalOpen(false),
			login,
			signup,
			loginWithGoogle,
			sendVerificationEmail,
			verifyEmail,
			verifyLicense,
			logout
		},
		children
	});
}
function useAuth() {
	const context = (0, import_react.useContext)(AuthContext);
	if (!context) throw new Error("useAuth must be used within an AuthProvider");
	return context;
}
//#endregion
export { useAuth as n, AuthProvider as t };
