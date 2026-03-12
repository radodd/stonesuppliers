import Link from "next/link";
import ShoppingCart from "/public/shopping_cart.svg";

import { ComponentProps } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  pathname: string;
  cartItemCounter: number;
}

export function DeskTopNavLink(
  props: Omit<ComponentProps<typeof Link>, "className">,
) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "font-openSans text-[24px] m-0 px-1 w-fit rounded-lg text-[#2C2D31] bg-whitebase hover:font-bold",
        pathname === "/cart" && "font-bold",
      )}
    />
  );
}

export default function NavLinks({ pathname, cartItemCounter }: Props) {
  return (
    <div className="flex items-center gap-6 relative">
      <DeskTopNavLink href="/about">About</DeskTopNavLink>
      <DeskTopNavLink href="/services">Services</DeskTopNavLink>
      <DeskTopNavLink href="/contact">Contact</DeskTopNavLink>

      <DeskTopNavLink href="/cart">
        <ShoppingCart
          className={pathname === "/cart" ? "fill-primary-dark" : ""}
        />
        {cartItemCounter > 0 && (
          <span className="absolute -top-1 -right-2 bg-[#A9C8D3] text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartItemCounter}
          </span>
        )}
      </DeskTopNavLink>
    </div>
  );
}
