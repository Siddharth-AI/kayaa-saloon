"use client";
import type React from "react";
import { useEffect, useCallback, useRef, useMemo } from "react";
import LeftPanel from "@/components/leftPanel/LeftPanel";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearCartAfterSuccessfulBooking } from "@/store/slices/cartSlice";
import { FiArrowLeft } from "react-icons/fi";
import {
  createBooking,
  clearBookingError,
  type BookingService,
} from "@/store/slices/bookingSlice";
import {
  calculateBookingSummary,
  clearBookingSummary,
} from "@/store/slices/bookingSummarySlice";
import {
  setBookingComment,
  resetBookingComment,
  setSelectedSlot,
  setSelectedDate,
} from "@/store/slices/uiSlice";
import { openModal } from "@/store/slices/modalSlice";
import { toastError } from "@/components/common/toastService";
import BookingBottomBar from "../../BookingBottomBar";
import Image from "next/image";
import { getPaymentCards, setSelectedCard } from "@/store/slices/paymentSlice";
import PaymentFormModal from "@/components/payment/PaymentFormModal";
import { Check } from "lucide-react";

const View = () => {
  const { user, tempToken, isInitialized, isLoadingProfile } = useAppSelector((state) => state.auth);
  const { services, items } = useAppSelector((state) => state.cart);
  const { isOpen: isModalOpen } = useAppSelector((state) => state.modal);

  const { selectedDate, selectedSlot, bookingComment } = useAppSelector(
    (state) => state.ui
  );
  const servicesState = useAppSelector((state) => state.services);
  const bookingState = useAppSelector((state) => state.booking);
  const bookingSummaryState = useAppSelector((state) => state.bookingSummary);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null,
    longitude: null,
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const {
    paymentCards = [],
    selectedCardId,
    loading: paymentLoading,
  } = useAppSelector((state) => state.payment);

  const hasHandledBookingSuccess = useRef(false);
  const previousPayloadRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isCalculatingRef = useRef(false);
  const wasModalOpenRef = useRef(false);

  // Protect page - check if user is logged in
  useEffect(() => {
    // Wait for auth to initialize
    if (!isInitialized || isLoadingProfile) {
      return;
    }

    const isAuthenticated = !!user || !!tempToken;

    // Track previous modal state
    const wasModalOpen = wasModalOpenRef.current;
    wasModalOpenRef.current = isModalOpen;

    // If user is not logged in
    if (!isAuthenticated) {
      // SCENARIO 1: Modal was open but is now closed - user closed without logging in
      if (wasModalOpen && !isModalOpen) {
        router.push("/"); // Redirect to home
        return;
      }

      // SCENARIO 2: Modal is not open - user just landed on protected page
      if (!isModalOpen) {
        dispatch(openModal("password"));
      }
    }
  }, [user, tempToken, isInitialized, isLoadingProfile, isModalOpen, dispatch, router]);

  // Handler to select a card
  const handleSelectCard = (cardId: number) => {
    dispatch(setSelectedCard(cardId));
  };

  // const selectedCard = paymentCards.find((card) => card.id === selectedCardId);

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
      })),
      ...items, // Legacy items
    ];
  }, [services, items]);

  // NEW: Check both services and legacy items
  useEffect(() => {
    if (cart.length === 0) return;

    const firstItem = cart[0];

    // If the UI has no selected slot, but the cart does, restore it.
    if (!selectedSlot && firstItem?.timeSlot) {
      // console.log("Restoring selectedSlot from cart:", firstItem.timeSlot);
      dispatch(setSelectedSlot(firstItem.timeSlot));
    }

    // Also ensure the date is synchronized
    if (firstItem?.selectedDate) {
      const dateInState = new Date(selectedDate).toDateString();
      const dateInCart = new Date(firstItem.selectedDate).toDateString();
      if (dateInState !== dateInCart) {
        // console.log(
        //   "Restoring selectedDate from cart:",
        //   firstItem.selectedDate
        // );
        dispatch(setSelectedDate(firstItem.selectedDate));
      }
    }
  }, [services, items, cart, selectedSlot, selectedDate, dispatch, router]);

  // Calculate booking summary when component mounts or when cart/date/slot changes
  useEffect(() => {
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Early return if required data is missing
    if (
      cart.length === 0 ||
      !selectedDate ||
      !selectedSlot ||
      !servicesState.selectedLocationUuid ||
      (!tempToken && !user) ||
      bookingSummaryState.loading ||
      isCalculatingRef.current
    ) {
      return;
    }

    // Debounce the API call to prevent multiple rapid calls
    debounceTimerRef.current = setTimeout(async () => {
      try {
        // Prepare services data for API
        let nextAvailableTimeInMinutes = timeSlotToMinutes(selectedSlot);
        const servicesForAPI = cart.map((item: any) => {
          const startTime = nextAvailableTimeInMinutes;
          const endTime = startTime + (item.duration || 30);
          nextAvailableTimeInMinutes = endTime;

          // Get employee_id from operator - handle different possible structures
          let employeeId: number | undefined = undefined;
          if (item.operator) {
            // Operator could be an object with id, or a number, or have different property names
            if (typeof item.operator === 'object' && item.operator !== null) {
              employeeId = item.operator.id || item.operator.operator_id || item.operator.employee_id;
            } else if (typeof item.operator === 'number') {
              employeeId = item.operator;
            } else if (typeof item.operator === 'string') {
              // Try to parse if it's a string representation of a number
              const parsed = parseInt(item.operator, 10);
              if (!isNaN(parsed)) {
                employeeId = parsed;
              }
            }
          }

          const serviceObj: any = {
            service_id: item.id,
            service_name: item.name,
            start_time: startTime,
            end_time: endTime,
          };

          // Only include employee_id if it exists and is a valid number
          if (employeeId && typeof employeeId === 'number' && !isNaN(employeeId)) {
            serviceObj.employee_id = employeeId;
          }

          return serviceObj;
        });

        const summaryPayload = {
          vendor_location_uuid: servicesState.selectedLocationUuid,
          booking_date: formatDateForAPI(selectedDate),
          booking_comment: bookingComment || "",
          booking_status: "tentative",
          merge_services_of_same_staff: true,
          services: servicesForAPI,
          coupon_code: couponCode || "",
        };

        // Create a string representation of the payload to compare
        const payloadString = JSON.stringify({
          vendor_location_uuid: summaryPayload.vendor_location_uuid,
          booking_date: summaryPayload.booking_date,
          booking_comment: summaryPayload.booking_comment,
          services: summaryPayload.services.map((s: any) => ({
            service_id: s.service_id,
            start_time: s.start_time,
            end_time: s.end_time,
            employee_id: s.employee_id
          })),
          coupon_code: summaryPayload.coupon_code
        });

        // Only call API if payload actually changed
        if (previousPayloadRef.current === payloadString) {
          return;
        }

        // Mark as calculating to prevent duplicate calls
        isCalculatingRef.current = true;
        previousPayloadRef.current = payloadString;

        await dispatch(calculateBookingSummary(summaryPayload));
        
        // Reset calculating flag after a short delay
        setTimeout(() => {
          isCalculatingRef.current = false;
        }, 1000);
      } catch (error) {
        console.error("Error calculating booking summary:", error);
        isCalculatingRef.current = false;
      }
    }, 500); // 500ms debounce delay

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    cart,
    selectedDate,
    selectedSlot,
    servicesState.selectedLocationUuid,
    tempToken,
    user,
    bookingComment,
    couponCode,
    bookingSummaryState.loading,
    dispatch,
  ]);

  // Reset calculating flag when booking summary is loaded or error occurs
  useEffect(() => {
    if (!bookingSummaryState.loading) {
      isCalculatingRef.current = false;
    }
  }, [bookingSummaryState.loading]);

  useEffect(() => {
    if (
      bookingState.bookingId &&
      !bookingState.loading &&
      !hasHandledBookingSuccess.current
    ) {
      hasHandledBookingSuccess.current = true;

      // Save booking data to localStorage
      try {
        if (
          bookingState.bookingId &&
          (services.length > 0 || items.length > 0)
        ) {
          const bookingData = {
            services: services,
            items: items,
            bookingId: bookingState.bookingId,
          };

          // Save to localStorage as backup
          localStorage.setItem("booking-services", JSON.stringify(bookingData));

          // Also save to sessionStorage (more reliable for immediate navigation)
          sessionStorage.setItem(
            "booking-services",
            JSON.stringify(bookingData)
          );

          console.log("✅ Saved to both localStorage and sessionStorage");
        }
      } catch (error) {
        console.error("❌ Error saving booking services:", error);
        toastError("Couldn't save your booking details");
      }

      // Navigate FIRST
      router.push(
        `/saloon-services/thank-you?bookingId=${bookingState.bookingId}`
      );

      // Clear cart AFTER (with delay)
      setTimeout(() => {
        if (servicesState.selectedLocationUuid) {
          dispatch(
            clearCartAfterSuccessfulBooking(servicesState.selectedLocationUuid)
          );
        }
        dispatch(resetBookingComment());
      }, 1000); // Increased delay to ensure navigation completes
    }
  }, [
    bookingState.bookingId,
    bookingState.loading,
    services,
    items,
    dispatch,
    router,
  ]);

  // Add this useEffect to reset the ref when component unmounts or booking starts
  useEffect(() => {
    if (bookingState.loading) {
      hasHandledBookingSuccess.current = false;
    }
  }, [bookingState.loading]);

  // Watch for booking errors and show toast
  useEffect(() => {
    if (bookingState.error) {
      toastError(bookingState.error);
      console.log("Booking error detected:", bookingState.error);
    }
  }, [bookingState.error]);

  // The function returned by useEffect is a "cleanup" function.
  useEffect(() => {
    // It runs when this component unmounts (e.g., when you go to another page).
    return () => {
      dispatch(clearBookingError());
    };
  }, [dispatch]);

  // Load payment cards when component mounts
  useEffect(() => {
    if (servicesState.selectedLocationUuid) {
      dispatch(
        getPaymentCards({ merchant_uuid: servicesState.selectedLocationUuid })
      );
    }
  }, [dispatch, servicesState.selectedLocationUuid]);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleAccept = () => {
    setAccepted(true);
    setShowModal(false);
    // After accepting terms, check if policy modal should be shown
    if (!policyAccepted) {
      // Small delay to ensure state updates
      setTimeout(() => {
        setShowPolicyModal(true);
      }, 100);
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.display_name && user.display_name.trim()) {
      return user.display_name;
    }
    const firstName = user?.fname || "";
    const lastName = user?.lname || "";
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  // Get user location
  const getUserLocation = (): Promise<{ latitude: number | null; longitude: number | null }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log("Geolocation is not supported by this browser.");
        resolve({ latitude: null, longitude: null });
        return;
      }

      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsGettingLocation(false);
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(location);
          resolve(location);
        },
        (error) => {
          console.log("Error getting location:", error);
          setIsGettingLocation(false);
          const location = { latitude: null, longitude: null };
          setUserLocation(location);
          resolve(location);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  // Handle policy acceptance
  const handlePolicyAccept = async () => {
    console.log("Policy accepted");
    setPolicyAccepted(true);
    setShowPolicyModal(false);
    
    // Set location to null by default (no location required)
    const location = { latitude: null, longitude: null };
    setUserLocation(location);
    
    // Now proceed with booking
    await proceedWithBooking(location);
  };

  // Proceed with booking after policy acceptance
  const proceedWithBooking = async (location: { latitude: number | null; longitude: number | null }) => {
    if (!selectedCardId) {
      toastError("Please select a payment card to proceed.");
      return;
    }

    if (!selectedDate || !selectedSlot) {
      toastError("Please select a date and time slot.");
      return;
    }

    if (services.length === 0 && items.length === 0) {
      toastError(
        "No services selected for booking. Please add services first."
      );
      return;
    }

    if (cart.length === 0) {
      toastError("Your cart is empty. Please add services before booking.");
      return;
    }

    console.log(cart, "cart=>>>>>>>>>>>>>>data when i booking");

    if (!servicesState.selectedLocationUuid) {
      toastError("Location information is missing. Please try again.");
      return;
    }

    if (!tempToken && !user) {
      toastError("You must be logged in to book an appointment.");
      dispatch(openModal("login"));
      return;
    }

    try {
      // 1. Set the starting point for the very first service
      let nextAvailableTimeInMinutes = timeSlotToMinutes(selectedSlot);
      
      // 2. Map over the cart to create services with chained times
      const services: BookingService[] = cart.map((item: any) => {
        const startTime = nextAvailableTimeInMinutes;
        const endTime = startTime + (item.duration || 30);

        // 3. IMPORTANT: Update the starting time for the *next* service in the loop
        nextAvailableTimeInMinutes = endTime;

        // Get employee_id from operator - handle different possible structures
        let employeeId: number | undefined = undefined;
        if (item.operator) {
          if (typeof item.operator === 'object' && item.operator !== null) {
            employeeId = item.operator.id || item.operator.operator_id || item.operator.employee_id;
          } else if (typeof item.operator === 'number') {
            employeeId = item.operator;
          } else if (typeof item.operator === 'string') {
            const parsed = parseInt(item.operator, 10);
            if (!isNaN(parsed)) {
              employeeId = parsed;
            }
          }
        }

        const serviceObj: any = {
          service_id: item.id,
          service_name: item.name,
          start_time: startTime,
          end_time: endTime,
        };

        // Only include employee_id if it exists and is a valid number
        if (employeeId && typeof employeeId === 'number' && !isNaN(employeeId)) {
          serviceObj.employee_id = employeeId;
        }

        return serviceObj;
      });

      // Use booking summary data if available, otherwise calculate
      let total = 0;
      let depositAmount = 0;

      if (bookingSummaryState.data?.financial_summary) {
        total = bookingSummaryState.data.financial_summary.booking?.total_payable || 0;
        depositAmount = bookingSummaryState.data.financial_summary.deposit?.amount || 0;
      } else {
        // Fallback calculation if summary not available
        const serviceTotal = cart.reduce(
          (acc: number, cur: any) => acc + (cur.price || 0),
          0
        );
        const tax = 19.07;
        total = serviceTotal + tax;
        depositAmount = total / 2;
      }

      // Prepare booking payload with comment from Redux state and policy acceptance
      const bookingPayload = {
        vendor_location_uuid: servicesState.selectedLocationUuid,
        booking_date: formatDateForAPI(selectedDate),
        booking_comment: bookingComment || "",
        booking_status: "tentative",
        merchant_customer_id: selectedCardId,
        merge_services_of_same_staff: true,
        total: Math.round(total * 100) / 100,
        deposit_amount: Math.round(depositAmount * 100) / 100,
        services,
        policy_acceptance: {
          terms_accepted: true,
          acceptance_geo_location: {
            latitude: null,
            longitude: null,
          },
          acceptance_screenshot: "",
        },
      };

      // Dispatch the booking creation
      const result = await dispatch(createBooking(bookingPayload));

      // Check if booking was rejected
      // Note: Error toast will be shown by useEffect watching bookingState.error
      if (createBooking.rejected.match(result)) {
        console.log("Booking failed:", result.payload);
        return; // Exit early on error - toast will be shown by useEffect
      }
    } catch (error) {
      console.log("Booking error in catch block", error);
      toastError(
        "We've run into a temporary glitch. Please refresh the page and try again."
      );
    }
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccepted(e.target.checked);
  };

  // Handle comment change and save to Redux
  const handleCommentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(setBookingComment(e.target.value));
    },
    [dispatch]
  );

  // Helper function to convert time slot to minutes
  const timeSlotToMinutes = (timeSlot: string): number => {
    const [time, period] = timeSlot.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let totalMinutes = hours * 60 + (minutes || 0);

    if (period === "PM" && hours !== 12) {
      totalMinutes += 12 * 60;
    } else if (period === "AM" && hours === 12) {
      totalMinutes = minutes || 0;
    }

    return totalMinutes;
  };

  // Helper function to format date for API
  const formatDateForAPI = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleConfirmation = async () => {
    // First check basic validations
    if (!selectedCardId) {
      toastError("Please select a payment card to proceed.");
      return;
    }

    // If terms not accepted, show terms modal
    if (!accepted) {
      setShowModal(true);
      return;
    }

    if (!selectedDate || !selectedSlot) {
      toastError("Please select a date and time slot.");
      return;
    }

    if (services.length === 0 && items.length === 0) {
      toastError(
        "No services selected for booking. Please add services first."
      );
      return;
    }

    if (cart.length === 0) {
      toastError("Your cart is empty. Please add services before booking.");
      return;
    }

    if (!servicesState.selectedLocationUuid) {
      toastError("Location information is missing. Please try again.");
      return;
    }

    if (!tempToken && !user) {
      toastError("You must be logged in to book an appointment.");
      dispatch(openModal("login"));
      return;
    }

    // Show policy acceptance modal first (if not already accepted)
    if (!policyAccepted) {
      console.log("Showing policy acceptance modal");
      setShowPolicyModal(true);
      return;
    }

    // Proceed with booking (location is null by default)
    const location = { latitude: null, longitude: null };
    await proceedWithBooking(location);
  };

  const handlePayment = () => {
    // console.log("button click");
    if (!tempToken && !user) {
      toastError("You must be logged in to book an appointment.");
      dispatch(openModal("login"));
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const serviceTotal = cart.reduce(
    (acc: number, cur: any) => acc + (cur.price || 0),
    0
  );
  const tax = 19.07;
  const discountAmount = (serviceTotal * couponDiscount) / 100;
  const totalPayable = serviceTotal + tax - discountAmount;

  // // Inside your component
  // const handlePaymentSuccess = () => {
  //   // Refresh payment cards list
  //   if (servicesState.selectedLocationUuid) {
  //     dispatch(
  //       getPaymentCards({
  //         merchant_uuid: servicesState.selectedLocationUuid,
  //       })
  //     );
  //   }
  // };
  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);

    // Refresh payment cards list after modal closes
    if (servicesState.selectedLocationUuid) {
      dispatch(
        getPaymentCards({
          merchant_uuid: servicesState.selectedLocationUuid,
        })
      );
    }
  };

  const handleApplyCoupon = () => {
    const validCoupons: { [key: string]: number } = {
      SAVE10: 10,
      SAVE20: 20,
      WELCOME15: 15,
    };

    if (validCoupons[couponCode.toUpperCase()]) {
      setCouponDiscount(validCoupons[couponCode.toUpperCase()]);
      setCouponApplied(true);
    } else {
      toastError("Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponApplied(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF6F8] to-[#FEFAF4]">
      <div className="w-full relative py-14 pl-4 sm:pl-6 md:pl-8 lg:pl-11 pt-12 sm:pt-16 md:pt-20 lg:pt-20 xl:pt-28 overflow-hidden group">
        {/* Animated Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/service/viewBooking.webp"
            alt="Appointment booking background"
            fill
            priority
            sizes="100vw"
            className="object-cover transition-transform duration-[8000ms] ease-out group-hover:scale-105"
            style={{
              objectPosition: "center bottom",
              zIndex: 1,
            }}
          />
        </div>

        {/* Enhanced Animated Gradient Overlays */}
        <div className="absolute inset-0 z-[2] animate-pulse-slow" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent z-[3]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent z-[4]" />

        {/* Enhanced Floating Decoration Elements */}
        <div className="absolute top-16 right-24 w-5 h-5 bg-[#F28C8C]/50 rounded-full animate-bounce-slow blur-sm" />
        <div className="absolute top-36 right-16 w-3 h-3 bg-[#C59D5F]/60 rounded-full animate-pulse delay-1000 blur-sm" />
        <div className="absolute bottom-28 right-36 w-4 h-4 bg-white/40 rounded-full animate-bounce-slow delay-2000 blur-sm" />
        <div className="absolute top-1/2 right-8 w-2 h-2 bg-white/50 rounded-full animate-pulse delay-1500 blur-sm" />
        <div className="absolute bottom-16 right-20 w-3 h-3 bg-[#F28C8C]/40 rounded-full animate-bounce-slow delay-500 blur-sm" />

        {/* Animated Border Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F28C8C]/80 to-transparent animate-shimmer" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C59D5F]/80 to-transparent animate-shimmer delay-1000" />

        {/* Side Accent Lines */}
        <div className="absolute left-0 top-1/4 w-1 h-40 bg-gradient-to-b from-transparent via-white/30 to-transparent animate-shimmer delay-500" />
        <div className="absolute right-0 bottom-1/3 w-1 h-32 bg-gradient-to-t from-transparent via-[#F28C8C]/50 to-transparent animate-shimmer delay-1500" />

        {/* Booking/Calendar Theme Decorative Elements */}
        <div className="absolute top-20 left-20 w-10 h-10 border-2 border-white/20 rounded-lg animate-pulse">
          <div className="absolute top-1 left-1 w-1 h-1 bg-white/40 rounded-full" />
          <div className="absolute top-1 right-1 w-1 h-1 bg-white/40 rounded-full" />
          <div className="absolute bottom-2 left-2 w-4 h-0.5 bg-[#F28C8C]/60 rounded" />
        </div>
        <div className="absolute bottom-20 left-16 w-8 h-8 border border-[#F28C8C]/30 rounded-lg animate-spin-slow">
          <div className="absolute inset-1 border border-white/20 rounded" />
        </div>

        {/* Content Container with Enhanced Animation */}
        <div className="max-w-7xl mx-auto sm:px-4 relative z-10 transform transition-all duration-1000 ease-out h-full flex items-end lg:pb-4">
          <div className="relative w-full mt-16 md:mt-12">
            {/* Enhanced Glowing Background for Title */}
            <div className="absolute -inset-6 bg-gradient-to-r from-[#F28C8C]/25 via-white/15 to-[#C59D5F]/25 blur-2xl rounded-3xl animate-pulse-glow" />

            {/* Main Title with Multiple Animations */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl pt-4 sm:pt-6 md:pt-8 lg:pt-8 xl:pt-10 font-playfair font-bold tracking-wide relative z-20 transform transition-all duration-1000 ease-out animate-slide-up">
              {/* Enhanced Gradient Text Effect */}
              <span className="text-white animate-gradient-x drop-shadow-lg text-shadow-lg">
                APPOINTMENT BOOKING
              </span>

              {/* Animated Underline with Enhanced Styling */}
              <div className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-white via-[white] to-white animate-expand-width shadow-lg" />

              {/* Double Underline Effect */}
              <div className="absolute -bottom-3 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-[#C59D5F]/70 to-transparent animate-expand-width delay-500" />
            </h1>

            {/* Enhanced Subtitle with Staggered Animation */}
            <p className="dancing-script text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl text-white mt-2 sm:mt-3 md:mt-4 italic relative z-20 animate-fade-in-up delay-500 opacity-0 drop-shadow-md px-2">
              ✨ Schedule your perfect wellness moment
            </p>

            {/* Additional Booking-Focused Tagline */}
            <p className="font-lato text-xs sm:text-xs md:text-sm lg:text-sm text-white/90 mt-1.5 sm:mt-2 md:mt-2.5 relative z-20 animate-fade-in-up delay-700 opacity-0 tracking-wider uppercase px-2 hidden sm:block">
              Quick Booking • Instant Confirmation • Premium Experience
            </p>

            {/* Enhanced Booking-themed Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-10 h-10 border-2 border-[#F28C8C]/40 rounded-lg animate-spin-slow flex items-center justify-center">
              <div className="text-white/50 text-xs">📋</div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-2 border-[#C59D5F]/40 rounded-lg animate-spin-slow-reverse flex items-center justify-center">
              <div className="text-[#F28C8C]/60 text-xs">📝</div>
            </div>

            {/* Corner Accents with Booking Theme */}
            <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-white/25 rounded-tl-2xl animate-pulse">
              <div className="absolute top-2 left-2 text-white/40 text-xs">
                📅
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-[#F28C8C]/40 rounded-br-2xl animate-pulse delay-1000">
              <div className="absolute bottom-2 right-2 text-[#C59D5F]/50 text-xs">
                ✅
              </div>
            </div>

            {/* Floating Action Indicators */}
            <div className="absolute top-4 right-4 flex space-x-1">
              <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-[#F28C8C]/40 rounded-full animate-pulse delay-300" />
              <div className="w-2 h-2 bg-[#C59D5F]/40 rounded-full animate-pulse delay-600" />
            </div>
          </div>
        </div>

        {/* Enhanced Floating Particles */}
        <div className="absolute inset-0 pointer-events-none z-[1]">
          <div className="absolute top-1/5 left-1/5 w-1.5 h-1.5 bg-white/70 rounded-full animate-float" />
          <div className="absolute top-1/3 left-2/3 w-1 h-1 bg-[#F28C8C]/60 rounded-full animate-float-delay-1" />
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-[#C59D5F]/50 rounded-full animate-float-delay-2" />
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-white/60 rounded-full animate-float-delay-3" />
          <div className="absolute bottom-1/4 left-1/4 w-0.5 h-0.5 bg-white/80 rounded-full animate-float delay-2000" />
          <div className="absolute top-1/2 right-1/2 w-1 h-1 bg-[#F28C8C]/40 rounded-full animate-float-delay-1 delay-1000" />
          <div className="absolute bottom-2/5 right-1/5 w-1 h-1 bg-[#C59D5F]/60 rounded-full animate-float-delay-2 delay-1500" />
        </div>

        {/* Booking & Appointment Theme Magic Elements */}
        <div className="absolute inset-0 pointer-events-none z-[5]">
          <div className="absolute top-28 left-40 text-white/40 animate-pulse delay-1000">
            📋
          </div>
          <div className="absolute top-44 right-44 text-[#F28C8C]/50 animate-bounce-slow delay-2000">
            📅
          </div>
          <div className="absolute bottom-44 left-52 text-white/30 animate-pulse delay-1500">
            📝
          </div>
          <div className="absolute bottom-28 right-28 text-[#C59D5F]/40 animate-bounce-slow delay-500">
            ✅
          </div>
          <div className="absolute top-2/3 left-24 text-white/35 animate-pulse delay-2500">
            📞
          </div>
          <div className="absolute top-1/3 right-16 text-[#F28C8C]/45 animate-bounce-slow delay-3000">
            💼
          </div>
        </div>

        {/* Subtle Moving Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent z-[1] animate-pulse-slow delay-2000" />

        {/* Booking Form Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-5 z-[1]"
          style={{
            backgroundImage: `
      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
    `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Progress Indicator Animation */}
        <div className="absolute top-4 left-4 flex flex-col space-y-1">
          <div className="w-8 h-0.5 bg-white/20 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] animate-pulse" />
          </div>
          <div className="w-6 h-0.5 bg-white/15 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] animate-pulse delay-500" />
          </div>
          <div className="w-4 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] animate-pulse delay-1000" />
          </div>
        </div>
      </div>

      <div className="px-4 bg-gradient-to-br from-[#FFF6F8] to-[#FEFAF4] py-5">
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
          {/* Left Panel */}
          <div className="w-full lg:w-[800px] relative">
            <div
              className="bg-white/80 backdrop-blur-sm p-6 shadow-lg relative rounded-2xl border-2 border-[#F28C8C]/20 hover:border-[#B11C5F] text-[#B11C5F] transition-all duration-300 group mb-4 py-2 hover:shadow-xl hover:shadow-[#F28C8C]/20"
              onClick={() => router.back()}>
              <button
                className="rounded-2xl flex items-center gap-2 font-lato"
                aria-label="Go back to previous page">
                <FiArrowLeft className="w-7 h-7 transition-transform duration-300 group-hover:-translate-x-1" />
                <span className="font-semibold text-xl pr-1">Back</span>
              </button>
            </div>
            <LeftPanel />

            {/* Coupon Code Section */}
            <div className="mt-3 bg-white/80 backdrop-blur-sm overflow-hidden relative rounded-2xl border-2 border-[#F28C8C]/20 text-[#B11C5F] transition-all duration-300 group mb-4 pb-4 shadow-xl shadow-[#F28C8C]/20">
              <h4 className="text-xl font-playfair font-bold mb-4 bg-gradient-to-r from-[#B11C5F] to-[#F28C8C] text-white p-4">
                Coupon Code
              </h4>
              <div className="flex gap-2 px-3">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 p-3 border-2 border-[#F28C8C]/30 rounded-xl focus:outline-none focus:border-[#B11C5F] transition-all duration-300 text-[#444444] placeholder-[#C59D5F] font-lato"
                  disabled={couponApplied}
                />
                {!couponApplied ? (
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim()}
                    className="bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] hover:from-[#B11C5F] hover:to-[#F28C8C] text-white font-lato font-semibold px-4 py-2 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    Apply
                  </button>
                ) : (
                  <button
                    onClick={handleRemoveCoupon}
                    className="bg-red-500 hover:bg-red-600 text-white font-lato font-semibold px-4 py-2 rounded-xl transition-all duration-300">
                    Remove
                  </button>
                )}
              </div>
              {couponApplied && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-600 font-lato text-sm">
                    ✓ Coupon "{couponCode}" applied! You saved {couponDiscount}%
                  </p>
                </div>
              )}
            </div>

            {/* Pricing Summary */}
            <div className="mt-4 bg-white/80 backdrop-blur-sm relative overflow-hidden rounded-2xl border-2 border-[#F28C8C]/20 text-[#B11C5F] transition-all duration-300 group mb-4 shadow-lg ">
              <h4 className="text-xl font-playfair font-bold mb-4 bg-gradient-to-r from-[#B11C5F] to-[#F28C8C] text-white p-4">
                Pricing Summary
              </h4>
              <div className="space-y-3 px-4 pb-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#444444] font-lato">
                    Service Total
                  </span>
                  <span className="font-bold text-[#B11C5F] font-lato">
                    ₹ {serviceTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#444444] font-lato">Tax</span>
                  <span className="font-bold text-[#B11C5F] font-lato">
                    ₹ {tax.toFixed(2)}
                  </span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="font-lato">
                      Discount ({couponDiscount}%)
                    </span>
                    <span className="font-bold font-lato">
                      -₹ {discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t-2 border-[#F28C8C]/30 pt-3 mt-3 flex justify-between items-center">
                  <span className="font-bold text-lg text-[#B11C5F] font-playfair">
                    Total Payable
                  </span>
                  <span className="font-bold text-lg text-[#B11C5F] font-lato">
                    ₹ {totalPayable.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full relative rounded-2xl">
            {/* Error Display */}
            {/* {bookingState.error && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-600 flex justify-between items-center animate-fadeIn">
              <div>
                <p className="font-semibold">Booking Failed</p>
                <p className="text-sm">
                  The selected time slot may have just become unavailable.
                  Please try selecting a different slot or time.
                </p>
              </div>
              <button
                onClick={() => dispatch(clearBookingError())}
                className="p-1 rounded-full hover:bg-red-100 transition-colors"
                aria-label="Close error message">
                <FiX size={20} />
              </button>
            </div>
          )} */}

            {/* Main Card */}
            <div className="rounded-2xl p-6 border-2 shadow-lg bg-white/90 mb-4 border-[#F28C8C]/30">
              <h4 className="text-xl font-playfair font-bold mb-4 text-[#B11C5F]">
                Add Instruction
              </h4>
              <div className="mb-6">
                <textarea
                  value={bookingComment}
                  onChange={handleCommentChange}
                  className="w-full p-4 border-2 bg-white border-[#F28C8C]/30 rounded-2xl resize-none focus:outline-none focus:border-[#B11C5F] transition-all duration-300 text-[#444444] placeholder-[#C59D5F] font-lato"
                  placeholder="Write something..."
                  rows={4}
                />
              </div>
            </div>
            {/* Payment Method Section */}
            <div className="bg-white/90 rounded-2xl p-6 border-2 shadow-lg border-[#F28C8C]/30 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-playfair font-bold text-[#B11C5F]">
                  Payment Method
                </h4>
                <button
                  onClick={handlePayment}
                  className="bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] hover:from-[#B11C5F] hover:to-[#F28C8C] text-white font-lato font-semibold px-4 py-2 rounded-xl transition-all duration-300">
                  Add New Card
                </button>
              </div>

              {paymentLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#F28C8C] border-t-transparent mr-2"></div>
                  <span className="font-lato text-gray-600">
                    Loading payment methods...
                  </span>
                </div>
              ) : paymentCards.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <svg
                      className="w-12 h-12 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <p className="font-lato text-gray-600 mb-2">
                    No payment method found
                  </p>
                  <p className="font-lato text-sm text-gray-500">
                    Please add a new card to continue
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentCards.map((card: any) => (
                    <div
                      key={card.id}
                      onClick={() => handleSelectCard(card.id)}
                      className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedCardId === card.id
                          ? "border-pink-600 bg-pink-50 shadow-md"
                          : "border-gray-200 hover:border-pink-300 hover:shadow-sm"
                      }`}>
                      {/* Selected Checkmark */}
                      {selectedCardId === card.id && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        {/* Card Icon */}
                        <div
                          className={`p-3 rounded-lg ${
                            card.card_type === "VISA"
                              ? "bg-blue-100"
                              : card.card_type === "AMEX"
                              ? "bg-green-100"
                              : "bg-purple-100"
                          }`}>
                          <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                        </div>

                        {/* Card Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-800">
                              {card.card_type}
                            </span>
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                              {card.card_holder_name}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 font-mono">
                            {card.card_number}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Expires: {card.card_expiry}
                          </p>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {selectedCardId === card.id && (
                        <div className="mt-2 pt-2 border-t border-pink-200">
                          <p className="text-xs text-pink-600 font-medium">
                            ✓ This card will be used for payment
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Display Selected Card Info */}
                  {/* {selectedCardId && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                      <p className="text-sm font-medium text-gray-700">
                        Selected Payment Method
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Card ID:{" "}
                        <span className="font-mono font-bold">
                          {selectedCardId}
                        </span>
                      </p>
                      {selectedCard && (
                        <p className="text-xs text-gray-600">
                          {selectedCard.card_type} ending in{" "}
                          {selectedCard.card_number.slice(-4)}
                        </p>
                      )}
                    </div>
                  )} */}
                </div>
              )}
            </div>
            {/* Policy and Button Card */}
            <div className="bg-white/90 rounded-2xl p-6 border-2 shadow-lg border-[#F28C8C]/30 hidden md:block">
              <div className="flex items-start space-x-3 mb-4">
                <input
                  type="checkbox"
                  id="policyCheck"
                  checked={accepted}
                  onChange={handleCheckbox}
                  className="mt-1 w-4 h-4 text-[#B11C5F] border-[#F28C8C]/30 rounded focus:ring-[#B11C5F]"
                />
                <label
                  htmlFor="policyCheck"
                  className="text-sm text-[#444444] font-lato">
                  I have read and accept{" "}
                  <button
                    type="button"
                    onClick={handleOpenModal}
                    className="text-[#C59D5F] hover:text-[#B11C5F] hover:underline transition-colors">
                    all policies
                  </button>
                  {" "}and{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPolicyModal(true);
                    }}
                    className="text-[#C59D5F] hover:text-[#B11C5F] hover:underline transition-colors">
                    cancellation policy
                  </button>
                  .
                </label>
              </div>

              <button
                className={`
                group/btn relative overflow-hidden shadow-lg hover:shadow-xl transform  hover:from-[#B11C5F] hover:to-[#F28C8C] w-full py-4 rounded-2xl font-bold text-lg transition-all font-lato ${
                  !bookingState.loading
                    ? "bg-[#F28C8C] text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed opacity-70"
                }`}
                disabled={bookingState.loading}
                onClick={handleConfirmation}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                {bookingState.loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
                    Creating Booking...
                  </div>
                ) : (
                  "Book Appointment"
                )}
              </button>
            </div>

            {/* Mobile spacing for fixed bottom bar */}
            <div className="lg:hidden pb-24"></div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl border-2 border-[#F28C8C]/30">
                <div className="p-6 pb-3 border-b-2 border-[#F28C8C]/20">
                  <h5 className="text-xl font-playfair font-bold text-[#B11C5F]">
                    Terms and Conditions
                  </h5>
                </div>

                <div className="p-6 max-h-96 overflow-y-auto">
                  <div className="space-y-4 text-[#444444] font-lato">
                    <p>
                      <strong className="text-[#B11C5F]">
                        1. Booking Policy:
                      </strong>{" "}
                      All appointments are subject to availability and
                      confirmation.
                    </p>
                    <p>
                      <strong className="text-[#B11C5F]">
                        2. Cancellation:
                      </strong>{" "}
                      Cancellations must be made at least 24 hours in advance.
                    </p>
                    <p>
                      <strong className="text-[#B11C5F]">3. Payment:</strong>{" "}
                      Payment is required at the time of service.
                    </p>
                    <p>
                      <strong className="text-[#B11C5F]">
                        4. Late Arrival:
                      </strong>{" "}
                      Please arrive 10 minutes before your appointment time.
                    </p>
                    <p>
                      <strong className="text-[#B11C5F]">
                        5. Health & Safety:
                      </strong>{" "}
                      Please inform us of any allergies or health conditions.
                    </p>
                  </div>
                </div>

                <div className="p-6 border-t-2 border-[#F28C8C]/20 bg-[#FFF6F8] flex justify-end space-x-3">
                  <button
                    className="px-6 py-2 border-2 border-[#F28C8C]/30 rounded-xl text-[#B11C5F] hover:bg-[#F28C8C]/10 transition-colors font-lato font-medium"
                    onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button
                    className="bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] hover:from-[#B11C5F] hover:to-[#F28C8C] text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 min-w-[100px] font-lato"
                    onClick={handleAccept}>
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-49">
        <BookingBottomBar
          accepted={accepted}
          handleCheckboxChange={() => setAccepted(!accepted)}
          handleOpenPolicyModal={() => setShowModal(true)}
          handleOpenCancellationPolicyModal={() => setShowPolicyModal(true)}
          handleBookAppointment={handleConfirmation}
        />
      </div>

      {/* Payment Form Modal */}
      <PaymentFormModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        merchantUuid={servicesState.selectedLocationUuid || ""}
      />

      {/* Policy Acceptance Modal */}
      {showPolicyModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl border-2 border-[#F28C8C]/30">
              <div className="p-6 pb-3 border-b-2 border-[#F28C8C]/20 flex items-center justify-between">
                <h5 className="text-xl font-playfair font-bold text-[#B11C5F]">
                  Cancellation Policy
                </h5>
                <button
                  onClick={() => setShowPolicyModal(false)}
                  className="text-gray-500 hover:text-[#B11C5F] transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto">
                {bookingSummaryState.loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F28C8C] border-t-transparent mr-2"></div>
                    <span className="font-lato text-gray-600">Loading policy details...</span>
                  </div>
                ) : bookingSummaryState.data ? (
                  <div className="space-y-4 text-[#444444] font-lato whitespace-pre-line">
                    {bookingSummaryState.data.acceptance_message || (
                      <>
                        <p className="text-lg font-semibold">
                          Dear {getUserDisplayName()},
                        </p>

                        {bookingSummaryState.data.financial_summary && (
                          <>
                            <div className="space-y-2">
                              <p className="font-semibold text-[#B11C5F]">Services:</p>
                              {cart.map((item: any, index: number) => {
                                const serviceTotal = bookingSummaryState.data!.financial_summary?.booking?.service_total || 0;
                                const taxTotal = bookingSummaryState.data!.financial_summary?.booking?.tax_total || 0;
                                const itemPrice = item.price || 0;
                                const itemTax = serviceTotal > 0 ? (itemPrice / serviceTotal) * taxTotal : 0;
                                const itemTotal = itemPrice + itemTax;
                                return (
                                  <p key={index} className="pl-4">
                                    {item.name}: {itemTotal.toFixed(2)} (including tax)
                                  </p>
                                );
                              })}
                            </div>

                            <div className="pt-2">
                              <p className="font-semibold">
                                Total Booking Amount:{" "}
                                {bookingSummaryState.data.financial_summary.booking?.total_payable?.toFixed(2) || "0.00"}{" "}
                                (including tax)
                              </p>
                            </div>
                          </>
                        )}

                        <p className="pt-4">
                          By proceeding with the booking, you agree to the{" "}
                          {bookingSummaryState.data.policy_summary?.policy_name || "policy"} policy which includes:
                        </p>

                        {bookingSummaryState.data.financial_summary && (
                          <ol className="list-decimal pl-6 space-y-2">
                            <li>
                              Deposit Amount:{" "}
                              {bookingSummaryState.data.financial_summary.deposit?.amount?.toFixed(2) || "0.00"}
                            </li>
                            <li>
                              Cancellation Fee:{" "}
                              {bookingSummaryState.data.financial_summary.fees?.cancellation?.amount?.toFixed(2) || "0.00"}{" "}
                              {bookingSummaryState.data.financial_summary.fees?.cancellation?.applicable_till && (
                                <>applicable till {bookingSummaryState.data.financial_summary.fees.cancellation.applicable_till} minutes before appointment</>
                              )}
                            </li>
                            <li>
                              No-Show Fee:{" "}
                              {bookingSummaryState.data.financial_summary.fees?.no_show?.amount?.toFixed(2) || "0.00"}
                            </li>
                          </ol>
                        )}

                        {bookingSummaryState.data.financial_summary?.fees?.cancellation?.reason_required && (
                          <p className="pt-2 text-sm text-gray-600">
                            Please note that cancellation reason is required for cancellations.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                ) : bookingSummaryState.error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 font-lato">{bookingSummaryState.error}</p>
                    <p className="text-sm text-gray-500 mt-2">Please try again later.</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 font-lato">No policy information available.</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t-2 border-[#F28C8C]/20 bg-[#FFF6F8] flex justify-end space-x-3">
                <button
                  className="px-6 py-2 border-2 border-[#F28C8C]/30 rounded-xl text-[#B11C5F] hover:bg-[#F28C8C]/10 transition-colors font-lato font-medium"
                  onClick={() => setShowPolicyModal(false)}>
                  Cancel
                </button>
                <button
                  className="bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] hover:from-[#B11C5F] hover:to-[#F28C8C] text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 min-w-[100px] font-lato"
                  onClick={handlePolicyAccept}>
                  Accept
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default View;
