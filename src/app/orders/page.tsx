"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchOrders, clearOrderError } from "@/store/slices/orderSlice";
import { Package, Calendar, IndianRupee, ChevronRight, ShoppingBag } from "lucide-react";
import { toastError } from "@/components/common/toastService";
import AuthGuard from "@/components/auth/AuthGuard";

export default function OrdersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orders, loading, error, totalCount } = useAppSelector((state) => state.orders);
  const { selectedLocationUuid } = useAppSelector((state) => state.services);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (selectedLocationUuid) {
      dispatch(fetchOrders({
        vendor_location_uuid: selectedLocationUuid,
        limit: 10,
        page: currentPage,
      }));
    }
  }, [dispatch, selectedLocationUuid, currentPage]);

  useEffect(() => {
    if (error) {
      toastError(error);
      dispatch(clearOrderError());
    }
  }, [error, dispatch]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderTypeLabel = (type: string) => {
    return type === 'online-delivery' ? 'Delivery' : 'Pickup';
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-[#fefaf4] to-pink-50 pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-[#B11C5F] mb-1 sm:mb-2">
              My Orders
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-lato">
              Track and manage your product orders
            </p>
          </div>

          {/* Loading State */}
          {loading && orders.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F28C8C]"></div>
            </div>
          ) : orders.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-[#B11C5F]" />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-[#B11C5F] mb-3">
                No Orders Yet
              </h3>
              <p className="text-gray-600 font-lato mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <button
                onClick={() => router.push('/shop')}
                className="px-8 py-3 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white rounded-full font-lato font-semibold hover:shadow-lg transition-all duration-300">
                Start Shopping
              </button>
            </div>
          ) : (
            /* Orders List */
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div
                  key={order.uuid}
                  onClick={() => router.push(`/orders/${order.uuid}`)}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-[#B11C5F]" />
                        </div>
                        <div>
                          <h3 className="font-playfair font-bold text-lg text-[#B11C5F]">
                            Order #{order.po_number}
                          </h3>
                          <p className="text-sm text-gray-500 font-lato">
                            Ref: {order.ref_no}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="font-lato">
                            {new Date(order.po_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Package className="w-4 h-4" />
                          <span className="font-lato">
                            {order.total_qty} {order.total_qty === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.order_status)}`}>
                          {order.order_status.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                          {getOrderTypeLabel(order.order_type)}
                        </span>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500 font-lato mb-1">Total Amount</p>
                        <div className="flex items-center gap-1 font-playfair font-bold text-2xl text-[#B11C5F]">
                          <IndianRupee className="w-5 h-5" />
                          <span>{order.total}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-[#C59D5F] group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {order.remark && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 font-lato">
                        <span className="font-semibold">Note:</span> {order.remark}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalCount > 10 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <span className="px-4 py-2 bg-white rounded-lg shadow-md font-lato">
                Page {currentPage} of {Math.ceil(totalCount / 10)}
              </span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage >= Math.ceil(totalCount / 10)}
                className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
