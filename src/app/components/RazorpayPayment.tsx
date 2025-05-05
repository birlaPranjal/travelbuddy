"use client";

import { FC, useEffect, useState } from 'react';
import Script from 'next/script';
import { Spinner } from './Spinner';

interface RazorpayErrorResponse {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: Record<string, unknown>;
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string; 
  razorpay_signature?: string;
}

interface RazorpayFailedResponse {
  error: RazorpayErrorResponse;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency?: string;
  name: string;
  description?: string;
  order_id?: string; // Make this optional to support direct checkout
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  handler: (response: RazorpaySuccessResponse) => void;
  theme?: {
    color?: string;
  };
  readonly?: boolean;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (response: RazorpayFailedResponse) => void) => void;
}

interface RazorpayClass {
  new(options: RazorpayOptions): RazorpayInstance;
}

interface RazorpayPaymentProps {
  amount: number;
  name: string;
  description?: string;
  buttonText?: string;
  onSuccess: (paymentId: string, orderId: string, signature: string) => void;
  onError?: (error: RazorpayErrorResponse | Error) => void;
  disabled?: boolean;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
}

// Define a more specific type for debug info
type DebugInfo = Record<string, unknown>;

export const RazorpayPayment: FC<RazorpayPaymentProps> = ({
  amount,
  name,
  description,
  buttonText = "Pay Now",
  onSuccess,
  onError,
  disabled = false,
  prefill,
  notes,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});

  // Check if Razorpay script is loaded
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log("Checking Razorpay availability:", 'Razorpay' in window);
      setDebugInfo(prev => ({ ...prev, razorpayInWindow: 'Razorpay' in window }));
      
      if ('Razorpay' in window) {
        setScriptLoaded(true);
        setLoading(false);
      }
    }
  }, []);

  const handlePayment = () => {
    if (typeof window === 'undefined' || !('Razorpay' in window) || !scriptLoaded) {
      console.error('Razorpay script not loaded yet');
      if (onError) {
        onError(new Error('Razorpay not initialized. Please try again.'));
      }
      return;
    }

    try {
      setIsProcessing(true);
      
      // Amount needs to be in paise (multiply by 100)
      const amountInPaise = Math.round(amount * 100);
      
      // Use direct checkout without an order ID
      const options: RazorpayOptions = {
        key: 'rzp_test_pQLbxWbQ5iwwZe', // Use the direct key ID
        amount: amountInPaise,
        currency: 'INR',
        name,
        description: description || `Payment for ${name}`,
        prefill: prefill || {},
        notes: notes || {},
        theme: {
          color: '#3399cc',
        },
        handler: function(response: RazorpaySuccessResponse) {
          try {
            setIsProcessing(false);
            
            // Call onSuccess callback with payment details
            const paymentId = response.razorpay_payment_id;
            const returnedOrderId = response.razorpay_order_id || `order_${Date.now()}`;
            const signature = response.razorpay_signature || 'direct_checkout';
            
            // Log the payment details
            console.log('Payment successful:', {
              paymentId,
              orderId: returnedOrderId,
              signature
            });
            
            // Call the success callback
            onSuccess(paymentId, returnedOrderId, signature);
          } catch (error) {
            console.error('Payment handler error:', error);
            if (onError) onError(error instanceof Error ? error : new Error(String(error)));
          }
        },
      };

      // Cast window.Razorpay to the appropriate type
      const RazorpayConstructor = window.Razorpay as RazorpayClass;
      const razorpay = new RazorpayConstructor(options);
      
      razorpay.on('payment.failed', function(response: RazorpayFailedResponse) {
        console.error('Payment failed:', response.error);
        setIsProcessing(false);
        if (onError) onError(response.error);
      });

      razorpay.open();
    } catch (error) {
      console.error('Error initializing Razorpay:', error);
      setIsProcessing(false);
      if (onError) {
        onError(error instanceof Error ? error : new Error('Failed to initialize payment'));
      }
    }
  };

  const isButtonDisabled = loading || disabled || !scriptLoaded || isProcessing;

  return (
    <div className="w-full">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => {
          console.log('Razorpay script loaded successfully');
          setScriptLoaded(true);
          setLoading(false);
        }}
        onError={(e) => {
          console.error('Failed to load Razorpay script', e);
          setLoading(false);
          if (onError) onError(new Error('Failed to load payment interface'));
        }}
      />
      
      <button
        type="button"
        onClick={handlePayment}
        disabled={isButtonDisabled}
        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed w-full"
      >
        {isProcessing || loading ? (
          <>
            <Spinner size="sm" className="mr-2" />
            {isProcessing ? "Processing..." : "Preparing..."}
          </>
        ) : (
          buttonText
        )}
      </button>
      
      {process.env.NODE_ENV !== 'production' && (
        <details className="mt-4 text-xs border border-gray-200 p-2 rounded-md">
          <summary className="cursor-pointer text-gray-500">Debug Information</summary>
          <pre className="mt-2 bg-gray-100 p-2 overflow-auto max-h-40 rounded">
            {JSON.stringify({
              state: {
                loading,
                scriptLoaded,
                isProcessing
              },
              ...debugInfo
            }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

// Add Window interface extension for Razorpay
declare global {
  interface Window {
    Razorpay: RazorpayClass;
  }
} 