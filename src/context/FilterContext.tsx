"use client";

// ─────────────────────────────────────────────────────────────────────────────
// FilterContext
//
// Manages the filter state for the materials catalog. Uses a dual-state pattern:
//
//   filterValueList     — the COMMITTED filter state. Changing this immediately
//                         re-runs the filter algorithm and updates the visible
//                         products. Persisted to localStorage so the user's
//                         selection survives navigation.
//
//   tempFilterValueList — a STAGING area for pending checkbox selections inside
//                         the mobile filter drawer. Changes here do NOT update
//                         the grid until the user taps "Apply Filters", at which
//                         point tempFilterValueList is copied to filterValueList.
//                         This prevents the grid from re-filtering on every
//                         individual checkbox tap on mobile.
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface FilterContextProps {
  filterValueList: string[];
  setFilterValueList: (newList: string[]) => void;
  clearFilter: (filter: string) => void;
  tempFilterValueList: string[];
  setTempFilterValueList: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  // Committed filters — drive what the product grid shows
  const [filterValueList, setFilterValueList] = useState<string[]>([]);

  // Pending filters — staging area for mobile "Apply Filters" flow
  const [tempFilterValueList, setTempFilterValueList] = useState<string[]>([]);

  // ── Hydrate committed filters from localStorage on mount ──────────────────
  useEffect(() => {
    const savedFilterValueList = localStorage.getItem("filterValueList");
    if (savedFilterValueList) {
      setFilterValueList(JSON.parse(savedFilterValueList));
    }
  }, []);

  // ── Persist committed filters to localStorage whenever they change ─────────
  useEffect(() => {
    if (filterValueList.length > 0) {
      localStorage.setItem("filterValueList", JSON.stringify(filterValueList));
    } else {
      // Clean up the key when no filters are active
      localStorage.removeItem("filterValueList");
    }
  }, [filterValueList]);

  /**
   * Remove a single filter value from both the committed list and the
   * staging list so they stay in sync when a chip is dismissed.
   */
  const clearFilter = (filter: string) => {
    setFilterValueList((prev) => prev.filter((f) => f !== filter));
    setTempFilterValueList((prev) => prev.filter((f) => f !== filter));
  };

  return (
    <FilterContext.Provider
      value={{
        filterValueList,
        setFilterValueList,
        clearFilter,
        setTempFilterValueList,
        tempFilterValueList,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

/** Hook to access filter state. Must be used inside FilterProvider. */
export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
