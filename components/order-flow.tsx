"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock, CreditCard, MapPin, Minus, Plus, ShoppingBag, Truck, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/menu";
import { site } from "@/lib/site";

const DELIVERY_FEE = Number(process.env.NEXT_PUBLIC_DELIVERY_FEE_CENTS || "500") / 100;
const DELIVERY_MINIMUM = Number(process.env.NEXT_PUBLIC_DELIVERY_MINIMUM_CENTS || "1500") / 100;
const PICKUP_ENABLED = process.env.NEXT_PUBLIC_PICKUP_ENABLED !== "false";
const DELIVERY_ENABLED = process.env.NEXT_PUBLIC_DELIVERY_ENABLED !== "false";
const DELIVERY_ZIPS = (process.env.NEXT_PUBLIC_DELIVERY_ZIPS || "19003")
  .split(",")
  .map((zip) => zip.trim())
  .filter(Boolean);

const requestedTimeOptions = [
  "ASAP",
  "15 minutes",
  "30 minutes",
  "45 minutes",
  "1 hour",
  "Custom time"
];

const apparelIds = new Set(["bikini-burger-sweatshirt", "bikini-burger-tee"]);
const tipOptions = [
  { label: "No tip", value: "0" },
  { label: "10%", value: "10" },
  { label: "15%", value: "15" },
  { label: "20%", value: "20" },
  { label: "Custom", value: "custom" }
];

type StoreStatus = {
  isAcceptingOrders: boolean;
  status: "open" | "closed" | "paused";
  message: string;
  hoursSummary: string;
  todayHours: string;
  isPickupEnabled?: boolean;
  isDeliveryEnabled?: boolean;
};

