"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { site } from "@/lib/site";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/merch", label: "Merch" },
  { href: "/about", label: "About" },
  { href: "/catering", label: "Catering" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/88 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-sm">
          <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white shadow-sm">
            <Image
              src="/images/bikini-burger-logo.png"
              alt="Bikini Burger logo"
              fill
              sizes="56px"
              className="object-cover object-top"
            />
          </span>
          <span className="leading-none">
            <span className="block font-display text-2xl uppercase tracking-normal">Bikini</span>
            <span className="block -mt-1 font-display text-2xl uppercase tracking-normal text-burger-red">
              Burger
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-ring rounded-sm text-sm font-black uppercase tracking-[0.18em] transition ${
                pathname === item.href ? "text-burger-red" : "text-black hover:text-burger-red"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={site.doorDashUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring hidden rounded-full bg-burger-red px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-black lg:inline-flex"
          >
            DoorDash
          </a>
          <a
            href={site.uberEatsUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring hidden rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:border-burger-red hover:text-burger-red xl:inline-flex"
          >
            Uber Eats
          </a>
          <a
            href={site.seamlessUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring hidden rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:border-burger-red hover:text-burger-red 2xl:inline-flex"
          >
            Seamless
          </a>
          <a
            href={site.grubhubUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring hidden rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:border-burger-red hover:text-burger-red 2xl:inline-flex"
          >
            Grubhub
          </a>
          <Link
            href="/order"
            className="focus-ring hidden items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-burger-red sm:flex"
          >
            <ShoppingBag size={18} />
            Order
            {count > 0 && <span className="rounded-full bg-white px-2 py-0.5 text-xs text-black">{count}</span>}
          </Link>
          <button
            aria-label="Open menu"
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-black/15 bg-white md:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="border-t border-black/10 bg-white px-4 py-4 md:hidden"
          >
            <div className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 font-display text-3xl uppercase text-black transition hover:bg-burger-red hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/order"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-burger-red px-5 py-4 text-center text-sm font-black uppercase tracking-[0.16em] text-white"
              >
                Order Online {count > 0 ? `(${count})` : ""}
              </Link>
              <a
                href={site.doorDashUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="rounded-full bg-black px-5 py-4 text-center text-sm font-black uppercase tracking-[0.16em] text-white"
              >
                Order on DoorDash
              </a>
              <a
                href={site.uberEatsUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="rounded-full border border-black/15 bg-white px-5 py-4 text-center text-sm font-black uppercase tracking-[0.16em] text-black"
              >
                Order on Uber Eats
              </a>
              <a
                href={site.seamlessUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="rounded-full border border-black/15 bg-white px-5 py-4 text-center text-sm font-black uppercase tracking-[0.16em] text-black"
              >
                Order on Seamless
              </a>
              <a
                href={site.grubhubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="rounded-full border border-black/15 bg-white px-5 py-4 text-center text-sm font-black uppercase tracking-[0.16em] text-black"
              >
                Order on Grubhub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
