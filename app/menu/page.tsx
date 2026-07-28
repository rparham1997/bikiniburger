import type { Metadata } from "next";
import { MenuListItem } from "@/components/menu-list-item";
import { SectionHeading } from "@/components/section-heading";
import { menuItems } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Menu",
  description: "Browse burgers, platters, sides and kids meals from Bikini Burger in Ardmore, PA."
};

const categories = ["Daily Special", "Burgers", "Shakes & Sides", "Toppings", "Kids Meals"] as const;

export default function MenuPage() {
  return (
    <div className="bg-burger-cream pt-28">
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Menu"
            title="The real Bikini Burger menu"
            copy="Burgers, platters, shakes, sides, kids meals and specials. Food delivery links are available on the order page."
          />
          <div className="mt-10 grid gap-12">
            {categories.map((category) => (
              <section key={category}>
                <div className="mb-5 flex items-center gap-4">
                  <h2 className="font-display text-4xl uppercase text-black">{category}</h2>
                  <div className="h-px flex-1 bg-black/12" />
                </div>
                <div className="grid gap-3">
                  {menuItems
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <MenuListItem key={item.id} item={item} />
                    ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
