import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import FavoriteMenuItem from "./FavoriteMenuItem.jsx";
import { fetchFavorites, removeFavorite } from "../../../services/favoritesService.js";
import "../../menu/Menu.css";

export default function AccountFavorites() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setError("");
    try {
      const data = await fetchFavorites(token);
      setItems(data.items || []);
    } catch (e) {
      setError(e.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRemoved = async (menuItemId) => {
    if (!token) return;
    try {
      await removeFavorite(token, menuItemId);
      await load();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) {
    return <p className="text-center">Загрузка...</p>;
  }

  if (error) {
    return <p className="text-center text-danger">{error}</p>;
  }

  if (items.length === 0) {
    return (
      <p className="text-center">
        В избранном пока ничего нет. Добавьте блюда со страницы «Меню».
      </p>
    );
  }

  return (
    <div className="account-favorites">
      <div className="menu-category__list account-favorites__list">
        {items.map((item) => (
          <FavoriteMenuItem key={item.id} item={item} onRemoved={handleRemoved} />
        ))}
      </div>
    </div>
  );
}
