import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavButton from "../../components/ui/NavButton.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useCart } from "../../contexts/CartContext.jsx";
import Input from "../../components/ui/Input.jsx";
import RadioButton from "../../components/ui/RadioButton.jsx";
import Button from "../../components/ui/Button.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { createOrder } from "../../services/orderService.js";
import { validateOrderSlot } from "../../lib/orderHours.js";
import "./Checkout.css";

const PICKUP_ADDRESS = "Большой Саввинский пер., д. 1";
const PICKUP_HOURS = "ПН – ПТ: 11:00 – 21:00;      СБ – ВС: 11:00 – 00:00";
const DELIVERY_FEE = 700;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+7\d{10}$/;

export default function Checkout() {
  const navigate = useNavigate();
  const { user, userRole, token } = useAuth();
  const { items, totalSum, clearCart } = useCart();

  const [deliveryType, setDeliveryType] = useState("pickup");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({});
  const [successModal, setSuccessModal] = useState({ open: false, displayNumber: "" });
  const [frozenTotal, setFrozenTotal] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    time: "",
    date: "",
    comment: "",
    city: "",
    street: "",
    house: "",
    apartment: "",
    entrance: "",
    floor: "",
    intercom: "",
  });

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const initial = useMemo(
    () => ({
      name: user?.name?.trim() || "",
      phone: user?.phone?.trim() || "",
      email: user?.email?.trim() || "",
    }),
    [user]
  );

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: initial.name,
      phone: initial.phone,
      email: initial.email,
    }));
  }, [initial.name, initial.email, initial.phone]);

  useEffect(() => {
    if (userRole !== "client") {
      navigate("/", { replace: true });
    }
  }, [userRole, navigate]);

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      navigate("/account?tab=cart", { replace: true });
    }
  }, [items.length, orderPlaced, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitError("");
  };

  const handleDeliveryChange = (e) => {
    setDeliveryType(e.target.value);
    setErrors((prev) => ({ ...prev, date: "", time: "" }));
    setSubmitError("");
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const validate = () => {
    const next = {};
    const name = form.name.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();

    if (!name || name.length < 2) {
      next.name = "Укажите имя (не короче 2 символов)";
    }
    if (!PHONE_REGEX.test(phone)) {
      next.phone = "Телефон в формате +79991234567";
    }
    if (!EMAIL_REGEX.test(email)) {
      next.email = "Введите корректный email";
    }
    if (!form.date) {
      next.date = "Укажите дату";
    }
    if (!form.time) {
      next.time = "Укажите время";
    }

    const mode = deliveryType === "pickup" ? "pickup" : "delivery";
    if (form.date && form.time) {
      const slotMsg = validateOrderSlot(form.date, form.time, mode);
      if (slotMsg) {
        next.time = slotMsg;
      }
    }

    if (mode === "delivery") {
      const addrFields = ["city", "street", "house", "apartment", "entrance", "floor", "intercom"];
      for (const key of addrFields) {
        if (!String(form[key] || "").trim()) {
          next[key] = "Обязательное поле";
        }
      }
    }

    return next;
  };

  const handleSubmit = async () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmitError("");
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    if (!token) {
      setSubmitError("Требуется авторизация");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        delivery_type: deliveryType,
        payment_method: paymentMethod,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        date: form.date,
        time: form.time,
        comment: form.comment.trim(),
        city: form.city.trim(),
        street: form.street.trim(),
        house: form.house.trim(),
        apartment: form.apartment.trim(),
        entrance: form.entrance.trim(),
        floor: form.floor.trim(),
        intercom: form.intercom.trim(),
        items: items.map((row) => ({
          menuItemId: row.menuItemId,
          quantity: row.quantity,
        })),
      };

      const data = await createOrder(token, payload);
      const displayNumber = data.order?.displayNumber || String(data.order?.id || "");
      setFrozenTotal(checkoutTotal);
      setOrderPlaced(true);
      clearCart();
      setSuccessModal({ open: true, displayNumber });
    } catch (e) {
      setSubmitError(e.message || "Не удалось оформить заказ");
    } finally {
      setSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setSuccessModal({ open: false, displayNumber: "" });
    navigate("/account");
  };

  if (userRole !== "client" || (items.length === 0 && !orderPlaced)) {
    return null;
  }

  const isPickup = deliveryType === "pickup";
  const timeLabel = isPickup ? "Время получения" : "Время доставки";
  const dateLabel = isPickup ? "Дата получения" : "Дата доставки";
  const deliveryFee = isPickup ? 0 : DELIVERY_FEE;
  const checkoutTotal = totalSum + deliveryFee;

  return (
    <div className="checkout account">
      {successModal.open ? (
        <Modal
          title="Вы оформили заказ!"
          body={
            <>
              <p className="checkout__order-success-number">№{successModal.displayNumber}</p>
              <p className="checkout__order-success-text">
                Статус заказа можно отслеживать в личном кабинете в разделе «Данные пользователя» – блок «Детали заказа».
              </p>
            </>
          }
          footer={<Button text="Ок" onClick={closeSuccessModal} />}
          onClose={closeSuccessModal}
        />
      ) : null}

      <div className="account__hero">
        <div className="account__overlay">
          <div className="container">
            <p className="checkout__back">
              <NavButton text="← Корзина" to="/account?tab=cart" />
            </p>
            <h1 className="checkout__title account__title">Оформление заказа</h1>
            <p className="checkout__intro">
              Проверьте данные и способ получения. Заказ сохраняется в личном кабинете – статус можно отслеживать в блоке «Детали заказа».
            </p>

            {submitError ? <p className="checkout__submit-error">{submitError}</p> : null}

            <div className="checkout__grid">
              <div className="checkout__col">
                <div className="checkout__section">
                  <h2 className="checkout__section-title">Ваши контактные данные:</h2>
                  <div className="checkout__inputs">
                    <Input
                      name="name"
                      placeholder="Имя*"
                      value={form.name}
                      onChange={handleChange}
                      errorText={errors.name}
                    />
                    <Input
                      name="phone"
                      placeholder="Телефон*"
                      value={form.phone}
                      onChange={handleChange}
                      errorText={errors.phone}
                    />
                    <Input
                      name="email"
                      placeholder="Email*"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      errorText={errors.email}
                    />
                  </div>
                </div>

                <div className="checkout__section">
                  <h2 className="checkout__section-title">{timeLabel}:</h2>
                  <div className="checkout__inputs">
                    <Input
                      name="time"
                      type="time"
                      placeholder="Время*"
                      value={form.time}
                      onChange={handleChange}
                      errorText={errors.time}
                    />
                  </div>
                </div>

                <div className="checkout__section">
                  <h2 className="checkout__section-title">{dateLabel}:</h2>
                  <div className="checkout__inputs">
                    <Input
                      name="date"
                      type="date"
                      placeholder="Дата*"
                      value={form.date}
                      onChange={handleChange}
                      min={minDate}
                      errorText={errors.date}
                    />
                  </div>
                </div>
              </div>

              <div className="checkout__col">
                <div className="checkout__section">
                  <h2 className="checkout__section-title">Доставка:</h2>
                  <div className="checkout__radios">
                    <RadioButton
                      label="Самовывоз"
                      name="deliveryType"
                      value="pickup"
                      checked={isPickup}
                      onChange={handleDeliveryChange}
                    />
                    <RadioButton
                      label="На дом"
                      name="deliveryType"
                      value="delivery"
                      checked={!isPickup}
                      onChange={handleDeliveryChange}
                    />
                  </div>
                </div>

                {isPickup ? (
                  <div className="checkout__section">
                    <p className="checkout__hint">
                      Заказ можно забрать по адресу ресторана в выбранное время. При необходимости укажите
                      комментарий к заказу.
                    </p>
                    <h2 className="checkout__section-title">Комментарий:</h2>
                    <div className="checkout__inputs checkout__inputs--align-start">
                      <Input name="comment" placeholder="Комментарий" value={form.comment} onChange={handleChange} />
                    </div>
                  </div>
                ) : (
                  <div className="checkout__section">
                    <div className="checkout__address-grid">
                      <Input
                        name="city"
                        placeholder="Город*"
                        value={form.city}
                        onChange={handleChange}
                        errorText={errors.city}
                      />
                      <Input
                        name="street"
                        placeholder="Улица*"
                        value={form.street}
                        onChange={handleChange}
                        errorText={errors.street}
                      />
                      <Input
                        name="house"
                        placeholder="Дом*"
                        value={form.house}
                        onChange={handleChange}
                        errorText={errors.house}
                      />
                      <Input
                        name="apartment"
                        placeholder="Квартира/офис*"
                        value={form.apartment}
                        onChange={handleChange}
                        errorText={errors.apartment}
                      />
                      <Input
                        name="entrance"
                        placeholder="Подъезд*"
                        value={form.entrance}
                        onChange={handleChange}
                        errorText={errors.entrance}
                      />
                      <Input
                        name="floor"
                        placeholder="Этаж*"
                        value={form.floor}
                        onChange={handleChange}
                        errorText={errors.floor}
                      />
                      <Input
                        name="intercom"
                        placeholder="Код домофона*"
                        value={form.intercom}
                        onChange={handleChange}
                        errorText={errors.intercom}
                      />
                      <Input name="comment" placeholder="Комментарий" value={form.comment} onChange={handleChange} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="checkout__footer">
              <div className="checkout__section">
                <h2 className="checkout__section-title">Способ оплаты:</h2>
                <div className="checkout__radios">
                  <RadioButton
                    label="Картой"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={handlePaymentChange}
                  />
                  <RadioButton
                    label="Наличными"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={handlePaymentChange}
                  />
                </div>
              </div>

              {isPickup ? (
                <div className="checkout__pickup-info">
                  <p>
                    <span className="checkout__pickup-label">Адрес:</span> {PICKUP_ADDRESS}
                  </p>
                  <p>
                    <span className="checkout__pickup-label">Часы работы:</span> {PICKUP_HOURS}
                  </p>
                </div>
              ) : (
                <p className="checkout__delivery-fee">
                  <span className="checkout__delivery-fee-label">Сумма за доставку:</span> {DELIVERY_FEE}₽
                </p>
              )}

              <div className="checkout__total">
                <span className="checkout__total-label">Итого:</span>
                <span className="checkout__total-sum">{frozenTotal != null ? frozenTotal : checkoutTotal}₽</span>
              </div>

              <div className="checkout__submit">
                <Button
                  text={submitting ? "Отправка..." : "Подтвердить заказ"}
                  onClick={handleSubmit}
                  disabled={submitting}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
