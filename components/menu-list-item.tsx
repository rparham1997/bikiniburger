"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/components/cart-provider";
import { formatPrice, type MenuItem } from "@/lib/menu";

export function MenuListItem({ item }: { item: MenuItem }) {
  const { addItem } = useCart();

  return (
    <article className="grid grid-cols-[82px_1fr] gap-4 rounded-lg border border-black/10 bg-white p-3 shadow-sm sm:grid-cols-[112px_1fr_auto] sm:items-center">
      <div className="relative h-20 w-20 overflow-hidden rounded-md bg-burger-cream sm:h-28 sm:w-28">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-3xl uppercase leading-none text-black sm:text-4xl">{item.name}</h3>
          {item.badge && (
            <span className="rounded-full bg-burger-red px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
              {item.badge}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm leading-6 text-black/62">{item.description}</p>
      </div>
      <div className="col-span-2 flex items-center justify-between gap-3 border-t border-black/10 pt-3 sm:col-span-1 sm:border-t-0 sm:pt-0">
        <p className="font-display text-3xl leading-none text-black">
          {item.price === undefined ? item.priceLabel : formatPrice(item.price)}
        </p>
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
            <Plus size={20} />
          </button>
        )}
      </div>
    </article>
  );
}
