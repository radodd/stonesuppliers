"use client";

import React, { useEffect } from "react";
import { Button } from "../ui/button";
import ToastModal from "../ToastModal";
import TextInput from "./TextInput";
import SelectInput, { positionOptions } from "./SelectInput";
import TextAreaInput from "./TextAreaInput";
import PhoneInput from "./PhoneInput";
import useContactForm from "./useContactForm";
import { validationRules } from "../../lib/formValidation";

import style from "./ContactForm.module.scss";

type ContactFormProps = {
  buttonText?: string;
  cartItems?: any;
};

const ContactForm2: React.FC<ContactFormProps> = ({
  buttonText = "Submit",
  cartItems,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    openModal,
    isScreenSmall,
    watch,
    trigger,
    setValue,
  } = useContactForm({ cartItems });

  useEffect(() => {
    if (openModal) {
      document.body.classList.add("overflow-hidden");
      window.scrollTo(0, 0);
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [openModal]);

  return (
    <div className={style.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={style.formBody}>
        <div className={style.nameContainer}>
          <TextInput
            label="First Name"
            placeholder="First Name"
            error={errors.firstName?.message}
            register={register("firstName", validationRules.firstName)}
          />
          <TextInput
            label="Last Name"
            placeholder="Last Name"
            error={errors.lastName?.message}
            register={register("lastName", validationRules.lastName)}
            onChange={(e) => {
              setValue("lastName", e.target.value);
              trigger("lastName");
            }}
          />
        </div>
        <PhoneInput
          label="Phone Number"
          placeholder="Phone Number"
          error={errors.phoneNumber?.message}
          register={register("phoneNumber", validationRules.phoneNumber)}
        />
        <TextInput
          label="Email"
          placeholder="Email"
          error={errors.email?.message}
          register={register("email", validationRules.email)}
          onChange={(e) => {
            setValue("email", e.target.value);
            trigger("email");
          }}
        />
        <SelectInput
          label="Position"
          options={positionOptions}
          error={errors.position?.message}
          register={register("position", validationRules.position)}
        />
        <TextInput
          label="Company"
          placeholder="Company"
          error={errors.company?.message}
          register={register("company", validationRules.company)}
        />
        <TextAreaInput
          label="Message"
          placeholder="Message"
          error={errors.message?.message}
          register={register("message")}
        />
        <Button type="submit" className="w-full h-[54px]">
          {buttonText}
        </Button>
      </form>
      {isScreenSmall && openModal && <ToastModal />}
    </div>
  );
};

export default ContactForm2;
