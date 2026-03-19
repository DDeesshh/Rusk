import Carousel from "../../components/Carousel.jsx";
import TopDishes from "./components/TopDishes.jsx";
import Book from "../../components/Book.jsx";
import "../home/Home.css";

const Home = () => {

    const slides = [
        { type: "image", src: "/img/restaurant2.png" },
        { type: "image", src: "/img/restaurant.png" },
        { type: "image", src: "/img/restaurant3.png" }
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
        }
    ];
    return (
        <>

            <Carousel slides={slides} captions={captions} showCaptions />
            <TopDishes />
            <div className="content">
                <Book />
            </div>
        </>
    );

};

export default Home;