"use client";

import { Button } from "@heroui/react";
import React from "react";
import { useCart } from "../lib/cartStore";

export default function ButtonAddComponent({ product, productId }) {
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = () => {
    const itemToAdd = product || { productId, quantity: 1 };
    addItem(itemToAdd);
  };

  return (
    <Button
      isIconOnly
      onPress={handleAddToCart}
      aria-label="Add to cart"
      className={`size-11 rounded-full bg-lime-400 text-xl font-light text-gray-900 shadow-sm transition hover:bg-lime-300 active:scale-95`}
    >
      +
    </Button>
  );
}
