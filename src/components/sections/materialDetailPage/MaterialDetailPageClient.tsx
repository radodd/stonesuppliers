"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import MaterialDetailForm from "./MaterialDetailForm";

import styles from "@/components/scss/MaterialDetail.module.scss";
import { gaEvent } from "@/lib/ga";
import type { MaterialDetailDTO } from "@/lib/materialsService";

// Re-exported so MaterialDetailForm and other sibling components can import it
// from a single stable location without going through the page file.
export type ProductCardProps = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imagePrimary: string | null;
  imagePath: string[];
  company: string[];
  color: string[];
  uses: string[];
  categories: { name: string; sizes: string[] }[];
  texture: string[];
};

type Orientation = "horizontal" | "vertical";

export default function MaterialDetailPageClient({
  product,
}: {
  product: ProductCardProps;
}) {
  const [selectedImage, setSelectedImage] = useState("");
  const [orientation, setOrientation] = useState<Orientation>("horizontal");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!product) return;
    gaEvent("view_item", {
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.categories?.map((cat) => cat.name).join(", "),
          item_company: product.company.join(", "),
        },
      ],
    });
  }, [product.id]);

  useEffect(() => {
    const handleResize = () => {
      setOrientation(
        window.innerWidth > 1306 || window.innerWidth < 768
          ? "horizontal"
          : "vertical",
      );
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (product.imagePath?.length > 0) {
      setSelectedImage(product.imagePath[0]);
    } else {
      setSelectedImage("/image_not_available.svg");
    }
  }, [product]);

  const numImages = product.imagePath ? product.imagePath.length : 0;
  const totalGapWidthPercentage = ((4 * 5) / 480) * 50;
  const imageWidthPercentage = (100 - totalGapWidthPercentage) / numImages;
  const basisPercentage = imageWidthPercentage.toFixed(2);

  return (
    <>
      <div className={styles.headerContainer}>
        <h1>Material Details</h1>
      </div>
      <div className={styles.materialDetailsContainer}>
        <div className={styles.materialImagesContainer}>
          <div className={styles.carouselContainer}>
            <Carousel
              orientation={orientation}
              opts={{
                align: "center",
              }}
              className={styles.carousel}
            >
              <CarouselPrevious
                className={styles.prev}
                width={13}
                height={23}
                color="hsl(var(--icon))"
              />
              <CarouselContent className={styles.carouselContent}>
                {product.imagePath?.map((image, index) => (
                  <CarouselItem
                    key={index}
                    className={`basis-[${basisPercentage}%] ${styles.carouselItem}`}
                  >
                    <div
                      className={`${selectedImage === image ? styles.selectedImage : ""} ${styles.carouselImageContainer}`}
                    >
                      <Image
                        src={image}
                        alt=""
                        width={93}
                        height={93}
                        onClick={() => setSelectedImage(image)}
                        className={styles.carouselImage}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselNext
                className={styles.next}
                width={13}
                height={23}
                color="hsl(var(--icon))"
              />
            </Carousel>
          </div>
          <div className={styles.imageContainer}>
            <Image
              src={selectedImage}
              alt={product.name}
              width={601}
              height={601}
              className={styles.image}
            />

            <div className={styles.overlay}>
              <>
                {selectedImage
                  .split("/")
                  .pop()
                  ?.split("?")[0]
                  .replace(/_/g, "/")
                  .replace(/%20/g, " ")
                  .replace(".png", "")
                  .replace(/in/, '"')}{" "}
              </>
            </div>
          </div>
        </div>

        <div className={styles.materialInfoContainer}>
          <h1>{product.name}</h1>
          {product.company.includes("MRC Rock & Sand") ||
          product.company.includes("Santa Paula Materials") ? (
            <>
              <h3>
                Categories:
                <span>
                  {product.categories?.map((cat) => cat.name).join(", ")}
                </span>
              </h3>
              <h3>
                Colors:
                <span>{product.color?.join(", ")}</span>
              </h3>
              <h3>
                Textures:
                <span>{product.texture?.join(", ")}</span>
              </h3>
            </>
          ) : (
            <>
              <h3>
                Colors:
                <span>{product.color?.join(", ")}</span>
              </h3>
              <h3>
                Uses:
                <span>{product.uses?.join(", ")}</span>
              </h3>
            </>
          )}

          <div className="flex gap-6">
            <Button
              onClick={() =>
                window.open("/Category_Sizes_Reference.pdf", "_blank")
              }
            >
              Category Sizes
            </Button>
          </div>

          <MaterialDetailForm product={product} />
          <div className={styles.seeMoreButton}>
            <Button variant="link" onClick={() => setExpanded(!expanded)}>
              What is Request to Quote?
            </Button>
            {expanded && (
              <div
                className={`${styles.expandableContent} ${expanded ? styles.expanded : ""}`}
              >
                <p className="text-[16px]">
                  We strive to provide the best price for your materials,
                  whether you&apos;re a wholesaler, retailer, or homeowner. To
                  request a quote, simply select the category, size, and
                  quantity of the material, then click the &quot;Request to
                  Quote&quot; button to add the item to your cart. Afterward,
                  fill out your contact information in the cart. Once submitted,
                  we will promptly email you a detailed quote, allowing you to
                  proceed with placing your order.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/** Map a MaterialDetailDTO (from the service) to the ProductCardProps shape. */
export function toProductCardProps(dto: MaterialDetailDTO): ProductCardProps {
  return {
    id: String(dto.id),
    slug: dto.slug,
    name: dto.name,
    description: dto.description,
    imagePrimary: dto.imagePrimary,
    imagePath: dto.images,
    company: dto.company,
    color: dto.color,
    uses: dto.uses,
    categories: dto.categories,
    texture: dto.texture,
  };
}
