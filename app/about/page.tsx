import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "About",
  description: "The story of Bikini Burger, a local Ardmore burger shop focused on quality ingredients."
};

const communityPhotos = [
  ["/images/bikini-burger-merch-models-1.png", "Bikini Burger customers wearing red merch"],
  ["/images/bikini-burger-merch-models-2.png", "Local customers in Bikini Burger shirts"],
  ["/images/bikini-burger-food-1.jpg", "Fresh Bikini Burger food at the counter"],
  ["/images/bikini-burger-pizza-burger.jpg", "Pizza Burger special from Bikini Burger"]
] as const;

export default function AboutPage() {
  return (
    <div className="pt-28">
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="About"
              title="A beachy local burger shop with standards"
              copy="Bikini Burger is Mia Robertson's black, woman-owned Ardmore shop, named with a wink to her love for the beach and built around fresh-made burgers, hot fries, milkshakes and a room that feels like the neighborhood."
            />
            <div className="mt-8 grid gap-4 text-lg leading-8 text-black/70">
              <p>
                The shop keeps the focus on quality over gimmicks. Beef burgers use a custom double-ground blend of
                sirloin, brisket, rib eye and chuck from an old-school Lancaster butcher, served on seeded Martin&apos;s
                rolls with Cooper Sharp.
              </p>
              <p>
                No smashburger chase, no secret sauce cover-up. It is a Rittenhouse Place stop for lunch, late-night
                comfort food, first bites on camera, and regulars who know exactly what they want.
              </p>
            </div>
            <Link
              href="/menu"
              className="focus-ring mt-8 inline-flex rounded-full bg-burger-red px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white"
            >
              See the menu
            </Link>
          </div>
          <div className="relative min-h-[520px] overflow-hidden rounded-lg bg-black shadow-loud">
            <Image
              src="/images/bikini-burger-food-3.jpg"
              alt="Interior of Bikini Burger in Ardmore"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-burger-cream px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Community"
              title="Customers, local faces and camera-roll moments"
              copy="Bikini Burger is built for the people who pull up, post the first bite, wear the merch and bring the room to life."
            />
            <div className="mt-8 grid grid-cols-2 gap-3">
              {communityPhotos.map(([src, alt]) => (
                <div key={src} className="relative aspect-square overflow-hidden rounded-lg bg-black">
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 22vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-black/10 bg-black shadow-loud">
            <video
              className="aspect-[9/16] max-h-[720px] w-full bg-black object-cover"
              controls
              muted
              playsInline
              preload="metadata"
              poster="/images/bikini-burger-merch-models-2.png"
            >
              <source src="/videos/bikini-burger-community.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {[
            ["Fresh made", "Cooked to order, not sitting under a lamp."],
            ["No gimmicks", "Classic toppings and quality ingredients do the talking."],
            ["Neighborhood first", "A casual Ardmore spot made for regulars, friends and quick pickups."]
          ].map(([title, copy]) => (
            <div key={title} className="rounded-lg border border-white/12 bg-white/[0.06] p-6">
              <p className="font-display text-4xl uppercase text-burger-red">{title}</p>
              <p className="mt-3 leading-7 text-white/72">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
