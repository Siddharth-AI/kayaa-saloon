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
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
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
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              /* Hide scrollbar for Chrome, Safari and Opera */
              *::-webkit-scrollbar {
                display: none;
              }
              
              /* Hide scrollbar for IE, Edge and Firefox */
              * {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              
              html, body {
                -ms-overflow-style: none;
                scrollbar-width: none;
                overflow-y: scroll;
              }
              
              html::-webkit-scrollbar,
              body::-webkit-scrollbar {
                display: none;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 2rem;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              
              form {
                background: white;
                border-radius: 16px;
                padding: 2.5rem;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                max-width: 500px;
                width: 100%;
                margin: 0 auto;
              }
              
              h1, h2, h3 {
                color: #1a202c;
                margin-bottom: 1.5rem;
                font-weight: 700;
                text-align: center;
              }
              
              label {
                display: block;
                font-weight: 600;
                color: #2d3748;
                margin-bottom: 0.5rem;
                font-size: 0.875rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              
              input[type="text"],
              input[type="email"],
              input[type="tel"],
              input[type="number"],
              select {
                width: 100%;
                padding: 0.875rem 1rem;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                font-size: 1rem;
                transition: all 0.2s ease;
                background: #f7fafc;
                color: #2d3748;
                font-family: inherit;
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
              
              input[type="text"]::placeholder,
              input[type="email"]::placeholder,
              input[type="tel"]::placeholder {
                color: #a0aec0;
              }
              
              select {
                cursor: pointer;
                appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232d3748' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 1rem center;
                padding-right: 2.5rem;
              }
              
              input[type="submit"],
              button[type="submit"] {
                width: 100%;
                padding: 1rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 1.5rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
              }
              
              input[type="submit"]:hover,
              button[type="submit"]:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
              }
              
              input[type="submit"]:active,
              button[type="submit"]:active {
                transform: translateY(0);
              }
              
              .form-group {
                margin-bottom: 1.5rem;
              }
              
              .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
              }
              
              a {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
                transition: color 0.2s ease;
              }
              
              a:hover {
                color: #764ba2;
                text-decoration: underline;
              }
              
              table {
                width: 100%;
                margin: 1rem 0;
                border-collapse: separate;
                border-spacing: 0;
              }
              
              td {
                padding: 0.75rem;
              }
              
              @media (max-width: 640px) {
                body {
                  padding: 1rem;
                }
                
                form {
                  padding: 1.5rem;
                }
                
                .form-row {
                  grid-template-columns: 1fr;
                }
              }
            </style>
          </head>
          <body>
            ${paymentForm}
            <script>
              // Auto-submit the form
              document.addEventListener('DOMContentLoaded', function() {
                const form = document.querySelector('form');
                if (form) {
                  // Add target to open in same iframe/window
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl mx-4 bg-white rounded-3xl shadow-2xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-pink-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  Add New Payment Card
                  <Lock className="w-5 h-5" />
                </h2>
                <p className="text-pink-100 text-sm mt-1 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Your card details are encrypted and secure
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 group"
              aria-label="Close modal">
              <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Content - Hidden Scrollbar */}
        <div className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
          {loading ? (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-pink-200 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 border-4 border-t-pink-600 border-r-purple-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-700 font-medium text-lg">
                  Loading secure payment form...
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Please wait while we prepare your secure connection
                </p>
              </div>
            </div>
          ) : paymentForm ? (
            <div className="h-full overflow-auto scrollbar-hide">
              <style jsx>{`
                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <iframe
                ref={iframeRef}
                onLoad={() => setIframeLoaded(true)}
                title="Secure Payment Form"
                className="w-full h-full border-0"
                style={{ minHeight: "600px" }}
                sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center bg-red-50 p-8 rounded-2xl border-2 border-red-200">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-red-600 font-semibold text-lg mb-2">
                  Failed to load payment form
                </p>
                <p className="text-red-500 text-sm">
                  Please close this dialog and try again
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with security badges */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span>256-bit SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-600" />
              <span>PCI DSS Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFormModal;
