import React, { useEffect, useRef, useState } from "react";
import { X, CreditCard, Shield, Lock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getPaymentForm } from "@/store/slices/paymentSlice";

interface PaymentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchantUuid: string;
}

const PaymentFormModal: React.FC<PaymentFormModalProps> = ({
  isOpen,
  onClose,
  merchantUuid,
}) => {
  const dispatch = useAppDispatch();
  const { paymentForm, loading } = useAppSelector((state) => state.payment);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && merchantUuid) {
      dispatch(getPaymentForm({ merchant_uuid: merchantUuid }));
      setIframeLoaded(false);
    }
  }, [isOpen, merchantUuid, dispatch]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  // Auto-submit the form inside iframe with enhanced styling
  useEffect(() => {
    if (paymentForm && iframeRef.current && iframeLoaded) {
      const iframeDoc =
        iframeRef.current.contentDocument ||
        iframeRef.current.contentWindow?.document;

      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
            <meta name="mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                -webkit-tap-highlight-color: transparent;
              }
              
              *::-webkit-scrollbar {
                display: none;
              }
              
              * {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              
              html {
                height: 100%;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 0.5rem;
                min-height: 100vh;
                display: flex;
                align-items: flex-start;
                justify-content: center;
                padding-top: 1rem;
                padding-bottom: 2rem;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              
              form {
                background: white;
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                max-width: 500px;
                width: 100%;
                margin: 0 auto;
              }
              
              h1, h2, h3 {
                color: #1a202c;
                margin-bottom: 1rem;
                font-weight: 700;
                text-align: center;
                font-size: 1.25rem;
              }
              
              label {
                display: block;
                font-weight: 600;
                color: #2d3748;
                margin-bottom: 0.4rem;
                font-size: 0.8rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              
              input[type="text"],
              input[type="email"],
              input[type="tel"],
              input[type="number"],
              select {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                font-size: 16px;
                transition: all 0.2s ease;
                background: #f7fafc;
                color: #2d3748;
                font-family: inherit;
                -webkit-appearance: none;
                appearance: none;
              }
              
              input[type="text"]:focus,
              input[type="email"]:focus,
              input[type="tel"]:focus,
              input[type="number"]:focus,
              select:focus {
                outline: none;
                border-color: #667eea;
                background: white;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
              }
              
              select {
                cursor: pointer;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232d3748' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 0.75rem center;
                padding-right: 2rem;
              }
              
              input[type="submit"],
              button[type="submit"] {
                width: 100%;
                padding: 0.875rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 1rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                -webkit-appearance: none;
                appearance: none;
              }
              
              input[type="submit"]:active,
              button[type="submit"]:active {
                transform: scale(0.98);
              }
              
              .form-group {
                margin-bottom: 1rem;
              }
              
              .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.75rem;
              }
              
              table {
                width: 100%;
                margin: 0.5rem 0;
              }
              
              td {
                padding: 0.5rem;
              }
              
              @media (max-height: 667px) {
                body {
                  padding: 0.25rem;
                  padding-top: 0.5rem;
                  padding-bottom: 1rem;
                }
                
                form {
                  padding: 1rem;
                  border-radius: 8px;
                }
                
                h1, h2, h3 {
                  font-size: 1.1rem;
                  margin-bottom: 0.75rem;
                }
                
                .form-group {
                  margin-bottom: 0.75rem;
                }
                
                label {
                  font-size: 0.75rem;
                  margin-bottom: 0.3rem;
                }
                
                input[type="text"],
                input[type="email"],
                input[type="tel"],
                input[type="number"],
                select {
                  padding: 0.625rem;
                }
                
                input[type="submit"],
                button[type="submit"] {
                  padding: 0.75rem;
                  font-size: 0.9rem;
                }
              }
            </style>
          </head>
          <body>
            ${paymentForm}
            <script>
              document.addEventListener('DOMContentLoaded', function() {
                const form = document.querySelector('form');
                if (form) {
                  form.target = '_self';
                  form.submit();
                }
              });
            </script>
          </body>
          </html>
        `);
        iframeDoc.close();
      }
    }
  }, [paymentForm, iframeLoaded]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      style={{
        height: "100dvh", // Dynamic viewport height for mobile browsers
      }}>
      <div
        className="sm:rounded-3xl sm:max-w-xl sm:mx-4 sm:shadow-2xl relative w-full bg-white flex flex-col overflow-hidden"
        style={{
          height: "100%",

          borderRadius: 0,
        }}>
        {/* Compact Header for Small Screens */}
        <div className="relative bg-gradient-to-r from-pink-600 to-purple-600 p-3 sm:p-6 flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm flex-shrink-0">
                <CreditCard className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-2xl font-bold text-white flex items-center gap-1 sm:gap-2 truncate">
                  <span className="truncate">Add Payment Card</span>
                  <Lock className="w-3 h-3 sm:w-5 sm:h-5 flex-shrink-0" />
                </h2>
                <p className="text-pink-100 text-xs hidden sm:flex items-center gap-2 mt-1">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  Your card details are encrypted and secure
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 group flex-shrink-0"
              aria-label="Close modal">
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Content with Dynamic Height */}
        <div
          className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-white relative"
          style={{
            minHeight: 0, // Important for flex child
          }}>
          {loading ? (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center">
                <div className="relative w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-6">
                  <div className="absolute inset-0 border-4 border-pink-200 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 border-4 border-t-pink-600 border-r-purple-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-700 font-medium text-sm sm:text-lg">
                  Loading secure form...
                </p>
              </div>
            </div>
          ) : paymentForm ? (
            <div
              className="h-full overflow-auto"
              style={{ WebkitOverflowScrolling: "touch" }}>
              <iframe
                ref={iframeRef}
                onLoad={() => setIframeLoaded(true)}
                title="Secure Payment Form"
                className="w-full h-full border-0"
                style={{
                  minHeight: "100%",
                }}
                sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation allow-top-navigation-by-user-activation"
                allow="payment"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center bg-red-50 p-4 sm:p-8 rounded-2xl border-2 border-red-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <X className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                </div>
                <p className="text-red-600 font-semibold text-sm sm:text-lg mb-2">
                  Failed to load form
                </p>
                <p className="text-red-500 text-xs sm:text-sm">
                  Please try again
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Compact Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-3 sm:px-6 py-2 sm:py-4 flex-shrink-0">
          <div className="flex items-center justify-center gap-3 sm:gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-1 sm:gap-2">
              <Shield className="w-3 h-3 text-green-600 flex-shrink-0" />
              <span className="text-xs">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Lock className="w-3 h-3 text-green-600 flex-shrink-0" />
              <span className="text-xs">PCI Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFormModal;
