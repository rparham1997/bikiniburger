"use client";

import { motion } from "framer-motion";
import { Instagram, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MenuCard } from "@/components/menu-card";
import { SectionHeading } from "@/components/section-heading";
import { featuredItems } from "@/lib/menu";
import { site } from "@/lib/site";

const reviews = [
  "The burgers are head nodders. You get the finger wave and point.",
  "First bite is a delight. Simple, classic, and clearly made with care.",
  "A real neighborhood spot: crinkle fries, shakes, and an Ardmore room with personality."
];

const gallery = [
  "/images/bikini-burger-real-food-1.jpg",
  "/images/bikini-burger-real-food-4.jpg",
  "/images/bikini-burger-real-food-2.jpg",
  "/images/bikini-burger-home-potato-salad.jpg",
  "/images/bikini-burger-home-bottom-left.jpg",
  "/images/bikini-burger-merch-models-1.png",
  "/images/bikini-burger-merch-models-2.png",
  "/images/bikini-burger-logo.png"
];

export function HomeSections() {
  return (
    <>
      <section className="overflow-hidden bg-burger-red py-4 text-white">
        <div className="marquee flex w-[200%] gap-8 whitespace-nowrap font-display text-4xl uppercase">
          {Array.from({ length: 10 }).map((_, index) => (
            <span key={index}>Fresh burgers • crinkle fries • shakes • Ardmore late-night comfort •</span>
          ))}
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Featured menu"
            title="Homemade style brugers that reminds you of a old school cookout"
            copy="Classic, simple burgers with quality up front: custom butcher beef, seeded rolls, Cooper Sharp, crisp lettuce, tomato, onion and dill pickle."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {featuredItems.map((item) => (
              <MenuCard key={item.id} item={item} compact />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <SectionHeading
            eyebrow="Neighborhood proof"
            title="The head-nod kind of burger"
            copy="The real Bikini Burger philosophy is simple: keep quality high, skip the gimmicks, and let the meat do the talking."
            inverse
          />
          <div className="grid gap-4">
            {reviews.map((review, index) => (
              <motion.blockquote
                key={review}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-lg border border-white/12 bg-white/[0.06] p-5"
              >
                <div className="flex gap-1 text-burger-gold">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-4 text-lg leading-7 text-white/82">&ldquo;{review}&rdquo;</p>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="relative min-h-[420px] overflow-hidden rounded-lg bg-black shadow-loud">
            <Image
              src="/images/bikini-burger-merch-models-1.png"
              alt="People wearing Bikini Burger custom merch"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Custom merch"
              title="Red gear from the shop"
              copy="Sweatshirts, tees and logo cups bring the Bikini Burger counter energy home. Add merch to an online order for pickup."
            />
            <Link
              href="/merch"
              className="focus-ring mt-8 inline-flex rounded-full bg-black px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-burger-red"
            >
              Shop merch
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Social bites"
              title="Made for the camera roll"
              copy="Follow along for customer first bites, fresh drops and the late-night order that deserves a repost."
            />
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-burger-red"
            >
              <Instagram size={18} /> Follow @bikiniburger_
            </a>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {gallery.map((src, index) => (
              <motion.a
                key={src}
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="group relative aspect-square overflow-hidden rounded-lg bg-black"
              >
                  <Image
                    src={src}
                    alt="Bikini Burger social food photography"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-burger-cream px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading
              eyebrow="Pull up"
              title="Rittenhouse Place, open daily"
              copy="Pickup, delivery, or a quick stop before the night gets going. Open late Monday through Saturday, with Sunday hours from noon to 10 PM."
            />
            <div className="mt-8 rounded-lg border border-black/10 bg-white p-6">
              <p className="flex gap-3 text-lg font-bold">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-burger-red" />
                {site.address}
              </p>
              <p className="mt-4 font-display text-4xl uppercase text-black">{site.hours}</p>
              <Link
                href="/contact"
                className="focus-ring mt-6 inline-flex rounded-full bg-burger-red px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white"
              >
                Contact & directions
              </Link>
            </div>
          </div>
          <iframe
            title="Map to Bikini Burger"
            className="min-h-[420px] w-full rounded-lg border-0 shadow-loud"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`}
          />
        </div>
      </section>
    </>
  );
}
