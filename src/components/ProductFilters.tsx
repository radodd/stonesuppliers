"use client";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ProductState } from "../lib/product-validator";
import { useFilter } from "../context/FilterContext";

import styles from "./scss/ProductFilters.module.scss";

const SORT_OPTIONS = [
  { name: "None", value: "none" },
  { name: "Name: Ascending", value: "name-asc" },
  { name: "Name: Descending", value: "name-desc" },
] as const;

const COMPANIES = [
  { name: "MRC Rock & Sand", selected: true, href: "#" },
  { name: "Santa Paula Materials", selected: false, href: "#" },
  { name: "Stoneyard", selected: false, href: "#" },
];

const COMPANY_FILTERS = {
  id: "company",
  name: "Company",
  options: [
    { value: "MRC Rock & Sand", label: "MRC Rock & Sand" },
    { value: "Santa Paula Materials", label: "Santa Paula Materials" },
    { value: "Stoneyard", label: "Stoneyard" },
  ] as const,
};

const COLOR_FILTERS = {
  id: "colors",
  name: "Colors",
  options: [
    { value: "yellow", label: "Yellow" },
    { value: "blue", label: "Blue" },
    { value: "gray", label: "Gray" },
  ] as const,
};
const CATEGORY_FILTERS = {
  id: "category",
  name: "Category",
  options: [
    { value: "aggregate", label: "aggregate" },
    { value: "cobble & rubble", label: "cobble & rubble" },
    { value: "boulders", label: "boulders" },
    { value: "decomposed granite", label: "decomposed granite" },
    { value: "base materials", label: "base materials" },
    { value: "rip rap", label: "rip rap" },
    { value: "drain rock", label: "drain rock" },
    { value: "rock dust", label: "rock dust" },
  ] as const,
};

interface ProductFiltersProps {
  categoryCounts: Record<string, number>;
  colorCounts: Record<string, number>;
  companyCounts: Record<string, number>;
  textureCounts: Record<string, number>;
  sizeCounts: Record<string, number>;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categoryCounts,
  colorCounts,
  companyCounts,
  textureCounts,
  sizeCounts,
}) => {
  const { setFilterValueList, filterValueList, clearFilter } = useFilter();
  const handleCheckboxChange = (category: string, value: string) => {
    if (filterValueList.includes(value)) {
      setFilterValueList((prev) => prev.filter((v) => v !== value));
      clearFilter(value);
    } else {
      setFilterValueList((prev) => [...prev, value]);
    }
  };

  return (
    <>
      <div className={styles.filterContainer}>
        {/* <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
          {COMPANIES.map((category) => (
            <li key={category.name}>
              <button
                disabled={!category.selected}
                className="disabled:cursor-not-allowed disabled:opacity-60"
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul> */}

        <Accordion type="multiple" className="">
          <AccordionItem value="company">
            <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-900">Company</span>
            </AccordionTrigger>

            <AccordionContent className="pt-6">
              <ul className="space-y-4">
                {Object.keys(companyCounts).map((company, index) => (
                  <li key={company} className="flex items-center">
                    <input
                      type="checkbox"
                      id={company}
                      onChange={() => handleCheckboxChange("company", company)}
                      checked={filterValueList.includes(company)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={company}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {company} ({companyCounts[company]})
                    </label>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="category">
            <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-900">Category</span>
            </AccordionTrigger>

            <AccordionContent className="pt-6">
              <ul className="space-y-4">
                {Object.keys(categoryCounts).map((category, index) => (
                  <li key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={category}
                      onChange={() =>
                        handleCheckboxChange("category", category)
                      }
                      checked={filterValueList.includes(category)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={category}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {category} ({categoryCounts[category]})
                    </label>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="texture">
            <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-900">Texture</span>
            </AccordionTrigger>

            <AccordionContent className="pt-6">
              <ul className="space-y-4">
                {Object.keys(textureCounts).map((texture, index) => (
                  <li key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={texture}
                      onChange={() => handleCheckboxChange("category", texture)}
                      checked={filterValueList.includes(texture)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={texture}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {texture} ({textureCounts[texture]})
                    </label>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="color">
            <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-900">Color</span>
            </AccordionTrigger>

            <AccordionContent className="pt-6">
              <ul className="space-y-4">
                {Object.keys(colorCounts).map((color, index) => (
                  <li key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={color}
                      onChange={() => handleCheckboxChange("colors", color)}
                      checked={filterValueList.includes(color)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={color}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {color} ({colorCounts[color]})
                    </label>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="size">
            <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-900">Size</span>
            </AccordionTrigger>

            <AccordionContent className="pt-6">
              <ul className="space-y-4">
                {Object.keys(sizeCounts).map((size, index) => (
                  <li key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={size}
                      onChange={() => handleCheckboxChange("colors", size)}
                      checked={filterValueList.includes(size)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={size}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {size} ({sizeCounts[size]})
                    </label>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};
