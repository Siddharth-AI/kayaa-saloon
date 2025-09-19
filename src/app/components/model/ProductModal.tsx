import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
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
} from "lucide-react";
import { IoCart } from "react-icons/io5";
import productImage from "@/assets/shop/product-image.png";

// Product type definition
interface Product {
  name: string;
  price: number;
  cost?: number;
  detail?: string;
  stock?: number;
  brand?: string;
  images?: string[];
}

// Product Modal Component
interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Regular");
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  // Sample product images (you can replace with actual product images)
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

  // Sample sizes and variants
  const sizes = ["Small", "Regular", "Large", "Family Pack"];
  const benefits = [
    "Premium Quality Formula",
    "Dermatologically Tested",
    "Natural Ingredients",
    "Professional Grade",
    "Cruelty Free",
  ];

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity((prev) => Math.min(prev + 1, product?.stock || 10));
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 group">
          <X className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Images */}
          <div className="lg:w-1/2 p-8">
            {/* Main Product Image */}
            <div className="relative aspect-square mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <Image
                src={productImages[selectedImageIndex]}
                alt={product.name}
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
                        prev === 0 ? (productImages?.length || 1) - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200">
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === (productImages?.length || 1) - 1 ? 0 : prev + 1
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
                      alt={`${product.name} ${index + 1}`}
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
                  {product.brand || "Kaya Beauty"}
                </span>
              </div>

              <h1 className="font-playfair font-bold text-3xl text-[#B11C5F] mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
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
                  ₹{product.price}
                </span>
                {product.cost && product.cost > product.price && (
                  <span className="font-lato text-xl text-gray-500 line-through">
                    ₹{product.cost}
                  </span>
                )}
                {product.cost && product.cost > product.price && (
                  <span className="bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {Math.round(
                      ((product.cost - product.price) / product.cost) * 100
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
                {product.detail ||
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
                    disabled={quantity >= (product.stock || 10)}>
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
                      (product.stock || 0) > 10
                        ? "bg-green-400"
                        : (product.stock || 0) > 0
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    }`}
                  />
                  <span className="font-lato text-sm text-gray-700">
                    {(product.stock || 0) > 10
                      ? "In Stock"
                      : (product.stock || 0) > 0
                      ? `Only ${product.stock} left`
                      : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button className="flex-1 group/btn relative px-8 py-4 bg-[#F28C8C] text-white font-lato font-bold rounded-2xl shadow-lg hover:shadow-xl transform active:scale-95 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="hidden md:block">Add to Cart</span>
                  <span className="md:hidden">Add</span>
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
  );
};

export default ProductModal;
