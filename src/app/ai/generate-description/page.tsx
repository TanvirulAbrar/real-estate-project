import {
  MdAutoAwesome,
  MdDescription,
  MdEdit,
  MdCopyAll,
  MdDownload,
  MdRefresh,
  MdSettings,
} from "react-icons/md";

export default function AINarrativeGenerator() {
  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] flex flex-col">
      <header className="fixed top-0 w-full z-50 bg-[#00132e]/60 backdrop-blur-xl shadow-[0_48px_48px_rgba(18,42,76,0.06)]">
        <div className="flex justify-between items-center px-8 py-6 max-w-full">
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
            <MdSettings
              className="text-[#a9c7ff] hover:text-white transition-colors cursor-pointer"
              size={20}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-20 px-8 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-inter tracking-tighter text-white mb-4">
              Narrative <span className="text-[#a9c7ff]">Generator</span>
            </h1>
            <p className="text-lg text-[#c2c6d3] max-w-2xl mx-auto">
              Transform property features into compelling stories that captivate
              potential buyers and elevate your listings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div
                className="p-8 rounded-2xl border border-white/5"
                style={{
                  background: "rgba(4, 31, 65, 0.4)",
                  backdropFilter: "blur(24px)",
                }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  Property Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#c2c6d3] mb-2">
                      Property Type
                    </label>
                    <select className="w-full p-3 rounded-full bg-white/5 border border-white/10 text-white focus:border-[#a9c7ff] focus:outline-none">
                      <option>Luxury Villa</option>
                      <option>Penthouse</option>
                      <option>Beach House</option>
                      <option>Mountain Retreat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#c2c6d3] mb-2">
                      Key Features
                    </label>
                    <textarea
                      className="w-full p-3 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-[#c2c6d3]/40 focus:border-[#a9c7ff] focus:outline-none resize-none"
                      rows={4}
                      placeholder="e.g., 5 bedrooms, infinity pool, ocean views, smart home system, wine cellar..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#c2c6d3] mb-2">
                      Target Audience
                    </label>
                    <select className="w-full p-3 rounded-full bg-white/5 border border-white/10 text-white focus:border-[#a9c7ff] focus:outline-none">
                      <option>Luxury Investors</option>
                      <option>Family Buyers</option>
                      <option>Young Professionals</option>
                      <option>Retirement Living</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#c2c6d3] mb-2">
                      Tone & Style
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="p-4 rounded-full bg-[#a9c7ff]/10 border border-[#a9c7ff]/20 text-[#a9c7ff] hover:bg-[#a9c7ff] hover:text-[#003063] transition-colors">
                        Elegant
                      </button>
                      <button className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                        Modern
                      </button>
                      <button className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                        Sophisticated
                      </button>
                      <button className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                        Warm
                      </button>
                    </div>
                  </div>

                  <button className="w-full bg-[#a9c7ff] text-[#003063] font-bold py-4 rounded-full hover:bg-white transition-colors flex items-center justify-center gap-2">
                    <MdAutoAwesome size={20} />
                    Generate Narrative
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div
                className="p-8 rounded-2xl border border-white/5"
                style={{
                  background: "rgba(4, 31, 65, 0.4)",
                  backdropFilter: "blur(24px)",
                }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Generated Narrative
                  </h2>
                  <div className="flex gap-2">
                    <button className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                      <MdCopyAll size={18} />
                    </button>
                    <button className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                      <MdDownload size={18} />
                    </button>
                    <button className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                      <MdRefresh size={18} />
                    </button>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Azure Coastal Paradise
                  </h3>
                  <p className="text-[#c2c6d3] leading-relaxed mb-4">
                    Step into a realm where architectural brilliance meets
                    natural splendor. This magnificent coastal villa represents
                    the pinnacle of sophisticated living, where every detail has
                    been meticulously crafted to exceed the most discerning
                    expectations.
                  </p>
                  <p className="text-[#c2c6d3] leading-relaxed mb-4">
                    The residence boasts five exquisitely appointed bedrooms,
                    each offering panoramic ocean views that serve as your daily
                    masterpiece. The infinity pool appears to merge seamlessly
                    with the horizon, creating an illusion of boundless freedom
                    and tranquility.
                  </p>
                  <p className="text-[#c2c6d3] leading-relaxed mb-4">
                    State-of-the-art smart home technology orchestrates your
                    living experience with effortless precision, while the
                    temperature-controlled wine cellar houses a curated
                    collection worthy of the finest connoisseurs. This is more
                    than a home—it's a statement of refined luxury and an
                    invitation to live life at its most extraordinary.
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-[#c2c6d3]">
                      <span className="font-medium">Word count:</span> 127
                    </div>
                    <div className="text-sm text-[#c2c6d3]">
                      <span className="font-medium">Reading time:</span> ~30
                      seconds
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="p-6 rounded-2xl border border-white/5"
                style={{
                  background: "rgba(4, 31, 65, 0.4)",
                  backdropFilter: "blur(24px)",
                }}
              >
                <h3 className="text-lg font-bold text-white mb-4">
                  Alternative Versions
                </h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-sm font-medium text-white mb-1">
                      Concise Version
                    </p>
                    <p className="text-xs text-[#c2c6d3]">
                      Shorter, punchier narrative for quick listings
                    </p>
                  </button>
                  <button className="w-full text-left p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-sm font-medium text-white mb-1">
                      Emotional Appeal
                    </p>
                    <p className="text-xs text-[#c2c6d3]">
                      Focus on lifestyle and emotional benefits
                    </p>
                  </button>
                  <button className="w-full text-left p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-sm font-medium text-white mb-1">
                      Investment Focus
                    </p>
                    <p className="text-xs text-[#c2c6d3]">
                      Highlight ROI and investment potential
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
