"use client";

import { useState } from "react";
import sortProducts from "../lib/sortProducts";
import { Accordion, AccordionContent, AccordionTrigger } from "./ui/accordion";
import { AccordionItem } from "@radix-ui/react-accordion";

// interface AlphabetizeRadioProps {
//   // products: string[];
//   setProducts: React.Dispatch<React.SetStateAction<string[]>>;
// }

import styles from "../components/scss/FilterDropDown.module.scss";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

const AlphabetizeRadio = ({ products, setProducts }) => {
  const [selectedOption, setSelectedOption] = useState("asc");

  const handleSort = (direction: string) => {
    setSelectedOption(direction);
    const sortedList = sortProducts(products, direction);
    setProducts(sortedList);
  };
  return (
    <Accordion type="multiple">
      <AccordionItem value="sort" className={styles.filterContainer}>
        <AccordionTrigger className={styles.trigger}>
          <span>Sort By</span>
        </AccordionTrigger>
        <AccordionContent className={styles.accordionContent}>
          <ul className={styles.radioItem}>
            <RadioGroup
              defaultValue="comfortable"
              value={selectedOption}
              onValueChange={handleSort}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asc" id="r1" />
                <Label htmlFor="r1">A-Z</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="desc" id="r2" />
                <Label htmlFor="r2">Z-A</Label>
              </div>
            </RadioGroup>
          </ul>
        </AccordionContent>{" "}
      </AccordionItem>
    </Accordion>
  );
};

export default AlphabetizeRadio;
