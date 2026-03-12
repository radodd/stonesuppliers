"use client";

import { useForm } from "react-hook-form";
import { FormValues } from "./../../lib/formTypes";
import { sendFormData } from "./apiClient";
import { useToast } from "./../ui/use-toast";
import { useScreenSize } from "./../../lib/useScreenSize";
import { useState } from "react";
import { useCart } from "../../context/CartContext";

export const useContactForm = ({ cartItems = [] }) => {
  // const { cartItems } = useCart()
  const { toast } = useToast();
  const isScreenSmall = useScreenSize(430);
  const [openModal, setOpenModal] = useState(false);
  const { removeFromCart } = useCart();

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
        cartItems: Array.isArray(cartItems) ? cartItems : [],
      };
      const result = await sendFormData(payload);

      if (!result.success) {
        console.error("Error sending email:", result.error);
      } else {
        if (Array.isArray(cartItems)) {
          cartItems.forEach((_, index) => removeFromCart(index));
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
  };
};

export default useContactForm;
