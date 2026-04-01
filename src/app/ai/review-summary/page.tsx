import {
  MdAutoAwesome,
  MdRateReview,
  MdStar,
  MdThumbUp,
  MdThumbDown,
  MdCheckCircle,
  MdWarning,
  MdInfo,
  MdTrendingUp,
  MdBarChart,
  MdPieChart,
  MdDownload,
  MdShare,
} from "react-icons/md";

export default function AIReviewSummary() {
  const reviews = [
    {
      id: 1,
      property: "Azure Sky Villa",
      location: "Malibu, CA",
      overallRating: 4.8,
      totalReviews: 127,
      sentiment: "positive",
      summary:
        "Exceptional property with stunning ocean views and modern amenities. Guests praise the infinity pool and smart home features.",
      keyPoints: [
        "Breathtaking ocean views mentioned in 89% of reviews",
        "Infinity pool rated as top amenity",
        "Smart home technology highly appreciated",
        "Professional concierge service praised",
      ],
      sentimentBreakdown: {
        positive: 92,
        neutral: 6,
        negative: 2,
      },
      topKeywords: [
        "ocean view",
        "infinity pool",
        "smart home",
        "luxury",
        "modern",
      ],
      recentReview: {
        author: "Alexander V.",
        rating: 5,
        date: "2 days ago",
        comment:
          "Absolutely stunning property! The ocean views are breathtaking and the smart home features are incredible. Highly recommended!",
      },
    },
    {
      id: 2,
      property: "The Obsidian Estate",
      location: "Aspen, CO",
      overallRating: 4.6,
      totalReviews: 89,
      sentiment: "positive",
      summary:
        "Magnificent mountain estate with excellent ski access and luxury amenities. Some guests note the property requires high maintenance.",
      keyPoints: [
        "Prime ski location highlighted by guests",
        "Spa and wellness facilities highly rated",
        "Home theater entertainment praised",
        "Maintenance costs mentioned as concern",
      ],
      sentimentBreakdown: {
        positive: 86,
        neutral: 10,
        negative: 4,
      },
      topKeywords: ["ski access", "mountain view", "spa", "luxury", "privacy"],
      recentReview: {
        author: "Sarah Chen",
        rating: 4,
        date: "1 week ago",
        comment:
          "Beautiful property with amazing ski access. The spa is incredible, though maintenance costs are higher than expected.",
      },
    },
    {
      id: 3,
      property: "Urban Penthouse",
      location: "New York, NY",
      overallRating: 4.9,
      totalReviews: 156,
      sentiment: "very positive",
      summary:
        "Outstanding urban living experience with panoramic city views and world-class amenities. Consistently praised for location and service.",
      keyPoints: [
        "Panoramic city views universally praised",
        "Rooftop terrace rated as favorite feature",
        "Concierge service exceptional",
        "Proximity to attractions highlighted",
      ],
      sentimentBreakdown: {
        positive: 94,
        neutral: 5,
        negative: 1,
      },
      topKeywords: ["city view", "rooftop", "location", "concierge", "modern"],
      recentReview: {
        author: "Marcus Thorne",
        rating: 5,
        date: "3 days ago",
        comment:
          "Perfect NYC experience! The views are spectacular and the concierge service is exceptional. Location cannot be beaten.",
      },
    },
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "very positive":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "positive":
        return "text-[#a9c7ff] bg-[#a9c7ff]/10 border-[#a9c7ff]/20";
      case "neutral":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "negative":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<MdStar key={i} className="text-[#ffb68b]" size={16} />);
    }
    if (hasHalfStar) {
      stars.push(<MdStar key="half" className="text-[#ffb68b]/50" size={16} />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<MdStar key={i} className="text-white/20" size={16} />);
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9]">
      <header className="fixed top-0 w-full z-50 bg-[#00132e]/60 backdrop-blur-xl shadow-[0_48px_48px_rgba(18,42,76,0.06)]">
        <div className="flex justify-between items-center px-8 py-6">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-inter tracking-tighter text-[#a9c7ff] uppercase">
              LUXE.AI
            </span>
            <nav className="hidden md:flex gap-8">
              <a
                className="text-[#a9c7ff] font-bold tracking-tighter uppercase text-sm hover:text-white transition-colors duration-300"
                href="#"
              >
                Curated
              </a>
              <a
                className="text-[#a9c7ff]/50 tracking-tighter uppercase text-sm hover:text-white transition-colors duration-300"
                href="#"
              >
                Discovery
              </a>
              <a
                className="text-[#a9c7ff] font-bold tracking-tighter uppercase text-sm hover:text-white transition-colors duration-300"
                href="#"
              >
                AI Studio
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-[#a9c7ff] hover:text-white transition-colors">
              <MdAutoAwesome size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#a9c7ff] rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-8 md:px-12">
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-inter text-white tracking-tighter mb-4">
            AI Review <span className="text-[#a9c7ff]">Summary</span>
          </h1>
          <p className="text-xl text-[#c2c6d3] max-w-2xl mx-auto leading-relaxed">
            Comprehensive analysis of property reviews using advanced AI
            sentiment analysis and natural language processing
          </p>
        </section>

        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div
              className="p-6 rounded-xl border border-white/5"
              style={{
                background: "rgba(18, 42, 76, 0.4)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#c2c6d3]">Total Reviews</p>
                <MdRateReview className="text-[#a9c7ff]" size={16} />
              </div>
              <p className="text-3xl font-bold text-white">372</p>
              <p className="text-xs text-emerald-400 mt-1">+12% this month</p>
            </div>
            <div
              className="p-6 rounded-xl border border-white/5"
              style={{
                background: "rgba(18, 42, 76, 0.4)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#c2c6d3]">Avg Rating</p>
                <MdStar className="text-[#ffb68b]" size={16} />
              </div>
              <p className="text-3xl font-bold text-white">4.8</p>
              <p className="text-xs text-[#ffb68b] mt-1">Excellent</p>
            </div>
            <div
              className="p-6 rounded-xl border border-white/5"
              style={{
                background: "rgba(18, 42, 76, 0.4)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#c2c6d3]">Sentiment Score</p>
                <MdTrendingUp className="text-emerald-400" size={16} />
              </div>
              <p className="text-3xl font-bold text-white">91%</p>
              <p className="text-xs text-emerald-400 mt-1">Positive</p>
            </div>
            <div
              className="p-6 rounded-xl border border-white/5"
              style={{
                background: "rgba(18, 42, 76, 0.4)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#c2c6d3]">Properties</p>
                <MdBarChart className="text-amber-400" size={16} />
              </div>
              <p className="text-3xl font-bold text-white">3</p>
              <p className="text-xs text-amber-400 mt-1">Analyzed</p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-white/5 overflow-hidden"
              style={{
                background: "rgba(18, 42, 76, 0.4)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="p-6 border-b border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {review.property}
                    </h3>
                    <p className="text-[#c2c6d3] mb-2">{review.location}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getRatingStars(review.overallRating)}
                        <span className="text-white font-bold">
                          {review.overallRating}
                        </span>
                      </div>
                      <span className="text-[#c2c6d3]">
                        ({review.totalReviews} reviews)
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getSentimentColor(review.sentiment)}`}
                      >
                        {review.sentiment.charAt(0).toUpperCase() +
                          review.sentiment.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                      <MdDownload size={18} />
                    </button>
                    <button className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                      <MdShare size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-white leading-relaxed mb-4">
                  {review.summary}
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <MdCheckCircle className="text-emerald-400" size={20} />
                      Key Insights
                    </h4>
                    <ul className="space-y-2">
                      {review.keyPoints.map((point, index) => (
                        <li
                          key={index}
                          className="text-sm text-[#c2c6d3] flex items-start gap-2"
                        >
                          <span className="text-[#a9c7ff] mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <MdPieChart className="text-[#a9c7ff]" size={20} />
                      Sentiment Analysis
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-emerald-400 flex items-center gap-2">
                          <MdThumbUp size={14} />
                          Positive
                        </span>
                        <span className="text-sm text-white font-medium">
                          {review.sentimentBreakdown.positive}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{
                            width: `${review.sentimentBreakdown.positive}%`,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-amber-400 flex items-center gap-2">
                          <MdInfo size={14} />
                          Neutral
                        </span>
                        <span className="text-sm text-white font-medium">
                          {review.sentimentBreakdown.neutral}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{
                            width: `${review.sentimentBreakdown.neutral}%`,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-red-400 flex items-center gap-2">
                          <MdThumbDown size={14} />
                          Negative
                        </span>
                        <span className="text-sm text-white font-medium">
                          {review.sentimentBreakdown.negative}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-red-400 rounded-full"
                          style={{
                            width: `${review.sentimentBreakdown.negative}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <MdTrendingUp className="text-amber-400" size={20} />
                      Top Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {review.topKeywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#a9c7ff]/10 border border-[#a9c7ff]/20 text-[#a9c7ff] text-xs rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5">
                  <h4 className="text-lg font-bold text-white mb-4">
                    Recent Review
                  </h4>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">
                          {review.recentReview.author}
                        </span>
                        <div className="flex items-center gap-1">
                          {getRatingStars(review.recentReview.rating)}
                        </div>
                      </div>
                      <span className="text-xs text-[#c2c6d3]">
                        {review.recentReview.date}
                      </span>
                    </div>
                    <p className="text-sm text-[#c2c6d3]">
                      "{review.recentReview.comment}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="mt-12 flex justify-center">
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-[#a9c7ff] text-[#003063] font-bold text-sm rounded-full hover:bg-white transition-colors flex items-center gap-2">
              <MdDownload size={16} />
              Export Full Report
            </button>
            <button className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold text-sm rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
              <MdShare size={16} />
              Share Analysis
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
