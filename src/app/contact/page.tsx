"use client";

import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";
import { FaTwitter, FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#00132e] overflow-x-hidden">
      <section className="pt-28 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16 lg:mb-20 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-end">
            <div className="lg:col-span-8">
              <h6 className="text-[#a9c7ff] tracking-[0.3em] uppercase text-xs mb-4">
                Get In Touch
              </h6>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
                Contact <br />
                Us.
              </h1>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <p className="text-[#c2c6d3]/60 text-sm uppercase tracking-widest">
                We&apos;re Here
                <br />
                To Help
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24">
            <div className="bg-[#191c21]/50 p-6 sm:p-8 lg:p-12 rounded-xl border border-[#122a4c]/50">
              <form className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-[#c2c6d3] text-[10px] sm:text-xs uppercase tracking-widest mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#00132e] border border-[#122a4c] rounded-full px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm focus:outline-none focus:border-[#a9c7ff] transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-[#c2c6d3] text-[10px] sm:text-xs uppercase tracking-widest mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#00132e] border border-[#122a4c] rounded-full px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm focus:outline-none focus:border-[#a9c7ff] transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#c2c6d3] text-[10px] sm:text-xs uppercase tracking-widest mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full bg-[#00132e] border border-[#122a4c] rounded-full px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm focus:outline-none focus:border-[#a9c7ff] transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-[#c2c6d3] text-[10px] sm:text-xs uppercase tracking-widest mb-2">
                    Subject
                  </label>
                  <select className="w-full bg-[#00132e] border border-[#122a4c] rounded-full px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm focus:outline-none focus:border-[#a9c7ff] transition-colors">
                    <option>General Inquiry</option>
                    <option>Property Listing</option>
                    <option>Agent Support</option>
                    <option>Technical Issue</option>
                    <option>Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#c2c6d3] text-[10px] sm:text-xs uppercase tracking-widest mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-[#00132e] border border-[#122a4c] rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm focus:outline-none focus:border-[#a9c7ff] transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-[#003366] py-3 sm:py-4 font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-opacity-90 transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="space-y-8 sm:space-y-12">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                  Contact Information
                </h2>
                <p className="text-[#c2c6d3] text-sm sm:text-base leading-relaxed">
                  Have questions about our services or need assistance? Our team
                  is ready to help you with any inquiries about properties,
                  listings, or platform features.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#a9c7ff]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MdLocationOn className="text-[#a9c7ff] text-lg sm:text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">
                      Headquarters
                    </h3>
                    <p className="text-[#c2c6d3] text-xs sm:text-sm">
                      350 Fifth Avenue, Suite 7500
                      <br />
                      New York, NY 10118
                      <br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#a9c7ff]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MdPhone className="text-[#a9c7ff] text-lg sm:text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">
                      Phone
                    </h3>
                    <p className="text-[#c2c6d3] text-xs sm:text-sm">
                      1-800-AZURE-EST (1-800-298-7337)
                      <br />
                      <span className="text-[#c2c6d3]/60">
                        Mon-Fri, 9AM-6PM EST
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#a9c7ff]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MdEmail className="text-[#a9c7ff] text-lg sm:text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">
                      Email
                    </h3>
                    <p className="text-[#c2c6d3] text-xs sm:text-sm">
                      support@azureestates.com
                      <br />
                      agents@azureestates.com
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                  Follow Us
                </h3>
                <div className="flex gap-3 sm:gap-4">
                  <a
                    href="#"
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-[#191c21] border border-[#122a4c]/50 rounded-full flex items-center justify-center text-[#c2c6d3] hover:text-[#a9c7ff] hover:border-[#a9c7ff] transition-all"
                  >
                    <FaLinkedin size={16} />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-[#191c21] border border-[#122a4c]/50 rounded-full flex items-center justify-center text-[#c2c6d3] hover:text-[#a9c7ff] hover:border-[#a9c7ff] transition-all"
                  >
                    <FaTwitter size={16} />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-[#191c21] border border-[#122a4c]/50 rounded-full flex items-center justify-center text-[#c2c6d3] hover:text-[#a9c7ff] hover:border-[#a9c7ff] transition-all"
                  >
                    <FaInstagram size={16} />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-[#191c21] border border-[#122a4c]/50 rounded-full flex items-center justify-center text-[#c2c6d3] hover:text-[#a9c7ff] hover:border-[#a9c7ff] transition-all"
                  >
                    <FaFacebook size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#000e25]/50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#191c21] rounded-xl border border-[#122a4c]/50 overflow-hidden h-64 sm:h-80 lg:h-96 flex items-center justify-center">
            <div className="text-center px-4">
              <MdLocationOn className="text-4xl sm:text-5xl lg:text-6xl text-[#a9c7ff] mx-auto mb-4" />
              <p className="text-[#c2c6d3] text-sm sm:text-base">
                Interactive Map Coming Soon
              </p>
              <p className="text-[#c2c6d3]/60 text-xs sm:text-sm">
                350 Fifth Avenue, New York, NY
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
