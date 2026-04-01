import {
  MdAutoAwesome,
  MdSearch,
  MdFilterList,
  MdStar,
  MdLocationOn,
  MdBed,
  MdBathtub,
  MdSquareFoot,
  MdTrendingUp,
  MdFavorite,
  MdCompare,
  MdCalendarToday,
} from "react-icons/md";

export default function AIPersonalizedRecommendations() {
  const recommendations = [
    {
      id: 1,
      title: "Azure Sky Villa",
      location: "Malibu, CA",
      price: "$4,200,000",
      matchScore: 95,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBoT6ZEQ688h_k06mD7K_LsvoegZ9k-k_7yr25YlGJNax0KzU_Krqksd6OHhoTZbQNhZWFnJT2FBVeOxgZKRCE0K4n4NjP-2hmT8Gu6FiclpbT5VDtkO0Rfhr20UeKvf9eIZbLLX2ONycNlfH2XKiVRq5wCp2QwOMpg1UL1Kcn-AGRFZPc5G7O8wV9BrKKQd7mDctUTRtrYee9eubAgsBcF4ouGn3CT7F7aVe5fgSYMaKbYi1vJZJ-ye_Azt1sluc3CH5qzca6d9wAi",
      bedrooms: 5,
      bathrooms: 4,
      sqft: "4,200",
      features: ["Ocean View", "Infinity Pool", "Smart Home", "Wine Cellar"],
      aiInsight:
        "This property matches your preference for coastal living and entertainment spaces. The infinity pool and ocean views align perfectly with your lifestyle requirements.",
    },
    {
      id: 2,
      title: "The Obsidian Estate",
      location: "Aspen, CO",
      price: "$8,750,000",
      matchScore: 88,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCrU6es145ENZZpmEKM6zZD22fxptXYTd7Naujig4irKyhvjS3nxQyXrLbE1fAHE-4biu2mK3AU-Rmfoc6qgHwzk6UiA13rRQeDVotXue26bWS2aZIoTG8KwhKpO6T_h2SDt69SsfMHQkk85BLrYdXby72PC92eB0aa0CclnEsb-289Ek9ewh7cFQm88-_Rt1Tjq2uhgCm0XU19vIN53IExb_su_CQutYs32BFDGCLlrU1Z5s2HcWj7S4bWORCcjfH0kPXHU-w5p2eW",
      bedrooms: 7,
      bathrooms: 6,
      sqft: "6,800",
      features: ["Mountain View", "Ski Access", "Spa", "Home Theater"],
      aiInsight:
        "Based on your interest in luxury amenities, this estate offers exceptional value with its private spa and home theater. The ski access is perfect for winter enthusiasts.",
    },
    {
      id: 3,
      title: "Urban Penthouse",
      location: "New York, NY",
      price: "$5,450,000",
      matchScore: 92,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBqHePC_CQMnfswixcvu6Lusptr1cu5XS1crAAu4CblbjC2h5ceChbW6y-F0FkxLcGjE7cDzYICGqvjJwCLxEfXnQ3mGPPMA1HEccjk0dYqeEPRFB3YV4XBdJwAjCpSyrv7t3c4lYcwDkMMWPUbDUsoHW64mDI3dYQTiPUY3Y0UexWkYlbUhcdkAqq4JzSdAAU0xsklFZVnaQnTO_oIGIhK4PSzYbySxjN6zfrUWJ3wfR_neETvIx5sKuOtyixZl18qqiAALcrvwGv4",
      bedrooms: 3,
      bathrooms: 2,
      sqft: "2,800",
      features: ["City View", "Rooftop Terrace", "Gym", "Concierge"],
      aiInsight:
        "This penthouse perfectly matches your urban lifestyle preferences. The rooftop terrace and concierge services provide the luxury amenities you value most.",
    },
    {
      id: 4,
      title: "Coastal Paradise",
      location: "Miami Beach, FL",
      price: "$3,200,000",
      matchScore: 85,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAdS5Dz8ZRSvwM1of_8fdv1mbRIkj77fLZNY_iuISeOqgdK-IvRRd80i4xi1xShxmLP3t6vg_LvPyeN2xGvb_Nm57qW4_-uYQy8R11sABwzBo8Vv9ifg5tps0ip7NocNOMEDraLouu_XFwRCjJJmucjngiBlSj-pRGhpiXJ_WfyrJ7r1_LahIHzI45MGq6XjplYJgdchebzbsfyx2CjDRM7Bv0Yf5bC2Ok0bUNYEwd_zdaZJcNlsuJOOjP3foH1qdvaewkocpMziIqj",
      bedrooms: 4,
      bathrooms: 3,
      sqft: "3,100",
      features: [
        "Beach Access",
        "Private Beach",
        "Boat Dock",
        "Tropical Garden",
      ],
      aiInsight:
        "With your preference for waterfront properties, this home offers direct beach access and a private boat dock - ideal for your coastal lifestyle.",
    },
  ];

  const getMatchColor = (score: number) => {
    if (score >= 90)
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (score >= 80)
      return "text-[#a9c7ff] bg-[#a9c7ff]/10 border-[#a9c7ff]/20";
    return "text-amber-400 bg-amber-400/10 border-amber-400/20";
  };

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9]">
      <header className="fixed top-0 w-full z-50 bg-[#00132e]/60 backdrop-blur-xl shadow-[0_48px_48px_rgba(18,42,76,0.06)]">
        <div className="flex justify-between items-center px-8 py-6">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-inter tracking-tighter text-[#a9c7ff] uppercase">
              LUXE.AI
            </span>
            <nav className="hidden md:flex gap-8">
              <a
                className="text-[#a9c7ff] font-bold tracking-tighter uppercase text-sm hover:text-white transition-colors duration-300"
                href="#"
              >
                Curated
              </a>
              <a
                className="text-[#a9c7ff]/50 tracking-tighter uppercase text-sm hover:text-white transition-colors duration-300"
                href="#"
              >
                Discovery
              </a>
              <a
                className="text-[#a9c7ff] font-bold tracking-tighter uppercase text-sm hover:text-white transition-colors duration-300"
                href="#"
              >
                AI Studio
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-[#a9c7ff] hover:text-white transition-colors">
              <MdAutoAwesome size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#a9c7ff] rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-8 md:px-12">
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-inter text-white tracking-tighter mb-4">
            AI <span className="text-[#a9c7ff]">Recommendations</span>
          </h1>
          <p className="text-xl text-[#c2c6d3] max-w-2xl mx-auto leading-relaxed">
            Personalized property recommendations based on your preferences,
            search history, and lifestyle analysis
          </p>
        </section>

        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MdSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  size={20}
                />
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-3 text-white placeholder:text-white/30 focus:border-[#a9c7ff] focus:outline-none"
                  placeholder="Search recommendations..."
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-3 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
                <MdFilterList size={16} />
                Filters
              </button>
              <button className="px-4 py-3 bg-[#a9c7ff] text-[#003063] rounded-full hover:bg-white transition-colors flex items-center gap-2">
                <MdTrendingUp size={16} />
                Refresh AI
              </button>
            </div>
          </div>
        </section>

        <section
          className="mb-8 p-6 rounded-2xl border border-white/5"
          style={{
            background: "rgba(18, 42, 76, 0.4)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#a9c7ff]/20 rounded-full flex items-center justify-center">
              <MdAutoAwesome className="text-[#a9c7ff]" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                AI Analysis Complete
              </h3>
              <p className="text-[#c2c6d3] text-sm">
                Based on your profile and 127 similar properties
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-[#c2c6d3] mb-1">Primary Preference</p>
              <p className="text-white font-medium">
                Coastal Living with Entertainment Spaces
              </p>
            </div>
            <div>
              <p className="text-sm text-[#c2c6d3] mb-1">Budget Range</p>
              <p className="text-white font-medium">$3M - $9M</p>
            </div>
            <div>
              <p className="text-sm text-[#c2c6d3] mb-1">Match Accuracy</p>
              <p className="text-emerald-400 font-medium">94% Confidence</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {recommendations.map((property) => (
            <div
              key={property.id}
              className="rounded-2xl border border-white/5 overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300"
              style={{
                background: "rgba(18, 42, 76, 0.4)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${getMatchColor(property.matchScore)}`}
                  >
                    <MdStar size={12} />
                    {property.matchScore}% Match
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-[#c2c6d3]">
                      <MdLocationOn size={14} />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#a9c7ff]">
                      {property.price}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MdBed size={16} className="text-white/40" />
                    <span className="text-white">{property.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdBathtub size={16} className="text-white/40" />
                    <span className="text-white">
                      {property.bathrooms} Baths
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdSquareFoot size={16} className="text-white/40" />
                    <span className="text-white">{property.sqft} sqft</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {property.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#a9c7ff]/10 border border-[#a9c7ff]/20 text-[#a9c7ff] text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="mb-4 p-4 bg-[#a9c7ff]/5 border border-[#a9c7ff]/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <MdAutoAwesome className="text-[#a9c7ff] mt-1" size={16} />
                    <p className="text-sm text-[#c2c6d3] leading-relaxed">
                      {property.aiInsight}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-[#a9c7ff] text-[#003063] font-bold text-sm rounded-full hover:bg-white transition-colors flex items-center justify-center gap-2">
                    View Details
                  </button>
                  <button className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                    <MdFavorite size={16} />
                  </button>
                  <button className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                    <MdCompare size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold text-sm rounded-full hover:bg-white/10 transition-colors">
            Load More Recommendations
          </button>
        </div>
      </main>
    </div>
  );
}
