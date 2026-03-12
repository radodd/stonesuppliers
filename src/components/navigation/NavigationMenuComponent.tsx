"use client";

import { useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useFilter } from "@/context/FilterContext";
import { useCart } from "@/context/CartContext";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

import { MATERIAL_GROUPS, MaterialGroup } from "./menuConfig";
import MaterialsMenu from "./MaterialsMenu";
import NavLinks from "./NavLinks";
import Link from "next/link";
import Image from "next/image";

const MENU_HEIGHT: Record<MaterialGroup, string> = {
  stoneyard: "h-[416x]",
  mrc: "h-[416px]",
  spm: "h-[416px]",
};

export default function NavigationMenuComponent() {
  const [materialsOpen, setMaterialsOpen] = useState<boolean>(false);
  const [activeGroup, setActiveGroup] = useState<MaterialGroup | null>(null);

  const { setFilterValueList } = useFilter();
  const { cartItemCounter } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const menuHeight = useMemo(
    () => (activeGroup ? MENU_HEIGHT[activeGroup] : "min-h-[416px]"),
    [activeGroup],
  );

  const handleFilterSelect = (filter: string) => {
    setFilterValueList([filter]);
    localStorage.setItem("selectedFilter", JSON.stringify([filter]));
  };

  const handleMaterialClick = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    router.push(`/materials/${slug}`);
  };

  const Logo = () => (
    <Link href="/">
      <Image src="/logo_rocks.svg" alt="Company Logo" height={64} width={207} />
    </Link>
  );

  return (
    <div className="relative flex items-center justify-between">
      <Logo />
      <div className="flex gap-6">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem
              onMouseEnter={() => setMaterialsOpen(true)}
              onMouseLeave={() => {
                // setMaterialsOpen(false);
                setActiveGroup(null);
              }}
            >
              <NavigationMenuTrigger className="font-openSans text-[#2C2D31]">
                Materials
              </NavigationMenuTrigger>

              {materialsOpen && (
                <MaterialsMenu
                  groups={MATERIAL_GROUPS}
                  activeGroup={activeGroup}
                  setActiveGroup={setActiveGroup}
                  onMaterialClick={handleMaterialClick}
                  menuHeight={menuHeight}
                  onFilterSelect={handleFilterSelect}
                />
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <NavLinks cartItemCounter={cartItemCounter} pathname={pathname} />{" "}
      </div>
    </div>
  );
}
