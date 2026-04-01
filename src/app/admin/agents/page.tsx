"use client";

import { useState, useEffect } from "react";
import {
  MdVerified,
  MdDescription,
  MdMoreVert,
  MdCheck,
  MdInfo,
  MdFilterList,
} from "react-icons/md";

interface Agent {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string;
  theme: string;
  is_demo: boolean;
  active_listings_count: number;
  average_review_rating: number | null;
  created_at?: string;
}

export default function AdminAgentVerification() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function loadAgents() {
      try {
        setLoading(true);
        const response = await fetch(`/api/agents?page=${page}&limit=20`);

        if (!response.ok) {
          throw new Error("Failed to fetch agents");
        }

        const data = await response.json();
        setAgents(data.data || []);
        setTotalPages(data.pagination?.total_pages || 1);
        setTotalCount(data.pagination?.total || 0);
      } catch (err) {
        console.error("Error loading agents:", err);
        setError("Failed to load agents");
      } finally {
        setLoading(false);
      }
    }

    loadAgents();
  }, [page]);

  const featuredAgents = agents.slice(0, 3);
  const recentApplications = agents.slice(3);

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-2 border-[#b2c5ff]/30 border-t-[#b2c5ff] rounded-full animate-spin mb-4"></div>
          <p className="text-white/60">Loading agents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-32 pb-24 px-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-20 sm:pb-24 px-4 sm:px-6 lg:px-12 min-h-screen overflow-x-hidden">
      <section className="mb-12 sm:mb-16 max-w-5xl">
        <span className="text-[#b2c5ff] font-bold tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-3 sm:mb-4 block">
          Azure Estates / Security Portal
        </span>
        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-inter text-white tracking-tighter leading-[0.9] mb-4 sm:mb-6">
          Agent <br className="hidden sm:block" />
          <span className="text-[#b2c5ff]">Verification</span>
        </h2>
        <p className="text-[#c2c6d3] text-sm sm:text-lg max-w-2xl font-light leading-relaxed">
          Review and authenticate new professionals joining ecosystem. Quality
          control ensures prestige of our digital real estate portfolio.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
        {featuredAgents[0] && (
          <div
            className="lg:col-span-8 rounded-xl p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8 items-start relative overflow-hidden group"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div className="absolute top-0 right-0 p-3 sm:p-6">
              <span className="px-2 sm:px-3 py-1 bg-[#b2c5ff]/20 text-[#b2c5ff] text-[10px] font-bold uppercase tracking-widest rounded-full">
                Active Agent
              </span>
            </div>
            <div className="w-full md:w-32 lg:w-48 h-48 sm:h-64 rounded-lg overflow-hidden shrink-0">
              <img
                src={
                  featuredAgents[0].avatar_url ||
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='260' viewBox='0 0 200 260'%3E%3Crect width='200' height='260' fill='%231a1a2e'/%3E%3Ctext x='100' y='130' font-size='48' fill='%23b2c5ff' text-anchor='middle' dy='.3em'%3E👤%3C/text%3E%3C/svg%3E"
                }
                alt={featuredAgents[0].name || "Agent"}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="flex-1 space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-inter text-white tracking-tight mb-1">
                  {featuredAgents[0].name || "Unknown Agent"}
                </h3>
                <p className="text-[#b2c5ff] font-medium text-sm sm:text-base">
                  {featuredAgents[0].email}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-8 py-4 sm:py-6 border-y border-white/5">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
                    Active Listings
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {featuredAgents[0].active_listings_count || 0}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
                    Rating
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-white italic">
                    {featuredAgents[0].average_review_rating?.toFixed(1) ||
                      "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
                <button className="bg-[#b2c5ff] text-[#003063] font-bold px-4 sm:px-8 py-2 sm:py-3 rounded-sm flex items-center gap-2 hover:bg-white transition-colors duration-300 text-sm sm:text-base">
                  <MdVerified size={16} />
                  Verify Agent
                </button>
                <button className="bg-white/5 text-white font-bold px-4 sm:px-8 py-2 sm:py-3 rounded-sm flex items-center gap-2 hover:bg-white/10 transition-colors duration-300 text-sm sm:text-base">
                  <MdDescription size={16} />
                  View Profile
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          className="lg:col-span-4 rounded-xl p-4 sm:p-6 lg:p-8"
          style={{ background: "rgba(21, 90, 170, 0.2)" }}
        >
          <h4 className="font-inter text-lg sm:text-xl text-white mb-4 sm:mb-6">
            Verification Insights
          </h4>
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/60 text-xs sm:text-sm">Total Agents</p>
                <p className="text-3xl sm:text-5xl font-inter text-white">
                  {totalCount}
                </p>
              </div>
            </div>
            <div className="w-full h-1 bg-white/10 overflow-hidden">
              <div className="h-full bg-[#b2c5ff] w-2/3"></div>
            </div>
            <p className="text-xs sm:text-sm text-[#c2c6d3] leading-relaxed">
              Active agents in the system. Review and manage agent applications
              here.
            </p>
          </div>
        </div>

        {featuredAgents[1] && (
          <div
            className="lg:col-span-6 rounded-xl p-4 sm:p-6 lg:p-8 flex gap-3 sm:gap-6 items-center"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <img
              src={
                featuredAgents[1].avatar_url ||
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%231a1a2e'/%3E%3Ctext x='48' y='48' font-size='32' fill='%23b2c5ff' text-anchor='middle' dy='.3em'%3E👤%3C/text%3E%3C/svg%3E"
              }
              alt={featuredAgents[1].name || "Agent"}
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover ring-2 ring-white/10 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-2xl font-inter text-white tracking-tight truncate">
                    {featuredAgents[1].name || "Unknown Agent"}
                  </h3>
                  <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                    {featuredAgents[1].active_listings_count} Active Listings
                  </p>
                </div>
                <MdMoreVert className="text-[#b2c5ff] flex-shrink-0" />
              </div>
              <p className="text-[#c2c6d3] text-xs sm:text-sm mt-2 sm:mt-3 mb-3 sm:mb-5 truncate">
                {featuredAgents[1].email}
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button className="bg-[#b2c5ff]/10 text-[#b2c5ff] text-[10px] font-bold uppercase px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-[#b2c5ff] hover:text-[#003063] transition-all">
                  Verify
                </button>
                <button className="text-white/40 text-[10px] font-bold uppercase px-3 sm:px-4 py-1.5 sm:py-2 hover:text-white transition-all">
                  Details
                </button>
              </div>
            </div>
          </div>
        )}

        {featuredAgents[2] && (
          <div
            className="lg:col-span-6 rounded-xl p-4 sm:p-6 lg:p-8 flex gap-3 sm:gap-6 items-center"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <img
              src={
                featuredAgents[2].avatar_url ||
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%231a1a2e'/%3E%3Ctext x='48' y='48' font-size='32' fill='%23b2c5ff' text-anchor='middle' dy='.3em'%3E👤%3C/text%3E%3C/svg%3E"
              }
              alt={featuredAgents[2].name || "Agent"}
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover ring-2 ring-white/10 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-2xl font-inter text-white tracking-tight truncate">
                    {featuredAgents[2].name || "Unknown Agent"}
                  </h3>
                  <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                    {featuredAgents[2].active_listings_count} Active Listings
                  </p>
                </div>
                <MdMoreVert className="text-[#b2c5ff] flex-shrink-0" />
              </div>
              <p className="text-[#c2c6d3] text-xs sm:text-sm mt-2 sm:mt-3 mb-3 sm:mb-5 truncate">
                {featuredAgents[2].email}
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button className="bg-[#b2c5ff]/10 text-[#b2c5ff] text-[10px] font-bold uppercase px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-[#b2c5ff] hover:text-[#003063] transition-all">
                  Verify
                </button>
                <button className="text-white/40 text-[10px] font-bold uppercase px-3 sm:px-4 py-1.5 sm:py-2 hover:text-white transition-all">
                  Details
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="lg:col-span-12 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between px-2 sm:px-4 pb-3 sm:pb-4 border-b border-white/5">
            <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/30">
              Recent Applications
            </h4>
            <MdFilterList className="text-white/30" />
          </div>
          {recentApplications.map((agent) => (
            <div
              key={agent.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-6 hover:bg-white/[0.02] transition-colors rounded-lg gap-3 sm:gap-0"
            >
              <div className="flex items-center gap-3 sm:gap-6">
                <img
                  src={
                    agent.avatar_url ||
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%231a1a2e'/%3E%3Ctext x='24' y='24' font-size='20' fill='%23b2c5ff' text-anchor='middle' dy='.3em'%3E👤%3C/text%3E%3C/svg%3E"
                  }
                  alt={agent.name || "Agent"}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-white text-sm sm:text-base truncate">
                    {agent.name || "Unknown Agent"}
                  </p>
                  <p className="text-[10px] sm:text-xs text-white/40 italic truncate">
                    {agent.email}
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest mb-1">
                  Listings
                </p>
                <p className="font-bold text-white text-sm">
                  {agent.active_listings_count}
                </p>
              </div>
              <div className="hidden md:block">
                <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest mb-1">
                  Rating
                </p>
                <p className="font-bold text-white text-sm">
                  {agent.average_review_rating?.toFixed(1) || "N/A"}
                </p>
              </div>
              <div className="flex gap-2 sm:gap-4 mt-2 sm:mt-0">
                <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white/5 text-[#b2c5ff] hover:bg-[#b2c5ff] hover:text-[#003063] transition-all">
                  <MdCheck size={18} />
                </button>
                <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white/5 text-white/40 hover:text-white transition-all">
                  <MdInfo size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
