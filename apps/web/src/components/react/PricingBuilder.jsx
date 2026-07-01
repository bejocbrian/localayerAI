import { useState } from "react";

function trackEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, { event_category: 'pricing_builder', ...params });
  }
}

const SERVICE_OPTIONS = [
  { id: "website", label: "Website", description: "Professional website design and development", basePrice: 499 },
  { id: "ecommerce", label: "E-Commerce", description: "Online store with payment processing", basePrice: 999 },
  { id: "booking", label: "Booking System", description: "Online appointment scheduling", basePrice: 299 },
  { id: "crm", label: "CRM Setup", description: "Customer relationship management", basePrice: 199 },
  { id: "automation", label: "Automation", description: "Workflow and process automation", basePrice: 399 },
  { id: "seo", label: "SEO", description: "Search engine optimization", basePrice: 249 },
  { id: "email-marketing", label: "Email Marketing", description: "Email campaign setup and automation", basePrice: 199 },
  { id: "analytics", label: "Analytics Dashboard", description: "Custom reporting and analytics", basePrice: 149 },
  { id: "ai-chatbot", label: "AI Chatbot", description: "24/7 AI-powered customer assistant", basePrice: 399 },
  { id: "google-business", label: "Google Business Profile", description: "Local search optimization and management", basePrice: 149 },
  { id: "social-media", label: "Social Media Management", description: "Content creation and scheduling", basePrice: 299 },
  { id: "paid-ads", label: "Paid Ads Management", description: "Google Ads and Meta Ads campaigns", basePrice: 399 },
  { id: "reputation", label: "Reputation Management", description: "Review solicitation and brand monitoring", basePrice: 199 },
  { id: "mobile-app", label: "Mobile App / PWA", description: "Progressive Web App development", basePrice: 1499 },
  { id: "video-production", label: "Video Production", description: "Promotional and social media videos", basePrice: 499 },
  { id: "managed-it", label: "IT Support & Managed Services", description: "Ongoing tech support and maintenance", basePrice: 199 },
];

const ADD_ONS = [
  { id: "priority-support", label: "Priority Support", price: 99, period: "mo" },
  { id: "monthly-maintenance", label: "Monthly Maintenance", price: 149, period: "mo" },
  { id: "content-writing", label: "Content Writing", price: 199, period: "one-time" },
  { id: "logo-design", label: "Logo Design", price: 299, period: "one-time" },
];

export default function PricingBuilder() {
  const [selected, setSelected] = useState([]);
  const [addOns, setAddOns] = useState([]);

  const toggleService = (id) => {
    setSelected((prev) => {
      const isRemoving = prev.includes(id);
      trackEvent(isRemoving ? 'pricing_service_deselected' : 'pricing_service_selected', { service_id: id });
      return isRemoving ? prev.filter((s) => s !== id) : [...prev, id];
    });
  };

  const toggleAddOn = (id) => {
    setAddOns((prev) => {
      const isRemoving = prev.includes(id);
      trackEvent(isRemoving ? 'pricing_addon_deselected' : 'pricing_addon_selected', { addon_id: id });
      return isRemoving ? prev.filter((a) => a !== id) : [...prev, id];
    });
  };

  const servicesTotal = SERVICE_OPTIONS
    .filter((s) => selected.includes(s.id))
    .reduce((sum, s) => sum + s.basePrice, 0);

  const addOnsTotal = ADD_ONS
    .filter((a) => addOns.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);

  const subtotal = servicesTotal + addOnsTotal;

  const discountRate = subtotal >= 2500 ? 0.15 : subtotal >= 1500 ? 0.10 : 0;
  const discountAmount = Math.round(subtotal * discountRate);
  const total = subtotal - discountAmount;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Select Services</h3>
          <p className="mt-1 text-sm text-slate-600">Choose the services your business needs.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {SERVICE_OPTIONS.map((service) => {
              const isSelected = selected.includes(service.id);
              return (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    isSelected
                      ? "border-teal-600 bg-teal-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-slate-900">{service.label}</div>
                      <div className="mt-0.5 text-xs text-slate-500">{service.description}</div>
                    </div>
                    <div className="shrink-0 text-sm font-bold text-teal-600">${service.basePrice}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {selected.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-900">Add-Ons</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {ADD_ONS.map((addOn) => {
                  const isSelected = addOns.includes(addOn.id);
                  return (
                    <button
                      key={addOn.id}
                      onClick={() => toggleAddOn(addOn.id)}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        isSelected
                          ? "border-teal-600 bg-teal-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-slate-900">{addOn.label}</div>
                          <div className="mt-0.5 text-xs text-slate-500">${addOn.price}/{addOn.period}</div>
                        </div>
                        <div className="h-5 w-5 rounded border-2 border-slate-300" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="h-fit sticky top-24">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Your Estimate</h3>
            {selected.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                Select services to see your custom quote.
              </p>
            ) : (
              <>
                <div className="mt-4 space-y-3">
                  {SERVICE_OPTIONS.filter((s) => selected.includes(s.id)).map((s) => (
                    <div key={s.id} className="flex justify-between text-sm">
                      <span className="text-slate-600">{s.label}</span>
                      <span className="font-medium text-slate-900">${s.basePrice}</span>
                    </div>
                  ))}
                  {ADD_ONS.filter((a) => addOns.includes(a.id)).map((a) => (
                    <div key={a.id} className="flex justify-between text-sm">
                      <span className="text-slate-600">{a.label}</span>
                      <span className="font-medium text-slate-900">${a.price}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-slate-200 pt-4 space-y-2">
                  {discountAmount > 0 && (
                    <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-emerald-700">
                          Bundle Discount ({discountRate * 100}% off)
                        </span>
                        <span className="font-semibold text-emerald-600">-${discountAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-lg font-bold text-teal-600">${total.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <p className="text-xs text-emerald-600 font-medium">
                      You save ${discountAmount.toLocaleString()} on this bundle!
                    </p>
                  )}
                  {!discountAmount && subtotal < 1500 && (
                    <p className="text-xs text-slate-500">
                      Select ${1500 - subtotal} more to unlock a 10% bundle discount
                    </p>
                  )}
                  <p className="text-xs text-slate-500">Final price may vary based on requirements</p>
                </div>
                <a
                  href={`/schedule`}
                  onClick={() => trackEvent('pricing_quote_requested', {
                    total_services: selected.length,
                    total_addons: addOns.length,
                    total_value: total,
                  })}
                  className="mt-4 block w-full rounded-xl bg-teal-600 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-teal-700"
                >
                  Schedule a Call
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
