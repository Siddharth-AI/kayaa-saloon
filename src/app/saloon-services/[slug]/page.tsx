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
      .replace(/&amp;/g, "&") // Convert HTML entities
      .replace(/[^a-z0-9\s&]/g, "") // Remove special chars except & and spaces
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .trim();
  };

  // Get single service or category services
  const serviceData = useMemo(() => {
    console.log("Debug - slug:", slug);
    console.log("Debug - allServices length:", allServices.length);

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
    } else {
      // Try multiple matching strategies
      const decodedSlug = decodeURIComponent(slug).replace(/&amp;/g, "&");

      // Strategy 1: Exact slug match with proper URL decoding
      const decodedSlugForMatch = decodeURIComponent(slug);
      let singleService = allServices.find((s: any) => {
        const serviceSlug = s.service.toLowerCase().replace(/\s+/g, "-");
        console.log(
          "Comparing:",
          serviceSlug,
          "with",
          decodedSlugForMatch.toLowerCase()
        );
        return serviceSlug === decodedSlugForMatch.toLowerCase();
      });

      // Strategy 2: Normalized match
      if (!singleService) {
        const normalizedSlug = normalizeString(decodedSlug);
        console.log("Normalized slug:", normalizedSlug);

        singleService = allServices.find((s: any) => {
          const normalizedServiceName = normalizeString(s.service);
          console.log("Normalized service:", normalizedServiceName);
          return normalizedServiceName === normalizedSlug;
        });
      }

      // Strategy 3: Partial match
      if (!singleService) {
        singleService = allServices.find((s: any) => {
          const serviceName = s.service.toLowerCase();
          const slugName = slug.toLowerCase().replace(/-/g, " ");
          return (
            serviceName.includes(slugName) || slugName.includes(serviceName)
          );
        });
      }

      if (singleService) {
        console.log("Found service:", singleService.service);
        return {
          type: "single",
          service: {
            ...singleService,
            categoryImage: getCategoryImage(singleService.subcategory),
          },
        };
      }

      // If not found by service name, try category
      const services = allServices
        .filter(
          (service: any) =>
            service.subcategory.toLowerCase() === categoryName?.toLowerCase()
        )
        .map((service: any) => ({
          ...service,
          categoryImage: getCategoryImage(service.subcategory),
        }));
      return services.length > 0
        ? {
            type: "category",
            services,
            categoryName,
          }
        : null;
    }
  }, [allServices, isServiceId, serviceId, serviceName, categoryName, slug]);

  const handleAdd = (service: any) => {
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
      <div className="min-h-screen bg-gradient-to-br from-[#fefaf4] to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F28C8C] mx-auto mb-4"></div>
          <p className="text-[#B11C5F] font-lato">Loading service details...</p>
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
      {/* Header */}
      <div className="w-full relative py-28 pl-11 pt-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/service/service.webp"
            alt="Services background"
            fill
            className="object-cover brightness-75"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-6 text-white/80 font-lato text-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/")}
                className="hover:text-white transition-colors">
                Home
              </button>
              <span>/</span>
              <button
                onClick={() => router.push("/saloon-services")}
                className="hover:text-white transition-colors">
                Services
              </button>
              {serviceData.type === "single" && (
                <>
                  <span>/</span>
                  <span className="text-white">
                    {serviceData.service.service}
                  </span>
                </>
              )}
              {serviceData.type === "category" && (
                <>
                  <span>/</span>
                  <span className="text-white capitalize">
                    {serviceData.categoryName}
                  </span>
                </>
              )}
            </div>
          </nav>

          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-white hover:text-[#F28C8C] transition-colors">
            <FiArrowLeft className="w-5 h-5" />
            <span className="font-lato">Back</span>
          </button>

          <h1 className="text-4xl lg:text-5xl font-playfair font-bold text-white mb-4 capitalize">
            {serviceData.type === "single"
              ? serviceData.service.service
              : `${serviceData.categoryName} Services`}
          </h1>
          <p className="text-white/90 font-lato text-lg">
            {serviceData.type === "single"
              ? `₹${serviceData.service.price} • ${serviceData.service.service_time} min`
              : `${serviceData.services.length} services available`}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {serviceData.type === "single" ? (
          // Single Service View
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="relative h-64 md:h-80">
                <Image
                  src={
                    serviceData.service.image ||
                    serviceData.service.categoryImage ||
                    serviceImage
                  }
                  alt={serviceData.service.service}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute top-4 right-4 bg-[#C59D5F] px-4 py-2 rounded-full shadow-lg">
                  <span className="font-playfair font-bold text-white text-lg">
                    ₹{serviceData.service.price}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                    <FiClock className="w-4 h-4 text-[#B11C5F]" />
                    <span className="text-sm font-medium text-[#B11C5F]">
                      {serviceData.service.service_time} min
                    </span>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                    <FiStar className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-[#B11C5F]">
                      4.8
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="font-playfair font-bold text-3xl text-[#B11C5F] mb-4">
                      {serviceData.service.service}
                    </h2>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-[#C59D5F] font-cormorant italic text-lg">
                        {serviceData.service.subcategory}
                      </span>
                      <span className="text-[#B11C5F] font-lato font-semibold">
                        {serviceData.service.service_time} minutes
                      </span>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-playfair font-bold text-xl text-[#B11C5F] mb-3">
                        Description
                      </h3>
                      <p className="text-gray-600 font-lato leading-relaxed">
                        {serviceData.service.description ||
                          `Experience our premium ${serviceData.service.service.toLowerCase()} service. Our expert professionals use high-quality products and advanced techniques to ensure you get the best results. This service is designed to enhance your natural beauty and leave you feeling refreshed and confident.`}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-playfair font-bold text-xl text-[#B11C5F] mb-3">
                        What's Included
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-gray-600 font-lato">
                          <FiCheck className="w-4 h-4 text-green-500" />
                          Professional consultation
                        </li>
                        <li className="flex items-center gap-2 text-gray-600 font-lato">
                          <FiCheck className="w-4 h-4 text-green-500" />
                          Premium products
                        </li>
                        <li className="flex items-center gap-2 text-gray-600 font-lato">
                          <FiCheck className="w-4 h-4 text-green-500" />
                          Expert styling
                        </li>
                        <li className="flex items-center gap-2 text-gray-600 font-lato">
                          <FiCheck className="w-4 h-4 text-green-500" />
                          Aftercare advice
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="bg-gradient-to-br from-[#fefaf4] to-pink-50 rounded-2xl p-6 mb-6">
                      <h3 className="font-playfair font-bold text-xl text-[#B11C5F] mb-4">
                        Service Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-lato">
                            Duration:
                          </span>
                          <span className="font-lato font-semibold text-[#B11C5F]">
                            {serviceData.service.service_time} minutes
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-lato">
                            Price:
                          </span>
                          <span className="font-playfair font-bold text-xl text-[#C59D5F]">
                            ₹{serviceData.service.price}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-lato">
                            Category:
                          </span>
                          <span className="font-lato font-semibold text-[#B11C5F] capitalize">
                            {serviceData.service.subcategory}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-lato">
                            Rating:
                          </span>
                          <div className="flex items-center gap-1">
                            <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-lato font-semibold text-[#B11C5F]">
                              4.8 (124 reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-[#F28C8C]/20 rounded-2xl p-6">
                      <h3 className="font-playfair font-bold text-xl text-[#B11C5F] mb-4">
                        Why Choose This Service?
                      </h3>
                      <ul className="space-y-2 text-gray-600 font-lato">
                        <li>• Expert professionals with years of experience</li>
                        <li>• Premium quality products and equipment</li>
                        <li>• Personalized service tailored to your needs</li>
                        <li>• Relaxing and comfortable environment</li>
                        <li>• Satisfaction guaranteed</li>
                      </ul>
                    </div>
                  </div>
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
