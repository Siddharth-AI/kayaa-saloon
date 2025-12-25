// components/AppWrapper.tsx

"use client";
// import Footer from "./Footer/Footer_old";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import LoginHandler from "./auth/login-handler";
import LoginModal from "./loginModal/LoginModal";

// Your Redux hooks and actions
import { useAppSelector, useAppDispatch } from "../store/hook";
import { closeModal, setModalScreen } from "../store/slices/modalSlice";
import Header from "./Navbar/navbar";
import BlissFooter from "./Footer/Footer";

// This component contains the logic that was previously in your layout
function ClientLogicWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isOpen, screen } = useAppSelector((state) => state.modal);
  const pathname = usePathname();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Use "instant" for immediate scroll, or "smooth" for smooth scroll
    });
  }, [pathname]);

  return (
    <>
      <LoginHandler />
      <Header />
      <main>{children}</main>
      <BlissFooter />

      {/* The global modal is rendered here, controlled by Redux */}
      <LoginModal
        show={isOpen}
        onClose={() => dispatch(closeModal())}
        screen={screen}
        setScreen={(newScreen) => dispatch(setModalScreen(newScreen))}
      />
    </>
  );
}

// This is the main component you will use in your layout
export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLogicWrapper>{children}</ClientLogicWrapper>;
}
