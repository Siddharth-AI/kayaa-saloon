"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  fetchOrderDetail,
  fetchPaymentStatus,
  cancelOrder,
  clearOrderError,
  clearCurrentOrder,
} from "@/store/slices/orderSlice";
import {
  ArrowLeft,
  Package,
  MapPin,
  IndianRupee,
  Calendar,
  User,
  Phone,
  Mail,
  X,
} from "lucide-react";
import { toastError, toastSuccess } from "@/components/common/toastService";
import AuthGuard from "@/components/auth/AuthGuard";
import Image from "next/image";
import productImage from "@/assets/shop/product-image.png";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentOrder, paymentStatus, loading, error } = useAppSelector(
    (state) => state.orders
  );
  const { selectedLocationUuid } = useAppSelector((state) => state.services);
  const order_uuid = params.order_uuid as string;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (selectedLocationUuid && order_uuid) {
      dispatch(
        fetchOrderDetail({
          order_uuid,
          vendor_location_uuid: selectedLocationUuid,
        })
      );
      dispatch(
        fetchPaymentStatus({
          order_uuid,
          vendor_location_uuid: selectedLocationUuid,
        })
      );
    }

    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, selectedLocationUuid, order_uuid]);

  useEffect(() => {
    if (error) {
      toastError(error);
      dispatch(clearOrderError());
    }
  }, [error, dispatch]);

  const handleCancelOrder = async () => {
    if (!selectedLocationUuid) return;

    setCancelling(true);
    try {
      await dispatch(
        cancelOrder({ order_uuid, vendor_location_uuid: selectedLocationUuid })
      ).unwrap();
      toastSuccess("Order cancelled successfully");
      setShowCancelModal(false);
      router.push("/orders");
    } catch (err: any) {
      setShowCancelModal(false);
      toastError(err || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "is_paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && !currentOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fefaf4] to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F28C8C]"></div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fefaf4] to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-playfair font-bold text-[#B11C5F] mb-4">
            Order Not Found
          </h2>
          <button
            onClick={() => router.push("/orders")}
            className="px-6 py-3 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white rounded-full font-lato font-semibold">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-[#fefaf4] to-pink-50 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-6 text-[#B11C5F] hover:text-[#F28C8C] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-lato font-semibold">Back to Orders</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-playfair font-bold text-[#B11C5F] mb-2">
                Order #{currentOrder.po_number}
              </h1>
              <p className="text-gray-600 font-lato">
                Ref: {currentOrder.ref_no}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                  currentOrder.order_status
                )}`}>
                {(currentOrder.order_status || "unknown").toUpperCase()}
              </span>
              {paymentStatus && (
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getPaymentStatusColor(
                    paymentStatus
                  )}`}>
                  {paymentStatus === "is_paid"
                    ? "PAID"
                    : (paymentStatus || "unknown").toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="font-playfair font-bold text-2xl text-[#B11C5F] mb-6">
                  Order Items
                </h2>
                <div className="space-y-4">
                  {currentOrder.sales_order_items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-gradient-to-r from-[#fefaf4] to-pink-50 rounded-xl">
                      <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={productImage}
                          alt={item.product?.name || "Product"}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-playfair font-bold text-lg text-[#B11C5F] mb-1">
                          {item.product?.name || "N/A"}
                        </h3>
                        <p className="text-sm text-gray-600 font-lato mb-2">
                          {item.product?.product_cat_subcategory?.name || "N/A"}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600 font-lato">
                            Qty: {item.order_qty}
                          </span>
                          <span className="text-gray-600 font-lato">
                            ₹{item.sell_price} each
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 font-playfair font-bold text-xl text-[#B11C5F]">
                          <IndianRupee className="w-5 h-5" />
                          <span>{item.total}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-[#F28C8C]" />
                    <h3 className="font-playfair font-bold text-xl text-[#B11C5F]">
                      Billing Address
                    </h3>
                  </div>
                  <p className="text-gray-700 font-lato leading-relaxed">
                    {currentOrder.billing_address?.street_address || "N/A"}
                    <br />
                    {currentOrder.billing_address?.city},{" "}
                    {currentOrder.billing_address?.state}
                    <br />
                    {currentOrder.billing_address?.pincode}
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-[#F28C8C]" />
                    <h3 className="font-playfair font-bold text-xl text-[#B11C5F]">
                      Shipping Address
                    </h3>
                  </div>
                  <p className="text-gray-700 font-lato leading-relaxed">
                    {currentOrder.shipping_address?.street_address || "N/A"}
                    <br />
                    {currentOrder.shipping_address?.city},{" "}
                    {currentOrder.shipping_address?.state}
                    <br />
                    {currentOrder.shipping_address?.pincode}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-playfair font-bold text-xl text-[#B11C5F] mb-6">
                  Order Summary
                </h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700 font-lato">
                    <span>Subtotal ({currentOrder.total_qty} items)</span>
                    <span>₹{currentOrder.total}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 font-lato">
                    <span>Tax</span>
                    <span>₹0</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between font-playfair font-bold text-xl text-[#B11C5F]">
                    <span>Total</span>
                    <span>₹{currentOrder.total}</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="font-lato">
                      Ordered:{" "}
                      {new Date(currentOrder.po_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="w-4 h-4" />
                    <span className="font-lato capitalize">
                      {(currentOrder.order_type || "unknown").replace("-", " ")}
                    </span>
                  </div>
                </div>
              </div>

              {currentOrder.user && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-playfair font-bold text-xl text-[#B11C5F] mb-4">
                    Customer Info
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4 text-[#F28C8C]" />
                      <span className="font-lato">
                        {currentOrder.user.user_histories?.[0]?.fname}{" "}
                        {currentOrder.user.user_histories?.[0]?.lname}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-[#F28C8C]" />
                      <span className="font-lato">
                        {currentOrder.user.user_histories?.[0]?.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-[#F28C8C]" />
                      <span className="font-lato">
                        {currentOrder.user.user_histories?.[0]?.mobile}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {currentOrder.order_status?.toLowerCase() === "open" && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full px-6 py-3 bg-red-500 text-white rounded-full font-lato font-semibold hover:bg-red-600 transition-all duration-300">
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>

        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-playfair font-bold text-2xl text-[#B11C5F]">
                  Cancel Order?
                </h3>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-700 font-lato mb-6">
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-lato font-semibold hover:bg-gray-300 transition-all duration-300">
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-full font-lato font-semibold hover:bg-red-600 transition-all duration-300 disabled:opacity-50">
                  {cancelling ? "Cancelling..." : "Yes, Cancel"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
