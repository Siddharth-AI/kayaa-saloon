"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { addToCart } from "@/store/slices/cartSlice";
import Image from "next/image";
import LeftPanel from "@/components/leftPanel/LeftPanel";
import BookingBottomBar from "@/saloon-services/BookingBottomBar";
import { setSelectedSlot } from "@/store/slices/uiSlice";
import serviceImage from "@/assets/kayaa-home/Kaya-Beauty.png";
import { IoCart } from "react-icons/io5";
import { FaAnglesRight } from "react-icons/fa6";
import { FaAnglesLeft } from "react-icons/fa6";
// --- Fly to Cart Animation Helper ---
// --- Enhanced Fly Card to Cart Animation ---
function flyCardToCart({
  cardElement,
  onComplete,
}: {
  cardElement: HTMLElement;
  onComplete?: () => void;
}) {
  const cartIcon = document.getElementById("cart-icon");
  if (!cartIcon || !cardElement) return;

  const startRect = cardElement.getBoundingClientRect();
  const endRect = cartIcon.getBoundingClientRect();

  // Deep clone the entire card
  const clonedCard = cardElement.cloneNode(true) as HTMLElement;

  // Set initial position and styling
  clonedCard.style.position = "fixed";
  clonedCard.style.zIndex = "9999";
  clonedCard.style.left = `${startRect.left}px`;
  clonedCard.style.top = `${startRect.top}px`;
  clonedCard.style.width = `${startRect.width}px`;
  clonedCard.style.height = `${startRect.height}px`;
  clonedCard.style.margin = "0";
  clonedCard.style.pointerEvents = "none";
  clonedCard.style.borderRadius = "12px";
  clonedCard.style.boxShadow = "0 8px 32px 0 rgba(242, 140, 140, 0.8)";
  clonedCard.style.transition = "all 0.8s cubic-bezier(.68,-0.55,.27,1.55)";

  // Add a glow effect
  clonedCard.style.outline = "2px solid #F28C8C";
  clonedCard.style.outlineOffset = "2px";

  document.body.appendChild(clonedCard);

  // Start animation after a small delay
  setTimeout(() => {
    clonedCard.style.left = `${endRect.left + endRect.width / 2 - 25}px`;
    clonedCard.style.top = `${endRect.top + endRect.height / 2 - 25}px`;
    clonedCard.style.width = "50px";
    clonedCard.style.height = "50px";
    clonedCard.style.opacity = "0.3";
    clonedCard.style.transform = "scale(0.3) rotate(5deg)";
  }, 10);

  // Remove cloned element after animation
  setTimeout(() => {
    if (document.body.contains(clonedCard)) {
      document.body.removeChild(clonedCard);
    }
    if (onComplete) onComplete();
  }, 850);
}

