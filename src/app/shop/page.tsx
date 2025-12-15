// pages/shop/page.tsx
"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  fetchProducts,
  setSelectedCategory,
  setSearchQuery,
  selectFilteredProducts,
  selectCategories,
  selectProductsError,
  selectProductsLoading,
  selectCurrentFilters,
} from "@/store/slices/productsSlice";
import Image from "next/image";
import {
  Search,
  ChevronDown,
  Grid,
  List,
  ViewIcon,
  View,
  ShoppingBag,
} from "lucide-react";
import shopHeader from "@/assets/shop/shop_header.jpg";
import productImage from "@/assets/shop/product-image.png";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { IoCart } from "react-icons/io5";
import {
  ProductCardSkeleton,
  CategorySkeleton,
} from "@/components/common/Skeleton";

// Import the new action
import { addProductToCart } from "@/store/slices/cartSlice";
import { toastSuccess } from "@/components/common/toastService";
import ProductsCart from "@/components/leftPanel/ProductsCart";
import ShopBottomCart from "./ShopBottomCart";
interface Product {
  id: number;
  name: string;
  price: number;
  cost: number;
  brand: string;
  detail: string;
  image: string;
  measurement: number | null;
  unit: string;
  stock: number;
  item_code: string;
  is_public: boolean;
  images: string[];
}

