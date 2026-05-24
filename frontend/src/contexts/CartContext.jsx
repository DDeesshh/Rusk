import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext.jsx";
import { Modal } from "../components/ui/Modal.jsx";
import Button from "../components/ui/Button.jsx";
import { MAX_CART_ITEM_QUANTITY } from "../lib/cartLimits.js";

const CartContext = createContext(null);

function storageKey(userId) {
  return `rusk_cart_${userId}`;
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [cartModal, setCartModal] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      setItems([]);
      return;
    }
    try {
      const raw = localStorage.getItem(storageKey(user.id));
      const parsed = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    try {
      localStorage.setItem(storageKey(user.id), JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, user?.id]);

  const addItem = useCallback((payload) => {
    const { id, title, price, weight } = payload;
    const basePrice = Number(price);
    if (!Number.isFinite(basePrice) || basePrice < 0) return;

    let limited = false;

    setItems((prev) => {
      const idx = prev.findIndex((x) => x.menuItemId === id);
      if (idx >= 0) {
        if (prev[idx].quantity >= MAX_CART_ITEM_QUANTITY) {
          limited = true;
          return prev;
        }
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [
        ...prev,
        {
          menuItemId: id,
          title: String(title || "").trim() || "Блюдо",
          weight: weight != null ? String(weight) : "",
          basePrice,
          quantity: 1,
        },
      ];
    });

    setCartModal(
      limited
        ? {
            title: "Корзина",
            body: `Не более ${MAX_CART_ITEM_QUANTITY} порций одного блюда.`,
          }
        : { title: "Корзина", body: "Позиция добавлена в корзину." }
    );
  }, []);

  const increment = useCallback((menuItemId) => {
    setItems((prev) =>
      prev.map((row) => {
        if (row.menuItemId !== menuItemId) return row;
        if (row.quantity >= MAX_CART_ITEM_QUANTITY) return row;
        return { ...row, quantity: row.quantity + 1 };
      })
    );
  }, []);

  const decrement = useCallback((menuItemId) => {
    setItems((prev) =>
      prev
        .map((row) => {
          if (row.menuItemId !== menuItemId) return row;
          if (row.quantity <= 1) return null;
          return { ...row, quantity: row.quantity - 1 };
        })
        .filter(Boolean)
    );
  }, []);

  const totalQuantity = useMemo(
    () => items.reduce((s, row) => s + row.quantity, 0),
    [items]
  );

  const totalSum = useMemo(
    () => items.reduce((s, row) => s + row.basePrice * row.quantity, 0),
    [items]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      addItem,
      increment,
      decrement,
      totalQuantity,
      totalSum,
      clearCart,
      maxItemQuantity: MAX_CART_ITEM_QUANTITY,
    }),
    [items, addItem, increment, decrement, totalQuantity, totalSum, clearCart]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {cartModal ? (
        <Modal
          title={cartModal.title}
          onClose={() => setCartModal(null)}
          body={<p className="text-center mb-0">{cartModal.body}</p>}
          footer={
            <div className="d-flex justify-content-center">
              <Button text="Ок" onClick={() => setCartModal(null)} />
            </div>
          }
        />
      ) : null}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
