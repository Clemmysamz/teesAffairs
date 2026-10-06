"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Clock3, Mail, MapPin, MessageSquare, Phone, RefreshCw, ShieldCheck, UserRound } from "lucide-react";
import { formatMoney } from "@/lib/products";
import type { OrderStatus, StoreOrder } from "@/lib/order-types";

const orderStatuses: OrderStatus[] = ["new", "processing", "fulfilled", "cancelled"];
const statusStyles: Record<OrderStatus, string> = {
  new: "border-[#9a5b25]/25 bg-[#fbf3e9] text-[#8c4d19]",
  processing: "border-[#315f78]/25 bg-[#edf5f8] text-[#315f78]",
  fulfilled: "border-[#52644c]/25 bg-[#f0f5ed] text-[#52644c]",
  cancelled: "border-[#8e3d34]/25 bg-[#faf0ee] text-[#8e3d34]",
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function NotificationBadge({ label, status }: { label: string; status: StoreOrder["notifications"]["email"] }) {
  const text = status === "sent" ? "Sent" : status === "failed" ? "Failed" : status === "pending" ? "Sending" : status === "not-sent" ? "Not sent" : "Not configured";
  const icon = label === "Email" ? <Mail size={13} /> : <MessageSquare size={13} />;
  const tone = status === "sent" ? "text-[#52644c]" : status === "failed" ? "text-[#9b352c]" : "text-[#77736d]";

  return <span className={`inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.14em] ${tone}`}>{icon}{label}: {text}</span>;
}

export default function AdminOrdersPage() {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/admin/auth", { cache: "no-store" })
      .then(async (response) => (response.ok ? (await response.json()) as { authorized: boolean } : { authorized: false }))
      .then((session) => {
        if (!cancelled) {
          setAuthorized(session.authorized);
          setChecking(false);
        }
      })
      .catch(() => {
        if (!cancelled) setChecking(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!authorized) return;
    let cancelled = false;

    const loadOrders = async () => {
      try {
        const response = await fetch("/api/admin/orders", { cache: "no-store" });
        if (response.status === 401) {
          setAuthorized(false);
          return;
        }
        const result = (await response.json()) as { orders?: StoreOrder[]; error?: string };
        if (!response.ok) throw new Error(result.error ?? "Orders could not be loaded.");
        if (!cancelled) {
          setOrders(result.orders ?? []);
          setLastUpdated(new Date().toISOString());
          setError("");
        }
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Orders could not be loaded.");
      }
    };

    void loadOrders();
    const interval = window.setInterval(() => void loadOrders(), 15000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [authorized]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Admin sign in failed.");
      setAuthorized(true);
      setPassword("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Admin sign in failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthorized(false);
    setOrders([]);
  };

  const handleRefresh = async () => {
    setBusy(true);
    try {
      const response = await fetch("/api/admin/orders", { cache: "no-store" });
      const result = (await response.json()) as { orders?: StoreOrder[]; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Orders could not be refreshed.");
      setOrders(result.orders ?? []);
      setLastUpdated(new Date().toISOString());
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Orders could not be refreshed.");
    } finally {
      setBusy(false);
    }
  };

  const handleStatusChange = async (order: StoreOrder, status: OrderStatus) => {
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status }),
      });
      const result = (await response.json()) as { order?: StoreOrder; error?: string };
      if (!response.ok || !result.order) throw new Error(result.error ?? "Order status could not be updated.");
      setOrders((current) => current.map((item) => item.id === order.id ? result.order! : item));
      setMessage(`${order.orderNumber} marked ${status}.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Order status could not be updated.");
    }
  };

  const visibleOrders = filter === "all" ? orders : orders.filter((order) => order.status === filter);

  if (checking) return <main className="grid min-h-[70vh] place-items-center bg-[#f4f2ed] text-sm text-[#68645e]">Checking admin session...</main>;

  if (!authorized) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f4f2ed] px-4 py-12 text-[#080808]">
        <form onSubmit={handleLogin} className="w-full max-w-md border border-[#080808]/15 bg-white p-6 sm:p-9">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[#77736d]"><ShieldCheck size={14} /> Tees Affairs / Admin</div>
          <h1 className="mt-5 font-display text-4xl">Order desk</h1>
          <p className="mt-2 text-sm text-[#68645e]">Sign in to view and manage customer orders.</p>
          <label htmlFor="orders-username" className="mt-7 block text-[10px] uppercase tracking-[0.2em] text-[#68645e]">Username</label>
          <input id="orders-username" autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 min-h-11 w-full border border-[#080808]/15 bg-[#f4f2ed] px-3 text-sm outline-none focus:border-[#080808]" />
          <label htmlFor="orders-password" className="mt-5 block text-[10px] uppercase tracking-[0.2em] text-[#68645e]">Password</label>
          <input id="orders-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 min-h-11 w-full border border-[#080808]/15 bg-[#f4f2ed] px-3 text-sm outline-none focus:border-[#080808]" />
          {error ? <p role="alert" className="mt-4 text-sm text-[#9b352c]">{error}</p> : null}
          <button disabled={busy} className="mt-6 min-h-11 w-full bg-[#080808] px-4 text-[10px] uppercase tracking-[0.22em] text-white disabled:opacity-60">{busy ? "Signing in..." : "Enter order desk"}</button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f2ed] px-4 py-6 text-[#080808] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#080808]/15 pb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#77736d]">Tees Affairs / Admin</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">Order desk</h1>
            <p className="mt-2 text-xs text-[#68645e]">Orders refresh automatically every 15 seconds.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => void handleRefresh()} disabled={busy} className="inline-flex min-h-10 items-center gap-2 border border-[#080808]/20 px-3 text-[10px] uppercase tracking-[0.16em] transition hover:bg-[#080808] hover:text-white disabled:opacity-50"><RefreshCw size={14} /> Refresh</button>
            <button type="button" onClick={() => void handleSignOut()} className="min-h-10 border border-[#080808]/20 px-3 text-[10px] uppercase tracking-[0.16em] transition hover:bg-[#080808] hover:text-white">Sign out</button>
          </div>
        </header>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1 border-b border-[#080808]/15" role="tablist" aria-label="Filter orders">
            {(["all", ...orderStatuses] as const).map((status) => {
              const count = status === "all" ? orders.length : orders.filter((order) => order.status === status).length;
              const selected = filter === status;
              return <button key={status} type="button" role="tab" aria-selected={selected} onClick={() => setFilter(status)} className={`min-h-10 border-b-2 px-3 text-[9px] uppercase tracking-[0.16em] transition ${selected ? "border-[#080808] text-[#080808]" : "border-transparent text-[#77736d] hover:text-[#080808]"}`}>{status} <span className="ml-1 tabular-nums">{count}</span></button>;
            })}
          </div>
          {lastUpdated ? <p className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.14em] text-[#77736d]"><Clock3 size={12} /> Updated {new Date(lastUpdated).toLocaleTimeString()}</p> : null}
        </div>

        {error ? <p role="alert" className="mt-5 border border-[#9b352c]/20 bg-[#fff8f6] px-4 py-3 text-sm text-[#9b352c]">{error}</p> : null}
        {message ? <p role="status" className="mt-5 border border-[#52644c]/20 bg-[#f4f7f1] px-4 py-3 text-sm text-[#43533d]">{message}</p> : null}

        <section className="mt-6 space-y-3" aria-label="Orders">
          {visibleOrders.length ? visibleOrders.map((order) => (
            <article key={order.id} className="border border-[#080808]/10 bg-white">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#080808]/10 px-4 py-4 sm:px-6">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <h2 className="text-sm font-semibold">{order.orderNumber}</h2>
                  <span className={`border px-2 py-1 text-[9px] uppercase tracking-[0.15em] ${statusStyles[order.status]}`}>{order.status}</span>
                  <span className={`border px-2 py-1 text-[9px] uppercase tracking-[0.15em] ${order.paymentStatus === "paid" ? "border-[#52644c]/25 bg-[#f0f5ed] text-[#52644c]" : order.paymentStatus === "failed" ? "border-[#8e3d34]/25 bg-[#faf0ee] text-[#8e3d34]" : "border-[#9a5b25]/25 bg-[#fbf3e9] text-[#8c4d19]"}`}>Payment {order.paymentStatus}</span>
                  <span className="text-xs text-[#77736d]">{formatTimestamp(order.createdAt)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{formatMoney(order.total, order.currency)}</span>
                  <select aria-label={`Update ${order.orderNumber} status`} value={order.status} onChange={(event) => void handleStatusChange(order, event.target.value as OrderStatus)} className="min-h-9 border border-[#080808]/15 bg-white px-2 text-[9px] uppercase tracking-[0.12em]">
                    {orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
              </header>

              <div className="grid gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_1.2fr_1fr]">
                <div className="space-y-3 text-xs">
                  <p className="inline-flex items-center gap-2 font-medium"><UserRound size={14} /> {order.customer.name}</p>
                  <p className="break-all pl-6 text-[#5f5f5f]">{order.customer.email}</p>
                  <p className="inline-flex items-center gap-2 text-[#5f5f5f]"><Phone size={13} /> {order.customer.phone}</p>
                  <p className="inline-flex items-start gap-2 text-[#5f5f5f]"><MapPin size={14} className="mt-0.5 shrink-0" /><span>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</span></p>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, index) => <div key={`${item.productId}-${item.color}-${item.size}-${index}`} className="flex items-center gap-3 border-b border-[#080808]/10 pb-3 last:border-none last:pb-0"><img src={item.image} alt="" className="h-14 w-12 shrink-0 object-cover" /><div className="min-w-0 flex-1"><a href={`/products/${item.slug}`} target="_blank" rel="noreferrer" className="block truncate text-xs font-medium">{item.name} <ArrowUpRight size={11} className="inline" /></a><p className="mt-1 text-[10px] text-[#77736d]">{item.quantity} × {item.color} / {item.size}</p></div><span className="shrink-0 text-xs">{formatMoney(item.unitPrice * item.quantity, order.currency)}</span></div>)}
                </div>

                <div className="space-y-3 border-t border-[#080808]/10 pt-4 text-xs lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                  <div className="flex items-center justify-between"><span className="text-[#68645e]">Subtotal</span><span>{formatMoney(order.subtotal, order.currency)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-[#68645e]">Shipping</span><span>{order.shipping ? formatMoney(order.shipping, order.currency) : "Free"}</span></div>
                  <div className="flex items-center justify-between"><span className="text-[#68645e]">Discount</span><span>-{formatMoney(order.discount, order.currency)}</span></div>
                  <div className="flex items-center justify-between border-t border-[#080808]/10 pt-3 font-medium"><span>Total</span><span>{formatMoney(order.total, order.currency)}</span></div>
                  {order.exchangeRate ? <p className="pt-1 text-[9px] uppercase tracking-[0.12em] text-[#77736d]">FX rate: ₦{order.exchangeRate.toLocaleString()} / $1</p> : null}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-[#080808]/10 pt-3"><NotificationBadge label="Email" status={order.notifications.email} /><NotificationBadge label="SMS" status={order.notifications.sms} /></div>
                </div>
              </div>
            </article>
          )) : <div className="border border-[#080808]/10 bg-white px-6 py-14 text-center"><p className="font-display text-3xl">No {filter === "all" ? "orders yet" : `${filter} orders`}.</p><p className="mt-2 text-sm text-[#68645e]">New orders will appear here after checkout.</p></div>}
        </section>
      </div>
    </main>
  );
}
