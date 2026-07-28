"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, CheckCircle2, Clock, Download, Lock, MapPin, Phone, Printer, RefreshCcw, Search, Truck, XCircle } from "lucide-react";

type AdminOrder = {
  id: string;
  createdAt: string;
  total: string;
  paymentStatus: string;
  status: string;
  fulfillment: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  requestedTime: string;
  notes: string;
  summary: string;
  items: Array<{
    name: string;
    quantity: number;
    total: string;
  }>;
};

type SystemCheck = {
  key: string;
  label: string;
  ready: boolean;
  optional?: boolean;
  detail: string;
};

type SystemStatus = {
  checks: SystemCheck[];
  readyCount: number;
  requiredCount: number;
  deliveryFeeCents: number;
  deliveryMinimumCents: number;
};

const statuses = [
  { value: "new", label: "New" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "out_for_delivery", label: "Out for delivery" },
  { value: "completed", label: "Completed" },
  { value: "canceled", label: "Canceled" }
];

const moneyToNumber = (value: string) => Number(value.replace(/[^0-9.-]+/g, "")) || 0;

const escapeCsv = (value: string | number) => {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const escapeHtml = (value: string | number) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const playNewOrderSound = () => {
  const AudioContextConstructor =
    window.AudioContext ||
    (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextConstructor) {
    return;
  }

  const audioContext = new AudioContextConstructor();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 880;
  gain.gain.value = 0.08;
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.35);
};

