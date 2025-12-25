"use client";

import { useFilter } from "../context/FilterContext";
import { ProductCard } from "./MaterialCard";
import { ProductFilterCard } from "./ProductFilterCard";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { ProductFilters2 } from "./ProductFilters2";
import Image from "next/image";
import FilterDropDown from "./FilterDropDown";
import AlphabetizeButtons from "./AlphabetizeButtons";
import AlphabetizeRadio from "./AlphabetizeRadio";
import ChevronIcon from "../../public/chevron_nav_sharp.svg";
import {
  AllCompanies,
  AllCategories,
  AllTextures,
  AllColors,
  AllSizes,
} from "../../index";

import styles from "./scss/ProductGridSection.module.scss";

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  imagePrimary: string | null;
  imagePath: string[] | null;
  company: string[];
  color: string[];
  uses: string[];
  category: string[];
  texture: string[];
  size: string[];
}

type ProductGridSectionProps = {
  title: string;
};

export default function ProductGridSection({ title }: ProductGridSectionProps) {
  const {
    filterValueList,
    setFilterValueList,
    clearFilter,
    setTempFilterValueList,
    tempFilterValueList,
  } = useFilter();
  const [products, setProducts] = useState<Product[]>([]);
  const [alphabetFilter, setAlphabetFilter] = useState(false);
  const [filterDropDown, setFilterDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {}, [filterValueList]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://mrc-two.vercel.app/api/materials",
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched material:", data);

        const mappedProducts = data.map((material: any) => ({
          id: material.id,
          slug: material.slug,
          name: material.name,
          description: material.description,
          imagePrimary: material.imagePrimary,
          imagePath: material.imagePath,
          company: material.company,
          color: material.color,
          uses: material.uses,
          texture: material.texture,
          category: material.MaterialCategories.map(
            (cat: any) => cat.Categories.name,
          ),
          size: material.MaterialCategories.flatMap((cat: any) =>
            cat.MaterialCategorySizes.map((size: any) =>
              size.Sizes.sizeValue.trim(),
            ),
          ),
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching DATA:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categoryFilterCount = {
    company: 0,
    color: 0,
    category: 0,
    texture: 0,
    size: 0,
  };

  // Step 1: Count how many filters are applied per category
  filterValueList.forEach((filter) => {
    Object.keys(categoryFilterCount).forEach((category) => {
      if (filterBelongsToCategory(filter, category)) {
        categoryFilterCount[category]++;
      }
    });
  });

  // Step 2: Identify categories with two or more filters applied
  const categoriesWithMultipleFilters = Object.keys(categoryFilterCount).filter(
    (category) => categoryFilterCount[category] >= 2,
  );

  // Step 3: Apply the filter to the product list
  let exactMatchFilteredProductList = [];
  let finalFilteredProductList = [];

  if (filterValueList.length === 1) {
    // Apply exact match filtering for a single filter
    exactMatchFilteredProductList = products.filter((product) => {
      return filterValueList.every((filter) => {
        const filterCategory = Object.keys(categoryFilterCount).find(
          (category) => filterBelongsToCategory(filter, category),
        );

        if (filterCategory) {
          const productValue = product[filterCategory];

          if (Array.isArray(productValue)) {
            return productValue.some((value) => value === filter);
          } else if (typeof productValue === "string") {
            return productValue === filter;
          }
        }

        return false;
      });
    });

    // Now, use the exact match filtered list as the final result
    finalFilteredProductList = exactMatchFilteredProductList;
  } else {
    // Step 4: Apply existing AND filter logic (if multiple filters are selected)
    finalFilteredProductList = products.filter((product) => {
      const matchesAllFilters = filterValueList.every((filter) => {
        const matchesFilterInCategory = Object.keys(product).some((key) => {
          const productValue = product[key];
          if (Array.isArray(productValue)) {
            return productValue.some((value) => value.includes(filter));
          } else if (typeof productValue === "string") {
            return productValue.includes(filter);
          }
          return false;
        });

        return matchesFilterInCategory;
      });

      return matchesAllFilters;
    });
  }

  // Step 5: Apply OR logic for categories with multiple filters
  if (categoriesWithMultipleFilters.length > 0) {
    const selectedCompanyFilters = filterValueList.filter((filter) =>
      filterBelongsToCategory(filter, "company"),
    );

    const orFilteredProductList = products.filter((product) => {
      // Ensure the product matches the selected company filter, if any
      const matchesSelectedCompany =
        selectedCompanyFilters.length === 0 ||
        selectedCompanyFilters.some((filter) => {
          const productCompany = product["company"];
          if (Array.isArray(productCompany)) {
            return productCompany.includes(filter);
          } else if (typeof productCompany === "string") {
            return productCompany === filter;
          }
          return false;
        });

      // If it doesn't match the selected company, skip it
      if (!matchesSelectedCompany) return false;

      // Apply OR logic for categories with multiple filters
      return categoriesWithMultipleFilters.some((category) => {
        const categoryFilters = filterValueList.filter((filter) =>
          filterBelongsToCategory(filter, category),
        );

        // Check if any filter in the category matches the product
        return categoryFilters.some((filter) => {
          const productValue = product[category];
          if (Array.isArray(productValue)) {
            return productValue.some((value) => value === filter);
          } else if (typeof productValue === "string") {
            return productValue === filter;
          }
          return false;
        });
      });
    });

    // Combine OR filtered results with the final result
    finalFilteredProductList = [
      ...new Set([...finalFilteredProductList, ...orFilteredProductList]),
    ];
  }

  // Helper function to check if a filter belongs to a category
  function filterBelongsToCategory(filter, category) {
    const categoryFilters = {
      company: AllCompanies,
      color: AllColors,
      category: AllCategories,
      texture: AllTextures,
      size: AllSizes,
    };

    // Check if the filter belongs to the category by checking against the predefined list
    return categoryFilters[category]?.includes(filter);
  }

  const categoryCounts = finalFilteredProductList.reduce(
    (counts: Record<string, number>, product) => {
      product.category.forEach((cat) => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
      return counts;
    },
    {},
  );

  const colorCounts = finalFilteredProductList.reduce(
    (counts: Record<string, number>, product) => {
      product.color?.forEach((col) => {
        counts[col] = (counts[col] || 0) + 1;
      });
      return counts;
    },
    {},
  );

  const companyCounts = finalFilteredProductList.reduce(
    (counts: Record<string, number>, product) => {
      product.company.forEach((comp) => {
        counts[comp] = (counts[comp] || 0) + 1;
      });
      return counts;
    },
    {},
  );

  const textureCounts = finalFilteredProductList.reduce(
    (counts: Record<string, number>, product) => {
      product.texture.forEach((tex) => {
        counts[tex] = (counts[tex] || 0) + 1;
      });
      return counts;
    },
    {},
  );

  const sizeCounts = finalFilteredProductList.reduce(
    (counts: Record<string, number>, product) => {
      product.size.forEach((size) => {
        counts[size] = (counts[size] || 0) + 1;
      });
      return counts;
    },
    {},
  );

  const handleRemoveFilter = (filter: string) => {
    const updatedFilter = filterValueList.filter((f) => f !== filter);
    setFilterValueList(updatedFilter);
    clearFilter(filter);
  };

  const clearAllFilters = () => {
    setFilterValueList([]), setTempFilterValueList([]);
  };

  return (
    <section className={styles.sectionContainer}>
      <h2>{title}</h2>
      <div className={styles.buttonContainer}>
        <div className="flex flex-row gap-6 w-full justify-center items-center">
          <div className="w-full">
            <Button
              variant="outline"
              size="mobileFilterOpen"
              onClick={() => setFilterDropdown(!filterDropDown)}
              className=""
            >
              Sort & Filter
            </Button>
          </div>

          {filterValueList.length !== 0 && (
            <div className="max-w-min">
              <Button
                variant="filterClear"
                size="slim"
                onClick={clearAllFilters}
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        <div className={styles.productFilterCardContainer}>
          {filterValueList.length === 0 ||
          (filterValueList.length === 1 && filterValueList[0] === "") ? (
            <ProductFilterCard filter="All Materials" />
          ) : (
            filterValueList
              .filter((filter) => filter && filter.length > 0)
              .map((filter, index) => (
                <ProductFilterCard
                  key={index}
                  filter={filter}
                  onRemove={handleRemoveFilter}
                />
              ))
          )}
        </div>
      </div>
      <div className="flex justify-center min-[1306px]:hidden ">
        {loading ? ( // Display loading icon while fetching data
          <div className={styles.loadingContainer}>
            <Image
              src="/loading.svg"
              alt="Loading..."
              width={800}
              height={400}
            />
          </div>
        ) : (
          <>
            {finalFilteredProductList.length === 0 && (
              <div className={styles.noItemsMatchContainer}>
                <Image
                  src="/no_items_match.svg"
                  alt="No items match your filters"
                  width={777}
                  height={405}
                />
              </div>
            )}
            <div className={styles.productCardContainer}>
              {finalFilteredProductList.map((product, index) => (
                <ProductCard {...product} slug={product.slug} key={index} />
              ))}
            </div>
          </>
        )}
      </div>

      {filterDropDown && (
        <div className=" bg-whitebase absolute top-[100px] min-[1306px]:hidden">
          <Button
            variant="mobileFilterClose"
            size="mobileFilterClose"
            onClick={() => setFilterDropdown(!filterDropDown)}
          >
            <ChevronIcon
              width={30}
              height={30}
              className={styles.chevronClose}
            />
            Sort & Filter
          </Button>

          {/* <Separator /> */}

          <AlphabetizeRadio products={products} setProducts={setProducts} />
          <FilterDropDown
            filterValueList={filterValueList}
            setFilterValueList={setFilterValueList}
            clearFilter={clearFilter}
            categoryCounts={categoryCounts}
            colorCounts={colorCounts}
            companyCounts={companyCounts}
            textureCounts={textureCounts}
            sizeCounts={sizeCounts}
            allFilters={[]}
            filterDropDown={filterDropDown}
            setFilterDropDown={setFilterDropdown}
          />
        </div>
      )}
      {/* DESKTOP */}

      <div className="flex flex-row justify-center items-start gap-[72px] max-[1306px]:hidden">
        <div className="flex flex-col">
          {filterValueList.length === 0 ? (
            <Button
              variant="filterDisabled"
              size="filter"
              className={`mb-6 min-[1306px]:ml-[72px] `}
              onClick={clearAllFilters}
            >
              <Image
                src="/filter.svg"
                alt=""
                width={25}
                height={25}
                className="pr-2"
              />
              Filter
            </Button>
          ) : (
            <Button
              variant="otherFilter"
              size="filter"
              className="flex items-center mb-6 min-[1306px]:ml-[72px] justify-between"
              onClick={clearAllFilters}
            >
              Clear All Filters
              <Image
                src="/close.svg"
                alt=""
                width={12}
                height={12}
                className={styles.image}
              />
            </Button>
          )}
          <ProductFilters2
            filterValueList={filterValueList}
            setFilterValueList={setFilterValueList}
            clearFilter={clearFilter}
            categoryCounts={categoryCounts}
            colorCounts={colorCounts}
            companyCounts={companyCounts}
            textureCounts={textureCounts}
            sizeCounts={sizeCounts}
            allFilters={[]}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div className={styles.productFilterCardContainerDesktop}>
              {filterValueList.map((filter, index) => (
                <ProductFilterCard
                  key={index}
                  filter={filter}
                  onRemove={handleRemoveFilter}
                />
              ))}
              {filterValueList.length === 0 && (
                <ProductFilterCard
                  filter="All Materials"
                  onRemove={handleRemoveFilter}
                />
              )}
            </div>
            <AlphabetizeButtons
              products={products}
              setProducts={setProducts}
              alphabetFilter={alphabetFilter}
              setAlphabetFilter={setAlphabetFilter}
            />
          </div>

          <div className="min-[1306px]:mx-[0px] ">
            {loading ? ( // Display loading icon while fetching data
              <div className={styles.loadingContainer}>
                <Image
                  src="/loading.svg"
                  alt="Loading..."
                  width={800}
                  height={400}
                />
              </div>
            ) : (
              <>
                {finalFilteredProductList.length === 0 && (
                  <div className={styles.noItemsMatchContainer}>
                    <Image
                      src="/no_items_match.svg"
                      alt="No items match your filters"
                      width={777}
                      height={405}
                    />
                  </div>
                )}
                <div className={styles.materialCardContainer}>
                  {finalFilteredProductList.map((product, index) => (
                    <ProductCard {...product} slug={product.slug} key={index} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
