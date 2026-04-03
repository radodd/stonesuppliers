// ─────────────────────────────────────────────────────────────────────────────
// Material Filter Engine
//
// Implements the multi-dimensional AND/OR filter logic for the materials grid.
//
// FILTER STRATEGY:
//   • Single filter selected  → exact match (value must equal, not just include)
//   • Multiple filters across different categories → AND logic
//     (product must match at least one filter from EVERY selected category)
//   • Multiple filters within the SAME category → OR logic
//     (product matches if it satisfies any one of the filters in that category)
//
// The categoryMap below is the source of truth for which filter value belongs
// to which product field. Add new dimensions here if the schema grows.
// ─────────────────────────────────────────────────────────────────────────────

import { AllCompanies, AllColors, AllCategories, AllTextures, AllSizes } from "@/data";

export interface Material {
  id: string;
  slug: string;
  name: string;
  description: string;
  imagePrimary: string | null;
  company: string[];
  color: string[];
  uses: string[];
  category: string[];
  texture: string[];
  size: string[];
}

// Maps each product field name to the master list of valid filter values for it.
// Used to determine which dimension a filter string belongs to.
const categoryMap: Record<string, string[]> = {
  company: AllCompanies,
  color: AllColors,
  category: AllCategories,
  texture: AllTextures,
  size: AllSizes,
};

/** Returns the product field name that owns the given filter value, or undefined. */
export function getFilterCategory(filter: string): string | undefined {
  return Object.keys(categoryMap).find((key) =>
    categoryMap[key].includes(filter)
  );
}

/**
 * Counts how many active filters belong to each product dimension.
 * Used to detect when OR logic should apply (>= 2 filters in one dimension).
 */
function countFiltersPerCategory(
  filterValueList: string[]
): Record<string, number> {
  const counts: Record<string, number> = {
    company: 0, color: 0, category: 0, texture: 0, size: 0,
  };
  filterValueList.forEach((filter) => {
    const cat = getFilterCategory(filter);
    if (cat) counts[cat]++;
  });
  return counts;
}

/**
 * Returns true if the product's field value matches the given filter string.
 * Handles both array and string product fields.
 */
function productMatchesFilter(
  product: Material,
  filter: string,
  fieldKey: string,
  exact = false
): boolean {
  const value = product[fieldKey as keyof Material];
  if (Array.isArray(value)) {
    return exact
      ? value.some((v) => v === filter)
      : value.some((v) => v.includes(filter));
  }
  if (typeof value === "string") {
    return exact ? value === filter : value.includes(filter);
  }
  return false;
}

/**
 * Filters the full material list down to the set that matches the active filters.
 *
 * @param products - Full list of materials from the API.
 * @param filterValueList - Active filter values from FilterContext.
 * @returns The subset of products that pass all active filters.
 */
export function filterMaterials(
  products: Material[],
  filterValueList: string[]
): Material[] {
  // No filters selected — show everything
  if (filterValueList.length === 0) return products;

  const filtersPerCategory = countFiltersPerCategory(filterValueList);

  // Categories that have 2+ filters selected → apply OR logic within them
  const orCategories = Object.keys(filtersPerCategory).filter(
    (cat) => filtersPerCategory[cat] >= 2
  );

  // ── Single filter: exact match ──────────────────────────────────────────
  if (filterValueList.length === 1) {
    const filter = filterValueList[0];
    const fieldKey = getFilterCategory(filter);
    if (!fieldKey) return [];
    return products.filter((p) => productMatchesFilter(p, filter, fieldKey, true));
  }

  // ── Multiple filters: AND across categories ─────────────────────────────
  let visibleProducts = products.filter((product) =>
    filterValueList.every((filter) => {
      const fieldKey = getFilterCategory(filter);
      if (!fieldKey) return false;
      return productMatchesFilter(product, filter, fieldKey, false);
    })
  );

  // ── OR override within categories that have multiple filters ────────────
  if (orCategories.length > 0) {
    const selectedCompanyFilters = filterValueList.filter(
      (f) => getFilterCategory(f) === "company"
    );

    const orMatches = products.filter((product) => {
      // Product must still satisfy the company filter (if any)
      const passesCompany =
        selectedCompanyFilters.length === 0 ||
        selectedCompanyFilters.some((f) =>
          productMatchesFilter(product, f, "company", true)
        );
      if (!passesCompany) return false;

      // Within each OR category, at least one filter must match
      return orCategories.some((cat) => {
        const catFilters = filterValueList.filter(
          (f) => getFilterCategory(f) === cat
        );
        return catFilters.some((f) =>
          productMatchesFilter(product, f, cat, true)
        );
      });
    });

    // Merge AND results with OR results (deduplicated by reference)
    visibleProducts = [...new Set([...visibleProducts, ...orMatches])];
  }

  return visibleProducts;
}

/**
 * Counts how many visible products contain each attribute value.
 * The result powers the filter panel counts (e.g. "Aggregate (3)").
 *
 * @param products - The currently visible (filtered) product list.
 * @returns An object with counts keyed by dimension name.
 */
export function countMaterialAttributes(products: Material[]): {
  categoryCounts: Record<string, number>;
  colorCounts: Record<string, number>;
  companyCounts: Record<string, number>;
  textureCounts: Record<string, number>;
  sizeCounts: Record<string, number>;
} {
  const tally = (field: keyof Material) =>
    products.reduce((acc: Record<string, number>, product) => {
      const value = product[field];
      if (Array.isArray(value)) {
        (value as string[]).forEach((v) => {
          acc[v] = (acc[v] || 0) + 1;
        });
      }
      return acc;
    }, {});

  return {
    categoryCounts: tally("category"),
    colorCounts: tally("color"),
    companyCounts: tally("company"),
    textureCounts: tally("texture"),
    sizeCounts: tally("size"),
  };
}
