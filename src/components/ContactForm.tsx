"use client";

import { useState } from "react";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      console.log("Contact form submission:", email);
      setSubmitted(true);
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="max-w-4xl mx-auto glass p-8 sm:p-12 lg:p-16 rounded-xl border border-[#424751]/20 relative overflow-hidden text-center"
        style={{
          background: "rgba(4, 31, 65, 0.4)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-[#a9c7ff]/10 blur-[120px] rounded-full -mr-16 -mt-16 sm:-mr-32 sm:-mt-32"></div>
        <h2 className="font-inter text-4xl sm:text-5xl lg:text-6xl tracking-tighter mb-4 sm:mb-6 relative z-10">
          THANK
          <br />
          YOU.
        </h2>
        <p className="text-[#c2c6d3] mb-8 sm:mb-12 max-w-lg mx-auto relative z-10 text-sm sm:text-base lg:text-lg">
          Your inquiry has been received. Our team will be in touch within 24
          hours to begin curating your experience.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-white text-[#003366] px-6 sm:px-8 py-2.5 sm:py-3 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-opacity-90 transition-all relative z-10"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <div
      className="max-w-4xl mx-auto glass p-8 sm:p-12 lg:p-16 rounded-xl border border-[#424751]/20 relative overflow-hidden text-center"
      style={{
        background: "rgba(4, 31, 65, 0.4)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-[#a9c7ff]/10 blur-[120px] rounded-full -mr-16 -mt-16 sm:-mr-32 sm:-mt-32"></div>
      <h2 className="font-inter text-4xl sm:text-5xl lg:text-6xl tracking-tighter mb-4 sm:mb-6 relative z-10">
        BEGIN THE
        <br />
        DIALOGUE.
      </h2>
      <p className="text-[#c2c6d3] mb-8 sm:mb-12 max-w-lg mx-auto relative z-10 text-sm sm:text-base lg:text-lg">
        Whether seeking to acquire or represent a masterpiece, our team of
        specialists is ready to curate your experience.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto relative z-10 
             bg-[#001b3d] border border-[#424751] rounded-2xl sm:rounded-full 
             focus-within:ring-2 focus-within:ring-[#a9c7ff] 
             hover:ring-2 hover:ring-[#a9c7ff] 
             transition-all duration-200 p-2 sm:p-3"
      >
        <input
          className="flex-1 outline-none px-4 sm:px-7 h-12 sm:h-14 text-base sm:text-lg bg-transparent rounded-full"
          placeholder="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />

        <button
          className="bg-white text-[#003366] px-6 sm:px-8 py-2.5 sm:py-3 font-bold text-[10px] uppercase tracking-[0.2em] 
               rounded-full hover:bg-opacity-90 active:scale-95 
               transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Inquire"}
        </button>
      </form>
      {error && (
        <p className="text-[#ffb4ab] text-xs sm:text-sm mt-4 relative z-10">
          {error}
        </p>
      )}
    </div>
  );
}
