import React, { forwardRef } from "react";
import { PhoneInputProps } from "../../lib/formTypes";
import style from "./ContactForm.module.scss";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, error, register, ...rest }, _ref) => {
    const { onChange, ref, ...registerRest } = register;
    return (
      <div className={style.inputContainer}>
        <input
          {...registerRest}
          {...rest}
          ref={ref}
          placeholder="Phone Number"
          className={style.inputField}
          onChange={(e) => {
            e.target.value = formatPhone(e.target.value);
            onChange(e);
          }}
        />
        <label className={style.label}>{label}</label>
        {error && <p className={style.errorMessage}>{error}</p>}
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
