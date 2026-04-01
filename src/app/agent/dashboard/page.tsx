"use client";

import { useState, useEffect } from "react";
import {
  MdAccountBalanceWallet,
  MdHouse,
  MdAssignmentTurnedIn,
  MdNotifications,
  MdGridView,
  MdDashboard,
  MdDomain,
  MdAdd,
  MdEdit,
  MdCalendarToday,
  MdChatBubble,
  MdLocalOffer,
  MdReceiptLong,
  MdSettings,
} from "react-icons/md";
import Link from "next/link";

interface DashboardStats {
  id: number;
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  property: string;
  time: string;
  status: string;
  amount?: number;
  message?: string;
}

interface DashboardData {
  stats: DashboardStats[];
  recentActivities: RecentActivity[];
  recentInquiries: RecentActivity[];
}

const iconMap = {
  MdAccountBalanceWallet,
  MdHouse,
  MdAssignmentTurnedIn,
  MdLocalOffer,
};

export default function AgentDashboardOverview() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/agent/dashboard");
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          setError("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Error loading dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getIcon = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || MdDashboard;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] flex items-center justify-center">
        <div className="text-red-400">{error || "No data available"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9]">
      <header className="flex justify-between items-center w-full pl-80 pr-12 py-8 fixed top-0 z-40 bg-transparent">
        <div className="flex items-center gap-8 ml-8">
          <div className="flex items-center gap-6">
            <button className="relative text-white/70 hover:text-white transition-opacity">
              <MdNotifications className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#a9c7ff] rounded-full"></span>
            </button>
            <button className="text-white/70 hover:text-white transition-opacity">
              <MdSettings className="w-6 h-6" />
            </button>
          </div>
          <div className="h-8 w-[1px] bg-[#122a4c]/50"></div>
          <div className="flex items-center gap-3">
            <span className="font-['Epilogue'] font-medium text-xs tracking-widest text-white uppercase">
              MARCUS T.
            </span>
            <div className="w-8 h-8 rounded-full object-cover bg-[#a9c7ff]/20 flex items-center justify-center">
              <MdDashboard className="w-5 h-5 text-[#a9c7ff]" />
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-12 pt-20 sm:pt-24 overflow-x-hidden">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {dashboardData.stats.map((stat) => {
            const IconComponent = getIcon(stat.icon);
            return (
              <div
                key={stat.id}
                className="p-4 sm:p-6 rounded-xl border border-white/5"
                style={{
                  background: "rgba(29, 32, 37, 0.4)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <IconComponent
                    className={`w-5 h-5 sm:w-8 sm:h-8 ${stat.color}`}
                  />
                  <span className="text-xs sm:text-sm font-medium text-green-400">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-xs sm:text-sm text-[#c2c6d3]">
                  {stat.title}
                </p>
              </div>
            );
          })}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div
            className="lg:col-span-2 p-4 sm:p-6 lg:p-8 rounded-xl border border-white/5"
            style={{
              background: "rgba(29, 32, 37, 0.4)",
              backdropFilter: "blur(12px)",
            }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
              Recent Inquiries
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {dashboardData.recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="pb-3 sm:pb-4 border-b border-white/5"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs sm:text-sm font-medium text-white">
                      {inquiry.property}
                    </p>
                    <span className="text-[10px] text-[#a9c7ff]">
                      {inquiry.time}
                    </span>
                  </div>
                  <p className="text-xs text-[#c2c6d3]">
                    {inquiry.message
                      ? inquiry.message.substring(0, 80) + "..."
                      : "Client inquiry"}
                  </p>
                </div>
              ))}
              <Link
                href="/agent/inquiries"
                className="w-full text-center text-[10px] text-[#a9c7ff] uppercase tracking-widest font-bold hover:text-white transition-colors mt-4 block"
              >
                View All Inquiries
              </Link>
            </div>
          </div>

          <div
            className="p-4 sm:p-6 lg:p-8 rounded-xl border border-white/5"
            style={{
              background: "rgba(29, 32, 37, 0.4)",
              backdropFilter: "blur(12px)",
            }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
              Performance
            </h3>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <p className="text-[10px] uppercase text-white/40 tracking-widest mb-1">
                  Response Rate
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white">98%</p>
                <div className="w-full h-1 bg-white/10 mt-2">
                  <div className="h-full bg-[#a9c7ff] w-[98%]"></div>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase text-white/40 tracking-widest mb-1">
                  Avg Response Time
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white">2.3h</p>
                <div className="w-full h-1 bg-white/10 mt-2">
                  <div className="h-full bg-emerald-400 w-[85%]"></div>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase text-white/40 tracking-widest mb-1">
                  Success Rate
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white">84%</p>
                <div className="w-full h-1 bg-white/10 mt-2">
                  <div className="h-full bg-amber-400 w-[84%]"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pb-8">
          <Link
            href="/agent/add-property"
            className="p-4 sm:p-6 rounded-xl border border-white/5 hover:bg-[#a9c7ff]/10 transition-colors group"
            style={{
              background: "rgba(29, 32, 37, 0.4)",
              backdropFilter: "blur(12px)",
            }}
          >
            <MdAdd
              className="text-[#a9c7ff] group-hover:text-white transition-colors mb-2 sm:mb-3"
              size={20}
            />
            <p className="text-xs sm:text-sm font-medium text-white">
              Add Property
            </p>
          </Link>
          <button
            className="p-4 sm:p-6 rounded-xl border border-white/5 hover:bg-[#a9c7ff]/10 transition-colors group"
            style={{
              background: "rgba(29, 32, 37, 0.4)",
              backdropFilter: "blur(12px)",
            }}
          >
            <MdEdit
              className="text-[#a9c7ff] group-hover:text-white transition-colors mb-2 sm:mb-3"
              size={20}
            />
            <p className="text-xs sm:text-sm font-medium text-white">
              Edit Listing
            </p>
          </button>
          <button
            className="p-4 sm:p-6 rounded-xl border border-white/5 hover:bg-[#a9c7ff]/10 transition-colors group"
            style={{
              background: "rgba(29, 32, 37, 0.4)",
              backdropFilter: "blur(12px)",
            }}
          >
            <MdCalendarToday
              className="text-[#a9c7ff] group-hover:text-white transition-colors mb-2 sm:mb-3"
              size={20}
            />
            <p className="text-xs sm:text-sm font-medium text-white">
              Schedule Tour
            </p>
          </button>
          <button
            className="p-4 sm:p-6 rounded-xl border border-white/5 hover:bg-[#a9c7ff]/10 transition-colors group"
            style={{
              background: "rgba(29, 32, 37, 0.4)",
              backdropFilter: "blur(12px)",
            }}
          >
            <MdChatBubble
              className="text-[#a9c7ff] group-hover:text-white transition-colors mb-2 sm:mb-3"
              size={20}
            />
            <p className="text-xs sm:text-sm font-medium text-white">
              Messages
            </p>
          </button>
        </section>
      </main>
    </div>
  );
}
