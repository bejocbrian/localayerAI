import { useState } from "react";

function trackDemo(action, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', `demo_${action}`, { event_label: 'booking_system', event_category: 'demos', ...params });
  }
}

const SERVICES = [
  { id: "cleaning", name: "Deep Cleaning", duration: "60 min", price: "$120" },
  { id: "whitening", name: "Teeth Whitening", duration: "45 min", price: "$250" },
  { id: "checkup", name: "Regular Checkup", duration: "30 min", price: "$80" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const TIMES = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"];

function getWeekDates() {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() + ((1 - today.getDay() + 7) % 7 || 7));
  return DAYS.map((day, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { day, date: d.getDate(), month: d.toLocaleString("default", { month: "short" }), full: d };
  });
}

const TAKEN_SLOTS = { 0: [2, 5], 1: [0, 3, 7], 2: [1, 6, 9], 3: [4, 8], 4: [0, 2, 10] };

export default function BookingSystemDemo() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState(null);
  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);
  const [name, setName] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const weekDates = getWeekDates();
  const takenForDay = day !== null ? (TAKEN_SLOTS[day] || []) : [];

  const handleConfirm = () => {
    if (name.trim()) {
      trackDemo('booking_completed', { service: service?.name });
      setConfirmed(true);
    }
  };

  const reset = () => {
    setStep(1);
    setService(null);
    setDay(null);
    setTime(null);
    setName("");
    setConfirmed(false);
  };

  const progress = confirmed ? 100 : ((step - 1) / 3) * 100;

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white">Book an Appointment</div>
            {!confirmed && (
              <div className="text-xs text-teal-100">Step {step} of 3</div>
            )}
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="p-5">
          {confirmed ? (
            <div style={{ animation: "msg-appear 0.4s ease-out forwards" }}>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                  <svg className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">You're Booked!</h3>
                <p className="mt-1 text-sm text-slate-500">Confirmation sent to your phone</p>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service</span>
                    <span className="font-medium text-slate-900">{service?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date</span>
                    <span className="font-medium text-slate-900">
                      {weekDates[day]?.day}, {weekDates[day]?.month} {weekDates[day]?.date}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time</span>
                    <span className="font-medium text-slate-900">{time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Duration</span>
                    <span className="font-medium text-slate-900">{service?.duration}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 p-3">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 text-sm">📱</span>
                  <div>
                    <p className="text-xs font-medium text-teal-800">SMS Reminder Preview</p>
                    <p className="mt-1 text-xs leading-relaxed text-teal-700">
                      "Hi {name || "Sarah"}! Your {service?.name} is confirmed for {weekDates[day]?.day} at {time}. Reply CONFIRM to confirm or call us to reschedule."
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={reset}
                className="mt-4 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                Book another appointment
              </button>
            </div>
          ) : step === 1 ? (
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Select a service</h4>
              <div className="mt-3 space-y-2">
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setService(s); setStep(2); trackDemo('booking_service_selected', { service: s.name }); }}
                    className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-all ${
                      service?.id === s.id
                        ? "border-teal-600 bg-teal-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900">{s.name}</div>
                      <div className="text-xs text-slate-500">{s.duration}</div>
                    </div>
                    <div className="text-sm font-bold text-teal-600">{s.price}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : step === 2 ? (
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Pick a date</h4>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {weekDates.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => { setDay(i); setStep(3); }}
                    className={`flex flex-col items-center rounded-xl border-2 p-3 transition-all ${
                      day === i
                        ? "border-teal-600 bg-teal-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-xs font-medium text-slate-500">{d.day}</span>
                    <span className="mt-1 text-lg font-bold text-slate-900">{d.date}</span>
                    <span className="text-xs text-slate-400">{d.month}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="mt-3 text-xs font-medium text-slate-500 hover:text-slate-700">
                ← Back to services
              </button>
            </div>
          ) : step === 3 ? (
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Choose a time</h4>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {TIMES.map((t, i) => {
                  const taken = takenForDay.includes(i);
                  return (
                    <button
                      key={i}
                      disabled={taken}
                      onClick={() => setTime(t)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                        taken
                          ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                          : time === t
                          ? "border-teal-600 bg-teal-50 text-teal-700"
                          : "border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {taken ? "Taken" : t}
                    </button>
                  );
                })}
              </div>
              {time && (
                <div className="mt-4" style={{ animation: "msg-appear 0.3s ease-out forwards" }}>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-3 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <button
                    onClick={handleConfirm}
                    disabled={!name.trim()}
                    className="w-full rounded-xl bg-teal-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Confirm Booking
                  </button>
                </div>
              )}
              <button onClick={() => setStep(2)} className="mt-3 text-xs font-medium text-slate-500 hover:text-slate-700">
                ← Back to dates
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
