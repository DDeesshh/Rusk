import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ActionButton, { IconButton } from "../../../components/ui/ActionButton.jsx";
import { Icon } from "../../../components/ui/IconDecorate.jsx";
import { Modal } from "../../../components/ui/Modal.jsx";
import Input from "../../../components/ui/Input.jsx";
import Button from "../../../components/ui/Button.jsx";
import "swiper/css";
import "swiper/css/navigation";

const reviewsData = [
    { id: 1, text: "Очень понравилось, всё вкусно!", author: "Анна" },
    { id: 2, text: "Отличный сервис и уютная атмосфера.", author: "Игорь" },
    { id: 3, text: "Настоящая русская кухня, рекомендую!", author: "Мария" },
    { id: 4, text: "Были с друзьями, всем зашло!", author: "Алексей" },
    { id: 5, text: "Прекрасные блюда и внимательный персонал.", author: "Светлана" },
    { id: 6, text: "Будем приходить снова и снова.", author: "Олег" },
];

export default function Reviews({ userRole = "guest" }) {
    const [reviews, setReviews] = useState(reviewsData);
    const [showModal, setShowModal] = useState(false);
    const [newReview, setNewReview] = useState({ text: "", author: "" });

    const handleDelete = (id) => {
        setReviews((prev) => prev.filter((r) => r.id !== id));
    };

    const handleAdd = () => {
        if (!newReview.text || !newReview.author) return;
        const newItem = {
            id: Date.now(),
            text: newReview.text,
            author: newReview.author,
        };
        setReviews([newItem, ...reviews]);
        setShowModal(false);
        setNewReview({ text: "", author: "" });
    };

    return (
        <div className="container reviews">
            <h1 className="reviews__title">Отзывы посетителей</h1>

            <div className="reviews__slider">
                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        prevEl: ".reviews-prev",
                        nextEl: ".reviews-next",
                    }}
                    spaceBetween={20}
                    slidesPerView={3}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1200: { slidesPerView: 3 },
                    }}
                >
                    {reviews.map((review) => (
                        <SwiperSlide key={review.id}>
                            <div className="reviews-item">
                                <Icon className="icon-quote" size="30px" color="var(--primary-color)"
                                />
                                <div className="reviews-item__content">
                                    <p className="mt-2">{review.text}</p>
                                    <p className="reviews__author">{review.author}</p>
                                </div>
                                {userRole === "client" && (
                                    <div className="reviews-item__actions">
                                        <ActionButton
                                            iconClass="icon-remove"
                                            className="reviews__delete-btn"
                                            onClick={() => handleDelete(review.id)}
                                        />
                                    </div>
                                )}
                            </div>

                        </SwiperSlide>
                    ))}
                </Swiper>

                <IconButton className="icon-arrow-left reviews-prev ms-lg-3" />
                <IconButton className="icon-arrow-right reviews-next me-lg-3" />
            </div>

            {/* Кнопка "написать отзыв" для клиента */}
            {userRole === "client" && (
                <ActionButton
                    iconClass="icon-add"
                    className="reviews__add-btn"
                    onClick={() => setShowModal(true)}
                />
            )}

            {/* Модальное окно для добавления отзыва */}
            {showModal && (
                <Modal
                    title="Оставить отзыв"
                    onClose={() => setShowModal(false)}
                    body={
                        <div className="d-flex flex-wrap justify-content-center gap-4">
                            <Input
                                name="name"
                                placeholder="Имя"
                                value={newReview.author}
                                onChange={(e) =>
                                    setNewReview({ ...newReview, author: e.target.value })
                                }
                                size='large'
                            />
                            <Input
                                name="review"
                                placeholder="Отзыв"
                                value={newReview.text}
                                onChange={(e) =>
                                    setNewReview({ ...newReview, text: e.target.value })
                                }
                                size='large'
                            />
                        </div>
                    }
                    footer={
                        <div className="d-flex justify-content-center">
                            <Button text="Отправить" onClick={handleAdd} />
                        </div>
                    }
                />
            )}
        </div>
    );
}
