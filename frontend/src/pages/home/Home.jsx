import Carousel from "../../components/Carousel.jsx";
import TopDishes from "./components/TopDishes.jsx";
import HomeMenu from "./components/HomeMenu.jsx";
import Book from "../../components/Book.jsx";
import "../home/Home.css";

const Home = ({ userRole }) => {

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
            <TopDishes />
            <HomeMenu userRole={userRole} />
            <div className="content">
                <Book />
            </div>
        </>
    );

};

export default Home;