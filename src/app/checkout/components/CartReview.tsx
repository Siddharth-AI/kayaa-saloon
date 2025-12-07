"use client";

import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import { removeProductFromCart, updateProductQuantity } from "@/store/slices/cartSlice";
import { Plus, Minus, Trash2, ShoppingCart, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface CartReviewProps {
  onNext: () => void;
}

export default function CartReview({ onNext }: CartReviewProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.cart);

  const subtotal = products.reduce((sum: any, item: any) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  const handleQuantityChange = (productId: number, newQty: number) => {
    dispatch(updateProductQuantity({ id: productId, quantity: newQty }));
  };

  const handleRemove = (productId: number) => {
    dispatch(removeProductFromCart(productId));
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Products List */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#F28C8C]/20">
          <h2 className="text-2xl font-playfair font-bold text-[#B11C5F] mb-6 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Your Cart ({products.length} items)
          </h2>

          <div className="space-y-4">
            {products.map((product: any, index: any) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4 rounded-xl border-2 border-[#F28C8C]/10 hover:border-[#F28C8C]/30 transition-all">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  {product.image ? (
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
                      <ShoppingCart className="w-10 h-10 text-[#F28C8C]" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-lato font-semibold text-[#B11C5F] mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#C59D5F] mb-2">{product.brand}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-[#FFF6F8] rounded-lg p-1 border border-[#F28C8C]/30">
                      <button
                        onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                        disabled={product.quantity <= 1}
                        className="p-1 rounded hover:bg-[#F28C8C]/10 disabled:opacity-50">
                        <Minus className="w-4 h-4 text-[#B11C5F]" />
                      </button>
                      <span className="font-bold text-[#B11C5F] min-w-[24px] text-center">
                        {product.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                        disabled={product.quantity >= product.stock}
                        className="p-1 rounded hover:bg-[#F28C8C]/10 disabled:opacity-50">
                        <Plus className="w-4 h-4 text-[#B11C5F]" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      ₹{product.price} × {product.quantity}
                    </p>
                    <p className="text-lg font-bold text-[#B11C5F] flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      {(product.price * product.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => router.push("/shop")}
            className="mt-6 w-full py-3 border-2 border-[#F28C8C] text-[#B11C5F] rounded-xl font-lato font-semibold hover:bg-[#FFF6F8] transition-all">
            + Add More Products
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#F28C8C]/20 sticky top-24">
          <h3 className="text-xl font-playfair font-bold text-[#B11C5F] mb-6">
            Order Summary
          </h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-[#444444] font-lato">
              <span>Subtotal</span>
              <span className="flex items-center">
                <IndianRupee className="w-4 h-4" />
                {subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-[#444444] font-lato">
              <span>Tax (18% GST)</span>
              <span className="flex items-center">
                <IndianRupee className="w-4 h-4" />
                {tax.toFixed(2)}
              </span>
            </div>
            <div className="border-t-2 border-[#F28C8C]/20 pt-3 flex justify-between text-lg font-bold text-[#B11C5F] font-playfair">
              <span>Total</span>
              <span className="flex items-center">
                <IndianRupee className="w-5 h-5" />
                {total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={onNext}
            className="w-full py-4 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white rounded-xl font-lato font-bold hover:shadow-lg transition-all">
            Continue to Address
          </button>
        </div>
      </div>
    </div>
  );
}
