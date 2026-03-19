import { useState } from "react";
import MenuItem from "./MenuItem.jsx";
import ActionButton from "../../components/ui/ActionButton.jsx";
import NavButton from "../../components/ui/NavButton.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

export default function MenuCategory({ data, userRole }) {
  const { category, items } = data;

  const initialItem = { title: "", price: "", img: "", ingredients: "", unit: "" };
  const [menuItems, setMenuItems] = useState(
    items.map(item => ({ ...item, id: crypto.randomUUID() }))
  );
  const [newItem, setNewItem] = useState(initialItem);
  const [showModal, setShowModal] = useState(false);

  // универсальный обработчик для всех input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setNewItem({ ...newItem, [name]: files ? files[0] : value });
  };

  const handleAddItem = () => {
    setMenuItems([...menuItems, { ...newItem, id: crypto.randomUUID() }]);
    setNewItem(initialItem);
    setShowModal(false);
  };

  return (

      <div className="menu-category">



        <h1 id={category} className="menu-category__title">{category}</h1>

        <div className="menu-category__list">
          {menuItems.map(item => (
            <MenuItem key={item.id} item={item} userRole={userRole} />
          ))}
        </div>

        {userRole === "client" && (
          <ActionButton iconClass="icon-add" onClick={() => setShowModal(true)} />
        )}

        {showModal && (
          <Modal
            title="Добавить новое блюдо"
            onClose={() => setShowModal(false)}
            body={
              <div className="d-flex flex-wrap justify-content-center gap-4">

                {/* Загрузка картинки */}
                <Input
                  name="img"
                  type="file"
                  onChange={handleChange}
                />

                {/* Название */}
                <Input
                  name="title"
                  placeholder="Название"
                  value={newItem.title}
                  onChange={handleChange}
                />

                {/* Цена */}
                <Input
                  name="price"
                  type="number"
                  placeholder="Цена"
                  value={newItem.price}
                  onChange={handleChange}
                />

                {/* Ингредиенты */}
                <Input
                  name="ingredients"
                  placeholder="Ингредиенты / перечисление"
                  value={newItem.ingredients}
                  onChange={handleChange}
                />

                {/* Единица измерения */}
                <Input
                  name="unit"
                  placeholder="Гр/мл"
                  value={newItem.unit}
                  onChange={handleChange}
                />

              </div>
            }
            footer={
              <div className="d-flex justify-content-center">
                <Button text="Добавить" onClick={handleAddItem} />
              </div>
            }
          />
        )}
    </div>
  );
}