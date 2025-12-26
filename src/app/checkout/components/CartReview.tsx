"use client";

import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import {
  removeProductFromCart,
  updateProductQuantity,
} from "@/store/slices/cartSlice";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface CartReviewProps {
  onNext: () => void;
}

export default function CartReview({ onNext }: CartReviewProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.cart);

  const subtotal = products.reduce(
    (sum: any, item: any) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleQuantityChange = (productId: number, newQty: number) => {
    dispatch(updateProductQuantity({ id: productId, quantity: newQty }));
  };

  const handleRemove = (productId: number) => {
    dispatch(removeProductFromCart(productId));
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {/* Products List */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-6 border-2 border-[#F28C8C]/20">
          <h2 className="text-lg sm:text-2xl font-playfair font-bold text-[#B11C5F] mb-3 sm:mb-6 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            Cart ({products.length})
          </h2>

          <div className="space-y-2 sm:space-y-4">
            {products.map((product: any, index: any) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex flex-col sm:flex-row gap-2 sm:gap-4 p-2 sm:p-4 rounded-lg border-2 border-[#F28C8C]/10 hover:border-[#F28C8C]/30 transition-all">
                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(product.id)}
                  className=" absolute top-0 right-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start sm:self-center">
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                {/* Image */}
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  {product.image &&
                  product.image !== "undefined" &&
                  product.image !== "null" &&
                  product.image.trim() !== "" ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FFF6F8] to-pink-100">
                      <ShoppingCart className="w-6 h-6 sm:w-10 sm:h-10 text-[#F28C8C]" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between gap-1">
                  <div className="min-w-0">
                    <h3 className="font-lato font-semibold text-[#B11C5F] text-xs sm:text-base truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#C59D5F] truncate">
                      {product.brand}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 bg-[#FFF6F8] rounded-lg p-0.5 border border-[#F28C8C]/30">
                      <button
                        onClick={() =>
                          handleQuantityChange(product.id, product.quantity - 1)
                        }
                        disabled={product.quantity <= 1}
                        className="p-0.5 rounded hover:bg-[#F28C8C]/10 disabled:opacity-50">
                        <Minus className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-[#B11C5F]" />
                      </button>
                      <span className="font-bold text-[#B11C5F] min-w-[20px] text-center text-xs">
                        {product.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(product.id, product.quantity + 1)
                        }
                        disabled={product.quantity >= product.stock}
                        className="p-0.5 rounded hover:bg-[#F28C8C]/10 disabled:opacity-50">
                        <Plus className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-[#B11C5F]" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-bold text-[#B11C5F]">
                        ₹{(product.price * product.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => router.push("/shop")}
            className="mt-3 sm:mt-6 w-full py-2 sm:py-3 border-2 border-[#F28C8C] text-[#B11C5F] rounded-lg sm:rounded-xl font-lato font-semibold text-xs sm:text-base hover:bg-[#FFF6F8] transition-all">
            + Add More
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-6 border-2 border-[#F28C8C]/20 sticky top-20 sm:top-24">
          <h3 className="text-base sm:text-xl font-playfair font-bold text-[#B11C5F] mb-3 sm:mb-6">
            Summary
          </h3>

          <div className="space-y-1.5 sm:space-y-3 mb-3 sm:mb-6 text-xs sm:text-sm">
            <div className="flex justify-between text-[#444444] font-lato">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#444444] font-lato">
              <span>Tax (18%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="border-t-2 border-[#F28C8C]/20 pt-1.5 sm:pt-3 flex justify-between text-sm sm:text-lg font-bold text-[#B11C5F] font-playfair">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={onNext}
            className="w-full py-2 sm:py-4 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white rounded-lg sm:rounded-xl font-lato font-bold text-xs sm:text-base hover:shadow-lg transition-all">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
