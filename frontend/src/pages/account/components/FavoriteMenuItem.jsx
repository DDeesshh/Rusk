import {
  DishImageActionRemoveFavorite,
  DishImageActionAddToCartFavorite,
} from "../../../components/ui/ActionButton.jsx";
import ImageLightbox from "../../../components/ui/ImageLightbox.jsx";
import { mediaUrl } from "../../../config/api.js";
import { useCart } from "../../../contexts/CartContext.jsx";
import { useState } from "react";
import "../../menu/Menu.css";

export default function FavoriteMenuItem({ item, onRemoved }) {
  const { addItem } = useCart();
  const { img, title, ingredients, price, weight } = item;
  const imgSrc = mediaUrl(img);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
        <button
          type="button"
          className="menu-item__image-open"
          onClick={() => setLightboxOpen(true)}
          aria-label={`Открыть фото: ${title}`}
        >
          <img src={imgSrc} alt="" className="menu-item__image" />
        </button>

        {lightboxOpen ? (
          <ImageLightbox
            src={imgSrc}
            alt={title}
            onClose={() => setLightboxOpen(false)}
          />
        ) : null}
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
