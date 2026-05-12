import Form from './Form';
import IconDecorate from './ui/IconDecorate.jsx';

const Book = () => {
    return (
        <>
            <div className="book__title">
                <h1 className='mb-4'>Забронируйте стол</h1>
                <p>Ваш уютный столик уже ждёт – просто оставьте заявку на бронь.</p>
            </div>

            <div className="container">
                <div className="d-flex justify-content-between flex-column flex-lg-row align-items-center align-items-lg-start">
                    <div className="col-lg-5 mb-4 mb-lg-0 mt-2">
                        <div className="d-flex mb-5 align-items-center">
                            <IconDecorate iconClass="icon-location" />
                            <div className="ms-4">
                                <h2 className="mb-4">Адрес</h2>
                                <a href="https://yandex.ru/maps/?text=Большой%20Саввинский%20пер.,%20д.%201" target="_blank"
                                >
                                    Москва, улица Арбат, 44с1</a>
                            </div>
                        </div>

                        <div className="d-flex mb-5 align-items-center">
                            <IconDecorate iconClass="icon-phone" />
                            <div className="ms-4">
                                <h2 className="mb-4">Телефон</h2>
                                <a href="tel:+79646414747" className="d-block pb-3">+7 (964) 641-47-47</a>
                            </div>
                        </div>

                        <div className="d-flex">
                            <IconDecorate iconClass="icon-clock" className='mt-2' />
                            <div className="ms-4">
                                <h2 className="mb-4">Часы работы</h2>
                                <p className="mb-2">ПН - ПТ: 11:00 - 21:00</p>
                                <p className="mb-2">СБ - ВС: 11:00 - 00:00</p>
                                <p className="mb-0">Счастливые часы: 14:00 - 16:00</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6" style={{ width: 'auto' }}>
                        <Form />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Book;
