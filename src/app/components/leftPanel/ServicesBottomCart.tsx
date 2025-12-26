// components/leftPanel/ServicesBottomCart.tsx
"use client";

import React, { useState, useEffect } from "react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get cart data from Redux
  const { services: cartServices } = useAppSelector((state) => state.cart);
  const { selectedLocationByName } = useAppSelector((state) => state.services);

  // Reset expanded state when cart becomes empty
  useEffect(() => {
    if (cartServices.length === 0) {
      setIsExpanded(false);
    }
  }, [cartServices.length]);

  // Check if mobile menu is open by checking for the menu element or body overflow
  useEffect(() => {
    const checkMobileMenu = () => {
      // Method 1: Check if mobile menu element exists with z-[1000]
      const mobileMenu = document.querySelector('[class*="z-[1000]"]');
      // Method 2: Check if body has fixed position (mobile menu sets this)
      const bodyFixed = document.body.style.position === 'fixed';
      
      setIsMobileMenuOpen(!!mobileMenu || bodyFixed);
    };

    // Check initially
    checkMobileMenu();

    // Use MutationObserver to watch for menu open/close
    const observer = new MutationObserver(() => {
      checkMobileMenu();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    // Also check periodically as fallback
    const interval = setInterval(checkMobileMenu, 200);

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  // Handle remove service - use index
  const handleRemoveService = (index: number) => {
    dispatch(removeServiceFromCart(index));
  };

  // Navigate to slots page
  const handleProceedToSlots = () => {
    if (cartServices.length === 0) return;
    router.push("/saloon-services/slots");
  };

  // If cart is empty, don't show anything
  if (cartServices.length === 0) return null;

  // Hide cart when mobile menu is open
  if (isMobileMenuOpen) return null;

  return (
    <>
      {/* Bottom Fixed Cart */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t-2 border-pink-400 shadow-2xl z-40 transition-all duration-300 safe-area-inset-bottom ${
          isExpanded 
            ? "h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh]" 
            : "h-14 sm:h-16"
        }`}
        style={{
          maxHeight: isExpanded ? 'calc(100vh - 0.5rem)' : 'none',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
        {/* Collapsed View - Summary Bar */}
        <div
          className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 cursor-pointer hover:bg-gray-50 transition-colors min-h-[3.5rem] sm:min-h-[4rem]"
          onClick={() => setIsExpanded(!isExpanded)}>
          {/* Left Side - Location & Cart Icon */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Location Info */}
            {selectedLocationByName && (
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 flex-1 min-w-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 flex-shrink-0" />
                <p className="text-sm sm:text-base md:text-[18px] text-gray-700 truncate">
                  <span className="font-bold">{selectedLocationByName}</span>
                </p>
              </div>
            )}
            {/* Cart Icon with proper spacing */}
            <div className="flex items-center flex-shrink-0 ml-auto mr-3 sm:mr-4">
              <div className="relative">
                <IoCart className="text-2xl sm:text-3xl text-pink-500" id="cart-icon" />
                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-[10px] sm:text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                  {cartServices.length}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Book Button & Expand/Collapse */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleProceedToSlots();
              }}
              className="hidden md:flex items-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm sm:text-base">
              <ShoppingBag className="w-4 h-4" />
              Book Now
            </button>

            {/* Mobile Book Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleProceedToSlots();
              }}
              className="md:hidden px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg text-xs sm:text-sm font-semibold">
              Book
            </button>

            {/* Expand/Collapse Icon */}
            <button 
              className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              ) : (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded View - Services List */}
        {isExpanded && (
          <div className="h-[calc(100%-3.5rem)] sm:h-[calc(100%-4rem)] overflow-hidden flex flex-col">
            {/* Services List */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 sm:py-3 md:py-4 space-y-2 sm:space-y-3 scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-gray-100 pb-safe">
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
                cartServices.map((service: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                      {/* Service Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-xs sm:text-sm mb-1 truncate">
                          {service.name}
                        </h4>
                        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-600 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            {service.duration} min
                          </span>
                          <span className="font-semibold text-pink-600">
                            ₹{service.price?.toFixed(2)}
                          </span>
                        </div>

                        {/* Category Tag */}
                        <div className="mt-1.5 sm:mt-2">
                          <span className="inline-block px-2 py-0.5 sm:py-1 bg-pink-100 text-pink-700 text-[10px] sm:text-xs rounded-full">
                            {service.category}
                          </span>
                        </div>

                        {/* Time Slot Info (if available) */}
                        {service.operator && service.timeSlot ? (
                          <p className="text-[10px] sm:text-xs text-green-600 mt-1.5 sm:mt-2 line-clamp-1">
                            ✓ With {typeof service.operator === 'object' && service.operator !== null ? service.operator.name : service.operator} at {service.timeSlot}
                          </p>
                        ) : (
                          <p className="text-[10px] sm:text-xs text-amber-600 mt-1.5 sm:mt-2">
                            ⏱ Pick a time slot
                          </p>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveService(index)}
                        className="p-1.5 sm:p-2 hover:bg-red-50 rounded-lg transition-colors group flex-shrink-0"
                        title="Remove service">
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
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
      <div className="h-16 sm:h-20" />
    </>
  );
};

export default ServicesBottomCart;
