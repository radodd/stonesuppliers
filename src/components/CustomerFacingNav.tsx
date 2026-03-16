"use client";

// ─────────────────────────────────────────────────────────────────────────────
// CustomerFacingNav
//
// The site-wide navigation bar. Renders differently for desktop and mobile:
//   Desktop: sticky top bar with logo, nav links injected as children, cart icon
//   Mobile:  hamburger button → Sheet (drawer) with a 3-level nested menu:
//              Level 1: top-level links (Materials / About / Services / Contact)
//              Level 2: company selector (Stoneyard / MRC / SPM) inside a Sheet
//              Level 3: material list for the selected company inside a Sheet
//
// CustomerFacingNavLink — a styled <Link> wrapper used for desktop nav items.
// CustomerFacingNav     — the full nav shell; accepts desktop nav children as props.
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from "../lib/utils";
import { toSlug } from "../lib/slugify";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import {
  ArtisanalStone,
  MRCandSPMMaterials,
  MaterialID,
  SantaPaulaMaterials,
} from "@/data";

import styles from "./scss/CustomerFacingNav.module.scss";
import { useCart } from "../context/CartContext";

/** A reusable component for the site logo */
const Logo = () => (
  <Link href="/">
    <Image src="/logo_rocks.svg" alt="Company Logo" height={64} width={207} style={{ width: "100%", height: "auto" }} />
  </Link>
);

/** Mobile Nav Menu with Sheet */
const MobileNavMenu = ({
  isOpen,
  setIsOpen,
  handleMaterialDetail,
}: {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  handleMaterialDetail: (item: string) => void;
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
          <MaterialsDropdown handleMaterialDetail={handleMaterialDetail} />
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
const MaterialsDropdown = ({
  handleMaterialDetail,
}: {
  handleMaterialDetail: (item: string) => void;
}) => {
  return (
    <Sheet>
      <SheetTrigger
        className={`${styles.navLink} flex justify-between items-center`}
      >
        Materials
        <ChevronDown className="-rotate-90" />
      </SheetTrigger>
      <SheetContent className={`${styles.materialsMenu}`} hideOverlay={true}>
        <h3 className="text-[24px] font-normal text-blackbase text-center border-primary focus:bg-tanbase border-2 px-2 py-4 justify-center flex items-center]">
          Materials
        </h3>
        <div className="py-6">
          <Link href="/materials" className="text-[24px] font-[700] px-2">
            Shop all our materials
          </Link>
        </div>
        <Separator />
        <MaterialSections handleMaterialDetail={handleMaterialDetail} />
      </SheetContent>
    </Sheet>
  );
};

/** Artisanal Stone and other material sections */
const MaterialSections = ({
  handleMaterialDetail,
}: {
  handleMaterialDetail: (item: string) => void;
}) => (
  <>
    <MaterialSection
      title="Stoneyard"
      description="We are focused on artisanal stone and tile."
      items={ArtisanalStone}
      src="/logo_stoneyard.svg"
      handleMaterialDetail={handleMaterialDetail}
    />
    <MaterialSection
      title="MRC Rock & Sand"
      description=" Supplying aggregates and services for construction."
      src="/logo_mrc.svg"
      items={MRCandSPMMaterials}
      handleMaterialDetail={handleMaterialDetail}
    />
    <MaterialSection
      title="Santa Paula Materials"
      description="Recycling, and producing crushed materials."
      src="/logo_spm.svg"
      items={SantaPaulaMaterials}
      handleMaterialDetail={handleMaterialDetail}
    />
  </>
);

const MaterialSection = ({
  title,
  description,
  items,
  src,
  handleMaterialDetail,
}: {
  title: string;
  description: string;
  items?: string[];
  src: string;
  handleMaterialDetail: (item: string) => void;
}) => (
  <Sheet>
    <SheetTrigger className="border-t border-t-[#919EA6]">
      <div className="my-4 mx-2 ">
        <div className="flex justify-between mb-2">
          <span>{title}</span>
          <ChevronDown className="-rotate-90" />
        </div>
        <p>{description}</p>
      </div>
    </SheetTrigger>
    <SheetContent hideOverlay={true} className={styles.materialListSheet}>
      <h3 className="text-[20px] font-bold text-center">{title}</h3>
      {items && (
        <>
          <div className={styles.subtitleContainer}>
            <Image src={src} alt="" width={50} height={50} style={{ width: "auto", height: "auto" }} />
            <span>{description}</span>
          </div>
          <ul>
            {items.map((item, index) => (
              <>
                <li
                  key={index}
                  className="w-full text-[16px] hover:font-bold px-2 py-4 cursor-pointer"
                  onClick={() => {
                    handleMaterialDetail(item);
                  }}
                >
                  {item}
                </li>
                <Separator />
              </>
            ))}
          </ul>
        </>
      )}
    </SheetContent>
  </Sheet>
);

/** A reusable link component for navigation items */
const NavLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} className={styles.navLink}>
    {children}
  </Link>
);

/** The main CustomerFacingNav component */
export function CustomerFacingNav({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, cartItemCounter } = useCart();
  const router = useRouter();

  const handleMaterialDetail = async (materialName: string) => {
    const material = MaterialID.find(
      (item) => item.name.toLowerCase() === materialName.toLowerCase(),
    );

    if (material) {
      const slug = toSlug(material.name);
      router.push(`/materials/${slug}`);
    } else {
      console.error("Material not found:", materialName);
    }
  };

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
              <span className={styles.cartCounter}>{cartItemCounter}</span>
            )}
          </CustomerFacingNavLink>
          <MobileNavMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            handleMaterialDetail={handleMaterialDetail}
          />
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
  const isActive = pathname === props.href;
  return (
    <Link
      {...props}
      className={cn(
        "font-openSans m-0 px-1 w-fit rounded-lg bg-whitebase hover:text-primary",
        isActive && "text-primary",
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
        <div className="flex justify-between w-full text-[20px] font-medium font-openSans">
          {title}
          <ChevronDown className="-rotate-90" />
        </div>
        <p className="text-[16px] text-muted-foreground">{children}</p>
      </a>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = "ListItem";
