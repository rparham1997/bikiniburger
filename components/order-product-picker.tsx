"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/components/cart-provider";
import { formatPrice, merchItems } from "@/lib/menu";

const orderGroups = [
  {
    title: "Merch",
    copy: "Custom Bikini Burger gear for pickup at the Ardmore shop.",
    items: merchItems
  }
];

export function OrderProductPicker() {
  const { addItem } = useCart();

  return (
    <section className="grid gap-8">
      {orderGroups.map((group) => (
        <div key={group.title}>
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
                      <ShoppingBag size={17} /> Add {item.category === "Merch" ? "merch" : "item"}
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
