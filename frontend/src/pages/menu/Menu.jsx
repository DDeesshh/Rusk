import MenuCategory from "./MenuCategory.jsx";
import NavButton from "../../components/ui/NavButton.jsx";
import "./Menu.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Menu({ userRole }) {
  const [menuData, setMenuData] = useState([]);
  const { hash } = useLocation();

  useEffect(() => {
    fetch("http://localhost:4000/api/menu")
      .then(res => res.json())
      .then(data => {
        setMenuData(data);
        if (hash) {
          const el = document.getElementById(decodeURIComponent(hash.slice(1)));
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }
      })
      .catch(console.error);
  }, [hash]);

  return (
    <div className="container menu">
      <div className="content">

        <div className="menu__nav">
          {menuData.map(cat => (
            <NavButton
              key={cat.category}
              text={cat.category}
              to={`/menu#${cat.category}`}
            />
          ))}
        </div>

        {menuData.map((cat) => (
          <MenuCategory key={cat.category} data={cat} userRole={userRole} categories={menuData} />
        ))}
      </div>
    </div>
  );
}
