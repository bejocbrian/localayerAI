import { useState } from "react";
import { getPocketBase } from "../../lib/pocketbaseClient.js";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      setStatus("idle");
      return;
    }

    try {
      const pb = getPocketBase();
      if (pb) {
        await pb.collection("contact_submissions").create({
          name: form.name,
          email: form.email,
          phone: form.phone,
          business: form.business,
          service: form.service,
          message: form.message,
        });
      }
      setStatus("success");
      setForm({ name: "", email: "", phone: "", business: "", service: "", message: "" });
    } catch (err) {
      console.error("Form submission error:", err);
      setError("Something went wrong. Please try again or email us directly.");
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
          <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">Message Sent!</h3>
        <p className="mt-2 text-sm text-slate-600">
          Thank you for reaching out. We'll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="input"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="input"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="input"
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Business Name</label>
          <input
            type="text"
            name="business"
            value={form.business}
            onChange={handleChange}
            className="input"
            placeholder="Your business name"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Service Interested In</label>
        <select
          name="service"
          value={form.service}
          onChange={handleChange}
          className="input"
        >
          <option value="">Select a service</option>
          <option value="web-development">Web Development</option>
          <option value="automation">Business Automation</option>
          <option value="tool-setup">Tool Setup & Integration</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={4}
          className="input resize-none"
          placeholder="Tell us about your project..."
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
