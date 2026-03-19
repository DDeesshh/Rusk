import { Link } from "react-router-dom";

const TopDishes = () => {

    const dishes = [
        {
            id: 1,
            name: "Борщ",
            category: "Супы",
            image: "/uploads/borsch.webp",
        },
        {
            id: 2,
            name: "Борщ",
            category: "Супы",
            image: "/uploads/borsch.webp",
        },
        {
            id: 3,
            name: "Борщ",
            category: "Супы",
            image: "/uploads/borsch.webp",
        },
        {
            id: 4,
            name: "Борщ",
            category: "Супы",
            image: "/uploads/borsch.webp",
        },
    ];

    return (
        <div className="top-dishes">
            <div className="top-dishes__title">
                <h1 className="mb-4">Выбор месяца</h1>
                <p>Блюда, которые покорили сердца и аппетит наших посетителей в этом месяце.</p>
            </div>

            <div className="top-dishes__list row g-0">
                {dishes.map((dish) => (
                    <div key={dish.id} className="col-lg-3 col-md-6">
                        <Link to={dish.link} className="top-dish">
                            <div
                                className="top-dish__bg"
                                style={{ backgroundImage: `url('${dish.image}')` }}
                            ></div>
                            <div className="top-dish__overlay">
                                <p>{dish.category}</p>
                                <h2>{dish.name}</h2>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default TopDishes;