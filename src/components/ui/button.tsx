"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import Link from "next/link";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[100px] text-base font-normal ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // default: "bg-primary text-primary-foreground hover:bg-primary/90",
        default:
          "bg-primary text-primary-foreground font-openSans hover:opacity-90  transition-opacity duration-300",
        destructive:
          "bg-destructive text-destructive-foreground font-openSans hover:bg-destructive/90",
        // outline:
        //   "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        outline:
          "border-2 border-primary bg-transparent text-primary font-openSans hover:scale-[1.05] transition-all duration-300",
        whiteOutline:
          "border-2 border-whitebase bg-transparent text-whitebase font-openSans hover:scale-[1.05] transition-all duration-300",
        secondary:
          "bg-secondary text-secondary-foreground font-openSans hover:bg-secondary/80",
        ghost: "hover:bg-accent font-openSans hover:text-accent-foreground",
        link: "text-primary font-openSans underline",
        filterDisabled:
          "text-primary font-openSans border-2  font-[24px] transition-all duration-200 bg-whitebase",
        otherFilter:
          "text-primary font-openSans border-2 border-primary font-[24px] hover:underline hover:scale-[1.05] transition-all duration-200 bg-whitebase",
        filterClear: "text-primary font-[16px] font-[700]",
        filterMobile: "text-primary-dark font-[16px] bg-[#A9C8D3]/[.5]",
        quantity:
          "border-2 border-icon bg-transparent rounded-[4px] hover:scale-[1.05] transition-all ",
        quantityCart:
          "border border-icon bg-transparent rounded-[2px] py-1 px-4 hover:scale-[1.05] transition-all",
        carouselOutline:
          "border-2 border-whitebase bg-transparent text-whitebase font-openSans hover:scale-[1.05] transition-all duration-300",
        carouselPrimary:
          "border-2 border-[#FDFBF6] bg-[#FDFBF6] text-primary font-openSans hover:scale-[1.05] transition-all duration-300",
        mobileFilterClose:
          "border-2 border-[#BEC0C9] bg-whitebase font-montserrat text-[24px]",
      },
      size: {
        default: "px-8 py-4",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        filter: "px-4 py-2 rounded-[4px]",
        filterMobile: "px-2 py-1 rounded-[4px]",
        mobileFilterOpen: "px-6 py-3",
        mobileFilterClose: "px-2 py-4 w-full h-[61px] rounded-none",
        quantity: "h-14 w-14 rounded-sm",
        quantityCart: "h-[28px] w-[28px]",
        slim: "p-0 m-0 max-w-[70px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  navigateTo?: string;
  onClick?: () => void;
  filter?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      navigateTo,
      onClick,
      filter,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const handleClick = () => {
      if (filter) {
        onClick?.();
      }
    };

    if (navigateTo) {
      return (
        <Link href={navigateTo} passHref>
          <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
            onClick={handleClick}
          />
        </Link>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={onClick}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
