"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FiMapPin, FiX, FiSearch } from "react-icons/fi";
import { LocationSelectorSkeleton, Skeleton } from "@/components/common/Skeleton";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import { fetchLocations, fetchBusinessInfoByBookingPage } from "@/store/slices/locationsSlice";
import {
  fetchServicesByLocation,
  setSelectedLocation,
  setSelectedLocationByName,
} from "@/store/slices/servicesSlice";
import { fetchOperatorsByLocation } from "@/store/slices/operatorsSlice";
import { fetchBusinessHours } from "@/store/slices/businessHoursSlice";
import { clearCart, initializeCartWithAuth } from "@/store/slices/cartSlice";

interface LocationSelectorPanelProps {
  onLocationChange?: (locationUuid: string, locationName: string) => void;
}

export default function LocationSelectorPanel({
  onLocationChange,
}: LocationSelectorPanelProps) {
  const [showLocationPanel, setShowLocationPanel] = useState(false);
  const [selectedLocationName, setSelectedLocationName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const locationsState = useAppSelector((state) => state.locations);
  const { items } = useAppSelector((state) => state.cart);
  const { selectedLocationUuid, selectedLocationByName } = useAppSelector(
    (state) => state.services
  );

  const locationPanelRef = useRef<HTMLDivElement>(null);

  const handleRetryFetch = () => {
    const storedBookingPage = localStorage.getItem("selectedBookingPage") || 'stylo-hadapsar';
    dispatch(fetchLocations(storedBookingPage));
  };

  // keep redux/localstorage sync
  useEffect(() => {
    if (selectedLocationByName && !selectedLocationName) {
      setSelectedLocationName(selectedLocationByName);
    }
  }, [selectedLocationByName, selectedLocationName]);

  const setLocationContext = useCallback(
    async (location: any) => {
      if (!location) return;

      const locationUuid = location.vendor_location_uuid;
      const locationName = location.name || location.locality;
      const locality = location.locality || '';
      // Format: "Name (Locality)" or just "Name" if no locality
      const displayName = locality && locationName !== locality 
        ? `${locationName} (${locality})` 
        : locationName;
      const bookingPage = location.booking_page;

      setSelectedLocationName(displayName);
      
      // Fetch business info for the selected location using booking_page
      if (bookingPage) {
        try {
          await dispatch(fetchBusinessInfoByBookingPage(bookingPage)).unwrap();
        } catch (error) {
          console.error("Failed to fetch business info:", error);
        }
      }

      dispatch(fetchBusinessHours(locationUuid));
      dispatch(setSelectedLocation(locationUuid));
      dispatch(setSelectedLocationByName(displayName));
      dispatch(fetchServicesByLocation(locationUuid));
      dispatch(fetchOperatorsByLocation(locationUuid));
      dispatch(initializeCartWithAuth(locationUuid)); // Initialize cart for this location

      onLocationChange?.(locationUuid, displayName);

      localStorage.setItem("selectedLocationUuid", locationUuid);
      localStorage.setItem("selectedLocationName", displayName);
      if (bookingPage) {
        localStorage.setItem("selectedBookingPage", bookingPage);
      }
    },
    [dispatch, onLocationChange]
  );

  useEffect(() => {
    if (locationsState.locations.length === 0) {
      const storedBookingPage = localStorage.getItem("selectedBookingPage") || 'stylo-hadapsar';
      dispatch(fetchLocations(storedBookingPage));
    }
  }, [dispatch, locationsState.locations.length]);

  // location fallback logic
  useEffect(() => {
    if (locationsState.locations.length > 0 && !selectedLocationName) {
      let locationToSet = null;

      if (selectedLocationUuid) {
        locationToSet = locationsState.locations.find(
          (loc: any) => loc.vendor_location_uuid === selectedLocationUuid
        );
      }

      if (!locationToSet) {
        const storedLocationUuid = localStorage.getItem("selectedLocationUuid");
        const storedLocationName = localStorage.getItem("selectedLocationName");
        const storedBookingPage = localStorage.getItem("selectedBookingPage");

        if (storedLocationUuid && storedLocationName) {
          locationToSet = locationsState.locations.find(
            (loc: any) => loc.vendor_location_uuid === storedLocationUuid
          );
          if (locationToSet) {
            setSelectedLocationName(storedLocationName);
          }
        }

        // If still not found and we have booking_page, try to fetch locations for that booking_page
        if (!locationToSet && storedBookingPage) {
          dispatch(fetchLocations(storedBookingPage));
        }
      }

      if (
        !locationToSet &&
        items.length > 0 &&
        items[0]?.vendor_location_uuid
      ) {
        const locationUuidFromCart = items[0].vendor_location_uuid;
        locationToSet = locationsState.locations.find(
          (loc: any) => loc.vendor_location_uuid === locationUuidFromCart
        );
      }

      if (!locationToSet) {
        locationToSet = locationsState.locations[0];
      }

      if (locationToSet) {
        setLocationContext(locationToSet);
      }
    }
  }, [
    locationsState.locations,
    selectedLocationName,
    selectedLocationUuid,
    items,
    setLocationContext,
  ]);

  // close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        locationPanelRef.current &&
        !locationPanelRef.current.contains(target)
      ) {
        setShowLocationPanel(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // body scroll lock
  useEffect(() => {
    if (showLocationPanel) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [showLocationPanel]);

  const handleLocationSelect = async (location: any) => {
    await setLocationContext(location);
    setShowLocationPanel(false);
    setSearchTerm("");
    // dispatch(clearCart()); // Commented out - now using location-based cart storage
  };

  const filteredLocations = locationsState.locations.filter((location: any) => {
    const searchLower = searchTerm.toLowerCase();
    const name = (location.name || location.locality || '').toLowerCase();
    const locality = (location.locality || '').toLowerCase();
    return name.includes(searchLower) || locality.includes(searchLower);
  });

  return (
    <>
      {/* Location Selector Button */}
      {locationsState.loading ? (
        <LocationSelectorSkeleton />
      ) : (
        <button
          onClick={() => setShowLocationPanel(true)}
          className="flex items-center sm:space-x-2 px-2 sm:px-4 py-2 bg-white shadow-md hover:shadow-lg rounded-full hover:bg-[#FFF6F8] transition-all duration-300 hover:scale-105 group border border-[#F28C8C]/20"
          aria-label="Select Location">
          <FiMapPin className="w-4 h-4 text-[#B11C5F] group-hover:text-[#F28C8C] transition-colors duration-300" />
          <span className="hidden sm:block font-lato text-sm text-[#444444] group-hover:text-[#B11C5F] transition-colors duration-300">
            {selectedLocationName || "Select Location..."}
          </span>
        </button>
      )}

      {/* Location Selection Panel */}
      {showLocationPanel && (
        <div className="fixed inset-0 h-dvh w-screen z-[100] flex justify-end">
          <div
            ref={locationPanelRef}
            className="bg-gradient-to-br from-[#FFF6F8] to-white backdrop-blur-md shadow-2xl max-w-sm w-full h-dvh flex flex-col border border-[#F28C8C]/20">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#F28C8C]/20 bg-gradient-to-r from-[#F28C8C]/10 to-[#C59D5F]/10 rounded-t-2xl">
              <h3 className="font-playfair text-xl font-bold text-[#B11C5F]">
                Select Location
              </h3>
              <button
                onClick={() => setShowLocationPanel(false)}
                className="duration-300 text-[#444444] hover:rotate-180 hover:text-[#B11C5F] hover:bg-white/50 p-2 rounded-full transition-all group"
                aria-label="Close">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-[#F28C8C]/10">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#C59D5F]" />
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/50 backdrop-blur-sm text-[#444444] pl-12 pr-4 py-3 rounded-xl border border-[#F28C8C]/30 focus:outline-none focus:border-[#B11C5F] focus:bg-white transition-all duration-300 font-lato"
                />
              </div>
            </div>

            {/* Locations */}
            <div className="flex-1 overflow-y-auto p-2">
              {locationsState.loading ? (
                <div className="space-y-2 p-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-100">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </div>
              ) : locationsState.error ? (
                <div className="text-center py-8 space-y-4">
                  <p className="font-lato text-sm text-[#444444]">
                    Could not load locations. Please check your connection and
                    try again.
                  </p>
                  <button
                    onClick={handleRetryFetch}
                    className="px-4 py-2 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-lato font-medium rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                    Retry
                  </button>
                </div>
              ) : filteredLocations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="font-lato text-sm text-[#444444]">
                    No locations found
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredLocations.map((location: any, index: any) => {
                    const locationName = location.name || location.locality;
                    const locality = location.locality || '';
                    // Format: "Name (Locality)" or just "Name" if no locality or if name and locality are same
                    const locationDisplayName = locality && locationName !== locality 
                      ? `${locationName} (${locality})` 
                      : locationName;
                    const isSelected =
                      selectedLocationName === locationDisplayName || 
                      selectedLocationName === locationName;
                    return (
                      <button
                        key={index}
                        onClick={() => handleLocationSelect(location)}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-300 group border-2 ${
                          isSelected
                            ? "bg-gradient-to-r from-[#F28C8C]/20 to-[#C59D5F]/20 border-[#B11C5F] shadow-md"
                            : "border-transparent hover:border-[#F28C8C]/20 hover:bg-white/50"
                        }`}>
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isSelected
                                ? "bg-[#B11C5F]"
                                : "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F]"
                            }`}>
                            <FiMapPin className="w-4 h-4 text-white" />
                          </div>
                          <span
                            className={`font-lato transition-colors duration-300 ${
                              isSelected
                                ? "text-[#B11C5F] font-semibold"
                                : "text-[#444444] group-hover:text-[#B11C5F]"
                            }`}>
                            {locationDisplayName}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm -z-10"
            onClick={() => setShowLocationPanel(false)}
          />
        </div>
      )}
    </>
  );
}
