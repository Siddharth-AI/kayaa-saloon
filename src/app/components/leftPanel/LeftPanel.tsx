"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import ClientOnly from "../common/ClientOnly";
import {
  removeFromCart,
  removeServiceFromCart,
  removeProductFromCart,
  updateProductQuantity,
} from "@/store/slices/cartSlice";
import { ShoppingBag, Calendar, Plus, Minus, Trash2 } from "lucide-react";
import { useState } from "react";

interface LeftPanelProps {
  content?: string;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ content }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"services" | "products">(
    "services"
  );

  const { selectedLocationByName } = useAppSelector((state) => state.services);
  // Get all cart data
  const { services, products, items } = useAppSelector((state) => state.cart);
  const { selectedDate } = useAppSelector((state) => state.ui);

  const dateObj =
    typeof selectedDate === "string" ? new Date(selectedDate) : selectedDate;

  // Calculate totals
  const servicesTotal = services.reduce(
    (sum: any, item: any) => sum + item.price,
    0
  );
  const productsTotal = products.reduce(
    (sum: any, item: any) => sum + item.price * item.quantity,
    0
  );
  const oldItemsTotal = items.reduce(
    (sum: any, item: any) => sum + item.price,
    0
  );
  const grandTotal = servicesTotal + productsTotal + oldItemsTotal;

  // Handle remove functions
  const handleRemoveService = (index: number) => {
    dispatch(removeServiceFromCart(index));
  };

  const handleRemoveProduct = (productId: number) => {
    dispatch(removeProductFromCart(productId));
  };

  const handleRemoveOldItem = (index: number) => {
    dispatch(removeFromCart(index));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    dispatch(updateProductQuantity({ id: productId, quantity }));
  };

  return (
    <div
      className={`${
        content === "summary"
          ? "gap-3"
          : "md:shadow-xl md:rounded-3xl gap-2 md:gap-6 md:p-6 bg-gradient-to-br from-white to-[#FFF6F8] md:border md:border-[#F28C8C]/20"
      } flex flex-col relative`}
      style={{ backdropFilter: "blur(12px)" }}>
      {/* Card Header */}
      {content === "summary" ? (
        <h2 className="font-playfair font-bold mb-4 text-[#B11C5F] text-2xl">
          Summary
        </h2>
      ) : (
        <div className="hidden md:block">
          <div className="flex items-center gap-6 relative">
            <div className="">
              <h2 className="font-playfair font-bold text-2xl mb-2 text-[#B11C5F]">
                Kaya Beauty Salon
              </h2>
              <div className="flex flex-col text-[#C59D5F]">
                <div className="flex items-center gap-2 mb-1">
                  <ClientOnly>
                    <div className="w-5 h-5 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </ClientOnly>
                  <span className="font-lato">{selectedLocationByName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={`${
          content === "summary" ? "max-h-[590]" : "max-h-[590]"
        } bg-white/80 backdrop-blur-sm shadow-lg border border-[#F28C8C]/30 rounded-2xl overflow-hidden`}>
        {/* Date Header */}
        <div className="font-semibold p-4 pb-2 text-[#B11C5F] flex items-center justify-between border-b border-[#F28C8C]/20">
          {dateObj && (
            <>
              <span className="font-playfair">
                {dateObj.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                | {dateObj.toLocaleDateString("en-US", { weekday: "long" })}
              </span>
            </>
          )}
        </div>

        {/* Tab Navigation - Only show if items exist */}
        {(services.length > 0 || products.length > 0 || items.length > 0) && (
          <div className="flex bg-gradient-to-r from-[#FFF6F8] to-white border-b border-[#F28C8C]/20">
            <button
              onClick={() => setActiveTab("services")}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-lato font-semibold text-sm transition-all duration-300 ${
                activeTab === "services"
                  ? "bg-[#F28C8C] text-white shadow-lg border-b-2 border-[#B11C5F]"
                  : "text-[#B11C5F] hover:bg-[#FFF6F8]"
              }`}>
              <Calendar className="w-4 h-4" />
              Services ({services.length + items.length})
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-lato font-semibold text-sm transition-all duration-300 ${
                activeTab === "products"
                  ? "bg-[#F28C8C] text-white shadow-lg border-b-2 border-[#B11C5F]"
                  : "text-[#B11C5F] hover:bg-[#FFF6F8]"
              }`}>
              <ShoppingBag className="w-4 h-4" />
              Products ({products.length})
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto max-h-[500px]">
          <ClientOnly
            fallback={
              <div className="italic text-[#C59D5F] py-4 text-center font-cormorant">
                Loading cart...
              </div>
            }>
            {/* Check if any items exist */}
            {services.length === 0 &&
              products.length === 0 &&
              items.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🛒</span>
                  </div>
                  <p className="font-cormorant italic text-[#C59D5F] text-lg">
                    No items in cart.
                  </p>
                  <p className="font-lato text-[#444444] text-sm mt-1">
                    Add services or products to get started
                  </p>
                </div>
              )}

            {/* Services Tab Content */}
            {activeTab === "services" && (
              <div className="flex gap-3 md:flex-col md:gap-0 space-y-0 md:space-y-3">
                {services.length === 0 && items.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-[#B11C5F] opacity-50" />
                    <p className="font-cormorant italic text-[#C59D5F] text-lg">
                      No services selected
                    </p>
                    <p className="font-lato text-[#444444] text-sm mt-1">
                      Add services to book appointments
                    </p>
                  </div>
                ) : (
                  <>
                    {/* New Services */}
                    {services.map((service: any, index: any) => (
                      <div
                        key={`service-${service.id}-${index}`}
                        className="bg-gradient-to-br from-white to-[#FFF6F8] border border-[#F28C8C]/20 rounded-2xl p-4 flex flex-col gap-3 min-w-[280px] max-w-full lg:w-full shadow-md hover:shadow-lg transition-all duration-300 group">
                        <div className="flex justify-between items-center lg:items-start flex-wrap">
                          <div className="font-playfair font-semibold text-[#B11C5F] group-hover:text-[#F28C8C] transition-colors duration-300">
                            {service.name}
                          </div>
                          <div className="text-[#C59D5F] text-xs flex items-center gap-2 bg-[#FFF6F8] px-2 py-1 rounded-full border border-[#F28C8C]/20">
                            <div className="w-3 h-3 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center">
                              <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                            </div>
                            <span className="font-lato">
                              {service.duration} min
                            </span>
                          </div>
                        </div>
                        <div className="flex lg:flex-row lg:justify-between lg:items-center flex-col gap-2">
                          <small className="text-[#444444] font-lato">
                            {service.timeSlot && service.operator
                              ? `With ${service.operator} at ${service.timeSlot}`
                              : "Pick a time slot"}
                          </small>
                          <div className="flex items-center gap-3">
                            <div className="font-bold text-[#B11C5F] font-playfair text-lg">
                              ₹ {service.price?.toFixed(2)}
                            </div>
                            <button
                              className="w-8 h-8 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center text-red-500 hover:text-red-600 transition-all duration-300 hover:scale-110 group/btn"
                              onClick={() => handleRemoveService(index)}
                              aria-label="Remove service">
                              <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Legacy Services */}
                    {items.map((item: any, index: any) => (
                      <div
                        key={`legacy-item-${index}-${item.id}`}
                        className="bg-gradient-to-br from-white to-[#FFF6F8] border border-[#F28C8C]/20 rounded-2xl p-4 flex flex-col gap-3 min-w-[280px] max-w-full lg:w-full shadow-md hover:shadow-lg transition-all duration-300 group">
                        <div className="flex justify-between items-center lg:items-start flex-wrap">
                          <div className="font-playfair font-semibold text-[#B11C5F] group-hover:text-[#F28C8C] transition-colors duration-300">
                            {item.name}
                          </div>
                          <div className="text-[#C59D5F] text-xs flex items-center gap-2 bg-[#FFF6F8] px-2 py-1 rounded-full border border-[#F28C8C]/20">
                            <div className="w-3 h-3 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center">
                              <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                            </div>
                            <span className="font-lato">
                              {item.duration} min
                            </span>
                          </div>
                        </div>
                        <div className="flex lg:flex-row lg:justify-between lg:items-center flex-col gap-2">
                          <small className="text-[#444444] font-lato">
                            {item.timeSlot && item.operator
                              ? `With ${item.operator} at ${item.timeSlot}`
                              : "Pick a time slot"}
                          </small>
                          <div className="flex items-center gap-3">
                            <div className="font-bold text-[#B11C5F] font-playfair text-lg">
                              ₹ {item.price?.toFixed(2)}
                            </div>
                            <button
                              className="w-8 h-8 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center text-red-500 hover:text-red-600 transition-all duration-300 hover:scale-110 group/btn"
                              onClick={() => handleRemoveOldItem(index)}
                              aria-label="Remove">
                              <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Products Tab Content */}
            {activeTab === "products" && (
              <div className="flex gap-3 md:flex-col md:gap-0 space-y-0 md:space-y-3">
                {products.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-[#B11C5F] opacity-50" />
                    <p className="font-cormorant italic text-[#C59D5F] text-lg">
                      No products in cart
                    </p>
                    <p className="font-lato text-[#444444] text-sm mt-1">
                      Add products from shop
                    </p>
                  </div>
                ) : (
                  products.map((product: any) => (
                    <div
                      key={`product-${product.id}`}
                      className="bg-gradient-to-br from-white to-[#FFF6F8] border border-[#F28C8C]/20 rounded-2xl p-4 flex flex-col gap-3 min-w-[280px] max-w-full lg:w-full shadow-md hover:shadow-lg transition-all duration-300 group">
                      <div className="flex justify-between items-center lg:items-start flex-wrap">
                        <div className="break-words font-playfair font-semibold text-[#B11C5F] group-hover:text-[#F28C8C] transition-colors duration-300">
                          {product.name.length > 20
                            ? `${product.name.slice(0, 25)}...`
                            : product.name}
                        </div>
                        <div className="text-[#C59D5F] text-xs flex items-center gap-2 bg-[#FFF6F8] px-2 py-1 rounded-full border border-[#F28C8C]/20">
                          <div className="w-3 h-3 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                          </div>
                          <span className="font-lato">{product.brand}</span>
                        </div>
                      </div>
                      <div className="flex lg:flex-row lg:justify-between lg:items-center flex-col gap-2">
                        <div className="flex items-center gap-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 bg-white rounded-full border border-[#F28C8C]/30">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  product.id,
                                  product.quantity - 1
                                )
                              }
                              className="p-1 rounded-full hover:bg-[#F28C8C]/10 disabled:opacity-50"
                              disabled={product.quantity <= 1}>
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-sm font-semibold min-w-[20px] text-center">
                              {product.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  product.id,
                                  product.quantity + 1
                                )
                              }
                              className="p-1 rounded-full hover:bg-[#F28C8C]/10">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <small className="text-[#444444] font-lato">
                            Qty: {product.quantity}
                          </small>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="font-bold text-[#B11C5F] font-playfair text-lg">
                            ₹ {(product.price * product.quantity)?.toFixed(2)}
                          </div>
                          <button
                            className="w-8 h-8 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center text-red-500 hover:text-red-600 transition-all duration-300 hover:scale-110 group/btn"
                            onClick={() => handleRemoveProduct(product.id)}
                            aria-label="Remove product">
                            <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </ClientOnly>
        </div>
      </div>

      {!content && (
        <button
          className="text-[#B11C5F] font-lato font-semibold text-sm hover:text-[#F28C8C] hover:underline self-start mt-2 cursor-pointer mb-2 transition-colors duration-300 flex items-center gap-2 group"
          onClick={() => router.push("/saloon-services")}>
          <div className="w-5 h-5 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center text-white text-xs group-hover:scale-110 transition-transform duration-300 ml-2">
            +
          </div>
          Add Service
        </button>
      )}

      {activeTab === "services" &&
        content &&
        (services.length > 0 || items.length > 0) && (
          <div className="mx-auto mt-4">
            <button
              className="group relative w-60 py-3 bg-[#F28C8C] text-white font-lato font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:from-[#B11C5F] hover:to-[#F28C8C] overflow-hidden"
              onClick={() => router.push("/saloon-services/slots")}>
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative">Continue to Booking</span>
            </button>
          </div>
        )}

      {activeTab === "products" && content && products.length > 0 && (
        <div className="mx-auto mt-2">
          <button
            className="group relative w-60 py-3 bg-[#C59D5F] text-white font-lato font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:from-[#B11C5F] hover:to-[#C59D5F] overflow-hidden"
            onClick={() => router.push("/checkout")}>
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative">Checkout Products</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LeftPanel;
