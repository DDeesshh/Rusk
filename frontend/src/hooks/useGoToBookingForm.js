import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { scrollToBookingForm } from "../utils/scrollToBookingForm.js";

export const BOOKING_SCROLL_STATE = { scrollToBooking: true };

export function useGoToBookingForm() {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    if (location.pathname === "/") {
      scrollToBookingForm();
      return;
    }

    navigate("/", { state: BOOKING_SCROLL_STATE });
  }, [location.pathname, navigate]);
}
