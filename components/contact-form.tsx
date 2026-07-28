"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { buildContactHref, site } from "@/lib/site";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [href, setHref] = useState("");
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  return (
    <form
      className="rounded-lg border border-black/10 bg-white p-6 shadow-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const name = String(form.get("name") || "");
        const email = String(form.get("email") || "");
        const message = String(form.get("message") || "");
        const fallbackHref = buildContactHref(
          `Website message from ${name}`,
          `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );

        setHref(fallbackHref);
        setStatus("");
        setIsSending(true);

        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "contact",
              subject: `Website message from ${name}`,
              name,
              email,
              message
            })
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Unable to send message.");
          }
          setSent(true);
          setStatus("Message sent to the shop.");
          event.currentTarget.reset();
        } catch (error) {
          setSent(true);
          setStatus(error instanceof Error ? error.message : "Message draft ready.");
        } finally {
          setIsSending(false);
        }
      }}
    >
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-bold text-black/70">
          Name
          <input
            name="name"
            required
            className="focus-ring rounded-md border border-black/15 px-4 py-3 text-base font-normal"
            placeholder="Your name"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-black/70">
          Email
          <input
            name="email"
            required
            type="email"
            className="focus-ring rounded-md border border-black/15 px-4 py-3 text-base font-normal"
            placeholder="you@example.com"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-black/70">
          Message
          <textarea
            name="message"
            required
            rows={5}
            className="focus-ring rounded-md border border-black/15 px-4 py-3 text-base font-normal"
            placeholder="Tell us what you need"
          />
        </label>
        <button
          disabled={isSending}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-burger-red disabled:cursor-not-allowed disabled:bg-black/35"
        >
          <Send size={18} /> {isSending ? "Sending" : "Send message"}
        </button>
        {sent && (
          <div className="rounded-md bg-burger-cream px-4 py-3 text-sm font-bold text-black">
            <p>{status}</p>
            {status !== "Message sent to the shop." && (
              <a href={href} className="mt-3 inline-flex text-burger-red underline">
                Open {site.email ? "email" : "text"} message
              </a>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
