"use client";
import { useState } from "react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "General", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // In production: POST to /api/contact which sends via Resend
    // For now simulate success
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className="card p-10 text-center border border-green-200 bg-green-50">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="font-fredoka text-2xl font-bold text-gray-800 mb-2">Message sent!</h2>
        <p className="text-gray-500">We&apos;ll get back to you within 1 business day.</p>
      </div>
    );
  }

  return (
    <div className="card p-8 border border-orange-100">
      <h2 className="font-fredoka text-2xl font-bold text-gray-800 mb-6">Send us a message</h2>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Your name</label>
          <input id="name" type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none font-medium"
            placeholder="Jane Smith" />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-bold text-gray-700 mb-2">Email address</label>
          <input id="contact-email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none font-medium"
            placeholder="jane@example.com" />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
          <select id="subject" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none font-medium bg-white">
            <option>General</option>
            <option>Technical support</option>
            <option>Billing</option>
            <option>Privacy / data request</option>
            <option>Safety concern</option>
            <option>Partnership</option>
            <option>Press</option>
          </select>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">Message</label>
          <textarea id="message" required rows={5} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none font-medium resize-none"
            placeholder="How can we help?" />
        </div>
        <button type="submit" disabled={status === "sending" || !form.name || !form.email || !form.message}
          className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
          {status === "sending" ? "Sending…" : "Send Message →"}
        </button>
      </form>
    </div>
  );
}
