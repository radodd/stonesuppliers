"use client";

import { useEffect, useRef, useState } from "react";

import styles from "../components/scss/Slider.module.scss";

const Slider = () => {
  const lines = [
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
    "Stoneyard",
    "MRC Rock & Sand",
    "Santa Paula Materials",
  ];
  const [currentLine, setCurrentLine] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % lines.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [lines.length]);

  useEffect(() => {
    sliderRef.current.style.transform = `translateY(-${currentLine * 1.0416}%)`;
  }, [currentLine]);

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.slider} ref={sliderRef}>
        {lines.map((line, index) => (
          <div key={index} className={styles.line}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
