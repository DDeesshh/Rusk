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

const CartContext = createContext(null);

function storageKey(userId) {
  return `rusk_cart_${userId}`;
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [addedModalOpen, setAddedModalOpen] = useState(false);

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

    setItems((prev) => {
      const idx = prev.findIndex((x) => x.menuItemId === id);
      if (idx >= 0) {
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
    setAddedModalOpen(true);
  }, []);

  const increment = useCallback((menuItemId) => {
    setItems((prev) =>
      prev.map((row) =>
        row.menuItemId === menuItemId
          ? { ...row, quantity: row.quantity + 1 }
          : row
      )
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
    }),
    [items, addItem, increment, decrement, totalQuantity, totalSum, clearCart]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {addedModalOpen ? (
        <Modal
          title="Корзина"
          onClose={() => setAddedModalOpen(false)}
          body={
            <p className="text-center">Позиция добавлена в корзину</p>
          }
          footer={
            <div className="d-flex justify-content-center">
              <Button text="Ок" onClick={() => setAddedModalOpen(false)} />
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
