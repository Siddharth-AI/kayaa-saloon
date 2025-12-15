"use client";

import React, { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  addServiceToCart,
  initializeCartWithAuth,
} from "@/store/slices/cartSlice";
import { setSelectedSlot } from "@/store/slices/uiSlice";
import Image from "next/image";

import BookingBottomBar from "@/saloon-services/BookingBottomBar";
import serviceImage from "@/assets/kayaa-home/Kaya-Beauty.png";
import { IoCart } from "react-icons/io5";
import { FiArrowLeft, FiClock, FiStar, FiCheck } from "react-icons/fi";
import { toastSuccess } from "@/components/common/toastService";
import { ServiceCardSkeleton } from "@/components/common/Skeleton";

const categoryImages: { [key: string]: string[] } = {
  haircuts: [
    "/images/service/service-card/haircut1.avif",
    "/images/service/service-card/haircut2.avif",
  ],
  "hair color": [
    "/images/service/service-card/haircolor1.avif",
    "/images/service/service-card/haircolor2.avif",
  ],
  "make up": [
    "/images/service/service-card/makeup1.avif",
    "/images/service/service-card/makeup2.avif",
  ],
  beard: [
    "/images/service/service-card/beard1.avif",
    "/images/service/service-card/beard2.avif",
  ],
  waxing: [
    "/images/service/service-card/waxing1.avif",
    "/images/service/service-card/waxing2.avif",
  ],
  facial: [
    "/images/service/service-card/facial-1.avif",
    "/images/service/service-card/facial-2.avif",
  ],
};

const getCategoryImage = (subcategory: string) => {
  const images = categoryImages[subcategory.toLowerCase()] || [serviceImage];
  return images[Math.floor(Math.random() * images.length)];
};