export function AdminOrders() {
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [statusFilter, setStatusFilter] = useState("active");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [knownOrderIds, setKnownOrderIds] = useState<Set<string>>(new Set());
  const [newOrderNotice, setNewOrderNotice] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  useEffect(() => {
    const savedPassword = window.localStorage.getItem("bikini-admin-password") || "";
    if (savedPassword) {
      setPassword(savedPassword);
      setRememberPassword(true);
    }
  }, []);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active"
            ? !["completed", "canceled"].includes(order.status)
            : order.status === statusFilter);
        const matchesFulfillment = fulfillmentFilter === "all" || order.fulfillment === fulfillmentFilter;
        const searchText = [
          order.customerName,
          order.phone,
          order.email,
          order.address,
          order.requestedTime,
          order.notes,
          order.summary,
          ...order.items.map((item) => item.name)
        ]
          .join(" ")
          .toLowerCase();
        const matchesQuery = !query.trim() || searchText.includes(query.trim().toLowerCase());

        return matchesStatus && matchesFulfillment && matchesQuery;
      }),
    [fulfillmentFilter, orders, query, statusFilter]
  );

  const stats = useMemo(
    () => ({
      active: orders.filter((order) => !["completed", "canceled"].includes(order.status)).length,
      pickup: filteredOrders.filter((order) => order.fulfillment === "pickup").length,
      delivery: filteredOrders.filter((order) => order.fulfillment === "delivery").length,
      gross: filteredOrders.reduce((total, order) => total + moneyToNumber(order.total), 0)
    }),
    [filteredOrders, orders]
  );

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      if (rememberPassword) {
        window.localStorage.setItem("bikini-admin-password", password);
      } else {
        window.localStorage.removeItem("bikini-admin-password");
      }

      const [ordersResponse, statusResponse] = await Promise.all([
        fetch("/api/admin/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password })
        }),
        fetch("/api/admin/system-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password })
        })
      ]);
      const data = await ordersResponse.json();
      if (!ordersResponse.ok) {
        throw new Error(data.error || "Unable to load orders.");
      }
      const statusData = await statusResponse.json();
      if (statusResponse.ok) {
        setSystemStatus(statusData as SystemStatus);
      }
      const nextOrders = data.orders as AdminOrder[];
      if (hasLoaded && !data.demoMode) {
        const freshOrders = nextOrders.filter((order) => !knownOrderIds.has(order.id));
        if (freshOrders.length > 0) {
          setNewOrderNotice(`${freshOrders.length} new paid order${freshOrders.length === 1 ? "" : "s"} received.`);
          if (soundAlerts) {
            playNewOrderSound();
          }
          window.setTimeout(() => setNewOrderNotice(""), 12000);
        }
      }

      setOrders(nextOrders);
      setKnownOrderIds(new Set(nextOrders.map((order) => order.id)));
      setDemoMode(Boolean(data.demoMode));
      setHasLoaded(true);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load orders.");
    } finally {
      setIsLoading(false);
    }
  }, [hasLoaded, knownOrderIds, password, rememberPassword, soundAlerts]);

  const updateStatus = async (sessionId: string, status: string) => {
    setError("");
    try {
      const response = await fetch("/api/admin/order-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, sessionId, status })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to update status.");
      }
      setOrders((current) =>
        current.map((order) => (order.id === sessionId ? { ...order, status } : order))
      );
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Unable to update status.");
    }
  };

  useEffect(() => {
    if (!autoRefresh || !password || !hasLoaded) {
      return;
    }

    const interval = window.setInterval(() => {
      loadOrders();
    }, 30000);

    return () => window.clearInterval(interval);
  }, [autoRefresh, hasLoaded, loadOrders, password]);

  const printOrder = (order: AdminOrder) => {
    const itemRows = order.items
      .map(
        (item) =>
          `<tr><td>${escapeHtml(item.quantity)}x ${escapeHtml(item.name)}</td><td>${escapeHtml(item.total)}</td></tr>`
      )
      .join("");
    const safeFulfillment = escapeHtml(order.fulfillment.toUpperCase());
    const safeStatus = escapeHtml(order.status.toUpperCase().replaceAll("_", " "));
    const printWindow = window.open("", "_blank", "width=420,height=720");
    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Bikini Burger Order ${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 18px; color: #111; }
            h1 { font-size: 26px; margin: 0 0 8px; text-transform: uppercase; }
            h2 { font-size: 18px; margin: 18px 0 8px; border-top: 1px solid #111; padding-top: 12px; }
            p { margin: 4px 0; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            td { border-bottom: 1px dashed #aaa; padding: 8px 0; font-size: 14px; vertical-align: top; }
            td:last-child { text-align: right; font-weight: 700; }
            .total { font-size: 22px; font-weight: 900; margin-top: 16px; }
          </style>
        </head>
        <body>
          <h1>Bikini Burger</h1>
          <p><strong>${safeFulfillment}</strong> - ${safeStatus}</p>
          <p>${escapeHtml(new Date(order.createdAt).toLocaleString())}</p>
          <h2>Customer</h2>
          <p><strong>Name:</strong> ${escapeHtml(order.customerName || "Customer")}</p>
          <p><strong>Phone:</strong> ${escapeHtml(order.phone || "Not provided")}</p>
          ${order.email ? `<p><strong>Email:</strong> ${escapeHtml(order.email)}</p>` : ""}
          ${order.address ? `<p><strong>Address:</strong> ${escapeHtml(order.address)}</p>` : ""}
          <p><strong>Requested:</strong> ${escapeHtml(order.requestedTime || "ASAP")}</p>
          ${order.notes ? `<p><strong>Notes:</strong> ${escapeHtml(order.notes)}</p>` : ""}
          <h2>Items</h2>
          <table>${itemRows}</table>
          <p class="total">Total: ${escapeHtml(order.total)}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const exportCsv = () => {
    const header = [
      "Order ID",
      "Created",
      "Status",
      "Fulfillment",
      "Customer",
      "Phone",
      "Email",
      "Address",
      "Requested Time",
      "Notes",
      "Items",
      "Total"
    ];
    const rows = filteredOrders.map((order) => [
      order.id,
      new Date(order.createdAt).toLocaleString(),
      order.status.replaceAll("_", " "),
      order.fulfillment,
      order.customerName,
      order.phone,
      order.email,
      order.address,
      order.requestedTime || "ASAP",
      order.notes,
      order.items.map((item) => `${item.quantity}x ${item.name} (${item.total})`).join("; "),
      order.total
    ]);
    const csv = [header, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bikini-burger-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-8">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          loadOrders();
        }}
        className="rounded-lg border border-black/10 bg-white p-5 shadow-sm"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <label className="grid flex-1 gap-2 text-sm font-bold text-black/65">
            Admin password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="focus-ring rounded-md border border-black/15 px-4 py-3 text-base font-normal"
            />
          </label>
          <label className="flex items-center gap-3 rounded-md border border-black/10 px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-black">
            <input
              type="checkbox"
              checked={rememberPassword}
              onChange={(event) => {
                setRememberPassword(event.target.checked);
                if (!event.target.checked) {
                  window.localStorage.removeItem("bikini-admin-password");
                }
              }}
              className="h-4 w-4 accent-burger-red"
            />
            Remember on this device
          </label>
          <button
            disabled={isLoading}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-burger-red disabled:cursor-not-allowed disabled:bg-black/35"
          >
            {isLoading ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {isLoading ? "Loading" : "View orders"}
          </button>
          {hasLoaded && (
            <button
              type="button"
              onClick={loadOrders}
              disabled={isLoading}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-black transition hover:border-burger-red hover:text-burger-red disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          )}
        </div>
        {error && <p className="mt-4 rounded-md bg-burger-red px-4 py-3 text-sm font-bold text-white">{error}</p>}
      </form>

      {hasLoaded && (
        <section className="grid gap-4">
          {systemStatus && (
            <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-burger-red">Production readiness</p>
                  <h2 className="mt-2 font-display text-4xl uppercase leading-none text-black">
                    {systemStatus.readyCount}/{systemStatus.requiredCount} required checks ready
                  </h2>
                </div>
                <div className="rounded-full bg-burger-cream px-4 py-2 text-sm font-black uppercase tracking-[0.14em] text-black">
                  Delivery ${Number(systemStatus.deliveryFeeCents / 100).toFixed(2)} / minimum ${Number(systemStatus.deliveryMinimumCents / 100).toFixed(2)}
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {systemStatus.checks.map((check) => (
                  <div key={check.key} className="rounded-md border border-black/10 bg-burger-cream p-4">
                    <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-black">
                      {check.ready ? (
                        <CheckCircle2 className="h-4 w-4 text-burger-red" />
                      ) : (
                        <XCircle className="h-4 w-4 text-black/35" />
                      )}
                      {check.label}
                      {check.optional && <span className="text-black/40">(optional)</span>}
                    </p>
                    <p className="mt-2 text-sm font-bold leading-5 text-black/60">{check.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {newOrderNotice && (
            <div className="rounded-lg border border-burger-red bg-burger-red p-5 text-white shadow-loud">
              <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em]">
                <Bell className="h-4 w-4" />
                New order
              </p>
              <p className="mt-2 font-display text-4xl uppercase leading-none">{newOrderNotice}</p>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Active orders" value={stats.active.toString()} />
            <Stat label="Filtered pickup" value={stats.pickup.toString()} />
            <Stat label="Filtered delivery" value={stats.delivery.toString()} />
            <Stat label="Filtered total" value={`$${stats.gross.toFixed(2)}`} />
          </div>

          <div className="grid gap-3 rounded-lg border border-black/10 bg-white p-5 shadow-sm xl:grid-cols-[1.4fr_1fr_1fr_auto_auto_auto] xl:items-end">
            <label className="grid gap-2 text-sm font-bold text-black/65">
              Search
              <span className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Name, phone, item, notes"
                  className="focus-ring w-full rounded-md border border-black/15 py-3 pl-11 pr-4 text-base font-normal"
                />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-bold text-black/65">
              Status
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="focus-ring rounded-md border border-black/15 px-4 py-3 text-base font-normal"
              >
                <option value="active">Active orders</option>
                <option value="all">All orders</option>
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-black/65">
              Fulfillment
              <select
                value={fulfillmentFilter}
                onChange={(event) => setFulfillmentFilter(event.target.value)}
                className="focus-ring rounded-md border border-black/15 px-4 py-3 text-base font-normal"
              >
                <option value="all">Pickup and delivery</option>
                <option value="pickup">Pickup only</option>
                <option value="delivery">Delivery only</option>
              </select>
            </label>
            <label className="flex items-center gap-3 rounded-md border border-black/10 px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-black">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(event) => setAutoRefresh(event.target.checked)}
                className="h-4 w-4 accent-burger-red"
              />
              Auto-refresh
            </label>
            <label className="flex items-center gap-3 rounded-md border border-black/10 px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-black">
              <input
                type="checkbox"
                checked={soundAlerts}
                onChange={(event) => setSoundAlerts(event.target.checked)}
                className="h-4 w-4 accent-burger-red"
              />
              Sound alerts
            </label>
            <button
              type="button"
              onClick={exportCsv}
              disabled={filteredOrders.length === 0}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-black transition hover:border-burger-red hover:text-burger-red disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </section>
      )}

      {demoMode && (
        <div className="rounded-lg border border-burger-red/30 bg-white p-5 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-burger-red">Demo mode</p>
          <p className="mt-2 text-sm leading-6 text-black/65">
            These are sample orders for previewing the admin workflow. Real paid orders will appear here after Stripe is connected.
          </p>
        </div>
      )}

      {hasLoaded && filteredOrders.length === 0 && (
        <div className="rounded-lg border border-black/10 bg-white p-8 text-center shadow-sm">
          <p className="font-display text-4xl uppercase text-black">No matching orders</p>
          <p className="mt-3 text-sm leading-6 text-black/60">
            Paid Stripe orders will appear here after customers complete checkout.
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <article key={order.id} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 border-b border-black/10 pb-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-burger-red px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-white">
                    {order.fulfillment}
                  </span>
                  <span className="rounded-full bg-black px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-white">
                    Paid
                  </span>
                  <span className="rounded-full bg-burger-cream px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-black">
                    {statuses.find((status) => status.value === order.status)?.label || "New"}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-4xl uppercase leading-none text-black">
                  {order.customerName || "Customer"}
                </h2>
                <p className="mt-2 text-sm font-bold text-black/55">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short"
                  }).format(new Date(order.createdAt))}
                </p>
              </div>
              <p className="font-display text-5xl uppercase leading-none text-black">{order.total}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 border-b border-black/10 pb-4">
              {statuses.map((status) => (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => updateStatus(order.id, status.value)}
                  className={`focus-ring rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
                    order.status === status.value
                      ? "bg-burger-red text-white"
                      : "bg-burger-cream text-black hover:bg-black hover:text-white"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
              <div className="grid gap-2 text-sm leading-6 text-black/70">
                <p>
                  <strong className="text-black">Phone:</strong> {order.phone || "Not provided"}
                </p>
                {order.phone && (
                  <a className="inline-flex items-center gap-2 font-black text-burger-red underline" href={`tel:${order.phone}`}>
                    <Phone className="h-4 w-4" />
                    Call customer
                  </a>
                )}
                <p>
                  <strong className="text-black">Email:</strong> {order.email || "Not provided"}
                </p>
                {order.fulfillment === "delivery" && (
                  <div className="grid gap-2">
                    <p className="flex gap-2">
                      <Truck className="mt-1 h-4 w-4 shrink-0 text-burger-red" />
                      <span>
                        <strong className="text-black">Delivery:</strong> {order.address || "Address missing"}
                      </span>
                    </p>
                    {order.address && (
                      <a
                        className="inline-flex items-center gap-2 font-black text-burger-red underline"
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MapPin className="h-4 w-4" />
                        Open map
                      </a>
                    )}
                  </div>
                )}
                <p className="flex gap-2">
                  <Clock className="mt-1 h-4 w-4 shrink-0 text-burger-red" />
                  <span>
                    <strong className="text-black">Requested time:</strong> {order.requestedTime || "ASAP"}
                  </span>
                </p>
                {order.notes && (
                  <p>
                    <strong className="text-black">Notes:</strong> {order.notes}
                  </p>
                )}
              </div>
              <div className="rounded-md bg-burger-cream p-4">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-burger-red">Items</p>
                <div className="mt-3 grid gap-2">
                  {order.items.map((item, index) => (
                    <div key={`${order.id}-${item.name}-${index}`} className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-bold text-black">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-black text-black">{item.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => printOrder(order)}
              className="focus-ring mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-burger-red"
            >
              <Printer className="h-4 w-4" />
              Print ticket
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-burger-red">{label}</p>
      <p className="mt-2 font-display text-4xl uppercase leading-none text-black">{value}</p>
    </div>
  );
}
