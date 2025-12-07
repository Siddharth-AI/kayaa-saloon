"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Star,
  Minus,
  Plus,
  Heart,
  Share2,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  Award,
  ChevronRight,
  Home,
} from "lucide-react";
import { IoCart } from "react-icons/io5";
import productImage from "@/assets/shop/product-image.png";
import shopHeader from "@/assets/shop/shop_header.jpg";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { addProductToCart } from "@/store/slices/cartSlice";
import { toastSuccess } from "@/components/common/toastService";
import {
  selectAllProducts,
  fetchProducts,
  selectProductsLoading,
} from "@/store/slices/productsSlice";

interface Product {
  id: number;
  name: string;
  price: number;
  cost?: number;
  detail?: string;
  stock?: number;
  brand?: string;
  images?: string[];
  image?: string;
  measurement?: number | null;
  unit?: string;
  item_code?: string;
}

// Helper function to create URL slug from product name
const createSlug = (name: string, id: number): string => {
  return `${name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")}-${id}`;
};

// Helper function to extract ID from slug
const extractIdFromSlug = (slug: string): number => {
  const parts = slug.split("-");
  const lastPart = parts[parts.length - 1];
  return parseInt(lastPart) || 0;
};

// Breadcrumb Component
const Breadcrumb = ({ product }: { product: Product | null }) => {
  const router = useRouter();

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <button
        onClick={() => router.push("/")}
        className="flex items-center hover:text-[#B11C5F] transition-colors">
        <Home className="w-4 h-4 mr-1" />
        Home
      </button>
      <ChevronRight className="w-4 h-4" />
      <button
        onClick={() => router.push("/shop")}
        className="hover:text-[#B11C5F] transition-colors">
        Shop
      </button>
      <ChevronRight className="w-4 h-4" />
      <span className="text-[#B11C5F] font-medium truncate">
        {product?.name || "Product"}
      </span>
    </nav>
  );
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const slug = params.slug as string;
  const productId = extractIdFromSlug(slug);

  // Get all products from Redux store
  const allProducts = useAppSelector(selectAllProducts);
  const loading = useAppSelector(selectProductsLoading);
  const { selectedLocationUuid } = useAppSelector((state) => state.services);
  const product = allProducts.find((p) => p.id === productId) || null;

  // Fetch products if not loaded or product not found
  useEffect(() => {
    if (selectedLocationUuid && !loading) {
      // Only fetch if we don't have products or the specific product is not found
      if (allProducts.length === 0 || (productId && !product)) {
        dispatch(fetchProducts(selectedLocationUuid));
      }
    }
  }, [
    dispatch,
    selectedLocationUuid,
    allProducts.length,
    product,
    productId,
    loading,
  ]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Reset quantity when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
    }
  }, [product]);

  // Show loading state while fetching
  if (loading && !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F28C8C] mx-auto mb-4"></div>
          <p className="text-[#B11C5F] font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  // Show not found only after loading is complete
  if (!loading && !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#B11C5F] mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="px-6 py-3 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // Get valid images
  const validImages =
    product?.images?.filter(
      (img) =>
        img &&
        typeof img === "string" &&
        img !== "undefined" &&
        img !== "null" &&
        img.trim() !== "" &&
        img.startsWith("http")
    ) || [];

  const productImages =
    validImages.length > 0
      ? validImages
      : [productImage, productImage, productImage, productImage];

  const benefits = [
    "Premium Quality Formula",
    "Dermatologically Tested",
    "Natural Ingredients",
    "Professional Grade",
    "Cruelty Free",
  ];

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      const maxStock = product?.stock || 0;
      setQuantity((prev) => Math.min(prev + 1, maxStock));
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addProductToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        cost: product.cost || product.price,
        brand: product.brand || "Kaya Beauty",
        detail: product.detail || "",
        image: product.image || product.images?.[0] || "",
        measurement: product.measurement || null,
        unit: product.unit || "piece",
        stock: product.stock || 10,
        item_code: product.item_code || `ITEM-${product.id}`,
        quantity: quantity,
      })
    );

    toastSuccess(`🛒 Added ${quantity} ${product.name} to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-50">
      {/* Header Banner */}
      <div className="w-full relative py-20 pl-11 pt-24 overflow-hidden group">
        <div className="absolute inset-0">
          <Image
            src={shopHeader}
            alt="Product background"
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
                PRODUCT DETAILS
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-[#FFF6F8] via-[white] to-[#FFF6F8] animate-expand-width shadow-lg" />
            </h1>

            <p className="dancing-script text-lg lg:text-xl text-[#FFF6F8] mt-3 italic relative z-20 animate-fade-in-up delay-500 opacity-0 drop-shadow-md">
              ✨ Discover premium beauty excellence
            </p>
          </div>
        </div>

        {/* Floating Beauty Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
          <div className="absolute top-16 left-16 text-[#FFF6F8]/40 animate-pulse delay-1000 text-xl">
            💄
          </div>
          <div className="absolute top-24 right-24 text-[#F28C8C]/50 animate-bounce-slow delay-2000 text-lg">
            🧴
          </div>
          <div className="absolute bottom-32 left-32 text-white/30 animate-pulse delay-1500 text-xl">
            🛍️
          </div>
          <div className="absolute bottom-16 right-16 text-[#C59D5F]/40 animate-bounce-slow delay-500 text-lg">
            💅
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-[#B11C5F] hover:bg-[#FFF6F8]">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button> */}

        {/* Breadcrumb */}
        <Breadcrumb product={product} />

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Images */}
            <div className="lg:w-1/2 p-8">
              {/* Main Product Image */}
              <div className="relative aspect-square mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <Image
                  src={productImages[selectedImageIndex]}
                  alt={product?.name || "Product"}
                  fill
                  className="object-cover object-center scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Image Navigation Arrows */}
                {productImages && productImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev === 0
                            ? (productImages?.length || 1) - 1
                            : prev - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200">
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev === (productImages?.length || 1) - 1
                            ? 0
                            : prev + 1
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200">
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              {productImages && productImages.length > 1 && (
                <div className="flex gap-3 justify-center">
                  {productImages.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                        selectedImageIndex === index
                          ? "ring-2 ring-[#F28C8C] shadow-lg"
                          : "hover:ring-2 hover:ring-[#F28C8C]/50"
                      }`}>
                      <Image
                        src={image}
                        alt={`${product?.name || "Product"} ${index + 1}`}
                        fill
                        className="object-cover object-top"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Product Details */}
            <div className="lg:w-1/2 p-8 lg:pl-4">
              {/* Product Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#F28C8C] to-[#C59D5F] rounded-full"></div>
                  <span className="font-cormorant text-[#C59D5F] italic text-lg">
                    {product?.brand || "Kaya Beauty"}
                  </span>
                </div>

                <h1 className="font-playfair font-bold text-3xl text-[#B11C5F] mb-3 leading-tight">
                  {product?.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
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
                    ₹{product?.price}
                  </span>
                  {product?.cost && product?.cost > (product?.price || 0) && (
                    <span className="font-lato text-xl text-gray-500 line-through">
                      ₹{product?.cost}
                    </span>
                  )}
                  {product?.cost && product?.cost > (product?.price || 0) && (
                    <span className="bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {Math.round(
                        (((product?.cost || 0) - (product?.price || 0)) /
                          (product?.cost || 1)) *
                          100
                      )}
                      % OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Product Description */}
              <div className="mb-6">
                <h3 className="font-playfair font-semibold text-xl text-[#B11C5F] mb-3">
                  Product Details
                </h3>
                <p className="font-lato text-gray-700 leading-relaxed mb-4">
                  {product?.detail ||
                    "Experience the ultimate in luxury beauty with our premium formulated product. Carefully crafted with natural ingredients to enhance your natural beauty and provide long-lasting results. Perfect for all skin types and designed to deliver professional spa-quality results at home."}
                </p>

                {/* Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#F28C8C]" />
                      <span className="font-lato text-sm text-gray-700">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity and Stock */}
              <div className="flex items-center gap-6 mb-6">
                <div>
                  <label className="font-playfair font-semibold text-lg text-[#B11C5F] block mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(false)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                      disabled={quantity <= 1}>
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-lato font-semibold text-lg min-w-[3ch] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(true)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                      disabled={quantity >= (product?.stock || 0)}>
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stock Status */}
                <div>
                  <span className="font-playfair font-semibold text-lg text-[#B11C5F] block mb-2">
                    Stock Status
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        (product?.stock || 0) > 10
                          ? "bg-green-400"
                          : (product?.stock || 0) > 0
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                    />
                    <span className="font-lato text-sm text-gray-700">
                      {(product?.stock || 0) > 10
                        ? "In Stock"
                        : (product?.stock || 0) > 0
                        ? `Only ${product?.stock} left`
                        : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!product?.stock || (product?.stock || 0) <= 0}
                  className="flex-1 group/btn relative px-8 py-4 bg-[#F28C8C] text-white font-lato font-bold rounded-2xl shadow-lg hover:shadow-xl transform active:scale-95 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-center space-x-3">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="hidden md:block">
                      Add {quantity} to Cart
                    </span>
                    <span className="md:hidden">Add ({quantity})</span>
                  </div>
                </button>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-4 rounded-2xl transition-all duration-200 ${
                    isWishlisted
                      ? "bg-gray-100 hover:bg-gray-200 text-[#F28C8C]"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}>
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </button>

                <button className="p-4 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors duration-200">
                  <Share2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Additional Info */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Truck className="w-6 h-6 text-[#F28C8C]" />
                    <div>
                      <p className="font-lato font-semibold text-sm text-gray-800">
                        Free Shipping
                      </p>
                      <p className="font-lato text-xs text-gray-600">
                        On orders over ₹999
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <RotateCcw className="w-6 h-6 text-[#F28C8C]" />
                    <div>
                      <p className="font-lato font-semibold text-sm text-gray-800">
                        Easy Returns
                      </p>
                      <p className="font-lato text-xs text-gray-600">
                        30-day return policy
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Shield className="w-6 h-6 text-[#F28C8C]" />
                    <div>
                      <p className="font-lato font-semibold text-sm text-gray-800">
                        Secure Payment
                      </p>
                      <p className="font-lato text-xs text-gray-600">
                        100% secure checkout
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the helper function for use in other components
export { createSlug };
