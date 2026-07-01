import { useState, useEffect } from "react";

function trackDemo(action, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', `demo_${action}`, { event_label: 'review_engine', event_category: 'demos', ...params });
  }
}

const REVIEWS_TIMELINE = [
  { day: "Day 1", count: 3, total: 32, rating: "4.2" },
  { day: "Day 14", count: 11, total: 40, rating: "4.4" },
  { day: "Day 30", count: 22, total: 51, rating: "4.6" },
  { day: "Day 60", count: 35, total: 64, rating: "4.7" },
  { day: "Day 90", count: 47, total: 76, rating: "4.8" },
];

const REVIEW_SNIPPETS = [
  { name: "Maria G.", stars: 5, text: "Best dental experience ever! The staff was incredibly gentle and professional." },
  { name: "James L.", stars: 5, text: "Quick, painless, and they explained everything. Highly recommend!" },
  { name: "Priya S.", stars: 5, text: "My kids actually look forward to their appointments now. Amazing!" },
];

function StarRating({ count, size = "h-4 w-4" }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`${size} ${s <= count ? "text-amber-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewEngineDemo() {
  const [phase, setPhase] = useState("sms");
  const [activeTimeline, setActiveTimeline] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const startTimeline = () => {
    trackDemo('review_timeline_started');
    setIsPlaying(true);
    setActiveTimeline(-1);
    let step = 0;
    const advance = () => {
      if (step < REVIEWS_TIMELINE.length) {
        setActiveTimeline(step);
        step++;
        setTimeout(advance, 1200);
      } else {
        setIsPlaying(false);
      }
    };
    advance();
  };

  const reset = () => {
    setPhase("sms");
    setActiveTimeline(-1);
    setIsPlaying(false);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 p-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Step 1: Customer gets an SMS</h4>
            {phase === "sms" ? (
              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-slate-100 px-3 py-1.5 text-center text-xs font-medium text-slate-500">iPhone</div>
                <div className="p-3">
                  <div className="flex items-start gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                      DS
                    </div>
                    <div className="rounded-2xl rounded-tl-md bg-blue-500 px-3.5 py-2 text-sm text-white">
                      <p>Hi Sarah! Thanks for visiting Dr. Smith's office today 😊</p>
                      <p className="mt-1.5">Could you take 30 seconds to leave us a review? It means the world to us!</p>
                      <p className="mt-1">
                        <span className="underline">https://g.page/r/abc123/review</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span>Delivered</span>
                    <span>·</span>
                    <span>2:30 PM</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Review Request Sent</p>
                    <p className="text-xs text-slate-500">Customer taps the link → leaves a review</p>
                  </div>
                </div>
              </div>
            )}
            {phase === "sms" && (
              <button
                onClick={() => setPhase("review")}
                className="mt-3 w-full rounded-xl bg-teal-600 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-700"
              >
                Tap the review link →
              </button>
            )}
          </div>

          {phase === "review" && (
            <div className="rounded-2xl bg-slate-50 p-5" style={{ animation: "msg-appear 0.3s ease-out forwards" }}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Step 2: One-tap review page</h4>
              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <span className="text-xl">🦷</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">Dr. Smith Dental</p>
                <p className="mt-1 text-xs text-slate-500">How was your experience?</p>
                <div className="mt-3 flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => { trackDemo('review_tap_submitted'); setPhase("done"); }}
                      className="transition-transform hover:scale-110"
                    >
                      <svg className={`h-8 w-8 ${s <= 5 ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-slate-400">Tap a star to rate</p>
              </div>
            </div>
          )}

          {phase === "done" && (
            <div className="rounded-2xl bg-slate-50 p-5" style={{ animation: "msg-appear 0.3s ease-out forwards" }}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Step 3: Review posted on Google</h4>
              <div className="mt-3 space-y-2">
                {REVIEW_SNIPPETS.map((r, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                    style={{ animation: `msg-appear 0.3s ease-out ${i * 0.2}s forwards`, opacity: 0 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-[10px] font-bold text-teal-700">
                        {r.name[0]}
                      </div>
                      <div>
                        <span className="text-xs font-medium text-slate-900">{r.name}</span>
                        <StarRating count={r.stars} size="h-3 w-3" />
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your Google Rating Over Time</h4>
          <div className="mt-3 flex items-end gap-3">
            <div className="text-4xl font-bold text-amber-400">
              {activeTimeline >= 0 ? REVIEWS_TIMELINE[activeTimeline].rating : "4.1"}
            </div>
            <div className="mb-1">
              <StarRating count={activeTimeline >= 0 ? Math.round(parseFloat(REVIEWS_TIMELINE[activeTimeline].rating)) : 4} size="h-4 w-4" />
              <p className="mt-0.5 text-xs text-slate-400">
                {activeTimeline >= 0 ? REVIEWS_TIMELINE[activeTimeline].total : 30} total reviews
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {REVIEWS_TIMELINE.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-14 text-xs text-slate-400">{t.day}</span>
                <div className="flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-2.5 rounded-full bg-amber-400 transition-all duration-700"
                    style={{
                      width: i <= activeTimeline ? `${(t.count / 47) * 100}%` : "0%",
                      opacity: i <= activeTimeline ? 1 : 0.3,
                    }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-medium text-white">
                  +{i <= activeTimeline ? t.count : 0}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={startTimeline}
            disabled={isPlaying}
            className="mt-5 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-amber-400 disabled:opacity-50"
          >
            {isPlaying ? "Growing reviews..." : activeTimeline >= 0 ? "Watch again" : "Watch 90-Day Review Growth"}
          </button>

          <button
            onClick={reset}
            className="mt-2 w-full rounded-xl bg-white/10 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/20"
          >
            Reset demo
          </button>
        </div>
      </div>
    </div>
  );
}
