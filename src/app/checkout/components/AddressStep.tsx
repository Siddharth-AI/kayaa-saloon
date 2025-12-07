"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setSelectedBilling,
  setSelectedShipping,
} from "@/store/slices/addressSlice";
import { Plus, Edit2, Trash2, Check, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { toastSuccess, toastError } from "@/components/common/toastService";

interface AddressStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function AddressStep({ onNext, onBack }: AddressStepProps) {
  const dispatch = useAppDispatch();
  const { selectedLocationUuid } = useAppSelector((state) => state.services);
  const {
    billingAddresses,
    shippingAddresses,
    selectedBillingId,
    selectedShippingId,
  } = useAppSelector((state) => state.address);

  const [activeTab, setActiveTab] = useState<"billing" | "shipping">("billing");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [formData, setFormData] = useState({
    street_address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (selectedLocationUuid) {
      dispatch(getAddresses({ address_type: "billing", vendor_location_uuid: selectedLocationUuid }));
      dispatch(getAddresses({ address_type: "shipping", vendor_location_uuid: selectedLocationUuid }));
    }
  }, [selectedLocationUuid, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocationUuid) return;

    const payload = {
      ...formData,
      address_type: activeTab,
      vendor_location_uuid: selectedLocationUuid,
    };

    try {
      if (editingId) {
        await dispatch(updateAddress({ addressId: editingId, ...payload })).unwrap();
        toastSuccess("Address updated successfully");
      } else {
        await dispatch(createAddress(payload)).unwrap();
        toastSuccess("Address added successfully");

        if (activeTab === "billing" && sameAsShipping) {
          await dispatch(createAddress({ ...payload, address_type: "shipping" })).unwrap();
          toastSuccess("Shipping address also added");
        }
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ street_address: "", city: "", state: "", pincode: "" });
      setSameAsShipping(false);
    } catch (error: any) {
      toastError(error || "Failed to save address");
    }
  };

  const handleEdit = (address: any) => {
    setFormData({
      street_address: address.street_address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (addressId: number) => {
    if (!selectedLocationUuid) return;
    if (confirm("Are you sure you want to delete this address?")) {
      try {
        await dispatch(deleteAddress({ addressId, vendor_location_uuid: selectedLocationUuid })).unwrap();
        toastSuccess("Address deleted successfully");
      } catch (error: any) {
        toastError(error || "Failed to delete address");
      }
    }
  };

  const handleContinue = () => {
    if (!selectedBillingId || !selectedShippingId) {
      toastError("Please select both billing and shipping addresses");
      return;
    }
    onNext();
  };

  const addresses = activeTab === "billing" ? billingAddresses : shippingAddresses;
  const selectedId = activeTab === "billing" ? selectedBillingId : selectedShippingId;
  const setSelected = activeTab === "billing" ? setSelectedBilling : setSelectedShipping;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#F28C8C]/20">
        <h2 className="text-2xl font-playfair font-bold text-[#B11C5F] mb-6">
          Delivery Address
        </h2>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("billing")}
            className={`flex-1 py-3 rounded-xl font-lato font-semibold transition-all ${
              activeTab === "billing"
                ? "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            Billing Address
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`flex-1 py-3 rounded-xl font-lato font-semibold transition-all ${
              activeTab === "shipping"
                ? "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            Shipping Address
          </button>
        </div>

        {/* Address List */}
        <div className="space-y-4 mb-6">
          {addresses.map((address) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedId === address.id
                  ? "border-[#F28C8C] bg-[#FFF6F8]"
                  : "border-gray-200 hover:border-[#F28C8C]/50"
              }`}
              onClick={() => dispatch(setSelected(address.id))}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {selectedId === address.id && (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="font-lato font-semibold text-[#B11C5F]">
                      {address.address_type === "billing" ? "Billing" : "Shipping"} Address
                    </span>
                  </div>
                  <p className="text-gray-700 font-lato">{address.street_address}</p>
                  <p className="text-gray-600 font-lato">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(address);
                    }}
                    className="p-2 rounded-full hover:bg-blue-50 text-blue-500">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(address.id);
                    }}
                    className="p-2 rounded-full hover:bg-red-50 text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Address Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 border-2 border-dashed border-[#F28C8C] text-[#B11C5F] rounded-xl font-lato font-semibold hover:bg-[#FFF6F8] transition-all flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Add New {activeTab === "billing" ? "Billing" : "Shipping"} Address
          </button>
        )}

        {/* Address Form */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            onSubmit={handleSubmit}
            className="mt-6 p-6 bg-[#FFF6F8] rounded-xl border-2 border-[#F28C8C]/20">
            <h3 className="font-playfair font-bold text-[#B11C5F] mb-4">
              {editingId ? "Edit" : "Add"} {activeTab === "billing" ? "Billing" : "Shipping"} Address
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-lato font-medium text-[#B11C5F] mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.street_address}
                  onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#F28C8C]/30 focus:border-[#B11C5F] outline-none"
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
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#F28C8C]/30 focus:border-[#B11C5F] outline-none"
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
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#F28C8C]/30 focus:border-[#B11C5F] outline-none"
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
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#F28C8C]/30 focus:border-[#B11C5F] outline-none"
                  placeholder="Pincode"
                />
              </div>

              {activeTab === "billing" && !editingId && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sameAsShipping"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="sameAsShipping" className="text-sm font-lato text-gray-700">
                    Same as shipping address
                  </label>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ street_address: "", city: "", state: "", pincode: "" });
                }}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-lato font-semibold hover:bg-gray-50">
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white rounded-xl font-lato font-semibold hover:shadow-lg">
                {editingId ? "Update" : "Save"} Address
              </button>
            </div>
          </motion.form>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 border-2 border-[#F28C8C] text-[#B11C5F] rounded-xl font-lato font-semibold hover:bg-[#FFF6F8]">
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 py-3 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white rounded-xl font-lato font-bold hover:shadow-lg">
            Continue to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
