import {
  MdNotifications,
  MdSettings,
  MdAdminPanelSettings,
  MdAdd,
  MdPerson,
  MdMoreVert,
} from "react-icons/md";

export default function AdminOffersManagement() {
  const offers = {
    underReview: [
      {
        id: 1,
        property: "Obsidian Peak Estate",
        address: "102 Skyview Terraces, Aspen CO",
        price: "$2,850,000",
        type: "Initial Bid",
        buyer: "Marcus Thorne",
        agent: "Elena Rodriguez",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBoT6ZEQ688h_k06mD7K_LsvoegZ9k-k_7yr25YlGJNax0KzU_Krqksd6OHhoTZbQNhZWFnJT2FBVeOxgZKRCE0K4n4NjP-2hmT8Gu6FiclpbT5VDtkO0Rfhr20UeKvf9eIZbLLX2ONycNlfH2XKiVRq5wCp2QwOMpg1UL1Kcn-AGRFZPc5G7O8wV9BrKKQd7mDctUTRtrYee9eubAgsBcF4ouGn3CT7F7aVe5fgSYMaKbYi1vJZJ-ye_Azt1sluc3CH5qzca6d9wAi",
        buyerImage:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCUvbVvR9_8jjUiXHESbpYjXphqYV5cbL7psHLlFcVMDQXJ_9pKceybrek5JfGY-2SL_1rhYDQKyzl8QJMvhv3zSleXd78hHI3cLfJv7hgBloA8TMgnnushW-JDJwIcruwzFDrus5kpYEIKK45Gqeg2uHKuc_y2LPFq5FaHgaxCqNRvIhC4S5qaBdNMhiREzVEiSFusAzRuf8H_le4at1TTA4XBNHb8_PIFx22oF1l50X6Uz_1Qamo3_L7f3vtcnWOgbXayAj8S32jp",
      },
      {
        id: 2,
        property: "The Ivory Pavilion",
        address: "Palms Estates, Scottsdale AZ",
        price: "$4,120,000",
        type: "Counter Offer",
        buyer: "Sarah Jenkins-Wei",
        agent: "Julian Black",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCrU6es145ENZZpmEKM6zZD22fxptXYTd7Naujig4irKyhvjS3nxQyXrLbE1fAHE-4biu2mK3AU-Rmfoc6qgHwzk6UiA13rRQeDVotXue26bWS2aZIoTG8KwhKpO6T_h2SDt69SsfMHQkk85BLrYdXby72PC92eB0aa0CclnEsb-289Ek9ewh7cFQm88-_Rt1Tjq2uhgCm0XU19vIN53IExb_su_CQutYs32BFDGCLlrU1Z5s2HcWj7S4bWORCcjfH0kPXHU-w5p2eW",
        buyerImage:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCtPwYOghZGZHa1mhahnShRrIdg8FAVwepbIxOvvJnn5WUA6TFq4Q0URPhnRcHJm4rFkXgyZCzCJw2vicBS0b0M4t3Rfd98l3QuHKEWbN5pfDzqYwHweiSGFox5P-W0XI8aBOs-zU-Z8UKzWS0jYSCzn--q65gG3dAIYiQq2mX9xOKy8DtpfLTLzsbQaZ1jxoRzQ2Euf1yWXAOJBqV4KxmbsjIffoUYo3ko3Dnbby7v0FqtDBOaT5shSRqGX8zZfmRiL8XIPztpSVD8",
      },
    ],
    accepted: [
      {
        id: 3,
        property: "Azure Coastal Estate",
        address: "Malibu Coast, CA",
        price: "$7,800,000",
        type: "Final Price",
        buyer: "Alexander Volkov",
        agent: "Victoria Sterling",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAdS5Dz8ZRSvwM1of_8fdv1mbRIkj77fLZNY_iuISeOqgdK-IvRRd80i4xi1xShxmLP3t6vg_LvPyeN2xGvb_Nm57qW4_-uYQy8R11sABwzBo8Vv9ifg5tps0ip7NocNOMEDraLouu_XFwRCjJJmucjngiBlSj-pRGhpiXJ_WfyrJ7r1_LahIHzI45MGq6XjplYJgdchebzbsfyx2CjDRM7Bv0Yf5bC2Ok0bUNYEwd_zdaZJcNlsuJOOjP3foH1qdvaewkocpMziIqj",
        buyerImage:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDV8AYKHyzNsZLae8c96_UD9o5YeDRuxSWmWGVDg7DpKnEENvaiiDcFSixm8KOTT2dNnK4t_DfzcpFJqUYGcw0fZyG7rstGKw9h6qLKqfafVOzSv-S9w0bYBdlO1ieY0j4yyWlRhkeZC76AcX3MN8YzVhVoxgiWeP1Zxxy8FR6zxLEvB0JEsYNnBP5h2CnuVGOZxZ1hzY4XYMkgW2fWH41_fzu2cE5e06GJ4hVwLZfrRZEnpByx6Ps4C2mi3_AWr3xz4385kjJBhgd6",
      },
    ],
    pending: [
      {
        id: 4,
        property: "Mountain Summit Lodge",
        address: "Vail, CO",
        price: "$3,450,000",
        type: "Pending Approval",
        buyer: "Michael Chen",
        agent: "Rebecca Stone",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBqHePC_CQMnfswixcvu6Lusptr1cu5XS1crAAu4CblbjC2h5ceChbW6y-F0FkxLcGjE7cDzYICGqvjJwCLxEfXnQ3mGPPMA1HEccjk0dYqeEPRFB3YV4XBdJwAjCpSyrv7t3c4lYcwDkMMWPUbDUsoHW64mDI3dYQTiPUY3Y0UexWkYlbUhcdkAqq4JzSdAAU0xsklFZVnaQnTO_oIGIhK4PSzYbySxjN6zfrUWJ3wfR_neETvIx5sKuOtyixZl18qqiAALcrvwGv4",
        buyerImage:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDxVFg8slgeMUR3x7dQU64qaSWYSGY7KJRxH6uBUgF7ffy04215zQErzSauIINgQtfjKHXd1QSs-ytI5jWZ_I10w9rUNSinEVYsQGT7sopUTCokW92y373y7Rl1k_gkESN09Xtzh-q_OP_VtzF_ULgV7NuB7eyFe07Ze_74uOBVk95chzNC-htDkkekvrYeVcZ0eG0rE77EAGTdZwl5QQHOEiN8RXixDbWie3bR5FFZeJ01Yy2G3sjXaJZW4HD_gMqxQM3IipgC8sKe",
      },
    ],
  };

  return (
    <div className="pt-20 sm:pt-24 lg:pt-28 px-4 sm:px-6 lg:px-12 pb-12 sm:pb-20 min-h-screen overflow-x-hidden">
      <section className="mb-8 sm:mb-16 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6">
        <div>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#a9c7ff] mb-2 sm:mb-4 block">
            Azure Estates / Negotiation Desk
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-inter text-white tracking-tighter">
            Offers Management
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 sm:gap-12 mt-4 sm:mt-8">
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-bold mb-1">
                Active Volume
              </span>
              <span className="text-xl sm:text-2xl font-bold text-white">
                $42.8M
              </span>
            </div>
            <div className="hidden sm:block w-px h-6 sm:h-8 bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-bold mb-1">
                Total Active
              </span>
              <span className="text-xl sm:text-2xl font-bold text-white">
                24 Offers
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-4">
          <button className="px-4 sm:px-8 py-2 sm:py-3 bg-[#a9c7ff] text-[#003063] font-bold text-xs sm:text-sm tracking-tight hover:scale-[0.98] transition-transform flex items-center gap-2">
            <MdAdd size={16} />
            New Draft Offer
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-start">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#a9c7ff]"></div>
              <h3 className="font-inter uppercase text-xs sm:text-sm tracking-widest text-white">
                Under Review
              </h3>
            </div>
            <span className="text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded text-white/60">
              08
            </span>
          </div>

          {offers.underReview.map((offer) => (
            <div
              key={offer.id}
              className="p-4 sm:p-6 border-l border-[#a9c7ff]/30 group hover:bg-[#282a2f]/60 transition-colors rounded-lg"
              style={{
                background: "rgba(18, 42, 76, 0.4)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div className="w-16 h-10 sm:w-24 sm:h-16 bg-[#1d2025] overflow-hidden rounded-sm">
                  <img
                    alt="Property"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={offer.image}
                  />
                </div>
                <div className="text-right">
                  <p className="text-lg sm:text-2xl font-inter text-white">
                    {offer.price}
                  </p>
                  <p className="text-[10px] sm:text-[10px] text-[#a9c7ff] font-bold tracking-widest uppercase">
                    {offer.type}
                  </p>
                </div>
              </div>

              <h4 className="font-bold text-base sm:text-lg text-white mb-1">
                {offer.property}
              </h4>
              <p className="text-[10px] sm:text-xs text-white/40 mb-4 sm:mb-6 font-medium">
                {offer.address}
              </p>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#1d2025] overflow-hidden">
                    <img
                      alt="Buyer"
                      className="w-full h-full object-cover"
                      src={offer.buyerImage}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-none">
                      Buyer
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      {offer.buyer}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#a9c7ff]/20 flex items-center justify-center">
                    <MdPerson
                      className="text-[10px] sm:text-xs text-[#a9c7ff]"
                      size={10}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-none">
                      Agent
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      {offer.agent}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 flex gap-2 sm:gap-3">
                <button className="flex-1 py-1.5 sm:py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-widest transition-colors">
                  Details
                </button>
                <button className="flex-1 py-1.5 sm:py-2 bg-[#a9c7ff]/20 hover:bg-[#a9c7ff]/30 text-[#a9c7ff] font-bold text-[10px] uppercase tracking-widest transition-colors">
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white"></div>
              <h3 className="font-inter uppercase text-xs sm:text-sm tracking-widest text-white">
                Accepted
              </h3>
            </div>
            <span className="text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded text-white/60">
              12
            </span>
          </div>

          {offers.accepted.map((offer) => (
            <div
              key={offer.id}
              className="p-4 sm:p-6 border-l border-white/50 group hover:bg-[#282a2f]/60 transition-colors rounded-lg"
              style={{
                background: "rgba(18, 42, 76, 0.4)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div className="w-16 h-10 sm:w-24 sm:h-16 bg-[#1d2025] overflow-hidden rounded-sm">
                  <img
                    alt="Property"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={offer.image}
                  />
                </div>
                <div className="text-right">
                  <p className="text-lg sm:text-2xl font-inter text-white">
                    {offer.price}
                  </p>
                  <p className="text-[10px] sm:text-[10px] text-white/60 font-bold tracking-widest uppercase">
                    {offer.type}
                  </p>
                </div>
              </div>

              <h4 className="font-bold text-base sm:text-lg text-white mb-1">
                {offer.property}
              </h4>
              <p className="text-[10px] sm:text-xs text-white/40 mb-4 sm:mb-6 font-medium">
                {offer.address}
              </p>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#1d2025] overflow-hidden">
                    <img
                      alt="Buyer"
                      className="w-full h-full object-cover"
                      src={offer.buyerImage}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-none">
                      Buyer
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      {offer.buyer}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#a9c7ff]/20 flex items-center justify-center">
                    <MdPerson
                      className="text-[10px] sm:text-xs text-[#a9c7ff]"
                      size={10}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-none">
                      Agent
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      {offer.agent}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 flex gap-2 sm:gap-3">
                <button className="flex-1 py-1.5 sm:py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-widest transition-colors">
                  Details
                </button>
                <button className="flex-1 py-1.5 sm:py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-[10px] uppercase tracking-widest transition-colors">
                  View Contract
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#ffb68b]"></div>
              <h3 className="font-inter uppercase text-xs sm:text-sm tracking-widest text-white">
                Pending
              </h3>
            </div>
            <span className="text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded text-white/60">
              04
            </span>
          </div>

          {offers.pending.map((offer) => (
            <div
              key={offer.id}
              className="p-4 sm:p-6 border-l border-[#ffb68b]/30 group hover:bg-[#282a2f]/60 transition-colors rounded-lg"
              style={{
                background: "rgba(18, 42, 76, 0.4)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div className="w-16 h-10 sm:w-24 sm:h-16 bg-[#1d2025] overflow-hidden rounded-sm">
                  <img
                    alt="Property"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={offer.image}
                  />
                </div>
                <div className="text-right">
                  <p className="text-lg sm:text-2xl font-inter text-white">
                    {offer.price}
                  </p>
                  <p className="text-[10px] sm:text-[10px] text-[#ffb68b] font-bold tracking-widest uppercase">
                    {offer.type}
                  </p>
                </div>
              </div>

              <h4 className="font-bold text-base sm:text-lg text-white mb-1">
                {offer.property}
              </h4>
              <p className="text-[10px] sm:text-xs text-white/40 mb-4 sm:mb-6 font-medium">
                {offer.address}
              </p>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#1d2025] overflow-hidden">
                    <img
                      alt="Buyer"
                      className="w-full h-full object-cover"
                      src={offer.buyerImage}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-none">
                      Buyer
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      {offer.buyer}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#a9c7ff]/20 flex items-center justify-center">
                    <MdPerson
                      className="text-[10px] sm:text-xs text-[#a9c7ff]"
                      size={10}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-none">
                      Agent
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      {offer.agent}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 flex gap-2 sm:gap-3">
                <button className="flex-1 py-1.5 sm:py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-widest transition-colors">
                  Details
                </button>
                <button className="flex-1 py-1.5 sm:py-2 bg-[#ffb68b]/20 hover:bg-[#ffb68b]/30 text-[#ffb68b] font-bold text-[10px] uppercase tracking-widest transition-colors">
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
