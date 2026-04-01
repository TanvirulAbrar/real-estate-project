import {
  MdPayments,
  MdSearch,
  MdNotifications,
  MdSettings,
  MdHelpCenter,
  MdDashboard,
  MdAnalytics,
  MdGroup,
  MdDomain,
  MdVerifiedUser,
  MdLocalOffer,
  MdDownload,
  MdFilterList,
  MdArrowUpward,
  MdArrowDownward,
  MdMoreVert,
} from "react-icons/md";

export default function AdminTransactionsLedger() {
  const transactions = [
    {
      id: "TXN-2024-001",
      property: "Azure Sky Villa",
      buyer: "Alexander Volkov",
      seller: "Elena Rodriguez",
      amount: "$4,200,000",
      status: "completed",
      date: "2024-03-15",
      commission: "$126,000",
      agent: "Marcus Thorne",
    },
    {
      id: "TXN-2024-002",
      property: "The Obsidian Estate",
      buyer: "Sarah Chen",
      seller: "Michael Williams",
      amount: "$8,750,000",
      status: "pending",
      date: "2024-03-18",
      commission: "$262,500",
      agent: "Julian Black",
    },
    {
      id: "TXN-2024-003",
      property: "Coastal Paradise",
      buyer: "David Miller",
      seller: "Rebecca Stone",
      amount: "$3,200,000",
      status: "processing",
      date: "2024-03-20",
      commission: "$96,000",
      agent: "Victoria Sterling",
    },
    {
      id: "TXN-2024-004",
      property: "Mountain Summit Lodge",
      buyer: "Jennifer Lopez",
      seller: "Robert Chen",
      amount: "$5,450,000",
      status: "completed",
      date: "2024-03-22",
      commission: "$163,500",
      agent: "Elena Rodriguez",
    },
    {
      id: "TXN-2024-005",
      property: "Urban Penthouse",
      buyer: "William Zhang",
      seller: "Amanda Foster",
      amount: "$2,850,000",
      status: "failed",
      date: "2024-03-23",
      commission: "$0",
      agent: "Marcus Thorne",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "pending":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "processing":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "failed":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const totalVolume = transactions.reduce((sum, txn) => {
    const amount = parseFloat(txn.amount.replace(/[$,]/g, ""));
    return sum + amount;
  }, 0);

  const totalCommission = transactions.reduce((sum, txn) => {
    const commission = parseFloat(txn.commission.replace(/[$,]/g, ""));
    return sum + commission;
  }, 0);

  return (
    <div className="pt-20 sm:pt-24 lg:pt-28 px-4 sm:px-6 lg:px-12 pb-12 sm:pb-20 min-h-screen overflow-x-hidden">
      <section className="mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-6">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#a9c7ff] mb-2 sm:mb-4 block">
              Azure Estates / Financial Operations
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-inter text-white tracking-tighter">
              Transactions Ledger
            </h2>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 sm:gap-8 mt-4 sm:mt-6">
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-bold mb-1">
                  Total Volume
                </span>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  ${totalVolume.toLocaleString()}
                </span>
              </div>
              <div className="hidden sm:block w-px h-5 sm:h-8 bg-white/20"></div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-bold mb-1">
                  Total Commission
                </span>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[#a9c7ff]">
                  ${totalCommission.toLocaleString()}
                </span>
              </div>
              <div className="hidden sm:block w-px h-5 sm:h-8 bg-white/20"></div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-bold mb-1">
                  Active Deals
                </span>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-400">
                  2
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
                placeholder="Search transactions..."
              />
            </div>
            <button className="p-2 sm:p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
              <MdFilterList size={18} />
            </button>
            <button className="p-2 sm:p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
              <MdDownload size={18} />
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
            <p className="text-xs sm:text-sm text-[#c2c6d3]">Completed</p>
            <MdArrowUpward className="text-emerald-400" size={14} />
          </div>
          <p className="text-xl sm:text-3xl font-bold text-white">2</p>
          <p className="text-[10px] sm:text-xs text-emerald-400 mt-1">
            +15% this month
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
            <p className="text-xs sm:text-sm text-[#c2c6d3]">Pending</p>
            <MdArrowDownward className="text-amber-400" size={14} />
          </div>
          <p className="text-xl sm:text-3xl font-bold text-white">1</p>
          <p className="text-[10px] sm:text-xs text-amber-400 mt-1">
            -5% this month
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
            <p className="text-xs sm:text-sm text-[#c2c6d3]">Processing</p>
            <MdArrowUpward className="text-blue-400" size={14} />
          </div>
          <p className="text-xl sm:text-3xl font-bold text-white">1</p>
          <p className="text-[10px] sm:text-xs text-blue-400 mt-1">
            +2 this week
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
            <p className="text-xs sm:text-sm text-[#c2c6d3]">Failed</p>
            <MdArrowDownward className="text-red-400" size={14} />
          </div>
          <p className="text-xl sm:text-3xl font-bold text-white">1</p>
          <p className="text-[10px] sm:text-xs text-red-400 mt-1">
            -50% this month
          </p>
        </div>
      </div>

      <div
        className="rounded-xl sm:rounded-2xl border border-white/5 overflow-hidden"
        style={{
          background: "rgba(18, 42, 76, 0.4)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-2 sm:p-4 text-xs sm:text-sm font-bold text-[#c2c6d3] uppercase tracking-widest">
                  ID
                </th>
                <th className="text-left py-3 px-2 sm:p-4 text-xs sm:text-sm font-bold text-[#c2c6d3] uppercase tracking-widest">
                  Property
                </th>
                <th className="text-left py-3 px-2 sm:p-4 text-xs sm:text-sm font-bold text-[#c2c6d3] uppercase tracking-widest hidden sm:table-cell">
                  Buyer
                </th>
                <th className="text-left py-3 px-2 sm:p-4 text-xs sm:text-sm font-bold text-[#c2c6d3] uppercase tracking-widest hidden lg:table-cell">
                  Seller
                </th>
                <th className="text-left py-3 px-2 sm:p-4 text-xs sm:text-sm font-bold text-[#c2c6d3] uppercase tracking-widest">
                  Amount
                </th>
                <th className="text-left py-3 px-2 sm:p-4 text-xs sm:text-sm font-bold text-[#c2c6d3] uppercase tracking-widest hidden md:table-cell">
                  Commission
                </th>
                <th className="text-left py-3 px-2 sm:p-4 text-xs sm:text-sm font-bold text-[#c2c6d3] uppercase tracking-widest hidden lg:table-cell">
                  Agent
                </th>
                <th className="text-left py-3 px-2 sm:p-4 text-xs sm:text-sm font-bold text-[#c2c6d3] uppercase tracking-widest">
                  Status
                </th>
                <th className="text-left py-3 px-2 sm:p-4 text-xs sm:text-sm font-bold text-[#c2c6d3] uppercase tracking-widest hidden md:table-cell">
                  Date
                </th>
                <th className="text-center py-3 px-2 sm:p-4 text-xs sm:text-sm font-bold text-[#c2c6d3] uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-2 sm:p-4">
                    <span className="text-xs sm:text-sm font-mono text-white">
                      {transaction.id.split("-")[2] || transaction.id}
                    </span>
                  </td>
                  <td className="py-3 px-2 sm:p-4">
                    <p className="text-xs sm:text-sm font-medium text-white">
                      {transaction.property}
                    </p>
                  </td>
                  <td className="py-3 px-2 sm:p-4 hidden sm:table-cell">
                    <p className="text-xs sm:text-sm text-[#c2c6d3]">
                      {transaction.buyer}
                    </p>
                  </td>
                  <td className="py-3 px-2 sm:p-4 hidden lg:table-cell">
                    <p className="text-xs sm:text-sm text-[#c2c6d3]">
                      {transaction.seller}
                    </p>
                  </td>
                  <td className="py-3 px-2 sm:p-4">
                    <p className="text-xs sm:text-sm font-bold text-white">
                      {transaction.amount}
                    </p>
                  </td>
                  <td className="py-3 px-2 sm:p-4 hidden md:table-cell">
                    <p className="text-xs sm:text-sm font-bold text-[#a9c7ff]">
                      {transaction.commission}
                    </p>
                  </td>
                  <td className="py-3 px-2 sm:p-4 hidden lg:table-cell">
                    <p className="text-xs sm:text-sm text-[#c2c6d3]">
                      {transaction.agent}
                    </p>
                  </td>
                  <td className="py-3 px-2 sm:p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold border ${getStatusColor(transaction.status)}`}
                    >
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-2 sm:p-4 hidden md:table-cell">
                    <p className="text-xs sm:text-sm text-[#c2c6d3]">
                      {transaction.date}
                    </p>
                  </td>
                  <td className="py-3 px-2 sm:p-4">
                    <div className="flex justify-center">
                      <button className="p-1 rounded hover:bg-white/10 transition-colors">
                        <MdMoreVert
                          size={14}
                          className="text-white/60 sm:w-4 sm:h-4"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 sm:mt-8 gap-4">
        <div className="flex gap-2 sm:gap-4">
          <button className="px-4 sm:px-6 py-2 bg-[#a9c7ff] text-[#003063] font-bold text-xs sm:text-sm rounded-full hover:bg-white transition-colors flex items-center gap-2">
            <MdDownload size={14} />
            Export CSV
          </button>
          <button className="px-4 sm:px-6 py-2 bg-white/5 border border-white/10 text-white font-bold text-xs sm:text-sm rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
            <MdDownload size={14} />
            Export PDF
          </button>
        </div>
        <div className="text-xs sm:text-sm text-[#c2c6d3]">
          Showing {transactions.length} of 247 transactions
        </div>
      </div>
    </div>
  );
}
