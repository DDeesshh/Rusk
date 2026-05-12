import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { mediaUrl } from "../../../config/api.js";
import { fetchTopDishesOfMonth } from "../../../services/menuService.js";

function dishAnchor(id) {
  return `menu-dish-${id}`;
}

const TopDishes = () => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError("");
            try {
                const data = await fetchTopDishesOfMonth();
                if (!cancelled) setDishes(data.dishes || []);
            } catch (e) {
                if (!cancelled) {
                    setError(e.message || "Не удалось загрузить данные");
                    setDishes([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="top-dishes">
            <div className="top-dishes__title">
                <h1 className="mb-4">Выбор месяца</h1>
                <p>
                    Блюда, которые чаще всего заказывали в этом месяце (по данным оформленных заказов).
                </p>
            </div>

            {error ? (
                <p className="top-dishes__error text-center">{error}</p>
            ) : null}

            {loading ? (
                <p className="top-dishes__empty text-center">Загрузка…</p>
            ) : dishes.length === 0 ? (
                <p className="top-dishes__empty text-center">
                    Пока нет заказов в этом месяце — скоро здесь появятся фавориты гостей.
                </p>
            ) : (
                <div className="top-dishes__list row g-0">
                    {dishes.map((dish) => (
                        <div key={dish.id} className="col-lg-3 col-md-6">
                            <Link to={`/menu#${dishAnchor(dish.id)}`} className="top-dish">
                                <div
                                    className="top-dish__bg"
                                    style={{
                                        backgroundImage: `url('${mediaUrl(dish.img)}')`,
                                    }}
                                />
                                <div className="top-dish__overlay">
                                    <p>{dish.category}</p>
                                    <h2>{dish.title}</h2>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TopDishes;
