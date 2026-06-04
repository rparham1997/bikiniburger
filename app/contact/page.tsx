import type { Metadata } from "next";
import { Instagram, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Find Bikini Burger at 44 Rittenhouse Pl, Ardmore, PA 19003."
};

export default function ContactPage() {
  return (
    <div className="bg-burger-cream pt-28">
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Come through Ardmore"
              copy="Stop by Rittenhouse Place for burgers, fries, shakes and a quick pickup order."
            />
            <div className="mt-8 grid gap-4">
              <div className="rounded-lg border border-black/10 bg-white p-5">
                <p className="flex gap-3 text-lg font-bold">
                  <MapPin className="mt-1 h-5 w-5 text-burger-red" />
                  {site.address}
                </p>
                <p className="mt-3 font-display text-4xl uppercase">{site.hours}</p>
              </div>
              <div className="rounded-lg border border-black/10 bg-white p-5">
                <p className="flex items-center gap-3 text-lg font-bold">
                  <Phone className="h-5 w-5 text-burger-red" />
                  {site.phone}
                </p>
              </div>
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-burger-red px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white"
              >
                <Instagram size={18} /> Instagram
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-lg shadow-loud">
          <iframe
            title="Map to Bikini Burger"
            className="h-[520px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`}
          />
        </div>
      </section>
    </div>
  );
}
