"use client";

import React, { createContext, useContext } from "react";
import {
    useGetCartQuery,
    useAddCartItemMutation,
    useUpdateCartItemMutation,
    useRemoveCartItemMutation,
    type CartResponse,
    type CartItemResponse,
} from "@/store/api";
import { Product, Size, Color } from "@/types";

interface CartContextType {
    cart: CartResponse | null;
    isLoading: boolean;
    addToCart: (product: Product, size?: Size, color?: Color, quantity?: number) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    clearCart: () => void;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { data: cart, isLoading } = useGetCartQuery(undefined, {
        pollingInterval: 0,
        refetchOnMountOrArgChange: true,
    });
    const [addItem] = useAddCartItemMutation();
    const [updateItem] = useUpdateCartItemMutation();
    const [removeItem] = useRemoveCartItemMutation();

    const addToCart = async (
        product: Product,
        size?: Size,
        color?: Color,
        quantity: number = 1
    ) => {
        try {
            await addItem({
                productId: product.id,
                quantity,
            }).unwrap();
        } catch (error) {
            console.error("Failed to add item to cart:", error);
            throw error;
        }
    };

    const removeFromCart = async (itemId: string) => {
        try {
            await removeItem(itemId).unwrap();
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
            throw error;
        }
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            await removeFromCart(itemId);
            return;
        }

        try {
            await updateItem({ id: itemId, quantity }).unwrap();
        } catch (error) {
            console.error("Failed to update cart item:", error);
            throw error;
        }
    };

    const clearCart = () => {
        // Clear all items one by one - backend doesn't have a clear endpoint exposed via routes
        if (cart?.items) {
            cart.items.forEach((item: CartItemResponse) => {
                removeFromCart(item.id);
            });
        }
    };

    const itemCount = cart?.items.reduce((sum: number, item: CartItemResponse) => sum + item.quantity, 0) || 0;

    return (
        <CartContext.Provider
            value={{
                cart: cart || null,
                isLoading,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                itemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
