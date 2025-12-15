"use client";

import React, { useState } from "react";
import { ChevronUp, ChevronDown, Trash2, Plus, Minus } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import { removeProductFromCart, updateProductQuantity } from "@/store/slices/cartSlice";
import { useRouter } from "next/navigation";
import ClientOnly from "@/components/common/ClientOnly";

const ShopBottomCart: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { products } = useAppSelector((state) => state.cart);

  const productsTotal = products.reduce(
    (sum: any, item: any) => sum + item.price * item.quantity,
    0
  );

  if (products.length === 0) return null;

  return (
    <div className="sticky bottom-0 left-0 right-0 w-full p-2 sm:p-4 bg-gradient-to-t from-[#B11C5F]/80 via-[#F28C8C]/60 to-transparent z-30 lg:hidden">
      <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-sm border-2 border-[#F28C8C]/30 rounded-2xl shadow-2xl p-4 transition-all duration-300">
        <div className="flex justify-between items-center">
          <div className="font-lato font-bold text-[#B11C5F]">
            {products.length} {products.length === 1 ? "Product" : "Products"} Added
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/checkout")}
              className="px-6 py-2 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-lato font-semibold rounded-2xl hover:shadow-lg hover:from-[#B11C5F] hover:to-[#F28C8C] transition-all duration-300 hover:scale-105">
              Checkout
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 bg-white/80 rounded-full text-[#B11C5F] hover:bg-[#FFF6F8] hover:scale-110 transition-all duration-300 border border-[#F28C8C]/30">
              {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
          </div>
        </div>
        {isExpanded && (
          <div className="mt-4 border-t-2 border-[#F28C8C]/30 pt-4 max-h-60 overflow-y-auto">
            <ClientOnly fallback={<div className="text-[#C59D5F] font-lato">Loading...</div>}>
              {products.map((product: any) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center p-3 rounded-2xl hover:bg-[#FFF6F8] transition-all duration-300 border border-transparent hover:border-[#F28C8C]/20">
                  <div>
                    <p className="text-[#444444] font-lato font-semibold">
                      {product.name.length > 25 ? `${product.name.slice(0, 25)}...` : product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 bg-[#FFF6F8] rounded-lg p-1 border border-[#F28C8C]/30">
                        <button
                          onClick={() => dispatch(updateProductQuantity({ id: product.id, quantity: product.quantity - 1 }))}
                          className="p-1 rounded hover:bg-[#F28C8C]/10 disabled:opacity-50"
                          disabled={product.quantity <= 1}>
                          <Minus className="w-3 h-3 text-[#B11C5F]" />
                        </button>
                        <span className="text-xs font-bold text-[#B11C5F] min-w-[20px] text-center">{product.quantity}</span>
                        <button
                          onClick={() => dispatch(updateProductQuantity({ id: product.id, quantity: product.quantity + 1 }))}
                          className="p-1 rounded hover:bg-[#F28C8C]/10 disabled:opacity-50"
                          disabled={product.quantity >= (product.stock || 0)}>
                          <Plus className="w-3 h-3 text-[#B11C5F]" />
                        </button>
                      </div>
                      <span className="text-xs text-gray-500">@ ₹{product.price?.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-[#B11C5F] font-lato">
                      ₹{(product.price * product.quantity)?.toFixed(2)}
                    </p>
                    <button
                      onClick={() => dispatch(removeProductFromCart(product.id))}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-2xl hover:scale-110 transition-all duration-300">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </ClientOnly>
            {products.length > 0 && (
              <div className="mt-3 pt-3 border-t-2 border-[#F28C8C]/30 flex justify-between items-center">
                <span className="text-[#B11C5F] font-semibold font-lato">Total:</span>
                <span className="text-[#B11C5F] font-bold text-lg font-lato">₹ {productsTotal.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopBottomCart;
