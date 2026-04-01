"use client";

import { useState } from "react";

export default function AITestPage() {
  const [activeTab, setActiveTab] = useState<
    "chat" | "description" | "recommendations" | "review"
  >("chat");

  const [chatMessage, setChatMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const [descData, setDescData] = useState({
    property_type: "house",
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 2000,
    city: "Miami",
    state: "FL",
    price: "750000",
    features: ["pool", "garage"],
  });
  const [descResponse, setDescResponse] = useState("");
  const [descLoading, setDescLoading] = useState(false);

  const [recCity, setRecCity] = useState("Miami");
  const [recBudget, setRecBudget] = useState("500000");
  const [recResponse, setRecResponse] = useState("");
  const [recLoading, setRecLoading] = useState(false);

  const [reviews, setReviews] = useState(
    '{"rating": 4.5, "comment": "Great property, nice location"}',
  );
  const [reviewResponse, setReviewResponse] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const testChat = async () => {
    setChatLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatMessage }),
      });
      const data = await res.json();
      setChatResponse(data.ai_response || data.error || "No response");
    } catch (err) {
      setChatResponse("Error: " + String(err));
    }
    setChatLoading(false);
  };

  const testDescription = async () => {
    setDescLoading(true);
    try {
      const res = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(descData),
      });
      const data = await res.json();
      setDescResponse(data.description || data.error || "No response");
    } catch (err) {
      setDescResponse("Error: " + String(err));
    }
    setDescLoading(false);
  };

  const testRecommendations = async () => {
    setRecLoading(true);
    try {
      const res = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: recCity, max_budget: recBudget }),
      });
      const data = await res.json();
      setRecResponse(JSON.stringify(data, null, 2) || "No response");
    } catch (err) {
      setRecResponse("Error: " + String(err));
    }
    setRecLoading(false);
  };

  const testReviewSummary = async () => {
    setReviewLoading(true);
    try {
      const res = await fetch("/api/ai/review-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews: JSON.parse(reviews) }),
      });
      const data = await res.json();
      setReviewResponse(JSON.stringify(data, null, 2) || "No response");
    } catch (err) {
      setReviewResponse("Error: " + String(err));
    }
    setReviewLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#191c21] p-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        AI Features Test Page
      </h1>

      <div className="flex gap-4 mb-8">
        {["chat", "description", "recommendations", "review"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-[#a9c7ff] text-[#001b3d]"
                : "bg-[#2a2d33] text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "chat" && (
        <div className="bg-[#2a2d33] p-6 rounded-lg">
          <h2 className="text-xl text-white mb-4">AI Chat</h2>
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Ask something..."
            className="w-full p-3 rounded-full bg-[#191c21] text-white mb-4"
          />
          <button
            onClick={testChat}
            disabled={chatLoading}
            className="px-4 py-2 bg-[#a9c7ff] text-[#001b3d] rounded disabled:opacity-50"
          >
            {chatLoading ? "Loading..." : "Send"}
          </button>
          {chatResponse && (
            <div className="mt-4 p-4 bg-[#191c21] rounded text-white">
              <strong>Response:</strong>
              <p>{chatResponse}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "description" && (
        <div className="bg-[#2a2d33] p-6 rounded-lg">
          <h2 className="text-xl text-white mb-4">
            Generate Property Description
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select
              value={descData.property_type}
              onChange={(e) =>
                setDescData({ ...descData, property_type: e.target.value })
              }
              className="p-2 rounded-full bg-[#191c21] text-white"
            >
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
            </select>
            <input
              type="number"
              value={descData.bedrooms}
              onChange={(e) =>
                setDescData({ ...descData, bedrooms: parseInt(e.target.value) })
              }
              placeholder="Bedrooms"
              className="p-2 rounded-full bg-[#191c21] text-white"
            />
            <input
              type="number"
              value={descData.bathrooms}
              onChange={(e) =>
                setDescData({
                  ...descData,
                  bathrooms: parseInt(e.target.value),
                })
              }
              placeholder="Bathrooms"
              className="p-2 rounded-full bg-[#191c21] text-white"
            />
            <input
              type="number"
              value={descData.area_sqft}
              onChange={(e) =>
                setDescData({
                  ...descData,
                  area_sqft: parseInt(e.target.value),
                })
              }
              placeholder="Area sqft"
              className="p-2 rounded-full bg-[#191c21] text-white"
            />
            <input
              type="text"
              value={descData.city}
              onChange={(e) =>
                setDescData({ ...descData, city: e.target.value })
              }
              placeholder="City"
              className="p-2 rounded-full bg-[#191c21] text-white"
            />
            <input
              type="text"
              value={descData.state}
              onChange={(e) =>
                setDescData({ ...descData, state: e.target.value })
              }
              placeholder="State"
              className="p-2 rounded-full bg-[#191c21] text-white"
            />
            <input
              type="text"
              value={descData.price}
              onChange={(e) =>
                setDescData({ ...descData, price: e.target.value })
              }
              placeholder="Price"
              className="p-2 rounded-full bg-[#191c21] text-white"
            />
          </div>
          <button
            onClick={testDescription}
            disabled={descLoading}
            className="px-4 py-2 bg-[#a9c7ff] text-[#001b3d] rounded disabled:opacity-50"
          >
            {descLoading ? "Generating..." : "Generate"}
          </button>
          {descResponse && (
            <div className="mt-4 p-4 bg-[#191c21] rounded text-white">
              <strong>Description:</strong>
              <p className="mt-2">{descResponse}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "recommendations" && (
        <div className="bg-[#2a2d33] p-6 rounded-lg">
          <h2 className="text-xl text-white mb-4">Property Recommendations</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={recCity}
              onChange={(e) => setRecCity(e.target.value)}
              placeholder="City"
              className="p-2 rounded-full bg-[#191c21] text-white"
            />
            <input
              type="text"
              value={recBudget}
              onChange={(e) => setRecBudget(e.target.value)}
              placeholder="Max Budget"
              className="p-2 rounded-full bg-[#191c21] text-white"
            />
          </div>
          <button
            onClick={testRecommendations}
            disabled={recLoading}
            className="px-4 py-2 bg-[#a9c7ff] text-[#001b3d] rounded disabled:opacity-50"
          >
            {recLoading ? "Loading..." : "Get Recommendations"}
          </button>
          {recResponse && (
            <pre className="mt-4 p-4 bg-[#191c21] rounded text-white overflow-auto">
              {recResponse}
            </pre>
          )}
        </div>
      )}

      {activeTab === "review" && (
        <div className="bg-[#2a2d33] p-6 rounded-lg">
          <h2 className="text-xl text-white mb-4">Review Summary</h2>
          <textarea
            value={reviews}
            onChange={(e) => setReviews(e.target.value)}
            rows={5}
            className="w-full p-2 rounded-full bg-[#191c21] text-white mb-4"
          />
          <button
            onClick={testReviewSummary}
            disabled={reviewLoading}
            className="px-4 py-2 bg-[#a9c7ff] text-[#001b3d] rounded disabled:opacity-50"
          >
            {reviewLoading ? "Analyzing..." : "Analyze"}
          </button>
          {reviewResponse && (
            <pre className="mt-4 p-4 bg-[#191c21] rounded text-white overflow-auto">
              {reviewResponse}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