// Updated CategoryDropdown Component with Main Category and Subcategory support
const CategoryDropdown = ({
  categories,
  selectedCategory,
  onCategorySelect,
  loading,
}: {
  categories: Array<{
    id: string | number;
    name: string;
    subcategories?: Array<{ id: string | number; name: string }>;
  }>;
  selectedCategory: string | number;
  onCategorySelect: (categoryId: string | number) => void;
  loading: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<
    Set<string | number>
  >(new Set());
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleCategory = (categoryId: string | number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const activeCategory = categories.find((cat) => cat.id === selectedCategory);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm flex items-center justify-between hover:border-pink-300 transition-all disabled:opacity-50">
        <span className="text-gray-700 font-medium">
          {loading ? "Loading..." : activeCategory?.name || "All Categories"}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && !loading && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          {/* All Categories Option */}
          <button
            onClick={() => {
              onCategorySelect("all");
              setIsOpen(false);
            }}
            className={`w-full px-4 py-3 text-left hover:bg-pink-50 transition-colors ${
              selectedCategory === "all"
                ? "bg-pink-100 text-pink-600 font-semibold"
                : "text-gray-700"
            }`}>
            All Categories
          </button>

          {/* Main Categories with Subcategories */}
          {categories.map((category) => (
            <div key={category.id} className="border-t border-gray-100">
              {/* Main Category */}
              <div className="flex items-center">
                <button
                  onClick={() => {
                    onCategorySelect(category.id);
                    setIsOpen(false);
                  }}
                  className={`flex-1 px-4 py-3 text-left hover:bg-pink-50 transition-colors ${
                    selectedCategory === category.id
                      ? "bg-pink-100 text-pink-600 font-semibold"
                      : "text-gray-700"
                  }`}>
                  {category.name}
                </button>

                {/* Expand/Collapse Button for Subcategories */}
                {category.subcategories &&
                  category.subcategories.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategory(category.id);
                      }}
                      className="px-3 py-3 hover:bg-gray-100">
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          expandedCategories.has(category.id)
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                  )}
              </div>

              {/* Subcategories */}
              {expandedCategories.has(category.id) &&
                category.subcategories &&
                category.subcategories.length > 0 && (
                  <div className="bg-gray-50">
                    {category.subcategories.map((subcategory) => (
                      <button
                        key={subcategory.id}
                        onClick={() => {
                          onCategorySelect(subcategory.id);
                          setIsOpen(false);
                        }}
                        className={`w-full px-8 py-2 text-left text-sm hover:bg-pink-50 transition-colors ${
                          selectedCategory === subcategory.id
                            ? "bg-pink-100 text-pink-600 font-semibold"
                            : "text-gray-600"
                        }`}>
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Custom Sort Dropdown Component
const SortDropdown = ({
  sortBy,
  onSortChange,
}: {
  sortBy: string;
  onSortChange: (sortValue: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Sort options
  const sortOptions = [
    { value: "shuffle", label: "Shuffle (Random)" },
    { value: "name", label: "Name A-Z" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
  ];

  const activeSortOption = sortOptions.find(
    (option) => option.value === sortBy
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-w-[180px] flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-orange-400 outline-none transition-all duration-200">
        <span className="text-gray-700 font-medium truncate">
          {activeSortOption?.label || "Shuffle (Random)"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSortChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                  sortBy === option.value
                    ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white hover:from-orange-500 hover:to-pink-500"
                    : "text-gray-700"
                }`}>
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function Products() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { selectedLocationUuid } = useAppSelector((state) => state.services);
  // Helper function to create URL slug from product name
  const createSlug = (name: string, id: number): string => {
    return `${name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")}-${id}`;
  };

  // Navigate to product page with slug
  const handleViewProduct = (product: Product) => {
    const slug = createSlug(product.name, product.id);
    console.log("Navigating to:", `/shop/${slug}`);
    router.push(`/shop/${slug}`);
  };

  // ADD after your imports
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

    const clonedCard = cardElement.cloneNode(true) as HTMLElement;
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
    clonedCard.style.outline = "2px solid #F28C8C";
    clonedCard.style.outlineOffset = "2px";

    document.body.appendChild(clonedCard);

    setTimeout(() => {
      clonedCard.style.left = `${endRect.left + endRect.width / 2 - 25}px`;
      clonedCard.style.top = `${endRect.top + endRect.height / 2 - 25}px`;
      clonedCard.style.width = "50px";
      clonedCard.style.height = "50px";
      clonedCard.style.opacity = "0.3";
      clonedCard.style.transform = "scale(0.3) rotate(5deg)";
    }, 10);

    setTimeout(() => {
      if (document.body.contains(clonedCard)) {
        document.body.removeChild(clonedCard);
      }
      if (onComplete) onComplete();
    }, 850);
  }

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Prevent modal from opening

    // Get the product card element for animation
    const card = (e.target as HTMLElement).closest(".group") as HTMLElement;

    if (card) {
      // Add shrink animation
      card.style.transform = "scale(0.95)";
      setTimeout(() => {
        card.style.transform = "";
      }, 200);

      // Fly to cart animation
      flyCardToCart({
        cardElement: card,
        onComplete: () => {
          console.log("Product flew to cart successfully!");
        },
      });
    }

    dispatch(
      addProductToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        cost: product.cost,
        brand: product.brand,
        detail: product.detail,
        image: product.image,
        measurement: product.measurement,
        unit: product.unit,
        stock: product.stock,
        item_code: product.item_code,
        quantity: 1,
      })
    );
    toastSuccess(`🛒 Added ${product.name} to cart!`);

    // console.log("Product added to cart:", product.name);
  };

  // Redux state with proper selectors
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const filteredProducts = useAppSelector(selectFilteredProducts);
  const categoryOptions = useAppSelector(selectCategories);
  const currentFilters = useAppSelector(selectCurrentFilters);

  // Local state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("shuffle");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedDesktopCategories, setExpandedDesktopCategories] = useState<
    Set<string | number>
  >(new Set());

  const productsPerPage = 12;

  // Track previous location to detect changes
  const [previousLocation, setPreviousLocation] = useState<string | null>(null);

  // Fetch products when location changes
  useEffect(() => {
    if (selectedLocationUuid) {
      // If location changed, fetch new products
      if (previousLocation !== selectedLocationUuid) {
        dispatch(fetchProducts(selectedLocationUuid));
        setPreviousLocation(selectedLocationUuid);
      }
    }
  }, [dispatch, selectedLocationUuid, previousLocation]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [currentFilters.selectedCategory, currentFilters.searchQuery]);

  // Sort and paginate products with memoization
  const sortedProducts = useMemo(() => {
    if (!Array.isArray(filteredProducts)) return [];

    const sorted = [...filteredProducts];

    // Sort products
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => (a?.price || 0) - (b?.price || 0));
        break;
      case "price-high":
        sorted.sort((a, b) => (b?.price || 0) - (a?.price || 0));
        break;
      case "name":
        sorted.sort((a, b) => (a?.name || "").localeCompare(b?.name || ""));
        break;
      default:
        // Keep original order instead of shuffling
        break;
    }

    return sorted;
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const displayedProducts = sortedProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Get default product image
  const getProductImage = (product: Product) => {
    // Check if product exists
    if (!product) {
      return productImage;
    }

    // First, check the images array
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0 &&
      product.images[0] &&
      product.images[0] !== "undefined" &&
      product.images[0] !== "null" &&
      product.images[0].trim() !== ""
    ) {
      return product.images[0];
    }

    // Then, check the single image field
    if (
      product.image &&
      product.image !== "undefined" &&
      product.image !== "null" &&
      product.image.trim() !== ""
    ) {
      return product.image;
    }

    // Return placeholder if no valid image found
    return productImage;
  };

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setSearchQuery(value));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Error: {error}</p>
          <button
            onClick={() => {
              if (selectedLocationUuid) {
                dispatch(fetchProducts(selectedLocationUuid));
              }
            }}
            className="mt-4 px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-50">
      {/* Header Section */}
      <div className="w-full relative py-28 pl-11 pt-32 overflow-hidden group">
        <div className="absolute inset-0">
          <Image
            src={shopHeader}
            alt="Shop background"
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

        <div className="absolute top-16 right-24 w-5 h-5 bg-[#FFF6F8]/30 rounded-full animate-bounce-slow blur-sm" />
        <div className="absolute top-40 right-16 w-3 h-3 bg-[#F28C8C]/50 rounded-full animate-pulse delay-1000 blur-sm" />
        <div className="absolute bottom-32 right-40 w-4 h-4 bg-white/20 rounded-full animate-bounce-slow delay-2000 blur-sm" />
        <div className="absolute top-1/2 right-8 w-2 h-2 bg-[#C59D5F]/60 rounded-full animate-pulse delay-1500 blur-sm" />

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFF6F8]/60 to-transparent animate-shimmer" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F28C8C]/80 to-transparent animate-shimmer delay-1000" />

        <div className="absolute left-0 top-1/4 w-1 h-32 bg-gradient-to-b from-transparent via-[#FFF6F8]/40 to-transparent animate-shimmer delay-500" />
        <div className="absolute right-0 bottom-1/4 w-1 h-24 bg-gradient-to-t from-transparent via-[#F28C8C]/50 to-transparent animate-shimmer delay-1500" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 transform transition-all duration-1000 ease-out">
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-r from-[#FFF6F8]/10 via-white/5 to-[#F28C8C]/15 blur-2xl rounded-3xl animate-pulse-glow" />

            <h1 className="text-4xl lg:text-5xl pt-10 font-playfair font-bold tracking-wide relative z-20 transform transition-all duration-1000 ease-out animate-slide-up">
              <span className="text-white animate-gradient-x drop-shadow-lg text-shadow-sm">
                LUXURY BOUTIQUE
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-[#FFF6F8] via-[white] to-[#FFF6F8] animate-expand-width shadow-lg" />
              <div className="absolute -bottom-3 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-[#C59D5F]/60 to-transparent animate-expand-width delay-500" />
            </h1>

            <p className="dancing-script text-xl lg:text-2xl text-[#FFF6F8] mt-4 italic relative z-20 animate-fade-in-up delay-500 opacity-0 drop-shadow-md">
              🛍️ Indulge in premium wellness & beauty treasures
            </p>

            <p className="font-lato text-sm text-[#FFF6F8]/80 mt-2 relative z-20 animate-fade-in-up delay-700 opacity-0 tracking-wider uppercase">
              Exclusive Collections • Expert Curation • Uncompromising Quality
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

        {/* Product & Shopping Themed Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
          {/* Beauty & Cosmetics Icons */}
          <div className="absolute top-20 left-20 text-[#FFF6F8]/40 animate-pulse delay-1000 text-2xl">
            💄
          </div>
          <div className="absolute top-32 right-32 text-[#F28C8C]/50 animate-bounce-slow delay-2000 text-xl">
            🧴
          </div>
          <div className="absolute bottom-40 left-40 text-white/30 animate-pulse delay-1500 text-2xl">
            🛍️
          </div>
          <div className="absolute bottom-20 right-20 text-[#C59D5F]/40 animate-bounce-slow delay-500 text-xl">
            💅
          </div>

          {/* Additional Beauty Products */}
          <div className="absolute top-1/3 left-1/6 text-[#FFF6F8]/35 animate-float delay-3000 text-lg">
            🧖‍♀️
          </div>
          <div className="absolute top-60 right-1/5 text-[#F28C8C]/45 animate-pulse delay-2500 text-xl">
            🧴
          </div>
          <div className="absolute bottom-1/3 right-1/3 text-white/35 animate-bounce-slow delay-1800 text-lg">
            🎀
          </div>
          <div className="absolute top-3/4 left-1/3 text-[#C59D5F]/40 animate-float-delay-2 text-xl">
            🌸
          </div>

          {/* Skincare & Wellness */}
          <div className="absolute top-1/2 left-1/12 text-[#FFF6F8]/30 animate-pulse delay-4000 text-lg">
            🧼
          </div>
          <div className="absolute bottom-1/5 right-1/6 text-[#F28C8C]/40 animate-float delay-3500 text-xl">
            🛒
          </div>
          <div className="absolute top-1/6 right-1/2 text-white/25 animate-bounce-slow delay-4500 text-lg">
            💋
          </div>
          <div className="absolute bottom-2/3 left-2/3 text-[#C59D5F]/35 animate-pulse delay-5000 text-lg">
            🧽
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#FFF6F8]/5 to-transparent z-[1] animate-pulse-slow delay-2000" />
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-5 md:flex-row md:gap-6 md:justify-between">
          {/* Left Sidebar */}
          <aside className="w-full md:w-[350px]">
            {/* Categories Section */}
            <div className="mb-4 bg-white rounded-xl shadow-lg">
              <h2 className=" font-playfair font-playfair font-bold text-xl bg-gradient-to-r from-[#B11C5F] to-[#F28C8C] text-white p-4 rounded-t-2xl">
                CATEGORIES
              </h2>

              <div className="block md:hidden">
                <CategoryDropdown
                  categories={categoryOptions}
                  selectedCategory={currentFilters.selectedCategory}
                  onCategorySelect={(categoryId) =>
                    dispatch(setSelectedCategory(categoryId))
                  }
                  loading={loading}
                />
              </div>

              <ul className=" my-1 hidden md:block max-h-70 overflow-y-auto scrollbar-thin scrollbar-thumb-[#F28C8C] scrollbar-track-gray-100 categories_scroll">
                {loading ? (
                  <div className="space-y-2">
                    {[...Array(6)].map((_, i) => (
                      <CategorySkeleton key={i} />
                    ))}
                  </div>
                ) : (
                  [...categoryOptions].map((cat) => (
                    <li key={cat.id}>
                      <button
                        className={`flex items-center justify-between w-full text-left px-5 py-2 transition-all duration-300 font-lato font-medium ${
                          currentFilters.selectedCategory === cat.id
                            ? "bg-[#F28C8C] text-white shadow-md"
                            : "bg-white text-[#444444] hover:bg-[#fefaf4] hover:text-[#B11C5F]"
                        }`}
                        onClick={() => {
                          dispatch(setSelectedCategory(cat.id));
                          if (
                            cat.subcategories &&
                            cat.subcategories.length > 0
                          ) {
                            const newExpanded = new Set(
                              expandedDesktopCategories
                            );
                            if (newExpanded.has(cat.id)) {
                              newExpanded.delete(cat.id);
                            } else {
                              newExpanded.add(cat.id);
                            }
                            setExpandedDesktopCategories(newExpanded);
                          }
                        }}>
                        <span>{cat.name}</span>
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <ChevronDown
                            className={`w-4 h-4 text-gray-500 transition-transform ${
                              expandedDesktopCategories.has(cat.id)
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        )}
                      </button>

                      {expandedDesktopCategories.has(cat.id) &&
                        cat.subcategories &&
                        cat.subcategories.length > 0 && (
                          <ul className="bg-gray-50">
                            {cat.subcategories.map(
                              (subcategory: {
                                id: string | number;
                                name: string;
                              }) => (
                                <li key={subcategory.id}>
                                  <button
                                    className={`w-full text-left px-8 py-2 text-sm transition-all duration-300 font-lato ${
                                      currentFilters.selectedCategory ===
                                      subcategory.id
                                        ? "bg-[#F28C8C] text-white shadow-md"
                                        : "bg-gray-50 text-[#666666] hover:bg-[#fefaf4] hover:text-[#B11C5F]"
                                    }`}
                                    onClick={() =>
                                      dispatch(
                                        setSelectedCategory(subcategory.id)
                                      )
                                    }>
                                    {subcategory.name}
                                  </button>
                                </li>
                              )
                            )}
                          </ul>
                        )}
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="hidden md:block">
              <ProductsCart />
            </div>
          </aside>

          {/* Right Content Area */}
          <div className="flex-1">
            {/* Products Section Title and Count */}
            <h2 className=" font-playfair font-playfair font-bold text-xl bg-gradient-to-r from-[#B11C5F] to-[#F28C8C] text-white p-4 rounded-t-2xl">
              {currentFilters.selectedCategory === "all"
                ? "All Products"
                : categoryOptions.find(
                    (c) => c.id === currentFilters.selectedCategory
                  )?.name || "Products"}
            </h2>
            <div className="flex-1 flex flex-col bg-white p-5">
              {/* Top Controls - Sort and View Mode */}
              <div className="mb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                  {/* Search Section */}
                  <div className="flex-1">
                    <input
                      type="search"
                      className="border border-[#F28C8C]/30 rounded-lg overflow-hidden bg-white w-full px-4 py-3 outline-none text-[#444444] placeholder:text-[#C59D5F] font-lato focus:ring-2 focus:ring-[#F28C8C]/30 focus:border-[#F28C8C] transition-all duration-200"
                      placeholder="Search products..."
                      value={currentFilters.searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>

                  {/* Controls Container */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-2">
                    {/* Sort Dropdown */}
                    <div className="flex-1 sm:flex-initial">
                      <SortDropdown
                        sortBy={sortBy}
                        onSortChange={(sortValue) => setSortBy(sortValue)}
                      />
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-3 sm:p-2.5 transition-all duration-200 ${
                          viewMode === "grid"
                            ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg"
                            : "text-gray-600 hover:bg-gray-200"
                        }`}>
                        <Grid className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-3 sm:p-2.5 transition-all duration-200 ${
                          viewMode === "list"
                            ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg"
                            : "text-gray-600 hover:bg-gray-200"
                        }`}>
                        <List className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Content */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-full flex items-center justify-center mb-6">
                      <ShoppingBag className="w-12 h-12 text-[#B11C5F]" />
                    </div>
                    <h3 className="text-2xl font-playfair font-bold text-[#B11C5F] mb-3">
                      No Products Available
                    </h3>
                    <p className="text-[#444444] font-lato mb-6 max-w-md">
                      We couldn't find any products for this location. Please
                      try selecting a different location or check back later.
                    </p>
                    <button
                      onClick={() => {
                        if (selectedLocationUuid) {
                          dispatch(fetchProducts(selectedLocationUuid));
                        }
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white rounded-lg hover:shadow-lg transition-all duration-300 font-lato font-semibold">
                      Refresh Products
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Products Grid */}
                  <div
                    className={`grid gap-6 mb-8 ${
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1"
                    }`}>
                    {displayedProducts.map((product) => (
                      <div
                        key={product?.id || Math.random()}
                        className={`bg-white rounded-sm shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group ${
                          viewMode === "list" ? "flex" : ""
                        }`}>
                        {/* Product Image */}
                        <div
                          className={`relative cursor-pointer ${
                            viewMode === "list" ? "w-56 h-56" : "aspect-square"
                          } overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200`}
                          onClick={() => handleViewProduct(product)}>
                          <Image
                            src={getProductImage(product)}
                            alt={product?.name || "Product"}
                            fill
                            className=" object-center group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />

                          {/* Stock Badge */}
                          {product?.stock && product.stock < 10 && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                              {product.stock} left
                            </div>
                          )}

                          {/* Price Badge */}
                          <div className="absolute top-3 right-3 bg-[#C59D5F] text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                            ₹{product?.price || 0}
                          </div>

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                        </div>

                        {/* Product Info */}
                        <div
                          className={`p-5 cursor-pointer ${
                            viewMode === "list"
                              ? "flex-1 flex flex-col justify-between"
                              : ""
                          }`}
                          onClick={() => handleViewProduct(product)}>
                          <div>
                            <h3 className="font-playfair font-bold text-xl text-[#B11C5F] mb-2 leading-tight group-hover:text-[#F28C8C] transition-colors duration-300">
                              {product?.name.length > 20
                                ? `${product?.name.slice(0, 20)}...`
                                : product?.name}
                            </h3>

                            <div
                              className={`${
                                viewMode === "list"
                                  ? "flex flex-col justify-between"
                                  : "flex items-center justify-between mb-4"
                              }`}>
                              <div className="flex items-center space-x-2">
                                <div className="w-1 h-4 bg-gradient-to-b from-[#F28C8C] to-[#C59D5F] rounded-full"></div>
                                <span className="font-cormorant text-[#C59D5F] italic text-base">
                                  {product?.brand ? product.brand : "shehnaz"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {product?.measurement && (
                                  <span className="font-cormorant text-sm text-[#C59D5F] px-2 py-1">
                                    {product.measurement} {product?.unit || ""}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <button
                              className="group/btn relative px-3 py-2 bg-[#F28C8C] text-white font-lato font-semibold rounded-full shadow-lg hover:shadow-xl transform  active:scale-95 transition-all duration-300 hover:from-[#B11C5F] hover:to-[#F28C8C] overflow-hidden"
                              onClick={(e) => handleAddToCart(e, product)}>
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
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center">
                      <div className="flex items-center gap-2 bg-white rounded-2xl shadow-lg p-2">
                        <button
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className={`md:px-4 px-2 py-2 rounded-full font-lato font-medium transition-all duration-300 ${
                            currentPage === 1
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white hover:from-[#B11C5F] hover:to-[#F28C8C] shadow-md hover:shadow-lg"
                          }`}>
                          <FaAnglesLeft />
                        </button>

                        {Array.from(
                          { length: Math.min(totalPages, 7) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 7) {
                              pageNum = i + 1;
                            } else if (currentPage <= 4) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 3) {
                              pageNum = totalPages - 6 + i;
                            } else {
                              pageNum = currentPage - 3 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`md:px-4 px-2 py-1 rounded-full font-lato font-medium transition-all duration-300 ${
                                  currentPage === pageNum
                                    ? "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white shadow-md"
                                    : "bg-white text-[#444444] hover:bg-[#fefaf4] hover:text-[#B11C5F] border border-[#F28C8C]/20"
                                }`}>
                                {pageNum}
                              </button>
                            );
                          }
                        )}

                        <button
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className={`md:px-4 px-2 py-2 rounded-full font-lato font-medium transition-all duration-300 ${
                            currentPage === totalPages
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white hover:from-[#B11C5F] hover:to-[#F28C8C] shadow-md hover:shadow-lg"
                          }`}>
                          <FaAnglesRight />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-49">
        <ShopBottomCart />
      </div>
    </div>
  );
}
