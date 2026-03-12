import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductCardProps } from "../../../app/(customerFacing)/materials/[slug]/page";
import ShoppingCartIcon from "../../icons/ShoppingCartIcon";
import QuantityInput from "../../QuantityInput";
import { useEffect, useState } from "react";
import styles from "../../scss/MaterialDetailForm.module.scss";
import { toast } from "../../ui/use-toast";
import { useCart } from "../../../context/CartContext";

interface FormProps {
  product: ProductCardProps;
}

const formSchema = z.object({
  // id: z.string(),
  name: z.string(),
  image: z.string().nullable(),
  category: z.string({
    required_error: "Please select one of the available categories.",
  }),
  size: z.string({
    required_error: "Please select one of the available sizes.",
  }),
  quantity: z.string().refine((val) => Number(val) > 0, {
    message: "Quantity must be greater than zero.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function MaterialDetailForm({ product }: FormProps) {
  const [success, setSuccess] = useState(false);
  const { addToCart } = useCart();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // id: product.id,
      name: product.name,
      image: product.imagePrimary,
      category: "",
      size: "",
      quantity: "1",
    },
    mode: "onSubmit",
  });

  // Handle form submission logic
  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const formDataJSON = {
      // id: values.id,
      name: values.name,
      image: values.image,
      category: values.category,
      size: values.size,
      quantity: values.quantity,
    };
    addToCart(formDataJSON);
    setSuccess(true);
  };

  // Handle success state and form reset
  useEffect(() => {
    if (success) {
      toast({
        // open: true,
        title: "Added to Cart",
        description:
          "Please view your cart to see all materials. Once submitted, someone from our team will email you a quote within 24 hours.",
        src: "/shopping_cart_toast.svg",
      });

      // Reset form after successful submission
      form.reset({
        name: product.name,
        image: product.imagePrimary,
        category: "",
        size: "",
        quantity: "1",
      });

      setSuccess(false);
    }
  }, [success, form, product]);

  const handleQuantityChange = (newQuantity: string) => {
    form.setValue("quantity", newQuantity);
  };

  const handleCategoryChange = (category: string) => {
    form.setValue("category", category);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
        {product.company[0] !== "Stoneyard" && (
          <>
            <CategorySelect
              product={product}
              form={form}
              onCategoryChange={handleCategoryChange}
            />
            <SizeSelect product={product} form={form} />
          </>
        )}
        <QuantityInput
          onQuantityChange={handleQuantityChange}
          control={form.control}
          variant="quantity"
        />
        <Button type="submit" className={styles.submitButton}>
          <ShoppingCartIcon color="hsl(var(--white-base))" size={22} />
          Request to Quote
        </Button>
      </form>
    </Form>
  );
}

interface SelectProps {
  product: ProductCardProps;
  form: ReturnType<typeof useForm<FormValues>>;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

// Category Select Component
const CategorySelect = ({ product, form, onCategoryChange }: SelectProps) => {
  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel className={styles.FormLabel}>Category:</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              onCategoryChange(value);
            }}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger className={styles.SelectTrigger}>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {product.categories?.map((cat) => (
                <SelectItem
                  key={cat.name}
                  value={cat.name}
                  className={styles.FormItem}
                >
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

// Size Select Component
const SizeSelect = ({ product, form }: SelectProps) => {
  const selectedCategorySizes = product.categories.find(
    (category) => category.name === form.watch("category"),
  )?.sizes;

  return (
    <FormField
      control={form.control}
      name="size"
      render={({ field }) => (
        <FormItem>
          <FormLabel className={styles.FormLabel}>Size:</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={!form.watch("category")}
          >
            <FormControl>
              <SelectTrigger className={styles.SelectTrigger}>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {selectedCategorySizes?.map((sz) => (
                <SelectItem key={sz} value={sz}>
                  {sz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};
