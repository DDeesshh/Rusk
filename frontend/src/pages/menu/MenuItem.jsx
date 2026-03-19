import ActionButton, { IconButton } from "../../components/ui/ActionButton.jsx";

const MenuItem = ({ item, userRole }) => {
    const { img, title, ingredients, price, weight } = item;

    return (
        <div className="menu-item">
            <div className="menu-item__image-wrapper">
                <img src={img} alt={title} className="menu-item__image" />

                {/* Кнопки — только для клинта */}
                {userRole === "client" && (
                    <>
                        <div className="menu-item__actions">
                            <ActionButton
                                iconClass="icon-saved"
                            />
                            <ActionButton
                                iconClass="icon-add"
                            />
                        </div>
                    </>
                )
                }
                {/* Кнопки — только для админа */}
                {userRole === "admin" && (
                    <>
                        <div className="menu-item__actions">
                            <ActionButton
                                iconClass="icon-remove"
                            />
                        </div>
                    </>
                )
                }
            </div>

            <div className="menu-item__info">
                <h2 className="menu-item__title">{title}</h2>
                <p className="menu-item__ingredients">{ingredients}</p>
            </div>

            <div className="menu-item__price-block">
                <h2 className="menu-item__price">{price}₽</h2>
                <h3 className="menu-item__weight">{weight}</h3>
            </div>
        </div >
    );
};

export default MenuItem;
