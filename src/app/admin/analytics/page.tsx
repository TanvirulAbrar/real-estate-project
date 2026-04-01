import {
  MdTrendingUp,
  MdDiversity3,
  MdSpeed,
  MdSecurity,
  MdNotifications,
  MdSettings,
  MdAdminPanelSettings,
  MdSearch,
  MdDashboard,
  MdAnalytics,
  MdGroup,
  MdDomain,
  MdVerifiedUser,
  MdLocalOffer,
  MdPayments,
  MdHelpCenter,
} from "react-icons/md";

export default function AdminAnalytics() {
  return (
    <div className="pt-20 sm:pt-24 lg:pt-28 px-4 sm:px-6 lg:px-12 pb-12 sm:pb-20 min-h-screen overflow-x-hidden">
      <section className="mb-8 sm:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6">
        <div className="max-w-2xl">
          <p className="text-[#b2c5ff] font-bold tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-2 sm:mb-3">
            Azure Estates Core
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-inter text-white tracking-tighter leading-none">
            Market Intelligence
          </h2>
          <p className="text-[#c2c6d3] mt-3 sm:mt-6 text-sm sm:text-lg max-w-xl leading-relaxed opacity-80">
            Real-time atmospheric analysis of luxury asset distribution and
            institutional capital flow across primary global nodes.
          </p>
        </div>
        <div className="flex gap-2 sm:gap-4">
          <div className="bg-[#1d2025] p-3 sm:p-4 px-4 sm:px-6 rounded-xl border border-white/5">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">
              Global Index
            </p>
            <p className="text-lg sm:text-2xl font-inter text-[#b2c5ff] tracking-tighter">
              +12.4%
            </p>
          </div>
          <div className="bg-[#1d2025] p-3 sm:p-4 px-4 sm:px-6 rounded-xl border border-white/5">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">
              Vol. Velocity
            </p>
            <p className="text-lg sm:text-2xl font-inter text-white tracking-tighter">
              $4.2B
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 auto-rows-auto lg:auto-rows-[280px]">
        <div
          className="col-span-1 sm:col-span-2 lg:col-span-8 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden flex flex-col justify-between"
          style={{
            background: "rgba(18, 42, 76, 0.4)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(178, 197, 255, 0.1)",
          }}
        >
          <div className="flex justify-between items-start z-10">
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-1">
                Market Sentiment
              </h3>
              <p className="text-xs sm:text-sm text-white/50">
                Luxury vs Commercial Assets
              </p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 sm:px-3 py-1 bg-[#b2c5ff]/10 text-[#b2c5ff] text-[10px] font-bold rounded-full border border-[#b2c5ff]/20">
                LIVE DATA
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 lg:gap-12 mt-4 z-10">
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/80">
                  Luxury Residential
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#b2c5ff]">
                  84%
                </span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#b2c5ff] w-[84%]"></div>
              </div>
            </div>
            <div className="hidden sm:block w-px h-8 lg:h-12 bg-white/10"></div>
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/80">
                  Commercial Core
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#ffb68b]">
                  16%
                </span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#ffb68b] w-[16%]"></div>
              </div>
            </div>
          </div>
          <div className="h-12 sm:h-16 flex items-end gap-1 z-10 mt-4">
            <div className="flex-1 h-3 sm:h-4 bg-[#b2c5ff]/20 rounded-t-sm"></div>
            <div className="flex-1 h-4 sm:h-6 bg-[#b2c5ff]/20 rounded-t-sm"></div>
            <div className="flex-1 h-3 sm:h-5 bg-[#b2c5ff]/20 rounded-t-sm"></div>
            <div className="flex-1 h-5 sm:h-8 bg-[#b2c5ff]/20 rounded-t-sm"></div>
            <div className="flex-1 h-8 sm:h-12 bg-[#b2c5ff]/40 rounded-t-sm"></div>
            <div className="flex-1 h-6 sm:h-10 bg-[#b2c5ff]/30 rounded-t-sm"></div>
            <div className="flex-1 h-10 sm:h-14 bg-[#b2c5ff] rounded-t-sm"></div>
            <div className="flex-1 h-12 sm:h-16 bg-[#b2c5ff]/80 rounded-t-sm"></div>
            <div className="flex-1 h-8 sm:h-12 bg-[#b2c5ff]/40 rounded-t-sm"></div>
            <div className="flex-1 h-5 sm:h-9 bg-[#b2c5ff]/20 rounded-t-sm"></div>
          </div>

          <div className="absolute -right-10 sm:-right-20 -bottom-10 sm:-bottom-20 w-40 sm:w-80 h-40 sm:h-80 bg-[#b2c5ff]/5 rounded-full blur-[60px] sm:blur-[100px]"></div>
        </div>

        <div className="col-span-1 sm:col-span-2 lg:col-span-4 bg-[#282a2f] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col justify-between overflow-hidden relative">
          <div>
            <h3 className="text-base sm:text-xl font-bold text-white mb-1">
              Regional Distribution
            </h3>
            <p className="text-xs sm:text-sm text-white/40">
              Capital Concentration
            </p>
          </div>
          <div className="relative w-full aspect-square mt-2 sm:mt-4 rounded-xl overflow-hidden grayscale brightness-75 opacity-50">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqHePC_CQMnfswixcvu6Lusptr1cu5XS1crAAu4CblbjC2h5ceChbW6y-F0FkxLcGjE7cDzYICGqvjJwCLxEfXnQ3mGPPMA1HEccjk0dYqeEPRFB3YV4XBdJwAjCpSyrv7t3c4lYcwDkMMWPUbDUsoHW64mDI3dYQTiPUY3Y0UexWkYlbUhcdkAqq4JzSdAAU0xsklFZVnaQnTO_oIGIhK4PSzYbySxjN6zfrUWJ3wfR_neETvIx5sKuOtyixZl18qqiAALcrvwGv4"
              alt="Regional distribution map"
            />

            <div className="absolute top-1/4 left-1/3 w-6 sm:w-8 h-6 sm:h-8 bg-[#b2c5ff] rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-8 sm:w-12 h-8 sm:h-12 bg-[#b2c5ff]/60 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 right-1/3 w-4 sm:w-6 h-4 sm:h-6 bg-[#ffb68b]/40 rounded-full blur-lg"></div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-4 sm:mt-6">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/40">
                EMEA Region
              </span>
              <span className="text-base sm:text-lg font-bold text-white tracking-tighter">
                42.8%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/40">
                APAC Growth
              </span>
              <span className="text-base sm:text-lg font-bold text-white tracking-tighter">
                31.2%
              </span>
            </div>
          </div>
        </div>

        <div
          className="col-span-1 sm:col-span-2 lg:col-span-4 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col"
          style={{
            background: "rgba(18, 42, 76, 0.4)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(178, 197, 255, 0.1)",
          }}
        >
          <h3 className="text-base sm:text-xl font-bold text-white mb-4 sm:mb-6">
            User Acquisition
          </h3>
          <div className="flex-1 flex items-end gap-1 sm:gap-2 px-1 sm:px-2">
            <div className="flex-1 bg-white/5 rounded-t-sm h-[30%]"></div>
            <div className="flex-1 bg-white/5 rounded-t-sm h-[45%]"></div>
            <div className="flex-1 bg-white/5 rounded-t-sm h-[35%]"></div>
            <div className="flex-1 bg-white/10 rounded-t-sm h-[60%]"></div>
            <div className="flex-1 bg-white/10 rounded-t-sm h-[55%]"></div>
            <div className="flex-1 bg-[#b2c5ff]/40 rounded-t-sm h-[80%]"></div>
            <div className="flex-1 bg-[#b2c5ff] rounded-t-sm h-[100%]"></div>
          </div>
          <div className="mt-3 sm:mt-4 flex justify-between items-center">
            <p className="text-[10px] uppercase tracking-widest text-white/40">
              Period: Q3 2024
            </p>
            <p className="text-xs sm:text-sm font-bold text-[#b2c5ff]">
              +2,481 Nodes
            </p>
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2 lg:col-span-8 bg-[#1d2025] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 overflow-hidden relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-3">
            <div>
              <h3 className="text-base sm:text-xl font-bold text-white mb-1">
                Institutional Capital Flows
              </h3>
              <p className="text-xs sm:text-sm text-white/40">
                Transaction velocity by asset class
              </p>
            </div>
            <button className="bg-white/5 hover:bg-white/10 text-white/70 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs uppercase tracking-widest transition-colors">
              Export Report
            </button>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="group">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2 sm:mb-3 gap-1 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#b2c5ff]"></div>
                  <span className="text-xs sm:text-sm font-bold text-white">
                    Private Equity Real Estate (PERE)
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#b2c5ff]">
                  $1.24B
                </span>
              </div>
              <div className="w-full h-[2px] bg-white/5">
                <div className="h-full bg-[#b2c5ff] w-[75%] opacity-80 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <div className="group">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2 sm:mb-3 gap-1 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white/30"></div>
                  <span className="text-xs sm:text-sm font-bold text-white/80">
                    Sovereign Wealth Ingress
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-white/80">
                  $892M
                </span>
              </div>
              <div className="w-full h-[2px] bg-white/5">
                <div className="h-full bg-white/20 w-[55%] opacity-80 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <div className="group">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2 sm:mb-3 gap-1 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#ffb68b]"></div>
                  <span className="text-xs sm:text-sm font-bold text-white">
                    REIT Liquidity Channels
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#ffb68b]">
                  $415M
                </span>
              </div>
              <div className="w-full h-[2px] bg-white/5">
                <div className="h-full bg-[#ffb68b] w-[30%] opacity-80 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>
          <div className="absolute -right-2 sm:-right-4 -top-2 sm:-top-4 opacity-5">
            <MdTrendingUp size={80} className="sm:w-[120px] sm:h-[120px]" />
          </div>
        </div>
      </div>

      <section className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        <div className="bg-[#32353a]/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/5">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <MdDiversity3 className="text-[#b2c5ff]" size={20} />
            <h4 className="font-bold text-xs sm:text-sm uppercase tracking-widest text-white/80">
              Active Portfolios
            </h4>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-4xl font-inter text-white tracking-tighter">
              12,402
            </span>
            <span className="text-[10px] sm:text-xs text-[#b2c5ff] font-bold">
              +8% MoM
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-white/40 mt-2">
            Average AUM per node: $2.4M
          </p>
        </div>
        <div className="bg-[#32353a]/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/5">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <MdSpeed className="text-[#b2c5ff]" size={20} />
            <h4 className="font-bold text-xs sm:text-sm uppercase tracking-widest text-white/80">
              Deal Velocity
            </h4>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-4xl font-inter text-white tracking-tighter">
              4.2d
            </span>
            <span className="text-[10px] sm:text-xs text-emerald-400 font-bold">
              -12% time
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-white/40 mt-2">
            Avg lead-to-close duration
          </p>
        </div>
        <div className="bg-[#32353a]/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/5">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <MdSecurity className="text-[#b2c5ff]" size={20} />
            <h4 className="font-bold text-xs sm:text-sm uppercase tracking-widest text-white/80">
              Risk Index
            </h4>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-4xl font-inter text-white tracking-tighter">
              Low
            </span>
            <span className="text-[10px] sm:text-xs text-white/40 font-bold">
              Stable
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-white/40 mt-2">
            Volatility coefficient: 0.12
          </p>
        </div>
      </section>
    </div>
  );
}
