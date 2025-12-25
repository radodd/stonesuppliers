import React, { forwardRef } from "react";
import { TextAreaInputProps } from "../../lib/formTypes";

import style from "./ContactForm.module.scss";
const TextAreaInput = forwardRef<HTMLTextAreaElement, TextAreaInputProps>(
  ({ label, placeholder, error, register, ...rest }, ref) => (
    <div className={style.inputContainer}>
      <textarea
        placeholder={placeholder}
        {...rest}
        {...register}
        className={`${style.inputField} min-h-[153px] `}
      />
      <label className={style.label}>{label}</label>
      {error && <p className={style.errorMessage}>{error}</p>}
    </div>
  ),
);

TextAreaInput.displayName = "TextAreaInput";

export default TextAreaInput;
