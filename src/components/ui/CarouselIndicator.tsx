import styles from "../scss/LandingPageCarousel2.module.scss";

const CarouselIndicator = ({
  current,
  total,
  color,
  className,
}: {
  current: number;
  total: number;
  color: string;
  className?: string;
}) => {
  return (
    <div className={className}>
      {Array.from({ length: total }).map((_, index) => (
        <div key={index}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="12"
              height="12"
              rx="6"
              fill="#A9C8D3"
              className={`${current === index + 1 ? color : ""}`}
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default CarouselIndicator;
