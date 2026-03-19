import { useRef } from "react";
import { HashLink } from 'react-router-hash-link';
import { IconButton } from "./ui/ActionButton.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styled from "styled-components";
import Button from "./ui/Button.jsx";

// Styled Swiper с фиксированными размерами
const StyledSwiper = styled(Swiper)`
  width: 100%;
  height: 100%;

  .swiper-slide {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: stretch;
    justify-content: center;
  }
`;

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 34rem;
  overflow: hidden;

  @media (max-width: 1100px) {
    height: 30rem;
  }

  @media (max-width: 880px) {
    height: 25rem;
  }
`;

const SlideContent = styled.div`
  width: 100%;
  height: 100%;

  video, img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ $overlayColor }) => 
    $overlayColor 
      ? `color-mix(in srgb, ${$overlayColor} 70%, transparent)`
      : 'transparent'
  };
`;

const Caption = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--text-color);
  text-align: center;
  max-width: 900px;
  width: 90%;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 880px) {
    width: 80%;
  }
`;

const Title = styled.h1`
  margin-bottom: 1.875rem;
`;

const Text = styled.p`
  margin-bottom: 3.75rem;
  font-size: 1.25rem;
`;

const Arrow = styled(IconButton)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: 10px;
  z-index: 2;

  ${({ direction }) => direction === "left" && "left: 20px;"}
  ${({ direction }) => direction === "right" && "right: 20px;"}

  &:hover {
    color: var(--primary-color);
  }
`;

export default function Carousel({ slides = [], captions = [], showCaptions = true,  overlayColor = "var(--decorate-bg)" }) {
  const swiperRef = useRef(null);
  return (
    <CarouselWrapper>
      <StyledSwiper
        ref={swiperRef} modules={[Navigation]}
        navigation={{
          prevEl: ".icon-arrow-left",
          nextEl: ".icon-arrow-right"
        }}
        loop
        autoplay={{ delay: 5000 }} observer observeParents
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <SlideContent>
              {slide.type === "video" ? (
                <video
                  src={slide.src} autoPlay loop muted playsInline preload="metadata"
                />
              ) : (
                <img src={slide.src} alt={captions?.[index]?.title || "slide"} />
              )}
              <Overlay  $overlayColor={overlayColor} />
              {showCaptions && captions?.[index] && (
                <Caption>
                  <Title>{captions[index].title}</Title>
                  <Text>{captions[index].text}</Text>
                  <HashLink smooth to="/#booking-form">
                    <Button text="Забронировать" size="large" />
                  </HashLink>
                </Caption>
              )}
            </SlideContent>
          </SwiperSlide>
        ))}
      </StyledSwiper>

      <Arrow className="icon-arrow-left" direction="left" />
      <Arrow className="icon-arrow-right" direction="right" />
    </CarouselWrapper>
  );
}
