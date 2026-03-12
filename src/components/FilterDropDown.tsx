import React from "react";
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
} from "@/data";
import { Button } from "./ui/button";

import styles from "../components/scss/FilterDropDown.module.scss";
import { useFilter } from "../context/FilterContext";

type FilterGroupProps = {
  title: string;
  filterKey: string;
  filterCounts: Record<string, number>;
  filterValueList: string[];
  handleCheckboxChange: (filterKey: string, value: string) => void;
  allFilters?: string[];
};

const FilterGroup: React.FC<FilterGroupProps> = ({
  title,
  filterKey,
  filterCounts,
  filterValueList,
  handleCheckboxChange,
  allFilters,
}) => {
  const { tempFilterValueList } = useFilter();
  return (
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
              isChecked={
                tempFilterValueList.includes(key) ||
                filterValueList.includes(key)
              }
              onChange={() => handleCheckboxChange(filterKey, key)}
            />
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
};

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
const FilterDropDown: React.FC<{
  filterValueList: string[];
  setFilterValueList: React.Dispatch<React.SetStateAction<string[]>>;
  clearFilter: (value: string) => void;
  companyCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
  textureCounts: Record<string, number>;
  colorCounts: Record<string, number>;
  sizeCounts: Record<string, number>;
  allFilters: string[];
  filterDropDown: boolean;
  setFilterDropDown: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  clearFilter,
  companyCounts,
  categoryCounts,
  textureCounts,
  colorCounts,
  sizeCounts,
  filterDropDown,
  setFilterDropDown,
}) => {
  const {
    tempFilterValueList,
    setTempFilterValueList,
    filterValueList,
    setFilterValueList,
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
  const filterCountsArray = [
    ...Object.values(companyCounts),
    ...Object.values(categoryCounts),
    ...Object.values(textureCounts),
    ...Object.values(colorCounts),
    ...Object.values(sizeCounts),
  ];

  const totalResults = filterCountsArray.reduce((acc, count) => {
    return count > acc ? count : acc;
  }, 0);
  return (
    <div className="absolute flex justify-center items-center flex-col bg-whitebase w-svw">
      <Accordion type="multiple">
        <FilterGroup
          title="Company"
          filterKey="company"
          filterCounts={companyCounts}
          filterValueList={filterValueList}
          handleCheckboxChange={handleCheckboxChange}
          allFilters={AllCompanies}
        />
        <FilterGroup
          title="Category"
          filterKey="category"
          filterCounts={categoryCounts}
          filterValueList={filterValueList}
          handleCheckboxChange={handleCheckboxChange}
          allFilters={AllCategories}
        />
        <FilterGroup
          title="Texture"
          filterKey="texture"
          filterCounts={textureCounts}
          filterValueList={filterValueList}
          handleCheckboxChange={handleCheckboxChange}
          allFilters={AllTextures}
        />
        <FilterGroup
          title="Color"
          filterKey="color"
          filterCounts={colorCounts}
          filterValueList={filterValueList}
          handleCheckboxChange={handleCheckboxChange}
          allFilters={AllColors}
        />
        <FilterGroup
          title="Size"
          filterKey="size"
          filterCounts={sizeCounts}
          filterValueList={filterValueList}
          handleCheckboxChange={handleCheckboxChange}
          allFilters={AllSizes}
        />
      </Accordion>
      <div className={styles.buttonContainer}>
        <Button
          onClick={() => {
            setFilterDropDown(!filterDropDown);
            applyFilters();
          }}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterDropDown;
