import { z } from "zod";

export const AVAILABLE_COMPANIES = [
  "MRC Rock & Sand",
  "Santa Paula Materials",
  "Stoneyard",
] as const;
export const AVAILABLE_COLORS = ["yellow", "blue", "gray"] as const;
export const AVAILABLE_CATEGORIES = [
  "aggregate",
  "cobble & rubble",
  "boulders",
  "decomposed granite",
  "base materials",
  "rip rap",
  "drain rock",
  "rock dust",
] as const;

export const AVAILABLE_SORT = ["none", "name-asc", "name-desc"] as const;

export const ProductFilterValidator = z.object({
  company: z.array(z.enum(AVAILABLE_COMPANIES)),
  colors: z.array(z.enum(AVAILABLE_COLORS)),
  category: z.array(z.enum(AVAILABLE_CATEGORIES)),
  // sort: z.enum(AVAILABLE_SORT),
});

export type ProductState = z.infer<typeof ProductFilterValidator>;
