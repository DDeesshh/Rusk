import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** При смене страницы — в начало (якоря # на той же странице не трогаем). */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
