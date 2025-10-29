"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import ClientOnly from "../common/ClientOnly";
import {
  removeFromCart,
  removeServiceFromCart,
} from "@/store/slices/cartSlice";
import { Calendar, Trash2 } from "lucide-react";

interface ServicesCartProps {
  content?: string;
}

const ServicesCart: React.FC<ServicesCartProps> = ({ content }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedLocationByName } = useAppSelector((state) => state.services);

  // Get services cart data
  const { services, items } = useAppSelector((state) => state.cart);
  const { selectedDate } = useAppSelector((state) => state.ui);

  const dateObj =
    typeof selectedDate === "string" ? new Date(selectedDate) : selectedDate;

  // Calculate services total
  const servicesTotal = services.reduce(
    (sum: any, item: any) => sum + item.price,
    0
  );
  const oldItemsTotal = items.reduce(
    (sum: any, item: any) => sum + item.price,
    0
  );
  const grandTotal = servicesTotal + oldItemsTotal;

  // Handle remove functions
  const handleRemoveService = (index: number) => {
    dispatch(removeServiceFromCart(index));
  };

  const handleRemoveOldItem = (index: number) => {
    dispatch(removeFromCart(index));
  };

  const totalServiceCount = services.length + items.length;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden lg:h-fit lg:sticky lg:top-4">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-[#B11C5F] to-[#F28C8C] text-white p-4">
        {content === "summary" ? (
          <h2 className="text-xl font-bold font-lato">
            Services Cart ({totalServiceCount})
          </h2>
        ) : (
          <>
            <h2 className="text-xl font-bold font-lato">Kaya Beauty Salon</h2>
            <p className="text-sm text-white/90 mt-1">
              {selectedLocationByName}
            </p>
          </>
        )}
      </div>

      {/* Date Header */}
      {dateObj && (
        <div className="bg-[#FFF6F8] border-b-2 border-[#F28C8C] p-3 flex items-center gap-2 text-[#B11C5F]">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-semibold font-lato">
            {dateObj.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            | {dateObj.toLocaleDateString("en-US", { weekday: "long" })}
          </span>
        </div>
      )}

      {/* Services Content - Horizontal Scroll on Mobile, Vertical on Desktop */}
      <ClientOnly
        fallback={
          <div className="p-4 text-center text-gray-500">Loading cart...</div>
        }>
        {/* Mobile: Horizontal Scroll */}
        <div className="lg:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          <div className="flex gap-4 p-4">
            {services.length === 0 && items.length === 0 ? (
              <div className="min-w-full text-center py-8">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-[#F28C8C] opacity-50" />
                <p className="text-[#B11C5F] font-semibold mb-1">
                  No services selected
                </p>
                <p className="text-gray-500 text-sm">
                  Add services to book appointments
                </p>
              </div>
            ) : (
              <>
                {/* New Services - Horizontal Cards */}
                {services.map((service: any, index: any) => (
                  <div
                    key={`service-${index}`}
                    className="min-w-[280px] snap-start bg-white border-2 border-[#F28C8C] rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                    <div className="flex flex-col gap-3 h-full">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#B11C5F] font-lato mb-2">
                          {service.name}
                        </h3>
                        <p className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                          <Calendar className="w-3 h-3" />
                          {service.duration} min
                        </p>
                        {service.timeSlot && service.operator ? (
                          <p className="text-xs text-[#F28C8C] font-medium">
                            With {service.operator} at {service.timeSlot}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 italic">
                            Pick a time slot
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-[#F28C8C]/20">
                        <span className="text-[#B11C5F] font-bold font-lato text-lg">
                          ₹ {service.price?.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemoveService(index)}
                          className="p-2 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                          aria-label="Remove service">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Legacy Services - Horizontal Cards */}
                {items.map((item: any, index: any) => (
                  <div
                    key={`item-${index}`}
                    className="min-w-[280px] snap-start bg-white border-2 border-[#F28C8C] rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                    <div className="flex flex-col gap-3 h-full">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#B11C5F] font-lato mb-2">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                          <Calendar className="w-3 h-3" />
                          {item.duration} min
                        </p>
                        {item.timeSlot && item.operator ? (
                          <p className="text-xs text-[#F28C8C] font-medium">
                            With {item.operator} at {item.timeSlot}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 italic">
                            Pick a time slot
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-[#F28C8C]/20">
                        <span className="text-[#B11C5F] font-bold font-lato text-lg">
                          ₹ {item.price?.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemoveOldItem(index)}
                          className="p-2 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                          aria-label="Remove">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Desktop: Vertical List */}
        <div className="hidden lg:block max-h-[400px] overflow-y-auto">
          {services.length === 0 && items.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-[#F28C8C] opacity-50" />
              <p className="text-[#B11C5F] font-semibold mb-1">
                No services selected
              </p>
              <p className="text-gray-500 text-sm">
                Add services to book appointments
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F28C8C]/20">
              {/* New Services */}
              {services.map((service: any, index: any) => (
                <div
                  key={`service-${index}`}
                  className="p-4 hover:bg-[#FFF6F8] transition-colors duration-200">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#B11C5F] font-lato truncate">
                        {service.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {service.duration} min
                        </span>
                      </p>
                      {service.timeSlot && service.operator ? (
                        <p className="text-xs text-[#F28C8C] mt-1 font-medium">
                          With {service.operator} at {service.timeSlot}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1 italic">
                          Pick a time slot
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[#B11C5F] font-bold font-lato whitespace-nowrap">
                        ₹ {service.price?.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveService(index)}
                        className="p-1.5 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                        aria-label="Remove service">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Legacy Services */}
              {items.map((item: any, index: any) => (
                <div
                  key={`item-${index}`}
                  className="p-4 hover:bg-[#FFF6F8] transition-colors duration-200">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#B11C5F] font-lato truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.duration} min
                        </span>
                      </p>
                      {item.timeSlot && item.operator ? (
                        <p className="text-xs text-[#F28C8C] mt-1 font-medium">
                          With {item.operator} at {item.timeSlot}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1 italic">
                          Pick a time slot
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[#B11C5F] font-bold font-lato whitespace-nowrap">
                        ₹ {item.price?.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveOldItem(index)}
                        className="p-1.5 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                        aria-label="Remove">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ClientOnly>

      {/* Total Section */}
      {totalServiceCount > 0 && (
        <div className="border-t-2 border-[#F28C8C] bg-[#FFF6F8] p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[#B11C5F] font-semibold font-lato">
              Subtotal
            </span>
            <span className="text-[#B11C5F] font-bold text-lg font-lato">
              ₹ {grandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4 space-y-3">
        {!content && (
          <button
            onClick={() => router.push("/saloon-services")}
            className="w-full py-3 bg-white border-2 border-[#F28C8C] text-[#B11C5F] rounded-lg hover:bg-[#FFF6F8] transition-all duration-300 font-semibold font-lato flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" />
            Add Service
          </button>
        )}

        {content && totalServiceCount > 0 && (
          <button
            onClick={() => router.push("/saloon-services/slots")}
            className="w-full relative overflow-hidden py-3 bg-gradient-to-r from-[#B11C5F] to-[#F28C8C] text-white rounded-lg hover:shadow-lg transition-all duration-300 font-bold font-lato">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></span>
            Continue to Booking
          </button>
        )}
      </div>

      {/* Add scrollbar-hide CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ServicesCart;
