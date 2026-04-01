import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Azure Estates",
  description: "Terms of Service for Azure Estates - Real Estate Platform",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#00132e] pt-28 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 sm:mb-16 lg:mb-20 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-end">
          <div className="lg:col-span-8">
            <h6 className="text-[#a9c7ff] tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-4">
              Legal Framework
            </h6>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
              Terms of <br />
              Service.
            </h1>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <p className="text-[#c2c6d3]/60 text-xs sm:text-sm uppercase tracking-widest">
              Last Updated
              <br />
              October 24, 2024
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <aside className="lg:col-span-3 hidden lg:block sticky top-32 h-fit">
            <div className="space-y-6">
              <div className="h-px bg-[#a9c7ff] w-full opacity-30"></div>
              <nav className="flex flex-col gap-4">
                <Link
                  href="#acceptance"
                  className="text-[#a9c7ff] font-bold text-sm tracking-wide transition-all hover:translate-x-1"
                >
                  01. Acceptance
                </Link>
                <Link
                  href="#services"
                  className="text-[#c2c6d3] hover:text-[#a9c7ff] text-sm tracking-wide transition-all hover:translate-x-1"
                >
                  02. Our Services
                </Link>
                <Link
                  href="#accounts"
                  className="text-[#c2c6d3] hover:text-[#a9c7ff] text-sm tracking-wide transition-all hover:translate-x-1"
                >
                  03. User Accounts
                </Link>
                <Link
                  href="#conduct"
                  className="text-[#c2c6d3] hover:text-[#a9c7ff] text-sm tracking-wide transition-all hover:translate-x-1"
                >
                  04. User Conduct
                </Link>
                <Link
                  href="#intellectual"
                  className="text-[#c2c6d3] hover:text-[#a9c7ff] text-sm tracking-wide transition-all hover:translate-x-1"
                >
                  05. Intellectual Property
                </Link>
                <Link
                  href="#liability"
                  className="text-[#c2c6d3] hover:text-[#a9c7ff] text-sm tracking-wide transition-all hover:translate-x-1"
                >
                  06. Limitation of Liability
                </Link>
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-9 bg-[#191c21]/40 backdrop-blur-2xl p-6 sm:p-8 lg:p-12 xl:p-16 rounded-xl border border-[#122a4c]/50 shadow-2xl">
            <div className="space-y-8 sm:space-y-12">
              <section id="acceptance">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-4">
                  <span className="text-[#a9c7ff] text-xs font-mono border border-[#a9c7ff] px-2 py-1">
                    01
                  </span>
                  Acceptance of Terms
                </h2>
                <p className="text-[#c2c6d3] leading-relaxed text-base sm:text-lg">
                  By accessing or using Azure Estates services, you agree to be
                  bound by these Terms of Service. If you disagree with any part
                  of the terms, you may not access our services. These terms
                  apply to all users, including visitors, registered users,
                  agents, and administrators.
                </p>
              </section>

              <div className="h-px bg-[#122a4c]/20 w-full"></div>

              <section id="services">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-4">
                  <span className="text-[#a9c7ff] text-xs font-mono border border-[#a9c7ff] px-2 py-1">
                    02
                  </span>
                  Our Services
                </h2>
                <p className="text-[#c2c6d3] leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                  Azure Estates provides a platform for real estate discovery,
                  listing management, and property transactions. Our services
                  include:
                </p>
                <ul className="space-y-3 sm:space-y-4 list-none p-0">
                  <li className="flex items-start gap-3">
                    <span className="text-[#a9c7ff] mt-1 text-base sm:text-lg">
                      •
                    </span>
                    <span className="text-[#c2c6d3] text-xs sm:text-sm">
                      Property search and discovery with AI-powered
                      recommendations.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#a9c7ff] mt-1 text-base sm:text-lg">
                      •
                    </span>
                    <span className="text-[#c2c6d3] text-xs sm:text-sm">
                      Listing management tools for agents and property owners.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#a9c7ff] mt-1 text-base sm:text-lg">
                      •
                    </span>
                    <span className="text-[#c2c6d3] text-xs sm:text-sm">
                      Offer submission and negotiation systems.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#a9c7ff] mt-1 text-base sm:text-lg">
                      •
                    </span>
                    <span className="text-[#c2c6d3] text-xs sm:text-sm">
                      Communication channels between buyers, sellers, and
                      agents.
                    </span>
                  </li>
                </ul>
              </section>

              <div className="h-px bg-[#122a4c]/20 w-full"></div>

              <section id="accounts">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-4">
                  <span className="text-[#a9c7ff] text-xs font-mono border border-[#a9c7ff] px-2 py-1">
                    03
                  </span>
                  User Accounts
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-[#c2c6d3] leading-relaxed text-sm sm:text-base">
                    When you create an account with us, you must provide
                    accurate, complete, and current information. Failure to do
                    so constitutes a breach of the terms, which may result in
                    immediate termination of your account.
                  </p>
                  <div className="bg-[#191c21] p-4 sm:p-6 border-l-2 border-[#a9c7ff]">
                    <h4 className="text-[#a9c7ff] text-xs tracking-widest uppercase mb-2">
                      Account Security
                    </h4>
                    <p className="text-xs sm:text-sm text-[#c2c6d3]">
                      You are responsible for safeguarding your password and for
                      any activities or actions under your account. Notify us
                      immediately of any unauthorized access or security breach.
                    </p>
                  </div>
                </div>
              </section>

              <div className="h-px bg-[#122a4c]/20 w-full"></div>

              <section id="conduct">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-4">
                  <span className="text-[#a9c7ff] text-xs font-mono border border-[#a9c7ff] px-2 py-1">
                    04
                  </span>
                  User Conduct
                </h2>
                <p className="text-[#c2c6d3] leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                  You agree not to use our services to:
                </p>
                <ul className="space-y-3 sm:space-y-4 list-none p-0">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1 text-base sm:text-lg">
                      ✕
                    </span>
                    <span className="text-[#c2c6d3] text-xs sm:text-sm">
                      Post false, misleading, or fraudulent property listings.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1 text-base sm:text-lg">
                      ✕
                    </span>
                    <span className="text-[#c2c6d3] text-xs sm:text-sm">
                      Harass, abuse, or harm other users or our staff.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1 text-base sm:text-lg">
                      ✕
                    </span>
                    <span className="text-[#c2c6d3] text-xs sm:text-sm">
                      Attempt to circumvent our security measures or access
                      unauthorized data.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1 text-base sm:text-lg">
                      ✕
                    </span>
                    <span className="text-[#c2c6d3] text-xs sm:text-sm">
                      Use automated systems to scrape our platform without
                      permission.
                    </span>
                  </li>
                </ul>
              </section>

              <div className="h-px bg-[#122a4c]/20 w-full"></div>

              <section id="intellectual">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-4">
                  <span className="text-[#a9c7ff] text-xs font-mono border border-[#a9c7ff] px-2 py-1">
                    05
                  </span>
                  Intellectual Property
                </h2>
                <p className="text-[#c2c6d3] leading-relaxed text-sm sm:text-base">
                  All content on Azure Estates, including text, graphics, logos,
                  images, and software, is the property of Azure Estates or its
                  content suppliers and is protected by international copyright
                  laws. You may not reproduce, duplicate, copy, sell, or exploit
                  any portion of our service without express written permission.
                </p>
              </section>

              <div className="h-px bg-[#122a4c]/20 w-full"></div>

              <section id="liability">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-4">
                  <span className="text-[#a9c7ff] text-xs font-mono border border-[#a9c7ff] px-2 py-1">
                    06
                  </span>
                  Limitation of Liability
                </h2>
                <p className="text-[#c2c6d3] leading-relaxed text-sm sm:text-base">
                  Azure Estates shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages
                  resulting from your use of or inability to use our services.
                  We act solely as a platform and are not party to any
                  transaction between buyers and sellers.
                </p>
              </section>

              <section className="bg-[#a9c7ff]/5 p-6 sm:p-8 rounded-xl border border-[#a9c7ff]/20">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
                  Contact Us
                </h2>
                <p className="text-xs sm:text-sm text-[#c2c6d3] mb-4 sm:mb-6">
                  If you have any questions about these Terms of Service, please
                  contact us:
                </p>
                <a
                  href="mailto:legal@azureestates.com"
                  className="inline-block text-[#a9c7ff] font-bold border-b border-[#a9c7ff] hover:text-white hover:border-white transition-all text-sm sm:text-base"
                >
                  legal@azureestates.com
                </a>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
