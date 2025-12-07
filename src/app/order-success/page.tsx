"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import { clearCurrentOrder } from "@/store/slices/orderSlice";
import { motion } from "framer-motion";
import { CheckCircle, Package, Home, ShoppingBag } from "lucide-react";

export default function OrderSuccessPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [showConfetti, setShowConfetti] = useState(true);
  
  // Get order data from Redux persist
  const orderData = useAppSelector((state) => state.orders.currentOrder);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }
    
    setTimeout(() => setShowConfetti(false), 5000);
    
    // Clear order details after 5 minutes
    const clearTimer = setTimeout(() => {
      dispatch(clearCurrentOrder());
    }, 300000);
    
    return () => clearTimeout(clearTimer);
  }, [orderId, router, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF6F8] to-pink-50 flex items-center justify-center py-12 px-4 pt-28">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 1 }}
              animate={{ y: window.innerHeight + 100, rotate: 360 }}
              transition={{ duration: 3 + Math.random() * 2, delay: Math.random() * 0.5 }}
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: ["#F28C8C", "#C59D5F", "#B11C5F"][i % 3] }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-[#F28C8C]/20">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-[#B11C5F] mb-4">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-lg text-[#C59D5F] font-lato mb-2">
            Thank you for your purchase!
          </p>
          <p className="text-gray-600 font-lato">
            Your order has been confirmed and will be processed shortly.
          </p>
        </motion.div>

        {orderId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-[#FFF6F8] rounded-2xl p-6 mb-8 border-2 border-[#F28C8C]/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 font-lato mb-1">Order ID</p>
                <p className="text-xl font-bold text-[#B11C5F] font-mono">{orderId}</p>
              </div>
              <Package className="w-12 h-12 text-[#F28C8C]" />
            </div>
            {orderData && (
              <div className="border-t-2 border-[#F28C8C]/20 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-lato">Items:</span>
                  <span className="font-semibold text-[#B11C5F]">{orderData.sales_order_items?.length || 0} products</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-lato">Delivery Type:</span>
                  <span className="font-semibold text-[#B11C5F] capitalize">{orderData.order_type?.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-[#B11C5F] font-playfair">Total:</span>
                  <span className="text-[#C59D5F] font-playfair">₹{orderData.total?.toFixed(2)}</span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8">
          <h3 className="text-xl font-playfair font-bold text-[#B11C5F] mb-4">
            What's Next?
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-lato font-semibold text-[#B11C5F]">Order Confirmation</p>
                <p className="text-sm text-gray-600">
                  You'll receive an email confirmation shortly
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-lato font-semibold text-[#B11C5F]">Processing</p>
                <p className="text-sm text-gray-600">
                  We're preparing your order for shipment
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-lato font-semibold text-[#B11C5F]">Delivery</p>
                <p className="text-sm text-gray-600">
                  Track your order status in your account
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push("/shop")}
            className="flex-1 py-4 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white rounded-xl font-lato font-bold hover:shadow-lg transition-all">
            Continue Shopping
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex-1 py-4 border-2 border-[#F28C8C] text-[#B11C5F] rounded-xl font-lato font-semibold hover:bg-[#FFF6F8] transition-all flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
