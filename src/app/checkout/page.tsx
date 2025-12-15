"use client";

import { useState, useEffect } from "react";
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
  
  const { products } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const { selectedLocationUuid } = useAppSelector((state) => state.services);

  useEffect(() => {
    if (selectedLocationUuid && !checkoutLocationUuid) {
      setCheckoutLocationUuid(selectedLocationUuid);
    }
  }, [selectedLocationUuid, checkoutLocationUuid]);

  useEffect(() => {
    if (checkoutLocationUuid && selectedLocationUuid && checkoutLocationUuid !== selectedLocationUuid) {
      toastError("Location changed. Please restart checkout.");
      router.push("/shop");
    }
  }, [selectedLocationUuid, checkoutLocationUuid, router]);

  useEffect(() => {
    if (!user) {
      toastError("Please login to continue");
      dispatch(openModal("login"));
      router.push("/");
      return;
    }

    if (products.length === 0 && currentStep === 1) {
      toastError("Your cart is empty");
      router.push("/shop");
    }
  }, [user, products, router, dispatch, currentStep]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF6F8] to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F28C8C]"></div>
      </div>
    );
  }

  if (products.length === 0 && currentStep === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF6F8] to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F28C8C]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-50">
      {/* Header Banner */}
      <div className="w-full relative py-20 pl-11 pt-24 overflow-hidden group">
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

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-r from-[#FFF6F8]/10 via-white/5 to-[#F28C8C]/15 blur-2xl rounded-3xl animate-pulse-glow" />

            <h1 className="text-3xl lg:text-4xl pt-6 font-playfair font-bold tracking-wide relative z-20">
              <span className="text-white animate-gradient-x drop-shadow-lg text-shadow-sm">
                CHECKOUT
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-[#FFF6F8] via-[white] to-[#FFF6F8] animate-expand-width shadow-lg" />
            </h1>

            <p className="dancing-script text-lg lg:text-xl text-[#FFF6F8] mt-3 italic relative z-20 animate-fade-in-up delay-500 opacity-0 drop-shadow-md">
              ✨ Complete your purchase securely
            </p>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
          <div className="absolute top-16 left-16 text-[#FFF6F8]/40 animate-pulse delay-1000 text-xl">
            🛍️
          </div>
          <div className="absolute top-24 right-24 text-[#F28C8C]/50 animate-bounce-slow delay-2000 text-lg">
            💳
          </div>
          <div className="absolute bottom-32 left-32 text-white/30 animate-pulse delay-1500 text-xl">
            ✓
          </div>
          <div className="absolute bottom-16 right-16 text-[#C59D5F]/40 animate-bounce-slow delay-500 text-lg">
            🎁
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
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
