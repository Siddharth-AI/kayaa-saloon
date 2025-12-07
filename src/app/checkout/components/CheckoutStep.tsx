"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { createOrder } from "@/store/slices/orderSlice";
import { clearProducts } from "@/store/slices/cartSlice";
import { getPaymentCards, setSelectedCard } from "@/store/slices/paymentSlice";
import { ArrowLeft, Check, Loader2, IndianRupee, Package, Truck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toastSuccess, toastError } from "@/components/common/toastService";
import PaymentFormModal from "@/components/payment/PaymentFormModal";

interface CheckoutStepProps {
  onBack: () => void;
}

export default function CheckoutStep({ onBack }: CheckoutStepProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { products } = useAppSelector((state) => state.cart);
  const { selectedLocationUuid } = useAppSelector((state) => state.services);
  const { selectedBillingId, selectedShippingId, billingAddresses, shippingAddresses } = useAppSelector((state) => state.address);
  const { loading } = useAppSelector((state) => state.orders);
  const { paymentCards, selectedCardId } = useAppSelector((state) => state.payment);

  const [orderType, setOrderType] = useState<"online-delivery" | "online-pickup">("online-delivery");
  const [remark, setRemark] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedLocationUuid) {
      dispatch(getPaymentCards({ merchant_uuid: selectedLocationUuid }));
    }
  }, [selectedLocationUuid, dispatch]);

  const subtotal = products.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;
  const totalQty = products.reduce((sum: number, item: any) => sum + item.quantity, 0);

  const billingAddress = billingAddresses.find((a: any) => a.id === selectedBillingId);
  const shippingAddress = shippingAddresses.find((a: any) => a.id === selectedShippingId);

  const handlePlaceOrder = async () => {
    if (!selectedCardId) {
      toastError("Please select a payment method");
      return;
    }

    if (!selectedLocationUuid || !selectedBillingId || !selectedShippingId) {
      toastError("Missing required information");
      return;
    }

    const poDate = new Date().toISOString().split("T")[0];

    const orderPayload = {
      vendor_location_uuid: selectedLocationUuid,
      order_type: orderType,
      sales_order_date: poDate,
      billing_address_id: selectedBillingId,
      shipping_address_id: selectedShippingId,
      products: products.map((p: any) => ({
        product_id: p.id,
        ord_qty: p.quantity,
      })),
      remark: remark || undefined,
    };

    setOrderError(null);
    
    try {
      const result = await dispatch(createOrder(orderPayload)).unwrap();
      
      console.log('Order API Response:', result);
      
      // Check if order was actually successful
      if (!result || (result.status === false)) {
        throw new Error(result?.message || 'Order creation failed');
      }
      
      // Extract order ID from response (handle different response structures)
      const orderId = result?.order_uuid || result?.data?.order_uuid || result?.id || result?.ref_no || 'unknown';
      
      // Order created successfully - data is already in Redux state via createOrder.fulfilled
      
      toastSuccess("Order placed successfully!");
      dispatch(clearProducts());
      router.push(`/order-success?orderId=${orderId}`);
    } catch (error: any) {
      console.error('Order creation failed:', error);
      const errorMessage = typeof error === 'string' ? error : error?.message || "Failed to place order. Please try again.";
      setOrderError(errorMessage);
      toastError(errorMessage);
      // Don't redirect, stay on checkout page
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Type */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#F28C8C]/20">
            <h3 className="text-xl font-playfair font-bold text-[#B11C5F] mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Delivery Method
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setOrderType("online-delivery")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  orderType === "online-delivery"
                    ? "border-[#F28C8C] bg-[#FFF6F8]"
                    : "border-gray-200 hover:border-[#F28C8C]/50"
                }`}>
                <Truck className="w-6 h-6 mx-auto mb-2 text-[#B11C5F]" />
                <p className="font-lato font-semibold text-[#B11C5F]">Home Delivery</p>
              </button>
              <button
                onClick={() => setOrderType("online-pickup")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  orderType === "online-pickup"
                    ? "border-[#F28C8C] bg-[#FFF6F8]"
                    : "border-gray-200 hover:border-[#F28C8C]/50"
                }`}>
                <Package className="w-6 h-6 mx-auto mb-2 text-[#B11C5F]" />
                <p className="font-lato font-semibold text-[#B11C5F]">Store Pickup</p>
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#F28C8C]/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-playfair font-bold text-[#B11C5F]">
                Payment Method
              </h3>
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white rounded-lg font-lato font-semibold text-sm">
                Add Card
              </button>
            </div>

            {paymentCards.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No payment methods found</p>
                <p className="text-sm">Please add a card to continue</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentCards.map((card: any) => (
                  <div
                    key={card.id}
                    onClick={() => dispatch(setSelectedCard(card.id))}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedCardId === card.id
                        ? "border-[#F28C8C] bg-[#FFF6F8]"
                        : "border-gray-200 hover:border-[#F28C8C]/50"
                    }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-lato font-semibold text-[#B11C5F]">
                          {card.card_type}
                        </p>
                        <p className="text-sm text-gray-600 font-mono">
                          {card.card_number}
                        </p>
                        <p className="text-xs text-gray-500">
                          Expires: {card.card_expiry}
                        </p>
                      </div>
                      {selectedCardId === card.id && (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Remark */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#F28C8C]/20">
            <h3 className="text-xl font-playfair font-bold text-[#B11C5F] mb-4">
              Order Notes (Optional)
            </h3>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Any special instructions for your order..."
              className="w-full px-4 py-3 rounded-xl border-2 border-[#F28C8C]/30 focus:border-[#B11C5F] outline-none resize-none"
              rows={4}
            />
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#F28C8C]/20 sticky top-24">
            <h3 className="text-xl font-playfair font-bold text-[#B11C5F] mb-6">
              Order Summary
            </h3>

            {/* Addresses */}
            <div className="space-y-4 mb-6 pb-6 border-b-2 border-[#F28C8C]/20">
              <div>
                <p className="text-sm font-lato font-semibold text-[#B11C5F] mb-1">
                  Billing Address:
                </p>
                <p className="text-sm text-gray-600">
                  {billingAddress?.street_address}, {billingAddress?.city}
                </p>
              </div>
              <div>
                <p className="text-sm font-lato font-semibold text-[#B11C5F] mb-1">
                  Shipping Address:
                </p>
                <p className="text-sm text-gray-600">
                  {shippingAddress?.street_address}, {shippingAddress?.city}
                </p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-[#444444] font-lato">
                <span>Subtotal ({totalQty} items)</span>
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

            {/* Error Message */}
            {orderError && (
              <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-700 mb-1">Order Failed</p>
                  <p className="text-sm text-red-600">{String(orderError)}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handlePlaceOrder}
                disabled={loading || !selectedCardId}
                className="w-full py-4 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white rounded-xl font-lato font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
              <button
                onClick={onBack}
                disabled={loading}
                className="w-full py-3 border-2 border-[#F28C8C] text-[#B11C5F] rounded-xl font-lato font-semibold hover:bg-[#FFF6F8] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <ArrowLeft className="w-5 h-5" />
                Back to Address
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedLocationUuid && (
        <PaymentFormModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          merchantUuid={selectedLocationUuid}
        />
      )}
    </div>
  );
}
