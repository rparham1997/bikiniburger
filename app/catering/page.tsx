import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Mail, Phone, ShoppingBag, Users } from "lucide-react";
import { CateringForm } from "@/components/catering-form";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Catering",
  description: "Plan Bikini Burger catering for office lunches, parties, local events and group orders in Ardmore."
};

const cateringOptions = [
  {
    title: "Burger runs",
    copy: "Single burgers, cheeseburgers, turkey burgers and veggie options for groups."
  },
  {
    title: "Platters",
    copy: "Fries, onion rings, potato salad, shrimp platters and hot dog platters for easy sharing."
  },
  {
    title: "Daily special packs",
    copy: "Single burger, fries and Bikini Soda bundles for simple office or event ordering."
  },
  {
    title: "Merch add-ons",
    copy: "Custom shirts, sweatshirts and logo cups can be added for staff gifts or local events."
  }
];

export default function CateringPage() {
  return (
    <div className="bg-burger-cream pt-28">
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Catering"
              title="Bikini Burger for the whole crew"
              copy="Bring the Ardmore counter energy to office lunches, birthday parties, school events, watch parties and neighborhood gatherings."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                [Users, "Group orders"],
                [ShoppingBag, "Pickup ready"],
                [CalendarDays, "Plan ahead"],
                [Phone, site.phone || "Call the shop"]
              ].map(([Icon, label]) => (
                <div key={label as string} className="rounded-lg border border-black/10 bg-white p-5">
                  <Icon className="h-6 w-6 text-burger-red" />
                  <p className="mt-3 font-black uppercase tracking-[0.12em] text-black">{label as string}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${site.phone?.replace(/[^0-9]/g, "")}`}
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-burger-red px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-black"
              >
                <Phone size={18} /> Call catering
              </a>
              <Link
                href="/contact"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-black px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-burger-red"
              >
                <Mail size={18} /> Send details
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative min-h-[520px] overflow-hidden rounded-lg bg-black shadow-loud sm:col-span-2">
              <Image
                src="/images/bikini-burger-food-1.jpg"
                alt="Bikini Burger platter with fries for catering"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative min-h-[220px] overflow-hidden rounded-lg bg-black shadow-loud">
              <Image
                src="/images/bikini-burger-side-photo-2960.jpg"
                alt="Bikini Burger fries"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative min-h-[220px] overflow-hidden rounded-lg bg-black shadow-loud">
              <Image
                src="/images/bikini-burger-butterfly-shrimp-platter.jpg"
                alt="Butterfly shrimp platter"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="What to order"
            title="Built for easy group pickup"
            copy="Keep it simple with burgers, fries, sodas and a few crowd-pleasing specials."
            inverse
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cateringOptions.map((option) => (
              <div key={option.title} className="rounded-lg border border-white/12 bg-white/[0.06] p-6">
                <p className="font-display text-4xl uppercase text-burger-red">{option.title}</p>
                <p className="mt-3 leading-7 text-white/72">{option.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading
              eyebrow="Request catering"
              title="Tell us the headcount"
              copy="For now, catering requests go straight through the shop. Share the date, pickup time, number of people and what menu items you want."
            />
            <div className="mt-8 rounded-lg border border-black/10 bg-white p-6">
              <p className="font-display text-4xl uppercase text-black">{site.phone}</p>
              <p className="mt-3 text-lg leading-7 text-black/68">{site.address}</p>
              <p className="mt-3 text-sm font-black uppercase tracking-[0.16em] text-burger-red">{site.hours}</p>
            </div>
          </div>
          <CateringForm />
        </div>
      </section>
    </div>
  );
}
