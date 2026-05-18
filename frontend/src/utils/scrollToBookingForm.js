export const BOOKING_FORM_ID = "booking-form";

/** Скролл к форме бронирования на главной (с повтором после отрисовки страницы). */
export function scrollToBookingForm() {
  const run = () => {
    document.getElementById(BOOKING_FORM_ID)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  run();
  requestAnimationFrame(() => requestAnimationFrame(run));
  window.setTimeout(run, 800);
}
