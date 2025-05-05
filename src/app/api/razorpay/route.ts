import { NextRequest, NextResponse } from 'next/server';

// Use the specified credentials
const RAZORPAY_CONFIG = {
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_pQLbxWbQ5iwwZe',
  key_secret: process.env.RAZORPAY_SECRET || 'htb3dEruoc4vtPVNr6Pvu7i0'
};

// GET handler to provide Razorpay public key to the client
export async function GET() {
  try {
    // Log the key being used for debugging
    console.log('Using Razorpay key_id:', RAZORPAY_CONFIG.key_id);
    
    // Return the Razorpay key ID and other useful info
    return NextResponse.json({
      success: true,
      key: RAZORPAY_CONFIG.key_id,
      testMode: !process.env.RAZORPAY_KEY_ID || process.env.NODE_ENV !== 'production',
      instructions: "Use any card number like 4111 1111 1111 1111 with any future expiry date and any CVV"
    });
  } catch (error) {
    console.error('Error in Razorpay API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to retrieve Razorpay key' 
      },
      { status: 500 }
    );
  }
}

// POST handler to generate a fake order ID for testing
export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR', notes = {} } = await request.json();
    
    if (!amount) {
      return NextResponse.json(
        { success: false, error: 'Amount is required' },
        { status: 400 }
      );
    }
    
    // Generate a random order ID for testing
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    // Log the request for debugging
    console.log('Generating test order:', {
      amount,
      currency,
      orderId,
      notes
    });
    
    // Return a fake order response
    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        amount: Math.round(amount * 100),
        currency,
        receipt: `receipt_${Date.now()}`,
        status: "created",
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating test order:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate test order' 
      },
      { status: 500 }
    );
  }
} 