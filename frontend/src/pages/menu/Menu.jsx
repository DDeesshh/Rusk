import MenuCategory from "./MenuCategory.jsx";
import NavButton from "../../components/ui/NavButton.jsx";
import "./Menu.css";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useCart } from "../../contexts/CartContext.jsx";
import { API_BASE } from "../../config/api.js";
import { addFavorite, fetchFavoriteIds, removeFavorite } from "../../services/favoritesService.js";

export default function Menu({ userRole }) {
  const [menuData, setMenuData] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const { hash } = useLocation();
  const { token } = useAuth();
  const { addItem } = useCart();

  const loadMenu = useCallback(() => {
    fetch(`${API_BASE}/api/menu`)
      .then((res) => res.json())
      .then(setMenuData)
      .catch(console.error);
  }, []);

  const loadFavoriteIds = useCallback(async () => {
    if (userRole !== "client" || !token) {
      setFavoriteIds(new Set());
      return;
    }
    try {
      const ids = await fetchFavoriteIds(token);
      setFavoriteIds(new Set(ids));
    } catch (e) {
      console.error(e);
    }
  }, [userRole, token]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  useEffect(() => {
    loadFavoriteIds();
  }, [loadFavoriteIds]);

  useEffect(() => {
    if (!hash || menuData.length === 0) return;
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, [hash, menuData]);

  const handleFavoriteToggle = async (menuItemId) => {
    if (!token) return;
    try {
      if (favoriteIds.has(menuItemId)) {
        await removeFavorite(token, menuItemId);
      } else {
        await addFavorite(token, menuItemId);
      }
      await loadFavoriteIds();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="container menu">
      <div className="content">
        <div className="menu__nav">
          {menuData.map((cat) => (
            <NavButton key={cat.category} text={cat.category} to={`/menu#${cat.category}`} />
          ))}
        </div>

        {menuData.map((cat) => (
          <MenuCategory
            key={cat.category}
            data={cat}
            userRole={userRole}
            favoriteIds={userRole === "client" ? favoriteIds : undefined}
            onFavoriteToggle={userRole === "client" ? handleFavoriteToggle : undefined}
            onAddToCart={userRole === "client" ? addItem : undefined}
            onMenuUpdated={loadMenu}
            token={userRole === "admin" ? token : undefined}
          />
        ))}
      </div>
    </div>
  );
}
