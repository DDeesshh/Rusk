import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button.jsx";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { useCart } from "../../../contexts/CartContext.jsx";
import MenuCategory from "../../menu/MenuCategory.jsx";
import "../../menu/Menu.css";
import { fetchMenu } from "../../../services/menuService.js";
import {
  addFavorite,
  fetchFavoriteIds,
  removeFavorite,
} from "../../../services/favoritesService.js";
import "./HomeMenu.css";

const HomeMenu = ({ userRole }) => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { addItem } = useCart();
  const [menuData, setMenuData] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMenu = useCallback(async () => {
    try {
      const data = await fetchMenu();
      const list = Array.isArray(data) ? data : [];
      setMenuData(list);
      setActiveCategory((prev) =>
        prev && list.some((c) => c.category === prev) ? prev : list[0]?.category ?? ""
      );
    } catch (e) {
      setError(e.message || "Не удалось загрузить меню");
      setMenuData([]);
    }
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
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        await loadMenu();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadMenu]);

  useEffect(() => {
    loadFavoriteIds();
  }, [loadFavoriteIds]);

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

  const activeBlock = useMemo(
    () => menuData.find((c) => c.category === activeCategory),
    [menuData, activeCategory]
  );

  const menuLink = activeCategory
    ? `/menu#${encodeURIComponent(activeCategory)}`
    : "/menu";

  return (
    <section className="home-menu" aria-labelledby="home-menu-heading">
      <div className="container menu">
        <div className="content">
      <div className="home-menu__title">
        <h1 id="home-menu-heading" className="mb-4">
          Меню
        </h1>
        <p>
        Выберите интересующую категорию и ознакомьтесь с популярными блюдами. Полное меню доступно на отдельной странице.
        </p>
      </div>

      {error ? <p className="home-menu__message home-menu__message--error">{error}</p> : null}

      {loading ? (
        <p className="home-menu__message">Загрузка…</p>
      ) : menuData.length === 0 && !error ? (
        <p className="home-menu__message">Меню пока пусто.</p>
      ) : (
        <>
          <nav className="home-menu__nav" aria-label="Категории меню">
            {menuData.map((cat) => (
              <button
                key={cat.category}
                type="button"
                className={`home-menu__tab${
                  cat.category === activeCategory ? " home-menu__tab--active" : ""
                }`}
                onClick={() => setActiveCategory(cat.category)}
                aria-current={cat.category === activeCategory ? "true" : undefined}
              >
                {cat.category}
              </button>
            ))}
          </nav>

          {!activeBlock || activeBlock.items?.length === 0 ? (
            <p className="home-menu__message">В этой категории пока нет блюд.</p>
          ) : (
            <MenuCategory
              key={activeCategory}
              data={activeBlock}
              userRole={userRole}
              favoriteIds={userRole === "client" ? favoriteIds : undefined}
              onFavoriteToggle={
                userRole === "client" ? handleFavoriteToggle : undefined
              }
              onAddToCart={userRole === "client" ? addItem : undefined}
              onMenuUpdated={loadMenu}
              token={userRole === "admin" ? token : undefined}
              showCategoryTitle={false}
              showAdminAdd={false}
              embedded
            />
          )}

          <div className="home-menu__footer">
            <Button text="Все меню" onClick={() => navigate(menuLink)} />
          </div>
        </>
      )}
        </div>
      </div>
    </section>
  );
};

export default HomeMenu;
