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
import { toastSuccess, toastError } from "@/components/common/toastService";
import AddressModal from "./AddressModal";

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

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"billing" | "shipping">("billing");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<any>(null);

  useEffect(() => {
    if (selectedLocationUuid) {
      dispatch(getAddresses({ address_type: "billing", vendor_location_uuid: selectedLocationUuid }));
      dispatch(getAddresses({ address_type: "shipping", vendor_location_uuid: selectedLocationUuid }));
    }
  }, [selectedLocationUuid, dispatch]);

  const handleOpenModal = (type: "billing" | "shipping") => {
    setModalType(type);
    setEditingId(null);
    setEditingData(null);
    setModalOpen(true);
  };

  const handleEditAddress = (address: any, type: "billing" | "shipping") => {
    setModalType(type);
    setEditingId(address.id);
    setEditingData(address);
    setModalOpen(true);
  };

  const handleSubmitModal = async (formData: any) => {
    if (!selectedLocationUuid) return;

    const payload = {
      street_address: formData.street_address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      address_type: modalType,
      vendor_location_uuid: selectedLocationUuid,
    };

    try {
      if (editingId) {
        await dispatch(updateAddress({ addressId: editingId, ...payload })).unwrap();
        toastSuccess("Address updated successfully");
      } else {
        await dispatch(createAddress(payload)).unwrap();
        toastSuccess("Address added successfully");

        if (modalType === "billing" && formData.sameAsShipping) {
          await dispatch(
            createAddress({ ...payload, address_type: "shipping" })
          ).unwrap();
          toastSuccess("Shipping address also added");
        }
      }

      setModalOpen(false);
      setEditingId(null);
      setEditingData(null);
    } catch (error: any) {
      toastError(error || "Failed to save address");
    }
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

  const AddressSection = ({ type, title, addresses, selectedId }: any) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#F28C8C]/20 mb-6">
      <h3 className="text-xl font-playfair font-bold text-[#B11C5F] mb-4">
        {title}
      </h3>

      {/* Address List */}
      <div className="space-y-4 mb-6">
        {addresses.map((address: any) => (
          <div
            key={address.id}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              selectedId === address.id
                ? "border-[#F28C8C] bg-[#FFF6F8]"
                : "border-gray-200 hover:border-[#F28C8C]/50"
            }`}
            onClick={() =>
              dispatch(
                type === "billing"
                  ? setSelectedBilling(address.id)
                  : setSelectedShipping(address.id)
              )
            }>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {selectedId === address.id && (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="font-lato font-semibold text-[#B11C5F]">
                    {title}
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
                    handleEditAddress(address, type);
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
          </div>
        ))}
      </div>

      {/* Add Address Button */}
      <button
        onClick={() => handleOpenModal(type)}
        className="w-full py-3 border-2 border-dashed border-[#F28C8C] text-[#B11C5F] rounded-xl font-lato font-semibold hover:bg-[#FFF6F8] transition-all flex items-center justify-center gap-2">
        <Plus className="w-5 h-5" />
        Add New {title}
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-playfair font-bold text-[#B11C5F] mb-6">
        Delivery Address
      </h2>

      {/* Billing Address Section */}
      <AddressSection
        type="billing"
        title="Billing Address"
        addresses={billingAddresses}
        selectedId={selectedBillingId}
      />

      {/* Shipping Address Section */}
      <AddressSection
        type="shipping"
        title="Shipping Address"
        addresses={shippingAddresses}
        selectedId={selectedShippingId}
      />

      {/* Address Modal */}
      <AddressModal
        isOpen={modalOpen}
        title={modalType === "billing" ? "Billing Address" : "Shipping Address"}
        type={modalType}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
          setEditingData(null);
        }}
        onSubmit={handleSubmitModal}
        initialData={editingData}
        isEditing={!!editingId}
        showSameAsShipping={true}
      />

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
  );
}
