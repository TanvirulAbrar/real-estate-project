"use client";

import { useState, useRef, useEffect } from "react";
import {
  MdNotifications,
  MdAutoAwesome,
  MdAttachment,
  MdSpaceDashboard,
  MdSearch,
  MdAutoAwesomeMosaic,
  MdPerson,
  MdSend,
} from "react-icons/md";

interface PropertyResult {
  id: string;
  title: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  city: string;
  state: string;
  property_type: string;
}

interface Message {
  id: number;
  sender: "ai" | "user";
  content: string;
  time: string;
  hasImage?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  conceptLabel?: string;
  properties?: PropertyResult[];
}

interface Dialogue {
  id: number;
  title: string;
  time: string;
  active: boolean;
}

export default function AIArchitecturalChat() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      content:
        "Welcome to Azure Estates AI. I'm your architectural curator. Describe your vision—whether it's a material, a mood, or a spatial requirement—and I'll help you find or conceptualize the perfect property.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      content: inputValue,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: messages.length + 2,
        sender: "ai",
        content:
          data.ai_response ||
          "I'm sorry, I couldn't process that request. Please try again.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        properties: data.properties,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: messages.length + 2,
        sender: "ai",
        content:
          "I'm having trouble connecting right now. Please try again later.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const dialogues: Dialogue[] = [
    { id: 1, title: "New Conversation", time: "Just now", active: true },
  ];

  return (
    <div className="flex-1 flex pt-[88px] pb-20 md:pb-0 h-screen overflow-hidden">
      <aside
        className="hidden lg:flex flex-col w-80 bg-[#0c0e13] border-r border-[#424751]/5 pt-8 overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="px-8 mb-10">
          <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-6 text-[#c2c6d3]">
            Curator Dialogues
          </h2>
          <div className="space-y-1">
            {dialogues.map((dialogue) => (
              <div
                key={dialogue.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  dialogue.active
                    ? "bg-[#1d2025] border-l-2 border-[#a9c7ff]"
                    : "hover:bg-[#1d2025]/50"
                }`}
              >
                <p
                  className={`text-sm truncate ${dialogue.active ? "font-semibold text-[#e1e2e9]" : "font-medium text-[#c2c6d3]"}`}
                >
                  {dialogue.title}
                </p>
                <p
                  className={`text-[10px] uppercase tracking-wider mt-1 ${dialogue.active ? "text-[#c2c6d3]" : "text-[#c2c6d3]/60"}`}
                >
                  {dialogue.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-auto p-8"
          style={{ background: "rgba(29, 32, 37, 0.3)" }}
        >
          <div
            className="p-6 rounded-xl"
            style={{
              background: "rgba(21, 90, 170, 0.2)",
              border: "1px solid rgba(169, 199, 255, 0.1)",
            }}
          >
            <p className="text-xs leading-relaxed text-[#bdd4ff]">
              Unlock advanced architectural synthesis with{" "}
              <span className="font-bold">Luxe Pro</span>.
            </p>
            <button className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#a9c7ff] hover:underline">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      <section className="flex-1 flex flex-col relative bg-[#111318]">
        <div
          className="flex-1 overflow-y-auto px-6 md:px-12 pb-32 space-y-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="px-8 py-10 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-inter tracking-tighter text-[#e1e2e9] uppercase mb-2">
              AI ARCHITECTURAL CURATOR
            </h1>
            <p className="max-w-xl text-sm md:text-base leading-relaxed text-[#c2c6d3]/70">
              Sourcing elegance through computational intuition. Define your
              vision, and I shall curate architectural soul of your next
              residence.
            </p>
          </div>
          {messages.map((message) => (
            <div
              key={message.id}
              ref={
                message.id === messages[messages.length - 1]?.id
                  ? messagesEndRef
                  : null
              }
              className={`flex flex-col max-w-3xl ${message.sender === "user" ? "items-end ml-auto" : "items-start"}`}
            >
              <div
                className={`p-6 rounded-2xl shadow-lg w-full ${
                  message.sender === "user"
                    ? "bg-[#a9c7ff]/10 backdrop-blur-md rounded-tr-none border border-[#a9c7ff]/20"
                    : "rounded-tl-none border border-white/5"
                }`}
                style={
                  message.sender === "ai"
                    ? {
                        background: "rgba(4, 31, 65, 0.4)",
                        backdropFilter: "blur(24px)",
                      }
                    : {}
                }
              >
                <p className="text-sm md:text-base leading-relaxed text-[#e1e2e9]">
                  {message.content}
                </p>

                {message.properties && message.properties.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <p className="text-xs text-[#a9c7ff] uppercase tracking-widest font-semibold">
                      Found Properties:
                    </p>
                    <div className="grid gap-3">
                      {message.properties.map((prop) => (
                        <a
                          key={prop.id}
                          href={`/properties/${prop.id}`}
                          className="block p-4 rounded-xl bg-[#191c21]/80 border border-[#a9c7ff]/20 hover:bg-[#282a2f]/80 hover:border-[#a9c7ff]/40 transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-white font-semibold text-sm">
                                {prop.title}
                              </h4>
                              <p className="text-[#c2c6d3] text-xs mt-1">
                                {prop.city}, {prop.state}
                              </p>
                            </div>
                            <span className="text-[#a9c7ff] font-bold text-sm">
                              ${prop.price}
                            </span>
                          </div>
                          <div className="flex gap-4 mt-3 text-xs text-[#c2c6d3]">
                            <span>{prop.bedrooms} bed</span>
                            <span>{prop.bathrooms} bath</span>
                            <span className="capitalize">
                              {prop.property_type}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {message.hasImage && (
                  <div className="aspect-video w-full rounded-lg overflow-hidden relative group mt-6">
                    <img
                      className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700"
                      src={message.imageSrc}
                      alt={message.imageAlt}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111318]/80 to-transparent flex items-end p-6">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9c7ff]">
                        {message.conceptLabel}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#c2c6d3]/50 mt-3 ml-1">
                {message.sender === "ai" ? "Curator AI" : "You"} •{" "}
                {message.time}
              </span>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 bg-gradient-to-t from-[#111318] via-[#111318] to-transparent">
          <div className="max-w-4xl mx-auto flex items-center gap-4 bg-[#282a2f]/40 backdrop-blur-xl rounded-full border border-[#424751]/20 px-6 py-3">
            <MdAttachment className="text-[#c2c6d3]/60" size={20} />
            <input
              className="flex-1 w-full bg-transparent border-none focus:ring-0 text-[#e1e2e9] placeholder:text-[#c2c6d3]/40 line-clamp-1 text-sm md:text-base outline-none"
              placeholder="Describe a texture, a mood, or a spatial requirement..."
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="bg-[#a9c7ff] text-[#003063] text-[10px] font-extrabold uppercase tracking-widest px-8 py-3 rounded-full hover:bg-[#d6e3ff] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-[#003063] border-t-transparent rounded-full animate-spin"></span>
                  Sending...
                </>
              ) : (
                <>
                  <MdSend size={14} />
                  Inquire
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <footer className="md:hidden fixed bottom-0 w-full z-50 rounded-t-2xl bg-[#000e25]/80 backdrop-blur-2xl shadow-2xl shadow-black flex justify-around items-center h-20 px-6">
        <div className="flex flex-col items-center justify-center text-[#b2c5ff]/40 hover:text-[#b2c5ff] transition-all active:scale-90 duration-150">
          <MdSpaceDashboard size={20} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium mt-1">
            Curated
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#b2c5ff]/40 hover:text-[#b2c5ff] transition-all active:scale-90 duration-150">
          <MdSearch size={20} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium mt-1">
            Discovery
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#b2c5ff] scale-110 active:scale-90 duration-150">
          <MdAutoAwesome
            size={20}
            style={{ fontVariationSettings: "'FILL' 1" }}
          />
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium mt-1">
            AI Studio
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#b2c5ff]/40 hover:text-[#b2c5ff] transition-all active:scale-90 duration-150">
          <MdAutoAwesomeMosaic size={20} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium mt-1">
            Favs
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#b2c5ff]/40 hover:text-[#b2c5ff] transition-all active:scale-90 duration-150">
          <MdPerson size={20} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium mt-1">
            Profile
          </span>
        </div>
      </footer>
    </div>
  );
}
