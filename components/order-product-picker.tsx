"use client";

import { motion } from "framer-motion";
import { Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatPrice, menuItems, merchItems } from "@/lib/menu";

const orderGroups = [
  {
    title: "Daily Special",
    copy: "Quick combos and current shop specials.",
    items: menuItems.filter((item) => item.category === "Daily Special")
  },
  {
    title: "Burgers",
    copy: "Fresh burgers, platters, wraps and hot counter favorites.",
    items: menuItems.filter((item) => item.category === "Burgers")
  },
  {
    title: "Shakes & Sides",
    copy: "Fries, onion rings, potato salad, Bikini Soda, shakes and pup cups.",
    items: menuItems.filter((item) => item.category === "Shakes & Sides")
  },
  {
    title: "Toppings",
    copy: "Add-ons for burgers, wraps and platters.",
    items: menuItems.filter((item) => item.category === "Toppings")
  },
  {
    title: "Kids Meals",
    copy: "Simple kid-friendly meals for pickup or delivery.",
    items: menuItems.filter((item) => item.category === "Kids Meals")
  },
  {
    title: "Merch",
    copy: "Custom Bikini Burger gear for pickup at the Ardmore shop.",
    items: merchItems
  }
];

export function OrderProductPicker() {
  const { addItem, lines } = useCart();
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredGroups = useMemo(
    () =>
      orderGroups
        .map((group) => ({
          ...group,
          items: normalizedQuery
            ? group.items.filter((item) =>
                [item.name, item.description, item.badge, item.category]
                  .filter(Boolean)
                  .join(" ")
                  .toLowerCase()
                  .includes(normalizedQuery)
              )
            : group.items
        }))
        .filter((group) => group.items.length > 0),
    [normalizedQuery]
  );

  const quantityForItem = (id: string) => lines.find((line) => line.item.id === id)?.quantity || 0;

  return (
    <section className="grid gap-8">
      <div className="sticky top-20 z-20 rounded-lg border border-black/10 bg-white/95 p-3 shadow-sm backdrop-blur">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search burgers, sides, soda, merch..."
              className="focus-ring w-full rounded-full border border-black/12 bg-burger-cream py-3 pl-11 pr-4 text-sm font-bold text-black placeholder:text-black/40"
            />
          </label>
          <nav aria-label="Order categories" className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {orderGroups.map((group) => (
              <a
                key={group.title}
                href={`#order-${group.title.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}`}
                className="focus-ring shrink-0 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-black transition hover:border-burger-red hover:text-burger-red"
              >
                {group.title}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {filteredGroups.length === 0 && (
        <div className="rounded-lg border border-black/10 bg-white p-8 text-center shadow-sm">
          <p className="font-display text-4xl uppercase leading-none text-black">No items found</p>
          <p className="mt-3 text-sm font-bold text-black/55">Try burgers, fries, soda, toppings, or merch.</p>
        </div>
      )}

      {filteredGroups.map((group) => (
        <div key={group.title} id={`order-${group.title.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}`} className="scroll-mt-36">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-burger-red">Add to cart</p>
              <h2 className="font-display text-4xl uppercase leading-none text-black">{group.title}</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-black/60">{group.copy}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm"
              >
                <div className="relative h-44">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  {item.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-burger-red px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-white">
                      {item.badge}
                    </span>
                  )}
                  {quantityForItem(item.id) > 0 && (
                    <span className="absolute right-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-white">
                      {quantityForItem(item.id)} in cart
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-3xl uppercase leading-none text-black">{item.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-black/62">{item.description}</p>
                    </div>
                    <p className="shrink-0 rounded-full bg-burger-cream px-3 py-2 font-display text-2xl leading-none text-black">
                      {item.price === undefined ? item.priceLabel : formatPrice(item.price)}
                    </p>
                  </div>
                  {item.price === undefined ? (
                    <p className="mt-4 rounded-md bg-black px-4 py-3 text-center text-xs font-black uppercase tracking-[0.14em] text-white">
                      In-store pickup
                    </p>
                  ) : (
                    <button
                      onClick={() => addItem(item)}
                      className="focus-ring mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-burger-red"
                    >
                      <ShoppingBag size={17} /> {quantityForItem(item.id) > 0 ? "Add another" : `Add ${item.category === "Merch" ? "merch" : "item"}`}
                    </button>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
