import React, { PropsWithRef, forwardRef, useRef } from "react";
// import ReactInputMask from "react-input-mask-next";
import ReactInputMask from "react-input-mask";
import { PhoneInputProps } from "../../lib/formTypes";

import style from "./ContactForm.module.scss";

const NonStrictWrapper = ({ children }: { children: React.ReactNode }) => (
  <React.Fragment>{children}</React.Fragment>
);

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, placeholder, error, register, ...rest }, ref) => (
    <div className={style.inputContainer}>
      <NonStrictWrapper>
        <ReactInputMask
          {...register}
          {...rest}
          placeholder="Phone Number"
          mask="(999) 999-9999"
          inputref={ref}
          className={style.inputField}
        />
      </NonStrictWrapper>
      <label className={style.label}>{label}</label>
      {error && <p className={style.errorMessage}>{error}</p>}
    </div>
  ),
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
