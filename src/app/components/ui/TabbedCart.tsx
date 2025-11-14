"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  X,
  Trash2,
  ArrowRight,
  IndianRupee,
  Calendar,
  Plus,
  Minus,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import {
  removeFromCart,
  removeServiceFromCart,
  removeProductFromCart,
  updateProductQuantity,
} from "@/store/slices/cartSlice";
import ClientOnly from "../common/ClientOnly";

export default function TabbedCart() {
  const [showCart, setShowCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"services" | "products">(
    "services"
  );
  const cartRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  // Get cart data from Redux
  const { services, products, items, isHydrated } = useAppSelector(
    (state) => state.cart
  );

  // Close cart on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (cartRef.current && !cartRef.current.contains(target)) {
        setShowCart(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate totals
  const servicesTotal = services.reduce(
    (sum: any, item: any) => sum + item.price,
    0
  );
  const productsTotal = products.reduce(
    (sum: any, item: any) => sum + item.price * item.quantity,
    0
  );
  const oldItemsTotal = items.reduce(
    (sum: any, item: any) => sum + item.price,
    0
  );

  // Total items count for badge
  const totalItemsCount = services.length + products.length + items.length;

  // Handle remove functions
  const handleRemoveService = (index: number) => {
    dispatch(removeServiceFromCart(index));
  };

  const handleRemoveProduct = (productId: number) => {
    dispatch(removeProductFromCart(productId));
  };

  const handleRemoveOldItem = (index: number) => {
    dispatch(removeFromCart(index));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    dispatch(updateProductQuantity({ id: productId, quantity }));
  };

  return (
    <div className="relative" ref={cartRef}>
      {/* Enhanced Cart Button */}
      <button
        onClick={() => setShowCart((prev) => !prev)}
        className="group relative p-2 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-[#FFF6F8] transition-all duration-300 hover:scale-110"
        id="cart-icon">
        <ShoppingBag className="w-5 h-5 text-[#B11C5F] group-hover:text-[#F28C8C] transition-colors duration-300" />

        {/* Cart Count Badge */}
        <ClientOnly>
          {isHydrated && totalItemsCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xs font-bold">
                {totalItemsCount}
              </span>
            </div>
          )}
        </ClientOnly>

        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      {/* Enhanced Cart Popup */}
      {showCart && (
        <div className="absolute -right-4 top-full mt-5 w-72 sm:w-96 bg-gradient-to-br from-[#FFF6F8] to-white backdrop-blur-md border border-[#F28C8C]/20 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-top-5 duration-300">
          {/* Header with Tabs */}
          <div className="border-b border-[#F28C8C]/20 bg-gradient-to-r from-[#F28C8C]/10 to-[#C59D5F]/10 rounded-t-2xl">
            {/* Close button */}
            <div className="flex justify-between items-center p-4 pb-2">
              <h3 className="font-playfair text-lg font-bold text-[#B11C5F]">
                Cart
              </h3>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 rounded-lg hover:bg-white/50 transition-colors duration-300 group">
                <X className="w-4 h-4 text-[#B11C5F] group-hover:text-[#F28C8C] transition-colors duration-300" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex px-4 pb-2">
              <button
                onClick={() => setActiveTab("services")}
                className={`flex-1 py-2 px-3 flex items-center justify-center gap-2 font-lato font-semibold text-sm rounded-lg transition-all duration-300 ${
                  activeTab === "services"
                    ? "bg-[#F28C8C] text-white shadow-md"
                    : "text-[#B11C5F] hover:bg-white/50"
                }`}>
                <Calendar className="w-4 h-4" />
                Services ({services.length + items.length})
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`flex-1 py-2 px-3 flex items-center justify-center gap-2 font-lato font-semibold text-sm rounded-lg transition-all duration-300 ${
                  activeTab === "products"
                    ? "bg-[#F28C8C] text-white shadow-md"
                    : "text-[#B11C5F] hover:bg-white/50"
                }`}>
                <ShoppingBag className="w-4 h-4" />
                Products ({products.length})
              </button>
            </div>
          </div>

          {/* Cart Content */}
          <div className="max-h-80 overflow-y-auto p-2">
            {activeTab === "services" ? (
              // Services Tab
              <div className="space-y-2">
                {services.length === 0 && items.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-[#B11C5F]" />
                    </div>
                    <h4 className="font-playfair text-[#B11C5F] font-semibold mb-2">
                      No services selected
                    </h4>
                    <p className="font-lato text-sm text-[#444444]">
                      Add services to book appointments
                    </p>
                  </div>
                ) : (
                  <>
                    {/* New Services */}
                    {services.map((service: any, index: any) => (
                      <div
                        key={`service-${service.id}-${index}`}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-all duration-300 group border border-transparent hover:border-[#F28C8C]/20">
                        <div className="flex-1">
                          <h4 className="font-lato font-medium text-[#B11C5F] text-sm">
                            {service.name}
                          </h4>
                          <p className="font-cormorant text-xs text-[#C59D5F] italic">
                            Service • {service.duration} min
                          </p>
                          {service.timeSlot && (
                            <p className="text-xs text-[#444444]">
                              ⏰ {service.timeSlot}
                            </p>
                          )}
                          <div className="flex items-center gap-1 mt-1">
                            <IndianRupee className="w-4 h-4 text-[#B11C5F]" />
                            <p className="font-lato font-bold text-[#444444]">
                              {service.price}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveService(index)}
                          className="p-2 rounded-lg hover:bg-red-50 text-[#444444] hover:text-red-500 transition-all duration-300 group/trash">
                          <Trash2 className="w-4 h-4 group-hover/trash:scale-110 transition-transform duration-300" />
                        </button>
                      </div>
                    ))}

                    {/* Old Items (backward compatibility) */}
                    {items.map((item: any, index: any) => (
                      <div
                        key={`item-${index}`}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-all duration-300 group border border-transparent hover:border-[#F28C8C]/20">
                        <div className="flex-1">
                          <h4 className="font-lato font-medium text-[#B11C5F] text-sm">
                            {item.name}
                          </h4>
                          <p className="font-cormorant text-xs text-[#C59D5F] italic">
                            Service
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <IndianRupee className="w-4 h-4 text-[#B11C5F]" />
                            <p className="font-lato font-bold text-[#444444]">
                              {item.price}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveOldItem(index)}
                          className="p-2 rounded-lg hover:bg-red-50 text-[#444444] hover:text-red-500 transition-all duration-300 group/trash">
                          <Trash2 className="w-4 h-4 group-hover/trash:scale-110 transition-transform duration-300" />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ) : (
              // Products Tab
              <div className="space-y-2">
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-8 h-8 text-[#B11C5F]" />
                    </div>
                    <h4 className="font-playfair text-[#B11C5F] font-semibold mb-2">
                      No products in cart
                    </h4>
                    <p className="font-lato text-sm text-[#444444]">
                      Add products from shop
                    </p>
                  </div>
                ) : (
                  products.map((product: any) => (
                    <div
                      key={`product-${product.id}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-all duration-300 group border border-transparent hover:border-[#F28C8C]/20">
                      <div className="flex-1">
                        <h4 className="font-lato font-medium text-[#B11C5F] text-sm">
                          {product.name}
                        </h4>
                        <p className="font-cormorant text-xs text-[#C59D5F] italic">
                          {product.brand} • Product
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <IndianRupee className="w-4 h-4 text-[#B11C5F]" />
                          <p className="font-lato font-bold text-[#444444]">
                            {product.price} x {product.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-white rounded-full border border-[#F28C8C]/30">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                product.id,
                                product.quantity - 1
                              )
                            }
                            className="p-1 rounded-full hover:bg-[#F28C8C]/10 disabled:opacity-50"
                            disabled={product.quantity <= 1}>
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-sm font-semibold min-w-[20px] text-center">
                            {product.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                product.id,
                                product.quantity + 1
                              )
                            }
                            className="p-1 rounded-full hover:bg-[#F28C8C]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={product.quantity >= (product.stock || 0)}>
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-[#444444] hover:text-red-500 transition-all duration-300 group/trash">
                          <Trash2 className="w-4 h-4 group-hover/trash:scale-110 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {((activeTab === "services" &&
            (services.length > 0 || items.length > 0)) ||
            (activeTab === "products" && products.length > 0)) && (
            <div className="border-t border-[#F28C8C]/20 p-4 bg-gradient-to-r from-[#FFF6F8] to-white rounded-b-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="font-playfair text-lg font-bold text-[#B11C5F]">
                  Total
                </span>
                <span className="flex items-center space-x-1 font-lato text-lg font-bold text-[#444444]">
                  <IndianRupee className="w-5 h-5 text-[#B11C5F]" />
                  <span>
                    {activeTab === "services"
                      ? servicesTotal + oldItemsTotal
                      : productsTotal}
                  </span>
                </span>
              </div>
              <div className="flex justify-center">
                {activeTab === "services" ? (
                  <Link
                    href="/saloon-services/slots"
                    onClick={() => setShowCart(false)}
                    className="w-40 flex items-center justify-center space-x-2 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-lato font-medium py-3 rounded-full hover:shadow-lg transform transition-all duration-300 hover:from-[#B11C5F] hover:to-[#F28C8C] group">
                    <span>Book Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                ) : (
                  <Link
                    href="/checkout"
                    onClick={() => setShowCart(false)}
                    className="w-40 flex items-center justify-center space-x-2 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-lato font-medium py-3 rounded-full hover:shadow-lg transform transition-all duration-300 hover:from-[#B11C5F] hover:to-[#F28C8C] group">
                    <span>Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
