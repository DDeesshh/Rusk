import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useSearchParams } from "react-router-dom";
import NavButton from "../../components/ui/NavButton.jsx";
import UserProfile from "./components/UserProfile.jsx";
import AccountFavorites from "./components/AccountFavorites.jsx";
import AccountCart from "./components/AccountCart.jsx";
import AccountAdminClients from "./components/AccountAdminClients.jsx";
import AccountAdminApplications from "./components/AccountAdminApplications.jsx";
import AccountAdminOrders from "./components/AccountAdminOrders.jsx";
import AccountOrderHistory from "./components/AccountOrderHistory.jsx";
import "./Account.css";

const getTabsByRole = (role) => {
  if (role === "admin") {
    return [
      { id: "profile", label: "Данные пользователя" },
      { id: "clients", label: "Клиенты" },
      { id: "applications", label: "Заявки" },
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (userRole === "client" && tab === "favorites") {
      setActiveTab("favorites");
      return;
    }
    if (userRole === "client" && (tab === "history" || tab === "cart")) {
      setActiveTab(tab);
      return;
    }
    if (
      userRole === "admin" &&
      (tab === "clients" || tab === "applications" || tab === "orders")
    ) {
      setActiveTab(tab);
      return;
    }
    setActiveTab("profile");
  }, [searchParams, userRole]);

  const selectTab = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "profile") {
      setSearchParams({});
      return;
    }
    const clientQueryTabs = ["favorites", "history", "cart"];
    const adminQueryTabs = ["clients", "applications", "orders"];
    if (userRole === "client" && clientQueryTabs.includes(tabId)) {
      setSearchParams({ tab: tabId });
      return;
    }
    if (userRole === "admin" && adminQueryTabs.includes(tabId)) {
      setSearchParams({ tab: tabId });
      return;
    }
    setSearchParams({});
  };

  const content = (() => {
    if (activeTab === "profile") {
      return <UserProfile user={user} />;
    }

    if (activeTab === "favorites" && userRole === "client") {
      return null;
    }

    if (activeTab === "cart" && userRole === "client") {
      return null;
    }

    if (activeTab === "clients" && userRole === "admin") {
      return <AccountAdminClients />;
    }

    if (activeTab === "applications" && userRole === "admin") {
      return <AccountAdminApplications />;
    }

    if (activeTab === "orders" && userRole === "admin") {
      return <AccountAdminOrders />;
    }

    if (activeTab === "history" && userRole === "client") {
      return <AccountOrderHistory />;
    }

    return (
      <div className="account__stub">
        <p>Эта вкладка будет сверстана следующей.</p>
      </div>
    );
  })();

  const isFavoritesClient = activeTab === "favorites" && userRole === "client";
  const isCartClient = activeTab === "cart" && userRole === "client";
  const isClientWideTab = isFavoritesClient || isCartClient;
  const isAdminWideTab =
    userRole === "admin" &&
    (activeTab === "clients" || activeTab === "applications" || activeTab === "orders");

  return (
    <div className="account">
      <div className="account__hero">
        <div className="account__overlay">
          <div className="container">
            <div className="account__tabs">
              {tabs.map((tab) => (
                <NavButton
                  key={tab.id}
                  text={tab.label}
                  to="#"
                  className={`account__tab-link ${activeTab === tab.id ? "is-active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    selectTab(tab.id);
                  }}
                />
              ))}
            </div>
          </div>

          {isClientWideTab ? (
            <div className="container menu">
              <div className="account-client-panel">
                {isFavoritesClient ? <AccountFavorites /> : <AccountCart />}
              </div>
            </div>
          ) : (
            <div className="container">
              <div
                className={`account__content ${isAdminWideTab ? "account__content--admin-wide" : ""}`}
              >
                {content}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
