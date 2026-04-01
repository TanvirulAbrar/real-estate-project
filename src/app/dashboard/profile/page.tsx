"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface ProfileData {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string;
  theme: string;
  is_demo: boolean;
  created_at: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch("/api/users/profile");
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [session]);

  const displayData = profile || {
    name: session?.user?.name || "User",
    email: session?.user?.email || "",
    avatar_url: null,
    bio: null,
    created_at: null,
  };

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Profile</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-[#a9c7ff]/20 rounded-full flex items-center justify-center overflow-hidden">
              {displayData.avatar_url ? (
                <img
                  src={displayData.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <span className="text-3xl font-bold text-[#a9c7ff]">
                  {displayData.name?.charAt(0) || "U"}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {displayData.name || "User"}
              </h2>
              <p className="text-[#c2c6d3]">{displayData.email}</p>
              {displayData.bio && (
                <p className="text-[#c2c6d3] mt-2 text-sm">{displayData.bio}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#c2c6d3]">Member Since</span>
                  <span className="text-white">
                    {profile?.created_at 
                      ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                      : "January 2024"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c2c6d3]">Account Type</span>
                  <span className="text-white capitalize">{profile?.role || "Client"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c2c6d3]">Phone</span>
                  <span className="text-white">{profile?.phone || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c2c6d3]">Status</span>
                  <span className="text-green-400">Active</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#c2c6d3]">Email Notifications</span>
                  <span className="text-white">Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c2c6d3]">Property Alerts</span>
                  <span className="text-white">Daily</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c2c6d3]">Language</span>
                  <span className="text-white">English</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
