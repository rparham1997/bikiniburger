"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { site } from "@/lib/site";

export function MobileOrderButton() {
  const { count } = useCart();

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 grid grid-cols-[1fr_auto] gap-2 sm:hidden">
      <Link
        href="/order"
        className="focus-ring flex items-center justify-center gap-2 rounded-full bg-burger-red px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-loud"
      >
        <ShoppingBag size={18} />
        Order
        {count > 0 && <span className="rounded-full bg-white px-2 py-0.5 text-xs text-burger-red">{count}</span>}
      </Link>
      <a
        href={site.uberEatsUrl}
        target="_blank"
        rel="noreferrer"
        className="focus-ring flex items-center justify-center rounded-full bg-black px-4 py-4 text-xs font-black uppercase tracking-[0.12em] text-white shadow-loud"
      >
        Uber
      </a>
    </div>
  );
}
