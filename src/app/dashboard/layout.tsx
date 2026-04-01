"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  MdAccountCircle,
  MdBookmark,
  MdEvent,
  MdChatBubble,
  MdLocalOffer,
  MdNotifications,
  MdSettings,
  MdMenu,
  MdClose,
} from "react-icons/md";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Profile", href: "/dashboard/profile", icon: MdAccountCircle },
    { name: "Favorites", href: "/dashboard/favorites", icon: MdBookmark },
    { name: "Appointments", href: "/dashboard/appointments", icon: MdEvent },
    { name: "Inquiries", href: "/dashboard/inquiries", icon: MdChatBubble },
    { name: "Offers", href: "/dashboard/offers", icon: MdLocalOffer },
    {
      name: "Notifications",
      href: "/dashboard/notifications",
      icon: MdNotifications,
    },
    { name: "Settings", href: "/dashboard/settings", icon: MdSettings },
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
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#00132e] border-r border-white/5 flex flex-col py-8 px-6 z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-12">
          <h1 className="text-2xl font-inter tracking-tighter text-white uppercase font-bold">
            AZURE ESTATES
          </h1>
          <p className="text-[10px] tracking-[0.2em] text-[#b2c5ff]/60 font-medium mt-1">
            THE DIGITAL CURATOR
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard/profile" &&
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
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
