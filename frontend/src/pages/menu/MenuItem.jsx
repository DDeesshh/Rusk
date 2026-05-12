import {
  DishImageActionAdmin,
  DishImageActionAdminEdit,
  DishImageActionFavorite,
  DishImageActionMenuCartAdd,
} from "../../components/ui/ActionButton.jsx";
import { mediaUrl } from "../../config/api.js";

const MenuItem = ({
  item,
  userRole,
  isFavorite,
  onFavoriteToggle,
  onAddToCart,
  onAdminDeleteRequest,
  onAdminEditRequest,
}) => {
  const { img, title, ingredients, price, weight } = item;
  const imgSrc = mediaUrl(img);

  return (
    <div className="menu-item" id={`menu-dish-${item.id}`}>
      <div className="menu-item__image-wrapper">
        <img src={imgSrc} alt={title} className="menu-item__image" />

        {userRole === "client" && (
          <>
            <DishImageActionFavorite
              isFavorite={Boolean(isFavorite)}
              onToggle={() => onFavoriteToggle?.(item.id)}
              labelAdd="Добавить в избранное"
              labelRemove="Убрать из избранного"
            />
            <DishImageActionMenuCartAdd
              onClick={() =>
                onAddToCart?.({
                  id: item.id,
                  title,
                  price,
                  weight,
                })
              }
            />
          </>
        )}

        {userRole === "admin" && (
          <>
            <DishImageActionAdmin
              onClick={() => onAdminDeleteRequest?.(item)}
              tooltip="Удалить блюдо"
            />
            <DishImageActionAdminEdit
              onClick={() => onAdminEditRequest?.(item)}
              tooltip="Редактировать блюдо"
            />
          </>
        )}
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
};

export default MenuItem;
