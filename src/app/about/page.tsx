import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Azure Estates",
  description: "Learn about Azure Estates - Premium Real Estate Platform",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#00132e] overflow-x-hidden">
      <section className="pt-28 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16 lg:mb-20 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-end">
            <div className="lg:col-span-8">
              <h6 className="text-[#a9c7ff] tracking-[0.3em] uppercase text-xs mb-4">
                Our Story
              </h6>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
                Azure <br />
                Estates.
              </h1>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <p className="text-[#c2c6d3]/60 text-sm uppercase tracking-widest">
                Redefining Luxury
                <br />
                Real Estate
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24">
            <div>
              <p className="text-[#c2c6d3] text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                Founded in 2020, Azure Estates emerged from a vision to
                transform the luxury real estate experience. We believe that
                finding a home should be as extraordinary as the properties we
                represent.
              </p>
              <p className="text-[#c2c6d3] text-sm sm:text-base leading-relaxed">
                Our platform combines cutting-edge AI technology with
                personalized service to deliver an unmatched property discovery
                experience. From penthouses in Manhattan to beachfront villas in
                Miami, we curate only the most exceptional properties.
              </p>
            </div>
            <div className="space-y-6 sm:space-y-8">
              <div className="border-l-2 border-[#a9c7ff] pl-4 sm:pl-6">
                <span className="text-3xl sm:text-4xl font-bold text-white">
                  500+
                </span>
                <p className="text-[#c2c6d3] text-xs sm:text-sm uppercase tracking-widest mt-2">
                  Premium Properties
                </p>
              </div>
              <div className="border-l-2 border-[#a9c7ff] pl-4 sm:pl-6">
                <span className="text-3xl sm:text-4xl font-bold text-white">
                  50+
                </span>
                <p className="text-[#c2c6d3] text-xs sm:text-sm uppercase tracking-widest mt-2">
                  Expert Agents
                </p>
              </div>
              <div className="border-l-2 border-[#a9c7ff] pl-4 sm:pl-6">
                <span className="text-3xl sm:text-4xl font-bold text-white">
                  98%
                </span>
                <p className="text-[#c2c6d3] text-xs sm:text-sm uppercase tracking-widest mt-2">
                  Client Satisfaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#000e25]/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                Our Mission
              </h2>
              <p className="text-[#c2c6d3] text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                To democratize access to luxury real estate through technology
                while maintaining the personal touch that high-value
                transactions demand.
              </p>
              <p className="text-[#c2c6d3] text-sm sm:text-base leading-relaxed">
                We are committed to transparency, innovation, and excellence in
                every interaction. Our AI-powered platform learns your
                preferences to deliver personalized recommendations, while our
                expert agents provide the guidance you need.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-[#191c21] p-4 sm:p-6 rounded-xl border border-[#122a4c]/50">
                <h3 className="text-[#a9c7ff] font-bold text-sm sm:text-base mb-2">
                  Innovation
                </h3>
                <p className="text-[#c2c6d3] text-xs sm:text-sm">
                  Leveraging AI to transform property discovery
                </p>
              </div>
              <div className="bg-[#191c21] p-4 sm:p-6 rounded-xl border border-[#122a4c]/50">
                <h3 className="text-[#a9c7ff] font-bold text-sm sm:text-base mb-2">
                  Excellence
                </h3>
                <p className="text-[#c2c6d3] text-xs sm:text-sm">
                  Curating only the finest properties
                </p>
              </div>
              <div className="bg-[#191c21] p-4 sm:p-6 rounded-xl border border-[#122a4c]/50">
                <h3 className="text-[#a9c7ff] font-bold text-sm sm:text-base mb-2">
                  Trust
                </h3>
                <p className="text-[#c2c6d3] text-xs sm:text-sm">
                  Building lasting client relationships
                </p>
              </div>
              <div className="bg-[#191c21] p-4 sm:p-6 rounded-xl border border-[#122a4c]/50">
                <h3 className="text-[#a9c7ff] font-bold text-sm sm:text-base mb-2">
                  Service
                </h3>
                <p className="text-[#c2c6d3] text-xs sm:text-sm">
                  Personalized support at every step
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4">
              Leadership Team
            </h2>
            <p className="text-[#c2c6d3] text-sm sm:text-base max-w-2xl mx-auto">
              Meet the experts behind Azure Estates who are transforming the
              luxury real estate industry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Alexander Chen",
                role: "CEO & Founder",
                bio: "Former Goldman Sachs executive with 15+ years in real estate investment.",
              },
              {
                name: "Sarah Mitchell",
                role: "Chief Technology Officer",
                bio: "AI specialist from MIT with expertise in machine learning applications.",
              },
              {
                name: "Marcus Rodriguez",
                role: "Head of Sales",
                bio: "Luxury real estate veteran with $2B+ in career sales volume.",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-[#191c21]/50 p-6 sm:p-8 rounded-xl border border-[#122a4c]/30 text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#a9c7ff]/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-[#a9c7ff]">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-[#a9c7ff] text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4">
                  {member.role}
                </p>
                <p className="text-[#c2c6d3] text-xs sm:text-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
