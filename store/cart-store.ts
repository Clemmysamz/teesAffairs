import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  color: string;
  size: string;
  image: string;
  quantity: number;
};

const validCodes: Record<string, number> = { TEESAFAIRS10: 0.1, VERANO10: 0.1, WELCOME15: 0.15 };

type CartStore = {
  items: CartItem[];
  open: boolean;
  promoInput: string;
  appliedPromo: string | null;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  changeSize: (id: string, size: string) => void;
  setOpen: (value: boolean) => void;
  setPromoInput: (value: string) => void;
  applyPromo: (code: string) => { valid: boolean; message: string };
  clearPromo: () => void;
  clearCart: () => void;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      promoInput: "",
      appliedPromo: null,
      addItem: (item) => {
        const normalized = { ...item, quantity: item.quantity ?? 1 };
        set((state) => {
          const existing = state.items.find(
            (entry) =>
              entry.id === normalized.id &&
              entry.color === normalized.color &&
              entry.size === normalized.size,
          );

          if (existing) {
            return {
              items: state.items.map((entry) =>
                entry.id === normalized.id && entry.color === normalized.color && entry.size === normalized.size
                  ? { ...entry, quantity: entry.quantity + normalized.quantity }
                  : entry,
              ),
              open: true,
            };
          }

          return { items: [...state.items, normalized], open: true };
        });
      },
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
          return;
        }

        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        }));
      },
      changeSize: (id, size) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, size } : item)),
        })),
      setOpen: (value) => set({ open: value }),
      setPromoInput: (value) => set({ promoInput: value }),
      applyPromo: (code) => {
        const normalized = code.trim().toUpperCase();
        if (!normalized) {
          return { valid: false, message: "Enter a promo code." };
        }

        const discountRate = validCodes[normalized];
        if (!discountRate) {
          return { valid: false, message: "Invalid promo code." };
        }

        set({ appliedPromo: normalized, promoInput: normalized });
        return { valid: true, message: `${normalized} applied successfully.` };
      },
      clearPromo: () => set({ appliedPromo: null, promoInput: "" }),
      clearCart: () => set({ items: [], appliedPromo: null, promoInput: "" }),
      subtotal: 0,
      shipping: 0,
      discount: 0,
      total: 0,
    }),
    {
      name: "verano-cart",
      partialize: (state) => ({
        items: state.items,
        appliedPromo: state.appliedPromo,
      }),
    },
  ),
);

export const getCartSummary = (state: CartStore) => {
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 150 ? 0 : 24;
  const discount = state.appliedPromo ? subtotal * (validCodes[state.appliedPromo] ?? 0) : 0;
  const total = Math.max(subtotal - discount + shipping, 0);

  return { subtotal, shipping, discount, total };
};

export const useCartSummary = () => {
  const state = useCartStore();
  return getCartSummary(state);
};
