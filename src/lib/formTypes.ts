import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export type FormValues = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  position: string;
  company: string;
  message: string;
  cartItems?: {
    name: string;
    quantity: string;
    category: string;
    size: string;
    image?: string;
  }[];
};

// export type EmailPayloadProps {

// }

export type TextInputProps = {
  label: string;
  placeholder: string;
  error?: string;
  register: any;
} & InputHTMLAttributes<HTMLInputElement>;

export type SelectInputProps = {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  register: any;
} & SelectHTMLAttributes<HTMLSelectElement>;

export type TextAreaInputProps = {
  label: string;
  placeholder: string;
  error?: string;
  register: any;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export type PhoneInputProps = {
  label: string;
  placeholder: string;
  error?: string;
  register: any;
} & InputHTMLAttributes<HTMLInputElement>;
