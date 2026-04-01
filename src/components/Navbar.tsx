"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { MdMenu, MdClose, MdSearch } from "react-icons/md";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "AI", href: "/ai/chat" },
  ];

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };
  const pathname = usePathname();
  const isDashboard = pathname.includes("dashboard");
  if (isDashboard) return null;
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full">
      <section className="relative flex flex-col justify-between">
        <header
          style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
          className="flex bg-[#003366]/80 backdrop-blur-md border-b items-center justify-between px-4 sm:px-6 lg:px-8 py-4 lg:py-6 z-10"
        >
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-[#a9c7ff] flex items-center justify-center rounded-sm">
              <svg
                className="w-4 h-4 lg:w-5 lg:h-5 text-[#001b3d]"
                fill="currentColor"
                viewBox="0 0 48 48"
              >
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
              </svg>
            </div>
            <Link
              href={"/"}
              className="font-inter text-xl lg:text-2xl tracking-tighter uppercase"
            >
              AZUREESTATES
            </Link>
          </div>

          <nav className="hidden md:flex gap-6 lg:gap-8 text-xs font-semibold uppercase tracking-widest text-[#c2c6d3]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className="hover:text-[#a9c7ff] transition-colors"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
            <div className="relative group">
              <button className="hover:text-[#a9c7ff] transition-colors flex items-center gap-1">
                LEGAL
              </button>
              <div className="absolute top-full left-0 mt-2 w-40 bg-[#00132e] border border-[#122a4c] rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  href="/privacy"
                  className="block px-4 py-2 hover:text-[#a9c7ff] transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="block px-4 py-2 hover:text-[#a9c7ff] transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </nav>

          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {status === "loading" ? (
              <div className="bg-white/20 text-white px-4 lg:px-8 py-2 lg:py-3 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full">
                Loading...
              </div>
            ) : session ? (
              <>
                <Link
                  href={
                    session.user?.role === "admin"
                      ? "/admin/dashboard"
                      : session.user?.role === "agent"
                        ? "/agent/dashboard"
                        : "/dashboard/profile"
                  }
                  className="text-[#a9c7ff] text-xs lg:text-sm font-semibold hover:underline"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white/20 text-white px-4 lg:px-8 py-2 lg:py-3 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-white/30 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-white text-[#003366] px-4 lg:px-8 py-2 lg:py-3 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-opacity-90 transition-all"
              >
                Login
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white hover:text-[#a9c7ff] transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </header>
      </section>

      {isOpen && (
        <div className="fixed inset-0 top-[60px] bg-[#00132e] bg-opacity-98 backdrop-blur-lg z-40 md:hidden overflow-y-auto">
          <div className="px-4 py-6">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-xs text-[#e1e2e9] hover:text-[#a9c7ff] transition-colors duration-300 text-base uppercase tracking-[0.15em] font-semibold py-3 border-b border-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/privacy"
                className="block text-xs text-[#e1e2e9] hover:text-[#a9c7ff] transition-colors duration-300 text-base uppercase tracking-[0.15em] font-semibold py-3 border-b border-white/10"
                onClick={() => setIsOpen(false)}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="block text-xs text-[#e1e2e9] hover:text-[#a9c7ff] transition-colors duration-300 text-base uppercase tracking-[0.15em] font-semibold py-3 border-b border-white/10"
                onClick={() => setIsOpen(false)}
              >
                Terms of Service
              </Link>

              <div className="pt-6">
                {status === "loading" ? (
                  <div className="text-center text-[#e1e2e9] py-4">
                    Loading...
                  </div>
                ) : session ? (
                  <div className="flex flex-col gap-4">
                    <Link
                      href={
                        session.user?.role === "admin"
                          ? "/admin/dashboard"
                          : session.user?.role === "agent"
                            ? "/agent/dashboard"
                            : "/dashboard/profile"
                      }
                      className="block text-[#a9c7ff] text-center font-semibold py-4 border border-[#a9c7ff]/30 rounded-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="block text-center text-white bg-white/20 px-8 py-4 font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-white/30 transition-all"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block text-center bg-white text-[#003366] px-8 py-4 font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-opacity-90 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
