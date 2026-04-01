import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Azure Estates",
  description: "Privacy Policy for Azure Estates - Real Estate Platform",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#00132e] pt-28 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 sm:mb-16 lg:mb-20 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-end">
          <div className="lg:col-span-8">
            <h6 className="text-[#a9c7ff] tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-4">
              Legal Framework
            </h6>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
              Privacy <br />
              Policy.
            </h1>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <p className="text-[#c2c6d3]/60 text-xs sm:text-sm uppercase tracking-widest">
              Last Revision
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
                  href="#introduction"
                  className="text-[#a9c7ff] font-bold text-sm tracking-wide transition-all hover:translate-x-1"
                >
                  01. Introduction
                </Link>
                <Link
                  href="#collection"
                  className="text-[#c2c6d3] hover:text-[#a9c7ff] text-sm tracking-wide transition-all hover:translate-x-1"
                >
                  02. Data Collection
                </Link>
                <Link
                  href="#usage"
                  className="text-[#c2c6d3] hover:text-[#a9c7ff] text-sm tracking-wide transition-all hover:translate-x-1"
                >
                  03. Usage Protocols
                </Link>
                <Link
                  href="#security"
                  className="text-[#c2c6d3] hover:text-[#a9c7ff] text-sm tracking-wide transition-all hover:translate-x-1"
                >
                  04. Asset Security
                </Link>
                <Link
                  href="#rights"
                  className="text-[#c2c6d3] hover:text-[#a9c7ff] text-sm tracking-wide transition-all hover:translate-x-1"
                >
                  05. User Sovereignty
                </Link>
                <Link
                  href="#contact"
                  className="text-[#c2c6d3] hover:text-[#a9c7ff] text-sm tracking-wide transition-all hover:translate-x-1"
                >
                  06. Contact Integrity
                </Link>
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-9 bg-[#191c21]/40 backdrop-blur-2xl p-6 sm:p-8 lg:p-12 xl:p-16 rounded-xl border border-[#122a4c]/50 shadow-2xl">
            <div className="space-y-8 sm:space-y-12">
              <section id="introduction">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-4">
                  <span className="text-[#a9c7ff] text-xs font-mono border border-[#a9c7ff] px-2 py-1">
                    01
                  </span>
                  Introduction
                </h2>
                <p className="text-[#c2c6d3] leading-relaxed text-base sm:text-lg">
                  At Azure Estates, we consider the privacy of our
                  high-net-worth clientele and institutional partners to be the
                  cornerstone of our advisory relationship. This Privacy Policy
                  outlines our rigorous standards for data stewardship and how
                  we protect your digital footprint within our ecosystem.
                </p>
              </section>

              <div className="h-px bg-[#122a4c]/20 w-full"></div>

              <section id="collection">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-4">
                  <span className="text-[#a9c7ff] text-xs font-mono border border-[#a9c7ff] px-2 py-1">
                    02
                  </span>
                  Data Collection
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-[#c2c6d3] leading-relaxed text-sm sm:text-base">
                    We collect information that is strictly necessary to provide
                    an elite, curated real estate experience. This includes:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#191c21] p-4 sm:p-6 border-l-2 border-[#a9c7ff]">
                      <h4 className="text-[#a9c7ff] text-xs tracking-widest uppercase mb-2">
                        Direct Identification
                      </h4>
                      <p className="text-xs sm:text-sm text-[#c2c6d3]">
                        Legal name, encrypted communication channels, and
                        residency status for compliance verification.
                      </p>
                    </div>
                    <div className="bg-[#191c21] p-4 sm:p-6 border-l-2 border-[#a9c7ff]">
                      <h4 className="text-[#a9c7ff] text-xs tracking-widest uppercase mb-2">
                        Portfolio Analytics
                      </h4>
                      <p className="text-xs sm:text-sm text-[#c2c6d3]">
                        Investment preferences, property interactions, and
                        financial thresholds for curated matching.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="h-px bg-[#122a4c]/20 w-full"></div>

              <section id="usage">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-4">
                  <span className="text-[#a9c7ff] text-xs font-mono border border-[#a9c7ff] px-2 py-1">
                    03
                  </span>
                  Usage Protocols
                </h2>
                <p className="text-[#c2c6d3] leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                  Information processed by Azure Estates is used exclusively to
                  facilitate bespoke real estate transactions and provide market
                  intelligence. We do not engage in the commercial sale of user
                  data.
                </p>
                <ul className="space-y-3 sm:space-y-4 list-none p-0">
                  <li className="flex items-start gap-3">
                    <span className="text-[#a9c7ff] mt-1 text-base sm:text-lg">
                      ✓
                    </span>
                    <span className="text-[#c2c6d3] text-xs sm:text-sm">
                      Automated refinement of your property feed based on
                      portfolio performance.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#a9c7ff] mt-1 text-base sm:text-lg">
                      ✓
                    </span>
                    <span className="text-[#c2c6d3] text-xs sm:text-sm">
                      AML/KYC regulatory verification for high-value
                      acquisitions.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#a9c7ff] mt-1 text-base sm:text-lg">
                      ✓
                    </span>
                    <span className="text-[#c2c6d3] text-xs sm:text-sm">
                      Secure distribution of off-market listings and legal
                      documentation.
                    </span>
                  </li>
                </ul>
              </section>

              <div className="h-px bg-[#122a4c]/20 w-full"></div>

              <section id="security">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-4">
                  <span className="text-[#a9c7ff] text-xs font-mono border border-[#a9c7ff] px-2 py-1">
                    04
                  </span>
                  Asset Security
                </h2>
                <p className="text-[#c2c6d3] leading-relaxed text-sm sm:text-base">
                  We employ military-grade encryption for all data at rest and
                  in transit. Our servers are hosted in high-security
                  environments with continuous monitoring. In the architectural
                  design of our digital portal, security is not a feature—it is
                  the foundation.
                </p>
              </section>

              <div className="h-px bg-[#122a4c]/20 w-full"></div>

              <section id="rights">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-4">
                  <span className="text-[#a9c7ff] text-xs font-mono border border-[#a9c7ff] px-2 py-1">
                    05
                  </span>
                  User Sovereignty
                </h2>
                <p className="text-[#c2c6d3] leading-relaxed text-sm sm:text-base">
                  Under international privacy frameworks, including GDPR and
                  CCPA, you maintain absolute sovereignty over your data. You
                  may request a data purge at any time, which will initiate the
                  permanent deletion of your profile and associated data from
                  our active clusters, subject to legal record-keeping
                  requirements.
                </p>
              </section>

              <section
                id="contact"
                className="bg-[#a9c7ff]/5 p-6 sm:p-8 rounded-xl border border-[#a9c7ff]/20"
              >
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
                  Contact Integrity
                </h2>
                <p className="text-xs sm:text-sm text-[#c2c6d3] mb-4 sm:mb-6">
                  For inquiries regarding your data rights or to report a
                  security concern, contact our dedicated Privacy Desk:
                </p>
                <a
                  href="mailto:privacy@azureestates.com"
                  className="inline-block text-[#a9c7ff] font-bold border-b border-[#a9c7ff] hover:text-white hover:border-white transition-all text-sm sm:text-base"
                >
                  privacy@azureestates.com
                </a>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
