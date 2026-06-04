import Link from "next/link";
import { Instagram, MapPin } from "lucide-react";
import Image from "next/image";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-black px-4 pb-28 pt-14 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-white">
              <Image
                src="/images/bikini-burger-logo.png"
                alt="Bikini Burger logo"
                fill
                sizes="80px"
                className="object-cover object-top"
              />
            </div>
            <p className="font-display text-5xl uppercase text-burger-red">Bikini Burger</p>
          </div>
          <p className="mt-4 max-w-md text-lg text-white/72">
            A real Ardmore burger shop for fresh burgers, fries, shakes and neighborhood good vibes.
          </p>
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-white/45">Visit</p>
          <p className="mt-4 flex gap-2 text-white/80">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-burger-red" />
            {site.address}
          </p>
          <p className="mt-2 text-white/60">{site.hours}</p>
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-white/45">Links</p>
          <div className="mt-4 grid gap-2">
            <Link href="/menu" className="text-white/80 hover:text-white">
              Menu
            </Link>
            <Link href="/order" className="text-white/80 hover:text-white">
              Order Online
            </Link>
            <a href={site.doorDashUrl} target="_blank" rel="noreferrer" className="text-white/80 hover:text-white">
              DoorDash
            </a>
            <a href={site.uberEatsUrl} target="_blank" rel="noreferrer" className="text-white/80 hover:text-white">
              Uber Eats
            </a>
            <a href={site.seamlessUrl} target="_blank" rel="noreferrer" className="text-white/80 hover:text-white">
              Seamless
            </a>
            <a href={site.grubhubUrl} target="_blank" rel="noreferrer" className="text-white/80 hover:text-white">
              Grubhub
            </a>
            <Link href="/merch" className="text-white/80 hover:text-white">
              Merch
            </Link>
            <Link href="/catering" className="text-white/80 hover:text-white">
              Catering
            </Link>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white"
            >
              <Instagram size={18} /> Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
