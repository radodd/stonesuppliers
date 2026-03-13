"use client";

import { useForm } from "react-hook-form";
import { FormValues } from "./../../lib/formTypes";
import { sendEmail } from "@/app/actions/sendEmail";
import { useToast } from "./../ui/use-toast";
import { useScreenSize } from "./../../lib/useScreenSize";
import { useState, useRef } from "react";
import { gaEvent } from "@/lib/ga";
import { useCart, type CartItem } from "../../context/CartContext";

export const useContactForm = ({ cartItems = [] }: { cartItems?: CartItem[] }) => {
  // const { cartItems } = useCart()
  const { toast } = useToast();
  const isScreenSmall = useScreenSize(430);
  const [openModal, setOpenModal] = useState(false);
  const { removeFromCart } = useCart();

  const formStartFiredRef = useRef(false);

  const handleFormStart = () => {
    if (formStartFiredRef.current) return;
    formStartFiredRef.current = true;
    gaEvent("form_start", { form_name: "quote_request" });
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      position: "",
      company: "",
      message: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (formData: FormValues) => {
    const isValid = await trigger();
    if (!isValid) return;

    try {
      const payload = {
        ...formData,
        cartItems: Array.isArray(cartItems)
          ? cartItems.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              category: item.category ?? "",
              size: item.size ?? "",
            }))
          : [],
      };
      const result = await sendEmail(payload);

      if (!result.success) {
        console.error("Error sending email:", result.error);
      } else {
        gaEvent("generate_lead", {
          value: cartItems.length,
          currency: "USD",
          lead_source: "quote_request_form",
          contact_company: formData.company,
          contact_position: formData.position,
          item_count: cartItems.length,
          items: Array.isArray(cartItems)
            ? cartItems.map((item) => ({
                item_name: item.name,
                item_category: item.category ?? "",
                item_variant: item.size ?? "",
                quantity: parseInt(item.quantity, 10),
              }))
            : [],
        });
        if (Array.isArray(cartItems)) {
          cartItems.forEach((item) => removeFromCart(item.cartId));
        }
        if (isScreenSmall) {
          setOpenModal(true);
        } else {
          toast({
            title: "Submitted",
            description:
              "Thank you for your inquiry! We have received your message and will respond within 24 hours.",
            src: "/Group 271.svg",
          });
        }
        reset();
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    openModal,
    setOpenModal,
    isScreenSmall,
    watch,
    trigger,
    setValue,
    handleFormStart,
  };
};

export default useContactForm;
