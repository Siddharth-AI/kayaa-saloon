"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { Check, ShoppingBag, MapPin, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import CartReview from "./components/CartReview";
import AddressStep from "./components/AddressStep";
import CheckoutStep from "./components/CheckoutStep";
import { openModal } from "@/store/slices/modalSlice";
import { toastError } from "@/components/common/toastService";
import { initializeCartWithAuth } from "@/store/slices/cartSlice";
import shopHeader from "@/assets/shop/shop_header.jpg";

const steps = [
  { id: 1, name: "Cart Review", icon: ShoppingBag },
  { id: 2, name: "Address", icon: MapPin },
  { id: 3, name: "Checkout", icon: CreditCard },
];

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutLocationUuid, setCheckoutLocationUuid] = useState<string | null>(null);
  const [hasCheckedCart, setHasCheckedCart] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { products } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const { selectedLocationUuid } = useAppSelector((state) => state.services);
  const { isHydrated } = useAppSelector((state) => state.cart);

  useEffect(() => {
    if (selectedLocationUuid && !checkoutLocationUuid) {
      setCheckoutLocationUuid(selectedLocationUuid);
      dispatch(initializeCartWithAuth(selectedLocationUuid));
    }
  }, [selectedLocationUuid, checkoutLocationUuid, dispatch]);

  useEffect(() => {
    if (!user) {
      toastError("Please login to continue");
      dispatch(openModal("login"));
      router.push("/");
      return;
    }
  }, [user, router, dispatch]);

  // Handle auth errors from API calls
  useEffect(() => {
    const handleAuthError = () => {
      if (!user) {
        toastError("Your session has expired. Please login again.");
        dispatch(openModal("login"));
        router.push("/");
      }
    };
    
    // Listen for storage events (when token is removed in another tab)
    window.addEventListener('storage', handleAuthError);
    return () => window.removeEventListener('storage', handleAuthError);
  }, [user, router, dispatch]);

  useEffect(() => {
    if (isHydrated && !hasCheckedCart) {
      setHasCheckedCart(true);
      if (products.length === 0) {
        toastError("Your cart is empty");
        router.push("/shop");
      }
    }
  }, [isHydrated, products.length, router, hasCheckedCart]);

  // Scroll to content section when step changes
  useEffect(() => {
    if (contentRef.current) {
      const headerHeight = 100; // Approximate height of hero header (py-28 + pt-32)
      const scrollPosition = contentRef.current.offsetTop - headerHeight;
      window.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: "smooth",
      });
    }
  }, [currentStep]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF6F8] to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F28C8C]"></div>
      </div>
    );
  }

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF6F8] to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F28C8C]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-50">
      {/* Header Section */}
      <div className="w-full relative py-14 pl-4 sm:pl-6 md:pl-8 lg:pl-11 pt-18 md:pt-20 lg:pt-24 xl:pt-32 overflow-hidden group">
        <div className="absolute inset-0">
          <Image
            src={shopHeader}
            alt="Checkout background"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center filter brightness-75 transition-transform duration-[8000ms] ease-out group-hover:scale-105"
            style={{ zIndex: 1 }}
          />
        </div>

        <div className="absolute inset-0 z-[2] animate-pulse-slow" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent z-[3]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent z-[4]" />

        {/* Floating Decoration Elements */}
        <div className="absolute top-20 right-28 w-6 h-6 bg-[#FFF6F8]/30 rounded-full animate-bounce-slow blur-sm" />
        <div className="absolute top-44 right-20 w-4 h-4 bg-[#F28C8C]/50 rounded-full animate-pulse delay-1000 blur-sm" />
        <div className="absolute bottom-36 right-44 w-5 h-5 bg-white/20 rounded-full animate-bounce-slow delay-2000 blur-sm" />
        <div className="absolute top-1/3 right-12 w-3 h-3 bg-[#C59D5F]/60 rounded-full animate-pulse delay-1500 blur-sm" />
        <div className="absolute bottom-20 right-16 w-2 h-2 bg-[#FFF6F8]/40 rounded-full animate-bounce-slow delay-500 blur-sm" />

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFF6F8]/60 to-transparent animate-shimmer" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F28C8C]/80 to-transparent animate-shimmer delay-1000" />

        {/* Side Accent Lines */}
        <div className="absolute left-0 top-1/3 w-1 h-40 bg-gradient-to-b from-transparent via-[#FFF6F8]/40 to-transparent animate-shimmer delay-500" />
        <div className="absolute right-0 bottom-1/3 w-1 h-32 bg-gradient-to-t from-transparent via-[#F28C8C]/50 to-transparent animate-shimmer delay-1500" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 transform transition-all duration-1000 ease-out h-full flex items-end lg:pb-4">
          <div className="relative w-full mt-16 md:mt-12">
            <div className="absolute -inset-6 bg-gradient-to-r from-[#FFF6F8]/10 via-white/5 to-[#F28C8C]/15 blur-2xl rounded-3xl animate-pulse-glow" />

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-playfair font-bold tracking-wide relative z-20 transform transition-all duration-1000 ease-out animate-slide-up">
              <span className="text-white animate-gradient-x drop-shadow-lg text-shadow-sm">
                CHECKOUT
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-[#FFF6F8] via-[white] to-[#FFF6F8] animate-expand-width shadow-lg" />
              <div className="absolute -bottom-3 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-[#C59D5F]/60 to-transparent animate-expand-width delay-500" />
            </h1>

            <p className="dancing-script text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl text-[#FFF6F8] mt-2 sm:mt-3 md:mt-4 italic relative z-20 animate-fade-in-up delay-500 opacity-0 drop-shadow-md px-2">
              ✨ Complete your purchase securely
            </p>

            <p className="font-lato text-xs sm:text-xs md:text-sm lg:text-sm text-[#FFF6F8]/80 mt-1.5 sm:mt-2 md:mt-2.5 relative z-20 animate-fade-in-up delay-700 opacity-0 tracking-wider uppercase px-2 hidden sm:block">
              Secure Payment • Fast Delivery • 100% Satisfaction
            </p>

            <div className="absolute -top-4 -left-4 w-10 h-10 border-2 border-[#FFF6F8]/30 rounded-full animate-spin-slow" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-2 border-[#F28C8C]/40 rounded-full animate-spin-slow-reverse" />

            <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-[#FFF6F8]/20 rounded-tl-2xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-[#F28C8C]/30 rounded-br-2xl animate-pulse delay-1000" />
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          <div className="absolute top-1/5 left-1/5 w-1 h-1 bg-[#FFF6F8]/70 rounded-full animate-float" />
          <div className="absolute top-1/4 right-1/3 w-1.5 h-1.5 bg-[#F28C8C]/60 rounded-full animate-float-delay-1" />
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-[#C59D5F]/50 rounded-full animate-float-delay-2" />
          <div className="absolute top-2/3 right-1/5 w-1 h-1 bg-white/60 rounded-full animate-float-delay-3" />
          <div className="absolute bottom-1/3 left-1/4 w-0.5 h-0.5 bg-[#FFF6F8]/80 rounded-full animate-float delay-2000" />
          <div className="absolute top-1/2 right-1/2 w-1 h-1 bg-[#F28C8C]/40 rounded-full animate-float-delay-1 delay-1000" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
          <div className="absolute top-20 left-20 text-[#FFF6F8]/40 animate-pulse delay-1000">
            ✨
          </div>
          <div className="absolute top-32 right-32 text-[#F28C8C]/50 animate-bounce-slow delay-2000">
            💫
          </div>
          <div className="absolute bottom-40 left-40 text-white/30 animate-pulse delay-1500">
            ⭐
          </div>
          <div className="absolute bottom-20 right-20 text-[#C59D5F]/40 animate-bounce-slow delay-500">
            ✨
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#FFF6F8]/5 to-transparent z-[1] animate-pulse-slow delay-2000" />
      </div>

      <div ref={contentRef} className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center max-w-4xl mx-auto px-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentStep > step.id
                        ? "bg-green-500"
                        : currentStep === step.id
                        ? "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F]"
                        : "bg-gray-300"
                    }`}>
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    ) : (
                      <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    )}
                  </motion.div>
                  <span
                    className={`mt-1 sm:mt-2 text-xs sm:text-sm font-lato font-medium text-center px-1 ${
                      currentStep >= step.id ? "text-[#B11C5F]" : "text-gray-400"
                    }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-12 sm:w-20 mx-2 sm:mx-4 transition-all duration-300 ${
                      currentStep > step.id
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}>
            {currentStep === 1 && (
              <CartReview onNext={() => setCurrentStep(2)} />
            )}
            {currentStep === 2 && (
              <AddressStep
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 3 && (
              <CheckoutStep onBack={() => setCurrentStep(2)} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
