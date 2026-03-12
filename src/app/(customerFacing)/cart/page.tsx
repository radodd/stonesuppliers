"use client";

import { HOWTOUSE } from "@/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import { Button } from "../../../components/ui/button";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "../../../components/ui/input";
import ContactForm2 from "../../../components/form/ContactForm2";
import { useCart } from "../../../context/CartContext";
import Image from "next/image";

import style from "../../../components/scss/CartPage.module.scss";
import QuoteCartSEOContent from "@/components/SEO/CartSEOContent";

export default function CartPage() {
  const { cartItems, cartItemCounter } = useCart();
  const [openAccordion, setOpenAccordion] = useState<string[]>(["item-1"]);

  useEffect(() => {
    if (cartItemCounter > 0) {
      setOpenAccordion(["item-2"]);
    }
  }, [cartItems]);

  return (
    <>
      {/* SEO + Screen Reader-Only Heading */}
      <QuoteCartSEOContent />{" "}
      <h1 className="sr-only">
        Contact MRC Rock & Sand, SPM Santa Paula Materials, and Stoneyard
      </h1>
      {/* Visible content, hidden from screen readers */}
      <h2 className={style.header} aria-hidden>
        Request to Quote
      </h2>
      <div className={style.container}>
        <Accordion
          type="multiple"
          // collapsible={false}
          value={openAccordion}
          onValueChange={setOpenAccordion}
          className="max-[1306px]:w-full flex-1"
        >
          <AccordionItem value="item-1" className="min-[1306px]:hidden">
            <AccordionTrigger className={style.AccordionTrigger}>
              How to use
            </AccordionTrigger>
            <AccordionContent>
              <HowToUseSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className={style.AccordionTrigger}>
              Cart
            </AccordionTrigger>
            <AccordionContent>
              <Cart />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className={style.AccordionTrigger}>
              Contact Information
            </AccordionTrigger>
            <AccordionContent>
              <div className={style.padding}>
                <ContactForm2 cartItems={cartItems} />
              </div>
            </AccordionContent>
          </AccordionItem>{" "}
          <div className={style.buttonContainer}>
            <Button
              variant="default"
              size="default"
              onClick={() => setOpenAccordion(["item-3"])}
              className={`${openAccordion.includes("item-3") ? "hidden" : ""} ${style.button}`}
            >
              Submit
            </Button>
          </div>
        </Accordion>

        <div className="flex-1 max-[1306px]:hidden">
          <h2 className={style.howToText}>How to use</h2>
          <div className={style.howToContainer}>
            {HOWTOUSE.map((item, index) => (
              <div key={index} className="mb-8">
                <h2 className="font-bold text-xl text-primary">{item.title}</h2>
                <p className="text-secondary-text">{item.content}</p>
              </div>
            ))}
            <Button navigateTo="/contact" className="w-full mt-4">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

const HowToUseSection = () => (
  <div className=" py-[40px]">
    {HOWTOUSE.map((item, index) => (
      <div key={index} className="mb-[30px]">
        <h2 className="font-bold text-xl text-primary">{item.title}</h2>
        <p className="text-secondary-text">{item.content}</p>
      </div>
    ))}
    <Button className="w-full" navigateTo="/contact">
      Contact Us
    </Button>
  </div>
);

const QuantityInput = ({ value, handleIncrease, handleDecrease, index }) => {
  return (
    <div className={style.quantityContainer}>
      <span>Quantity (Per Ton)</span>
      <div className="flex gap-4">
        <Button
          variant="quantityCart"
          size="quantityCart"
          onClick={() => handleDecrease(index)}
          disabled={value === 1}
        >
          -
        </Button>

        <Input readOnly type="string" value={value} className={style.input} />
        <Button
          variant="quantityCart"
          size="quantityCart"
          onClick={() => handleIncrease(index)}
        >
          +
        </Button>
      </div>
    </div>
  );
};

const Cart = () => {
  const { cartItems, setCartItems } = useCart();
  const methods = useForm();

  const updateQuantity = (index: number, newQuantity: number) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity.toString();
    setCartItems(updatedCart);
  };

  const handleIncrease = (index: number) => {
    const currentQuantity = parseInt(cartItems[index].quantity, 10);
    const newQuantity = currentQuantity + 1;
    updateQuantity(index, newQuantity);
  };

  const handleDecrease = (index: number) => {
    const currentQuantity = parseInt(cartItems[index].quantity, 10);
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      updateQuantity(index, newQuantity);
    }
  };

  const handleDelete = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };

  return (
    <FormProvider {...methods}>
      <div>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div key={index} className={style.cartItemContainer}>
              {/* <div className={style.imageContainer}>
                <Image
                  src={item?.image ? item.image : "/image_not_available.svg"}
                  alt=""
                  width={500}
                  height={500}
                  className={style.image}
                />
              </div> */}

              <h1>{item?.name}</h1>

              <div className="flex flex-col">
                {item?.category && (
                  <div className={style.cartItemDetail}>
                    <h3>
                      Category
                      <span className="ml-2 text-primary">
                        {item?.category}
                      </span>
                    </h3>

                    {item?.size && (
                      <h3>
                        Size
                        <span className="ml-2 text-primary">{item?.size}</span>
                      </h3>
                    )}
                  </div>
                )}

                <div className="quantity-controls">
                  <QuantityInput
                    index={index}
                    value={item?.quantity || 1}
                    handleIncrease={handleIncrease}
                    handleDecrease={handleDecrease}
                  />
                </div>
              </div>
              <Button
                variant="link"
                className="w-fit p-0 mt-2 italic"
                onClick={() => handleDelete(index)}
              >
                Delete
              </Button>
            </div>
          ))
        ) : (
          <div>
            <Image
              src="/no_items_in_cart.svg"
              alt=""
              width={400}
              height={300}
              className="w-full"
            />
          </div>
        )}
      </div>
    </FormProvider>
  );
};
