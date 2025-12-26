"use client";

import React, { useState, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import {
  removeFromCart,
  removeServiceFromCart,
  removeProductFromCart,
} from "@/store/slices/cartSlice";
import { useRouter, usePathname } from "next/navigation";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import ClientOnly from "@/components/common/ClientOnly";

// Define props for the component, especially for the 'view' page functionality
interface BookingBottomBarProps {
  accepted?: boolean;
  policyAccepted?: boolean;
  handleCheckboxChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCancellationPolicyCheckboxChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOpenPolicyModal?: () => void;
  handleOpenCancellationPolicyModal?: () => void;
  handleBookAppointment?: () => void | Promise<void>;
}

// --- MAIN COMPONENT ---
const BookingBottomBar: React.FC<BookingBottomBarProps> = ({
  accepted,
  policyAccepted,
  handleCheckboxChange,
  handleCancellationPolicyCheckboxChange,
  handleOpenPolicyModal,
  handleOpenCancellationPolicyModal,
  handleBookAppointment,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // NEW: Get both old and new cart data
  const { services, products, items } = useAppSelector((state) => state.cart);
  const bookingState = useAppSelector((state) => state.booking);
  const { selectedDate, selectedSlot } = useAppSelector((state) => state.ui);

  // Combine services and legacy items for booking display (products don't show in booking flow)
  const cart = useMemo(() => {
    return [
      ...services.map((service: any) => ({
        id: service.id,
        name: service.name,
        duration: service.duration,
        price: service.price,
        category: service.category,
        tags: service.tags,
        operator: service.operator,
        selectedDate: service.selectedDate,
        selectedDay: service.selectedDay,
        timeSlot: service.timeSlot,
        description: service.description,
        vendor_location_uuid: service.vendor_location_uuid,
        type: "service" as const,
      })),
      ...items.map((item: any) => ({ ...item, type: "legacy" as const })), // Legacy items
    ];
  }, [services, items]);

  // Local state for the dropdown view
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine which page view to render based on the URL
  const pageType = pathname.endsWith("/view")
    ? "view"
    : pathname.endsWith("/slots")
    ? "slots"
    : "saloon-services";

  // Don't render the bar if no booking items, except on the final 'view' page
  if (services.length === 0 && items.length === 0 && pageType !== "view") {
    return null;
  }

  // Handle remove functions
  const handleRemoveItem = (item: any, index: number) => {
    if (item.type === "service") {
      // Find the service index in the services array
      const serviceIndex = services.findIndex((s: any) => s.id === item.id);
      if (serviceIndex >= 0) {
        dispatch(removeServiceFromCart(serviceIndex));
      }
    } else {
      // Legacy item - use original index in items array
      const legacyIndex = index - services.length;
      dispatch(removeFromCart(legacyIndex));
    }
  };

  // --- RENDER FUNCTIONS FOR EACH PAGE TYPE ---

  const renderServicesContent = () => (
    <>
      <div className="flex justify-between items-center">
        <div className="font-lato font-bold text-[#B11C5F]">
          {cart.length} {cart.length === 1 ? "Service" : "Services"} Added
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/saloon-services/slots")}
            className="px-6 py-2 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-lato font-semibold rounded-2xl hover:shadow-lg hover:from-[#B11C5F] hover:to-[#F28C8C] transition-all duration-300 hover:scale-105">
            Continue
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
          <ClientOnly
            fallback={
              <div className="text-[#C59D5F] font-lato">Loading...</div>
            }>
            {cart.map((item: any, index: number) => (
              <div
                key={`${item.type}-${item.id}-${index}`}
                className="flex justify-between items-center p-3 rounded-2xl hover:bg-[#FFF6F8] transition-all duration-300 border border-transparent hover:border-[#F28C8C]/20">
                <div>
                  <p className="text-[#444444] font-lato font-semibold">
                    {item.name}
                  </p>
                  <p className="text-[#C59D5F] text-sm font-lato">
                    {item.duration} min
                    {item.type === "service" && (
                      <span className=" ml-2 px-2 py-0.5 bg-[#F28C8C]/20 text-[#B11C5F] rounded-full text-xs">
                        New
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-[#B11C5F] font-lato">
                    ₹{item.price?.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item, index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-2xl hover:scale-110 transition-all duration-300">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </ClientOnly>
        </div>
      )}
    </>
  );

  const renderSlotsContent = () => (
    <div className="flex justify-between items-center">
      <div className="font-lato font-bold text-[#B11C5F]">
        {cart.length} {cart.length === 1 ? "Service" : "Services"} Selected
      </div>
      <button
        onClick={() => router.push("/saloon-services/view")}
        disabled={!selectedDate || !selectedSlot}
        className="px-6 py-2 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-lato font-semibold rounded-2xl hover:shadow-lg hover:from-[#B11C5F] hover:to-[#F28C8C] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
        Continue
      </button>
    </div>
  );

  const renderViewContent = () => (
    <div>
      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
        {/* First Checkbox - All Policies */}
        <div className="flex items-start gap-2 sm:gap-3">
          <input
            type="checkbox"
            id="policyCheck"
            checked={accepted}
            onChange={handleCheckboxChange}
            className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 accent-[#B11C5F] bg-white border-[#F28C8C]/30 rounded focus:ring-[#B11C5F] focus:ring-2"
          />
          <label
            htmlFor="policyCheck"
            className="text-[10px] xs:text-xs sm:text-sm text-[#444444] font-lato leading-tight sm:leading-relaxed flex-1">
            <span className="inline">I have read and accept{" "}</span>
            <button
              type="button"
              onClick={handleOpenPolicyModal}
              className="text-[#C59D5F] hover:text-[#B11C5F] hover:underline transition-colors font-semibold inline break-words">
              all policies
            </button>
            .
          </label>
        </div>

        {/* Second Checkbox - Cancellation Policy */}
        <div className="flex items-start gap-2 sm:gap-3">
          <input
            type="checkbox"
            id="cancellationPolicyCheck"
            checked={policyAccepted}
            onChange={handleCancellationPolicyCheckboxChange}
            className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 accent-[#B11C5F] bg-white border-[#F28C8C]/30 rounded focus:ring-[#B11C5F] focus:ring-2"
          />
          <label
            htmlFor="cancellationPolicyCheck"
            className="text-[10px] xs:text-xs sm:text-sm text-[#444444] font-lato leading-tight sm:leading-relaxed flex-1">
            <span className="inline">I have read and accept{" "}</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (handleOpenCancellationPolicyModal) {
                  handleOpenCancellationPolicyModal();
                }
              }}
              className="text-[#C59D5F] hover:text-[#B11C5F] hover:underline transition-colors font-semibold inline break-words">
              cancellation policy
            </button>
            .
          </label>
        </div>
      </div>
      <button
        className={`w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-lato font-bold text-sm sm:text-base md:text-lg transition-all duration-300 ${
          !bookingState.loading
            ? "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white shadow-lg hover:from-[#B11C5F] hover:to-[#F28C8C] active:scale-95 sm:hover:scale-105"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
        disabled={bookingState.loading}
        onClick={handleBookAppointment}>
        {bookingState.loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white/30 border-t-white mr-2"></div>
            <span className="text-xs sm:text-sm md:text-base">Creating Booking...</span>
          </div>
        ) : (
          <span className="text-xs sm:text-sm md:text-base">Book Appointment</span>
        )}
      </button>
    </div>
  );

  return (
    <div className="sticky bottom-0 left-0 right-0 w-full p-2 sm:p-3 md:p-4 bg-gradient-to-t from-[#B11C5F]/80 via-[#F28C8C]/60 to-transparent z-30 md:hidden">
      <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-sm border-2 border-[#F28C8C]/30 rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 transition-all duration-300">
        {pageType === "saloon-services" && renderServicesContent()}
        {pageType === "slots" && renderSlotsContent()}
        {pageType === "view" && renderViewContent()}
      </div>
    </div>
  );
};

export default BookingBottomBar;
