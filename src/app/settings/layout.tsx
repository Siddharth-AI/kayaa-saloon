import AuthGuard from "@/components/auth/AuthGuard";
import ToastContainerConfig from "@/components/ui/ToastContainerConfig";
import AccountSidebar from "./AccountSidebar"; // Make sure the path is correct

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div
        className="w-full bg-[#B11C5F] py-24 pl-11 relative"
        style={{
          backgroundImage: "url('/images/service/settings.webp')",
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundAttachment: "fixed",
          zIndex: 0,
        }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#C59D5F]/20 via-[#C59D5F]/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl pt-10 font-playfair font-bold tracking-wide text-[#B11C5F] drop-shadow-lg">
            SETTINGS
          </h1>
        </div>
      </div>
      <div className="min-h-screen bg-gradient-to-br from-[#FFF6F8] to-[#FEFAF4] text-[#444444] py-4 px-4  sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-2">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <AccountSidebar />
            </div>
            <ToastContainerConfig />
            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