export function OrderFlow() {
  const { lines, subtotal, updateQuantity, updateLineNote, removeItem, clearCart, count } = useCart();
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [requestedTimeChoice, setRequestedTimeChoice] = useState("ASAP");
  const [tipChoice, setTipChoice] = useState("15");
  const [customTip, setCustomTip] = useState("");
  const [storeStatus, setStoreStatus] = useState<StoreStatus | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const tax = subtotal * 0.06;
  const delivery = fulfillment === "delivery" ? DELIVERY_FEE : 0;
  const tip =
    tipChoice === "custom"
      ? Math.max(0, Number(customTip) || 0)
      : Math.round(subtotal * (Number(tipChoice) / 100) * 100) / 100;
  const total = subtotal + tax + delivery + tip;
  const hasApparel = useMemo(() => lines.some((line) => apparelIds.has(line.item.id)), [lines]);
  const deliveryMinimumRemaining = Math.max(0, DELIVERY_MINIMUM - subtotal);
  const isPickupAvailable = PICKUP_ENABLED && storeStatus?.isPickupEnabled !== false;
  const isDeliveryAvailable = DELIVERY_ENABLED && storeStatus?.isDeliveryEnabled !== false;
  const fulfillmentAvailable =
    fulfillment === "pickup" ? isPickupAvailable : isDeliveryAvailable;
  const canCheckout =
    lines.length > 0 &&
    !isCheckingOut &&
    (storeStatus?.isAcceptingOrders ?? true) &&
    fulfillmentAvailable &&
    !(fulfillment === "delivery" && deliveryMinimumRemaining > 0);

  useEffect(() => {
    if (fulfillment === "delivery" && !isDeliveryAvailable && isPickupAvailable) {
      setFulfillment("pickup");
    }
    if (fulfillment === "pickup" && !isPickupAvailable && isDeliveryAvailable) {
      setFulfillment("delivery");
    }
  }, [fulfillment, isDeliveryAvailable, isPickupAvailable]);

  useEffect(() => {
    let isMounted = true;

    const loadStoreStatus = async () => {
      try {
        const response = await fetch("/api/store-status", { cache: "no-store" });
        const data = (await response.json()) as StoreStatus;
        if (isMounted) {
          setStoreStatus(data);
        }
      } catch {
        if (isMounted) {
          setStoreStatus(null);
        }
      }
    };

    loadStoreStatus();
    const interval = window.setInterval(loadStoreStatus, 60000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div id="checkout" className="grid gap-8 scroll-mt-28 lg:grid-cols-[1fr_420px]">
      <div className={`fixed inset-x-3 bottom-3 z-40 rounded-full bg-black p-2 text-white shadow-loud lg:hidden ${count === 0 ? "hidden" : ""}`}>
        <a href="#checkout" className="focus-ring flex items-center justify-between gap-3 rounded-full px-4 py-2">
          <span className="grid">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-white/60">{count} item{count === 1 ? "" : "s"}</span>
            <span className="font-display text-3xl uppercase leading-none">{formatPrice(total)}</span>
          </span>
          <span className="rounded-full bg-burger-red px-4 py-3 text-xs font-black uppercase tracking-[0.14em]">
            Checkout
          </span>
        </a>
      </div>

      <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
        <div className="mb-5 grid gap-2 rounded-lg bg-burger-cream p-3 sm:grid-cols-3">
          <Step number="1" label="Build cart" active={lines.length === 0} complete={lines.length > 0} />
          <Step number="2" label="Details" active={lines.length > 0} complete={Boolean(fulfillment)} />
          <Step number="3" label="Pay" active={false} complete={false} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-burger-red">{count} item{count === 1 ? "" : "s"}</p>
            <h2 className="font-display text-4xl uppercase">Your cart</h2>
          </div>
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
                href="/menu"
                className="focus-ring mt-6 inline-flex rounded-full bg-burger-red px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white"
              >
                Browse menu
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
                  className="grid gap-4 rounded-lg border border-black/10 p-4"
                >
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
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
                  </div>
                  <label className="grid gap-2 text-xs font-black uppercase tracking-[0.12em] text-black/55">
                    Special instructions
                    <input
                      value={line.note || ""}
                      onChange={(event) => updateLineNote(line.item.id, event.target.value)}
                      placeholder="No onions, sauce on side, extra napkins..."
                      className="focus-ring rounded-md border border-black/12 bg-burger-cream px-4 py-3 text-sm font-bold normal-case tracking-normal text-black placeholder:text-black/35"
                    />
                  </label>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </section>

      <form
        className="h-fit rounded-lg border border-black/10 bg-black p-5 text-white shadow-loud lg:sticky lg:top-28"
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");
          setIsCheckingOut(true);

          const form = new FormData(event.currentTarget);
          const payload = {
            lines: lines.map((line) => ({ id: line.item.id, quantity: line.quantity, note: line.note || "" })),
            fulfillment,
            customerName: String(form.get("customerName") || ""),
            phone: String(form.get("phone") || ""),
            email: String(form.get("email") || ""),
            address: String(form.get("address") || ""),
            zipCode: String(form.get("zipCode") || ""),
            requestedTime:
              requestedTimeChoice === "Custom time"
                ? String(form.get("customRequestedTime") || "")
                : requestedTimeChoice,
            merchSize: String(form.get("merchSize") || ""),
            tipCents: Math.round(tip * 100),
            notes: String(form.get("notes") || "")
          };

          try {
            const response = await fetch("/api/create-checkout-session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (!response.ok || !data.url) {
              throw new Error(data.error || "Unable to start checkout.");
            }
            window.location.href = data.url;
          } catch (checkoutError) {
            setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout.");
            setIsCheckingOut(false);
          }
        }}
      >
        <h2 className="font-display text-4xl uppercase">Checkout</h2>
        {storeStatus && (
          <div
            className={`mt-5 rounded-lg p-4 ${
              storeStatus.isAcceptingOrders ? "bg-white/10" : "bg-white text-black"
            }`}
          >
            <p className={`flex gap-2 text-sm font-black uppercase tracking-[0.14em] ${
              storeStatus.isAcceptingOrders ? "text-white" : "text-burger-red"
            }`}>
              <Clock className="mt-0.5 h-4 w-4 shrink-0" />
              {storeStatus.status === "open" ? "Ordering open" : storeStatus.status === "paused" ? "Ordering paused" : "Ordering closed"}
            </p>
            <p className={`mt-2 text-sm font-bold leading-6 ${
              storeStatus.isAcceptingOrders ? "text-white/65" : "text-black/70"
            }`}>
              {storeStatus.message}
            </p>
          </div>
        )}
        <div className="mt-5 rounded-lg bg-white/10 p-4">
          <p className="flex gap-2 text-sm font-bold leading-6 text-white/78">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-burger-red" />
            Pickup is at {site.address}. Delivery is handled by Bikini Burger drivers.
          </p>
          <p className="mt-3 text-xs font-bold leading-5 text-white/55">
            Delivery fee: {formatPrice(DELIVERY_FEE)}. Delivery minimum: {formatPrice(DELIVERY_MINIMUM)} before tax and delivery.
            {DELIVERY_ZIPS.length > 0 ? ` Delivery ZIPs: ${DELIVERY_ZIPS.join(", ")}.` : ""}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-full bg-white/10 p-1">
          {(["pickup", "delivery"] as const).map((option) => {
            const optionAvailable = option === "pickup" ? isPickupAvailable : isDeliveryAvailable;
            return (
            <button
              key={option}
              type="button"
              disabled={!optionAvailable}
              onClick={() => setFulfillment(option)}
              className={`focus-ring rounded-full px-4 py-3 text-sm font-black uppercase tracking-[0.14em] transition ${
                fulfillment === option ? "bg-white text-black" : "text-white/70 hover:text-white"
              } disabled:cursor-not-allowed disabled:text-white/25 ${
                !optionAvailable ? "line-through" : ""
              }`}
            >
              {option}
            </button>
            );
          })}
        </div>
        {!fulfillmentAvailable && (
          <p className="mt-3 rounded-md bg-white px-4 py-3 text-sm font-bold text-black">
            {fulfillment === "delivery" ? "Delivery" : "Pickup"} ordering is paused right now.
          </p>
        )}

        <div className="mt-6 grid gap-3">
          <label className="grid gap-2 text-sm font-bold text-white/72">
            Name
            <input
              name="customerName"
              required
              className="focus-ring rounded-md border border-white/12 bg-white/10 px-4 py-3 text-white"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-white/72">
            Phone number
            <input
              name="phone"
              required
              type="tel"
              inputMode="tel"
              placeholder="610-649-3903"
              className="focus-ring rounded-md border border-white/12 bg-white/10 px-4 py-3 text-white"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-white/72">
            Email for receipt
            <input
              name="email"
              type="email"
              required
              className="focus-ring rounded-md border border-white/12 bg-white/10 px-4 py-3 text-white"
            />
          </label>
          {fulfillment === "delivery" && (
            <div className="grid gap-3">
              <label className="grid gap-2 text-sm font-bold text-white/72">
                Delivery address
                <input
                  name="address"
                  required
                  placeholder="Street, apartment, city"
                  className="focus-ring rounded-md border border-white/12 bg-white/10 px-4 py-3 text-white placeholder:text-white/35"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-white/72">
                ZIP code
                <input
                  name="zipCode"
                  required
                  inputMode="numeric"
                  maxLength={5}
                  placeholder="19003"
                  className="focus-ring rounded-md border border-white/12 bg-white/10 px-4 py-3 text-white placeholder:text-white/35"
                />
              </label>
            </div>
          )}
          {fulfillment === "delivery" && subtotal > 0 && deliveryMinimumRemaining > 0 && (
            <p className="rounded-md bg-white px-4 py-3 text-sm font-bold text-black">
              Add {formatPrice(deliveryMinimumRemaining)} more before tax and delivery to meet the delivery minimum.
            </p>
          )}
          <label className="grid gap-2 text-sm font-bold text-white/72">
            Requested time
            <select
              value={requestedTimeChoice}
              onChange={(event) => setRequestedTimeChoice(event.target.value)}
              className="focus-ring rounded-md border border-white/12 bg-white/10 px-4 py-3 text-white placeholder:text-white/35"
            >
              {requestedTimeOptions.map((option) => (
                <option key={option} value={option} className="bg-black text-white">
                  {option}
                </option>
              ))}
            </select>
          </label>
          {requestedTimeChoice === "Custom time" && (
            <label className="grid gap-2 text-sm font-bold text-white/72">
              Custom time
              <input
                name="customRequestedTime"
                required
                placeholder="Example: 7:30 PM"
                className="focus-ring rounded-md border border-white/12 bg-white/10 px-4 py-3 text-white placeholder:text-white/35"
              />
            </label>
          )}
          {hasApparel && (
            <label className="grid gap-2 text-sm font-bold text-white/72">
              Merch size preference
              <select
                name="merchSize"
                required
                className="focus-ring rounded-md border border-white/12 bg-white/10 px-4 py-3 text-white"
              >
                <option value="" className="bg-black text-white">
                  Select a size
                </option>
                {["S", "M", "L", "XL", "2XL", "Ask at pickup"].map((size) => (
                  <option key={size} value={size} className="bg-black text-white">
                    {size}
                  </option>
                ))}
              </select>
              <span className="text-xs font-bold leading-5 text-white/50">
                Final merch availability is confirmed at pickup.
              </span>
            </label>
          )}
          <label className="grid gap-2 text-sm font-bold text-white/72">
            Order notes
            <textarea
              name="notes"
              rows={3}
              placeholder="Toppings, sauce, size, allergies, delivery instructions..."
              className="focus-ring rounded-md border border-white/12 bg-white/10 px-4 py-3 text-white"
            />
          </label>
          <div className="grid gap-3 rounded-lg bg-white/10 p-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-white">Add a tip</p>
              <p className="mt-1 text-xs font-bold leading-5 text-white/50">
                Tips go through checkout as a separate line item for the shop team.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {tipOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTipChoice(option.value)}
                  className={`focus-ring rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
                    tipChoice === option.value ? "bg-white text-black" : "bg-black/25 text-white/72 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {tipChoice === "custom" && (
              <label className="grid gap-2 text-xs font-black uppercase tracking-[0.12em] text-white/60">
                Custom tip amount
                <input
                  value={customTip}
                  onChange={(event) => setCustomTip(event.target.value)}
                  inputMode="decimal"
                  placeholder="Example: 5"
                  className="focus-ring rounded-md border border-white/12 bg-white/10 px-4 py-3 text-sm font-bold normal-case tracking-normal text-white placeholder:text-white/35"
                />
              </label>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-3 border-t border-white/12 pt-5 text-sm">
          <Line label="Subtotal" value={formatPrice(subtotal)} />
          <Line label="Tax estimate" value={formatPrice(tax)} />
          <Line label={fulfillment === "delivery" ? "In-house delivery" : "Store pickup"} value={fulfillment === "delivery" ? formatPrice(delivery) : "Free"} />
          <Line label="Tip" value={formatPrice(tip)} />
          <div className="flex items-center justify-between border-t border-white/12 pt-4 font-display text-4xl uppercase">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <button
          disabled={!canCheckout}
          className="focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-burger-red px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/45"
        >
          <CreditCard size={18} /> {isCheckingOut ? "Starting checkout..." : "Pay with Stripe"}
        </button>
        {storeStatus && !storeStatus.isAcceptingOrders && (
          <p className="mt-3 rounded-md bg-white px-4 py-3 text-sm font-bold text-black">
            Checkout is disabled until online ordering is open again.
          </p>
        )}
        <p className="mt-3 flex gap-2 text-xs leading-5 text-white/50">
          <Truck className="h-4 w-4 shrink-0" />
          Paid orders include customer details, receipt email and order notes in Stripe. Call the shop quickly for changes or refund requests after payment.
        </p>
        {error && (
          <div className="mt-4 rounded-md bg-white px-4 py-3 text-sm font-bold text-black">
            <p>{error}</p>
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

function Step({ number, label, active, complete }: { number: string; label: string; active: boolean; complete: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-md px-3 py-2 ${active ? "bg-white" : ""}`}>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
          complete ? "bg-burger-red text-white" : active ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        {complete ? <Check className="h-4 w-4" /> : number}
      </span>
      <span className="text-xs font-black uppercase tracking-[0.12em] text-black/70">{label}</span>
    </div>
  );
}
