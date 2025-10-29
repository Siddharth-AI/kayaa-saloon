import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (isOpen && merchantUuid) {
      console.log("🔄 Fetching payment form for:", merchantUuid);
      dispatch(getPaymentForm({ merchant_uuid: merchantUuid }));
    }
  }, [isOpen, merchantUuid, dispatch]);

  useEffect(() => {
    if (paymentForm) {
      console.log("✅ Payment form received");
    }
  }, [paymentForm]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Create complete HTML document for iframe with AUTO-CLICK
  const iframeContent = paymentForm
    ? `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>Payment Form</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1.5rem;
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }
        
        form {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 550px;
          width: 100%;
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
        }
        
        input, select {
          width: 100%;
          padding: 0.875rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 16px;
          background: #f7fafc;
          color: #2d3748;
        }
        
        input:focus, select:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        input[type="submit"], button[type="submit"], button, input[type="button"] {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        input[type="submit"]:hover, button[type="submit"]:hover, button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }
        
        table {
          width: 100%;
          margin: 1rem 0;
        }
        
        td {
          padding: 0.75rem;
        }
        
        /* Loading overlay */
        .loading-overlay {
          position: fixed;
          inset: 0;
          background: rgba(102, 126, 234, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        
        .loading-text {
          color: white;
          font-size: 1.25rem;
          font-weight: 600;
          text-align: center;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 640px) {
          body { padding: 0.5rem; }
          form { padding: 1.5rem; }
          input, select { font-size: 16px; }
        }
      </style>
    </head>
    <body>
      <div id="loading-overlay" class="loading-overlay" style="display: none;">
        <div>
          <div class="spinner"></div>
          <div class="loading-text">Loading registration form...</div>
        </div>
      </div>
      
      ${paymentForm}
      
      <script>
        console.log('✅ Form loaded');
        
        // Function to auto-click the REGISTER button
        function autoClickRegister() {
          console.log('🔍 Looking for REGISTER button...');
          
          // Try multiple selectors to find the button
          const selectors = [
            'input[type="submit"][value*="REGISTER"]',
            'input[type="submit"][value*="Register"]',
            'button[type="submit"]',
            'input[type="button"][value*="REGISTER"]',
            'input[type="button"][value*="Register"]',
            'button:contains("REGISTER")',
            'input[type="submit"]',
            'button'
          ];
          
          let registerButton = null;
          
          // Try each selector
          for (const selector of selectors) {
            registerButton = document.querySelector(selector);
            if (registerButton) {
              const buttonText = registerButton.value || registerButton.textContent || '';
              if (buttonText.toUpperCase().includes('REGISTER')) {
                console.log('✅ Found REGISTER button:', buttonText);
                break;
              }
            }
          }
          
          // Also try to find by text content
          if (!registerButton) {
            const allButtons = document.querySelectorAll('button, input[type="submit"], input[type="button"]');
            for (const btn of allButtons) {
              const text = (btn.value || btn.textContent || '').toUpperCase();
              if (text.includes('REGISTER')) {
                registerButton = btn;
                console.log('✅ Found REGISTER button by text:', text);
                break;
              }
            }
          }
          
          if (registerButton) {
            console.log('🎯 Auto-clicking REGISTER button...');
            
            // Show loading overlay
            const overlay = document.getElementById('loading-overlay');
            if (overlay) {
              overlay.style.display = 'flex';
            }
            
            // Small delay to ensure everything is ready
            setTimeout(() => {
              registerButton.click();
              console.log('✅ REGISTER button clicked!');
            }, 500);
            
            return true;
          } else {
            console.warn('⚠️ REGISTER button not found');
            return false;
          }
        }
        
        // Try to auto-click when DOM is ready
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function() {
            setTimeout(autoClickRegister, 300);
          });
        } else {
          setTimeout(autoClickRegister, 300);
        }
        
        // Backup: Try again after a bit if first attempt fails
        setTimeout(function() {
          const form = document.querySelector('form');
          if (form && !form.hasAttribute('data-auto-clicked')) {
            console.log('🔄 Retrying auto-click...');
            if (autoClickRegister()) {
              form.setAttribute('data-auto-clicked', 'true');
            }
          }
        }, 1000);
      </script>
    </body>
    </html>
  `
    : "";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      style={{ height: "100vh" }}>
      <div
        className="relative w-full bg-white flex flex-col overflow-hidden sm:rounded-3xl sm:max-w-5xl sm:mx-4 sm:shadow-2xl"
        style={{ height: "100%", maxHeight: "100%" }}>
        {/* Header */}
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

        {/* Content */}
        <div
          className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-white relative"
          style={{ minHeight: 0 }}>
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
            <div className="h-full">
              <iframe
                srcDoc={iframeContent}
                title="Secure Payment Form"
                className="w-full h-full border-0"
                sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
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

        {/* Footer */}
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
