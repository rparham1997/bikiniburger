"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { buildContactHref, site } from "@/lib/site";

const fields = ["Name", "Phone", "Event date", "Pickup time", "Headcount"];

export function CateringForm() {
  const [requestHref, setRequestHref] = useState("");
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  return (
    <form
      className="rounded-lg border border-black/10 bg-white p-6 shadow-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const detailValues = Object.fromEntries(fields.map((label) => [label, String(form.get(label) || "")]));
        const body = [
          "Catering request",
          "",
          ...fields.map((label) => `${label}: ${detailValues[label]}`),
          "",
          "Order details:",
          String(form.get("Order details") || "")
        ].join("\n");

        setRequestHref(buildContactHref("Bikini Burger catering request", body));
        setStatus("");
        setIsSending(true);

        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "catering",
              subject: "Bikini Burger catering request",
              name: detailValues.Name,
              phone: detailValues.Phone,
              message: String(form.get("Order details") || ""),
              details: {
                "Event date": detailValues["Event date"],
                "Pickup time": detailValues["Pickup time"],
                Headcount: detailValues.Headcount
              }
            })
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Unable to send catering request.");
          }
          setReady(true);
          setStatus("Catering request sent to the shop.");
          event.currentTarget.reset();
        } catch (error) {
          setReady(true);
          setStatus(error instanceof Error ? error.message : "Catering request draft ready.");
        } finally {
          setIsSending(false);
        }
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((label) => (
          <label key={label} className="grid gap-2 text-sm font-bold text-black/70">
            {label}
            <input
              name={label}
              required
              className="focus-ring rounded-md border border-black/15 px-4 py-3 text-base font-normal"
            />
          </label>
        ))}
        <label className="grid gap-2 text-sm font-bold text-black/70 md:col-span-2">
          What should we make?
          <textarea
            name="Order details"
            required
            rows={5}
            className="focus-ring rounded-md border border-black/15 px-4 py-3 text-base font-normal"
            placeholder="Burgers, fries, sodas, platters, merch add-ons..."
          />
        </label>
        <button
          disabled={isSending}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-burger-red disabled:cursor-not-allowed disabled:bg-black/35 md:col-span-2"
        >
          <Send size={18} /> {isSending ? "Sending" : "Send catering request"}
        </button>
        {ready && (
          <div className="rounded-md bg-burger-cream px-4 py-3 text-sm font-bold text-black md:col-span-2">
            <p>{status}</p>
            {status !== "Catering request sent to the shop." && (
              <a href={requestHref} className="mt-3 inline-flex text-burger-red underline">
                Open {site.email ? "email" : "text"} request
              </a>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
