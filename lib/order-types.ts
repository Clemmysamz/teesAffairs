export type OrderStatus = "new" | "processing" | "fulfilled" | "cancelled";
export type NotificationStatus = "pending" | "sent" | "failed" | "not-sent" | "not-configured";

export type OrderItem = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
};

export type StoreOrder = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: "pending" | "paid" | "failed";
  paymentReference?: string;
  exchangeRate?: number;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  currency: "USD" | "NGN";
  notifications: {
    email: NotificationStatus;
    sms: NotificationStatus;
  };
};
