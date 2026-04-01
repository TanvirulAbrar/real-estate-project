"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  MdDashboard,
  MdPeople,
  MdDomain,
  MdAnalytics,
  MdListAlt,
  MdHome,
  MdReceipt,
  MdMenu,
  MdClose,
} from "react-icons/md";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: MdDashboard },
    { name: "User Management", href: "/admin/users", icon: MdPeople },
    { name: "Properties", href: "/admin/properties", icon: MdDomain },
    { name: "Agents", href: "/admin/agents", icon: MdPeople },
    { name: "Analytics", href: "/admin/analytics", icon: MdAnalytics },
    { name: "Offers", href: "/admin/offers", icon: MdListAlt },
    { name: "Transactions", href: "/admin/transactions", icon: MdReceipt },
  ];

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] flex overflow-x-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white lg:hidden hover:bg-white/20 transition-colors"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      <div
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#00132e] border-r border-white/5 shadow-[48px_0_48px_0_rgba(0,14,37,0.06)] flex-col py-8 px-6 z-50 flex-shrink-0 transform transition-transform duration-300 ease-in-out flex ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-12">
          <h1 className="text-2xl font-inter tracking-tighter text-white uppercase font-bold">
            LuxeAdmin
          </h1>
          <p className="font-['Epilogue'] tracking-tight font-bold text-sm text-[#b2c5ff]">
            Management Portal
          </p>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" &&
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
            href="/admin/properties/add"
            onClick={() => setSidebarOpen(false)}
            className="bg-white w-full text-[#003366] px-8 py-3 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-opacity-90 transition-all text-center block"
          >
            Add Property
          </Link>
        </div>
      </div>

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
