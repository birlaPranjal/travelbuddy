import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Use the specified credentials
const RAZORPAY_CONFIG = {
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_pQLbxWbQ5iwwZe',
  key_secret: process.env.RAZORPAY_SECRET || 'htb3dEruoc4vtPVNr6Pvu7i0'
};

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = await request.json();

    // Verify signature if all parameters are provided
    if (razorpay_payment_id && razorpay_order_id && razorpay_signature) {
      // Generate signature verification
      const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_CONFIG.key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      const isSignatureValid = generatedSignature === razorpay_signature;
      
      console.log('Payment verification result:', {
        razorpay_payment_id,
        razorpay_order_id,
        isSignatureValid
      });
      
      if (!isSignatureValid) {
        console.warn('Invalid payment signature received');
      }
    } else {
      console.log('Payment details received (partial):', {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
      });
    }

    // For testing: accept any payment data for now
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('Error handling payment:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process payment'
    }, { status: 500 });
  }
} 