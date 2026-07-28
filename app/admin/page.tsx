import type { Metadata } from "next";
import { AdminOrders } from "@/components/admin-orders";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Admin Orders",
  description: "Bikini Burger owner portal for viewing paid pickup and delivery orders.",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  return (
    <div className="bg-burger-cream pt-28">
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Owner portal"
            title="Paid pickup and delivery orders"
            copy="Use the admin password to view recent paid Stripe orders, customer details, pickup or delivery instructions, notes, item totals and order status."
          />
          <div className="mt-8 rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-burger-red">Setup checklist</p>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-black/68 md:grid-cols-2">
              <p>Stripe secret key connects checkout payments.</p>
              <p>Stripe webhook secret confirms paid orders and triggers alerts.</p>
              <p>Admin password protects this portal.</p>
              <p>Order alert email and optional SMS send new paid orders to the shop.</p>
              <p>Pickup, delivery, fees, minimums and ZIP codes can be adjusted from Vercel environment settings.</p>
              <p>Keep this page open during service for auto-refresh, kitchen tickets and status updates.</p>
            </div>
          </div>
          <div className="mt-10">
            <AdminOrders />
          </div>
        </div>
      </section>
    </div>
  );
}
