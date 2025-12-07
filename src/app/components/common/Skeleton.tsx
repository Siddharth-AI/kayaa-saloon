export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`} />
);

export const ServiceCardSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-lg overflow-hidden p-4">
    <Skeleton className="w-full h-48 mb-4 rounded-xl" />
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/2 mb-4" />
    <Skeleton className="h-10 w-full rounded-full" />
  </div>
);

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-sm shadow-lg overflow-hidden">
    <Skeleton className="w-full aspect-square" />
    <div className="p-5">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-10 w-full rounded-full" />
    </div>
  </div>
);

export const CategorySkeleton = () => (
  <div className="px-5 py-2">
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);

export const CartItemSkeleton = () => (
  <div className="p-4 border-b border-gray-100">
    <div className="flex gap-3">
      <Skeleton className="w-16 h-16 rounded-lg" />
      <div className="flex-1">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  </div>
);

export const OrderCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
    <div className="flex justify-between mb-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-6 w-20" />
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-3/4 mb-4" />
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);

export const ProfileSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-lg p-8">
    <div className="flex items-center gap-4 mb-6">
      <Skeleton className="w-20 h-20 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i}>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

export const LocationSelectorSkeleton = () => (
  <div className="flex items-center sm:space-x-2 px-2 sm:px-4 py-2 bg-gray-200 shadow-md rounded-full border border-gray-200 overflow-hidden relative">
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
    <Skeleton className="w-4 h-4 rounded-full" />
    <Skeleton className="hidden sm:block w-20 h-3" />
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
    <div className="flex flex-col lg:flex-row">
      <div className="lg:w-1/2 p-8">
        <Skeleton className="aspect-square mb-6 rounded-2xl" />
        <div className="flex gap-3 justify-center">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="w-20 h-20 rounded-xl" />)}
        </div>
      </div>
      <div className="lg:w-1/2 p-8 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-12 w-1/3" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
        </div>
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  </div>
);

export const AppointmentSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-8 w-24 rounded-full" />
    </div>
    <div className="space-y-2 mb-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);

export const AddressSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
    <div className="flex justify-between items-start mb-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

export const FullPageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#fefaf4] to-pink-50 flex items-center justify-center">
    <div className="w-full max-w-md mx-auto px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
        <Skeleton className="h-12 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-5/6 rounded-lg" />
        <div className="space-y-3 pt-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
        </div>
      </div>
    </div>
  </div>
);

export const AuthGuardSkeleton = () => (
  <div className="fixed inset-0 z-60 bg-gradient-to-br from-[#fefaf4] to-pink-50 flex items-center justify-center">
    <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#F28C8C]/20 border-t-[#F28C8C] rounded-full animate-spin" />
    </div>
  </div>
);

export const HeaderSkeleton = () => (
  <div className="w-full h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
);

export const SlotsSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
    {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
  </div>
);

export const OperatorsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-2xl shadow-lg p-4">
        <Skeleton className="w-20 h-20 rounded-full mx-auto mb-3" />
        <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-3 w-1/2 mx-auto" />
      </div>
    ))}
  </div>
);

export const BookingSummarySkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
    <Skeleton className="h-6 w-1/2" />
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex justify-between">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
    <div className="border-t pt-4">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-5 w-1/4" />
      </div>
    </div>
  </div>
);
