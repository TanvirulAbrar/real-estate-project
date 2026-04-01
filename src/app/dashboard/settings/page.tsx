"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    avatar_url: "",
    notifications: {
      email: true,
      push: false,
      sms: true,
      propertyAlerts: true,
      newsletter: false,
    },
    privacy: {
      profileVisible: true,
      showContactInfo: false,
      allowMarketing: true,
    },
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!session?.user?.id) return;

      try {
        const response = await fetch("/api/users/profile");
        if (response.ok) {
          const data = await response.json();
          const nameParts = (data.name || "").split(" ");
          setFormData((prev) => ({
            ...prev,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: data.email || "",
            phone: data.phone || "",
            bio: data.bio || "",
            avatar_url: data.avatar_url || "",
          }));
        }
      } catch (error) {
        console.error("Error loading profile:", error);

        const nameParts = (session?.user?.name || "").split(" ");
        setFormData((prev) => ({
          ...prev,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: session?.user?.email || "",
        }));
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [session]);

  const tabs = [
    { id: "profile", label: "Profile Settings" },
    { id: "notifications", label: "Notifications" },
    { id: "privacy", label: "Privacy" },
    { id: "security", label: "Security" },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (
    category: string,
    field: string,
    value: boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...((prev[category as keyof typeof prev] as Record<string, any>) || {}),
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio,
          avatar_url: formData.avatar_url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      setMessage("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 lg:mb-8">
        Settings
      </h1>

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-1 mb-4 sm:mb-8 border-b border-white/10 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold transition-colors duration-300 border-b-2 -mb-[1px] whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#a9c7ff] text-[#a9c7ff]"
                  : "border-transparent text-[#424751] hover:text-[#a9c7ff]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 sm:p-6 lg:p-8">
          {activeTab === "profile" && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                Profile Information
              </h2>

              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#a9c7ff]/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {formData.avatar_url ? (
                    <img
                      src={formData.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-2xl sm:text-3xl font-bold text-[#a9c7ff]">
                      {formData.firstName?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs sm:text-sm font-medium text-[#c2c6d3] mb-2">
                    Profile Picture URL
                  </label>
                  <input
                    type="url"
                    value={formData.avatar_url}
                    onChange={(e) =>
                      handleInputChange("avatar_url", e.target.value)
                    }
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full bg-white/10 border border-white/20 rounded-full px-3 sm:px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#a9c7ff] transition-colors"
                  />
                  <p className="text-[#c2c6d3]/60 text-xs mt-1">
                    Enter a URL to your profile image
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#c2c6d3] mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-full px-3 sm:px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#a9c7ff] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#c2c6d3] mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-full px-3 sm:px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#a9c7ff] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#c2c6d3] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-full px-3 sm:px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#a9c7ff] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#c2c6d3] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-white/10 border border-white/20 rounded-full px-3 sm:px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#a9c7ff] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#c2c6d3] mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#a9c7ff] transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                Notification Preferences
              </h2>

              <div className="space-y-3 sm:space-y-4">
                {Object.entries(formData.notifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-white/10 gap-3"
                  >
                    <div>
                      <p className="text-white font-medium capitalize text-sm sm:text-base">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="text-[#c2c6d3] text-xs sm:text-sm">
                        {key === "email" &&
                          "Receive email notifications about your account"}
                        {key === "push" &&
                          "Get push notifications in your browser"}
                        {key === "sms" && "Receive text message alerts"}
                        {key === "propertyAlerts" &&
                          "New properties matching your criteria"}
                        {key === "newsletter" &&
                          "Weekly newsletter with market updates"}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleNestedChange("notifications", key, !value)
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                        value ? "bg-[#a9c7ff]" : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                Privacy Settings
              </h2>

              <div className="space-y-3 sm:space-y-4">
                {Object.entries(formData.privacy).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-white/10 gap-3"
                  >
                    <div>
                      <p className="text-white font-medium capitalize text-sm sm:text-base">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="text-[#c2c6d3] text-xs sm:text-sm">
                        {key === "profileVisible" &&
                          "Make your profile visible to other users"}
                        {key === "showContactInfo" &&
                          "Display your contact information on your profile"}
                        {key === "allowMarketing" &&
                          "Allow us to contact you with marketing materials"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleNestedChange("privacy", key, !value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                        value ? "bg-[#a9c7ff]" : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                Security Settings
              </h2>

              <div className="space-y-4 sm:space-y-6">
                <div className="border-b border-white/10 pb-4 sm:pb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                    Change Password
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#c2c6d3] mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full bg-white/10 border border-white/20 rounded-full px-3 sm:px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#a9c7ff] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#c2c6d3] mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full bg-white/10 border border-white/20 rounded-full px-3 sm:px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#a9c7ff] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#c2c6d3] mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full bg-white/10 border border-white/20 rounded-full px-3 sm:px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#a9c7ff] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-[#c2c6d3] text-sm mb-3 sm:mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <button className="px-4 py-2 bg-[#a9c7ff]/10 text-[#a9c7ff] rounded-full hover:bg-[#a9c7ff]/20 transition-colors text-xs sm:text-sm">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
            {message && (
              <p
                className={`mb-4 text-sm ${message.includes("success") ? "text-green-400" : "text-red-400"}`}
              >
                {message}
              </p>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-[#a9c7ff] text-[#001b3d] font-bold rounded-full hover:bg-[#a9c7ff]/90 transition-colors disabled:opacity-50 text-xs sm:text-sm"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
