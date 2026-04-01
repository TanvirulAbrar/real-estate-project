import {
  MdPayments,
  MdGroup,
  MdVerifiedUser,
  MdPendingActions,
  MdNotifications,
  MdSettings,
  MdAdminPanelSettings,
  MdDomain,
  MdTrendingUp,
  MdAssignmentTurnedIn,
} from "react-icons/md";

export default function AdminDashboardOverview() {
  const metrics = [
    {
      id: 1,
      title: "Total Sales Vol",
      value: "$842M",
      change: "+12.4%",
      changeType: "positive",
      icon: MdPayments,
    },
    {
      id: 2,
      title: "Active Users",
      value: "24.5K",
      change: "+8.2%",
      changeType: "positive",
      icon: MdGroup,
    },
    {
      id: 3,
      title: "Verified Agents",
      value: "1,847",
      change: "+5.7%",
      changeType: "positive",
      icon: MdVerifiedUser,
    },
    {
      id: 4,
      title: "Pending Actions",
      value: "142",
      change: "-2.3%",
      changeType: "negative",
      icon: MdPendingActions,
    },
    {
      id: 5,
      title: "System Health",
      value: "99.8%",
      change: "+0.1%",
      changeType: "positive",
      icon: MdTrendingUp,
    },
    {
      id: 6,
      title: "Properties Listed",
      value: "3,426",
      change: "+15.2%",
      changeType: "positive",
      icon: MdDomain,
    },
    {
      id: 7,
      title: "Completion Rate",
      value: "87.3%",
      change: "+3.4%",
      changeType: "positive",
      icon: MdAssignmentTurnedIn,
    },
    {
      id: 8,
      title: "Avg Response Time",
      value: "2.4h",
      change: "-18.5%",
      changeType: "positive",
      icon: MdNotifications,
    },
  ];

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] overflow-x-hidden">
      <header className="flex justify-between items-center w-full px-4 sm:px-6 lg:pl-80 lg:pr-12 py-4 sm:py-6 lg:py-8 fixed top-0 z-40 bg-[#00132e]/80 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none">
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 ml-0 lg:ml-8">
          <div className="flex items-center gap-3 sm:gap-6">
            <button className="relative text-white/70 hover:text-white transition-opacity p-1">
              <MdNotifications className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#a9c7ff] rounded-full"></span>
            </button>
            <button className="text-white/70 hover:text-white transition-opacity p-1 hidden sm:block">
              <MdSettings className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button className="text-white/70 hover:text-white transition-opacity p-1 hidden sm:block">
              <MdAdminPanelSettings className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          <div className="hidden sm:block h-6 sm:h-8 w-[1px] bg-white/10"></div>
          <div className="hidden sm:flex items-center gap-2 sm:gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-white">Alexander Volkov</p>
              <p className="text-[10px] text-[#a9c7ff]/70">
                Chief Administrator
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-20 sm:pt-24 lg:pt-20 p-4 sm:p-6 lg:p-12 space-y-8 sm:space-y-12">
        <section className="relative">
          <div className="flex flex-col gap-2">
            <span className="text-[#a9c7ff] font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs">
              Command Center
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-inter font-bold tracking-tighter text-white">
              Global Estate Overview.
            </h2>
          </div>
          <div className="mt-4 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button className="px-4 sm:px-6 py-2 bg-[#a9c7ff] text-[#001b3d] rounded-3xl font-bold text-xs sm:text-sm hover:scale-105 transition-transform cursor-pointer">
              Generate Quarterly Report
            </button>
            <button className="px-4 sm:px-6 py-2 border border-[#a9c7ff]/20 text-[#a9c7ff] rounded-3xl font-bold text-xs sm:text-sm hover:bg-[#a9c7ff]/5 transition-colors cursor-pointer">
              Audit Logs
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-white/5 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl flex flex-col justify-between group transition-all duration-500 hover:bg-[#a9c7ff]/10 border border-white/10"
            >
              <div className="flex justify-between items-start">
                <metric.icon className="text-[#a9c7ff] text-2xl sm:text-3xl w-6 h-6 sm:w-8 sm:h-8" />
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded ${
                    metric.changeType === "positive"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {metric.change}
                </span>
              </div>
              <div className="mt-4 sm:mt-8">
                <p className="text-[#c2c6d3] font-inter text-[10px] sm:text-xs uppercase tracking-widest mb-2">
                  {metric.title}
                </p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-inter font-bold text-white mt-2">
                  {metric.value}
                </h3>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6 lg:p-8">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6">
            Recent System Activity
          </h3>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 sm:px-4 text-[#c2c6d3] font-semibold">
                    Time
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-[#c2c6d3] font-semibold">
                    User
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-[#c2c6d3] font-semibold">
                    Action
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-[#c2c6d3] font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 sm:px-4 text-white whitespace-nowrap">
                    2 minutes ago
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-white">
                    Sarah Johnson
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-white">
                    Added new property listing
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-[10px] sm:text-xs">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 sm:px-4 text-white whitespace-nowrap">
                    15 minutes ago
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-white">Michael Chen</td>
                  <td className="py-3 px-2 sm:px-4 text-white">
                    Updated user profile
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-[10px] sm:text-xs">
                      Processing
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 sm:px-4 text-white whitespace-nowrap">
                    1 hour ago
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-white">Emily Davis</td>
                  <td className="py-3 px-2 sm:px-4 text-white">
                    Submitted offer for property
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-[10px] sm:text-xs">
                      Pending
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
