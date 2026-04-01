"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdVisibility, MdPublic, MdVerifiedUser } from "react-icons/md";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setSubmitMessage("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setSubmitMessage("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      console.log("Registration attempt:", formData);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone,
          role: "client",
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitMessage(
          "Account created successfully! Redirecting to login...",
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const msg =
          typeof result.message === "string"
            ? result.message
            : typeof result.error === "string"
              ? result.error
              : "Registration failed. Please try again.";
        setSubmitMessage(msg);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitMessage("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen font-inter text-[#e1e2e9] selection:bg-[#a9c7ff] selection:text-[#001b3d] overflow-x-hidden"
      style={{
        background: "linear-gradient(135deg, #00132e 0%, #000e25 100%)",
      }}
    >
      <main className="relative mt-12 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-[#a9c7ff]/10 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-[#374969]/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative w-full max-w-xl">
          <div
            className="frosted-glass p-6 sm:p-8 md:p-12 lg:p-16 rounded-2xl sm:rounded-[32px] shadow-[0_48px_100px_rgba(0,0,0,0.4)]"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="font-inter text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tighter leading-none uppercase mb-4">
                JOIN THE CURATED
              </h1>
              <p className="text-white/50 text-xs sm:text-sm tracking-widest uppercase">
                Access the world's most exclusive estates
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="group">
                <label
                  className="block text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-2 group-focus-within:text-[#a9c7ff] transition-colors"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  className="w-full bg-transparent border-0 border-b border-[#424751]/30 px-0 py-3 text-white placeholder:text-white/10 focus:ring-0 focus:border-[#a9c7ff] transition-all text-lg tracking-wide"
                  id="fullName"
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>

              <div className="group">
                <label
                  className="block text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-2 group-focus-within:text-[#a9c7ff] transition-colors"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  className="w-full bg-transparent border-0 border-b border-[#424751]/30 px-0 py-3 text-white placeholder:text-white/10 focus:ring-0 focus:border-[#a9c7ff] transition-all text-lg tracking-wide"
                  id="email"
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="group">
                <label
                  className="block text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-2 group-focus-within:text-[#a9c7ff] transition-colors"
                  htmlFor="phone"
                >
                  Phone Number (Optional)
                </label>
                <input
                  className="w-full bg-transparent border-0 border-b border-[#424751]/30 px-0 py-3 text-white placeholder:text-white/10 focus:ring-0 focus:border-[#a9c7ff] transition-all text-lg tracking-wide"
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="group">
                <label
                  className="block text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-2 group-focus-within:text-[#a9c7ff] transition-colors"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-transparent border-0 border-b border-[#424751]/30 px-0 py-3 text-white placeholder:text-white/10 focus:ring-0 focus:border-[#a9c7ff] transition-all text-lg tracking-wide"
                    id="password"
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
              </div>

              <div className="group">
                <label
                  className="block text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase mb-2 group-focus-within:text-[#a9c7ff] transition-colors"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-transparent border-0 border-b border-[#424751]/30 px-0 py-3 text-white placeholder:text-white/10 focus:ring-0 focus:border-[#a9c7ff] transition-all text-lg tracking-wide"
                    id="confirmPassword"
                    required
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="pt-6">
                {submitMessage && (
                  <div
                    className={`mb-4 p-3 rounded-lg text-sm ${
                      submitMessage.includes("successfully")
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
                        <span>CREATING ACCOUNT...</span>
                        <div className="w-4 h-4 border-2 border-[#003366]/30 border-t-transparent rounded-full animate-spin"></div>
                      </>
                    ) : (
                      <>
                        <span>CREATE ACCOUNT</span>
                        <MdPublic className="text-base" />
                      </>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-r from-[#d6e3ff] to-[#a9c7ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </form>
            <div className="mt-12 flex flex-col items-center gap-6">
              <p className="text-white/40 text-sm">
                already have an account?
                <Link
                  href="/login"
                  className="text-white hover:text-[#a9c7ff] underline underline-offset-8 decoration-white/20 hover:decoration-[#a9c7ff] transition-all ml-2"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

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
  );
}
