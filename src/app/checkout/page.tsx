"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { Check, ShoppingBag, MapPin, CreditCard, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CartReview from "./components/CartReview";
import AddressStep from "./components/AddressStep";
import CheckoutStep from "./components/CheckoutStep";
import { openModal } from "@/store/slices/modalSlice";
import { toastError } from "@/components/common/toastService";

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

  // Set initial location
  useEffect(() => {
    if (selectedLocationUuid && !checkoutLocationUuid) {
      setCheckoutLocationUuid(selectedLocationUuid);
    }
  }, [selectedLocationUuid, checkoutLocationUuid]);

  // Detect location change during checkout
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

    // Only redirect if cart is empty and we're not coming from order success
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
    <div className="min-h-screen bg-gradient-to-br from-[#FFF6F8] to-pink-50 py-8 pt-28">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#B11C5F] mb-2 sm:mb-4">
            Checkout
          </h1>
          <p className="text-sm sm:text-base text-[#C59D5F] font-lato">
            Complete your purchase in 3 easy steps
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto px-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
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
                    className={`h-1 flex-1 mx-1 sm:mx-4 transition-all duration-300 ${
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
