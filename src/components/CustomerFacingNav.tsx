"use client";

import { cn } from "../lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ComponentProps, ReactNode, useState } from "react";
import "hamburgers/dist/hamburgers.css";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { ChevronDown } from "lucide-react";
import { NavigationMenuLink } from "./ui/navigation-menu";
import { Separator } from "./ui/separator";
import { ArtisanalStone } from "../lib";
import ChevronNavSharp from "../../public/chevron_nav_sharp.svg";

import styles from "./scss/CustomerFacingNav.module.scss";
import { useFilter } from "../context/FilterContext";
import { useCart } from "../context/CartContext";

/** A reusable component for the site logo */
const Logo = () => (
  <Link href="/">
    <Image src="/logo_rocks.svg" alt="Company Logo" height={64} width={207} />
  </Link>
);

/** Mobile Nav Menu with Sheet */
const MobileNavMenu = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div>
          <button
            type="button"
            className={`hamburger hamburger--collapse ${isOpen ? "is-active" : ""}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>
        </div>
      </SheetTrigger>

      <SheetContent hideChevron={true} className="w-[300px]">
        <nav className={styles.sheet}>
          <NavLink href="/about">About</NavLink>
          <MaterialsDropdown />
          <NavLink href="/services">Services</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>

        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

/** Materials Dropdown inside the Mobile Nav */
const MaterialsDropdown = () => {
  return (
    <Sheet>
      <SheetTrigger className="relative text-left flex flex-row items-center py-[16px] px-[24px] hover:font-bold">
        Materials
        <ChevronDown className="absolute -rotate-90 right-6 top-15" />
      </SheetTrigger>
      <SheetContent className="w-[300px]" hideOverlay={true}>
        <span className="relative text-[24px] font-[400] flex justify-center items-center px-[8px] py-[16px] text-blackbase border-2 border-primary focus:bg-tanbase">
          Materials
        </span>
        <div className="active:bg-tanbase w-full px-[8px] py-[24px]">
          <Link href="/materials">
            <span className="text-[24px] font-[700] leading-[-0.48px]">
              Shop all our materials
            </span>
          </Link>
        </div>
        <MaterialSections />
      </SheetContent>
    </Sheet>
  );
};

/** Artisanal Stone and other material sections */
const MaterialSections = () => {
  const { setFilterValueList, filterValueList } = useFilter();
  return (
    <>
      <Separator className="bg-[#919EA6]" />
      <MaterialSection
        title="Stoneyard"
        description="We are focused on artisanal stone and tile."
        items={ArtisanalStone}
        setFilterValueList={setFilterValueList}
      />
      <Separator className="bg-[#919EA6]" />
      <MaterialSection
        title="MRC Rock & Sand"
        description="We are focused on artisanal stone and tile."
        setFilterValueList={setFilterValueList}
      />
      <Separator className="bg-[#919EA6]" />
      <MaterialSection
        title="Santa Paula Materials"
        description="We are focused on artisanal stone and tile."
        setFilterValueList={setFilterValueList}
      />
      <Separator className="bg-[#919EA6]" />
    </>
  );
};

const MaterialSection = ({
  title,
  description,
  items,
  setFilterValueList,
}: {
  title: string;
  description: string;
  items?: string[];
  setFilterValueList: (value: string[]) => void;
}) => {
  const handleClick = (filterValue) => {
    const updatedFilterValueList = [filterValue];
    setFilterValueList(updatedFilterValueList);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "filterValueList",
        JSON.stringify(updatedFilterValueList),
      );
    }
  };

  return (
    <Sheet>
      <SheetTrigger className={styles.materialsMenu}>
        <div className=" ">
          <div className="flex justify-between mb-2 ">
            <span>{title}</span>
            <ChevronNavSharp />
          </div>
          <p>{description}</p>
        </div>
      </SheetTrigger>
      {title === "Stoneyard" ? (
        <SheetContent
          hideOverlay={true}
          className={styles.stoneyardMaterialCategorySheet}
        >
          {/* Stoneyard content */}
          <span className="relative text-[24px] font-[700] flex justify-center items-center text-blackbase border-2 border-primary active:bg-tanbase">
            Stoneyard
          </span>
          <div className="flex flex-row px-[8px] py-[24px] gap-[16px]">
            <Logo />
            <p className="text-[16px]">
              We are focused on artisanal stone and .
            </p>
          </div>

          <Sheet>
            <SheetTrigger className="w-full">
              <Separator className="bg-[#919EA6]" />
              <div className="relative flex">
                <span className="flex font-[400]">Artisanal Stone</span>
                <ChevronNavSharp className="absolute right-0 top-4" />
              </div>
              <Separator className="bg-[#919EA6]" />
            </SheetTrigger>
            <SheetContent
              className={`w-[300px] max-h-[90vh] overflow-y-auto overflow-x-hidden ${styles.scrollbarHide}`}
              hideOverlay={true}
            >
              {/* Now render the items for Stoneyard */}
              {items && (
                <>
                  <span className="relative text-[24px] font-[700] flex justify-center items-center px-[8px] py-[16px] text-blackbase border-2 border-primary focus:bg-tanbase">
                    Artisanal Stone
                  </span>
                  <div className="flex flex-row px-[8px] py-[24px] gap-[16px] point">
                    <Logo />
                    <p className="text-[16px]">
                      We are focused on artisanal stone and tile.
                    </p>
                  </div>
                  <ul className="flex flex-col">
                    {items.map((item, index) => (
                      <>
                        <Separator key={index} />
                        <Link href="/materials">
                          <li
                            className={styles.listMaterials}
                            onClick={() => handleClick(item)}
                          >
                            {item}
                          </li>
                        </Link>
                      </>
                    ))}
                  </ul>
                </>
              )}
            </SheetContent>
          </Sheet>
        </SheetContent>
      ) : (
        <SheetContent hideOverlay={true} className={styles.otherMaterialSheet}>
          {/* Render items for other sections directly */}
          {items && (
            <ul className="flex flex-col">
              {items.map((item, index) => (
                <li
                  key={index}
                  className="w-full text-[16px] hover:font-bold px-2 py-4"
                >
                  {item}
                  <Separator />
                </li>
              ))}
            </ul>
          )}
        </SheetContent>
      )}
    </Sheet>
  );
};

/** A reusable link component for navigation items */
const NavLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link
    href={href}
    className="font-montserrat hover:font-bold py-[16px] px-[24px]"
  >
    {children}
  </Link>
);

/** The main CustomerFacingNav component */
export function CustomerFacingNav({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItemCounter } = useCart();

  return (
    <div className={styles.navContainer}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>
      <nav className={styles.nav}>
        {/* Desktop Navigation */}
        <div className={styles.hiddenMobile}>{children}</div>

        {/* Mobile Navigation */}
        <div className={styles.mobileNavContainer}>
          <CustomerFacingNavLink href="/cart">
            <Image
              src="/shopping_cart.svg"
              alt="shopping cart"
              width={33}
              height={33}
              className="bg-whitebase flex min-w-[33px]"
            />
            {/* Counter Badge */}
            {cartItemCounter > 0 && (
              <span className="absolute top-[24px] right-[70px] bg-[#A9C8D3] text-primary text-xs font-bold rounded-full h-5 w-[500px] flex items-center justify-center">
                {cartItemCounter}
              </span>
            )}
          </CustomerFacingNavLink>
          <MobileNavMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </nav>
    </div>
  );
}

/** A reusable customer-facing nav link component */
export function CustomerFacingNavLink(
  props: Omit<ComponentProps<typeof Link>, "className">,
) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "font-openSans m-0 px-1 w-fit rounded-lg bg-whitebase hover:text-primary",
        pathname === "/cart" && "font-[400]",
      )}
    />
  );
}

/** List item component inside dropdowns or sheets */
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => (
  <li className="m-4 relative">
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-tanbase hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className,
        )}
        {...props}
      >
        <div className="flex justify-between w-full text-[20px] font-medium  font-openSans">
          {title}
          <ChevronDown className="-rotate-90" />
        </div>
        <p className="text-[16px] text-muted-foreground">{children}</p>
      </a>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = "ListItem";
