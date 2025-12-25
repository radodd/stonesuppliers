import React from "react";

const CarouselNextIcon = ({ width, height, color }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className=" border-none flex justify-center items-center"
    >
      <path
        d="M1 1.5L11 11.5L1 21.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CarouselNextIcon;
