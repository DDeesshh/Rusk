import { useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import NavButton from "../../components/ui/NavButton.jsx";
import UserProfile from "./components/UserProfile.jsx";
import "./Account.css";

const getTabsByRole = (role) => {
  if (role === "admin") {
    return [
      { id: "profile", label: "Данные пользователя" },
      { id: "clients", label: "Клиенты" },
      { id: "orders", label: "Заказы" },
    ];
  }

  return [
    { id: "profile", label: "Данные пользователя" },
    { id: "favorites", label: "Избранное" },
    { id: "history", label: "История заказов" },
    { id: "cart", label: "Корзина" },
  ];
};

export default function Account() {
  const { user, userRole } = useAuth();
  const tabs = useMemo(() => getTabsByRole(userRole), [userRole]);
  const [activeTab, setActiveTab] = useState("profile");

  const displayName = user?.name || (userRole === "admin" ? "Админ" : "Гость");

  const content = (() => {
    if (activeTab === "profile") {
      return <UserProfile user={user} />;
    }

    return (
      <div className="account__stub">
        <p>Эта вкладка будет сверстана следующей.</p>
      </div>
    );
  })();

  return (
    <div className="account">
      <div className="account__hero">
        <div className="account__overlay">
          <div className="container">
            <h1 className="account__title">Здравствуйте, {displayName}!</h1>

            <div className="account__tabs">
              {tabs.map((tab) => (
                <NavButton
                  key={tab.id}
                  text={tab.label}
                  to="#"
                  className={`account__tab-link ${activeTab === tab.id ? "is-active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </div>

            <div className="account__content">{content}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

