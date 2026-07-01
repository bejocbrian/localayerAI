import { useState, useEffect, useRef } from "react";

function trackDemo(action, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', `demo_${action}`, { event_label: 'lead_speed_race', event_category: 'demos', ...params });
  }
}

const MANUAL_STEPS = [
  { time: "2:15 PM", event: "New lead arrives from Google", icon: "🔔", detail: "\"Hi, I need a quote for a new website\"" },
  { time: "2:15 PM", event: "Owner is on a job site", icon: "🔨", detail: "No one sees the message" },
  { time: "4:30 PM", event: "Owner checks phone during break", icon: "📱", detail: "Sees 12 other notifications mixed in" },
  { time: "6:00 PM", event: "Gets home, remembers to reply", icon: "🏠", detail: "Opens the message" },
  { time: "8:12 PM", event: "Sends a reply", icon: "✉️", detail: "\"Hi, sorry for the late response. Can you tell me more?\"" },
  { time: "8:15 PM", event: "Customer already booked with competitor", icon: "❌", detail: "Lost revenue: ~$2,000" },
];

const AI_STEPS = [
  { time: "2:15 PM", event: "New lead arrives from Google", icon: "🔔", detail: "\"Hi, I need a quote for a new website\"" },
  { time: "2:15 PM", event: "AI responds instantly", icon: "🤖", detail: "\"Hi! I'd love to help you with a new website...\"" },
  { time: "2:16 PM", event: "AI qualifies the lead", icon: "✅", detail: "Asks about business type, budget, timeline" },
  { time: "2:17 PM", event: "AI books a consultation call", icon: "📅", detail: "\"I've reserved Thursday at 2 PM for you!\"" },
  { time: "2:17 PM", event: "Owner gets a lead summary", icon: "📋", detail: "Name, needs, budget, and booked call — all ready" },
  { time: "2:17 PM", event: "Lead captured & qualified", icon: "💰", detail: "No revenue lost. Owner focuses on the job site" },
];

export default function LeadSpeedRaceDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [manualStep, setManualStep] = useState(-1);
  const [aiStep, setAiStep] = useState(-1);
  const timerRef = useRef(null);

  const startRace = () => {
    trackDemo('race_started');
    setIsPlaying(true);
    setManualStep(-1);
    setAiStep(-1);

    let mIdx = 0;
    let aIdx = 0;

    const tick = () => {
      if (aIdx <= AI_STEPS.length - 1) {
        setAiStep(aIdx);
        aIdx++;
      }
      if (mIdx <= MANUAL_STEPS.length - 1 && aIdx > 1) {
        setTimeout(() => setManualStep(mIdx), 400);
        mIdx++;
      }
      if (aIdx <= AI_STEPS.length - 1 || mIdx <= MANUAL_STEPS.length - 1) {
        timerRef.current = setTimeout(tick, 1000);
      } else {
        trackDemo('race_completed');
        setIsPlaying(false);
      }
    };
    tick();
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setManualStep(-1);
    setAiStep(-1);
  };

  const renderTimeline = (steps, activeStep, isAI) => {
    return (
      <div className="space-y-0">
        {steps.map((step, i) => {
          const isActive = i <= activeStep;
          const isCurrent = i === activeStep;
          const isLast = i === steps.length - 1 && isActive;
          const isLoss = !isAI && isLast;
          const isWin = isAI && isLast;

          return (
            <div
              key={i}
              className="flex gap-3"
              style={{
                opacity: isActive ? 1 : 0.15,
                transform: isCurrent ? "scale(1.02)" : "scale(1)",
                transition: "all 0.4s ease-out",
              }}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                    isWin
                      ? "bg-emerald-100 ring-2 ring-emerald-400"
                      : isLoss
                      ? "bg-red-100 ring-2 ring-red-400"
                      : isActive
                      ? isAI
                        ? "bg-teal-100"
                        : "bg-slate-100"
                      : "bg-slate-50"
                  }`}
                >
                  {step.icon}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-0.5 flex-1 ${isActive ? (isAI ? "bg-teal-200" : "bg-slate-200") : "bg-slate-100"}`} />
                )}
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-medium text-slate-400">{step.time}</span>
                </div>
                <p className={`text-sm font-medium ${isWin ? "text-emerald-700" : isLoss ? "text-red-600" : "text-slate-900"}`}>
                  {step.event}
                </p>
                {isActive && (
                  <p className="mt-0.5 text-xs text-slate-500" style={{ animation: "msg-appear 0.3s ease-out forwards" }}>
                    {step.detail}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="grid gap-0 md:grid-cols-2">
        <div className={`rounded-l-2xl border border-r-0 border-slate-200 bg-white p-5 ${aiStep >= AI_STEPS.length - 1 && manualStep < MANUAL_STEPS.length - 1 ? "ring-2 ring-emerald-200" : ""}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs">❌</span>
                <h4 className="text-sm font-bold text-slate-900">Without AI</h4>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">Manual follow-up</p>
            </div>
            {isPlaying && manualStep >= 0 && (
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-600">
                {MANUAL_STEPS[Math.min(manualStep, MANUAL_STEPS.length - 1)]?.time}
              </span>
            )}
          </div>
          <div className="mt-4">
            {renderTimeline(MANUAL_STEPS, manualStep, false)}
          </div>
          {manualStep >= MANUAL_STEPS.length - 1 && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center" style={{ animation: "msg-appear 0.3s ease-out forwards" }}>
              <p className="text-sm font-bold text-red-700">Revenue Lost: ~$2,000</p>
              <p className="mt-0.5 text-xs text-red-500">Response time: 6 hours</p>
            </div>
          )}
        </div>

        <div className={`rounded-r-2xl border border-l-0 border-slate-200 bg-white p-5 ${aiStep >= AI_STEPS.length - 1 ? "ring-2 ring-emerald-200" : ""}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs">✅</span>
                <h4 className="text-sm font-bold text-slate-900">With AI</h4>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">Instant automated response</p>
            </div>
            {isPlaying && aiStep >= 0 && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                {AI_STEPS[Math.min(aiStep, AI_STEPS.length - 1)]?.time}
              </span>
            )}
          </div>
          <div className="mt-4">
            {renderTimeline(AI_STEPS, aiStep, true)}
          </div>
          {aiStep >= AI_STEPS.length - 1 && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center" style={{ animation: "msg-appear 0.3s ease-out forwards" }}>
              <p className="text-sm font-bold text-emerald-700">Lead Captured ✅</p>
              <p className="mt-0.5 text-xs text-emerald-600">Response time: 30 seconds</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-3">
        <button
          onClick={startRace}
          disabled={isPlaying}
          className="rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
        >
          {isPlaying ? "Race in progress..." : manualStep >= 0 ? "Watch again" : "▶ Play the Speed Race"}
        </button>
        {manualStep >= 0 && (
          <button
            onClick={reset}
            className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Reset
          </button>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-4 text-center">
        <p className="text-sm font-medium text-slate-900">78% of customers buy from the first responder</p>
        <p className="mt-1 text-xs text-slate-500">Source: Drift "State of Sales" Report</p>
      </div>
    </div>
  );
}
