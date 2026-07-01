import { useState, useRef } from "react";

function trackDemo(action, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', `demo_${action}`, { event_label: 'gbp_optimizer', event_category: 'demos', ...params });
  }
}

const CHECKLIST = [
  { label: "24 high-quality photos added", done: true },
  { label: "Weekly Google Posts scheduled", done: true },
  { label: "Review responses automated", done: true },
  { label: "Business hours updated for holidays", done: true },
  { label: "Q&A section pre-filled with FAQs", done: true },
  { label: "Service areas and categories optimized", done: true },
];

function ScoreCircle({ score, color }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  const strokeColor = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative h-24 w-24">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900">{score}</span>
        <span className="text-[10px] text-slate-500">/100</span>
      </div>
    </div>
  );
}

function GbpListing({ type }) {
  const isBefore = type === "before";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg ${isBefore ? "bg-slate-100" : "bg-teal-50"}`}>
          <span className="text-2xl">🦷</span>
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-slate-900">Dr. Smith Dental</h4>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs ${isBefore ? "text-amber-500" : "text-amber-500"}`}>
              ★ {isBefore ? "3.2" : "4.8"}
            </span>
            <span className="text-xs text-slate-400">({isBefore ? "30" : "127"} reviews)</span>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {isBefore ? "Dentist · Open hours may vary" : "Dentist · Open now · Closes 6 PM"}
          </p>
        </div>
      </div>

      {!isBefore && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 w-20 shrink-0 rounded-lg bg-gradient-to-br from-teal-100 to-teal-50" />
          ))}
        </div>
      )}

      {isBefore && (
        <div className="mt-3 flex gap-2">
          <div className="h-16 w-20 rounded-lg bg-slate-100" />
        </div>
      )}

      {!isBefore && (
        <div className="mt-3 rounded-lg bg-slate-50 p-2">
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-teal-700">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
            Latest post: "Spring special — 20% off teeth whitening! 🌸 Book now →"
          </div>
        </div>
      )}

      {isBefore && (
        <div className="mt-3 rounded-lg bg-slate-50 p-2">
          <p className="text-[10px] text-slate-400">No recent posts</p>
        </div>
      )}

      {isBefore && (
        <div className="mt-3 space-y-1.5">
          {["No photos", "No posts", "2 reviews", "Hours outdated"].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[10px] text-red-500">
              <span>✗</span> {item}
            </div>
          ))}
        </div>
      )}

      {!isBefore && (
        <div className="mt-3 space-y-1.5">
          {["24 photos", "Weekly posts", "127 reviews", "Hours current"].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[10px] text-emerald-600">
              <span>✓</span> {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GbpOptimizerDemo() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = (clientX) => {
    if (!containerRef.current || !isDragging.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(5, Math.min(95, x)));
  };

  const handleMouseDown = () => {
    isDragging.current = true;
    trackDemo('gbp_slider_started');
  };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e) => handleMove(e.clientX);
  const handleTouchMove = (e) => handleMove(e.touches[0].clientX);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="grid gap-6 md:grid-cols-[1fr_200px]">
        <div>
          <div
            ref={containerRef}
            className="relative select-none overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            <div className="p-1">
              <div style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }} className="relative">
                <GbpListing type="before" />
                <div className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
                  BEFORE
                </div>
              </div>
              <div style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }} className="absolute inset-0 p-1">
                <GbpListing type="after" />
                <div className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
                  AFTER
                </div>
              </div>
            </div>

            <div
              className="absolute top-0 z-10 flex h-full cursor-ew-resize items-center"
              style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              <div className="h-full w-0.5 bg-white shadow-lg" />
              <div className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-teal-500">
                <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">← Drag the slider to compare →</p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Profile Score</p>
            <div className="mt-2 flex justify-center">
              <ScoreCircle score={sliderPos > 50 ? 94 : 42} />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">What we fix</p>
            <div className="mt-2 space-y-2">
              {CHECKLIST.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[11px] leading-tight text-slate-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <a
            href="/schedule"
            className="block w-full rounded-xl bg-teal-600 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Optimize My GBP
          </a>
        </div>
      </div>
    </div>
  );
}
