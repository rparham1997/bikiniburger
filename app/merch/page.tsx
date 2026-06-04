import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MenuCard } from "@/components/menu-card";
import { SectionHeading } from "@/components/section-heading";
import { merchItems } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Merch",
  description: "Shop custom Bikini Burger sweatshirts, tees and logo cups for pickup in Ardmore."
};

export default function MerchPage() {
  return (
    <div className="bg-burger-cream pt-28">
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Merch"
              title="Wear Bikini Burger"
              copy="Custom red sweatshirts, tees and logo cups from the Ardmore shop. Real people, real Bikini Burger red, ready for pickup with food."
            />
            <Link
              href="/order"
              className="focus-ring mt-8 inline-flex rounded-full bg-burger-red px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white"
            >
              Shop merch
            </Link>
          </div>
          <div className="relative min-h-[500px] overflow-hidden rounded-lg bg-black shadow-loud">
            <Image
              src="/images/bikini-burger-merch-models-2.png"
              alt="People wearing red Bikini Burger merch"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {merchItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
          <p className="mt-6 rounded-lg border border-black/10 bg-white p-4 text-sm font-bold text-black/70">
            Cup pricing is set as an in-store item until a final online price is confirmed.
          </p>
        </div>
      </section>

      <section className="bg-black px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
          {[
            ["/images/bikini-burger-merch-models-1.png", "Bikini Burger tank and tee modeled by customers"],
            ["/images/bikini-burger-merch-models-2.png", "Bikini Burger red merch worn outside the shop"]
          ].map(([src, alt]) => (
            <div key={src} className="relative min-h-[420px] overflow-hidden rounded-lg bg-white/10">
              <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
