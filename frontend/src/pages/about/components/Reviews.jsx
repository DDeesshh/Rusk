import { useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {
    IconButton,
    ReviewCardAdminDelete,
    ReviewsAddReviewReveal,
} from "../../../components/ui/ActionButton.jsx";
import { Icon } from "../../../components/ui/IconDecorate.jsx";
import { Modal } from "../../../components/ui/Modal.jsx";
import Button from "../../../components/ui/Button.jsx";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { createReview, deleteReview, fetchReviews } from "../../../services/reviewService.js";
import "swiper/css";
import "swiper/css/navigation";

function formatReviewDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

export default function Reviews({ userRole = "guest" }) {
    const { token } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newText, setNewText] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [deleteSubmitting, setDeleteSubmitting] = useState(false);

    const loadReviews = useCallback(async () => {
        setLoading(true);
        setLoadError("");
        try {
            const data = await fetchReviews();
            setReviews(data.reviews || []);
        } catch (e) {
            setLoadError(e.message || "Не удалось загрузить отзывы");
            setReviews([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadReviews();
    }, [loadReviews]);

    const closeDeleteModal = () => {
        if (deleteSubmitting) return;
        setDeleteConfirmId(null);
    };

    const confirmDeleteReview = async () => {
        if (!token || userRole !== "admin" || deleteConfirmId == null) return;
        setDeleteSubmitting(true);
        try {
            await deleteReview(token, deleteConfirmId);
            setReviews((prev) => prev.filter((r) => r.id !== deleteConfirmId));
            setDeleteConfirmId(null);
        } catch (e) {
            alert(e.message || "Не удалось удалить отзыв");
        } finally {
            setDeleteSubmitting(false);
        }
    };

    const handleAdd = async () => {
        if (!token) return;
        setSubmitError("");
        const trimmed = newText.trim();
        if (trimmed.length < 5) {
            setSubmitError("Минимум 5 символов");
            return;
        }
        setSubmitting(true);
        try {
            const data = await createReview(token, trimmed);
            if (data.review) {
                setReviews((prev) => [data.review, ...prev]);
            } else {
                await loadReviews();
            }
            setShowModal(false);
            setNewText("");
        } catch (e) {
            setSubmitError(e.message || "Не удалось отправить отзыв");
        } finally {
            setSubmitting(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSubmitError("");
        setNewText("");
    };

    return (
        <div className="container reviews">
            <h1 className="reviews__title">Отзывы посетителей</h1>

            {loadError ? <p className="reviews__load-error">{loadError}</p> : null}

            <div className="reviews__slider">
                {loading ? (
                    <p className="reviews__empty">Загрузка…</p>
                ) : reviews.length === 0 ? (
                    <p className="reviews__empty">Пока нет отзывов – будьте первым.</p>
                ) : (
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
                                    <Icon
                                        className="icon-quote"
                                        size="30px"
                                        color="var(--primary-color)"
                                    />
                                    <div className="reviews-item__content">
                                        <p className="reviews-item__text mt-2">{review.text}</p>
                                        <div className="reviews-item__meta">
                                            <p className="reviews__author">{review.author}</p>
                                            <time
                                                className="reviews-item__date"
                                                dateTime={review.createdAt || undefined}
                                            >
                                                {formatReviewDate(review.createdAt)}
                                            </time>
                                        </div>
                                    </div>
                                    {userRole === "admin" && (
                                        <ReviewCardAdminDelete
                                            onClick={() => setDeleteConfirmId(review.id)}
                                            tooltip="Удалить отзыв"
                                        />
                                    )}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}

                {!loading && reviews.length > 0 ? (
                    <>
                        <IconButton className="icon-arrow-left reviews-prev ms-lg-3" />
                        <IconButton className="icon-arrow-right reviews-next me-lg-3" />
                    </>
                ) : null}
            </div>

            {userRole === "client" && (
                <ReviewsAddReviewReveal
                    onClick={() => setShowModal(true)}
                    label="Оставить отзыв"
                />
            )}

            {showModal && (
                <Modal
                    title="Оставить отзыв"
                    onClose={closeModal}
                    body={
                        <div className="d-flex flex-column align-items-center gap-3">
                            {submitError ? (
                                <p className="reviews__submit-error mb-0">{submitError}</p>
                            ) : null}
                            <textarea
                                className="reviews-modal__textarea"
                                name="review"
                                placeholder="Ваш отзыв"
                                rows={5}
                                value={newText}
                                onChange={(e) => setNewText(e.target.value)}
                                maxLength={2000}
                            />
                        </div>
                    }
                    footer={
                        <div className="d-flex justify-content-center">
                            <Button
                                text={submitting ? "Отправка…" : "Отправить"}
                                onClick={handleAdd}
                                disabled={submitting}
                            />
                        </div>
                    }
                />
            )}

            {userRole === "admin" && deleteConfirmId !== null ? (
                <Modal
                    title="Удаление отзыва"
                    onClose={closeDeleteModal}
                    body={
                        <p className="reviews__delete-confirm-text mb-0 text-center">
                            Точно удалить комментарий?
                        </p>
                    }
                    footer={
                        <div className="d-flex flex-wrap justify-content-center gap-3">
                            <Button
                                text={deleteSubmitting ? "Удаление…" : "Удалить"}
                                onClick={confirmDeleteReview}
                                disabled={deleteSubmitting}
                            />
                        </div>
                    }
                />
            ) : null}
        </div>
    );
}
