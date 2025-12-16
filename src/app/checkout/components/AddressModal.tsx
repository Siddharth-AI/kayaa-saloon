"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Loader } from "lucide-react";
import { useState } from "react";

interface AddressModalProps {
  isOpen: boolean;
  title: string;
  type: "billing" | "shipping";
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  isEditing?: boolean;
  showSameAsShipping?: boolean;
}

export default function AddressModal({
  isOpen,
  title,
  type,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  showSameAsShipping = false,
}: AddressModalProps) {
  const [formData, setFormData] = useState(
    initialData || {
      street_address: "",
      city: "",
      state: "",
      pincode: "",
    }
  );
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({ ...formData, sameAsShipping });
      setFormData({
        street_address: "",
        city: "",
        state: "",
        pincode: "",
      });
      setSameAsShipping(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 pointer-events-auto"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] p-6 flex items-center justify-between">
                <h2 className="text-xl font-playfair font-bold text-white">
                  {isEditing ? "Edit" : "Add"} {title}
                </h2>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50">
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-lato font-medium text-[#B11C5F] mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    value={formData.street_address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        street_address: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#F28C8C]/30 focus:border-[#B11C5F] outline-none disabled:opacity-50"
                    placeholder="Enter street address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-lato font-medium text-[#B11C5F] mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isLoading}
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#F28C8C]/30 focus:border-[#B11C5F] outline-none disabled:opacity-50"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-lato font-medium text-[#B11C5F] mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isLoading}
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#F28C8C]/30 focus:border-[#B11C5F] outline-none disabled:opacity-50"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-lato font-medium text-[#B11C5F] mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#F28C8C]/30 focus:border-[#B11C5F] outline-none disabled:opacity-50"
                    placeholder="Pincode"
                  />
                </div>

                {showSameAsShipping && type === "billing" && !isEditing && (
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="sameAsShipping"
                      disabled={isLoading}
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="w-4 h-4 rounded disabled:opacity-50"
                    />
                    <label
                      htmlFor="sameAsShipping"
                      className="text-sm font-lato text-gray-700">
                      Same address for shipping
                    </label>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-lato font-semibold hover:bg-gray-50 disabled:opacity-50">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white rounded-xl font-lato font-semibold hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{isEditing ? "Update" : "Save"} Address</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
