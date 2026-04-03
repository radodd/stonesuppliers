"use client";

// ─────────────────────────────────────────────────────────────────────────────
// MaterialGridSection
//
// The main materials catalog page component. Fetches all materials from the
// API on mount, then applies the active filters from FilterContext to derive
// the visible product list. Renders both a mobile dropdown filter UI and a
// desktop sidebar filter UI.
//
// Filter logic is delegated to lib/filterMaterials.ts — see that file for
// the AND/OR strategy used across dimensions.
// ─────────────────────────────────────────────────────────────────────────────

import { useFilter } from "../context/FilterContext";
import { ProductCard } from "./MaterialCard";
import { MaterialFilterCard } from "./MaterialFilterCard";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { ProductFilters } from "./ProductFilters";
import Image from "next/image";
import FilterDropDown from "./FilterDropDown";
import AlphabetizeButtons from "./AlphabetizeButtons";
import AlphabetizeRadio from "./AlphabetizeRadio";
import ChevronIcon from "../../public/chevron_nav_sharp.svg";
import { AllCompanies, AllCategories, AllTextures, AllColors, AllSizes } from "@/data";
import { filterMaterials, countMaterialAttributes, Material } from "../lib/filterMaterials";

import styles from "./scss/MaterialGridSection.module.scss";

type MaterialGridSectionProps = {
  title: string;
  initialProducts?: Material[];
};

export default function MaterialGridSection({ title, initialProducts }: MaterialGridSectionProps) {
  const {
    filterValueList,
    setFilterValueList,
    clearFilter,
    setTempFilterValueList,
    tempFilterValueList,
  } = useFilter();

  const [products, setProducts] = useState<Material[]>(initialProducts ?? []);
  const [alphabetFilter, setAlphabetFilter] = useState(false);
  const [filterDropDown, setFilterDropdown] = useState(false);
  const [loading, setLoading] = useState(!initialProducts);

  // ── Fetch all materials once on mount (skipped when initialProducts is provided) ──
  useEffect(() => {
    if (initialProducts) return;

    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/materials", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Flatten category/size from the nested categories array
        const mappedProducts: Material[] = data.map((material: any) => ({
          id: material.id,
          slug: material.slug,
          name: material.name,
          description: material.description,
          imagePrimary: material.imagePrimary,
          company: material.company,
          color: material.color,
          uses: material.uses,
          texture: material.texture,
          category: material.categories.map((cat: any) => cat.name),
          size: material.categories.flatMap((cat: any) => cat.sizes),
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching materials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ── Apply active filters to derive the visible product list ───────────────
  const visibleProducts = filterMaterials(products, filterValueList);

  // ── Count attributes across visible products for filter panel badges ──────
  const { categoryCounts, colorCounts, companyCounts, textureCounts, sizeCounts } =
    countMaterialAttributes(visibleProducts);

  // ── Filter management handlers ────────────────────────────────────────────

  /** Remove a single active filter chip */
  const handleRemoveFilter = (filter: string) => {
    const updatedFilter = filterValueList.filter((f) => f !== filter);
    setFilterValueList(updatedFilter);
    clearFilter(filter);
  };

  /** Reset all active filters and the pending temp filter list */
  const clearAllFilters = () => {
    setFilterValueList([]);
    setTempFilterValueList([]);
  };

  return (
    <section className={styles.sectionContainer}>
      <h2>{title}</h2>

      {/* ── Active filter chip bar (mobile) ─────────────────────────────── */}
      <div className={styles.buttonContainer}>
        <div className="flex flex-row gap-6 w-full justify-center items-center">
          <div className="w-full">
            <Button
              variant="outline"
              size="mobileFilterOpen"
              onClick={() => setFilterDropdown(!filterDropDown)}
            >
              Sort & Filter
            </Button>
          </div>

          {filterValueList.length !== 0 && (
            <div className="max-w-min">
              <Button variant="filterClear" size="slim" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          )}
        </div>

        <div className={styles.productFilterCardContainer}>
          {filterValueList.length === 0 ||
          (filterValueList.length === 1 && filterValueList[0] === "") ? (
            <MaterialFilterCard filter="All Materials" />
          ) : (
            filterValueList
              .filter((filter) => filter && filter.length > 0)
              .map((filter, index) => (
                <MaterialFilterCard
                  key={index}
                  filter={filter}
                  onRemove={handleRemoveFilter}
                />
              ))
          )}
        </div>
      </div>

      {/* ── Mobile product grid ─────────────────────────────────────────── */}
      <div className="flex justify-center min-[1306px]:hidden">
        {loading ? (
          <div className={styles.loadingContainer}>
            <Image src="/loading.svg" alt="Loading..." width={800} height={400} priority style={{ width: "auto", height: "auto" }} />
          </div>
        ) : (
          <>
            {visibleProducts.length === 0 && (
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
              {visibleProducts.map((product, index) => (
                <ProductCard {...product} slug={product.slug} key={index} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Mobile filter drawer ────────────────────────────────────────── */}
      {filterDropDown && (
        <div className="bg-whitebase absolute top-[100px] min-[1306px]:hidden">
          <Button
            variant="mobileFilterClose"
            size="mobileFilterClose"
            onClick={() => setFilterDropdown(!filterDropDown)}
          >
            <ChevronIcon width={30} height={30} className={styles.chevronClose} />
            Sort & Filter
          </Button>

          <AlphabetizeRadio products={products} setProducts={(list) => setProducts(list as Material[])} />
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

      {/* ── Desktop layout: sidebar filters + product grid ──────────────── */}
      <div className="flex flex-row justify-center items-start gap-[72px] max-[1306px]:hidden">

        {/* Sidebar filter panel */}
        <div className="flex flex-col">
          {filterValueList.length === 0 ? (
            <Button
              variant="filterDisabled"
              size="filter"
              className="mb-6 min-[1306px]:ml-[72px]"
              onClick={clearAllFilters}
            >
              <Image src="/filter.svg" alt="" width={25} height={25} className="pr-2" />
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
              <Image src="/close.svg" alt="" width={12} height={12} style={{ width: "12px", height: "12px" }} />
            </Button>
          )}
          <ProductFilters
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

        {/* Desktop product grid with active filter chips */}
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div className={styles.productFilterCardContainerDesktop}>
              {filterValueList.length === 0 ? (
                <MaterialFilterCard filter="All Materials" onRemove={handleRemoveFilter} />
              ) : (
                filterValueList.map((filter, index) => (
                  <MaterialFilterCard key={index} filter={filter} onRemove={handleRemoveFilter} />
                ))
              )}
            </div>
            <AlphabetizeButtons
              products={products}
              setProducts={(list) => setProducts(list as Material[])}
              alphabetFilter={alphabetFilter}
              setAlphabetFilter={setAlphabetFilter}
            />
          </div>

          <div className="min-[1306px]:mx-[0px]">
            {loading ? (
              <div className={styles.loadingContainer}>
                <Image src="/loading.svg" alt="Loading..." width={800} height={400} priority style={{ width: "auto", height: "auto" }} />
              </div>
            ) : (
              <>
                {visibleProducts.length === 0 && (
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
                  {visibleProducts.map((product, index) => (
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
