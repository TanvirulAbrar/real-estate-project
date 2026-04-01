import {
  MdDomain,
  MdSearch,
  MdNotifications,
  MdSettings,
  MdHelpCenter,
  MdDashboard,
  MdAnalytics,
  MdGroup,
  MdVerifiedUser,
  MdLocalOffer,
  MdPayments,
  MdMoreVert,
  MdCheck,
  MdClose,
  MdWarning,
  MdInfo,
} from "react-icons/md";

export default function AdminPropertyModeration() {
  const properties = [
    {
      id: 1,
      title: "Azure Sky Villa",
      location: "Malibu, CA",
      price: "$4,200,000",
      status: "pending",
      submittedBy: "Elena Rodriguez",
      submittedAt: "2 hours ago",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBoT6ZEQ688h_k06mD7K_LsvoegZ9k-k_7yr25YlGJNax0KzU_Krqksd6OHhoTZbQNhZWFnJT2FBVeOxgZKRCE0K4n4NjP-2hmT8Gu6FiclpbT5VDtkO0Rfhr20UeKvf9eIZbLLX2ONycNlfH2XKiVRq5wCp2QwOMpg1UL1Kcn-AGRFZPc5G7O8wV9BrKKQd7mDctUTRtrYee9eubAgsBcF4ouGn3CT7F7aVe5fgSYMaKbYi1vJZJ-ye_Azt1sluc3CH5qzca6d9wAi",
      issues: ["Missing property documents", "Incomplete location details"],
    },
    {
      id: 2,
      title: "The Obsidian Estate",
      location: "Aspen, CO",
      price: "$8,750,000",
      status: "flagged",
      submittedBy: "Marcus Thorne",
      submittedAt: "5 hours ago",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCrU6es145ENZZpmEKM6zZD22fxptXYTd7Naujig4irKyhvjS3nxQyXrLbE1fAHE-4biu2mK3AU-Rmfoc6qgHwzk6UiA13rRQeDVotXue26bWS2aZIoTG8KwhKpO6T_h2SDt69SsfMHQkk85BLrYdXby72PC92eB0aa0CclnEsb-289Ek9ewh7cFQm88-_Rt1Tjq2uhgCm0XU19vIN53IExb_su_CQutYs32BFDGCLlrU1Z5s2HcWj7S4bWORCcjfH0kPXHU-w5p2eW",
      issues: ["Suspicious pricing", "Potential duplicate listing"],
    },
    {
      id: 3,
      title: "Coastal Paradise",
      location: "Miami Beach, FL",
      price: "$3,200,000",
      status: "approved",
      submittedBy: "Sarah Chen",
      submittedAt: "1 day ago",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAdS5Dz8ZRSvwM1of_8fdv1mbRIkj77fLZNY_iuISeOqgdK-IvRRd80i4xi1xShxmLP3t6vg_LvPyeN2xGvb_Nm57qW4_-uYQy8R11sABwzBo8Vv9ifg5tps0ip7NocNOMEDraLouu_XFwRCjJJmucjngiBlSj-pRGhpiXJ_WfyrJ7r1_LahIHzI45MGq6XjplYJgdchebzbsfyx2CjDRM7Bv0Yf5bC2Ok0bUNYEwd_zdaZJcNlsuJOOjP3foH1qdvaewkocpMziIqj",
      issues: [],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "flagged":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "approved":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <MdWarning size={16} />;
      case "flagged":
        return <MdClose size={16} />;
      case "approved":
        return <MdCheck size={16} />;
      default:
        return <MdInfo size={16} />;
    }
  };

  return (
    <div className="pt-20 sm:pt-24 lg:pt-28 px-4 sm:px-6 lg:px-12 pb-12 sm:pb-20 min-h-screen overflow-x-hidden">
      <section className="mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-6">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#a9c7ff] mb-2 sm:mb-4 block">
              Azure Estates / Content Moderation
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-inter text-white tracking-tighter">
              Property Moderation
            </h2>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 sm:gap-8 mt-4 sm:mt-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400 animate-pulse"></div>
                <span className="text-xs sm:text-sm text-white/80">
                  12 Pending Review
                </span>
              </div>
              <div className="hidden sm:block w-px h-5 sm:h-6 bg-white/20"></div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
                <span className="text-xs sm:text-sm text-white/80">
                  3 Flagged
                </span>
              </div>
              <div className="hidden sm:block w-px h-5 sm:h-6 bg-white/20"></div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400"></div>
                <span className="text-xs sm:text-sm text-white/80">
                  24 Approved Today
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <MdSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                size={18}
              />
              <input
                className="pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-white text-sm placeholder:text-white/30 focus:border-[#a9c7ff] focus:outline-none w-full sm:w-auto"
                placeholder="Search properties..."
              />
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-4 sm:space-y-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-white/5"
            style={{
              background: "rgba(18, 42, 76, 0.4)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
              <div className="w-full sm:w-32 lg:w-48 h-40 sm:h-24 lg:h-32 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-3">
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2">
                      {property.title}
                    </h3>
                    <p className="text-[#c2c6d3] text-xs sm:text-sm mb-1">
                      {property.location}
                    </p>
                    <p className="text-base sm:text-xl font-bold text-[#a9c7ff]">
                      {property.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold border flex items-center gap-1 sm:gap-2 ${getStatusColor(property.status)}`}
                    >
                      {getStatusIcon(property.status)}
                      {property.status.charAt(0).toUpperCase() +
                        property.status.slice(1)}
                    </span>
                    <button className="p-2 sm:p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                      <MdMoreVert size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-6 mb-3 sm:mb-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-white/40">Submitted by:</span>
                    <span className="ml-1 sm:ml-2 text-white font-medium">
                      {property.submittedBy}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40">Time:</span>
                    <span className="ml-1 sm:ml-2 text-white font-medium">
                      {property.submittedAt}
                    </span>
                  </div>
                </div>

                {property.issues.length > 0 && (
                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm font-medium text-amber-400 mb-2">
                      Issues to resolve:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {property.issues.map((issue, index) => (
                        <span
                          key={index}
                          className="px-2 sm:px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] sm:text-xs rounded-full"
                        >
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button className="px-4 sm:px-6 py-1.5 sm:py-2 bg-[#a9c7ff] text-[#003063] font-bold text-xs sm:text-sm rounded-full hover:bg-white transition-colors">
                    View Details
                  </button>
                  {property.status === "pending" && (
                    <>
                      <button className="px-4 sm:px-6 py-1.5 sm:py-2 bg-emerald-500/20 text-emerald-400 font-bold text-xs sm:text-sm rounded-full hover:bg-emerald-500/30 transition-colors">
                        Approve
                      </button>
                      <button className="px-4 sm:px-6 py-1.5 sm:py-2 bg-red-500/20 text-red-400 font-bold text-xs sm:text-sm rounded-full hover:bg-red-500/30 transition-colors">
                        Reject
                      </button>
                    </>
                  )}
                  {property.status === "flagged" && (
                    <>
                      <button className="px-4 sm:px-6 py-1.5 sm:py-2 bg-amber-500/20 text-amber-400 font-bold text-xs sm:text-sm rounded-full hover:bg-amber-500/30 transition-colors">
                        Review
                      </button>
                      <button className="px-4 sm:px-6 py-1.5 sm:py-2 bg-red-500/20 text-red-400 font-bold text-xs sm:text-sm rounded-full hover:bg-red-500/30 transition-colors">
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mt-8 sm:mt-12">
        <div
          className="p-4 sm:p-6 rounded-xl border border-white/5"
          style={{
            background: "rgba(18, 42, 76, 0.4)",
            backdropFilter: "blur(24px)",
          }}
        >
          <p className="text-xs sm:text-sm text-[#c2c6d3] mb-2">
            Total Properties
          </p>
          <p className="text-xl sm:text-3xl font-bold text-white">1,247</p>
        </div>
        <div
          className="p-4 sm:p-6 rounded-xl border border-white/5"
          style={{
            background: "rgba(18, 42, 76, 0.4)",
            backdropFilter: "blur(24px)",
          }}
        >
          <p className="text-xs sm:text-sm text-[#c2c6d3] mb-2">
            Pending Review
          </p>
          <p className="text-xl sm:text-3xl font-bold text-amber-400">12</p>
        </div>
        <div
          className="p-4 sm:p-6 rounded-xl border border-white/5"
          style={{
            background: "rgba(18, 42, 76, 0.4)",
            backdropFilter: "blur(24px)",
          }}
        >
          <p className="text-xs sm:text-sm text-[#c2c6d3] mb-2">Flagged</p>
          <p className="text-xl sm:text-3xl font-bold text-red-400">3</p>
        </div>
        <div
          className="p-4 sm:p-6 rounded-xl border border-white/5"
          style={{
            background: "rgba(18, 42, 76, 0.4)",
            backdropFilter: "blur(24px)",
          }}
        >
          <p className="text-xs sm:text-sm text-[#c2c6d3] mb-2">
            Approved Today
          </p>
          <p className="text-xl sm:text-3xl font-bold text-emerald-400">24</p>
        </div>
      </div>
    </div>
  );
}
