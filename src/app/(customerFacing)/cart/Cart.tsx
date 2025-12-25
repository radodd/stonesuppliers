import { useCart } from "@/src/context/CartContext";
import { FormProvider, useForm } from "react-hook-form";

import style from "@/components/scss/CartPage.module.scss";

import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import { Input } from "@/src/components/ui/input";

const Cart = () => {
  const { cartItems, setCartItems } = useCart();
  const methods = useForm();

  const updateQuantity = (index: number, newQuantity: number) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity.toString();
    setCartItems(updatedCart);
  };

  const handleIncrease = (index: number) => {
    const currentQuantity = parseInt(cartItems[index].quantity, 10);
    const newQuantity = currentQuantity + 1;
    updateQuantity(index, newQuantity);
  };

  const handleDecrease = (index: number) => {
    const currentQuantity = parseInt(cartItems[index].quantity, 10);
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      updateQuantity(index, newQuantity);
    }
  };

  const handleDelete = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };

  return (
    <FormProvider {...methods}>
      <div>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div key={index} className={style.cartItemContainer}>
              <h1>{item?.name}</h1>
              <div className="flex flex-col">
                {item?.category && (
                  <div className={style.cartItemDetail}>
                    <h3>
                      Category
                      <span className="ml-2 text-primary">
                        {item?.category}
                      </span>
                    </h3>

                    {item?.size && (
                      <h3>
                        Size
                        <span className="ml-2 text-primary">{item?.size}</span>
                      </h3>
                    )}
                  </div>
                )}

                <div className="quantity-controls">
                  <QuantityInput
                    index={index}
                    value={item?.quantity || 1}
                    handleIncrease={handleIncrease}
                    handleDecrease={handleDecrease}
                  />
                </div>
              </div>
              <Button
                variant="link"
                className="w-fit p-0 mt-2 italic"
                onClick={() => handleDelete(index)}
              >
                Delete
              </Button>
            </div>
          ))
        ) : (
          <div>
            <Image
              src="/no_items_in_cart.svg"
              alt=""
              width={400}
              height={300}
              className="w-full"
            />
          </div>
        )}
      </div>
    </FormProvider>
  );
};

const QuantityInput = ({ value, handleIncrease, handleDecrease, index }) => {
  return (
    <div className={style.quantityContainer}>
      <span>Quantity (Per Ton)</span>
      <div className="flex gap-4">
        <Button
          variant="quantityCart"
          size="quantityCart"
          onClick={() => handleDecrease(index)}
          disabled={value === 1}
        >
          -
        </Button>

        <Input readOnly type="string" value={value} className={style.input} />
        <Button
          variant="quantityCart"
          size="quantityCart"
          onClick={() => handleIncrease(index)}
        >
          +
        </Button>
      </div>
    </div>
  );
};
export default Cart;
