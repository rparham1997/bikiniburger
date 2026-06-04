"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/components/cart-provider";
import { formatPrice, type MenuItem } from "@/lib/menu";

export function MenuCard({ item, compact = false }: { item: MenuItem; compact?: boolean }) {
  const { addItem } = useCart();

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm transition hover:shadow-loud"
    >
      <div className={compact ? "relative h-48" : "relative h-64"}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {item.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-burger-red px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white">
            {item.badge}
          </span>
        )}
        <p className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-2 font-display text-3xl text-black">
          {item.price === undefined ? item.priceLabel : formatPrice(item.price)}
        </p>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-burger-red">{item.category}</p>
            <h3 className="mt-2 font-display text-3xl uppercase leading-none text-black">{item.name}</h3>
          </div>
          {item.price === undefined ? (
            <span className="rounded-full bg-burger-cream px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-black">
              Counter
            </span>
          ) : (
            <button
              onClick={() => addItem(item)}
              className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:bg-burger-red"
              aria-label={`Add ${item.name} to cart`}
            >
              <Plus size={21} />
            </button>
          )}
        </div>
        <p className="mt-3 min-h-14 text-sm leading-6 text-black/64">{item.description}</p>
      </div>
    </motion.article>
  );
}
