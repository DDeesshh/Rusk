import "../about/About.css";
import Carousel from "../../components/Carousel";
import Reviews from "./components/Reviews";
import Stats from "./components/Stats";
import { useUserRoles } from "../../users/useUserRoles";
import IconDecorate from "../../components/ui/IconDecorate";

const About = ({ userRole, setUserRole }) => {
    const { modal } = useUserRoles({ userRole, setUserRole });

    const slides = [
        { type: "image", src: "/img/restaurant2.png" },
        { type: "image", src: "/img/restaurant.png" },
        { type: "image", src: "/img/restaurant3.png" }
    ];

    return (
        <>
            <div className="content">
                <div className="container about">
                    <div className="about__description">
                        <div className="about__description-title">
                            <h1>О ресторане</h1>
                        </div>
                        <p>Lorem ipsum dolor sit amet consectetur. Nunc viverra diam non condimentum risus gravida. Quam praesent massa dolor quam. Nec habitant orci nulla viverra neque tristique pulvinar arcu. Ut turpis mi sem lacus ut penatibus. <br /><br /> Lorem lorem orci urna eget feugiat sed et. Nec laoreet pretium in tellus amet. Et sem mi adipiscing velit. Duis vulputate vestibulum nullam sed dictum ipsum pellentesque. Sit dui auctor enim at mauris viverra nulla. Leo in non vestibulum leo aliquet montes varius ante enim. Congue proin blandit ac ultrices. Vitae duis et eget lorem ipsum adipiscing nulla. Cursus sed ullamcorper convallis ultricies semper cras at facilisi. In turpis lobortis sed dolor. </p>
                    </div>
                </div>
            </div>
            <Carousel slides={slides} captions={[]} showCaptions={false} overlayColor={false} />
            <div className="content">
                <Reviews userRole={userRole} />
            </div>
            {modal}
            <div className="content">
                <div className="container services">
                    <div className="about__services">
                        <div className="about__services-title">
                            <h1 className="mb-4">Особые услуги</h1>
                            <p className="mb-3">Lorem ipsum dolor sit amet consectetur. Nunc viverra diam non condimentum risus gravida.</p>
                        </div>
                    </div>
                    <div className="about__services-content">
                        <div className="row g-5">
                            <div className="col-md-6">
                                <div className="d-flex flex-direction-row">
                                    <div className="me-3">
                                        <IconDecorate iconClass="icon-location" />
                                    </div>
                                    <div>
                                        <h2 className="mb-3">Кейтеринг</h2>
                                        <p>Насладитесь выездным обслуживанием и авторским меню от шефа.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="d-flex flex-direction-row">
                                    <div className="me-3">
                                        <IconDecorate iconClass="icon-location" />
                                    </div>
                                    <div>
                                        <h2 className="mb-3">Мастер-классы</h2>
                                        <p>Откройте секреты фирменных блюд на занятиях с нашим шеф-поваром.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="d-flex flex-direction-row">
                                    <div className="me-3">
                                        <IconDecorate iconClass="icon-location" />
                                    </div>
                                    <div>
                                        <h2 className="mb-3">Дегустационные вечера</h2>
                                        <p>Погрузитесь в атмосферу ужинов с авторскими сетами и напитками.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="d-flex flex-direction-row">
                                    <div className="me-3">
                                        <IconDecorate iconClass="icon-location" />
                                    </div>
                                    <div>
                                        <h2 className="mb-3">Проведение мероприятий</h2>
                                        <p>Создайте незабываемые свадьбы, банкеты и корпоративы под ключ.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Stats />
        </>
    );
};

export default About;