export default function Services() {
  const dispatch = useAppDispatch();
  const { allServices, loading, error, selectedLocationUuid } = useAppSelector(
    (state) => state.services
  );

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 8;

  // Get unique categories from services
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(allServices.map((service: any) => service.subcategory)),
    ];
    return [
      { name: "All", slug: null },
      ...uniqueCategories.map((cat) => ({ name: cat, slug: cat })),
    ];
  }, [allServices]);

  // Get price range from services
  const { minPrice, maxPrice } = useMemo(() => {
    if (allServices.length === 0) return { minPrice: 0, maxPrice: 1000 };
    const prices = allServices.map((s: any) => s.price);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, [allServices]);

  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  useEffect(() => {
    dispatch(setSelectedSlot(""));
  }, [dispatch]);

  const filteredProducts = allServices.filter((service: any) => {
    return (
      (!selectedCategory || service.subcategory === selectedCategory) &&
      (service.service.toLowerCase().includes(search.toLowerCase()) ||
        (service.subcategory || "")
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      service.price >= priceRange[0] &&
      service.price <= priceRange[1]
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / servicesPerPage);
  const showLoadMore =
    filteredProducts.length <= 20 && visibleProducts < filteredProducts.length;
  const showPagination = filteredProducts.length > 20;

  // Calculate displayed services based on pagination or load more
  const displayedServices = showPagination
    ? filteredProducts.slice(
        (currentPage - 1) * servicesPerPage,
        currentPage * servicesPerPage
      )
    : filteredProducts.slice(0, visibleProducts);

  // Update price range when services change
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    setVisibleProducts(8);
    setCurrentPage(1);
  }, [selectedCategory, search, priceRange]);

  const handleRange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = Number(e.target.value);
    setPriceRange((prev) =>
      idx === 0 ? [val, Math.max(val, prev[1])] : [Math.min(val, prev[0]), val]
    );
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Add to Cart with Animation ---
  const handleAdd = (service: any, e: React.MouseEvent<HTMLButtonElement>) => {
    // Find the closest card image or button for animation start
    const card = (e.target as HTMLElement).closest(
      ".service-card-animate"
    ) as HTMLElement;
    if (card) {
      const img = card.querySelector("img") as HTMLImageElement;
      if (img) {
        card.classList.add("card-shrink");
        setTimeout(() => card.classList.remove("card-shrink"), 200);

        // Animate cloned card to cart
        flyCardToCart({
          cardElement: card,
          onComplete: () => {
            console.log("Card animation completed!");
          },
        });
      } else {
        card.classList.add("card-shrink");
        setTimeout(() => card.classList.remove("card-shrink"), 200);

        // Animate cloned card to cart
        flyCardToCart({
          cardElement: card,
          onComplete: () => {
            console.log("Card animation completed!");
          },
        });
      }
    }

    // Add to cart logic (untouched)
    dispatch(
      addToCart({
        id: service.id,
        name: service.service,
        duration: Number.parseInt(service.service_time),
        price: service.price,
        category: service.subcategory,
        tags: [service.subcategory],
        vendor_location_uuid: selectedLocationUuid,
      })
    );
  };

  const handleLoadMore = () => {
    setVisibleProducts(filteredProducts.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fefaf4] to-pink-50 text-[#444444]">
      {/* Header */}
      <div
        className="w-full bg-gradient-to-br from-[#B11C5F] to-[#F28C8C] py-28 pl-11 pt-32 relative"
        style={{
          backgroundImage: "url('/images/service/service.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center bottom 90px",
          backgroundAttachment: "fixed",
          zIndex: 0,
        }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#C59D5F]/20 via-[#C59D5F]/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl pt-10 font-playfair font-bold tracking-wide text-shadow-[#F28C8C]/60 text-shadow-sm text-[#2C1810] drop-shadow-lg">
            SERVICES LIST
          </h1>
          <p className="dancing-script text-lg text-[#444] mt-2 italic">
            Discover our wellness & beauty experiences
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!selectedLocationUuid || loading ? (
          <div className="text-center py-12">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F28C8C]"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600">Error: {error}</div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 md:flex-row md:gap-14">
            {/* Sidebar */}
            <aside className="w-full md:w-[350px]">
              {/* Search */}
              <div className="pb-4 border-b border-[#F28C8C]/30">
                <form
                  className="flex border border-[#F28C8C]/30 rounded-2xl overflow-hidden bg-white shadow-md"
                  onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="search"
                    className="flex-1 px-4 py-3 outline-none bg-transparent text-[#444444] placeholder:text-[#C59D5F] font-lato"
                    placeholder="Type to search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-[#F28C8C] hover:bg-[#F28C8C]/90 text-white hover:from-[#B11C5F] hover:to-[#F28C8C] transition-all duration-300">
                    <span className="sr-only">Search</span>🔍
                  </button>
                </form>
              </div>

              {/* Categories */}
              <div className="my-6">
                <h2 className="font-playfair font-bold mb-4 text-[#B11C5F] text-xl">
                  CATEGORIES
                </h2>

                {/* Dropdown for small screens */}
                <div className="block md:hidden">
                  <select
                    value={selectedCategory || ""}
                    onChange={(e) =>
                      setSelectedCategory(e.target.value || null)
                    }
                    className="w-full px-4 py-3 bg-white text-[#B11C5F] font-medium outline-none rounded-xl border border-[#F28C8C]/30 text-sm shadow-sm">
                    {categories.map((cat) => (
                      <option
                        key={String(cat.slug ?? "all")}
                        value={
                          cat.slug !== null && cat.slug !== undefined
                            ? String(cat.slug)
                            : ""
                        }>
                        {String(cat.name)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* List for large screens */}
                <ul className="hidden md:block space-y-2 max-h-70 overflow-y-auto scrollbar-thin scrollbar-thumb-[#F28C8C] scrollbar-track-gray-100 pr-2 categories_scroll">
                  {categories.map((cat) => (
                    <li
                      key={
                        cat.slug !== null && cat.slug !== undefined
                          ? String(cat.slug)
                          : "all"
                      }>
                      <button
                        className={`text-left w-full px-3 py-2 rounded-xl transition-all duration-300 font-lato font-medium ${
                          selectedCategory === cat.slug
                            ? "bg-[#F28C8C] text-white shadow-md"
                            : "bg-white text-[#444444] hover:bg-[#fefaf4] hover:text-[#B11C5F] border border-[#F28C8C]/20"
                        }`}
                        onClick={() =>
                          setSelectedCategory(cat.slug as string | null)
                        }>
                        {String(cat.name)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range Filter */}
              <div className="py-6 border-y border-[#F28C8C]/30">
                <h2 className="font-playfair font-bold mb-4 text-[#B11C5F] text-xl">
                  PRICE RANGE
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange[0]}
                      onChange={(e) => handleRange(e, 0)}
                      className="w-full h-2 bg-[#fefaf4] border border-[#F28C8C]/30 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #F28C8C 0%, #C59D5F ${
                          ((priceRange[0] - minPrice) / (maxPrice - minPrice)) *
                          100
                        }%, #FFF6F8 ${
                          ((priceRange[0] - minPrice) / (maxPrice - minPrice)) *
                          100
                        }%, #FFF6F8 100%)`,
                      }}
                    />
                    <span className="text-sm text-[#B11C5F] font-bold bg-[#fefaf4] px-3 py-1 rounded-full border border-[#F28C8C]/20 text-center">
                      Rs{priceRange[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => handleRange(e, 1)}
                      className="w-full h-2 bg-[#fefaf4] border border-[#F28C8C]/30 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #F28C8C 0%, #C59D5F ${
                          ((priceRange[1] - minPrice) / (maxPrice - minPrice)) *
                          100
                        }%, #FFF6F8 ${
                          ((priceRange[1] - minPrice) / (maxPrice - minPrice)) *
                          100
                        }%, #FFF6F8 100%)`,
                      }}
                    />
                    <span className="text-sm text-[#B11C5F] font-bold bg-[#fefaf4] px-3 py-1 rounded-full border border-[#F28C8C]/20  text-center">
                      Rs{priceRange[1]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="sticky top-0 hidden md:block mt-6">
                <LeftPanel content={"summary"} />
              </div>
            </aside>

            <div className="flex flex-col">
              {/* Service Cards */}
              <div className="bg-gradient-to-r from-[#fefaf4] to-white rounded-2xl px-6 py-4 shadow-md font-lato font-semibold text-lg mb-6 text-[#B11C5F] border border-[#F28C8C]/20">
                We are providing a total of{" "}
                <span className="text-[#F28C8C] ml-1">
                  {filteredProducts.length}
                </span>{" "}
                services.
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {displayedServices.map((service: any, index: any) => (
                  <div
                    key={service.id}
                    className="service-card-animate relative group rounded-3xl bg-gradient-to-br from-white to-[#fefaf4] border border-[#F28C8C]/20 shadow-lg overflow-hidden transform transition-all duration-500  hover:shadow-2xl opacity-100"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}>
                    {/* Decorative floating circles */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#F28C8C]/20 to-transparent rounded-full transform translate-x-10 -translate-y-10 transition-transform duration-700 group-hover:scale-150"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#C59D5F]/20 to-transparent rounded-full transform -translate-x-8 translate-y-8 transition-transform duration-700 group-hover:scale-125"></div>

                    {/* Floating heart animation */}
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-2 h-2 bg-[#F28C8C] rounded-full animate-bounce"></div>
                    </div>

                    {/* Image section */}
                    <div className="relative overflow-hidden rounded-t-3xl h-48 sm:h-56">
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>

                      <Image
                        src={service.image || serviceImage}
                        alt={service.service}
                        width={400}
                        height={240}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                      />

                      {/* Price badge */}
                      <div className="absolute top-4 right-4 z-20 bg-[#C59D5F] px-1 py-1 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                        <span className="font-playfair font-bold text-white text-sm">
                          Rs {service.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Duration badge */}
                      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#F28C8C]/20 shadow-md">
                        <div className="flex items-center space-x-1 text-[#B11C5F]">
                          <div className="w-2 h-2 bg-[#F28C8C] rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium font-lato">
                            {service.service_time} min
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content section */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between h-52">
                      {/* Service title */}
                      <div className="mb-4">
                        <h3 className="font-playfair font-bold text-xl text-[#B11C5F] mb-2 leading-tight group-hover:text-[#F28C8C] transition-colors duration-300">
                          {service.service.length > 35
                            ? `${service.service.slice(0, 35)}...`
                            : service.service}
                        </h3>

                        {/* Subcategory */}
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-1 h-4 bg-gradient-to-b from-[#F28C8C] to-[#C59D5F] rounded-full"></div>
                          <span className="font-cormorant text-[#C59D5F] italic text-base">
                            {service.subcategory}
                          </span>
                        </div>
                      </div>

                      {/* Action section */}
                      <div className="flex items-center justify-start">
                        <button
                          className="group/btn relative px-6 py-3 bg-[#F28C8C] text-white font-lato font-semibold rounded-full shadow-lg hover:shadow-xl transform  active:scale-95 transition-all duration-300 hover:from-[#B11C5F] hover:to-[#F28C8C] overflow-hidden"
                          onClick={(e) => handleAdd(service, e)}>
                          {/* Button shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>

                          <div className="relative flex items-center space-x-2">
                            <span>Add</span>
                            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover/btn:rotate-12 transition-transform duration-300">
                              <IoCart className="text-xs" />
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F28C8C]/0 via-[#F28C8C]/5 to-[#C59D5F]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
                  </div>
                ))}
              </div>

              {/* Pagination or Load More */}
              {showPagination ? (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`md:px-4 px-2 py-2 rounded-full font-lato font-medium transition-all duration-300 ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white hover:from-[#B11C5F] hover:to-[#F28C8C] shadow-md hover:shadow-lg"
                    }`}>
                    <FaAnglesLeft />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-[#C59D5F]">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`md:px-4 px-2 py-1 rounded-full font-lato font-medium transition-all duration-300 ${
                            currentPage === page
                              ? "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white shadow-md"
                              : "bg-white text-[#444444] hover:bg-[#fefaf4] hover:text-[#B11C5F] border border-[#F28C8C]/20"
                          }`}>
                          {page}
                        </button>
                      </React.Fragment>
                    ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`md:px-4 px-2 py-2 rounded-full font-lato font-medium transition-all duration-300 ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white hover:from-[#B11C5F] hover:to-[#F28C8C] shadow-md hover:shadow-lg"
                    }`}>
                    <FaAnglesRight />
                  </button>
                </div>
              ) : showLoadMore ? (
                <div className="mt-8 flex justify-center mb-4 md:mb-0">
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 rounded-full bg-[#F28C8C] text-white font-lato font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-[#f28c8cd6] ">
                    Load More
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
      <BookingBottomBar />
    </div>
  );
}
