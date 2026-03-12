"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import Slider from "@/components/SliderAnimation";
import Image from "next/image";

import styles from "@/scss/LandingPageCarousel2.module.scss";
import { LandingPageCarousel } from "@/data";
import CarouselIndicator from "@/components/ui/CarouselIndicator";
import { useFilter } from "../../../context/FilterContext";

export default function LandingPageCarousel2() {
  const [current, setCurrent] = useState(-1);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );
  const [isMounted, setIsMounted] = useState(false);
  const { setFilterValueList, filterValueList } = useFilter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Set up a resize event listener to track window width changes
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Attach the event listener on mount
    window.addEventListener("resize", handleResize);

    // Remove the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const validVariants = [
    "outline",
    "default",
    "link",
    // "filter",
    "destructive",
    "secondary",
    "ghost",
    "quantity",
    "carouselOutline",
    "carouselPrimary",
  ] as const;

  return (
    <>
      <Carousel setApi={setApi} className={styles.carousel}>
        <CarouselContent className={styles.carouselContent}>
          {LandingPageCarousel.map((slide, index) => {
            return (
              <CarouselItem
                key={index}
                className={`${current === 2 || current === 3 || current === 4 ? styles.noPadding : ""} ${styles.carouselItem}`}
              >
                {index === 0 ? (
                  <div className={styles.uniqueContentContainer}>
                    <div className={styles.uniqueHeader}>
                      {/* SEO + Screen Reader-Only Heading */}
                      <h1 className="sr-only">
                        <span>{slide.subheader}</span>{" "}
                        <span>MRC Rock & Sand</span>
                        {", "}
                        <span>SPM Santa Paula Materials</span>
                        {", "}
                        <span>Stoneyard</span>
                        {", "}
                        <span>
                          We are a collection of companies here to service your
                          construction needs.
                        </span>
                      </h1>

                      {/* Visible content, hidden from screen readers */}
                      <span className="flex text-whitebase" aria-hidden>
                        {slide.header}
                      </span>
                      <div className="flex flex-row min-[857px]:items-center max-[856px]:flex-col">
                        <span className="text-[#A9C8D3]" aria-hidden>
                          {slide.subheader}
                        </span>
                        <div>
                          <Slider />
                        </div>
                      </div>
                    </div>
                    <p className={styles.uniqueDescription}>
                      {slide.description}
                    </p>
                    <div className={styles.uniqueButtonContainer}>
                      {slide.buttons.map((button, btnIndex) => (
                        <Button
                          key={btnIndex}
                          variant={
                            validVariants.includes(
                              button.variant as (typeof validVariants)[number],
                            )
                              ? (button.variant as (typeof validVariants)[number])
                              : "default"
                          }
                          size="default"
                          navigateTo={button.navigateTo}
                        >
                          {button.text}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={styles.container}>
                    <div className={styles.textContainer}>
                      <Image alt="" src={slide.logo} width={56} height={24} />
                      <div className={styles.headerContainer}>
                        {/* <span>{slide.header}</span> */}
                        <span>{slide.subheader}</span>
                      </div>
                      <p className={styles.description}>{slide.description}</p>
                      <div className={styles.buttonContainer}>
                        {slide.buttons.map((button, btnIndex) => {
                          let variant = button.variant; // Default to the button's specified variant
                          if (isMounted) {
                            const isSmallScreen = windowWidth <= 900;
                            const isLargeScreen = windowWidth > 900;

                            if (
                              isSmallScreen &&
                              current !== 1 &&
                              btnIndex === 0
                            ) {
                              variant = "default"; // For small screens on the first button when currentSlide is not 1
                            } else if (btnIndex === 1 && isLargeScreen) {
                              variant = "outline"; // For large screens on the second button
                            } else if (btnIndex === 1 && isSmallScreen) {
                              variant = "carouselOutline"; // Second button on any screen size
                            } else if (btnIndex === 0 && isLargeScreen) {
                              variant = "default";
                            }
                          }

                          return (
                            <Button
                              key={btnIndex}
                              variant={variant}
                              size="default"
                              navigateTo={button.navigateTo}
                              filter={button.filter}
                              onClick={() => setFilterValueList(button.filter)}
                            >
                              {button.text}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                    {slide.image && (
                      <div className={styles.imageContainer}>
                        <Image
                          src={slide.image}
                          alt={`${slide.subheader} image`}
                          width={400}
                          height={300}
                          className={styles.image}
                        />
                      </div>
                    )}
                  </div>
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious
          width={20}
          height={30}
          className={` ${styles.prev}`}
        />
        <CarouselNext
          color="hsl(var(--white-base))"
          width={20}
          height={30}
          className={` ${styles.next}`}
        />
        <CarouselIndicator
          current={current}
          total={4}
          color="fill-[#FDFBF6]"
          className={styles.indicatorContainer}
        />
      </Carousel>
    </>
  );
}
