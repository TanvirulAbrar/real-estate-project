import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ & Support | Azure Estates",
  description: "Frequently Asked Questions and Support for Azure Estates",
};

const faqs = [
  {
    question: "How do I create an account?",
    answer:
      "Click the 'Get Started' button in the top right corner. You can register using your email address or sign up quickly with your Google account. Once registered, you'll have access to our full property catalog and can save your favorites.",
  },
  {
    question: "How does the AI property recommendation work?",
    answer:
      "Our AI analyzes your search patterns, saved properties, and preferences to suggest listings that match your criteria. The more you interact with our platform, the better our recommendations become. You can also use our AI chat assistant to describe your ideal property in natural language.",
  },
  {
    question: "What is the difference between buyer and agent accounts?",
    answer:
      "Buyer accounts are for individuals looking to purchase or rent properties. Agent accounts are for licensed real estate professionals who want to list properties and manage client relationships. Agents require additional verification during registration.",
  },
  {
    question: "How do I schedule a property viewing?",
    answer:
      "Once you find a property you're interested in, click 'View Details' and then 'Schedule Viewing' to book an appointment. You'll be able to select available time slots and receive confirmation from the listing agent.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Absolutely. We use military-grade encryption and follow strict data protection protocols. Your information is never sold to third parties. For more details, please review our Privacy Policy.",
  },
  {
    question: "How can I list my property on Azure Estates?",
    answer:
      "You'll need to register as an agent first. Once verified, you can access your dashboard and click 'Add Property' to create a listing. Our team reviews all listings to ensure quality standards.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "For property transactions, we work with standard real estate payment methods including wire transfers, certified checks, and escrow services. For platform services, we accept all major credit cards.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach our support team via email at support@azureestates.com, through the chat feature in your dashboard, or by calling 1-800-AZURE-EST during business hours (9 AM - 6 PM EST, Monday-Friday).",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#00132e]">
      <section className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <h6 className="text-[#a9c7ff] tracking-[0.3em] uppercase text-xs mb-4">
            Support Center
          </h6>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-tight mb-6">
            How Can We <br />
            Help?
          </h1>
          <p className="text-[#c2c6d3] text-lg max-w-2xl mx-auto">
            Find answers to common questions about Azure Estates services,
            accounts, and property transactions.
          </p>
        </div>
      </section>

      <section className="pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 sm:space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#191c21]/50 rounded-xl border border-[#122a4c]/30 overflow-hidden"
              >
                <details className="group">
                  <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer list-none">
                    <span className="text-white font-semibold text-sm sm:text-base lg:text-lg pr-4 sm:pr-8">
                      {faq.question}
                    </span>
                    <span className="text-[#a9c7ff] text-lg sm:text-2xl group-open:rotate-180 transition-transform flex-shrink-0">
                      +
                    </span>
                  </summary>
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <p className="text-[#c2c6d3] text-sm sm:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#000e25]/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-[#191c21] p-6 sm:p-8 rounded-xl border border-[#122a4c]/50 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#a9c7ff]/20 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-xl sm:text-2xl text-[#a9c7ff]">✉</span>
              </div>
              <h3 className="text-white font-bold mb-2 text-sm sm:text-base">
                Email Us
              </h3>
              <p className="text-[#c2c6d3] text-xs sm:text-sm mb-3 sm:mb-4">
                support@azureestates.com
              </p>
              <Link
                href="mailto:support@azureestates.com"
                className="text-[#a9c7ff] text-xs sm:text-sm hover:underline"
              >
                Send Email →
              </Link>
            </div>

            <div className="bg-[#191c21] p-6 sm:p-8 rounded-xl border border-[#122a4c]/50 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#a9c7ff]/20 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-xl sm:text-2xl text-[#a9c7ff]">☎</span>
              </div>
              <h3 className="text-white font-bold mb-2 text-sm sm:text-base">
                Call Us
              </h3>
              <p className="text-[#c2c6d3] text-xs sm:text-sm mb-3 sm:mb-4">
                1-800-AZURE-EST
              </p>
              <p className="text-[#c2c6d3]/60 text-[10px] sm:text-xs">
                Mon-Fri, 9AM-6PM EST
              </p>
            </div>

            <div className="bg-[#191c21] p-6 sm:p-8 rounded-xl border border-[#122a4c]/50 text-center sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#a9c7ff]/20 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-xl sm:text-2xl text-[#a9c7ff]">💬</span>
              </div>
              <h3 className="text-white font-bold mb-2 text-sm sm:text-base">
                Live Chat
              </h3>
              <p className="text-[#c2c6d3] text-xs sm:text-sm mb-3 sm:mb-4">
                Available in Dashboard
              </p>
              <Link
                href="/dashboard"
                className="text-[#a9c7ff] text-xs sm:text-sm hover:underline"
              >
                Open Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
