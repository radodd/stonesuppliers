import React from "react";
import { Button } from "./ui/button";
import sortMaterials from "../lib/sortMaterials";
import Image from "next/image";

const AlphabetizeButtons = ({
  products,
  setProducts,
  alphabetFilter,
  setAlphabetFilter,
}: {
  products: { name: string }[];
  setProducts: (list: { name: string }[]) => void;
  alphabetFilter: boolean;
  setAlphabetFilter: (v: boolean) => void;
}) => {
  const handleSort = (direction: string) => {
    const sortedList = sortMaterials(products, direction);
    setProducts(sortedList);
  };
  return (
    <div className="border-none">
      <Button
        variant="otherFilter"
        size="filter"
        onClick={() => setAlphabetFilter(!alphabetFilter)}
        className="h-fit"
      >
        <Image
          src="/sort_arrows.svg"
          alt="Sort products alphabetically"
          width={23}
          height={23}
          className="pr-2"
        />
        Sort by: A-Z
      </Button>
      {alphabetFilter && (
        <div className="z-50 absolute flex flex-col mt-2 w-[128px] border-2 border-primary rounded-[4px] ">
          <Button
            variant="ghost"
            size="filter"
            onClick={() => handleSort("asc")}
            className="border-none justify-start"
          >
            A - Z
          </Button>
          <Button
            variant="ghost"
            size="filter"
            onClick={() => handleSort("desc")}
            className="border-none justify-start pt-0"
          >
            Z - A
          </Button>
        </div>
      )}
    </div>
  );
};

export default AlphabetizeButtons;