export default function ServicePage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { allServices, selectedLocationUuid, loading } = useAppSelector(
    (state) => state.services
  );
  const { services: cartServices } = useAppSelector((state) => state.cart);

  const slug = params.slug as string;

  // Check if slug is a number (service ID) or string (category/service name)
  const isServiceId = !isNaN(Number(slug));
  const serviceId = isServiceId ? Number(slug) : null;
  const serviceName = !isServiceId ? slug?.replace(/-/g, " ") : null;
  const categoryName = !isServiceId ? slug?.replace(/-/g, " ") : null;

  useEffect(() => {
    if (selectedLocationUuid) {
      dispatch(initializeCartWithAuth(selectedLocationUuid));
    }
    dispatch(setSelectedSlot(""));
  }, [selectedLocationUuid, dispatch]);

  // Helper function to normalize strings for comparison
  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .replace(/&amp;/g, "&")
      .replace(/[^a-z0-9]/g, "-") // Replace all non-alphanumeric with hyphen
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
      .trim();
  };

  // Get single service or category services
  const serviceData = useMemo(() => {
    if (isServiceId) {
      const service = allServices.find((s: any) => s.id === serviceId);
      return service
        ? {
            type: "single",
            service: {
              ...service,
              categoryImage: getCategoryImage(service.subcategory),
            },
          }
        : null;
    }

    const normalizedSlug = normalizeString(decodeURIComponent(slug));

    // Find service by normalized name
    const singleService = allServices.find((s: any) => 
      normalizeString(s.service) === normalizedSlug
    );

    if (singleService) {
      return {
        type: "single",
        service: {
          ...singleService,
          categoryImage: getCategoryImage(singleService.subcategory),
        },
      };
    }

    // Try category match
    const services = allServices
      .filter((service: any) =>
        service.subcategory.toLowerCase() === categoryName?.toLowerCase()
      )
      .map((service: any) => ({
        ...service,
        categoryImage: getCategoryImage(service.subcategory),
      }));

    return services.length > 0
      ? { type: "category", services, categoryName }
      : null;
  }, [allServices, isServiceId, serviceId, categoryName, slug]);

  const handleAdd = (service: any) => {
    const isAlreadyAdded = cartServices.some((s: any) => s.id === service.id);

    if (isAlreadyAdded) {
      toastSuccess(`✓ ${service.service} is already in cart!`);
      return;
    }

    dispatch(
      addServiceToCart({
        id: service.id,
        name: service.service,
        duration: parseInt(service.service_time || "30"),
        price: service.price,
        category: service.subcategory,
        tags: [service.subcategory],
        vendor_location_uuid: selectedLocationUuid,
      })
    );
    toastSuccess(`🛒 Added ${service.service} to cart!`);
  };

  // Show loading state while fetching data
  if (loading || (!serviceData && allServices.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fefaf4] to-pink-50">
        <div className="w-full h-64 bg-gray-200 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <ServiceCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fefaf4] to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-playfair text-[#B11C5F] mb-4">
            {isServiceId
              ? "Service Not Found"
              : "Service or Category Not Found"}
          </h1>
          <button
            onClick={() => router.push("/saloon-services")}
            className="px-6 py-3 bg-[#F28C8C] text-white rounded-full font-lato">
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fefaf4] to-pink-50 text-[#444444]">
      {/* Header Banner */}
      <div className="w-full relative py-20 pl-11 pt-24 overflow-hidden group">
        <div className="absolute inset-0">
          <Image
            src="/images/service/service.webp"
            alt="Services background"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center filter brightness-75 transition-transform duration-[8000ms] ease-out group-hover:scale-105"
            style={{
              zIndex: 1,
            }}
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
                SERVICE DETAILS
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-[#FFF6F8] via-[white] to-[#FFF6F8] animate-expand-width shadow-lg" />
            </h1>

            <p className="dancing-script text-lg lg:text-xl text-[#FFF6F8] mt-3 italic relative z-20 animate-fade-in-up delay-500 opacity-0 drop-shadow-md">
              ✨ Premium salon excellence
            </p>
          </div>
        </div>

        {/* Floating Beauty Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
          <div className="absolute top-16 left-16 text-[#FFF6F8]/40 animate-pulse delay-1000 text-xl">
            💄
          </div>
          <div className="absolute top-24 right-24 text-[#F28C8C]/50 animate-bounce-slow delay-2000 text-lg">
            ✂️
          </div>
          <div className="absolute bottom-32 left-32 text-white/30 animate-pulse delay-1500 text-xl">
            💅
          </div>
          <div className="absolute bottom-16 right-16 text-[#C59D5F]/40 animate-bounce-slow delay-500 text-lg">
            🧴
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center hover:text-[#B11C5F] transition-colors">
            <span>Home</span>
          </button>
          <span>/</span>
          <button
            onClick={() => router.push("/saloon-services")}
            className="hover:text-[#B11C5F] transition-colors">
            Services
          </button>
          {serviceData.type === "single" && (
            <>
              <span>/</span>
              <span className="text-[#B11C5F] font-medium truncate">
                {serviceData.service.service}
              </span>
            </>
          )}
          {serviceData.type === "category" && (
            <>
              <span>/</span>
              <span className="text-[#B11C5F] font-medium truncate capitalize">
                {serviceData.categoryName}
              </span>
            </>
          )}
        </nav>

        {serviceData.type === "single" ? (
          // Single Service View
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left Side - Image */}
              <div className="lg:w-1/2 p-8">
                <div className="relative aspect-square mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image
                    src={
                      serviceData.service.image ||
                      serviceData.service.categoryImage ||
                      serviceImage
                    }
                    alt={serviceData.service.service}
                    fill
                    className="object-cover object-center scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                  />
                </div>
              </div>

              {/* Right Side - Details */}
              <div className="lg:w-1/2 p-8 lg:pl-4">
                {/* Service Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#F28C8C] to-[#C59D5F] rounded-full"></div>
                    <span className="font-cormorant text-[#C59D5F] italic text-lg">
                      {serviceData.service.subcategory}
                    </span>
                  </div>

                  <h1 className="font-playfair font-bold text-3xl text-[#B11C5F] mb-3 leading-tight">
                    {serviceData.service.service}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < 4
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-lato">
                      4.8 (127 reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-playfair font-bold text-4xl text-[#B11C5F]">
                      ₹{serviceData.service.price}
                    </span>
                    <span className="bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {serviceData.service.service_time} min
                    </span>
                  </div>
                </div>

                {/* Service Description */}
                <div className="mb-6">
                  <h3 className="font-playfair font-semibold text-xl text-[#B11C5F] mb-3">
                    About This Service
                  </h3>
                  <p className="font-lato text-gray-700 leading-relaxed mb-4">
                    {serviceData.service.description ||
                      `Experience our premium ${serviceData.service.service.toLowerCase()} service. Our expert professionals use high-quality products and advanced techniques to ensure you get the best results. This service is designed to enhance your natural beauty and leave you feeling refreshed and confident.`}
                  </p>

                  {/* What's Included */}
                  <div className="mb-4">
                    <h4 className="font-playfair font-semibold text-lg text-[#B11C5F] mb-2">
                      What's Included
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <FiCheck className="w-4 h-4 text-green-500" />
                        <span className="font-lato text-sm text-gray-700">
                          Professional consultation
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiCheck className="w-4 h-4 text-green-500" />
                        <span className="font-lato text-sm text-gray-700">
                          Premium products
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiCheck className="w-4 h-4 text-green-500" />
                        <span className="font-lato text-sm text-gray-700">
                          Expert styling
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiCheck className="w-4 h-4 text-green-500" />
                        <span className="font-lato text-sm text-gray-700">
                          Aftercare advice
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={() => handleAdd(serviceData.service)}
                    className="w-full group/btn relative px-8 py-4 bg-[#F28C8C] text-white font-lato font-bold rounded-2xl shadow-lg hover:shadow-xl transform active:scale-95 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                    <div className="relative flex items-center justify-center space-x-3">
                      <IoCart className="w-5 h-5" />
                      <span>Book Service</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Category Services View
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {serviceData.services.map((service: any, index: number) => (
              <div
                key={service.id}
                className="relative group rounded-3xl bg-white shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500"
                style={{ animationDelay: `${index * 100}ms` }}>
                <div className="relative overflow-hidden h-48 sm:h-56">
                  <Image
                    src={service.image || service.categoryImage || serviceImage}
                    alt={service.service}
                    width={400}
                    height={240}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute top-4 right-4 bg-[#C59D5F] px-3 py-1 rounded-full shadow-lg">
                    <span className="font-playfair font-bold text-white text-sm">
                      ₹{service.price}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1.5 rounded-full">
                    <span className="text-sm font-medium text-[#B11C5F]">
                      {service.service_time} min
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-playfair font-bold text-xl text-[#B11C5F] mb-2">
                    {service.service}
                  </h3>
                  <p className="text-[#C59D5F] italic mb-4 font-cormorant">
                    {service.subcategory}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-lato text-gray-600">
                        4.8
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        router.push(`/saloon-services/${service.id}`)
                      }
                      className="px-4 py-2 bg-[#F28C8C] text-white font-lato font-semibold rounded-full hover:bg-[#B11C5F] transition-all duration-300 text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-49">
        <BookingBottomBar />
      </div>
    </div>
  );
}
