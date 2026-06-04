"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { buildContactHref, site } from "@/lib/site";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [href, setHref] = useState("");

  return (
    <form
      className="rounded-lg border border-black/10 bg-white p-6 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const name = String(form.get("name") || "");
        const email = String(form.get("email") || "");
        const message = String(form.get("message") || "");

        setHref(
          buildContactHref(
            `Website message from ${name}`,
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
          )
        );
        setSent(true);
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
        <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-burger-red">
          <Send size={18} /> Send message
        </button>
        {sent && (
          <div className="rounded-md bg-burger-cream px-4 py-3 text-sm font-bold text-black">
            <p>
              Message ready. {site.email ? "Send it to the shop email now." : "Send it to the shop by text now."}
            </p>
            <a href={href} className="mt-3 inline-flex text-burger-red underline">
              Open {site.email ? "email" : "text"} message
            </a>
          </div>
        )}
      </div>
    </form>
  );
}
