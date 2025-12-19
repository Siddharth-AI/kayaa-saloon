// components/leftPanel/ServicesBottomCart.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { removeServiceFromCart } from "@/store/slices/cartSlice";
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  ShoppingBag,
  Clock,
  MapPin,
} from "lucide-react";
import { IoCart } from "react-icons/io5";

const ServicesBottomCart = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState(false);

  // Get cart data from Redux
  const { services: cartServices } = useAppSelector((state) => state.cart);
  const { selectedLocationByName } = useAppSelector((state) => state.services);

  // Calculate totals
  const servicesTotal = cartServices.reduce(
    (sum: number, item: any) => sum + (item.price || 0),
    0
  );

  const totalDuration = cartServices.reduce(
    (sum: number, item: any) => sum + (item.duration || 0),
    0
  );

  // Handle remove service
  const handleRemoveService = (serviceId: number) => {
    dispatch(removeServiceFromCart(serviceId));
  };

  // Navigate to slots page
  const handleProceedToSlots = () => {
    if (cartServices.length === 0) return;
    router.push("/saloon-services/slots");
  };

  // If cart is empty, don't show anything
  if (cartServices.length === 0) return null;

  return (
    <>
      {/* Bottom Fixed Cart */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t-2 border-pink-400 shadow-2xl z-50 transition-all duration-300 ${
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
                  {cartServices.length}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm md:text-base">
                  {cartServices.length} Service
                  {cartServices.length > 1 ? "s" : ""} Added
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Expand/Collapse & Book Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleProceedToSlots();
              }}
              className="hidden md:flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold">
              <ShoppingBag className="w-4 h-4" />
              Book Now
            </button>

            {/* Mobile Book Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleProceedToSlots();
              }}
              className="md:hidden px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg text-sm font-semibold">
              Book
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

        {/* Expanded View - Services List */}
        {isExpanded && (
          <div className="h-[calc(100%-5rem)] overflow-hidden flex flex-col">
            {/* Services List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {cartServices.length === 0 ? (
                <div className="text-center py-8">
                  <IoCart className="text-6xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    No services selected
                  </p>
                  <p className="text-sm text-gray-400">
                    Add services to book appointments
                  </p>
                </div>
              ) : (
                cartServices.map((service: any) => (
                  <div
                    key={service.id}
                    className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                      {/* Service Info */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">
                          {service.name}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {service.duration} min
                          </span>
                          <span className="font-semibold text-pink-600">
                            ${service.price?.toFixed(2)}
                          </span>
                        </div>

                        {/* Category Tag */}
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full">
                            {service.category}
                          </span>
                        </div>

                        {/* Time Slot Info (if available) */}
                        {service.operator && service.timeSlot ? (
                          <p className="text-xs text-green-600 mt-2">
                            ✓ With {service.operator} at {service.timeSlot}
                          </p>
                        ) : (
                          <p className="text-xs text-amber-600 mt-2">
                            ⏱ Pick a time slot
                          </p>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveService(service.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        title="Remove service">
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

export default ServicesBottomCart;
