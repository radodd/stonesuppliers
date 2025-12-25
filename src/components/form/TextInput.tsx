import React, { forwardRef } from "react";
import { TextInputProps } from "../../lib/formTypes";

import style from "./ContactForm.module.scss";

const NonStrictWrapper = ({ children }: { children: React.ReactNode }) => (
  <React.Fragment>{children}</React.Fragment>
);

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, placeholder, error, value, onChange, register, ...rest }, ref) => (
    <div className={style.inputContainer}>
      <NonStrictWrapper>
        <input
          placeholder={placeholder}
          {...register}
          {...rest}
          value={value}
          onChange={onChange}
          className={style.inputField}
        />
      </NonStrictWrapper>
      <label className={style.label}>{label}</label>
      {error && <p className={style.errorMessage}>{error}</p>}
    </div>
  ),
);

TextInput.displayName = "TextInput";

export default TextInput;
