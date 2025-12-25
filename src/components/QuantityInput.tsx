"use client";
import React, { ChangeEvent, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import DecrementIcon from "./icons/DecrementIcon";
import { Input } from "./ui/input";
import IncrementIcon from "./icons/IncrementIcon";

import styles from "./scss/MaterialDetailForm.module.scss";

interface QuantityInputProps {
  control: any;
  onQuantityChange?: (newQuantity: string) => void;
  initialQuantity?: string;
  variant:
    | "link"
    | "filter"
    | "default"
    | "destructive"
    | "outline"
    | "whiteOutline"
    | "secondary"
    | "ghost"
    | "otherFilter"
    | "filterClear"
    | "filterMobile"
    | "quantity"
    | "carouselOutline"
    | "carouselPrimary"
    | "mobileFilterClose";
}
const QuantityInput = ({
  control,
  initialQuantity = "1",
  onQuantityChange,
  variant,
}: QuantityInputProps) => {
  //   const { control } = useFormContext();
  const [quantity, setQuantity] = useState(initialQuantity);

  const adjustQuantity = (amount: number) => {
    const newQuantity = Math.max(Number(quantity) + amount, 1).toString();
    setQuantity(newQuantity);
    if (onQuantityChange) {
      onQuantityChange(newQuantity);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity);
    if (onQuantityChange) {
      onQuantityChange(newQuantity); // Optionally notify the parent about the change
    }
  };

  return (
    <FormField
      name="quantity"
      control={control}
      render={({ field }) => (
        <FormItem className={styles.FormItem}>
          <FormLabel className={styles.FormLabel}>Quantity (Per Ton)</FormLabel>
          <div className={styles.quantityToggleContainer}>
            <Button
              type="button"
              variant={variant}
              size="quantity"
              onClick={() => adjustQuantity(-1)}
            >
              <DecrementIcon color="hsl(var(--icon))" size={12} />
            </Button>
            <FormControl>
              <Input
                {...field}
                value={quantity}
                onChange={handleChange}
                className={styles.Input}
              />
            </FormControl>
            <Button
              type="button"
              variant={variant}
              size="quantity"
              onClick={() => adjustQuantity(1)}
            >
              <IncrementIcon color="hsl(var(--icon))" size={12} />
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default QuantityInput;
