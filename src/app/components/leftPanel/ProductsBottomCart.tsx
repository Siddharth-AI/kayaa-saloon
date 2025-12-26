// components/leftPanel/ProductsBottomCart.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  removeProductFromCart,
  updateProductQuantity,
} from "@/store/slices/cartSlice";
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  ShoppingBag,
  Plus,
  Minus,
  X,
  Package,
  MapPin,
} from "lucide-react";
import { IoCart } from "react-icons/io5";

const ProductsBottomCart = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState(false);

  // Get cart data from Redux
  const { products } = useAppSelector((state) => state.cart);
  const { selectedLocationByName } = useAppSelector((state) => state.services);

  // Reset expanded state when cart becomes empty
  useEffect(() => {
    if (products.length === 0) {
      setIsExpanded(false);
    }
  }, [products.length]);

  // Handle remove product
  const handleRemoveProduct = (productId: number) => {
    dispatch(removeProductFromCart(productId));
  };

  // Handle quantity update
  const handleUpdateQuantity = (productId: number, quantity: number) => {
    dispatch(updateProductQuantity({ id: productId, quantity }));
  };

  // Navigate to checkout
  const handleProceedToCheckout = () => {
    if (products.length === 0) return;
    router.push("/checkout");
  };

  // If cart is empty, don't show anything
  if (products.length === 0) return null;

  return (
    <>
      {/* Bottom Fixed Cart */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t-2 border-pink-400 shadow-2xl z-40 transition-all duration-300 ${
          isExpanded ? "h-[70vh]" : "h-16"
        }`}>
        {/* Collapsed View - Summary Bar */}
        <div
          className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}>
          {/* Left Side - Cart Icon & Count */}
          <div className="flex items-center gap-3 justify-between">
            {/* Location Info */}
            {selectedLocationByName && (
              <div className="flex items-center gap-1 px-4 py-2">
                <MapPin width={22} className=" text-pink-500" />
                <p className="text-[18px] text-gray-700">
                  <span className="font-bold">{selectedLocationByName}</span>
                </p>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="relative">
                <IoCart className="text-3xl text-pink-500" id="cart-icon" />
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {products.length}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Checkout Button & Expand/Collapse */}
          <div className="flex items-center gap-2">
            {/* Desktop Checkout Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleProceedToCheckout();
              }}
              className="hidden md:flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold">
              <ShoppingBag className="w-4 h-4" />
              Checkout
            </button>

            {/* Mobile Checkout Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleProceedToCheckout();
              }}
              className="md:hidden px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg text-sm font-semibold">
              Checkout
            </button>

            {/* Expand/Collapse Icon */}
            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-gray-700" />
              ) : (
                <ChevronUp className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded View - Products List */}
        {isExpanded && (
          <div className="h-[calc(100%-5rem)] overflow-hidden flex flex-col">
            {/* Products List */}
            <div className="flex-1 overflow-y-auto px-4 py-1 space-y-3">
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <IoCart className="text-6xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    No products in cart
                  </p>
                  <p className="text-sm text-gray-400">
                    Add products from shop
                  </p>
                </div>
              ) : (
                products.map((product: any) => (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                      {/* Product Info */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">
                          {product.name.length > 30
                            ? `${product.name.slice(0, 30)}...`
                            : product.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          {product.brand}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  product.id,
                                  product.quantity - 1
                                )
                              }
                              className="p-1 rounded-full hover:bg-pink-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              disabled={product.quantity <= 1}
                              aria-label="Decrease quantity">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-semibold text-sm min-w-[20px] text-center">
                              {product.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  product.id,
                                  product.quantity + 1
                                )
                              }
                              className="p-1 rounded-full hover:bg-pink-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={
                                product.quantity >= (product.stock || 0)
                              }
                              aria-label="Increase quantity">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex flex-col text-xs">
                            <span className="text-gray-500">
                              @ ₹{product.price?.toFixed(2)}
                            </span>
                            <span className="font-semibold text-pink-600">
                              ₹{(product.price * product.quantity)?.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Stock Info */}
                        <p className="text-xs text-gray-500 mt-2">
                          Stock: {product.quantity}/{product.stock || 0}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveProduct(product.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        title="Remove product">
                        <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Spacer to prevent content from being hidden behind fixed cart */}
      <div className="h-20" />
    </>
  );
};

export default ProductsBottomCart;
