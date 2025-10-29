"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import ClientOnly from "../common/ClientOnly";
import {
  removeProductFromCart,
  updateProductQuantity,
} from "@/store/slices/cartSlice";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";

interface ProductsCartProps {
  content?: string;
}

const ProductsCart: React.FC<ProductsCartProps> = ({ content }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get products cart data
  const { products } = useAppSelector((state) => state.cart);

  // Calculate products total
  const productsTotal = products.reduce(
    (sum: any, item: any) => sum + item.price * item.quantity,
    0
  );

  // Handle remove and quantity update
  const handleRemoveProduct = (productId: number) => {
    dispatch(removeProductFromCart(productId));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    dispatch(updateProductQuantity({ id: productId, quantity }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden  lg:h-fit lg:sticky lg:top-4">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-[#B11C5F] to-[#F28C8C] text-white p-4">
        {content === "summary" ? (
          <h2 className="text-xl font-bold font-lato">Products Summary</h2>
        ) : (
          <h2 className="font-playfair font-bold  text-xl">
            Product Cart ({products.length})
          </h2>
        )}
      </div>

      {/* Products Header */}
      {/* <div className="bg-[#F28C8C] text-white py-3 px-4">
        <div className="flex items-center justify-center gap-2 font-lato font-semibold text-sm">
          <ShoppingBag className="w-4 h-4" />
          Products ({products.length})
        </div>
      </div> */}

      {/* Products Content - Horizontal Scroll on Mobile, Vertical on Desktop */}
      <ClientOnly
        fallback={
          <div className="p-4 text-center text-gray-500">Loading cart...</div>
        }>
        {/* Mobile: Horizontal Scroll */}
        <div className="lg:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          <div className="flex gap-4 p-4">
            {products.length === 0 ? (
              <div className="min-w-full text-center py-8">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-[#F28C8C] opacity-50" />
                <p className="text-[#B11C5F] font-semibold mb-1">
                  No products in cart
                </p>
                <p className="text-gray-500 text-sm">Add products from shop</p>
              </div>
            ) : (
              products.map((product: any) => (
                <div
                  key={product.id}
                  className="min-w-[280px] snap-start bg-white border-2 border-[#F28C8C] rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                  <div className="flex flex-col gap-3 h-full">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#B11C5F] font-lato mb-1">
                        {product.name.length > 30
                          ? `${product.name.slice(0, 30)}...`
                          : product.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-3">
                        {product.brand}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-[#FFF6F8] rounded-lg p-1 border border-[#F28C8C]/30">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                product.id,
                                product.quantity - 1
                              )
                            }
                            className="p-1 rounded-full hover:bg-[#F28C8C]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={product.quantity <= 1}
                            aria-label="Decrease quantity">
                            <Minus className="w-3 h-3 text-[#B11C5F]" />
                          </button>
                          <span className="text-sm font-bold text-[#B11C5F] min-w-[24px] text-center font-lato">
                            {product.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                product.id,
                                product.quantity + 1
                              )
                            }
                            className="p-1 rounded-full hover:bg-[#F28C8C]/10 transition-colors"
                            aria-label="Increase quantity">
                            <Plus className="w-3 h-3 text-[#B11C5F]" />
                          </button>
                        </div>
                        <span className="text-xs text-gray-500">
                          @ ₹{product.price?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#F28C8C]/20">
                      <span className="text-[#B11C5F] font-bold font-lato text-lg">
                        ₹ {(product.price * product.quantity)?.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveProduct(product.id)}
                        className="p-2 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                        aria-label="Remove product">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Desktop: Vertical List */}
        <div className="hidden lg:block max-h-[400px] overflow-y-auto categories_scroll">
          {products.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-[#F28C8C] opacity-50" />
              <p className="text-[#B11C5F] font-semibold mb-1">
                No products in cart
              </p>
              <p className="text-gray-500 text-sm">Add products from shop</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F28C8C]/20">
              {products.map((product: any) => (
                <div
                  key={product.id}
                  className="p-4 hover:bg-[#FFF6F8] transition-colors duration-200">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#B11C5F] font-lato truncate">
                        {product.name.length > 25
                          ? `${product.name.slice(0, 25)}...`
                          : product.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {product.brand}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-2 bg-[#FFF6F8] rounded-lg p-1 border border-[#F28C8C]/30">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                product.id,
                                product.quantity - 1
                              )
                            }
                            className="p-1 rounded-full hover:bg-[#F28C8C]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={product.quantity <= 1}
                            aria-label="Decrease quantity">
                            <Minus className="w-3 h-3 text-[#B11C5F]" />
                          </button>
                          <span className="text-sm font-bold text-[#B11C5F] min-w-[20px] text-center font-lato">
                            {product.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                product.id,
                                product.quantity + 1
                              )
                            }
                            className="p-1 rounded-full hover:bg-[#F28C8C]/10 transition-colors"
                            aria-label="Increase quantity">
                            <Plus className="w-3 h-3 text-[#B11C5F]" />
                          </button>
                        </div>
                        <span className="text-xs text-gray-500">
                          Qty: {product.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[#B11C5F] font-bold font-lato whitespace-nowrap">
                        ₹ {(product.price * product.quantity)?.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500">
                        @ ₹{product.price?.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveProduct(product.id)}
                        className="p-1.5 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                        aria-label="Remove product">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ClientOnly>

      {/* Total Section */}
      {products.length > 0 && (
        <div className="border-t-2 border-[#F28C8C] bg-[#FFF6F8] p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[#B11C5F] font-semibold font-lato">
              Subtotal
            </span>
            <span className="text-[#B11C5F] font-bold text-lg font-lato">
              ₹ {productsTotal.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4 space-y-3">
        {/* {!content && (
          <button
            onClick={() => router.push("/checkout")}
            className="w-full py-3 bg-white border-2 border-[#F28C8C] text-[#B11C5F] rounded-lg hover:bg-[#FFF6F8] transition-all duration-300 font-semibold font-lato flex items-center justify-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Checkout Product
          </button>
        )} */}

        {!content && (
          <button
            onClick={() => router.push("/checkout")}
            className="w-full relative overflow-hidden py-3 bg-gradient-to-r from-[#B11C5F] to-[#F28C8C] text-white rounded-lg hover:shadow-lg transition-all duration-300 font-bold font-lato">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></span>
            Checkout Products
          </button>
        )}
      </div>

      {/* Add scrollbar-hide CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProductsCart;
