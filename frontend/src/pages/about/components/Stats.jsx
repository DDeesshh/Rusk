import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const StatsSection = styled.section`
  position: relative;
  padding: 4rem 0;
  background-image: url('../../../public/img/bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 6.875rem;
  background-attachment: fixed;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--decorate-bg) 70%, transparent);
`;

const StatsContainer = styled.div`
  position: relative;
  z-index: 2;
`;

const StatNumber = styled.h1`
  color: var(--primary-color) !important;
  font-weight: 700 !important;
  margin-bottom: 0.5rem !important;
`;

const StatLabel = styled.p`
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-color);
`;

const StatDescription = styled.p`
  font-size: 0.875rem;
  color: var(--text-color);
  margin-bottom: 0;
`;

export default function Stats() {
    const countersRef = useRef([]);

    useEffect(() => {
        const animateCounter = (element, target) => {
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    element.textContent = target;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current);
                }
            }, 16);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const target = parseInt(entry.target.getAttribute('data-count'));
                        animateCounter(entry.target, target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        countersRef.current.forEach((counter) => {
            if (counter) observer.observe(counter);
        });

        return () => observer.disconnect();
    }, []);

    const stats = [
        { number: 5, label: 'лет опыта', description: 'Радуем гостей с 2019 года' },
        { number: 20, label: 'авторских блюд', description: 'Уникальные рецепты шеф-повара' },
        { number: 1000, label: 'довольных гостей', description: 'Присоединяйтесь к нашему сообществу' }
    ];

    return (
        <StatsSection>
            <Overlay />
            
            <StatsContainer className="container">
                <div className="row justify-content-center text-center flex-column flex-md-row align-items-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="col-6 col-lg-4 mb-4 mb-lg-0">
                            <div className="d-flex flex-column align-items-center">
                                <StatNumber
                                    ref={el => countersRef.current[index] = el}
                                    className="display-4 mb-2"
                                    data-count={stat.number}
                                >
                                    0
                                </StatNumber>
                                <StatLabel className="mb-1">{stat.label}</StatLabel>
                                <StatDescription>{stat.description}</StatDescription>
                            </div>
                        </div>
                    ))}
                </div>
            </StatsContainer>
        </StatsSection>
    );
}