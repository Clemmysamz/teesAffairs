import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import type { NotificationStatus, OrderStatus, StoreOrder } from "@/lib/order-types";

const ordersPath = path.join(process.cwd(), "data", "orders.json");
let mutationQueue: Promise<void> = Promise.resolve();

async function readOrdersFile(): Promise<StoreOrder[]> {
  try {
    const contents = await fs.readFile(ordersPath, "utf8");
    const orders: unknown = JSON.parse(contents);
    return Array.isArray(orders) ? (orders as StoreOrder[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeOrdersFile(orders: StoreOrder[]) {
  await fs.mkdir(path.dirname(ordersPath), { recursive: true });
  const temporaryPath = `${ordersPath}.tmp`;
  await fs.writeFile(temporaryPath, JSON.stringify(orders, null, 2), "utf8");
  await fs.rename(temporaryPath, ordersPath);
}

function mutateOrders<Result>(mutate: (orders: StoreOrder[]) => { orders: StoreOrder[]; result: Result }) {
  const operation = mutationQueue.then(async () => {
    const current = await readOrdersFile();
    const { orders, result } = mutate(current);
    await writeOrdersFile(orders);
    return result;
  });
  mutationQueue = operation.then(() => undefined, () => undefined);
  return operation;
}

export async function getOrders() {
  await mutationQueue;
  return (await readOrdersFile()).sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function createOrder(order: StoreOrder) {
  return mutateOrders((orders) => ({ orders: [order, ...orders], result: order }));
}

export async function getOrderByPaymentReference(reference: string) {
  const orders = await getOrders();
  return orders.find((order) => order.paymentReference === reference) ?? null;
}

export async function getOrderByOrderNumber(orderNumber: string) {
  const orders = await getOrders();
  return orders.find((order) => order.orderNumber === orderNumber) ?? null;
}

export function updateOrderPaymentStatus(orderId: string, status: StoreOrder["paymentStatus"]) {
  return mutateOrders((orders) => {
    const currentOrder = orders.find((order) => order.id === orderId);
    if (!currentOrder) return { orders, result: null };

    const updatedOrder = { ...currentOrder, paymentStatus: status };
    const nextOrders = orders.map((order) => order.id === orderId ? updatedOrder : order);
    return {
      orders: nextOrders,
      result: { order: updatedOrder, newlyPaid: status === "paid" && currentOrder.paymentStatus !== "paid" },
    };
  });
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  return mutateOrders((orders) => {
    let updated: StoreOrder | null = null;
    const nextOrders = orders.map((order) => {
      if (order.id !== orderId) return order;
      updated = { ...order, status };
      return updated;
    });
    return { orders: nextOrders, result: updated };
  });
}

export function updateOrderNotifications(orderId: string, notifications: { email: NotificationStatus; sms: NotificationStatus }) {
  return mutateOrders((orders) => {
    let updated: StoreOrder | null = null;
    const nextOrders = orders.map((order) => {
      if (order.id !== orderId) return order;
      updated = { ...order, notifications };
      return updated;
    });
    return { orders: nextOrders, result: updated };
  });
}
