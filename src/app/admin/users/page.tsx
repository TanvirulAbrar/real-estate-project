import {
  MdGroup,
  MdSearch,
  MdNotifications,
  MdSettings,
  MdHelpCenter,
  MdDashboard,
  MdAnalytics,
  MdDomain,
  MdVerifiedUser,
  MdLocalOffer,
  MdPayments,
  MdMoreVert,
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdCalendarToday,
  MdBlock,
  MdCheckCircle,
} from "react-icons/md";

export default function AdminUserManagement() {
  const users = [
    {
      id: 1,
      name: "Alexander Volkov",
      email: "alexander.volkov@email.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      role: "Premium Buyer",
      status: "active",
      joinedDate: "2024-01-15",
      lastActive: "2 hours ago",
      properties: 3,
      transactions: 2,
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDV8AYKHyzNsZLae8c96_UD9o5YeDRuxSWmWGVDg7DpKnEENvaiiDcFSixm8KOTT2dNnK4t_DfzcpFJqUYGcw0fZyG7rstGKw9h6qLKqfafVOzSv-S9w0bYBdlO1ieY0j4yyWlRhkeZC76AcX3MN8YzVhVoxgiWeP1Zxxy8FR6zxLEvB0JEsYNnBP5h2CnuVGOZxZ1hzY4XYMkgW2fWH41_fzu2cE5e06GJ4hVwLZfrRZEnpByx6Ps4C2mi3_AWr3xz4385kjJBhgd6",
    },
    {
      id: 2,
      name: "Elena Rodriguez",
      email: "elena.rodriguez@agency.com",
      phone: "+1 (555) 234-5678",
      location: "Los Angeles, CA",
      role: "Real Estate Agent",
      status: "active",
      joinedDate: "2023-11-20",
      lastActive: "5 minutes ago",
      properties: 12,
      transactions: 8,
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCUvbVvR9_8jjUiXHESbpYjXphqYV5cbL7psHLlFcVMDQXJ_9pKceybrek5JfGY-2SL_1rhYDQKyzl8QJMvhv3zSleXd78hHI3cLfJv7hgBloA8TMgnnushW-JDJwIcruwzFDrus5kpYEIKK45Gqeg2uHKuc_y2LPFq5FaHgaxCqNRvIhC4S5qaBdNMhiREzVEiSFusAzRuf8H_le4at1TTA4XBNHb8_PIFx22oF1l50X6Uz_1Qamo3_L7f3vtcnWOgbXayAj8S32jp",
    },
    {
      id: 3,
      name: "Marcus Thorne",
      email: "marcus.thorne@properties.com",
      phone: "+1 (555) 345-6789",
      location: "Miami, FL",
      role: "Real Estate Agent",
      status: "active",
      joinedDate: "2023-09-10",
      lastActive: "1 day ago",
      properties: 8,
      transactions: 5,
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAmbJsmDaNL7aRasyQGXKWQbPljs3diCWNThdJKs1J2ar3x7pvIPDlCBWyNZCUTNk0QTUFWaawTiyvFhz70ivP6_vDsPJYF91s3nt5Lkb8sqkfcw0bBDmdWIatRh4jVx__ZOE_03WyCnMAydmldgNb68b4G6E52CHyTw-B1hODhSOE-0A9Wr7ieO-HchiTHx-l1Pd9NLUZ01aSgB-pvZxpU_MyZ_l4VXRYJL6vRbjVnkzeYG_9iZE6VsVS8zJC6XeosCaL-FkhjPqSM",
    },
    {
      id: 4,
      name: "Sarah Chen",
      email: "sarah.chen@email.com",
      phone: "+1 (555) 456-7890",
      location: "San Francisco, CA",
      role: "Premium Buyer",
      status: "suspended",
      joinedDate: "2024-02-01",
      lastActive: "3 days ago",
      properties: 1,
      transactions: 0,
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCtPwYOghZGZHa1mhahnShRrIdg8FAVwepbIxOvvJnn5WUA6TFq4Q0URPhnRcHJm4rFkXgyZCzCJw2vicBS0b0M4t3Rfd98l3QuHKEWbN5pfDzqYwHweiSGFox5P-W0XI8aBOs-zU-Z8UKzWS0jYSCzn--q65gG3dAIYiQq2mX9xOKy8DtpfLTLzsbQaZ1jxoRzQ2Euf1yWXAOJBqV4KxmbsjIffoUYo3ko3Dnbby7v0FqtDBOaT5shSRqGX8zZfmRiL8XIPztpSVD8",
    },
    {
      id: 5,
      name: "David Miller",
      email: "david.miller@investments.com",
      phone: "+1 (555) 567-8901",
      location: "Chicago, IL",
      role: "Investor",
      status: "active",
      joinedDate: "2023-12-15",
      lastActive: "6 hours ago",
      properties: 5,
      transactions: 3,
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDxVFg8slgeMUR3x7dQU64qaSWYSGY7KJRxH6uBUgF7ffy04215zQErzSauIINgQtfjKHXd1QSs-ytI5jWZ_I10w9rUNSinEVYsQGT7sopUTCokW92y373y7Rl1k_gkESN09Xtzh-q_OP_VtzF_ULgV7NuB7eyFe07Ze_74uOBVk95chzNC-htDkkekvrYeVcZ0eG0rE77EAGTdZwl5QQHOEiN8RXixDbWie3bR5FFZeJ01Yy2G3sjXaJZW4HD_gMqxQM3IipgC8sKe",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "suspended":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "pending":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Premium Buyer":
        return "text-[#a9c7ff] bg-[#a9c7ff]/10 border-[#a9c7ff]/20";
      case "Real Estate Agent":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "Investor":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const activeUsers = users.filter((user) => user.status === "active").length;
  const totalProperties = users.reduce((sum, user) => sum + user.properties, 0);
  const totalTransactions = users.reduce(
    (sum, user) => sum + user.transactions,
    0,
  );

  return (
    <div className="pt-20 sm:pt-24 lg:pt-28 px-4 sm:px-6 lg:px-12 pb-12 sm:pb-20 min-h-screen overflow-x-hidden">
      <section className="mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-6">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#a9c7ff] mb-2 sm:mb-4 block">
              Azure Estates / User Management
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-inter text-white tracking-tighter">
              User Management
            </h2>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 sm:gap-8 mt-4 sm:mt-6">
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-bold mb-1">
                  Total Users
                </span>
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {users.length}
                </span>
              </div>
              <div className="hidden sm:block w-px h-6 sm:h-8 bg-white/20"></div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-bold mb-1">
                  Active Users
                </span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-400">
                  {activeUsers}
                </span>
              </div>
              <div className="hidden sm:block w-px h-6 sm:h-8 bg-white/20"></div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-bold mb-1">
                  Total Properties
                </span>
                <span className="text-xl sm:text-2xl font-bold text-[#a9c7ff]">
                  {totalProperties}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            <div className="relative">
              <MdSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                size={18}
              />
              <input
                className="pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-white text-sm placeholder:text-white/30 focus:border-[#a9c7ff] focus:outline-none w-full sm:w-auto"
                placeholder="Search users..."
              />
            </div>
            <button className="px-4 sm:px-6 py-2 bg-[#a9c7ff] text-[#003063] font-bold text-xs sm:text-sm rounded-full hover:bg-white transition-colors">
              Add User
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div
          className="p-4 sm:p-6 rounded-xl border border-white/5"
          style={{
            background: "rgba(18, 42, 76, 0.4)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-[#c2c6d3]">Premium Buyers</p>
            <MdPerson className="text-[#a9c7ff]" size={14} />
          </div>
          <p className="text-xl sm:text-3xl font-bold text-white">2</p>
          <p className="text-[10px] sm:text-xs text-[#a9c7ff] mt-1">
            40% of users
          </p>
        </div>
        <div
          className="p-4 sm:p-6 rounded-xl border border-white/5"
          style={{
            background: "rgba(18, 42, 76, 0.4)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-[#c2c6d3]">Agents</p>
            <MdVerifiedUser className="text-emerald-400" size={14} />
          </div>
          <p className="text-xl sm:text-3xl font-bold text-white">2</p>
          <p className="text-[10px] sm:text-xs text-emerald-400 mt-1">
            40% of users
          </p>
        </div>
        <div
          className="p-4 sm:p-6 rounded-xl border border-white/5"
          style={{
            background: "rgba(18, 42, 76, 0.4)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-[#c2c6d3]">Investors</p>
            <MdLocalOffer className="text-amber-400" size={14} />
          </div>
          <p className="text-xl sm:text-3xl font-bold text-white">1</p>
          <p className="text-[10px] sm:text-xs text-amber-400 mt-1">
            20% of users
          </p>
        </div>
        <div
          className="p-4 sm:p-6 rounded-xl border border-white/5"
          style={{
            background: "rgba(18, 42, 76, 0.4)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-[#c2c6d3]">
              Total Transactions
            </p>
            <MdPayments className="text-[#ffb68b]" size={14} />
          </div>
          <p className="text-xl sm:text-3xl font-bold text-white">
            {totalTransactions}
          </p>
          <p className="text-[10px] sm:text-xs text-[#ffb68b] mt-1">
            This month
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/5"
            style={{
              background: "rgba(18, 42, 76, 0.4)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-xl font-bold text-white mb-1 truncate">
                    {user.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getRoleColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(user.status)}`}
                    >
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-[#c2c6d3]">
                    <MdEmail size={12} />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 sm:p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors flex-shrink-0">
                <MdMoreVert size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <MdPhone size={12} className="text-white/40" />
                <span className="text-[#c2c6d3] truncate">{user.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MdLocationOn size={12} className="text-white/40" />
                <span className="text-[#c2c6d3] truncate">{user.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <MdCalendarToday size={12} className="text-white/40" />
                <span className="text-[#c2c6d3]">Joined {user.joinedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <MdPerson size={12} className="text-white/40" />
                <span className="text-[#c2c6d3]">
                  Last active {user.lastActive}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-4 sm:gap-6">
                <div>
                  <p className="text-[10px] sm:text-xs text-white/40">
                    Properties
                  </p>
                  <p className="text-base sm:text-lg font-bold text-white">
                    {user.properties}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-white/40">
                    Transactions
                  </p>
                  <p className="text-base sm:text-lg font-bold text-[#a9c7ff]">
                    {user.transactions}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 sm:p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                  <MdCheckCircle size={14} />
                </button>
                {user.status === "active" && (
                  <button className="p-2 sm:p-3 rounded-full bg-red-500/20 border border-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                    <MdBlock size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
