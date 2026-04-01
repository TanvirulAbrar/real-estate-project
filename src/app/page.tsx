import {
  MdSearch,
  MdArrowDownward,
  MdAccountBalance,
  MdRoomService,
  MdArchitecture,
  MdGavel,
  MdRealEstateAgent,
} from "react-icons/md";
import { FaBuilding, FaHome, FaCity, FaRegBuilding } from "react-icons/fa";
import { getFeaturedProperties } from "@/lib/actions";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";
import PropertiesSelectionSection from "@/components/PropertiesSelectionSection";

export default async function Home() {
  const featuredProperties = await getFeaturedProperties(8);
  return (
    <div className="min-h-screen bg-[#003366] text-[#e1e2e9] font-inter">
      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden">
        <header className="flex items-center justify-between px-8 py-6 z-10"></header>

        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#00132e] via-[#00132e]/20 to-transparent z-[1]"></div>
          <div
            className="w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD-HebaCXQzJO6tmsgjOLZi-8tMKJAGGZBVcnGbsh-KT-fox60Cv9L47DnoUluFJHuYiNsuSfpLObpFsJ5Plk5AFVYia9yoTQajWsgUIvkUwHqWiQPRx2CNnTm323wWRWz73d3Pw2gLtGpcFf9HoY2b_m3PvF94WqbR1vfBxfWPGahgQu1oTczB7PfqpKWIWJtkwvP8ViSshNPMZbfxg0LaQfcKbLbDhN6NFZCrGj9AVARonCoanr7yHWLkg4RPpU1nbHIN4YWx930y')",
            }}
          ></div>
        </div>

        <div className="relative z-10 px-8 pb-24 max-w-7xl mx-auto w-full">
          <h1
            style={{
              fontFamily: "Oswald, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              lineHeight: "0.9",
            }}
            className="font-inter pt-10 font-inter text-7xl md:text-[10rem] leading-[0.85] tracking-tighter text-white opacity-95"
          >
            PURE
            <br />
            SPACE.
          </h1>
          <div className="mt-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <p className="max-w-md text-xl font-light leading-relaxed text-[#c2c6d3]">
              Curating high-performance architectural marvels for those who view
              living as a fine art.
            </p>
            <div className="flex gap-4">
              <button className="w-14 h-14 rounded-full border border-[#424751] flex items-center justify-center hover:bg-[#a9c7ff] hover:text-[#001b3d] transition-all">
                <MdArrowDownward className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 -mt-12 relative z-20">
        <div
          className="max-w-5xl mx-auto glass max-[760px]:rounded-4xl rounded-full p-3 flex flex-col md:flex-row gap-2 border border-[#424751]/10 
             focus-within:ring-2 focus-within:ring-[#a9c7ff] 
             hover:ring-2 hover:ring-[#a9c7ff]"
          style={{
            background: "rgba(4, 31, 65, 0.4)",
            backdropFilter: "blur(20px)",
          }}
          tabIndex={-1}
        >
          <div className="flex-1 flex items-center px-4 gap-3 bg-[#001b3d] rounded-full h-16 transition-all">
            <MdSearch className="w-6 h-6 text-[#a9c7ff]" />
            <input
              className="bg-transparent border-none focus:ring-0 w-full text-lg placeholder:text-[#8c919d] outline-none rounded-full"
              placeholder="Search by Architect, Style or Global City..."
              type="text"
            />
          </div>

          <button
            className="bg-white text-[#003366] px-8 py-3 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full 
               hover:bg-opacity-90 active:scale-95 transition-all"
            type="button"
          >
            Discover
          </button>
        </div>
      </section>

      <section className="py-12 ">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2">
              <FaBuilding className="text-3xl" />
              <span className="text-xl font-bold font-display">Zillow</span>
            </div>

            <div className="flex items-center gap-2">
              <FaHome className="text-3xl" />
              <span className="text-xl font-bold font-display">Realtor</span>
            </div>

            <div className="flex items-center gap-2">
              <MdRealEstateAgent className="text-3xl" />
              <span className="text-xl font-bold font-display">Redfin</span>
            </div>

            <div className="flex items-center gap-2">
              <FaCity className="text-3xl" />
              <span className="text-xl font-bold font-display">Century 21</span>
            </div>

            <div className="flex items-center gap-2">
              <FaRegBuilding className="text-3xl" />
              <span className="text-xl font-bold font-display">
                Coldwell Banker
              </span>
            </div>
          </div>
        </div>
      </section>
      <PropertiesSelectionSection featuredProperties={featuredProperties} />

      <section className="bg-[#001b3d] py-32 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div
              className="aspect-square bg-cover bg-center rounded-xl"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA7zh-l_dFpxxIwtw576a22YU7YX35QO-XS6GG0JsgqwVDb7dBeja5PtaUidaMapiv60tdv0n076kD8A00ar4oszii_DN7rXZfFd-_t1wwGQtn8LJBYbVVB-tHaS04gI6DPAY941JAbDGRpUm4P5cWJxjoAi9NKrNAE5aG2qacrRnrpAwyujqj-UQi6XG3-WpuUClNX-TIq84-ZZFuDjx-oBi5HVFMFV66kSaBcVEqLytfukBD3Nwk-C9GsdOcPbsasSC7LIOuvofeZ')",
              }}
            ></div>
            <div
              className="absolute -bottom-8 -right-8 glass p-8 rounded-xl max-w-xs border border-[#424751]/10 hidden md:block"
              style={{
                background: "rgba(4, 31, 65, 0.4)",
                backdropFilter: "blur(20px)",
              }}
            >
              <p className="italic text-lg font-light leading-relaxed">
                "Architecture is the learned game, correct and magnificent, of
                forms assembled in the light."
              </p>
              <span className="block mt-4 text-xs font-bold tracking-widest text-[#a9c7ff] uppercase">
                — LE CORBUSIER
              </span>
            </div>
          </div>
          <div>
            <h2 className="font-inter font-inter text-6xl tracking-tighter mb-8 leading-none">
              THE
              <br />
              NARRATIVE.
            </h2>
            <div className="space-y-6 text-[#c2c6d3] leading-relaxed text-lg">
              <p>
                At AZUREESTATES, we don't just sell properties; we curate
                structural legends. Every residence in our portfolio is vetted
                for architectural integrity, historical significance, and
                soul-level resonance.
              </p>
              <p>
                Our methodology combines data-driven market analysis with an
                editorial eye for design that transcends trends. We serve as the
                bridge between visionary architects and the collectors who
                inhabit their works.
              </p>
            </div>
            <button className="mt-12 flex items-center gap-4 text-[#a9c7ff] font-bold group">
              <span className="uppercase tracking-widest text-sm">
                Our Philosophy
              </span>
              <span className="w-12 h-px bg-[#a9c7ff] group-hover:w-20 transition-all"></span>
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="grid text-5xl text-center max-sm:text-4xl grid-cols-2 md:grid-cols-4 gap-4">
          <div
            className="glass p-12 max-sm:p-3 content-center rounded-xl text-center border border-[#424751]/10"
            style={{
              background: "rgba(4, 31, 65, 0.4)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="font-inter font-inter  text-[#a9c7ff] mb-2">
              124
            </div>
            <div className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">
              Global Assets
            </div>
          </div>
          <div
            className="glass p-12 max-sm:p-3 content-center items-center rounded-xl text-center border border-[#424751]/10"
            style={{
              background: "rgba(4, 31, 65, 0.4)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="font-inter font-inter  text-[#a9c7ff] mb-2">
              $4.2B
            </div>
            <div className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">
              Sales Volume
            </div>
          </div>
          <div
            className="glass p-12 max-sm:p-3 content-center rounded-xl text-center border border-[#424751]/10"
            style={{
              background: "rgba(4, 31, 65, 0.4)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="font-inter font-inter text-[#a9c7ff] mb-2">18</div>
            <div className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">
              Iconic Partners
            </div>
          </div>
          <div
            className="glass p-12 max-sm:p-3 content-center rounded-xl text-center border border-[#424751]/10"
            style={{
              background: "rgba(4, 31, 65, 0.4)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="font-inter font-inter  text-[#a9c7ff] mb-2">0%</div>
            <div className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">
              Compromise
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-8 bg-[#000e25]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="font-inter font-inter text-5xl tracking-tighter mb-4">
              GLOBAL NETWORK
            </h2>
            <p className="text-[#c2c6d3] max-w-xl">
              Curated presence in the world's most architectural significant
              hubs.
            </p>
          </div>
          <div
            className="relative w-full aspect-[21/9] rounded-xl overflow-hidden glass border border-[#424751]/10"
            style={{
              background: "rgba(4, 31, 65, 0.4)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div
              className="absolute inset-0 opacity-20 bg-cover bg-center grayscale invert"
              style={{
                backgroundImage: "url('https://placeholder.pics/svg/300')",
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-[#a9c7ff] rounded-full animate-pulse"></div>
                <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-[#a9c7ff] rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/2 right-1/4 w-3 h-3 bg-[#a9c7ff] rounded-full animate-pulse"></div>
                <div className="absolute top-1/4 left-1/2 w-3 h-3 bg-[#a9c7ff] rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="absolute bottom-8 left-8 flex gap-2">
              <span
                className="px-4 py-2 glass rounded-full text-xs font-bold uppercase tracking-widest border border-[#424751]/20"
                style={{
                  background: "rgba(4, 31, 65, 0.4)",
                  backdropFilter: "blur(20px)",
                }}
              >
                London
              </span>
              <span
                className="px-4 py-2 glass rounded-full text-xs font-bold uppercase tracking-widest border border-[#424751]/20"
                style={{
                  background: "rgba(4, 31, 65, 0.4)",
                  backdropFilter: "blur(20px)",
                }}
              >
                Tokyo
              </span>
              <span
                className="px-4 py-2 glass rounded-full text-xs font-bold uppercase tracking-widest border border-[#424751]/20"
                style={{
                  background: "rgba(4, 31, 65, 0.4)",
                  backdropFilter: "blur(20px)",
                }}
              >
                New York
              </span>
              <span
                className="px-4 py-2 glass rounded-full text-xs font-bold uppercase tracking-widest border border-[#424751]/20"
                style={{
                  background: "rgba(4, 31, 65, 0.4)",
                  backdropFilter: "blur(20px)",
                }}
              >
                Zurich
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <h2 className="font-inter font-inter text-5xl tracking-tighter">
            JOURNAL
          </h2>
          <a
            className="text-sm font-bold tracking-widest text-[#a9c7ff] uppercase border-b border-[#a9c7ff] pb-1"
            href="#"
          >
            Read All
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <article className="group cursor-pointer">
            <div className="aspect-video rounded-xl overflow-hidden mb-8">
              <div
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-1000"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCp1-2ml9AkukQqTqOZH7kcF_muu84hHk54xb0roE6PnK9nvYCh_-9St7Acgh2BCyyAAA1tDdmjIAeXD3fkJX1fbZhUHRtLM9q0Pv2cOznFN8Ffs5r2L949I_dj1J12ZMPWes-uDJDf9Otqv-BrqHH9hQIdgKW-7MSLWoK_Cnz3YDFXXNd-cUcgfng0rPvco3Sb7C6nbTiF_H9-qHhMflA0Gb7JX7IjVDAuyzopMY3fB01bPvpfwe985Nn2IRruUOoewzsEWiQpWNWV')",
                }}
              ></div>
            </div>
            <span className="text-[#c2c6d3] text-xs font-bold tracking-widest uppercase mb-4 block">
              Design Theory • 12 Min Read
            </span>
            <h3 className="font-inter text-3xl font-bold mb-4 group-hover:text-[#a9c7ff] transition-colors">
              The Resurgence of Monochromatic Minimalism
            </h3>
            <p className="text-[#c2c6d3] line-clamp-2">
              Exploring why architects are returning to a singular color palette
              to emphasize form, texture, and the play of light over decorative
              noise.
            </p>
          </article>
          <article className="group cursor-pointer">
            <div className="aspect-video rounded-xl overflow-hidden mb-8">
              <div
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-1000"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA_gabxBsnhvtJLXl4X2BUab_a98fRhC8ft1CjQjOGIGgeF382-99_7KIE-W4-cHnCbhjFAkxVNGRUo7gbRMAYd5h_XMGnnXymH-Ctc2P4yChkd8VbkxQezIA3IfarGqwSTyNAkZOddjoywSKH5p7hs9ZOdRLNeYsKvbqWzVO1r9UG2hHdwKzc_oly3DJhYzD-i1EMAaoSJcl3eCeDrI2HGzL5n7WMIhj_XVpte403WPpjaymmurJoWKww_vy6Z4HAOM_W4BM4gNi39')",
                }}
              ></div>
            </div>
            <span className="text-[#c2c6d3] text-xs font-bold tracking-widest uppercase mb-4 block">
              Market Report • 08 Min Read
            </span>
            <h3 className="font-inter text-3xl font-bold mb-4 group-hover:text-[#a9c7ff] transition-colors">
              Sustainable Luxury: The New Global Standard
            </h3>
            <p className="text-[#c2c6d3] line-clamp-2">
              How the world's elite are prioritizing net-zero performance
              without sacrificing the architectural grandeur of their primary
              residences.
            </p>
          </article>
        </div>
      </section>

      <section className="py-32 px-8 bg-[#001b3d]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-24">
          <div className="md:w-1/3">
            <h2 className="font-inter font-inter text-5xl tracking-tighter mb-8 leading-none">
              THE
              <br />
              SERVICES.
            </h2>
            <p className="text-[#c2c6d3] mb-8">
              Comprehensive stewardship for the architectural enthusiast, from
              acquisition to ongoing advisory.
            </p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-px bg-[#424751]/20 border border-[#424751]/20 rounded-xl overflow-hidden">
            <div className="bg-[#001b3d] p-10 hover:bg-[#041f41] transition-colors">
              <MdAccountBalance className="text-[#a9c7ff] mb-6 text-3xl" />
              <h4 className="font-inter text-xl font-bold mb-4">
                Portfolio Advisory
              </h4>
              <p className="text-sm text-[#c2c6d3] leading-relaxed">
                Strategic guidance on building a collection of architecturally
                significant assets across multiple global markets.
              </p>
            </div>
            <div className="bg-[#001b3d] p-10 hover:bg-[#041f41] transition-colors">
              <MdRoomService className="text-[#a9c7ff] mb-6 text-3xl" />
              <h4 className="font-inter text-xl font-bold mb-4">
                Asset Management
              </h4>
              <p className="text-sm text-[#c2c6d3] leading-relaxed">
                Concierge-level maintenance for unique structures, ensuring the
                preservation of specialized materials and systems.
              </p>
            </div>
            <div className="bg-[#001b3d] p-10 hover:bg-[#041f41] transition-colors">
              <MdArchitecture className="text-[#a9c7ff] mb-6 text-3xl" />
              <h4 className="font-inter text-xl font-bold mb-4">
                Architectural Sourcing
              </h4>
              <p className="text-sm text-[#c2c6d3] leading-relaxed">
                Direct access to off-market listings and future developments
                from the world's premier architectural firms.
              </p>
            </div>
            <div className="bg-[#001b3d] p-10 hover:bg-[#041f41] transition-colors">
              <MdGavel className="text-[#a9c7ff] mb-6 text-3xl" />
              <h4 className="font-inter text-xl font-bold mb-4">
                Transaction Stealth
              </h4>
              <p className="text-sm text-[#c2c6d3] leading-relaxed">
                Private and anonymous acquisition services for high-profile
                clients requiring absolute confidentiality.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-8 border-b border-[#424751]/10">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40 mb-12 text-center">
            In collaboration with the masters of form
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60">
            <span className="font-inter font-inter text-2xl tracking-tighter hover:opacity-100 transition-opacity cursor-default">
              FOSTER + PARTNERS
            </span>
            <span className="font-inter font-inter text-2xl tracking-tighter hover:opacity-100 transition-opacity cursor-default">
              BIG
            </span>
            <span className="font-inter font-inter text-2xl tracking-tighter hover:opacity-100 transition-opacity cursor-default">
              ZAHA HADID
            </span>
            <span className="font-inter font-inter text-2xl tracking-tighter hover:opacity-100 transition-opacity cursor-default">
              SANAA
            </span>
            <span className="font-inter font-inter text-2xl tracking-tighter hover:opacity-100 transition-opacity cursor-default">
              HERZOG & DE MEURON
            </span>
          </div>
        </div>
      </section>

      <section className="py-32 px-8">
        <ContactForm />
      </section>
    </div>
  );
}
