"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Checkbox } from "./ui/checkbox";
import {
  AllCategories,
  AllColors,
  AllCompanies,
  AllSizes,
  AllTextures,
} from "../..";

import styles from "./scss/ProductFilters.module.scss";
import { useState } from "react";
import { useFilter } from "../context/FilterContext";
import { Button } from "./ui/button";

type FilterGroupProps = {
  title: string;
  filterKey: string;
  filterCounts: Record<string, number>;
  filterValueList: string[];
  handleCheckboxChange: (filterKey: string, value: string) => void;
  allFilters?: string[];
  tempFilterValueList: string[];
};

const FilterGroup: React.FC<FilterGroupProps> = ({
  title,
  filterKey,
  filterCounts,
  filterValueList,
  tempFilterValueList,
  handleCheckboxChange,
  allFilters,
}) => (
  <AccordionItem value={filterKey} className={styles.filterContainer}>
    <AccordionTrigger className={styles.trigger}>
      <span>{title}</span>
    </AccordionTrigger>
    <AccordionContent className={styles.accordionContent}>
      <ul>
        {allFilters.map((key) => (
          <FilterItem
            key={key}
            label={key}
            count={filterCounts[key] || 0}
            isChecked={tempFilterValueList.includes(key)}
            onChange={() => handleCheckboxChange(filterKey, key)}
          />
        ))}
      </ul>
    </AccordionContent>
  </AccordionItem>
);

type FilterItemProps = {
  label: string;
  count: number;
  isChecked: boolean;
  onChange: () => void;
};

const FilterItem: React.FC<FilterItemProps> = ({
  label,
  count,
  isChecked,
  onChange,
}) => (
  <li className={styles.filterItem}>
    <Checkbox checked={isChecked} onCheckedChange={onChange} />
    <label>
      {label} ({count})
    </label>
  </li>
);

export const ProductFilters2: React.FC<{
  filterValueList: string[];
  setFilterValueList: React.Dispatch<React.SetStateAction<string[]>>;
  clearFilter: (value: string) => void;
  companyCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
  textureCounts: Record<string, number>;
  colorCounts: Record<string, number>;
  sizeCounts: Record<string, number>;
  allFilters: string[];
}> = ({
  companyCounts,
  categoryCounts,
  textureCounts,
  colorCounts,
  sizeCounts,
  allFilters,
}) => {
  const {
    filterValueList,
    setFilterValueList,
    clearFilter,
    tempFilterValueList,
    setTempFilterValueList,
  } = useFilter();

  const handleCheckboxChange = (category: string, value: string) => {
    setTempFilterValueList((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const applyFilters = () => {
    setFilterValueList(tempFilterValueList);
  };
  return (
    <>
      <div className="w-full flex justify-end items-end">
        <Button
          onClick={applyFilters}
          // disabled={filterValueList.length > 0}
          variant={
            tempFilterValueList.length !== 0 ? "default" : "filterDisabled"
          }
          className="mb-6  mr-0 w-[275px]"
        >
          Apply Filters
        </Button>
      </div>

      <Accordion type="multiple">
        <FilterGroup
          title="Company"
          filterKey="company"
          filterCounts={companyCounts}
          filterValueList={filterValueList}
          tempFilterValueList={tempFilterValueList}
          handleCheckboxChange={handleCheckboxChange}
          allFilters={AllCompanies}
        />
        <FilterGroup
          title="Category"
          filterKey="category"
          filterCounts={categoryCounts}
          filterValueList={filterValueList}
          tempFilterValueList={tempFilterValueList}
          handleCheckboxChange={handleCheckboxChange}
          allFilters={AllCategories}
        />
        <FilterGroup
          title="Texture"
          filterKey="texture"
          filterCounts={textureCounts}
          filterValueList={filterValueList}
          tempFilterValueList={tempFilterValueList}
          handleCheckboxChange={handleCheckboxChange}
          allFilters={AllTextures}
        />
        <FilterGroup
          title="Color"
          filterKey="color"
          filterCounts={colorCounts}
          filterValueList={filterValueList}
          tempFilterValueList={tempFilterValueList}
          handleCheckboxChange={handleCheckboxChange}
          allFilters={AllColors}
        />
        <FilterGroup
          title="Size"
          filterKey="size"
          filterCounts={sizeCounts}
          filterValueList={filterValueList}
          tempFilterValueList={tempFilterValueList}
          handleCheckboxChange={handleCheckboxChange}
          allFilters={AllSizes}
        />
      </Accordion>
    </>
  );
};
// The rest of your ProductFilters component
// ...
