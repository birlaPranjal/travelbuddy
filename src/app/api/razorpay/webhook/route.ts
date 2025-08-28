import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Use the specified credentials
const RAZORPAY_CONFIG = {
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_pQLbxWbQ5iwwZe',
  key_secret: process.env.RAZORPAY_SECRET || 'htb3dEruoc4vtPVNr6Pvu7i0'
};

export async function POST(request: NextRequest) {
  try {
    // Get the webhook payload as text for signature verification
    const rawPayload = await request.text();
    
    // Get the Razorpay signature from headers
    const razorpaySignature = request.headers.get('x-razorpay-signature');
    
    let isSignatureValid = false;
    
    // Verify signature if provided
    if (razorpaySignature) {
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_CONFIG.key_secret)
        .update(rawPayload)
        .digest('hex');
      
      isSignatureValid = expectedSignature === razorpaySignature;
      
      console.log('Webhook signature verification:', {
        isValid: isSignatureValid,
        received: razorpaySignature.substring(0, 10) + '...',
        expected: expectedSignature.substring(0, 10) + '...'
      });
    } else {
      console.log('No webhook signature found in request');
    }
    
    // Parse the payload
    const payload = JSON.parse(rawPayload);
    
    // Log the webhook payload for debugging
    console.log('Razorpay webhook received:', payload);
    
    // Process the webhook based on event type
    const event = payload.event;
    
    if (event === 'payment.authorized') {
      // Payment was authorized
      console.log('Payment authorized:', payload.payload.payment.entity);
    } else if (event === 'payment.failed') {
      // Payment failed
      console.log('Payment failed:', payload.payload.payment.entity);
    } else if (event === 'refund.created') {
      // Refund was created
      console.log('Refund created:', payload.payload.refund.entity);
    }
    
    // Respond with success
    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      verified: isSignatureValid
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process webhook'
    }, { status: 500 });
  }
} 