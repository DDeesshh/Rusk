import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** При смене страницы – в начало. Скролл к форме брони – отдельно в Home. */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
