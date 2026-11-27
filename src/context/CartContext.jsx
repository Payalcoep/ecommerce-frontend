import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); }
    catch { return []; }
  });

  useEffect(() => localStorage.setItem("cart", JSON.stringify(items)), [items]);

  function addToCart(product) {
    setItems(current => {
      const found = current.find(item => item.id === product.id);
      if (found) return current.map(item => item.id === product.id
        ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { ...product, quantity: 1 }];
    });
  }

  function changeQuantity(id, quantity) {
    if (quantity < 1) return;
    setItems(current => current.map(item => item.id === id ? { ...item, quantity } : item));
  }

  function removeItem(id) {
    setItems(current => current.filter(item => item.id !== id));
  }

  function clearCart() { setItems([]); }

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, total, addToCart, changeQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);