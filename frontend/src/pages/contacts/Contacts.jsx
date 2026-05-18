import Carousel from "../../components/Carousel.jsx";
import Book from "../../components/Book.jsx";

const Contacts = () => {

    const slides = [
        { type: "video", src: "/img/Rusk-video.mp4" },
        { type: "image", src: "/img/Rusk-drinks.png" },
        { type: "image", src: "/img/Rusk-dishes.png" },
        { type: "image", src: "/img/Rusk-team.png" }
    ];

    const captions = [
        {
            title: "Все лучшее от русской кухни",
            text: "Самые любимые блюда для вашего гастрономического удовольствия."
        },
        {
            title: "Русские напитки и настойки",
            text: "Попробуйте морсы и настойки, приготовленные по старинным рецептам."
        },
        {
            title: "Классика и современность",
            text: "Традиционные рецепты с авторским подходом наших поваров."
        },
        {
            title: "Команда и мастерство",
            text: "Опытный персонал, объединяющий заботу и внимание к каждому гостю."
        }
    ];
    return (
        <>

            <Carousel slides={slides} captions={captions} showCaptions />
            <div className="content">
                <Book />
            </div>

            <iframe
                src="https://yandex.ru/map-widget/v1/?ll=37.586536%2C55.748093&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1NjcxMDg2MBI40KDQvtGB0YHQuNGPLCDQnNC-0YHQutCy0LAsINGD0LvQuNGG0LAg0JDRgNCx0LDRgiwgNDTRgTEiCg2cWBZCFQz-XkI%2C&z=16.17"
                width="100%"
                height="400"
                style={{ marginBottom: "6.875rem" }}
                allowFullScreen
            ></iframe>
        </>
    );

};

export default Contacts;