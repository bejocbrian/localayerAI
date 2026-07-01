import { useState, useRef, useEffect } from "react";

function trackDemo(action, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', `demo_${action}`, { event_label: 'ai_chatbot', event_category: 'demos', ...params });
  }
}

const CONVERSATIONS = {
  pricing: {
    messages: [
      { role: "user", text: "How much does a website cost?" },
      { role: "ai", text: "Great question! Our websites start at $499 for a professional 5-page site. We also have packages that include booking systems, SEO, and ongoing support. What kind of business do you run?" },
      { role: "user", text: "I own a dental practice" },
      { role: "ai", text: "Perfect — we've built sites for dental practices before. A typical setup with online booking, patient forms, and local SEO runs about $899. Want me to schedule a free 15-minute call to walk you through it?" },
    ],
    followUp: "Book a Free Call",
  },
  availability: {
    messages: [
      { role: "user", text: "Do you have availability this week?" },
      { role: "ai", text: "Yes! We have openings on Wednesday and Thursday. We can do a quick discovery call to understand your needs — it only takes 15 minutes. What works better for you?" },
      { role: "user", text: "Thursday afternoon works" },
      { role: "ai", text: "You're booked! I've reserved Thursday at 2:00 PM for a free consultation. You'll get a calendar invite and reminder text shortly. Looking forward to it!" },
    ],
    followUp: "View Available Slots",
  },
  seo: {
    messages: [
      { role: "user", text: "I need help with my Google ranking" },
      { role: "ai", text: "Local SEO is one of our specialties. Most of our clients see a 2-3x increase in Google views within 90 days. We handle your Google Business Profile, reviews, and local citations. What's your current Google rating?" },
      { role: "user", text: "We have a 4.1 with about 30 reviews" },
      { role: "ai", text: "That's a solid start! We can get you to 4.7+ with automated review requests and response management. Our clients typically gain 15-20 new reviews per month. Ready to see what we can do?" },
    ],
    followUp: "Get a Free SEO Audit",
  },
  automation: {
    messages: [
      { role: "user", text: "Can you automate appointment reminders?" },
      { role: "ai", text: "Absolutely! Our automated system sends SMS and email reminders at 48 hours, 24 hours, and 2 hours before the appointment. Clients typically see no-show rates drop from 18% to under 5%. We can set this up in about 48 hours." },
      { role: "user", text: "That sounds amazing, how much?" },
      { role: "ai", text: "The booking + reminder system starts at $299/month with no setup fees. It pays for itself with just 2-3 saved appointments per month. Want to see a live demo of how it works?" },
    ],
    followUp: "See Live Demo",
  },
};

const PROMPTS = [
  { id: "pricing", label: "How much does a website cost?", icon: "💰" },
  { id: "availability", label: "Do you have availability this week?", icon: "📅" },
  { id: "seo", label: "I need help with my Google ranking", icon: "🔍" },
  { id: "automation", label: "Can you automate appointment reminders?", icon: "⚡" },
];

export default function AiChatbotDemo() {
  const [activeConvo, setActiveConvo] = useState(null);
  const [visibleMsgs, setVisibleMsgs] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [visibleMsgs, showFollowUp]);

  const startConversation = (id) => {
    trackDemo('chatbot_started', { topic: id });
    const convo = CONVERSATIONS[id];
    setActiveConvo(id);
    setVisibleMsgs([]);
    setIsTyping(false);
    setShowFollowUp(false);

    let i = 0;
    const showNext = () => {
      if (i < convo.messages.length) {
        const msg = convo.messages[i];
        if (msg.role === "ai") {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setVisibleMsgs((prev) => [...prev, msg]);
            i++;
            setTimeout(showNext, 400);
          }, 1200);
        } else {
          setVisibleMsgs((prev) => [...prev, msg]);
          i++;
          setTimeout(showNext, 600);
        }
      } else {
        setTimeout(() => setShowFollowUp(true), 600);
      }
    };
    setTimeout(showNext, 300);
  };

  const reset = () => {
    setActiveConvo(null);
    setVisibleMsgs([]);
    setIsTyping(false);
    setShowFollowUp(false);
  };

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="bg-teal-600 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Localayer Assistant</div>
              <div className="flex items-center gap-1.5 text-xs text-teal-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Online — typically replies instantly
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-80 flex-col gap-3 overflow-y-auto p-4">
          {!activeConvo && (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-2xl">
                💬
              </div>
              <p className="text-sm font-medium text-slate-900">Try our AI assistant</p>
              <p className="mt-1 text-xs text-slate-500">
                This is a preview of what your customers would experience
              </p>
            </div>
          )}

          {visibleMsgs.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              style={{ animation: "msg-appear 0.3s ease-out forwards" }}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-teal-600 text-white rounded-br-md"
                    : "bg-slate-100 text-slate-800 rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start" style={{ animation: "msg-appear 0.2s ease-out forwards" }}>
              <div className="flex gap-1 rounded-2xl bg-slate-100 px-4 py-3 rounded-bl-md">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 rounded-full bg-slate-400"
                    style={{
                      animation: `typing-dot 1.2s infinite`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {showFollowUp && (
            <div className="flex justify-start" style={{ animation: "msg-appear 0.4s ease-out forwards" }}>
              <a
                href="/schedule"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700"
              >
                {CONVERSATIONS[activeConvo].followUp}
                <span>→</span>
              </a>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="border-t border-slate-100 bg-slate-50 p-3">
          {!activeConvo ? (
            <div className="flex flex-wrap gap-2">
              {PROMPTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => startConversation(p.id)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                >
                  <span className="mr-1">{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-400">Demo conversation</div>
              <button
                onClick={reset}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
              >
                Try another topic
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
