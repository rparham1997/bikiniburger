"use client";

import { motion } from "framer-motion";
import { ArrowRight, Utensils } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="grain relative overflow-hidden bg-black pt-20 text-white">
      <div className="absolute inset-0">
        <Image
          src="/images/bikini-burger-real-food-1.jpg"
          alt="Bikini Burger platter with crinkle fries"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-46"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.94),rgba(0,0,0,0.72),rgba(0,0,0,0.38))]" />
      </div>

      <div className="relative mx-auto grid min-h-[560px] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.86fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] backdrop-blur">
            <Utensils size={16} /> Ardmore, PA
          </p>
          <div className="mt-6 flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-white shadow-loud sm:h-24 sm:w-24">
              <Image
                src="/images/bikini-burger-logo.png"
                alt="Bikini Burger logo"
                fill
                sizes="96px"
                className="object-cover object-top"
              />
            </div>
            <div>
              <p className="font-display text-4xl uppercase leading-none text-white sm:text-5xl">
                Bikini Burger
              </p>
              <p className="mt-1 text-sm font-black uppercase tracking-[0.18em] text-burger-gold">
                44 Rittenhouse Pl
              </p>
            </div>
          </div>
          <div className="mt-5 grid max-w-xl gap-4 rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur sm:grid-cols-[128px_1fr] sm:items-center">
            <div className="relative min-h-[120px] overflow-hidden rounded-md bg-white">
              <Image
                src="/images/bikini-burger-cane-sugar-soda-real.jpg"
                alt="Bikini Burger cane sugar soda"
                fill
                sizes="128px"
                className="object-cover brightness-125 contrast-105 saturate-110"
              />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-burger-gold">
                Made with pure cane sugar
              </p>
              <p className="mt-2 font-display text-3xl uppercase leading-none text-white">
                Only burger shop in America with its own soda
              </p>
            </div>
          </div>
          <h1 className="mt-6 font-display text-6xl uppercase leading-[0.88] tracking-normal text-white sm:text-7xl lg:text-8xl">
            Ardmore&apos;s Number #1 Burger Spot
          </h1>
          <p className="mt-6 max-w-xl text-xl leading-8 text-white/82 sm:text-2xl">
            Fresh burgers, fries, shakes & good vibes.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/order"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-burger-red px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-black"
            >
              Order Online <ArrowRight size={18} />
            </Link>
            <Link
              href="/menu"
              className="focus-ring inline-flex items-center justify-center rounded-full border border-white/28 bg-white/10 px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white backdrop-blur transition hover:bg-white hover:text-black"
            >
              View Menu
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-[1.05fr_0.95fr]"
        >
          <motion.div
            whileHover={{ y: -6 }}
            className="relative min-h-[240px] overflow-hidden rounded-lg border border-white/12 bg-white/10 shadow-loud sm:min-h-[360px]"
          >
            <Image
              src="/images/bikini-burger-real-food-4.jpg"
              alt="Bikini Burger with bacon, pickle and melted cheese"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-black">
              Real Ardmore burgers
            </div>
          </motion.div>
          <div className="grid gap-4">
            <motion.div
              whileHover={{ y: -6 }}
              className="relative min-h-[170px] overflow-hidden rounded-lg border border-white/12 bg-white/10 shadow-loud"
            >
              <Image
                src="/images/bikini-burger-real-food-1.jpg"
                alt="Bikini Burger crinkle fries"
                fill
                sizes="(max-width: 1024px) 100vw, 26vw"
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 rounded-full bg-burger-red px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">
                Crinkle fries
              </div>
            </motion.div>
            <div className="rounded-lg border border-white/12 bg-white p-6 text-black shadow-loud">
              <p className="font-display text-5xl uppercase leading-none text-burger-red">Open late</p>
              <p className="mt-2 text-sm font-black uppercase tracking-[0.18em]">Mon-Sat 11-11</p>
              <p className="mt-1 text-sm font-black uppercase tracking-[0.18em]">Sun 12-10</p>
              <p className="mt-4 text-sm leading-6 text-black/68">
                Fresh burgers, whole potato crinkle fries, shakes, and a real Ardmore neighborhood feel.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
