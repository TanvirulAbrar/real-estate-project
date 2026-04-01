"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { MdVisibility, MdArrowForward, MdIosShare } from "react-icons/md";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleDemoLogin = async (role: string = "user") => {
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const demoCredentials = {
        user: { email: "user@example.com", password: "123456" },
        agent: { email: "agent@example.com", password: "123456" },
        admin: { email: "admin@example.com", password: "123456" },
      };

      const credentials = demoCredentials[role as keyof typeof demoCredentials];

      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: true,
        callbackUrl:
          role === "admin"
            ? "/admin/dashboard"
            : role === "agent"
              ? "/agent/dashboard"
              : "/dashboard/profile",
      });

      if (result?.error) {
        setSubmitMessage("Demo login failed. Please try again.");
      } else {
        setSubmitMessage(
          `Demo login successful! Redirecting to ${role} dashboard...`,
        );
      }
    } catch (error) {
      console.error("Demo login error:", error);
      setSubmitMessage("Demo login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setSubmitMessage("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: true,
        callbackUrl: "/dashboard/profile",
      });

      if (result?.error) {
        setSubmitMessage("Login failed. Please check your credentials.");
      } else {
        setSubmitMessage("Login successful! Redirecting to dashboard...");
      }
    } catch (error) {
      console.error("Login error:", error);
      setSubmitMessage("Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen font-inter text-[#e1e2e9] selection:bg-[#a9c7ff] selection:text-[#001b3d] overflow-x-hidden"
      style={{
        background:
          "radial-gradient(circle at top right, #00132e 0%, #000e25 100%)",
      }}
    >
      <main className="relative mt-12 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[#a9c7ff]/5 blur-[120px]"></div>
          <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-[#374969]/10 blur-[100px]"></div>
        </div>

        <div className="relative w-full max-w-2xl">
          <div className="bg-white/5 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-[0_48px_100px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col items-center text-center">
              <div className="mb-8 sm:mb-12">
                <span className="block text-[#a9c7ff] text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-4">
                  Established Excellence
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-inter tracking-tighter text-white leading-none uppercase">
                  WELCOME BACK
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="w-full space-y-10">
                <div className="relative group text-left">
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-[#c2c6d3] mb-2 ml-1">
                    Email Address
                  </label>
                  <input
                    className="w-full bg-transparent border-0 border-b border-[#424751] py-4 px-1 text-white placeholder:text-white/20 focus:ring-0 focus:border-[#a9c7ff] transition-colors text-lg"
                    placeholder="name@domain.com"
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="relative group text-left">
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-[#c2c6d3] mb-2 ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-transparent border-0 border-b border-[#424751] py-4 px-1 text-white placeholder:text-white/20 focus:ring-0 focus:border-[#a9c7ff] transition-colors text-lg"
                      placeholder="•••••"
                      required
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      <MdVisibility className="text-xl" />
                    </button>
                  </div>
                  <div className="mt-4 text-right">
                    <a
                      className="text-xs tracking-wider uppercase text-white/50 hover:text-[#a9c7ff] transition-colors"
                      href="#"
                    >
                      Forgot Password?
                    </a>
                  </div>
                </div>

                <div className="pt-6">
                  {submitMessage && (
                    <div
                      className={`mb-4 p-3 rounded-lg text-sm ${
                        submitMessage.includes("successful")
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {submitMessage}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full overflow-hidden bg-white text-[#003366] px-8 py-3 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full transition-all hover:bg-opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <span>SIGNING IN...</span>
                          <div className="w-4 h-4 border-2 border-[#003366]/30 border-t-transparent rounded-full animate-spin"></div>
                        </>
                      ) : (
                        <>
                          <span>SIGN IN</span>
                          <MdArrowForward className="text-base" />
                        </>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-[#d6e3ff] to-[#a9c7ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>

                <div className="pt-6">
                  <div className="mb-4 text-center">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 mb-4">
                      Quick Demo Access
                    </p>
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleDemoLogin("user")}
                        disabled={isSubmitting}
                        className="group relative overflow-hidden bg-[#a9c7ff]/10 text-[#a9c7ff] px-6 py-2.5 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full transition-all hover:bg-[#a9c7ff]/20 border border-[#a9c7ff]/20 hover:border-[#a9c7ff]/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="relative z-10">Demo User Login</span>
                      </button>
                      <button
                        onClick={() => handleDemoLogin("agent")}
                        disabled={isSubmitting}
                        className="group relative overflow-hidden bg-[#374969]/20 text-[#c2c6d3] px-6 py-2.5 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full transition-all hover:bg-[#374969]/30 border border-[#374969]/20 hover:border-[#374969]/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="relative z-10">Demo Agent Login</span>
                      </button>
                      <button
                        onClick={() => handleDemoLogin("admin")}
                        disabled={isSubmitting}
                        className="group relative overflow-hidden bg-[#ff6b6b]/10 text-[#ff6b6b] px-6 py-2.5 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full transition-all hover:bg-[#ff6b6b]/20 border border-[#ff6b6b]/20 hover:border-[#ff6b6b]/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="relative z-10">Demo Admin Login</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex flex-col items-center gap-6">
                  <p className="text-white/40 text-sm">
                    New to the collection?
                    <Link
                      href="/register"
                      className="text-white hover:text-[#a9c7ff] underline underline-offset-8 decoration-white/20 hover:decoration-[#a9c7ff] transition-all ml-2"
                    >
                      Create an Account
                    </Link>
                  </p>

                  <div className="flex items-center gap-4 w-full px-12">
                    <div className="h-[1px] flex-grow bg-white/5"></div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/20">
                      Or connect via
                    </span>
                    <div className="h-[1px] flex-grow bg-white/5"></div>
                  </div>

                  <div className="flex gap-4">
                    <button className="p-4 rounded-full border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all">
                      <img
                        alt="Google"
                        className="w-5 h-5 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnJI4x44IaHvvkl6hLk1p7U522yZDzvv3lVqWR7hozZxfXrK_IZpyrp9ZkrrwdSkwA28gTnpe_Ks9ySj5K7bwwcLMLApYWIcVFC32u2JWVHSt-dOgc0zmozQC5Rli6fkpXc3fIdJelG4uBbTPteh2mcAQvWCP2j9KPLwyy6j3FDPw37w0UcaDi80vSibRuPf2vxdUs9sm75u7UIgrf7QL0zeEWTgmkw6cuI9YLkEdn7ll-bQoycfIaA8x9PY6k9toEaj1AHp8uvdA0"
                      />
                    </button>
                    <button className="p-4 rounded-full border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all">
                      <MdIosShare className="text-white/40 group-hover:text-white" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center px-4">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/20">
              © 2024 AZURE EDITORIAL ESTATES.
            </p>
            <div className="flex gap-6">
              <a
                className="text-[10px] tracking-[0.3em] uppercase text-white/20 hover:text-white transition-colors"
                href="#"
              >
                Privacy
              </a>
              <a
                className="text-[10px] tracking-[0.3em] uppercase text-white/20 hover:text-white transition-colors"
                href="#"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </main>

      <aside className="fixed right-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-32 items-center pointer-events-none">
        <div className="rotate-90 origin-center whitespace-nowrap">
          <span className="text-[10px] tracking-[1em] uppercase text-white/10">
            CURATED SPACES
          </span>
        </div>
        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
        <div className="rotate-90 origin-center whitespace-nowrap">
          <span className="text-[10px] tracking-[1em] uppercase text-white/10">
            ARCHITECTURAL MASTERY
          </span>
        </div>
      </aside>
    </div>
  );
}
