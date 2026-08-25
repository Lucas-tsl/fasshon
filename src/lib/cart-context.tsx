"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  variantId: string | null;
  variantName: string | null;
  slug: string;
  name: string;
  priceCents: number;
  quantity: number;
  brandName: string;
  categorySlug: string;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  setQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  clear: () => void;
  subtotalCents: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "fasshon-cart";

function lineKey(productId: string, variantId: string | null | undefined) {
  return `${productId}:${variantId ?? ""}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage, must run client-side after mount to avoid an SSR/CSR markup mismatch
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable (private mode, quota) — cart just won't persist
    }
  }, [items, hydrated]);

  const addItem: CartContextValue["addItem"] = (item, quantity = 1) => {
    setItems((current) => {
      const key = lineKey(item.productId, item.variantId);
      const existing = current.find((i) => lineKey(i.productId, i.variantId) === key);
      if (existing) {
        return current.map((i) =>
          lineKey(i.productId, i.variantId) === key
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...current, { ...item, quantity }];
    });
  };

  const removeItem: CartContextValue["removeItem"] = (productId, variantId = null) => {
    const key = lineKey(productId, variantId);
    setItems((current) => current.filter((i) => lineKey(i.productId, i.variantId) !== key));
  };

  const setQuantity: CartContextValue["setQuantity"] = (productId, variantId, quantity) => {
    const key = lineKey(productId, variantId);
    setItems((current) =>
      quantity <= 0
        ? current.filter((i) => lineKey(i.productId, i.variantId) !== key)
        : current.map((i) => (lineKey(i.productId, i.variantId) === key ? { ...i, quantity } : i)),
    );
  };

  const clear = () => setItems([]);

  const { subtotalCents, count } = useMemo(
    () => ({
      subtotalCents: items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),
      count: items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    [items],
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, setQuantity, clear, subtotalCents, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
