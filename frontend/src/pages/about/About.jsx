import "../about/About.css";
import Carousel from "../../components/Carousel";
import Reviews from "./components/Reviews";
import Stats from "./components/Stats";
import { useUserRoles } from "../../users/useUserRoles";
import IconDecorate from "../../components/ui/IconDecorate";

const About = ({ userRole, setUserRole }) => {
    const { modal } = useUserRoles({ userRole, setUserRole });

    const slides = [
        { type: "image", src: "/img/Rusk-1.png" },
        { type: "image", src: "/img/Rusk-2.png" },
        { type: "image", src: "/img/Rusk-3.png" },
        { type: "image", src: "/img/Rusk-4.png" }
    ];

    return (
        <>
            <div className="content">
                <div className="container about">
                    <div className="about__description">
                        <div className="about__description-title">
                            <h1>О ресторане</h1>
                        </div>
                        <p>RUSK – современный ресторан русской кухни, где традиции гармонично сочетаются с авторским взглядом на знакомые блюда. Мы уделяем внимание качеству ингредиентов, вкусу и подаче, сохраняя атмосферу уюта и настоящего гостеприимства.

Ресторан подходит как для спокойных семейных ужинов, так и для встреч с друзьями или особых событий.<br /> <br />Наша команда создает пространство, в котором хочется проводить время, наслаждаться кухней и возвращаться снова.

В меню представлены как классические позиции русской кухни, так и современные интерпретации популярных рецептов. Мы регулярно обновляем подборки блюд, учитывая предпочтения гостей и сезонные продукты, чтобы каждое посещение оставляло новые впечатления. </p>
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
                            <p className="mb-3">Мы создаем гастрономические впечатления под разные поводы и задачи – от камерных встреч до масштабных мероприятий.</p>
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