"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Minus, Plus, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/menu";
import { buildContactHref, site } from "@/lib/site";

export function OrderFlow() {
  const { lines, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [pickupHref, setPickupHref] = useState("");
  const tax = subtotal * 0.06;
  const total = subtotal + tax;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-4xl uppercase">Your cart</h2>
          {lines.length > 0 && (
            <button onClick={clearCart} className="text-sm font-black uppercase tracking-[0.14em] text-burger-red">
              Clear
            </button>
          )}
        </div>

        <AnimatePresence initial={false}>
          {lines.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-black/30" />
              <p className="mt-4 text-lg font-bold">Your cart is waiting.</p>
              <Link
                href="/merch"
                className="focus-ring mt-6 inline-flex rounded-full bg-burger-red px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white"
              >
                Shop merch
              </Link>
            </motion.div>
          ) : (
            <div className="mt-6 grid gap-4">
              {lines.map((line) => (
                <motion.div
                  key={line.item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid gap-4 rounded-lg border border-black/10 p-4 sm:grid-cols-[1fr_auto]"
                >
                  <div>
                    <p className="font-display text-3xl uppercase leading-none">{line.item.name}</p>
                    <p className="mt-2 text-sm text-black/60">{formatPrice(line.item.price ?? 0)} each</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <div className="flex items-center rounded-full border border-black/12">
                      <button
                        aria-label={`Decrease ${line.item.name}`}
                        onClick={() => updateQuantity(line.item.id, line.quantity - 1)}
                        className="focus-ring flex h-10 w-10 items-center justify-center rounded-full"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-black">{line.quantity}</span>
                      <button
                        aria-label={`Increase ${line.item.name}`}
                        onClick={() => updateQuantity(line.item.id, line.quantity + 1)}
                        className="focus-ring flex h-10 w-10 items-center justify-center rounded-full"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="w-20 text-right font-black">
                      {formatPrice((line.item.price ?? 0) * line.quantity)}
                    </p>
                    <button
                      aria-label={`Remove ${line.item.name}`}
                      onClick={() => removeItem(line.item.id)}
                      className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-black text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </section>

      <form
        className="h-fit rounded-lg border border-black/10 bg-black p-5 text-white shadow-loud lg:sticky lg:top-28"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const items = lines
            .map((line) => `${line.quantity}x ${line.item.name} - ${formatPrice((line.item.price ?? 0) * line.quantity)}`)
            .join("\n");

          setPickupHref(
            buildContactHref(
              "Bikini Burger merch pickup request",
              [
                "Merch pickup request",
                "",
                `Pickup name: ${form.get("pickupName") || ""}`,
                `Phone number: ${form.get("phone") || ""}`,
                `Pickup notes: ${form.get("notes") || ""}`,
                "",
                "Items:",
                items,
                "",
                `Subtotal: ${formatPrice(subtotal)}`,
                `Tax estimate: ${formatPrice(tax)}`,
                `Total: ${formatPrice(total)}`
              ].join("\n")
            )
          );
          setSubmitted(true);
        }}
      >
        <h2 className="font-display text-4xl uppercase">Store pickup</h2>
        <div className="mt-5 rounded-lg bg-white/10 p-4">
          <p className="flex gap-2 text-sm font-bold leading-6 text-white/78">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-burger-red" />
            Merch orders are picked up at {site.address}. Add preferred size/color in notes.
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          <label className="grid gap-2 text-sm font-bold text-white/72">
            Pickup name
            <input
              name="pickupName"
              required
              className="focus-ring rounded-md border border-white/12 bg-white/10 px-4 py-3 text-white"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-white/72">
            Phone number
            <input
              name="phone"
              required
              className="focus-ring rounded-md border border-white/12 bg-white/10 px-4 py-3 text-white"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-white/72">
            Pickup notes
            <textarea
              name="notes"
              rows={3}
              className="focus-ring rounded-md border border-white/12 bg-white/10 px-4 py-3 text-white"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-3 border-t border-white/12 pt-5 text-sm">
          <Line label="Subtotal" value={formatPrice(subtotal)} />
          <Line label="Tax estimate" value={formatPrice(tax)} />
          <Line label="Store pickup" value="Free" />
          <div className="flex items-center justify-between border-t border-white/12 pt-4 font-display text-4xl uppercase">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <button
          disabled={lines.length === 0}
          className="focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-burger-red px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/45"
        >
          <ShoppingBag size={18} /> Reserve for pickup
        </button>
        <p className="mt-3 flex gap-2 text-xs leading-5 text-white/50">
          <MapPin className="h-4 w-4 shrink-0" />
          Pickup-only merch flow. It prepares a message to the shop with the cart, pickup name, phone number and notes.
        </p>
        {submitted && (
          <div className="mt-4 rounded-md bg-white px-4 py-3 text-sm font-bold text-black">
            <p>Pickup request ready. {site.email ? "Send it to the shop email now." : "Send it to the shop by text now."}</p>
            <a href={pickupHref} className="mt-3 inline-flex text-burger-red underline">
              Open {site.email ? "email" : "text"} request
            </a>
          </div>
        )}
      </form>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-white/72">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
