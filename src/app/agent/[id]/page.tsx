import {
  MdMenu,
  MdCalendarToday,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdStar,
  MdVerified,
  MdTrendingUp,
  MdDomain,
  MdPerson,
  MdWorkspacePremium,
  MdLanguage,
  MdCheckCircle,
} from "react-icons/md";

export default function AgentProfile() {
  const agent = {
    name: "JULIAN AZURE",
    title: "Principal Curator",
    experience: "12+",
    assetsManaged: "1.2B",
    privateClosings: "142",
    email: "julian.azure@estates.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY | Los Angeles, CA | Miami, FL",
    bio: "Redefining the architecture of luxury living through a decade of precision-led acquisition and bespoke estate management in global metropolitan hubs.",
    languages: ["English", "Spanish", "Mandarin", "French"],
    specialties: [
      "Luxury Villas",
      "Penthouses",
      "Historic Estates",
      "Waterfront Properties",
    ],
    achievements: [
      "Top 1% Luxury Agent Worldwide",
      "Billion Dollar Sales Club",
      "President's Circle Elite",
      "International Property Award",
    ],
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDyBdPq_rH2d7gl13UTGT_Bf53DbnpgTirqpc1VmDG4NPivDd_qVaUKAQhdk5qmHX1cb-bWT3m1hnZK-c_D6NaIlWCRCsbv2Gp7vVBX1ddlbn82hPyjyFIibfxyPI8tEsIZqNZCIWf2q8MWyY0iU96kEjnIfgm3yqYMJP3ngW7zoH7iKMkea-TCnQpovD9kxBpy7OUgKcQrJYuAHseshI-dvDaYu1F_XAuwQrdP96N5uQEGztA5wmC-03nsXaIqP4c2rVF9Vtx0swbt",
  };

  const featuredProperties = [
    {
      id: 1,
      title: "Azure Sky Villa",
      location: "Malibu, CA",
      price: "$4,200,000",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBoT6ZEQ688h_k06mD7K_LsvoegZ9k-k_7yr25YlGJNax0KzU_Krqksd6OHhoTZbQNhZWFnJT2FBVeOxgZKRCE0K4n4NjP-2hmT8Gu6FiclpbT5VDtkO0Rfhr20UeKvf9eIZbLLX2ONycNlfH2XKiVRq5wCp2QwOMpg1UL1Kcn-AGRFZPc5G7O8wV9BrKKQd7mDctUTRtrYee9eubAgsBcF4ouGn3CT7F7aVe5fgSYMaKbYi1vJZJ-ye_Azt1sluc3CH5qzca6d9wAi",
    },
    {
      id: 2,
      title: "The Obsidian Estate",
      location: "Aspen, CO",
      price: "$8,750,000",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCrU6es145ENZZpmEKM6zZD22fxptXYTd7Naujig4irKyhvjS3nxQyXrLbE1fAHE-4biu2mK3AU-Rmfoc6qgHwzk6UiA13rRQeDVotXue26bWS2aZIoTG8KwhKpO6T_h2SDt69SsfMHQkk85BLrYdXby72PC92eB0aa0CclnEsb-289Ek9ewh7cFQm88-_Rt1Tjq2uhgCm0XU19vIN53IExb_su_CQutYs32BFDGCLlrU1Z5s2HcWj7S4bWORCcjfH0kPXHU-w5p2eW",
    },
    {
      id: 3,
      title: "Urban Penthouse",
      location: "New York, NY",
      price: "$5,450,000",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBqHePC_CQMnfswixcvu6Lusptr1cu5XS1crAAu4CblbjC2h5ceChbW6y-F0FkxLcGjE7cDzYICGqvjJwCLxEfXnQ3mGPPMA1HEccjk0dYqeEPRFB3YV4XBdJwAjCpSyrv7t3c4lYcwDkMMWPUbDUsoHW64mDI3dYQTiPUY3Y0UexWkYlbUhcdkAqq4JzSdAAU0xsklFZVnaQnTO_oIGIhK4PSzYbySxjN6zfrUWJ3wfR_neETvIx5sKuOtyixZl18qqiAALcrvwGv4",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Alexander Volkov",
      role: "CEO, Tech Ventures",
      content:
        "Julian's expertise in the luxury market is unparalleled. He found us our dream home in just 48 hours.",
      rating: 5,
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Investment Banker",
      content:
        "Professional, knowledgeable, and incredibly responsive. Made our international property purchase seamless.",
      rating: 5,
    },
    {
      id: 3,
      name: "Marcus Thorne",
      role: "Real Estate Developer",
      content:
        "Julian has an eye for detail that others miss. His market insights are invaluable.",
      rating: 5,
    },
  ];

  return (
    <div className="pt-32 pb-24">
      <nav className="fixed top-0 w-full z-50 bg-[#00132e]/60 backdrop-blur-xl flex justify-between items-center px-12 py-6 w-full shadow-[0_48px_48px_-12px_rgba(18,42,76,0.06)]">
        <div className="text-2xl font-bold tracking-tighter text-[#a9c7ff] uppercase">
          ESTATE_CURATOR
        </div>
        <div className="hidden md:flex gap-10 items-center">
          <a
            className="tracking-tighter uppercase text-[#a9c7ff]/60 hover:text-white transition-colors duration-300"
            href="#"
          >
            Properties
          </a>
          <a
            className="tracking-tighter uppercase text-[#a9c7ff] border-b-2 border-[#a9c7ff] pb-1 hover:text-white transition-colors duration-300"
            href="#"
          >
            Agents
          </a>
          <a
            className="tracking-tighter uppercase text-[#a9c7ff]/60 hover:text-white transition-colors duration-300"
            href="#"
          >
            Journal
          </a>
          <a
            className="tracking-tighter uppercase text-[#a9c7ff]/60 hover:text-white transition-colors duration-300"
            href="#"
          >
            Market
          </a>
          <a
            className="tracking-tighter uppercase text-[#a9c7ff]/60 hover:text-white transition-colors duration-300"
            href="#"
          >
            About
          </a>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-[#a9c7ff] scale-95 transition-transform duration-200 hover:text-white">
            <MdMenu size={24} />
          </button>
          <div className="w-10 h-10 rounded-full bg-[#282a2f] overflow-hidden border border-[#a9c7ff]/20">
            <img
              alt="User profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUDq50quu2WI_M6_xCw60BuR1NQo1Ak2QiBInEvvaMMh8kR5gx23g_E6cMXFn-R92JYMM9BlUYvQyX7AqxBinVtkfn-NPCTIj0dfzu9qzVHZryiLYNzNXOXbkpN1zksv5qQURXZezaPNZKa1G5D-Bigymokn5bKaZ5oWyGDKPdQlLh2QOGK7veUG9B0U_VY3C7L-kR_mzeJI6t3HglDl6blk4CYnpXvEhER7fh7caeX788rqiXDrrqCb1x1HynpKAvBn1r0Fuhklma"
            />
          </div>
        </div>
      </nav>

      <section className="px-12 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div
              className="rounded-[32px] overflow-hidden p-4 border border-white/5 aspect-[4/5] relative z-10"
              style={{
                background: "rgba(18, 42, 76, 0.4)",
                backdropFilter: "blur(24px)",
              }}
            >
              <img
                alt="Agent headshot"
                className="w-full h-full object-cover rounded-[24px] grayscale hover:grayscale-0 transition-all duration-700"
                src={agent.avatar}
              />
            </div>

            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#a9c7ff]/10 blur-[80px] -z-10"></div>
          </div>

          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="flex items-center gap-4 mb-6">
              <span className="h-[1px] w-12 bg-[#a9c7ff]"></span>
              <span className="text-[#a9c7ff] text-xs uppercase tracking-[0.3em]">
                {agent.title}
              </span>
            </div>
            <h1 className="text-7xl md:text-8xl font-inter text-white mb-4 uppercase leading-none tracking-tighter">
              {agent.name.split(" ")[0]}
              <br />
              {agent.name.split(" ")[1]}
            </h1>
            <p className="text-xl text-[#c2c6d3] max-w-xl mb-12 leading-relaxed">
              {agent.bio}
            </p>

            <div className="flex flex-wrap gap-12 mb-12">
              <div>
                <p className="text-[#a9c7ff] text-4xl font-bold tracking-tighter">
                  {agent.experience}
                </p>
                <p className="text-[#c2c6d3] text-[10px] uppercase tracking-widest mt-1">
                  Years Experience
                </p>
              </div>
              <div>
                <p className="text-[#a9c7ff] text-4xl font-bold tracking-tighter">
                  ${agent.assetsManaged}
                </p>
                <p className="text-[#c2c6d3] text-[10px] uppercase tracking-widest mt-1">
                  Total Assets Managed
                </p>
              </div>
              <div>
                <p className="text-[#a9c7ff] text-4xl font-bold tracking-tighter">
                  {agent.privateClosings}
                </p>
                <p className="text-[#c2c6d3] text-[10px] uppercase tracking-widest mt-1">
                  Private Closings
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button className="bg-[#a9c7ff] text-[#003063] px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-white transition-all flex items-center justify-center gap-3 rounded-full">
                Book Private Viewing
                <MdCalendarToday size={16} />
              </button>
              <button className="border border-white/20 text-white px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3 rounded-full">
                <MdEmail size={16} />
                Contact
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-12 mb-32">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#a9c7ff]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdEmail className="text-[#a9c7ff]" size={24} />
              </div>
              <h3 className="text-white font-bold mb-2">Email</h3>
              <p className="text-[#c2c6d3]">{agent.email}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#a9c7ff]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdPhone className="text-[#a9c7ff]" size={24} />
              </div>
              <h3 className="text-white font-bold mb-2">Phone</h3>
              <p className="text-[#c2c6d3]">{agent.phone}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#a9c7ff]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdLocationOn className="text-[#a9c7ff]" size={24} />
              </div>
              <h3 className="text-white font-bold mb-2">Locations</h3>
              <p className="text-[#c2c6d3]">{agent.location}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-12 mb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-inter text-white mb-8">Expertise</h2>
              <div className="space-y-4">
                {agent.specialties.map((specialty, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <MdCheckCircle className="text-[#a9c7ff]" size={20} />
                    <span className="text-white font-medium">{specialty}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-inter text-white mb-8">Languages</h2>
              <div className="flex flex-wrap gap-3">
                {agent.languages.map((language, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-[#a9c7ff]/10 border border-[#a9c7ff]/20 rounded-full"
                  >
                    <MdLanguage className="text-[#a9c7ff]" size={16} />
                    <span className="text-[#a9c7ff] text-sm font-medium">
                      {language}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-12 mb-32">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-inter text-white mb-8 text-center">
            Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agent.achievements.map((achievement, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-white/5 text-center"
                style={{
                  background: "rgba(18, 42, 76, 0.4)",
                  backdropFilter: "blur(24px)",
                }}
              >
                <MdWorkspacePremium className="text-[#a9c7ff] text-3xl mx-auto mb-4" />
                <p className="text-white font-medium">{achievement}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-12 mb-32">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-inter text-white mb-12 text-center">
            Featured Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <div key={property.id} className="group">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {property.title}
                </h3>
                <p className="text-[#c2c6d3] mb-2">{property.location}</p>
                <p className="text-2xl font-bold text-[#a9c7ff]">
                  {property.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-12 mb-32">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-inter text-white mb-12 text-center">
            Client Testimonials
          </h2>
          <div className="space-y-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="p-8 rounded-2xl border border-white/5"
                style={{
                  background: "rgba(18, 42, 76, 0.4)",
                  backdropFilter: "blur(24px)",
                }}
              >
                <div className="flex gap-2 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <MdStar key={i} className="text-[#ffb68b]" size={20} />
                  ))}
                </div>
                <p className="text-white text-lg mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="text-white font-bold">{testimonial.name}</p>
                  <p className="text-[#c2c6d3] text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-inter text-white mb-6">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-[#c2c6d3] text-xl mb-8">
            Let Julian guide you through the luxury real estate journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#a9c7ff] text-[#003063] px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-white transition-all flex items-center justify-center gap-3 rounded-full">
              <MdCalendarToday size={16} />
              Schedule Consultation
            </button>
            <button className="border border-white/20 text-white px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3 rounded-full">
              <MdPhone size={16} />
              Call Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
