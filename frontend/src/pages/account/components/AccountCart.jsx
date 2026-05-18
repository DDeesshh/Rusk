import { useCart } from "../../../contexts/CartContext.jsx";
import { IconButton } from "../../../components/ui/ActionButton.jsx";
import Button from "../../../components/ui/Button.jsx";
import { formatWeightWithQuantity } from "../../../utils/cartWeight.js";

import { useNavigate } from "react-router-dom";

export default function AccountCart() {
  const navigate = useNavigate();
  const { items, increment, decrement, totalSum } = useCart();

  const handleCheckout = () => {
    navigate("/account/checkout");
  };

  if (items.length === 0) {
    return (
      <p className="account-admin-clients__status">
        Корзина пуста. Добавьте блюда в меню или в избранном.
      </p>
    );
  }

  return (
    <div className="account-cart">
      <p className="account-cart__text text-center mb-5">Ваш список блюд в корзине. Добавляйте позиции, чтобы не потерять их и заказывать в один клик.</p>
      <div className="account-admin-table-outer">
        <table className="account-admin-table account-admin-table--cart">
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">№</th>
              <th scope="col">Название</th>
              <th scope="col">гр/мл</th>
              <th scope="col">Количество</th>
              <th scope="col">Сумма</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row, index) => {
              const lineSum = row.basePrice * row.quantity;
              const weightShown = formatWeightWithQuantity(row.weight, row.quantity);
              return (
                <tr key={row.menuItemId}>
                  <td>{index + 1}</td>
                  <td>{row.title}</td>
                  <td>{weightShown}</td>
                  <td>
                    <div className="account-cart__qty">
                      <IconButton
                        type="button"
                        className="icon-remove account-cart__qty-btn"
                        aria-label="Меньше"
                        onClick={() => decrement(row.menuItemId)}
                      />
                      <span className="account-cart__qty-value">{row.quantity}</span>
                      <IconButton
                        type="button"
                        className="icon-add account-cart__qty-btn"
                        aria-label="Больше"
                        onClick={() => increment(row.menuItemId)}
                      />
                    </div>
                  </td>
                  <td>{lineSum}₽</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="account-cart__total">
        <span className="account-cart__total-label">Итого:</span>
        <span className="account-cart__total-sum">{totalSum}₽</span>
      </div>

      <div className="account-cart__checkout">
        <Button text="Оформить заказ" onClick={handleCheckout} />
      </div>
    </div>
  );
}
