import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistStore = {
  items: string[];
  toggleItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set) => ({
      items: [],
      toggleItem: (id) =>
        set((state) => ({
          items: state.items.includes(id)
            ? state.items.filter((item) => item !== id)
            : [...state.items, id],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item !== id),
        })),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "verano-wishlist",
    },
  ),
);
