"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaWhatsapp, FaTimes, FaPaperPlane } from "react-icons/fa";

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [hasUnread, setHasUnread] = useState(true);

  const phone = "919595579336";

  // Auto popup 3.5s after website launch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasUnread(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = (text: string) => {
    if (!text || !text.trim()) return;
    const encoded = encodeURIComponent(text.trim());
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
    setInputMsg("");
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (hasUnread) setHasUnread(false);
  };

  return (
    <div className="fixed bottom-7 right-7 z-[9999] flex flex-col items-end">
      {/* Interactive Chat Box Popup */}
      {isOpen && (
        <div className="mb-4 w-[350px] max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-2xl shadow-slate-900/20 overflow-hidden border border-slate-100 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                <Image
                  src="/ai_advisor_avatar.png"
                  alt="AI Placement Advisor"
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25D366] border-2 border-[#128C7E] rounded-full z-10" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white leading-tight">
                  FutureBridge Placement Advisor
                </h4>
                <p className="text-[11px] text-white/80 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] inline-block" />
                  Online • Typically replies in minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Close Chat"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-slate-100 min-h-[180px] max-h-[300px] overflow-y-auto space-y-3">
            <div className="bg-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm text-xs text-slate-800 space-y-1 max-w-[88%]">
              <p>👋 Hi there! Welcome to FutureBridge Technologies.</p>
              <p>How can we assist your U.S. IT placement search today?</p>
              <span className="block text-[10px] text-slate-400 text-right mt-1">Just now</span>
            </div>

            {/* Quick Action Chips */}
            <div className="space-y-1.5 pt-1">
              <button
                onClick={() =>
                  handleSend(
                    "Hi! I want to know about F-1 OPT / STEM OPT job placement programs."
                  )
                }
                className="w-full text-left text-xs font-semibold bg-white border border-[#25D366] text-[#128C7E] hover:bg-[#25D366] hover:text-white p-2 rounded-xl transition-colors shadow-sm"
              >
                ⚡ OPT / STEM OPT Placement
              </button>
              <button
                onClick={() =>
                  handleSend(
                    "Hello, I need guidance regarding H-1B sponsorship companies."
                  )
                }
                className="w-full text-left text-xs font-semibold bg-white border border-[#25D366] text-[#128C7E] hover:bg-[#25D366] hover:text-white p-2 rounded-xl transition-colors shadow-sm"
              >
                💼 H-1B Sponsorship Jobs
              </button>
              <button
                onClick={() =>
                  handleSend(
                    "Hi, can you share the fees & program details for placement training?"
                  )
                }
                className="w-full text-left text-xs font-semibold bg-white border border-[#25D366] text-[#128C7E] hover:bg-[#25D366] hover:text-white p-2 rounded-xl transition-colors shadow-sm"
              >
                📋 Fees & Package Details
              </button>
            </div>
          </div>

          {/* Footer Input */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center space-x-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(inputMsg)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-100 text-slate-900 placeholder:text-slate-400 text-xs px-3 py-2 rounded-full outline-none focus:ring-1 focus:ring-[#25D366]"
            />
            <button
              onClick={() => handleSend(inputMsg)}
              className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:bg-[#128C7E] transition-colors shrink-0"
              aria-label="Send Message"
            >
              <FaPaperPlane className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={toggleOpen}
        aria-label="Chat on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg shadow-green-500/30 hover:bg-[#20ba5a] hover:scale-105 transition-all duration-300 group"
      >
        <FaWhatsapp className="w-8 h-8" />
        {hasUnread && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[11px] font-extrabold flex items-center justify-center rounded-full border-2 border-white animate-pulse">
            1
          </span>
        )}
        <span className="absolute right-16 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat with us
        </span>
      </button>
    </div>
  );
}
