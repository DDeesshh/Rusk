import { useEffect, useState } from "react";
import MenuItem from "./MenuItem.jsx";
import ActionButton, { CategoryAdminAddReveal } from "../../components/ui/ActionButton.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { createMenuItem, deleteMenuItem, updateMenuItem } from "../../services/menuService.js";

const emptyForm = {
  title: "",
  price: "",
  ingredients: "",
  unit: "",
  imageFile: null,
};

export default function MenuCategory({
  data,
  userRole,
  favoriteIds,
  onFavoriteToggle,
  onAddToCart,
  onMenuUpdated,
  token,
  showCategoryTitle = true,
  showAdminAdd = true,
  embedded = false,
}) {
  const { category, items, categoryId } = data;
  const [menuItems, setMenuItems] = useState(items || []);
  const [form, setForm] = useState(emptyForm);
  const [itemModalMode, setItemModalMode] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setMenuItems(items || []);
  }, [items]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, imageFile: files?.[0] ?? null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const openAddModal = () => {
    setItemModalMode("add");
    setEditingItemId(null);
    setForm(emptyForm);
    setSaveError("");
  };

  const openEditModal = (item) => {
    setItemModalMode("edit");
    setEditingItemId(item.id);
    setForm({
      title: item.title || "",
      price: String(item.price ?? ""),
      ingredients: item.ingredients || "",
      unit: item.weight || "",
      imageFile: null,
    });
    setSaveError("");
  };

  const closeItemModal = () => {
    setItemModalMode(null);
    setEditingItemId(null);
    setForm(emptyForm);
    setSaveError("");
  };

  const handleSaveItem = async () => {
    setSaveError("");
    if (!categoryId) {
      setSaveError("Не указана категория");
      return;
    }
    if (!form.title?.trim()) {
      setSaveError("Введите название");
      return;
    }
    if (form.price === "" || Number(form.price) < 0) {
      setSaveError("Введите цену");
      return;
    }
    if (!token) {
      setSaveError("Нет авторизации");
      return;
    }

    const isEdit = itemModalMode === "edit";

    if (!isEdit && !form.imageFile) {
      setSaveError("Выберите фото (jpg, png, webp, gif, до 2 МБ)");
      return;
    }

    const formData = new FormData();
    if (form.imageFile) {
      formData.append("image", form.imageFile);
    }
    formData.append("title", form.title.trim());
    formData.append("price", String(form.price));
    formData.append("ingredients", form.ingredients?.trim() || "");
    formData.append("weight", form.unit?.trim() || "");
    formData.append("category_id", String(categoryId));

    try {
      setIsSaving(true);
      if (isEdit && editingItemId != null) {
        await updateMenuItem(token, editingItemId, formData);
      } else {
        await createMenuItem(token, formData);
      }
      closeItemModal();
      onMenuUpdated?.();
    } catch (err) {
      setSaveError(err.message || "Ошибка сохранения");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !token) return;
    try {
      setIsDeleting(true);
      await deleteMenuItem(token, deleteTarget.id);
      setDeleteTarget(null);
      onMenuUpdated?.();
    } catch (e) {
      alert(e.message || "Ошибка удаления");
    } finally {
      setIsDeleting(false);
    }
  };

  const itemModalOpen = itemModalMode === "add" || itemModalMode === "edit";
  const isEdit = itemModalMode === "edit";

  const rootClass = embedded
    ? "menu-category menu-category--embedded"
    : "menu-category";

  return (
    <div className={rootClass}>
      {showCategoryTitle ? (
        <h1 id={category} className="menu-category__title">
          {category}
        </h1>
      ) : null}

      <div className="menu-category__list">
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            userRole={userRole}
            isFavorite={favoriteIds?.has(item.id)}
            onFavoriteToggle={onFavoriteToggle}
            onAddToCart={onAddToCart}
            onAdminDeleteRequest={userRole === "admin" ? setDeleteTarget : undefined}
            onAdminEditRequest={userRole === "admin" ? openEditModal : undefined}
          />
        ))}
      </div>

      {userRole === "admin" && showAdminAdd ? (
        <CategoryAdminAddReveal hint="Добавить блюдо в категорию">
          <ActionButton iconClass="icon-add" onClick={openAddModal} />
        </CategoryAdminAddReveal>
      ) : null}

      {deleteTarget ? (
        <Modal
          title="Удалить блюдо"
          onClose={() => {
            if (!isDeleting) setDeleteTarget(null);
          }}
          body={
            <p className="text-center">
              Действительно удалить блюдо «{deleteTarget.title}»? Это действие нельзя отменить.
            </p>
          }
          footer={
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Button
                text={isDeleting ? "Удаление..." : "Удалить"}
                onClick={confirmDelete}
                disabled={isDeleting}
              />
            </div>
          }
        />
      ) : null}

      {itemModalOpen ? (
        <Modal
          title={isEdit ? "Редактировать блюдо" : "Добавить новое блюдо"}
          onClose={isSaving ? () => {} : closeItemModal}
          body={
            <div className="d-flex flex-wrap justify-content-center gap-4">
              <Input
                name="image"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.gif"
                onChange={handleChange}
              />
              <Input
                name="title"
                placeholder="Название"
                value={form.title}
                onChange={handleChange}
              />
              <Input
                name="price"
                type="number"
                placeholder="Цена"
                value={form.price}
                onChange={handleChange}
                min={0}
              />
              <Input
                name="ingredients"
                placeholder="Ингредиенты / перечисление"
                value={form.ingredients}
                onChange={handleChange}
              />
              <Input
                name="unit"
                placeholder="Гр/мл"
                value={form.unit}
                onChange={handleChange}
              />
              {saveError ? <p className="text-danger w-100 text-center">{saveError}</p> : null}
              <p className="w-100 text-center small">
                {isEdit
                  ? "Новое фото – по желанию; если не выбрать, останется текущее изображение."
                  : "Фото: jpg, png, webp или gif, не больше 2 МБ."}
              </p>
            </div>
          }
          footer={
            <div className="d-flex justify-content-center">
              <Button
                text={isSaving ? "Сохранение..." : isEdit ? "Сохранить" : "Добавить"}
                onClick={handleSaveItem}
                disabled={isSaving}
              />
            </div>
          }
        />
      ) : null}
    </div>
  );
}
