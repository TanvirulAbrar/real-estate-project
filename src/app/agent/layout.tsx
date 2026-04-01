"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  MdDashboard,
  MdDomain,
  MdChatBubble,
  MdEvent,
  MdPayments,
  MdAdd,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { FiSearch, FiBell, FiGrid } from "react-icons/fi";

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/agent/dashboard", icon: MdDashboard },
    { name: "My Properties", href: "/agent/properties", icon: MdDomain },
    { name: "Inquiries", href: "/agent/inquiries", icon: MdChatBubble },
    { name: "Appointments", href: "/agent/appointments", icon: MdEvent },
    { name: "Offers", href: "/agent/offers", icon: MdPayments },
    { name: "Add Property", href: "/agent/add-property", icon: MdDomain },
  ];

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] flex overflow-x-hidden">
      <div
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#00132e] border-r border-white/5 flex-col py-8 px-6 z-50 flex-shrink-0 transform transition-transform duration-300 ease-in-out flex ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-12 h-5"></div>

        <nav className="flex-1 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/agent/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 py-3 pl-4 transition-all font-headline font-bold text-sm ${
                  isActive
                    ? "text-[#b2c5ff] border-l-2 border-[#b2c5ff] bg-white/5"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4 pt-8 border-t border-[#122a4c]/20">
          <Link
            href="/agent/add-property"
            onClick={() => setSidebarOpen(false)}
            className="bg-white text-[#003366] px-8 py-3 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-opacity-90 transition-all text-center block"
          >
            New Listing
          </Link>
        </div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 h-20 flex justify-between items-center px-8 border-b border-[#122a4c]/20 bg-[#00132e]/60 backdrop-blur-xl">
        {sidebarOpen && (
          <div
            className="fixed inset-0  z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className=" top-4 left-4  p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white lg:hidden hover:bg-white/20 transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>

        <div className="flex items-center gap-8">
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

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-[#b2c5ff]/50" size={16} />
            </div>

            <input
              className="bg-surface-container-low border-none focus:ring-1 focus:ring-[#b2c5ff]/30 text-xs text-on-surface placeholder:text-[#b2c5ff]/30 pl-10 pr-4 py-2 w-64 transition-all"
              placeholder="Search listing ID, client, or tag..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            {/* Notification */}
            <button className="p-2 text-[#b2c5ff]/70 hover:text-white transition-colors relative">
              <FiBell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full"></span>
            </button>

            <button className="p-2 text-[#b2c5ff]/70 hover:text-white transition-colors">
              <FiGrid size={18} />
            </button>
          </div>

          <div className="h-6 w-[1px] bg-[#122a4c]/40"></div>
        </div>
      </header>

      <div className="flex-1 overflow-auto min-w-0">{children}</div>
    </div>
  );
}
