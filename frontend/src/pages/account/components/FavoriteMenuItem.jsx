import {
  DishImageActionRemoveFavorite,
  DishImageActionAddToCartFavorite,
} from "../../../components/ui/ActionButton.jsx";
import { mediaUrl } from "../../../config/api.js";
import { useCart } from "../../../contexts/CartContext.jsx";
import "../../menu/Menu.css";

export default function FavoriteMenuItem({ item, onRemoved }) {
  const { addItem } = useCart();
  const { img, title, ingredients, price, weight } = item;
  const imgSrc = mediaUrl(img);

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      title,
      price,
      weight,
    });
  };

  return (
    <div className="menu-item">
      <div className="menu-item__image-wrapper">
        <img src={imgSrc} alt={title} className="menu-item__image" />
        <DishImageActionAddToCartFavorite onClick={handleAddToCart} />
        <DishImageActionRemoveFavorite
          onClick={() => onRemoved?.(item.id)}
          tooltip="Убрать из избранного"
        />
      </div>

      <div className="menu-item__info">
        <h2 className="menu-item__title">{title}</h2>
        <p className="menu-item__ingredients">{ingredients}</p>
      </div>

      <div className="menu-item__price-block">
        <h2 className="menu-item__price">{price}₽</h2>
        <h3 className="menu-item__weight">{weight}</h3>
      </div>
    </div>
  );
}
