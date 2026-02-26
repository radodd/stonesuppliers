import {
  ArtisanalStone,
  MRCandSPMMaterials,
  SantaPaulaMaterials,
} from "@/lib/index";

export type MaterialGroup = "stoneyard" | "mrc" | "spm";

export interface MaterialMenuGroup {
  key: MaterialGroup;
  title: string;
  filterValue: string;
  logo: string;
  description: string;
  items: string[];
}

export const MATERIAL_GROUPS: MaterialMenuGroup[] = [
  {
    key: "stoneyard",
    title: "Stoneyard",
    filterValue: "stoneyard",
    logo: "/logo_stoneyard.svg",
    description: "We are focused on artisanal stone and tile.",
    items: ArtisanalStone,
  },
  {
    key: "mrc",
    title: "MRC Rock & Sand",
    filterValue: "MRC Rock & Sand",
    logo: "/logo_mrc.svg",
    description: " Supplying aggregates and services for construction.",
    items: MRCandSPMMaterials,
  },
  {
    key: "spm",
    title: "Santa Paula Materials",
    filterValue: "Santa Paula Materials",
    logo: "/logo_spm.svg",
    description: "Recycling, and producing crushed materials.",
    items: SantaPaulaMaterials,
  },
];
