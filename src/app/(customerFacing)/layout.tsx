"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ChevronNavSharp from "../../../public/chevron_nav_sharp.svg";
import ShoppingCart from "/public/shopping_cart.svg";
import {
  ArtisanalStone,
  MRCandSPMMaterials,
  MaterialID,
  SantaPaulaMaterials,
} from "../../lib";
import { useFilter } from "../../context/FilterContext";
import { cn } from "../../lib/utils";
import { CustomerFacingNavLink } from "../../components/CustomerFacingNav";
import { Footer } from "../../components/Footer";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../components/ui/navigation-menu";
import { CustomerFacingNav2 } from "../../components/CustomerFacingNav2";
import { ClientOnly } from "../../lib/ClientOnly";
import { useCart } from "../../context/CartContext";

import styles from "./index.module.scss";

const MENU_HEIGHT = {
  default: "min-h-[416px]",

  Stoneyard: "h-[416px]",

  MRC: "h-[416px]",

  SPM: "h-[416px]",
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState<number | null>(null);
  const [isSubSubmenuOpen, setIsSubSubmenuOpen] = useState<number | null>(null);
  const [menuHeight, setMenuHeight] = useState(MENU_HEIGHT.default);
  const { setFilterValueList, filterValueList } = useFilter();
  const pathname = usePathname();
  const router = useRouter();
  const { cartItems, cartItemCounter } = useCart();
  useEffect(() => {}, [
    isMaterialsOpen,
    isSubmenuOpen,
    isSubSubmenuOpen,
    menuHeight,
    filterValueList,
  ]);

  useEffect(() => {
    const getMenuHeight = () => {
      if (isSubmenuOpen === 1) return MENU_HEIGHT.Stoneyard;
      if (isSubmenuOpen === 2) return MENU_HEIGHT.MRC;
      if (isSubmenuOpen === 3) return MENU_HEIGHT.SPM;
      return MENU_HEIGHT.default;
    };

    if (!isMaterialsOpen) {
      setIsSubmenuOpen(null);
    }
    setMenuHeight(getMenuHeight());
  }, [isSubSubmenuOpen, isSubmenuOpen, isMaterialsOpen, filterValueList]);

  const handleFilterClick = (filterValue: string) => {
    setFilterValueList([filterValue]);
    if (typeof window !== "undefined") {
      localStorage.setItem("filterValueList", JSON.stringify([filterValue]));
    }
  };

  // const handleMaterialDetail = async (materialName: string) => {
  //   const material = MaterialID.find((item) => item.name === materialName);

  //   if (material) {
  //     router.push(`/materials/${material.id}`);
  //   } else {
  //     console.error("Material not found:", materialName);
  //   }
  // };

  const toSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric
      .replace(/\s+/g, "-") // replace spaces with -
      .replace(/-+/g, "-"); // collapse multiple dashes

  const handleMaterialDetail = async (materialName: string) => {
    const material = MaterialID.find(
      (item) => item.name.toLowerCase() === materialName.toLowerCase(),
    );

    if (material) {
      console.log(material);
      const slug = toSlug(material.name);
      router.push(`/materials/${slug}`);
    } else {
      console.error("Material not found:", materialName);
    }
  };

  return (
    <>
      <CustomerFacingNav2>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem onMouseEnter={() => setIsMaterialsOpen(true)}>
              <NavigationMenuTrigger className="font-openSans hover:text-primary">
                Materials
              </NavigationMenuTrigger>
              {isMaterialsOpen && (
                <MaterialMenuContent
                  onMouseLeave={() => setIsMaterialsOpen(false)}
                  menuHeight={menuHeight}
                  isSubmenuOpen={isSubmenuOpen}
                  isSubSubmenuOpen={isSubSubmenuOpen}
                  setIsSubmenuOpen={setIsSubmenuOpen}
                  setIsSubSubmenuOpen={setIsSubSubmenuOpen}
                  handleFilterClick={handleFilterClick}
                  handleMaterialDetail={handleMaterialDetail}
                />
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <ClientOnly>
          <CustomerFacingNavLink href="/about">About</CustomerFacingNavLink>
          <CustomerFacingNavLink href="/services">
            Services
          </CustomerFacingNavLink>
          <CustomerFacingNavLink href="/contact">Contact</CustomerFacingNavLink>
          <CustomerFacingNavLink href="/cart">
            <ShoppingCart
              className={`${pathname === "/cart" && "fill-primary-dark"} min-w-[33px] hover:fill-primary-dark`}
            />
            {/* Counter Badge */}
            {cartItemCounter > 0 && (
              <span className="absolute top-[24px] right-[70px] bg-[#A9C8D3] text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCounter}
              </span>
            )}
          </CustomerFacingNavLink>
        </ClientOnly>
      </CustomerFacingNav2>

      <div>{children}</div>
      {/* <Footer> */}
      {/* <FooterLinks /> */}
      {/* </Footer> */}
    </>
  );
}

const MaterialMenuContent = ({
  onMouseLeave,
  menuHeight,
  isSubmenuOpen,
  isSubSubmenuOpen,
  setIsSubmenuOpen,
  setIsSubSubmenuOpen,
  handleFilterClick,
  handleMaterialDetail,
}) => (
  <NavigationMenuContent
    onMouseLeave={onMouseLeave}
    className={`${menuHeight} flex justify-start bg-whitebase rounded-[10px] p-[16px]`}
  >
    <Link
      href="/materials"
      className="font-[700] font-openSans text-[20px] pb-[8px]"
    >
      Shop All Materials
    </Link>

    <ul className="flex flex-col gap-[8px] w-[257px]">
      <MenuItem
        href="/materials"
        logo="/logo_stoneyard.svg"
        title="Stoneyard"
        description="We are focused on artisanal stone and tile"
        subDescription="We are focused on artisanal stone and tile"
        isSubmenuOpen={isSubmenuOpen === 1}
        onMouseEnter={() => setIsSubmenuOpen(1)}
        onClick={() => {
          handleFilterClick("Stoneyard");
          setIsSubmenuOpen(null);
        }}
        submenuItems={ArtisanalStone}
        isSubSubmenuOpen={isSubSubmenuOpen === 1}
        setIsSubSubmenuOpen={setIsSubSubmenuOpen}
        menuHeight={menuHeight}
        handleMaterialDetail={handleMaterialDetail}
      />
      <MenuItem
        href="/materials"
        logo="/logo_mrc.svg"
        title="MRC Rock & Sand"
        description="Supplying aggregates and services for construction."
        subDescription="Supplying aggregates and services for construction."
        isSubmenuOpen={isSubmenuOpen === 2}
        onMouseEnter={() => setIsSubmenuOpen(2)}
        onClick={() => {
          handleFilterClick("MRC Rock & Sand");
          setIsSubmenuOpen(null);
        }}
        submenuItems={MRCandSPMMaterials}
        menuHeight={menuHeight}
        handleMaterialDetail={handleMaterialDetail}
      />
      <MenuItem
        href="/materials"
        logo="/logo_spm.svg"
        title="Santa Paula Materials"
        description="Recycling and producing crushed materials."
        subDescription="Recycling and producing crushed materials"
        isSubmenuOpen={isSubmenuOpen === 3}
        onMouseEnter={() => setIsSubmenuOpen(3)}
        onClick={() => {
          setIsSubmenuOpen(null);
          handleFilterClick("Santa Paula Materials");
        }}
        submenuItems={SantaPaulaMaterials}
        menuHeight={menuHeight}
        handleMaterialDetail={handleMaterialDetail}
      />
    </ul>
  </NavigationMenuContent>
);

interface MenuItemProps {
  href: string;
  logo: string;
  title: string;
  description: string;
  subDescription: string;
  onMouseEnter: () => void;
  onMouseLeave?: () => void;
  onClick: (event) => void;
  isSubmenuOpen: boolean;
  submenuItems?: string[];
  isSubSubmenuOpen?: boolean;
  setIsSubSubmenuOpen?: React.Dispatch<React.SetStateAction<number | null>>;
  menuHeight: string;
  handleMaterialDetail?: (item: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  href,
  logo,
  title,
  description,
  subDescription,
  onMouseEnter,
  onClick,
  isSubmenuOpen,
  submenuItems,
  isSubSubmenuOpen,
  setIsSubSubmenuOpen,
  menuHeight,
  handleMaterialDetail,
}) => (
  <>
    <ListItem
      href={href}
      title={title}
      description={description}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {isSubmenuOpen && (
        <ul className={styles.subMenuContainer}>
          <li className="w-[208px]">
            <SubList
              logo={logo}
              title={title}
              subDescription={subDescription}
              menuHeight={menuHeight}
            />
          </li>
        </ul>
      )}
    </ListItem>
    {isSubmenuOpen && submenuItems && (
      <div className="absolute bg-whitebase left-[535px] top-[0px] p-[16px] flex flex-col gap-[16px] rounded-r-[10px] h-[416px]">
        {submenuItems.map((item, index) => (
          <li
            key={index}
            className={`${title === "Stoneyard" ? "w-[242px]" : ""} text-xl hover:text-primary cursor-pointer w-[182px]`}
            onClick={() => {
              handleMaterialDetail(item);
            }}
          >
            {item}
          </li>
        ))}
      </div>
    )}
  </>
);

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string;
  children?: React.ReactNode;
  description: string;
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ className, title, description, children, ...props }, ref) => (
    <li className="p-4 hover:bg-tanbase active:bg-[#E2D8C8] rounded-md">
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 leading-none no-underline outline-none transition-colors hover:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="flex justify-between items-center w-full text-[20px] font-[700] font-openSans leading-none ">
            {title}
            <ChevronNavSharp className="" />
          </div>
          <p className="text-[16px] leading-snug text-secondary-text">
            {description}
          </p>
          {children}
        </a>
      </NavigationMenuLink>
    </li>
  ),
);

ListItem.displayName = "ListItem";

interface SubListProps {
  logo: string;
  title?: string;
  subDescription: string;
  items?: string[];
  onMouseLeave?: () => void;
  menuHeight?: string;
}

const SubList: React.FC<SubListProps> = ({
  logo,
  title,
  subDescription,
  items,
  menuHeight,
}) => (
  <>
    <div className={`${menuHeight} bg-whitebase w-[260px] py-[16px]`}>
      <div className={styles.subListHeaderContainer}>
        <Image src={logo} alt="" width={80} height={60} />
        <span className="font-openSans font-semibold text-[25px]">{title}</span>
        <p>{subDescription}</p>
      </div>
    </div>

    <ul>
      {items?.map((item, index) => (
        <li key={index} className="text-xl hover:font-bold">
          {item}
        </li>
      ))}
    </ul>
  </>
);
