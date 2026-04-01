"use client";

import Link from "next/link";
import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";
import { FaFacebook, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#00132e] text-[#e1e2e9] py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4 lg:space-y-6 sm:col-span-2 lg:col-span-1">
            <h3 className="font-inter text-lg lg:text-xl font-bold">
              AzureEstates
            </h3>
            <p className="text-[#c2c6d3] text-sm lg:text-base">
              Curating high-performance architectural marvels for those who view
              living as a fine art.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <MdLocationOn className="w-4 h-4 lg:w-5 lg:h-5 text-[#a9c7ff] flex-shrink-0" />
                <span className="text-xs lg:text-sm">
                  123 Luxury Lane, Bel Air, CA 90210
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MdPhone className="w-4 h-4 lg:w-5 lg:h-5 text-[#a9c7ff] flex-shrink-0" />
                <span className="text-xs lg:text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MdEmail className="w-4 h-4 lg:w-5 lg:h-5 text-[#a9c7ff] flex-shrink-0" />
                <span className="text-xs lg:text-sm">
                  contact@azureestates.com
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:space-y-6">
            <h4 className="font-inter text-base lg:text-lg font-semibold">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2 lg:gap-3">
              <Link
                href="/properties"
                className="text-[#c2c6d3] text-sm lg:text-base hover:text-[#a9c7ff] transition-colors duration-300"
              >
                Properties
              </Link>
              <Link
                href="/about"
                className="text-[#c2c6d3] text-sm lg:text-base hover:text-[#a9c7ff] transition-colors duration-300"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-[#c2c6d3] text-sm lg:text-base hover:text-[#a9c7ff] transition-colors duration-300"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="space-y-4 lg:space-y-6 sm:col-span-2 lg:col-span-1">
            <h4 className="font-inter text-base lg:text-lg font-semibold">
              Newsletter
            </h4>
            <p className="text-[#c2c6d3] text-sm lg:text-base">
              Subscribe to receive exclusive property listings and market
              insights.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 lg:gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-[#001b3d] text-[#e1e2e9] placeholder-[#424751]/50 px-3 lg:px-4 py-2 lg:py-3 text-sm focus:outline-none rounded-full focus-within:ring-2 focus-within:ring-[#a9c7ff] transition-colors duration-300"
              />
              <button
                type="submit"
                className="bg-white text-[#003366] px-4 lg:px-8 py-2 lg:py-3 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-opacity-90 transition-all whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="space-y-4 lg:space-y-6">
            <h4 className="font-inter text-base lg:text-lg font-semibold">
              Follow Us
            </h4>
            <div className="flex gap-3 lg:gap-4">
              <a
                href="https://facebook.com"
                className="text-[#c2c6d3] hover:text-[#a9c7ff] transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5 lg:w-6 lg:h-6" />
              </a>
              <a
                href="https://twitter.com"
                className="text-[#c2c6d3] hover:text-[#a9c7ff] transition-colors duration-300"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5 lg:w-6 lg:h-6" />
              </a>
            </div>

            <div className="pt-4 lg:pt-6 border-t border-white/10 lg:hidden">
              <div className="flex flex-col gap-2">
                <Link
                  href="/privacy"
                  className="text-[#c2c6d3] text-sm hover:text-[#a9c7ff] transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-[#c2c6d3] text-sm hover:text-[#a9c7ff] transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs lg:text-sm text-[#c2c6d3] text-center sm:text-left">
              © {currentYear} AzureEstates. All rights reserved.
            </p>
            <div className="hidden lg:flex gap-6">
              <Link
                href="/privacy"
                className="text-xs lg:text-sm text-[#c2c6d3] hover:text-[#a9c7ff] transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs lg:text-sm text-[#c2c6d3] hover:text-[#a9c7ff] transition-colors duration-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
