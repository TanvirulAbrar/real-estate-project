"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Transaction {
  id: string;
  property: string;
  type: "purchase" | "rent" | "sale";
  amount: number;
  status: "pending" | "completed" | "failed";
  date: string;
  parties: {
    buyer?: string;
    seller?: string;
    agent: string;
  };
}

export default function TransactionsPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const response = await fetch("/api/transactions");

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();

        const mappedTransactions = (data.data || []).map(
          (t: {
            id: string;
            property?: { title: string };
            type: string;
            amount: number;
            status: string;
            date: string;
            buyer?: { name: string };
            seller?: { name: string };
            agent?: { name: string };
          }) => ({
            id: t.id,
            property: t.property?.title || "Unknown Property",
            type: t.type as "purchase" | "rent" | "sale",
            amount: t.amount,
            status: t.status as "pending" | "completed" | "failed",
            date: t.date,
            parties: {
              buyer: t.buyer?.name,
              seller: t.seller?.name,
              agent: t.agent?.name || "Unknown Agent",
            },
          }),
        );
        setTransactions(mappedTransactions);
      } catch (error) {
        console.error("Error loading transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [session]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "completed":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "purchase":
        return "bg-blue-500/20 text-blue-400";
      case "rent":
        return "bg-purple-500/20 text-purple-400";
      case "sale":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 lg:mb-8">
        My Transactions
      </h1>

      {loading ? (
        <div className="text-center py-8 sm:py-12">
          <div className="inline-block w-6 h-6 sm:w-8 sm:h-8 border-2 border-[#a9c7ff]/30 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#c2c6d3] text-sm sm:text-base">
            Loading your transactions...
          </p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-[#c2c6d3] text-base sm:text-lg mb-4">
            No transactions yet
          </p>
          <p className="text-white/60 text-sm">
            Your transaction history will appear here once you complete deals.
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 sm:p-6 hover:border-[#a9c7ff]/20 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {transaction.property}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}
                    >
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(transaction.type)}`}
                    >
                      {transaction.type.charAt(0).toUpperCase() +
                        transaction.type.slice(1)}
                    </span>
                  </div>

                  <div className="text-xl sm:text-2xl font-bold text-white mb-3">
                    ${transaction.amount.toLocaleString()}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div>
                      <p className="text-[#c2c6d3] text-xs sm:text-sm mb-1">
                        Transaction Date
                      </p>
                      <p className="text-white text-sm sm:text-base">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#c2c6d3] text-xs sm:text-sm mb-1">
                        Agent
                      </p>
                      <p className="text-white text-sm sm:text-base">
                        {transaction.parties.agent}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                    <p className="text-[#c2c6d3] text-xs sm:text-sm mb-2">
                      Parties Involved
                    </p>
                    <div className="space-y-1 text-sm">
                      {transaction.parties.buyer && (
                        <p className="text-white">
                          <span className="text-[#c2c6d3]">Buyer:</span>{" "}
                          {transaction.parties.buyer}
                        </p>
                      )}
                      {transaction.parties.seller && (
                        <p className="text-white">
                          <span className="text-[#c2c6d3]">Seller:</span>{" "}
                          {transaction.parties.seller}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button className="px-3 sm:px-4 py-2 bg-[#a9c7ff]/10 text-[#a9c7ff] rounded-full hover:bg-[#a9c7ff]/20 transition-colors text-xs sm:text-sm">
                  View Details
                </button>
                <button className="px-3 sm:px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors text-xs sm:text-sm">
                  Download Documents
                </button>
                {transaction.status === "pending" && (
                  <button className="px-3 sm:px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-full hover:bg-yellow-500/20 transition-colors text-xs sm:text-sm">
                    Track Progress
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
