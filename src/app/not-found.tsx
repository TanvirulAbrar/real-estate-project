import Link from "next/link";
import { MdWest, MdArrowOutward } from "react-icons/md";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_center,#041f41_0%,#00132e_100%)] flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-[#a9c7ff]/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-[#a9c7ff]/5 rounded-full"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
        <div className="mb-2">
          <span className="text-[#a9c7ff] tracking-[0.4em] uppercase text-xs font-bold">
            Error Protocol 404
          </span>
        </div>

        <h1
          className="text-[12rem] md:text-[22rem] font-inter leading-none tracking-tighter text-[#e1e2e9] select-none"
          style={{ textShadow: "0 0 40px rgba(178, 197, 255, 0.2)" }}
        >
          404
        </h1>

        <div className="space-y-6 -mt-8 md:-mt-16">
          <p className="text-2xl md:text-4xl font-light text-[#a9c7ff] max-w-2xl mx-auto italic">
            This residence doesn't exist in our portfolio.
          </p>
          <p className="text-[#c2c6d3]/80 max-w-lg mx-auto leading-relaxed">
            The architectural coordinates you provided appear to lead to a
            structural void. Our curators are unable to locate this specific
            asset within the current registry.
          </p>
        </div>

        <div className="mt-16 flex flex-col md:flex-row gap-6 items-center">
          <Link
            href="/"
            className="group relative px-10 py-5 bg-[#37393f]/40 backdrop-blur-2xl border border-white/10 rounded-full flex items-center gap-3 transition-all duration-500 hover:bg-[#a9c7ff] hover:text-[#003063] hover:scale-105 shadow-2xl"
          >
            <MdWest
              className="transition-transform group-hover:-translate-x-1"
              size={20}
            />
            <span className="font-bold uppercase tracking-widest text-sm">
              Return Home
            </span>
          </Link>

          <Link
            href="#"
            className="text-[#a9c7ff]/70 uppercase tracking-widest text-xs font-bold hover:text-white transition-colors flex items-center gap-2"
          >
            Report Discrepancy
            <MdArrowOutward size={16} />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-12 right-12 hidden lg:block opacity-40">
        <div className="flex flex-col gap-2 items-end">
          <div className="w-32 h-[1px] bg-[#a9c7ff]"></div>
          <div className="w-24 h-[1px] bg-[#a9c7ff]/50"></div>
          <span className="text-[10px] text-[#a9c7ff]/60 tracking-tighter">
            AZURE_ARCHIVE_REF: NULL_PTR
          </span>
        </div>
      </div>
    </div>
  );
}
