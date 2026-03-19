import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="container footer__container">

        <div className="footer__contacts">
          <a href="mailto:restaurant@rusk.com" className="d-block pb-3">restaurant@rusk.com</a>
          <a href="tel:+79646414747" className="d-block pb-3">+7 (964) 641-47-47</a>
          <a href="https://yandex.ru/maps/?text=Большой%20Саввинский%20пер.,%20д.%201" target="_blank"
          >
            Москва, улица Арбат, 44с1</a>
        </div>

        <div className="footer__center">
          <h1 className="footer__center-logo">RUSK</h1>
          <p>2026 © ресторан RUSK. Все права защищены.</p>
        </div>

        <div className="footer__hours">
          <p className="pb-3">ПН – ПТ: 11:00 – 21:00</p>
          <p className="pb-3">СБ – ВС: 11:00 – 00:00</p>
          <p>Счастливые часы: 14:00 – 16:00</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;